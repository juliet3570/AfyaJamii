import os
import logging
from contextlib import contextmanager
from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.pool import QueuePool
from sqlalchemy import text

# Load settings
from app.config import settings

# ───────────────────────────
# LOGGER
# ───────────────────────────
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Debug DB URL/port
print(f"Effective DATABASE_URL: {settings.DATABASE_URL}")
print(f"Effective DATABASE_PORT: {settings.DATABASE_PORT}")

# ───────────────────────────
# ENGINE (MySQL + pooling)
# ───────────────────────────
engine = create_engine(
    settings.DATABASE_URL,
    poolclass=QueuePool,
    pool_size=settings.DB_POOL_SIZE,
    max_overflow=settings.DB_MAX_OVERFLOW,
    pool_recycle=settings.DB_POOL_RECYCLE,
    echo=settings.DB_ECHO,
    connect_args={
        "charset": "utf8mb4",
        "autocommit": False,  # let SQLAlchemy manage transactions
    },
)

# ───────────────────────────
# CREATE DB + TABLES
# ───────────────────────────
def create_db_and_tables():
    """Create all tables and ensure key text columns are LONGTEXT (MySQL)."""
    try:
        SQLModel.metadata.create_all(engine)
        logger.info("Database tables created successfully.")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
        raise

    # Ensure large text columns are LONGTEXT (MySQL)
    try:
        if settings.DATABASE_URL.startswith("mysql"):
            with engine.connect() as conn:
                for table, column in [
                    ("conversation_history", "ai_response"),
                    ("vitals_records", "ml_feature_importances"),
                ]:
                    logger.info(f"Ensuring {table}.{column} is LONGTEXT")
                    conn.execute(text(f"ALTER TABLE {table} MODIFY {column} LONGTEXT"))
                conn.commit()
    except Exception as e:
        logger.warning(f"Could not alter columns to LONGTEXT: {e}")

# ───────────────────────────
# SESSION HANDLERS
# ───────────────────────────
def get_session():
    """FastAPI dependency to get DB session."""
    with Session(engine) as session:
        try:
            yield session
        except Exception as e:
            session.rollback()
            logger.error(f"Database session error: {e}")
            raise
        finally:
            session.close()

@contextmanager
def get_db_session():
    """Context manager for DB sessions outside FastAPI dependencies."""
    session = Session(engine)
    try:
        yield session
        session.commit()
    except Exception as e:
        session.rollback()
        logger.error(f"Database transaction error: {e}")
        raise
    finally:
        session.close()

# ───────────────────────────
# HEALTH + STATS
# ───────────────────────────
def test_database_connection() -> bool:
    """Simple connection test."""
    try:
        with Session(engine) as session:
            session.execute(text("SELECT 1"))
        logger.info("Database connection test successful.")
        return True
    except Exception as e:
        logger.error(f"Database connection test failed: {e}")
        return False

def get_database_stats():
    """Return connection pool + MySQL status info."""
    try:
        with engine.connect() as conn:
            threads_connected = conn.execute(
                text("SHOW STATUS LIKE 'Threads_connected'")
            ).fetchone()
            processes = conn.execute(text("SHOW PROCESSLIST")).fetchall()
            return {
                "pool_size": engine.pool.size(),
                "checked_out": engine.pool.checkedout(),
                "threads_connected": threads_connected[1] if threads_connected else 0,
                "active_processes": len(processes),
            }
    except Exception as e:
        logger.error(f"Error getting database stats: {e}")
        return {}

def check_database_health():
    """Comprehensive health check: connection + table existence + pool stats."""
    status = {"status": "healthy", "details": {}}
    try:
        if not test_database_connection():
            status["status"] = "unhealthy"
            status["details"]["connection"] = "failed"
            return status

        with Session(engine) as session:
            tables_to_check = ["users", "vitals_records", "conversation_history"]
            for table in tables_to_check:
                try:
                    session.execute(text(f"SELECT 1 FROM {table} LIMIT 1"))
                    status["details"][f"table_{table}"] = "exists"
                except Exception:
                    status["details"][f"table_{table}"] = "missing"
                    status["status"] = "degraded"

        pool_stats = get_database_stats()
        status["details"]["pool_stats"] = pool_stats

        # Detect long-running queries (>60s)
        with Session(engine) as session:
            result = session.execute(
                text(
                    "SELECT COUNT(*) "
                    "FROM information_schema.processlist "
                    "WHERE TIME > 60 AND COMMAND != 'Sleep'"
                )
            )
            long_running = result.scalar()
            if long_running > 0:
                status["details"]["long_running_queries"] = long_running
                status["status"] = "degraded"

    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        status["status"] = "unhealthy"
        status["error"] = str(e)

    return status

# ───────────────────────────
# MAINTENANCE + BACKUP
# ───────────────────────────
def optimize_database():
    """Run OPTIMIZE TABLE on key tables (MySQL equivalent of VACUUM)."""
    try:
        with Session(engine) as session:
            for table in ["users", "vitals_records", "conversation_history"]:
                session.execute(text(f"OPTIMIZE TABLE {table}"))
            session.commit()
        logger.info("Database optimization completed successfully.")
        return True
    except Exception as e:
        logger.error(f"Database optimization failed: {e}")
        return False

def backup_database(backup_path: str = "/backups"):
    """Placeholder for DB backup logic."""
    try:
        logger.info(f"Database backup initiated to {backup_path}")
        # implement mysqldump or your backup method here
        return True
    except Exception as e:
        logger.error(f"Database backup failed: {e}")
        return False

# ───────────────────────────
# OPTIONAL: ASYNC SUPPORT
# ───────────────────────────
try:
    from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
    from sqlalchemy.orm import sessionmaker

    async_engine = create_async_engine(
        settings.DATABASE_URL.replace("mysql+pymysql", "mysql+aiomysql"),
        echo=settings.DB_ECHO,
        poolclass=QueuePool,
        pool_size=settings.DB_POOL_SIZE,
        max_overflow=settings.DB_MAX_OVERFLOW,
    )

    AsyncSessionLocal = sessionmaker(
        bind=async_engine, class_=AsyncSession, expire_on_commit=False
    )

    async def get_async_session():
        async with AsyncSessionLocal() as session:
            try:
                yield session
            except Exception as e:
                await session.rollback()
                logger.error(f"Async database session error: {e}")
                raise
            finally:
                await session.close()

except ImportError:
    logger.warning("Async database dependencies not available. Async features disabled.")

    async def get_async_session():
        raise NotImplementedError("Async database sessions not configured.")