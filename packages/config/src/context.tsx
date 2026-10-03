import React, { createContext, useContext, ReactNode } from 'react';
import { AppConfig } from './types';

const AppConfigContext = createContext<AppConfig | null>(null);

export interface AppConfigProviderProps {
  config: AppConfig;
  children: ReactNode;
}

export const AppConfigProvider: React.FC<AppConfigProviderProps> = ({ config, children }) => {
  return (
    <AppConfigContext.Provider value={config}>
      {children}
    </AppConfigContext.Provider>
  );
};

export function useAppConfig(): AppConfig {
  const context = useContext(AppConfigContext);
  if (!context) {
    throw new Error('useAppConfig must be used within an AppConfigProvider');
  }
  return context;
}
