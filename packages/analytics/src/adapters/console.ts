import { AnalyticsAdapter, EventName } from '../types';

export class ConsoleAnalyticsAdapter implements AnalyticsAdapter {
  name = 'console';

  logEvent(event: EventName, params?: Record<string, any>): void {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.log(`[Analytics:Event] ${event}`, params || {});
    }
  }

  setUserProperty(name: string, value: string): void {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.log(`[Analytics:UserProp] ${name} = ${value}`);
    }
  }
}
