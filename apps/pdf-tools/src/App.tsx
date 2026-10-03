import React, { useEffect } from 'react';
import { AppConfigProvider } from '@dailyapps/config';
import { ThemeProvider } from '@dailyapps/theme';
import { StorageProvider } from '@dailyapps/storage';
import { AnalyticsProvider } from '@dailyapps/analytics';
import { DailyNavigationContainer } from '@dailyapps/navigation';
import { AdManager } from '@dailyapps/ads';
import { pdftoolsConfig } from './config/app.config';
import { RootNavigator } from './navigation/RootNavigator';

export const App: React.FC = () => {
  useEffect(() => {
    AdManager.initialize(pdftoolsConfig.ads);
  }, []);

  return (
    <AppConfigProvider config={pdftoolsConfig}>
      <ThemeProvider
        brand={{
          brandPrimary: pdftoolsConfig.theme.brandColor,
          brandSecondary: pdftoolsConfig.theme.brandSecondary,
          brandDark: pdftoolsConfig.theme.brandDarkColor,
        }}
        initialMode={pdftoolsConfig.theme.defaultMode}
      >
        <StorageProvider appId={pdftoolsConfig.appId}>
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
