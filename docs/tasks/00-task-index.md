# Task Index — Current State vs Plan (as of 2026-08-25)

This directory contains detailed, executable task files. Read `docs/plans/04-task-list.md` for high-level status; use these files for actual execution.

## Verified Project State

| Area | Plan says | Actual state |
|---|---|---|
| SvelteKit + Svelte 5 + TS scaffold | Done | ✅ `package.json` confirms svelte 5, kit 2, vite 8 |
| Game stores (`game.ts`) | Done | ✅ `gameState`, `selectedCharacter`, `cameraX`, `charX` (springs), `activeModal` |
| World / Character / House components | Done | ✅ Present in `src/lib/components/game/`, uses `translate3d`, `{ hard: true }` |
| Game loop in `+page.svelte` | Done | ✅ rAF loop with clamped camera (world width 2500) |
| 7 houses data + menus | Done | ✅ `houses.ts` + 7 menu components wired via `modalComponents` record |
| Modal w/ glassmorphism | Done | ✅ `backdrop-filter: blur(8px)` on backdrop only |
| Docker MySQL | Done | ✅ mysql:8.4, db `wedding`, port 3306 (plan doc says "MySQL 8.0" — minor discrepancy) |
| Drizzle schema (`guests`, `messages`) | Done | ✅ `src/lib/server/db/schema.ts`; but **no migrations generated** (`drizzle/` dir missing) |
| Form actions (`?/rsvp`, `?/message`) | Done | ✅ incl. `ER_DUP_ENTRY` handling |
| **Lucia auth deps** | To do | ❌ Not installed (`lucia`, `oslo` absent from package.json) |
| **`users`/`sessions` tables** | To do | ❌ Absent from schema.ts |
| **hooks.server.ts / locals** | To do | ❌ File does not exist; `app.d.ts` has no `locals` types |
| **Admin routes** | To do | ❌ `src/routes/admin/` does not exist |
| **Fonts / pixel-art assets** | To do | ❌ `static/` contains only `robots.txt` |
| **Audio system** | To do | ❌ No audio code anywhere |

## Gaps / Tech Debt Discovered (not in original plan)

1. **Messages auto-approved**: `+page.server.ts:67` sets `isApproved: true` with comment "Auto approve for development testing". Must flip to `false` before launch → covered by task `07-production-hardening.md`.
2. **No migrations**: `drizzle.config.ts` outputs to `./drizzle` but no migration files exist. Decide `push` vs generated migrations for prod.
3. **No lint/test scripts** in `package.json` (only `check`). Consider adding `prettier`/`eslint`.
4. **adapter-auto**: deployment target undecided → see `07-production-hardening.md`.
5. **Lucia is archived/deprecated** upstream (author moved to a pattern-based guide). Task `04-1` includes a decision point.

## Task Files

### Milestone 4 — Admin Dashboard
- [`04-1-auth-dependencies-and-schema.md`](./04-1-auth-dependencies-and-schema.md)
- [`04-2-lucia-setup-and-hooks.md`](./04-2-lucia-setup-and-hooks.md)
- [`04-3-admin-login-route.md`](./04-3-admin-login-route.md)
- [`04-4-admin-layout-guard.md`](./04-4-admin-layout-guard.md)
- [`04-5-rsvp-dashboard.md`](./04-5-rsvp-dashboard.md)
- [`04-6-message-moderation.md`](./04-6-message-moderation.md)

### Milestone 5 — Asset Integration & Optimization
- [`05-1-retro-fonts.md`](./05-1-retro-fonts.md)
- [`05-2-character-sprite-animation.md`](./05-2-character-sprite-animation.md)
- [`05-3-house-image-assets.md`](./05-3-house-image-assets.md)
- [`05-4-parallax-background.md`](./05-4-parallax-background.md)

### Milestone 6 — Audio & Final Polish
- [`06-1-audio-controller.md`](./06-1-audio-controller.md)
- [`06-2-mute-toggle-and-integration.md`](./06-2-mute-toggle-and-integration.md)

### Cross-cutting
- [`07-production-hardening.md`](./07-production-hardening.md)

## Conventions for executing tasks
- Update the checkbox status at the top of each task file when done, and mirror it in `docs/plans/04-task-list.md`.
- Respect all constraints from `docs/plans/01-project-overview.md` and `03-milestones-and-targets.md` (no canvas, no GSAP/Framer Motion, vanilla CSS, Drizzle only, form actions over REST).
