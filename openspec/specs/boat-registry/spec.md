# Boat Registry

## Purpose

Provides a view of all club boats with their current availability state. Powers the boat picker in the sign-out flow and gives at-a-glance visibility into what is on the water, in the rack, or in the workshop.
## Requirements
### Requirement: Boat registry displays all club boats
The public boat registry page SHALL display only boats where `isActive = true`. Retired boats SHALL be hidden from the public registry and the sign-out boat picker.

#### Scenario: All active boats listed
- **WHEN** a user navigates to the boat registry
- **THEN** only boats with `isActive = true` SHALL be displayed

#### Scenario: Retired boat hidden from registry
- **WHEN** a boat has `isActive = false`
- **THEN** it SHALL NOT appear in the public boat registry or the sign-out boat picker

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
The `boats` table SHALL store name, category, year built, hull weight, operational state, optional rack location, fleet membership (`isActive`), optional retirement reason, and timestamps.

#### Scenario: Boat record fields
- **WHEN** a boat is created
- **THEN** the record SHALL contain: `id`, `name` (unique), `category`, `yearBuilt` (nullable), `weightKg` (nullable), `state` (AVAILABLE | MAINTENANCE, default AVAILABLE), `rackLocation` (nullable), `isActive` (boolean, default true), `retiredReason` (nullable), `updatedAt`, `createdAt`

### Requirement: Boat picker shows only active available boats
The sign-out boat picker SHALL only include boats where `isActive = true`. Retired boats SHALL never appear in the picker, regardless of their operational state.

#### Scenario: Retired boat invisible in boat picker
- **WHEN** a boat has `isActive = false`
- **THEN** it SHALL NOT appear in the sign-out boat picker step

