
from datetime import datetime
from typing import List
import json
import logging
import time

from fastapi import (
    FastAPI, Depends, HTTPException, status, BackgroundTasks, Request
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse

from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from sqlmodel import Session, select

from app.config import settings
from app.auth import (
    get_current_active_user, authenticate_user,
    create_access_token, get_password_hash
)
from app.ml_model import risk_model, initialize_model
from app.llm_groq import afya_llm, initialize_llm_service
from app.database import get_session, create_db_and_tables
from app.models import (
    UserDB, VitalsRecord, ConversationHistory,
    UserResponse, UserCreate, UserLogin, VitalsSubmission, CombinedResponse,
    MLModelOutput, LLMAdviceRequest, LLMAdviceResponse, Token
)

# ────────────── LOGGING ──────────────
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL, "INFO"),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("app.main")

# ────────────── RATE LIMITER ─────────
limiter = Limiter(key_func=get_remote_address)

# ────────────── FASTAPI APP ─────────
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Afya Jamii AI - Clinical Decision Support System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)
app.state.limiter = limiter

# ────────────── MIDDLEWARES ─────────
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"] if settings.DEBUG else ["127.0.0.1"]
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers.update({
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
    })
    if not settings.DEBUG and getattr(settings, "CSP_DIRECTIVES", None):
        response.headers["Content-Security-Policy"] = settings.CSP_DIRECTIVES
    return response

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    try:
        response = await call_next(request)
    except Exception:
        logger.exception(f"Unhandled exception {request.method} {request.url.path}")
        raise
    duration = time.time() - start
    logger.info(f"{request.method} {request.url.path} -> {response.status_code} ({duration:.3f}s) from {request.client.host}")
    return response

# ────────────── EXCEPTION HANDLERS ─────────
@app.exception_handler(RateLimitExceeded)
def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(status_code=429, content={"detail": "Rate limit exceeded. Try again later."})

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.warning(f"HTTPException for {request.method} {request.url.path}: {exc.detail}")
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled exception for {request.method} {request.url.path}")
    return JSONResponse(status_code=500, content={"detail": "Internal server error — check server logs for details."})

# ────────────── STARTUP ──────────────
@app.on_event("startup")
def startup_event():
    logger.info("Starting Afya Jamii AI startup sequence...")
    try:
        create_db_and_tables()
        logger.info("Database tables created/verified.")
    except Exception:
        logger.exception("Database initialization failed")
        raise RuntimeError("Database initialization failed")

    try:
        if not initialize_model():
            raise RuntimeError("initialize_model returned falsy")
        logger.info("ML model loaded.")
    except Exception:
        logger.exception("ML model initialization failed")
        raise RuntimeError("ML model init failed")

    try:
        if initialize_llm_service():
            logger.info("LLM service initialized.")
        else:
            logger.warning("LLM initialization returned falsy — running reduced LLM mode")
    except Exception:
        logger.exception("LLM initialization raised exception; continuing in limited mode")
    logger.info("Afya Jamii startup complete.")

# ────────────── HELPERS ──────────────
def safe_json(obj):
    """Convert numpy objects to native python types for JSON."""
    try:
        return json.loads(json.dumps(obj, default=lambda x: x.tolist() if hasattr(x, "tolist") else str(x)))
    except Exception:
        return obj

# ────────────── ENDPOINTS ──────────────
@app.get("/", include_in_schema=False)
async def root():
    return {"message": "Afya Jamii AI API is running", "status": "healthy"}

@app.get("/health")
@limiter.limit(f"{settings.RATE_LIMIT_PER_MINUTE}/minute")
async def health_check(request: Request):
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0",
        "services": {
            "database": "connected",
            "ml_model": bool(getattr(risk_model, "model", None)),
            "llm_service": bool(getattr(afya_llm, "llm", None))
        }
    }

# ------------ Auth ------------
@app.post("/api/v1/auth/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("10/minute")
async def signup(request: Request, user_data: UserCreate, session: Session = Depends(get_session)):
    existing = session.exec(
        select(UserDB).where((UserDB.username == user_data.username) | (UserDB.email == user_data.email))
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username or email already registered")

    hashed_pw = get_password_hash(user_data.password)
    db_user = UserDB(**user_data.dict(exclude={"password"}), hashed_password=hashed_pw)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    logger.info("New user created: %s", db_user.username)
    return db_user

@app.post("/api/v1/auth/login", response_model=Token)
@limiter.limit("5/minute")
async def login(request: Request, login_data: UserLogin, session: Session = Depends(get_session)):
    user = authenticate_user(session, login_data.username, login_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    token = create_access_token(data={"sub": user.username})
    logger.info("User logged in: %s", user.username)
    return Token(access_token=token, token_type="bearer",
                 expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60)

# ------------ Vitals submission ------------
@app.post("/api/v1/vitals/submit", response_model=CombinedResponse)
async def submit_vitals(
    request: Request,
    submission: VitalsSubmission,
    background_tasks: BackgroundTasks,
    current_user: UserDB = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    features = {
        "Age": submission.vitals.age,
        "SystolicBP": submission.vitals.systolic_bp,
        "DiastolicBP": submission.vitals.diastolic_bp,
        "BS": submission.vitals.bs,
        "BodyTemp": submission.vitals.body_temp,
        "HeartRate": submission.vitals.heart_rate,
    }

    try:
        risk_label, prob, feat_imp = risk_model.predict(features)

        vitals_record = VitalsRecord(
            user_id=current_user.id,
            **submission.vitals.dict(),
            ml_risk_label=str(risk_label),
            ml_probability=float(prob),
            ml_feature_importances=json.dumps(safe_json(feat_imp))
        )
        session.add(vitals_record)
        session.commit()
        session.refresh(vitals_record)

        ml_output = MLModelOutput(
            risk_label=str(risk_label),
            probability=float(prob),
            feature_importances=safe_json(feat_imp)
        )

        context = f"""The user has just submitted their vitals.
Patient Data:
- Age: {submission.vitals.age} years
- Blood Pressure: {submission.vitals.systolic_bp}/{submission.vitals.diastolic_bp} mmHg
- Blood Sugar: {submission.vitals.bs} mmol/L
- Body Temperature: {submission.vitals.body_temp}°{submission.vitals.body_temp_unit}
- Heart Rate: {submission.vitals.heart_rate} bpm
- Account Type: {submission.account_type.value}
- Model Prediction: {str(risk_label)} (Probability: {float(prob):.2f})
- Feature Importances: {safe_json(feat_imp)}
- Patient History: {submission.vitals.patient_history or "No history"}
"""
        llm_prompt_data = {
            "context": context,
            "history": "", # No history on the first turn
            "question": "Provide initial risk assessment and recommendations based on the vitals data."
        }

        try:
            advice = afya_llm.generate_advice(llm_prompt_data)
        except Exception:
            logger.exception("LLM generate_advice failed - continuing without LLM")
            advice = "LLM currently unavailable; please consult a clinician."

        llm_advice = LLMAdviceResponse(advice=advice, timestamp=datetime.utcnow())

        convo = ConversationHistory(
            user_id=current_user.id,
            vitals_record_id=vitals_record.id,
            user_message="Initial assessment request",
            ai_response=advice
        )
        session.add(convo)
        session.commit()

        return CombinedResponse(
            user_id=current_user.id,
            submission_id=vitals_record.id,
            timestamp=datetime.utcnow(),
            ml_output=ml_output,
            llm_advice=llm_advice
        )
    except Exception:
        logger.exception("Vitals submission failed")
        raise HTTPException(status_code=500, detail="Vitals submission failed - see server logs")

# ------------ LLM Chat Endpoint ------------
@app.post("/api/v1/chat/advice", response_model=LLMAdviceResponse)
async def get_llm_advice(
    request: Request,
    advice_request: LLMAdviceRequest,
    current_user: UserDB = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """Let user ask follow-up questions."""
    # Fetch conversation history
    history_records = session.exec(
        select(ConversationHistory)
        .where(ConversationHistory.user_id == current_user.id)
        .order_by(ConversationHistory.created_at.asc())
    ).all()

    # Format history for the prompt
    history = "\n".join(
        [f"User: {rec.user_message}\nAI: {rec.ai_response}" for rec in history_records]
    )

    llm_prompt_data = {
        "context": "The user is asking a follow-up question.",
        "history": history,
        "question": advice_request.question
    }

    try:
        advice = afya_llm.generate_advice(llm_prompt_data)
    except Exception:
        logger.exception("LLM advice retrieval failed - continuing without LLM")
        advice = "LLM currently unavailable; please consult a clinician."

    # Get the latest vitals record to associate the conversation
    latest_vitals = session.exec(
        select(VitalsRecord).where(VitalsRecord.user_id == current_user.id)
        .order_by(VitalsRecord.created_at.desc()).limit(1)
    ).first()

    convo = ConversationHistory(
        user_id=current_user.id,
        vitals_record_id=latest_vitals.id if latest_vitals else None,
        user_message=advice_request.question,
        ai_response=advice
    )
    session.add(convo)
    session.commit()

    return LLMAdviceResponse(advice=advice, timestamp=datetime.utcnow())

# ------------ History ------------
@app.get("/api/v1/history/vitals", response_model=List[VitalsRecord])
async def get_vitals_history(request: Request, limit: int = 10,
                             current_user: UserDB = Depends(get_current_active_user),
                             session: Session = Depends(get_session)):
    records = session.exec(
        select(VitalsRecord).where(VitalsRecord.user_id == current_user.id)
        .order_by(VitalsRecord.created_at.desc()).limit(limit)
    ).all()
    return records

@app.get("/api/v1/history/conversations", response_model=List[ConversationHistory])
async def get_conversation_history(request: Request, limit: int = 20,
                                   current_user: UserDB = Depends(get_current_active_user),
                                   session: Session = Depends(get_session)):
    convos = session.exec(
        select(ConversationHistory).where(ConversationHistory.user_id == current_user.id)
        .order_by(ConversationHistory.created_at.desc()).limit(limit)
    ).all()
    return convos