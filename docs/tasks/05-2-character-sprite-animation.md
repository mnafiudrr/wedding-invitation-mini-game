# Task 5.2 — Character Sprite Animation

- **Status**: [ ] TODO
- **Milestone**: 5 — Asset Integration & Optimization
- **Depends on**: 05-1 (fonts done first keeps visuals consistent)
- **Blocks**: nothing

## Objective
Replace the placeholder character box with a sprite-sheet-driven walk cycle using pure CSS.

## Prerequisite asset
- Obtain or generate two sprite sheets: `bride-spritesheet.png` and `groom-spritesheet.png` in `static/sprites/`.
- Layout: horizontal strip of N frames (e.g., 4 idle + 6 walk = single strip per state, or one strip with fixed frame size).
- Frame size suggestion: 48×48 px logical (matches current character width constant `2500 - 48` in `+page.svelte:45`). Keep sheets ≤ 1024px wide.

## Steps

### 1. Extend `Character.svelte`
- Replace colored div with:
```html
<div class="sprite {facing} {moving ? 'walking' : 'idle'}"></div>
```
- CSS pattern (GPU-friendly, no JS animation):
```css
.sprite {
  width: 48px; height: 48px;
  background-image: url('/sprites/groom-spritesheet.png');
  background-repeat: no-repeat;
  image-rendering: pixelated;
}
.sprite.walking {
  animation: walk 0.5s steps(6) infinite; /* steps() = frame count of walk strip */
}
@keyframes walk {
  from { background-position-x: 0; }
  to   { background-position-x: -288px; } /* -frameWidth * frameCount */
}
.sprite.facing-left { transform: scaleX(-1); } /* combine carefully with parent translate3d */
```

### 2. Wire animation state to movement
- The movement loop lives in `+page.svelte`. Expose two signals:
  - Option A (preferred): add `isMoving` + `facingDirection` writables to `src/lib/stores/game.ts`, set from `startMove/stopMove`.
  - Option B: pass props into `<Character />`.
- When modal opens (`$activeModal` non-null) force `idle` frame.

### 3. Facing direction
- Default sprite art faces right; flip with `scaleX(-1)` when moving left.
- Careful: `Character.svelte` root already applies `translate3d($charX...)` — put the flip on an inner wrapper element so transforms don't clash.

## Constraints
- NO JS-driven per-frame sprite index changes; use CSS `steps()` keyframes only.
- `image-rendering: pixelated` on the sprite element.
- One HTTP request per sheet; consider combining bride/groom into one sheet later if profiling demands.

## Acceptance criteria
- [ ] Walk cycle plays only while moving, correct direction flip
- [ ] Idle frame shown when stopped and while modals open
- [ ] No jank on low-end mobile profile (Chrome DevTools CPU throttle 4x): transforms/compositing only
- [ ] `npm run check` passes

## Files touched
- `static/sprites/*` (new), `src/lib/components/game/Character.svelte`, `src/lib/stores/game.ts`, `src/routes/+page.svelte`
