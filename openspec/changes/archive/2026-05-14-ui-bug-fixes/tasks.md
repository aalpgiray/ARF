## 1. CSS Fixes (globals.css)

- [x] 1.1 Add `flex-wrap: wrap` to `.alpha` rule to prevent overflow on tablet
- [x] 1.2 Add `flex: 1 1 0; overflow-y: auto` to `.member-grid` rule so footer anchors to bottom

## 2. Boats Page Fix

- [x] 2.1 Remove `background: 'none'` and `border: 'none'` from chip button inline style in `app/boats/page.tsx` — keep only `cursor: 'pointer'`

## 3. Verification

- [x] 3.1 Confirm `.alpha` wraps on viewport widths below 1200px without horizontal overflow
- [x] 3.2 Confirm footer sits at bottom of screen on `/sign-out` when fewer than ~12 members visible
- [x] 3.3 Confirm active filter chip on `/boats` shows dark background when selected
