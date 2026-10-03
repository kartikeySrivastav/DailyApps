# Resume Maker — live-device flow audit

Device: RMX5000 / Android, package `com.dailyapps.resumemaker`.

## Path exercised

1. Launch app → Home
2. Create Resume → Select document type
3. Next → Resume templates
4. Continue → Personal Details

## Confirmed blockers

| Priority | Step | Live-device observation | Status |
| --- | --- | --- | --- |
| P0 | Template selection | The fixed `Continue` action initially sat underneath the persistent bottom navigation. A tap selected another template rather than moving forward. | Fixed in source: the CTA now sits 62 dp above navigation. Device retest reached Personal Details. |
| P0 | Complete onboarding | Before the device run, finishing onboarding crashed with `handleSaveToStorage is not a function`. | Fixed in source by moving the save handler ahead of the onboarding early return. |
| P1 | Personal Details | The live UI is dark while supplied references are light. Mobile layout is materially different: reference's compact field styling and visual hierarchy do not match the installed build. | Open. |
| P1 | Home | The reference home has a soft light gradient, icon system, compact cards and clean chevrons. Live build uses dark surfaces, emoji glyphs, oversized card spacing, and malformed glyphs in two action cards. | Open. |
| P1 | Document type | Reference uses an immediately visible two-column document grid. Live build renders one full-width card per row on the 360 dp device, so it is not a structural match. | Open. |
| P1 | Templates | Live template page is dark, card-first, and has clipped filter labels; it does not resemble the supplied light reference flows. | Open. |

## Evidence captured from the device

- `scratch/resumemaker-audit-03.png` — live Home
- `scratch/resumemaker-audit-05-template.png` — live Template screen before CTA fix
- `scratch/resumemaker-audit-07-onboarding.png` — live Personal Details after CTA fix

## Audit state

The template CTA blocker is fixed and typecheck passes. The remaining resume steps (photo, summary, experience, editor, preview/export) must not be signed off until the app is run through them after the light-theme/reference-first layout pass.
