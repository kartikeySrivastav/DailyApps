import { defineAppConfig, AppConfig } from '@dailyapps/config';
import { student_toolkitToolCatalog } from './toolCatalog';

export const studenttoolkitConfig: AppConfig = defineAppConfig({
  appId: 'student-toolkit',
  appName: 'student-toolkit',
  displayName: 'StudyKit',
  packageName: 'com.dailyapps.studenttoolkit',
  bundleId: 'com.dailyapps.studenttoolkit',
  version: '1.0.0',
  buildNumber: 1,
  theme: {
    brandColor: '#3b82f6',
    brandSecondary: '#60a5fa',
    brandDarkColor: '#2563eb',
    defaultMode: 'system',
  },
  features: student_toolkitToolCatalog,
  ads: {
    enabled: true,
    testMode: true,
  },
  analytics: {
    enabled: true,
    provider: 'console',
  },
  storeMetadata: {
    appName: 'StudyKit: GPA, Timetable & Formulas',
    shortDescription: 'GPA & CGPA calculator, bunk tracker & offline formula sheets.',
    fullDescription: 'StudyKit is an academic assistant designed for college and high school students to compute cumulative GPAs, manage class attendance safety, and view reference formula sheets.',
    category: 'Education',
    contentRating: 'Everyone',
    privacyPolicyUrl: 'https://dailyapps.dev/privacy/student-toolkit',
    supportEmail: 'support@dailyapps.dev',
  },
});
