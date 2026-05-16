## Context

ARF's UI is built with custom CSS design tokens in `globals.css` — no Tailwind responsive utilities, no existing `@media` queries. All layout uses fixed pixel padding (e.g., `32px` gutters) and multi-column grids sized for ≥1200px screens. There is a `.comfy` density variant that widens further. The sign-in/sign-out flows, dashboard, and admin pages all assume wide viewports.

Primary mobile use case: dockside check-in/check-out on phones (320–430px viewport). Secondary: coaches reviewing who's on the water from the dashboard.

## Goals / Non-Goals

**Goals:**
- Usable on 375px–430px phones (primary mobile widths)
- Usable on 768px–1024px tablets
- Touch targets ≥44px everywhere
- No layout overflow or horizontal scroll on page-level containers
- Chrome header readable and functional on all sizes
- Core flows (sign-in, sign-out, dashboard) fully usable on mobile
- Admin pages functional on tablet; acceptable on phone

**Non-Goals:**
- Mobile-first rewrite — desktop layout unchanged
- Native-app-style bottom nav bar
- Redesigning admin CSV import wizard for mobile (functional, not optimised)
- `.comfy` density variant on mobile (stays desktop-only)

## Decisions

### 1. CSS-only responsive — no component restructuring

All responsive behaviour added as `@media` blocks appended to `globals.css`. No changes to React component structure or JSX. Components already use semantic class names (`arf-chrome`, `tile-row`, `sess-grid`, etc.) that CSS can target.

**Alternative considered**: Tailwind responsive utilities in JSX. Rejected — the codebase uses custom CSS exclusively; mixing patterns would be inconsistent and require touching every component file.

### 2. Two breakpoints: 768px (tablet) and 480px (mobile)

- `@media (max-width: 768px)`: tablet adjustments — reduce padding, 2-col grids
- `@media (max-width: 480px)`: phone adjustments — single-col, stacked footer, collapsed Chrome meta

**Alternative considered**: Three breakpoints (1024px/768px/480px). Rejected — desktop layout holds fine at 1024px; adding a mid-point creates maintenance overhead for marginal gain.

### 3. Chrome: hide non-essential meta on mobile, keep brand + admin gear

`.arf-meta` items "Live", date, tide info hidden at ≤480px — only the live dot indicator and gear icon retained. Brand stays visible. This preserves the most important actions in the minimal space.

### 4. Footer: vertical stack on mobile

`.arf-foot` switches to `flex-direction: column` at ≤480px with full-width primary button on top. The utility link row (boat registry chip) goes below. This is the highest-priority mobile interaction surface.

### 5. Session table: horizontal scroll container

`.sess-grid` gets `overflow-x: auto` at ≤768px rather than collapsing columns. Session data is tabular; hiding columns loses safety-critical info (member name, overdue status). Horizontal scroll is the lesser evil. Column min-widths reduced to 80–100px so the table fits at ~600px.

## Risks / Trade-offs

- **`.comfy` variant interaction** → `.comfy` overrides add larger padding; at mobile widths the `.comfy` class should not be active (it's a display preference for large screens). Mitigation: wrap `.comfy` overrides in `@media (min-width: 769px)` guard.
- **Admin CSV import wizard on phone** → Step strip and multi-column form may still overflow. Mitigation: wizard steps wrap at mobile, form inputs go full-width. Not fully optimised but not broken.
- **Footer `margin-left: auto` utility cluster** → Inline style on the boat-registry span in `page.tsx` interferes with stacked layout. Mitigation: add `.arf-foot-end` utility class and switch the inline style to it in the component.

## Migration Plan

1. Add `@media` blocks to end of `globals.css` — no existing rules modified
2. Add `.arf-foot-end` utility class for the footer end-cluster
3. Update `app/page.tsx` footer to use `.arf-foot-end` instead of `style={{ marginLeft: 'auto' }}`
4. No database, API, or env changes — pure frontend CSS + one JSX tweak
5. Rollback: revert `globals.css` changes; no other files affected except `app/page.tsx`

## Open Questions

- Should `.comfy` density mode be suppressed entirely at ≤768px, or just let it be? (Default: suppress via `@media` guard — no behaviour change for current users)
