# FixMyCity AI — Backend Engine

**Product:** FixMyCity AI (CivicTrack AI)  
**Role Scope:** Member 4 — Backend Engine / System Integration / Admin APIs  
**Tech Stack:** Python 3.14 + FastAPI + Uvicorn + SQLite + Pydantic + REST API  

---

## 🏛 Backend System Architecture

The backend serves as the **single source of truth** for the FixMyCity AI platform. It connects citizen complaints, Member 1 Vision AI analysis, Member 2 Decision AI scoring, officer action tracking, and automated proof verification.

```text
                     FRONTEND (React)
                            │
               POST /api/complaints
               PATCH /api/complaints/{id}/status
               POST /api/complaints/{id}/evidence
                            │
                            ▼
                     FASTAPI ENGINE
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
      Member 1 AI      Member 2 AI      SQLite DB
       Vision API       Decision API    `civictrack.db`
            │               │               │
            └───────────────┼───────────────┘
                            │
                            ▼
              Resolution Verification Engine
                 (Haversine Geo-Check ≤ 100m)
                            │
                            ▼
                   VERIFIED / REOPENED
```

---

## 📁 Directory Structure

```text
Backend/
├── CivicTrack_AI_Member_4_PRD.md   # Member 4 Backend PRD Specification
├── README.md                       # Backend documentation & endpoint guide
├── requirements.txt                # Python dependencies (fastapi, uvicorn, etc.)
├── config.py                       # App settings, SLA thresholds, CORS origins
├── database.py                     # SQLite engine, table creation & demo seeds
├── schemas.py                      # Pydantic request/response schemas
├── main.py                         # FastAPI app entrypoint & middleware
├── civictrack.db                   # SQLite persistent database
├── services/
│   ├── ai_service.py               # Vision AI (Member 1) & Decision AI (Member 2)
│   ├── verification_service.py     # Geo-distance formula & proof verification
│   ├── complaint_service.py        # Complaint lifecycle & status timeline
│   └── admin_service.py            # Dashboard statistics & GIS map coordinates
└── routers/
    ├── complaints.py               # /api/complaints endpoints
    ├── officer.py                  # /api/officer/complaints endpoint
    ├── ai.py                       # /api/ai/analyze-image & /api/ai/decide endpoints
    └── admin.py                    # /api/admin/dashboard & map endpoints
```

---

## ⚡ API Endpoints Summary

### 1. Citizen & Public Complaint APIs
- `POST /api/complaints` — Submit new complaint (triggers AI vision & decision pipeline, assigns department & SLA, stores record).
- `GET /api/complaints/{complaint_id}` — Get complaint details, remaining SLA minutes, and status audit timeline.

### 2. Officer Operations APIs
- `GET /api/officer/complaints` — Returns assigned complaints sorted by `priority_level` (`CRITICAL` → `HIGH` → `MEDIUM` → `LOW`) and `sla_deadline` ASC.
- `PATCH /api/complaints/{complaint_id}/status` — Updates status (`FIELD_ACTION`, `AWAITING_VERIFICATION`, etc.) and records audit history.

### 3. Resolution Verification Engine
- `POST /api/complaints/{complaint_id}/evidence` — Receives resolution after-photo, GPS, timestamp. Calculates Haversine distance from original GPS, computes verification score (`93/100`), and transitions status to `VERIFIED` or `REOPENED`.

### 4. AI Engine Integrations (Member 1 & 2)
- `POST /api/ai/analyze-image` — Member 1 Vision AI analysis.
- `POST /api/ai/decide` — Member 2 Decision AI routing & priority scoring.

### 5. Admin & GIS Dashboard APIs
- `GET /api/admin/dashboard` — Returns aggregate statistics (total, active, critical, overdue, verified) and department performance.
- `GET /api/admin/complaints/map` — GIS coordinates for map visualization.

---

## 🛠 Running the Backend Server

### Prerequisites
- Python 3.10+

### Installation & Running

1. Navigate to the `Backend` directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Start the FastAPI server:
```bash
python -m uvicorn main:app --port 8000 --host 0.0.0.0
```

4. Interactive Swagger Documentation available at:
```text
http://localhost:8000/docs
```
