# FixMyCity AI — Frontend Application

**Product:** FixMyCity AI (CivicTrack AI)  
**Role Scope:** Member 3 — Citizen App + Officer Interface + Resolution Verification Engine  
**Tech Stack:** React 18 + Vite + Tailwind CSS + Lucide Icons + Framer Motion  

---

## 🏛 Project Overview

FixMyCity AI is an AI-powered civic issue management and automated verification engine. It bridges the gap between citizens reporting infrastructure issues and field officers performing verified repairs. 

Unlike traditional portal CRUD systems, FixMyCity AI enforces **proof-of-work resolution verification**: a complaint is only marked `VERIFIED` when geo-tagged, timestamped photo evidence is validated by AI.

---

## 📐 System Workflow

```text
Citizen reports issue (Photo + Description + GPS)
        ↓
AI Vision & Priority Engine analyzes complaint
        ↓
Department & Priority assigned (CRITICAL / HIGH / MEDIUM / LOW + Score)
        ↓
Officer receives prioritized complaint in Action Queue
        ↓
Officer starts Field Action (Status: FIELD_ACTION)
        ↓
Officer uploads after-repair proof (Photo + Locked GPS + Timestamp)
        ↓
AI Verifies Resolution (Location match + Scene match + Resolution check)
        ↓
Complaint Ticket marked VERIFIED (Score 93/100 + Gold Badge)
```

---

## 📂 Folder Structure

```text
Frontend/
├── CivicTrack_AI_Member_3_PRD.md   # Product Requirements Document
├── Frontend.md                     # Complete Frontend Design Specification
├── README.md                       # Documentation & Running Instructions
├── package.json                    # Dependencies & build scripts
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Custom design system tokens & colors
├── postcss.config.js               # PostCSS Tailwind plugins
├── index.html                      # HTML5 container & Google Fonts
└── src/
    ├── design/
    │   ├── tokens.css              # Custom CSS design variables
    │   ├── typography.css          # Font tracking and type helpers
    │   └── springs.js              # Spring animation physics presets
    ├── components/
    │   ├── Header.jsx              # Translucent header & DEMO toggle
    │   ├── ComplaintCard.jsx       # Officer dashboard card with SLA
    │   ├── PriorityBadge.jsx       # Priority pill badges (Critical, High, etc.)
    │   ├── StatusTimeline.jsx      # Scannable vertical timeline
    │   ├── SLAIndicator.jsx        # Live SLA countdown timer
    │   ├── ImageUploader.jsx       # Camera dropzone & sample photos
    │   ├── LocationPicker.jsx      # GPS detector & manual location
    │   ├── EvidenceChecklist.jsx   # Photo, GPS & Timestamp checklist
    │   ├── VerificationCard.jsx    # Signature Resolution Verified screen
    │   ├── AIStepLoader.jsx        # Dark navy AI pipeline loader
    │   ├── SkeletonCard.jsx        # Loading shimmer skeletons
    │   └── Toast.jsx               # One-click copy toast notification
    ├── pages/
    │   ├── Home.jsx                # Citizen Home screen
    │   ├── ReportComplaint.jsx     # Issue reporting form
    │   ├── ComplaintResult.jsx     # AI Analysis outcome card
    │   ├── ComplaintTracking.jsx   # Citizen live timeline tracking
    │   ├── OfficerDashboard.jsx    # 2-Column Officer Action Queue
    │   ├── OfficerComplaint.jsx    # Officer issue detail panel
    │   ├── ResolutionProof.jsx     # Proof photo & evidence submission
    │   └── VerificationResult.jsx  # AI Verification outcome screen
    ├── services/
    │   └── api.js                  # API service with local mock persistence
    ├── hooks/
    │   ├── useGeolocation.js       # Live browser GPS hook
    │   └── useSLACountdown.js      # SLA countdown timer hook
    ├── demo/
    │   └── demoData.js             # Mock dataset for hackathon presentation
    ├── App.jsx                     # Core application router & state
    ├── main.jsx                    # React DOM entrypoint
    └── index.css                   # Main CSS stylesheet
```

---

## ⚡ Key Features

### 👤 Citizen Interface (Mobile-First)
- **Home (`Home.jsx`)**: Topographic background design, quick actions (*Report a Problem*, *Track My Complaints*), live issue stats count-up.
- **Report Problem (`ReportComplaint.jsx`)**: Rear camera photo capture (`capture="environment"`), quick demo photo presets, auto-growing description input, live GPS auto-detection with manual fallback.
- **AI Analysis Loading (`AIStepLoader.jsx`)**: Full-screen dark navy pipeline with staggered checkmark reveals.
- **AI Result Card (`ComplaintResult.jsx`)**: Displays detected issue (*Pothole*), assigned department (*Roads Department*), priority rating (*🔴 CRITICAL - 86/100*), 6-hour SLA countdown, explainable AI card, and 1-click copy Complaint ID (`CT-1001`).
- **Real-Time Tracking (`ComplaintTracking.jsx`)**: Vertical timeline with active pulse node indicators.

### 🛡 Officer Portal (Desktop / Tablet)
- **Action Queue Dashboard (`OfficerDashboard.jsx`)**: Two-column layout with sidebar, stat counter bar (*Assigned*, *Critical*, *Overdue*), AI priority auto-sort badge, and search filter.
- **Complaint Detail Drawer (`OfficerComplaint.jsx`)**: Detailed issue drawer with direct Google Maps link, citizen evidence photo, and one-click *START FIELD ACTION*.

### 🏆 Signature Feature: Resolution Verification Engine
- **Proof Upload (`ResolutionProof.jsx`)**: Camera proof upload with evidence checklist locking Photo, GPS coordinates, and Timestamp.
- **Verification Outcome (`VerificationCard.jsx`)**: Expanding gold checkmark ring animation, animated verification score counting up to `93 / 100`, gold progress bar fill, and 3 confirmation badges (*📍 Location Matched ✓*, *🕐 Timestamp Verified ✓*, *✓ Issue Resolved ✓*).

---

## 🛠 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation & Running Locally

1. Navigate to the `Frontend` directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and visit:
```text
http://localhost:3000/
```

### Production Build & Preview

```bash
npm run build
npm run preview
```

---

## 📄 Reference Documents

- [Product Requirements Document (PRD)](file:///c:/Users/Sudharsan/Documents/FixMyCityAi/Frontend/CivicTrack_AI_Member_3_PRD.md)
- [Frontend Design Specification](file:///c:/Users/Sudharsan/Documents/FixMyCityAi/Frontend/Frontend.md)
