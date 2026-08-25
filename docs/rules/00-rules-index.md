# Rules Index

These rules exist so that any developer or AI agent can update the codebase and produce changes that look like they were always there. Read the relevant rule file **before** writing code, not after.

| File | Scope |
|---|---|
| [`01-project-file-structure.md`](./01-project-file-structure.md) | Where files go, naming, what belongs where |
| [`02-svelte-code-style.md`](./02-svelte-code-style.md) | Svelte 5 runes usage, component anatomy, reactivity rules |
| [`03-state-and-stores.md`](./03-state-and-stores.md) | Stores vs `$state`, game state conventions, modal/movement contract |
| [`04-css-and-theming.md`](./04-css-and-theming.md) | Styling approach, CSS variables, performance-critical CSS |
| [`05-server-data-and-db.md`](./05-server-data-and-db.md) | Drizzle usage, form actions, server/client boundary |
| [`06-performance-rules.md`](./06-performance-rules.md) | Non-negotiable 60fps/mobile constraints |
| [`07-git-and-docs-workflow.md`](./07-git-and-docs-workflow.md) | Commits, task/doc updates, definition of done |

## The five commandments (if you read nothing else)

1. **No `<canvas>`, no animation libraries.** DOM + CSS transforms + `requestAnimationFrame` only.
2. **All movement/animation via `transform: translate3d()`** — never `left/top/width/height` on animated elements.
3. **Server code never leaks client-side.** Anything importing `mysql2`, `drizzle`, or `$env/dynamic/private` lives under `src/lib/server/`.
4. **Data mutations are Form Actions**, never `/api/*` routes.
5. **Vanilla CSS with scoped component styles; shared tokens only in `src/app.css`.**
