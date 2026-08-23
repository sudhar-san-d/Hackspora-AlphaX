# FixMyCity AI (Hackspora-AlphaX)

FixMyCity AI (CivicTrack AI) is an AI-powered civic issue reporting, automated triage, officer assignment, and resolution verification system.

## 📁 Repository Structure

```text
Hackspora-AlphaX/
├── Frontend/   # React + Vite + Tailwind CSS Frontend Application
└── Backend/    # FastAPI + Python + SQLite Backend Engine
```

---

## 🚀 Getting Started

### 1. Backend Service (FastAPI)

Navigate to the `Backend` directory and follow the instructions in [`Backend/README.md`](file:///Backend/README.md):

```bash
cd Backend
pip install -r requirements.txt
python -m uvicorn main:app --port 8000 --host 0.0.0.0
```

- API Docs: `http://localhost:8000/docs`

### 2. Frontend Application (React + Vite)

Navigate to the `Frontend` directory and follow the instructions in [`Frontend/README.md`](file:///Frontend/README.md):

```bash
cd Frontend
npm install
npm run dev
```

- Web App: `http://localhost:5173`
