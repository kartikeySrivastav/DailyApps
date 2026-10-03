export interface StorageBackend {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  getAllKeys(): Promise<readonly string[]>;
  multiRemove(keys: readonly string[]): Promise<void>;
}

export class MemoryStorageBackend implements StorageBackend {
  private store = new Map<string, string>();

  async getItem(key: string): Promise<string | null> {
    return this.store.get(key) ?? null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.store.delete(key);
  }

  async getAllKeys(): Promise<readonly string[]> {
    return Array.from(this.store.keys());
  }

  async multiRemove(keys: readonly string[]): Promise<void> {
    keys.forEach((key) => this.store.delete(key));
  }
}

/**
 * Returns AsyncStorage if installed, otherwise safe MemoryStorageBackend.
 */
export function getDefaultBackend(): StorageBackend {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    if (AsyncStorage) return AsyncStorage;
  } catch {
    // Falls back to in-memory store in tests or non-native environments
  }
  return new MemoryStorageBackend();
}
