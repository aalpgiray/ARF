## ADDED Requirements

### Requirement: Boat registry displays all club boats
The registry page SHALL list all boats with their name, category (1x, 2x, 2-, 4x, 4+, 8+), year built, hull weight, and current state (available / out / maintenance).

#### Scenario: All boats listed
- **WHEN** a user navigates to the boat registry
- **THEN** all boats in the `boats` table SHALL be displayed

#### Scenario: State chips reflect current availability
- **WHEN** a boat has state `available`
- **THEN** it SHALL show a green "Rack" chip
- **WHEN** a boat has state `out`
- **THEN** it SHALL show a clay "On water" chip
- **WHEN** a boat has state `maintenance`
- **THEN** it SHALL show a brass "Workshop" chip

### Requirement: Registry is filterable by state and category
The registry SHALL provide filter chips for All, Available, On water, and Maintenance states.

#### Scenario: State filter applied
- **WHEN** a user taps a state filter chip
- **THEN** only boats matching that state SHALL be displayed

### Requirement: Boat state is derived from active sessions
A boat's effective state SHALL be `out` if any session referencing that boat has `returned_at IS NULL`, overriding the stored `state` field. If no active session exists, the stored `state` field is authoritative.

#### Scenario: Boat state updated on sign-out
- **WHEN** a session is created for a boat
- **THEN** that boat SHALL appear as `out` in the registry and be unselectable in the boat picker

#### Scenario: Boat state updated on sign-in
- **WHEN** a session for a boat is closed (returned_at set)
- **THEN** that boat SHALL revert to its stored `state` (typically `available`)

### Requirement: Boat picker in sign-out flow supports grid and list layouts
The sign-out boat picker SHALL render boats in a 4-column grid by default, with a toggle to switch to a list layout.

#### Scenario: Grid layout
- **WHEN** boat layout is set to `grid`
- **THEN** boats SHALL be displayed as cards in a 4-column grid with name, category, year, and weight

#### Scenario: List layout
- **WHEN** boat layout is set to `list`
- **THEN** boats SHALL be displayed as rows with name, category, year, weight, location, and availability chip

### Requirement: Boat record structure
The `boats` table SHALL store name, category, year built, hull weight, stored state, and optional rack location.

#### Scenario: Boat record fields
- **WHEN** a boat is created
- **THEN** the record SHALL contain: `id`, `name`, `category`, `year_built` (nullable), `weight_kg` (nullable), `state` (available | maintenance, default available), `rack_location` (nullable), `created_at`
