"""
schemas.py — Pydantic models with detailed score breakdown.
Relaxed validation to handle varying AI model outputs gracefully.
"""

from pydantic import BaseModel, Field
from typing import Optional


class ScoreBreakdown(BaseModel):
    technical_skills: int = Field(default=50, ge=0, le=100)
    experience: int = Field(default=50, ge=0, le=100)
    domain_knowledge: int = Field(default=50, ge=0, le=100)
    education: int = Field(default=50, ge=0, le=100)
    strengths: list[str] = []
    weaknesses: list[str] = []


class ScreeningResult(BaseModel):
    """Structured output with breakdown for better trust."""
    score: int = Field(default=50, ge=0, le=100)
    breakdown: Optional[ScoreBreakdown] = None
    summary: str = ""
    
    # Newly Added Keys for Upskill and Outreach Features
    match_percentage: Optional[int] = None
    missing_skills: list[str] = []
    next_steps_advice: Optional[str] = None
    professional_message: Optional[str] = None
    creative_message: Optional[str] = None

    strengths: list[str] = []
    gaps: list[str] = []
    recommendation: str = ""
    preparation_tips: list[str] = []
    expected_questions: list[str] = []
    interview_rounds: list[str] = []
    areas_of_concern: list[str] = []
    
    leetcode_links: list[dict] = []
    youtube_links: list[dict] = []
    github_repos: list[dict] = []
    related_jobs: list[dict] = []


class ErrorResponse(BaseModel):
    detail: str
