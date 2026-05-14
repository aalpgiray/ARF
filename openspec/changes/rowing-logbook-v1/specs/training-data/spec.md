## ADDED Requirements

### Requirement: Training capture is offered after sign-in
After a member signs in (logs return), the system SHALL present an optional training capture screen before redirecting to the dashboard.

#### Scenario: Training screen presented
- **WHEN** a member successfully signs in
- **THEN** the training capture screen SHALL be displayed with a visible "Skip" option

#### Scenario: Member skips training capture
- **WHEN** a member taps "Skip — just sign me in"
- **THEN** the session is closed with no training fields populated and the user is redirected to the dashboard

### Requirement: Member can log distance rowed
The training screen SHALL offer distance presets (4km, 6km, 8km, 10km, 12km, Custom) and SHALL display the selected value prominently.

#### Scenario: Distance preset selected
- **WHEN** a member selects a distance preset chip
- **THEN** the selected distance SHALL be highlighted and shown in the large display field

#### Scenario: Custom distance
- **WHEN** a member taps "Custom"
- **THEN** a numeric input SHALL accept a distance in kilometres

### Requirement: Member can log session type
The training screen SHALL offer session type options: Steady, UT2, UT1, AT, Intervals, Race, Outing.

#### Scenario: Session type selected
- **WHEN** a member taps a session type button
- **THEN** it SHALL be visually highlighted as the active selection

### Requirement: Member can add free-text notes
The training screen SHALL include a textarea for optional session notes.

#### Scenario: Notes entered
- **WHEN** a member types in the notes field
- **THEN** the text SHALL be saved to the session's `notes` field on submission

### Requirement: Training data is saved to the session record
On saving, training fields SHALL be written to the session record. Duration is computed from `departed_at` to `returned_at` automatically; distance and session type come from user input.

#### Scenario: Training data persisted
- **WHEN** a member taps "Save row"
- **THEN** `distance_meters`, `session_type`, and `notes` SHALL be written to the session record
- **THEN** the user SHALL be redirected to the dashboard
