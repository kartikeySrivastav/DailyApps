# Shared Storage System (`@dailyapps/storage`)

## 1. Overview

`@dailyapps/storage` provides an asynchronous key-value persistence layer built atop `@react-native-async-storage/async-storage`, engineered specifically for safe monorepo multi-app coexistence.

---

## 2. Namespace Isolation Architecture

To guarantee zero cross-talk between applications:
- Every operation requires an `appId`.
- The factory function `createAppStorage(appId)` encapsulates the namespace:
  ```typescript
  export interface AppStorage {
    getItem<T>(key: string): Promise<T | null>;
    setItem<T>(key: string, value: T): Promise<void>;
    removeItem(key: string): Promise<void>;
    clear(): Promise<void>;
    getAllKeys(): Promise<string[]>;
  }
  ```
- All stored keys are serialized with the standard prefix: `@dailyapps:${appId}:${key}`.
- Calling `clear()` on `calculator` will only query and remove keys starting with `@dailyapps:calculator:`, leaving other apps completely untouched.

---

## 3. CURRENT vs TARGET vs GAP

### CURRENT
- `createAppStorage`, `getItem`, `setItem`, `removeItem`, `clearAppStorage` implemented and covered by unit tests in `packages/storage`.
- In-memory mock storage fallback ensures tests execute reliably in Node environment without native AsyncStorage linkage.
- All 8 apps instantiate their local storage client via their own `appId`.

### TARGET
- High-performance binary storage engine (e.g. MMKV) adapter for high-frequency writes in apps like Money Manager or Image Tools.
- Automatic schema migration utility for backward-compatible data updates across app versions.

### GAP
- MMKV adapter is planned as an optional high-speed backend; currently uses AsyncStorage abstraction.
- Schema migration helper is not yet implemented.
