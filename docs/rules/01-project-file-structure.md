# Rule 1 — Project File Structure

## Canonical tree

```text
src/
├── app.css                     # Global resets + CSS variables ONLY (no component styles)
├── app.html                    # Entry HTML (meta tags, font preloads)
├── app.d.ts                    # App.Locals types
├── lib/
│   ├── assets/                 # Build-time assets imported by code (favicon)
│   ├── audio/                  # Audio utilities (AudioController.ts)
│   ├── components/
│   │   ├── game/               # World-rendered entities: Character, House, World, Parallax
│   │   └── ui/
│   │       ├── Modal.svelte    # Generic overlays
│   │       └── menus/          # One .svelte per house/menu — NEVER generic names
│   ├── data/                   # Pure TS constants, no imports from $lib/server
│   │   ├── houses.ts           # Single source of truth for map layout
│   │   └── couple.ts           # (planned) names, dates, venue text
│   ├── server/                 # SERVER ONLY. Never imported by client code.
│   │   ├── db/index.ts         # Pool + drizzle instance (singleton)
│   │   ├── db/schema.ts        # All Drizzle table definitions in ONE file
│   │   └── auth/               # Lucia config, session helpers
│   └── stores/game.ts          # Client game stores (see Rule 3)
├── routes/
│   ├── +layout.svelte          # Imports app.css, nothing else heavy
│   ├── +page.svelte            # Game screen + rAF loop (the ONLY place with a loop)
│   ├── +page.server.ts         # Public form actions + public load
│   └── admin/                  # Protected routes; each has +page.server.ts guard
static/
├── fonts/                      # woff2 only
├── sprites/, houses/, audio/   # Runtime assets referenced by URL string
docs/
├── plans/                      # Vision & milestones (edit rarely)
├── tasks/                      # Executable tasks (update status as you go)
└── rules/                      # This rule set
scripts/                        # One-off TS scripts run via tsx (e.g., create-admin.ts)
```

## Placement decisions (when unsure)

| You're adding... | It goes in | Because |
|---|---|---|
| A new map entity rendered inside `World` | `lib/components/game/` | It subscribes to game stores |
| Content shown inside a Modal | `lib/components/ui/menus/<houseId>.svelte` | Wired via `modalComponents` record in `+page.svelte` |
| Static content data (coordinates, text) | `lib/data/*.ts` | Must be importable by both server and client |
| Any DB query / auth logic | `lib/server/**` | Enforced secret-safety by SvelteKit ($lib/server is unimportable from client) |
| An image/sound used at runtime | `static/<category>/` | Referenced by URL, cached as-is |
| A new table or column | `lib/server/db/schema.ts` | Single schema file — do NOT split into per-table files |

## Naming rules

- Components: `PascalCase.svelte`, named after what they render (`BrideGroom.svelte`, not `Menu1.svelte`).
- Data/store modules: lowercase camelCase (`houses.ts`, `game.ts`).
- Routes: lowercase kebab (`admin/login`). No route groups unless truly needed.
- Static assets: kebab-case (`bride-spritesheet.png`, `bgm.mp3`) — they end up in URLs.
- CSS classes: kebab-case, no BEM, no utility framework.

## Hard prohibitions

- ❌ No `src/routes/api/` endpoints for anything the site itself uses.
- ❌ No second DB connection pool — import `db` from `$lib/server/db`.
- ❌ No component-level global CSS (`<style>` without `scoped` semantics / `:global` abuse). `:global` is allowed ONLY in `app.css` context wrappers and documented cases.
- ❌ No secrets or env values committed; `.env.example` documents keys with empty values.
