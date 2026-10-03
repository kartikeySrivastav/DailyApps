# iOS Platform Configuration

## 1. Overview

DailyApps is architected to support independent iOS deployment. Each app is planned to maintain an isolated `ios/` directory with its own Podfile, Xcode workspace, and bundle identifier.

---

## 2. Planned Architecture

```text
apps/<app>/ios/
├── Podfile                        # CocoaPods dependencies
├── <AppName>/
│   ├── AppDelegate.mm             # Entry point
│   ├── Info.plist                 # Bundle display name & permissions
│   ├── Images.xcassets            # App icons & launch screen assets
│   └── main.m
└── <AppName>.xcodeproj
```

### Planned Bundle Identifiers
| App | Bundle Identifier |
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
- Architecture and bundle identifier scheme documented.
- React Native code written with strict cross-platform compatibility.

### TARGET
- Native `ios/` folders generated for each app with working Podfiles resolving monorepo packages.
- Fastlane lanes configured for TestFlight and App Store submission.

### GAP
- Native `ios/` projects are currently planned; current focus is Android-first validation. Native iOS project generation will occur in the iOS deployment phase.
