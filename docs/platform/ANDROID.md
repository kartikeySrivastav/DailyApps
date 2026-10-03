# Android Platform Configuration

## 1. Overview

Each app in `apps/*` maintains a dedicated `android/` directory containing native Gradle configurations, manifest definitions, and entry points.

---

## 2. Architecture & Native Layout

```text
apps/<app>/android/
├── app/
│   ├── build.gradle               # Unique applicationId, versionCode, versionName
│   ├── proguard-rules.pro         # Proguard optimization rules
│   └── src/
│       └── main/
│           ├── AndroidManifest.xml # Unique package attribute & permissions
│           ├── java/com/dailyapps/<pkg>/
│           │   ├── MainActivity.kt
│           │   └── MainApplication.kt
│           └── res/
│               ├── values/strings.xml # Display app_name
│               └── mipmap-*/          # App icons
├── build.gradle                   # Root Android Gradle build script
├── settings.gradle                # Includes :app and autolinked packages
└── gradle.properties              # JVM memory & AndroidX flags
```

### Application ID Matrix
| App | Application ID |
|---|---|
| `calculator` | `com.dailyapps.calculator` |
| `resume-maker` | `com.dailyapps.resumemaker` |
| `productivity` | `com.dailyapps.productivity` |
| `pdf-tools` | `com.dailyapps.pdftools` |
| `image-tools` | `com.dailyapps.imagetools` |
| `money-manager` | `com.dailyapps.moneymanager` |
| `student-toolkit` | `com.dailyapps.studenttoolkit` |
| `qr-barcode` | `com.dailyapps.qrbarcode` |

---

## 3. CURRENT vs TARGET vs GAP

### CURRENT
- All 8 apps have independent native `android/` directories with unique `applicationId`, package namespaces, Kotlin `MainActivity`/`MainApplication`, and `app_name` strings.
- Monorepo node_modules resolution configured in `android/settings.gradle` and `app/build.gradle`.

### TARGET
- Automated Gradle signing configuration referencing production release keystores via environment variables.
- Proguard / R8 optimization verified for release APK/AAB size minimization.

### GAP
- Release keystores and CI environment variable wiring to be configured upon first Play Store upload.
