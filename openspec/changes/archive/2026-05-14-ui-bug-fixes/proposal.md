## Why

Three visual bugs reported via Vercel toolbar on the live deployment are degrading usability on the sign-out kiosk and boat registry screens. These are CSS-only regressions with no data model impact.

## What Changes

- `.alpha` alphabet nav wraps instead of overflowing on tablet viewports
- `.member-grid` fills available vertical space so `.arf-foot` footer is anchored to the bottom of the screen
- Active filter chip on `/boats` regains its dark background (inline style override removed)

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

_None. These are presentation-layer fixes with no requirement changes._

## Impact

- `app/globals.css` — `.alpha` and `.member-grid` rules
- `app/boats/page.tsx` — remove `background: none; border: none` from chip inline style
