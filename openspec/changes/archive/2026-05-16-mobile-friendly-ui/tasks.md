## 1. Breakpoints & Base Layout

- [x] 1.1 Add `@media (max-width: 768px)` block to `globals.css` — reduce `.arf-chrome` padding to `16px 20px`, `.arf-foot` padding to `14px 16px`, `.screen-h` padding to `20px 16px`
- [x] 1.2 Add `@media (max-width: 480px)` block to `globals.css` — further reduce paddings to `12px 16px`, `h1` font-size to `36px`
- [x] 1.3 Guard `.comfy` density overrides with `@media (min-width: 769px)` so they don't apply on mobile/tablet

## 2. Chrome Header

- [x] 2.1 In the `@media (max-width: 480px)` block, add CSS to hide `.arf-meta` children except `.gear` and the live dot span (use `:not` selector or hide specific children by nth/class)
- [x] 2.2 Verify Chrome renders correctly on mobile with brand + gear icon only — no overflow

## 3. Footer Action Bar

- [x] 3.1 In `@media (max-width: 480px)`, set `.arf-foot` to `flex-direction: column; align-items: stretch; gap: 10px`
- [x] 3.2 Add `.arf-foot-end` utility class to `globals.css` with `margin-left: auto` (desktop) and `margin-left: 0; width: 100%` override in `@media (max-width: 480px)`
- [x] 3.3 Replace `style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}` inline style on the footer utility cluster in `app/page.tsx` with `className="arf-foot-end"` (preserve `display: flex; gap: 12px; align-items: center` in the class)

## 4. Dashboard Tiles

- [x] 4.1 In `@media (max-width: 768px)`, set `.tile-row` to `grid-template-columns: repeat(2, 1fr); padding: 0 16px`
- [x] 4.2 In `@media (max-width: 480px)`, set `.tile-row` to `grid-template-columns: 1fr; padding: 0 16px`

## 5. Session Table

- [x] 5.1 In `@media (max-width: 768px)`, set `.sess-grid` to `overflow-x: auto; margin: 12px 16px 0` and the inner table to `min-width: 560px`
- [x] 5.2 Verify all session table columns (crew, boat, departure, expected return, status) remain visible and table scrolls horizontally rather than wrapping

## 6. Member & Boat Grids

- [x] 6.1 In `@media (max-width: 768px)`, set `.member-grid` to `grid-template-columns: repeat(2, 1fr); padding: 0 16px`
- [x] 6.2 In `@media (max-width: 480px)`, set `.member-grid` to `grid-template-columns: 1fr; padding: 0 16px`
- [x] 6.3 In `@media (max-width: 768px)`, set `.boat-grid` to `grid-template-columns: repeat(2, 1fr); padding: 0 16px`
- [x] 6.4 In `@media (max-width: 480px)`, set `.boat-grid` to `grid-template-columns: 1fr; padding: 0 16px`

## 7. Sign-in / Sign-out Wizard

- [x] 7.1 In `@media (max-width: 480px)`, set wizard step containers (`.sign-step`, `.step-body`, or equivalent wrappers) to `padding: 16px; width: 100%`
- [x] 7.2 In `@media (max-width: 480px)`, set member and boat selection cards to `width: 100%; min-width: unset`
- [x] 7.3 In `@media (max-width: 480px)`, ensure `.wizard-steps` wraps gracefully (`flex-wrap: wrap; gap: 8px`)

## 8. Touch Target Sizing

- [x] 8.1 Verify `.btn` computed height ≥44px at all sizes (current padding `18px 26px` + 16px font = ~52px — confirm no regression)
- [x] 8.2 In `@media (max-width: 480px)`, ensure `.btn-lg` stays at `min-height: 52px` and expands to full width when inside `.arf-foot` (covered by footer stack rule)
- [x] 8.3 Verify `.gear` icon link in Chrome has `min-width: 44px; min-height: 44px; display: flex; align-items: center; justify-content: center` — add if missing

## 9. Screen-h Header Section

- [x] 9.1 In `@media (max-width: 768px)`, set `.screen-h` to `flex-direction: column; align-items: flex-start; gap: 12px`
- [x] 9.2 In `@media (max-width: 480px)`, set `.screen-h h1` font-size to `36px` and reduce eyebrow font-size to `10px`
