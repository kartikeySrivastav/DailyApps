# Package Boundaries

## 1. Overview

To prevent architectural degradation and code rot in a monorepo, strict boundaries are enforced across all 10 packages in `packages/*`.

---

## 2. Package Responsibilities & Contract Matrix

| Package | Purpose & Responsibilities | Allowed Dependencies | Prohibited Inclusions |
|---|---|---|---|
| `@dailyapps/config` | Type definitions for AppConfig, AdMob, Theme, Store Metadata. | None (pure types) | Business logic, JSX, native modules |
| `@dailyapps/theme` | Color palettes, typography, spacing, radius, ThemeContext, useTheme hook. | None | App-specific branding, components |
| `@dailyapps/ui` | Generic presentation components (Button, Card, Input, Dialog, etc.) and `DynamicHomeScreen` UI engine. | `@dailyapps/theme`, `@dailyapps/config` | Specific tool catalogs, calculations, storage |
| `@dailyapps/navigation`| Common navigation wrappers, headers, theme bridges. | `@dailyapps/theme`, React Navigation | App-specific screen implementations |
| `@dailyapps/storage` | Key-value persistence with mandatory app namespace isolation. | `@react-native-async-storage/async-storage` | App-specific data models or hardcoded keys |
| `@dailyapps/utils` | Pure functional helpers: formatting numbers/currency, date arithmetic, debounce, string helpers. | None (pure TS) | UI elements, native dialogs, file I/O |
| `@dailyapps/ads` | AdMob wrapper, banner view, interstitial/rewarded loader with safe test mode. | `@dailyapps/config`, `react-native-google-mobile-ads` | Hardcoded production unit IDs |
| `@dailyapps/analytics`| Analytics interface with event namespacing and pluggable destinations. | `@dailyapps/config` | App-specific event catalogs |
| `@dailyapps/permissions`| Runtime permission requests and status checkers (Camera, Storage, Notifications). | `react-native-permissions` | Unnecessary platform requests |
| `@dailyapps/media` | Cross-platform file picker, MIME detection, file size formatting, native sharing. | `react-native-share`, document picker | App-specific file parsing or conversion |

---

## 3. Boundary Hygiene Rules

1. **No UI in Utils**: `confirmDialog` and alert dialogs belong in `packages/ui`, not `packages/utils`.
2. **No Sharing in Utils**: Native share triggers belong in `packages/media`, not `packages/utils`.
3. **No App Business Logic in Packages**: Never mention "Calculator", "Resume", or "PDF" inside `packages/*`.
4. **No Storage Collisions**: All storage operations must route through `createAppStorage(appId)`.

---

## 4. CURRENT vs TARGET vs GAP

### CURRENT
- All 10 packages implemented with strict boundaries matching the matrix above.
- `confirmDialog` is part of `packages/ui` (`Dialog.tsx`), `packages/utils` contains only pure functions.
- `shareContent` is part of `packages/media`.
- `DynamicHomeScreen` acts purely as an empty presentation engine consuming props.

### TARGET
- Automated package boundary enforcement via dependency cruisers or ESLint `import/no-restricted-paths`.
- Zero circular dependencies across packages verified in pre-commit hooks.

### GAP
- ESLint dependency boundary linter rule to be configured to enforce boundaries automatically during local development.
