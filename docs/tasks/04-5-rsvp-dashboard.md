# Task 4.5 — RSVP Dashboard

- **Status**: [ ] TODO
- **Milestone**: 4 — Admin Dashboard
- **Depends on**: 04-4
- **Blocks**: nothing

## Objective
Build `/admin/rsvps` listing all guest RSVPs with summary stats.

## Steps

### 1. `src/routes/admin/rsvps/+page.server.ts`
- Guard: `if (!locals.user) redirect(302, '/admin/login')`.
- `load`: query via Drizzle only (no raw SQL):
```ts
const rows = await db.select().from(guests).orderBy(desc(guests.createdAt));
```
- Compute summary in JS or a second query:
  - total responses, attending count (`isAttending === true`), total headcount (`SUM(headcount)` where attending), not-attending count.
- Return `{ rows, summary }`.

### 2. `src/routes/admin/rsvps/+page.svelte`
- Summary cards row: Total / Attending / Declined / Total Guests (headcount).
- Table columns: Name, Invite Code, Attending, Headcount, Submitted At.
- Mobile-first: table should horizontally scroll on small screens rather than break layout.
- Optional niceties (keep minimal): text input to filter rows client-side by name/code; CSV export button that builds CSV from the loaded data entirely client-side (Blob + download) — no server endpoint.

## Constraints
- Data access exclusively through Drizzle in `+page.server.ts`.
- No mutation actions needed on this page yet; if editing/deleting RSVPs is desired later, add as a new task — do not scope-creep here.

## Acceptance criteria
- [ ] Page renders all seeded/inserted guests with correct counts
- [ ] Unauthenticated access redirects to login
- [ ] Empty DB shows friendly "No RSVPs yet" state, no errors
- [ ] `npm run check` passes

## Files touched
- `src/routes/admin/rsvps/+page.server.ts` (new), `src/routes/admin/rsvps/+page.svelte` (new)
