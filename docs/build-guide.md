# RentHub — Build Guide (learn by building)

> For the project owner, who is coding RentHub from scratch to understand every part.
> [`roadmap.md`](roadmap.md) says **what** must be delivered; this guide says **in which order to build it so each step teaches one idea**.
> Rules of the game: one step at a time, each step ends with something you can **see running**. Don't start the next step until the checkpoint passes.

## How to work with Claude

- Write the code yourself. Ask Claude to **explain** a concept, **review** your code (`/ponytail-review`), or give a **hint** — not to write the step for you.
- Stuck more than ~30 minutes? Ask for a hint, then a smaller hint, then the answer.
- After each step: `npm run lint`, `npm run build`, commit with a clear message.

## Map

| Step | You build | You learn | Roadmap phase |
|---|---|---|---|
| 0 | Environment ready | Next.js folders, env vars, Supabase | 0 |
| 1 | Home page with Tailwind | App Router, layouts, Server Components | 0 |
| 2 | Show wards from the DB | Drizzle schema, migrations, DB client | 0 |
| 3 | Register form | Server Actions, zod, bcrypt | 1 |
| 4 | Login / logout | next-auth, JWT session, cookies | 1 |
| 5 | Role-protected dashboards | Authorization, middleware, seed data | 1 |
| 6 | Host creates and lists requests | Ownership, foreign keys, forms | 2 |
| 7 | Edit / cancel by status | State machine, unit tests (Vitest) | 2 |
| 8 | Agent claims a request | Conditional updates, transactions, race conditions | 3 |
| 9 | Request changes / approve / reject | Status history, reasons, CHECK constraints | 3 |
| 10 | Listings with photos | File upload, Supabase Storage, slugs | 4 |
| 11 | Public marketplace | ISR, search, pagination | 5 |
| 12 | SEO | Metadata, JSON-LD, sitemap, robots | 5 |
| 13 | Saved listings + enquiries | Composite keys, inbox pattern | 6 |
| 14 | End-to-end tests | Playwright, security checks | 7 |
| 15 | Deploy | Vercel, production DB, Search Console | 8 |

---

## Step 0 — Environment

**Do**
1. Create the Supabase project in **Singapore**: Data API off, auto-expose off, automatic RLS on.
2. Put `DATABASE_URL` (Session pooler, port 5432) in `.env`.
3. Point `.mcp.json` at the new project ref (ask Claude).
4. `npm run dev` → open http://localhost:3000.

**Learn:** what each top-level file does (`package.json`, `next.config.mjs`, `tailwind.config.ts`, `tsconfig.json`); why `.env` is never committed.

**Checkpoint:** the dev server starts (a 404 is fine — there is no page yet). You can explain what `src/app/layout.tsx` does.

## Step 1 — First page

**Do**
1. Create `src/app/page.tsx` with a RentHub heading and a short intro in Vietnamese.
2. Set `<html lang="vi">` and the site title in `layout.tsx`.
3. Style it with Tailwind. Make it look right on a phone (browser dev tools → mobile view).

**Learn:** file-based routing (`app/about/page.tsx` → `/about`), layouts, Server vs Client Components (`"use client"`).

**Checkpoint:** you can add a second page `/gioi-thieu` and link to it with `<Link>`.

📖 nextjs.org/docs/app — "Layouts and Pages", "Server and Client Components"

## Step 2 — Database: wards

Start with **one** table so the whole pipeline is clear before it gets big.

**Do**
1. In `src/db/schema.ts`, define only the `wards` table (see `database.md`).
2. `npm run db:generate` → open the SQL file in `drizzle/` and read it.
3. `npm run db:migrate` → check the table in Supabase Table Editor.
4. Write a second migration that inserts the 4 wards.
5. Create `src/db/client.ts` (postgres driver + drizzle, `prepare: false`, `server-only`).
6. On the home page, query the wards and list them.

**Learn:** schema → migration → database; why migrations are files you commit; why DB code must never run in the browser.

**Checkpoint:** the home page shows the 4 wards from the database. You can explain the difference between `db:push` and `db:migrate`.

📖 orm.drizzle.team/docs — "Get started with Supabase", "Migrations"

## Step 3 — Register

**Do**
1. Add `users` table + `user_role` enum → generate → migrate.
2. Page `/dang-ky` with a form: name, email, phone, password, role (host or client only).
3. A Server Action that: validates with zod → lowercases email → hashes password with bcrypt → inserts.
4. Show Vietnamese errors: invalid fields, email already used.

**Learn:** Server Actions, validation at the trust boundary, why passwords are hashed (never encrypted, never stored plain).

**Checkpoint:** you can register; a row appears in `users` with a hash, not the password. Sending `role: "admin"` (edit the form in dev tools) is **rejected**.

📖 nextjs.org/docs — "Forms and Mutations"; zod.dev

## Step 4 — Login and session

**Do**
1. next-auth Credentials provider: find user by email, compare with bcrypt, refuse `is_active = false`.
2. Put `id` and `role` into the JWT and session (type them in `next-auth.d.ts`).
3. Login page `/dang-nhap`, logout button, show "Xin chào, {name}" in the header.

**Learn:** how a session cookie works, what is inside a JWT, why the role must come from the server.

**Checkpoint:** log in, refresh — still logged in; log out — gone. You can find the session cookie in dev tools and explain why JS can't read it (HttpOnly).

📖 next-auth.js.org — "Credentials", "Callbacks"

## Step 5 — Roles and protected areas

**Do**
1. `lib/auth.ts`: `getCurrentUser()` and `requireRole(...roles)`.
2. Empty dashboards: `/host`, `/agent`, `/admin`, `/account`, each calling `requireRole`.
3. `middleware.ts`: redirect logged-out users to login (convenience only).
4. Admin page: create an Agent account.
5. Seed script: 1 admin, 2 agents, 1 host, 1 client (dev only).

**Learn:** authentication (who you are) vs authorization (what you may do); why middleware is not the security boundary.

**Checkpoint:** logged in as a client, opening `/agent` is refused even if you type the URL.

## Step 6 — Host: create and list requests

**Do**
1. Add `property_type`, `property_request_status` enums and `property_requests` table → migrate.
2. `/host/yeu-cau/moi`: form → zod → service `createRequest(user, data)` → insert with `host_id = user.id`, `status = pending`.
3. `/host/yeu-cau`: list **only** the current host's requests.
4. Detail page `/host/yeu-cau/[id]`.

**Learn:** the service layer (`services/`), never trusting `host_id`/`status` from the form.

**Checkpoint:** Host A cannot open Host B's request by changing the id in the URL (you get 404, not the data).

## Step 7 — State machine and tests

**Do**
1. `src/domain/property-request.ts`: a transition table (status + action → next status) and `canTransition()`. Pure functions, no DB.
2. Install Vitest; write tests for every allowed and forbidden transition in `spec.md` §3.
3. Host edit (only `pending`/`needs_changes`) and cancel (`pending`/`accepted`/`needs_changes`) using the domain check.

**Learn:** why business rules live in one pure module; how tests protect them.

**Checkpoint:** `npm test` is green and covers every row of the spec's status table. Cancelling an `approved` request is refused.

📖 vitest.dev — "Getting Started"

## Step 8 — Agent claims (concurrency)

**Do**
1. `/agent/hang-cho`: list `pending` requests.
2. Claim = **one** conditional `UPDATE ... WHERE id = $1 AND status = 'pending' AND assigned_agent_id IS NULL`. 0 rows → "Hồ sơ đã có người nhận".
3. Add `property_request_status_history`; write the history row in the **same transaction**.

**Learn:** race conditions, why "read then check then write" is unsafe, transactions.

**Checkpoint:** open the same request in two browsers as two agents, click claim in both → exactly one succeeds. Write a test that does the same with `Promise.all`.

## Step 9 — Review: request changes, approve, reject

**Do**
1. Actions for the assigned agent only; reason required for request-changes and reject (zod + DB CHECK).
2. Host resubmits after changes → back to `accepted`, same agent.
3. Show the history timeline on the request detail page.

**Checkpoint:** the spec flow works by hand: submit → request changes → resubmit → approve. Another agent cannot approve it.

## Step 10 — Listings and photos

**Do**
1. `listings` + `listing_images` tables; `listing_status` enum.
2. Create a draft listing from an `approved` request (copy public fields only — no address line, no notes).
3. Storage bucket; upload with a server-issued signed URL; reorder/delete photos.
4. Slug generator for Vietnamese titles (remove accents) + id suffix.
5. Publish (required fields + ≥ 1 photo), archive, back to draft.

**Learn:** direct-to-storage uploads, unique constraints, slugs.

**Checkpoint:** a second listing for the same request is impossible; publishing without a photo is refused.

## Step 11 — Public marketplace

**Do**
1. Home: latest published listings, links per ward.
2. `/thue-nha-quan-7` with filters (ward, type, price, bedrooms) and pagination.
3. `/thue-nha-quan-7/[ward]` and `/nha-cho-thue/[slug]`.
4. `revalidatePath` when a listing is published/archived/edited.
5. Use `/ui-ux-pro-max` to pick the visual style before polishing.

**Checkpoint:** logged out, you can find and open a published listing; drafts and archived listings are never shown.

## Step 12 — SEO

**Do:** `generateMetadata`, canonical URLs, Open Graph, JSON-LD (`RealEstateListing`, `BreadcrumbList`), `sitemap.ts`, `robots.ts`, 410 for archived listings, 301 for changed slugs, `noindex` on private pages.

**Checkpoint:** Google's Rich Results Test passes on a listing page; Lighthouse SEO ≥ 90 on mobile.

📖 nextjs.org/docs — "Metadata", "sitemap.xml"; developers.google.com/search/docs

## Step 13 — Saved listings and enquiries

**Do:** save/unsave (composite primary key), enquiry form on published listings (login required, rate-limited), client "my enquiries", agent inbox with `new → contacted → closed`.

**Checkpoint:** the full spec §6 flow works end to end by hand.

## Step 14 — End-to-end tests

**Do:** Playwright test of the spec §6 flow; tests that cross-user access and invalid transitions are blocked.

**Checkpoint:** `npx playwright test` green.

## Step 15 — Deploy

**Do:** buy the domain, production Supabase project (Singapore), Vercel project (region `sin1`), env vars, run migrations, create the real admin, submit the sitemap in Google Search Console.

**Checkpoint:** the live site runs the full flow; Search Console accepts the sitemap.
