import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_PATH = os.path.join(BASE_DIR, "civictrack.db")

# SLA Configuration in Hours
SLA_HOURS_CONFIG = {
    "CRITICAL": 6,
    "HIGH": 12,
    "MEDIUM": 48,
    "LOW": 120
}

# Geo-Verification Max Allowed Distance Threshold in Meters
MAX_GEO_DISTANCE_METERS = 100.0

# CORS Allowed Origins
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "*"
]
