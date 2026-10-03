import React, { useEffect } from 'react';
import { AppConfigProvider } from '@dailyapps/config';
import { ThemeProvider } from '@dailyapps/theme';
import { StorageProvider } from '@dailyapps/storage';
import { AnalyticsProvider } from '@dailyapps/analytics';
import { DailyNavigationContainer } from '@dailyapps/navigation';
import { AdManager } from '@dailyapps/ads';
import { calculatorConfig } from './config/app.config';
import { RootNavigator } from './navigation/RootNavigator';
import { CalculatorErrorBoundary } from './components';

export const App: React.FC = () => {
  useEffect(() => {
    // Initialize ads configuration for Calculator
    AdManager.initialize(calculatorConfig.ads);
  }, []);

  return (
    <AppConfigProvider config={calculatorConfig}>
      <ThemeProvider
        brand={{
          brandPrimary: calculatorConfig.theme.brandColor,
          brandSecondary: calculatorConfig.theme.brandSecondary,
          brandDark: calculatorConfig.theme.brandDarkColor,
        }}
        initialMode={calculatorConfig.theme.defaultMode}
      >
        <StorageProvider appId={calculatorConfig.appId}>
          <AnalyticsProvider>
            <CalculatorErrorBoundary fallbackTitle="SmartCalc App Error">
              <DailyNavigationContainer>
                <RootNavigator />
              </DailyNavigationContainer>
            </CalculatorErrorBoundary>
          </AnalyticsProvider>
        </StorageProvider>
      </ThemeProvider>
    </AppConfigProvider>
  );
};

export default App;
