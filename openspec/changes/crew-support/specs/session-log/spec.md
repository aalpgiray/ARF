## MODIFIED Requirements

### Requirement: Member can sign out a boat
One or more members SHALL be able to log a departure by selecting their names (multi-select), a boat, and an expected return time across a 3-step flow. The session SHALL be created with `departed_at` set to the current server timestamp and `crew_member_ids` containing all selected member IDs.

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

### Requirement: Member can sign in on return
Any person at the kiosk SHALL be able to log the return of a boat by selecting its active session from a list. The session SHALL be updated with `returned_at` set to the current server timestamp. The full crew is marked returned as a unit.

#### Scenario: Successful sign-in
- **WHEN** a person selects an active session and confirms return
- **THEN** the session's `returned_at` is set to now
- **THEN** the boat's state is updated to `available`
- **THEN** the user is offered the optional training capture screen

#### Scenario: Active session displays crew
- **WHEN** the sign-in screen lists active sessions
- **THEN** each session SHALL display the boat name and the names of all crew members in `crew_member_ids`

#### Scenario: Skipping training capture
- **WHEN** a member taps "Skip" on the training capture screen
- **THEN** the session is closed without training data and the user is redirected to the dashboard

#### Scenario: No active sessions visible
- **WHEN** no sessions with `returned_at IS NULL` exist
- **THEN** the sign-in screen SHALL display an empty state message

### Requirement: Session data is persisted
All session fields SHALL be stored durably in PostgreSQL. The schema SHALL include `google_user_id` as a nullable field for future SSO linkage.

#### Scenario: Session record structure
- **WHEN** a session is created
- **THEN** it SHALL contain: `id`, `crew_member_ids` (uuid array, minimum 1 element), `boat_id`, `departed_at`, `expected_return`, `returned_at` (nullable), `google_user_id` (nullable), `notes` (nullable), `created_at`

## REMOVED Requirements

### Requirement: (implicit) Single member per session
**Reason**: Replaced by crew support — `member_id` singular FK removed from session record in favour of `crew_member_ids uuid[]`.
**Migration**: Existing sessions deleted (dev data). No production data affected.
