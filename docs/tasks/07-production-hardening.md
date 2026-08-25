# Task 7 — Production Hardening (cross-cutting, before launch)

- **Status**: [ ] TODO
- **Milestone**: n/a — discovered during plan-vs-repo comparison
- **Depends on**: M4 complete (for moderation flow), ideally after M5/M6
- **Blocks**: launch

## Objective
Close the gaps between the dev-stage app and a safe production deployment. Items below were found by inspecting the repo; none are covered by existing plan tasks.

## 7.1 Disable message auto-approval (CRITICAL)
`src/routes/+page.server.ts:67`
```ts
isApproved: true, // Auto approve for development testing
```
Change to `false`. Only do this AFTER `/admin/messages` moderation (04-6) works end-to-end, otherwise no one can approve messages.
- [ ] Done

## 7.2 Migration strategy decision
- `drizzle.config.ts` outputs to `./drizzle` but **no migration files exist**; DB was presumably built via `push`.
- Decide: `drizzle-kit generate` + committed SQL migrations in git (recommended for prod reproducibility) vs continuing `push`.
- If generating: baseline the current schema (`guests`, `messages`, `users`, `sessions`) and document `npx drizzle-kit migrate` in README.
- [ ] Decision made & applied

## 7.3 Deployment adapter & env
- `@sveltejs/adapter-auto` is installed but no platform detected → builds may produce nothing deployable. Pick target (VPS/node, Cloudflare, Vercel…) and install matching adapter.
- Add `.env.example` with `DATABASE_URL` (no real secrets).
- Ensure prod MySQL is reachable and credentials come from host env vars, never committed.
- [ ] Done

## 7.4 Input hardening on form actions
Current actions trust client data loosely:
- `rsvp`: clamp `headcount` to sane range (1–10); trim/limit string lengths to schema sizes (name ≤ 100).
- `message`: trim strings; enforce max length for `message` text (e.g., 500 chars) before insert; consider simple spam throttle per IP.
- [ ] Done

## 7.5 Quality tooling
- No lint/format scripts exist (only `check`). Add:
  - `prettier` (+ plugin-svelte) with `"format": "prettier --write ."`
  - `eslint` (+ eslint-plugin-svelte) with `"lint": "eslint ."`
- Run once over whole codebase; keep config minimal.
- [ ] Done

## 7.6 Small polish items (optional)
- `docker-compose.yml` uses mysql 8.4 while plan doc says 8.0 — update docs or compose so they agree.
- Title screen names are hardcoded placeholders ("John Doe & Jean Dea" in `+page.svelte:74`) — move real couple/event data into `src/lib/data/couple.ts` alongside `houses.ts` so content is editable in one place (feeds BrideGroom/Events/Credits menus too).
- Add `<meta>` description + og tags in `app.html` for sharing on WhatsApp/social (wedding invites get shared!).
- Favicon exists (`src/lib/assets/favicon.svg`) — confirm it renders.

## Acceptance criteria
- [ ] Public message submission no longer auto-approves
- [ ] Fresh clone can rebuild the full DB from committed migrations + documented commands
- [ ] `npm run build` produces a deployable artifact for chosen adapter
- [ ] `npm run lint && npm run check` both pass
