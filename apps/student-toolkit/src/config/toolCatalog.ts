import { AppFeature } from '@dailyapps/config';

export const student_toolkitToolCatalog: AppFeature[] = [
  {
    "id": "gpa_calc",
    "title": "GPA & CGPA Calculator",
    "description": "Calculate semester grade points across 4.0, 5.0, and 10.0 scales",
    "icon": "🎓",
    "route": "GpaCalculator",
    "category": "Academics",
    "isFeatured": true,
    "keywords": [
      "gpa",
      "cgpa",
      "grades",
      "credits"
    ]
  },
  {
    "id": "attendance_calc",
    "title": "Attendance Tracker",
    "description": "Track attendance percentage and calculate safe bunk limits",
    "icon": "📅",
    "route": "AttendanceTracker",
    "category": "Tracker",
    "keywords": [
      "attendance",
      "bunk",
      "classes",
      "percentage"
    ]
  },
  {
    "id": "exam_countdown",
    "title": "Exam & Deadline Countdown",
    "description": "Days left countdown for tests, exams, and assignment deadlines",
    "icon": "⏳",
    "route": "ExamCountdown",
    "category": "Planner",
    "keywords": [
      "exam",
      "test",
      "deadline",
      "countdown"
    ]
  },
  {
    "id": "timetable",
    "title": "Class Schedule & Timetable",
    "description": "Weekly class schedule viewer with subject room details",
    "icon": "🗓️",
    "route": "Timetable",
    "category": "Schedule",
    "keywords": [
      "timetable",
      "schedule",
      "classes",
      "routine"
    ]
  },
  {
    "id": "formulas",
    "title": "Formula Quick-Sheet",
    "description": "Quick searchable formulas for Math, Physics, and Chemistry",
    "icon": "📐",
    "route": "FormulaSheet",
    "category": "Reference",
    "keywords": [
      "formulas",
      "math",
      "physics",
      "science"
    ]
  }
];
