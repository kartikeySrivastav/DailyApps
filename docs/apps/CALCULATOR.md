# Calculator App Specification (`apps/calculator`)

## 1. Overview & Purpose
Daily Calculator is an all-in-one calculation and mathematical utility app designed for everyday quick calculations, scientific computations, financial calculations (EMI, GST, Discount), and unit conversions without ads interrupting the input flow.

## 2. Target Users
- Students and educators requiring quick scientific or age calculations.
- Shoppers and small business owners calculating discounts, GST, and profit margins.
- Everyday users needing a fast, clean, offline calculator.

## 3. Feature Groups
- **Basic & Arithmetic**: Clean input keyboard, calculation history, equation preview.
- **Scientific**: Trigonometry, logarithms, powers, factorials, constants (`π`, `e`).
- **Financial**: EMI calculator, GST/VAT calculator, Discount calculator, Investment/SIP calculator.
- **Utility & Date**: Age calculator, Date difference calculator, Unit converter, Currency converter.

## 4. Planned Screens & Navigation
- `Home`: Tool catalog grid (`DynamicHomeScreen` engine).
- `BasicCalculator`: Primary daily arithmetic calculator with history drawer.
- `ScientificCalculator`: Advanced mathematical function pad.
- `EMICalculator`: Loan amount, interest rate, tenure, and amortization breakdown.
- `GSTCalculator`: Net/Gross price computation with standard tax slabs.
- `DiscountCalculator`: Original price, discount percentage, tax addition.
- `UnitConverter`: Multi-category unit conversion (Length, Mass, Temperature, Volume, Speed).
- `Settings`: Theme mode, vibration toggle, decimal precision preferences.

## 5. UI Requirements
- High-contrast responsive keypad with haptic touch feedback.
- Auto-scaling display text preventing overflow on long equations.
- Seamless Dark/Light theme switching matching system settings.

## 6. Data Model Requirements
- Calculation item: `{ id: string, equation: string, result: string, timestamp: number }`.
- Favorite tools: `string[]` tool IDs.

## 7. Storage Requirements
- Namespace: `@dailyapps:calculator:*`.
- Key `@dailyapps:calculator:history`: JSON array of calculation items.
- Key `@dailyapps:calculator:settings`: Precision digits, sound/vibration toggles.

## 8. Permissions
- No special Android or iOS permissions required. Runs 100% offline.

## 9. Ads Configuration
- Non-intrusive banner ad anchored at bottom of `HomeScreen` and tool screens.
- Interstitial ad frequency capped to maximum 1 per 5 tool screen exits.
- Standard Google AdMob test IDs configured during development.

## 10. Analytics
- Namespace: `calculator.*`.
- Events: `calculator.tool_opened`, `calculator.calc_completed`, `calculator.history_cleared`.

## 11. Settings
- Number of decimal places (2 to 8).
- Haptic feedback toggle on keypad taps.
- Theme mode selection (Light / Dark / System).

## 12. Accessibility
- All keypad buttons have distinct `accessibilityLabel` attributes announcing operation names.
- Dynamic font scaling support for formula and result display.

## 13. Platform Considerations
- Android `applicationId`: `com.dailyapps.calculator`.
- iOS `bundleIdentifier`: `com.dailyapps.calculator`.
- Optimized keypad layout for both small screens and tablets.

## 14. Store Requirements
- Title: Daily Calculator - Fast, Clean
- Category: Tools / Productivity
- Content Rating: Everyone (PEGI 3)
- Privacy Policy URL configured.

## 15. Dependencies on Shared Packages
- `@dailyapps/config`, `@dailyapps/theme`, `@dailyapps/ui`, `@dailyapps/navigation`, `@dailyapps/storage`, `@dailyapps/utils`, `@dailyapps/ads`, `@dailyapps/analytics`.

---

## 16. CURRENT vs TARGET vs GAP

### CURRENT
- Fully working reference app shell and native Android setup.
- Working `HomeScreen` powered by `packages/ui/DynamicHomeScreen` and `src/config/toolCatalog.ts`.
- Working `BasicCalculatorScreen` with full arithmetic logic, error handling, and display.
- Independent storage, AdMob test IDs, analytics identifier, and theme integration.

### TARGET
- Implementation of remaining tools: Scientific, EMI, GST, Discount, Age, Unit Converter.
- History drawer with calculation export/share via `@dailyapps/media`.
- Unit converter matrix for 50+ conversion units.

### GAP
- Scientific, EMI, GST, and Unit Converter screens to be implemented in subsequent development phases.
- Unit converter mathematical formula matrix to be added to `@dailyapps/utils`.
