## MODIFIED Requirements

### Requirement: Dashboard provides navigation to sign-out and sign-in flows
The footer SHALL contain only a primary "Sign out a boat" CTA. The secondary "I'm back — sign in" CTA is removed. Return actions are available inline on each session row.

#### Scenario: Sign-out CTA present and functional
- **WHEN** a user taps "Sign out a boat"
- **THEN** they are navigated to step 1 of the sign-out flow

#### Scenario: No standalone sign-in CTA in footer
- **WHEN** the dashboard renders with active sessions
- **THEN** the footer SHALL NOT contain a standalone "I'm back — sign in" CTA

## ADDED Requirements

### Requirement: Dashboard session rows include an inline return action
Each row in the session table SHALL include an "I'm back" button that marks that session as returned without leaving the dashboard first.

#### Scenario: Successful inline return
- **WHEN** a user taps "I'm back" on a session row
- **THEN** a POST is made to `/api/sessions/[id]/return`
- **THEN** on success, the user is navigated to `/sign-in/training?session_id=<id>`

#### Scenario: Button shows loading state during submission
- **WHEN** a user taps "I'm back" and the request is in flight
- **THEN** the button SHALL be disabled and display "Recording…"

#### Scenario: Only one row submitting at a time
- **WHEN** one session's return is being recorded
- **THEN** other rows' "I'm back" buttons SHALL remain enabled
