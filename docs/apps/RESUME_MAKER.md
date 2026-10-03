# Resume Maker App Specification (`apps/resume-maker`)

## 1. Overview & Purpose
Daily Resume Maker is an offline-friendly, ATS-compliant resume and CV builder empowering job seekers to construct clean, professional PDF resumes in minutes without costly subscriptions.

## 2. Target Users
- Students and fresh graduates building their first professional CV.
- Mid-career professionals updating job history on mobile.
- Freelancers needing quick, tailored cover letters and resume variations.

## 3. Feature Groups
- **Resume Editor**: Structured forms for Contact, Summary, Experience, Education, Skills, Projects, Certifications.
- **ATS Templates**: Clean, single-column and modern dual-column templates verified for ATS readability.
- **Preview & Customization**: Accent color picker, font selector, section reordering.
- **Export & Share**: PDF generation and native system share.

## 4. Planned Screens & Navigation
- `Home`: Existing resumes list and template catalog (`DynamicHomeScreen`).
- `ResumeEditor`: Multi-step form tabs for profile sections.
- `TemplateSelector`: Visual gallery of ATS-compliant templates.
- `ResumePreview`: Real-time PDF preview with zoom and page controls.
- `Settings`: Theme mode, default contact info, PDF page size (A4 / Letter).

## 5. UI Requirements
- Step-by-step accordion form elements.
- Real-time PDF rendering preview with smooth page transitions.
- Reorderable section list using drag-and-drop handles.

## 6. Data Model Requirements
- `ResumeProfile`: `{ id: string, title: string, personalInfo, experience[], education[], skills[], templateId: string, accentColor: string, updatedAt: number }`.

## 7. Storage Requirements
- Namespace: `@dailyapps:resumemaker:*`.
- Key `@dailyapps:resumemaker:resumes`: JSON array of `ResumeProfile` objects.
- Key `@dailyapps:resumemaker:draft`: Auto-saved active draft.

## 8. Permissions
- Android: `READ_EXTERNAL_STORAGE` / `WRITE_EXTERNAL_STORAGE` (Android <= 9) or Storage Access Framework for saving exported PDFs.

## 9. Ads Configuration
- Banner ad on `HomeScreen` and `TemplateSelector`.
- Rewarded ad or interstitial ad upon final high-resolution PDF download/export.
- Standard Google test IDs configured.

## 10. Analytics
- Namespace: `resumemaker.*`.
- Events: `resumemaker.resume_created`, `resumemaker.template_selected`, `resumemaker.pdf_exported`.

## 11. Settings
- Default paper format (A4 vs US Letter).
- Theme selection (Light / Dark).
- Auto-save draft interval.

## 12. Accessibility
- All form input fields contain explicit labels, hints, and error indicators.
- High-contrast template preview modes.

## 13. Platform Considerations
- Android `applicationId`: `com.dailyapps.resumemaker`.
- iOS `bundleIdentifier`: `com.dailyapps.resumemaker`.
- Native PDF rendering using cross-platform HTML-to-PDF engine.

## 14. Store Requirements
- Title: Daily Resume Maker - PDF & CV
- Category: Productivity / Business
- Content Rating: Everyone (PEGI 3)
- Privacy Policy URL configured.

## 15. Dependencies on Shared Packages
- `@dailyapps/config`, `@dailyapps/theme`, `@dailyapps/ui`, `@dailyapps/navigation`, `@dailyapps/storage`, `@dailyapps/utils`, `@dailyapps/media`, `@dailyapps/ads`, `@dailyapps/analytics`.

---

## 16. CURRENT vs TARGET vs GAP

### CURRENT
- App base shell, Android native setup, and configuration created.
- `HomeScreen` displaying tool catalog via `packages/ui/DynamicHomeScreen`.
- Independent storage namespace (`@dailyapps:resumemaker:*`) and AdMob test config wired.
- JavaScript bundle compiles cleanly.

### TARGET
- HTML/CSS-to-PDF rendering pipeline using `react-native-html-to-pdf` or modern print engine.
- 5+ professionally designed ATS-friendly resume templates.
- Section reordering and auto-save draft manager.

### GAP
- PDF generation native module linkage.
- Multi-step resume editor screens to be implemented in feature build phase.
