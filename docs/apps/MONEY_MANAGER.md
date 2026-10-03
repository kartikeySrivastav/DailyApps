# Money Manager App Specification (`apps/money-manager`)

## 1. Overview & Purpose
Daily Money Manager is an offline, private personal finance and expense logger that gives users full control over their income, expenses, and category budgets without requiring bank linking or internet access.

## 2. Target Users
- Budget-conscious individuals tracking daily outlays and monthly savings.
- College students and young professionals managing living allowances.
- Privacy-focused users who refuse cloud-based financial tracking.

## 3. Feature Groups
- **Transaction Logger**: Fast expense/income recording with category icons, notes, and payment mode tags.
- **Budgeting**: Monthly category budgets with visual progress bars and warning thresholds.
- **Visual Analytics**: Interactive pie charts for category breakdowns and monthly trend bars.
- **Export & Backup**: Encrypted local backup and CSV/Excel spreadsheet export.

## 4. Planned Screens & Navigation
- `Home`: Dashboard showing monthly balance, recent transactions, and category pills (`DynamicHomeScreen`).
- `AddTransaction`: Fast numeric keypad entry with category and account selection.
- `TransactionsList`: Chronological search and filter by category, date, and payment mode.
- `Budgets`: Category spending limits with color-coded depletion bars.
- `Reports`: Monthly summary charts and category percentage shares.
- `Settings`: Base currency selector (USD, EUR, INR, GBP, etc.), biometric lock toggle, backup/export.

## 5. UI Requirements
- Ultra-fast transaction entry (under 5 seconds to log).
- Color-coded transaction amounts (green for income, red for expense).
- Elegant royal purple brand accent (`#8b5cf6`).

## 6. Data Model Requirements
- `Transaction`: `{ id: string, amount: number, type: 'expense' | 'income', categoryId: string, note?: string, date: string, paymentMode: string }`.
- `CategoryBudget`: `{ categoryId: string, monthlyLimit: number }`.

## 7. Storage Requirements
- Namespace: `@dailyapps:moneymanager:*`.
- Key `@dailyapps:moneymanager:transactions`: Array of transaction records.
- Key `@dailyapps:moneymanager:budgets`: Category budget limits.
- Key `@dailyapps:moneymanager:preferences`: Selected currency symbol and format.

## 8. Permissions
- Android: Biometric authentication permission (`USE_BIOMETRIC`) for optional app lock. No network permissions required.

## 9. Ads Configuration
- Banner ad on `HomeScreen` and `Reports`.
- Interstitial ad capped to maximum 1 per 10 logged transactions.
- Google test IDs configured.

## 10. Analytics
- Namespace: `moneymanager.*`.
- Events: `moneymanager.transaction_logged`, `moneymanager.budget_created`, `moneymanager.csv_exported`.

## 11. Settings
- Currency selector with symbol and code.
- Biometric app lock (Fingerprint / Face Unlock).
- Theme mode (Light / Dark).

## 12. Accessibility
- All transaction cards announce type (income/expense), amount with currency, and category.
- High-contrast balance indicators.

## 13. Platform Considerations
- Android `applicationId`: `com.dailyapps.moneymanager`.
- Secure encrypted local storage for financial records.

## 14. Store Requirements
- Title: Daily Money Manager - Expense
- Category: Finance / Productivity
- Content Rating: Everyone (PEGI 3)
- Privacy Policy URL configured.

## 15. Dependencies on Shared Packages
- `@dailyapps/config`, `@dailyapps/theme`, `@dailyapps/ui`, `@dailyapps/navigation`, `@dailyapps/storage`, `@dailyapps/utils`, `@dailyapps/media`, `@dailyapps/ads`, `@dailyapps/analytics`.

---

## 16. CURRENT vs TARGET vs GAP

### CURRENT
- App base shell, Android native config, and TypeScript compilation verified.
- `HomeScreen` displaying tool catalog via `DynamicHomeScreen`.
- Independent storage namespace (`@dailyapps:moneymanager:*`) and AdMob test config wired.

### TARGET
- Pure offline SQLite / MMKV local database for rapid query indexing over thousands of transactions.
- Interactive SVG charts (pie and bar charts) for expense distribution.
- CSV export via `@dailyapps/media`.

### GAP
- Database indexing layer to be integrated.
- Transaction logging and reporting screens to be built.
