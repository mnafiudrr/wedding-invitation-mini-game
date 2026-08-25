# Task 4.2 — Auth Instance, Types & Hooks

- **Status**: [ ] TODO
- **Milestone**: 4 — Admin Dashboard
- **Depends on**: 04-1
- **Blocks**: 04-3, 04-4

## Objective
Configure the Lucia instance server-side, expose typed `locals.user` / `locals.session`, and wire SvelteKit handle hooks so every request carries session state.

## Steps

### 1. Create `src/lib/server/auth/index.ts`
- Initialize Lucia with the MySQL adapter wired to the **existing** `mysql2` pool from `src/lib/server/db/index.ts` (reuse the pool; do not open a second connection).
- Session cookie config:
  - name: `wedding_session`
  - attributes: `httpOnly: true`, `sameSite: 'lax'`, `secure: import.meta.env.PROD`, `path: '/'`
- Session expiry: 30 days, with sliding refresh (revalidate when < 15 days left) per Lucia guide.
- Export `validateSessionToken(token: string)` returning `{ session, user }`.
- Cache validation per request if needed later; do not over-engineer now.

### 2. Update `src/app.d.ts`
```ts
declare global {
  namespace App {
    interface Locals {
      user: import('$lib/server/auth').User | null;
      session: import('$lib/server/auth').Session | null;
    }
  }
}
```

### 3. Create `src/hooks.server.ts`
- Read cookie `wedding_session` via `event.cookies.get`.
- If present: validate token → set `event.locals.user/session`; delete stale cookies for expired sessions.
- If absent: `event.locals.user = null; event.locals.session = null`.
- Order matters: hooks must run before route handlers (default behavior of single `handle`).

### 4. Sanity check
- Temporarily log `event.locals.user` in `+page.server.ts` load to confirm null (unauthenticated) without errors.

## Constraints
- All auth code stays under `src/lib/server/` — never imported by client code.
- Never log tokens or password hashes.
- No REST endpoints; sessions are handled purely via cookies + hooks.

## Acceptance criteria
- [ ] App boots with `npm run dev` and public pages work unchanged for anonymous visitors
- [ ] `npm run check` passes with new `App.Locals` types
- [ ] Expired/invalid cookie results in clean `null` locals and cookie deletion

## Files touched
- `src/lib/server/auth/index.ts` (new), `src/hooks.server.ts` (new), `src/app.d.ts` (edit)
