import React, { useEffect } from 'react';
import { AppConfigProvider } from '@dailyapps/config';
import { ThemeProvider } from '@dailyapps/theme';
import { StorageProvider } from '@dailyapps/storage';
import { AnalyticsProvider } from '@dailyapps/analytics';
import { DailyNavigationContainer } from '@dailyapps/navigation';
import { AdManager } from '@dailyapps/ads';
import { imagetoolsConfig } from './config/app.config';
import { RootNavigator } from './navigation/RootNavigator';

export const App: React.FC = () => {
  useEffect(() => {
    AdManager.initialize(imagetoolsConfig.ads);
  }, []);

  return (
    <AppConfigProvider config={imagetoolsConfig}>
      <ThemeProvider
        brand={{
          brandPrimary: imagetoolsConfig.theme.brandColor,
          brandSecondary: imagetoolsConfig.theme.brandSecondary,
          brandDark: imagetoolsConfig.theme.brandDarkColor,
        }}
        initialMode={imagetoolsConfig.theme.defaultMode}
      >
        <StorageProvider appId={imagetoolsConfig.appId}>
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
