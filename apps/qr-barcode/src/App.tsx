import React, { useEffect } from 'react';
import { AppConfigProvider } from '@dailyapps/config';
import { ThemeProvider } from '@dailyapps/theme';
import { StorageProvider } from '@dailyapps/storage';
import { AnalyticsProvider } from '@dailyapps/analytics';
import { DailyNavigationContainer } from '@dailyapps/navigation';
import { AdManager } from '@dailyapps/ads';
import { qrbarcodeConfig } from './config/app.config';
import { RootNavigator } from './navigation/RootNavigator';

export const App: React.FC = () => {
  useEffect(() => {
    AdManager.initialize(qrbarcodeConfig.ads);
  }, []);

  return (
    <AppConfigProvider config={qrbarcodeConfig}>
      <ThemeProvider
        brand={{
          brandPrimary: qrbarcodeConfig.theme.brandColor,
          brandSecondary: qrbarcodeConfig.theme.brandSecondary,
          brandDark: qrbarcodeConfig.theme.brandDarkColor,
        }}
        initialMode={qrbarcodeConfig.theme.defaultMode}
      >
        <StorageProvider appId={qrbarcodeConfig.appId}>
          <AnalyticsProvider>
            <DailyNavigationContainer>
              <RootNavigator />
            </DailyNavigationContainer>
          </AnalyticsProvider>
        </StorageProvider>
      </ThemeProvider>
    </AppConfigProvider>
  );
};

export default App;
