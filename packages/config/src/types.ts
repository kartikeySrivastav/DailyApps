export type ThemeMode = 'light' | 'dark' | 'system';

export interface AppThemeConfig {
  /** Primary brand accent color (e.g. #0284c7) */
  brandColor: string;
  /** Secondary accent color */
  brandSecondary?: string;
  /** Dark mode brand accent if different */
  brandDarkColor?: string;
  /** Default theme mode */
  defaultMode?: ThemeMode;
}

export interface AppAdConfig {
  enabled: boolean;
  testMode: boolean;
  adMobAppIdAndroid?: string;
  adMobAppIdIOS?: string;
  bannerAdUnitId?: string;
  interstitialAdUnitId?: string;
  rewardedAdUnitId?: string;
}

export interface AppFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  category?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  badge?: string;
  keywords?: string[];
}

export interface AppAnalyticsConfig {
  enabled: boolean;
  provider?: 'console' | 'firebase' | 'custom';
  debug?: boolean;
}

export interface AppStoreMetadata {
  appName: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  contentRating: string;
  privacyPolicyUrl: string;
  supportEmail: string;
}

export interface AppConfig {
  /** Unique internal app identifier, e.g. 'calculator', 'resumemaker' */
  appId: string;
  /** Internal app name */
  appName: string;
  /** User-visible display name, e.g. 'Calculator' */
  displayName: string;
  /** Android application / package ID, e.g. 'com.dailyapps.calculator' */
  packageName: string;
  /** iOS bundle ID, e.g. 'com.dailyapps.calculator' */
  bundleId: string;
  /** Version string, e.g. '1.0.0' */
  version: string;
  /** Version code / build number */
  buildNumber: number;
  /** Brand theme settings */
  theme: AppThemeConfig;
  /** Tools/features catalog exposed by this app */
  features: AppFeature[];
  /** AdMob configurations */
  ads: AppAdConfig;
  /** Analytics configurations */
  analytics: AppAnalyticsConfig;
  /** Optional store metadata */
  storeMetadata?: AppStoreMetadata;
}
