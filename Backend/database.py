import sqlite3
import os
from config import DATABASE_PATH

def get_db():
    conn = sqlite3.connect(DATABASE_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Complaints Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS complaints (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        complaint_id TEXT UNIQUE NOT NULL,
        citizen_id TEXT NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        address TEXT,
        ward TEXT,
        zone TEXT,
        category TEXT,
        subcategory TEXT,
        issue TEXT,
        primary_department TEXT,
        secondary_departments TEXT,
        multi_agency INTEGER DEFAULT 0,
        severity INTEGER DEFAULT 5,
        urgency INTEGER DEFAULT 5,
        public_risk INTEGER DEFAULT 5,
        priority_score INTEGER DEFAULT 50,
        priority_level TEXT DEFAULT 'MEDIUM',
        sla_hours INTEGER DEFAULT 48,
        sla_deadline TEXT,
        status TEXT DEFAULT 'SUBMITTED',
        assigned_officer TEXT,
        resolution_image_url TEXT,
        ai_confidence REAL DEFAULT 0.90,
        ai_reason TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    );
    """)

    # Evidence Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS evidence (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        complaint_id TEXT NOT NULL,
        image_url TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        captured_at TEXT NOT NULL,
        location_match INTEGER DEFAULT 1,
        scene_match INTEGER DEFAULT 1,
        issue_resolved INTEGER DEFAULT 1,
        verification_score INTEGER DEFAULT 90,
        verification_status TEXT DEFAULT 'PASSED',
        created_at TEXT NOT NULL,
        FOREIGN KEY(complaint_id) REFERENCES complaints(complaint_id)
    );
    """)

    # Complaint Status History Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS complaint_status_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        complaint_id TEXT NOT NULL,
        old_status TEXT,
        new_status TEXT NOT NULL,
        updated_by TEXT,
        reason TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY(complaint_id) REFERENCES complaints(complaint_id)
    );
    """)

    # Seed initial demo complaints if empty
    cursor.execute("SELECT COUNT(*) FROM complaints;")
    count = cursor.fetchone()[0]
    if count == 0:
        seed_demo_data(cursor)

    conn.commit()
    conn.close()

def seed_demo_data(cursor):
    from datetime import datetime, timedelta

    now = datetime.now()
    created_str = now.strftime("%Y-%m-%d %H:%M:%S")
    deadline_str = (now + timedelta(hours=6)).strftime("%Y-%m-%d %H:%M:%S")

    cursor.execute("""
    INSERT INTO complaints (
        complaint_id, citizen_id, description, image_url, latitude, longitude, address,
        ward, zone, category, subcategory, issue, primary_department, multi_agency,
        severity, urgency, public_risk, priority_score, priority_level, sla_hours,
        sla_deadline, status, assigned_officer, ai_confidence, ai_reason, created_at, updated_at
    ) VALUES (
        'CT-1001', 'U1001', 'Large pothole near the bus stop causing severe traffic hazard.',
        'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=800&auto=format&fit=crop',
        11.0168, 76.9558, 'Near Central Bus Station, Sector 4',
        'Ward 14', 'Central', 'Road Infrastructure', 'Road Damage', 'Pothole',
        'Roads Department', 0, 8, 9, 9, 86, 'CRITICAL', 6,
        ?, 'FIELD_ACTION', 'Ravi K. (Field Officer #12)', 0.94,
        'Large pothole near a school and bus stop, creating significant vehicle and pedestrian safety risk.',
        ?, ?
    );
    """, (deadline_str, created_str, created_str))

    cursor.execute("""
    INSERT INTO complaint_status_history (complaint_id, old_status, new_status, updated_by, reason, created_at)
    VALUES ('CT-1001', 'SUBMITTED', 'FIELD_ACTION', 'OFFICER_12', 'Started field repair action', ?);
    """, (created_str,))
