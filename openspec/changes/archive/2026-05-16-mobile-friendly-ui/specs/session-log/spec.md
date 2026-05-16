## MODIFIED Requirements

### Requirement: Member can sign out a boat
The sign-out wizard SHALL be fully operable on mobile viewports (≥320px). Step containers SHALL be full-width with 16px horizontal padding on mobile. Member selection cards, boat selection cards, and form inputs SHALL be full-width on mobile. The step indicator strip SHALL wrap gracefully at narrow widths.

#### Scenario: Successful sign-out with single member
- **WHEN** a member selects themselves and a boat, sets expected return, and submits
- **THEN** a session SHALL be created with the selected member and boat

#### Scenario: Successful sign-out with multiple crew
- **WHEN** multiple members are selected before submitting
- **THEN** the session SHALL include all selected members as crew

#### Scenario: Cannot proceed without selecting at least one member
- **WHEN** the user attempts to advance past member selection without selecting a member
- **THEN** the wizard SHALL prevent navigation and display an error

#### Scenario: Boat already out
- **WHEN** a boat has an active session
- **THEN** the boat SHALL be shown as unavailable and not selectable

#### Scenario: Back navigation preserves selections
- **WHEN** the user navigates back in the wizard
- **THEN** previously made selections SHALL be preserved

#### Scenario: Wizard step layout usable on mobile
- **WHEN** the sign-out wizard renders at ≤480px
- **THEN** each step's content SHALL be full-width with no horizontal overflow

### Requirement: Member can sign in on return
The sign-in flow SHALL be fully operable on mobile viewports (≥320px). Session cards SHALL display full-width on mobile.

#### Scenario: Successful sign-in
- **WHEN** a member selects their active session and confirms return
- **THEN** the session SHALL be marked as returned and removed from the active list

#### Scenario: Active session displays crew
- **WHEN** a session is displayed on the sign-in screen
- **THEN** each session SHALL display the boat name and the names of all crew members in `crew_member_ids`

#### Scenario: Skipping training capture
- **WHEN** a member opts to skip training data
- **THEN** the session SHALL be signed in without training data

#### Scenario: No active sessions visible
- **WHEN** there are no active sessions
- **THEN** the sign-in screen SHALL display an empty state message
