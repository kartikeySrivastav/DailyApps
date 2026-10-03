# Dependency Rules

## 1. Overview

In the DailyApps monorepo, strict dependency rules govern what can import what. Violations lead to circular dependencies, build failures, and bundle bloat.

---

## 2. Dependency Hierarchy

```text
Layer 4: Apps (`apps/*`)
   │
   ▼
Layer 3: UI & Presentation (`packages/ui`, `packages/navigation`)
   │
   ▼
Layer 2: Service & Infrastructure (`packages/storage`, `packages/ads`, `packages/analytics`, `packages/permissions`, `packages/media`)
   │
   ▼
Layer 1: Foundations (`packages/theme`, `packages/utils`, `packages/config`)
```

### Invariant Rules

1. **Downwards Only**: A package can only import packages from equal or lower layers.
   - Example: `packages/ui` can import `packages/theme` and `packages/config`.
   - `packages/theme` CANNOT import `packages/ui`.
2. **No Horizontal Cross-Service Dependencies**:
   - `packages/storage` CANNOT import `packages/analytics`.
   - `packages/ads` CANNOT import `packages/storage`.
3. **No Upward Imports**:
   - No package under `packages/*` may ever import from `apps/*`.
4. **No Cross-App Imports**:
   - `apps/calculator` CANNOT import from `apps/resume-maker` or any sibling app.
5. **Hoisted Native & Build Tooling**:
   - React Native core, Babel presets, TypeScript, and Jest are defined in root `package.json`.
   - App-level `package.json` only lists direct dependencies to prevent duplicate or conflicting versions.

---

## 3. CURRENT vs TARGET vs GAP

### CURRENT
- Dependency rules adhere strictly to this hierarchy across all 10 packages and 8 apps.
- TypeScript compilation (`tsc --noEmit`) passes with 0 errors across the entire codebase.
- No package imports from `apps/*`.

### TARGET
- Automated dependency graph validator (e.g. `madge` or `dpdm`) integrated into `npm test` script to detect circular or prohibited imports.

### GAP
- Circular dependency CI check step to be formally added to repository test runner.
