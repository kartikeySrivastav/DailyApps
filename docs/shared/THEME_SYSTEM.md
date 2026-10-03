# Shared Theme System (`@dailyapps/theme`)

## 1. Overview

`@dailyapps/theme` provides design tokens, light/dark mode color palettes, typography standards, spacing grids, border radii, and a dynamic React context provider for seamless dark mode toggling.

---

## 2. Design Tokens & Architecture

- **Spacing Scale**: 4pt grid system (`none: 0`, `xs: 4`, `sm: 8`, `md: 16`, `lg: 24`, `xl: 32`, `xxl: 48`).
- **Border Radii**: (`none: 0`, `sm: 4`, `md: 8`, `lg: 12`, `xl: 16`, `full: 9999`).
- **Typography**: Hierarchical type tokens (`h1`, `h2`, `h3`, `body`, `bodySmall`, `caption`, `button`).
- **Colors**:
  - Semantic tokens: `primary`, `background`, `surface`, `card`, `textPrimary`, `textSecondary`, `border`, `error`, `success`, `warning`.
  - Contrast: WCAG AA compliant contrast ratios across light and dark modes.
- **Dynamic Context**: `ThemeProvider` and `useTheme()` hook supporting mode selection: `'light' | 'dark' | 'system'`.

---

## 3. CURRENT vs TARGET vs GAP

### CURRENT
- Theme tokens, light and dark palettes, and `ThemeProvider` fully implemented in `packages/theme`.
- Persistence of user theme mode preference wired to app storage.
- Comprehensive unit tests passing.

### TARGET
- Dynamic brand accent overrides so individual apps can tint the active theme with their signature brand color while retaining uniform dark/light ergonomics.
- Custom web/native font pairing loaders (e.g. Inter / JetBrains Mono).

### GAP
- Custom font loaders not yet injected; currently uses platform system fonts (`San Francisco` on iOS, `Roboto` on Android) for maximum native performance.
