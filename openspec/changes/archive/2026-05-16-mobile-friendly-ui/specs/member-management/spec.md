## MODIFIED Requirements

### Requirement: Member list displays active and inactive members with tabs
The member list page SHALL display members in a responsive grid. On mobile (≤480px), the member grid SHALL display in a single column. On tablet (≤768px), the grid SHALL display in 2 columns. Desktop behaviour (4–5 columns) is unchanged.

#### Scenario: Active tab shows active members
- **WHEN** the active tab is selected
- **THEN** all active members SHALL be displayed in the grid

#### Scenario: Inactive tab shows deactivated members with reason
- **WHEN** the inactive tab is selected
- **THEN** deactivated members SHALL be shown with their deactivation reason

#### Scenario: Tab badges reflect live counts
- **WHEN** the member list loads
- **THEN** each tab SHALL show a badge with the count of members in that state

#### Scenario: Search filters by name or email
- **WHEN** the user types in the search input
- **THEN** displayed members SHALL be filtered to match the query

#### Scenario: Member grid single-column on mobile
- **WHEN** the member grid renders at ≤480px
- **THEN** member cards SHALL display in a single column at full container width

#### Scenario: Member grid two-column on tablet
- **WHEN** the member grid renders at 481px–768px
- **THEN** member cards SHALL display in 2 columns
