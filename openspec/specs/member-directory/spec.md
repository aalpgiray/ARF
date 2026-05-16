# Member Directory

## Purpose

Manages the list of club members used for sign-out identification. In v1, members are seeded manually. Google Workspace Directory API sync is deferred to v2.
## Requirements
### Requirement: Member picker displays members as a searchable grid
The sign-out step 1 SHALL render only members where `isActive = true` as a grid of cards. Deactivated members SHALL NOT appear in the sign-out picker or any member-selection UI. Members SHALL be filterable by text search (using `firstName + ' ' + lastName`) and alphabetical tab (using `firstName`).

#### Scenario: Active-only filter applied
- **WHEN** a user navigates to sign-out step 1
- **THEN** only members with `isActive = true` SHALL be displayed in the grid

#### Scenario: Deactivated member invisible in sign-out
- **WHEN** a member has `isActive = false`
- **THEN** they SHALL NOT appear in the sign-out member picker under any search or filter

#### Scenario: Member search uses full name
- **WHEN** a user types in the search box
- **THEN** the grid SHALL filter to members whose `firstName + ' ' + lastName` contains the search string (case-insensitive)

#### Scenario: Alpha filter uses first letter of firstName
- **WHEN** a user taps a letter tab (A–Z)
- **THEN** the grid SHALL filter to members whose `firstName` starts with that letter

#### Scenario: Member card shows full name
- **WHEN** a member card is displayed in the picker
- **THEN** it SHALL show `firstName + ' ' + lastName` as the display name

### Requirement: Member record structure
The `members` table SHALL store `firstName`, `lastName`, `email` (unique), optional `squad`, `isActive` boolean (default true), and timestamps `createdAt`, `updatedAt`. The `googleUserId` field is retained as a nullable unique field for legacy data but SHALL NOT be required for new members. The `displayName` and `syncedAt` fields are removed.

#### Scenario: Record structure
- **WHEN** a member exists in the table
- **THEN** the record SHALL contain: `id`, `googleUserId` (nullable, unique), `firstName`, `lastName`, `email` (unique), `squad` (nullable), `isActive` (boolean, default true), `updatedAt`, `createdAt`

## Deferred to v2

### Google Workspace Directory API sync
- Service account with domain-wide delegation OR OAuth admin consent flow
- Cron-based refresh (every 6h on Pro plan, daily on Hobby)
- Fall back to stale cache on API error
- Multi-club SaaS: each org authorises via Google OAuth admin consent screen
