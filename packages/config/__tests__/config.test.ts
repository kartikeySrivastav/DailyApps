import { defineAppConfig, validateAppConfig } from '../src';

describe('@dailyapps/config', () => {
  const validConfig = {
    appId: 'calculator',
    appName: 'calculator',
    displayName: 'Daily Calculator',
    packageName: 'com.dailyapps.calculator',
    bundleId: 'com.dailyapps.calculator',
    version: '1.0.0',
    buildNumber: 1,
    theme: {
      brandColor: '#0284c7',
    },
    features: [
      {
        id: 'basic',
        title: 'Basic Calculator',
        description: 'Standard arithmetic calculation',
        icon: 'calculator',
        route: 'BasicCalculator',
      },
    ],
    ads: {
      enabled: false,
      testMode: true,
    },
    analytics: {
      enabled: false,
    },
  };

  it('validates a complete configuration correctly', () => {
    expect(() => validateAppConfig(validConfig)).not.toThrow();
    const config = defineAppConfig(validConfig);
    expect(config.appId).toBe('calculator');
    expect(config.ads.testMode).toBe(true);
  });

  it('throws when package name is invalid', () => {
    const invalid = { ...validConfig, packageName: 'invalid_packagename' };
    expect(() => validateAppConfig(invalid)).toThrow(/invalid packageName/i);
  });

  it('throws when appId is missing', () => {
    const invalid = { ...validConfig, appId: '' };
    expect(() => validateAppConfig(invalid)).toThrow(/appId is required/i);
  });
});
