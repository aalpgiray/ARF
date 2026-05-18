# Session Log

## Purpose

Records each boat departure and return. A session begins when a member signs out a boat and closes when they sign back in. Session records are the source of truth for on-water status, overdue detection, and training data capture.

## Requirements

### Requirement: Member can sign out a boat
One or more members SHALL be able to log a departure by selecting their names (multi-select), a boat, and an expected return time across a 3-step flow. The session SHALL be created with `departed_at` set to the current server timestamp and `crew_member_ids` containing all selected member IDs. The sign-out wizard SHALL be fully operable on mobile viewports (≥320px). Step containers SHALL be full-width with 16px horizontal padding on mobile. Member selection cards, boat selection cards, and form inputs SHALL be full-width on mobile. The step indicator strip SHALL wrap gracefully at narrow widths.

#### Scenario: Successful sign-out with single member
- **WHEN** a member completes all 3 steps (members → boat → return time) with one member selected and confirms
- **THEN** a session record is created with `crew_member_ids` containing one ID, `boat_id`, `departed_at` (now), `expected_return`, and `returned_at` as NULL
- **THEN** the boat's state is updated to `out`
- **THEN** the user is redirected to the dashboard

#### Scenario: Successful sign-out with multiple crew
- **WHEN** multiple members are selected in step 1 and the flow is completed
- **THEN** a session record is created with `crew_member_ids` containing all selected member IDs
- **THEN** the boat's state is updated to `out`
- **THEN** the user is redirected to the dashboard

#### Scenario: Cannot proceed without selecting at least one member
- **WHEN** no members are selected in step 1
- **THEN** the "Choose a boat" button SHALL be disabled

#### Scenario: Boat already out
- **WHEN** a member selects a boat whose state is `out`
- **THEN** the boat SHALL be shown as unavailable and not selectable

#### Scenario: Back navigation preserves selections
- **WHEN** a member navigates back from step 2 or 3
- **THEN** previously selected values SHALL remain pre-selected on return

#### Scenario: Wizard step layout usable on mobile
- **WHEN** the sign-out wizard renders at ≤480px
- **THEN** each step's content SHALL be full-width with no horizontal overflow

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

### Requirement: Expected return time uses duration presets
The return time step SHALL offer preset duration chips (30m, 45m, 1h, 1h 15m, 1h 30m, 2h, Custom) that compute the expected return time from the current time.

#### Scenario: Preset duration selected
- **WHEN** a member selects a preset chip
- **THEN** the computed expected return time SHALL be displayed prominently
- **THEN** the selected chip SHALL be visually highlighted

#### Scenario: Custom duration
- **WHEN** a member taps "Custom"
- **THEN** a manual time input SHALL be presented

### Requirement: Session data is persisted
All session fields SHALL be stored durably in PostgreSQL. The schema SHALL include `google_user_id` as a nullable field for future SSO linkage.

#### Scenario: Session record structure
- **WHEN** a session is created
- **THEN** it SHALL contain: `id`, `crew_member_ids` (uuid array, minimum 1 element), `boat_id`, `departed_at`, `expected_return`, `returned_at` (nullable), `google_user_id` (nullable), `notes` (nullable), `created_at`
