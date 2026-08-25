# Task 4.1 — Auth Dependencies & Schema Extension

- **Status**: [ ] TODO
- **Milestone**: 4 — Admin Dashboard
- **Depends on**: nothing (first task of M4)
- **Blocks**: 04-2, 04-3, 04-4, 04-5, 04-6

## Objective
Install authentication dependencies and extend the Drizzle schema with `users` and `sessions` tables.

## ⚠️ Decision point first: Lucia is archived
The upstream `lucia` library was deprecated by its author (it now exists as a set of guides for rolling your own session auth). Before installing, decide:
- **Option A (plan-compliant)**: Install `lucia` + `oslo` anyway (pinned versions, works fine, no new features).
- **Option B (recommended long-term)**: Follow the Lucia "session token" pattern manually using `oslo` only (`@oslojs/crypto`, `@oslojs/encoding`) — fewer deps, same DB shape.

Record the decision in this file before proceeding. The rest of this task assumes Option A unless noted; if Option B, skip the `lucia` install but keep the identical schema.

## Steps

### 1. Install packages
```bash
npm i lucia @lucia-auth/adapter-mysql oslo
```
Notes:
- Plan doc mentions `@lucia-auth/adapter-drizzle`; for MySQL + existing `mysql2` pool, `@lucia-auth/adapter-mysql` is the correct adapter (drizzle adapter does not support mysql-core tables). Verify against installed lucia version docs.
- Do NOT add any other runtime deps.

### 2. Extend `src/lib/server/db/schema.ts`
Add (do not modify existing `guests`/`messages` tables):

```ts
export const users = mysqlTable('users', {
  id: varchar('id', { length: 15 }).primaryKey(), // lucia userId default: 15 chars
  username: varchar('username', { length: 31 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const sessions = mysqlTable('sessions', {
  id: varchar('id', { length: 40 }).primaryKey(), // session token hash
  userId: varchar('user_id', { length: 15 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull()
});
```

### 3. Apply to database
Choose one and record which:
```bash
npx drizzle-kit push          # dev-fast, no migration files
# or
npx drizzle-kit generate && npx drizzle-kit migrate   # produces ./drizzle SQL files
```

### 4. Seed an initial admin user
Create a one-off script `scripts/create-admin.ts` (run with `tsx scripts/create-admin.ts`) that:
- Reads username/password from env (`ADMIN_USERNAME`, `ADMIN_PASSWORD`)
- Hashes with Argon2id via `oslo/password` (`Argon2id.hash()`) or scrypt from node `crypto`
- Inserts into `users` with `crypto.randomUUID()` truncated to 15 chars or a nanoid
Add npm script `"create-admin": "tsx scripts/create-admin.ts"`.

## Acceptance criteria
- [ ] `npm run check` passes
- [ ] Tables exist in the running dockerized MySQL (`docker exec wedding_mysql mysql -uroot -proot wedding -e 'SHOW TABLES;'`)
- [ ] An admin user can be created via the seed script; password stored as a hash, never plaintext
- [ ] No changes to game-facing schema or behavior

## Files touched
- `package.json`, `src/lib/server/db/schema.ts`, `scripts/create-admin.ts` (new)
