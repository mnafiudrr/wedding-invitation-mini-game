# Task 5.1 — Retro Font Integration

- **Status**: [ ] TODO
- **Milestone**: 5 — Asset Integration & Optimization
- **Depends on**: nothing
- **Blocks**: 05-2, 05-3 (visual consistency)

## Objective
Add a pixel/retro font face and apply it across the app for the game aesthetic.

## Steps

### 1. Acquire fonts into `static/fonts/`
Suggested free options (check licenses — all below are OFL):
- Headings/UI: "Press Start 2P" (classic pixel, heavy — use sparingly, small sizes)
- Body: "VT323" or "Pixelify Sans" (more readable at body sizes)
Download `.woff2` only (smallest); keep total under ~200KB. Mobile performance is priority #1.

### 2. Declare `@font-face` in `src/app.css`
```css
@font-face {
  font-family: 'Press Start 2P';
  src: url('/fonts/press-start-2p.woff2') format('woff2');
  font-display: swap; /* mandatory: avoid FOIT on slow mobiles */
}
```

### 3. Apply via CSS variables
```css
:root {
  --font-pixel: 'Press Start 2P', monospace;
  --font-body: 'VT323', monospace;
}
```
- Titles, house labels, buttons → `--font-pixel`
- Modal body text, forms → `--font-body`
- Update `.house-label`, `.control-btn`, `h1/h2` in components accordingly.

### 4. Preload critical font in `src/app.html`
```html
<link rel="preload" href="/fonts/press-start-2p.woff2" as="font" type="font/woff2" crossorigin>
```
Only preload the heading font.

## Constraints
- Vanilla CSS only; no font loading libraries.
- `font-display: swap` on every face.
- Do not load more than 2 font families.

## Acceptance criteria
- [ ] Fonts render offline (files local in `static/fonts`)
- [ ] No layout flash / invisible text on throttled connection
- [ ] House labels remain readable at 320px viewport width
- [ ] `npm run check` passes

## Files touched
- `static/fonts/*` (new), `src/app.css` (edit), `src/app.html` (edit), component styles as needed
