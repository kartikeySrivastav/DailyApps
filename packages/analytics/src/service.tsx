import React, { createContext, useContext, ReactNode } from 'react';
import { AnalyticsAdapter, EventName } from './types';
import { ConsoleAnalyticsAdapter } from './adapters/console';

export class AnalyticsService {
  private adapters: AnalyticsAdapter[] = [];
  private enabled = true;

  constructor(adapters: AnalyticsAdapter[] = [new ConsoleAnalyticsAdapter()]) {
    this.adapters = adapters;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  addAdapter(adapter: AnalyticsAdapter): void {
    this.adapters.push(adapter);
  }

  logEvent(event: EventName, params?: Record<string, any>): void {
    if (!this.enabled) return;
    for (const adapter of this.adapters) {
      try {
        adapter.logEvent(event, params);
      } catch (err) {
        console.error(`[Analytics] Error logging to ${adapter.name}:`, err);
      }
    }
  }

  logScreenView(screenName: string, params?: Record<string, any>): void {
    this.logEvent('screen_view', { screen_name: screenName, ...params });
  }

  logToolOpened(toolId: string, params?: Record<string, any>): void {
    this.logEvent('tool_opened', { tool_id: toolId, ...params });
  }

  logToolCompleted(toolId: string, params?: Record<string, any>): void {
    this.logEvent('tool_completed', { tool_id: toolId, ...params });
  }
}

export const defaultAnalytics = new AnalyticsService();

const AnalyticsContext = createContext<AnalyticsService>(defaultAnalytics);

export interface AnalyticsProviderProps {
  service?: AnalyticsService;
  children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  service = defaultAnalytics,
  children,
}) => {
  return (
    <AnalyticsContext.Provider value={service}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export function useAnalytics(): AnalyticsService {
  return useContext(AnalyticsContext);
}
