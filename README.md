# DailyApps — React Native Utility Apps Monorepo

`DailyApps` is a scalable, modular React Native monorepo engineered to build and maintain multiple independent utility apps under a single unified codebase.

---

## Key Highlights

- 📱 **Multi-App Architecture**: Independent native applications under `apps/*`, each with its own package ID, icons, branding, and Play Store releases.
- 🎨 **Shared Design System**: 20+ accessible UI components in `@dailyapps/ui` paired with tokenized light/dark theming in `@dailyapps/theme`.
- ⚡ **Dynamic Home Screen Engine**: Config-driven landing screen with live search, category filters, featured tools, recents, and favorites.
- 🔒 **Isolated App Storage**: `@dailyapps/storage` enforces strict namespace isolation (`@dailyapps:<appId>:*`) so apps never collide.
- 📢 **Safe Advertising Abstraction**: Centralized AdMob wrapper (`@dailyapps/ads`) enforcing Google test ad IDs in development and test environments.
- 📊 **Pluggable Analytics**: Unified event logging (`screen_view`, `tool_opened`, `tool_completed`) via `@dailyapps/analytics`.

---

## Monorepo Architecture

```text
DailyApps/
│
├── apps/
│   └── calculator/               # Starter app (applicationId: com.dailyapps.calculator)
│
├── packages/
│   ├── theme/                    # Design tokens & ThemeProvider
│   ├── ui/                       # 20+ Reusable UI components & DynamicHomeScreen
│   ├── navigation/               # React Navigation integration & theme bridge
│   ├── storage/                  # App-isolated key-value storage engine
│   ├── utils/                    # Pure formatters, string, validation & async helpers
│   ├── config/                   # AppConfig schema & feature catalog contract
│   ├── ads/                      # AdMob abstraction with test fallbacks
│   ├── analytics/                # Event tracking abstraction
│   ├── permissions/              # Safe on-demand permission checkers
│   └── media/                    # File, image picker & native share abstractions
│
├── scripts/
│   ├── create-app.js             # CLI tool to scaffold new apps
│   ├── build-app.js              # Independent Android build runner
│   └── generate-icons.js         # Adaptive icon guide
│
└── docs/                         # Source of truth documentation suite
    ├── 00_PROJECT_MASTER.md
    ├── 01_ARCHITECTURE.md
    ├── 02_SHARED_UI.md
    ├── 03_SHARED_FUNCTIONALITY.md
    ├── 04_SHARED_UTILITIES.md
    ├── 05_NAVIGATION.md
    ├── 06_STORAGE.md
    ├── 07_ADS_ADMOB.md
    ├── 08_ANALYTICS.md
    ├── 09_BRANDING.md
    ├── 10_PLAY_STORE.md
    ├── 11_TESTING.md
    ├── 12_RELEASE_PROCESS.md
    └── apps/                     # Individual app roadmaps & specifications
```

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Tests
```bash
npm test
```

### 3. Run Typecheck
```bash
npm run typecheck
```

### 4. Run the Starter App (Calculator)
```bash
cd apps/calculator
npm start
# In a separate terminal:
npm run android
```

### 5. Build Release AAB
```bash
node scripts/build-app.js calculator release aab
```

---

## Documentation Links

- 📖 [Project Master Plan](docs/00_PROJECT_MASTER.md)
- 📐 [Architecture Deep Dive](docs/01_ARCHITECTURE.md)
- 🎨 [Shared UI System](docs/02_SHARED_UI.md)
- 🛠️ [Shared Utilities](docs/04_SHARED_UTILITIES.md)
- 🔒 [Isolated Storage](docs/06_STORAGE.md)
- 💰 [AdMob Infrastructure](docs/07_ADS_ADMOB.md)
- 🚀 [Google Play Store Guidelines](docs/10_PLAY_STORE.md)
- 🧪 [Testing & QA](docs/11_TESTING.md)
- 📦 [Release Process](docs/12_RELEASE_PROCESS.md)
- 📱 [App Roadmap Blueprints](docs/apps/)
