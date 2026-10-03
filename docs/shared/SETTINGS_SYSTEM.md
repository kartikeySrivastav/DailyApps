# Shared Settings System

## 1. Overview

Each app provides a dedicated Settings screen allowing users to customize theme preferences, view app version info, access privacy policies, and configure app-specific options.

---

## 2. Standard Settings Layout

A standard settings screen includes:
1. **Appearance**:
   - Theme Mode: System Default / Light / Dark (toggles `@dailyapps/theme`).
2. **App Preferences**:
   - App-specific toggles (e.g., sound effects, vibration, decimal places in Calculator).
3. **Privacy & Legal**:
   - Privacy Policy URL (loaded from `appConfig.store.privacyPolicyUrl`).
   - Terms of Service.
   - Analytics opt-out toggle.
4. **About & Support**:
   - App Name and Version (`v${appConfig.version} (${appConfig.buildNumber})`).
   - Contact Support link / Email.
   - Rate on Google Play link (`market://details?id=${appConfig.android.applicationId}`).

---

## 3. CURRENT vs TARGET vs GAP

### CURRENT
- Settings screen pattern and configuration structure defined.
- Calculator implements working theme mode selection persisted to `@dailyapps/storage`.

### TARGET
- Reusable `SettingsScreen` container component in `@dailyapps/ui` that accepts sections and items dynamically from `app.config.ts`.
- In-app review prompt trigger (`react-native-in-app-review`).

### GAP
- Reusable `SettingsScreen` UI container to be extracted to `@dailyapps/ui` during upcoming UI system polish.
