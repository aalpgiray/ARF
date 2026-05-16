# boat-management Specification

## Purpose
TBD - created by archiving change admin-management. Update Purpose after archive.
## Requirements
### Requirement: Boat list displays active and retired boats with tabs
The `/admin/boats` page SHALL display a tab strip with Active and Retired tabs, each showing a count badge. The Active tab lists boats where `isActive = true`; the Retired tab lists boats where `isActive = false`. Both lists SHALL be filterable by category chip (All, 1x, 2x, 4x·4+, 8+) and searchable by name.

#### Scenario: Active tab shows fleet boats
- **WHEN** a user is on the Active tab of `/admin/boats`
- **THEN** only boats with `isActive = true` SHALL be displayed

#### Scenario: Retired tab shows retired boats with reason
- **WHEN** a user is on the Retired tab
- **THEN** only boats with `isActive = false` SHALL be displayed
- **THEN** rows WHERE `retiredReason` is set SHALL display the reason

#### Scenario: Category filter chips narrow results
- **WHEN** a user taps a category filter chip (e.g., "1x")
- **THEN** only boats with matching category SHALL be displayed in the current tab

### Requirement: Add boat form with required fields
The admin boat list page SHALL provide an "+ Add boat" button that opens a modal with fields: Name (required, must be unique), Category (required, select: 1x/2x/2-/4x/4+/8+), Year built (optional, integer), Hull weight kg (optional, number), Rack location (optional).

#### Scenario: Successful boat creation
- **WHEN** a user fills required fields with valid data and submits
- **THEN** the boat SHALL be created with `isActive = true`, `state = AVAILABLE`
- **THEN** the new boat SHALL appear in the Active list

#### Scenario: Duplicate name blocked
- **WHEN** a user submits a boat name that already exists in the database
- **THEN** the API SHALL return a 409 error
- **THEN** the form SHALL display: "A boat with this name already exists."

### Requirement: Retire boat requires confirmation with optional reason
A boat in the Active list SHALL have a "Retire" button per row. Tapping it opens a confirmation modal showing boat details. The modal SHALL include an optional free-text "Reason for retiring" field and a warning chip if the boat is currently on water. No type-to-confirm is required for boats.

#### Scenario: Retire opens confirmation modal
- **WHEN** a user taps "Retire" on a boat row
- **THEN** a modal SHALL open showing the boat's name, category, year, weight, rack location

#### Scenario: On-water warning shown
- **WHEN** the boat to be retired has an active session (returnedAt IS NULL)
- **THEN** the modal SHALL display an "On water now" warning chip

#### Scenario: Retire sets isActive false
- **WHEN** a user confirms retirement (optionally entering a reason)
- **THEN** the boat's `isActive` SHALL be set to `false`, `retiredReason` set if provided, `updatedAt` updated
- **THEN** the boat SHALL move to the Retired tab and be hidden from all public views

### Requirement: Restore boat from Retired tab
A retired boat SHALL have a "Restore to fleet" button. Tapping it SHALL immediately restore the boat (`isActive = true`), clearing `retiredReason`. No confirmation required — restoration is non-destructive.

#### Scenario: Restore returns boat to active fleet
- **WHEN** a user taps "Restore to fleet" on a retired boat row
- **THEN** the boat's `isActive` SHALL be set to `true`, `retiredReason` cleared
- **THEN** the boat SHALL appear in the Active tab, boat picker, and public registry

