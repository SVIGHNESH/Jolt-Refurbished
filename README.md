# JOLT // 88

A loud little notebook. Memphis-arcade aesthetic, Next.js 14 (App Router) on top of Postgres.

## Stack

| Layer | What |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| DB | Postgres (Neon serverless driver) |
| ORM | Drizzle ORM + drizzle-kit |
| Auth | Auth.js v5 — Google + GitHub OAuth + magic-link via Resend, **DB sessions** |
| Rate limit | Upstash Ratelimit (Redis) |
| Hosting | Vercel (recommended) |

## Local development

```bash
npm install
cp .env.example .env.local
# fill in DATABASE_URL + AUTH_SECRET at minimum
npm run db:push       # apply schema
npm run dev           # http://localhost:3000
```

If you don't fill in OAuth/Resend creds, the corresponding sign-in buttons just won't work; the rest of the app still runs. Upstash creds are optional in dev — the limiters no-op if absent.

### Required env vars

See `.env.example`. The bare minimum to boot:

- `DATABASE_URL` — Neon pooled Postgres URL
- `AUTH_SECRET` — `openssl rand -base64 32`

For real sign-in, add credentials for at least one provider (Google, GitHub, or Resend).

## Scripts

```bash
npm run dev            # dev on 0.0.0.0:3000 (LAN-accessible)
npm run dev:local      # dev on localhost only
npm run build          # production build
npm start              # production server
npm run lint           # next lint
npm run db:generate    # drizzle-kit generate (write a new migration)
npm run db:migrate     # drizzle-kit migrate (apply pending)
npm run db:push        # drizzle-kit push (sync schema directly — dev only)
npm run db:studio      # drizzle-kit studio (DB inspector)
```

## Architecture

```
app/
  page.tsx                    sticker-board UI (client)
  layout.tsx                  root layout, fonts, metadata
  globals.css                 design tokens + Memphis grain background
  login/                      auth-gated entry; server actions hit signIn()
  settings/                   profile, export, danger zone
  _components/UserMenu.tsx    avatar dropdown
  api/
    auth/[...nextauth]/       Auth.js handlers
    notes/, notes/[id]/       CRUD; per-user filtered
    notes/[id]/export/        single-note .md download
    categories/, tags/        lookup endpoints
    export/                   GET /api/export → notes zip
    account/                  DELETE /api/account → cascade-delete user

lib/
  auth/current-user.ts        getCurrentUserId() from session
  api-helpers.ts              resolveUser() → 401 if anon
  ratelimit.ts                Upstash limiters (no-op if creds absent)
  export.ts                   markdown frontmatter + zip builder
  db/
    client.ts                 Neon driver + Drizzle client
    schema.ts                 all tables + relations
    repos/                    notesRepo / categoriesRepo / tagsRepo
                              (every method takes userId first)

middleware.ts                 redirects anon → /login
auth.ts                       Auth.js v5 config
drizzle.config.ts             drizzle-kit config
drizzle/migrations/           generated SQL
```

### Per-user isolation

Every repo method takes `userId` as its first argument and every query has
`WHERE user_id = $userId`. There is no row-level security policy in Postgres
— isolation is enforced at the application layer only. The audit surface is
the three files in `lib/db/repos/`.

### Sessions

Auth.js is configured with `session.strategy: 'database'`. Session rows live
in the `sessions` table; deleting a user cascades the session, so account
deletion is instant revocation. There is no JWT.

### Tags

Tags are per-user (`UNIQUE(user_id, name)`) and auto-created when a note is
saved with new tag names. Clients pass `tags: string[]` on note create/update;
the repo upserts and writes the `note_tags` junction.

## Export

- `GET /api/export` — zip with `notes.json` (full backup, schemaVersion 1) +
  `notes/<slug>-<id>.md` files (YAML frontmatter + body) + `README.txt`.
- `GET /api/notes/:id/export` — single `.md` for one note.

Import is not implemented in v1; the `notes.json` format is stable for a
future round-trip.

## Account deletion

`/settings → Danger Zone`. Forced two-step flow:

1. Click "export now" (download your data).
2. Type `DELETE my account` to enable the final button.

`DELETE /api/account` requires the matching confirm phrase, then runs
`db.delete(users).where(...)`. Foreign keys cascade to wipe notes, tags,
categories, note_tags, accounts, and sessions in one transaction.

## Rate limits

Configured in `lib/ratelimit.ts`. All gracefully no-op without Upstash creds.

| Surface | Limit |
|---|---|
| Magic-link send (per email) | 5 / hour |
| Magic-link send (per IP) | 20 / hour |
| Note / category / tag writes | 60 / minute / user |
| `/api/export` | 5 / hour / user |

## Design

See `DESIGN_GUIDE.md` (preserve the JOLT // 88 Memphis aesthetic when editing
UI). The visual language is intentionally loud: chunky Bungee display, hard
ink-black borders, hard offset block shadows, candy palette (pink, cyan,
yellow, mint, lavender, tangerine), animated SVG Memphis pattern background.
