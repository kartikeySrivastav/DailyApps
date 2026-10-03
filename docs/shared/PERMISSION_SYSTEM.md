# Shared Permission System (`@dailyapps/permissions`)

## 1. Overview

`@dailyapps/permissions` provides an abstraction layer for checking, requesting, and handling device runtime permissions (Camera, Photo Library, Notifications, Storage) with graceful degradation.

---

## 2. API & Principles

- **Typed Permission Requests**:
  - `checkPermission(type: PermissionType): Promise<PermissionStatus>`
  - `requestPermission(type: PermissionType): Promise<PermissionStatus>`
- **Status Enum**: `'granted' | 'denied' | 'blocked' | 'unavailable'`
- **App-Level Permission Mapping**:
  - Apps request only the permissions required for their specific features:
    - `calculator`: No permissions.
    - `qr-barcode`: Camera only.
    - `pdf-tools` & `image-tools`: Storage / Photo Library.
    - `productivity`: Post Notifications.
    - `resume-maker`: Storage (for saving generated PDFs).

---

## 3. CURRENT vs TARGET vs GAP

### CURRENT
- Permission interface and status checking abstractions implemented in `packages/permissions/src/index.ts`.
- Mock fallback for development and automated test environments.

### TARGET
- Native linkage to `react-native-permissions` for runtime Android/iOS permission dialog triggers.
- Native Settings redirect prompt when a permission is permanently `blocked`.

### GAP
- Native Android permissions must be declared in respective `AndroidManifest.xml` files only as features are implemented (e.g. `android.permission.CAMERA` in `qr-barcode`).
- Native settings redirect dialog helper to be wired to native linking.
