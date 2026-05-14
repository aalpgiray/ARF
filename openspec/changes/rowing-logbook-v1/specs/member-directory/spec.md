## ADDED Requirements

### Requirement: Member list is sourced from Google Workspace Directory API
The system SHALL sync members from the Google Workspace Directory API using a service account with domain-wide delegation. Members SHALL be cached in the `members` table.

#### Scenario: Successful sync
- **WHEN** the sync job runs
- **THEN** all active users in the Google Workspace domain SHALL be upserted into the `members` table with `google_user_id`, `display_name`, and `email`

#### Scenario: API unavailable
- **WHEN** the Google Directory API returns an error during sync
- **THEN** the existing cached members SHALL remain in the database
- **THEN** the error SHALL be logged but SHALL NOT crash the application

### Requirement: Member list is refreshed every 6 hours
A scheduled job SHALL refresh the member cache every 6 hours via a Vercel cron.

#### Scenario: Cron fires
- **WHEN** the cron triggers at the 6-hour interval
- **THEN** the member sync job SHALL execute and update the cache

### Requirement: Member picker displays cached members as a searchable grid
The sign-out step 1 SHALL render members from the cache as a grid of cards. Members SHALL be filterable by text search and alphabetical tab.

#### Scenario: Member search
- **WHEN** a user types in the search box
- **THEN** the grid SHALL filter to members whose display name contains the search string (case-insensitive)

#### Scenario: Alpha filter
- **WHEN** a user taps a letter tab (A–Z)
- **THEN** the grid SHALL filter to members whose display name starts with that letter

#### Scenario: Member selected
- **WHEN** a user taps a member card
- **THEN** the card SHALL be visually highlighted as selected and the member's name SHALL appear in the footer confirmation

### Requirement: Member record stores google_user_id for future SSO linkage
The `members` table SHALL store `google_user_id` (the Google sub/id field) as a non-nullable unique field populated during sync.

#### Scenario: Record structure
- **WHEN** a member is synced
- **THEN** the record SHALL contain: `id`, `google_user_id`, `display_name`, `email`, `squad` (nullable), `synced_at`, `created_at`
