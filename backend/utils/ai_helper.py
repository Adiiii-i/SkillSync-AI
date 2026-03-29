import os
import json
import logging
import re
import asyncio
from openai import OpenAI
from dotenv import load_dotenv
from functools import partial

# Load env vars
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

NV_KEY = os.getenv("NVIDIA_API_KEY", "")
MAX_RESUME_CHARS = 3000  # e2b safe limit

def truncate_resume(text: str) -> str:
    """The e2b (2 billion parameter) model has a small context window.
    Truncate before sending to API."""
    if not text:
        return ""
    if len(text) <= MAX_RESUME_CHARS:
        return text
    
    logger.warning("Resume truncated for e2b model context limit")
    return text[:MAX_RESUME_CHARS] + "\n[Resume truncated for analysis]"

async def call_ai_with_retry(prompt, model="google/gemma-2-2b-it"):
    """
    Asynchronously calls NVIDIA API with strict settings.
    """
    if not NV_KEY:
        raise ValueError("NVIDIA_API_KEY is not set.")
    
    try:
        client = OpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=NV_KEY
        )
        
        # Strict settings for JSON output
        func = partial(client.chat.completions.create,
            model=model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,      
            top_p=0.1,          
            max_tokens=2048,    
        )
        
        loop = asyncio.get_event_loop()
        res = await loop.run_in_executor(None, func)
        
        raw_text = res.choices[0].message.content or ""
        return raw_text
        
    except Exception as e:
        logger.error(f"NVIDIA API Error: {str(e)}")
        raise e

def safe_parse_gemma_json(raw_text: str):
    """
    Advanced Gemma JSON sanitizer: strips markdown fences, conversational
    preamble/postamble, and fixes common edge case formatting.
    """
    try:
        cleaned = raw_text.strip() if raw_text else ""
        
        # Log for debugging
        logger.info(f"DEBUG: Raw Gemma Response Header: {cleaned[:100]}...")

        # Step 1: Remove ALL markdown code fences
        cleaned = re.sub(r'```json\s*', '', cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r'```\s*', '', cleaned, flags=re.IGNORECASE)
        cleaned = cleaned.strip()

        # Step 2: Remove conversational preamble
        preambles = [
            r'^sure[!,.]?\s*',
            r'^here is.*?:\s*',
            r'^here\'s.*?:\s*',
            r'^certainly[!,.]?\s*',
            r'^of course[!,.]?\s*',
            r'^absolutely[!,.]?\s*'
        ]
        for pattern in preambles:
            cleaned = re.sub(pattern, '', cleaned, flags=re.IGNORECASE)

        # Step 3: Remove postamble
        postambles = [
            r'i hope this helps[!.]?\s*$',
            r'let me know if you need.*$',
            r'feel free to ask.*$',
            r'please let me know.*$'
        ]
        for pattern in postambles:
            cleaned = re.sub(pattern, '', cleaned, flags=re.IGNORECASE)

        # Step 4: Extract the JSON object (grab from first { to last })
        first_brace = cleaned.find('{')
        last_brace = cleaned.rfind('}')

        if first_brace == -1 or last_brace == -1:
            raise ValueError("No JSON object found in response.")

        cleaned = cleaned[first_brace : last_brace + 1]

        # Step 5: Fix common Gemma JSON formatting issues (trailing commas)
        cleaned = re.sub(r',\s*([}\]])', r'\1', cleaned)

        # Step 6: Parse
        parsed = json.loads(cleaned)
        
        # Step 7: Standardize Score to integer
        score = parsed.get("score") or parsed.get("atsScore") or 50
        parsed["score"] = int(round(float(score)))
        
        return {"success": True, "data": parsed}

    except Exception as e:
        logger.error(f"Gemma JSON Parse Error: {str(e)}")
        return {"success": False, "data": None}

async def analyze_with_retry(resume_text: str, job_description: str, max_attempts=3):
    """Retries the analysis up to 3 times if JSON parsing fails."""
    
    # 1. Truncate resume for e2b context limit
    safe_resume = truncate_resume(resume_text)
    
    # 2. Build the forceful prompt
    prompt = f"""You are an ATS resume scoring system. Your ONLY job is to output a single valid JSON object. 

STRICT RULES — VIOLATING THESE WILL BREAK THE SYSTEM:
- Output ONLY the JSON object
- Do NOT write anything before the opening {{
- Do NOT write anything after the closing }}
- Do NOT use markdown code fences
- Do NOT say "Sure", "Here is", or "I hope this helps"
- Do NOT add trailing commas
- COMPLETELY finish the JSON

EXAMPLE OF CORRECT OUTPUT:
{{
  "score": 78,
  "summary": "Strong technical background in React and Python.",
  "breakdown": {{
    "technical_skills": 85,
    "experience": 75,
    "domain_knowledge": 80,
    "education": 90,
    "strengths": ["React expert", "Python automation"],
    "weaknesses": ["Lacks Docker experience"]
  }},
  "strengths": ["React", "Python"],
  "gaps": ["Docker"],
  "recommendation": "Learn Docker and CI/CD pipelines.",
  "match_percentage": 78,
  "missing_skills": ["Docker", "Kubernetes"],
  "next_steps_advice": "Follow the Skill Gap roadmap.",
  "professional_message": "Draft email here...",
  "creative_message": "Punchy DM here..."
}}

Now analyze this resume and return ONLY the JSON:

RESUME:
{safe_resume}

JOB DESCRIPTION:
{job_description if job_description else "General professional profile analysis."}

OUTPUT ONLY THE JSON OBJECT. START WITH {{ AND END WITH }}"""
    
    for attempt in range(1, max_attempts + 1):
        logger.info(f"Attempt {attempt}/{max_attempts} for AI Analysis...")
        try:
            raw_text = await call_ai_with_retry(prompt)
            result = safe_parse_gemma_json(raw_text)
            
            if result["success"]:
                logger.info(f"✅ Analysis succeeded on attempt {attempt}")
                return result["data"]
            
            logger.warning(f"❌ Attempt {attempt} failed - cleaning failed or invalid JSON.")
        except Exception as e:
            logger.error(f"Attempt {attempt} error: {str(e)}")
            
        if attempt < max_attempts:
            await asyncio.sleep(1.5)
            
    raise Exception("Analysis failed after 3 attempts due to persistent malformed AI output.")

async def analyze_with_groq(resume_text: str, job_description: str):
    """Async main analysis — uses retry logic."""
    try:
        return await analyze_with_retry(resume_text, job_description)
    except Exception as e:
        logger.error(f"All retry attempts failed: {str(e)}")
        # Ultimate fallback
        return {
            "score": 65,
            "breakdown": {
                "technical_skills": 60, "experience": 70, "domain_knowledge": 65, "education": 65,
                "strengths": ["Resume uploaded successfully"],
                "weaknesses": ["Gemma returned malformed response after 3 retries"]
            },
            "summary": "The AI model (Gemma) is currently returning improperly formatted data. Please try again in a few moments.",
            "strengths": ["Resume uploaded successfully"],
            "gaps": ["AI response malformed — retry limit reached"],
            "recommendation": "Click 'Analyze Resume' one more time; these issues usually resolve on a fresh attempt."
        }

async def get_premium_suite(resume_text: str, job_description: str):
    """Async Premium CV + Cover Letter generation."""
    raw_text = ""
    try:
        # 1. Truncate inputs
        safe_resume = truncate_resume(resume_text)
        
        prompt = f"""You are a career coach. Generate a tailored resume and cover letter.
Return ONLY a valid JSON object.

RESUME:
{safe_resume}

JOB DESCRIPTION:
{job_description}

JSON STRUCTURE:
{{
  "tailored_resume": "The complete tailored resume in markdown format",
  "cover_letter": "The complete cover letter in markdown format"
}}"""

        raw_text = await call_ai_with_retry(prompt)
        
        # Use our safe parser for the premium suite as well
        result = safe_parse_gemma_json(raw_text)
        
        if result["success"]:
            return result["data"]
        
        raise ValueError("AI JSON parsing failed.")

    except Exception as e:
        logger.error(f"Premium suite failed: {str(e)}")
        return {
            "tailored_resume": raw_text if raw_text else "AI response was not properly formatted. Please try again.",
            "cover_letter": "Could not generate cover letter. Please try again."
        }

async def tailor_resume_with_groq(resume_text: str, job_description: str):
    data = await get_premium_suite(resume_text, job_description)
    return data.get("tailored_resume", "")

async def generate_cover_letter_with_groq(resume_text: str, job_description: str):
    data = await get_premium_suite(resume_text, job_description)
    return data.get("cover_letter", "")
