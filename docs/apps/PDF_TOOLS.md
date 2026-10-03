# PDF Tools App Specification (`apps/pdf-tools`)

## 1. Overview & Purpose
Daily PDF Tools is an offline-first document utility suite enabling users to convert images to PDF, merge multiple documents, extract pages, compress file sizes, and scan paper documents without cloud upload risks.

## 2. Target Users
- Students compiling lecture notes and homework into submission-ready PDFs.
- Office workers merging contracts, invoices, and reports on mobile.
- Privacy-conscious users refusing to upload sensitive documents to online conversion websites.

## 3. Feature Groups
- **Creation & Scan**: Camera document scanner with edge auto-detection, Images-to-PDF conversion.
- **Manipulation**: PDF Merger, PDF Splitter, Page Reordering, Page Deletion.
- **Optimization**: PDF Compressor (low, medium, high compression levels).
- **Security & Conversion**: Password lock/unlock, PDF-to-Image extractor.

## 4. Planned Screens & Navigation
- `Home`: Tool catalog & recent files (`DynamicHomeScreen`).
- `ImageToPdf`: Gallery picker, thumbnail reordering, margin/orientation options.
- `PdfMerge`: File picker, multi-file reordering, unified output generator.
- `PdfSplit`: Visual page thumbnail selector, page range input.
- `PdfCompress`: File size slider, quality trade-off preview, compression executor.
- `PdfViewer`: Clean offline PDF reader with search, bookmarks, and sharing.
- `Settings`: Default page orientation, compression presets, theme.

## 5. UI Requirements
- Thumbnail grid with drag-and-drop reordering.
- Real-time file size comparison before and after compression.
- Authoritative crimson brand color (`#ef4444`).

## 6. Data Model Requirements
- `DocumentItem`: `{ id: string, name: string, uri: string, sizeBytes: number, pageCount: number, createdAt: number }`.

## 7. Storage Requirements
- Namespace: `@dailyapps:pdftools:*`.
- Key `@dailyapps:pdftools:recent_files`: Array of recently processed documents.
- Key `@dailyapps:pdftools:defaults`: Preferred compression quality and page margins.

## 8. Permissions
- Android: `READ_MEDIA_IMAGES` / `READ_EXTERNAL_STORAGE`, `CAMERA` (for document scanner).

## 9. Ads Configuration
- Banner ad on `HomeScreen` and `PdfViewer`.
- Interstitial ad after successful file generation/compression.
- Google test IDs configured.

## 10. Analytics
- Namespace: `pdftools.*`.
- Events: `pdftools.image_to_pdf_created`, `pdftools.pdf_merged`, `pdftools.pdf_compressed`.

## 11. Settings
- Default output page size (A4 / Letter / Fit to Image).
- Default PDF compression quality level.
- Theme mode (Light / Dark).

## 12. Accessibility
- All file list items announce file name, page count, and formatted size.
- High-contrast visual focus on page selection checkboxes.

## 13. Platform Considerations
- Android `applicationId`: `com.dailyapps.pdftools`.
- Android Storage Access Framework integration for direct file saving.

## 14. Store Requirements
- Title: Daily PDF Tools - Merge & Convert
- Category: Tools / Business
- Content Rating: Everyone (PEGI 3)
- Privacy Policy URL configured.

## 15. Dependencies on Shared Packages
- `@dailyapps/config`, `@dailyapps/theme`, `@dailyapps/ui`, `@dailyapps/navigation`, `@dailyapps/storage`, `@dailyapps/utils`, `@dailyapps/media`, `@dailyapps/permissions`, `@dailyapps/ads`, `@dailyapps/analytics`.

---

## 16. CURRENT vs TARGET vs GAP

### CURRENT
- App base shell, Android native config, and TypeScript compilation verified.
- `HomeScreen` displaying tool catalog via `DynamicHomeScreen`.
- Independent storage namespace (`@dailyapps:pdftools:*`) and AdMob test config wired.

### TARGET
- Native PDF manipulation engine (via `pdf-lib` or native Android PDFBox bridge).
- Camera edge-detection document scanner.

### GAP
- PDF manipulation libraries to be linked in feature development phase.
- Tool screens (ImageToPdf, Merge, Split, Compress) to be built.
