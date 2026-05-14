# Rowing Club Sign-Out System

_Started 2026-05-14 12:32 UTC_

---

## User

Design a ui for me 


## Why

Rowing clubs rely on paper logbooks or informal processes to track who is on the water — creating safety blind spots when someone doesn't return. A digital sign-out/sign-in system provides a live view of on-water activity and lays the foundation for training records, boat management, and member accountability.

## What Changes

- New web application (Next.js) deployable to Vercel, accessible via tablet kiosk at club door or any mobile browser
- Members select their name from a Google Workspace-sourced list and log departure with boat selection and expected return time
- Members sign back in on return; overdue sessions are visually flagged on the live dashboard
- Optional training data (distance, duration, session type, notes) can be recorded on return
- Member list synced from Google Workspace Directory API via service account (cached, no individual login required in v1)
- Schema includes `google_user_id` nullable field for seamless upgrade to Google SSO in v2

## Capabilities

### New Capabilities

- `session-log`: Core sign-out/sign-in flow — log departure, expected return, and return confirmation for on-water sessions
- `on-water-dashboard`: Live view of who is currently on the water, with overdue session highlighting
- `member-directory`: Google Workspace Directory API sync providing cached member list for session logging
- `training-data`: Optional training metrics captured at session end (distance, duration, type, notes)
- `boat-registry`: Managed list of club boats available for selection during session logging

### Modified Capabilities

_(none — new project)_

## Impact

- **New dependencies**: Next.js, PostgreSQL (Neon), Google Workspace Directory API (service account), Vercel hosting
- **Google Workspace**: Requires service account with domain-wide delegation to read directory
- **Data**: Single `sessions` table + `members` cache table + `boats` table
- **No auth in v1**: Public tablet access; `google_user_id` stored but not verified until v2

## Assistant

_[tool: questions_v2]_

## User

Questions answered:
- primary_surface: Tablet kiosk (landscape) at the club door
- screens: Live on-water dashboard, Sign-out flow (pick member → boat → expected return), Sign-in / return flow (with optional training data), Member picker (large roster), Boat picker / boat registry, Overdue alert state, Empty state (nobody on water)
- aesthetic: Calm, marine, watery (blues, deep teal, soft sand)
- variations: 1 — just pick one
- tablet_orientation: Decide for me
- roster_size: 70
- overdue_treatment: Decide for me
- training_capture: Optional, lightweight (one tap to skip)
- tone: Friendly and human ('You're back — nice row!')
- tweaks: Decide for me

## Assistant

_[tool: update_todos]_

_[tool: copy_starter_component]_

_[tool: copy_starter_component]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: write_file]_

I have enough to start. Here's the system I'm committing to:

**System — "ARF"**
- **Type**: Instrument Serif (display, italic) for hero numerics + screen titles; Geist (sans) for UI.
- **Palette**: warm sand `#F2EDE3` ground, deep teal `#0E3540` ink, mid teal `#1F5A6B`, soft mist `#DCD3C2`, brass `#B98646` accent, overdue clay `#B94A3B`.
- **Grid**: 1280×800 landscape kiosk. 32px outer padding, 8/16/24 spacing rhythm. Big hit targets (≥64px).
- **Overdue treatment**: medium — pulsing border + countdown chip, no full-bleed alarm.
- **Tweaks I'll wire**: palette (sand/dusk/mist), density (regular/comfy), overdue intensity, tone (friendly/neutral), boat layout (grid/list).

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: update_todos]_

_[tool: grep]_

_[tool: read_file]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Designed an **ARF** kiosk app — 9 screens laid out on a Figma-style canvas at 1280×800 (landscape kiosk), grouped into four sections: live dashboard, sign-out flow, sign-in & training, and the boat registry.

**System**: warm sand ground · deep teal ink · brass + clay accents · *Instrument Serif* italics for hero numerics, *Geist* for UI. Friendly tone throughout ("Off you go", "Who just landed?", "All quiet on the water.").

**Tweaks** (toolbar toggle): palette (Sand / Mist / Dusk), density, boat-picker grid vs list, overdue intensity (subtle / medium / loud), copy tone.

**Next steps if useful**: a tablet bezel frame for presentation, a mobile-portrait variant of the sign-out flow, or richer overdue states (countdown to alert escalation).

