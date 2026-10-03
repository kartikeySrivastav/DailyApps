import React, { useState, useEffect, useMemo } from 'react';
import {
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
  calculateExactAge,
  calculateDateDifference,
  calculateAddSubtractDate,
  calculateWorkingDays,
} from '../calculations/dateTime';

interface AgeCalculatorScreenProps {
  navigation: any;
  route?: any;
}

type DateMode = 'age' | 'date_diff' | 'add_sub' | 'working_days';

export const AgeCalculatorScreen: React.FC<AgeCalculatorScreenProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const analytics = useAnalytics();

  const tool = route?.params?.tool;
  const initialMode: DateMode =
    tool?.id === 'date_difference'
      ? 'date_diff'
      : tool?.id === 'date_add_sub'
      ? 'add_sub'
      : tool?.id === 'working_days'
      ? 'working_days'
      : 'age';

  const [mode, setMode] = useState<DateMode>(initialMode);

  // Tab 1: Age Inputs
  const [bDay, setBDay] = useState('15');
  const [bMonth, setBMonth] = useState('8');
  const [bYear, setBYear] = useState('2000');

  // Tab 2: Date Difference Inputs
  const [d1Day, setD1Day] = useState('1');
  const [d1Month, setD1Month] = useState('1');
  const [d1Year, setD1Year] = useState('2024');

  const [d2Day, setD2Day] = useState('31');
  const [d2Month, setD2Month] = useState('12');
  const [d2Year, setD2Year] = useState('2024');

  // Tab 3: Add/Subtract Inputs
  const [baseDay, setBaseDay] = useState('1');
  const [baseMonth, setBaseMonth] = useState('10');
  const [baseYear, setBaseYear] = useState('2024');
  const [daysCount, setDaysCount] = useState('45');
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');

  // History modal
  const [showHistory, setShowHistory] = useState(false);
  const { history, saveCalculation, deleteItem, clearHistory } = useCalculationHistory(
    mode,
    '📅 Date & Time'
  );

  useEffect(() => {
    analytics.logScreenView('DateTimeSuiteScreen');
  }, [analytics]);

  // Calculations
  const ageResult = useMemo(() => {
    const d = parseInt(bDay, 10) || 1;
    const m = parseInt(bMonth, 10) || 1;
    const y = parseInt(bYear, 10) || 2000;
    const birthDate = new Date(y, m - 1, d);
    return calculateExactAge(birthDate);
  }, [bDay, bMonth, bYear]);

  const diffResult = useMemo(() => {
    const d1 = new Date(parseInt(d1Year, 10) || 2024, (parseInt(d1Month, 10) || 1) - 1, parseInt(d1Day, 10) || 1);
    const d2 = new Date(parseInt(d2Year, 10) || 2024, (parseInt(d2Month, 10) || 1) - 1, parseInt(d2Day, 10) || 1);
    return calculateDateDifference(d1, d2);
  }, [d1Day, d1Month, d1Year, d2Day, d2Month, d2Year]);

  const addSubResult = useMemo(() => {
    const d = new Date(parseInt(baseYear, 10) || 2024, (parseInt(baseMonth, 10) || 1) - 1, parseInt(baseDay, 10) || 1);
    const count = parseInt(daysCount, 10) || 0;
    return calculateAddSubtractDate(d, count, operation);
  }, [baseDay, baseMonth, baseYear, daysCount, operation]);

  const workingDaysResult = useMemo(() => {
    const d1 = new Date(parseInt(d1Year, 10) || 2024, (parseInt(d1Month, 10) || 1) - 1, parseInt(d1Day, 10) || 1);
    const d2 = new Date(parseInt(d2Year, 10) || 2024, (parseInt(d2Month, 10) || 1) - 1, parseInt(d2Day, 10) || 1);
    return calculateWorkingDays(d1, d2);
  }, [d1Day, d1Month, d1Year, d2Day, d2Month, d2Year]);

  const handleReset = () => {
    if (mode === 'age') {
      setBDay('15');
      setBMonth('8');
      setBYear('2000');
    } else if (mode === 'date_diff' || mode === 'working_days') {
      setD1Day('1');
      setD1Month('1');
      setD1Year('2024');
      setD2Day('31');
      setD2Month('12');
      setD2Year('2024');
    } else {
      setBaseDay('1');
      setBaseMonth('10');
      setBaseYear('2024');
      setDaysCount('45');
      setOperation('add');
    }
  };

  // Auto-save calculation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mode === 'age' && ageResult.years > 0) {
        saveCalculation({
          toolId: 'age',
          toolName: 'Age Calculator',
          category: '📅 Date & Time',
          title: `Age: ${ageResult.years} Yrs, ${ageResult.months} Mos, ${ageResult.days} Days`,
          subtitle: `Born: ${bDay}/${bMonth}/${bYear} | Zodiac: ${ageResult.zodiac}`,
          result: `${ageResult.years} Years Old`,
          badge: ageResult.zodiac.toUpperCase(),
          inputs: { bDay, bMonth, bYear },
        });
      } else if (mode === 'date_diff') {
        saveCalculation({
          toolId: 'date_difference',
          toolName: 'Date Difference',
          category: '📅 Date & Time',
          title: `Difference: ${diffResult.totalDays} Days`,
          subtitle: `${diffResult.weeks} weeks ${diffResult.remainingDays} days | ${diffResult.months} months`,
          result: `${diffResult.totalDays} Days`,
          badge: 'INTERVAL',
          inputs: { d1Day, d1Month, d1Year, d2Day, d2Month, d2Year },
        });
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [mode, ageResult, diffResult, bDay, bMonth, bYear, d1Day, d1Month, d1Year, d2Day, d2Month, d2Year, saveCalculation]);

  return (
    <ScreenContainer safeArea withPadding={false}>
      <CalculatorHeader
        title="Date & Time Suite"
        subtitle="Age, Differences, Add Days & Workdays"
        icon="📅"
        category="📅 Date & Time"
        toolId={tool?.id || 'date_time'}
        onBack={() => navigation.goBack()}
        onHistory={() => setShowHistory(true)}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <SegmentedTabs
          scrollable
          activeTab={mode}
          onTabChange={(key) => setMode(key as DateMode)}
          tabs={[
            { key: 'age', label: 'Exact Age', icon: '🎂' },
            { key: 'date_diff', label: 'Date Difference', icon: '↔️' },
            { key: 'add_sub', label: 'Add/Subtract Days', icon: '➕' },
            { key: 'working_days', label: 'Work Days', icon: '💼' },
          ]}
        />

        {/* ========================================================================= */}
        {/* 1. EXACT AGE TAB */}
        {/* ========================================================================= */}
        {mode === 'age' && (
          <>
            <ResultHeroCard
              title="Current Exact Age"
              value={`${ageResult.years} Years, ${ageResult.months} Mos`}
              subText={`${ageResult.days} Days | Zodiac: ${ageResult.zodiac}`}
              badgeText={`NEXT BDAY IN ${ageResult.nextBirthdayDays} DAYS`}
              badgeType="success"
              secondaryStats={[
                { label: 'Total Weeks', value: `${ageResult.totalWeeks.toLocaleString('en-IN')}` },
                { label: 'Total Days', value: `${ageResult.totalDays.toLocaleString('en-IN')}` },
                { label: 'Total Hours', value: `${ageResult.totalHours.toLocaleString('en-IN')}` },
              ]}
            />

            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Birth Date (DD / MM / YYYY)</Text>

              <CalcInputField
                label="Day (1-31)"
                keyboardType="numeric"
                value={bDay}
                onChangeText={setBDay}
                placeholder="15"
              />
              <CalcInputField
                label="Month (1-12)"
                keyboardType="numeric"
                value={bMonth}
                onChangeText={setBMonth}
                placeholder="8"
              />
              <CalcInputField
                label="Year (YYYY)"
                keyboardType="numeric"
                value={bYear}
                onChangeText={setBYear}
                placeholder="2000"
              />

              <PresetPills
                options={[{ label: '1995', value: '1995' }, { label: '1998', value: '1998' }, { label: '2000', value: '2000' }, { label: '2005', value: '2005' }]}
                selectedValue={bYear}
                onSelect={(val) => setBYear(String(val))}
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
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Life Milestones Lived</Text>
              <BreakdownRow label="Zodiac Sun Sign" value={ageResult.zodiac} showDivider />
              <BreakdownRow label="Total Months Lived" value={`${ageResult.totalMonths} months`} showDivider />
              <BreakdownRow label="Total Weeks Lived" value={`${ageResult.totalWeeks} weeks`} showDivider />
              <BreakdownRow label="Total Calendar Days" value={`${ageResult.totalDays} days`} isBold showDivider />
              <BreakdownRow label="Next Birthday In" value={`${ageResult.nextBirthdayDays} days`} valueColor="#10B981" isBold />
            </Card>
          </>
        )}

        {/* ========================================================================= */}
        {/* 2. DATE DIFFERENCE TAB */}
        {/* ========================================================================= */}
        {mode === 'date_diff' && (
          <>
            <ResultHeroCard
              title="Time Duration Between Dates"
              value={`${diffResult.totalDays} Days`}
              subText={`${diffResult.weeks} Weeks and ${diffResult.remainingDays} Days`}
              badgeText="CALENDAR DIFFERENCE"
              badgeType="info"
              secondaryStats={[
                { label: 'Total Weeks', value: `${diffResult.weeks}` },
                { label: 'Approx Months', value: `${diffResult.months}` },
                { label: 'Approx Years', value: `${diffResult.years}` },
              ]}
            />

            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Start Date (DD / MM / YYYY)</Text>
              <CalcInputField label="Day" keyboardType="numeric" value={d1Day} onChangeText={setD1Day} />
              <CalcInputField label="Month" keyboardType="numeric" value={d1Month} onChangeText={setD1Month} />
              <CalcInputField label="Year" keyboardType="numeric" value={d1Year} onChangeText={setD1Year} />

              <Text style={[styles.cardTitle, { color: theme.colors.text, marginTop: 14 }]}>End Date (DD / MM / YYYY)</Text>
              <CalcInputField label="Day" keyboardType="numeric" value={d2Day} onChangeText={setD2Day} />
              <CalcInputField label="Month" keyboardType="numeric" value={d2Month} onChangeText={setD2Month} />
              <CalcInputField label="Year" keyboardType="numeric" value={d2Year} onChangeText={setD2Year} />

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
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Equivalent Breakdown</Text>
              <BreakdownRow label="Total Days" value={`${diffResult.totalDays} days`} isBold showDivider />
              <BreakdownRow label="Weeks & Days" value={`${diffResult.weeks} weeks + ${diffResult.remainingDays} days`} showDivider />
              <BreakdownRow label="Approximate Months" value={`${diffResult.months} months`} showDivider />
              <BreakdownRow label="Approximate Years" value={`${diffResult.years} years`} />
            </Card>
          </>
        )}

        {/* ========================================================================= */}
        {/* 3. ADD / SUBTRACT DAYS TAB */}
        {/* ========================================================================= */}
        {mode === 'add_sub' && (
          <>
            <ResultHeroCard
              title="Calculated Target Date"
              value={addSubResult.formattedDate}
              subText={`Day of the Week: ${addSubResult.dayOfWeek}`}
              badgeText={`${operation.toUpperCase()}ED ${daysCount} DAYS`}
              badgeType="success"
              secondaryStats={[
                { label: 'Operation', value: operation === 'add' ? 'Addition (+)' : 'Subtraction (-)' },
                { label: 'Days Count', value: `${daysCount} days` },
                { label: 'Weekday', value: addSubResult.dayOfWeek },
              ]}
            />

            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Base Date & Operation</Text>

              <SegmentedTabs
                activeTab={operation}
                onTabChange={(key) => setOperation(key as 'add' | 'subtract')}
                tabs={[
                  { key: 'add', label: 'Add Days (+)', icon: '➕' },
                  { key: 'subtract', label: 'Subtract Days (-)', icon: '➖' },
                ]}
              />

              <CalcInputField label="Start Day" keyboardType="numeric" value={baseDay} onChangeText={setBaseDay} />
              <CalcInputField label="Start Month" keyboardType="numeric" value={baseMonth} onChangeText={setBaseMonth} />
              <CalcInputField label="Start Year" keyboardType="numeric" value={baseYear} onChangeText={setBaseYear} />

              <CalcInputField
                label="Number of Days to Adjust"
                keyboardType="numeric"
                value={daysCount}
                onChangeText={setDaysCount}
                placeholder="e.g. 45"
              />
              <PresetPills
                options={[{ label: '7 Days', value: '7' }, { label: '15 Days', value: '15' }, { label: '30 Days', value: '30' }, { label: '60 Days', value: '60' }, { label: '90 Days', value: '90' }]}
                selectedValue={daysCount}
                onSelect={(val) => setDaysCount(String(val))}
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
          </>
        )}

        {/* ========================================================================= */}
        {/* 4. WORK / BUSINESS DAYS TAB */}
        {/* ========================================================================= */}
        {mode === 'working_days' && (
          <>
            <ResultHeroCard
              title="Official Working Days"
              value={`${workingDaysResult.businessWorkingDays} Business Days`}
              subText={`Excludes ${workingDaysResult.weekendDays} Weekend Days (Sat/Sun)`}
              badgeText="EXCLUDING WEEKENDS"
              badgeType="info"
              secondaryStats={[
                { label: 'Work Days', value: `${workingDaysResult.businessWorkingDays}` },
                { label: 'Weekend Days', value: `${workingDaysResult.weekendDays}` },
                { label: 'Calendar Days', value: `${workingDaysResult.totalCalendarDays}` },
              ]}
            />

            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Range Dates (DD / MM / YYYY)</Text>
              <CalcInputField label="Start Day" keyboardType="numeric" value={d1Day} onChangeText={setD1Day} />
              <CalcInputField label="Start Month" keyboardType="numeric" value={d1Month} onChangeText={setD1Month} />
              <CalcInputField label="Start Year" keyboardType="numeric" value={d1Year} onChangeText={setD1Year} />

              <CalcInputField label="End Day" keyboardType="numeric" value={d2Day} onChangeText={setD2Day} />
              <CalcInputField label="End Month" keyboardType="numeric" value={d2Month} onChangeText={setD2Month} />
              <CalcInputField label="End Year" keyboardType="numeric" value={d2Year} onChangeText={setD2Year} />

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
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Work Schedule Summary</Text>
              <BreakdownRow label="Total Calendar Days" value={`${workingDaysResult.totalCalendarDays} days`} showDivider />
              <BreakdownRow label="Business Work Days (Mon-Fri)" value={`${workingDaysResult.businessWorkingDays} days`} isBold valueColor="#10B981" showDivider />
              <BreakdownRow label="Weekend Days (Sat & Sun)" value={`${workingDaysResult.weekendDays} days`} valueColor="#F59E0B" />
            </Card>
          </>
        )}

        <FormulaTabs
          formula={
            mode === 'age'
              ? 'Age = Current Date - Birth Date'
              : mode === 'date_diff'
              ? 'Diff = End Date - Start Date'
              : mode === 'add_sub'
              ? 'Target Date = Start Date ± N Days'
              : 'Business Days = Total Days - Weekends'
          }
          howItWorks={[
            '1. Calculations adjust for leap years and varied days per month (28-31).',
            '2. Accurate zodiac sign mapping based on tropical astrological dates.',
            '3. Business day calculations count Mondays through Fridays.',
          ]}
          example={{
            input: 'Born 15 August 2000',
            calculation: '24 years lived + next birthday countdown',
            output: 'Leo sign with full milestone analytics',
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
