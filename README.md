# AI-Driven Applicant Selection Tool

Overview

- Prototype that analyzes applicant data and returns ranked candidate recommendations for LSETF/PLP programs.
- Tech: React + Vite frontend, FastAPI backend (scoring API).
- Goals: demonstrate data analysis, candidate ranking, recommendation API, and LMS integration readiness.

Quick start (Windows)

1. Backend

```powershell
cd "c:\Users\USER\Desktop\Hackathon Projects\Nigeria Hackathon Project\AI Applicant Selection Tool\backend"
python -m venv .venv
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
.\.venv\Scripts\python -m uvicorn main:app --reload --port 8000
```

2. Frontend

```powershell
cd "c:\Users\USER\Desktop\Hackathon Projects\Nigeria Hackathon Project\AI Applicant Selection Tool\frontend\react-app"
npm install
npm run dev
# Open http://localhost:5173
```

Project layout (important files)

- backend/
  - main.py — FastAPI app & scorer
  - requirements.txt — Python deps
  - sample-data/applicants.json — demo dataset
- frontend/react-app/
  - src/App.jsx — app shell and actions (Load Sample, Rank Applicants)
  - src/components/ — UI components (CandidateList, Card, Filters, Modal, ExportCSV)
  - src/data/sample-applicants.json — optional offline sample data
  - postcss.config.cjs, tailwind.config.cjs, package.json, vite.config.js

API (dev)

- Base: http://localhost:8000
- GET / -> health check
- GET /rank/sample -> returns scored sample applicants: { "ranked": [ ... ] }
- POST /rank -> accepts { applicants, requiredSkills?, weights? } and returns { "ranked": [ ... ] }
- POST /score -> score a single applicant

Notes

- Frontend starts empty. Use "Load Sample" to fetch /rank/sample, then "Rank Applicants" to post current applicants to /rank and update scores.
- Backend includes CORS for the Vite dev server; update origins in main.py if you run frontend on a different host/port.
- If Tailwind/PostCSS errors occur, ensure `postcss.config.cjs` exists (CommonJS) and restart the dev server.

Troubleshooting

- uvicorn not found: activate venv and install requirements (use venv python to run uvicorn).
- White page / missing styles: check Vite terminal and browser console for PostCSS or Tailwind errors; ensure postcss.config.cjs and tailwind.config.cjs are correct.
- /rank/sample 404: confirm backend `main.py` includes the route and `backend/sample-data/applicants.json` exists and is valid JSON.

Next steps (suggested)

- Replace heuristic scorer with ML model trained on labelled data.
- Add authentication and persistent storage.
- Add CI to run backend tests and frontend checks.
- Prepare an LMS connector (webhook or REST sync) for integration.

License

- Prototype for hackathon/demo use. Add security, tests and audits before production.

````// filepath: c:\Users\USER\Desktop\Hackathon Projects\Nigeria Hackathon Project\AI Applicant Selection Tool\frontend\react-app\README.md
# AI-Driven Applicant Selection Tool

Overview
- Prototype that analyzes applicant data and returns ranked candidate recommendations for LSETF/PLP programs.
- Tech: React + Vite frontend, FastAPI backend (scoring API).
- Goals: demonstrate data analysis, candidate ranking, recommendation API, and LMS integration readiness.

Quick start (Windows)

1. Backend
```powershell
cd "c:\Users\USER\Desktop\Hackathon Projects\Nigeria Hackathon Project\AI Applicant Selection Tool\backend"
python -m venv .venv
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
.\.venv\Scripts\python -m uvicorn main:app --reload --port 8000
````

2. Frontend

```powershell
cd "c:\Users\USER\Desktop\Hackathon Projects\Nigeria Hackathon Project\AI Applicant Selection Tool\frontend\react-app"
npm install
npm run dev
# Open http://localhost:5173
```

Project layout (important files)

- backend/
  - main.py — FastAPI app & scorer
  - requirements.txt — Python deps
  - sample-data/applicants.json — demo dataset
- frontend/react-app/
  - src/App.jsx — app shell and actions (Load Sample, Rank Applicants)
  - src/components/ — UI components (CandidateList, Card, Filters, Modal, ExportCSV)
  - src/data/sample-applicants.json — optional offline sample data
  - postcss.config.cjs, tailwind.config.cjs, package.json, vite.config.js

API (dev)

- Base: http://localhost:8000
- GET / -> health check
- GET /rank/sample -> returns scored sample applicants: { "ranked": [ ... ] }
- POST /rank -> accepts { applicants, requiredSkills?, weights? } and returns { "ranked": [ ... ] }
- POST /score -> score a single applicant

Notes

- Frontend starts empty. Use "Load Sample" to fetch /rank/sample, then "Rank Applicants" to post current applicants to /rank and update scores.
- Backend includes CORS for the Vite dev server; update origins in main.py if you run frontend on a different host/port.
- If Tailwind/PostCSS errors occur, ensure `postcss.config.cjs` exists (CommonJS) and restart the dev server.

Troubleshooting

- uvicorn not found: activate venv and install requirements (use venv python to run uvicorn).
- White page / missing styles: check Vite terminal and browser console for PostCSS or Tailwind errors; ensure postcss.config.cjs and tailwind.config.cjs are correct.
- /rank/sample 404: confirm backend `main.py` includes the route and `backend/sample-data/applicants.json` exists and is valid JSON.

Next steps (suggested)

- Replace heuristic scorer with ML model trained on labelled data.
- Add authentication and persistent storage.
- Add CI to run backend tests and frontend checks.
- Prepare an LMS connector (webhook or REST sync) for integration.

License

- Prototype for hackathon/demo use. Add security, tests and audits before production.
