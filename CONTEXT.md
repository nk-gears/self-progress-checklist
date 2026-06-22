# Self Progress Checklist – Project Context

## Purpose
Daily self-checking tool for Brahma Kumaris (BK) NGO members.
"Self Progress Chart" — Self Transformation for Baba's Pratyakshatha.

## Tech Stack
Identical to `med-progress` (sibling project):
- **Frontend**: Vue 3 + TypeScript + Vite 5 + Pinia + Tailwind CSS (purple theme)
- **Backend**: PHP + MySQL (shared FTP hosting)
- **Auth**: Google Sign-In only (Google Identity Services library + PHP token verification)
- **Deploy**: Frontend → Vercel, Backend → FTP server

## Project Structure
```
self-progress-checklist/
├── backend/
│   ├── api.php        — REST API (Google auth, entries CRUD, profile)
│   ├── config.php     — DB connection, CORS, helper functions
│   ├── schema.sql     — MySQL table definitions
│   └── .htaccess      — URL rewrite: /api/* → api.php
├── frontend/
│   ├── src/
│   │   ├── App.vue
│   │   ├── main.ts
│   │   ├── style.css
│   │   ├── router/index.ts       — 4 routes: /home, /chart, /resources, /profile
│   │   ├── stores/
│   │   │   ├── auth.ts           — Google login, user state
│   │   │   ├── checklist.ts      — daily entries store, stats, chart data
│   │   │   └── devMode.ts        — mock/live switcher
│   │   ├── services/
│   │   │   ├── api.ts            — fetch wrapper, all API calls
│   │   │   └── mockData.ts       — 60-day mock entries for dev
│   │   ├── types/index.ts        — DailyEntry, User, EntryStats types
│   │   ├── components/
│   │   │   ├── BottomNav.vue     — Home/Chart/Resources/Profile tabs
│   │   │   ├── StarRating.vue    — reusable 1–5 star input
│   │   │   ├── DevSwitcher.vue   — mock/live toggle badge (dev only)
│   │   │   └── PwaPrompt.vue     — "Add to Home Screen" banner
│   │   └── views/
│   │       ├── LoginView.vue     — Google Sign-In only
│   │       ├── HomeView.vue      — summary stats + bar chart
│   │       ├── ChartView.vue     — daily self-checking form (4 categories)
│   │       ├── ResourcesView.vue — BK resource links
│   │       └── ProfileView.vue   — edit name/centre, stats, sign out
├── .env.local         — local dev env vars (not committed)
├── .env.example       — env vars template
└── vercel.json        — Vercel build config
```

## DB Tables (prefix: `spc_`)
- `spc_users` — id, email, display_name, centre_name, created_at
- `spc_tokens` — id, user_id, token, created_at
- `spc_daily_entries` — one row per user per day with all checklist columns

## The 4 Categories + Scoring

### 1. Gyan (Knowledge)
| Item | Type | Max Points |
|---|---|---|
| Murali at Centre/Pathashala | Toggle + Stars (1–5) | 5 pts (= stars) |
| Murali Revision (at least once) | Toggle | 5 pts |

### 2. Yog (Yoga)
| Item | Type | Max Points |
|---|---|---|
| Amritvela | Toggle + Stars (1–5) | 10 pts (= stars × 2) |
| Extra Yoga | Dropdown (hours) | 10 pts per hour |
| Traffic Control / Drill | Toggle + Stars (1–5) | 5 pts (= stars) |

### 3. Dharana (Sanskar Parivartan)
| Item | Type | Max Points |
|---|---|---|
| Personal Transformation Aim | Dropdown (select aim) | — (tracking only) |
| Morning Affirmation / Pledge | Toggle | 5 pts |
| Night Self-check | Toggle + Stars (1–5) | 5 pts (= stars) |

### 4. Seva (Service)
| Item | Type | Max Points |
|---|---|---|
| Minimum 30 min Seva | Toggle + Stars (1–5) | 5 pts (= stars) |

**Max base points per day: 40** (excluding extra yoga hours)

## Key Files to Know
- `frontend/src/stores/checklist.ts` — `calcPoints()` logic, `getDailyData()` for chart
- `frontend/src/views/ChartView.vue` — main daily form UI
- `frontend/src/views/HomeView.vue` — summary + bar chart
- `backend/api.php` — `handleEntries()` handles POST/GET for checklist data
- `backend/schema.sql` — run this once to set up DB

## Environment Variables
```bash
# .env.local (at project root, loaded by Vite)
VITE_API_URL=https://happy-village.org/self-progress-checklist/api
VITE_GOOGLE_CLIENT_ID=185884239414-kja6ggi7vfjfp11jdre6ofb16lb1npft.apps.googleusercontent.com
VITE_ENABLE_DEV_TOOLS=false
```

On PHP server (config.php has hardcoded fallbacks for FTP hosting):
```
DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, GOOGLE_CLIENT_ID
```

## Setup Steps
1. **DB**: Run `backend/schema.sql` on your MySQL server
2. **Backend**: Upload `backend/` to `https://happy-village.org/self-progress-checklist/`
3. **Frontend**: `cd frontend && npm install --legacy-peer-deps && npm run dev`
4. **Deploy**: Push to GitHub → Vercel auto-builds from `vercel.json`
5. **Google OAuth**: Add authorized JS origins in Google Cloud Console

## Dev Mode
- In browser dev mode, a 🎭 MOCK badge appears bottom-left
- Click it to toggle between Mock Data (no backend needed) and Live Backend
- Mock generates 60 days of realistic data stored in localStorage

## Status: Bootstrap complete
- All 33 files created
- `npm run type-check` passes with 0 errors
- Ready for `npm run dev` to test locally
- Backend needs to be uploaded to PHP server + DB schema applied

## Pending / Next Steps
- [ ] Test Google Sign-In end-to-end (needs real Google Client ID configured)
- [ ] Upload backend to PHP server
- [ ] Run schema.sql on MySQL server
- [ ] Configure Google Cloud Console authorized origins for new domain
- [ ] Customize `ResourcesView.vue` links if needed
- [ ] Optionally: add a "Yoga Target" feature (goal-setting per month)
