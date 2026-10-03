# QR & Barcode App Specification (`apps/qr-barcode`)

## 1. Overview & Purpose
Daily QR & Barcode is an instant camera scanner and code generator capable of reading and creating QR codes, UPC, EAN, Code 128, and Data Matrix formats with zero lag and offline privacy.

## 2. Target Users
- Everyday consumers scanning product barcodes for online price comparison.
- Users connecting to Wi-Fi networks, adding contacts (vCard), or opening URLs via QR.
- Event organizers and small business owners generating custom QR codes for menus and payments.

## 3. Feature Groups
- **High-Speed Scanner**: Real-time camera scanner with continuous auto-focus, flash toggle, and zoom control.
- **Batch Scanner**: Rapidly scan multiple barcodes in succession with continuous sound/vibration feedback.
- **Code Generator**: Generate QR codes for URLs, Wi-Fi passwords, vCards, SMS, Phone numbers, and plain text.
- **Scan History**: Categorized history with instant copy, open in browser, or share.

## 4. Planned Screens & Navigation
- `Home`: Scanner trigger, generator options, and recent scan list (`DynamicHomeScreen`).
- `LiveScanner`: Full-screen camera viewfinder with framing guide and torch toggle.
- `ScanResult`: Formatted payload viewer (e.g. Wi-Fi join button, URL open button, contact card).
- `QrGenerator`: Payload type selector, text input, and live QR code preview with download/share.
- `ScanHistory`: Chronological search of past scans.
- `Settings`: Sound on scan, vibration on scan, auto-open URLs toggle.

## 5. UI Requirements
- Full-screen fluid camera view with animated green laser scanning line.
- Instant bottom sheet on successful barcode detection.
- Futuristic cyan-teal brand accent (`#06b6d4`).

## 6. Data Model Requirements
- `ScanItem`: `{ id: string, payload: string, format: 'QR_CODE' | 'EAN_13' | 'UPC_A' | 'CODE_128', type: 'url' | 'wifi' | 'text' | 'contact', timestamp: number }`.

## 7. Storage Requirements
- Namespace: `@dailyapps:qrbarcode:*`.
- Key `@dailyapps:qrbarcode:history`: Array of past `ScanItem` records.
- Key `@dailyapps:qrbarcode:settings`: Audio feedback, vibration, and browser preferences.

## 8. Permissions
- Android: `CAMERA` (mandatory for scanning; generator operates without permissions).

## 9. Ads Configuration
- Banner ad on `HomeScreen` and `QrGenerator`.
- Interstitial ad after scanning or generating codes (frequency capped).
- Google test IDs configured.

## 10. Analytics
- Namespace: `qrbarcode.*`.
- Events: `qrbarcode.scan_success`, `qrbarcode.code_generated`, `qrbarcode.history_cleared`.

## 11. Settings
- Beep on scan toggle.
- Vibrate on scan toggle.
- Auto-open links in external browser toggle.

## 12. Accessibility
- Voice feedback announcing scanned content immediately upon detection.
- High-contrast visual viewfinder border.

## 13. Platform Considerations
- Android `applicationId`: `com.dailyapps.qrbarcode`.
- Fast camera startup using CameraX via React Native camera bindings.

## 14. Store Requirements
- Title: Daily QR & Barcode - Fast Scan
- Category: Tools / Productivity
- Content Rating: Everyone (PEGI 3)
- Privacy Policy URL configured.

## 15. Dependencies on Shared Packages
- `@dailyapps/config`, `@dailyapps/theme`, `@dailyapps/ui`, `@dailyapps/navigation`, `@dailyapps/storage`, `@dailyapps/utils`, `@dailyapps/media`, `@dailyapps/permissions`, `@dailyapps/ads`, `@dailyapps/analytics`.

---

## 16. CURRENT vs TARGET vs GAP

### CURRENT
- App base shell, Android native config, and TypeScript compilation verified.
- `HomeScreen` displaying tool catalog via `DynamicHomeScreen`.
- Independent storage namespace (`@dailyapps:qrbarcode:*`) and AdMob test config wired.

### TARGET
- High-performance live camera scanner integration using `react-native-vision-camera` and MLKit barcode detection.
- Offline vector QR code generator engine using `react-native-qrcode-svg`.

### GAP
- Camera and barcode scanning native libraries to be linked in feature build phase.
- Live scanner and code generator screens to be built.
