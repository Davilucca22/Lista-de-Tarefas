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

All task state lives in `useTasks`; there is no external state library. Auth is not yet wired into the frontend — that integration is pending.

**Data flow:**
```
HomePage
  └── useTasks()          ← all task CRUD + sorting
  └── useTheme()          ← dark/light, persisted in localStorage
        └── TaskList      ← renders filtered task array
        └── TaskModal     ← create/edit form (controlled)
        └── ThemeToggle   ← button wrapper
```

- **`src/hooks/useTasks.js`** — single source of truth for tasks. Sorting order: pending before done → priority (high/medium/low) → `updatedAt` desc. Throws on empty title.
- **`src/services/taskStorage.js`** — `localStorage` under key `taskflow:tasks:v1`. `normalizeTask()` sanitizes/validates each item on load, silently dropping malformed entries.
- **`src/hooks/useTheme.js`** — theme stored under `taskflow:theme`. Applies `dark` class to `<html>`. Follows system preference unless user has set an explicit override.
- **`src/styles/tailwind.css`** — defines shared utility classes `.card`, `.input`, `.select` via `@layer components`. Tailwind dark mode uses `class` strategy.

---

### Backend — Express 5 + MongoDB (Mongoose) + JWT

**Structure:**
```
Backend/
  App.js                  ← entry point: Express, CORS, MongoDB connection
  Router/router.js        ← route definitions
  Controllers/
    RegisterController.js ← POST /register
    LoginController.js    ← POST /login
  model/
    modelUser.js          ← Mongoose User schema (NAME, EMAIL, PASSWORD)
  .env                    ← env vars (not committed)
```

**API routes:**
| Method | Path        | Body (`form` object)         | Description          |
|--------|-------------|------------------------------|----------------------|
| POST   | `/register` | `{ name, email, password }`  | Create account, returns JWT |
| POST   | `/login`    | `{ email, password }`        | Authenticate, returns JWT   |

All request bodies must have the shape `{ form: { ... } }`.

**Technologies:**
- `express` 5 — HTTP server
- `mongoose` — MongoDB ODM; default DB: `taskflow` on `mongodb://127.0.0.1:27017`
- `argon2` — password hashing
- `jsonwebtoken` — JWT generation/signing (14-day expiry)
- `cors` — restricts to `FRONT_URI` env var
- `dotenv` — loads `Backend/.env`

**Environment variables (`Backend/.env`):**
```
PORT=3000
MONGO_URI=<mongodb atlas or local URI>
FRONT_URI=http://localhost:5173
JWT_SECRET=<secret>
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

Both endpoints return `{ msg: string, token?: string }`.
