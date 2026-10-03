# Student Toolkit App Specification (`apps/student-toolkit`)

## 1. Overview & Purpose
Daily Student Toolkit is a targeted academic utility app assisting high school and university students with GPA/CGPA computation, attendance tracking with bunk tolerance limits, timetable scheduling, and quick formula sheets.

## 2. Target Users
- College and university students tracking semester grade point averages.
- High school students organizing weekly class timetables.
- Students monitoring mandatory attendance percentages (e.g. 75% rule).

## 3. Feature Groups
- **GPA & CGPA Calculator**: Semester GPA computation with custom grading scales (4.0, 10.0 scale) and credit weightings.
- **Attendance & Bunk Tracker**: Subject-wise attendance logger calculating exact classes you can safely miss or must attend to maintain requirements.
- **Class Timetable**: Interactive weekly schedule with room numbers and teacher tags.
- **Formula Cheat Sheets**: Quick offline reference for Math, Physics, and Chemistry formulas.

## 4. Planned Screens & Navigation
- `Home`: Academic dashboard with current semester GPA and low-attendance warnings (`DynamicHomeScreen`).
- `GpaCalculator`: Subject course credits, grade picker, and real-time GPA recalculation.
- `AttendanceTracker`: Subject list with +1/-1 quick check-in buttons and bunk safety status.
- `Timetable`: Day-by-day weekly schedule grid.
- `FormulaSheets`: Categorized searchable formula cards with copy/share.
- `Settings`: Grading scale selection (4.0, 5.0, 10.0, Percentage), minimum attendance threshold (e.g. 75%).

## 5. UI Requirements
- Instant one-tap attendance check-in buttons.
- Clear color badges for attendance safety (Green: Safe to miss, Red: Low attendance warning).
- Energetic academic royal blue brand accent (`#3b82f6`).

## 6. Data Model Requirements
- `SemesterCourse`: `{ id: string, name: string, credits: number, gradePoint: number }`.
- `SubjectAttendance`: `{ id: string, subjectName: string, attended: number, total: number, targetPercentage: number }`.

## 7. Storage Requirements
- Namespace: `@dailyapps:studenttoolkit:*`.
- Key `@dailyapps:studenttoolkit:semesters`: Stored semester grades and cumulative CGPA.
- Key `@dailyapps:studenttoolkit:attendance`: Array of subject attendance records.
- Key `@dailyapps:studenttoolkit:timetable`: Weekly schedule items.

## 8. Permissions
- Android: `POST_NOTIFICATIONS` for class timetable reminders (optional).

## 9. Ads Configuration
- Banner ad on `HomeScreen` and formula sheets.
- Interstitial ad after calculating final semester GPA.
- Google test IDs configured.

## 10. Analytics
- Namespace: `studenttoolkit.*`.
- Events: `studenttoolkit.gpa_calculated`, `studenttoolkit.attendance_updated`, `studenttoolkit.timetable_viewed`.

## 11. Settings
- Grading system selector (10.0 scale, 4.0 scale, letter grades).
- Attendance target percentage (default 75%).
- Theme mode (Light / Dark).

## 12. Accessibility
- High-contrast attendance alert badges with accessible status text.
- Large keypad buttons for grade entry.

## 13. Platform Considerations
- Android `applicationId`: `com.dailyapps.studenttoolkit`.
- Full offline capability for classroom usage without Wi-Fi.

## 14. Store Requirements
- Title: Daily Student Toolkit - GPA & Timetable
- Category: Education / Productivity
- Content Rating: Everyone (PEGI 3)
- Privacy Policy URL configured.

## 15. Dependencies on Shared Packages
- `@dailyapps/config`, `@dailyapps/theme`, `@dailyapps/ui`, `@dailyapps/navigation`, `@dailyapps/storage`, `@dailyapps/utils`, `@dailyapps/ads`, `@dailyapps/analytics`.

---

## 16. CURRENT vs TARGET vs GAP

### CURRENT
- App base shell, Android native config, and TypeScript compilation verified.
- `HomeScreen` displaying tool catalog via `DynamicHomeScreen`.
- Independent storage namespace (`@dailyapps:studenttoolkit:*`) and AdMob test config wired.

### TARGET
- Complete GPA calculation algorithms covering Indian 10-point, US 4-point, and European ECTS grading systems.
- Timetable local alarm notifications 10 minutes before class.

### GAP
- Grading algorithms to be added to tool screen logic.
- Attendance tracker and timetable screens to be implemented in feature phase.
