from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from pathlib import Path
import json
from openai import OpenAI
import os
from dotenv import load_dotenv

# Load OpenAI API key
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI(title="AI Applicant Selection Tool - Ranking API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to sample data
SAMPLE_PATH = Path(__file__).parent / "applicants.json"
try:
    SAMPLE_APPLICANTS = json.loads(SAMPLE_PATH.read_text(encoding="utf-8"))
except Exception:
    SAMPLE_APPLICANTS = []

# ---------- MODELS ----------
class Applicant(BaseModel):
    id: Optional[str]
    name: Optional[str]
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

def score_single(a: Dict[str, Any], required_skills: List[str], weights: Dict[str, float]) -> Dict[str, Any]:
    skills = a.get("skills", []) or []
    exp = a.get("years_experience", 0) or 0
    edu = a.get("education", None)
    s_skills = skills_score(skills, required_skills)
    s_exp = min(1.0, float(exp) / 10.0)
    s_edu = education_score(edu)
    score = s_skills * weights["skills"] + s_exp * weights["experience"] + s_edu * weights["education"]
    out = dict(a)
    out["score"] = round(score, 3)
    return out

def score_applicants(applicants, required_skills=None, weights=None):
    required_skills = required_skills or []
    default_weights = {"skills": 0.5, "experience": 0.3, "education": 0.2}
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
DATA_FILE = Path("ai_scores.json")

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

    # Return cached result if available
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

        # Save and return
        scores[key] = data
        save_scores(scores)
        return data
    except Exception as e:
        return {"error": str(e)}

@app.get("/sample-data")
def get_sample_data():
    file_path = Path(__file__).parent / "applicants.json"
    print("DEBUG: Looking for file at:", file_path)  # check path

    if not file_path.exists():
        return {"error": f"File not found at {file_path}"}

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        print("DEBUG: Loaded data:", data[:2])  # show first 2 items
        return data
    except Exception as e:
        return {"error": str(e)}
