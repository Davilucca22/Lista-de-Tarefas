# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Frontend
npm run dev       # Vite dev server on http://localhost:5173 (with API proxy)
npm run build     # production build → dist/
npm run preview   # serve the dist/ build locally
npm run lint      # ESLint

# Backend
npm run server    # Express server on http://localhost:3000
```

Run both servers in parallel during development: `npm run dev` in one terminal, `npm run server` in another.

No test framework is configured.

## Architecture

### Full-stack: React frontend (`src/`) + Express backend (`Backend/`)

---

### Frontend — React 19 + Vite + Tailwind CSS

Task and team state are loaded from the API by `useTasks` and `useTeam`; authentication is handled by `useAuth`.

**Data flow:**
```
HomePage
  └── useTasks()          ← task CRUD + sorting
  └── useTeam()           ← team membership, invitations and manager indicators
  └── useTheme()          ← dark/light, persisted in localStorage
        └── TaskList      ← renders filtered task array
        └── TaskModal     ← create/edit form (controlled)
        └── ThemeToggle   ← button wrapper
```

- **`src/hooks/useTasks.js`** — task API integration and sorting. Sorting order: pending before done → priority (high/medium/low) → `updatedAt` desc.
- **`src/hooks/useTeam.js`** — team API integration, invite inbox and manager indicators.
- **`src/services/taskService.js`** — task API requests and backend value normalization.
- **`src/services/teamService.js`** — team, invitation and dashboard API requests.
- **`src/hooks/useTheme.js`** — theme stored under `taskflow:theme`. Applies `dark` class to `<html>`. Follows system preference unless user has set an explicit override.
- **`src/styles/tailwind.css`** — defines shared utility classes `.card`, `.input`, `.select` via `@layer components`. Tailwind dark mode uses `class` strategy.

---

### Backend — Express 5 + MongoDB (Mongoose) + JWT

**Structure:**
```
Backend/
  App.js                  ← entry point: Express, CORS, MongoDB connection
  Router/router.js        ← route definitions
  Controllers/            ← auth, task and team controllers
  model/models.js         ← Mongoose users, tasks, teams and invitations
  services/               ← authentication, authorization and serverless helpers
  .env                    ← local environment variables
  .env.example            ← environment variable template
```

**API routes:**
| Method | Path        | Body (`form` object)         | Description          |
|--------|-------------|------------------------------|----------------------|
| POST   | `/register` | `{ name, email, password }`  | Create account, returns JWT |
| POST   | `/login`    | `{ email, password }`        | Authenticate, returns JWT   |
| GET/POST | `/team` | — / `{ name }` | Read or create a team |
| GET/POST | `/team/invites` | — / `{ email }` | Read in-app invitations or invite a registered account |
| POST | `/team/invites/respond` | `{ inviteId, accept }` | Accept or decline an invitation |
| GET | `/team/dashboard` | — | Manager indicators per team member |

All request bodies must have the shape `{ form: { ... } }`.

**Technologies:**
- `express` 5 — HTTP server
- `mongoose` — MongoDB ODM; default DB: `taskflow` on `mongodb://127.0.0.1:27017`
- `argon2` — password hashing
- `jsonwebtoken` — JWT generation/signing (14-day expiry)
- `cors` — restricts browser requests to `FRONT_URI` (default `http://localhost:5173`)
- `dotenv` — loads `Backend/.env`

**Environment variables (`Backend/.env`):**
```
PORT=3000
MONGO_URI=<mongodb atlas or local URI>
FRONT_URI=http://localhost:5173
JWT_SECRET=<secret>
INITIAL_MANAGER_EMAIL=<email>
```

---

### Frontend ↔ Backend connection

In development, Vite proxies `/api/*` → `http://localhost:3000/*` (configured in `vite.config.js`). This means the frontend should call `/api/register` and `/api/login` — Vite strips the `/api` prefix and forwards to the backend.

CORS on the backend is configured to accept requests only from `FRONT_URI` (default `http://localhost:5173`).

**Example fetch from the frontend:**
```js
// register
fetch('/api/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ form: { name, email, password } }),
})

// login
fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ form: { email, password } }),
})
```

Auth endpoints return `{ msg: string, token?: string }`. Task dates use `YYYY-MM-DD`; invitations appear in the invited user's TaskFlow inbox and are not emailed externally.
