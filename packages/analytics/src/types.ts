export type StandardEventName =
  | 'screen_view'
  | 'tool_opened'
  | 'tool_completed'
  | 'ad_shown'
  | 'ad_clicked'
  | 'feature_used'
  | 'error';

export type EventName = StandardEventName | (string & {});

export interface AnalyticsAdapter {
  name: string;
  logEvent: (event: EventName, params?: Record<string, any>) => void;
  setUserProperty?: (name: string, value: string) => void;
}
