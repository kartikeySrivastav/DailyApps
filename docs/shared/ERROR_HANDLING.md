# Shared Error Handling Architecture

## 1. Overview

DailyApps enforces defensive programming, global boundary containment, and user-friendly error recovery to avoid app crashes.

---

## 2. Architecture & Components

- **React Error Boundaries**:
  - Top-level `ErrorBoundary` in `App.tsx` catches unhandled rendering errors.
  - Granular screen-level error boundaries prevent a failure in one tool from crashing the entire app.
- **ErrorView Component**:
  - Exported from `@dailyapps/ui`, displays an illustrative warning icon, title, description, and an interactive "Retry" or "Go to Home" button.
- **Async Try/Catch Guarding**:
  - All storage operations, file operations, and external API requests must be wrapped in structured try/catch blocks with fallback states.
- **Safe Math**:
  - Calculator and financial engines validate operands to prevent divide-by-zero, `NaN`, or infinite loops.

---

## 3. CURRENT vs TARGET vs GAP

### CURRENT
- `ErrorView` component implemented in `@dailyapps/ui`.
- Calculator calculation engine validates inputs defensively and displays errors inline.
- Storage methods catch and log exceptions gracefully.

### TARGET
- Global Sentry / Crashlytics error reporting integration with release source maps.
- Automatic breadcrumb logging before crashes.

### GAP
- Native Sentry/Crashlytics SDK integration planned for production hardening.
