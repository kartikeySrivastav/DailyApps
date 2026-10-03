# Shared Navigation System (`@dailyapps/navigation`)

## 1. Overview

`@dailyapps/navigation` unifies React Navigation setup across all applications, providing a theme-aware `AppNavigationContainer` and standard header options.

---

## 2. Architecture & Patterns

- **Theme Bridge**: Automatically translates `@dailyapps/theme` tokens into React Navigation's `Theme` format (`colors: { primary, background, card, text, border, notification }`).
- **Standard Screen Options**: `createScreenOptions(theme)` provides consistent header styling, elevation, back buttons, and status bar coordination.
- **Root Navigator Structure**: Each app owns its native stack navigator in `apps/<app>/src/navigation/RootNavigator.tsx`.
  - Common pattern:
    - `Home`: Tool selection grid (`HomeScreen.tsx`)
    - `Settings`: Shared settings screen (`SettingsScreen.tsx`)
    - App-specific feature screens (e.g. `BasicCalculator`, `ResumeEditor`, `PdfMerge`)

---

## 3. CURRENT vs TARGET vs GAP

### CURRENT
- `AppNavigationContainer` and `createScreenOptions` implemented in `packages/navigation`.
- All 8 apps have an independent `RootNavigator.tsx` configured with standard screen stacks and typed parameter lists.
- Calculator has working navigation between `Home` and `BasicCalculator`.

### TARGET
- Deep linking URL scheme support (`dailyapps-<app>://`) integrated per app.
- Shared tab bar navigator helper for multi-tab apps (Productivity, Money Manager).

### GAP
- Deep linking scheme config not yet configured in native Android manifests.
- Tab navigation helper planned for apps requiring persistent bottom navigation.
