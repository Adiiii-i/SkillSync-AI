# SkillSync AI 🚀
### Next-Gen AI Resume Screening & Tailoring Platform

SkillSync AI is a premium, high-fidelity SaaS platform engineered to transform the hiring process. Built with a **cinematic obsidian aesthetic** and powered by **LLama 3.3 (Groq)**, it performs 16 critical analyses to ensure resumes cut through the ATS noise and convert into interview callbacks.

![SkillSync AI Banner](https://img.shields.io/badge/Aesthetic-Cinematic_Dark-00FFB2?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-React_|_FastAPI_|_Groq-7C3AED?style=for-the-badge)

---

## ✨ Key Features

- 🟢 **AI Resume Screening**: Instant, strict ATS score breakdown (Technical Skills, Experience, Education, Domain Knowledge).
- 🟣 **Premium Tailoring**: AI-driven CV rewriting to perfectly align with specific Job Descriptions.
- 🔵 **Interview Prep**: Targeted interview questions, rounds to expect, and pro-tips based on the resume/JD match.
- 🟡 **Resource Roadmap**: Auto-generated learning paths with LeetCode, YouTube, and GitHub project recommendations.
- 🎨 **Cinematic UI**: Obsidian background with neon emerald accents, animated mesh gradients, and 3D mockups.
- 📂 **Templates Coming Soon**: Sleek, ATS-optimized resume templates designed for conversion.

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18** (Vite)
- **CSS3** (Custom glassmorphism design system)
- **html2pdf.js** (PDF generation)
- **Framer Motion / Keyframe Animations** (Micro-interactions)

### **Backend**
- **FastAPI** (Python 3.10+)
- **Groq SDK** (Llama-3.3-70b-versatile)
- **PyPDF2** (Resume parsing)
- **Uvicorn/Gunicorn** (Web server)

---

## 🚀 Deployment Guide

### **1. Backend (Render)**
- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Env Vars**:
  - `GROQ_API_KEY`: Your Groq Cloud API Key.
  - `FRONTEND_URL`: Your Vercel domain (or `*` for development).

### **2. Frontend (Vercel)**
- **Root Directory**: `frontend`
- **Framework Preset**: `Vite`
- **Env Vars**:
  - `VITE_API_URL`: Your Render Service URL (e.g. `https://skillsync-backend.onrender.com`).

---

## 📦 Installation (Local)

### **Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### **Frontend**
```bash
cd frontend
npm install
npm run dev
```

---

## 👤 Developed By
**AADI**
- Contact: `adiexzzz@proton.me`
- Payment UPI: `7080359767@fam`

---
*SkillSync AI — Converting Resumes into Realistic Interviews.*
