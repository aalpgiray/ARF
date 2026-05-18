## Why

The current "I'm back" flow routes through a dedicated `/sign-in` page that duplicates the dashboard session list with buttons added — an extra navigation step with no new information. Removing this indirection lets dockside users mark a crew as returned in a single tap directly from the dashboard row they are already looking at.

## What Changes

- Add an inline "I'm back" button to each session row in `SessionTable` on the dashboard
- `SessionTable` becomes a client component (needs `onClick` handlers)
- Remove the footer "I'm back — sign in" CTA from the dashboard
- Delete `/app/sign-in/page.tsx` (the now-redundant intermediate page)
- `/app/sign-in/training/page.tsx` is retained — post-return training capture is unchanged

## Capabilities

### New Capabilities

- None — this is a UX simplification, not a new capability

### Modified Capabilities

- `on-water-dashboard`: Dashboard session rows now include a return action; the footer "I'm back — sign in" CTA is removed
- `session-log`: Sign-in flow entry point moves from a standalone page to an inline row action on the dashboard; the separate sign-in list page is eliminated

## Impact

- `components/dashboard/SessionTable.tsx` — converted from server to client component
- `app/page.tsx` — footer CTA removed
- `app/sign-in/page.tsx` — deleted
- `app/sign-in/training/page.tsx` — unchanged
- `app/sign-out/return/page.tsx` — unchanged (sign-out flow unaffected)
- `/api/sessions/[id]/return` API route — unchanged
