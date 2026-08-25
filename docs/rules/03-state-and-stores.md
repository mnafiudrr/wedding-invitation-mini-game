# Rule 3 — State & Stores

## The two-tier system (do not blur it)

| Tier | Tool | Scope | Examples |
|---|---|---|---|
| Global game state | classic stores in `src/lib/stores/game.ts` | Any component | `gameState`, `charX`, `cameraX`, `activeModal`, `selectedCharacter` |
| Local UI state | runes (`$state`) inside the component | One component | `submitting`, `success`, `errorMsg` |

**Test:** if two siblings need it → store. If it resets when a modal closes → local `$state`.

## `src/lib/stores/game.ts` conventions

- All game-wide writables live here. Adding a new global? Add it to this file and document it below — no new store files per feature.
- Springs (`charX`, `cameraX`) exist so camera-follow feels smooth where springs are allowed to interpolate. When setting them from the rAF loop you MUST pass `{ hard: true }`:

```ts
charX.set(newCharX, { hard: true });
```

This is the single most important performance rule in the codebase. Omitting it makes the spring fight the rAF loop and the character stutters.

## The movement/modal contract

Components must respect this invariant:

1. Movement happens **only** via the rAF loop in `+page.svelte`.
2. `startMove()` refuses to run when `$gameState !== 'playing'` or `$activeModal !== null`.
3. Opening a modal sets `activeModal` — the loop checks it every frame; movement freezes automatically. Never "pause" by clearing timers elsewhere or duplicating freeze logic in child components.
4. Closing a modal sets `activeModal = null`; movement resumes only after a fresh `startMove`.

New interactive world entities (like future NPCs) follow the `House.svelte` shape:
- compute proximity/state with `$derived` from stores,
- never mutate `charX` themselves,
- request UI via `activeModal.set(...)`.

## Store hygiene

- Stores are plain values — no classes, no Svelte 5 `.svelte.ts` rune modules for game state (revisit as a team decision if complexity grows).
- Derived-from-store values in components use `$derived`, not new writable mirrors.
- Persisted preferences (mute) use `localStorage` directly at the point of use, not a store file.

## Admin/auth state

- Auth identity comes from `locals.user` / `locals.session` (server), passed through `load` functions. It is NEVER mirrored into client stores — admin pages just consume `data`.
