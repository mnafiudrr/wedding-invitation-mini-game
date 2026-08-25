# Milestones and Targets (For AI Agents)

When executing tasks, agents should refer to these strict boundaries and targets to ensure code aligns with the project vision. Do not over-engineer solutions outside of the current milestone's scope.

## Milestone 1: Gameplay Navigation Prototype
- **Objective**: Establish the core DOM-based renderer.
- **Constraints**: 
  - No `<canvas>` or WebGL. 
  - Strict use of `translate3d` to force GPU hardware acceleration.
  - Handle mobile touch events securely (`e.preventDefault()` on `touchstart` for buttons to prevent native zooming/scrolling).

## Milestone 2: Menu Interaction System
- **Objective**: Implement the map objects (Houses) and proximity interactions.
- **Constraints**:
  - Proximity logic must be extremely lightweight (`$derived` distance checks in Svelte 5).
  - The Modal overlay must use CSS `backdrop-filter` for the blur effect, rather than blurring the game container itself (which causes massive performance drops on mobile).
  - Game movement must absolutely halt when a modal is active.

## Milestone 3: Content System
- **Objective**: Build the 7 distinct UI forms/views and establish the MySQL database layer.
- **Constraints**:
  - Use Drizzle ORM for all database queries. Avoid raw SQL.
  - Use SvelteKit Form Actions (`use:enhance`) for data submission. Do not build separate REST endpoints in `/api/` unless strictly necessary for external clients.
  - Data loading for the public view (e.g., fetching approved messages) must happen in the `load` function of `+page.server.ts`.

## Milestone 4: Admin Dashboard
- **Objective**: Secure the backend for the couple to manage their data.
- **Constraints**:
  - Implement Lucia Auth. Store sessions and user credentials in the MySQL database.
  - Create a `/admin/login` page.
  - Protect all `/admin/...` routes using a layout server guard (`+layout.server.ts`) that checks `locals.session`.
  - Provide a simple UI to list guests (`isAttending`, `headcount`) and moderate messages (toggle `isApproved`).

## Milestone 5: Asset Integration & Optimization
- **Objective**: Replace colored placeholder divs with final pixel-art `.png` files.
- **Constraints**:
  - Sprites must use `image-rendering: pixelated;`.
  - Implement simple CSS keyframe animations for character walking cycles by translating a sprite sheet (using `steps()` timing function in CSS).
  - Implement parallax backgrounds (clouds moving at a slower speed relative to `cameraX`).

## Milestone 6: Audio System & Final Polish
- **Objective**: Add audio and finalize deployment readiness.
- **Constraints**:
  - Audio context MUST be initialized upon the first user interaction (e.g., clicking "Select Bride/Groom") to comply with modern browser autoplay policies.
  - Provide a persistent, accessible UI button to mute/unmute audio.
