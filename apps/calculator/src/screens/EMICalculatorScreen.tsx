import React, { useState, useEffect } from 'react';
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
  FormulaInfoCard,
  AmortizationTable,
  CalculationHistoryModal,
} from '../components';
import { useTheme } from '@dailyapps/theme';
import { useAnalytics } from '@dailyapps/analytics';
import { useCalculationHistory } from '../hooks';
import { CalculationRecord } from '../types/history.types';

interface EMICalculatorScreenProps {
  navigation: any;
  route?: any;
}

type LoanMode = 'home' | 'car' | 'personal' | 'bike' | 'prepayment' | 'general';

export const EMICalculatorScreen: React.FC<EMICalculatorScreenProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const analytics = useAnalytics();

  const tool = route?.params?.tool;
  const initialMode: LoanMode = (() => {
    const id = tool?.id || '';
    if (id === 'home_loan') return 'home';
    if (id === 'car_loan') return 'car';
    if (id === 'personal_loan') return 'personal';
    if (id === 'bike_loan') return 'bike';
    if (id === 'loan_prepayment' || id === 'prepayment') return 'prepayment';
    return 'general';
  })();

  const [mode, setMode] = useState<LoanMode>(initialMode);

  // Form states
  const [principal, setPrincipal] = useState('500000');
  const [interestRate, setInterestRate] = useState('8.5');
  const [tenureYears, setTenureYears] = useState('5');
  const [isTenureInYears, setIsTenureInYears] = useState(true);

  // Prepayment specific state
  const [prepaymentFrequency, setPrepaymentFrequency] = useState<'annual' | 'one_time'>('annual');
  const [prepaymentAmount, setPrepaymentAmount] = useState('100000');
  const [prepaymentMonth, setPrepaymentMonth] = useState('12');

  // History modal
  const [showHistory, setShowHistory] = useState(false);
  const { history, saveCalculation, clearHistory, deleteItem } = useCalculationHistory(
    mode,
    '💰 Loans'
  );

  useEffect(() => {
    analytics.logScreenView('EMICalculatorScreen');
  }, [analytics]);

  const applyModeDefaults = (selectedMode: LoanMode) => {
    setMode(selectedMode);
    if (selectedMode === 'home') {
      setPrincipal('3000000');
      setInterestRate('8.5');
      setTenureYears('20');
      setIsTenureInYears(true);
    } else if (selectedMode === 'car') {
      setPrincipal('800000');
      setInterestRate('9.0');
      setTenureYears('5');
      setIsTenureInYears(true);
    } else if (selectedMode === 'personal') {
      setPrincipal('200000');
      setInterestRate('12.5');
      setTenureYears('3');
      setIsTenureInYears(true);
    } else if (selectedMode === 'bike') {
      setPrincipal('100000');
      setInterestRate('11.0');
      setTenureYears('2');
      setIsTenureInYears(true);
    } else if (selectedMode === 'prepayment') {
      setPrincipal('2500000');
      setInterestRate('8.5');
      setTenureYears('20');
      setIsTenureInYears(true);
      setPrepaymentAmount('100000');
      setPrepaymentMonth('12');
    } else {
      setPrincipal('500000');
      setInterestRate('10.0');
      setTenureYears('5');
      setIsTenureInYears(true);
    }
  };

  const handleReset = () => {
    applyModeDefaults(mode);
  };

  const p = parseFloat(principal) || 0;
  const annualRate = parseFloat(interestRate) || 0;
  const tenureVal = parseFloat(tenureYears) || 0;

  const totalMonths = isTenureInYears ? tenureVal * 12 : tenureVal;
  const monthlyRate = annualRate / (12 * 100);

  let emi = 0;
  let totalInterest = 0;
  let totalPayment = 0;

  if (p > 0 && totalMonths > 0) {
    if (monthlyRate > 0) {
      emi = (p * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    } else {
      emi = p / totalMonths;
    }
    totalPayment = emi * totalMonths;
    totalInterest = totalPayment - p;
  }

  // Prepayment Calculations
  const prepayAmt = parseFloat(prepaymentAmount) || 0;
  const prepayAtMonth = Math.min(totalMonths - 1, Math.max(1, parseFloat(prepaymentMonth) || 12));

  let interestSaved = 0;
  let monthsSaved = 0;
  let revisedTotalInterest = totalInterest;

  if (mode === 'prepayment' && p > 0 && emi > 0 && prepayAmt > 0) {
    let balance = p;
    let totalInterestWithPrepay = 0;
    let actualMonthsPaid = 0;

    for (let m = 1; m <= totalMonths && balance > 0; m++) {
      const monthInt = balance * monthlyRate;
      totalInterestWithPrepay += monthInt;
      let principalPaidThisMonth = emi - monthInt;

      if (prepaymentFrequency === 'annual') {
        if (m >= prepayAtMonth && (m - prepayAtMonth) % 12 === 0) {
          principalPaidThisMonth += prepayAmt;
        }
      } else {
        if (m === prepayAtMonth) {
          principalPaidThisMonth += prepayAmt;
        }
      }

      balance -= principalPaidThisMonth;
      actualMonthsPaid = m;

      if (balance <= 0) {
        break;
      }
    }

    revisedTotalInterest = totalInterestWithPrepay;
    interestSaved = Math.max(0, totalInterest - totalInterestWithPrepay);
    monthsSaved = Math.max(0, totalMonths - actualMonthsPaid);
  }

  const principalRatio = totalPayment > 0 ? (p / totalPayment) * 100 : 50;
  const interestRatio = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 50;

  const getHeaderInfo = () => {
    switch (mode) {
      case 'home':
        return { title: 'Home Loan EMI', subtitle: 'Long-term residential mortgage installments', icon: '🏡' };
      case 'car':
        return { title: 'Car Loan EMI', subtitle: 'Automobile four-wheeler auto loan payments', icon: '🚘' };
      case 'personal':
        return { title: 'Personal Loan EMI', subtitle: 'Short-term unsecured personal loan financing', icon: '💼' };
      case 'bike':
        return { title: 'Two-Wheeler Loan EMI', subtitle: 'Motorcycle & scooter monthly installments', icon: '🏍️' };
      case 'prepayment':
        return { title: 'Loan Prepayment Calculator', subtitle: 'Interest savings & tenure reduction with part payments', icon: '⚡' };
      default:
        return { title: 'General EMI Calculator', subtitle: 'Equal monthly installments and amortization schedule', icon: '💳' };
    }
  };

  const headerInfo = getHeaderInfo();

  const tenurePresets = isTenureInYears
    ? [
        { label: '1Y', value: '1' },
        { label: '3Y', value: '3' },
        { label: '5Y', value: '5' },
        { label: '10Y', value: '10' },
        { label: '15Y', value: '15' },
        { label: '20Y', value: '20' },
        { label: '25Y', value: '25' },
        { label: '30Y', value: '30' },
      ]
    : [
        { label: '6M', value: '6' },
        { label: '12M', value: '12' },
        { label: '24M', value: '24' },
        { label: '36M', value: '36' },
        { label: '60M', value: '60' },
      ];

  // Auto-record calculation into history
  useEffect(() => {
    if (p <= 0 || annualRate <= 0 || totalMonths <= 0 || emi <= 0) return;
    const timer = setTimeout(() => {
      saveCalculation({
        toolId: `loan_${mode}`,
        toolName: headerInfo.title,
        category: '💰 Loans',
        title: `${headerInfo.title}: ₹${Math.round(p).toLocaleString('en-IN')}`,
        subtitle: `${tenureYears} ${isTenureInYears ? 'Years' : 'Months'} @ ${annualRate}% p.a.`,
        result: mode === 'prepayment' ? `Saved: ₹${Math.round(interestSaved).toLocaleString('en-IN')}` : `EMI: ₹${Math.round(emi).toLocaleString('en-IN')}/mo`,
        secondaryResult: `Total Interest: ₹${Math.round(totalInterest).toLocaleString('en-IN')} | Total: ₹${Math.round(totalPayment).toLocaleString('en-IN')}`,
        badge: mode.toUpperCase(),
        inputs: {
          principal,
          interestRate,
          tenureYears,
          isTenureInYears,
          prepaymentAmount,
          prepaymentMonth,
        },
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [p, annualRate, totalMonths, emi, totalInterest, totalPayment, tenureYears, isTenureInYears, principal, interestRate, mode, interestSaved, prepaymentAmount, prepaymentMonth, saveCalculation, headerInfo.title]);

  const handleSelectHistory = (record: CalculationRecord) => {
    if (record.inputs) {
      if (record.inputs.principal) setPrincipal(record.inputs.principal);
      if (record.inputs.interestRate) setInterestRate(record.inputs.interestRate);
      if (record.inputs.tenureYears) setTenureYears(record.inputs.tenureYears);
      if (typeof record.inputs.isTenureInYears === 'boolean') {
        setIsTenureInYears(record.inputs.isTenureInYears);
      }
      if (record.inputs.prepaymentAmount) setPrepaymentAmount(record.inputs.prepaymentAmount);
      if (record.inputs.prepaymentMonth) setPrepaymentMonth(record.inputs.prepaymentMonth);
    }
  };

  return (
    <ScreenContainer safeArea withPadding={false}>
      <CalculatorHeader
        title={headerInfo.title}
        subtitle={headerInfo.subtitle}
        icon={headerInfo.icon}
        category="💰 Loans"
        toolId={tool?.id || `loan_${mode}`}
        onBack={() => navigation.goBack()}
        onHistory={() => setShowHistory(true)}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Navigation Tabs for Loans */}
        <SegmentedTabs
          tabs={[
            { key: 'home', label: 'Home Loan', icon: '🏡' },
            { key: 'car', label: 'Car Loan', icon: '🚘' },
            { key: 'personal', label: 'Personal Loan', icon: '💼' },
            { key: 'bike', label: 'Two-Wheeler', icon: '🏍️' },
            { key: 'prepayment', label: 'Prepayment', icon: '⚡' },
            { key: 'general', label: 'General EMI', icon: '💳' },
          ]}
          activeTab={mode}
          onTabChange={(k) => applyModeDefaults(k as LoanMode)}
          scrollable
        />

        {/* Input Card */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Loan Inputs</Text>

          <CalcInputField
            label="Loan Amount"
            prefix="₹"
            keyboardType="numeric"
            value={principal}
            onChangeText={setPrincipal}
            placeholder="e.g. 500000"
          />

          <CalcInputField
            label="Interest Rate"
            suffix="% p.a."
            keyboardType="numeric"
            value={interestRate}
            onChangeText={setInterestRate}
            placeholder="e.g. 8.5"
          />

          <CalcInputField
            label="Loan Tenure"
            suffix={isTenureInYears ? 'Years' : 'Months'}
            keyboardType="numeric"
            value={tenureYears}
            onChangeText={setTenureYears}
            placeholder={isTenureInYears ? 'Years' : 'Months'}
            rightElement={
              <View style={styles.toggleRow}>
                <TouchableOpacity
                  onPress={() => setIsTenureInYears(true)}
                  style={[
                    styles.toggleBtn,
                    isTenureInYears
                      ? {
                          backgroundColor: '#2563EB',
                          borderColor: theme.isDark ? '#60A5FA' : '#1D4ED8',
                          borderWidth: 1,
                        }
                      : { backgroundColor: theme.colors.surfaceSubtle },
                  ]}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      isTenureInYears
                        ? { color: '#ffffff', fontWeight: '800' }
                        : { color: theme.colors.textMuted, fontWeight: '600' },
                    ]}
                  >
                    Years
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsTenureInYears(false)}
                  style={[
                    styles.toggleBtn,
                    !isTenureInYears
                      ? {
                          backgroundColor: '#2563EB',
                          borderColor: theme.isDark ? '#60A5FA' : '#1D4ED8',
                          borderWidth: 1,
                        }
                      : { backgroundColor: theme.colors.surfaceSubtle },
                  ]}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      !isTenureInYears
                        ? { color: '#ffffff', fontWeight: '800' }
                        : { color: theme.colors.textMuted, fontWeight: '600' },
                    ]}
                  >
                    Months
                  </Text>
                </TouchableOpacity>
              </View>
            }
          />

          <Text style={[styles.presetLabel, { color: theme.isDark ? '#CBD5E1' : '#475569' }]}>
            Quick Select Tenure
          </Text>
          <PresetPills
            options={tenurePresets}
            selectedValue={tenureYears}
            onSelect={(val) => setTenureYears(String(val))}
            scrollable
          />

          {/* Prepayment Specific Extra Inputs */}
          {mode === 'prepayment' && (
            <View style={{ marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: theme.colors.borderSubtle }}>
              <Text style={[styles.cardTitle, { color: theme.colors.primary, fontSize: 14 }]}>
                ⚡ Extra Prepayment Strategy
              </Text>
              <PresetPills
                options={[
                  { label: '📅 Annual Prepayment', value: 'annual' },
                  { label: '⚡ One-Time Lump Sum', value: 'one_time' },
                ]}
                selectedValue={prepaymentFrequency}
                onSelect={(val) => setPrepaymentFrequency(val as any)}
              />

              <CalcInputField
                label={prepaymentFrequency === 'annual' ? "Annual Prepayment Amount (Every Year)" : "One-Time Lump Sum Amount"}
                prefix="₹"
                value={prepaymentAmount}
                onChangeText={setPrepaymentAmount}
                keyboardType="numeric"
                helperText={
                  prepaymentFrequency === 'annual'
                    ? "Extra principal paid every 12 months (e.g. annual bonus / savings)"
                    : "Single extra principal repayment made towards reducing loan debt"
                }
              />
              <PresetPills
                options={[
                  { label: '₹50,000', value: '50000' },
                  { label: '₹1 Lakh', value: '100000' },
                  { label: '₹2 Lakh', value: '200000' },
                  { label: '₹5 Lakh', value: '500000' },
                ]}
                selectedValue={prepaymentAmount}
                onSelect={(val) => setPrepaymentAmount(String(val))}
              />

              <CalcInputField
                label={prepaymentFrequency === 'annual' ? "Starting Month (e.g. Month 12)" : "Prepayment Paid in Month #"}
                suffix="Month"
                value={prepaymentMonth}
                onChangeText={setPrepaymentMonth}
                keyboardType="numeric"
                helperText="e.g. 12 = After completing 1st year"
              />
            </View>
          )}

          {/* Bottom Reset Button */}
          <TouchableOpacity
            onPress={handleReset}
            activeOpacity={0.7}
            style={[styles.bottomResetBtn, { borderColor: theme.colors.borderSubtle, backgroundColor: theme.colors.surfaceSubtle }]}
          >
            <Text style={[styles.bottomResetText, { color: theme.colors.textMuted }]}>↺ Reset Inputs</Text>
          </TouchableOpacity>
        </Card>

        {/* Hero Result Card */}
        {mode === 'prepayment' ? (
          <ResultHeroCard
            title="Total Interest Saved"
            value={`₹${Math.round(interestSaved).toLocaleString('en-IN')}`}
            subText={`Tenure reduced by ${monthsSaved} months (${(monthsSaved / 12).toFixed(1)} years)`}
            badgeText={
              prepaymentFrequency === 'annual'
                ? `ANNUAL: ₹${(parseFloat(prepaymentAmount) || 0).toLocaleString('en-IN')}/YR`
                : `ONE-TIME: ₹${(parseFloat(prepaymentAmount) || 0).toLocaleString('en-IN')} IN M${prepaymentMonth}`
            }
            badgeType="success"
            secondaryStats={[
              { label: 'Monthly EMI', value: `₹${Math.round(emi).toLocaleString('en-IN')}` },
              { label: 'Revised Interest', value: `₹${Math.round(revisedTotalInterest).toLocaleString('en-IN')}` },
              { label: 'Months Saved', value: `${monthsSaved} Mo`, color: '#10B981' },
            ]}
          />
        ) : (
          <ResultHeroCard
            title="Monthly EMI"
            value={`₹${Math.round(emi).toLocaleString('en-IN')}`}
            subText={`for ${totalMonths} months (${(totalMonths / 12).toFixed(1)} years)`}
            badgeText={`Total Interest: ₹${Math.round(totalInterest).toLocaleString('en-IN')}`}
            badgeType="warning"
            secondaryStats={[
              { label: 'Principal', value: `₹${Math.round(p).toLocaleString('en-IN')}` },
              { label: 'Total Interest', value: `₹${Math.round(totalInterest).toLocaleString('en-IN')}`, color: '#F59E0B' },
              { label: 'Total Payment', value: `₹${Math.round(totalPayment).toLocaleString('en-IN')}` },
            ]}
          />
        )}

        {/* Breakdown Card */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Payment Summary</Text>

          <View style={styles.barContainer}>
            <View style={[styles.barPart, { flex: principalRatio, backgroundColor: theme.colors.primary }]} />
            <View style={[styles.barPart, { flex: interestRatio, backgroundColor: '#F59E0B' }]} />
          </View>

          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
              <Text style={[styles.legendText, { color: theme.colors.textMuted }]}>
                Principal ({principalRatio.toFixed(1)}%)
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
              <Text style={[styles.legendText, { color: theme.colors.textMuted }]}>
                Interest ({interestRatio.toFixed(1)}%)
              </Text>
            </View>
          </View>

          <BreakdownRow
            label="Principal Borrowed"
            value={`₹${Math.round(p).toLocaleString('en-IN')}`}
            dotColor={theme.colors.primary}
            showDivider
          />
          <BreakdownRow
            label={mode === 'prepayment' ? 'Standard Interest (Without Prepayment)' : 'Total Interest Payable'}
            value={`₹${Math.round(totalInterest).toLocaleString('en-IN')}`}
            valueColor="#F59E0B"
            dotColor="#F59E0B"
            showDivider
          />
          {mode === 'prepayment' && (
            <>
              <BreakdownRow
                label="Direct Interest Saved"
                value={`-₹${Math.round(interestSaved).toLocaleString('en-IN')}`}
                valueColor="#10B981"
                dotColor="#10B981"
                showDivider
              />
              <BreakdownRow
                label="Loan Free Early By"
                value={`${monthsSaved} Months (${(monthsSaved / 12).toFixed(1)} Years)`}
                valueColor="#10B981"
                dotColor="#10B981"
                showDivider
              />
            </>
          )}
          <BreakdownRow
            label="Total Amount Payable"
            value={`₹${Math.round(mode === 'prepayment' ? p + revisedTotalInterest : totalPayment).toLocaleString('en-IN')}`}
            isBold
            isHighlight
            valueColor={theme.colors.primary}
          />
        </Card>

        {/* Amortization Schedule Table */}
        {totalMonths > 0 && emi > 0 && (
          <AmortizationTable
            principal={p}
            annualRate={annualRate}
            months={totalMonths}
            emi={emi}
            showYearlyOnly={totalMonths > 60}
          />
        )}

        <FormulaInfoCard
          title="Loan EMI & Amortization Formula"
          formula="EMI = [P × r × (1 + r)^n] / [(1 + r)^n – 1]"
          explanation="Where P is principal borrowed amount, r is monthly rate of interest (annual rate / 12 / 100), and n is total duration in months. Prepaying principal directly cuts the compounding duration, saving thousands in unaccrued interest."
        />
      </ScrollView>

      <CalculationHistoryModal
        visible={showHistory}
        onClose={() => setShowHistory(false)}
        title="Loan History"
        subtitle="Saved EMI calculations & scenarios"
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
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  toggleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {
    fontSize: 12,
  },
  presetLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 4,
  },
  barContainer: {
    height: 12,
    borderRadius: 6,
    flexDirection: 'row',
    overflow: 'hidden',
    marginVertical: 12,
  },
  barPart: {
    height: '100%',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bottomResetBtn: {
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomResetText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
