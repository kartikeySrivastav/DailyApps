import { StorageBackend, getDefaultBackend } from './backend';

export class AppStorage {
  private prefix: string;
  private backend: StorageBackend;

  constructor(appId: string, backend?: StorageBackend) {
    if (!appId || typeof appId !== 'string') {
      throw new Error('AppStorage Error: Valid appId is required to initialize isolated storage');
    }
    this.prefix = `@dailyapps:${appId}:`;
    this.backend = backend || getDefaultBackend();
  }

  private formatKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  async getItem(key: string): Promise<string | null> {
    return this.backend.getItem(this.formatKey(key));
  }

  async setItem(key: string, value: string): Promise<void> {
    return this.backend.setItem(this.formatKey(key), value);
  }

  async removeItem(key: string): Promise<void> {
    return this.backend.removeItem(this.formatKey(key));
  }

  async getJson<T>(key: string, fallback: T): Promise<T> {
    const raw = await this.getItem(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  async setJson<T>(key: string, value: T): Promise<void> {
    await this.setItem(key, JSON.stringify(value));
  }

  /**
   * Clears only this app's storage items, guaranteeing isolation from other apps.
   */
  async clearAppStorage(): Promise<void> {
    const allKeys = await this.backend.getAllKeys();
    const appKeys = allKeys.filter((k) => k.startsWith(this.prefix));
    if (appKeys.length > 0) {
      await this.backend.multiRemove(appKeys);
    }
  }

  // Common app preference helpers
  async getFavorites(): Promise<string[]> {
    return this.getJson<string[]>('favorites', []);
  }

  async toggleFavorite(toolId: string): Promise<string[]> {
    const favorites = await this.getFavorites();
    const next = favorites.includes(toolId)
      ? favorites.filter((id) => id !== toolId)
      : [...favorites, toolId];
    await this.setJson('favorites', next);
    return next;
  }

  async getRecentTools(): Promise<string[]> {
    return this.getJson<string[]>('recent_tools', []);
  }

  async addRecentTool(toolId: string, maxItems = 10): Promise<string[]> {
    const recents = await this.getRecentTools();
    const next = [toolId, ...recents.filter((id) => id !== toolId)].slice(0, maxItems);
    await this.setJson('recent_tools', next);
    return next;
  }

  async clearRecentTools(): Promise<void> {
    await this.setJson('recent_tools', []);
  }
}

export function createAppStorage(appId: string, backend?: StorageBackend): AppStorage {
  return new AppStorage(appId, backend);
}
