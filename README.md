# Wedding Invitation Interactive Website

A mobile-first wedding invitation website with UX inspired by classic 2D side-scrolling platformer games.

## Tech Stack
- **Framework**: SvelteKit (Svelte 5)
- **Database**: MySQL 8.4 (via Docker)
- **ORM**: Drizzle ORM
- **Auth**: Session-based (hashed tokens in DB, scrypt passwords) — no external auth library

## Getting Started

### 1. Start the Database
Ensure you have Docker and Docker Compose installed.
```bash
docker-compose up -d
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add the following connection string:
```env
DATABASE_URL="mysql://wedding_user:wedding_password@localhost:3306/wedding"
```

### 4. Apply the Database Schema
```bash
npx drizzle-kit push
```

### 5. Create an Admin Account
```bash
ADMIN_USERNAME=admin ADMIN_PASSWORD=your-secret-password npm run create-admin
```
The password is stored as a salted scrypt hash — the plaintext is never persisted.

### 6. Run the Development Server
```bash
npm run dev -- --open
```

## Using the App

### Guest side (`/`)
1. **Title screen** — pick an avatar (Bride or Groom) to enter the world. This first tap also starts background music (browser autoplay policy).
2. **Move** with the on-screen ← / → buttons (hold to walk).
3. **Houses** — when you walk near a house it bounces and shows its label; tap it to open its menu:
   - Bride & Groom, Quran Quotes, Events, Maps, RSVP, Messages, Credits
4. **RSVP** — submit with an invitation code (duplicate codes are rejected).
5. **Messages** — guests can leave a message; only **approved** messages appear publicly.
6. **Mute button** (top-right) — toggles all audio; the choice is remembered in `localStorage`.

### Admin side (`/admin`)
1. Go to `/admin/login` and log in with the account created in step 5.
2. **RSVPs** (`/admin/rsvps`) — summary cards (total / attending / declined / headcount), searchable table, CSV export.
3. **Messages** (`/admin/messages`) — approve/unapprove or delete guest messages. Only approved messages show on the public site.
4. **Logout** — invalidates the session on the server.

Sessions last 30 days (sliding refresh) and are stored in the `sessions` table.

## Updating Assets

All image/sound files live under `static/`. Specs (sizes, frame counts, naming) are in [`docs/graphics-needed.md`](docs/graphics-needed.md).

### Character sprites (`static/sprites/`)
| File | Layout |
|---|---|
| `men-front.png`, `women-front.png` | 2 frames of 2000×2000 (4000×2000 strip) — idle, facing the camera, frame 2 = blink |
| `men-walk-left.png`, `women-walk-left.png` | 4 frames of 2000×2000 (8000×2000 strip) — walk cycle, art faces left (CSS flip for rightward movement) |

`men-*` is the Groom, `women-*` is the Bride. To swap in final art: export PNGs with the **same filenames, frame counts, and cell alignment** — no code changes needed.

### Houses, backgrounds, icons (`static/houses/`, `static/bg/`, `static/ui/`)
Drop-in replacements per `docs/graphics-needed.md`. Houses are 68×85 px; background tiles must repeat seamlessly horizontally.

### Audio (`static/audio/`)
`select.wav`, `open.wav`, `step.wav`, `bgm.wav` — replace with real recordings keeping the same names (BGM should ideally be compressed mp3/ogg; update the path in `src/routes/+page.svelte` if you change the extension).
```bash
node scripts/generate-placeholder-audio.mjs   # regenerate placeholder sounds
```

## Project Docs
- `docs/plans/` — vision, architecture, milestones
- `docs/tasks/` — executable task files with status
- `docs/rules/` — code conventions and performance rules
- `docs/graphics-needed.md` — complete asset manifest

## Building

To create a production version of your app:
```bash
npm run build
```

You can preview the production build with `npm run preview`.
