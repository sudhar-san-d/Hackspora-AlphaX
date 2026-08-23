from database import get_db

def get_admin_dashboard_stats():
    db = get_db()
    cursor = db.cursor()

    cursor.execute("SELECT COUNT(*) FROM complaints;")
    total = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM complaints WHERE status IN ('SUBMITTED', 'ANALYZING', 'ASSIGNED', 'FIELD_ACTION', 'AWAITING_VERIFICATION');")
    active = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM complaints WHERE priority_level = 'CRITICAL';")
    critical = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM complaints WHERE status = 'VERIFIED';")
    verified = cursor.fetchone()[0]

    # Department Breakdown
    cursor.execute("""
    SELECT primary_department, COUNT(*) as count 
    FROM complaints 
    GROUP BY primary_department;
    """)
    rows = cursor.fetchall()
    dept_stats = [{"name": r["primary_department"], "active": r["count"], "overdue": 0} for r in rows]

    db.close()

    return {
        "statistics": {
            "total": total,
            "active": active,
            "critical": critical,
            "overdue": 1,
            "verified": verified
        },
        "departments": dept_stats
    }

def get_complaints_map_data():
    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
    SELECT complaint_id, latitude, longitude, issue, priority_score, priority_level, status, primary_department, address
    FROM complaints;
    """)
    rows = cursor.fetchall()
    map_list = [dict(r) for r in rows]

    db.close()
    return {"complaints": map_list}
