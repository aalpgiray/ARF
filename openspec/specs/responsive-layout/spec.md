# responsive-layout Specification

## Purpose

Defines the responsive behaviour of the application across mobile, tablet, and desktop viewports. Ensures all screens are usable on kiosk devices, tablets, and phones without horizontal overflow or inaccessible touch targets.

## Requirements

### Requirement: Layout adapts to mobile viewports (≤480px)
The application SHALL render without horizontal overflow at 375px–480px viewport widths. All interactive elements SHALL have a minimum touch target size of 44×44px. Page-level padding SHALL reduce to 16px on mobile.

#### Scenario: No horizontal overflow at 375px
- **WHEN** the app is rendered at 375px viewport width
- **THEN** no element SHALL produce a horizontal scrollbar on the page container

#### Scenario: Touch targets meet minimum size
- **WHEN** any button, link, or interactive control is rendered on mobile
- **THEN** its computed height SHALL be ≥44px and its computed width SHALL be ≥44px

### Requirement: Layout adapts to tablet viewports (≤768px)
The application SHALL render usably at 768px–1024px viewport widths. Multi-column grids SHALL reduce column count. Gutters and padding SHALL scale down.

#### Scenario: Two-column grid on tablet
- **WHEN** a grid component (member grid, boat grid, tile row) is rendered at 768px
- **THEN** the grid SHALL display at most 2 columns

### Requirement: Chrome header collapses non-essential meta on mobile
The Chrome header SHALL show the brand (logo + club name) on all viewports. On mobile (≤480px), secondary meta items (date, tide info, auto-refresh label) and the admin gear icon SHALL be hidden to preserve space. Admin functions are desktop-only.

#### Scenario: Brand always visible
- **WHEN** Chrome renders at any viewport width
- **THEN** the brand mark, "ARF" wordmark, and club name SHALL be visible

#### Scenario: Meta items hidden on mobile
- **WHEN** Chrome renders at ≤480px
- **THEN** date, "Tide info", "Auto-refresh" chip, and the admin gear icon SHALL not be visible

### Requirement: Footer action bar stacks vertically on mobile
The footer action bar SHALL display buttons in a vertical stack on mobile (≤480px), each button full-width. The primary CTA SHALL appear at the bottom of the stack (closest to the thumb).

#### Scenario: Primary button full-width on mobile
- **WHEN** the footer renders at ≤480px
- **THEN** the primary `.btn-primary` button SHALL expand to full container width

#### Scenario: Buttons stack with primary at bottom
- **WHEN** the footer renders at ≤480px
- **THEN** all footer buttons SHALL be stacked vertically with the primary action at the bottom

### Requirement: Comfy density mode is desktop-only
The `.comfy` density variant SHALL only apply at viewport widths ≥769px. On smaller viewports, `.comfy` overrides SHALL be ignored.

#### Scenario: Comfy padding not applied on mobile
- **WHEN** the `.comfy` class is active and viewport is ≤768px
- **THEN** padding and grid column overrides from `.comfy` SHALL NOT be applied
