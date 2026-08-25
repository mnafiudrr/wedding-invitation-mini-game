# Rule 6 — Performance (Non-Negotiable)

Target: 60fps on low-end mobile. Every change is judged against this.

## The rendering model

The "game" is DOM + CSS transforms. There is no canvas and there never will be without rewriting the plan docs.

### Allowed per-frame work
- One `requestAnimationFrame` loop, total, in `+page.svelte`.
- Inside it: arithmetic + `charX.set(..., { hard: true })` + `cameraX.set(..., { hard: true })`. Nothing else — no DOM reads (`getBoundingClientRect` etc.), no layout queries.

### Forbidden
- ❌ `<canvas>`, WebGL, Three.js
- ❌ GSAP, Framer Motion, Anime.js or any animation library
- ❌ Animating layout properties (`left`, `top`, `width`, `height`, `margin`, `padding`)
- ❌ `setInterval` for animation
- ❌ New rAF loops in components (parallax etc. derive from stores instead)
- ❌ `backdrop-filter` on the game world container

## Required patterns

| Concern | Pattern |
|---|---|
| Position updates | `transform: translate3d(x px, 0, 0)` + `will-change: transform` |
| Sprite frames | CSS `steps()` keyframes on `background-position-x` |
| Parallax | Layer transforms derived from `$cameraX * factor` |
| Springs from loop | Always `{ hard: true }` (see Rule 3) |
| Touch input | `preventDefault()` on touchstart; stop on end/cancel/leave |
| Images | Pixelated rendering, compressed, lazy where offscreen |

## Budgets

- Initial JS payload: keep lean — no new runtime dependencies without plan-level justification.
- Asset budgets (from M5/M6 tasks): fonts ≤ 200KB total · houses ≤ 300KB total · audio ≤ 1.5MB total.
- Modal transitions ≤ 300ms; blur only on modal backdrop.

## Verification before marking a task done

1. Chrome DevTools → Performance on 4x CPU throttle + mobile viewport: interaction stays jank-free.
2. No long-frame warnings while walking across the full world width.
3. `npm run check` passes.
