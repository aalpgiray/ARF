## MODIFIED Requirements

### Requirement: Member can sign in on return
Any person at the kiosk SHALL be able to log the return of a boat by tapping "I'm back" on its session row directly on the dashboard. The session SHALL be updated with `returned_at` set to the current server timestamp. The full crew is marked returned as a unit. There is no longer a separate sign-in list page.

#### Scenario: Successful sign-in via inline button
- **WHEN** a person taps "I'm back" on an active session row on the dashboard
- **THEN** the session's `returned_at` is set to now
- **THEN** the boat's state is updated to `available`
- **THEN** the user is offered the optional training capture screen

#### Scenario: Skipping training capture
- **WHEN** a member taps "Skip" on the training capture screen
- **THEN** the session is closed without training data and the user is redirected to the dashboard

#### Scenario: No active sessions — no return buttons shown
- **WHEN** no sessions with `returned_at IS NULL` exist
- **THEN** the dashboard displays the empty state and no return buttons are rendered

## REMOVED Requirements

### Requirement: Active session displays crew (on sign-in list page)
**Reason**: The dedicated `/sign-in` sign-in list page is eliminated. Session crew is already visible on each dashboard row.
**Migration**: No migration needed — dashboard `SessionTable` rows already display crew names.
