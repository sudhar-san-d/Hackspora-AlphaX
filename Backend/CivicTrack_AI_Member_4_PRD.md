# CivicTrack AI — Member 4 PRD
## Backend + Database + Integration + Admin Dashboard

**Project:** CivicTrack AI  
**Role:** Member 4 — Backend / System Integration / Admin Dashboard  
**Hackathon Constraint:** 7-hour development window  
**Primary Responsibilities:** API, database, AI integration, complaint lifecycle, SLA, evidence verification, admin dashboard

---

# 1. Objective

Build the backend that connects all CivicTrack AI modules into one working system.

The backend is the **single source of truth** for:

- Complaint records
- AI results
- Department assignment
- Priority
- SLA
- Officer assignment
- Complaint status
- Resolution evidence
- Verification result
- Dashboard statistics

The backend connects:

```text
Citizen Frontend
       |
       v
   MEMBER 4
   BACKEND
       |
       +-----------> Member 1
       |             Image AI
       |
       +-----------> Member 2
       |             Decision AI
       |
       +-----------> Database
       |
       +-----------> Resolution Verification
       |
       v
Officer / Admin Frontend
```

---

# 2. Core Principle

The backend must enforce:

> **A complaint cannot become VERIFIED simply because an officer marks it as resolved.**

The expected workflow is:

```text
SUBMITTED
    ↓
ANALYZING
    ↓
ASSIGNED
    ↓
ACKNOWLEDGED
    ↓
FIELD_ACTION
    ↓
AWAITING_VERIFICATION
    ↓
VERIFIED
    ↓
RESOLVED
```

If verification fails:

```text
AWAITING_VERIFICATION
        ↓
REOPENED
```

---

# 3. Scope

## In Scope

- REST API
- Complaint creation
- Image upload handling
- Member 1 integration
- Member 2 integration
- Complaint database
- Department routing
- Officer assignment
- Priority storage
- SLA calculation/tracking
- Complaint status management
- Resolution evidence upload
- Geo-tag validation
- Resolution verification
- Admin dashboard APIs
- Basic analytics
- Duplicate/related complaint support
- Escalation logic

## Out of Scope

For the 7-hour MVP, avoid:

- Complex microservices
- Production-grade authentication
- Payment systems
- Full government API integrations
- Complex blockchain implementation
- Advanced distributed systems
- Custom ML model training

---

# 4. Recommended Technology

Use the team's existing stack where possible.

### Backend

```text
Python
Django
Django REST Framework
```

### Database

```text
MySQL
```

SQLite can be used during rapid development if MySQL setup becomes a blocker.

### Storage

For the hackathon:

```text
Cloudinary / Supabase Storage / Firebase Storage
```

or local storage for the demo.

### API

```text
REST API
JSON
```

---

# 5. Overall Backend Architecture

```text
                     FRONTEND
                        |
                        v
                 +-------------+
                 | API Layer   |
                 | Django REST |
                 +------+------+
                        |
             +----------+----------+
             |                     |
             v                     v
       Complaint Service      Officer Service
             |
             v
          Database
             |
      +------+------+
      |             |
      v             v
  Member 1       Member 2
  Vision AI      Decision AI
      |             |
      +------+------+
             |
             v
       Decision JSON
             |
             v
      Routing + SLA
             |
             v
      Complaint State
             |
             v
       Evidence Upload
             |
             v
     Resolution Verification
             |
             v
      VERIFIED / REOPENED
```

---

# 6. Database Design

For the MVP, use the following core tables.

---

# 7. Complaints Table

Suggested fields:

```text
complaints

id
complaint_id
citizen_id
description
image_url

latitude
longitude
ward
zone

category
subcategory
issue

primary_department
secondary_departments
multi_agency

severity
urgency
public_risk
population_impact
location_risk
sla_risk

priority_score
priority_level
sla_hours
sla_deadline

status

ai_confidence
ai_reason

created_at
updated_at
```

---

# 8. Users Table

```text
users

id
name
email
role
department
created_at
```

Roles:

```text
CITIZEN
OFFICER
ADMIN
```

For the hackathon, authentication can be simplified or mocked.

---

# 9. Departments Table

```text
departments

id
name
description
```

Example:

```text
Roads Department
Drainage Department
Water Department
Waste Management
Electrical Department
Traffic Department
Environment Department
```

---

# 10. Evidence Table

```text
evidence

id
complaint_id

image_url

latitude
longitude
captured_at

location_match
scene_match
issue_resolved

verification_score
verification_status

created_at
```

---

# 11. Complaint Status History

This is important for transparency.

```text
complaint_status_history

id
complaint_id

old_status
new_status

updated_by
reason

created_at
```

Example:

```text
SUBMITTED → ANALYZING
ANALYZING → ASSIGNED
ASSIGNED → FIELD_ACTION
FIELD_ACTION → AWAITING_VERIFICATION
AWAITING_VERIFICATION → VERIFIED
```

This creates the audit trail that existing complaint portals often lack.

---

# 12. Complaint ID

Generate a unique human-readable ID.

Format:

```text
CT-1001
CT-1002
CT-1003
```

This ID must remain unchanged throughout the complaint lifecycle.

---

# 13. Complaint Creation API

## Endpoint

```http
POST /api/complaints
```

## Input

```json
{
  "citizen_id": "U1001",
  "description": "Large pothole near bus stop.",
  "image_url": "image.jpg",
  "location": {
    "latitude": 11.0168,
    "longitude": 76.9558
  }
}
```

---

# 14. Complaint Creation Flow

When the request arrives:

```text
POST /api/complaints
        ↓
Generate complaint_id
        ↓
Store complaint
        ↓
status = ANALYZING
        ↓
Send image to Member 1
        ↓
Receive Image Analysis JSON
        ↓
Send combined data to Member 2
        ↓
Receive Decision JSON
        ↓
Store AI results
        ↓
Assign department
        ↓
Calculate SLA
        ↓
Assign officer
        ↓
status = ASSIGNED
        ↓
Return result to frontend
```

---

# 15. Member 1 Integration

Call:

```http
POST /api/ai/analyze-image
```

or directly invoke the Member 1 service.

### Input

```json
{
  "complaint_id": "CT-1001",
  "image_url": "image.jpg"
}
```

### Expected Response

```json
{
  "complaint_id": "CT-1001",
  "image_analysis": {
    "detected_issue": "Pothole",
    "infrastructure": "Road",
    "visual_description": "Large pothole on paved road.",
    "damage_indicators": [
      "broken asphalt",
      "deep road depression"
    ],
    "safety_indicators": [
      "vehicle hazard"
    ],
    "estimated_visual_severity": 8,
    "confidence": 0.94
  }
}
```

Store this result.

---

# 16. Member 2 Integration

Send:

```text
Citizen Description
+
Location
+
Ward / Zone
+
Member 1 Image Analysis
```

to Member 2.

### Endpoint

```http
POST /api/ai/decide
```

### Expected Response

```json
{
  "complaint_id": "CT-1001",

  "classification": {
    "category": "Road Infrastructure",
    "subcategory": "Road Damage",
    "issue": "Pothole"
  },

  "responsibility": {
    "primary_department": "Roads Department",
    "secondary_departments": [],
    "multi_agency": false
  },

  "priority": {
    "severity": 8,
    "urgency": 9,
    "public_risk": 9,
    "population_impact": 7,
    "location_risk": 9,
    "sla_risk": 6,
    "priority_score": 85,
    "priority_level": "CRITICAL"
  },

  "sla": {
    "target_hours": 6
  },

  "location": {
    "latitude": 11.0168,
    "longitude": 76.9558,
    "ward": "Ward 14",
    "zone": "Central"
  },

  "incident": {
    "possible_duplicate": false,
    "duplicate_confidence": 0.12
  },

  "ai": {
    "confidence": 0.93,
    "reason": "Large pothole near a school and bus stop creates significant vehicle and pedestrian safety risk."
  }
}
```

---

# 17. Storing AI Decision

Store at least:

```text
category
subcategory
issue
primary_department
secondary_departments
multi_agency

severity
urgency
public_risk
population_impact
location_risk
priority_score
priority_level

sla_hours
sla_deadline

ai_confidence
ai_reason
```

---

# 18. Department Assignment

After Member 2 returns the department:

```text
primary_department
        ↓
Find department
        ↓
Find available officer
        ↓
Assign complaint
```

For the hackathon, use simple round-robin or predefined officer assignment.

Example:

```text
Roads Department
    ↓
Officer: Ravi
```

---

# 19. Officer Assignment

Create a simple assignment function:

```text
assign_officer(complaint)
```

Priority can influence assignment.

Example:

```text
CRITICAL
    ↓
Nearest available officer
```

For the MVP, this can be simulated using predefined officers.

---

# 20. Get Complaint API

## Endpoint

```http
GET /api/complaints/{complaint_id}
```

## Response

```json
{
  "complaint_id": "CT-1001",
  "issue": "Pothole",
  "category": "Road Infrastructure",
  "department": "Roads Department",

  "priority": {
    "score": 85,
    "level": "CRITICAL"
  },

  "status": "FIELD_ACTION",

  "sla": {
    "target_hours": 6,
    "remaining_minutes": 462
  },

  "location": {
    "latitude": 11.0168,
    "longitude": 75.9558
  },

  "timeline": [
    {
      "status": "SUBMITTED",
      "timestamp": "2026-08-23T10:42:00+05:30"
    },
    {
      "status": "ANALYZING",
      "timestamp": "2026-08-23T10:42:05+05:30"
    },
    {
      "status": "ASSIGNED",
      "timestamp": "2026-08-23T10:43:00+05:30"
    }
  ]
}
```

---

# 21. Officer Complaints API

## Endpoint

```http
GET /api/officer/complaints
```

Return:

```json
{
  "complaints": [
    {
      "complaint_id": "CT-1001",
      "issue": "Pothole",
      "priority": 85,
      "priority_level": "CRITICAL",
      "status": "FIELD_ACTION",
      "sla_remaining_minutes": 462
    }
  ]
}
```

Sort by:

```text
Priority DESC
+
SLA remaining ASC
```

---

# 22. Status Update API

## Endpoint

```http
PATCH /api/complaints/{complaint_id}/status
```

### Input

```json
{
  "status": "FIELD_ACTION",
  "updated_by": "OFFICER_12"
}
```

---

# 23. Valid Status Transitions

Use controlled transitions.

```text
SUBMITTED
    ↓
ANALYZING
    ↓
ASSIGNED
    ↓
ACKNOWLEDGED
    ↓
FIELD_ACTION
    ↓
AWAITING_VERIFICATION
    ↓
VERIFIED
    ↓
RESOLVED
```

Alternative:

```text
AWAITING_VERIFICATION
        ↓
REOPENED
        ↓
FIELD_ACTION
```

Escalation:

```text
Any active state
        ↓
ESCALATED
```

Do not allow arbitrary transitions such as:

```text
SUBMITTED → RESOLVED
```

---

# 24. SLA System

Calculate:

```text
SLA Deadline =
Complaint Created Time + Target SLA
```

Recommended MVP:

```text
CRITICAL → 6 hours
HIGH     → 12 hours
MEDIUM   → 48 hours
LOW      → 120 hours
```

Store:

```text
sla_hours
sla_deadline
```

Calculate remaining time dynamically.

---

# 25. SLA Monitoring

A complaint is overdue when:

```text
current_time > sla_deadline
```

Then:

```text
sla_status = BREACHED
```

Dashboard should show:

```text
⚠ OVERDUE
```

---

# 26. Escalation

For the MVP:

```text
IF SLA breached
AND complaint not VERIFIED
THEN
status = ESCALATED
```

Example:

```text
Officer
   ↓
Department Supervisor
```

Store escalation in status history.

---

# 27. Resolution Evidence API

## Endpoint

```http
POST /api/complaints/{complaint_id}/evidence
```

### Input

```json
{
  "image_url": "after-image.jpg",
  "latitude": 11.0169,
  "longitude": 11.9559,
  "captured_at": "2026-08-23T11:30:00+05:30"
}
```

The backend should obtain the complaint's original coordinates from the database.

---

# 28. Evidence Processing

After receiving evidence:

```text
Upload After Photo
        ↓
Store Evidence
        ↓
Compare Evidence GPS
        ↓
Check Location Match
        ↓
AI/Rule Verification
        ↓
Calculate Verification Score
        ↓
PASS / FAIL / MANUAL REVIEW
```

---

# 29. Geo-Location Verification

Calculate distance between:

```text
Original Complaint GPS
             +
Resolution Evidence GPS
```

For a hackathon MVP, use a simple threshold.

Example:

```text
Distance <= 100 meters
        ↓
Location Match = TRUE
```

Otherwise:

```text
Location Match = FALSE
```

The threshold should be configurable.

---

# 30. Resolution Verification

For the MVP, combine:

```text
Location Match
+
Before/After Scene Similarity
+
AI Resolution Assessment
```

Example:

```text
Location Match     = TRUE
Scene Match        = TRUE
Issue Resolved     = TRUE
```

Then:

```text
Verification Score = 93
```

---

# 31. Verification API Response

```json
{
  "verification": {
    "status": "PASSED",
    "score": 93,
    "location_match": true,
    "scene_match": true,
    "issue_resolved": true
  }
}
```

Possible statuses:

```text
PASSED
FAILED
MANUAL_REVIEW
```

---

# 32. Verification Decision

Simple MVP rule:

```text
IF location_match = TRUE
AND issue_resolved = TRUE
AND verification_score >= 80

THEN
    status = VERIFIED
```

Otherwise:

```text
status = REOPENED
```

If uncertain:

```text
status = MANUAL_REVIEW
```

---

# 33. Important Anti-Fake-Closure Rule

Never accept:

```json
{
  "status": "RESOLVED"
}
```

as proof that work was actually completed.

The backend should require:

```text
Resolution Photo
+
GPS
+
Timestamp
+
Verification
```

before allowing:

```text
VERIFIED
```

This is one of the main CivicTrack differentiators.

---

# 34. Admin Dashboard API

Member 4 should provide aggregated data for the dashboard.

## Endpoint

```http
GET /api/admin/dashboard
```

Example:

```json
{
  "statistics": {
    "total": 48,
    "active": 17,
    "critical": 6,
    "overdue": 3,
    "verified": 31
  },

  "departments": [
    {
      "name": "Roads Department",
      "active": 8,
      "overdue": 2
    },
    {
      "name": "Drainage Department",
      "active": 5,
      "overdue": 1
    }
  ]
}
```

---

# 35. Complaint Map API

## Endpoint

```http
GET /api/admin/complaints/map
```

Return:

```json
{
  "complaints": [
    {
      "complaint_id": "CT-1001",
      "latitude": 11.0168,
      "longitude": 75.9558,
      "issue": "Pothole",
      "priority": 85,
      "priority_level": "CRITICAL",
      "status": "FIELD_ACTION"
    }
  ]
}
```

This allows Member 3 or the admin dashboard to render a GIS map.

---

# 36. Department Analytics

Return:

```text
Total complaints
Active complaints
Resolved complaints
Overdue complaints
Average resolution time
Critical complaints
```

Example:

```json
{
  "department": "Roads Department",
  "total": 20,
  "active": 7,
  "resolved": 11,
  "overdue": 2,
  "average_resolution_hours": 8.4
}
```

---

# 37. Duplicate / Root-Cause Support

Member 2 may return:

```json
{
  "possible_duplicate": true,
  "duplicate_confidence": 0.87
}
```

Backend should store this.

For a stronger demo, allow related complaints to be grouped:

```text
CT-1001
CT-1014
CT-1022
CT-1030
       ↓
ROOT INCIDENT: ROAD DAMAGE — MAIN STREET
```

This demonstrates the project's **persistent infrastructure failure** concept.

For the 7-hour MVP, this can be a simple grouping mechanism rather than a full ML system.

---

# 38. Multi-Agency Support

Store:

```text
primary_department
secondary_departments
multi_agency
```

Example:

```json
{
  "primary_department": "Water Department",
  "secondary_departments": [
    "Roads Department",
    "Traffic Department"
  ],
  "multi_agency": true
}
```

The admin dashboard can display:

```text
MULTI-AGENCY
```

This is a strong hackathon differentiator.

---

# 39. Audit Trail

Every important action should create a status-history record.

Example:

```json
{
  "complaint_id": "CT-1001",
  "old_status": "FIELD_ACTION",
  "new_status": "AWAITING_VERIFICATION",
  "updated_by": "OFFICER_12",
  "reason": "Field work completed and proof uploaded."
}
```

This creates a transparent timeline.

---

# 40. Backend API List

Minimum required APIs:

```text
POST   /api/complaints
GET    /api/complaints/{id}

GET    /api/officer/complaints
PATCH  /api/complaints/{id}/status

POST   /api/complaints/{id}/evidence
GET    /api/complaints/{id}/verification

GET    /api/admin/dashboard
GET    /api/admin/complaints/map
GET    /api/admin/departments
```

Optional:

```text
GET    /api/admin/complaints
GET    /api/complaints/{id}/timeline
POST   /api/complaints/{id}/escalate
GET    /api/incidents/{id}
```

---

# 41. API Error Format

Use one consistent error format.

```json
{
  "error": {
    "code": "COMPLAINT_NOT_FOUND",
    "message": "Complaint CT-1001 was not found."
  }
}
```

Common errors:

```text
COMPLAINT_NOT_FOUND
INVALID_STATUS
AI_ANALYSIS_FAILED
AI_DECISION_FAILED
IMAGE_UPLOAD_FAILED
EVIDENCE_REQUIRED
VERIFICATION_FAILED
INVALID_LOCATION
```

---

# 42. Backend Validation

Validate:

### Complaint

```text
description exists
image exists
latitude exists
longitude exists
```

### AI Result

```text
priority_score: 0–100
priority_level: valid enum
confidence: 0–1
```

### Evidence

```text
image exists
latitude exists
longitude exists
timestamp exists
```

### Status

Only valid transitions are allowed.

---

# 43. Security for MVP

At minimum:

- Keep AI API keys on backend
- Never expose API keys to React
- Validate uploaded file types
- Limit image size
- Validate API input
- Do not trust frontend status changes
- Use environment variables for secrets

Example:

```text
.env

AI_API_KEY=...
DATABASE_URL=...
STORAGE_KEY=...
```

Never commit `.env` to GitHub.

---

# 44. Recommended Backend Structure

For Django:

```text
backend/
│
├── manage.py
│
├── civictrack/
│   ├── settings.py
│   ├── urls.py
│   └── ...
│
├── complaints/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   ├── services.py
│   └── utils.py
│
├── ai/
│   ├── member1.py
│   ├── member2.py
│   └── prompts.py
│
├── verification/
│   ├── services.py
│   └── utils.py
│
└── dashboard/
    ├── views.py
    └── serializers.py
```

---

# 45. Recommended Service Separation

Keep business logic outside views.

Example:

```python
create_complaint()
analyze_image()
generate_decision()
assign_department()
assign_officer()
calculate_sla()
submit_evidence()
verify_resolution()
escalate_complaint()
```

Views should mainly handle:

```text
Request
↓
Validation
↓
Service
↓
Response
```

---

# 46. End-to-End Complaint Flow

## Stage 1 — Submission

```text
Citizen
 ↓
POST /api/complaints
 ↓
Create CT-1001
 ↓
SUBMITTED
```

---

## Stage 2 — AI Analysis

```text
Backend
 ↓
Member 1
 ↓
Image Analysis JSON
```

---

## Stage 3 — AI Decision

```text
Backend
 ↓
Member 2
 ↓
Classification
Department
Priority
SLA
```

---

## Stage 4 — Assignment

```text
Department
 ↓
Officer
 ↓
ASSIGNED
```

---

## Stage 5 — Field Action

```text
Officer
 ↓
FIELD_ACTION
```

---

## Stage 6 — Proof

```text
Officer
 ↓
After Photo
+
GPS
+
Timestamp
 ↓
AWAITING_VERIFICATION
```

---

## Stage 7 — Verification

```text
Verification Engine
       ↓
   PASS / FAIL
       |
       +---- PASS → VERIFIED
       |
       +---- FAIL → REOPENED
```

---

# 47. Complete Data Flow

```text
┌───────────────┐
│    CITIZEN    │
└───────┬───────┘
        │
 Image + Text + GPS
        │
        ▼
┌───────────────┐
│    BACKEND    │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│    MEMBER 1   │
│   Vision AI   │
└───────┬───────┘
        │
 Image Analysis
        │
        ▼
┌───────────────┐
│    MEMBER 2   │
│ AI + FUZZY    │
└───────┬───────┘
        │
 Decision JSON
        │
        ▼
┌───────────────┐
│    BACKEND    │
│ Route + SLA   │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│    OFFICER    │
└───────┬───────┘
        │
 After Photo + GPS
        │
        ▼
┌───────────────┐
│ VERIFICATION  │
└───────┬───────┘
        │
        ├──── PASS ────► VERIFIED
        │
        └──── FAIL ────► REOPENED
```

---

# 48. Definition of Done

Member 4 is complete when:

- [ ] Backend server runs
- [ ] Database is connected
- [ ] Complaint creation works
- [ ] Complaint ID is generated
- [ ] Member 1 integration works
- [ ] Member 2 integration works
- [ ] AI result is stored
- [ ] Department is assigned
- [ ] Officer is assigned
- [ ] Priority is stored
- [ ] SLA is calculated
- [ ] Complaint timeline is stored
- [ ] Officer complaints API works
- [ ] Status transitions are controlled
- [ ] Evidence upload works
- [ ] GPS verification works
- [ ] Resolution verification works
- [ ] Verified/reopened states work
- [ ] SLA breach detection works
- [ ] Admin statistics API works
- [ ] Complaint map API works
- [ ] Frontend can consume all required APIs
- [ ] Complete end-to-end demo works

---

# 49. 7-Hour Implementation Plan

## Hour 1 — Database + Project Setup

Build:

```text
Django
Database
Complaint Model
User Model
Department Model
Evidence Model
Status History
```

---

## Hour 2 — Complaint APIs

Implement:

```text
POST /api/complaints
GET /api/complaints/{id}
PATCH /api/complaints/{id}/status
```

Test with Postman.

---

## Hour 3 — AI Integration

Connect:

```text
Backend
 ↓
Member 1
 ↓
Member 2
 ↓
Decision JSON
```

Store the complete result.

---

## Hour 4 — Assignment + SLA

Implement:

```text
Department assignment
Officer assignment
Priority
SLA
Status timeline
```

---

## Hour 5 — Resolution Verification

Implement:

```text
Evidence upload
GPS comparison
Verification score
PASS / FAIL
```

---

## Hour 6 — Dashboard APIs

Implement:

```text
Statistics
Complaint list
Department analytics
Map data
Overdue complaints
```

---

## Hour 7 — Integration + Demo

Test:

```text
Citizen
 ↓
Backend
 ↓
Member 1
 ↓
Member 2
 ↓
Officer
 ↓
Evidence
 ↓
Verification
 ↓
Dashboard
```

Fix integration issues and freeze the MVP.

---

# 50. Hackathon Priority

## MUST HAVE

```text
1. Complaint API
2. Database
3. Member 1 integration
4. Member 2 integration
5. Department assignment
6. Priority storage
7. SLA
8. Status tracking
9. Evidence upload
10. Geo verification
11. Verified / Reopened
```

## SHOULD HAVE

```text
12. Officer assignment
13. Admin statistics
14. Complaint map
15. Escalation
16. Status audit trail
```

## CAN SKIP

```text
17. Full authentication
18. Blockchain
19. Complex microservices
20. Advanced duplicate ML
21. Production notifications
22. Full government integration
```

---

# 51. Strongest Backend Differentiators

The backend should make these three concepts work reliably:

## 1. AI-Based Routing

```text
Image + Text + Location
        ↓
AI
        ↓
Correct Department
```

## 2. Risk-Based Prioritization

```text
Severity
+
Urgency
+
Public Risk
+
Location
        ↓
Priority
```

## 3. Proof-Based Resolution

```text
Officer says "Resolved"
          ✗

Photo + GPS + Timestamp
          ↓
Verification
          ↓
VERIFIED
```

These three features should be prioritized over secondary functionality.

---

# 52. Final Responsibility

Member 4's job can be summarized as:

> **CONNECT EVERYTHING → STORE EVERYTHING → ENFORCE THE WORKFLOW → VERIFY THE OUTCOME**

The backend owns the complete lifecycle:

```text
CREATE
  ↓
ANALYZE
  ↓
CLASSIFY
  ↓
ROUTE
  ↓
PRIORITIZE
  ↓
ASSIGN
  ↓
TRACK
  ↓
VERIFY
  ↓
RESOLVE
```

---

# 53. Final Integration Rule

All members must agree on these fields before coding:

```text
complaint_id
image_url
description
location
category
issue
department
priority_score
priority_level
sla
status
verification
```

### Backend is the single source of truth.

The frontend displays backend state.

Member 1 provides image intelligence.

Member 2 provides decision intelligence.

Member 4 connects and enforces the system.

The final CivicTrack AI workflow is:

```text
REAL-WORLD PROBLEM
        ↓
CITIZEN REPORT
        ↓
AI UNDERSTANDS
        ↓
AI ROUTES + PRIORITIZES
        ↓
OFFICER ACTS
        ↓
OFFICER PROVIDES GEO-TAGGED PROOF
        ↓
SYSTEM VERIFIES
        ↓
ONLY THEN → VERIFIED RESOLUTION
```
