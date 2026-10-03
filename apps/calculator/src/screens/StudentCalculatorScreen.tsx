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
  SegmentedTabs,
  FormulaInfoCard,
  CalculationHistoryModal,
} from '../components';
import { useTheme } from '@dailyapps/theme';
import { useAnalytics } from '@dailyapps/analytics';
import { useAppStorage } from '@dailyapps/storage';
import { useCalculationHistory } from '../hooks';
import { CalculationRecord } from '../types/history.types';
import {
  calculateAttendance,
  calculateCGPAToPercentage,
  calculateMarksRequired,
  calculateSGPA,
  SubjectGrade,
} from '../calculations/student';

interface StudentCalculatorScreenProps {
  navigation: any;
  route?: any;
}

type StudentMode = 'attendance' | 'sgpa' | 'cgpa' | 'marks';

export const StudentCalculatorScreen: React.FC<StudentCalculatorScreenProps> = ({
  navigation,
  route,
}) => {
  const theme = useTheme();
  const analytics = useAnalytics();

  const tool = route?.params?.tool;

  const resolveInitialStudentMode = (toolId?: string): StudentMode => {
    const id = toolId || '';
    if (id.includes('sgpa') || id.includes('gpa') || id.includes('grade')) {
      return 'sgpa';
    }
    if (id.includes('cgpa')) {
      return 'cgpa';
    }
    if (id.includes('mark') || id.includes('exam') || id.includes('score')) {
      return 'marks';
    }
    return 'attendance';
  };

  const [mode, setMode] = useState<StudentMode>(resolveInitialStudentMode(tool?.id));

  // 1. Attendance State
  const [attended, setAttended] = useState('38');
  const [total, setTotal] = useState('48');
  const [targetPct, setTargetPct] = useState(75);

  // 2. SGPA Multi-Subject State
  const DEFAULT_SUBJECTS: SubjectGrade[] = [
    { id: 'sub_1', name: 'Engineering Mathematics', credits: 4, gradePoints: 9 },
    { id: 'sub_2', name: 'Data Structures & Algorithms', credits: 4, gradePoints: 8 },
    { id: 'sub_3', name: 'Operating Systems', credits: 3, gradePoints: 9 },
    { id: 'sub_4', name: 'Database Management', credits: 3, gradePoints: 7 },
    { id: 'sub_5', name: 'Software Lab', credits: 2, gradePoints: 10 },
  ];
  const [subjects, setSubjects] = useState<SubjectGrade[]>(DEFAULT_SUBJECTS);
  const [newSubName, setNewSubName] = useState('');
  const [newSubCredits, setNewSubCredits] = useState('3');
  const [newSubGrade, setNewSubGrade] = useState('8');
  const [showAddSubject, setShowAddSubject] = useState(false);

  // 3. CGPA State
  const [cgpa, setCgpa] = useState('8.4');
  const [cgpaScale, setCgpaScale] = useState<'cbse_9_5' | 'direct_10' | 'custom'>('cbse_9_5');
  const [customMultiplier, setCustomMultiplier] = useState('9.5');

  // 4. Marks Required State
  const [internalScored, setInternalScored] = useState('32');
  const [internalMax, setInternalMax] = useState('40');
  const [internalWeight, setInternalWeight] = useState('40');
  const [targetOverall, setTargetOverall] = useState('75');
  const [finalMax, setFinalMax] = useState('60');

  const handleReset = () => {
    if (mode === 'attendance') {
      setAttended('38');
      setTotal('48');
      setTargetPct(75);
    } else if (mode === 'sgpa') {
      setSubjects(DEFAULT_SUBJECTS);
    } else if (mode === 'cgpa') {
      setCgpa('8.4');
      setCgpaScale('cbse_9_5');
      setCustomMultiplier('9.5');
    } else {
      setInternalScored('32');
      setInternalMax('40');
      setInternalWeight('40');
      setTargetOverall('75');
      setFinalMax('60');
    }
  };

  useEffect(() => {
    analytics.logScreenView(tool?.name || 'StudentCalculator');
    if (tool?.id) {
      setMode(resolveInitialStudentMode(tool.id));
    }
  }, [analytics, tool?.id, tool?.name]);

  // Calculations
  const attRes = calculateAttendance({
    presentClasses: parseFloat(attended) || 0,
    totalClasses: parseFloat(total) || 0,
    targetPercentage: targetPct,
  });

  const sgpaResult = useMemo(() => {
    return calculateSGPA(subjects);
  }, [subjects]);

  const cgpaRes = calculateCGPAToPercentage({
    cgpa: parseFloat(cgpa) || 0,
    scaleType: cgpaScale,
    customMultiplier: parseFloat(customMultiplier) || 9.5,
  });

  const marksRes = calculateMarksRequired({
    internalScored: parseFloat(internalScored) || 0,
    internalMax: parseFloat(internalMax) || 1,
    internalWeightage: parseFloat(internalWeight) || 40,
    targetOverallPct: parseFloat(targetOverall) || 75,
    finalMax: parseFloat(finalMax) || 60,
  });

  const storage = useAppStorage();

  useEffect(() => {
    storage.getJson<SubjectGrade[]>('student_sgpa_subjects', []).then((saved) => {
      if (saved && saved.length > 0) {
        setSubjects(saved);
      }
    });
  }, [storage]);

  // SGPA Helpers
  const handleAddSubject = async () => {
    const cred = parseFloat(newSubCredits) || 3;
    const gp = parseFloat(newSubGrade) || 8;
    const name = newSubName.trim() || `Subject ${subjects.length + 1}`;

    const newSub: SubjectGrade = {
      id: `custom_sub_${Date.now()}`,
      name,
      credits: cred,
      gradePoints: gp,
    };

    const updated = [...subjects, newSub];
    setSubjects(updated);
    setNewSubName('');
    setNewSubCredits('3');
    setNewSubGrade('8');
    setShowAddSubject(false);
    await storage.setJson('student_sgpa_subjects', updated);
  };

  const removeSubject = async (id: string) => {
    const updated = subjects.filter((s) => s.id !== id);
    setSubjects(updated);
    await storage.setJson('student_sgpa_subjects', updated);
  };

  const handleResetSubjects = async () => {
    setSubjects(DEFAULT_SUBJECTS);
    await storage.setJson('student_sgpa_subjects', []);
  };

  const updateSubjectGrade = async (id: string, gradePoints: number) => {
    const updated = subjects.map((s) => (s.id === id ? { ...s, gradePoints } : s));
    setSubjects(updated);
    await storage.setJson('student_sgpa_subjects', updated);
  };

  const updateSubjectCredits = async (id: string, credits: number) => {
    const updated = subjects.map((s) => (s.id === id ? { ...s, credits: Math.max(1, credits) } : s));
    setSubjects(updated);
    await storage.setJson('student_sgpa_subjects', updated);
  };

  const [showHistory, setShowHistory] = useState(false);
  const { history, saveCalculation, clearHistory, deleteItem } = useCalculationHistory(
    tool?.id || 'attendance_calc',
    '🎓 Student'
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (mode === 'attendance' && parseFloat(total) > 0) {
        saveCalculation({
          toolId: 'attendance_calc',
          toolName: 'Attendance Calculator',
          category: '🎓 Student',
          title: `Attendance: ${attRes.currentPercentage}% (${attended}/${total})`,
          subtitle: attRes.message,
          result: `${attRes.currentPercentage}%`,
          secondaryResult: attRes.canBunkClasses > 0 ? `Safe to bunk: ${attRes.canBunkClasses}` : `Must attend: ${attRes.mustAttendClasses}`,
          badge: attRes.status.toUpperCase(),
          inputs: { mode: 'attendance', attended, total, targetPct },
        });
      } else if (mode === 'sgpa' && sgpaResult.totalCredits > 0) {
        saveCalculation({
          toolId: 'sgpa_calc',
          toolName: 'Semester SGPA Grade Sheet',
          category: '🎓 Student',
          title: `Semester SGPA: ${sgpaResult.sgpa} (${subjects.length} Subjects)`,
          subtitle: `Total Credits: ${sgpaResult.totalCredits} | Points: ${sgpaResult.totalPoints}`,
          result: `${sgpaResult.sgpa} SGPA`,
          badge: 'SGPA',
          inputs: { mode: 'sgpa' },
        });
      } else if (mode === 'cgpa' && parseFloat(cgpa) > 0) {
        saveCalculation({
          toolId: 'cgpa_percentage',
          toolName: 'CGPA to Percentage Calculator',
          category: '🎓 Student',
          title: `CGPA ${cgpa} = ${cgpaRes.percentage}%`,
          subtitle: `${cgpaRes.division} | ${cgpaRes.formulaDescription}`,
          result: `${cgpaRes.percentage}%`,
          badge: 'CGPA',
          inputs: { mode: 'cgpa', cgpa, cgpaScale, customMultiplier },
        });
      } else if (mode === 'marks' && marksRes.marksNeeded > 0) {
        saveCalculation({
          toolId: 'marks_required',
          toolName: 'Marks Needed Calculator',
          category: '🎓 Student',
          title: `Need: ${marksRes.marksNeeded}/${finalMax} in Finals`,
          subtitle: `For ${targetOverall}% Overall (${marksRes.percentageNeeded}%)`,
          result: `${marksRes.marksNeeded} / ${finalMax}`,
          badge: 'MARKS',
          inputs: { mode: 'marks', internalScored, internalMax, targetOverall, finalMax },
        });
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [
    mode,
    attended,
    total,
    targetPct,
    subjects,
    sgpaResult,
    cgpa,
    cgpaScale,
    customMultiplier,
    internalScored,
    internalMax,
    targetOverall,
    finalMax,
    attRes,
    cgpaRes,
    marksRes,
    saveCalculation,
  ]);

  const handleSelectHistory = (record: CalculationRecord) => {
    if (record.inputs) {
      if (record.inputs.mode) setMode(record.inputs.mode as StudentMode);
      if (record.inputs.attended) setAttended(record.inputs.attended);
      if (record.inputs.total) setTotal(record.inputs.total);
      if (record.inputs.targetPct) setTargetPct(record.inputs.targetPct);
      if (record.inputs.cgpa) setCgpa(record.inputs.cgpa);
      if (record.inputs.cgpaScale) setCgpaScale(record.inputs.cgpaScale);
      if (record.inputs.customMultiplier) setCustomMultiplier(record.inputs.customMultiplier);
      if (record.inputs.internalScored) setInternalScored(record.inputs.internalScored);
      if (record.inputs.internalMax) setInternalMax(record.inputs.internalMax);
      if (record.inputs.targetOverall) setTargetOverall(record.inputs.targetOverall);
      if (record.inputs.finalMax) setFinalMax(record.inputs.finalMax);
    }
  };

  const currentTitle =
    mode === 'attendance'
      ? 'Attendance Calculator'
      : mode === 'sgpa'
      ? 'Semester SGPA Grade Sheet'
      : mode === 'cgpa'
      ? 'CGPA to Percentage'
      : 'Marks Required Calculator';

  return (
    <ScreenContainer safeArea withPadding={false}>
      <CalculatorHeader
        title={currentTitle}
        subtitle={
          mode === 'attendance'
            ? 'Safe bunk limit & shortage tracker'
            : mode === 'sgpa'
            ? 'Multi-subject credit & grade point semester average'
            : mode === 'cgpa'
            ? 'Convert 10-point / CBSE CGPA into percentage'
            : 'Target final exam marks needed to secure target grade'
        }
        icon={mode === 'attendance' ? '🖐️' : mode === 'sgpa' ? '📊' : mode === 'cgpa' ? '🎓' : '🎯'}
        category="🎓 Student"
        toolId={tool?.id || 'attendance_calc'}
        onBack={() => navigation.goBack()}
        onHistory={() => setShowHistory(true)}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SegmentedTabs
          activeTab={mode}
          onTabChange={(key) => setMode(key as StudentMode)}
          scrollable
          tabs={[
            { key: 'attendance', label: 'Attendance & Bunk', icon: '🖐️' },
            { key: 'sgpa', label: 'Semester SGPA', icon: '📊' },
            { key: 'cgpa', label: 'CGPA to %', icon: '🎓' },
            { key: 'marks', label: 'Marks Needed', icon: '🎯' },
          ]}
        />

        {/* 1. ATTENDANCE */}
        {mode === 'attendance' && (
          <>
            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Classes Record</Text>

              <View style={styles.rowInputs}>
                <View style={styles.flex1}>
                  <CalcInputField
                    label="Classes Attended"
                    keyboardType="numeric"
                    value={attended}
                    onChangeText={setAttended}
                    placeholder="38"
                  />
                </View>
                <View style={styles.flex1}>
                  <CalcInputField
                    label="Total Classes Held"
                    keyboardType="numeric"
                    value={total}
                    onChangeText={setTotal}
                    placeholder="48"
                  />
                </View>
              </View>

              {/* Quick Steppers for live tallying */}
              <View style={styles.stepperActionRow}>
                <TouchableOpacity
                  onPress={() => {
                    const a = (parseInt(attended, 10) || 0) + 1;
                    const t = (parseInt(total, 10) || 0) + 1;
                    setAttended(String(a));
                    setTotal(String(t));
                  }}
                  style={[styles.stepperPill, { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: '#10B981' }]}
                >
                  <Text style={[styles.stepperPillText, { color: '#10B981' }]}>+1 Present</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    const t = (parseInt(total, 10) || 0) + 1;
                    setTotal(String(t));
                  }}
                  style={[styles.stepperPill, { backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: '#EF4444' }]}
                >
                  <Text style={[styles.stepperPillText, { color: '#EF4444' }]}>+1 Absent</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleReset}
                  style={[styles.stepperPill, { backgroundColor: theme.isDark ? 'rgba(148, 163, 184, 0.12)' : '#E2E8F0', borderColor: 'transparent' }]}
                >
                  <Text style={[styles.stepperPillText, { color: theme.colors.textMuted }]}>↺ Reset</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.sectionLabel, { color: theme.isDark ? '#CBD5E1' : '#475569' }]}>
                Minimum Required Attendance Target
              </Text>
              <PresetPills
                options={[
                  { label: '75% (Std)', value: '75' },
                  { label: '80%', value: '80' },
                  { label: '85%', value: '85' },
                  { label: '90%', value: '90' },
                ]}
                selectedValue={String(targetPct)}
                onSelect={(val) => setTargetPct(Number(val))}
              />
            </Card>

            <ResultHeroCard
              title="Current Attendance"
              value={`${attRes.currentPercentage}%`}
              subText={attRes.message}
              variant={attRes.status === 'safe' ? 'accent' : 'primary'}
              badgeText={
                attRes.canBunkClasses > 0
                  ? `✓ Safe to Bunk: ${attRes.canBunkClasses} Classes`
                  : attRes.mustAttendClasses > 0
                  ? `⚠️ Need ${attRes.mustAttendClasses} Classes Continuously`
                  : `Target ${targetPct}% Met`
              }
              badgeType={attRes.status === 'safe' ? 'success' : 'danger'}
              secondaryStats={[
                { label: 'Present', value: `${attended} Classes` },
                {
                  label: 'Missed',
                  value: `${Math.max(0, (parseInt(total, 10) || 0) - (parseInt(attended, 10) || 0))} Classes`,
                },
                { label: 'Target', value: `${targetPct}%` },
              ]}
            />

            <FormulaInfoCard
              title="Attendance Safe Bunk Formula"
              formula="Safe Bunk = ⌊(Present × 100 - Target × Total) / Target⌋"
              explanation="Calculates maximum consecutive lectures you can miss without falling below the university requirement (typically 75%). If attendance is below 75%, it calculates the exact number of continuous classes required to recover."
            />
          </>
        )}

        {/* 2. SEMESTER SGPA GRADE SHEET */}
        {mode === 'sgpa' && (
          <>
            <ResultHeroCard
              title="Semester SGPA"
              value={`${sgpaResult.sgpa}`}
              subText={`Total ${sgpaResult.totalCredits} Credits | ~${Math.round(sgpaResult.sgpa * 9.5 * 10) / 10}% equivalent`}
              variant="primary"
              badgeText={`${subjects.length} Subjects Evaluated`}
              badgeType="success"
              secondaryStats={[
                { label: 'Total Credits', value: `${sgpaResult.totalCredits}` },
                { label: 'Grade Points', value: `${sgpaResult.totalPoints}` },
                { label: 'Status', value: sgpaResult.sgpa >= 7.5 ? 'First Class' : 'Pass', color: '#10B981' },
              ]}
            />

            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <View style={styles.cardHeaderRow}>
                <Text style={[styles.cardTitle, { color: theme.colors.text, marginBottom: 0, flex: 1 }]} numberOfLines={1}>
                  Semester Subjects & Credits
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  {(subjects.some((s) => s.id.startsWith('custom_sub_')) || subjects.length !== DEFAULT_SUBJECTS.length) && !showAddSubject && (
                    <TouchableOpacity
                      onPress={handleResetSubjects}
                      style={[
                        styles.addCustomBtn,
                        {
                          borderColor: 'rgba(239, 68, 68, 0.4)',
                          backgroundColor: theme.isDark ? 'rgba(239, 68, 68, 0.18)' : '#FEE2E2',
                        },
                      ]}
                    >
                      <Text style={[styles.addCustomBtnText, { color: '#EF4444' }]}>
                        🗑️ Reset ({subjects.length})
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => setShowAddSubject(!showAddSubject)}
                    style={[styles.addCustomBtn, { borderColor: theme.colors.primary }]}
                  >
                    <Text style={[styles.addCustomBtnText, { color: theme.colors.primary }]}>
                      {showAddSubject ? '✕ Close' : '＋ Add Subject'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Add subject form */}
              {showAddSubject && (
                <View style={[styles.customFormBox, { backgroundColor: theme.isDark ? '#0F172A' : '#F1F5F9', borderColor: theme.colors.primary }]}>
                  <Text style={[styles.customFormTitle, { color: theme.colors.primary }]}>
                    Add New Subject
                  </Text>
                  <CalcInputField
                    label="Subject Name"
                    keyboardType="default"
                    value={newSubName}
                    onChangeText={setNewSubName}
                    placeholder="e.g. Physics, Java Lab"
                  />
                  <View style={styles.rowInputs}>
                    <View style={styles.flex1}>
                      <CalcInputField
                        label="Credits (1-6)"
                        keyboardType="numeric"
                        value={newSubCredits}
                        onChangeText={setNewSubCredits}
                        placeholder="3"
                      />
                    </View>
                    <View style={styles.flex1}>
                      <CalcInputField
                        label="Grade Points (0-10)"
                        keyboardType="numeric"
                        value={newSubGrade}
                        onChangeText={setNewSubGrade}
                        placeholder="8"
                      />
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={handleAddSubject}
                    style={[styles.addSubmitBtn, { backgroundColor: theme.colors.primary }]}
                  >
                    <Text style={styles.addSubmitBtnText}>✓ Add Subject</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Subject list */}
              {subjects.map((sub, idx) => (
                <View key={sub.id} style={styles.subjectRow}>
                  <View style={{ flex: 1, paddingRight: 6 }}>
                    <Text style={[styles.subNameText, { color: theme.colors.text }]} numberOfLines={1}>
                      {idx + 1}. {sub.name}
                    </Text>
                    <Text style={{ fontSize: 11, color: theme.colors.textMuted }}>
                      {sub.credits} Credits × {sub.gradePoints} GP = {sub.credits * sub.gradePoints} pts
                    </Text>
                  </View>

                  {/* Credits Stepper */}
                  <View style={styles.stepperInline}>
                    <Text style={{ fontSize: 11, color: theme.colors.textMuted }}>Cr:</Text>
                    <TouchableOpacity
                      onPress={() => updateSubjectCredits(sub.id, sub.credits - 1)}
                      style={[styles.miniStepBtn, { borderColor: theme.colors.borderSubtle }]}
                    >
                      <Text style={{ color: theme.colors.text, fontSize: 12, fontWeight: '700' }}>-</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: theme.colors.text, minWidth: 16, textAlign: 'center' }}>
                      {sub.credits}
                    </Text>
                    <TouchableOpacity
                      onPress={() => updateSubjectCredits(sub.id, sub.credits + 1)}
                      style={[styles.miniStepBtn, { borderColor: theme.colors.borderSubtle }]}
                    >
                      <Text style={{ color: theme.colors.text, fontSize: 12, fontWeight: '700' }}>+</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Grade Selector */}
                  <View style={{ width: 85, marginHorizontal: 6 }}>
                    <CalcInputField
                      label=""
                      keyboardType="numeric"
                      value={String(sub.gradePoints)}
                      onChangeText={(val) => updateSubjectGrade(sub.id, parseFloat(val) || 0)}
                      placeholder="GP"
                    />
                  </View>

                  <TouchableOpacity
                    onPress={() => removeSubject(sub.id)}
                    style={{ padding: 4 }}
                  >
                    <Text style={{ color: '#EF4444', fontSize: 16, fontWeight: '700' }}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}

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
                <Text style={[styles.resetButtonText, { color: '#EF4444' }]}>↺ Reset Subjects</Text>
              </TouchableOpacity>
            </Card>

            <FormulaInfoCard
              title="SGPA Grade Point Average Formula"
              formula="SGPA = ∑(Course Credits × Grade Point) / ∑(Course Credits)"
              explanation="Universities weight course performance by course credits. Higher credit courses (like 4-credit core subjects) carry significantly higher impact on your cumulative grade point average."
            />
          </>
        )}

        {/* 3. CGPA TO PERCENTAGE */}
        {mode === 'cgpa' && (
          <>
            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Enter CGPA Score</Text>

              <CalcInputField
                label="Cumulative Grade Point Average (CGPA)"
                suffix="/ 10"
                keyboardType="numeric"
                value={cgpa}
                onChangeText={setCgpa}
                placeholder="8.4"
              />

              <Text style={[styles.sectionLabel, { color: theme.isDark ? '#CBD5E1' : '#475569' }]}>
                Conversion Formula / Scale
              </Text>
              <PresetPills
                options={[
                  { label: 'CBSE / AICTE (× 9.5)', value: 'cbse_9_5' },
                  { label: 'Direct Scale (× 10)', value: 'direct_10' },
                  { label: 'Custom University Formula', value: 'custom' },
                ]}
                selectedValue={cgpaScale}
                onSelect={(val) => setCgpaScale(val as any)}
                scrollable
              />

              {cgpaScale === 'custom' && (
                <View style={{ marginTop: 12 }}>
                  <CalcInputField
                    label="Custom University Multiplier"
                    prefix="×"
                    keyboardType="numeric"
                    value={customMultiplier}
                    onChangeText={setCustomMultiplier}
                    placeholder="e.g. 9.5, 10, or 7.1"
                  />
                </View>
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

            <ResultHeroCard
              title="Equivalent Percentage"
              value={`${cgpaRes.percentage}%`}
              subText={cgpaRes.division}
              variant="primary"
              badgeText={cgpaRes.formulaDescription}
              badgeType="info"
              secondaryStats={[
                { label: 'CGPA', value: `${cgpa} / 10` },
                { label: 'Division', value: cgpaRes.division },
                { label: 'Multiplier', value: `× ${cgpaScale === 'direct_10' ? '10' : cgpaScale === 'custom' ? customMultiplier : '9.5'}` },
              ]}
            />

            <FormulaInfoCard
              title="Official Conversion Guidelines"
              formula="Percentage = CGPA × Conversion Factor"
              explanation="Central Board of Secondary Education (CBSE) and AICTE prescribe multiplying CGPA by 9.5 to determine aggregate marks percentage."
            />
          </>
        )}

        {/* 4. MARKS NEEDED */}
        {mode === 'marks' && (
          <>
            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Internal & Target Marks</Text>

              <View style={styles.rowInputs}>
                <View style={styles.flex1}>
                  <CalcInputField
                    label="Internal Scored"
                    keyboardType="numeric"
                    value={internalScored}
                    onChangeText={setInternalScored}
                    placeholder="32"
                  />
                </View>
                <View style={styles.flex1}>
                  <CalcInputField
                    label="Internal Total"
                    keyboardType="numeric"
                    value={internalMax}
                    onChangeText={setInternalMax}
                    placeholder="40"
                  />
                </View>
              </View>

              <View style={styles.rowInputs}>
                <View style={styles.flex1}>
                  <CalcInputField
                    label="Target Overall %"
                    suffix="%"
                    keyboardType="numeric"
                    value={targetOverall}
                    onChangeText={setTargetOverall}
                    placeholder="75"
                  />
                </View>
                <View style={styles.flex1}>
                  <CalcInputField
                    label="Final Exam Max Marks"
                    keyboardType="numeric"
                    value={finalMax}
                    onChangeText={setFinalMax}
                    placeholder="60"
                  />
                </View>
              </View>

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

            <ResultHeroCard
              title="Marks Needed in Final Exam"
              value={`${marksRes.marksNeeded} / ${finalMax}`}
              subText={`You need to score at least ${marksRes.percentageNeeded}% in the final exam`}
              variant={marksRes.isPossible ? 'primary' : 'danger'}
              badgeText={marksRes.isPossible ? 'Achievable Target' : 'Exceeds Maximum Marks!'}
              badgeType={marksRes.isPossible ? 'success' : 'danger'}
              secondaryStats={[
                { label: 'Internals Scored', value: `${internalScored}/${internalMax}` },
                { label: 'Final Exam Need', value: `${marksRes.marksNeeded} Marks` },
                { label: 'Target Overall', value: `${targetOverall}%` },
              ]}
            />

            <FormulaInfoCard
              title="Weighted Exam Marks Formula"
              formula="Final Needed = (Target Overall% × Total - Internal Scored) / Final Weight"
              explanation="Calculates the exact minimum marks you must score in the end-semester or board exam to reach your desired percentage."
            />
          </>
        )}
      </ScrollView>

      <CalculationHistoryModal
        visible={showHistory}
        onClose={() => setShowHistory(false)}
        title="Student History"
        subtitle="Past attendance & CGPA calculations"
        records={history}
        onSelectRecord={handleSelectHistory}
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
    fontWeight: '800',
    marginBottom: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
    marginBottom: 4,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  stepperActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    marginBottom: 14,
  },
  stepperPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperPillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  addCustomBtn: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addCustomBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  customFormBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  customFormTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
  },
  addSubmitBtn: {
    marginTop: 8,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addSubmitBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(148, 163, 184, 0.2)',
  },
  subNameText: {
    fontSize: 13,
    fontWeight: '600',
  },
  stepperInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  miniStepBtn: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
});
