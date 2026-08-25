# Task 6.2 — Mute Toggle & Audio Integration

- **Status**: [x] DONE (2026-08-25)

> Mute toggle uses emoji glyphs (🔇/🔊) instead of PNGs for now — swap for `icon-sound-on/off.png`
> from `docs/graphics-needed.md` §4 when art lands. Persisted via `localStorage('wedding_muted')`,
> master gain ramp 0.1s, context suspended on tab hide. Steps throttled to 280ms inside the
> existing rAF loop (no new timers).
- **Milestone**: 6 — Audio System & Final Polish
- **Depends on**: 06-1
- **Blocks**: launch readiness

## Objective
Wire all triggers into the game and expose a persistent, accessible mute button.

## Steps

### 1. Initialization point (autoplay compliance)
In `+page.svelte` `selectCharacter()`:
```ts
function selectCharacter(char) {
  audio.init();          // synchronous, inside this click gesture
  audio.preload('bgm', '/audio/bgm.mp3');
  audio.play('bgm', { loop: true, volume: 0.4 });
  ...
}
```

### 2. Trigger wiring
- Walking steps: in `startMove`/`stopMove` (or watch `isMoving` store from 05-2), throttle step SFX to a fixed cadence (~250–300ms) using timestamp check inside the existing rAF loop — do NOT spawn setInterval per frame logic.
- House modal open: in `House.svelte` `openModal()` → `audio.play('open')`.
- UI select: title screen avatar buttons + close button → `audio.play('select')`.

### 3. Persistent mute toggle
- New component `src/lib/components/ui/MuteButton.svelte`:
  - Fixed position top-right, above game layers but below modal z-index (e.g., z-index: 90).
  - Pixel-art speaker icon (two states: on/off) as inline SVG or tiny PNGs with `image-rendering: pixelated`.
  - `aria-label="Mute music and sounds"` / `"Unmute..."`, `aria-pressed={muted}`.
  - On click: `audio.setMuted(next)`; persist choice in `localStorage('wedding_muted')`; restore on load (but still wait for gesture before creating context).
- Render it in both title screen and playing states (not inside modals).

### 4. Edge cases
- Modal open → optionally duck BGM volume (×0.5) instead of stopping; restore on close.
- Page hidden → context suspended by controller (from 06-1).

## Acceptance criteria
- [ ] BGM starts immediately on character-select tap, loops seamlessly
- [ ] Steps/modal/select SFX fire at right moments, no overlap spam while holding move button
- [ ] Mute persists across reload; unmute restores without extra tap issues
- [ ] Button reachable at 320px width, doesn't cover controls/houses
- [ ] `npm run check` passes

## Files touched
- `src/routes/+page.svelte`, `src/lib/components/game/House.svelte`, `src/lib/components/ui/MuteButton.svelte` (new)
