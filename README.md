# Wedding Invitation Interactive Website

A mobile-first wedding invitation website with UX inspired by classic 2D side-scrolling platformer games.

## Tech Stack
- **Framework**: SvelteKit (Svelte 5)
- **Database**: MySQL 8.4 (via Docker)
- **ORM**: Drizzle ORM
- **Auth**: Session-based (hashed tokens in DB, scrypt passwords) — no external auth library

## Deploying with Docker Compose (recommended)

The project ships a `Dockerfile` (multi-stage, `node:24-alpine`) + `docker-compose.yml`. One command builds and starts **MySQL** and the **app**:

```bash
docker compose up -d --build
```

- **App** → http://localhost:3000 · **MySQL** → localhost:3306
- The DB schema is bootstrapped automatically on app start (`scripts/init-db.mjs`, idempotent — safe to run on every boot).

### 1. Set the public URL
Edit `ORIGIN` in `docker-compose.yml` to the exact URL guests will use, e.g. `http://192.168.1.20:3000` or `https://wedding.example.com`. If you put the app behind a reverse proxy, set `PROTOCOL_HEADER=x-forwarded-proto` and `HOST_HEADER=x-forwarded-host` instead.

### 2. Create an admin account
```bash
docker compose exec -e ADMIN_USERNAME=admin -e ADMIN_PASSWORD=your-secret-password app \
  node scripts/create-admin.mjs
```
`scripts/create-admin.mjs` produces hashes in the same scrypt format the app verifies (the local `npm run create-admin` is dev-only). The plaintext password is never stored.

### 3. Verify
- Open the app and scroll through all sections; pick an avatar to enter the game world.
- Log in at `/admin` with the account from step 2.
- Guest messages submitted on the site appear under `/admin/messages` for approval.

### Updating the deployment
Rebuild and restart with the same command; data persists in the `mysql_data` Docker volume.

### Managing the stack
```bash
docker compose logs -f app      # follow app logs
docker compose ps               # container status
docker compose down             # stop everything (data kept)
docker compose down -v          # stop and delete the database volume
```

## Local development

1. Start the database only:
   ```bash
   docker compose up -d db
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the connection string:
   ```env
   DATABASE_URL="mysql://wedding_user:wedding_password@localhost:3306/wedding"
   ```
4. Apply the database schema:
   ```bash
   npx drizzle-kit push
   ```
5. Create an admin account:
   ```bash
   ADMIN_USERNAME=admin ADMIN_PASSWORD=your-secret-password npm run create-admin
   ```
   The password is stored as a salted scrypt hash — the plaintext is never persisted.
6. Run the development server:
   ```bash
   npm run dev -- --open
   ```

## Using the App

### Guest side (`/`)
1. **Start page** — a scrollable landing site: hero with the couple's blinking avatars, then one full-screen themed section per house (Bride & Groom, Quran Quotes, Events, Maps, RSVP, Messages, Credits).
2. **Enter the game** — tap a blinking avatar (Bride/Groom) to drop into the side-scrolling world. This first tap also starts the background music (browser autoplay policy).
3. **Move** with the on-screen ← / → buttons (hold to walk).
4. **Houses** — walk near a house and it bounces with its label; tap it to open its menu (same content as the scroll sections).
5. **RSVP** — submit with an invitation code (duplicate codes are rejected).
6. **Messages** — guests can leave a message; only **approved** messages appear publicly.
7. **Mute button** (top-right) — toggles all audio; the choice is remembered in `localStorage`.

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

To create a production version of your app (uses `@sveltejs/adapter-node`):
```bash
npm run build
```

You can preview the production build with `npm run preview`. For deployable containers use `docker compose up -d --build`.
