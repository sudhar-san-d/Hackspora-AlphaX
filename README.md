# CivicTrack AI

**From civic complaint to verified resolution.**

CivicTrack AI is a production-oriented civic operations platform that moves a public infrastructure complaint through five accountable stages:

**Understand → Decide → Route → Act → Verify**

It includes a mobile-first citizen portal, a field-officer workspace, a municipal command center, deterministic priority and SLA engines, multimodal image understanding, and before/after resolution verification.

## Product surfaces

- **Citizen portal:** image upload, issue description, device/manual location, structured AI results, SLA, map, timeline, and verified outcome.
- **Officer workspace:** priority-first queue, assignment acceptance, work start, navigation, after-image upload, coordinates, and verification.
- **Command center:** KPIs, SLA pressure, synchronized map/table selection, operational charts, filters, export, notifications, and a complete complaint drawer.
- **Demo mode:** 20 realistic seeded cases and a no-credentials end-to-end fallback that remains fully interactive.

## Architecture

```text
Citizen / Officer / Admin React application
                  |
                  v
          Express TypeScript API
        /          |            \
OpenRouter      Groq       Deterministic rules
 vision +       context     priority / routing /
 comparison     reasoning   SLA / GPS / duplicate
        \          |            /
                  v
       Supabase PostgreSQL + Storage
       (in-memory repository in demo mode)
```

The browser never receives provider or service-role credentials. AI outputs pass through JSON extraction, one repair attempt, and strict Zod validation before use. Invalid or unavailable provider output falls back to deterministic behavior.

## Repository

```text
civictrack/
  frontend/     React, Vite, Tailwind, Router, Framer Motion, Recharts, Leaflet
  backend/      Express, Zod, OpenRouter, Groq, repositories, storage adapters
  supabase/     schema migration and 20-case seed
  .env.example
  render.yaml
```

## AI pipeline

### Member 1 — image understanding

`POST /api/ai/analyze-image`

Accepts `complaint_id`, `image_url` (or multipart `image`), and optional `citizen_description`. It returns only the Member 1 structure: detected issue, infrastructure, visual description, damage indicators, safety indicators, visual severity, and confidence. It does not assign a department, priority, SLA, jurisdiction, or status.

### Member 2 — decision engine

`POST /api/ai/decide`

Combines the Member 1 result with the citizen description and location context. Groq may propose contextual factors and a short explanation, but application code owns department routing, multi-agency routing, the final priority calculation, and SLA.

Priority score:

```text
25% Severity + 20% Urgency + 20% Public Risk
+ 15% Population Impact + 15% Location Risk + 5% SLA Risk
```

| Score | Level | SLA |
|---:|---|---:|
| 0–30 | Low | 120 hours |
| 31–55 | Medium | 48 hours |
| 56–75 | High | 12 hours |
| 76–100 | Critical | 6 hours |

### Resolution verification

`POST /api/complaints/:id/verify-resolution`

OpenRouter compares the before/after images. Application code combines visual evidence with Haversine GPS distance, evidence presence, and confidence thresholds. The result is `VERIFIED`, `REVIEW REQUIRED`, or `VERIFICATION FAILED`.

## Requirements

- Node.js 20+
- npm 10+
- Optional: Supabase project, OpenRouter key, Groq key

No external service is required for the built-in demo workflow.

## Local setup

```bash
cp .env.example .env
npm install
npm run dev
```

Open:

- Frontend: `http://localhost:5173`
- API health: `http://localhost:4000/api/health`

The root `npm run dev` starts both applications. You can also run them independently:

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

## Environment

Copy `.env.example` to `.env`. The backend loads `backend/.env` or the root `.env`; Vite loads frontend variables from the root through `envDir`.

```env
OPENROUTER_API_KEY=
OPENROUTER_MODEL=google/gemini-2.5-flash
GROQ_API_KEY=
GROQ_MODEL=llama-3.3-70b-versatile
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
VITE_API_BASE_URL=http://localhost:4000/api
```

Never prefix provider or service-role keys with `VITE_`. Do not expose `SUPABASE_SERVICE_ROLE_KEY` to the browser. Set `DEMO_AUTH_ENABLED=false` in a production deployment that uses Supabase Auth; it defaults to disabled when `NODE_ENV=production`.

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/migrations/202608230001_civictrack_schema.sql` in the SQL editor.
3. Run `supabase/seed.sql`.
4. Set `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.
5. Restart the API.

The migration creates the civic user/profile, department, complaint, AI analysis, decision, status history, assignment, evidence, verification, and notification records. It also creates `complaint-images` and `resolution-images` buckets with MIME and size controls.

When Supabase credentials are absent, the API automatically uses the in-memory repository with the same route semantics.

## OpenRouter and Groq

- Create provider keys in their respective dashboards.
- Add them only to server environment variables.
- Choose models that support the required capability. `OPENROUTER_MODEL` must accept image inputs.
- If either service times out, returns malformed JSON, or is unavailable, the request continues through validated deterministic fallback logic.

The backend does not log prompts, images, keys, or image payloads.

## Demo accounts

No password is required in demo authentication:

- `citizen@demo.com`
- `officer@demo.com`
- `admin@demo.com`

Choose the role on `/login`. Demo state is preserved in browser local storage. Admins can switch between API-preferred and demo fallback data at the bottom of the command center.

## Guaranteed demo workflow

1. Open the Citizen portal.
2. Upload a pothole image.
3. Enter `Huge pothole near school and bus stop.`
4. Capture or enter a location and submit.
5. Review the vision analysis, Roads Department routing, critical priority, and 6-hour SLA.
6. Sign out and enter Field operations.
7. Open the newly created critical complaint, start work, upload an after image, add a completion note, and capture location.
8. Run verification and review the 91% visual match, 8 m location result, and 93% confidence demo result.
9. Open the Command center to inspect the updated map, table, timeline, KPIs, and verification record.

## API routes

```text
POST /api/complaints
GET  /api/complaints
GET  /api/complaints/:id
POST /api/ai/analyze-image
POST /api/ai/decide
POST /api/complaints/:id/assign
POST /api/complaints/:id/start
POST /api/complaints/:id/resolve
POST /api/complaints/:id/verify-resolution
GET  /api/dashboard
GET  /api/departments
GET  /api/notifications
GET  /api/health
```

Successful responses use `{ "success": true, "data": ... }`. Errors use `{ "success": false, "error": { "code": "...", "message": "..." } }`.

## Validation and tests

```bash
npm test
npm run build
npm run check
```

Backend tests cover priority math, SLA thresholds, routing, five required issue cases, strict JSON validation/repair, AI fallback, GPS verification, upload validation, RBAC, and complete API lifecycle routes.

## Deployment

### Frontend — Vercel

- Import `frontend/` as the project root.
- Build command: `npm run build`
- Output directory: `dist`
- Set `VITE_API_BASE_URL` to the deployed API URL ending in `/api`.

`frontend/vercel.json` provides SPA route fallback.

### Backend — Render or Railway

- Use `render.yaml`, or set `backend/` as the service root.
- Build: `npm ci && npm run build`
- Start: `npm start`
- Health check: `/api/health`
- Set CORS to the frontend origin and add server secrets in the hosting dashboard.

### Database — Supabase

Apply the migration and seed, create the two storage buckets through the migration, then add Supabase server credentials to the backend service only.

## Troubleshooting

- **The UI says Demo fallback:** verify the API is running, `VITE_API_BASE_URL` ends with `/api`, and CORS contains the frontend origin.
- **AI results use fallback:** check provider keys/model IDs and `/api/health`; fallback is intentional when providers are unavailable.
- **Upload rejected:** use a real JPEG, PNG, or WebP under 8 MB. The API validates MIME type and file signature.
- **Verification requests review:** capture the after image close to the original coordinates and ensure the repair is clearly visible.
- **Supabase write failure:** apply both SQL files and verify the service-role key is configured only on the backend.

## Security notes

The API uses Helmet, CORS, request rate limits, Zod input validation, role checks, upload signature validation, bounded payloads, secret isolation, and metadata-only request logging. Demo headers are accepted only when the in-memory demo repository is active. Production authentication is designed for Supabase Auth claims and should use role metadata managed by administrators.
