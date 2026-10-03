import { AnalyticsService, AnalyticsAdapter, EventName } from '../src';

describe('@dailyapps/analytics', () => {
  it('dispatches events to registered adapters', () => {
    const events: { event: EventName; params?: Record<string, any> }[] = [];

    const mockAdapter: AnalyticsAdapter = {
      name: 'mock',
      logEvent: (event, params) => {
        events.push({ event, params });
      },
    };

    const service = new AnalyticsService([mockAdapter]);
    service.logScreenView('CalculatorHome');
    service.logToolOpened('scientific', { from: 'featured_card' });

    expect(events.length).toBe(2);
    expect(events[0].event).toBe('screen_view');
    expect(events[0].params?.screen_name).toBe('CalculatorHome');
    expect(events[1].event).toBe('tool_opened');
    expect(events[1].params?.tool_id).toBe('scientific');
  });

  it('respects setEnabled(false)', () => {
    const events: any[] = [];
    const mockAdapter: AnalyticsAdapter = {
      name: 'mock',
      logEvent: (event) => events.push(event),
    };
    const service = new AnalyticsService([mockAdapter]);
    service.setEnabled(false);
    service.logEvent('tool_completed');
    expect(events.length).toBe(0);
  });
});
