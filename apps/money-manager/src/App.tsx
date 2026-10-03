import React, { useEffect } from 'react';
import { AppConfigProvider } from '@dailyapps/config';
import { ThemeProvider } from '@dailyapps/theme';
import { StorageProvider } from '@dailyapps/storage';
import { AnalyticsProvider } from '@dailyapps/analytics';
import { DailyNavigationContainer } from '@dailyapps/navigation';
import { AdManager } from '@dailyapps/ads';
import { moneymanagerConfig } from './config/app.config';
import { RootNavigator } from './navigation/RootNavigator';

export const App: React.FC = () => {
  useEffect(() => {
    AdManager.initialize(moneymanagerConfig.ads);
  }, []);

  return (
    <AppConfigProvider config={moneymanagerConfig}>
      <ThemeProvider
        brand={{
          brandPrimary: moneymanagerConfig.theme.brandColor,
          brandSecondary: moneymanagerConfig.theme.brandSecondary,
          brandDark: moneymanagerConfig.theme.brandDarkColor,
        }}
        initialMode={moneymanagerConfig.theme.defaultMode}
      >
        <StorageProvider appId={moneymanagerConfig.appId}>
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
