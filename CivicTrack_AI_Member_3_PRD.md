# CivicTrack AI — Member 3 PRD
## Frontend: Citizen App + Officer Interface + Resolution Verification

**Project:** CivicTrack AI  
**Role:** Member 3 — Frontend Developer  
**Hackathon Constraint:** 7-hour development window  
**Primary Consumer:** Citizen / Field Officer / Admin  
**Backend:** Member 4  
**AI Engine:** Members 1 & 2

---

# 1. Objective

Build the frontend experience that demonstrates the complete CivicTrack AI workflow:

```text
Citizen reports issue
        ↓
AI analyzes complaint
        ↓
Department + Priority assigned
        ↓
Officer receives complaint
        ↓
Officer performs field action
        ↓
Officer uploads geo-tagged proof
        ↓
AI/Backend verifies resolution
        ↓
Complaint is VERIFIED / REOPENED
```

The frontend should make this workflow **visually clear within a few seconds of a judge opening the application**.

---

# 2. Main Frontend Goal

The frontend should answer three questions immediately:

### Citizen

> "What happened to my complaint?"

### Officer

> "What should I resolve first?"

### Admin

> "Which complaints are pending, critical, overdue, or resolved?"

For the 7-hour hackathon, Member 3 should prioritize the **Citizen + Officer experience**. The admin dashboard can be implemented by Member 4.

---

# 3. Frontend Architecture

```text
                    FRONTEND
                       |
        +--------------+--------------+
        |                             |
        v                             v
 CITIZEN INTERFACE              OFFICER INTERFACE
        |                             |
        |                             |
 Submit Complaint                Assigned Complaints
        |                             |
 Track Complaint                 Complaint Details
        |                             |
 View AI Decision                Start Work
        |                             |
 View Timeline                   Upload Proof
        |                             |
        +-------------+---------------+
                      |
                      v
                   BACKEND
                      |
          +-----------+-----------+
          |                       |
       Member 1                Member 2
       Vision AI              Decision AI
```

---

# 4. Recommended Technology

Use the team's existing stack.

### Recommended

```text
React
Vite
Tailwind CSS
Axios / Fetch
React Router
Lucide Icons
```

Avoid introducing unnecessary libraries during the hackathon.

---

# 5. Core Screens

Build only these essential screens:

```text
1. Citizen Home
2. Report Complaint
3. AI Analysis Result
4. Complaint Tracking
5. Officer Dashboard
6. Officer Complaint Details
7. Resolution Proof Upload
8. Resolution Verification
```

Do not spend time building:

- Complex authentication
- Profile management
- Settings
- Notifications center
- Advanced analytics
- Large admin system

These can be mocked if required.

---

# 6. Screen 1 — Citizen Home

## Purpose

Give citizens a simple entry point.

### UI

```text
CivicTrack AI

Report civic issues.
Track resolution.
Verify real work.

[ + Report a Problem ]

[ Track My Complaints ]
```

Optional:

```text
Active Complaints: 2
Resolved: 5
```

---

# 7. Screen 2 — Report Complaint

This is the most important citizen input screen.

## Required Inputs

### 1. Image

```text
┌─────────────────────────┐
│                         │
│     📷 Upload Image     │
│                         │
└─────────────────────────┘
```

Allow:

- Camera
- File upload
- Image preview
- Replace image

---

### 2. Description

```text
Describe the problem...

Example:
"Large pothole near the bus stop."
```

---

### 3. Location

Automatically obtain GPS if browser permission is available.

Display:

```text
📍 Location detected

11.0168, 76.9558
```

Allow manual fallback if GPS is unavailable.

---

### 4. Submit

```text
[ ANALYZE & SUBMIT ]
```

---

# 8. Frontend → Backend Input

When submitting:

```http
POST /api/complaints
```

Send:

```json
{
  "citizen_id": "U1001",
  "description": "Large pothole near the bus stop.",
  "image_url": "uploaded-image-url",
  "location": {
    "latitude": 11.0168,
    "longitude": 76.9558
  }
}
```

The frontend should not directly communicate with the AI models.

The backend controls:

```text
Frontend
   ↓
Backend
   ↓
Member 1
   ↓
Member 2
```

---

# 9. Loading / AI Analysis Screen

After submission, show an engaging analysis screen.

Example:

```text
Analyzing your complaint...

✓ Image received
✓ Identifying issue
● Determining responsible department
○ Calculating priority
○ Creating complaint ticket
```

This makes the AI workflow visible to judges.

---

# 10. Screen 3 — AI Analysis Result

Once Member 2 returns the decision, show:

```text
AI ANALYSIS COMPLETE

Detected Issue
Pothole

Department
Roads Department

Priority
🔴 CRITICAL

Score
86 / 100

Expected Resolution
6 Hours
```

---

# 11. AI Explanation

Show a short explanation:

```text
Why this priority?

Large pothole detected near a school
and bus stop, creating significant
vehicle and pedestrian safety risk.
```

This demonstrates **explainable AI**.

---

# 12. Complaint ID

Always prominently display:

```text
Complaint ID

CT-1001
```

Add:

```text
[ Copy ID ]
```

This ID is the universal identifier throughout the system.

---

# 13. Screen 4 — Complaint Tracking

Show a timeline.

```text
CT-1001

Pothole
CRITICAL
Roads Department

────────────────────

✓ Complaint Submitted
  10:42 AM

✓ AI Analyzed
  10:42 AM

✓ Department Assigned
  10:43 AM

✓ Officer Assigned
  10:47 AM

● Field Action
  In Progress

○ Resolution Verification

○ Closed
```

---

# 14. Status System

The frontend should support these statuses:

```text
SUBMITTED
ANALYZING
ASSIGNED
ACKNOWLEDGED
FIELD_ACTION
AWAITING_VERIFICATION
VERIFIED
RESOLVED
REOPENED
ESCALATED
```

The backend is the **single source of truth**.

Do not allow the frontend to independently mark complaints as resolved.

---

# 15. SLA Display

For active complaints, show a countdown.

Example:

```text
SLA

07h 42m remaining
```

Priority indicator:

```text
🔴 CRITICAL
```

For overdue complaints:

```text
⚠ SLA BREACHED
```

---

# 16. Screen 5 — Officer Dashboard

Officer should see assigned complaints.

Example:

```text
OFFICER DASHBOARD

Assigned: 12
Critical: 3
Overdue: 1

---------------------------------

CT-1001
Pothole
CRITICAL
Roads Department

SLA: 07h 42m

[ VIEW ]

---------------------------------

CT-1007
Open Drain
HIGH

SLA: 15h 21m

[ VIEW ]
```

---

# 17. Complaint Sorting

Default sorting:

```text
CRITICAL
   ↓
HIGH
   ↓
MEDIUM
   ↓
LOW
```

Within the same priority:

```text
Nearest / shortest SLA first
```

This visually demonstrates the value of the AI priority engine.

---

# 18. Screen 6 — Officer Complaint Details

Display:

```text
COMPLAINT CT-1001

Pothole
CRITICAL — 86/100

────────────────────

Location
📍 11.0168, 76.9558

Department
Roads Department

SLA
07h 42m remaining

Citizen Description
"Large pothole near bus stop."

AI Analysis
"Large pothole with broken asphalt..."

────────────────────

[ START FIELD ACTION ]

[ VIEW LOCATION ]
```

---

# 19. Start Field Action

When officer starts:

```http
PATCH /api/complaints/CT-1001/status
```

Request:

```json
{
  "status": "FIELD_ACTION",
  "updated_by": "OFFICER_12"
}
```

Frontend updates the timeline.

---

# 20. Screen 7 — Resolution Proof Upload

This is one of the **key differentiating features** of CivicTrack AI.

The complaint cannot simply be marked resolved.

The officer must provide proof.

Display:

```text
RESOLUTION PROOF

Upload a photo showing
the completed work.

[ 📷 TAKE PHOTO ]

[ UPLOAD PHOTO ]
```

---

# 21. Geo-Tagged Resolution

When uploading proof, capture the current location.

Send:

```json
{
  "complaint_id": "CT-1001",
  "image_url": "after-image.jpg",
  "location": {
    "latitude": 11.0169,
    "longitude": 76.9559
  },
  "captured_at": "2026-08-23T11:30:00+05:30"
}
```

The frontend should attempt to obtain current GPS.

---

# 22. Important UX Rule

Show the user that the evidence contains:

```text
📍 GPS Captured
🕐 Timestamp Captured
📷 Resolution Photo Added
```

This makes the **proof-of-work** concept visible to judges.

---

# 23. Screen 8 — Resolution Verification

After uploading:

```text
VERIFYING RESOLUTION...

✓ Photo received
✓ Location checked
● Comparing before/after condition
● Validating resolution
```

Then display the backend verification result.

---

# 24. Verification Passed

Example:

```text
        ✓

RESOLUTION VERIFIED

Score
93 / 100

Location Match
✓ Confirmed

Issue Resolution
✓ Confirmed

Evidence
✓ Valid
```

Then:

```text
Complaint Status
VERIFIED
```

---

# 25. Verification Failed

Example:

```text
        ⚠

VERIFICATION FAILED

The uploaded evidence could not
confirm that the original issue
was resolved.

[ REUPLOAD PROOF ]

[ REPORT ISSUE ]
```

Backend may change status to:

```text
REOPENED
```

---

# 26. Verification Response Contract

Frontend receives:

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

# 27. Frontend → Backend API Contract

## Create Complaint

```http
POST /api/complaints
```

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

## Get Complaint

```http
GET /api/complaints/{complaint_id}
```

Example response:

```json
{
  "complaint_id": "CT-1001",
  "status": "FIELD_ACTION",
  "issue": "Pothole",
  "department": "Roads Department",
  "priority": 86,
  "priority_level": "CRITICAL",
  "sla_remaining_minutes": 462
}
```

---

## Get Officer Complaints

```http
GET /api/officer/complaints
```

Expected:

```json
{
  "complaints": [
    {
      "complaint_id": "CT-1001",
      "issue": "Pothole",
      "priority": 86,
      "priority_level": "CRITICAL",
      "status": "FIELD_ACTION",
      "sla_remaining_minutes": 462
    }
  ]
}
```

---

## Update Status

```http
PATCH /api/complaints/{complaint_id}/status
```

```json
{
  "status": "FIELD_ACTION",
  "updated_by": "OFFICER_12"
}
```

---

## Upload Resolution Evidence

```http
POST /api/complaints/{complaint_id}/evidence
```

```json
{
  "image_url": "after-image.jpg",
  "latitude": 11.0169,
  "longitude": 75.9559,
  "captured_at": "2026-08-23T11:30:00+05:30"
}
```

---

# 28. Frontend State Model

Use a simple complaint object:

```javascript
{
  complaint_id: "CT-1001",
  issue: "Pothole",
  category: "Road Infrastructure",
  department: "Roads Department",
  priority: 86,
  priority_level: "CRITICAL",
  status: "FIELD_ACTION",
  sla_remaining_minutes: 462,
  location: {
    latitude: 11.0168,
    longitude: 76.9558
  }
}
```

---

# 29. UI Design Direction

The application should look like a **modern civic-tech platform**, not a college CRUD project.

### Recommended Style

```text
Clean
Minimal
Professional
High contrast
Map-oriented
Data-driven
```

Use clear status colors:

```text
CRITICAL → Red
HIGH → Orange
MEDIUM → Yellow
LOW → Green
VERIFIED → Green
REOPENED → Red
```

Do not overuse colors.

---

# 30. Mobile-First Citizen UI

The citizen interface should work especially well on mobile.

Prioritize:

```text
Large buttons
Large image upload area
Minimal form fields
Clear GPS indicator
Simple complaint tracking
```

The citizen should be able to report an issue in **under 30 seconds**.

---

# 31. Desktop Officer UI

The officer interface should be optimized for desktop/tablet.

Use:

```text
Sidebar
Complaint list
Priority badges
SLA countdown
Complaint detail panel
Map/location
Proof upload
```

---

# 32. Error Handling

The frontend should handle:

### GPS unavailable

```text
Location unavailable.

[ Retry GPS ]

[ Enter Location Manually ]
```

### Image upload failure

```text
Unable to upload image.

[ Try Again ]
```

### AI failure

```text
AI analysis is temporarily unavailable.

Your complaint has still been recorded.
```

### Backend unavailable

```text
Unable to connect to CivicTrack.

Please retry.
```

Do not show raw API errors to users.

---

# 33. Loading States

Every important network action needs a loading state.

Examples:

```text
Uploading...
Analyzing...
Assigning department...
Loading complaint...
Uploading proof...
Verifying resolution...
```

Avoid blank screens.

---

# 34. Demo Mode

Because the hackathon is only 7 hours, implement an optional demo mode.

Example:

```text
[ DEMO COMPLAINT ]
```

It loads a predefined complaint:

```text
Pothole
↓
AI Analysis
↓
CRITICAL
↓
Roads Department
↓
Officer
↓
Proof Upload
↓
Verified
```

This is useful if an external AI/API fails during judging.

---

# 35. Component Structure

Suggested React structure:

```text
src/
│
├── components/
│   ├── ComplaintCard.jsx
│   ├── PriorityBadge.jsx
│   ├── StatusTimeline.jsx
│   ├── SLAIndicator.jsx
│   ├── ImageUploader.jsx
│   ├── LocationPicker.jsx
│   └── VerificationCard.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── ReportComplaint.jsx
│   ├── ComplaintResult.jsx
│   ├── ComplaintTracking.jsx
│   ├── OfficerDashboard.jsx
│   ├── OfficerComplaint.jsx
│   └── ResolutionProof.jsx
│
├── services/
│   └── api.js
│
├── hooks/
│   └── useGeolocation.js
│
└── App.jsx
```

---

# 36. API Service

Keep all API calls in one place.

Example:

```javascript
export async function createComplaint(data) {
  const response = await fetch("/api/complaints", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return response.json();
}
```

This makes integration with Member 4 easier.

---

# 37. Do Not Hard-Code AI Decisions

The frontend must never contain logic such as:

```javascript
if (issue === "pothole") {
  department = "Roads";
}
```

Instead:

```text
Backend
   ↓
AI Decision JSON
   ↓
Frontend
   ↓
Display
```

The frontend is a **presentation and interaction layer**.

---

# 38. Definition of Done

Member 3 is complete when:

- [ ] Citizen can upload an image
- [ ] Citizen can enter complaint description
- [ ] GPS can be captured
- [ ] Complaint can be submitted
- [ ] AI loading state is displayed
- [ ] AI classification is displayed
- [ ] Department is displayed
- [ ] Priority score is displayed
- [ ] SLA is displayed
- [ ] Complaint ID is displayed
- [ ] Tracking timeline works
- [ ] Officer dashboard works
- [ ] Officer can open complaint
- [ ] Officer can change status
- [ ] Officer can upload resolution proof
- [ ] GPS is captured for proof
- [ ] Verification result is displayed
- [ ] Failed verification supports re-upload
- [ ] Mobile citizen UI works
- [ ] Complete demo flow works

---

# 39. 7-Hour Implementation Plan

## Hour 1 — Project Setup

- React/Vite setup
- Tailwind setup
- Routing
- Basic layout
- API service

---

## Hour 2 — Citizen Reporting

Build:

```text
Home
→ Report Complaint
→ Image Upload
→ Description
→ GPS
→ Submit
```

---

## Hour 3 — AI Result + Tracking

Build:

```text
AI Analysis
→ Result Card
→ Complaint ID
→ Priority
→ Department
→ Timeline
```

---

## Hour 4 — Officer Dashboard

Build:

```text
Officer Dashboard
→ Complaint List
→ Priority
→ SLA
→ Complaint Details
```

---

## Hour 5 — Resolution Proof

Build:

```text
Start Work
→ Upload After Photo
→ Capture GPS
→ Submit Evidence
```

---

## Hour 6 — Verification

Build:

```text
Verifying
→ PASSED / FAILED
→ Verification Card
→ Reopen / Re-upload
```

---

## Hour 7 — Polish + Integration

- Connect Member 4 APIs
- Fix responsive UI
- Add loading states
- Add error handling
- Test complete demo
- Prepare fallback demo mode

---

# 40. The Main Hackathon Demo

The judge should be able to understand the complete system through this flow:

```text
STEP 1
Citizen uploads pothole image
        ↓

STEP 2
AI identifies:
"Pothole — Road Infrastructure"
        ↓

STEP 3
AI decides:
Roads Department
CRITICAL — 86/100
SLA — 6 hours
        ↓

STEP 4
Officer sees complaint
        ↓

STEP 5
Officer performs repair
        ↓

STEP 6
Officer uploads after-photo
+ GPS
+ Timestamp
        ↓

STEP 7
System verifies evidence
        ↓

✓ RESOLUTION VERIFIED
```

---

# 41. Standout UI Element

Make the **Resolution Proof** visually prominent.

Instead of simply:

```text
Status: Resolved
```

show:

```text
                 ✓
       RESOLUTION VERIFIED

     ┌───────────────────┐
     │   AFTER PHOTO     │
     │                   │
     └───────────────────┘

     📍 Location Matched
     🕐 Timestamp Verified
     ✓ Issue Resolved

     Verification Score
            93/100
```

This directly communicates CivicTrack's key differentiator:

> **A complaint is not considered resolved just because an officer says it is resolved.**

---

# 42. Final Responsibility

Member 3's job can be summarized as:

> **MAKE THE AI DECISION VISIBLE → MAKE THE WORKFLOW TRACKABLE → MAKE THE RESOLUTION PROVABLE**

The critical frontend journey is:

```text
REPORT
  ↓
ANALYZE
  ↓
ASSIGN
  ↓
TRACK
  ↓
ACT
  ↓
PROVE
  ↓
VERIFY
```

---

# 43. Priority During Hackathon

If time becomes limited, build in this order:

### MUST HAVE

1. Report Complaint
2. Image Upload
3. GPS
4. AI Result
5. Priority + Department
6. Complaint Tracking
7. Officer Complaint View
8. Resolution Photo Upload
9. Verification Result

### SHOULD HAVE

10. SLA Countdown
11. Mobile responsiveness
12. Loading animations
13. Map/location display

### CAN SKIP

14. Authentication
15. Advanced profile system
16. Notifications
17. Settings
18. Complex admin analytics
19. Full production-grade accessibility system

---

# 44. Integration Rule

The frontend must follow the contracts defined by Members 1, 2 and 4.

### Never change these without coordination:

```text
complaint_id
status
priority_score
priority_level
department
location
verification
```

Member 4's backend is the **single source of truth**.

Member 3's frontend should display backend state rather than independently calculating it.
