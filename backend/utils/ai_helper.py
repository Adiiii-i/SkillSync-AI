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

    Return a valid JSON object with exactly these fields:
    - score: Integer (0-100) representing the overall match percentage.
    - breakdown: Object with points (0-100):
        - technical_skills: Score for exact keyword matching (e.g., "React", "Python", "AWS").
        - experience: Score for matching the actual years and level of experience required.
        - domain_knowledge: Score for understanding the industry (e.g., FinTech, Healthcare).
        - education: Score for satisfying degree requirements.
    - summary: A 2-3 sentence overview of the candidate's fit.
    - strengths: Array of 3-5 key points where the candidate matches the JD.
    - gaps: Array of 2-4 areas where the candidate is missing skills or experience.
    - recommendation: A single string (e.g., "Strong Hire", "Hire", "Consider", "Reject").
    - preparation_tips: Array of 3-5 specific tips. 
    - expected_questions: Array of 4-6 interview questions.
    - interview_rounds: Array of 3-5 recommended rounds.
    - areas_of_concern: Array of 2-4 areas to probe deeper.
    
    # Career Roadmaps & External Resources
    - leetcode_links: Array of 3-5 objects with exactly: {{"title": "Question Name", "url": "https://leetcode.com/problems/..."}} 
    - youtube_links: Array of 3-5 objects with exactly: {{"title": "Video Title", "url": "https://www.youtube.com/results?search_query=..."}}
    - github_repos: Array of 2-4 objects with exactly: {{"title": "Repo Name", "url": "https://github.com/..."}} 
    - related_jobs: Array of 3-4 objects with exactly: {{"platform": "Platform Name (e.g. LinkedIn)", "url": "Search URL"}}

    Output ONLY the raw JSON object. Use valid JSON syntax.
    """

    try:
        logger.info("Sending request to Groq (Llama-3.3-70B)...")
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"},
        )
        return json.loads(chat_completion.choices[0].message.content)
    except Exception as e:
        logger.error(f"Groq API Error: {str(e)}")
        raise e

def tailor_resume_with_groq(resume_text: str, job_description: str):
    """Rewrites resume."""
    if not client: raise ValueError("GROQ_API_KEY missing")
    prompt = f"Target JD: {job_description}\nOriginal Resume: {resume_text}\nRewrite it to match the JD perfectly. Return Markdown only."
    try:
        chat_completion = client.chat.completions.create(messages=[{"role": "user", "content": prompt}], model="llama-3.3-70b-versatile")
        return chat_completion.choices[0].message.content
    except Exception as e: raise e

def generate_cover_letter_with_groq(resume_text: str, job_description: str):
    """Crafts cover letter."""
    if not client: raise ValueError("GROQ_API_KEY missing")
    prompt = f"JD: {job_description}\nResume: {resume_text}\nWrite a persuasive cover letter to this role. Return Markdown only."
    try:
        chat_completion = client.chat.completions.create(messages=[{"role": "user", "content": prompt}], model="llama-3.3-70b-versatile")
        return chat_completion.choices[0].message.content
    except Exception as e: raise e
