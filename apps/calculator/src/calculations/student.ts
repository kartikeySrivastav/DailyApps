/**
 * Student Calculation Engines
 * Standard Indian university & school formulas for Attendance, CGPA, and Marks.
 */

export interface AttendanceInput {
  presentClasses: number;
  totalClasses: number;
  targetPercentage?: number; // default 75%
}

export interface AttendanceResult {
  currentPercentage: number;
  status: 'safe' | 'shortage' | 'on_track';
  canBunkClasses: number;
  mustAttendClasses: number;
  message: string;
}

export function calculateAttendance(input: AttendanceInput): AttendanceResult {
  const { presentClasses, totalClasses, targetPercentage = 75 } = input;

  if (totalClasses <= 0 || presentClasses < 0) {
    return {
      currentPercentage: 0,
      status: 'shortage',
      canBunkClasses: 0,
      mustAttendClasses: 0,
      message: 'Enter valid classes held and attended.',
    };
  }

  const validPresent = Math.min(presentClasses, totalClasses);
  const currentPct = (validPresent / totalClasses) * 100;
  const roundedPct = Math.round(currentPct * 100) / 100;

  if (currentPct >= targetPercentage) {
    // How many classes can be bunked
    // present / (total + b) >= target / 100
    // b <= (present * 100 - target * total) / target
    const canBunk = Math.floor((validPresent * 100 - targetPercentage * totalClasses) / targetPercentage);
    return {
      currentPercentage: roundedPct,
      status: 'safe',
      canBunkClasses: Math.max(0, canBunk),
      mustAttendClasses: 0,
      message: canBunk > 0
        ? `You can safely miss the next ${canBunk} classes without falling below ${targetPercentage}%.`
        : `Your attendance is exactly at your target ${targetPercentage}%. Do not miss any classes!`,
    };
  } else {
    // How many consecutive classes must be attended
    // (present + a) / (total + a) >= target / 100
    // a * (100 - target) >= target * total - 100 * present
    if (targetPercentage >= 100) {
      return {
        currentPercentage: roundedPct,
        status: 'shortage',
        canBunkClasses: 0,
        mustAttendClasses: 0,
        message: '100% attendance cannot be achieved once a class is missed.',
      };
    }
    const needed = Math.ceil((targetPercentage * totalClasses - 100 * validPresent) / (100 - targetPercentage));
    return {
      currentPercentage: roundedPct,
      status: 'shortage',
      canBunkClasses: 0,
      mustAttendClasses: Math.max(0, needed),
      message: `Shortage! You must attend the next ${needed} classes continuously to reach ${targetPercentage}%.`,
    };
  }
}

export interface CGPAInput {
  cgpa: number;
  scaleType: 'cbse_9_5' | 'direct_10' | 'custom';
  customMultiplier?: number;
}

export interface CGPAResult {
  percentage: number;
  division: string;
  formulaDescription: string;
}

export function calculateCGPAToPercentage(input: CGPAInput): CGPAResult {
  const { cgpa, scaleType, customMultiplier = 9.5 } = input;
  let multiplier = 9.5;
  let formulaDesc = 'Standard CBSE & AICTE formula: Percentage = CGPA × 9.5';

  if (scaleType === 'direct_10') {
    multiplier = 10;
    formulaDesc = 'Direct 10-point scale: Percentage = CGPA × 10';
  } else if (scaleType === 'custom') {
    multiplier = customMultiplier;
    formulaDesc = `Custom University formula: Percentage = CGPA × ${multiplier}`;
  }

  const percentage = Math.min(100, Math.round(cgpa * multiplier * 100) / 100);
  let division = 'Pass';
  if (percentage >= 75) division = 'First Class with Distinction';
  else if (percentage >= 60) division = 'First Division / Class';
  else if (percentage >= 50) division = 'Second Division';
  else if (percentage >= 35) division = 'Third Division / Pass';
  else division = 'Needs Improvement';

  return {
    percentage,
    division,
    formulaDescription: formulaDesc,
  };
}

export interface SubjectGrade {
  id: string;
  name: string;
  credits: number;
  gradePoints: number;
}

export function calculateSGPA(subjects: SubjectGrade[]): { sgpa: number; totalCredits: number; totalPoints: number } {
  let totalCredits = 0;
  let totalPoints = 0;

  for (const s of subjects) {
    if (s.credits > 0) {
      totalCredits += s.credits;
      totalPoints += s.credits * s.gradePoints;
    }
  }

  const sgpa = totalCredits > 0 ? Math.round((totalPoints / totalCredits) * 100) / 100 : 0;
  return { sgpa, totalCredits, totalPoints };
}

export interface MarksRequiredInput {
  internalScored: number;
  internalMax: number;
  internalWeightage: number; // e.g. 40%
  targetOverallPct: number; // e.g. 75%
  finalMax: number;
}

export function calculateMarksRequired(input: MarksRequiredInput): { marksNeeded: number; percentageNeeded: number; isPossible: boolean } {
  const { internalScored, internalMax, internalWeightage, targetOverallPct, finalMax } = input;

  const internalContribution = internalMax > 0 ? (internalScored / internalMax) * internalWeightage : 0;
  const finalWeightage = 100 - internalWeightage;

  const neededContribution = targetOverallPct - internalContribution;
  const neededPct = finalWeightage > 0 ? (neededContribution / finalWeightage) * 100 : 0;
  const marksNeeded = Math.ceil((neededPct / 100) * finalMax);

  const isPossible = marksNeeded <= finalMax;
  return {
    marksNeeded: Math.max(0, marksNeeded),
    percentageNeeded: Math.round(neededPct * 10) / 10,
    isPossible,
  };
}
