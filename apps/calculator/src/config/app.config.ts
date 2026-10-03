import { defineAppConfig, AppConfig } from '@dailyapps/config';
import { calculatorToolCatalog } from './toolCatalog';

export const calculatorConfig: AppConfig = defineAppConfig({
  appId: 'calculator',
  appName: 'calculator',
  displayName: 'SmartCalc',
  packageName: 'com.dailyapps.calculator',
  bundleId: 'com.dailyapps.calculator',
  version: '1.0.0',
  buildNumber: 1,
  theme: {
    brandColor: '#0284c7', // Sky Blue brand accent
    brandSecondary: '#38bdf8',
    brandDarkColor: '#0ea5e9',
    defaultMode: 'system',
  },
  features: calculatorToolCatalog,
  ads: {
    enabled: true,
    testMode: true,
  },
  analytics: {
    enabled: true,
    provider: 'console',
  },
  storeMetadata: {
    appName: 'SmartCalc: All-in-One',
    shortDescription: 'Clean, fast all-in-one calculator, converter & finance toolkit.',
    fullDescription: 'SmartCalc is an elegant utility suite combining basic arithmetic, financial calculations (EMI, GST, discount, percentage), date math, and unit conversions in one lightweight, private app.',
    category: 'Productivity',
    contentRating: 'Everyone',
    privacyPolicyUrl: 'https://dailyapps.dev/privacy/calculator',
    supportEmail: 'support@dailyapps.dev',
  },
});
