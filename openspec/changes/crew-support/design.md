## Context

The current session model has a 1:1 relationship between a session and a member (`member_id FK`). Crew boats carry 2–8 rowers who share a single boat trip. Safety tracking requires knowing all members on the water, not just one. Training data (distance, session type, notes) is boat-level — identical for all crew — so no per-member data structure is needed.

Current schema:
```
Session
  memberId    String   (FK → Member)
  boatId      String
  departedAt  DateTime
  expectedReturn DateTime
  returnedAt  DateTime?
  distanceMeters Int?
  sessionType String?
  notes       String?
```

## Goals / Non-Goals

**Goals:**
- Track all crew members per session as a uuid array
- Multi-select member picker in sign-out step 1
- Display full crew on active sessions in sign-in screen
- Clean schema change (no migration — dev data deleted)

**Non-Goals:**
- Per-member training data (boat-level only, as decided)
- Designating a "captain" or primary member
- Tracking who physically operated the kiosk

## Decisions

**`crewMemberIds String[]` array column over junction table**
A `session_crew` join table would be normalized but adds a join to every session query. Since training data is boat-level and no per-member session attributes exist, the array column is sufficient. PostgreSQL `@>` operator supports "is member X currently out?" queries cleanly. Neon (Postgres) supports array columns natively via Prisma's `String[]` type.

**Delete existing sessions, no migration**
All current session data is seed/dev data. Dropping `memberId` and adding `crewMemberIds` in a single migration is clean. No backfill logic needed.

**Multi-select UI: toggle on tap, minimum 1 to proceed**
Same member card grid as today. Tapping a card toggles selection (add/remove from array). The "Choose a boat" button enables only when `selectedIds.length >= 1`. Selected cards show a checked state. Existing `.member.selected` CSS class reused.

**Sign-in: any person can sign a boat back in**
Active sessions show boat name + crew list. One tap marks the session returned (`returnedAt = now`). No per-member sign-in required — crew is tracked as a unit.

## Risks / Trade-offs

- [Risk] `crewMemberIds` allows empty array → Mitigation: API validates `crewMemberIds.length >= 1` on POST
- [Risk] UI allows deselecting all members before submit → Mitigation: Next button disabled when array is empty
- [Risk] Array column harder to query across members in raw SQL → Acceptable: all queries go through Prisma/API layer

## Migration Plan

1. Update Prisma schema (remove `memberId`, add `crewMemberIds String[]`)
2. Delete all existing sessions (`DELETE FROM sessions` or via seed reset)
3. Run `prisma migrate dev`
4. Update seed data to use `crewMemberIds`
5. Update API routes and UI
6. No rollback complexity — dev environment only
