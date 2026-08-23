from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class LocationSchema(BaseModel):
    latitude: float
    longitude: float
    address: Optional[str] = "11.0168, 76.9558"
    ward: Optional[str] = "Ward 14"
    zone: Optional[str] = "Central Zone"

class ComplaintCreateSchema(BaseModel):
    citizen_id: Optional[str] = "U1001"
    description: str
    image_url: Optional[str] = "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=800&auto=format&fit=crop"
    location: LocationSchema
    issue: Optional[str] = None
    category: Optional[str] = None

class StatusUpdateSchema(BaseModel):
    status: str
    updated_by: Optional[str] = "OFFICER_12"
    reason: Optional[str] = "Status updated via API"

class EvidenceUploadSchema(BaseModel):
    image_url: str
    latitude: float
    longitude: float
    captured_at: Optional[str] = None

class ImageAnalysisRequest(BaseModel):
    complaint_id: Optional[str] = "CT-1001"
    image_url: str

class DecisionAIRequest(BaseModel):
    complaint_id: Optional[str] = "CT-1001"
    description: str
    location: LocationSchema
    image_analysis: Dict[str, Any]
