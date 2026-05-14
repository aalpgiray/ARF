# On-Water Dashboard

## Purpose

The primary kiosk screen showing all boats currently on the water. Provides live visibility into active sessions, flags overdue crews, and serves as the navigation hub for sign-out and sign-in flows.

## Requirements

### Requirement: Dashboard shows all active sessions
The dashboard SHALL display all sessions where `returned_at IS NULL` in a table, showing crew name, boat, departure time, expected return, elapsed time, and status.

#### Scenario: Active sessions displayed
- **WHEN** one or more sessions have `returned_at IS NULL`
- **THEN** each session SHALL appear as a row with crew, boat, out-time, expected return, elapsed duration, and status chip

#### Scenario: Empty state
- **WHEN** no sessions have `returned_at IS NULL`
- **THEN** the dashboard SHALL display an empty state with friendly copy and a prompt to sign out a boat

### Requirement: Dashboard auto-refreshes every 30 seconds
The dashboard SHALL poll for updated session data every 30 seconds without a full page reload.

#### Scenario: Auto-refresh fires
- **WHEN** 30 seconds elapse since last data load
- **THEN** session list SHALL update to reflect any new sign-outs or sign-ins

### Requirement: Overdue sessions are visually flagged
A session is overdue when `returned_at IS NULL AND expected_return < NOW()`. Overdue sessions SHALL be visually distinguished from on-time sessions.

#### Scenario: Overdue session — medium intensity (default)
- **WHEN** a session is overdue
- **THEN** the row SHALL show a pulsing left border in clay red and an overdue chip displaying minutes late

#### Scenario: Overdue session — loud intensity
- **WHEN** overdue intensity is set to `loud`
- **THEN** a full-width alert bar SHALL appear above the session list naming the overdue crew

#### Scenario: Overdue session — subtle intensity
- **WHEN** overdue intensity is set to `subtle`
- **THEN** the row SHALL be tinted but SHALL NOT pulse

### Requirement: Dashboard summary tiles show aggregate counts
The top of the dashboard SHALL show tiles for: currently on water (rower count + boat count), overdue count, and returned today count.

#### Scenario: Tile values reflect live data
- **WHEN** sessions are active or returned
- **THEN** each tile SHALL reflect the current count from the database

### Requirement: Dashboard provides navigation to sign-out and sign-in flows
The footer SHALL contain a primary "Sign out a boat" CTA and a secondary "I'm back — sign in" CTA.

#### Scenario: CTAs present and functional
- **WHEN** a user taps "Sign out a boat"
- **THEN** they are navigated to step 1 of the sign-out flow
- **WHEN** a user taps "I'm back — sign in"
- **THEN** they are navigated to the sign-in screen
