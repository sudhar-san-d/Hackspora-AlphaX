import random

def analyze_image_member1(image_url: str, complaint_id: str = "CT-1001"):
    """
    Member 1 — Vision AI Engine Mock Service
    Analyzes visual features, damage indicators, safety risk, and confidence.
    """
    # Simple heuristic based on image keywords or default pothole fallback
    url_lower = image_url.lower()
    
    if "drain" in url_lower:
        issue = "Open Drain"
        infra = "Sanitation"
        damage = ["uncovered sewer", "open trench"]
        safety = ["fall hazard", "sanitation risk"]
    elif "garbage" in url_lower or "trash" in url_lower:
        issue = "Garbage Dump Overflow"
        infra = "Public Health"
        damage = ["waste pile-up", "blocked walkway"]
        safety = ["biohazard", "pest attraction"]
    else:
        issue = "Pothole"
        infra = "Road"
        damage = ["broken asphalt", "deep road depression"]
        safety = ["vehicle hazard", "pedestrian trip risk"]

    return {
        "complaint_id": complaint_id,
        "image_analysis": {
            "detected_issue": issue,
            "infrastructure": infra,
            "visual_description": f"Detected significant {issue.lower()} on visual inspection.",
            "damage_indicators": damage,
            "safety_indicators": safety,
            "estimated_visual_severity": random.randint(7, 9),
            "confidence": 0.94
        }
    }

def generate_decision_member2(description: str, location: dict, image_analysis: dict, complaint_id: str = "CT-1001"):
    """
    Member 2 — Decision AI Engine Service
    Computes priority score (0-100), urgency level, department routing, SLA target hours, and AI rationale.
    """
    detected_issue = image_analysis.get("image_analysis", {}).get("detected_issue", "Pothole")
    desc_lower = description.lower()

    if "drain" in desc_lower or detected_issue == "Open Drain":
        category = "Sanitation"
        subcategory = "Drainage"
        issue = "Open Drain"
        primary_dept = "Drainage & Waste Dept."
        severity, urgency, public_risk = 8, 8, 8
        priority_score = 78
        priority_level = "HIGH"
        sla_hours = 12
    elif "garbage" in desc_lower or detected_issue == "Garbage Dump Overflow":
        category = "Public Health"
        subcategory = "Solid Waste"
        issue = "Garbage Dump Overflow"
        primary_dept = "Sanitation Dept."
        severity, urgency, public_risk = 9, 9, 9
        priority_score = 92
        priority_level = "CRITICAL"
        sla_hours = 6
    else:
        category = "Road Infrastructure"
        subcategory = "Road Damage"
        issue = "Pothole"
        primary_dept = "Roads Department"
        severity, urgency, public_risk = 8, 9, 9
        priority_score = 86
        priority_level = "CRITICAL"
        sla_hours = 6

    ai_reason = f"Large {issue.lower()} identified near high-density traffic area. Creates significant vehicle and pedestrian safety risk."

    return {
        "complaint_id": complaint_id,
        "classification": {
            "category": category,
            "subcategory": subcategory,
            "issue": issue
        },
        "responsibility": {
            "primary_department": primary_dept,
            "secondary_departments": [],
            "multi_agency": False
        },
        "priority": {
            "severity": severity,
            "urgency": urgency,
            "public_risk": public_risk,
            "population_impact": 8,
            "location_risk": 9,
            "priority_score": priority_score,
            "priority_level": priority_level
        },
        "sla": {
            "target_hours": sla_hours
        },
        "location": {
            "latitude": location.get("latitude", 11.0168),
            "longitude": location.get("longitude", 76.9558),
            "ward": location.get("ward", "Ward 14"),
            "zone": location.get("zone", "Central")
        },
        "incident": {
            "possible_duplicate": False,
            "duplicate_confidence": 0.12
        },
        "ai": {
            "confidence": 0.93,
            "reason": ai_reason
        }
    }
