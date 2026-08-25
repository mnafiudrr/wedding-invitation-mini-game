# Task 4.3 — Admin Login Route

- **Status**: [ ] TODO
- **Milestone**: 4 — Admin Dashboard
- **Depends on**: 04-2
- **Blocks**: 04-4

## Objective
Create `/admin/login` with a credential login form action that issues a session cookie.

## Steps

### 1. `src/routes/admin/login/+page.server.ts`
- `load`: if `locals.user` already exists, `redirect(302, '/admin')`.
- Action `?/login`:
  1. Parse `username`, `password` from form data.
  2. Look up user by username; on miss return `fail(400, { error: 'Invalid credentials' })` (do NOT reveal whether the username exists).
  3. Verify password hash with the same algorithm used in `scripts/create-admin.ts`.
  4. Create session via Lucia (`createSession`), set cookie.
  5. `redirect(302, '/admin')`.

### 2. Logout
- Add a `?/logout` POST action here or in `/admin/+page.server.ts` (see 04-4): validate current session, invalidate it, delete cookie, redirect to `/admin/login`.

### 3. `src/routes/admin/login/+page.svelte`
- Simple centered card matching site aesthetic (pastel vars from `app.css`, pixel border style like `.control-btn`).
- `<form method="POST" action="?/login" use:enhance>`:
  - username input, password input, submit button
  - Show `{form?.error}` text on failure
- Disable double-submit while pending (`use:enhance` default cancel behavior is fine).
- No game components on this route.

## Constraints
- Rate limiting: add a minimal in-memory attempt counter per IP+username (e.g., 5 attempts / 5 min) — keep it simple; note it resets on server restart. Do not pull extra deps.
- Errors are generic; timing-safe comparison where the hashing lib provides it.

## Acceptance criteria
- [ ] Wrong creds → inline error, no navigation
- [ ] Correct creds → redirected to `/admin`, cookie set (verify in devtools)
- [ ] Visiting `/admin/login` while logged in bounces to `/admin`
- [ ] `npm run check` passes

## Files touched
- `src/routes/admin/login/+page.server.ts` (new), `src/routes/admin/login/+page.svelte` (new)
