# Monorepo Architecture

## 1. Overview & Topology

DailyApps is structured as an npm workspaces monorepo housing focused utility applications alongside shared, modular packages.

```text
DailyApps/
├── apps/                               # Independent standalone applications
│   ├── calculator/                     # Working reference implementation
│   ├── resume-maker/                   # Base shell configured
│   ├── productivity/                   # Base shell configured
│   ├── pdf-tools/                      # Base shell configured
│   ├── image-tools/                    # Base shell configured
│   ├── money-manager/                  # Base shell configured
│   ├── student-toolkit/                # Base shell configured
│   └── qr-barcode/                     # Base shell configured
│
├── packages/                           # Shared foundational packages
│   ├── config/                         # App schemas & typed configuration contracts
│   ├── theme/                          # Design tokens, color palettes & dynamic ThemeProvider
│   ├── ui/                             # Reusable components & DynamicHomeScreen UI engine
│   ├── navigation/                     # Navigation container & theme bridge
│   ├── storage/                        # Namespace-isolated key-value storage engine
│   ├── utils/                          # Pure functional formatters, dates, numbers, debounce
│   ├── ads/                            # AdMob abstraction with test mode safeguards
│   ├── analytics/                      # Isolated event tracking interface
│   ├── permissions/                    # Safe runtime permission checkers
│   └── media/                          # Cross-platform file pickers, MIME types & sharing
│
├── scripts/                            # Monorepo automation & scaffolding scripts
│   ├── create-app.js                   # Scaffolds new apps following monorepo conventions
│   └── build-app.js                    # Dynamic multi-app builder & APK bundler
└── docs/                               # Architectural source of truth
```

---

## 2. Monorepo Principles & Workspaces

- **Workspaces Configuration**: Root `package.json` defines `"workspaces": ["packages/*", "apps/*"]`.
- **Hoisted Tooling**: React Native build tools (`metro`, `babel`, `typescript`, `jest`) are hoisted to root, preventing nested `node_modules` conflicts.
- **Transpilation & Bundling**: Each app retains its own `metro.config.js` and `babel.config.js` configured with `watchFolders` referencing `packages/` and monorepo root.
- **No Shared Monolithic Binary**: There is no "master app" that wraps all apps. Each app produces its own isolated `.apk` / `.aab` / `.ipa`.

---

## 3. CURRENT vs TARGET vs GAP

### CURRENT
- Monorepo configured with npm workspaces covering `packages/*` and all 8 `apps/*`.
- All 8 app shells created with independent `package.json`, `tsconfig.json`, `babel.config.js`, `metro.config.js`, and `android/` setup.
- Hoisted TypeScript compilation passes with zero errors across all workspaces.
- Dynamic CLI scripts (`scripts/create-app.js` and `scripts/build-app.js`) operational.

### TARGET
- Automated CI/CD pipeline running lint, test, and typecheck across all workspaces on pull requests.
- Selective building via change detection (e.g. only build apps affected by package changes).
- Automated version bumping and changelog generation per app.

### GAP
- GitHub Actions CI/CD workflow needs to be configured for PR validation and automated release tagging.
- Change-detection scripts (e.g. turborepo or custom git diff filters) to avoid building all apps during local verification.
