## MODIFIED Requirements

### Requirement: Boat list displays active and retired boats with tabs
The boat list page SHALL display boats in a responsive grid. On mobile (≤480px), the boat grid SHALL display in a single column. On tablet (≤768px), the grid SHALL display in 2 columns. Desktop behaviour (2–3 columns) is unchanged.

#### Scenario: Active tab shows fleet boats
- **WHEN** the active tab is selected
- **THEN** all active boats SHALL be displayed in the grid

#### Scenario: Retired tab shows retired boats with reason
- **WHEN** the retired tab is selected
- **THEN** retired boats SHALL be displayed with their retirement reason

#### Scenario: Category filter chips narrow results
- **WHEN** a category chip is selected
- **THEN** only boats matching that category SHALL be shown

#### Scenario: Boat grid single-column on mobile
- **WHEN** the boat grid renders at ≤480px
- **THEN** boat cards SHALL display in a single column at full container width

#### Scenario: Boat grid two-column on tablet
- **WHEN** the boat grid renders at 481px–768px
- **THEN** boat cards SHALL display in 2 columns
