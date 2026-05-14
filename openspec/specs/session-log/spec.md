# Session Log

## Purpose

Records each boat departure and return. A session begins when a member signs out a boat and closes when they sign back in. Session records are the source of truth for on-water status, overdue detection, and training data capture.

## Requirements

### Requirement: Member can sign out a boat
A member SHALL be able to log a departure by selecting their name, a boat, and an expected return time across a 3-step flow. The session SHALL be created with `departed_at` set to the current server timestamp.

#### Scenario: Successful sign-out
- **WHEN** a member completes all 3 steps (member → boat → return time) and confirms
- **THEN** a session record is created with `member_id`, `boat_id`, `departed_at` (now), `expected_return`, and `returned_at` as NULL
- **THEN** the boat's state is updated to `out`
- **THEN** the user is redirected to the dashboard

#### Scenario: Boat already out
- **WHEN** a member selects a boat whose state is `out`
- **THEN** the boat SHALL be shown as unavailable and not selectable

#### Scenario: Back navigation preserves selections
- **WHEN** a member navigates back from step 2 or 3
- **THEN** previously selected values SHALL remain pre-selected on return

### Requirement: Member can sign in on return
A member SHALL be able to log their return by selecting their active session from a list. The session SHALL be updated with `returned_at` set to the current server timestamp.

#### Scenario: Successful sign-in
- **WHEN** a member selects their active session and confirms return
- **THEN** the session's `returned_at` is set to now
- **THEN** the boat's state is updated to `available`
- **THEN** the user is offered the optional training capture screen

#### Scenario: Skipping training capture
- **WHEN** a member taps "Skip" on the training capture screen
- **THEN** the session is closed without training data and the user is redirected to the dashboard

#### Scenario: No active sessions visible
- **WHEN** no sessions with `returned_at IS NULL` exist
- **THEN** the sign-in screen SHALL display an empty state message

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
- **THEN** it SHALL contain: `id`, `member_id`, `boat_id`, `departed_at`, `expected_return`, `returned_at` (nullable), `google_user_id` (nullable), `notes` (nullable), `created_at`
