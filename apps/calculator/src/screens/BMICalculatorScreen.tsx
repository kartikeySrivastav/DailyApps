import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { ScreenContainer, Card } from '@dailyapps/ui';
import {
  CalculatorHeader,
  ResultHeroCard,
  PresetPills,
  CalcInputField,
  BreakdownRow,
  SegmentedTabs,
  FormulaTabs,
  CalculationHistoryModal,
} from '../components';
import { useTheme } from '@dailyapps/theme';
import { useAnalytics } from '@dailyapps/analytics';
import { useCalculationHistory } from '../hooks';
import {
  calculateBMI,
  calculateTDEE,
  calculateWaterIntake,
  calculateBodyFat,
  calculate1RM,
  calculateStrengthWorkoutBurn,
  calculateCardioBurn,
  PRESET_EXERCISES,
  CARDIO_PRESETS,
  ActivityLevel,
} from '../calculations/health';

interface BMICalculatorScreenProps {
  navigation: any;
  route?: any;
}

type HealthMode = 'bmi' | 'calorie' | 'water' | 'body_fat' | 'workout';

export const BMICalculatorScreen: React.FC<BMICalculatorScreenProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const analytics = useAnalytics();

  const tool = route?.params?.tool;
  const initialMode: HealthMode =
    tool?.id === 'calorie' || tool?.id === 'tdee'
      ? 'calorie'
      : tool?.id === 'water'
      ? 'water'
      : tool?.id === 'body_fat'
      ? 'body_fat'
      : 'bmi';

  const [mode, setMode] = useState<HealthMode>(initialMode);

  // Common inputs
  const [weight, setWeight] = useState('72');
  const [height, setHeight] = useState('175');
  const [age, setAge] = useState('26');
  const [gender, setGender] = useState<'male' | 'female'>('male');

  // Calorie specific
  const [activity, setActivity] = useState<ActivityLevel>('moderate');

  // Water specific
  const [workoutMins, setWorkoutMins] = useState('45');

  // Body Fat specific
  const [waist, setWaist] = useState('84');
  const [neck, setNeck] = useState('38');
  const [hip, setHip] = useState('98');

  // History modal
  const [showHistory, setShowHistory] = useState(false);
  const { history, saveCalculation, deleteItem, clearHistory } = useCalculationHistory(
    mode,
    '❤️ Health'
  );

  useEffect(() => {
    analytics.logScreenView('HealthSuiteCalculatorScreen');
  }, [analytics]);

  const numWeight = parseFloat(weight) || 0;
  const numHeight = parseFloat(height) || 0;
  const numAge = parseInt(age, 10) || 25;
  const numWorkout = parseInt(workoutMins, 10) || 0;
  const numWaist = parseFloat(waist) || 0;
  const numNeck = parseFloat(neck) || 0;
  const numHip = parseFloat(hip) || 95;

  // Calorie & Diet Goal specific
  const [dietGoal, setDietGoal] = useState<'high_protein' | 'balanced' | 'keto'>('high_protein');

  // Calculations
  const bmiResult = useMemo(() => {
    return calculateBMI({
      weightKg: numWeight,
      heightCm: numHeight,
      age: numAge,
      gender,
    });
  }, [numWeight, numHeight, numAge, gender]);

  const tdeeResult = useMemo(() => {
    return calculateTDEE(numWeight, numHeight, numAge, gender, activity);
  }, [numWeight, numHeight, numAge, gender, activity]);

  const macros = useMemo(() => {
    const calories = tdeeResult.tdee;
    if (dietGoal === 'high_protein') {
      // 30% Protein, 40% Carbs, 30% Fat
      const proteinG = Math.round((calories * 0.30) / 4);
      const carbsG = Math.round((calories * 0.40) / 4);
      const fatsG = Math.round((calories * 0.30) / 9);
      return { proteinG, carbsG, fatsG, proteinPct: 30, carbsPct: 40, fatsPct: 30 };
    } else if (dietGoal === 'keto') {
      // 25% Protein, 5% Carbs, 70% Fat
      const proteinG = Math.round((calories * 0.25) / 4);
      const carbsG = Math.round((calories * 0.05) / 4);
      const fatsG = Math.round((calories * 0.70) / 9);
      return { proteinG, carbsG, fatsG, proteinPct: 25, carbsPct: 5, fatsPct: 70 };
    } else {
      // Balanced: 20% Protein, 50% Carbs, 30% Fat
      const proteinG = Math.round((calories * 0.20) / 4);
      const carbsG = Math.round((calories * 0.50) / 4);
      const fatsG = Math.round((calories * 0.30) / 9);
      return { proteinG, carbsG, fatsG, proteinPct: 20, carbsPct: 50, fatsPct: 30 };
    }
  }, [tdeeResult.tdee, dietGoal]);

  const waterResult = useMemo(() => {
    return calculateWaterIntake(numWeight, numWorkout);
  }, [numWeight, numWorkout]);

  const bodyFatResult = useMemo(() => {
    return calculateBodyFat(gender, numHeight, numWeight, numWaist, numNeck, numHip);
  }, [gender, numHeight, numWeight, numWaist, numNeck, numHip]);

  // Hydration interactive glass tracker state
  const [consumedGlasses, setConsumedGlasses] = useState(0);

  // Workout & 1RM specific states
  const [workoutType, setWorkoutType] = useState<'strength' | 'cardio'>('strength');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('bench_press');
  const [exerciseFilter, setExerciseFilter] = useState<'all' | 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'calisthenics'>('all');
  const [weightLifted, setWeightLifted] = useState('80');
  const [reps, setReps] = useState('3');
  const [sets, setSets] = useState('4');
  const [restSeconds, setRestSeconds] = useState(90);
  const [intensity, setIntensity] = useState<'light' | 'moderate' | 'heavy' | 'failure'>('heavy');

  // Cardio specific states
  const [selectedCardioId, setSelectedCardioId] = useState('running_moderate');
  const [cardioMins, setCardioMins] = useState('30');

  const numWeightLifted = parseFloat(weightLifted) || 0;
  const numReps = parseInt(reps, 10) || 0;
  const numSets = parseInt(sets, 10) || 1;
  const numCardioMins = parseInt(cardioMins, 10) || 0;

  const allExercises = useMemo(() => {
    return PRESET_EXERCISES;
  }, []);

  const currentPreset = useMemo(() => {
    return allExercises.find((e) => e.id === selectedExerciseId) || allExercises[0];
  }, [selectedExerciseId, allExercises]);

  const filteredExercises = useMemo(() => {
    if (exerciseFilter === 'all') return allExercises;
    return allExercises.filter((e) => e.category === exerciseFilter);
  }, [allExercises, exerciseFilter]);

  const allCardioPresets = useMemo(() => {
    return CARDIO_PRESETS;
  }, []);

  // Olympic Barbell Plate Loading Calculator (20kg bar)
  const plateBreakdown = useMemo(() => {
    const barWeight = 20;
    if (numWeightLifted < barWeight) {
      return 'Dumbbell / Machine Load';
    }
    if (numWeightLifted === barWeight) {
      return 'Olympic Barbell (20 kg) with No Plates';
    }
    let perSide = (numWeightLifted - barWeight) / 2;
    const plates = [25, 20, 15, 10, 5, 2.5, 1.25];
    const usedPlates: string[] = [];
    for (const p of plates) {
      const count = Math.floor(perSide / p);
      if (count > 0) {
        usedPlates.push(`${count}×${p}kg`);
        perSide -= count * p;
      }
    }
    return `Olympic Bar (20kg) + Each Side: ${usedPlates.join(' + ') || '0kg'}`;
  }, [numWeightLifted]);

  // Dynamic Rep Range Goal Indicator
  const repGoalBadge = useMemo(() => {
    if (numReps <= 3) return { label: '⚡ Max Strength & Powerlifting (1-3 reps)', color: '#EF4444' };
    if (numReps <= 6) return { label: '🏋️ Heavy Strength Building (4-6 reps)', color: '#F59E0B' };
    if (numReps <= 12) return { label: '💪 Hypertrophy & Muscle Growth (7-12 reps)', color: '#10B981' };
    return { label: '🔥 Muscular Endurance & Conditioning (13+ reps)', color: '#3B82F6' };
  }, [numReps]);

  const strength1RM = useMemo(() => {
    return calculate1RM(numWeightLifted, numReps, numSets);
  }, [numWeightLifted, numReps, numSets]);

  const strengthBurn = useMemo(() => {
    const isCompound = currentPreset.isCompound;
    const baseMET = currentPreset.baseMET;
    return calculateStrengthWorkoutBurn({
      exerciseName: currentPreset.name,
      isCompound,
      baseMET,
      weightLiftedKg: numWeightLifted,
      userBodyWeightKg: numWeight,
      reps: numReps,
      sets: numSets,
      restSeconds,
      intensity,
    });
  }, [
    currentPreset,
    numWeightLifted,
    numWeight,
    numReps,
    numSets,
    restSeconds,
    intensity,
  ]);

  const cardioBurn = useMemo(() => {
    const preset = allCardioPresets.find((c) => c.id === selectedCardioId) || CARDIO_PRESETS[0];
    const met = preset.met;
    return calculateCardioBurn(numWeight, numCardioMins, met);
  }, [allCardioPresets, selectedCardioId, numWeight, numCardioMins]);

  // Reset inputs
  const handleReset = () => {
    setWeight('72');
    setHeight('175');
    setAge('26');
    setGender('male');
    setActivity('moderate');
    setWorkoutMins('45');
    setWaist('84');
    setNeck('38');
    setHip('98');
  };

  // Auto-record calculation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mode === 'bmi' && bmiResult.bmi > 0) {
        saveCalculation({
          toolId: 'bmi',
          toolName: 'BMI Calculator',
          category: '❤️ Health',
          title: `BMI ${bmiResult.bmi} (${bmiResult.category})`,
          subtitle: `Weight: ${numWeight}kg | Height: ${numHeight}cm`,
          result: `${bmiResult.category} (${bmiResult.bmi})`,
          badge: bmiResult.category.toUpperCase(),
          inputs: { weight, height, age, gender },
        });
      } else if (mode === 'calorie' && tdeeResult.tdee > 0) {
        saveCalculation({
          toolId: 'calorie',
          toolName: 'Daily Calories & TDEE',
          category: '❤️ Health',
          title: `TDEE: ${tdeeResult.tdee} kcal/day`,
          subtitle: `Weight Loss: ${tdeeResult.weightLossCalories} kcal | Gain: ${tdeeResult.muscleGainCalories} kcal`,
          result: `${tdeeResult.tdee} kcal`,
          badge: 'MAINTENANCE',
          inputs: { weight, height, age, gender, activity },
        });
      } else if (mode === 'water' && waterResult.totalLiters > 0) {
        saveCalculation({
          toolId: 'water',
          toolName: 'Daily Hydration Intake',
          category: '❤️ Health',
          title: `${waterResult.totalLiters} L/day (${waterResult.glasses250ml} glasses)`,
          subtitle: `Base: ${waterResult.dailyLiters}L + Workout: ${waterResult.exerciseAdjustmentLiters}L`,
          result: `${waterResult.totalLiters} Liters`,
          badge: 'HYDRATION',
          inputs: { weight, workoutMins },
        });
      } else if (mode === 'body_fat' && bodyFatResult.bodyFatPct > 0) {
        saveCalculation({
          toolId: 'body_fat',
          toolName: 'Body Fat Percentage',
          category: '❤️ Health',
          title: `${bodyFatResult.bodyFatPct}% Body Fat (${bodyFatResult.category})`,
          subtitle: `Fat Mass: ${bodyFatResult.fatMassKg}kg | Lean: ${bodyFatResult.leanMassKg}kg`,
          result: `${bodyFatResult.bodyFatPct}% Fat`,
          badge: bodyFatResult.category.toUpperCase(),
          inputs: { weight, height, waist, neck, hip, gender },
        });
      } else if (mode === 'workout' && (strength1RM.oneRepMax > 0 || cardioBurn.caloriesBurned > 0)) {
        if (workoutType === 'strength') {
          saveCalculation({
            toolId: 'workout',
            toolName: 'Gym Workout & 1RM',
            category: '❤️ Health',
            title: `1RM: ${strength1RM.oneRepMax} kg (${currentPreset.name})`,
            subtitle: `${strengthBurn.totalCaloriesBurned} kcal burned | ${strengthBurn.totalVolumeKg} kg volume lifted`,
            result: `${strength1RM.oneRepMax} kg 1RM`,
            badge: `${numWeightLifted}KG × ${numReps}R`,
            inputs: { weightLifted, reps, sets, restSeconds, intensity },
          });
        } else {
          saveCalculation({
            toolId: 'workout',
            toolName: 'Cardio & Conditioning',
            category: '❤️ Health',
            title: `${cardioBurn.caloriesBurned} kcal burned (${selectedCardioId})`,
            subtitle: `Duration: ${cardioMins} mins | ~${cardioBurn.fatGramsBurned}g fat loss`,
            result: `${cardioBurn.caloriesBurned} kcal`,
            badge: `${cardioMins} MINS`,
            inputs: { cardioMins, selectedCardioId },
          });
        }
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [
    mode,
    bmiResult,
    tdeeResult,
    waterResult,
    bodyFatResult,
    strength1RM,
    strengthBurn,
    cardioBurn,
    numWeight,
    numHeight,
    numAge,
    gender,
    weight,
    height,
    age,
    activity,
    workoutMins,
    waist,
    neck,
    hip,
    workoutType,
    currentPreset,
    numWeightLifted,
    numReps,
    weightLifted,
    reps,
    sets,
    restSeconds,
    intensity,
    selectedCardioId,
    cardioMins,
    saveCalculation,
  ]);

  return (
    <ScreenContainer safeArea withPadding={false}>
      <CalculatorHeader
        title="Health & Fitness Suite"
        subtitle="BMI, Calories, Water, Fat & Workouts"
        icon="❤️"
        category="❤️ Health"
        toolId={tool?.id || 'health_suite'}
        onBack={() => navigation.goBack()}
        onHistory={() => setShowHistory(true)}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Category Multi-Mode Tabs */}
        <SegmentedTabs
          scrollable
          activeTab={mode}
          onTabChange={(key) => setMode(key as HealthMode)}
          tabs={[
            { key: 'bmi', label: 'BMI Status', icon: '⚖️' },
            { key: 'calorie', label: 'Daily Calories', icon: '🔥' },
            { key: 'water', label: 'Hydration', icon: '💧' },
            { key: 'body_fat', label: 'Body Fat %', icon: '📏' },
            { key: 'workout', label: 'Gym & 1RM', icon: '🏋️' },
          ]}
        />

        {/* ========================================================================= */}
        {/* 1. BMI TAB */}
        {/* ========================================================================= */}
        {mode === 'bmi' && (
          <>
            <ResultHeroCard
              title="Body Mass Index"
              value={`${bmiResult.bmi}`}
              subText={`Status: ${bmiResult.category}`}
              badgeText={bmiResult.category.toUpperCase()}
              badgeType={
                bmiResult.category === 'Normal Weight'
                  ? 'success'
                  : bmiResult.category === 'Overweight'
                  ? 'warning'
                  : 'danger'
              }
              secondaryStats={[
                { label: 'Ideal Weight', value: `${bmiResult.idealWeightRange.min}-${bmiResult.idealWeightRange.max} kg` },
                { label: 'BMR', value: `${bmiResult.bmr} kcal` },
                { label: 'Height', value: `${numHeight} cm` },
              ]}
            />

            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Body Metrics</Text>

              {/* Gender selector */}
              <SegmentedTabs
                activeTab={gender}
                onTabChange={(key) => setGender(key as 'male' | 'female')}
                tabs={[
                  { key: 'male', label: 'Male', icon: '👨' },
                  { key: 'female', label: 'Female', icon: '👩' },
                ]}
              />

              <CalcInputField
                label="Weight"
                suffix="kg"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
                placeholder="e.g. 70"
              />
              <PresetPills
                options={[{ label: '60kg', value: '60' }, { label: '70kg', value: '70' }, { label: '80kg', value: '80' }, { label: '90kg', value: '90' }]}
                selectedValue={weight}
                onSelect={(val) => setWeight(String(val))}
              />

              <CalcInputField
                label="Height"
                suffix="cm"
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
                placeholder="e.g. 175"
              />
              <PresetPills
                options={[{ label: '160cm', value: '160' }, { label: '170cm', value: '170' }, { label: '175cm', value: '175' }, { label: '180cm', value: '180' }]}
                selectedValue={height}
                onSelect={(val) => setHeight(String(val))}
              />

              <CalcInputField
                label="Age"
                suffix="years"
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
                placeholder="e.g. 25"
              />

              <TouchableOpacity
                onPress={handleReset}
                activeOpacity={0.7}
                style={[
                  styles.resetButton,
                  {
                    backgroundColor: theme.isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2',
                    borderColor: theme.isDark ? 'rgba(239, 68, 68, 0.3)' : '#FCA5A5',
                  },
                ]}
              >
                <Text style={[styles.resetButtonText, { color: '#EF4444' }]}>↺ Reset Inputs</Text>
              </TouchableOpacity>
            </Card>

            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>WHO Standard Classification</Text>
              <BreakdownRow label="Underweight (< 18.5)" value="Lower Risk" showDivider />
              <BreakdownRow label="Normal Weight (18.5 - 24.9)" value="Optimal Health" valueColor="#10B981" isBold={bmiResult.category === 'Normal Weight'} showDivider />
              <BreakdownRow label="Overweight (25.0 - 29.9)" value="Moderate Risk" valueColor="#F59E0B" isBold={bmiResult.category === 'Overweight'} showDivider />
              <BreakdownRow label="Obesity Class I (30.0 - 34.9)" value="High Risk" valueColor="#F97316" isBold={bmiResult.category === 'Obesity Class I'} showDivider />
              <BreakdownRow label="Severe Obesity (≥ 35.0)" value="Very High Risk" valueColor="#EF4444" isBold={bmiResult.category === 'Severe Obesity'} />
            </Card>
          </>
        )}

        {/* ========================================================================= */}
        {/* 2. CALORIE & TDEE TAB */}
        {/* ========================================================================= */}
        {mode === 'calorie' && (
          <>
            <ResultHeroCard
              title="Maintenance Calories (TDEE)"
              value={`${tdeeResult.tdee} kcal`}
              subText="Daily energy requirement to maintain weight"
              badgeText="DAILY TDEE"
              badgeType="info"
              secondaryStats={[
                { label: 'Weight Loss', value: `${tdeeResult.weightLossCalories} kcal` },
                { label: 'Muscle Gain', value: `${tdeeResult.muscleGainCalories} kcal` },
                { label: 'Daily Protein', value: `${tdeeResult.proteinGrams}g` },
              ]}
            />

            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Activity & Body Stats</Text>

              <CalcInputField
                label="Weight"
                suffix="kg"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />
              <CalcInputField
                label="Height"
                suffix="cm"
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
              />
              <CalcInputField
                label="Age"
                suffix="years"
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
              />

              <Text style={[styles.subTitle, { color: theme.colors.textMuted }]}>Daily Activity Level</Text>
              <PresetPills
                options={[
                  { label: 'Desk Job', value: 'sedentary' },
                  { label: 'Light (1-3d)', value: 'light' },
                  { label: 'Moderate (3-5d)', value: 'moderate' },
                  { label: 'Active (6-7d)', value: 'active' },
                ]}
                selectedValue={activity}
                onSelect={(val) => setActivity(val as ActivityLevel)}
              />

              <TouchableOpacity
                onPress={handleReset}
                activeOpacity={0.7}
                style={[
                  styles.resetButton,
                  {
                    backgroundColor: theme.isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2',
                    borderColor: theme.isDark ? 'rgba(239, 68, 68, 0.3)' : '#FCA5A5',
                  },
                ]}
              >
                <Text style={[styles.resetButtonText, { color: '#EF4444' }]}>↺ Reset Inputs</Text>
              </TouchableOpacity>
            </Card>

            {/* Daily Macronutrient Distribution Card */}
            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Daily Macronutrient Split (Grams)</Text>
              
              <Text style={[styles.sectionSubtitle, { color: theme.colors.textMuted }]}>
                Dietary Goal & Macro Ratio
              </Text>
              <PresetPills
                options={[
                  { label: 'High Protein (30P/40C/30F)', value: 'high_protein' },
                  { label: 'Balanced (20P/50C/30F)', value: 'balanced' },
                  { label: 'Keto (25P/5C/70F)', value: 'keto' },
                ]}
                selectedValue={dietGoal}
                onSelect={(val) => setDietGoal(val as any)}
              />

              {/* 3 Macro Columns */}
              <View style={styles.macroCardsRow}>
                {/* Protein */}
                <View style={[styles.macroCard, { backgroundColor: theme.isDark ? 'rgba(16, 185, 129, 0.12)' : '#DCFCE7', borderColor: '#10B981' }]}>
                  <Text style={styles.macroEmoji}>🥩</Text>
                  <Text style={[styles.macroValue, { color: '#10B981' }]}>{macros.proteinG}g</Text>
                  <Text style={[styles.macroLabel, { color: theme.colors.text }]}>Protein</Text>
                  <Text style={[styles.macroPct, { color: theme.colors.textMuted }]}>{macros.proteinPct}% · {macros.proteinG * 4} kcal</Text>
                </View>

                {/* Carbs */}
                <View style={[styles.macroCard, { backgroundColor: theme.isDark ? 'rgba(59, 130, 246, 0.12)' : '#DBEAFE', borderColor: '#3B82F6' }]}>
                  <Text style={styles.macroEmoji}>🍞</Text>
                  <Text style={[styles.macroValue, { color: '#3B82F6' }]}>{macros.carbsG}g</Text>
                  <Text style={[styles.macroLabel, { color: theme.colors.text }]}>Carbs</Text>
                  <Text style={[styles.macroPct, { color: theme.colors.textMuted }]}>{macros.carbsPct}% · {macros.carbsG * 4} kcal</Text>
                </View>

                {/* Fats */}
                <View style={[styles.macroCard, { backgroundColor: theme.isDark ? 'rgba(245, 158, 11, 0.12)' : '#FEF3C7', borderColor: '#F59E0B' }]}>
                  <Text style={styles.macroEmoji}>🥑</Text>
                  <Text style={[styles.macroValue, { color: '#F59E0B' }]}>{macros.fatsG}g</Text>
                  <Text style={[styles.macroLabel, { color: theme.colors.text }]}>Fats</Text>
                  <Text style={[styles.macroPct, { color: theme.colors.textMuted }]}>{macros.fatsPct}% · {macros.fatsG * 9} kcal</Text>
                </View>
              </View>
            </Card>

            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Goal Calorie Targets</Text>
              <BreakdownRow label="Basal Metabolic Rate (BMR)" value={`${tdeeResult.bmr} kcal/day`} showDivider />
              <BreakdownRow label="Maintain Weight (TDEE)" value={`${tdeeResult.tdee} kcal/day`} isBold showDivider />
              <BreakdownRow label="Mild Weight Loss (-0.5 kg/wk)" value={`${tdeeResult.weightLossCalories} kcal/day`} valueColor="#10B981" showDivider />
              <BreakdownRow label="Fast Weight Loss (-0.75 kg/wk)" value={`${tdeeResult.extremeLossCalories} kcal/day`} valueColor="#F59E0B" showDivider />
              <BreakdownRow label="Clean Muscle Building (+300 kcal)" value={`${tdeeResult.muscleGainCalories} kcal/day`} valueColor="#3B82F6" showDivider />
              <BreakdownRow label="Target Protein Intake" value={`${macros.proteinG} grams/day`} isBold />
            </Card>
          </>
        )}

        {/* ========================================================================= */}
        {/* 3. WATER HYDRATION TAB */}
        {/* ========================================================================= */}
        {mode === 'water' && (
          <>
            <ResultHeroCard
              title="Recommended Daily Water"
              value={`${waterResult.totalLiters} Liters`}
              subText={`Equals approximately ${waterResult.glasses250ml} standard glasses (250ml each)`}
              badgeText="OPTIMAL HYDRATION"
              badgeType="info"
              secondaryStats={[
                { label: 'Base Need', value: `${waterResult.dailyLiters} L` },
                { label: 'Workout Extra', value: `+${waterResult.exerciseAdjustmentLiters} L` },
                { label: 'Glasses Goal', value: `${waterResult.glasses250ml} cups` },
              ]}
            />

            {/* Interactive Visual Glass Tracker Card */}
            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <View style={styles.glassHeaderRow}>
                <Text style={[styles.cardTitle, { color: theme.colors.text, marginBottom: 0 }]}>
                  Daily Glass Tracker ({waterResult.glasses250ml} Cups)
                </Text>
                <View style={[styles.glassBadge, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                  <Text style={[styles.glassBadgeText, { color: '#3B82F6' }]}>250ml / Cup</Text>
                </View>
              </View>

              {/* Progress & Live Log Header */}
              <View style={[styles.hydrationProgressBox, { backgroundColor: theme.isDark ? 'rgba(59, 130, 246, 0.12)' : '#EFF6FF', borderColor: theme.isDark ? 'rgba(59, 130, 246, 0.3)' : '#BFDBFE' }]}>
                <View style={styles.hydrationProgressHeader}>
                  <Text style={[styles.hydrationLoggedText, { color: '#2563EB' }]}>
                    💧 Drank Today: {consumedGlasses} / {waterResult.glasses250ml} cups
                  </Text>
                  <Text style={[styles.hydrationMlText, { color: theme.colors.textMuted }]}>
                    {consumedGlasses * 250} ml / {Math.round(waterResult.totalLiters * 1000)} ml ({Math.min(100, Math.round((consumedGlasses / Math.max(1, waterResult.glasses250ml)) * 100))}%)
                  </Text>
                </View>
                <View style={[styles.hydrationProgressBarBg, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.08)' : '#DBEAFE' }]}>
                  <View
                    style={[
                      styles.hydrationProgressBarFill,
                      {
                        width: `${Math.min(100, Math.round((consumedGlasses / Math.max(1, waterResult.glasses250ml)) * 100))}%`,
                        backgroundColor: '#3B82F6',
                      },
                    ]}
                  />
                </View>
              </View>

              <Text style={[styles.glassSubText, { color: theme.colors.textMuted }]}>
                Tap any glass to mark drank or use the quick buttons below:
              </Text>

              <View style={styles.glassGrid}>
                {Array.from({ length: Math.min(16, Math.max(1, waterResult.glasses250ml)) }).map((_, idx) => {
                  const isDrank = idx < consumedGlasses;
                  return (
                    <TouchableOpacity
                      key={idx}
                      activeOpacity={0.7}
                      onPress={() => setConsumedGlasses(idx + 1 === consumedGlasses ? idx : idx + 1)}
                      style={[
                        styles.glassItem,
                        {
                          backgroundColor: isDrank
                            ? (theme.isDark ? 'rgba(59, 130, 246, 0.3)' : '#BFDBFE')
                            : (theme.isDark ? 'rgba(59, 130, 246, 0.1)' : '#F8FAFC'),
                          borderColor: isDrank
                            ? '#3B82F6'
                            : (theme.isDark ? 'rgba(59, 130, 246, 0.25)' : '#E2E8F0'),
                        },
                      ]}
                    >
                      <Text style={styles.glassIcon}>{isDrank ? '💧' : '🥛'}</Text>
                      <Text style={[styles.glassNum, { color: isDrank ? '#2563EB' : theme.colors.text }]}>#{idx + 1}</Text>
                      {isDrank && (
                        <Text style={[styles.glassCheck, { color: '#2563EB' }]}>✓</Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Quick Log Buttons */}
              <View style={styles.glassActionRow}>
                <TouchableOpacity
                  onPress={() => setConsumedGlasses((prev) => Math.min(waterResult.glasses250ml, prev + 1))}
                  activeOpacity={0.7}
                  style={[styles.drinkBtn, { backgroundColor: theme.colors.primary }]}
                >
                  <Text style={styles.drinkBtnText}>＋ Drink 1 Cup (250ml)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setConsumedGlasses(0)}
                  activeOpacity={0.7}
                  style={[
                    styles.resetDrinkBtn,
                    {
                      borderColor: theme.colors.borderSubtle,
                      backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
                    },
                  ]}
                >
                  <Text style={[styles.resetDrinkBtnText, { color: theme.colors.textMuted }]}>↺ Reset</Text>
                </TouchableOpacity>
              </View>
            </Card>

            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Hydration Inputs</Text>

              <CalcInputField
                label="Body Weight"
                suffix="kg"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />
              <PresetPills
                options={[{ label: '55kg', value: '55' }, { label: '65kg', value: '65' }, { label: '75kg', value: '75' }, { label: '85kg', value: '85' }]}
                selectedValue={weight}
                onSelect={(val) => setWeight(String(val))}
              />

              <CalcInputField
                label="Daily Physical Activity / Workout"
                suffix="mins"
                keyboardType="numeric"
                value={workoutMins}
                onChangeText={setWorkoutMins}
                placeholder="e.g. 45"
              />
              <PresetPills
                options={[{ label: '0 mins', value: '0' }, { label: '30 mins', value: '30' }, { label: '45 mins', value: '45' }, { label: '60 mins', value: '60' }]}
                selectedValue={workoutMins}
                onSelect={(val) => setWorkoutMins(String(val))}
              />

              <TouchableOpacity
                onPress={handleReset}
                activeOpacity={0.7}
                style={[
                  styles.resetButton,
                  {
                    backgroundColor: theme.isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2',
                    borderColor: theme.isDark ? 'rgba(239, 68, 68, 0.3)' : '#FCA5A5',
                  },
                ]}
              >
                <Text style={[styles.resetButtonText, { color: '#EF4444' }]}>↺ Reset Inputs</Text>
              </TouchableOpacity>
            </Card>

            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Hydration Schedule Tips</Text>
              <BreakdownRow label="Morning Wakeup" value="500 ml (2 glasses)" showDivider />
              <BreakdownRow label="Before Meals" value="250 ml (30 mins prior)" showDivider />
              <BreakdownRow label="During Workout" value="200 ml every 20 mins" showDivider />
              <BreakdownRow label="Evening / Bedtime" value="250 ml (1 glass)" />
            </Card>
          </>
        )}

        {/* ========================================================================= */}
        {/* 4. BODY FAT TAB */}
        {/* ========================================================================= */}
        {mode === 'body_fat' && (
          <>
            <ResultHeroCard
              title="Estimated Body Fat"
              value={`${bodyFatResult.bodyFatPct}%`}
              subText={`Classification: ${bodyFatResult.category}`}
              badgeText={bodyFatResult.category.toUpperCase()}
              badgeType={bodyFatResult.category === 'Fitness' || bodyFatResult.category === 'Athletes' ? 'success' : 'info'}
              secondaryStats={[
                { label: 'Fat Mass', value: `${bodyFatResult.fatMassKg} kg` },
                { label: 'Lean Mass', value: `${bodyFatResult.leanMassKg} kg` },
                { label: 'Total Weight', value: `${numWeight} kg` },
              ]}
            />

            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>US Navy Tape Measurements</Text>

              <SegmentedTabs
                activeTab={gender}
                onTabChange={(key) => setGender(key as 'male' | 'female')}
                tabs={[
                  { key: 'male', label: 'Male', icon: '👨' },
                  { key: 'female', label: 'Female', icon: '👩' },
                ]}
              />

              <CalcInputField
                label="Height"
                suffix="cm"
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
              />
              <CalcInputField
                label="Weight"
                suffix="kg"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />
              <CalcInputField
                label="Waist Circumference (at navel)"
                suffix="cm"
                keyboardType="numeric"
                value={waist}
                onChangeText={setWaist}
              />
              <CalcInputField
                label="Neck Circumference (below larynx)"
                suffix="cm"
                keyboardType="numeric"
                value={neck}
                onChangeText={setNeck}
              />
              {gender === 'female' && (
                <CalcInputField
                  label="Hip Circumference (widest point)"
                  suffix="cm"
                  keyboardType="numeric"
                  value={hip}
                  onChangeText={setHip}
                />
              )}

              <TouchableOpacity
                onPress={handleReset}
                activeOpacity={0.7}
                style={[
                  styles.resetButton,
                  {
                    backgroundColor: theme.isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2',
                    borderColor: theme.isDark ? 'rgba(239, 68, 68, 0.3)' : '#FCA5A5',
                  },
                ]}
              >
                <Text style={[styles.resetButtonText, { color: '#EF4444' }]}>↺ Reset Inputs</Text>
              </TouchableOpacity>
            </Card>

            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Body Composition Breakdown</Text>
              <BreakdownRow label="Total Body Weight" value={`${numWeight} kg`} showDivider />
              <BreakdownRow label="Lean Muscle & Bone Mass" value={`${bodyFatResult.leanMassKg} kg`} valueColor="#10B981" isBold showDivider />
              <BreakdownRow label="Essential & Adipose Fat Mass" value={`${bodyFatResult.fatMassKg} kg`} valueColor="#F59E0B" showDivider />
              <BreakdownRow label="Estimated Body Fat %" value={`${bodyFatResult.bodyFatPct}%`} isBold valueColor={theme.colors.primary} />
            </Card>
          </>
        )}

        {/* ========================================================================= */}
        {/* 5. WORKOUT & 1RM TAB */}
        {/* ========================================================================= */}
        {mode === 'workout' && (
          <>
            {/* Workout Sub-Tabs: Strength vs Cardio */}
            <View style={styles.workoutSubTabsRow}>
              <TouchableOpacity
                onPress={() => setWorkoutType('strength')}
                activeOpacity={0.7}
                style={[
                  styles.workoutSubTabBtn,
                  workoutType === 'strength' && {
                    backgroundColor: theme.colors.primary,
                    borderColor: theme.colors.primary,
                  },
                  workoutType !== 'strength' && {
                    backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
                    borderColor: theme.colors.borderSubtle,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.workoutSubTabText,
                    { color: workoutType === 'strength' ? '#FFF' : theme.colors.textMuted },
                  ]}
                >
                  🏋️ Strength & 1RM
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setWorkoutType('cardio')}
                activeOpacity={0.7}
                style={[
                  styles.workoutSubTabBtn,
                  workoutType === 'cardio' && {
                    backgroundColor: theme.colors.primary,
                    borderColor: theme.colors.primary,
                  },
                  workoutType !== 'cardio' && {
                    backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
                    borderColor: theme.colors.borderSubtle,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.workoutSubTabText,
                    { color: workoutType === 'cardio' ? '#FFF' : theme.colors.textMuted },
                  ]}
                >
                  🏃 Cardio & HIIT
                </Text>
              </TouchableOpacity>
            </View>

            {workoutType === 'strength' ? (
              <>
                <ResultHeroCard
                  title="Estimated 1-Rep Max"
                  value={`${strength1RM.oneRepMax} kg`}
                  subText={`${strengthBurn.totalCaloriesBurned} kcal burned | ${strengthBurn.totalVolumeKg.toLocaleString()} kg total volume`}
                  badgeText={`${numWeightLifted}KG × ${numReps} REPS`}
                  badgeType="info"
                  secondaryStats={[
                    { label: 'Active Burn', value: `${strengthBurn.activeCalories} kcal` },
                    { label: 'EPOC Afterburn', value: `+${strengthBurn.epocAfterburnCalories} kcal` },
                    { label: 'Total Volume', value: `${strengthBurn.totalVolumeKg.toLocaleString()} kg` },
                  ]}
                />

                {/* Target Exercise Selection & Custom Exercise */}
                <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
                  <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Target Exercise</Text>

                  {/* Muscle Category Filter Chips */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.muscleFilterScroll}>
                        {[
                          { key: 'all', label: 'All' },
                          { key: 'chest', label: 'Chest' },
                          { key: 'back', label: 'Back' },
                          { key: 'legs', label: 'Legs' },
                          { key: 'shoulders', label: 'Shoulders' },
                          { key: 'arms', label: 'Arms' },
                          { key: 'calisthenics', label: 'Bodyweight' },
                        ].map((cat) => (
                          <TouchableOpacity
                            key={cat.key}
                            onPress={() => setExerciseFilter(cat.key as any)}
                            style={[
                              styles.muscleFilterChip,
                              exerciseFilter === cat.key && {
                                backgroundColor: theme.colors.primary,
                                borderColor: theme.colors.primary,
                              },
                              exerciseFilter !== cat.key && {
                                backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
                                borderColor: theme.colors.borderSubtle,
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.muscleFilterChipText,
                                { color: exerciseFilter === cat.key ? '#FFF' : theme.colors.textMuted },
                              ]}
                            >
                              {cat.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>

                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.exerciseScroll}>
                        {filteredExercises.map((ex) => {
                          const isSelected = selectedExerciseId === ex.id;
                          return (
                            <View key={ex.id} style={styles.exerciseChipWrapper}>
                              <TouchableOpacity
                                onPress={() => setSelectedExerciseId(ex.id)}
                                style={[
                                  styles.exerciseChip,
                                  isSelected && {
                                    backgroundColor: theme.colors.primary,
                                    borderColor: theme.colors.primary,
                                  },
                                  !isSelected && {
                                    backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
                                    borderColor: theme.colors.borderSubtle,
                                  },
                                ]}
                              >
                                <Text style={styles.exerciseIcon}>{ex.icon}</Text>
                                <Text
                                  style={[
                                    styles.exerciseChipText,
                                    { color: isSelected ? '#FFF' : theme.colors.text },
                                  ]}
                                >
                                  {ex.name}
                                </Text>
                                {ex.isCompound && (
                                  <View style={[styles.compoundTag, { backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : 'rgba(16, 185, 129, 0.15)' }]}>
                                    <Text style={[styles.compoundTagText, { color: isSelected ? '#FFF' : '#10B981' }]}>COMPOUND</Text>
                                  </View>
                                )}
                              </TouchableOpacity>
                            </View>
                          );
                        })}
                      </ScrollView>
                </Card>

                {/* Sets, Reps & Weight Configuration */}
                <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
                  <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Sets, Reps & Load Details</Text>

                  <CalcInputField
                    label="Weight Lifted per Set"
                    suffix="kg"
                    keyboardType="numeric"
                    value={weightLifted}
                    onChangeText={setWeightLifted}
                  />

                  {/* Olympic Barbell Plate Loading Helper */}
                  <View style={[styles.plateBox, { backgroundColor: theme.isDark ? 'rgba(59, 130, 246, 0.12)' : '#EFF6FF', borderColor: theme.isDark ? 'rgba(59, 130, 246, 0.28)' : '#BFDBFE' }]}>
                    <Text style={[styles.plateBoxLabel, { color: theme.colors.primary }]}>🏋️ Olympic Barbell Plate Setup (20kg Bar):</Text>
                    <Text style={[styles.plateBoxValue, { color: theme.colors.text }]}>{plateBreakdown}</Text>
                  </View>

                  <PresetPills
                    options={['20 kg', '40 kg', '60 kg', '80 kg', '100 kg', '120 kg']}
                    selectedValue={`${weightLifted} kg`}
                    onSelect={(val) => setWeightLifted(String(val).replace(' kg', ''))}
                  />

                  {/* Reps with - / + Stepper */}
                  <View style={styles.stepperContainer}>
                    <Text style={[styles.stepperLabel, { color: theme.colors.text }]}>Reps per Set</Text>
                    <View style={styles.stepperControlsRow}>
                      <TouchableOpacity
                        onPress={() => setReps(String(Math.max(1, (parseInt(reps, 10) || 1) - 1)))}
                        style={[styles.stepperBtn, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0' }]}
                      >
                        <Text style={[styles.stepperBtnText, { color: theme.colors.text }]}>－</Text>
                      </TouchableOpacity>
                      <View style={[styles.stepperValueBox, { borderColor: theme.colors.primary }]}>
                        <Text style={[styles.stepperValueText, { color: theme.colors.primary }]}>{reps} Reps</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => setReps(String((parseInt(reps, 10) || 1) + 1))}
                        style={[styles.stepperBtn, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0' }]}
                      >
                        <Text style={[styles.stepperBtnText, { color: theme.colors.text }]}>＋</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Rep Range Goal Indicator Badge */}
                  <View style={[styles.repGoalBadge, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC', borderColor: repGoalBadge.color }]}>
                    <Text style={[styles.repGoalText, { color: repGoalBadge.color }]}>{repGoalBadge.label}</Text>
                  </View>
                  <PresetPills
                    options={['3 reps', '5 reps', '8 reps', '10 reps', '12 reps']}
                    selectedValue={`${reps} reps`}
                    onSelect={(val) => setReps(String(val).replace(' reps', ''))}
                  />

                  {/* Sets with - / + Stepper */}
                  <View style={styles.stepperContainer}>
                    <Text style={[styles.stepperLabel, { color: theme.colors.text }]}>Number of Sets</Text>
                    <View style={styles.stepperControlsRow}>
                      <TouchableOpacity
                        onPress={() => setSets(String(Math.max(1, (parseInt(sets, 10) || 1) - 1)))}
                        style={[styles.stepperBtn, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0' }]}
                      >
                        <Text style={[styles.stepperBtnText, { color: theme.colors.text }]}>－</Text>
                      </TouchableOpacity>
                      <View style={[styles.stepperValueBox, { borderColor: theme.colors.primary }]}>
                        <Text style={[styles.stepperValueText, { color: theme.colors.primary }]}>{sets} Sets</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => setSets(String((parseInt(sets, 10) || 1) + 1))}
                        style={[styles.stepperBtn, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0' }]}
                      >
                        <Text style={[styles.stepperBtnText, { color: theme.colors.text }]}>＋</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text style={[styles.subTitle, { color: theme.colors.textMuted }]}>Rest Time Between Sets</Text>
                  <View style={styles.chipsRow}>
                    {[
                      { label: '60s (Hypertrophy)', val: 60 },
                      { label: '90s (Balanced)', val: 90 },
                      { label: '120s (Strength)', val: 120 },
                      { label: '180s (Power)', val: 180 },
                    ].map((item) => (
                      <TouchableOpacity
                        key={item.val}
                        onPress={() => setRestSeconds(item.val)}
                        style={[
                          styles.chipOption,
                          restSeconds === item.val && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
                          restSeconds !== item.val && { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9', borderColor: theme.colors.borderSubtle },
                        ]}
                      >
                        <Text style={[styles.chipText, { color: restSeconds === item.val ? '#FFF' : theme.colors.text }]}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={[styles.subTitle, { color: theme.colors.textMuted }]}>Training Effort / Intensity</Text>
                  <View style={styles.chipsRow}>
                    {[
                      { key: 'moderate', label: 'Moderate' },
                      { key: 'heavy', label: 'Heavy (RPE 8-9)' },
                      { key: 'failure', label: 'Failure (RPE 10)' },
                    ].map((item) => (
                      <TouchableOpacity
                        key={item.key}
                        onPress={() => setIntensity(item.key as any)}
                        style={[
                          styles.chipOption,
                          intensity === item.key && { backgroundColor: '#F59E0B', borderColor: '#F59E0B' },
                          intensity !== item.key && { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9', borderColor: theme.colors.borderSubtle },
                        ]}
                      >
                        <Text style={[styles.chipText, { color: intensity === item.key ? '#FFF' : theme.colors.text }]}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </Card>

                {/* 1RM Strength Repetition Table */}
                <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
                  <View style={{ marginBottom: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={[styles.cardTitle, { color: theme.colors.text, marginBottom: 0, fontSize: 15 }]}>
                        1RM Strength Standards
                      </Text>
                      <View style={[styles.glassBadge, { backgroundColor: 'rgba(59, 130, 246, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }]}>
                        <Text style={[styles.glassBadgeText, { color: theme.colors.primary, fontSize: 11, fontWeight: '700' }]} numberOfLines={1}>
                          Epley & Brzycki
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.glassSubText, { color: theme.colors.textMuted, marginTop: 4 }]}>
                      Based on lifting {numWeightLifted}kg for {numReps} reps, theoretical max loads:
                    </Text>
                  </View>

                  <View style={styles.repTable}>
                    {strength1RM.repPercentages.map((tier, idx) => (
                      <View
                        key={tier.percentage}
                        style={[
                          styles.repTableRow,
                          idx < strength1RM.repPercentages.length - 1 && styles.repTableBorder,
                          tier.percentage === 100 && { backgroundColor: theme.isDark ? 'rgba(59, 130, 246, 0.12)' : '#EFF6FF' },
                        ]}
                      >
                        <View style={styles.repColPct}>
                          <Text style={[styles.repPctText, { color: tier.percentage === 100 ? theme.colors.primary : theme.colors.text }]}>
                            {tier.percentage}% 1RM
                          </Text>
                          <Text style={[styles.repRepsText, { color: theme.colors.textMuted }]}>{tier.targetReps}</Text>
                        </View>
                        <Text style={[styles.repWeightText, { color: tier.percentage === 100 ? theme.colors.primary : theme.colors.text }]}>
                          {tier.estimatedWeightKg} kg
                        </Text>
                      </View>
                    ))}
                  </View>
                </Card>

                {/* Workout Metabolism & Performance Card */}
                <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
                  <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Workout Energy & Volume Breakdown</Text>
                  <BreakdownRow label="Total Weight Lifted (Volume)" value={`${strengthBurn.totalVolumeKg.toLocaleString()} kg`} isBold valueColor={theme.colors.primary} showDivider />
                  <BreakdownRow label="Time Under Tension (Work)" value={`${strengthBurn.timeUnderTensionSeconds} seconds`} showDivider />
                  <BreakdownRow label="Rest Interval Duration" value={`${strengthBurn.totalRestMinutes} minutes`} showDivider />
                  <BreakdownRow label="Estimated Total Workout Time" value={`~${strengthBurn.totalDurationMinutes} mins`} showDivider />
                  <BreakdownRow label="Active Lifting Energy Burned" value={`${strengthBurn.activeCalories} kcal`} showDivider />
                  <BreakdownRow label="EPOC Oxygen Afterburn (+12%)" value={`+${strengthBurn.epocAfterburnCalories} kcal`} valueColor="#F59E0B" showDivider />
                  <BreakdownRow label="Net Workout Energy Burned" value={`${strengthBurn.totalCaloriesBurned} kcal`} isBold valueColor="#10B981" />
                </Card>
              </>
            ) : (
              <>
                <ResultHeroCard
                  title="Cardio Energy Burned"
                  value={`${cardioBurn.caloriesBurned} kcal`}
                  subText={`Equivalent to ~${cardioBurn.fatGramsBurned}g pure fat burned`}
                  badgeText={`${cardioMins} MINS`}
                  badgeType="success"
                  secondaryStats={[
                    { label: 'Fat Loss', value: `${cardioBurn.fatGramsBurned} g` },
                    { label: 'Walk Equiv', value: `${cardioBurn.equivalentWalkingKm} km` },
                    { label: 'Duration', value: `${cardioMins} mins` },
                  ]}
                />

                <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
                  <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Cardio Activity</Text>

                  <View style={styles.cardioGrid}>
                    {allCardioPresets.map((cardio) => {
                      const isSelected = selectedCardioId === cardio.id;
                      return (
                        <TouchableOpacity
                          key={cardio.id}
                          onPress={() => setSelectedCardioId(cardio.id)}
                          style={[
                            styles.cardioItem,
                            isSelected && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
                            !isSelected && { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC', borderColor: theme.colors.borderSubtle },
                          ]}
                        >
                          <Text style={styles.cardioIcon}>{cardio.icon}</Text>
                          <Text style={[styles.cardioName, { color: isSelected ? '#FFF' : theme.colors.text }]} numberOfLines={1}>
                            {cardio.name}
                          </Text>
                          <Text style={[styles.cardioMet, { color: isSelected ? 'rgba(255,255,255,0.8)' : theme.colors.textMuted }]}>
                            {cardio.met} MET
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <CalcInputField
                    label="Workout Duration"
                    suffix="mins"
                    keyboardType="numeric"
                    value={cardioMins}
                    onChangeText={setCardioMins}
                  />
                  <PresetPills
                    options={['15 mins', '30 mins', '45 mins', '60 mins', '90 mins']}
                    selectedValue={`${cardioMins} mins`}
                    onSelect={(val) => setCardioMins(String(val).replace(' mins', ''))}
                  />
                </Card>

                <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
                  <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Cardio Impact & Fat Burn</Text>
                  <BreakdownRow label="Total Duration" value={`${cardioMins} minutes`} showDivider />
                  <BreakdownRow label="Body Weight Factor" value={`${numWeight} kg`} showDivider />
                  <BreakdownRow label="Net Calorie Expenditure" value={`${cardioBurn.caloriesBurned} kcal`} isBold valueColor="#10B981" showDivider />
                  <BreakdownRow label="Estimated Pure Fat Burned" value={`~${cardioBurn.fatGramsBurned} grams`} valueColor="#F59E0B" showDivider />
                  <BreakdownRow label="Equivalent Walking Distance" value={`${cardioBurn.equivalentWalkingKm} km`} valueColor={theme.colors.primary} />
                </Card>
              </>
            )}
          </>
        )}

        <FormulaTabs
          formula={
            mode === 'bmi'
              ? 'BMI = Weight (kg) / [Height (m)]²'
              : mode === 'calorie'
              ? 'BMR = 10W + 6.25H - 5A + s | TDEE = BMR × Activity'
              : mode === 'water'
              ? 'Water = (Weight × 35ml) + (Workout Mins / 30 × 350ml)'
              : mode === 'workout'
              ? '1RM = Weight × (1 + Reps/30) | Burn = MET × 3.5 × W / 200 × Time + EPOC'
              : 'US Navy Body Fat Tape Method'
          }
          howItWorks={[
            '1. Inputs are verified against WHO, Mifflin-St Jeor, Epley/Brzycki 1RM, and standard physical fitness equations.',
            '2. Real-time calorie, strength volume, and hydration calculations update instantly with metric changes.',
            '3. Guidelines provide structured fitness targets for health optimization.',
          ]}
          example={{
            input: '80kg lift, 3 reps, 4 sets with 90s rest, 72kg body weight',
            calculation: '1RM = 80 × (1 + 3/30) = 88 kg | Burn = 84 kcal + 12% EPOC = 94 kcal',
            output: '88 kg Estimated 1RM with 960 kg Total Volume Lifted',
          }}
        />
      </ScrollView>

      <CalculationHistoryModal
        visible={showHistory}
        history={history}
        onClose={() => setShowHistory(false)}
        onClearAll={clearHistory}
        onDeleteItem={deleteItem}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },
  subTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  resetButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  macroCardsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  macroCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  macroEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  macroLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  macroPct: {
    fontSize: 10,
    textAlign: 'center',
  },
  glassHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  glassBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  glassBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  glassSubText: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12,
  },
  glassGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  glassItem: {
    width: '22%',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  glassNum: {
    fontSize: 11,
    fontWeight: '700',
  },
  workoutSubTabsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  workoutSubTabBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutSubTabText: {
    fontSize: 13,
    fontWeight: '700',
  },
  customToggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  customToggleBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  customExerciseBox: {
    marginTop: 10,
  },
  compoundToggleRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
    marginBottom: 8,
  },
  compoundBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compoundBtnText: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  exerciseScroll: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 4,
  },
  exerciseChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  exerciseChipText: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  compoundTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  compoundTagText: {
    fontSize: 9,
    fontWeight: '800',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 8,
  },
  stepperLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  stepperControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepperBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: {
    fontSize: 18,
    fontWeight: '800',
  },
  stepperValueBox: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    minWidth: 80,
    alignItems: 'center',
  },
  stepperValueText: {
    fontSize: 14,
    fontWeight: '800',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    marginBottom: 10,
  },
  chipOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  repTable: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, 0.2)',
  },
  repTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  repTableBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.15)',
  },
  repColPct: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  repPctText: {
    fontSize: 13,
    fontWeight: '800',
  },
  repRepsText: {
    fontSize: 12,
  },
  repWeightText: {
    fontSize: 14,
    fontWeight: '800',
  },
  cardioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
    marginBottom: 14,
  },
  cardioItem: {
    width: '48%',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 88,
  },
  cardioIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  cardioName: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  cardioMet: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  // Hydration Interactive Tracker Styles
  hydrationProgressBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  hydrationProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  hydrationLoggedText: {
    fontSize: 13,
    fontWeight: '700',
  },
  hydrationMlText: {
    fontSize: 12,
    fontWeight: '600',
  },
  hydrationProgressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  hydrationProgressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  glassCheck: {
    fontSize: 10,
    fontWeight: '900',
    position: 'absolute',
    top: 4,
    right: 6,
  },
  glassActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  drinkBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drinkBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  resetDrinkBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetDrinkBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  // Workout Enhancements Styles
  muscleFilterScroll: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 6,
  },
  muscleFilterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
  },
  muscleFilterChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  plateBox: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 4,
    marginBottom: 10,
  },
  plateBoxLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  plateBoxValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  repGoalBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 6,
    marginBottom: 8,
    alignItems: 'center',
  },
  repGoalText: {
    fontSize: 12,
    fontWeight: '700',
  },
  saveCustomBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveCustomBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  savedToastBadge: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
    alignItems: 'center',
  },
  savedToastText: {
    fontSize: 12,
    fontWeight: '700',
  },
  exerciseChipWrapper: {
    position: 'relative',
    marginRight: 8,
  },
  deleteCustomBtn: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  deleteCustomText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '900',
  },
  deleteCustomCardioBtn: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  headerBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clearCustomBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearCustomBtnText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '700',
  },
});
