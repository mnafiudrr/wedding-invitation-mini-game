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

## 🟨 Milestone 4: Admin Dashboard (TO DO - UP NEXT)
- [ ] **Dependencies**: Install Lucia auth packages (`lucia`, `oslo`, `@lucia-auth/adapter-drizzle`).
- [ ] **Schema Update**: Add `users` and `sessions` tables to `src/lib/server/db/schema.ts` and run `drizzle-kit push`.
- [ ] **Auth Setup**: Configure Lucia instance in `src/lib/server/auth/index.ts`. Set up hooks in `src/hooks.server.ts` to populate `event.locals.user` and `event.locals.session`.
- [ ] **Auth Routes**: Create `/admin/login/+page.svelte` and `/admin/login/+page.server.ts` for credential login.
- [ ] **Admin Layout**: Create `/admin/+layout.server.ts` to redirect unauthenticated users back to login. Create `/admin/+layout.svelte` for admin navigation.
- [ ] **RSVP Dashboard**: Create `/admin/rsvps/+page.svelte` to view and summarize all guest data.
- [ ] **Moderation Dashboard**: Create `/admin/messages/+page.svelte` with actions to toggle `isApproved` on messages.

## 🟥 Milestone 5: Asset Integration & Optimization (TO DO)
- [ ] Add retro font faces to `static/fonts` and apply to `app.css`.
- [ ] Build CSS sprite animation logic for `Character.svelte`.
- [ ] Replace `House.svelte` colored boxes with image assets.
- [ ] Add `Parallax.svelte` component for clouds/background elements.

## 🟥 Milestone 6: Audio System & Final Polish (TO DO)
- [ ] Build `AudioController.ts` utility.
- [ ] Add UI mute toggle button overlay.
- [ ] Integrate BGM and sound effect triggers (steps, bumps).
