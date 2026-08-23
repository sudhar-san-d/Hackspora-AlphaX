from fastapi import APIRouter
from schemas import ImageAnalysisRequest, DecisionAIRequest
from services.ai_service import analyze_image_member1, generate_decision_member2

router = APIRouter(prefix="/api/ai", tags=["AI Engines"])

@router.post("/analyze-image")
def analyze_image_endpoint(payload: ImageAnalysisRequest):
    return analyze_image_member1(payload.image_url, payload.complaint_id or "CT-1001")

@router.post("/decide")
def decide_endpoint(payload: DecisionAIRequest):
    return generate_decision_member2(
        description=payload.description,
        location=payload.location.dict(),
        image_analysis=payload.image_analysis,
        complaint_id=payload.complaint_id or "CT-1001"
    )
