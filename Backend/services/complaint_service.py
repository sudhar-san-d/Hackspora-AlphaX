from datetime import datetime, timedelta
import random
import json
from database import get_db
from services.ai_service import analyze_image_member1, generate_decision_member2

def generate_complaint_id(cursor):
    cursor.execute("SELECT id FROM complaints ORDER BY id DESC LIMIT 1;")
    row = cursor.fetchone()
    if row:
        next_num = row["id"] + 1000 + 1
    else:
        next_num = 1001
    return f"CT-{next_num}"

def calculate_sla_remaining_minutes(deadline_str: str) -> int:
    if not deadline_str:
        return 360
    try:
        deadline = datetime.strptime(deadline_str, "%Y-%m-%d %H:%M:%S")
        now = datetime.now()
        diff = deadline - now
        minutes = int(diff.total_seconds() / 60)
        return max(0, minutes)
    except Exception:
        return 360

def build_timeline_response(complaint_id: str, status: str, created_at: str, db):
    cursor = db.cursor()
    cursor.execute("""
    SELECT old_status, new_status, updated_by, reason, created_at
    FROM complaint_status_history
    WHERE complaint_id = ?
    ORDER BY id ASC;
    """, (complaint_id,))
    history = cursor.fetchall()

    timeline = [
        {"title": "Complaint Submitted", "time": created_at, "completed": True},
        {"title": "AI Analyzed", "time": created_at, "completed": True},
        {"title": "Department Assigned", "time": created_at, "completed": True},
        {"title": "Officer Assigned", "time": created_at, "completed": status not in ["SUBMITTED", "ANALYZING"], "officer": "Ravi K. (Field Officer #12)"},
        {"title": "Field Action", "time": "In Progress" if status == "FIELD_ACTION" else "Pending", "completed": status in ["FIELD_ACTION", "AWAITING_VERIFICATION", "VERIFIED"], "inProgress": status == "FIELD_ACTION"},
        {"title": "Resolution Verification", "time": "Pending", "completed": status in ["AWAITING_VERIFICATION", "VERIFIED"], "inProgress": status == "AWAITING_VERIFICATION"},
        {"title": "Closed", "time": "Pending", "completed": status == "VERIFIED"}
    ]

    return timeline

def create_complaint_service(payload):
    db = get_db()
    cursor = db.cursor()

    complaint_id = generate_complaint_id(cursor)
    now = datetime.now()
    created_str = now.strftime("%Y-%m-%d %H:%M:%S")

    # Step 1: Member 1 Vision AI analysis
    v_res = analyze_image_member1(payload.image_url, complaint_id)

    # Step 2: Member 2 Decision AI
    d_res = generate_decision_member2(
        description=payload.description,
        location=payload.location.dict(),
        image_analysis=v_res,
        complaint_id=complaint_id
    )

    # Extract Decision AI Outputs
    cat = d_res["classification"]["category"]
    subcat = d_res["classification"]["subcategory"]
    issue = d_res["classification"]["issue"]
    dept = d_res["responsibility"]["primary_department"]
    p_score = d_res["priority"]["priority_score"]
    p_level = d_res["priority"]["priority_level"]
    sla_h = d_res["sla"]["target_hours"]
    ai_confidence = d_res["ai"]["confidence"]
    ai_reason = d_res["ai"]["reason"]

    deadline_str = (now + timedelta(hours=sla_h)).strftime("%Y-%m-%d %H:%M:%S")

    cursor.execute("""
    INSERT INTO complaints (
        complaint_id, citizen_id, description, image_url, latitude, longitude, address,
        ward, zone, category, subcategory, issue, primary_department, multi_agency,
        severity, urgency, public_risk, priority_score, priority_level, sla_hours,
        sla_deadline, status, assigned_officer, ai_confidence, ai_reason, created_at, updated_at
    ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 8, 8, 8, ?, ?, ?,
        ?, 'SUBMITTED', 'Ravi K. (Field Officer #12)', ?, ?, ?, ?
    );
    """, (
        complaint_id, payload.citizen_id, payload.description, payload.image_url,
        payload.location.latitude, payload.location.longitude, payload.location.address,
        payload.location.ward, payload.location.zone, cat, subcat, issue, dept,
        p_score, p_level, sla_h, deadline_str, ai_confidence, ai_reason, created_str, created_str
    ))

    cursor.execute("""
    INSERT INTO complaint_status_history (complaint_id, old_status, new_status, updated_by, reason, created_at)
    VALUES (?, 'NONE', 'SUBMITTED', 'CITIZEN', 'Complaint submitted via App', ?);
    """, (complaint_id, created_str))

    db.commit()

    # Build response object matching frontend contracts
    response_data = {
        "complaint_id": complaint_id,
        "citizen_id": payload.citizen_id,
        "issue": issue,
        "category": cat,
        "department": dept,
        "priority": p_score,
        "priority_level": p_level,
        "status": "SUBMITTED",
        "sla_remaining_minutes": sla_h * 60,
        "description": payload.description,
        "image_url": payload.image_url,
        "location": {
            "latitude": payload.location.latitude,
            "longitude": payload.location.longitude,
            "address": payload.location.address
        },
        "ai_explanation": ai_reason,
        "created_at": created_str,
        "timeline": build_timeline_response(complaint_id, "SUBMITTED", created_str, db)
    }

    db.close()
    return response_data
