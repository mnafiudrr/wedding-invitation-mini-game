# Task 5.3 — House Image Assets

- **Status**: [ ] TODO
- **Milestone**: 5 — Asset Integration & Optimization
- **Depends on**: nothing hard; coordinate art style with 05-2
- **Blocks**: 06 (final polish)

## Objective
Replace the colored-box houses in `House.svelte` with pixel-art `.png` images while keeping proximity/modal behavior untouched.

## Prerequisite assets
- 7 house images in `static/houses/`, one per entry in `src/lib/data/houses.ts`:
  `bride-groom.png`, `quran-quotes.png`, `events.png`, `maps.png`, `rsvp.png`, `messages.png`, `credits.png`
- Logical size ~68×85px to match current `.house-container` box (or update the constants consistently).
- Transparent background, consistent ground line across all 7.

## Steps

### 1. Extend house data
- Add optional `image?: string` field to `HouseData` in `src/lib/data/houses.ts`; set it for each house.
- Keep `color` for now (fallback / label accent) — remove only at the end if truly unused.

### 2. Update `House.svelte`
- Pass new prop `image` from `+page.svelte` `{#each}` loop.
- Render:
```html
{#if image}
  <img src={image} alt={title} class="house-img" draggable="false" />
{:else}
  <!-- existing div fallback -->
{/if}
```
```css
.house-img {
  width: 68px; height: auto;
  image-rendering: pixelated;
  pointer-events: none; /* clicks stay on container */
  user-select: none;
}
```

### 3. Preserve interactions exactly
- Keep `$derived` proximity check (`isNear`) unchanged.
- Bounce animation: apply existing `.bouncing` transform to the `<img>` wrapper instead of the old div — same cubic-bezier transition.
- Label reveal unchanged.
- Modal open on tap unchanged.

### 4. Performance
- Total payload target ≤ 300KB for all 7 images combined. If exceeded, reduce palette/size or convert to a single atlas sheet positioned via `background-position`.

## Acceptance criteria
- [ ] All 7 houses show artwork; no layout shift vs placeholder version
- [ ] Proximity bounce + label + modal open all behave identically
- [ ] Images are pixelated-crisp, no anti-aliased edges
- [ ] `npm run check` passes

## Files touched
- `static/houses/*` (new), `src/lib/data/houses.ts`, `src/lib/components/game/House.svelte`, `src/routes/+page.svelte`
