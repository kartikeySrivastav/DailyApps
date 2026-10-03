import { defineAppConfig, AppConfig } from '@dailyapps/config';
import { image_toolsToolCatalog } from './toolCatalog';

export const imagetoolsConfig: AppConfig = defineAppConfig({
  appId: 'image-tools',
  appName: 'image-tools',
  displayName: 'ImageKit',
  packageName: 'com.dailyapps.imagetools',
  bundleId: 'com.dailyapps.imagetools',
  version: '1.0.0',
  buildNumber: 1,
  theme: {
    brandColor: '#ec4899',
    brandSecondary: '#f472b6',
    brandDarkColor: '#db2777',
    defaultMode: 'system',
  },
  features: image_toolsToolCatalog,
  ads: {
    enabled: true,
    testMode: true,
  },
  analytics: {
    enabled: true,
    provider: 'console',
  },
  storeMetadata: {
    appName: 'ImageKit: Photo Compress & Resize',
    shortDescription: 'Compress to target KB, resize dimensions, crop & convert formats.',
    fullDescription: 'ImageKit is a high-speed photo optimization utility providing exact KB target compression, pixel dimension scaling, aspect ratio cropping, and format conversion on device.',
    category: 'Photography',
    contentRating: 'Everyone',
    privacyPolicyUrl: 'https://dailyapps.dev/privacy/image-tools',
    supportEmail: 'support@dailyapps.dev',
  },
});
