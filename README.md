
# 🚀 AI-Driven Applicant Selection Tool

An AI-powered platform that analyzes applicant data, ranks candidates, and provides smart recommendations for recruitment and upskilling programs.  
This project was built as part of a hackathon challenge for **PLP**.

---

## 📌 Features
- 📂 Load applicant data (from JSON or database)
- ⚖ Candidate ranking based on **skills, experience, and education**
- 🤖 AI-powered evaluation using **OpenAI GPT**
- 🎨 Modern frontend with React + TailwindCSS
- 🔌 Backend powered by **FastAPI**
- 📊 Export results (CSV) for reporting
- 🔗 Ready for integration with future **LMS platforms**

---

## 🛠 Tech Stack
- **Frontend:** React (Vite), TailwindCSS, Framer Motion  
- **Backend:** FastAPI (Python)  
- **AI Integration:** OpenAI GPT-4o-mini  
- **Storage:** JSON (local) → extendable to DB later  

---

## 📂 Project Structure
```
AI-Applicant-Selection-Tool/
│
├── api/
│   ├── main.py           # FastAPI backend
│   ├── applicants.json   # Sample data
│   └── ai_scores.json    # Cached AI scores
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── CandidateList.jsx
│   │   │   ├── CandidateCard.jsx
│   │   │   ├── CandidateModal.jsx
│   │   │   └── Filters.jsx
│   │   └── main.jsx
│   └── package.json
│
├── requirements.txt      # Python dependencies
└── vercel.json           # Vercel routing configuration
```
---

## ⚡ Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/Ajoke752/AI-Applicant-Selection-Tool.git
```

---

### 2️⃣ Backend Setup (FastAPI)
```bash
cd backend
# (create virtual environment)
python -m venv venv
venv\Scripts\activate     # on Windows
source venv/bin/activate  # on Mac/Linux

# install dependencies
pip install fastapi uvicorn python-dotenv openai
```

Create a **`.env`** file inside `backend/`:
```
OPENAI_API_KEY=your Api Key

```

Run backend:
```bash
uvicorn main:app --reload
```

Backend runs at 👉 http://127.0.0.1:8000  
Docs available at 👉 http://127.0.0.1:8000/docs

---

### 3️⃣ Frontend Setup (React + Vite)
```bash
cd frontend
npm install
```

Run frontend:
```bash
npm run dev
```

Frontend runs at 👉 http://127.0.0.1:5173

---

## 🔗 API Endpoints

### `GET /sample-data`
Returns sample applicants from `applicants.json`.

**Response Example:**
```json
[
  {
    "id": "1",
    "name": "Alice Johnson",
    "skills": ["Python", "FastAPI", "SQL"],
    "years_experience": 5,
    "education": "Bachelors",
    "notes": "Strong backend developer"
  }
]
```

---

### `POST /rank`
Ranks applicants using weighted scoring.  
Request body:
```json
{
  "applicants": [...],
  "requiredSkills": ["Python", "SQL"],
  "weights": { "skills": 0.5, "experience": 0.3, "education": 0.2 }
}
```

Response:
```json
{
  "ranked": [
    { "name": "Alice Johnson", "score": 0.83 }
  ]
}
```

---

### `POST /ai-score`
Uses OpenAI GPT to evaluate a candidate.

Request:
```json
{
  "candidate": {
    "name": "Bob Smith",
    "skills": ["React", "JavaScript"],
    "years_experience": 3,
    "education": "Masters",
    "notes": "Frontend specialist"
  },
  "job_description": "Looking for a frontend engineer with strong React skills."
}
```

Response:
```json
{
  "score": 85,
  "summary": "Strong React developer with excellent frontend experience."
}
```

---

## 🎨 Frontend UI Features
- Candidate list with ranking display
- Modal for viewing detailed candidate profile
- Filters for skills, experience, and education
- CSV export of candidate rankings
- Smooth UI animations with **Framer Motion**

---

## 🚀 Future Improvements
- ✅ Database integration (PostgreSQL / MongoDB)
- ✅ Authentication (admin / recruiter login)
- ✅ Integration with LMS APIs
- ✅ Resume parsing with AI
- ✅ Advanced analytics dashboards

---

## 👩‍💻 Contributors
- **Ajoke Abdulrasaq** – Hackathon Project Developer

---

## 📜 License
MIT License – free to use and modify.
