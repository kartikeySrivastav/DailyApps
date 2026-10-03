# App Isolation Model

## 1. Overview

Every app within DailyApps is an independent commercial entity intended for distinct Play Store / App Store distribution. Isolation must be preserved at every layer: native build, local storage, analytics, ads, and runtime code.

---

## 2. Five Pillars of Isolation

### 1. Native Identity Isolation
- Each app defines a distinct `applicationId` (Android) and `bundleIdentifier` (iOS).
- Native files (`MainActivity.kt`, `MainApplication.kt`, `AndroidManifest.xml`) are isolated within `apps/<app-id>/android/`.
- Distinct app names and icons (`android/app/src/main/res/values/strings.xml`).

| App Directory | Android Application ID | iOS Bundle ID |
|---|---|---|
| `calculator` | `com.dailyapps.calculator` | `com.dailyapps.calculator` |
| `resume-maker` | `com.dailyapps.resumemaker` | `com.dailyapps.resumemaker` |
| `productivity` | `com.dailyapps.productivity` | `com.dailyapps.productivity` |
| `pdf-tools` | `com.dailyapps.pdftools` | `com.dailyapps.pdftools` |
| `image-tools` | `com.dailyapps.imagetools` | `com.dailyapps.imagetools` |
| `money-manager` | `com.dailyapps.moneymanager` | `com.dailyapps.moneymanager` |
| `student-toolkit` | `com.dailyapps.studenttoolkit` | `com.dailyapps.studenttoolkit` |
| `qr-barcode` | `com.dailyapps.qrbarcode` | `com.dailyapps.qrbarcode` |

### 2. Storage Namespace Isolation
- Underneath, `@dailyapps/storage` enforces prefixing every key: `@dailyapps:${appId}:${key}`.
- `apps/calculator` cannot access, overwrite, or delete keys created by `apps/resume-maker`.
- `clearAppStorage(appId)` purges strictly the keys belonging to that `appId`.

### 3. Ads & Monetization Isolation
- Every app defines its own AdMob units in `apps/<app-id>/src/config/app.config.ts`.
- During development, shared standard Google test IDs are used.
- Production unit IDs are completely separated per app.

### 4. Analytics & Event Isolation
- Event payloads logged via `@dailyapps/analytics` are automatically prefixed with the app's event namespace (`calculator.*`, `resume_maker.*`, etc.).
- Event schemas and tracking IDs are scoped per app.

### 5. Content & Catalog Isolation
- The generic `DynamicHomeScreen` UI engine lives in `packages/ui`.
- Tool catalogs (`toolCatalog.ts`) live exclusively in `apps/<app-id>/src/config/toolCatalog.ts`.
- Shared code never imports or references app-specific features or models.

---

## 3. CURRENT vs TARGET vs GAP

### CURRENT
- All 8 apps have distinct `applicationId` configurations in `android/app/build.gradle`.
- Each app config defines its isolated storage namespace, AdMob slot config, and analytics identifier in `app.config.ts`.
- Storage package implements isolated namespace prefixing.
- Tool catalogs are strictly localized in each app's `src/config/toolCatalog.ts`.

### TARGET
- iOS native directories (`ios/`) scaffolded for all 8 apps with isolated Podfiles and Bundle Identifiers.
- Automated lint rule to prevent cross-app imports (`apps/appA` importing from `apps/appB`).

### GAP
- iOS project directories are planned; only Android projects are currently instantiated.
- ESLint boundary rule (`no-restricted-imports`) preventing cross-app imports needs formal CI rule definition.
