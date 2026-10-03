import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { AppConfigProvider } from '@dailyapps/config';
import { ThemeProvider } from '@dailyapps/theme';
import { StorageProvider } from '@dailyapps/storage';
import { AnalyticsProvider } from '@dailyapps/analytics';
import { DailyNavigationContainer } from '@dailyapps/navigation';
import { AdManager } from '@dailyapps/ads';
import { resumemakerConfig } from './config/app.config';
import { RootNavigator } from './navigation/RootNavigator';

LogBox.ignoreAllLogs(true);

export const App: React.FC = () => {
  useEffect(() => {
    AdManager.initialize(resumemakerConfig.ads);
  }, []);

  return (
    <AppConfigProvider config={resumemakerConfig}>
      <ThemeProvider
        brand={{
          brandPrimary: resumemakerConfig.theme.brandColor,
          brandSecondary: resumemakerConfig.theme.brandSecondary,
          brandDark: resumemakerConfig.theme.brandDarkColor,
        }}
        initialMode={resumemakerConfig.theme.defaultMode}
      >
        <StorageProvider appId={resumemakerConfig.appId}>
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
