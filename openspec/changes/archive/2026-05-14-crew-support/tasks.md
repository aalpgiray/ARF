## 1. Schema

- [x] 1.1 In `prisma/schema.prisma`: remove `memberId String` and `member Member @relation(...)` from `Session` model; add `crewMemberIds String[]`
- [x] 1.2 Delete all existing sessions from the database (or reset via seed)
- [x] 1.3 Run `npx prisma migrate dev --name crew-member-ids` to apply schema change
- [x] 1.4 Update `prisma/seed.ts` to use `crewMemberIds: [memberId]` arrays in session seed data

## 2. API

- [x] 2.1 In `app/api/sessions/route.ts` POST handler: replace `memberId` with `crewMemberIds` (array) in request body destructuring, validation, and `prisma.session.create` call
- [x] 2.2 In GET handler (active sessions): include `crewMemberIds` in response and resolve member names for each ID (join with members table or fetch separately)
- [x] 2.3 Validate `crewMemberIds.length >= 1` in POST handler — return 400 if empty

## 3. Sign-out UI

- [x] 3.1 In `app/sign-out/page.tsx`: change `selectedId: string | null` state to `selectedIds: string[]`
- [x] 3.2 Update member card `onClick` to toggle member ID in/out of `selectedIds` array
- [x] 3.3 Update card `className` to use `selectedIds.includes(m.id)` for `.selected` state
- [x] 3.4 Update footer: show count of selected members (e.g., "3 crew selected"), disable next button when `selectedIds.length === 0`
- [x] 3.5 Update router push to pass crew IDs to step 2: `?member_ids=id1,id2,id3` (or equivalent)
- [x] 3.6 Update `app/sign-out/boat/page.tsx` to read `member_ids` param (array) and forward to confirm step
- [x] 3.7 Update confirm step to POST `crewMemberIds` array to API

## 4. Sign-in UI

- [x] 4.1 In `app/sign-in/page.tsx`: update session display to show crew names (replace `s.who` single name with crew name list from `crewMemberIds`)
- [x] 4.2 Update active sessions API response mapping to resolve all crew member names for display

## 5. Verification

- [x] 5.1 Sign out with 1 member — session created with `crewMemberIds: [id]`, boat goes `out`
- [x] 5.2 Sign out with 3 members — session created with all 3 IDs, boat goes `out`
- [x] 5.3 Cannot proceed past step 1 with 0 members selected
- [x] 5.4 Active session on sign-in screen shows all crew names
- [x] 5.5 Sign in marks session returned, boat goes `available`, training screen offered
