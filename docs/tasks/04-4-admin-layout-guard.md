# Task 4.4 — Admin Layout & Auth Guard

- **Status**: [x] DONE (2026-08-25)

> Verified live: anonymous `/admin` → 302 login; logged-in shows nav + username; logout invalidates
> session server-side (row deleted) and clears cookie. Guard approach: layout `load` guard + per-page
> re-check in each admin page's own load/action (belt-and-braces). Login page returns early from the
> layout guard and renders no nav.
- **Milestone**: 4 — Admin Dashboard
- **Depends on**: 04-2, 04-3
- **Blocks**: 04-5, 04-6

## Objective
Protect all `/admin/*` routes (except `/admin/login`) with a layout-level server guard and provide admin navigation chrome.

## Steps

### 1. `src/routes/admin/+layout.server.ts`
```ts
export const load = async ({ locals, url }) => {
  if (!locals.user) {
    // don't guard the login page itself
    if (!url.pathname.startsWith('/admin/login')) {
      redirect(302, '/admin/login');
    }
    return {};
  }
  return { user: { username: locals.user.username } };
};
```
Note: SvelteKit layout loads do NOT re-run for child navigations by default for server data unless invalidated — verify behavior with `depends()`/`invalidateAll` or simply rely on each admin page also checking `locals.user` as belt-and-braces. Document the chosen approach here.

### 2. `src/routes/admin/+layout.svelte`
- Minimal nav bar: links to `/admin/rsvps`, `/admin/messages`, and a logout button.
- Logout button posts to `?/logout` action defined in `src/routes/admin/+page.server.ts` (or a dedicated `/admin/logout/+page.server.ts`) → invalidates session + clears cookie + redirects to `/admin/login`.
- Render page content below nav; plain vanilla CSS, reuse global pastel variables.

### 3. Ensure login route bypasses guard
- `/admin/login` must remain reachable when unauthenticated (see snippet above) and must not render admin nav (use a separate route group or conditional rendering based on `data.user`).

## Constraints
- Guard must be **server-side** (layout `server.ts` / per-page checks) — client-only guards are unacceptable.
- No changes allowed to public game routes.

## Acceptance criteria
- [ ] Anonymous visit to `/admin`, `/admin/rsvps`, `/admin/messages` → 302 to `/admin/login`
- [ ] Logged-in visit shows nav + username
- [ ] Logout clears cookie and redirects; back-button does not resurrect protected pages (session invalidated server-side)
- [ ] `npm run check` passes

## Files touched
- `src/routes/admin/+layout.server.ts` (new), `src/routes/admin/+layout.svelte` (new), logout action location (new)
