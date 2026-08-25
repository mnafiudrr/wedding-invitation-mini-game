# Task 4.6 — Message Moderation Dashboard

- **Status**: [ ] TODO
- **Milestone**: 4 — Admin Dashboard
- **Depends on**: 04-4
- **Blocks**: nothing

## Objective
Build `/admin/messages` to review and approve/unapprove guest messages.

## Steps

### 1. `src/routes/admin/messages/+page.server.ts`
- Guard with `locals.user` → redirect if missing.
- `load`: select ALL messages ordered by `createdAt desc` (unfiltered by approval — this is the moderation view).
- Action `?/toggleApproval`:
  - Read `id` from form data.
  - Flip `isApproved` atomically in one statement:
    ```ts
    await db.update(messages)
      .set({ isApproved: sql`${messages.isApproved}`.mapWith(Boolean). ... })
      ```
    Simplest robust form: fetch row, flip value, update — or use `sql` raw expression `NOT is_approved` inside `.set()`. Prefer: `db.update(messages).set({ isApproved: sql\`not \${messages.isApproved}\` }).where(eq(messages.id, id))`.
  - Re-check guard inside the action too (actions don't inherit layout load guards).

### 2. `src/routes/admin/messages/+page.svelte`
- List of message cards: guest name, message body, timestamp, current status badge (Approved / Pending).
- Each card has an Approve/Unapprove button submitting `<form method="POST" action="?/toggleApproval">` with hidden `id`, using `use:enhance`; after success, apply the returned/fetched state without full reload (`invalidateAll()` in the enhance callback is acceptable and simple).
- Visual distinction between approved/pending (e.g., opacity or colored badge).
- Optional (only if trivial): delete-message action `?/delete` for spam.

## Related fix
- Note the dev hack at `src/routes/+page.server.ts:67` (`isApproved: true // Auto approve`). The public behavior change to `false` is tracked separately in [`07-production-hardening.md`](./07-production-hardening.md), but once this dashboard exists, moderation flow must work end-to-end: submit public message → appears here as pending → approve → visible on public Messages menu.

## Constraints
- Drizzle only; form actions only; no `/api/` routes.

## Acceptance criteria
- [ ] Toggle works both directions and survives page refresh
- [ ] Public messages list (`load` in `+page.server.ts`) reflects toggles immediately
- [ ] Unauthenticated POST to `?/toggleApproval` is rejected (fail 401/403 or redirect)
- [ ] `npm run check` passes

## Files touched
- `src/routes/admin/messages/+page.server.ts` (new), `src/routes/admin/messages/+page.svelte` (new)
