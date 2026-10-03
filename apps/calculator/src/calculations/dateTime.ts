/**
 * Date & Time Suite Calculations
 */

export interface AgeDetails {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  totalHours: number;
  nextBirthdayDays: number;
  zodiac: string;
}

export function getZodiacSign(day: number, month: number): string {
  const signs = [
    { name: 'Capricorn ♑', end: 19 },
    { name: 'Aquarius ♒', end: 18 },
    { name: 'Pisces ♓', end: 20 },
    { name: 'Aries ♈', end: 19 },
    { name: 'Taurus ♉', end: 20 },
    { name: 'Gemini ♊', end: 20 },
    { name: 'Cancer ♋', end: 22 },
    { name: 'Leo ♌', end: 22 },
    { name: 'Virgo ♍', end: 22 },
    { name: 'Libra ♎', end: 22 },
    { name: 'Scorpio ♏', end: 21 },
    { name: 'Sagittarius ♐', end: 21 },
    { name: 'Capricorn ♑', end: 31 },
  ];
  if (month < 1 || month > 12) return 'Unknown';
  return day <= signs[month - 1].end ? signs[month - 1].name : signs[month].name;
}

export function calculateExactAge(birthDate: Date, targetDate: Date = new Date()): AgeDetails {
  let years = targetDate.getFullYear() - birthDate.getFullYear();
  let months = targetDate.getMonth() - birthDate.getMonth();
  let days = targetDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonthLastDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const diffMs = Math.max(0, targetDate.getTime() - birthDate.getTime());
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;
  const totalHours = totalDays * 24;

  // Next birthday
  const nextBday = new Date(targetDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (nextBday.getTime() < targetDate.getTime()) {
    nextBday.setFullYear(targetDate.getFullYear() + 1);
  }
  const nextBdayDiff = nextBday.getTime() - targetDate.getTime();
  const nextBirthdayDays = Math.ceil(nextBdayDiff / (1000 * 60 * 60 * 24));

  const zodiac = getZodiacSign(birthDate.getDate(), birthDate.getMonth() + 1);

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
    totalDays,
    totalWeeks,
    totalMonths,
    totalHours,
    nextBirthdayDays,
    zodiac,
  };
}

export interface DateDiffResult {
  totalDays: number;
  weeks: number;
  remainingDays: number;
  months: number;
  years: number;
}

export function calculateDateDifference(date1: Date, date2: Date): DateDiffResult {
  const start = date1.getTime() <= date2.getTime() ? date1 : date2;
  const end = date1.getTime() <= date2.getTime() ? date2 : date1;

  const diffMs = Math.abs(end.getTime() - start.getTime());
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(totalDays / 7);
  const remainingDays = totalDays % 7;

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  if (end.getDate() < start.getDate()) {
    months--;
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  return {
    totalDays,
    weeks,
    remainingDays,
    months: Math.max(0, years * 12 + months),
    years: Math.max(0, years),
  };
}

export interface AddSubtractResult {
  targetDate: Date;
  formattedDate: string;
  dayOfWeek: string;
}

export function calculateAddSubtractDate(
  startDate: Date,
  daysCount: number,
  operation: 'add' | 'subtract'
): AddSubtractResult {
  const days = operation === 'add' ? daysCount : -daysCount;
  const target = new Date(startDate.getTime());
  target.setDate(target.getDate() + days);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return {
    targetDate: target,
    formattedDate: `${target.getDate()} ${months[target.getMonth()]} ${target.getFullYear()}`,
    dayOfWeek: daysOfWeek[target.getDay()],
  };
}

export interface WorkingDaysResult {
  totalCalendarDays: number;
  businessWorkingDays: number;
  weekendDays: number;
}

export function calculateWorkingDays(startDate: Date, endDate: Date): WorkingDaysResult {
  const start = new Date(Math.min(startDate.getTime(), endDate.getTime()));
  const end = new Date(Math.max(startDate.getTime(), endDate.getTime()));

  let totalCalendarDays = 0;
  let businessWorkingDays = 0;
  let weekendDays = 0;

  const current = new Date(start);
  while (current <= end) {
    totalCalendarDays++;
    const dayOfWeek = current.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekendDays++;
    } else {
      businessWorkingDays++;
    }
    current.setDate(current.getDate() + 1);
  }

  return {
    totalCalendarDays,
    businessWorkingDays,
    weekendDays,
  };
}
