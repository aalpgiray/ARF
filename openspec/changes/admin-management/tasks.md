> **Design reference**: `openspec/changes/admin-management/design-reference/`
> — `admin.jsx` for all admin screen markup and component structure
> — `styles.css` for CSS class names and rules (translate `var(--sans/serif/mono)` → `var(--font-sans/serif/mono)`)

## 1. Schema Migration

- [x] 1.1 Update `prisma/schema.prisma`: Member — add `firstName String`, `lastName String`, `isActive Boolean @default(true)`, `updatedAt DateTime @updatedAt`; make `googleUserId String? @unique`; remove `displayName`, `syncedAt`
- [x] 1.2 Update `prisma/schema.prisma`: Boat — add `isActive Boolean @default(true)`, `retiredReason String?`, `updatedAt DateTime @updatedAt`
- [x] 1.3 Create `prisma/migrations/20260515000000_admin_schema/migration.sql` with backfill: make `google_user_id` nullable, drop `synced_at`, add + backfill `first_name`/`last_name` from `display_name` (SPLIT_PART), drop `display_name`, add `is_active` + `updated_at` to members, add `is_active` + `retired_reason` + `updated_at` to boats
- [x] 1.4 Run `npx prisma generate` to regenerate the Prisma client

## 2. Remove Dead Code

- [x] 2.1 Delete `lib/google-directory.ts`
- [x] 2.2 Delete `app/api/sync/members/route.ts` and its directory

## 3. Update Existing APIs

- [x] 3.1 `app/api/members/route.ts` — add `where: { isActive: true }` filter; return `firstName`, `lastName` instead of `displayName`
- [x] 3.2 `app/api/members/[id]/route.ts` — return `firstName`, `lastName` instead of `displayName`
- [x] 3.3 `app/api/boats/route.ts` — add `where: { isActive: true }` filter to `findMany`
- [x] 3.4 `app/api/sessions/[id]/route.ts` — remove `googleUserId`-based member lookup; remove `member` field from response
- [x] 3.5 Update `prisma/seed.ts` — use `firstName`/`lastName` directly (CSV already parses them); upsert by `email` instead of `googleUserId`; drop `syncedAt`; set `isActive: true`

## 4. Update Existing UI and Hooks

- [x] 4.1 `lib/hooks/useMembers.ts` — update `MemberRecord` type: `firstName: string`, `lastName: string` (drop `displayName`); derive display name as `${firstName} ${lastName}` at use-sites
- [x] 4.2 `app/sign-out/page.tsx` — replace all `m.displayName` references with `${m.firstName} ${m.lastName}`; update alpha filter to use `m.firstName`
- [x] 4.3 `components/Chrome.tsx` — add gear icon button (top-right of arf-meta); use `usePathname()` to set active state when path starts with `/admin`; wrap in Next.js `<Link href="/admin">`

## 5. Admin CSS

- [x] 5.1 Append admin-specific CSS to `app/globals.css`: `.gear`, `.crumb`, `.admin-tiles`, `.admin-tile`, `.atable`, `.atable.boats` override, `.tabs`, `.tabs button`, `.ahead-row`, `.modal-scrim`, `.modal`, `.modal .mhead/mbody/mfoot`, `.form-grid`, `.field`, `.dropzone`, `.wizard-steps`, `.dryrun-summary`, `.acc`, `.error-banner`, `.success-state` — match design file token names but use existing `--font-*` vars

## 6. Admin API Routes — Members

- [x] 6.1 `app/api/admin/members/route.ts` — `GET`: return all members (active + inactive), include `isActive`, `updatedAt`, `firstName`, `lastName`; `POST`: create member, validate required fields, check email uniqueness, check `ALLOWED_EMAIL_DOMAIN` if set
- [x] 6.2 `app/api/admin/members/[id]/route.ts` — `PATCH`: update member fields; handle `action: 'deactivate'` (set isActive=false) and `action: 'reactivate'` (set isActive=true)
- [x] 6.3 `app/api/admin/members/export/route.ts` — `GET`: stream CSV with columns `id,firstName,lastName,email,squad,isActive`; set `Content-Disposition: attachment; filename=members-<date>.csv`
- [x] 6.4 `app/api/admin/members/import/route.ts` — `POST` with `?mode=dry-run`: parse CSV body, validate all rows, return `{ errors, diff: { added, updated, deactivated, unchanged } }`; `POST` with `?mode=apply`: re-validate then write all in a Prisma `$transaction`

## 7. Admin API Routes — Boats

- [x] 7.1 `app/api/admin/boats/route.ts` — `GET`: return all boats (active + retired) with `isActive`, `retiredReason`, `updatedAt`; `POST`: create boat, validate required fields, check name uniqueness
- [x] 7.2 `app/api/admin/boats/[id]/route.ts` — `PATCH`: update boat fields; handle `action: 'retire'` (set isActive=false, optionally set retiredReason) and `action: 'restore'` (set isActive=true, clear retiredReason)
- [x] 7.3 `app/api/admin/boats/export/route.ts` — `GET`: stream CSV with columns `id,name,category,yearBuilt,weightKg,rackLocation,state,isActive,retiredReason`
- [x] 7.4 `app/api/admin/boats/import/route.ts` — same pattern as members import: dry-run validates boat CSV rules (id anchor, name collision check), apply writes in transaction

## 8. Admin UI — Home and Shared Components

- [x] 8.1 Create `components/AdminChrome.tsx` — Chrome variant with gear in active state + breadcrumb prop; uses same arf-chrome base styles
- [x] 8.2 Create `app/admin/page.tsx` — admin home with Members + Boats tiles fetching live counts from admin APIs; "← Back to kiosk" footer
- [x] 8.3 Create shared `components/admin/ConfirmNameModal.tsx` — reusable modal: title, body, name-to-type input, real-time validation, destructive confirm button

## 9. Admin UI — Member Management

- [x] 9.1 Create `app/admin/members/page.tsx` — Active/Inactive tab strip; table with Member, Email, Squad, Last modified, Actions columns; search box; Export/Import/Add buttons; fetches from `GET /api/admin/members`
- [x] 9.2 Add `AddMemberModal` to members page — firstName, lastName, email (with domain hint), squad (optional); POST to `/api/admin/members`; inline error display for 409/422
- [x] 9.3 Wire "Deactivate" button — opens `ConfirmNameModal`; on confirm PATCHes `/api/admin/members/[id]` with `action: 'deactivate'`; refreshes list
- [x] 9.4 Wire "↺ Reactivate" button on Inactive tab — PATCHes `/api/admin/members/[id]` with `action: 'reactivate'`; refreshes list
- [x] 9.5 Wire "↓ Export CSV" button — fetches `/api/admin/members/export` and triggers browser download

## 10. Admin UI — Boat Management

- [x] 10.1 Create `app/admin/boats/page.tsx` — Active/Retired tab strip; table with Name, Type, Built, Hull, Rack, State, Actions; category filter chips; search; Export/Import/Add buttons
- [x] 10.2 Add `AddBoatModal` to boats page — name, category (select), yearBuilt, weightKg, rackLocation; POST to `/api/admin/boats`; inline 409 error
- [x] 10.3 Add `RetireBoatModal` — shows boat details, optional reason field, on-water warning chip if active session; PATCHes `action: 'retire'`
- [x] 10.4 Wire "Restore to fleet" on Retired tab — PATCHes `action: 'restore'`; refreshes list
- [x] 10.5 Wire "↓ Export CSV" — fetches `/api/admin/boats/export` and triggers browser download

## 11. Admin UI — CSV Import Wizard (Members)

- [x] 11.1 Create `app/admin/members/import/page.tsx` — 3-step wizard shell with WizardSteps indicator; manages step state (upload → review → done)
- [x] 11.2 Step 1 Upload — drag-and-drop zone; file selection; file preview (name, rows, size); "Download template" link (`GET /api/admin/members/export?template=1`); "Check for changes" button POSTs to dry-run
- [x] 11.3 Step 2 Review (clean) — 4 summary tiles (added/updated/deactivated/unchanged); expandable accordion per category with row-level diff; "Apply N changes" button POSTs to apply
- [x] 11.4 Step 2 Errors — red error banner listing all errors (row, field, description); diff hidden; Apply button disabled
- [x] 11.5 Step 3 Done — success state with checkmark, count summary, "Back to member list" and "Download change log" buttons

## 12. Admin UI — CSV Import Wizard (Boats)

- [x] 12.1 Create `app/admin/boats/import/page.tsx` — identical 3-step wizard pattern adapted for boat CSV columns; reuses wizard step components where possible
- [x] 12.2 Wire boat import dry-run and apply to `/api/admin/boats/import`
