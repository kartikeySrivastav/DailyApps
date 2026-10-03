import { defineAppConfig, AppConfig } from '@dailyapps/config';
import { money_managerToolCatalog } from './toolCatalog';

export const moneymanagerConfig: AppConfig = defineAppConfig({
  appId: 'money-manager',
  appName: 'money-manager',
  displayName: 'MoneyTrack',
  packageName: 'com.dailyapps.moneymanager',
  bundleId: 'com.dailyapps.moneymanager',
  version: '1.0.0',
  buildNumber: 1,
  theme: {
    brandColor: '#8b5cf6',
    brandSecondary: '#a78bfa',
    brandDarkColor: '#7c3aed',
    defaultMode: 'system',
  },
  features: money_managerToolCatalog,
  ads: {
    enabled: true,
    testMode: true,
  },
  analytics: {
    enabled: true,
    provider: 'console',
  },
  storeMetadata: {
    appName: 'MoneyTrack: Offline Expense & Budget',
    shortDescription: 'Private offline expense tracker, budgets & financial insights.',
    fullDescription: 'MoneyTrack is a private, zero-tracking personal finance manager for logging daily expenses, establishing monthly category budgets, and visualizing spending patterns offline.',
    category: 'Finance',
    contentRating: 'Everyone',
    privacyPolicyUrl: 'https://dailyapps.dev/privacy/money-manager',
    supportEmail: 'support@dailyapps.dev',
  },
});
