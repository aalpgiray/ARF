## Context

ARF is a Next.js App Router kiosk app backed by Postgres via Prisma. Members and boats are seeded manually or via a now-removed Google Workspace sync. There is no authentication — the system is trust-based. The current schema stores members with a single `displayName` field and no `isActive` flag; boats have no fleet-membership concept separate from their operational `state`. There is no in-app management UI.

Design references live in `openspec/changes/admin-management/design-reference/`:

| File | Purpose |
|------|---------|
| `admin.jsx` | **Primary reference** — all 12 admin screen components (ChromeAdmin, AdminHome, MemberListActive, MemberListInactive, AddMemberModal, DeactivateModal, CsvUpload, CsvDryRun, CsvErrors, CsvSuccess, BoatList, RetireBoatModal) |
| `styles.css` | **Primary CSS reference** — all class names, tokens, and admin-specific rules (`.gear`, `.crumb`, `.admin-tiles`, `.atable`, `.tabs`, `.modal`, `.dropzone`, `.wizard-steps`, `.dryrun-summary`, `.acc`, `.error-banner`, `.success-state`) |
| `screens.jsx` | Existing kiosk screens — reference for Chrome/Footer/shared patterns |
| `design-canvas.jsx` | Canvas layout only — ignore for implementation |
| `tweaks-panel.jsx` | Palette switcher — already implemented |

CSS tokens in `styles.css` use `var(--sans)` / `var(--serif)` / `var(--mono)` — translate to `var(--font-sans)` / `var(--font-serif)` / `var(--font-mono)` in `globals.css`. All other tokens (`--sand`, `--ink`, etc.) are identical. Admin screens in the design are fixed 1024×768; implement as full-height kiosk views matching the existing `.arf` container.

## Goals / Non-Goals

**Goals:**
- Migrate `Member` and `Boat` schemas to support `isActive` soft-delete and `firstName`/`lastName` split fields
- Remove Google Workspace sync code entirely
- Add a trust-based admin section reachable via gear icon in Chrome
- Member and boat CRUD with confirmation dialogs for destructive actions
- Bulk CSV import with full dry-run diff and atomic apply
- CSV export for both members and boats
- Email domain enforcement via env var

**Non-Goals:**
- Authentication or role-based access
- Google Workspace sync (removed, not deferred)
- Excel/XLSX format (CSV is sufficient)
- Mobile/portrait layout for admin screens
- Audit log or change history beyond `updatedAt` timestamp

## Decisions

### D1: firstName + lastName as separate fields, not computed

**Decision**: Store `firstName` and `lastName` as separate `String` columns on `Member`. Drop `displayName`.

**Rationale**: Admin form has separate inputs; sorting by last name; initials generation from two fields is cleaner. Derived `displayName` is computed at use-site: `${firstName} ${lastName}`.

**Alternative considered**: Keep `displayName` as stored field alongside firstName/lastName. Rejected — three fields for one thing, sync burden.

---

### D2: googleUserId retained as nullable on Member; removed from active use

**Decision**: Make `Member.googleUserId` nullable (`String? @unique`) rather than dropping the column. Remove from all application logic.

**Rationale**: Existing seeded rows have `googleUserId` values (format `csv-<email>`). Dropping the column loses that data. Making it nullable is a non-destructive migration; future Google SSO could populate it. New manually-added members get `null`.

**Session.googleUserId** is already nullable and retained as a legacy field; the session GET endpoint removes its member-lookup logic.

---

### D3: isActive on Member and Boat is independent of Boat.state

**Decision**: `isActive: Boolean @default(true)` added to both models. For Boat, `state` (AVAILABLE/MAINTENANCE) remains — it describes where the boat is today; `isActive` describes whether it's in the fleet at all.

**Rationale**: A retired boat (isActive=false) may previously have been in MAINTENANCE. The two concepts are orthogonal. Public views and pickers filter on `isActive = true` only; admin shows all.

---

### D4: CSV identity anchors

**Decision**:
- **Members**: `email` is the identity anchor. Import row without `id` → new member if email not found, update if email matches.
- **Boats**: `id` is the identity anchor. Import row with no `id` → create new boat. Row with `id` → update. Name conflict on a different record → hard error.

**Rationale**: Email is stable and user-readable for members. Boats can be renamed so name is not stable; `id` survives renames. Exporting always includes `id` so round-trip imports work.

---

### D5: Admin section has no separate layout — inherits kiosk layout

**Decision**: Admin pages use the same `body.arf` kiosk container (100dvh, overflow hidden, flex column). A separate admin Chrome component renders the gear in active state + breadcrumb. No separate `app/admin/layout.tsx` wrapper needed.

**Rationale**: Admin screens are also full-screen kiosk views (tablet). The design reference shows 1024×768 fixed artboards — same kiosk feel. No layout nesting complexity.

---

### D6: CSV import is two separate API calls — validate then apply

**Decision**: `POST /api/admin/members/import?mode=dry-run` returns the diff object (no writes). `POST /api/admin/members/import?mode=apply` performs the writes after client confirms.

**Rationale**: Separates concerns cleanly. Client holds the dry-run result in state and shows it; user confirms; client calls apply. If apply receives a different file, it re-validates server-side before writing. No session/token needed (trust-based).

**Alternative considered**: Single endpoint that writes and returns diff in one call. Rejected — no way to show preview before committing.

---

### D7: Deactivated member/boat visibility

**Decision**:
- `GET /api/members` (used by sign-out picker) → filters `isActive: true` only
- `GET /api/boats` (used by boat picker and public registry) → filters `isActive: true` only
- `GET /api/admin/members` → returns all, includes `isActive` field
- `GET /api/admin/boats` → returns all, includes `isActive` field

**Rationale**: Clean separation. Public routes are safe by default. Admin routes are the only path to see/manage inactive records.

---

### D8: Email domain enforcement is server-side only

**Decision**: Validate `ALLOWED_EMAIL_DOMAIN` env var on API routes (`POST /api/admin/members` and during CSV import validation). Client shows a hint from the API error message; no client-side enforcement.

**Rationale**: Trust-based system — no auth — so server is the only enforcement layer. Client hint is UX sugar.

---

### D9: Prisma migration strategy

**Decision**: Create migration SQL manually as a new migration directory (`prisma/migrations/<timestamp>_admin_schema/migration.sql`). Use PostgreSQL `SPLIT_PART` and `SUBSTRING` to backfill `first_name`/`last_name` from `display_name` before dropping the column.

**Rationale**: Cannot run `prisma migrate dev` interactively. Manual SQL gives full control over the backfill step. Migration is idempotent once applied.

Migration steps (in order):
1. Make `google_user_id` nullable
2. Drop `synced_at`
3. Add `first_name`, `last_name` (nullable)
4. Backfill from `display_name` (SPLIT_PART for first word; SUBSTRING for remainder)
5. Set empty `last_name` to `''` for single-word names
6. Drop `display_name`
7. Set `first_name`/`last_name` NOT NULL
8. Add `is_active` (default true) and `updated_at` to `members`
9. Add `is_active`, `retired_reason`, `updated_at` to `boats`

---

## Risks / Trade-offs

**[Risk] Migration is destructive for displayName** → Mitigation: backfill in same transaction; single-word names get empty last_name (acceptable). Take DB snapshot before running in production.

**[Risk] googleUserId unique constraint breaks if two manually-added members get NULL** → Mitigation: Postgres treats multiple NULLs as distinct for unique constraints — no collision. Verified PostgreSQL behavior.

**[Risk] Large CSV import could time out on slow connections** → Mitigation: 2 MB file size limit enforced client-side and server-side. Typical roster is < 200 rows, well within 300s Vercel timeout.

**[Risk] No auth means any kiosk user can access /admin and retire all boats** → Mitigation: Explicit confirmation (type-name dialog) for all destructive actions. Accepted trade-off per product decision; can add PIN/passcode in future change.

**[Risk] Seed fails after migration if not updated** → Mitigation: Seed is updated in same PR to use firstName/lastName and email-based upsert.

## Migration Plan

1. Apply schema changes to Prisma schema file
2. Create and commit manual migration SQL
3. Run `prisma generate` to update client
4. Deploy with migration applied (Prisma migrate deploy in CI)
5. Run updated seed if needed (non-destructive upsert)

**Rollback**: Restore `display_name` column with `CONCAT(first_name, ' ', last_name)`. Re-add `synced_at` with NULL. Set `google_user_id` back to NOT NULL (only if no NULL rows). Rollback is feasible within same deployment window.

## Open Questions

- _(resolved)_ Excel vs CSV → CSV chosen, simpler
- _(resolved)_ Name as boat identity anchor vs ID → ID chosen, name can change
- _(resolved)_ Google sync keep/remove → removed entirely
- Squad values: are they free-text or an enum? Currently free-text in schema. CSV import accepts any string. Admin add form shows a dropdown of known values but allows free text. No validation on squad values in this change.
