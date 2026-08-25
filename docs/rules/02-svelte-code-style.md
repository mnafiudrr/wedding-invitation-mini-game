# Rule 2 — Svelte & Code Style

## Version contract
- Svelte 5. Local component state uses **runes** (`$state`, `$derived`, `$props`, `$effect`).
- Cross-component game state uses **classic stores** (`writable`, `spring`) — see Rule 3. Do not convert these to runes classes without a plan-level decision.
- TypeScript everywhere: `<script lang="ts">` in every component, typed server files.

## Component anatomy (fixed order)

Every `.svelte` file follows this exact order:

```svelte
<script lang="ts">
  // 1. imports (kit/lib first, then types)
  import { charX } from '$lib/stores/game';

  // 2. props
  let { id, title, x, color } = $props();

  // 3. local state ($state)
  let submitting = $state(false);

  // 4. derived values ($derived)
  let isNear = $derived(Math.abs(($charX + 24) - (x + 34)) < 100);

  // 5. functions (event handlers, helpers)
  function openModal() { ... }
</script>

<!-- markup -->
<style> /* scoped styles */ </style>
```

## Reactivity rules

- Use `$derived` for anything computable from other state (e.g., proximity checks). Never duplicate that logic into imperative code.
- Never call store `.set()` inside `$derived`/template expressions.
- `$effect` is a last resort for DOM interop only (canvas-free project: expect very few). If you add one, comment why it can't be `$derived`.
- Auto-subscription (`$charX`) in templates; `.subscribe()` manually ONLY inside `onMount` teardown patterns.

## Event handlers

- Svelte 5 syntax: `onclick`, `ontouchstart`, etc. (no deprecated `on:click`).
- Touch controls MUST pair with `e.preventDefault()` on `touchstart` and stop on ALL of: `touchend`, `touchcancel`, `mouseleave`. Copy the pattern from `+page.svelte` control buttons.
- Interactive non-button elements need the svelte-ignore comments for a11y (see existing usage in `House.svelte` / `Modal.svelte`). Prefer real `<button>` when possible.

## Dynamic components

- Menu content is rendered via the record + `{@const Component = modalComponents[$activeModal]}` pattern in `+page.svelte`. New menus must be registered there — do not invent conditional `{#if $activeModal === 'x'}` chains.

## Transitions

- Allowed: svelte built-ins (`fade`, `scale`) on modals/overlays with durations ≤ 300ms.
- Forbidden: transitions/keyframes that animate layout properties (`width`, `height`, `top`, `left`) — see Rule 6.

## General TS style

- 2-space indent, single quotes, semicolons (match current files).
- No comments unless explaining *why* (the `{ hard: true }` nuance class of comment) — never narrate *what*.
- Exported interfaces/types live next to their data module (`HouseData` in `houses.ts`).
- Prefer `crypto.randomUUID()` for entity ids (varchar(36)).
