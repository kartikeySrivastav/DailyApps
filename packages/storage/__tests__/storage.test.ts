import { createAppStorage, MemoryStorageBackend } from '../src';

describe('@dailyapps/storage', () => {
  it('enforces app isolation across shared storage backend', async () => {
    const sharedBackend = new MemoryStorageBackend();

    const calcStorage = createAppStorage('calculator', sharedBackend);
    const resumeStorage = createAppStorage('resume-maker', sharedBackend);

    await calcStorage.setItem('theme', 'dark');
    await resumeStorage.setItem('theme', 'light');

    expect(await calcStorage.getItem('theme')).toBe('dark');
    expect(await resumeStorage.getItem('theme')).toBe('light');

    // Test clearAppStorage isolation
    await calcStorage.clearAppStorage();
    expect(await calcStorage.getItem('theme')).toBeNull();
    // Resume maker data must remain untouched!
    expect(await resumeStorage.getItem('theme')).toBe('light');
  });

  it('manages favorites and recents per app', async () => {
    const backend = new MemoryStorageBackend();
    const storage = createAppStorage('calculator', backend);

    await storage.toggleFavorite('scientific');
    let favs = await storage.getFavorites();
    expect(favs).toEqual(['scientific']);

    await storage.toggleFavorite('scientific');
    favs = await storage.getFavorites();
    expect(favs).toEqual([]);

    await storage.addRecentTool('gst');
    await storage.addRecentTool('discount');
    const recents = await storage.getRecentTools();
    expect(recents).toEqual(['discount', 'gst']);
  });
});
