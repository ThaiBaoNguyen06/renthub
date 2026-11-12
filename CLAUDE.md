# RentHub

A rental platform for **District 7 (Ho Chi Minh City)**. Hosts submit property requests, Agents review them and publish listings, Clients search listings and send enquiries.

The project is being **rebuilt from scratch**. The old code is still in git (commit `eb8a394`) for reference only; do not reuse it unless asked.

## Source of truth

- **MVP spec:** [`docs/spec.md`](docs/spec.md) (original PDF: `output/pdf/RentHub-Dac-ta-MVP-v1.0.pdf`). Read it before working on any feature.
- **Database design:** [`docs/database.md`](docs/database.md). `src/db/schema.ts` must match it; update the doc first, then the code.
- **Architecture:** [`docs/architecture.md`](docs/architecture.md) (layers, security, SEO, deployment). Follow its patterns.
- **Roadmap:** [`docs/roadmap.md`](docs/roadmap.md). Work phase by phase; tick checkboxes as items land.
- If code and spec disagree, **the spec wins**. Any scope change must be confirmed with the project owner first, then written into the spec.
- Anything outside the MVP (sales, payments, e-contracts, live chat, advanced maps) is **out of scope**.

## Tech stack

- Next.js 14 (App Router) + React 18 + TypeScript
- Tailwind CSS
- PostgreSQL on **Supabase** + Drizzle ORM (`src/db/schema.ts`), connected with the `postgres` driver
  - Supabase is used as the Postgres database only; auth stays with next-auth.
  - When using the Supabase transaction pooler (port 6543), create the client with `prepare: false`.
  - Photo storage: Supabase Storage (to be confirmed when building listings).
- Auth: next-auth v4 + bcryptjs
- Input validation: zod

## Commands

```bash
npm run dev        # dev server at http://localhost:3000
npm run build      # production build
npm run lint       # lint
npm run db:generate  # create a versioned SQL migration in drizzle/ from schema.ts
npm run db:migrate   # apply pending migrations (needs DATABASE_URL)
npm run db:studio    # open Drizzle Studio
npm run db:push      # local experiments only — never on a shared/prod DB
```

Schema changes: edit `docs/database.md` → `schema.ts` → `db:generate` → review the SQL → apply. Migrations are committed and never edited after being applied. The dev Supabase project is also reachable through the Supabase MCP (`.mcp.json`); when applying a migration through MCP, also insert its sha256 hash into `drizzle.__drizzle_migrations` so `db:migrate` stays in sync.

Environment variables live in `.env` (never committed): `DATABASE_URL` (Supabase connection string), `NEXTAUTH_SECRET`, `NEXTAUTH_URL`.

## Roles

Use the role names from the spec: `host`, `agent`, `client`, plus `admin`.

| Role | Main permissions |
|---|---|
| host | Submit Property Requests; view, edit and cancel their own requests |
| agent | Claim requests, request changes, approve/reject, manage Listings and Enquiries |
| client | Browse and search listings; save listings and send Enquiries (login required) |
| admin | Create Agent accounts |

- Guests (not logged in) can view published listings.
- Self-registration is only allowed for `host` and `client`. `agent` accounts are created by an admin.

## Core entities and statuses

**Property Request** (submitted by a Host for Agent review):
`pending → accepted → needs_changes | approved | rejected`; Host cancels → `cancelled`.

**Listing** (managed by an Agent, separate from the Property Request):
`draft → published → archived` (archived can go back to draft).

**Enquiry** (contact request from a Client):
`new → contacted → closed`.

Full transition tables and conditions: see the spec.

## Mandatory rules (enforced on the backend)

- Users only see and act on their own data (Host: own requests; Client: own enquiries; Agent: requests/listings assigned to them).
- Owner, assigned Agent and status are **set by the server**, never taken from the client payload.
- Every status change goes through one transition check that rejects invalid transitions.
- Two Agents claiming the same request: only one succeeds (conditional update in the DB, e.g. `WHERE status = 'pending'`).
- Requesting changes and rejecting both require a reason.
- Record status history: who, when, and why.
- A Listing can only be created from an `approved` Property Request; max one Listing per request; publishing requires all required fields and at least one photo.
- Internal notes are never exposed on public pages.

## Folder structure (planned)

```
src/
  app/            # pages and API routes (App Router)
  db/             # schema.ts, DB connection
  lib/            # auth, authorization, shared helpers
  services/       # business logic and status transitions
  validators/     # zod schemas for input
  components/     # shared UI
docs/             # spec and design docs
```

## Working conventions

- Work in small steps; after each feature run `npm run lint` and `npm run build`.
- API routes only parse the request and call a service; business logic and permission checks live in `services/`.
- Validate every input with zod before touching the DB.
- User-facing UI text and error messages: **Vietnamese**. Code, table and column names, docs: **English**.
- Explain things to the project owner in **Vietnamese**.
- Never commit or push without asking first.
