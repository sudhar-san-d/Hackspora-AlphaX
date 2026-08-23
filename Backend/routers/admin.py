from fastapi import APIRouter
from services.admin_service import get_admin_dashboard_stats, get_complaints_map_data

router = APIRouter(prefix="/api/admin", tags=["Admin Dashboard"])

@router.get("/dashboard")
def get_dashboard():
    return get_admin_dashboard_stats()

@router.get("/complaints/map")
def get_complaints_map():
    return get_complaints_map_data()
