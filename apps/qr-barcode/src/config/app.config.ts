import { defineAppConfig, AppConfig } from '@dailyapps/config';
import { qr_barcodeToolCatalog } from './toolCatalog';

export const qrbarcodeConfig: AppConfig = defineAppConfig({
  appId: 'qr-barcode',
  appName: 'qr-barcode',
  displayName: 'QRKit',
  packageName: 'com.dailyapps.qrbarcode',
  bundleId: 'com.dailyapps.qrbarcode',
  version: '1.0.0',
  buildNumber: 1,
  theme: {
    brandColor: '#06b6d4',
    brandSecondary: '#22d3ee',
    brandDarkColor: '#0891b2',
    defaultMode: 'system',
  },
  features: qr_barcodeToolCatalog,
  ads: {
    enabled: true,
    testMode: true,
  },
  analytics: {
    enabled: true,
    provider: 'console',
  },
  storeMetadata: {
    appName: 'QRKit: Fast Scanner & Generator',
    shortDescription: 'Live camera barcode reader, batch scanner & offline QR generator.',
    fullDescription: 'QRKit is an instant camera scanner and QR generator for reading UPC, EAN, and QR codes without latency or privacy tracking.',
    category: 'Tools',
    contentRating: 'Everyone',
    privacyPolicyUrl: 'https://dailyapps.dev/privacy/qr-barcode',
    supportEmail: 'support@dailyapps.dev',
  },
});
