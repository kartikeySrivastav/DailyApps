import { AppFeature } from '@dailyapps/config';

export const productivityToolCatalog: AppFeature[] = [
  {
    "id": "pomodoro",
    "title": "Pomodoro Focus Timer",
    "description": "25/5 focus cycles with custom work/break intervals",
    "icon": "⏱️",
    "route": "PomodoroTimer",
    "category": "Focus",
    "isFeatured": true,
    "keywords": [
      "timer",
      "focus",
      "pomodoro",
      "work"
    ]
  },
  {
    "id": "habit_tracker",
    "title": "Daily Habit Tracker",
    "description": "Build consistency with streak tracking & completion rates",
    "icon": "🔥",
    "route": "HabitTracker",
    "category": "Habits",
    "keywords": [
      "habit",
      "streak",
      "routine",
      "goals"
    ]
  },
  {
    "id": "checklist",
    "title": "Daily Task Checklist",
    "description": "Organize today's to-do items with priority tags",
    "icon": "✅",
    "route": "DailyChecklist",
    "category": "Tasks",
    "keywords": [
      "todo",
      "checklist",
      "tasks",
      "priority"
    ]
  },
  {
    "id": "notes",
    "title": "Quick Notes & Ideas",
    "description": "Capture instant thoughts and lightweight markdown notes",
    "icon": "📝",
    "route": "QuickNotes",
    "category": "Notes",
    "keywords": [
      "notes",
      "memo",
      "markdown",
      "scratchpad"
    ]
  }
];
