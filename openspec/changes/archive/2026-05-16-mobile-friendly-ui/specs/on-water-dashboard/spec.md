## MODIFIED Requirements

### Requirement: Dashboard shows all active sessions
The dashboard SHALL display all sessions where `returned_at IS NULL` in a table, showing crew name, boat, departure time, expected return, elapsed time, and status. On viewports ≤768px, the session table SHALL be horizontally scrollable within its container, with column minimum widths reduced to fit. All safety-critical columns (crew, boat, overdue status) SHALL remain visible and not be hidden on any viewport.

#### Scenario: Active sessions displayed
- **WHEN** there are active sessions
- **THEN** the dashboard SHALL display each session in a table row with all required columns

#### Scenario: Empty state
- **WHEN** there are no active sessions
- **THEN** the dashboard SHALL display an empty state with friendly copy and a prompt to sign out a boat

#### Scenario: Session table scrollable on mobile
- **WHEN** the session table renders at ≤768px and content exceeds viewport width
- **THEN** the table container SHALL allow horizontal scroll without causing page-level overflow

### Requirement: Dashboard summary tiles show aggregate counts
The dashboard SHALL display summary tiles for: crews currently on water, overdue count, and returned today count. On mobile (≤480px), tiles SHALL stack in a single column. On tablet (≤768px), tiles SHALL display in a 2-column layout.

#### Scenario: Tile values reflect live data
- **WHEN** the dashboard renders with active session data
- **THEN** each tile SHALL show the correct aggregate value

#### Scenario: Tiles single-column on mobile
- **WHEN** the tile row renders at ≤480px
- **THEN** tiles SHALL stack vertically (1 column)

#### Scenario: Tiles two-column on tablet
- **WHEN** the tile row renders at 481px–768px
- **THEN** tiles SHALL display in 2 columns
