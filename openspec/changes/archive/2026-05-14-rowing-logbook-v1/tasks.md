## 1. Project Setup

- [x] 1.1 Initialise Next.js 16.2.6 app with App Router (`npx create-next-app@16.2.6`)
- [x] 1.2 Install dependencies: `prisma@7.8.0`, `@prisma/client`, `@prisma/adapter-neon`, `tailwindcss@4.3.0`, `@radix-ui/react-select@2.2.6`, `@radix-ui/react-dialog`, `@radix-ui/react-tooltip`, `googleapis`
- [x] 1.3 Configure Tailwind CSS v4 with PostCSS
- [x] 1.4 Set up `next/font` to self-host Instrument Serif, Geist, and Geist Mono
- [x] 1.5 Create global CSS file with design tokens (`--sand`, `--ink`, `--clay`, `--brass`, `--ok`, `--water`, `--paper`, palette variants, radii, font vars) matching `design-reference/styles.css`
- [x] 1.6 Configure environment variables: `DATABASE_URL` in `.env.local` and Vercel (GOOGLE_SERVICE_ACCOUNT_JSON / CLUB_DOMAIN deferred to v2)
- [x] 1.7 Provision Neon PostgreSQL database and add `DATABASE_URL` to `.env.local`

## 2. Database Schema (Prisma)

- [x] 2.1 Initialise Prisma with Neon adapter (`prisma init`)
- [x] 2.2 Define `Member` model: `id`, `googleUserId` (unique), `displayName`, `email`, `squad` (nullable), `syncedAt`, `createdAt`
- [x] 2.3 Define `Boat` model: `id`, `name`, `category`, `yearBuilt` (nullable), `weightKg` (nullable), `state` (enum: AVAILABLE, MAINTENANCE), `rackLocation` (nullable), `createdAt`
- [x] 2.4 Define `Session` model: `id`, `memberId` (FK), `boatId` (FK), `departedAt`, `expectedReturn`, `returnedAt` (nullable), `googleUserId` (nullable), `distanceMeters` (nullable), `sessionType` (nullable), `notes` (nullable), `createdAt`
- [x] 2.5 Run `prisma migrate dev --name init` and generate client
- [x] 2.6 Create seed script with sample boats matching `design-reference/screens.jsx` BOATS array

## 3. Member Management (v1: Manual Seed)

- [x] 3.1 Create seed script with 20 dummy members in `prisma/seed.ts`
- [x] 3.2 Run `npm run db:seed` and verify members in DB
- [x] 3.3 ~~Google Workspace sync~~ — deferred to v2 (OAuth admin consent flow)

## 4. Shared Layout & Chrome Component

- [x] 4.1 Create root layout (`app/layout.tsx`) applying font variables and base `arf` CSS class to `<body>`
- [x] 4.2 Build `Chrome` component: ARF brand mark SVG + italic name + club name + live dot + date/time + tide placeholder, matching `design-reference/screens.jsx` Chrome component
- [x] 4.3 Build `Footer` component: action buttons in a borderless bar with gradient backing, matching `.arf-foot` styles
- [x] 4.4 Implement palette/density switcher: read from `localStorage`, apply `arf-dusk` / `arf-mist` / `comfy` class on `<html>`

## 5. Dashboard

- [x] 5.1 Create `app/page.tsx` as the dashboard server component; query active sessions (`returnedAt IS NULL`) and today's returned sessions
- [x] 5.2 Build `SummaryTiles` component: featured "on water" tile + overdue count tile + returned today tile, matching `.tile-row` / `.tile` / `.tile.featured` styles
- [x] 5.3 Build `SessionTable` component: header row + session rows with avatar, crew name, boat, out-time, expected return, elapsed, status chip; matching `.sess-grid` / `.sess-head` / `.sess-row` styles
- [x] 5.4 Implement overdue styling: `overdue` class on row, clay gradient, pulsing border animation (`pulseBorder` keyframe); honour `overdueIntensity` setting (subtle/medium/loud)
- [x] 5.5 Implement loud overdue alert bar above session table when `overdueIntensity=loud`
- [x] 5.6 Build `EmptyState` component matching `.empty` styles with friendly/neutral tone variants
- [x] 5.7 Add 30-second client-side polling via `useEffect` + `router.refresh()`

## 6. Sign-Out Flow

- [x] 6.1 Create `app/sign-out/page.tsx` (step 1: member picker) as a client component
- [x] 6.2 Build `MemberGrid` component: 6-column grid of member cards with avatar initials, name, squad; selected state styling; matching `.member-grid` / `.member` styles
- [x] 6.3 Add search input with live filter and alpha letter tabs (A–Z + All) matching `.search-row` / `.search` / `.alpha` styles
- [x] 6.4 Create `app/sign-out/boat/page.tsx` (step 2: boat picker); read `?member_id` from URL search params
- [x] 6.5 Build `BoatGrid` component: 4-column grid of boat cards with name (serif italic), category, year, weight; out/maintenance boats dimmed and unselectable; matching `.boat-grid` / `.boat` styles
- [x] 6.6 Build `BoatList` component: list layout variant matching `.boat-list` / `.boat-row` styles
- [x] 6.7 Add category filter chips and grid/list toggle on boat picker
- [x] 6.8 Create `app/sign-out/return/page.tsx` (step 3: return time); read `?member_id&boat_id` from URL params
- [x] 6.9 Build `DurationPicker` component: large display + preset chips (30m, 45m, 1h, 1h 15m, 1h 30m, 2h, Custom) + computed return time card; matching `.dial` / `.return-card` / `.duration-chips` styles
- [x] 6.10 Build `StepIndicator` component: Member → Boat → Return progress display matching `.steps` styles
- [x] 6.11 Create `POST /api/sessions` server action that creates a session record and updates boat state
- [x] 6.12 Wire confirm button to server action; redirect to dashboard on success

## 7. Sign-In Flow

- [x] 7.1 Create `app/sign-in/page.tsx`; query active sessions (`returnedAt IS NULL`) ordered by `departedAt` desc
- [x] 7.2 Build `ActiveSessionList` component: featured first row + remaining rows; each row shows crew, boat, out-time, elapsed, expected; matching `.signin-grid` / `.signin-row` / `.signin-row.featured` styles
- [x] 7.3 Create `POST /api/sessions/[id]/return` server action that sets `returnedAt` to now and updates boat state to AVAILABLE
- [x] 7.4 Wire "I'm back" button to server action; redirect to `/sign-in/training?session_id=` on success

## 8. Training Capture

- [x] 8.1 Create `app/sign-in/training/page.tsx`; read `?session_id` from URL params
- [x] 8.2 Build `DistancePicker` component: large value display + preset chips (4km, 6km, 8km, 10km, 12km, Custom) matching `.duration-chips` pattern
- [x] 8.3 Build `SessionTypePicker` component: segmented button group (Steady, UT2, UT1, AT, Intervals, Race, Outing) matching `.seg` styles
- [x] 8.4 Add notes textarea matching `.training textarea` styles
- [x] 8.5 Build training summary panel (dark card with duration, distance, pace, strokes) matching `.training .summary` styles
- [x] 8.6 Create `PATCH /api/sessions/[id]` server action that writes `distanceMeters`, `sessionType`, `notes` to session
- [x] 8.7 Wire "Save row" to server action and "Skip" to close session without training data; both redirect to dashboard

## 9. Boat Registry Page

- [x] 9.1 Create `app/boats/page.tsx` as server component; query all boats with active session join to derive live state
- [x] 9.2 Build `BoatRegistryGrid` component: 4-column grid of boat cards with state chip, name, category, year, weight; matching `.registry` / `.registry .b` styles
- [x] 9.3 Add state filter chips (All / Available / On water / Maintenance) as client-side filter
- [x] 9.4 Add "Mark for maintenance" and "Add a boat" CTAs in footer (UI only for v1, no admin form yet)

## 10. Vercel Deployment

- [x] 10.1 Push repo to GitHub and link to Vercel project
- [x] 10.2 Add DATABASE_URL to Vercel environment variables
- [x] 10.3 Configure `vercel.json` with cron for member sync
- [ ] 10.4 Deploy preview build and verify all pages on a tablet browser at 1280×800
- [x] 10.5 Verify member list populates on deployed app (`/sign-out` shows seeded members)
- [x] 10.6 Promote to production
