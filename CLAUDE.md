# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # dev server (Vite, HMR)
npm run build     # production build → dist/
npm run preview   # serve the dist/ build locally
npm run lint      # ESLint
```

No test framework is configured.

## Architecture

### TaskFlow — React web app (`src/`)

React 19 + Vite + Tailwind CSS. All state lives in the `useTasks` custom hook; there is no external state library.

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
