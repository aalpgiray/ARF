## Why

Rowing is a team sport — crew boats carry 2, 4, or 8 people. The current sign-out flow only records one member per session, making it impossible to track who is on the water for crew boats. Safety tracking requires knowing every person out there, not just whoever happened to tap the kiosk.

## What Changes

- **BREAKING** `sessions.member_id` (singular FK) replaced by `sessions.crew_member_ids` (uuid array) — one session tracks all crew for a boat trip
- Sign-out step 1 becomes a multi-select member picker (tap to toggle, any number of members)
- Sign-in active session list shows full crew names instead of a single member
- Training data remains boat-level (stored on the session record, unchanged fields)
- Existing sessions deleted — development data only, no migration required
- Prisma schema, API routes, and seed updated to reflect new model

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `session-log`: sign-out now records multiple crew members; sign-in displays crew; session record structure changes (`member_id` → `crew_member_ids`)

## Impact

- `prisma/schema.prisma` — `Session` model: remove `memberId`, add `crewMemberIds String[]`
- `prisma/seed.ts` — update seed data for new schema
- `app/api/sessions/route.ts` (and related) — POST body changes, GET responses include crew array
- `app/sign-out/page.tsx` — multi-select member picker
- `app/sign-in/page.tsx` (or equivalent) — crew display on active sessions
- `openspec/specs/session-log/spec.md` — updated via delta spec
