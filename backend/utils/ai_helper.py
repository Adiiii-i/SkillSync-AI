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

NV_KEY = os.getenv("NVIDIA_API_KEY", "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")

def call_ai_with_retry(prompt, model="google/gemma-2-2b-it", response_format=None):
    """
    Calls the NVIDIA API (OpenAI Compatible) with the selected Gemma model.
    """
    if not NV_KEY:
        raise ValueError("NVIDIA_API_KEY is not set.")
    
    try:
        client = OpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=NV_KEY
        )
        
        # Note: some open-weights APIs via Nvidia Nim don't support JSON Object struct natively.
        # We will gracefully fall back by prompting if response_format fails implicitly.
        kwargs = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.2,
            "top_p": 0.7,
            "max_tokens": 1024,
        }
        
        # NVIDIA API for gemma-2-2b-it rejects the 'response_format' keyword violently
        # so we rely completely on prompt engineering for JSON parsing.
        res = client.chat.completions.create(**kwargs)
        return res.choices[0].message.content
    except Exception as e:
        logger.error(f"NVIDIA API Error: {str(e)}")
        raise e

def analyze_with_groq(resume_text: str, job_description: str):
    """Main analysis with provider fallback."""
    prompt = f"""
    You are an expert HR Manager. Analyze this Resume vs JD.
    
    JD: {job_description}
    RESUME: {resume_text}
    
    Return ONLY a raw JSON machine-readable object with exactly this structure:
    {{
      "score": (int 0-100),
      "breakdown": {{
        "technical_skills": (int 0-100),
        "experience": (int 0-100),
        "domain_knowledge": (int 0-100),
        "education": (int 0-100)
      }},
      "summary": "...",
      "strengths": ["...", "..."],
      "gaps": ["...", "..."],
      "recommendation": "...",
      "preparation_tips": ["...", "..."],
      "expected_questions": ["...", "..."],
      "interview_rounds": ["...", "..."],
      "areas_of_concern": ["...", "..."],
      "leetcode_links": [{{ "title": "LeetCode Problem", "url": "https://leetcode.com/..." }}],
      "youtube_links": [{{ "title": "Expert Tutorial", "url": "https://youtube.com/..." }}],
      "github_repos": [{{ "title": "Reference Project", "url": "https://github.com/..." }}],
      "related_jobs": [{{ "platform": "Glassdoor", "url": "https://glassdoor.com/..." }}]
    }}
    """
    
    try:
        content = call_ai_with_retry(prompt, response_format={"type": "json_object"})
        # Clean xAI response if it included markdown backticks
        if content.strip().startswith("```"):
            content = content.strip().split("```json")[-1].split("```")[0].strip()
        return json.loads(content)
    except Exception as e:
        logger.error(f"AI Suite Failed: {str(e)}")
        raise e

def get_premium_suite(resume_text: str, job_description: str):
    """Premium CV + Cover Letter with fallback."""
    prompt = f"""
    Generate a tailored Resume and Cover Letter.
    JD: {job_description}
    RESUME: {resume_text}
    Return JSON with: tailored_resume, cover_letter.
    """
    try:
        content = call_ai_with_retry(prompt, response_format={"type": "json_object"})
        if not content:
            raise ValueError("AI API Exhausted: All configured API keys are rate-limited or failed.")
            
        if content.strip().startswith("```"):
            content = content.strip().split("```json")[-1].split("```")[0].strip()
        return json.loads(content)
    except Exception as e:
        raise e

def tailor_resume_with_groq(resume_text: str, job_description: str):
    return get_premium_suite(resume_text, job_description).get("tailored_resume", "")

def generate_cover_letter_with_groq(resume_text: str, job_description: str):
    return get_premium_suite(resume_text, job_description).get("cover_letter", "")
