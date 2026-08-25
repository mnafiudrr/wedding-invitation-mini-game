# Wedding Invitation Interactive Website

A mobile-first wedding invitation website with UX inspired by classic 2D side-scrolling platformer games.

## Tech Stack
- **Framework**: SvelteKit
- **Database**: MySQL (via Docker)
- **ORM**: Drizzle ORM

## Getting Started

### 1. Start the Database
Ensure you have Docker and Docker Compose installed.
```bash
# Start the MySQL database in the background
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

### 4. Database Migrations & Seeding
To apply the database schema (migrations) to your MySQL container:
```bash
npm run db:push
```
*(Optionally, if a seed script is added later, run `npm run db:seed`)*

### 5. Run the Development Server
```bash
npm run dev -- --open
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.
