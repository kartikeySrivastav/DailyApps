# Resume Maker — Screen 1–71 code-structure audit

Audit basis: the reference collages in this folder, and the current source under
`apps/resume-maker/src`. This is a code audit only. It is intentionally not a
device sign-off. `Partial` never means the UI matches the reference.

## Status legend

| Status | Meaning |
| --- | --- |
| Exact gap | A route/component exists but its screen hierarchy, visual system, or interaction model differs materially from the reference. |
| Partial | The relevant data/action exists, but is implemented as a generic screen/modal or misses required reference behaviour. |
| Missing | No dedicated route/implementation exists for this reference screen. |
| Placeholder | A route exists but uses static demo content, alerts, or a non-functional action. |

## Global blockers before screen-by-screen work

1. The current app uses several independent UI systems: new light-blue wizard UI, old theme-driven cards, and generic modal screens. They cannot visually converge without shared tokens, header, field, CTA, bottom navigation, and icon components.
2. The resume onboarding source contains only five sequential form steps (`Personal Details`, `Add Profile Photo`, `Professional Summary`, `Work Experience`, `Add Experience`). The editor dashboard now tracks 12 persisted sections, but the remaining section forms are still not a unified 12-step state machine.
3. Many reference actions are represented by `Alert.alert`, static demo documents, static resume data, or `Coming Soon`. Those are not functional equivalents.
4. Text glyphs/emoji are used as icons in multiple existing screens. They are not the outlined reference icon system and render inconsistently on Android.

## Implementation progress verified on 19 September 2026

The following changes are in source and were typechecked. They improve functional flow only; they are **not** device/reference-parity sign-off.

| Area | Completed implementation | Remaining gap |
| --- | --- | --- |
| New resume creation | Resume template entry points now use a blank `createEmptyResume` factory; Rahul's sample profile is no longer injected into a new resume. | Biodata and legacy support/demo routes still contain sample fixtures. |
| Home recent documents | Home reads the two newest real documents from `saved_documents`; static `My_Resume.pdf` / `My_Biodata.pdf` rows were removed. | The reference visual hierarchy/artwork still needs a device comparison. |
| Resume Editor | Dashboard completion derives from persisted data and now exposes 12 sections, including Interests and Additional Sections. | The first five forms remain a separate onboarding flow and the other forms still use mixed UI shells. |
| Interests | Users can add/remove interests; they persist to the document and render in the resume preview. | Its form has not been matched against a numbered reference screen. |
| Additional Sections | The editor now opens the dedicated Additional Sections route; multiple custom sections can be added and removed without replacing earlier ones. | The reference journey and visuals still need rebuilding. |

Verification completed: `npm run typecheck --workspace @dailyapps/app-resume-maker` passed after the blank-document and additional-section work. This audit remains a code audit; no connected-device screenshot pass has been recorded.

## Matrix

| # | Reference screen | Current source mapping | Status | Code gap that must be resolved |
| ---: | --- | --- | --- | --- |
| 1 | Home | `HomeScreen.tsx` | Exact gap | Route exists, but cards, iconography, spacing, data cards and visual hierarchy are not reference-identical. |
| 2 | Create Document / Choose document type | `DocumentTypeSelectorScreen.tsx` | Exact gap | Has document choices, but needs final responsive two-column reference layout and all card states/actions. |
| 3 | Resume Templates | `TemplateSelectorScreen.tsx` | Exact gap | Template selection exists; filter chips/layout and template cards are structurally different from reference. |
| 4 | Resume Editor | `ResumeBuilderScreen.tsx` | Partial | Has a persisted 12-section dashboard, data-driven completion, Preview CTA, and blank-new-document flow. The header, outlined icons, exact row design, and unified 12-step journey still do not match. |
| 5 | Personal Details | `ResumeOnboardingFlow.tsx` step 1 | Exact gap | Exists as onboarding form, but reference fields/order, photo card, header and bottom action layout differ. |
| 6 | Add Profile Photo | `ResumeOnboardingFlow.tsx` step 2 | Partial | Gallery/camera buttons both only open the crop state; no real gallery/camera picker or source selection. |
| 7 | Professional Summary | `ResumeOnboardingFlow.tsx` step 3 | Exact gap | Summary input exists, but suggestion chips, AI state, counter and exact reference layout need rebuilding. |
| 8 | Work Experience | `ResumeOnboardingFlow.tsx` step 4 | Exact gap | Cards/actions exist, but list UI, edit/delete, dates and section progress differ. |
| 9 | Add Experience | `ResumeOnboardingFlow.tsx` step 5 | Exact gap | Form exists, but reference fields, current-job logic, responsibility entries, validation and layout differ. |
| 10 | Education | `SectionEditorModal.tsx` education list | Exact gap | Implemented as a generic editor modal rather than the reference full-step screen. |
| 11 | Add Education | `SectionEditorModal.tsx` education add form | Exact gap | Data form exists but is nested inside generic modal; field structure/visual UI differs. |
| 12 | Skills | `SectionEditorModal.tsx` skills | Exact gap | Chips and save exist, but category/proficiency/reference screen hierarchy differ. |
| 13 | Projects | `SectionEditorModal.tsx` projects | Exact gap | Project form exists only in generic modal and does not reproduce reference list/form flow. |
| 14 | Certifications | `SectionEditorModal.tsx` certifications | Exact gap | Form exists only in generic modal; no dedicated reference screen. |
| 15 | Achievements | `SectionEditorModal.tsx` achievements | Exact gap | Generic modal implementation; reference list/form and action details missing. |
| 16 | Languages | `ResumeAdvancedScreen.tsx` `languages` mode | Exact gap | Add/remove exists, but has no exact language/proficiency selector flow and differs visually. |
| 17 | Additional Sections | `ResumeAdvancedScreen.tsx` `additional` mode | Partial | Multiple custom sections now persist and can be deleted. The reference add-section journey and visual system still need rebuilding. |
| 18 | Reorder Sections | `ResumeAdvancedScreen.tsx` `reorder` mode | Partial | Reordering via up/down works; reference drag UI, visibility/order presentation and styling do not match. |
| 19 | Customize Template | `ResumeAdvancedScreen.tsx` `customize` mode | Placeholder | Options display but most selections do not mutate/persist template design. |
| 20 | Resume Preview | `LivePreviewScreen.tsx` | Exact gap | Functional preview route exists, but reference preview shell, controls and exact document presentation differ. |
| 21 | PDF Preview | `PdfPreviewScreen.tsx` | Exact gap | Route exists; reference PDF-specific toolbar/page behaviour and visual structure differ. |
| 22 | Export PDF | `PdfPreviewScreen.tsx` / share components | Partial | Export is not a dedicated reference export screen/workflow with final options and completion state. |
| 23 | Share Document | `ShareBottomSheet.tsx` | Partial | Share UI component exists, but it is not verified as the reference screen/action matrix. |
| 24 | Create Biodata | `DocumentTypeSelectorScreen.tsx` → `MarriageBiodataBuilderScreen.tsx` | Exact gap | Navigation exists but reference stepwise biodata creation shell is absent. |
| 25 | Biodata Templates | `TemplateSelectorScreen.tsx` / `TemplateGalleryScreen.tsx` | Exact gap | Catalog exists, but reference biodata template page is not reproduced. |
| 26 | Biodata Editor | `MarriageBiodataBuilderScreen.tsx` | Exact gap | One generic editor contains data forms; reference editor/section rail/progress UI differs. |
| 27 | Biodata Personal Details | `MarriageBiodataBuilderScreen.tsx` `personalDetails` | Exact gap | Data case exists but not dedicated reference step screen. |
| 28 | Family Details | `MarriageBiodataBuilderScreen.tsx` `familyDetails` | Exact gap | Data case exists but not dedicated reference step screen. |
| 29 | Education & Profession | `MarriageBiodataBuilderScreen.tsx` `education` / `profession` | Exact gap | Split generic cases, not reference screen and flow. |
| 30 | Lifestyle & Expectations | `MarriageBiodataBuilderScreen.tsx` `lifestyle` / `expectations` | Exact gap | Split generic cases, not reference screen and flow. |
| 31 | Biodata Preview | `LivePreviewScreen.tsx` biodata branch | Exact gap | Preview exists but not reference layout/controls. |
| 32 | Biodata Export PDF | `PdfPreviewScreen.tsx` biodata branch | Partial | Reuses generic PDF preview; reference biodata export UI absent. |
| 33 | My Documents | `MasterProfileScreen.tsx` | Exact gap | Saved document list/filter exists, but header, cards, controls and reference UI differ. |
| 34 | Document Details | `DocumentActionScreen.tsx` `details` | Exact gap | Exists but is generic and uses fixed file metadata rather than actual document details. |
| 35 | Rename Document | `DocumentActionScreen.tsx` `rename` | Exact gap | Rename data action exists; reference modal/screen visual contract differs. |
| 36 | Duplicate Document | `DocumentActionScreen.tsx` `duplicate` | Exact gap | Duplicate data action exists; reference confirmation/UI differs. |
| 37 | Delete confirmation | React Native `Alert.alert` | Missing | No custom reference confirmation modal. |
| 38 | My Documents empty state | `MasterProfileScreen.tsx` empty branch | Exact gap | Empty branch exists, but reference artwork/layout/actions differ. |
| 39 | PDF Tools home | `ToolsScreen.tsx` | Exact gap | Tools grid exists, but it uses emoji and actions only open “Coming Soon”. |
| 40 | Select files | none | Missing | No file selection screen or picker workflow. |
| 41 | Merge PDF | `ToolsScreen.tsx` entry only | Placeholder | CTA only triggers a Coming Soon alert; no merge workflow. |
| 42 | Split PDF | `ToolsScreen.tsx` entry only | Placeholder | CTA only triggers a Coming Soon alert; no split workflow. |
| 43 | Compress PDF | `ToolsScreen.tsx` entry only | Placeholder | CTA only triggers a Coming Soon alert; no compression workflow. |
| 44 | Image to PDF | `ToolsScreen.tsx` entry only | Placeholder | CTA only triggers a Coming Soon alert; no image-to-PDF workflow. |
| 45 | PDF to Image | none | Missing | No dedicated route/tool. |
| 46 | Rotate PDF | none | Missing | No dedicated route/tool. |
| 47 | Delete PDF Pages | none | Missing | No dedicated route/tool. |
| 48 | Reorder Pages | none | Missing | No dedicated route/tool. |
| 49 | Scan to PDF | none | Missing | No camera scan workflow. |
| 50 | PDF Processing | none | Missing | No processing/progress state route. |
| 51 | PDF Created | none | Missing | No post-creation result screen. |
| 52 | Premium Templates | `PremiumTemplatesScreen.tsx` | Exact gap | Content exists, but visual system, template cards and icons differ from reference. |
| 53 | Premium purchase | `PremiumTemplatesScreen.tsx` alert | Placeholder | Buy button presents an alert and does not show the reference purchase screen or payment result. |
| 54 | AI Resume Assistant | `AiAssistantScreen.tsx` | Exact gap | Dedicated screen exists, but its actual controls/content need reference-by-reference rebuild and functional generation audit. |
| 55 | Language | `SettingsScreen.tsx` / `LanguageSelectionModal.tsx` | Exact gap | Selection component exists, but not a dedicated reference language screen. |
| 56 | Settings | `SettingsScreen.tsx` | Exact gap | Settings route exists; sections, rows, artwork and action flows are not the reference system. |
| 57 | Resume ATS Checker | `ResumeSettingsFlowScreen.tsx` `ats` | Placeholder | Static score/subscores and alert action; no real resume analysis. |
| 58 | Resume Multi-Page Preview | `ResumeSettingsFlowScreen.tsx` `multipage` | Placeholder | Static mock paper/`1 / 2`, not generated multi-page preview. |
| 59 | Page Layout & Margins | `ResumeSettingsFlowScreen.tsx` `layout` | Placeholder | Some local selection state; margins and settings are not all mutable/persisted into renderer. |
| 60 | Header & Footer Customization | `ResumeSettingsFlowScreen.tsx` `headerfooter` | Placeholder | Toggles exist but do not change/export actual resume header/footer. |
| 61 | Section Visibility | `ResumeSettingsFlowScreen.tsx` `visibility` | Placeholder | Local switch state only; not persisted into document/preview export. |
| 62 | Onboarding / Welcome | `FinalSupportFlowScreen.tsx` `welcome` and `SplashScreen.tsx` | Exact gap | Two overlapping onboarding concepts; neither follows the supplied illustration/layout exactly. |
| 63 | Photo Crop & Adjust | `ResumeOnboardingFlow.tsx` crop state; `FinalSupportFlowScreen.tsx` crop mode | Exact gap | Duplicate implementations, static remote demo photo, not connected to actual picker image or true crop output. |
| 64 | Template Full Preview | `FinalSupportFlowScreen.tsx` `template` | Placeholder | Static sample preview; Use Template only alerts and is not connected to selected template. |
| 65 | Unsaved Changes Confirmation | `FinalSupportFlowScreen.tsx` `unsaved` | Placeholder | UI route exists, but navigation dirty-state detection/save-discard outcomes are not wired. |
| 66 | Restore Draft | `FinalSupportFlowScreen.tsx` `restore` | Placeholder | Static draft card; no draft discovery or restore persistence. |
| 67 | PDF Processing Failed | `FinalSupportFlowScreen.tsx` `failed` | Placeholder | Static error state; no PDF process can report into it. |
| 68 | PDF Error State | `FinalSupportFlowScreen.tsx` `error` | Placeholder | Static error state; no runtime error integration. |
| 69 | Search & Filter Documents | `FinalSupportFlowScreen.tsx` `search`; `MasterProfileScreen.tsx` filters | Exact gap | Search uses a hard-coded document array; it does not query actual storage/filter UI as reference. |
| 70 | Privacy Center | `FinalSupportFlowScreen.tsx` `privacy` | Placeholder | Static info rows and alerts; no real privacy settings/detail pages. |
| 71 | Help & FAQ | `FinalSupportFlowScreen.tsx` `help` | Placeholder | Static rows and alerts; no expandable FAQ/contact/support flow. |

## Required implementation order

Do not start by polishing scattered screens. The dependency-safe order is:

1. Build one reusable light reference design system: status/header, five-item bottom nav, form field, gradient CTA, outline icon button, cards, section row, modal and empty/error state.
2. Rebuild the complete Resume Maker vertical flow first: screens 1–23, with an actual 12-section state machine and saved draft/dirty tracking.
3. Rebuild screens 24–38 (Biodata and documents) on those shared components.
4. Implement actual PDF tools and their subflows for screens 39–51; do not keep alert-only entries.
5. Finish premium/settings/advanced/support screens 52–71, wiring each state to real app data.
6. Only then run the connected-device audit: navigate every reference screen, capture screenshot, compare it against its numbered source image, and log pass/fail with a screenshot path.

## Current conclusion

There is no truthful “all screens match” status yet. The code contains broad coverage of routes and data forms, but reference parity is currently limited by the missing 12-step architecture, generic modal reuse, placeholders, and non-functional PDF-tool flows.
