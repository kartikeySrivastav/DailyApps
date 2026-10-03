# End-to-End Release Process

## 1. Overview

This document defines the release checklist and procedure for shipping an update for any individual app in the DailyApps monorepo.

---

## 2. Step-by-Step Release Workflow

### Step 1: Verification & Pre-Flight
1. Run monorepo typecheck:
   ```bash
   npm run typecheck
   ```
2. Run test suites:
   ```bash
   npm test
   ```
3. Test bundling for target app:
   ```bash
   npm run build -- <app-id>
   ```

### Step 2: Version Bump
Update `version` and increment `buildNumber` in `apps/<app-id>/src/config/app.config.ts`, and update `apps/<app-id>/package.json`.

### Step 3: Native Build Generation
Generate release Android App Bundle:
```bash
cd apps/<app-id>/android
./gradlew bundleRelease
```
Artifact output: `apps/<app-id>/android/app/build/outputs/bundle/release/app-release.aab`.

### Step 4: Play Store Upload
1. Upload `.aab` to Google Play Console (Internal Testing track first).
2. Verify pre-launch report for crashes, ANRs, or accessibility warnings.
3. Promote to Production track upon internal approval.

---

## 3. CURRENT vs TARGET vs GAP

### CURRENT
- Release checklist documented.
- Verification commands (`npm run typecheck`, `npm test`, `npm run build -- <app>`) verified and passing.

### TARGET
- Automated Fastlane release lane (`fastlane android deploy`) for one-click store upload.

### GAP
- Fastlane scripts and Play Console API service account credentials to be configured for automated store delivery.
