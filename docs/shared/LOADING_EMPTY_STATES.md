# Shared Loading & Empty States Architecture

## 1. Overview

Delightful, responsive user feedback during data loading or empty collections is a core usability requirement across all DailyApps applications.

---

## 2. Component Primitives

- **LoadingIndicator (`@dailyapps/ui`)**:
  - Full-screen or inline spinner with optional status message and brand color theming.
- **EmptyState (`@dailyapps/ui`)**:
  - Renders a graphic or icon, title, description, and an optional primary call-to-action button (e.g. "Create New Resume", "Scan First QR Code").
- **Skeleton Shimmers**:
  - Placeholder layout cards displayed during asynchronous disk or network operations.

---

## 3. CURRENT vs TARGET vs GAP

### CURRENT
- `LoadingIndicator` and `EmptyState` components fully implemented in `@dailyapps/ui`.
- Integrated into `DynamicHomeScreen` for zero-search-results states.

### TARGET
- Reusable animated skeleton card component for grid loading.
- Pull-to-refresh coordination across all list views.

### GAP
- Skeleton placeholder shimmer component planned for complex list screens (Money Manager transactions, PDF file manager).
