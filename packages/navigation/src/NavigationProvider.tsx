import React, { ReactNode } from 'react';
import { useTheme } from '@dailyapps/theme';
import { createNavigationTheme } from './types';

let NavigationContainerComponent: any = null;
try {
  NavigationContainerComponent = require('@react-navigation/native').NavigationContainer;
} catch {
  // Graceful fallback if @react-navigation/native is not installed in test environment
}

export interface NavigationProviderProps {
  children: ReactNode;
  onReady?: () => void;
  onStateChange?: (state: any) => void;
}

export const DailyNavigationContainer: React.FC<NavigationProviderProps> = ({
  children,
  onReady,
  onStateChange,
}) => {
  const theme = useTheme();
  const navTheme = createNavigationTheme(theme);

  if (NavigationContainerComponent) {
    return (
      <NavigationContainerComponent
        theme={navTheme}
        onReady={onReady}
        onStateChange={onStateChange}
      >
        {children}
      </NavigationContainerComponent>
    );
  }

  return <>{children}</>;
};
