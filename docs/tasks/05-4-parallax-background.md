# Task 5.4 — Parallax Background

- **Status**: [ ] TODO
- **Milestone**: 5 — Asset Integration & Optimization
- **Depends on**: none strictly; do after 05-2/05-3 so world visuals are final-ish
- **Blocks**: 06

## Objective
Add depth via background layers that move slower than the foreground relative to `cameraX`.

## Steps

### 1. Create `src/lib/components/game/Parallax.svelte`
Props: `{ speedFactor: number }` (e.g., clouds 0.3, hills 0.6).

Implementation pattern (pure transform, no scroll events):
```svelte
<script lang="ts">
  import { cameraX } from '$lib/stores/game';
  let { speedFactor, children } = $props();
</script>

<div class="layer" style="transform: translate3d({-$cameraX * speedFactor}px, 0, 0);">
  {@render children()}
</div>
```
```css
.layer {
  position: absolute;
  inset: 0;
  will-change: transform;
  pointer-events: none;
}
```

### 2. Layer stack inside `World.svelte` (back → front)
1. Sky gradient — static CSS background on World/game-container (no movement)
2. Clouds layer — `speedFactor: 0.25` — repeating cloud PNGs/CSS shapes spanning ≥ worldWidth * 0.25 + viewport width
3. Hills/trees layer — `speedFactor: 0.55`
4. Houses + character (existing, factor 1.0 implicit)

### 3. Width math (important)
Each layer's content width must cover `(2500 - innerWidth) * speedFactor + innerWidth` px so it never reveals an empty edge at max camera scroll. Either:
- Render enough repeated elements, or
- Use CSS `background-repeat-x` with `background-position-x` bound to `-$cameraX * speedFactor`px (cheapest option — one composited layer, zero extra DOM nodes). Prefer this variant.

### 4. Optional ambient motion
Slow independent cloud drift via CSS keyframes on an inner element (translate loop), NOT tied to camera — must be subtle and GPU-only (`transform` only, no `left/top`).

## Constraints
- No canvas, no JS rAF involvement beyond existing store updates.
- Max 2–3 parallax layers total; every layer is `pointer-events: none`.
- Test that `will-change: transform` doesn't blow memory budget on low-end devices (remove if profiling shows regressions).

## Acceptance criteria
- [ ] Layers visibly move at different speeds while walking; no gaps at either end of the world
- [ ] No new rAF loops; 60fps maintained under CPU throttling
- [ ] Touch input unaffected (`pointer-events: none`)
- [ ] `npm run check` passes

## Files touched
- `src/lib/components/game/Parallax.svelte` (new), `src/lib/components/game/World.svelte`
