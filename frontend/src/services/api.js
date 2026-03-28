/**
 * SkillSync AI Frontend API Service
 * Centralized logic for backend communication.
 */

// Define the base URL for the backend.
// In development, this points to your local server. In production, it can use an env variable.
export const API_URL = import.meta.env.VITE_API_URL || 'https://skillsync-ai-y0rk.onrender.com';

/**
 * Generic fetch wrapper to handle errors consistently.
 */
const fetchAPI = async (endpoint, formData) => {
    try {
        console.log(`[API REQUEST] POST ${API_URL}${endpoint}`);
        // Log FormData keys/values for debugging
        for (let [key, value] of formData.entries()) {
            console.log(`- ${key}:`, value instanceof File ? `File(${value.name})` : value);
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`[API RESPONSE] from ${endpoint}:`, data);
        return data;
    } catch (error) {
        console.error(`[API ERROR] ${endpoint} failed:`, error);
        throw error;
    }
};

/**
 * CV Scoring (ATS)
 * Analyzes the resume and returns an ATS score and insights.
 * Expected Return JSON: { score: 85, summary: "...", strengths: [...], weaknesses: [...] }
 */
export const analyzeAtsScore = async (resumeFile, systemPrompt) => {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    // Explicitly targeting the ATS features. Could append additional instructions to the prompt if needed.
    formData.append('job_description', systemPrompt || "Analyze this resume for overall ATS compatibility, assigning a score out of 100, and listing strengths and weaknesses.");
    return fetchAPI('/api/analyze', formData);
};

/**
 * AI Resume Builder
 * Generates a tailored resume based on the original resume.
 * Expected Return JSON: { summary: "...", tailored_resume: "..." (Markdown/Text) }
 */
export const buildTailoredResume = async (resumeFile, systemPrompt) => {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('job_description', systemPrompt || "Restructure and optimize this resume into a clean, professional format.");
    return fetchAPI('/api/tailor', formData);
};

/**
 * Skill Gap Roadmap (Upskill Tool)
 * Compares the resume against the JD to identify exact gaps.
 * Expected Return JSON: { match_percentage: 75, missing_skills: ["Python", "SQL"], next_steps_advice: "..." }
 */
export const generateSkillGap = async (resumeFile, jobDescriptionText, systemPrompt) => {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    
    // As per user specification, we assume the backend will return the exact JSON structure natively
    const combinedPrompt = `${systemPrompt || "Compare this resume against the following Job Description and return a strict JSON object with match_percentage, missing_skills, and next_steps_advice."}\n\nJob Description:\n${jobDescriptionText || "Not provided."}`;
    formData.append('job_description', combinedPrompt);
    
    return fetchAPI('/api/analyze', formData);
};

/**
 * Cover Letter Generator
 * Generates a cover letter based on the resume and optional job description.
 * Expected Return JSON: { cover_letter: "..." (Markdown/Text) }
 */
export const generateCoverLetter = async (resumeFile, jobDescriptionText, systemPrompt) => {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    
    const combinedPrompt = jobDescriptionText 
        ? `${systemPrompt}\n\nTarget Job:\n${jobDescriptionText}`
        : systemPrompt;
        
    formData.append('job_description', combinedPrompt);
    return fetchAPI('/api/cover-letter', formData);
};

/**
 * Cold Email / DM Generator (Outreach Tool)
 * Generates an outreach message for the user.
 * Expected Return JSON: { professional_message: "...", creative_message: "..." }
 */
export const generateOutreach = async (resumeFile, jobDescriptionText, systemPrompt) => {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    
    const combinedPrompt = jobDescriptionText 
        ? `${systemPrompt || "Generate a professional and a creative outreach message."}\n\nTarget Job/Role Context:\n${jobDescriptionText}`
        : `${systemPrompt || "Generate a professional and a creative outreach message based on the profile."}`;
        
    formData.append('job_description', combinedPrompt);
    return fetchAPI('/api/analyze', formData); // Adjust to a specific endpoint if available
};
