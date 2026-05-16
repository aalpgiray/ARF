## ADDED Requirements

### Requirement: Member list displays active and inactive members with tabs
The `/admin/members` page SHALL display a tab strip with Active and Inactive tabs, each showing a count badge. The Active tab lists members where `isActive = true`; the Inactive tab lists members where `isActive = false`. Both lists SHALL be searchable by name or email.

#### Scenario: Active tab shows active members
- **WHEN** a user is on the Active tab of `/admin/members`
- **THEN** only members with `isActive = true` SHALL be displayed in the table

#### Scenario: Inactive tab shows deactivated members with reason
- **WHEN** a user is on the Inactive tab of `/admin/members`
- **THEN** only members with `isActive = false` SHALL be displayed
- **THEN** each row SHALL show the member's deactivation reason (if any) below their name

#### Scenario: Tab badges reflect live counts
- **WHEN** a member is deactivated or reactivated
- **THEN** the tab count badges SHALL update to reflect the new counts

#### Scenario: Search filters by name or email
- **WHEN** a user types in the search box
- **THEN** the displayed rows SHALL filter to members whose full name (`firstName lastName`) or email contains the search string (case-insensitive)

### Requirement: Add member form validates required fields and email domain
The admin member list page SHALL provide an "Add member" button that opens a modal with fields: First name (required), Last name (required), Email (required), Squad (optional). On submit, the API SHALL reject duplicate emails and, if `ALLOWED_EMAIL_DOMAIN` env var is set, reject emails not matching that domain.

#### Scenario: Add member button opens modal
- **WHEN** a user taps "+ Add member"
- **THEN** a modal overlay SHALL open with the add member form

#### Scenario: Successful member creation
- **WHEN** a user fills all required fields with valid data and taps "Add member"
- **THEN** the member SHALL be created with `isActive = true`
- **THEN** the modal SHALL close and the new member SHALL appear in the Active list

#### Scenario: Duplicate email blocked
- **WHEN** a user submits the form with an email that already exists in the database
- **THEN** the API SHALL return a 409 error
- **THEN** the form SHALL display the error: "A member with this email already exists."

#### Scenario: Domain-restricted email blocked
- **WHEN** `ALLOWED_EMAIL_DOMAIN` env var is set to `example.se`
- **AND** a user submits an email not ending in `@example.se`
- **THEN** the API SHALL return a 422 error
- **THEN** the form SHALL display: "Email must use @example.se domain."

#### Scenario: Domain hint shown when restriction active
- **WHEN** the add member modal is open and `ALLOWED_EMAIL_DOMAIN` is configured
- **THEN** a hint below the email field SHALL show the required domain

### Requirement: Deactivate member requires typing their full name to confirm
A member SHALL be deactivatable from the Active list via a "Deactivate" button per row. Tapping it opens a confirmation modal. The user MUST type the member's full name (`FIRSTNAME LASTNAME` in uppercase) into a text input before the destructive button becomes active. An optional `deactivationReason` string MAY be stored on the member record; this reason SHALL be persisted in the `deactivationReason` column on the `Member` table and displayed in the Inactive tab.

#### Scenario: Deactivate opens confirmation modal
- **WHEN** a user taps "Deactivate" on a member row
- **THEN** a modal SHALL open showing the member's name and an explanation that they will be hidden from sign-out

#### Scenario: Confirm input validates in real time
- **WHEN** the user's typed input matches the member's full name in uppercase
- **THEN** a success hint SHALL appear ("Matches — Deactivate is ready.")
- **THEN** the "Deactivate" button SHALL become enabled

#### Scenario: Confirm input mismatch
- **WHEN** the user's typed input does not match
- **THEN** the "Deactivate" button SHALL remain disabled

#### Scenario: Deactivation sets isActive false
- **WHEN** the user confirms and taps "Deactivate"
- **THEN** the member's `isActive` SHALL be set to `false` and `updatedAt` updated
- **THEN** the modal SHALL close and the member SHALL move to the Inactive tab

### Requirement: Reactivate member from Inactive tab
A member in the Inactive list SHALL have a "↺ Reactivate" button. Tapping it SHALL immediately reactivate the member (no type-to-confirm required — reactivation is not destructive).

#### Scenario: Reactivate restores member to active
- **WHEN** a user taps "↺ Reactivate" on an inactive member row
- **THEN** the member's `isActive` SHALL be set to `true` and `updatedAt` updated
- **THEN** the member SHALL move to the Active tab and appear in the sign-out picker
