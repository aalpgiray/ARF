## Why

The kiosk has no way to manage its own data — adding members, retiring boats, or correcting the roster requires direct database access. Club administrators need a trust-based, in-app management surface so day-to-day operations don't require a developer.

## What Changes

- **BREAKING** `Member` schema: `displayName` → `firstName` + `lastName` (separate required fields); `googleUserId` becomes optional nullable; add `isActive` boolean; add `updatedAt`
- **BREAKING** `Boat` schema: add `isActive` boolean (fleet membership, separate from operational `state`); add `retiredReason`; add `updatedAt`
- **BREAKING** Remove `Member.syncedAt` and the Google Workspace Directory sync endpoint (`/api/sync/members`) and `lib/google-directory.ts` — sync is out of scope
- `Session.googleUserId` field retained as nullable legacy; member-lookup on session GET updated to not rely on it
- Gear icon added to Chrome header — navigates to `/admin`; active state when in admin context
- New admin section at `/admin` with member and boat management
- Members: add individually (firstName, lastName, email required; email-domain enforcement via `ALLOWED_EMAIL_DOMAIN` env var), deactivate/reactivate with type-name confirmation; deactivated members hidden from sign-out picker
- Boats: add individually, retire/restore with confirmation and optional reason; retired boats hidden from sign-out boat picker and boat registry public view
- Bulk CSV import for members and boats: upload → dry-run report (all errors collected, no partial writes) → confirm → apply; export current list as CSV
- Seed updated to use `firstName`/`lastName` directly

## Capabilities

### New Capabilities

- `admin-entry`: Gear icon in Chrome header, `/admin` home page, breadcrumb navigation, admin context chrome
- `member-management`: Individual member CRUD — add (firstName/lastName/email/squad), deactivate/reactivate with confirmation; email domain enforcement; active-only filter on sign-out picker
- `boat-management`: Individual boat CRUD — add, edit, retire/restore with confirmation and reason; active-only filter on boat picker and public registry
- `csv-import-export`: Bulk CSV upload with full dry-run diff (added/updated/deactivated/unchanged), row-level error reporting, export current list; covers both members and boats

### Modified Capabilities

- `member-directory`: Member record structure changes (firstName/lastName replaces displayName; isActive field; updatedAt; googleUserId nullable); member picker filters to isActive = true only; manual management replaces Google sync requirement
- `boat-registry`: Boat record adds isActive and retiredReason; public registry and boat picker show only isActive = true boats; operational `state` (AVAILABLE/MAINTENANCE) is unchanged and orthogonal to isActive

## Impact

- **Schema migration**: `members` table — drop `display_name`, `synced_at`; add `first_name`, `last_name`, `is_active`, `updated_at`; make `google_user_id` nullable. `boats` table — add `is_active`, `retired_reason`, `updated_at`
- **APIs changed**: `GET /api/members` and `GET /api/boats` gain `isActive` filter; `GET /api/sessions/:id` drops `googleUserId`-based member lookup
- **APIs removed**: `POST /api/sync/members`
- **APIs added**: full `/api/admin/members` and `/api/admin/boats` CRUD + import + export routes
- **Pages added**: `/admin`, `/admin/members`, `/admin/members/import`, `/admin/boats`, `/admin/boats/import`
- **Files removed**: `lib/google-directory.ts`, `app/api/sync/members/route.ts`
- **CSS**: admin-specific styles added to `globals.css` (gear, crumb, admin-tiles, atable, tabs, modal, form-grid, dropzone, wizard-steps, dryrun-summary, acc, error-banner, success-state)
- **Config**: new optional env var `ALLOWED_EMAIL_DOMAIN`
