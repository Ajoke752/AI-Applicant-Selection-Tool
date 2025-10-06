from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from pathlib import Path
import json
import os
from openai import OpenAI
from dotenv import load_dotenv


app = FastAPI(title="AI Applicant Selection Tool - Ranking API")

# Load OpenAI key if running locally




# CORS for frontend (replace with your Vercel frontend URL if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
# Paths
BASE_DIR = Path(__file__).parent
SAMPLE_PATH = BASE_DIR / "applicants.json"
DATA_FILE = BASE_DIR / "ai_scores.json"

# Load sample applicants
try:
    SAMPLE_APPLICANTS = json.loads(SAMPLE_PATH.read_text(encoding="utf-8"))
except Exception:
    SAMPLE_APPLICANTS = []

# ---------- MODELS ----------
class Applicant(BaseModel):
    id: Optional[str]
    name: Optional[str]
    email: Optional[str]
    skills: Optional[List[str]] = []
    years_experience: Optional[float] = 0
    education: Optional[str] = None
    notes: Optional[str] = None
    portfolio_present: Optional[bool] = False
    resume: Optional[str] = None

class RankRequest(BaseModel):
    applicants: Optional[List[Applicant]] = None
    requiredSkills: Optional[List[str]] = []
    weights: Optional[Dict[str, float]] = None

class AIScoreRequest(BaseModel):
    candidate: Applicant
    job_description: str

# ---------- HELPER FUNCTIONS ----------
def education_score(level: Optional[str]) -> float:
    mapping = {"phd": 1.0, "masters": 0.9, "bachelors": 0.7, "diploma": 0.5, "none": 0.2}
    if not level:
        return 0.3
    return mapping.get(level.lower(), 0.3)

def skills_score(skills: List[str], required: List[str]) -> float:
    if not required:
        return min(1.0, len(skills) / 5.0)
    matched = sum(1 for s in skills if s in required)
    return matched / max(1, len(required))

def assessment_score(scores: Optional[Dict[str, float]]) -> float:
    if not scores:
        return 0.5
    values = list(scores.values())
    if not values:
        return 0.5
    avg = sum(values) / len(values)
    return min(1.0, avg / 100.0)

def portfolio_score(has_portfolio: bool) -> float:
    return 1.0 if has_portfolio else 0.3

def cover_letter_score(cover_letter: Optional[str]) -> float:
    if not cover_letter:
        return 0.3
    length = len(cover_letter.strip())
    if length > 200:
        return 1.0
    elif length > 100:
        return 0.7
    elif length > 50:
        return 0.5
    return 0.3

def score_single(a: Dict[str, Any], required_skills: List[str], weights: Dict[str, float]) -> Dict[str, Any]:
    skills = a.get("skills", []) or []
    exp = a.get("years_experience", 0) or 0
    edu = a.get("education", None)
    assessment = a.get("assessment_scores", None)
    portfolio = a.get("portfolio_present", False)
    cover_letter = a.get("cover_letter", None)

    s_skills = skills_score(skills, required_skills)
    s_exp = min(1.0, float(exp) / 10.0)
    s_edu = education_score(edu)
    s_assessment = assessment_score(assessment)
    s_portfolio = portfolio_score(portfolio)
    s_cover = cover_letter_score(cover_letter)

    score = (
        s_skills * weights["skills"] +
        s_exp * weights["experience"] +
        s_edu * weights["education"] +
        s_assessment * weights["assessment"] +
        s_portfolio * weights["portfolio"] +
        s_cover * weights["cover_letter"]
    )

    out = dict(a)
    out["score"] = round(score, 3)
    out["score_breakdown"] = {
        "skills": round(s_skills, 3),
        "experience": round(s_exp, 3),
        "education": round(s_edu, 3),
        "assessment": round(s_assessment, 3),
        "portfolio": round(s_portfolio, 3),
        "cover_letter": round(s_cover, 3)
    }
    return out

def score_applicants(applicants, required_skills=None, weights=None):
    required_skills = required_skills or []
    default_weights = {
        "skills": 0.25,
        "experience": 0.2,
        "education": 0.15,
        "assessment": 0.25,
        "portfolio": 0.1,
        "cover_letter": 0.05
    }
    if weights:
        default_weights.update(weights)
    ranked = [score_single(a if isinstance(a, dict) else a.dict(), required_skills, default_weights) for a in applicants]
    ranked.sort(key=lambda x: x.get("score", 0), reverse=True)
    return ranked

# ---------- ROUTES ----------
@app.get("/")
def root():
    return {"service": "AI Applicant Selection Tool - Ranking API"}

@app.post("/rank")
def rank(req: RankRequest):
    applicants = [a.dict() for a in (req.applicants or SAMPLE_APPLICANTS)]
    ranked = score_applicants(applicants, req.requiredSkills or [], req.weights or {})
    return {"ranked": ranked}

@app.get("/rank/sample")
def rank_sample():
    ranked = score_applicants(SAMPLE_APPLICANTS)
    return {"ranked": ranked}

@app.post("/score")
def score_applicant(applicant: Applicant):
    scored = score_single(applicant.dict(), [], {"skills": 0.5, "experience": 0.3, "education": 0.2})
    return {"name": scored.get("name"), "score": scored.get("score")}

# ---------- AI SCORING ----------
def load_scores():
    if DATA_FILE.exists():
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    return {}

def save_scores(scores):
    with open(DATA_FILE, "w") as f:
        json.dump(scores, f, indent=2)

@app.post("/ai-score")
def ai_score(req: AIScoreRequest):
    scores = load_scores()
    key = req.candidate.email or req.candidate.name

    if key in scores:
        return scores[key]

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an AI recruiter assistant."},
                {"role": "user", "content": f"""
Job Description: {req.job_description}

Candidate:
Name: {req.candidate.name}
Skills: {req.candidate.skills}
Experience: {req.candidate.years_experience} years
Education: {req.candidate.education}
Notes: {req.candidate.notes}

Please return JSON like:
{{ "score": 85, "summary": "Strong React developer with ML skills" }}
"""}
            ],
            temperature=0.3,
        )

        raw = response.choices[0].message.content.strip()
        data = json.loads(raw)
        scores[key] = data
        save_scores(scores)
        return data
    except Exception as e:
        return {"error": str(e)}

@app.get("/sample-data")
def get_sample_data():
    if not SAMPLE_PATH.exists():
        return {"error": f"File not found at {SAMPLE_PATH}"}
    try:
        with open(SAMPLE_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data
    except Exception as e:
        return {"error": str(e)}
