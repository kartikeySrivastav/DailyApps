# 00 — DailyApps Project Master Plan

## 1. Executive Summary

**DailyApps** is an enterprise-grade React Native monorepo designed to build, maintain, and publish a portfolio of focused utility applications under a single unified engineering foundation.

Instead of developing 20–50 disconnected repositories or packing dozens of unrelated utilities into one bloated app, `DailyApps` groups related tools into **8 focused, high-quality individual apps** that share a centralized core (`packages/*`) while maintaining independent Android/iOS identities and Play Store listings.

---

## 2. App Setup Matrix (Master Status)

| App | Shell | Home | Navigation | Theme | Storage | Ads | Analytics | Permissions | Android | iOS | Store Config | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Calculator** | Implemented | Implemented | Implemented | Implemented | Implemented | Implemented | Implemented | Implemented | Implemented | Planned | Implemented | **Reference (Working)** |
| **Resume Maker** | Implemented | Configured | Configured | Configured | Configured | Configured | Configured | Configured | Implemented | Planned | Configured | **Base Shell Ready** |
| **Productivity** | Implemented | Configured | Configured | Configured | Configured | Configured | Configured | Configured | Implemented | Planned | Configured | **Base Shell Ready** |
| **PDF Tools** | Implemented | Configured | Configured | Configured | Configured | Configured | Configured | Configured | Implemented | Planned | Configured | **Base Shell Ready** |
| **Image Tools** | Implemented | Configured | Configured | Configured | Configured | Configured | Configured | Configured | Implemented | Planned | Configured | **Base Shell Ready** |
| **Money Manager** | Implemented | Configured | Configured | Configured | Configured | Configured | Configured | Configured | Implemented | Planned | Configured | **Base Shell Ready** |
| **Student Toolkit** | Implemented | Configured | Configured | Configured | Configured | Configured | Configured | Configured | Implemented | Planned | Configured | **Base Shell Ready** |
| **QR & Barcode** | Implemented | Configured | Configured | Configured | Configured | Configured | Configured | Configured | Implemented | Planned | Configured | **Base Shell Ready** |

### Status Legend:
- **Implemented**: Fully working, tested, and actively executing code in the app.
- **Configured**: Standalone configuration, navigation root, storage namespace, and tool catalog created and wired to shared systems; features cataloged.
- **Planned**: Architected in documentation; scheduled for future development phases.
- **Missing**: Not yet defined or configured.

---

## 3. Product Portfolio Roadmap

| App Directory | Display Name | Target Package ID | Brand Color | Core Focus |
|---|---|---|---|---|
| `apps/calculator` | **SmartCalc** | `com.dailyapps.calculator` | `#0284c7` (Sky Blue) | Arithmetic, Scientific, Financial (EMI, GST, Discount), Unit Converter |
| `apps/resume-maker` | **ResumeCraft** | `com.dailyapps.resumemaker` | `#10b981` (Emerald) | ATS-compliant PDF resume builder, cover letters, templates |
| `apps/productivity` | **TaskNest** | `com.dailyapps.productivity` | `#f59e0b` (Amber) | Focus timer (Pomodoro), habit tracker, daily checklist, quick notes |
| `apps/pdf-tools` | **DocCraft** | `com.dailyapps.pdftools` | `#ef4444` (Crimson) | Images-to-PDF, merge, split, compress, camera scanner, viewer |
| `apps/image-tools` | **ImageKit** | `com.dailyapps.imagetools` | `#ec4899` (Pink) | Compress to target KB, resize dimensions, crop, format conversion |
| `apps/money-manager` | **MoneyTrack** | `com.dailyapps.moneymanager` | `#8b5cf6` (Purple) | Private expense logger, category budgets, insights, CSV export |
| `apps/student-toolkit` | **StudyKit** | `com.dailyapps.studenttoolkit` | `#3b82f6` (Royal Blue) | GPA/CGPA calculator, attendance bunk tracker, timetable, formulas |
| `apps/qr-barcode` | **QRKit** | `com.dailyapps.qrbarcode` | `#06b6d4` (Cyan Teal) | Live camera scanner, multi-format barcode detection, QR generator |

---

## 4. Documentation Index

### Architecture
- [MONOREPO_ARCHITECTURE.md](architecture/MONOREPO_ARCHITECTURE.md)
- [APP_ISOLATION.md](architecture/APP_ISOLATION.md)
- [PACKAGE_BOUNDARIES.md](architecture/PACKAGE_BOUNDARIES.md)
- [DEPENDENCY_RULES.md](architecture/DEPENDENCY_RULES.md)

### Shared Systems
- [UI_SYSTEM.md](shared/UI_SYSTEM.md)
- [THEME_SYSTEM.md](shared/THEME_SYSTEM.md)
- [NAVIGATION_SYSTEM.md](shared/NAVIGATION_SYSTEM.md)
- [STORAGE_SYSTEM.md](shared/STORAGE_SYSTEM.md)
- [UTILITIES_SYSTEM.md](shared/UTILITIES_SYSTEM.md)
- [MEDIA_SYSTEM.md](shared/MEDIA_SYSTEM.md)
- [PERMISSION_SYSTEM.md](shared/PERMISSION_SYSTEM.md)
- [ADMOB_SYSTEM.md](shared/ADMOB_SYSTEM.md)
- [ANALYTICS_SYSTEM.md](shared/ANALYTICS_SYSTEM.md)
- [ERROR_HANDLING.md](shared/ERROR_HANDLING.md)
- [LOADING_EMPTY_STATES.md](shared/LOADING_EMPTY_STATES.md)
- [SHARING_EXPORT_SYSTEM.md](shared/SHARING_EXPORT_SYSTEM.md)
- [SETTINGS_SYSTEM.md](shared/SETTINGS_SYSTEM.md)

### Platform
- [ANDROID.md](platform/ANDROID.md)
- [IOS.md](platform/IOS.md)
- [RELEASE_CONFIGURATION.md](platform/RELEASE_CONFIGURATION.md)

### Publishing
- [PLAY_STORE.md](publishing/PLAY_STORE.md)
- [APP_BRANDING.md](publishing/APP_BRANDING.md)
- [APP_ICONS.md](publishing/APP_ICONS.md)
- [SCREENSHOTS.md](publishing/SCREENSHOTS.md)
- [RELEASE_PROCESS.md](publishing/RELEASE_PROCESS.md)

### App Specifications
- [CALCULATOR.md](apps/CALCULATOR.md)
- [RESUME_MAKER.md](apps/RESUME_MAKER.md)
- [PRODUCTIVITY.md](apps/PRODUCTIVITY.md)
- [PDF_TOOLS.md](apps/PDF_TOOLS.md)
- [IMAGE_TOOLS.md](apps/IMAGE_TOOLS.md)
- [MONEY_MANAGER.md](apps/MONEY_MANAGER.md)
- [STUDENT_TOOLKIT.md](apps/STUDENT_TOOLKIT.md)
- [QR_BARCODE.md](apps/QR_BARCODE.md)
