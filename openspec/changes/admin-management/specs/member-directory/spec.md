## MODIFIED Requirements

### Requirement: Member record structure
The `members` table SHALL store `firstName`, `lastName`, `email` (unique), optional `squad`, `isActive` boolean (default true), and timestamps `createdAt`, `updatedAt`. The `googleUserId` field is retained as a nullable unique field for legacy data but SHALL NOT be required for new members. The `displayName` and `syncedAt` fields are removed.

#### Scenario: Record structure
- **WHEN** a member exists in the table
- **THEN** the record SHALL contain: `id`, `googleUserId` (nullable, unique), `firstName`, `lastName`, `email` (unique), `squad` (nullable), `isActive` (boolean, default true), `updatedAt`, `createdAt`

### Requirement: Member picker displays only active members
The sign-out step 1 SHALL render only members where `isActive = true`. Deactivated members SHALL NOT appear in the sign-out picker or any member-selection UI.

#### Scenario: Active-only filter applied
- **WHEN** a user navigates to sign-out step 1
- **THEN** only members with `isActive = true` SHALL be displayed in the grid

#### Scenario: Deactivated member invisible in sign-out
- **WHEN** a member has `isActive = false`
- **THEN** they SHALL NOT appear in the sign-out member picker under any search or filter

### Requirement: Member picker filters by name using firstName + lastName
The sign-out member picker SHALL filter and display members using their combined full name (`firstName + ' ' + lastName`).

#### Scenario: Member search uses full name
- **WHEN** a user types in the search box
- **THEN** the grid SHALL filter to members whose `firstName + ' ' + lastName` contains the search string (case-insensitive)

#### Scenario: Alpha filter uses first letter of firstName
- **WHEN** a user taps a letter tab (A–Z)
- **THEN** the grid SHALL filter to members whose `firstName` starts with that letter

#### Scenario: Member card shows full name
- **WHEN** a member card is displayed in the picker
- **THEN** it SHALL show `firstName + ' ' + lastName` as the display name

## REMOVED Requirements

### Requirement: Member list is manually seeded
**Reason**: Replaced by in-app member management. The seed script remains for initial setup but members are now managed via the admin UI and CSV import. Google Workspace sync is permanently removed (not deferred — out of scope for this product).
**Migration**: Use `/admin/members` to manage members. Run seed script for initial population only. The seed is updated to use `firstName`/`lastName` and email-based upsert.

### Requirement: Member record stores google_user_id for future sync linkage
**Reason**: Google Workspace sync removed. `googleUserId` is retained as a nullable legacy field but has no functional role going forward.
**Migration**: Existing `googleUserId` values are preserved as-is. New members created via admin UI will have `googleUserId = null`. No application logic depends on this field.
