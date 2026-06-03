# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS v4
- **Supabase** (`pjkgfdmzhqrivnthxavq`) — auth + postgres (RLS enabled on all tables)
- **OpenRouter API** (`anthropic/claude-3-haiku`) — AI question generation

## Commands

```bash
npm run dev      # dev server at http://localhost:3000
npm run build    # production build
npm run lint     # ESLint
```

## App: JLPT N2 模擬試験

AI-generated JLPT N2 mock exam app with user auth, per-question flagging, and a review mode.

### Routes

| Route | Description |
|---|---|
| `/` | Redirects to `/dashboard` or `/login` |
| `/login`, `/signup` | Auth pages (Supabase Auth) |
| `/dashboard` | Stats + exam history |
| `/exam` | Exam setup (category + count) |
| `/exam/[sessionId]` | Live exam with question navigator |
| `/exam/[sessionId]/results` | Score + question summary |
| `/review` | Study flagged/incorrect questions |

### API Routes

- `POST /api/exam` — creates session + calls OpenRouter to generate questions
- `GET /api/exam/[sessionId]` — fetch session + questions
- `POST /api/exam/[sessionId]/answer` — submit answer, returns is_correct + explanation
- `POST /api/exam/[sessionId]/flag` — toggle unknown/uncertain flag on a question
- `POST /api/exam/[sessionId]/complete` — finalize session, compute score

### Key files

- `src/lib/openrouter.ts` — question generation prompt + OpenRouter API call
- `src/lib/types.ts` — shared TypeScript types
- `src/lib/supabase/client.ts` / `server.ts` — Supabase browser/server clients
- `src/proxy.ts` — auth guard (Next.js 16 uses `proxy.ts`, not `middleware.ts`)
- `src/components/QuestionCard.tsx` — main question UI (answer + flag + feedback)

### DB Schema (Supabase)

- `profiles` — extends `auth.users`, auto-created via trigger
- `exam_sessions` — one per exam, tracks status/score
- `exam_questions` — questions with `question_data` (JSONB), `flag_status`, `user_answer`, `is_correct`

## Environment

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
OPENROUTER_API_KEY=...
```
All three are in `.env.local`. Do not commit this file.
