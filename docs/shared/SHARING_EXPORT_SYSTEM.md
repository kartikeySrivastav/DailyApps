# Shared Sharing & Export System

## 1. Overview

Many DailyApps tools produce artifacts (PDF resumes, merged documents, compressed images, financial CSV reports, calculation history). A standardized export and sharing mechanism ensures consistent user experience across tools.

---

## 2. Export Architecture

- **Native Share Bridge**:
  - Encapsulated in `@dailyapps/media`:
    ```typescript
    import { shareContent } from '@dailyapps/media';
    await shareContent({
      title: 'Monthly Financial Summary',
      message: 'Here is my expense summary for October.',
      url: 'file:///path/to/exported.csv'
    });
    ```
- **Standard Export Formats**:
  - PDF: Used by Resume Maker, PDF Tools, Student Toolkit (timetables).
  - Images (PNG/JPEG): Used by Image Tools, QR Generator.
  - CSV/JSON: Used by Money Manager, Calculator history.
- **Temporary Storage Hygiene**:
  - Files generated for sharing are placed in cache directories and purged after sharing.

---

## 3. CURRENT vs TARGET vs GAP

### CURRENT
- `shareContent` abstraction implemented in `packages/media`.
- MIME type resolution and human-readable byte formatting operational.

### TARGET
- Direct file export/save-to-downloads using Android Storage Access Framework (SAF) and iOS document picker.
- Watermark / branding toggle for free tier exports.

### GAP
- Native file-system writing to user's device Downloads directory (e.g. `react-native-fs` or `expo-file-system`) to be added when implementing file generators.
