import React, { useEffect } from 'react';
import { AppConfigProvider } from '@dailyapps/config';
import { ThemeProvider } from '@dailyapps/theme';
import { StorageProvider } from '@dailyapps/storage';
import { AnalyticsProvider } from '@dailyapps/analytics';
import { DailyNavigationContainer } from '@dailyapps/navigation';
import { AdManager } from '@dailyapps/ads';
import { productivityConfig } from './config/app.config';
import { RootNavigator } from './navigation/RootNavigator';

export const App: React.FC = () => {
  useEffect(() => {
    AdManager.initialize(productivityConfig.ads);
  }, []);

  return (
    <AppConfigProvider config={productivityConfig}>
      <ThemeProvider
        brand={{
          brandPrimary: productivityConfig.theme.brandColor,
          brandSecondary: productivityConfig.theme.brandSecondary,
          brandDark: productivityConfig.theme.brandDarkColor,
        }}
        initialMode={productivityConfig.theme.defaultMode}
      >
        <StorageProvider appId={productivityConfig.appId}>
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
