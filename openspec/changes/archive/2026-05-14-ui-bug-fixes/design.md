## Context

Three bugs identified via Vercel toolbar comments on the `/sign-out` and `/boats` pages. All are CSS or inline-style issues — no logic, data, or API changes required.

## Goals / Non-Goals

**Goals:**
- Fix alphabet nav overflow on tablet
- Anchor footer to bottom of screen regardless of content height
- Restore active chip visibility on `/boats`

**Non-Goals:**
- Responsive layout overhaul
- Component refactoring
- Any change to data model or API

## Decisions

**Alpha overflow → `flex-wrap: wrap`**
`.alpha` is a flex row of 27 buttons. On narrower viewports it overflows `.search-row`. Adding `flex-wrap: wrap` lets excess buttons wrap to a second line rather than clip. Alternative (`overflow-x: auto`) would scroll, which is worse UX on a touch kiosk.

**Footer at bottom → `flex: 1 1 0; overflow-y: auto` on `.member-grid`**
`.arf-body` is a flex column. `.arf-foot` has `flex: 0 0 auto` but nothing above it expands to fill remaining space, so footer floats. Giving `.member-grid` `flex: 1 1 0; overflow-y: auto` makes it absorb all available height and scroll its content, pushing the footer to the bottom.

**Chip visibility → remove inline style override**
`boats/page.tsx` applies `style={{ background: 'none', border: 'none' }}` to all chip buttons, including the active one. This overrides `.chip.solid { background: var(--ink) }` making the selected filter invisible. Removing those inline properties and relying on the CSS classes is the correct fix. `cursor: pointer` stays as it has no CSS equivalent in this ruleset.

## Risks / Trade-offs

- `flex: 1 1 0` on `.member-grid` could affect other pages that reuse that class — verify only `/sign-out` uses it.
- Wrapping alpha on small viewports increases vertical height of the search row — acceptable trade-off vs. overflow.
