# Platform Release Configuration

## 1. Overview

Each app must be individually buildable into production release artifacts (Android App Bundle `.aab` / Universal APK) without side-effects or cross-compilation of other apps.

---

## 2. Build Pipeline & Commands

### CLI Builder Script
The repository provides `scripts/build-app.js` to execute builds dynamically:
```bash
# Build standalone bundle for an app
npm run build -- calculator
npm run build -- resume-maker
npm run build -- pdf-tools

# Build production Android APK
npm run build -- calculator --apk
```

### Release Versioning Scheme
Every app defines its version configuration in `src/config/app.config.ts`:
- `version`: Semantic version string (`1.0.0`) mapped to `versionName`.
- `buildNumber`: Monotonically increasing integer (`1`) mapped to `versionCode`.

---

## 3. CURRENT vs TARGET vs GAP

### CURRENT
- `scripts/build-app.js` script supports all 8 apps dynamically.
- Metro JS bundle compilation succeeds for apps (`calculator`, `resume-maker` verified with exit code 0).
- Version configurations defined in all 8 `app.config.ts` files.

### TARGET
- Automated CI pipeline producing signed `.aab` artifacts using GitHub Actions secrets.
- Automated release notes generation from Git commit history.

### GAP
- Production keystore signing files and CI secret injection to be configured during initial store deployment.
