# Graphics Needed — Complete PNG Asset Manifest

Companion to `docs/tasks/05-*` and `docs/rules/06-performance-rules.md`. This is the shopping list for every image the project needs to replace placeholders and finish Milestones 5–6.

## Global constraints for ALL files

| Constraint | Value |
|---|---|
| Format | `.png` (32-bit with transparency). BGM/SFX are audio, not listed here |
| Rendering | Drawn to be displayed with `image-rendering: pixelated` — export at exact logical size, no anti-aliased edges |
| Style | Consistent retro pixel-art, single shared palette (pastels `#ffb3ba #ffdfba #baffc9 #bae1ff #e6b3ff` + sky `#b3dcfd`, ground `#8fb935`, outline `#333`) |
| Naming | kebab-case, category prefix (`char-`, `house-`, `bg-`, `icon-`, `fx-`) |
| Location | `static/` subfolders as noted |
| Total budget | All images combined ≤ ~600KB |

---

## 1. Characters (`static/sprites/`) — **8 PNG files total**

Sprite sheets = horizontal strips, fixed frame size, transparent bg.
Facing states are **separate sheets** so each animation maps to exactly one `background-image` + one `steps()` keyframe (no position math across mixed facings).

### Per character (bride & groom identical spec) — 4 files each

| File | Frames | Strip size | Purpose |
|---|---|---|---|
| `char-bride-front.png` | **2** | 96×48 (2 × 48px) | Front-facing idle shown whenever NOT moving (standing, modal open, title spawn). Frame 2 = subtle breathe/blink |
| `char-bride-walk.png` | **6** | 288×48 (6 × 48px) | Right-facing walk cycle, played via `animation: ... steps(6)` |
| `char-groom-front.png` | **2** | 96×48 | Same as bride front |
| `char-groom-walk.png` | **6** | 288×48 | Same as bride walk |

### State → asset mapping (implement in `Character.svelte`, task 05-2)

| Game state | Sheet used | Animation |
|---|---|---|
| Idle / modal open / before first move | `char-*-front.png` | 2-frame loop at ~0.8s (`steps(2)`) or static frame 0 |
| Moving right | `char-*-walk.png` | `steps(6) infinite`, ~0.5s cycle |
| Moving left | `char-*-walk.png` + CSS `scaleX(-1)` on inner wrapper | same |

Notes:
- Walk art faces **right** by default; left-facing is a CSS flip — do NOT export mirrored sheets.
- Front and walk frames must share the same baseline/foot position so switching sheets causes no visual jump.
- Optional stretch goal: append 2 celebrate/jump frames as a third sheet only if a "thank you" moment is added later.

## 2. Houses (`static/houses/`) — task 05-3

7 distinct buildings, consistent ground line and perspective, ~68×85 px logical each (can export at 2x = 136×170 and display down).

| File | Size | Theme |
|---|---|---|
| `house-bride-groom.png` | 68×85 | Wedding chapel / couple's house — pink accents |
| `house-quran-quotes.png` | 68×85 | Mosque-style dome/minaret silhouette |
| `house-events.png` | 68×85 | Party hall with bunting/banner |
| `house-maps.png` | 68×85 | House with big map signpost |
| `house-rsvp.png` | 68×85 | Post office / mailbox building |
| `house-messages.png` | 68×85 | House with envelope flag or guestbook sign |
| `house-credits.png` | 68×85 | Gift/thanks house with heart sign |

Optional variants (only if cheap): `*-active.png` lit-window versions for proximity highlight — otherwise keep the CSS scale/bounce effect.

## 3. Background & Parallax layers (`static/bg/`) — task 05-4

Tiled horizontally (`background-repeat: repeat-x`). Seamless left-right edges required!

| File | Size | Layer / speed factor |
|---|---|---|
| `bg-clouds.png` | e.g. 512×160 tile | Far layer, speedFactor ≈ 0.25, semi-transparent whites |
| `bg-hills.png` | e.g. 512×200 tile | Mid layer, speedFactor ≈ 0.55, pastel green hills + simple trees |
| `bg-bushes.png` *(optional)* | 256×80 tile | Near decoration strip, speedFactor ≈ 0.8 |
| `bg-ground-tile.png` *(optional)* | 32 or 64 px square | Repeating grass/dirt texture if plain color ground gets upgraded |

Alternatives: bushes/clouds can also be pure CSS shapes; only commit PNGs if they look better. Sky stays a CSS gradient — no image needed.

## 4. Title screen & UI chrome (`static/ui/`)

| File | Size | Purpose |
|---|---|---|
| `ui-logo-title.png` | ≤ 320×120 | Pixel-art wedding logo ("Wedding Invitation" lockup) to replace `<h1>` on title screen |
| `ui-avatar-bride.png` | 64×64 | Bride avatar portrait for character select button |
| `ui-avatar-groom.png` | 64×64 | Groom avatar portrait |
| `ui-heart-small.png` | 16×16 | Decorative pixel hearts (title screen floaters, credits) |
| `ui-arrow-left.png` | 48×48 | Left movement button icon (replaces text `←`, crisper on mobile) |
| `ui-arrow-right.png` | 48×48 | Right movement button icon |
| `icon-sound-on.png` | 32×32 | Mute toggle state ON (task 06-2) |
| `icon-sound-off.png` | 32×32 | Mute toggle state OFF (speaker with slash) |
| `icon-close.png` *(optional)* | 24×24 | Modal close ×, if font glyph looks bad in pixel font |

## 5. Effects & particles (`static/fx/`) — optional polish

| File | Size | Purpose |
|---|---|---|
| `fx-sparkle.png` | 24×24, 3–4 frames in strip | Proximity shimmer around active house |
| `fx-confetti-frame.png` | small strips | Celebration burst after successful RSVP submit |
| `fx-dust.png` | 3-frame strip | Little dust puff when character stops walking |
| `fx-petal.png` | 16×16 | Falling flower petals overlay (CSS-animated, looping, very subtle) |

All fx animations must run via CSS `steps()` keyframes only (Rule 6).

## 6. Icons inside menus (mostly NO pngs needed)

Menu content should stay DOM/text-based. Only rasterize what text/pixel-font truly can't render:
- Map location pin (`icon-pin.png`, 24×24) if Maps menu wants a visual marker
- Small calendar glyph for Events menu (`icon-calendar.png`, 24×24)
- Bank/gift icons for the gift section of Credits menu (`icon-gift.png`, `icon-bank.png`, 24×24 each)

Everything else (forms, quotes, lists) uses fonts + CSS borders.

## 7. Explicitly NOT needed

- ❌ Desktop-specific art (mobile-first container scales)
- ❌ Character death/jump/fall frames (no such mechanics)
- ❌ Tilemap/tileset atlas (world is a single 2500px strip, not tiled)
- ❌ Favicon PNG — SVG already exists at `src/lib/assets/favicon.svg`

---

## Priority order (matches milestones)

1. **P0** — house images (7) → unblocks 05-3
2. **P0** — character sheets (4: front + walk × bride/groom) → unblocks 05-2
3. **P1** — clouds + hills tiles → 05-4
4. **P1** — arrows, sound icons, avatars, title logo → 06-2 + title polish
5. **P2** — effects (sparkle, petals), menu glyphs

## Checklist

- [ ] char-bride-front.png (2 frames)
- [ ] char-bride-walk.png (6 frames)
- [ ] char-groom-front.png (2 frames)
- [ ] char-groom-walk.png (6 frames)
- [ ] house-bride-groom.png
- [ ] house-quran-quotes.png
- [ ] house-events.png
- [ ] house-maps.png
- [ ] house-rsvp.png
- [ ] house-messages.png
- [ ] house-credits.png
- [ ] bg-clouds.png
- [ ] bg-hills.png
- [ ] ui-logo-title.png
- [ ] ui-avatar-bride.png
- [ ] ui-avatar-groom.png
- [ ] ui-arrow-left.png
- [ ] ui-arrow-right.png
- [ ] icon-sound-on.png
- [ ] icon-sound-off.png
- [ ] (P2) fx-sparkle.png, fx-petal.png, fx-dust.png, fx-confetti-frame.png
- [ ] (P2) icon-pin.png, icon-calendar.png, icon-gift.png, icon-bank.png
