# Shared AdMob System (`@dailyapps/ads`)

## 1. Overview

`@dailyapps/ads` provides a monetization wrapper around Google AdMob, handling banner display, interstitial triggers, and rewarded ads with built-in test-mode safeguards to avoid account suspensions.

---

## 2. Monetization Architecture

- **App-Specific Unit Config**:
  - Each app provides its own ad unit mapping in `app.config.ts`:
    ```typescript
    admob: {
      appId: string;
      bannerId: string;
      interstitialId: string;
      rewardedId?: string;
      testMode: boolean;
    }
    ```
- **Safe Development Test IDs**:
  - Standard Google AdMob test IDs are used across all apps during development:
    - Banner: `ca-app-pub-3940256099942544/6300978111`
    - Interstitial: `ca-app-pub-3940256099942544/1033173712`
    - Rewarded: `ca-app-pub-3940256099942544/5224354917`
- **Banner Ad Component**: `<BannerAd config={appConfig.admob} />` safely renders test placeholders or live ad banners.
- **Interstitial Manager**: Non-intrusive ad loading with frequency capping to maintain high user retention.

---

## 3. CURRENT vs TARGET vs GAP

### CURRENT
- `BannerAd` component and ad manager interface implemented in `packages/ads/src/`.
- All 8 apps configure AdMob with official Google test IDs in `src/config/app.config.ts`.
- Zero hardcoded production AdMob secrets in the repository.

### TARGET
- Native linkage to `react-native-google-mobile-ads` with European User Messaging Platform (UMP) consent SDK integration for GDPR compliance.
- Remote Config integration to toggle ad frequency and placement dynamically.

### GAP
- UMP GDPR consent dialog integration to be added prior to production Play Store release.
- Native `react-native-google-mobile-ads` gradle plugin linkage to be configured in release pipeline.
