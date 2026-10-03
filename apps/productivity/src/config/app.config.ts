import { defineAppConfig, AppConfig } from '@dailyapps/config';
import { productivityToolCatalog } from './toolCatalog';

export const productivityConfig: AppConfig = defineAppConfig({
  appId: 'productivity',
  appName: 'productivity',
  displayName: 'TaskNest',
  packageName: 'com.dailyapps.productivity',
  bundleId: 'com.dailyapps.productivity',
  version: '1.0.0',
  buildNumber: 1,
  theme: {
    brandColor: '#f59e0b',
    brandSecondary: '#fbbf24',
    brandDarkColor: '#d97706',
    defaultMode: 'system',
  },
  features: productivityToolCatalog,
  ads: {
    enabled: true,
    testMode: true,
  },
  analytics: {
    enabled: true,
    provider: 'console',
  },
  storeMetadata: {
    appName: 'TaskNest: Habits & Focus',
    shortDescription: 'Focus timer, habits, daily checklist & instant notes.',
    fullDescription: 'TaskNest is a distraction-free productivity engine combining Pomodoro focus intervals, habit tracking streaks, task checklists, and quick scratchpads.',
    category: 'Productivity',
    contentRating: 'Everyone',
    privacyPolicyUrl: 'https://dailyapps.dev/privacy/productivity',
    supportEmail: 'support@dailyapps.dev',
  },
});
