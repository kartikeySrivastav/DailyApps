# Shared Utilities System (`@dailyapps/utils`)

## 1. Overview

`@dailyapps/utils` houses pure, stateless, zero-dependency helper functions used across calculators, financial computations, data transformations, and asynchronous control flows.

---

## 2. Inventory of Utilities

- **Number & Math**:
  - `formatNumber(value, options)`: Formats numbers with localized digit grouping and decimal places.
  - `formatCurrency(value, currencyCode, locale)`: Formats currency values (e.g. `$1,234.56` or `₹1,23,456.00`).
  - `clamp(value, min, max)`: Restricts a number to a specified range.
  - `roundTo(value, decimals)`: Precision rounding avoiding floating point anomalies.
- **Date & Time**:
  - `formatDate(date, format)`: Standard date strings (`YYYY-MM-DD`, localized formats).
  - `daysBetween(date1, date2)`: Calculates difference in whole calendar days.
  - `addDays(date, days)`: Immutable date arithmetic.
- **Async & Performance**:
  - `debounce(fn, delay)`: Debounces rapid user inputs (e.g. search bar queries).
  - `throttle(fn, limit)`: Throttles high-frequency scroll or resize events.
- **String Transformations**:
  - `slugify(text)`: Converts strings to URL/file-safe slugs.
  - `truncate(text, length)`: Safe truncation with ellipsis.
  - `capitalize(text)`: Capitalizes first letters.
- **Validation**:
  - Email, URL, numeric string, and phone number regex validators.

---

## 3. CURRENT vs TARGET vs GAP

### CURRENT
- Pure utilities implemented in `packages/utils/src/`.
- Zero UI dependencies and zero native dependencies.
- 100% test coverage with Jest unit tests passing.

### TARGET
- Expanded financial formula suite (Compound Interest, XIRR, Net Present Value) for Money Manager and Financial Calculator.
- Unit conversion mathematical matrix (Length, Mass, Temperature, Digital Storage, Energy) for Calculator.

### GAP
- Advanced financial algorithms and unit conversion matrices to be implemented when corresponding tool screens are developed.
