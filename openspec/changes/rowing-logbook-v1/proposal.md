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
