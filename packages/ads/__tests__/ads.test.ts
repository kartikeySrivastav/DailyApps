import { AdManager, TEST_AD_UNITS } from '../src';

describe('@dailyapps/ads', () => {
  it('returns null when ads are disabled', () => {
    AdManager.initialize({ enabled: false, testMode: true });
    expect(AdManager.getBannerUnitId()).toBeNull();
    expect(AdManager.getInterstitialUnitId()).toBeNull();
  });

  it('returns test ad unit ID when ads are enabled in test mode', () => {
    AdManager.initialize({
      enabled: true,
      testMode: true,
      bannerAdUnitId: 'ca-app-pub-prod-banner',
    });
    // In testMode it must return the safe test unit ID, never the prod ID!
    const bannerId = AdManager.getBannerUnitId();
    expect(bannerId).toBe(TEST_AD_UNITS.android.banner);
  });
});
