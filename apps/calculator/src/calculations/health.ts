export interface BMIInput {
  weightKg: number;
  heightCm: number;
  age?: number;
  gender?: 'male' | 'female';
}

export type BMICategory =
  | 'Underweight'
  | 'Normal Weight'
  | 'Overweight'
  | 'Obesity Class I'
  | 'Obesity Class II'
  | 'Severe Obesity';

export interface BMIResult {
  bmi: number;
  category: BMICategory;
  categoryColor: string;
  idealWeightRange: { min: number; max: number };
  bmr?: number; // Basal Metabolic Rate in kcal
  disclaimer: string;
}

export const HEALTH_DISCLAIMER =
  'Disclaimer: This calculator provides estimates for educational and fitness informational purposes only. It is not intended as medical diagnosis, advice, or treatment. Consult a licensed healthcare professional for medical guidance.';

export function validateBMIInput(input: BMIInput): { isValid: boolean; error?: string } {
  if (input.weightKg <= 10 || input.weightKg > 350 || isNaN(input.weightKg)) {
    return { isValid: false, error: 'Weight must be between 10 kg and 350 kg' };
  }
  if (input.heightCm <= 50 || input.heightCm > 260 || isNaN(input.heightCm)) {
    return { isValid: false, error: 'Height must be between 50 cm and 260 cm' };
  }
  return { isValid: true };
}

/**
 * Pure calculation function for BMI & Ideal Body Weight (WHO Standard)
 * Formula: BMI = Weight (kg) / (Height (m))^2
 */
export function calculateBMI(input: BMIInput): BMIResult {
  const { weightKg, heightCm, age = 25, gender = 'male' } = input;

  if (weightKg <= 0 || heightCm <= 0) {
    return {
      bmi: 0,
      category: 'Normal Weight',
      categoryColor: '#10B981',
      idealWeightRange: { min: 0, max: 0 },
      disclaimer: HEALTH_DISCLAIMER,
    };
  }

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  let category: BMICategory = 'Normal Weight';
  let categoryColor = '#10B981'; // green

  if (bmi < 18.5) {
    category = 'Underweight';
    categoryColor = '#3B82F6'; // blue
  } else if (bmi < 25.0) {
    category = 'Normal Weight';
    categoryColor = '#10B981'; // green
  } else if (bmi < 30.0) {
    category = 'Overweight';
    categoryColor = '#F59E0B'; // amber
  } else if (bmi < 35.0) {
    category = 'Obesity Class I';
    categoryColor = '#F97316'; // orange
  } else {
    category = 'Severe Obesity';
    categoryColor = '#EF4444'; // red
  }

  // WHO Ideal weight range based on normal BMI (18.5 - 24.9)
  const minIdeal = 18.5 * (heightM * heightM);
  const maxIdeal = 24.9 * (heightM * heightM);

  // Mifflin-St Jeor Equation for BMR
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  bmr = gender === 'male' ? bmr + 5 : bmr - 161;

  return {
    bmi: Number(bmi.toFixed(1)),
    category,
    categoryColor,
    idealWeightRange: {
      min: Math.round(minIdeal),
      max: Math.round(maxIdeal),
    },
    bmr: Math.round(bmr),
    disclaimer: HEALTH_DISCLAIMER,
  };
}

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export interface CalorieTDEEResult {
  bmr: number;
  tdee: number;
  weightLossCalories: number;
  extremeLossCalories: number;
  muscleGainCalories: number;
  proteinGrams: number;
}

export function calculateTDEE(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female',
  activity: ActivityLevel
): CalorieTDEEResult {
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  bmr = gender === 'male' ? bmr + 5 : bmr - 161;

  const multipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const tdee = Math.round(bmr * (multipliers[activity] || 1.2));
  const weightLossCalories = Math.round(tdee - 500); // 0.5kg/week loss
  const extremeLossCalories = Math.round(tdee - 750); // 0.75kg/week loss
  const muscleGainCalories = Math.round(tdee + 300); // lean surplus
  const proteinGrams = Math.round(weightKg * 1.8); // 1.8g/kg body weight

  return {
    bmr: Math.round(bmr),
    tdee,
    weightLossCalories,
    extremeLossCalories,
    muscleGainCalories,
    proteinGrams,
  };
}

export interface WaterIntakeResult {
  dailyLiters: number;
  glasses250ml: number;
  exerciseAdjustmentLiters: number;
  totalLiters: number;
}

export function calculateWaterIntake(weightKg: number, workoutMins: number = 30): WaterIntakeResult {
  if (weightKg <= 0) return { dailyLiters: 0, glasses250ml: 0, exerciseAdjustmentLiters: 0, totalLiters: 0 };
  // Baseline: 35ml per kg body weight
  const baseLiters = (weightKg * 35) / 1000;
  // Exercise addition: ~350ml per 30 mins workout
  const exerciseAdjustment = (workoutMins / 30) * 0.35;
  const totalLiters = Number((baseLiters + exerciseAdjustment).toFixed(1));
  const glasses = Math.round((totalLiters * 1000) / 250);

  return {
    dailyLiters: Number(baseLiters.toFixed(1)),
    glasses250ml: glasses,
    exerciseAdjustmentLiters: Number(exerciseAdjustment.toFixed(1)),
    totalLiters,
  };
}

export interface BodyFatResult {
  bodyFatPct: number;
  fatMassKg: number;
  leanMassKg: number;
  category: string;
}

export function calculateBodyFat(
  gender: 'male' | 'female',
  heightCm: number,
  weightKg: number,
  waistCm: number,
  neckCm: number,
  hipCm: number = 95
): BodyFatResult {
  if (heightCm <= 0 || waistCm <= 0 || neckCm <= 0) {
    return { bodyFatPct: 0, fatMassKg: 0, leanMassKg: 0, category: 'Unknown' };
  }

  let bodyFatPct = 0;
  if (gender === 'male') {
    // US Navy formula: 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
    const diff = Math.max(1, waistCm - neckCm);
    bodyFatPct = 495 / (1.0324 - 0.19077 * Math.log10(diff) + 0.15456 * Math.log10(heightCm)) - 450;
  } else {
    // Female: 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height)) - 450
    const sum = Math.max(1, waistCm + hipCm - neckCm);
    bodyFatPct = 495 / (1.29579 - 0.35004 * Math.log10(sum) + 0.22100 * Math.log10(heightCm)) - 450;
  }

  bodyFatPct = Math.max(3, Math.min(60, Number(bodyFatPct.toFixed(1))));
  const fatMassKg = Number(((weightKg * bodyFatPct) / 100).toFixed(1));
  const leanMassKg = Number((weightKg - fatMassKg).toFixed(1));

  let category = 'Average';
  if (gender === 'male') {
    if (bodyFatPct < 6) category = 'Essential Fat';
    else if (bodyFatPct <= 13) category = 'Athletes';
    else if (bodyFatPct <= 17) category = 'Fitness';
    else if (bodyFatPct <= 24) category = 'Average';
    else category = 'Obese';
  } else {
    if (bodyFatPct < 14) category = 'Essential Fat';
    else if (bodyFatPct <= 20) category = 'Athletes';
    else if (bodyFatPct <= 24) category = 'Fitness';
    else if (bodyFatPct <= 31) category = 'Average';
    else category = 'Obese';
  }

  return {
    bodyFatPct,
    fatMassKg,
    leanMassKg,
    category,
  };
}

export interface WorkoutExercisePreset {
  id: string;
  name: string;
  category: 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core' | 'calisthenics';
  isCompound: boolean;
  baseMET: number;
  icon: string;
}

export const PRESET_EXERCISES: WorkoutExercisePreset[] = [
  { id: 'bench_press', name: 'Barbell Bench Press', category: 'chest', isCompound: true, baseMET: 6.5, icon: '🏋️' },
  { id: 'squats', name: 'Barbell Back Squats', category: 'legs', isCompound: true, baseMET: 7.5, icon: '🦵' },
  { id: 'deadlifts', name: 'Barbell Deadlifts', category: 'back', isCompound: true, baseMET: 8.0, icon: '🏋️' },
  { id: 'overhead_press', name: 'Overhead Shoulder Press', category: 'shoulders', isCompound: true, baseMET: 6.0, icon: '💪' },
  { id: 'barbell_row', name: 'Bent-Over Barbell Row', category: 'back', isCompound: true, baseMET: 6.5, icon: '🏋️' },
  { id: 'pullups', name: 'Pull-ups / Chin-ups', category: 'calisthenics', isCompound: true, baseMET: 7.0, icon: '🧗' },
  { id: 'pushups', name: 'Standard Push-ups', category: 'calisthenics', isCompound: false, baseMET: 5.0, icon: '🤸' },
  { id: 'bicep_curls', name: 'Dumbbell Bicep Curls', category: 'arms', isCompound: false, baseMET: 4.5, icon: '💪' },
  { id: 'leg_press', name: 'Machine Leg Press', category: 'legs', isCompound: true, baseMET: 6.5, icon: '🦵' },
  { id: 'lateral_raise', name: 'Dumbbell Lateral Raise', category: 'shoulders', isCompound: false, baseMET: 4.0, icon: '🕊️' },
];

export interface OneRepMaxResult {
  oneRepMax: number;
  epley1RM: number;
  brzycki1RM: number;
  totalVolumeKg: number;
  repPercentages: {
    percentage: number;
    estimatedWeightKg: number;
    targetReps: string;
  }[];
}

export function calculate1RM(weightKg: number, reps: number, sets: number = 1): OneRepMaxResult {
  if (weightKg <= 0 || reps <= 0) {
    return {
      oneRepMax: 0,
      epley1RM: 0,
      brzycki1RM: 0,
      totalVolumeKg: 0,
      repPercentages: [],
    };
  }

  let epley = weightKg;
  let brzycki = weightKg;

  if (reps === 1) {
    epley = weightKg;
    brzycki = weightKg;
  } else {
    // Epley Formula: 1RM = Weight * (1 + Reps / 30)
    epley = weightKg * (1 + reps / 30);
    // Brzycki Formula: 1RM = Weight / (1.0278 - 0.0278 * Reps)
    brzycki = reps < 36 ? weightKg / (1.0278 - 0.0278 * reps) : epley;
  }

  const oneRepMax = Math.round((epley + brzycki) / 2);
  const totalVolumeKg = Math.round(weightKg * reps * sets);

  const pctTiers = [
    { pct: 100, reps: '1 Rep Max' },
    { pct: 95, reps: '~2 Reps' },
    { pct: 90, reps: '~3-4 Reps' },
    { pct: 85, reps: '~5-6 Reps' },
    { pct: 80, reps: '~7-8 Reps' },
    { pct: 75, reps: '~9-10 Reps' },
    { pct: 70, reps: '~11-12 Reps' },
    { pct: 65, reps: '~15 Reps' },
  ];

  const repPercentages = pctTiers.map((tier) => ({
    percentage: tier.pct,
    estimatedWeightKg: Math.round((oneRepMax * tier.pct) / 100),
    targetReps: tier.reps,
  }));

  return {
    oneRepMax,
    epley1RM: Math.round(epley),
    brzycki1RM: Math.round(brzycki),
    totalVolumeKg,
    repPercentages,
  };
}

export interface StrengthBurnInput {
  exerciseName: string;
  isCompound: boolean;
  baseMET?: number;
  weightLiftedKg: number;
  userBodyWeightKg: number;
  reps: number;
  sets: number;
  restSeconds: number;
  intensity: 'light' | 'moderate' | 'heavy' | 'failure';
}

export interface StrengthBurnResult {
  activeCalories: number;
  epocAfterburnCalories: number;
  totalCaloriesBurned: number;
  totalDurationMinutes: number;
  timeUnderTensionSeconds: number;
  totalRestMinutes: number;
  totalVolumeKg: number;
  intensityMultiplier: number;
}

export function calculateStrengthWorkoutBurn(input: StrengthBurnInput): StrengthBurnResult {
  const {
    isCompound,
    baseMET = isCompound ? 6.5 : 4.5,
    weightLiftedKg,
    userBodyWeightKg,
    reps,
    sets,
    restSeconds,
    intensity,
  } = input;

  if (sets <= 0 || reps <= 0 || userBodyWeightKg <= 0) {
    return {
      activeCalories: 0,
      epocAfterburnCalories: 0,
      totalCaloriesBurned: 0,
      totalDurationMinutes: 0,
      timeUnderTensionSeconds: 0,
      totalRestMinutes: 0,
      totalVolumeKg: 0,
      intensityMultiplier: 1,
    };
  }

  // Time Under Tension: average 3.5 seconds per repetition
  const secondsPerRep = 3.5;
  const timeUnderTensionSeconds = Math.round(reps * sets * secondsPerRep);
  const activeWorkMinutes = timeUnderTensionSeconds / 60;

  // Rest duration: rest between sets (sets - 1)
  const totalRestSeconds = Math.max(0, sets - 1) * restSeconds;
  const totalRestMinutes = totalRestSeconds / 60;
  const totalDurationMinutes = Number((activeWorkMinutes + totalRestMinutes).toFixed(1));

  // Intensity scaling
  const intensityMap: Record<string, number> = {
    light: 0.9,
    moderate: 1.0,
    heavy: 1.25,
    failure: 1.4,
  };
  const intensityMultiplier = intensityMap[intensity] || 1.0;

  // Additional load factor: heavier weight increases metabolic cost
  const loadRatio = weightLiftedKg > 0 ? Math.min(2.0, 1 + (weightLiftedKg / userBodyWeightKg) * 0.35) : 1.0;

  // Active lifting energy expenditure (kcal/min = MET * 3.5 * weightKg / 200)
  const activeMET = baseMET * intensityMultiplier * loadRatio;
  const activeLiftingBurn = (activeMET * 3.5 * userBodyWeightKg / 200) * activeWorkMinutes;

  // Rest period expenditure (MET ~1.5 - 2.0 while recovering)
  const restMET = 1.8;
  const restBurn = (restMET * 3.5 * userBodyWeightKg / 200) * totalRestMinutes;

  const rawActiveCalories = activeLiftingBurn + restBurn;

  // EPOC (Excess Post-Exercise Oxygen Consumption afterburn):
  // Heavy resistance training yields 10% to 15% post-workout burn
  const epocPct = intensity === 'failure' || intensity === 'heavy' ? 0.15 : 0.10;
  const epocAfterburn = rawActiveCalories * epocPct;

  const totalCalories = Math.round(rawActiveCalories + epocAfterburn);
  const totalVolumeKg = Math.round(weightLiftedKg * reps * sets);

  return {
    activeCalories: Math.round(rawActiveCalories),
    epocAfterburnCalories: Math.round(epocAfterburn),
    totalCaloriesBurned: totalCalories,
    totalDurationMinutes,
    timeUnderTensionSeconds,
    totalRestMinutes: Number(totalRestMinutes.toFixed(1)),
    totalVolumeKg,
    intensityMultiplier,
  };
}

export interface CardioPreset {
  id: string;
  name: string;
  met: number;
  icon: string;
}

export const CARDIO_PRESETS: CardioPreset[] = [
  { id: 'running_moderate', name: 'Outdoor Running (8 km/h)', met: 8.3, icon: '🏃' },
  { id: 'running_fast', name: 'Fast Running (10+ km/h)', met: 10.5, icon: '⚡' },
  { id: 'cycling_moderate', name: 'Cycling (Moderate 15-20 km/h)', met: 7.5, icon: '🚴' },
  { id: 'hiit', name: 'HIIT / Circuit Training', met: 10.0, icon: '🔥' },
  { id: 'jump_rope', name: 'Jump Rope / Skipping', met: 11.8, icon: '🪢' },
  { id: 'swimming', name: 'Swimming (Freestyle)', met: 8.0, icon: '🏊' },
  { id: 'rowing', name: 'Rowing Machine', met: 7.0, icon: '🚣' },
  { id: 'badminton', name: 'Badminton / Tennis', met: 6.0, icon: '🏸' },
  { id: 'yoga', name: 'Power Yoga / Stretching', met: 3.5, icon: '🧘' },
];

export function calculateCardioBurn(
  userBodyWeightKg: number,
  durationMinutes: number,
  met: number
): {
  caloriesBurned: number;
  fatGramsBurned: number;
  equivalentWalkingKm: number;
} {
  if (userBodyWeightKg <= 0 || durationMinutes <= 0 || met <= 0) {
    return { caloriesBurned: 0, fatGramsBurned: 0, equivalentWalkingKm: 0 };
  }

  // Formula: Calories = (MET * 3.5 * weightKg / 200) * durationMinutes
  const caloriesBurned = Math.round((met * 3.5 * userBodyWeightKg / 200) * durationMinutes);
  // 1g fat ~= 7.7 kcal
  const fatGramsBurned = Number((caloriesBurned / 7.7).toFixed(1));
  // Average brisk walking burns ~50 kcal per km for a 70kg person
  const walkingKcalPerKm = (3.5 * 3.5 * userBodyWeightKg / 200) * (60 / 5); // 5km/h walking
  const equivalentWalkingKm = Number((caloriesBurned / Math.max(20, walkingKcalPerKm)).toFixed(1));

  return {
    caloriesBurned,
    fatGramsBurned,
    equivalentWalkingKm,
  };
}

