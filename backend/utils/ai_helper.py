import os
import json
import logging
from groq import Groq
from dotenv import load_dotenv

# Load env vars
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure Groq
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = None
if GROQ_API_KEY:
    client = Groq(api_key=GROQ_API_KEY)

def analyze_with_groq(resume_text: str, job_description: str):
    """
    Sends resume and JD to Groq (Llama-3.3-70b) and returns a structured JSON response.
    """
    if not client:
        raise ValueError("GROQ_API_KEY not found in environment variables.")

    prompt = f"""
    You are an expert HR Recruiter and Technical Hiring Manager.
    Your task is to analyze the following Resume against the Job Description.

    BE VERY STRICT AND HONEST. DO NOT GIVE A SAFE SCORE (LIKE 70%). IF THE RESUME IS NOT A FIT, THE SCORE SHOULD BE LOW (20-40%). IF IT'S A NEAR PERFECT FIT, THE SCORE SHOULD BE HIGH (85-98%).
    
    JOB DESCRIPTION:
    {job_description}

    RESUME TEXT:
    {resume_text}
    
    Perform 16 critical analyses and return exactly a JSON object:
    - score: Integer 0-100 (ATS Score)
    - analysis: String (Detailed breakdown of match)
    - strengths: Array of 3 key strengths
    - weaknesses: Array of 3 areas for improvement
    - roadmap: Array of 4 learning milestones
    - leetcode_links: Array of 3-5 objects with exactly: {{"title": "Question Name", "url": "https://leetcode.com/problems/..."}}
    - youtube_links: Array of 3-5 objects with exactly: {{"title": "Video Title", "url": "https://youtube.com/..."}}
    - github_projects: Array of 2 project ideas
    - related_jobs: Array of 3-4 objects with exactly: {{"platform": "LinkedIn", "url": "Search URL"}}

    Output ONLY the raw JSON object.
    """
    
    try:
        content = call_groq_with_retry(prompt, response_format={"type": "json_object"})
        return json.loads(content)
    except Exception as e:
        logger.error(f"Analysis failed: {str(e)}")
        raise e

def get_premium_suite(resume_text: str, job_description: str):
    """
    Generates BOTH a tailored CV and a Cover Letter in ONE AI call with rotation.
    """
    prompt = f"""
    You are an expert career coach.
    TASK 1: Rewrite resume to match JD.
    TASK 2: Write persuasive cover letter.
    
    JD: {job_description}
    RESUME: {resume_text}
    
    Return a valid JSON object:
    - tailored_resume: Full rewritten resume content in Markdown.
    - cover_letter: Full cover letter content in Markdown.
    """

    try:
        content = call_groq_with_retry(prompt, response_format={"type": "json_object"})
        return json.loads(content)
    except Exception as e:
        logger.error(f"Premium Suite Addition failed: {str(e)}")
        raise e

def tailor_resume_with_groq(resume_text: str, job_description: str):
    return get_premium_suite(resume_text, job_description).get("tailored_resume", "")

def generate_cover_letter_with_groq(resume_text: str, job_description: str):
    return get_premium_suite(resume_text, job_description).get("cover_letter", "")
