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

# ML Model Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AQ.Ab8RN6JHtH-1v_FbM6WPGxtITbLMMv6ecavjeRf3xXVshMSkQQ")
EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
DINO_MODEL_NAME = "facebookresearch/dinov2:main"
DINO_VARIANT = "dinov2_vits14"
DUPLICATE_SIMILARITY_THRESHOLD = 0.75  # Cosine similarity threshold for duplicate detection


# CORS Allowed Origins
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "*"
]

