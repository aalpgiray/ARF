## Context

`SessionTable` is currently a React Server Component (RSC) — it receives `ActiveSession[]` as props from the server-rendered dashboard page and renders pure HTML. No client-side state or event handlers exist on the table.

The `handleReturn` logic already exists in `/app/sign-in/page.tsx`: POST to `/api/sessions/[id]/return`, then redirect to `/sign-in/training?session_id=<id>`. This exact pattern is being moved, not rewritten.

## Goals / Non-Goals

**Goals:**
- Single-tap return from dashboard row
- Eliminate `/app/sign-in` page as a navigation step
- Preserve the post-return training capture flow

**Non-Goals:**
- Any change to the sign-out wizard
- Any change to the training capture page
- Confirmation dialog or undo — one tap, done (dockside speed > safety net)
- Changing the overdue detection or alert logic

## Decisions

### Convert `SessionTable` to a client component

`SessionTable` needs `onClick` handlers on each row's button. Two options:

| Option | Approach | Trade-off |
|--------|----------|-----------|
| **A — Convert whole component** | Add `'use client'` to `SessionTable.tsx`, accept `ActiveSession[]` props, add `handleReturn` inline | Simple, single file. Loses RSC streaming benefit for this component — but dashboard is already `force-dynamic` so no SSG benefit lost |
| B — Thin client wrapper | Keep `SessionTable` as RSC, add `SessionTableClient` wrapper that injects button handlers via render props | Extra indirection for minimal gain; the component is small |

**Decision: Option A.** Component is small (~70 lines). Dashboard is `force-dynamic`; no SSG/streaming benefit exists to preserve.

### Button placement in row

Each `sess-row` gets a button in a new rightmost cell, replacing the status chip cell or appended after it. Status chip ("On water" / overdue) stays visible — the button sits alongside it.

Options:
- Replace status chip with button — cleaner, less columns
- Append button after status — keeps overdue visibility

**Decision: Keep status chip, append "I'm back" button.** Overdue visibility is safety-relevant; don't remove it to save space. On mobile the row scrolls horizontally anyway (mobile-friendly-ui change handles this).

### Loading state

Button shows "Recording…" and is disabled while the POST is in flight — same pattern as existing `/sign-in` page.

### Redirect after return

After `POST /api/sessions/[id]/return` succeeds → `router.push('/sign-in/training?session_id=<id>')`. Identical to current flow.

## Risks / Trade-offs

- **Accidental tap** — No confirmation step. A mis-tap marks a crew as returned. Mitigation: none intentional (speed over safety net for dockside use); the admin page can correct records.
- **`force-dynamic` already paid** — Converting `SessionTable` to client adds no extra waterfall; the dashboard page already opts out of static rendering.
- **`/sign-in` deletion** — Any browser tab or bookmark pointed at `/sign-in` will 404. Acceptable: no external links exist (single link was the dashboard footer CTA being removed).

## Migration Plan

1. Convert `SessionTable` — add `'use client'`, inject return handler
2. Update `app/page.tsx` — remove footer CTA
3. Delete `app/sign-in/page.tsx`
4. Verify `app/sign-in/training/page.tsx` unaffected
5. Manual smoke test: tap "I'm back" on a row → verify training page loads
