# Rule 7 — Git & Documentation Workflow

## Definition of done (per task)

A task file in `docs/tasks/` is complete only when ALL of:
1. Acceptance criteria checkboxes are ticked in the task file.
2. Status line updated (`[ ] TODO` → `[x] DONE`, plus date).
3. Mirrored in `docs/plans/04-task-list.md` checkbox.
4. `npm run check` passes.
5. Manually verified in browser at a mobile viewport (game changes) or via curl/devtools (server changes).

## Commit discipline

- Only commit when the user explicitly asks. Never commit secrets, `.env`, or generated `.svelte-kit/`.
- Commit message style: imperative, lowercase, scoped — e.g.:
  - `add lucia auth setup and session hooks`
  - `fix camera clamp at world edge`
  - `docs: add rules for css and performance`
- One logical change per commit; don't mix doc updates with feature code unless trivially related.
- Do not amend pushed commits; do not force-push shared branches.

## Documentation sync duties

When your change affects any of these, update the corresponding doc **in the same PR/task**:

| Change type | Update |
|---|---|
| New global store / renamed store | Rule 3 store table |
| New house/menu | `houses.ts` + `modalComponents` record + task index if tracked |
| New schema table/column | Task 07 §7.2 migration note if strategy changed |
| New dependency added/removed | Mention in task file notes + verify against plan constraints (no anim/audio libs) |
| New route under `/admin` | Check guard pattern compliance (Rule 5) |
| Anything contradicting `docs/plans/*` | Update the plan docs too — plans are vision, but they must not lie |

## Working with AI agents

Agents should, in order:
1. Read `docs/rules/00-rules-index.md` commandments.
2. Read the specific rule files relevant to the touched area.
3. Read the current task file being executed.
4. Write code following the patterns shown in existing files (copy `House.svelte` shape for world entities, `RSVP.svelte` shape for forms, existing action style in `+page.server.ts`).
5. Run checks, update task status, stop — no unsolicited refactors beyond scope.

## Scope discipline

- Fix what the task asks. If you discover adjacent problems, note them in the task file ("Follow-ups") or a new task file — don't silently expand the diff.
- Placeholder hacks MUST carry a comment with a tracking reference (good example: `isApproved: true // Auto approve... see docs/tasks/07-production-hardening.md §7.1`).
