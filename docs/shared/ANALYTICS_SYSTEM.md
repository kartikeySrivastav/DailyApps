# Shared Analytics System (`@dailyapps/analytics`)

## 1. Overview

`@dailyapps/analytics` provides a privacy-first, pluggable telemetry and analytics abstraction layer that prevents cross-app event pollution.

---

## 2. Event Namespacing & Architecture

- **Scoped Event Logger**:
  - `createAnalytics(config: AppConfig)` encapsulates the app identifier:
    ```typescript
    analytics.logEvent('tool_opened', { toolId: 'basic_calc' });
    ```
  - Dispatched events are namespaced: `${appConfig.analyticsId}.${eventName}` (e.g. `calculator.tool_opened`, `resumemaker.template_selected`).
- **Pluggable Transports**:
  - Console logger for development.
  - Pluggable provider adapter (Firebase Analytics, PostHog, or Mixpanel) for production release.
- **Privacy Compliance**:
  - Zero PII (Personally Identifiable Information) logging by default.
  - Respects user opt-out preferences configured in app settings.

---

## 3. CURRENT vs TARGET vs GAP

### CURRENT
- Scoped event logging client and interface implemented in `packages/analytics/src/index.ts`.
- All 8 apps configure distinct `analyticsId` values in `app.config.ts`.
- Unit tests verified.

### TARGET
- Native Firebase Analytics bridge or lightweight HTTPS telemetry dispatcher for production metric collection.
- Opt-out toggle wired to user preferences in Settings screen.

### GAP
- Production Firebase/PostHog adapter to be linked prior to production deployment.
