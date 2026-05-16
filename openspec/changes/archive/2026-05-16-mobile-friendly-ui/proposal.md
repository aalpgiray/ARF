## Why

ARF is used dockside and on-the-go — coaches and members reach for their phones to sign boats in/out and check who's on the water. The current UI has no responsive breakpoints: it renders at desktop proportions on mobile, making tap targets too small and layouts overflow. Fixing this unlocks real-world utility for the primary use case.

## What Changes

- Add responsive breakpoints to `globals.css` (≤768px mobile, ≤1024px tablet)
- Collapse Chrome header on mobile: stack brand + nav, hide non-essential meta (date, tide info)
- Responsive dashboard: single-column summary tiles, full-width session table with horizontal scroll
- Responsive sign-in / sign-out wizard: full-width steps, larger tap targets
- Responsive admin pages: stacked member/boat grids, full-width tables
- Touch-friendly button sizing (min 44px height) throughout
- Responsive footer action bar: stack buttons vertically on mobile

## Capabilities

### New Capabilities

- `responsive-layout`: Cross-breakpoint layout system — Chrome, body, footer, grids, and page-level containers adapt from mobile (≥320px) through tablet to desktop

### Modified Capabilities

- `on-water-dashboard`: Summary tiles and session table layout changes for narrow viewports
- `session-log`: Sign-in and sign-out wizard step layout adjusts to mobile
- `member-management`: Member grid and admin table go single-column on mobile
- `boat-management`: Boat grid goes single-column on mobile

## Impact

- `app/globals.css`: Primary change surface — all responsive CSS lives here
- `components/Chrome.tsx`, `components/AdminChrome.tsx`: Header layout logic
- `components/Footer.tsx`: Stacked button layout on mobile
- `components/dashboard/SummaryTiles.tsx`, `SessionTable.tsx`: Grid/table adjustments
- No API changes, no new dependencies
