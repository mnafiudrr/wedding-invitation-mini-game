# Architecture and Mental Model (For AI Agents)

This document provides a deep dive into the internal wiring, data flow, and state management of the application. When modifying the codebase, strictly adhere to these architectural patterns.

## 1. File Tree & Component Responsibilities

```text
/
├── docker-compose.yml         # Defines `wedding_mysql` service (Port 3306, Root pass: root).
├── drizzle.config.ts          # Points to src/lib/server/db/schema.ts for Drizzle Kit commands.
├── src/
│   ├── app.css                # MUST contain base resets, `touch-action: none` on body, and CSS vars.
│   ├── app.html               # Standard SvelteKit entry.
│   ├── lib/
│   │   ├── components/
│   │   │   ├── game/          # DOM GAME ENGINE COMPONENTS
│   │   │   │   ├── Character.svelte # Subscribes to $charX store. Applies `transform: translate3d`.
│   │   │   │   ├── House.svelte     # Calculates `$derived` proximity to $charX. Dispatches modal opens.
│   │   │   │   └── World.svelte     # Container. Applies `transform: translate3d(-$cameraX, 0, 0)`.
│   │   │   └── ui/            
│   │   │       ├── Modal.svelte     # The glassmorphism wrapper. Closes on backdrop click.
│   │   │       └── menus/           # Content injected into the Modal. (RSVP.svelte, Messages.svelte, etc.)
│   │   ├── data/
│   │   │   └── houses.ts      # SINGLE SOURCE OF TRUTH for map layout. Array of {id, title, x, color}.
│   │   ├── server/
│   │   │   ├── db/            # SERVER-SIDE ONLY (Database logic)
│   │   │   │   ├── index.ts   # Initializes `mysql2/promise` pool and `drizzle` instance.
│   │   │   │   └── schema.ts  # Drizzle table definitions (`guests`, `messages`).
│   │   │   └── auth/          # (Future) Lucia Auth configuration.
│   │   └── stores/
│   │       └── game.ts        # GLOBAL GAME STATE. Contains `gameState`, `charX`, `cameraX`, `activeModal`.
│   └── routes/
│       ├── +layout.svelte     # Global layout, imports `app.css`.
│       ├── +page.svelte       # THE GAME LOOP. Handles `requestAnimationFrame`, renders World, dynamically loads Modals.
│       ├── +page.server.ts    # FORM ACTIONS. Handles `?/rsvp` and `?/message` mutations via Drizzle.
│       └── admin/             # (Future) Protected routes for RSVP data export and moderation.
```

## 2. State Management & Physics Engine
The movement system is a hybrid of Svelte Springs and manual frame calculations.

- **The Stores (`src/lib/stores/game.ts`)**:
  - `charX` and `cameraX` are initialized as `svelte/motion` `spring` stores. This was originally for smooth swipe gestures.
  - `activeModal`: A `writable<string | null>`. When not null, the game loop must halt.

- **The Game Loop (`src/routes/+page.svelte`)**:
  - Movement is triggered by on-screen buttons (holding `onmousedown` or `ontouchstart`).
  - A `requestAnimationFrame` loop increments `newCharX` by `speed * moveDirection`.
  - **CRITICAL NUANCE**: Inside the loop, we call `charX.set(newCharX, { hard: true })`. The `{ hard: true }` parameter is mandatory; it bypasses the spring physics. If omitted, the spring will fight the 60fps loop and cause the character to freeze/stutter.

## 3. Dynamic UI Injection
- Instead of utilizing standard URL routing for the 7 menus, the application remains on `/`.
- `+page.svelte` imports all 7 menu components (e.g., `BrideGroom`, `RSVP`).
- It maintains a `Record<string, any>` mapping the `house.id` to the imported Component.
- Inside the `Modal` block, it utilizes Svelte 5 dynamic rendering: `{@const Component = modalComponents[$activeModal]} <Component />`.

## 4. Server-Side Data Flow (SvelteKit Actions)
- Forms inside `RSVP.svelte` and `Messages.svelte` use `<form method="POST" action="?/actionName" use:enhance>`.
- **Progressive Enhancement**: The `use:enhance` directive is provided a `SubmitFunction` that intercepts the standard HTTP POST, preventing a page reload, and provides `result.type` (success/failure) to update local `$state` (e.g., showing a success message or error text).
- Database writes occur in `+page.server.ts` utilizing Drizzle's `db.insert(table).values({...})`. Unique constraint violations (e.g., duplicate `inviteCode`) are caught via standard try/catch blocks checking `err.code === 'ER_DUP_ENTRY'`.
