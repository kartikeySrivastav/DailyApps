import { AppConfig } from './types';

/**
 * Validates that an AppConfig has all required fields and valid identifiers.
 * Throws a descriptive error if invalid.
 */
export function validateAppConfig(config: AppConfig): void {
  if (!config.appId || typeof config.appId !== 'string') {
    throw new Error('AppConfig Error: appId is required and must be a string');
  }
  if (!config.appName || typeof config.appName !== 'string') {
    throw new Error('AppConfig Error: appName is required and must be a string');
  }
  if (!config.displayName || typeof config.displayName !== 'string') {
    throw new Error('AppConfig Error: displayName is required and must be a string');
  }
  if (!config.packageName || !/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/i.test(config.packageName)) {
    throw new Error(`AppConfig Error: invalid packageName "${config.packageName}". Must be in format com.dailyapps.xxx`);
  }
  if (!config.theme || !config.theme.brandColor) {
    throw new Error('AppConfig Error: theme.brandColor is required');
  }
  if (!Array.isArray(config.features)) {
    throw new Error('AppConfig Error: features must be an array of AppFeature');
  }
}

/**
 * Creates and validates an AppConfig object with safe defaults.
 */
export function defineAppConfig(config: AppConfig): AppConfig {
  validateAppConfig(config);
  return {
    ...config,
    ads: {
      adMobAppIdAndroid: config.ads?.adMobAppIdAndroid,
      adMobAppIdIOS: config.ads?.adMobAppIdIOS,
      bannerAdUnitId: config.ads?.bannerAdUnitId,
      interstitialAdUnitId: config.ads?.interstitialAdUnitId,
      rewardedAdUnitId: config.ads?.rewardedAdUnitId,
      enabled: config.ads?.enabled ?? false,
      testMode: config.ads?.testMode ?? true,
    },
    analytics: {
      provider: config.analytics?.provider ?? 'console',
      debug: config.analytics?.debug,
      enabled: config.analytics?.enabled ?? false,
    },
  };
}
