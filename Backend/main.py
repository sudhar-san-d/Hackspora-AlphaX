from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from config import CORS_ORIGINS

from routers import complaints, officer, ai, admin

app = FastAPI(
    title="FixMyCity AI — Backend API",
    description="Backend API for CivicTrack AI (Complaints, AI Vision, Decision Engine, SLA Monitor, Resolution Verification)",
    version="1.0.0"
)

# Enable CORS for Frontend React integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "FixMyCity AI Backend Engine",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

# Mount Routers
app.include_router(complaints.router)
app.include_router(officer.router)
app.include_router(ai.router)
app.include_router(admin.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
