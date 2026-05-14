## Context

New greenfield project. No existing codebase. Target deployment is a tablet kiosk (landscape, 1280×800) mounted at the club door, plus mobile browsers for future use. A visual design prototype exists at `design-reference/` — the implementation must match it pixel-accurately.

Club uses Google Workspace (admin-managed). ~70 active members. No individual authentication in v1; the tablet is a shared public device.

## Goals / Non-Goals

**Goals:**
- Tablet kiosk app: sign-out (member → boat → return time) and sign-in (pick session → optional training log)
- Live dashboard showing who is on water, with overdue session highlighting
- Member list managed via seed script (`npm run db:seed`); Google Workspace sync deferred to v2
- Boat registry with availability states (available / out / maintenance)
- Optional training data capture on return (distance, duration, type, notes)
- Schema forward-compatible with Google SSO (nullable `google_user_id` from day one)
- Visual design matches `design-reference/screens.jsx` and `design-reference/styles.css` exactly

**Non-Goals:**
- User authentication / login in v1
- Push notifications or SMS alerts for overdue sessions
- Mobile-portrait layout (tablet landscape only in v1)
- Ergo / indoor training tracking
- Damage reporting (future capability)
- Billing or membership management

## Decisions

### Stack: Next.js 16.2.6 (App Router) + PostgreSQL (Neon) + Vercel

**Versions:** `next@16.2.6`, `tailwindcss@4.3.0`, `@radix-ui/*@2.2.6`

**Why:** Next.js 16 gives us server components for data fetching without a separate API layer, Neon is serverless Postgres with a generous free tier, and Vercel deploys from git with zero config. The kiosk runs in a browser — no native app needed.

**Alternatives considered:**
- Rails + PostgreSQL: familiar but more setup, slower iteration
- Remix: viable but smaller ecosystem for this use case
- SvelteKit: less familiar, harder to find help

### ORM: Prisma 7.8.0

**Why:** Prisma gives type-safe DB access, auto-generated client from schema, and built-in migrations. Much safer than raw SQL for a growing schema. Works seamlessly with Neon via `@prisma/adapter-neon`.

**Alternatives considered:**
- Drizzle: lighter but less mature tooling
- Raw SQL via `postgres` / `pg`: more control but no type safety, more boilerplate

### UI: Tailwind CSS + Radix UI primitives + custom CSS variables

**Why:** The design system in `design-reference/styles.css` uses precise CSS custom properties (`--sand`, `--ink`, `--clay`, etc.), Instrument Serif italic for display text, and Geist for UI. Radix UI provides accessible, unstyled primitives (Select, Dialog, Tooltip, etc.) that we fully style to match the design — no fighting against a component library's visual opinions. Tailwind handles layout/spacing; custom CSS handles design tokens and typography.

**Alternatives considered:**
- shadcn/ui: built on Radix but includes opinionated styles that would need heavy overrides
- MUI / Ant Design: too visually opinionated, wrong aesthetic entirely
- Vanilla CSS modules: fine but Tailwind utility classes speed up layout

### Fonts: Google Fonts (Instrument Serif + Geist + Geist Mono)

Already used in the prototype. Self-host via `next/font` to avoid FOUT and external requests from the kiosk.

### Member list: Manual seed (v1) → Google Workspace sync (v2)

**v1:** Members seeded directly via `prisma/seed.ts`. Club admin updates the file and reruns `npm run db:seed` when roster changes. No external API dependency.

**v2 plan:** OAuth admin consent flow — club admin clicks "Connect Google Workspace", approves read-only directory access, app stores refresh token per org and syncs on cron. Supports multi-club SaaS model. Club does not need Google Cloud Console access.

**Why not service account in v1:** Club uses Google Workspace for Nonprofits without Google Cloud Console access. Service account setup requires Cloud Console. OAuth consent flow (v2) removes this barrier.

**Why cache in DB vs. in-memory:** Vercel serverless functions are ephemeral; in-memory cache doesn't survive across requests.

### Session state: Server-side only, no client state management

Sign-out flow (3 steps: member → boat → return time) uses URL search params to carry state between steps (`?member_id=...&boat_id=...`). No client-side state store needed. Simple, bookmarkable, back-button safe.

**Alternatives considered:**
- React context / Zustand: overkill for a 3-step flow
- Cookie session: works but adds complexity

### Overdue detection: DB query + periodic client polling

Sessions where `returned_at IS NULL AND expected_return < NOW()` are overdue. Dashboard polls every 30s (simple `setInterval` + router.refresh()). No websockets needed for v1.

### Palette / density tweaks: CSS class on `<body>`

The design supports sand/mist/dusk palettes and regular/comfy density. Implemented as CSS classes (`arf-dusk`, `arf-mist`, `comfy`) on the root element, matching the prototype's approach. Stored in `localStorage` on the tablet.

## Risks / Trade-offs

- **Stale member list** → Manual seed means roster changes require a code edit + redeploy. Acceptable for v1 (~70 members, low churn). Mitigated in v2 by Google sync.
- **No auth = anyone can sign out anyone** → Acceptable for v1 (safety log, not security-critical); mitigated by audit trail (all sessions timestamped)
- **Tablet network outage** → Mitigation: show last-known state from browser cache; queue writes locally and sync when online (future)
- **`google_user_id` backfill** → Seed data uses `dummy-NNN` IDs. When Google sync added in v2, match by email to backfill real IDs. Store email on members to enable this.
- **1280×800 fixed layout** → App targets this viewport; responsive CSS not required in v1 but Tailwind breakpoints shouldn't fight it

## Migration Plan

1. Provision Neon PostgreSQL database
2. Run migrations (members, boats, sessions tables)
3. Set env vars on Vercel (`DATABASE_URL`)
4. Seed members and boats (`npm run db:seed`)
5. Deploy to Vercel preview → test on tablet at 1280×800
6. Promote to production, mount tablet

Rollback: previous Vercel deployment is one click. Database rollback: drop and re-migrate (no prod data in early rollout).

## Open Questions

- Club name to display in the chrome bar ("Tideway Boat Club" in prototype — confirm with user)
- Overdue grace period before flagging (prototype shows 15m after expected return — confirm)
- ~~Google Workspace domain name~~ — deferred to v2
