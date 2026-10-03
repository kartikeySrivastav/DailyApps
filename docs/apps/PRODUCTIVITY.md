# Productivity App Specification (`apps/productivity`)

## 1. Overview & Purpose
Daily Productivity is an integrated daily management suite combining a focus timer (Pomodoro), habit tracker, daily checklist, and distraction-free quick scratchpad.

## 2. Target Users
- Students managing study sessions and assignment deadlines.
- Knowledge workers seeking deep work intervals without digital distractions.
- Individuals building daily healthy habits and consistent routines.

## 3. Feature Groups
- **Focus Timer**: Customizable work/break intervals, ambient ticking sounds, session statistics.
- **Habit Tracker**: Daily check-offs, streak counters, weekly completion heatmaps.
- **Daily Tasks**: Categorized todo items with priority flags and quick completion.
- **Quick Notes**: Markdown-supported instant scratchpad with copy/share.

## 4. Planned Screens & Navigation
- `Home`: Daily summary dashboard (`DynamicHomeScreen`).
- `FocusTimer`: Circular countdown timer with start/pause/skip and session logs.
- `Habits`: Habit list with current streaks and weekly progress bars.
- `Tasks`: Active/completed task checklists with priority tags.
- `Notes`: Instant note list and editor.
- `Settings`: Notification sound, vibration, Pomodoro defaults (25m/5m/15m).

## 5. UI Requirements
- Circular animated progress ring for focus countdown.
- Satisfying completion animations and haptic ticks on habit check-off.
- Clean amber brand accent (`#f59e0b`).

## 6. Data Model Requirements
- `Habit`: `{ id: string, name: string, frequency: 'daily' | 'weekly', streak: number, completedDates: string[] }`.
- `TaskItem`: `{ id: string, title: string, isCompleted: boolean, priority: 'low' | 'med' | 'high', dueDate?: string }`.
- `FocusSession`: `{ id: string, durationMinutes: number, completedAt: number, tag?: string }`.

## 7. Storage Requirements
- Namespace: `@dailyapps:productivity:*`.
- Key `@dailyapps:productivity:habits`: Array of Habit records.
- Key `@dailyapps:productivity:tasks`: Array of Task items.
- Key `@dailyapps:productivity:focus_stats`: Aggregated session history.

## 8. Permissions
- Android: `POST_NOTIFICATIONS` for timer alarms and habit reminders.

## 9. Ads Configuration
- Banner ad on `HomeScreen`.
- Interstitial ad after completing a focus session (frequency capped).
- Google test IDs configured.

## 10. Analytics
- Namespace: `productivity.*`.
- Events: `productivity.focus_session_completed`, `productivity.habit_checked`, `productivity.task_added`.

## 11. Settings
- Default Pomodoro work duration (default 25 min).
- Short break (5 min) and long break (15 min) intervals.
- Notification sound and vibration preference.

## 12. Accessibility
- Countdown timer provides live accessibility announcements for remaining time intervals.
- High-contrast checkbox markers.

## 13. Platform Considerations
- Android `applicationId`: `com.dailyapps.productivity`.
- Background timer service / local notification scheduling when screen is locked.

## 14. Store Requirements
- Title: Daily Productivity - Habits & Focus
- Category: Productivity
- Content Rating: Everyone (PEGI 3)
- Privacy Policy URL configured.

## 15. Dependencies on Shared Packages
- `@dailyapps/config`, `@dailyapps/theme`, `@dailyapps/ui`, `@dailyapps/navigation`, `@dailyapps/storage`, `@dailyapps/utils`, `@dailyapps/permissions`, `@dailyapps/ads`, `@dailyapps/analytics`.

---

## 16. CURRENT vs TARGET vs GAP

### CURRENT
- App base shell, Android native config, and TypeScript compilation verified.
- `HomeScreen` displaying tool catalog via `DynamicHomeScreen`.
- Independent storage namespace (`@dailyapps:productivity:*`) and AdMob test config wired.

### TARGET
- Background timer execution using local notification channels.
- Interactive habit streak heatmap and task prioritization engine.

### GAP
- Native local notification library linkage (`@notifee/react-native` or similar) for background timer alarms.
- Feature screens (FocusTimer, Habits, Tasks) to be implemented in feature build phase.
