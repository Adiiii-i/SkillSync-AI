import os
import json
import logging
from openai import OpenAI
from dotenv import load_dotenv

# Load env vars
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

NV_KEY = os.getenv("NVIDIA_API_KEY", "")

def call_ai_with_retry(prompt, model="google/gemma-2-2b-it"):
    """
    Calls the NVIDIA API (OpenAI Compatible) with the selected Gemma model.
    Note: response_format is NOT supported by NVIDIA NIM for this model.
    We rely on prompt engineering for JSON output.
    """
    if not NV_KEY:
        raise ValueError("NVIDIA_API_KEY is not set.")
    
    try:
        client = OpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=NV_KEY
        )
        
        res = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            top_p=0.7,
            max_tokens=4096,
        )
        return res.choices[0].message.content
    except Exception as e:
        logger.error(f"NVIDIA API Error: {str(e)}")
        raise e

def _clean_json_response(content: str) -> str:
    """Strip markdown code fences from AI responses."""
    if not content:
        return content
    content = content.strip()
    if content.startswith("```json"):
        content = content[7:]
    elif content.startswith("```"):
        content = content[3:]
    if content.endswith("```"):
        content = content[:-3]
    return content.strip()

def analyze_with_groq(resume_text: str, job_description: str):
    """Main analysis — returns structured JSON for the ATS scoring dashboard."""
    prompt = f"""You are an expert HR Manager and ATS specialist. Analyze this resume against the job description.

JOB DESCRIPTION: {job_description}

RESUME: {resume_text}

You MUST return ONLY a valid JSON object (no markdown, no explanation) with exactly this structure:
{{
  "score": <integer 0-100>,
  "breakdown": {{
    "technical_skills": <integer 0-100>,
    "experience": <integer 0-100>,
    "domain_knowledge": <integer 0-100>,
    "education": <integer 0-100>,
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "weaknesses": ["weakness 1", "weakness 2"]
  }},
  "summary": "A 2-3 sentence summary of the candidate's fit",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "gaps": ["gap 1", "gap 2"],
  "recommendation": "A paragraph of strategic recommendations for the candidate",
  "match_percentage": <integer 0-100, optional, based on job compatibility>,
  "missing_skills": ["skill 1", "skill 2", "skill 3", optional critical skills they lack from JD],
  "next_steps_advice": "1 or 2 sentences of actionable steps to bridge the gap",
  "professional_message": "Draft a short, professional cold email (e.g., to a recruiter)",
  "creative_message": "Draft a punchy, creative cold DM (e.g., for LinkedIn/Twitter)"
}}

RESPOND WITH ONLY THE JSON. NO other text."""
    
    try:
        content = call_ai_with_retry(prompt)
        content = _clean_json_response(content)
        result = json.loads(content)
        
        # Ensure breakdown has strengths/weaknesses for the frontend
        if "breakdown" in result and isinstance(result["breakdown"], dict):
            if "strengths" not in result["breakdown"]:
                result["breakdown"]["strengths"] = result.get("strengths", [])
            if "weaknesses" not in result["breakdown"]:
                result["breakdown"]["weaknesses"] = result.get("gaps", [])
        
        return result
    except json.JSONDecodeError as e:
        logger.error(f"JSON parse failed. Raw content: {content[:500]}")
        # Return a safe fallback so the UI doesn't crash
        return {
            "score": 65,
            "breakdown": {
                "technical_skills": 60,
                "experience": 70,
                "domain_knowledge": 65,
                "education": 65,
                "strengths": ["Resume uploaded successfully"],
                "weaknesses": ["AI response was malformed — please try again"]
            },
            "summary": "The AI model returned an improperly formatted response. The analysis could not be completed. Please try again.",
            "strengths": ["Resume uploaded successfully"],
            "gaps": ["AI response was malformed — please retry"],
            "recommendation": "Please click Analyze again. The AI model occasionally returns incomplete responses on the first attempt."
        }
    except Exception as e:
        logger.error(f"AI Suite Failed: {str(e)}")
        raise e

def get_premium_suite(resume_text: str, job_description: str):
    """Premium CV + Cover Letter generation."""
    prompt = f"""You are a professional career coach and resume writer.

JOB DESCRIPTION: {job_description}

RESUME: {resume_text}

Generate BOTH a tailored resume and a cover letter. Return ONLY a valid JSON object (no markdown fences, no explanation) with this structure:
{{
  "tailored_resume": "The complete tailored resume in markdown format",
  "cover_letter": "The complete cover letter in markdown format"
}}

RESPOND WITH ONLY THE JSON. NO other text."""

    try:
        content = call_ai_with_retry(prompt)
        content = _clean_json_response(content)
        
        if not content:
            raise ValueError("AI API returned empty response.")
        
        return json.loads(content)
    except json.JSONDecodeError:
        logger.error(f"Premium suite JSON parse failed. Raw: {content[:500] if content else 'empty'}")
        # Graceful fallback: return the raw text as markdown
        return {
            "tailored_resume": content or "AI response was not properly formatted. Please try again.",
            "cover_letter": "Could not generate cover letter. Please try again."
        }
    except Exception as e:
        raise e

def tailor_resume_with_groq(resume_text: str, job_description: str):
    return get_premium_suite(resume_text, job_description).get("tailored_resume", "")

def generate_cover_letter_with_groq(resume_text: str, job_description: str):
    return get_premium_suite(resume_text, job_description).get("cover_letter", "")
