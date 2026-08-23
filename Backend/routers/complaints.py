from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from database import get_db
from schemas import ComplaintCreateSchema, StatusUpdateSchema, EvidenceUploadSchema
from services.complaint_service import create_complaint_service, calculate_sla_remaining_minutes, build_timeline_response
from services.verification_service import verify_resolution_proof

router = APIRouter(prefix="/api/complaints", tags=["Complaints"])

@router.post("", status_code=201)
def create_complaint(payload: ComplaintCreateSchema):
    try:
        return create_complaint_service(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{complaint_id}")
def get_complaint(complaint_id: str):
    db = get_db()
    cursor = db.cursor()

    cursor.execute("SELECT * FROM complaints WHERE complaint_id = ?;", (complaint_id,))
    row = cursor.fetchone()
    if not row:
        db.close()
        raise HTTPException(status_code=404, detail=f"Complaint {complaint_id} not found")

    complaint = dict(row)
    complaint["sla_remaining_minutes"] = calculate_sla_remaining_minutes(complaint.get("sla_deadline"))
    complaint["timeline"] = build_timeline_response(complaint_id, complaint["status"], complaint["created_at"], db)
    complaint["location"] = {
        "latitude": complaint["latitude"],
        "longitude": complaint["longitude"],
        "address": complaint["address"]
    }

    # Fetch verification if exists
    cursor.execute("SELECT * FROM evidence WHERE complaint_id = ? ORDER BY id DESC LIMIT 1;", (complaint_id,))
    e_row = cursor.fetchone()
    if e_row:
        ev = dict(e_row)
        complaint["verification"] = {
            "status": ev["verification_status"],
            "score": ev["verification_score"],
            "location_match": bool(ev["location_match"]),
            "scene_match": bool(ev["scene_match"]),
            "issue_resolved": bool(ev["issue_resolved"])
        }

    db.close()
    return complaint

@router.patch("/{complaint_id}/status")
def update_status(complaint_id: str, payload: StatusUpdateSchema):
    db = get_db()
    cursor = db.cursor()

    cursor.execute("SELECT status FROM complaints WHERE complaint_id = ?;", (complaint_id,))
    row = cursor.fetchone()
    if not row:
        db.close()
        raise HTTPException(status_code=404, detail=f"Complaint {complaint_id} not found")

    old_status = row["status"]
    new_status = payload.status
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    cursor.execute("""
    UPDATE complaints 
    SET status = ?, updated_at = ?
    WHERE complaint_id = ?;
    """, (new_status, now_str, complaint_id))

    cursor.execute("""
    INSERT INTO complaint_status_history (complaint_id, old_status, new_status, updated_by, reason, created_at)
    VALUES (?, ?, ?, ?, ?, ?);
    """, (complaint_id, old_status, new_status, payload.updated_by, payload.reason, now_str))

    db.commit()
    db.close()

    return {"complaint_id": complaint_id, "status": new_status, "updated_at": now_str}

@router.post("/{complaint_id}/evidence")
def upload_evidence(complaint_id: str, payload: EvidenceUploadSchema):
    db = get_db()
    cursor = db.cursor()

    cursor.execute("SELECT latitude, longitude, image_url FROM complaints WHERE complaint_id = ?;", (complaint_id,))
    row = cursor.fetchone()
    if not row:
        db.close()
        raise HTTPException(status_code=404, detail=f"Complaint {complaint_id} not found")

    orig_lat = row["latitude"]
    orig_lon = row["longitude"]
    orig_img = row["image_url"] or ""

    v_res = verify_resolution_proof(
        orig_lat=orig_lat,
        orig_lon=orig_lon,
        evidence_lat=payload.latitude,
        evidence_lon=payload.longitude,
        orig_image_url=orig_img,
        evidence_image_url=payload.image_url
    )
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    captured_at_str = payload.captured_at or now_str

    new_status = "VERIFIED" if v_res["status"] == "PASSED" else "REOPENED"

    cursor.execute("""
    INSERT INTO evidence (
        complaint_id, image_url, latitude, longitude, captured_at,
        location_match, scene_match, issue_resolved, verification_score, verification_status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, (
        complaint_id, payload.image_url, payload.latitude, payload.longitude, captured_at_str,
        1 if v_res["location_match"] else 0,
        1 if v_res["scene_match"] else 0,
        1 if v_res["issue_resolved"] else 0,
        v_res["score"], v_res["status"], now_str
    ))

    cursor.execute("""
    UPDATE complaints 
    SET status = ?, resolution_image_url = ?, updated_at = ?
    WHERE complaint_id = ?;
    """, (new_status, payload.image_url, now_str, complaint_id))

    cursor.execute("""
    INSERT INTO complaint_status_history (complaint_id, old_status, new_status, updated_by, reason, created_at)
    VALUES (?, 'AWAITING_VERIFICATION', ?, 'AI_VERIFIER', 'Resolution proof uploaded and evaluated', ?);
    """, (complaint_id, new_status, now_str))

    db.commit()
    db.close()

    return {
        "complaint_id": complaint_id,
        "status": new_status,
        "verification": v_res
    }
