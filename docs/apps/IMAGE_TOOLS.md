# Image Tools App Specification (`apps/image-tools`)

## 1. Overview & Purpose
Daily Image Tools is a high-speed photo utility providing target-size compression (e.g. compress to exact KB for online applications), pixel dimension resizing, cropping, and format conversion entirely on device.

## 2. Target Users
- Candidates applying for government jobs or university exams requiring exact image size limits (e.g. "Under 50 KB").
- E-commerce sellers resizing product images for web stores.
- Everyday smartphone users freeing up internal device storage.

## 3. Feature Groups
- **Target Size Compression**: Specify exact target file size in KB or MB with automatic quality calculation.
- **Resize Dimensions**: Width/Height adjustment with aspect ratio lock and percentage presets (25%, 50%, 75%).
- **Crop & Rotate**: Preset aspect ratios (1:1, 4:3, 16:9, passport photo sizes) with freeform rotation.
- **Format Converter**: JPEG, PNG, WEBP conversion with transparency preservation.
- **Batch Processing**: Process multiple photos in a single queue.

## 4. Planned Screens & Navigation
- `Home`: Tool catalog & quick action triggers (`DynamicHomeScreen`).
- `TargetCompress`: Image selector, target KB input, side-by-side quality comparison.
- `ResizeDimensions`: Pixel inputs, aspect ratio toggle, preset chips.
- `CropImage`: Interactive canvas with crop overlays and passport aspect ratio presets.
- `ConvertFormat`: Format picker (JPEG, PNG, WEBP) and quality slider.
- `BatchQueue`: Progress list for multi-image processing.
- `Settings`: Default output folder, default format, EXIF preservation toggle.

## 5. UI Requirements
- Side-by-side before/after comparison slider.
- Real-time output file size estimation.
- Vibrant pink brand color (`#ec4899`).

## 6. Data Model Requirements
- `ImageJob`: `{ id: string, sourceUri: string, targetBytes?: number, width?: number, height?: number, format: 'jpeg' | 'png' | 'webp' }`.

## 7. Storage Requirements
- Namespace: `@dailyapps:imagetools:*`.
- Key `@dailyapps:imagetools:presets`: Custom resize and compression presets.
- Key `@dailyapps:imagetools:history`: Last processed images metadata.

## 8. Permissions
- Android: `READ_MEDIA_IMAGES` / `READ_EXTERNAL_STORAGE`.

## 9. Ads Configuration
- Banner ad on `HomeScreen` and result screens.
- Interstitial ad upon saving/sharing compressed photos.
- Google test IDs configured.

## 10. Analytics
- Namespace: `imagetools.*`.
- Events: `imagetools.compressed_to_kb`, `imagetools.resized`, `imagetools.batch_processed`.

## 11. Settings
- Default output format (JPEG / PNG / WEBP).
- Preserve EXIF metadata toggle.
- Theme mode (Light / Dark).

## 12. Accessibility
- VoiceOver/TalkBack labels describing original vs processed image dimensions.
- High-contrast dimension input indicators.

## 13. Platform Considerations
- Android `applicationId`: `com.dailyapps.imagetools`.
- Memory management optimization during large photo bitmap operations.

## 14. Store Requirements
- Title: Daily Image Tools - Compress KB
- Category: Photography / Tools
- Content Rating: Everyone (PEGI 3)
- Privacy Policy URL configured.

## 15. Dependencies on Shared Packages
- `@dailyapps/config`, `@dailyapps/theme`, `@dailyapps/ui`, `@dailyapps/navigation`, `@dailyapps/storage`, `@dailyapps/utils`, `@dailyapps/media`, `@dailyapps/permissions`, `@dailyapps/ads`, `@dailyapps/analytics`.

---

## 16. CURRENT vs TARGET vs GAP

### CURRENT
- App base shell, Android native config, and TypeScript compilation verified.
- `HomeScreen` displaying tool catalog via `DynamicHomeScreen`.
- Independent storage namespace (`@dailyapps:imagetools:*`) and AdMob test config wired.

### TARGET
- Native image manipulation library linkage (`react-native-image-resizer` or custom native bitmap worker).
- Multi-photo batch compression queue.

### GAP
- Native image resizer module to be integrated.
- Image processing tool screens to be built.
