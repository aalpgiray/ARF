## ADDED Requirements

### Requirement: CSV export downloads current list as a file
Both `/admin/members` and `/admin/boats` pages SHALL provide an "↓ Export CSV" button. Tapping it downloads a CSV file containing all records (active and inactive) with all editable fields plus `id`.

#### Scenario: Member export includes all fields
- **WHEN** a user taps "↓ Export CSV" on the members page
- **THEN** the browser SHALL download a file named `members-<date>.csv`
- **THEN** the file SHALL contain columns: `id, firstName, lastName, email, squad, isActive`

#### Scenario: Boat export includes all fields
- **WHEN** a user taps "↓ Export CSV" on the boats page
- **THEN** the browser SHALL download a file named `boats-<date>.csv`
- **THEN** the file SHALL contain columns: `id, name, category, yearBuilt, weightKg, rackLocation, state, isActive, retiredReason`

### Requirement: CSV import wizard has three steps: Upload → Review → Done
Tapping "↑ Import CSV" navigates to the import wizard page. Step 1 is a drag-and-drop upload zone. Step 2 shows the dry-run diff. Step 3 shows success summary.

#### Scenario: Upload zone accepts .csv files
- **WHEN** a user drops or browses to a .csv file
- **THEN** the drop zone SHALL display the filename, row count, and file size
- **THEN** the "Check for changes" button SHALL become enabled

#### Scenario: Template download available
- **WHEN** the upload zone is empty
- **THEN** a "Download template" link SHALL be present
- **THEN** downloading it SHALL produce a CSV with the correct column headers and one example row

### Requirement: Dry-run validates entire file before any writes
When the user proceeds from upload, the server SHALL parse and validate the entire CSV, collect ALL errors, and return either a clean diff or a full error list. No partial writes SHALL occur.

#### Scenario: Clean file produces diff
- **WHEN** a valid CSV is submitted for dry-run
- **THEN** the response SHALL include four categories: `added`, `updated`, `deactivated`, `unchanged`
- **THEN** each category SHALL list the affected records with field-level diff for updates

#### Scenario: File with errors shows all errors, no diff
- **WHEN** a CSV contains one or more validation errors
- **THEN** the response SHALL list ALL errors (not just the first)
- **THEN** NO diff SHALL be shown
- **THEN** the "Apply changes" button SHALL remain disabled

#### Scenario: Row-level error format
- **WHEN** an error is returned from dry-run
- **THEN** each error SHALL include: row number (1-indexed, header not counted), field name, plain-English description

#### Scenario: Member import validation rules
- **WHEN** a member CSV row is validated
- **THEN** the following SHALL cause errors: missing `firstName`, missing `lastName`, missing `email`, invalid email format, email domain mismatch (if `ALLOWED_EMAIL_DOMAIN` set), email duplicate within the file, email exists in DB on a different `id` than provided
- **THEN** the following SHALL cause a warning-as-error: unrecognised column names (unknown columns are ignored, not errors)

#### Scenario: Boat import validation rules
- **WHEN** a boat CSV row is validated
- **THEN** the following SHALL cause errors: missing `name`, missing `category`, invalid `category` value, `id` provided but not found in DB, `name` already used by a different boat ID (name collision)

### Requirement: Deactivation on import requires absent rows, not explicit flag
Members present in the current DB but absent from the imported CSV SHALL be marked as `deactivated` in the diff. Members with `isActive` column explicitly set to `false` in the CSV SHALL also be deactivated. Boats follow the same rule.

#### Scenario: Member absent from CSV marked as deactivated
- **WHEN** a member exists in the database with `isActive = true`
- **AND** their email does not appear in the uploaded CSV
- **THEN** the dry-run SHALL include that member in the `deactivated` category

#### Scenario: Member with isActive=false in CSV is deactivated
- **WHEN** a CSV row has `isActive` = `false` or `0`
- **THEN** the dry-run SHALL mark that member as deactivated regardless of presence

### Requirement: Apply is atomic — all or nothing
When the user confirms the dry-run and applies, the server SHALL write all changes in a single database transaction. If any write fails, all changes SHALL be rolled back.

#### Scenario: Apply succeeds
- **WHEN** the user confirms and the server writes all changes
- **THEN** the page SHALL advance to Step 3 with a success summary (counts per category)

#### Scenario: Apply failure rolls back
- **WHEN** any DB write fails during apply
- **THEN** no partial changes SHALL be persisted
- **THEN** the API SHALL return an error and the UI SHALL show an error state

### Requirement: Expandable diff accordions in dry-run review
The dry-run review step SHALL display four summary tiles (Added / Updated / Deactivated / Unchanged with counts) and expandable accordion sections for each non-zero category showing the affected records.

#### Scenario: Accordion shows added members
- **WHEN** the "Will be added" accordion is expanded
- **THEN** each row SHALL show: avatar initials, full name, email, squad, "New" chip

#### Scenario: Accordion shows field diffs for updates
- **WHEN** the "Will be updated" accordion is expanded
- **THEN** each row SHALL show the changed fields with old value struck through and new value highlighted

#### Scenario: Zero-count categories collapsed and hidden
- **WHEN** a category has count 0
- **THEN** its accordion SHALL not be rendered
