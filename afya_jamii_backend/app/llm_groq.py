import os
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class AfyaJamiiLLM:
    def __init__(self):
        self.llm = None
        self.chain = None
        self.initialize_llm()
    
    def initialize_llm(self):
        """Initialize Groq LLM with configuration from settings"""
        try:
            if not settings.GROQ_API_KEY or settings.GROQ_API_KEY == "your-groq-api-key-here":
                logger.error("GROQ_API_KEY not configured")
                return
            
            self.llm = ChatGroq(
                model=settings.LLM_MODEL_NAME,
                temperature=settings.LLM_TEMPERATURE,
                api_key=settings.GROQ_API_KEY
            )
            
            # Create prompt template
            template = """
You are Afya Jamii AI, a clinical decision-support and maternal nutrition assistant for Kenyan pregnant and postnatal mothers and general users seeking nutrition advice.
This is the context for the current conversation:
{context}

This is the conversation history:
{history}

Based on the context and history, answer the following question:
Question: {question}

Guidelines for response:
- Only introduce yourself as "Afya Jamii AI" at the start of the session only or incase asked.
- If patient data is available in the context or history, base your reasoning on it.
- Provide actionable, evidence-based recommendations tailored for Kenyan healthcare context.
- Include specific Kenyan food examples for nutrition advice.
- Keep responses clear, structured, and medically accurate.
- Do not mention the underlying ML model unless asked.
- Respond in English or Swahili based on the user's preference or how they kick-off the conversation. 
- Be interactive and empathetic in your responses and avoid sounding robotic.
- If uncertain about a medical question, advise consulting a qualified healthcare professional.
- Incase someone asks for emergency help, advise them to contact local emergency services immediately through the following numbers.
- Kindly ensure you first ask for their location to provide accurate contact and if the location(county) they provide is not provided in the emergency contact list,
provide the general national emergency contacts.
National & Nationwide Ambulance Contacts:

# Emergency Ambulance & Medical Response Contacts – Kenya

## National Emergency Services (Countrywide)

**Public Emergency Numbers**  
- **999**, **112**, **911**  
Toll-free national emergency lines for police, fire, and ambulance services. Coverage is strongest in major cities.

**Kenya Red Cross – Emergency Plus (E-Plus)**  
Type: Ground ambulance  
Coverage: Nationwide (all 47 counties)  
Contacts: **1199 (toll-free)**, **0700 395 395**, **0738 395 395**  
Availability: 24/7  
Fleet: 100+ ambulances

**St. John Ambulance Kenya**  
Type: Ground ambulance  
Coverage: Nationwide  
Contact: **0721 225 285**  
Availability: 24/7

**AMREF Flying Doctors**  
Type: Air ambulance and medical evacuation  
Coverage: Regional  
Contact: **0722 207 350**  
Availability: 24/7

**Flare Emergency Response**  
Type: Multi-provider emergency dispatch platform  
Contact: **0714 911 911**

---

## County-Level Emergency Contacts

### Nairobi County
County Ambulance Dispatch: **1508**  
Public Hospital: Kenyatta National Hospital – **+254 20 2726300**  
Private Hospitals:  
- The Nairobi Hospital – **0702 200200**  
- Mater Hospital – **0719 073000 / 0732 163000**  
- MP Shah Hospital – **0722 204427 / 0733 606113**  
- Gertrude’s Children’s Hospital – **0730 644000 / 0709 529000**  
Notes: Use county dispatch first; fallback to Red Cross or St. John if unavailable.

### Mombasa County
County Ambulance Dispatch: **0788 959626**  
Public Hospital: Coast General Teaching & Referral Hospital – **0724 249443**  
Private Hospitals:  
- Aga Khan Hospital Mombasa – **0714 524948**  
- Premier Hospital Nyali – **0714 400099**

### Kisumu County
County Emergency Operations Centre: **0800 720575 / 0797 067459**  
Public Hospital: Jaramogi O. O. Teaching & Referral Hospital – **057 202 3681**  
Private Hospital: Aga Khan Hospital Kisumu – **0722 203622 / 0733 637566**

### Nakuru County
County Emergency Line: **0800 724138**  
Public Hospital: Nakuru Level 5 Hospital – **051 2212145**  
Private Hospitals:  
- Mediheal Hospital Nakuru – **0709 907000**  
- Nairobi Women’s Hospital Nakuru – **0707 957840**

### Kiambu County
County Ambulance Dispatch: **0700 820227**  
Public Hospital: Thika Level 5 Hospital – **067 22221**  
Private Hospitals:  
- Avenue Hospital Thika – **0711 060800**  
- AIC Kijabe Hospital – **0758 720 044**

---

## Counties Without Dedicated EMS Hotlines

Marsabit, Lamu, Tana River, West Pokot, Busia, Siaya, Homa Bay

For these counties, use:  
- **999 or 112**  
- **Kenya Red Cross – 1199**  
- **St. John Ambulance – 0721 225 285**

"""

            self.prompt = PromptTemplate(
                input_variables=["context", "history", "question"],
                template=template
            )
            
            # Create chain
            self.chain = LLMChain(
                llm=self.llm,
                prompt=self.prompt,
                verbose=settings.DEBUG
            )
            
            logger.info("Groq LLM initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize LLM: {e}")
            self.llm = None
    
    def generate_advice(self, prompt_data: dict) -> str:
        """Generate clinical advice using Groq LLM"""
        if not self.chain:
            return "LLM service temporarily unavailable. Please try again later."
        
        try:
            response = self.chain.run(**prompt_data)
            return response
        except Exception as e:
            logger.error(f"LLM generation error: {e}")
            return f"Error generating advice: {str(e)}"

# Global LLM instance
afya_llm = AfyaJamiiLLM()

def initialize_llm_service():
    """Initialize LLM service on application startup"""
    return afya_llm.llm is not None