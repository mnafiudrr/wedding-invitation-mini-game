# Rule 5 — Server Code, DB & Forms

## Server/client boundary (enforced by SvelteKit)

- Anything touching `mysql2`, Drizzle, `$env/dynamic/private`, or password hashes lives under `src/lib/server/**`. SvelteKit makes this unimportable from client code — keep it that way instead of working around it.
- Public pages get data via `load` in their `+page.server.ts`; admin routes additionally check `locals.user` (see Rule 7 of M4 tasks).
- Never pass raw DB rows containing sensitive fields through `load` returns without thinking about what ships to the browser.

## Database (Drizzle)

- **All queries through Drizzle.** No raw SQL strings except tiny `sql\`\`` fragments inside `.set()` (e.g., boolean flip) when no helper exists.
- Schema changes:
  1. Edit `src/lib/server/db/schema.ts` (the single schema file).
  2. Apply per project decision: `drizzle-kit push` (dev) or committed migrations from `drizzle-kit generate` (prod path, see `docs/tasks/07-production-hardening.md` §7.2).
- Conventions in schema:
  - ids: `varchar(36)` + `crypto.randomUUID()` at insert time
  - timestamps: `timestamp('...').defaultNow().notNull()`
  - booleans: `.notNull()` with explicit default
  - unique constraints declared inline (`.unique()`) so `ER_DUP_ENTRY` handling stays meaningful
- Connection pool is a singleton in `src/lib/server/db/index.ts`. Import `{ db }` — never create pools elsewhere (HMR will leak connections).
- Query style: `db.select().from(t).where(...).orderBy(desc(t.createdAt))` — chain explicitly, wrap public-facing loads in try/catch that degrade gracefully (return `[]`, log server-side), matching existing `+page.server.ts` load.

## Form Actions (the ONLY mutation channel)

Pattern (copy from existing actions):

```ts
export const actions = {
  name: async ({ request }) => {
    const data = await request.formData();
    // 1. read + coerce
    const x = data.get('x') as string;
    // 2. validate → fail(400, { error: '...' }) with GENERIC messages
    if (!x) return fail(400, { error: 'Missing required fields.' });
    try {
      // 3. mutate via drizzle
      await db.insert(t).values({ ... });
      return { success: true };
    } catch (err: any) {
      if (err.code === 'ER_DUP_ENTRY') {
        return fail(400, { error: 'Already exists.' }); // user-friendly dup message
      }
      console.error(err);
      return fail(500, { error: 'Failed to save. Please try again.' });
    }
  }
};
```

Rules:
- Action names are lowercase verbs/nouns: `rsvp`, `message`, `login`, `toggleApproval`.
- Client side always pairs with `use:enhance` + a typed `SubmitFunction` that manages `submitting/success/errorMsg` local state and calls `update({ reset: false })` where preserving input matters.
- Auth-guarded actions re-check `locals.user` INSIDE the action body (layout guards don't cover direct POSTs).
- Validation limits mirror schema lengths (name ≤ 100 chars etc.) — see `docs/tasks/07-production-hardening.md` §7.4.

## Env & secrets

- Read config via `$env/dynamic/private` in server modules; never `$env/static/private` mixed into shared modules.
- New env keys get documented in `.env.example` with empty values.
