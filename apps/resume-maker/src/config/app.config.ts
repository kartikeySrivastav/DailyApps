import { defineAppConfig, AppConfig } from '@dailyapps/config';
import { resume_makerToolCatalog } from './toolCatalog';

export const resumemakerConfig: AppConfig = defineAppConfig({
  appId: 'resume-maker',
  appName: 'resume-maker',
  displayName: 'ProResume Builder',
  packageName: 'com.dailyapps.resumemaker',
  bundleId: 'com.dailyapps.resumemaker',
  version: '1.0.0',
  buildNumber: 1,
  theme: {
    brandColor: '#2563EB',
    brandSecondary: '#EC4899',
    brandDarkColor: '#1E40AF',
    defaultMode: 'light',
  },
  features: resume_makerToolCatalog,
  ads: {
    enabled: true,
    testMode: true,
  },
  analytics: {
    enabled: true,
    provider: 'console',
  },
  storeMetadata: {
    appName: 'ProResume Builder - ATS CV Maker',
    shortDescription: 'Create professional ATS-ready resumes & CVs in minutes. Free, offline & no subscription.',
    fullDescription: 'ProResume Builder empowers job seekers to create clean, professional, ATS-compliant PDF resumes and CVs in minutes. No subscriptions. Works 100% offline.',
    category: 'Business',
    contentRating: 'Everyone',
    privacyPolicyUrl: 'https://dailyapps.dev/privacy/resume-maker',
    supportEmail: 'support@dailyapps.dev',
  },
});
