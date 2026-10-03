import { Platform } from 'react-native';
import { AppAdConfig } from '@dailyapps/config';
import { TEST_AD_UNITS } from './constants';

export class AdManagerService {
  private config: AppAdConfig = {
    enabled: false,
    testMode: true,
  };

  private isInitialized = false;

  initialize(config: AppAdConfig): void {
    this.config = config;
    this.isInitialized = true;
  }

  getInitialized(): boolean {
    return this.isInitialized;
  }

  getBannerUnitId(): string | null {
    if (!this.config.enabled) return null;
    if (this.config.testMode || __DEV__) {
      return Platform.OS === 'ios'
        ? TEST_AD_UNITS.ios.banner
        : TEST_AD_UNITS.android.banner;
    }
    return this.config.bannerAdUnitId || null;
  }

  getInterstitialUnitId(): string | null {
    if (!this.config.enabled) return null;
    if (this.config.testMode || __DEV__) {
      return Platform.OS === 'ios'
        ? TEST_AD_UNITS.ios.interstitial
        : TEST_AD_UNITS.android.interstitial;
    }
    return this.config.interstitialAdUnitId || null;
  }

  getRewardedUnitId(): string | null {
    if (!this.config.enabled) return null;
    if (this.config.testMode || __DEV__) {
      return Platform.OS === 'ios'
        ? TEST_AD_UNITS.ios.rewarded
        : TEST_AD_UNITS.android.rewarded;
    }
    return this.config.rewardedAdUnitId || null;
  }

  async showInterstitial(placement: string): Promise<boolean> {
    if (!this.config.enabled) return false;
    if (__DEV__) {
      console.log(`[Ads] Interstitial requested for placement: "${placement}" (Test Mode)`);
    }
    return true;
  }

  async showRewarded(placement: string): Promise<{ rewarded: boolean }> {
    if (!this.config.enabled) return { rewarded: false };
    if (__DEV__) {
      console.log(`[Ads] Rewarded ad requested for placement: "${placement}" (Test Mode)`);
    }
    return { rewarded: true };
  }
}

export const AdManager = new AdManagerService();
