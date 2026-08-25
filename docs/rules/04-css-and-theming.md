# Rule 4 — CSS & Theming

## Layering

1. **`src/app.css`** — the ONLY global stylesheet. Contains:
   - `:root` design tokens (colors, fonts, spacing)
   - resets (`box-sizing`, `margin/padding: 0`, `overflow: hidden`, `touch-action: none`)
   - truly global element rules (`img { image-rendering: pixelated }`)
   Nothing else. No component lookalikes here.

2. **Component `<style>` blocks** — scoped by default (Svelte does this). All component-specific styles live here.

3. **Inline `style=""` attributes** — reserved for dynamic, store-driven transforms only:
```svelte
style="transform: translate3d({$charX}px, 0, 0);"
```
Never put static styling inline.

## Design tokens

Current palette (pastel) is defined in `app.css`. When adding colors:
- If it's a theme-level concept (sky, ground, accent), promote it to a `--var` in `app.css`.
- One-off decorative hexes inside a component are acceptable but prefer tokens.
- The canonical pastel set from the plan: `#ffb3ba #ffdfba #baffc9 #bae1ff #e6b3ff`.
- Pixel border convention: `border: 2–3px solid #333` + hard offset shadow (`box-shadow: 0 4px 0 #333`) for buttons — reuse, don't reinvent.

## Fonts

- Fonts are declared via `@font-face` in `app.css`, exposed as `--font-pixel` / `--font-body`.
- Components reference variables, never font filenames.

## Performance-critical CSS rules (non-negotiable)

- Animated elements use `transform: translate3d(...)` and get `will-change: transform`.
- Never animate `left/top/right/bottom/width/height/margin`.
- Blur effects go on an overlay backdrop (`backdrop-filter` on `.modal-backdrop`), NEVER on the game container.
- `image-rendering: pixelated` on every sprite/artwork element (global `img` rule exists; add it manually to elements using `background-image`).
- Transitions ≤ 300ms; keyframe loops must be cheap (transform/opacity only).

## Layout conventions

- Mobile-first portrait; the game fills `100vw/100vh` with hidden overflow.
- Fixed overlays (controls, mute button) use `position: absolute/fixed` + z-index bands:
  - world entities: 1–10 · controls: 50 · mute/UI chrome: 90 · modal: 100
  Keep new layers inside these bands; document exceptions here if you must exceed them.
- Touch targets ≥ 60px (see `.control-btn`).

## Prohibited

- ❌ Tailwind or any utility framework
- ❌ CSS-in-JS
- ❌ `!important` (if you need it, specificity is wrong)
- ❌ Media-query desktop-first patterns (write mobile styles first)
