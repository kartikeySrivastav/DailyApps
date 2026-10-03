import { defineAppConfig, AppConfig } from '@dailyapps/config';
import { pdf_toolsToolCatalog } from './toolCatalog';

export const pdftoolsConfig: AppConfig = defineAppConfig({
  appId: 'pdf-tools',
  appName: 'pdf-tools',
  displayName: 'DocCraft',
  packageName: 'com.dailyapps.pdftools',
  bundleId: 'com.dailyapps.pdftools',
  version: '1.0.0',
  buildNumber: 1,
  theme: {
    brandColor: '#ef4444',
    brandSecondary: '#f87171',
    brandDarkColor: '#dc2626',
    defaultMode: 'system',
  },
  features: pdf_toolsToolCatalog,
  ads: {
    enabled: true,
    testMode: true,
  },
  analytics: {
    enabled: true,
    provider: 'console',
  },
  storeMetadata: {
    appName: 'DocCraft: PDF Tools & Scanner',
    shortDescription: 'Merge, split, compress, scan & convert documents offline.',
    fullDescription: 'DocCraft is an offline-first PDF suite allowing instant document scanning, images-to-PDF conversion, PDF merging, splitting, and compression without cloud upload risks.',
    category: 'Tools',
    contentRating: 'Everyone',
    privacyPolicyUrl: 'https://dailyapps.dev/privacy/pdf-tools',
    supportEmail: 'support@dailyapps.dev',
  },
});
