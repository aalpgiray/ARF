## ADDED Requirements

### Requirement: Member list is manually seeded
In v1, members are managed via seed script (`npm run db:seed`). Google Workspace Directory API sync is deferred to v2 (requires OAuth admin consent flow for multi-club SaaS use case).

#### Scenario: Member added via seed
- **WHEN** the seed script runs
- **THEN** members are upserted into the `members` table by `google_user_id` (populated with a dummy prefix for seed data)

### Requirement: Member picker displays members as a searchable grid
The sign-out step 1 SHALL render members from the `members` table as a grid of cards. Members SHALL be filterable by text search and alphabetical tab.

#### Scenario: Member search
- **WHEN** a user types in the search box
- **THEN** the grid SHALL filter to members whose display name contains the search string (case-insensitive)

#### Scenario: Alpha filter
- **WHEN** a user taps a letter tab (A–Z)
- **THEN** the grid SHALL filter to members whose display name starts with that letter

#### Scenario: Member selected
- **WHEN** a user taps a member card
- **THEN** the card SHALL be visually highlighted as selected and the member's name SHALL appear in the footer confirmation

### Requirement: Member record stores google_user_id for future sync linkage
The `members` table SHALL store `google_user_id` as a unique field. In v1, seed data uses `dummy-NNN` prefixed values. In v2, real Google sub IDs will be populated via Directory API sync.

#### Scenario: Record structure
- **WHEN** a member exists in the table
- **THEN** the record SHALL contain: `id`, `google_user_id`, `display_name`, `email`, `squad` (nullable), `synced_at`, `created_at`

## DEFERRED to v2

### Google Workspace Directory API sync
- Service account with domain-wide delegation OR OAuth admin consent flow
- Cron-based refresh (every 6h on Pro plan, daily on Hobby)
- Fall back to stale cache on API error
- Multi-club SaaS: each org authorises via Google OAuth admin consent screen
