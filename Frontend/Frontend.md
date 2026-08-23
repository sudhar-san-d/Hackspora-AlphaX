# FixMyCity AI — Frontend Design Specification
**Product:** FixMyCity AI  
**Role Scope:** Member 3 — Citizen App + Officer Interface + Resolution Verification  
**Stack:** React + Vite + Tailwind CSS + Lucide Icons  
**Document Version:** 1.0  

---

## 0. Design System Foundation

### 0.1 Design Philosophy

FixMyCity AI is a civic-tech platform where speed, legibility, and trust are non-negotiable. The design takes cues from **Apple's fluid interface principles**: every state transition must feel immediate, every gesture must be interruptible, and every data-heavy screen must communicate its hierarchy in under three seconds. This is not a form on a white background — it is a mission-critical tool for citizens and field officers working under real-world constraints, often on mobile, often under time pressure.

The visual identity is built on **authority without coldness**: deep blue as the structural backbone, white/light gray as the working surface, and carefully rationed red/gold accents for priority and verification moments. It must look as credible as a government system and as usable as a consumer app.

---

### 0.2 Color Palette

```
:root {
  /* Primary — Deep Civic Blue */
  --color-primary-900: #0A1628;   /* darkest navy — app shell, sidebars */
  --color-primary-800: #0D2040;   /* header backgrounds, officer sidebar */
  --color-primary-700: #0F2D5A;   /* card headers, section dividers */
  --color-primary-600: #1A3F7A;   /* active states, focused inputs */
  --color-primary-500: #2155A3;   /* primary CTA buttons */
  --color-primary-400: #3A70C2;   /* hover states, secondary links */
  --color-primary-100: #D6E4F7;   /* very light blue for info chips */
  --color-primary-050: #EEF4FD;   /* background tint for analysis cards */

  /* Neutral — Working Surface */
  --color-neutral-900: #111827;   /* body text */
  --color-neutral-700: #374151;   /* secondary text */
  --color-neutral-500: #6B7280;   /* captions, labels */
  --color-neutral-300: #D1D5DB;   /* borders, dividers */
  --color-neutral-100: #F3F4F6;   /* card backgrounds */
  --color-neutral-050: #F9FAFB;   /* page background */
  --color-white:       #FFFFFF;   /* card surfaces, modals */

  /* Accent — Priority Red */
  --color-critical:    #DC2626;   /* CRITICAL priority, breach alerts */
  --color-critical-bg: #FEF2F2;   /* CRITICAL badge fill */
  --color-high:        #EA580C;   /* HIGH priority */
  --color-high-bg:     #FFF7ED;
  --color-medium:      #CA8A04;   /* MEDIUM priority */
  --color-medium-bg:   #FEFCE8;
  --color-low:         #16A34A;   /* LOW priority */
  --color-low-bg:      #F0FDF4;

  /* Accent — Verification Gold */
  --color-verified:    #B45309;   /* VERIFIED status, gold checkmark */
  --color-verified-bg: #FFFBEB;
  --color-verified-glow: #F59E0B; /* animated ring on verification success */

  /* Semantic */
  --color-success:     #16A34A;
  --color-success-bg:  #F0FDF4;
  --color-error:       #DC2626;
  --color-error-bg:    #FEF2F2;
  --color-warning:     #D97706;
  --color-warning-bg:  #FFFBEB;
  --color-info:        #2155A3;
  --color-info-bg:     #EEF4FD;
}
```

**Usage rule:** Blue is structure. Neutral is content. Red/gold are states. Never use more than two accent colors in the same viewport.

---

### 0.3 Typography System

```css
/* Display face — IBM Plex Sans (civic, structured, not cold) */
/* Body face   — Inter (legible, system-neutral) */
/* Mono face   — JetBrains Mono (complaint IDs, coordinates, scores) */

@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap');

:root {
  --font-display: 'IBM Plex Sans', system-ui, sans-serif;
  --font-body:    'Inter', system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', 'Fira Code', monospace;
}

/* Type Scale */
--text-xs:   0.75rem;   /* 12px — captions, labels */
--text-sm:   0.875rem;  /* 14px — secondary body, table rows */
--text-base: 1rem;      /* 16px — primary body copy */
--text-lg:   1.125rem;  /* 18px — card titles */
--text-xl:   1.25rem;   /* 20px — section headers */
--text-2xl:  1.5rem;    /* 24px — page headers */
--text-3xl:  1.875rem;  /* 30px — display hero text */
--text-4xl:  2.25rem;   /* 36px — verification score */

/* Tracking — follow Apple's rule: tighten large, loosen small */
--tracking-tight:  -0.02em;   /* headings ≥ 24px */
--tracking-normal:  0em;      /* body text */
--tracking-wide:    0.06em;   /* ALL-CAPS badges, status labels */
--tracking-widest:  0.12em;   /* complaint IDs in mono */

/* Leading */
--leading-tight:  1.1;   /* display headings */
--leading-snug:   1.25;  /* card titles */
--leading-normal: 1.5;   /* body copy */
--leading-loose:  1.75;  /* form hints, captions */
```

**Typographic rules:**
- Complaint IDs (`CT-1001`) always render in `--font-mono`, `--tracking-widest`, `--color-primary-600`
- Priority labels (`CRITICAL`, `HIGH`) always render in `--font-display`, `font-weight: 700`, `text-transform: uppercase`, `--tracking-wide`
- Coordinates always render in `--font-mono`, `--text-sm`, `--color-neutral-500`
- Score numbers (`86/100`, `93/100`) render in `--font-display`, `--text-4xl`, `--tracking-tight`

---

### 0.4 Spacing System

```css
--space-1:  0.25rem;   /* 4px */
--space-2:  0.5rem;    /* 8px */
--space-3:  0.75rem;   /* 12px */
--space-4:  1rem;      /* 16px */
--space-5:  1.25rem;   /* 20px */
--space-6:  1.5rem;    /* 24px */
--space-8:  2rem;      /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
```

**Layout grid:** 4px base unit. Mobile uses an 8-column grid with 16px gutters. Desktop uses a 12-column grid with 24px gutters.

---

### 0.5 Border Radius

```css
--radius-sm:   4px;    /* inline chips, badges */
--radius-md:   8px;    /* input fields, small cards */
--radius-lg:   12px;   /* cards, panels */
--radius-xl:   16px;   /* modals, bottom sheets */
--radius-2xl:  24px;   /* hero cards, image containers */
--radius-full: 9999px; /* pill badges, avatar rings */
```

---

### 0.6 Shadows & Elevation

```css
--shadow-sm:  0 1px 2px rgba(10, 22, 40, 0.06), 0 1px 3px rgba(10, 22, 40, 0.1);
--shadow-md:  0 4px 6px rgba(10, 22, 40, 0.07), 0 2px 4px rgba(10, 22, 40, 0.06);
--shadow-lg:  0 10px 15px rgba(10, 22, 40, 0.08), 0 4px 6px rgba(10, 22, 40, 0.05);
--shadow-xl:  0 20px 25px rgba(10, 22, 40, 0.1), 0 10px 10px rgba(10, 22, 40, 0.04);
--shadow-inner: inset 0 2px 4px rgba(10, 22, 40, 0.08);

/* Verification glow — used on VERIFIED state card */
--shadow-gold-glow: 0 0 0 3px rgba(245, 158, 11, 0.25), 0 8px 32px rgba(245, 158, 11, 0.15);

/* Critical alert pulse — used on SLA breach */
--shadow-red-pulse: 0 0 0 3px rgba(220, 38, 38, 0.2);
```

---

### 0.7 Motion Tokens (Apple-Aligned Springs)

All transitions use spring physics, not fixed-duration eases. Implement using `framer-motion` or the `motion` library.

```js
// Tokens — import and spread into every animated component
export const springs = {
  // Default UI — critically damped, no overshoot
  default: { type: 'spring', damping: 26, stiffness: 180, mass: 1 },

  // Drawer / bottom sheet — slight yield, feels weighty
  sheet:   { type: 'spring', damping: 28, stiffness: 200, mass: 1.1 },

  // Cards entering viewport — snappy, decisive
  card:    { type: 'spring', damping: 24, stiffness: 220, mass: 0.9 },

  // Status badge pop — momentum-feel on state change
  badge:   { type: 'spring', damping: 18, stiffness: 320, mass: 0.7 },

  // Verification reveal — dramatic, slow settle
  verify:  { type: 'spring', damping: 30, stiffness: 120, mass: 1.4 },

  // Micro-interaction — button press feedback
  micro:   { type: 'spring', damping: 20, stiffness: 400, mass: 0.6 },
};

// Usage with Framer Motion
// <motion.div animate={{ y: 0 }} transition={springs.card} />
```

**Motion rules:**
- All interactive elements respond on `pointerdown`, not `click` — visual feedback in ≤ 16ms
- Never hard-block input during a transition
- Bottom sheets use `drag` with `dragConstraints` and velocity-based commit/dismiss (velocity > 500px/s = dismiss)
- Reduced motion: replace all springs with `opacity` cross-fades of 150–200ms duration
- The AI analysis loading sequence uses staggered `opacity + translateY` reveals, 80ms stagger per step

---

### 0.8 Icon System

Use **Lucide Icons** exclusively. No mixing icon libraries.

Key icon assignments:
```
MapPin          → location / GPS
Camera          → image upload (citizen)
Upload          → proof upload (officer)  
AlertTriangle   → SLA breach, warnings
CheckCircle2    → verified, completed steps
Clock           → SLA countdown
Shield          → AI analysis / verification AI
Zap             → CRITICAL priority visual accent
ChevronRight    → drill-in navigation
ArrowLeft       → back navigation
Copy            → copy complaint ID
RefreshCw       → retry / reopen
FileText        → complaint detail
Users           → officer count
Activity        → live status indicator
```

Icon sizes: `16px` (inline), `20px` (list items), `24px` (CTAs, headers), `32px` (hero moments).

---

### 0.9 Component Base Tokens

```css
/* Buttons */
.btn-primary {
  background: var(--color-primary-500);
  color: white;
  font: 600 var(--text-base) / 1 var(--font-display);
  letter-spacing: var(--tracking-wide);
  padding: var(--space-4) var(--space-6);
  border-radius: var(--radius-lg);
  min-height: 52px;           /* mobile touch target */
  /* Spring: scale(0.97) on :active via motion.button */
}

.btn-primary:hover  { background: var(--color-primary-400); }
.btn-primary:active { transform: scale(0.97); }  /* instant, 0ms */

.btn-secondary {
  background: white;
  color: var(--color-primary-600);
  border: 1.5px solid var(--color-primary-200);
  /* Same sizing as primary */
}

.btn-danger {
  background: var(--color-critical);
  color: white;
}

/* Input Fields */
.input-field {
  background: white;
  border: 1.5px solid var(--color-neutral-300);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font: 400 var(--text-base) / var(--leading-normal) var(--font-body);
  min-height: 52px;
  transition: border-color 120ms ease, box-shadow 120ms ease;
}

.input-field:focus {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(33, 85, 163, 0.12);
  outline: none;
}
```

---

## 1. App Shell & Navigation

### 1.1 Global Header

**Citizen interface header** (mobile-first):
```
┌──────────────────────────────────────────────┐
│  🏛  FixMyCity AI          [Track] [≡ Menu]  │
│  ─────────────────────────────────────────── │
│  Background: --color-primary-800             │
│  Logo: IBM Plex Sans 700, white, 18px        │
│  Icon: shield-check in --color-verified-glow │
└──────────────────────────────────────────────┘
```

- Height: 56px mobile, 64px desktop
- `backdrop-filter: blur(20px) saturate(180%)` when content scrolls under (translucent chrome)
- Logo mark: a simplified city grid icon (3×3 grid with one cell highlighted) in gold — rendered as an inline SVG, not an image
- No hamburger on desktop — full nav inline

**Officer interface header** (desktop):
```
┌──────────────────────────────────────────────────────────┐
│  🏛 FixMyCity AI — Officer Portal          [Officer ID]  │
│  ──────────────────────────────────────────────────────  │
│  Sidebar: 260px, --color-primary-900 background          │
└──────────────────────────────────────────────────────────┘
```

---

### 1.2 Role Switch (Demo Mode)

A small, unobtrusive role toggle lives in the header — critical for the hackathon demo:

```
[ 👤 Citizen ]   [ 🛡 Officer ]   [ DEMO ]
```

- Rendered as a segmented pill control, `--color-primary-700` background, active tab in white
- `DEMO` tab loads the predefined pothole demo flow instantly

---

## 2. Screen 1 — Citizen Home

### 2.1 Layout

Full-screen mobile layout. No sidebar. Deep blue header transitions into a light neutral body.

```
┌────────────────────────────────────┐
│         [Header — navy]            │
│                                    │
│  ┌──────────────────────────────┐  │
│  │   Hero Card                  │  │
│  │                              │  │
│  │   FixMyCity AI               │  │  ← IBM Plex Sans 700, 30px, navy
│  │   Report civic issues.       │  │  ← Inter 400, 18px, neutral-700
│  │   Track resolution.          │  │
│  │   Verify real work.          │  │
│  │                              │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │  ⚡ Report a Problem          │  │  ← btn-primary, full-width, 56px tall
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │  📋 Track My Complaints       │  │  ← btn-secondary, full-width
│  └──────────────────────────────┘  │
│                                    │
│  ┌────────────┐  ┌──────────────┐  │
│  │ Active: 2  │  │ Resolved: 5  │  │  ← stat chips, --color-primary-050 bg
│  └────────────┘  └──────────────┘  │
│                                    │
└────────────────────────────────────┘
```

### 2.2 Design Details

**Hero section:** Not a generic card. The background is `--color-primary-050` with a subtle topographic line pattern (SVG, 5% opacity, navy lines) — this evokes maps and city infrastructure without being literal. The tagline lines stagger-reveal on mount with 80ms delay per line (spring: `badge` token, `y: 8 → 0`, `opacity: 0 → 1`).

**Stat chips:** Inline pill components. Active complaints chip uses `--color-primary-100` background with `--color-primary-600` text. Resolved chip uses `--color-success-bg` with `--color-success` text. These animate count-up on first load (0 → n over 600ms, easeOut).

**Bottom safe area:** 20px padding-bottom on mobile to avoid home bar overlap.

---

## 3. Screen 2 — Report Complaint

### 3.1 Layout (Mobile-First)

This is the highest-traffic citizen screen. Every interaction must complete under 30 seconds for a motivated user. Layout is a single vertically scrolling form, no tabs, no accordions.

```
┌────────────────────────────────────┐
│  ← Back    Report a Problem        │  ← Back uses ChevronLeft, springs back
├────────────────────────────────────┤
│                                    │
│  ┌──────────────────────────────┐  │
│  │                              │  │
│  │         📷                   │  │
│  │    Tap to add photo          │  │  ← 200px tall upload zone
│  │    or take a picture         │  │    dashed border, --color-primary-200
│  │                              │  │    Border-radius: --radius-2xl
│  └──────────────────────────────┘  │
│                                    │
│  [After upload — image preview     │
│   with ✕ to remove, fills zone]   │
│                                    │
│  ─── Describe the problem ───      │  ← section label, --text-sm, neutral-500
│                                    │
│  ┌──────────────────────────────┐  │
│  │ e.g. "Large pothole near     │  │  ← textarea, min 3 rows, auto-grow
│  │       the bus stop"          │  │    --radius-md, focus ring
│  └──────────────────────────────┘  │
│                                    │
│  ─── Location ──────────────────   │
│                                    │
│  ┌──────────────────────────────┐  │
│  │  📍 Detecting location...    │  │  ← GPS state: shimmer pulse animation
│  └──────────────────────────────┘  │
│                                    │
│  [On success]                      │
│  ┌──────────────────────────────┐  │
│  │  ✓ 📍 Location detected      │  │  ← green check, snap-in spring
│  │     11.0168, 76.9558         │  │    mono font for coords
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │  ⚡ ANALYZE & SUBMIT          │  │  ← btn-primary, 56px, full-width
│  └──────────────────────────────┘  │
│                                    │
└────────────────────────────────────┘
```

### 3.2 Image Upload Zone

- Default state: dashed border `1.5px dashed --color-primary-300`, `--color-primary-050` fill, camera icon at center
- Drag-hover state: border becomes solid `--color-primary-500`, fill becomes `--color-primary-100`, scale `1.02` spring
- Filled state: image fills the zone, `border-radius: --radius-2xl`, object-fit cover; a small `✕` button top-right (red, `--radius-full`) allows replacement
- Accepts: `image/*` via `<input type="file" accept="image/*" capture="environment">` — `capture="environment"` opens rear camera on mobile by default
- On mobile the zone is 220px tall to be thumb-friendly

### 3.3 GPS Status States

Three states, each with a distinct visual:

**Detecting:**
```css
.gps-detecting {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: var(--color-neutral-100);
  border-radius: var(--radius-md);
  color: var(--color-neutral-500);
  /* Shimmer animation on the icon */
}
```

**Detected (success):**
```css
.gps-detected {
  background: var(--color-success-bg);
  border: 1px solid #BBF7D0;
  color: var(--color-success);
}
```

**Failed (manual entry):**
```css
.gps-failed {
  background: var(--color-warning-bg);
  /* Shows: [Retry GPS] [Enter Manually] as two inline pill buttons */
}
```

### 3.4 Submit Button Behavior

- Button is disabled (50% opacity, not clickable) until: image uploaded + description ≥ 10 chars
- On tap: immediate `scale(0.97)` press feedback, then loading spinner replaces icon, text changes to "Analyzing…"
- The button never re-enables during the API call — prevents double submission

---

## 4. Screen 3 — AI Analysis Loading

### 4.1 Layout

Full-screen overlay that replaces the form after submit. This is the showpiece moment for the hackathon demo — judges see the AI pipeline made visible.

```
┌────────────────────────────────────┐
│                                    │
│                                    │
│    ┌──────────────────────────┐    │
│    │   🛡  FixMyCity AI        │    │  ← shield icon, pulses softly
│    │   Analyzing your report…  │    │
│    └──────────────────────────┘    │
│                                    │
│    ┌──────────────────────────┐    │
│    │  ✓  Image received        │    │  ← stagger in, 80ms apart
│    │  ✓  Identifying issue     │    │    green check on completion
│    │  ⟳  Assigning department  │    │    spinning ring on active
│    │  ○  Calculating priority  │    │    hollow circle on pending
│    │  ○  Creating ticket       │    │
│    └──────────────────────────┘    │
│                                    │
│    Each step uses:                 │
│    - Completed: CheckCircle2,      │
│      --color-success, snap-in      │
│    - Active: spinner ring,         │
│      --color-primary-500, rotate   │
│    - Pending: circle outline,      │
│      --color-neutral-300           │
│                                    │
└────────────────────────────────────┘
```

### 4.2 Step Reveal Animation

```js
// Stagger the step items as they complete
const steps = [
  { id: 'receive',    label: 'Image received',         delay: 0    },
  { id: 'identify',  label: 'Identifying issue',       delay: 800  },
  { id: 'assign',    label: 'Assigning department',    delay: 1800 },
  { id: 'priority',  label: 'Calculating priority',    delay: 2600 },
  { id: 'ticket',    label: 'Creating ticket',         delay: 3200 },
];
// Each step transitions: pending → active → complete
// 'active' state runs until the API response arrives
// On API response: all remaining steps fast-complete (200ms each)
```

**Background:** `--color-primary-900` (dark navy) full bleed — creates a focused, dramatic tunnel. White text on dark. This is the only screen with a dark background; it signals "the machine is working."

**Shield icon:** 48px, `--color-verified-glow` fill, subtle scale pulse animation (`scale: 1.0 → 1.06 → 1.0`, 2s loop, critically damped spring).

---

## 5. Screen 4 — AI Analysis Result

### 5.1 Layout

Light background returns. This is an information reveal moment — use progressive disclosure, not a wall of data.

```
┌────────────────────────────────────┐
│  ✓  AI Analysis Complete           │  ← section header, success color
│                                    │
│  ┌──────────────────────────────┐  │
│  │                              │  │
│  │   Detected Issue             │  │  ← label, --text-sm, neutral-500
│  │   Pothole                    │  │  ← value, --text-2xl, primary-900, bold
│  │                              │  │
│  │   ─────────────────────────  │  │
│  │                              │  │
│  │   Department                 │  │
│  │   Roads Department           │  │
│  │                              │  │
│  │   ─────────────────────────  │  │
│  │                              │  │
│  │   Priority         Score     │  │
│  │   🔴 CRITICAL      86/100    │  │  ← priority badge + mono score
│  │                              │  │
│  │   ─────────────────────────  │  │
│  │                              │  │
│  │   Expected Resolution        │  │
│  │   6 Hours                    │  │
│  │                              │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │  ← AI Explanation card
│  │  💬 Why this priority?        │  │    --color-primary-050 bg
│  │                              │  │    left border: 3px solid primary-500
│  │  Large pothole detected near  │  │
│  │  a school and bus stop,      │  │
│  │  creating significant safety │  │
│  │  risk.                       │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │  Complaint ID                 │  │
│  │  CT-1001          [Copy 📋]   │  │  ← mono font, large, primary-600
│  └──────────────────────────────┘  │
│                                    │
│  [ Track My Complaint → ]          │  ← btn-primary, full-width
│                                    │
└────────────────────────────────────┘
```

### 5.2 Priority Badge Component

```jsx
// PriorityBadge.jsx
const priorityConfig = {
  CRITICAL: { label: 'CRITICAL', color: 'var(--color-critical)',    bg: 'var(--color-critical-bg)',  icon: '🔴' },
  HIGH:     { label: 'HIGH',     color: 'var(--color-high)',        bg: 'var(--color-high-bg)',      icon: '🟠' },
  MEDIUM:   { label: 'MEDIUM',   color: 'var(--color-medium)',      bg: 'var(--color-medium-bg)',    icon: '🟡' },
  LOW:      { label: 'LOW',      color: 'var(--color-low)',         bg: 'var(--color-low-bg)',       icon: '🟢' },
};

// Rendered as:
// background: config.bg
// color: config.color
// font: 700 12px IBM Plex Sans
// letter-spacing: --tracking-wide
// padding: 4px 10px
// border-radius: --radius-sm
// text-transform: uppercase
// border: 1px solid (color at 40% opacity)
```

### 5.3 Complaint ID Card

```
┌─────────────────────────────────────────┐
│  Complaint ID                            │
│                                          │
│  CT-1001                    [📋 Copy]   │
│  ─────────────                           │
│  JetBrains Mono, 24px,                   │
│  --color-primary-600,                    │
│  --tracking-widest                       │
└─────────────────────────────────────────┘
```

- Card background: white, `--shadow-md`, `--radius-lg`
- Copy button: `Copy` Lucide icon, 16px, triggers a `"Copied!"` toast (200ms fade-in, 1.5s hold, 200ms fade-out) positioned bottom-center
- Toast: `--color-primary-800` background, white text, `--radius-full`, `--shadow-lg`

### 5.4 Card Entry Animation

Each card in the result screen enters with a staggered spring (100ms offset per card):
```js
// Framer Motion stagger parent
<motion.div
  variants={{ show: { transition: { staggerChildren: 0.1 } } }}
  initial="hidden"
  animate="show"
>
  <motion.div variants={{ hidden: { y: 16, opacity: 0 }, show: { y: 0, opacity: 1, transition: springs.card } }}>
    {/* Result card */}
  </motion.div>
</motion.div>
```

---

## 6. Screen 5 — Complaint Tracking

### 6.1 Layout

```
┌────────────────────────────────────┐
│  ← Back   CT-1001                  │  ← mono, primary-600
├────────────────────────────────────┤
│                                    │
│  ┌──────────────────────────────┐  │
│  │  Pothole                     │  │
│  │  🔴 CRITICAL   Roads Dept.   │  │
│  │  SLA: 07h 42m remaining      │  │  ← SLA chip, --color-warning-bg
│  └──────────────────────────────┘  │
│                                    │
│  ─── Status Timeline ───           │
│                                    │
│  ✓──●────────────────────          │
│  │                                 │
│  ✓  Complaint Submitted  10:42 AM  │
│  │                                 │
│  ✓  AI Analyzed          10:42 AM  │
│  │                                 │
│  ✓  Department Assigned  10:43 AM  │
│  │                                 │
│  ✓  Officer Assigned     10:47 AM  │
│  │                                 │
│  ●  Field Action (In Progress)     │  ← active node, pulsing ring
│  │                                 │
│  ○  Resolution Verification        │  ← hollow, greyed
│  │                                 │
│  ○  Closed                         │
│                                    │
└────────────────────────────────────┘
```

### 6.2 Timeline Component (`StatusTimeline.jsx`)

The vertical timeline is the signature UI element of the citizen-facing tracking view. It must be instantly scannable.

**Visual spec:**
- Connecting line: 2px, left-aligned at 20px from card edge
- Completed segment: `--color-success`, solid
- Active segment: `--color-primary-500`, animated dashed (`stroke-dashoffset` CSS animation, 800ms loop)
- Pending segment: `--color-neutral-300`, solid

**Node types:**
```css
.node-complete {
  width: 20px; height: 20px;
  border-radius: 50%;
  background: var(--color-success);
  /* CheckIcon inside, white, 12px */
}

.node-active {
  width: 20px; height: 20px;
  border-radius: 50%;
  background: var(--color-primary-500);
  /* Outer ring: keyframe scale pulse, 1.0→1.5, opacity 1→0, 1.5s loop */
  /* Dot inside: white 8px */
}

.node-pending {
  width: 20px; height: 20px;
  border-radius: 50%;
  background: white;
  border: 2px solid var(--color-neutral-300);
}
```

**Step label:**
- Label: `--font-display`, 500, `--text-base`, `--color-neutral-900`
- Timestamp: `--font-body`, 400, `--text-sm`, `--color-neutral-500`
- Status detail (e.g. "In Progress"): italic, `--color-primary-500`

### 6.3 SLA Indicator Component (`SLAIndicator.jsx`)

```jsx
// Three visual states based on time remaining
const getSLAState = (minutesRemaining) => {
  if (minutesRemaining <= 0)    return 'breached';  // ⚠ SLA BREACHED — red background
  if (minutesRemaining <= 60)   return 'urgent';    // < 1hr — orange background
  if (minutesRemaining <= 360)  return 'warning';   // < 6hr — yellow background
  return 'healthy';                                 // plenty of time — neutral
};

// Rendered as:
// "07h 42m remaining" — countdown updates every 60s via setInterval
// "⚠ SLA BREACHED"   — static, red, Alert icon
```

SLA countdown format: `{ hours }h { minutes }m remaining`. Always use 2-digit minutes (`07h 04m`, not `07h 4m`). For breached: icon flashes at 1Hz, background is `--color-critical-bg`, text is `--color-critical`.

---

## 7. Screen 6 — Officer Dashboard

### 7.1 Layout (Desktop — Two-Column)

```
┌──────────────────────────────────────────────────────────────┐
│  SIDEBAR (260px)                  │  MAIN CONTENT             │
│  --color-primary-900 bg           │  --color-neutral-050 bg   │
│                                   │                           │
│  🏛 FixMyCity AI                  │  ┌─────────────────────┐  │
│  Officer Portal                   │  │  Dashboard Header   │  │
│  ──────────────────               │  │  Officer: Ravi K.   │  │
│                                   │  │  Assigned: 12       │  │
│  📋 My Complaints    ←active      │  │  Critical:  3  🔴   │  │
│  🗺  Map View                     │  │  Overdue:   1  ⚠    │  │
│  📊 Stats                         │  └─────────────────────┘  │
│  ──────────────────               │                           │
│  👤 Officer #12                   │  ┌─────────────────────┐  │
│                                   │  │ Complaint Cards     │  │
│                                   │  │ (sorted CRIT→LOW)   │  │
│                                   │  └─────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### 7.2 Dashboard Stat Bar

```
┌───────────────────────────────────────────────────────┐
│                                                       │
│  Assigned        Critical        Overdue              │
│  ──────          ────────        ───────              │
│  12              3               1                    │
│  --text-3xl      --text-3xl      --text-3xl           │
│  neutral-900     critical        warning              │
│  bold            bold            bold                 │
│                                                       │
└───────────────────────────────────────────────────────┘
```

Background: white card, `--shadow-sm`, `--radius-lg`. Stats animate count-up on first load.

### 7.3 Complaint Card (`ComplaintCard.jsx`)

Each assigned complaint renders as a card in a vertical list. Cards are ordered: CRITICAL → HIGH → MEDIUM → LOW, then by shortest SLA within each tier.

```
┌────────────────────────────────────────────────┐
│  CT-1001                   🔴 CRITICAL  86/100 │
│  Pothole · Roads Department                    │
│  ───────────────────────────────────────────── │
│  📍 11.0168, 76.9558              SLA: 07h 42m │
│                                                │
│                             [ VIEW DETAILS → ] │
└────────────────────────────────────────────────┘
```

**Card visual rules:**
- White background, `--shadow-sm`, `--radius-lg`, `--space-4` padding
- Left border: 4px solid, color = priority color (critical → `--color-critical`, etc.)
- Hover: `--shadow-md`, `translateY(-1px)`, spring `micro` token
- CRITICAL cards additionally have a very subtle pulsing left-border glow (`box-shadow: -4px 0 12px var(--color-critical) 30%`)
- The `SLA` value uses the `SLAIndicator` component — it shows in warning or breached state colors when time is short
- `VIEW DETAILS →` is a text button, `--color-primary-500`, 500 weight, with `ChevronRight` icon

### 7.4 Sort Order Indicator

Above the card list, a small pill shows the current sort:
```
Sorted by: Priority → SLA   [⚡ Auto-sorted by AI]
```
This communicates the AI priority engine's value at a glance.

---

## 8. Screen 7 — Officer Complaint Detail

### 8.1 Layout

On desktop, this is a drawer/panel that opens to the right when a card is clicked — the list stays visible on the left. On mobile, it's a full-screen push.

```
┌─────────────────────────────────────────────────────┐
│  ← Back    COMPLAINT CT-1001                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  Pothole             🔴 CRITICAL  86/100     │   │
│  │  Roads Department    SLA: 07h 42m remaining  │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ─── Location ──────────────────────────────────   │
│  📍 11.0168, 76.9558     [ Open in Maps ↗ ]        │
│                                                     │
│  ─── Citizen Report ────────────────────────────   │
│  "Large pothole near bus stop."                     │
│                                                     │
│  ─── AI Analysis ───────────────────────────────   │
│  ┌─────────────────────────────────────────────┐   │
│  │  🛡 AI says:                                 │   │
│  │  Large pothole with broken asphalt edges     │   │
│  │  near a school zone and bus stop. Significant│   │
│  │  vehicle and pedestrian safety risk.         │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ─── Complaint Photo ───────────────────────────   │
│  ┌─────────────────────────────────────────────┐   │
│  │         [Citizen uploaded image]             │   │
│  │         --radius-xl, max-height 200px        │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  ⚡ START FIELD ACTION                        │   │  ← btn-primary, full-width
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  📍 VIEW LOCATION                            │   │  ← btn-secondary
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 8.2 Desktop Drawer Animation

When a complaint card is clicked on desktop:
- A right-side panel (`width: 480px`) slides in from the right using spring `sheet` token (`x: 480 → 0`)
- The complaint list compresses from `width: 100%` to `calc(100% - 480px)` using spring `default`
- The panel has `backdrop-filter: blur(0)` (full opacity, not translucent — this is a work surface)
- Closing: officer clicks `← Back` or presses `Escape` — panel springs back, list expands

### 8.3 Start Field Action

When the officer taps `START FIELD ACTION`:
1. Button immediately shows spinner + "Starting…"
2. PATCH API call fires
3. On success: a success toast appears, timeline updates (FIELD_ACTION step becomes active), button transforms into `[ UPLOAD RESOLUTION PROOF → ]`
4. The transition between button states is a cross-fade spring, not a jump

---

## 9. Screen 8 — Resolution Proof Upload

### 9.1 Layout

This screen is the key differentiator of FixMyCity AI. The visual design must communicate **proof-of-work**, not just a file upload.

```
┌────────────────────────────────────┐
│  ← Back    RESOLUTION PROOF        │
│            CT-1001 · Pothole        │
├────────────────────────────────────┤
│                                    │
│  ┌──────────────────────────────┐  │
│  │  Upload proof that the issue  │  │
│  │  has been resolved.           │  │
│  │                              │  │
│  │  The AI will verify your      │  │
│  │  evidence.                    │  │
│  └──────────────────────────────┘  │
│                                    │
│  ─── Capture Proof ─────────────   │
│                                    │
│  ┌──────────────────────────────┐  │
│  │                              │  │
│  │         📷                   │  │  ← Camera icon, primary-500
│  │    Take After Photo          │  │  ← Preferred method, prominent
│  │                              │  │
│  └──────────────────────────────┘  │
│                  ─ or ─            │
│  ┌──────────────────────────────┐  │
│  │  ↑ Upload from gallery       │  │  ← secondary, smaller
│  └──────────────────────────────┘  │
│                                    │
│  ─── Evidence Checklist ────────   │
│                                    │
│  ┌──────────────────────────────┐  │
│  │  📷 Photo        [ Pending ] │  │
│  │  📍 GPS Location [ Pending ] │  │  ← auto-captures on photo add
│  │  🕐 Timestamp    [ Pending ] │  │  ← auto-captures on photo add
│  └──────────────────────────────┘  │
│                                    │
│  [After all three captured]        │
│  ┌──────────────────────────────┐  │
│  │  📷 Photo        [ ✓ Added ] │  │
│  │  📍 GPS          [ ✓ Locked ]│  │
│  │  🕐 Timestamp    [ ✓ Locked ]│  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │  🛡 SUBMIT FOR VERIFICATION   │  │  ← btn-primary, enabled only when all 3 ✓
│  └──────────────────────────────┘  │
│                                    │
└────────────────────────────────────┘
```

### 9.2 Evidence Checklist Component

Each row transitions from `Pending` → `✓ Captured` with a spring pop:

```css
/* Pending state */
.evidence-row-pending {
  color: var(--color-neutral-500);
  background: var(--color-neutral-100);
  border: 1px dashed var(--color-neutral-300);
}

/* Captured state */
.evidence-row-captured {
  color: var(--color-success);
  background: var(--color-success-bg);
  border: 1px solid #BBF7D0;
  /* Icon snaps in with springs.badge token */
}
```

GPS and timestamp capture automatically the moment a photo is added (no extra user action). The checklist visually "fills in" left-to-right, creating a sense of progress and completeness before the officer even submits.

---

## 10. Screen 9 — Resolution Verification

### 10.1 AI Verification Loading

```
┌────────────────────────────────────┐
│       [--color-primary-900 bg]     │
│                                    │
│         🛡  Verifying...           │  ← same AI-working aesthetic as Screen 3
│                                    │
│  ✓ Photo received                  │
│  ✓ Location checked                │
│  ⟳ Comparing before/after          │
│  ○ Validating resolution           │
│                                    │
└────────────────────────────────────┘
```

Identical stagger pattern to the analysis loading (Section 4), but with verification-specific step labels.

---

### 10.2 Verification PASSED — The Signature Screen

This is the **standout UI moment** of the entire product. It must feel like an award, not just a status update.

```
┌────────────────────────────────────┐
│                                    │
│              ✓                     │  ← 64px CheckCircle2, --color-verified-glow
│                                    │    animated ring expands out from icon
│       RESOLUTION VERIFIED          │  ← IBM Plex Sans 700, 28px
│                                    │    letter-spacing: --tracking-tight
│                                    │
│  ┌──────────────────────────────┐  │
│  │    [ After Photo ]           │  │  ← full-width, --radius-xl, 240px tall
│  │    (proof image preview)     │  │    subtle gold border: 2px solid
│  └──────────────────────────────┘  │    --color-verified-glow
│                                    │
│  Verification Score                │
│  ┌──────────────────────────────┐  │
│  │         93 / 100             │  │  ← mono, 48px, --color-verified
│  │    ███████████████░░         │  │  ← animated progress bar (gold fill)
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │  📍 Location Matched    ✓    │  │  ← three confirmation rows
│  │  🕐 Timestamp Verified  ✓    │  │    green check, --color-success
│  │  ✓  Issue Resolved      ✓    │  │    stagger-reveal with spring.badge
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │  Complaint CT-1001           │  │
│  │  Status: VERIFIED            │  │  ← gold badge, not green — intentional
│  └──────────────────────────────┘  │
│                                    │
└────────────────────────────────────┘
```

**Animation sequence (orchestrated):**
1. Dark loading screen (`--color-primary-900`) fades out (200ms)
2. White background fades in
3. CheckCircle2 icon springs in from scale(0.5) → scale(1.0) using `springs.verify`
4. A gold ring expands out from the icon: `scale(1) → scale(2)`, `opacity(0.6) → opacity(0)`, 600ms
5. "RESOLUTION VERIFIED" text fades + slides up (y: 8 → 0, spring `default`)
6. Photo slides in from below (y: 24 → 0, spring `card`)
7. Score counts up from 0 → 93 over 800ms (easeOut)
8. Progress bar fills left-to-right over 600ms
9. Three confirmation rows stagger in at 100ms each

**This sequence takes ~2 seconds total and is the most memorable moment in the demo.**

---

### 10.3 Verification FAILED

```
┌────────────────────────────────────┐
│                                    │
│              ⚠                     │  ← AlertTriangle, 64px, --color-warning
│                                    │
│       VERIFICATION FAILED          │  ← IBM Plex Sans 700, 28px
│                                    │
│  The uploaded evidence could not   │
│  confirm the original issue was    │
│  resolved.                         │
│                                    │
│  ┌──────────────────────────────┐  │
│  │  ↑ REUPLOAD PROOF            │  │  ← btn-primary
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │  🚩 REPORT ISSUE             │  │  ← btn-secondary
│  └──────────────────────────────┘  │
│                                    │
│  Complaint status: REOPENED        │  ← red badge
│                                    │
└────────────────────────────────────┘
```

---

## 11. Error States

All error states follow the same visual grammar: an icon, a clear plain-language headline, an explanation, and one or two action buttons. Never show raw API errors.

### GPS Unavailable
```
📍  Location unavailable
Can't detect GPS. You can retry or type your location.
[ Retry GPS ]    [ Enter Manually ]
```

### Image Upload Failed
```
📷  Photo couldn't upload
Check your connection and try again.
[ Try Again ]
```

### AI Analysis Unavailable
```
🛡  Analysis paused
Your complaint was recorded. Our AI will analyze it shortly.
Complaint ID: CT-1001
[ Track Complaint ]
```

### Backend Offline
```
⚠   Can't connect
FixMyCity AI is temporarily unreachable. Your report is saved.
[ Retry ]
```

All error cards use `--color-warning-bg` background with `--color-warning` icon and title. They are never modal — they appear inline in the flow so the user retains context.

---

## 12. Loading States

Every network-bound action shows a loading state. No blank screens, ever.

| Action | Loading UI |
|---|---|
| Submit complaint | Button spinner + "Analyzing…" |
| Load complaint list | Skeleton cards (3 cards, shimmer animation) |
| Load complaint detail | Skeleton lines per section |
| Upload proof | Progress bar (indeterminate) + "Uploading…" |
| Verification | Full-screen AI verification loading (Section 10.1) |
| GPS detection | Shimmer pulse on location field |
| Status update | Inline spinner on the action button only |

**Skeleton shimmer CSS:**
```css
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}
.skeleton {
  background: linear-gradient(90deg,
    var(--color-neutral-100) 25%,
    var(--color-neutral-200) 50%,
    var(--color-neutral-100) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-md);
}
```

---

## 13. Demo Mode

A `[DEMO]` button in the header tab (see Section 1.2) loads a full predefined flow instantly:

```js
// demoData.js
export const demoComplaint = {
  complaint_id: 'CT-1001',
  issue: 'Pothole',
  category: 'Road Infrastructure',
  department: 'Roads Department',
  priority: 86,
  priority_level: 'CRITICAL',
  status: 'FIELD_ACTION',
  sla_remaining_minutes: 462,
  location: { latitude: 11.0168, longitude: 76.9558 },
  ai_explanation: 'Large pothole detected near a school and bus stop, creating significant vehicle and pedestrian safety risk.',
  verification: {
    status: 'PASSED',
    score: 93,
    location_match: true,
    scene_match: true,
    issue_resolved: true,
  },
};
```

In demo mode:
- API calls are mocked with 1.5s artificial delays (to make loading animations visible)
- All screens are navigable from a persistent `[ DEMO: Next Step → ]` floating pill at the bottom
- Demo badge shows in top-right of header: `● DEMO MODE` in `--color-warning-bg`

---

## 14. Mobile Responsiveness

**Citizen interface:** Mobile-first. Designed for 375px width. All buttons 52px+ tall. No horizontal scroll.

**Officer interface:** Desktop-first (two-column). Below 768px, sidebar collapses to a bottom tab bar:
```
[📋 Complaints]  [🗺 Map]  [📊 Stats]
```
The detail panel becomes a full-screen page push on mobile.

**Breakpoints:**
```css
/* Mobile-first base — 375px+ */
/* Tablet   — @media (min-width: 640px)  */
/* Desktop  — @media (min-width: 1024px) */
/* Wide     — @media (min-width: 1280px) */
```

---

## 15. GPT Image 2 — UI Mockup Prompt

Use this prompt to generate a visual reference render for the FixMyCity AI interface:

```json
{
  "type": "mobile app UI mockup, two screens side by side",
  "style": "clean editorial product design render, soft studio lighting, floating phone frames with slight drop shadow, no reflections, flat background",
  "background": "very dark navy #0A1628, subtle topographic line pattern at 5% opacity",
  "layout": {
    "left_panel": {
      "label": "Citizen Home Screen",
      "device": "iPhone 15 Pro frame, Deep Blue",
      "screen_content": {
        "header": "navy bar, white shield icon left, 'FixMyCity AI' in white IBM Plex Sans bold",
        "hero_card": "light gray card, topographic pattern, 'FixMyCity AI' large navy title, tagline in gray 'Report civic issues. Track resolution. Verify real work.'",
        "primary_button": "deep blue button, full width, white text '⚡ Report a Problem', 56px tall, rounded-lg",
        "secondary_button": "white button, blue border, '📋 Track My Complaints'",
        "stat_chips": "two small pills: 'Active: 2' in light blue, 'Resolved: 5' in light green"
      }
    },
    "right_panel": {
      "label": "Resolution Verified Screen",
      "device": "iPhone 15 Pro frame, Deep Blue",
      "screen_content": {
        "background": "white",
        "large_check": "64px gold checkmark circle icon, centered, subtle gold glow ring expanding outward",
        "headline": "'RESOLUTION VERIFIED' in dark navy IBM Plex Sans bold 28px, centered",
        "photo_card": "rounded rectangle, 240px tall, placeholder for after-photo, thin gold border",
        "score_section": "'93 / 100' in large amber monospace font, gold progress bar beneath at 93% fill",
        "confirmation_rows": "three rows with green checkmarks: '📍 Location Matched ✓', '🕐 Timestamp Verified ✓', '✓ Issue Resolved ✓'",
        "status_badge": "gold pill badge 'VERIFIED' at bottom"
      }
    }
  },
  "text_labels": {
    "top_left": "FixMyCity AI",
    "top_right": "Citizen Interface",
    "bottom_center": "fixmycity.ai"
  },
  "color_palette": "Deep Blue #0A1628, White #FFFFFF, Civic Blue #2155A3, Amber Gold #F59E0B, Success Green #16A34A, Critical Red #DC2626",
  "typography": "IBM Plex Sans for display, Inter for body"
}
```

---

## 16. Component File Map

```
src/
│
├── design/
│   ├── tokens.css         ← All CSS variables from Section 0
│   ├── springs.js         ← Motion spring tokens from Section 0.7
│   └── typography.css     ← Type scale from Section 0.3
│
├── components/
│   ├── ComplaintCard.jsx       ← Section 7.3
│   ├── PriorityBadge.jsx       ← Section 5.2
│   ├── StatusTimeline.jsx      ← Section 6.2
│   ├── SLAIndicator.jsx        ← Section 6.3
│   ├── ImageUploader.jsx       ← Section 3.2
│   ├── LocationPicker.jsx      ← Section 3.3
│   ├── EvidenceChecklist.jsx   ← Section 9.2
│   ├── VerificationCard.jsx    ← Section 10.2
│   ├── SkeletonCard.jsx        ← Section 12
│   ├── Toast.jsx               ← Section 5.3
│   └── AIStepLoader.jsx        ← Sections 4.1, 10.1
│
├── pages/
│   ├── Home.jsx                ← Section 2
│   ├── ReportComplaint.jsx     ← Section 3
│   ├── AIAnalysisLoading.jsx   ← Section 4
│   ├── ComplaintResult.jsx     ← Section 5
│   ├── ComplaintTracking.jsx   ← Section 6
│   ├── OfficerDashboard.jsx    ← Section 7
│   ├── OfficerComplaint.jsx    ← Section 8
│   ├── ResolutionProof.jsx     ← Section 9
│   └── VerificationResult.jsx  ← Section 10
│
├── services/
│   └── api.js                  ← All API calls (never inline fetch)
│
├── hooks/
│   ├── useGeolocation.js       ← GPS capture hook
│   └── useSLACountdown.js      ← Live SLA countdown (setInterval)
│
├── demo/
│   └── demoData.js             ← Section 13 mock data
│
└── App.jsx                     ← Routing, role switch, demo toggle
```

---

## 17. Design Signature — The One Thing Judges Remember

The **Resolution Verified** screen (Section 10.2) is the product's signature moment. Every other screen is about input and process. This screen is the payoff — the moment the system proves a real officer did real work at the right location.

The gold ring expanding from the checkmark, the animated score counting to 93, and the three geo-confirmed rows snapping into place in sequence — this communicates the core product promise in two seconds without a single word of explanation.

**Build this screen first in Hour 6. Make it perfect before polishing anything else.**

---

*Document prepared for FixMyCity AI hackathon development. All design decisions derive from the PRD (CivicTrack AI, Member 3) and are adapted for the FixMyCity AI product identity.*
