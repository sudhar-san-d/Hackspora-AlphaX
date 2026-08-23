from fastapi import APIRouter
from database import get_db
from services.complaint_service import calculate_sla_remaining_minutes

router = APIRouter(prefix="/api/officer", tags=["Officer"])

@router.get("/complaints")
def get_officer_complaints():
    db = get_db()
    cursor = db.cursor()

    cursor.execute("SELECT * FROM complaints;")
    rows = cursor.fetchall()
    
    complaints = []
    priority_order = {"CRITICAL": 4, "HIGH": 3, "MEDIUM": 2, "LOW": 1}

    for row in rows:
        item = dict(row)
        item["sla_remaining_minutes"] = calculate_sla_remaining_minutes(item.get("sla_deadline"))
        item["location"] = {
            "latitude": item["latitude"],
            "longitude": item["longitude"],
            "address": item["address"]
        }
        complaints.append(item)

    # Sort CRITICAL -> HIGH -> MEDIUM -> LOW, then by shortest SLA
    sorted_complaints = sorted(
        complaints,
        key=lambda c: (
            -priority_order.get(c.get("priority_level", "MEDIUM"), 1),
            c.get("sla_remaining_minutes", 360)
        )
    )

    db.close()
    return {"complaints": sorted_complaints}
