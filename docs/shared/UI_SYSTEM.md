# Shared UI System (`@dailyapps/ui`)

## 1. Overview

`@dailyapps/ui` provides a rich suite of customizable, accessible, and theme-aware React Native components, along with the reusable `DynamicHomeScreen` presentation engine.

---

## 2. Component Inventory

The package exports over 20 core presentation primitives:
- **Layout & Structure**: `Screen`, `Header`, `Card`, `Divider`, `DynamicHomeScreen`
- **Actions & Controls**: `Button`, `IconButton`, `SegmentedControl`, `Tabs`
- **Inputs**: `Input`, `SearchInput`
- **Feedback & Overlays**: `Dialog`, `Modal`, `BottomSheet`, `Badge`, `ProgressBar`
- **States**: `LoadingIndicator`, `EmptyState`, `ErrorView`
- **Data Display**: `ListItem`, `Accordion`

### DynamicHomeScreen Engine
The `DynamicHomeScreen` is a generic presentation component that takes:
- `title` & `subtitle`
- `brandColor`
- `categories`: Array of category filters (`all`, `basic`, `financial`, etc.)
- `tools`: Catalog items (`id`, `title`, `description`, `icon`, `category`, `isNew`, `isPopular`)
- `onToolPress`: Callback when a tool card is tapped
- `onSettingsPress`: Callback to navigate to settings
- `headerRight` & `bannerAd`: Optional slots

It handles search filtering, category pill selection, and responsive card rendering without hardcoding any app-specific knowledge.

---

## 3. CURRENT vs TARGET vs GAP

### CURRENT
- Complete suite of 20+ UI components implemented in `packages/ui/src/components`.
- `DynamicHomeScreen` implemented as a pure reusable engine.
- Full TypeScript definitions and theme integration via `@dailyapps/theme`.
- Zero app-specific logic or hardcoded tools inside `packages/ui`.

### TARGET
- Interactive Storybook or component showcase catalog app for visually previewing all components in isolation.
- Built-in micro-animations using `react-native-reanimated` for smooth card transitions and category chip filtering.

### GAP
- Storybook environment not yet integrated into monorepo.
- Micro-animations currently use standard React Native `Animated` / layout transitions; upgrade to Reanimated planned for future polish.
