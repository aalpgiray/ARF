## MODIFIED Requirements

### Requirement: Boat record structure
The `boats` table SHALL store name, category, year built, hull weight, operational state, optional rack location, fleet membership (`isActive`), optional retirement reason, and timestamps.

#### Scenario: Boat record fields
- **WHEN** a boat is created
- **THEN** the record SHALL contain: `id`, `name` (unique), `category`, `yearBuilt` (nullable), `weightKg` (nullable), `state` (AVAILABLE | MAINTENANCE, default AVAILABLE), `rackLocation` (nullable), `isActive` (boolean, default true), `retiredReason` (nullable), `updatedAt`, `createdAt`

### Requirement: Boat registry displays all club boats
The public boat registry page SHALL display only boats where `isActive = true`. Retired boats SHALL be hidden from the public registry and the sign-out boat picker.

#### Scenario: All active boats listed
- **WHEN** a user navigates to the boat registry
- **THEN** only boats with `isActive = true` SHALL be displayed

#### Scenario: Retired boat hidden from registry
- **WHEN** a boat has `isActive = false`
- **THEN** it SHALL NOT appear in the public boat registry or the sign-out boat picker

## ADDED Requirements

### Requirement: Boat picker shows only active available boats
The sign-out boat picker SHALL only include boats where `isActive = true`. Retired boats SHALL never appear in the picker, regardless of their operational state.

#### Scenario: Retired boat invisible in boat picker
- **WHEN** a boat has `isActive = false`
- **THEN** it SHALL NOT appear in the sign-out boat picker step
