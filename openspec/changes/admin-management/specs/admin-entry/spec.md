## ADDED Requirements

### Requirement: Gear icon in Chrome provides admin entry
The Chrome header SHALL display a small circular gear button in the top-right corner of the meta area. Tapping it navigates to `/admin`. When the current path starts with `/admin`, the gear SHALL render in its active state (filled dark background, light icon).

#### Scenario: Gear visible on all kiosk screens
- **WHEN** any page in the app renders
- **THEN** the Chrome header SHALL include a gear icon button in the top-right corner

#### Scenario: Gear navigates to admin home
- **WHEN** a user taps the gear icon
- **THEN** the app SHALL navigate to `/admin`

#### Scenario: Gear shows active state in admin context
- **WHEN** the current URL path starts with `/admin`
- **THEN** the gear button SHALL render with filled dark background (ink color) and light icon (sand color)

#### Scenario: Gear shows idle state outside admin
- **WHEN** the current URL path does not start with `/admin`
- **THEN** the gear button SHALL render with paper background and ink icon with hairline border

### Requirement: Admin home page shows management entry tiles
The `/admin` page SHALL display two tiles — Members and Boats — each showing a live count of active records and a short description. Tapping a tile navigates to the respective management page.

#### Scenario: Members tile shows active count
- **WHEN** a user navigates to `/admin`
- **THEN** the Members tile SHALL display the count of members where `isActive = true`

#### Scenario: Boats tile shows active count
- **WHEN** a user navigates to `/admin`
- **THEN** the Boats tile SHALL display the count of boats where `isActive = true`

#### Scenario: Members tile navigates to member management
- **WHEN** a user taps the Members tile
- **THEN** the app SHALL navigate to `/admin/members`

#### Scenario: Boats tile navigates to boat management
- **WHEN** a user taps the Boats tile
- **THEN** the app SHALL navigate to `/admin/boats`

#### Scenario: Back to kiosk button exits admin
- **WHEN** a user taps "← Back to kiosk" on the admin home page
- **THEN** the app SHALL navigate to `/` (the dashboard)

### Requirement: Admin pages show breadcrumb navigation
All admin pages SHALL display a breadcrumb trail in the Chrome header showing the hierarchy from Home through to the current page. Each non-current segment SHALL be a navigable link.

#### Scenario: Admin home breadcrumb
- **WHEN** a user is on `/admin`
- **THEN** the breadcrumb SHALL show `Home · Admin` with Admin as the current (bold) segment

#### Scenario: Member list breadcrumb
- **WHEN** a user is on `/admin/members`
- **THEN** the breadcrumb SHALL show `Home · Admin · Members`

#### Scenario: Boat list breadcrumb
- **WHEN** a user is on `/admin/boats`
- **THEN** the breadcrumb SHALL show `Home · Admin · Boats`

#### Scenario: CSV import breadcrumb
- **WHEN** a user is on `/admin/members/import` or `/admin/boats/import`
- **THEN** the breadcrumb SHALL include `Import` as the final segment
