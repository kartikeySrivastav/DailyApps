import React, { useEffect } from 'react';
import { AppConfigProvider } from '@dailyapps/config';
import { ThemeProvider } from '@dailyapps/theme';
import { StorageProvider } from '@dailyapps/storage';
import { AnalyticsProvider } from '@dailyapps/analytics';
import { DailyNavigationContainer } from '@dailyapps/navigation';
import { AdManager } from '@dailyapps/ads';
import { studenttoolkitConfig } from './config/app.config';
import { RootNavigator } from './navigation/RootNavigator';

export const App: React.FC = () => {
  useEffect(() => {
    AdManager.initialize(studenttoolkitConfig.ads);
  }, []);

  return (
    <AppConfigProvider config={studenttoolkitConfig}>
      <ThemeProvider
        brand={{
          brandPrimary: studenttoolkitConfig.theme.brandColor,
          brandSecondary: studenttoolkitConfig.theme.brandSecondary,
          brandDark: studenttoolkitConfig.theme.brandDarkColor,
        }}
        initialMode={studenttoolkitConfig.theme.defaultMode}
      >
        <StorageProvider appId={studenttoolkitConfig.appId}>
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
