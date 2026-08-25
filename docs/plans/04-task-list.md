# Task List & Execution Status (For AI Agents)

This is the source of truth for project progress. Before starting a new task, read this document to understand the current state. When completing a task, update this document.

## 🟩 Milestone 1: Gameplay Navigation Prototype (COMPLETED)
- [x] Scaffold SvelteKit app using Svelte 5 and TypeScript.
- [x] Configure global CSS resets (`touch-action: none`, hidden overflow).
- [x] Build `game.ts` stores (`charX`, `cameraX`, `gameState`).
- [x] Build `World.svelte` and `Character.svelte` utilizing `translate3d`.
- [x] Implement game loop in `+page.svelte` using `requestAnimationFrame`.
- [x] Implement on-screen left/right buttons using `touchstart` and `mousedown` with `{ hard: true }` spring overrides.

## 🟩 Milestone 2: Menu Interaction System (COMPLETED)
- [x] Map out 7 houses in `src/lib/data/houses.ts` (World width capped at 2500px, 320px spacing).
- [x] Build `House.svelte` with `$derived` proximity checking and CSS bounce classes.
- [x] Build `Modal.svelte` with glassmorphism (`backdrop-filter`).
- [x] Integrate `$activeModal` store to dynamically freeze movement.

## 🟩 Milestone 3: Content System (COMPLETED)
- [x] Configure `docker-compose.yml` for local MySQL 8.0 instance.
- [x] Setup Drizzle ORM config and schema (`guests`, `messages`).
- [x] Build 7 specific Svelte components in `src/lib/components/ui/menus/`.
- [x] Implement dynamic rendering (`<Component />`) inside `Modal.svelte`.
- [x] Implement `+page.server.ts` form actions for RSVP submission (handling `ER_DUP_ENTRY`).
- [x] Implement `+page.server.ts` message submission and data loading.

## 🟩 Milestone 4: Admin Dashboard (COMPLETED)
> Implementation note: Lucia is archived upstream — session auth implemented manually (node crypto scrypt + hashed session tokens) following the Lucia pattern. See `docs/tasks/04-1` decision record.
- [x] ~~**Dependencies**~~: No new deps needed (manual session auth, zero-dependency decision in 04-1).
- [x] **Schema Update**: `users` and `sessions` tables added; applied via `drizzle-kit push`. Seed via `npm run create-admin`.
- [x] **Auth Setup**: `src/lib/server/auth/index.ts` (session create/validate/invalidate) + `src/hooks.server.ts` populating `locals.user` / `locals.session`.
- [x] **Auth Routes**: `/admin/login` with rate limiting (5 attempts / 5 min).
- [x] **Admin Layout**: Guard in `/admin/+layout.server.ts` + nav shell with logout.
- [x] **RSVP Dashboard**: `/admin/rsvps` with summary cards, filter, client-side CSV export.
- [x] **Moderation Dashboard**: `/admin/messages` with `?/toggleApproval` + `?/deleteMessage`.

## 🟨 Milestone 5: Asset Integration & Optimization (IN PROGRESS)
- [ ] Add retro font faces to `static/fonts` and apply to `app.css`.
- [x] Build CSS sprite animation logic for `Character.svelte` (front-facing idle 2-frame + walk 6-frame sheets; placeholder art via generator script).
- [ ] Replace `House.svelte` colored boxes with image assets.
- [ ] Add `Parallax.svelte` component for clouds/background elements.

## 🟨 Milestone 6: Audio System & Final Polish (IN PROGRESS)
- [x] Build `AudioController.ts` utility (zero-dep Web Audio singleton).
- [x] Add UI mute toggle button overlay (emoji glyphs until icon PNGs arrive).
- [x] Integrate BGM and sound effect triggers (steps, modal open, select) — placeholder WAVs; replace with compressed assets before launch.

Asset specs: see `docs/graphics-needed.md`.
