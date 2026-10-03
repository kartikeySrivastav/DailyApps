import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
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
  calculateFD,
  calculateRD,
  calculateFDPayout,
  calculateSimpleInterest,
  calculateSavingsInterest,
  calculateGratuity,
} from '../calculations/banking';

interface BankingCalculatorScreenProps {
  navigation: any;
  route?: any;
}

type BankingMode = 'fd' | 'rd' | 'fd_payout' | 'simple_interest' | 'savings' | 'gratuity';

export const BankingCalculatorScreen: React.FC<BankingCalculatorScreenProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const analytics = useAnalytics();

  const tool = route?.params?.tool;
  const initialMode: BankingMode =
    tool?.id === 'rd_calculator' || tool?.id === 'rd_maturity'
      ? 'rd'
      : tool?.id === 'fd_interest'
      ? 'fd_payout'
      : tool?.id === 'simple_interest'
      ? 'simple_interest'
      : tool?.id === 'savings_interest'
      ? 'savings'
      : tool?.id === 'gratuity'
      ? 'gratuity'
      : 'fd';

  const [mode, setMode] = useState<BankingMode>(initialMode);

  // Form states
  const [deposit, setDeposit] = useState('100000');
  const [rate, setRate] = useState('7.1');
  const [years, setYears] = useState('3');
  const [isSeniorCitizen, setIsSeniorCitizen] = useState(false);
  const [compounding, setCompounding] = useState<'quarterly' | 'monthly' | 'half_yearly' | 'annual'>('quarterly');
  const [deductTDS, setDeductTDS] = useState(false);

  // Gratuity specific states
  const [salary, setSalary] = useState('50000');
  const [tenureYears, setTenureYears] = useState('7');

  // Savings specific state
  const [savingsBalance, setSavingsBalance] = useState('150000');
  const [savingsRate, setSavingsRate] = useState('3.5');

  // History modal
  const [showHistory, setShowHistory] = useState(false);
  const { history, saveCalculation, deleteItem, clearHistory } = useCalculationHistory(
    mode,
    '🏦 Banking'
  );

  useEffect(() => {
    analytics.logScreenView('BankingCalculatorScreen');
  }, [analytics]);

  useEffect(() => {
    if (tool?.id) {
      if (tool.id === 'rd_calculator' || tool.id === 'rd_maturity') {
        setMode('rd');
        setDeposit('5000');
        setRate('6.8');
        setYears('3');
      } else if (tool.id === 'fd_interest') {
        setMode('fd_payout');
        setDeposit('500000');
        setRate('7.25');
        setYears('5');
      } else if (tool.id === 'simple_interest') {
        setMode('simple_interest');
        setDeposit('50000');
        setRate('10');
        setYears('2');
      } else if (tool.id === 'savings_interest') {
        setMode('savings');
        setSavingsBalance('100000');
        setSavingsRate('3.5');
      } else if (tool.id === 'gratuity') {
        setMode('gratuity');
        setSalary('60000');
        setTenureYears('8');
      } else {
        setMode('fd');
        setDeposit('100000');
        setRate('7.1');
        setYears('3');
      }
    }
  }, [tool?.id]);

  const numDeposit = parseFloat(deposit) || 0;
  const numRate = parseFloat(rate) || 0;
  const numYears = parseFloat(years) || 0;
  const numSalary = parseFloat(salary) || 0;
  const numTenure = parseFloat(tenureYears) || 0;
  const numSavingsBalance = parseFloat(savingsBalance) || 0;
  const numSavingsRate = parseFloat(savingsRate) || 0;

  // Calculation Results
  const fdResult = calculateFD({
    depositAmount: numDeposit,
    annualRate: numRate,
    years: numYears,
    isSeniorCitizen,
    compounding,
    deductTDS,
  });

  const rdResult = calculateRD({
    monthlyDeposit: numDeposit,
    annualRate: numRate,
    months: numYears * 12,
    isSeniorCitizen,
  });

  const fdPayoutResult = calculateFDPayout({
    depositAmount: numDeposit,
    annualRate: numRate,
    years: numYears,
    isSeniorCitizen,
  });

  const siResult = calculateSimpleInterest({
    principal: numDeposit,
    annualRate: numRate,
    years: numYears,
  });

  const savingsResult = calculateSavingsInterest({
    averageBalance: numSavingsBalance,
    annualRate: numSavingsRate,
  });

  const gratuityResult = calculateGratuity({
    lastDrawnBasicSalary: numSalary,
    yearsOfService: numTenure,
  });

  // Auto-save history on valid inputs
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mode === 'fd' && numDeposit > 0 && numYears > 0) {
        saveCalculation({
          toolId: 'fd_calculator',
          toolName: 'Fixed Deposit (FD)',
          category: '🏦 Banking',
          title: `FD: ₹${numDeposit.toLocaleString('en-IN')} (${numYears}Y @ ${numRate}%)`,
          subtitle: `Maturity: ₹${fdResult.maturityAmount.toLocaleString('en-IN')}`,
          result: `₹${fdResult.maturityAmount.toLocaleString('en-IN')}`,
          secondaryResult: `Interest: +₹${fdResult.interestEarned.toLocaleString('en-IN')}`,
          badge: 'FD',
          inputs: { deposit, rate, years, isSeniorCitizen },
        });
      } else if (mode === 'rd' && numDeposit > 0 && numYears > 0) {
        saveCalculation({
          toolId: 'rd_calculator',
          toolName: 'Recurring Deposit (RD)',
          category: '🏦 Banking',
          title: `RD: ₹${numDeposit.toLocaleString('en-IN')}/mo (${numYears}Y @ ${numRate}%)`,
          subtitle: `Maturity: ₹${rdResult.maturityAmount.toLocaleString('en-IN')}`,
          result: `₹${rdResult.maturityAmount.toLocaleString('en-IN')}`,
          secondaryResult: `Interest: +₹${rdResult.interestEarned.toLocaleString('en-IN')}`,
          badge: 'RD',
          inputs: { deposit, rate, years, isSeniorCitizen },
        });
      } else if (mode === 'simple_interest' && numDeposit > 0 && numYears > 0) {
        saveCalculation({
          toolId: 'simple_interest',
          toolName: 'Simple Interest',
          category: '🏦 Banking',
          title: `SI: ₹${numDeposit.toLocaleString('en-IN')} (${numYears}Y @ ${numRate}%)`,
          subtitle: `Interest: ₹${siResult.interestEarned.toLocaleString('en-IN')}`,
          result: `₹${siResult.totalAmount.toLocaleString('en-IN')}`,
          secondaryResult: `Interest: +₹${siResult.interestEarned.toLocaleString('en-IN')}`,
          badge: 'SI',
          inputs: { deposit, rate, years },
        });
      } else if (mode === 'gratuity' && numSalary > 0 && numTenure >= 5) {
        saveCalculation({
          toolId: 'gratuity',
          toolName: 'Gratuity Calculator',
          category: '🏦 Banking',
          title: `Gratuity: ₹${numSalary.toLocaleString('en-IN')} Basic (${numTenure}Y)`,
          subtitle: `Payable: ₹${gratuityResult.cappedGratuity.toLocaleString('en-IN')}`,
          result: `₹${gratuityResult.cappedGratuity.toLocaleString('en-IN')}`,
          secondaryResult: `Tax Exempt: ₹${gratuityResult.taxExemptAmount.toLocaleString('en-IN')}`,
          badge: 'Gratuity',
          inputs: { salary, tenureYears },
        });
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [mode, numDeposit, numRate, numYears, numSalary, numTenure, isSeniorCitizen]);

  const handleReset = () => {
    if (mode === 'fd') {
      setDeposit('100000');
      setRate('7.1');
      setYears('3');
      setIsSeniorCitizen(false);
    } else if (mode === 'rd') {
      setDeposit('5000');
      setRate('6.8');
      setYears('3');
      setIsSeniorCitizen(false);
    } else if (mode === 'fd_payout') {
      setDeposit('500000');
      setRate('7.25');
      setYears('5');
      setIsSeniorCitizen(false);
    } else if (mode === 'simple_interest') {
      setDeposit('50000');
      setRate('10');
      setYears('2');
    } else if (mode === 'savings') {
      setSavingsBalance('150000');
      setSavingsRate('3.5');
    } else if (mode === 'gratuity') {
      setSalary('50000');
      setTenureYears('7');
    }
  };

  const getHeaderInfo = () => {
    switch (mode) {
      case 'fd':
        return { title: 'Fixed Deposit (FD)', subtitle: 'Guaranteed quarterly returns & maturity', icon: '🏦' };
      case 'rd':
        return { title: 'Recurring Deposit (RD)', subtitle: 'Monthly installment savings plan', icon: '📥' };
      case 'fd_payout':
        return { title: 'FD Interest Payout', subtitle: 'Monthly & quarterly regular cashflow', icon: '💵' };
      case 'simple_interest':
        return { title: 'Simple Interest', subtitle: 'Classic SI = (P × R × T) / 100', icon: '🔢' };
      case 'savings':
        return { title: 'Savings Interest', subtitle: 'RBI daily balance quarterly interest', icon: '🪙' };
      case 'gratuity':
        return { title: 'Gratuity Calculator', subtitle: 'Statutory 15/26 retirement benefit', icon: '💼' };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <ScreenContainer safeArea withPadding={false}>
      <CalculatorHeader
        title={headerInfo.title}
        subtitle={headerInfo.subtitle}
        category="🏦 Banking"
        icon={headerInfo.icon}
        toolId={mode === 'fd' ? 'fd_calculator' : mode === 'rd' ? 'rd_calculator' : mode}
        onBack={() => navigation.goBack()}
        onHistory={() => setShowHistory(true)}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Navigation Tabs for Banking Calculators */}
        <SegmentedTabs
          tabs={[
            { key: 'fd', label: 'FD Maturity', icon: '🏦' },
            { key: 'rd', label: 'RD Maturity', icon: '📥' },
            { key: 'fd_payout', label: 'FD Payout', icon: '💵' },
            { key: 'simple_interest', label: 'Simple Interest', icon: '🔢' },
            { key: 'savings', label: 'Savings', icon: '🪙' },
            { key: 'gratuity', label: 'Gratuity', icon: '💼' },
          ]}
          activeTab={mode}
          onTabChange={(k) => setMode(k as BankingMode)}
          scrollable
        />

        {/* ========================================================================= */}
        {/* 1. FD & RD MODE */}
        {/* ========================================================================= */}
        {(mode === 'fd' || mode === 'rd') && (
          <>
            <ResultHeroCard
              title="Total Maturity Amount"
              value={`₹${(mode === 'fd' ? fdResult.maturityAmount : rdResult.maturityAmount).toLocaleString('en-IN')}`}
              subText={`for ${numYears} years at ${numRate}% p.a.`}
              badgeText={isSeniorCitizen ? 'Senior Citizen (+0.50% Applied)' : `Interest: +₹${(mode === 'fd' ? fdResult.interestEarned : rdResult.interestEarned).toLocaleString('en-IN')}`}
              badgeType="success"
              secondaryStats={[
                { label: 'Deposited', value: `₹${(mode === 'fd' ? fdResult.totalDeposited : rdResult.totalDeposited).toLocaleString('en-IN')}` },
                { label: 'Interest', value: `+₹${(mode === 'fd' ? fdResult.interestEarned : rdResult.interestEarned).toLocaleString('en-IN')}`, color: '#10B981' },
                { label: 'Tenure', value: `${numYears} Years` },
              ]}
            />

            {/* Inputs Card */}
            <Card style={styles.cardSpacing}>
              <CalcInputField
                label={mode === 'fd' ? 'Total Deposit Amount' : 'Monthly Deposit'}
                prefix="₹"
                value={deposit}
                onChangeText={setDeposit}
                keyboardType="numeric"
                helperText={mode === 'fd' ? 'One-time fixed term deposit' : 'Monthly recurring deduction'}
              />
              <PresetPills
                options={mode === 'fd' ? [{ label: '₹25K', value: '25000' }, { label: '₹50K', value: '50000' }, { label: '₹1L', value: '100000' }, { label: '₹5L', value: '500000' }] : [{ label: '₹1K', value: '1000' }, { label: '₹2.5K', value: '2500' }, { label: '₹5K', value: '5000' }, { label: '₹10K', value: '10000' }]}
                selectedValue={deposit}
                onSelect={(val) => setDeposit(String(val))}
              />

              <CalcInputField
                label="Annual Interest Rate"
                suffix="% p.a."
                value={rate}
                onChangeText={setRate}
                keyboardType="numeric"
                helperText={isSeniorCitizen ? `Effective: ${(numRate + 0.5).toFixed(2)}% with +0.5% senior bonus` : 'Standard bank interest rate'}
              />
              <PresetPills
                options={[{ label: '6.5%', value: '6.5' }, { label: '7.0%', value: '7.0' }, { label: '7.5%', value: '7.5' }, { label: '8.0%', value: '8.0' }]}
                selectedValue={rate}
                onSelect={(val) => setRate(String(val))}
              />

              <CalcInputField
                label="Tenure"
                suffix="Years"
                value={years}
                onChangeText={setYears}
                keyboardType="numeric"
                helperText={mode === 'rd' ? `Total: ${Math.round(numYears * 12)} monthly installments` : undefined}
              />
              <PresetPills
                options={[{ label: '1Y', value: '1' }, { label: '2Y', value: '2' }, { label: '3Y', value: '3' }, { label: '5Y', value: '5' }]}
                selectedValue={years}
                onSelect={(val) => setYears(String(val))}
              />

              {/* Compounding Frequency (FD mode) */}
              {mode === 'fd' && (
                <View style={{ marginTop: 12 }}>
                  <Text style={[styles.switchTitle, { color: theme.colors.text, fontSize: 13, marginBottom: 8 }]}>
                    Compounding Frequency
                  </Text>
                  <PresetPills
                    options={[
                      { label: 'Quarterly (Std)', value: 'quarterly' },
                      { label: 'Monthly', value: 'monthly' },
                      { label: 'Half-Yearly', value: 'half_yearly' },
                      { label: 'Annual', value: 'annual' },
                    ]}
                    selectedValue={compounding}
                    onSelect={(val) => setCompounding(val as any)}
                  />
                </View>
              )}

              {/* Senior Citizen Toggle */}
              <View style={[styles.switchRow, { borderColor: theme.isDark ? '#2D3748' : '#E2E8F0' }]}>
                <View style={styles.switchInfo}>
                  <Text style={[styles.switchTitle, { color: theme.colors.text }]}>👴 Senior Citizen Rate</Text>
                  <Text style={[styles.switchSub, { color: theme.colors.textMuted }]}>Add +0.50% extra bank interest</Text>
                </View>
                <Switch
                  value={isSeniorCitizen}
                  onValueChange={setIsSeniorCitizen}
                  trackColor={{ false: '#767577', true: '#2563EB' }}
                  thumbColor={isSeniorCitizen ? '#FFFFFF' : '#f4f3f4'}
                />
              </View>

              {/* TDS Deduction Toggle (FD Mode) */}
              {mode === 'fd' && (
                <View style={[styles.switchRow, { borderColor: theme.isDark ? '#2D3748' : '#E2E8F0' }]}>
                  <View style={styles.switchInfo}>
                    <Text style={[styles.switchTitle, { color: theme.colors.text }]}>🏛️ Deduct 10% TDS (Sec 194A)</Text>
                    <Text style={[styles.switchSub, { color: theme.colors.textMuted }]}>
                      TDS on interest above ₹{isSeniorCitizen ? '50,000' : '40,000'}
                    </Text>
                  </View>
                  <Switch
                    value={deductTDS}
                    onValueChange={setDeductTDS}
                    trackColor={{ false: '#767577', true: '#2563EB' }}
                    thumbColor={deductTDS ? '#FFFFFF' : '#f4f3f4'}
                  />
                </View>
              )}

              <TouchableOpacity
                onPress={handleReset}
                activeOpacity={0.7}
                style={[styles.bottomResetBtn, { borderColor: theme.colors.borderSubtle, backgroundColor: theme.colors.surfaceSubtle }]}
              >
                <Text style={[styles.bottomResetText, { color: theme.colors.textMuted }]}>↺ Reset Inputs</Text>
              </TouchableOpacity>
            </Card>

            {/* Breakdown Card */}
            <Card style={styles.cardSpacing}>
              <Text style={[styles.cardHeading, { color: theme.colors.text }]}>Deposit Breakdown</Text>
              <BreakdownRow
                label={mode === 'fd' ? 'Principal Deposited' : `Total Deposited (${Math.round(numYears * 12)} mo)`}
                value={`₹${(mode === 'fd' ? fdResult.totalDeposited : rdResult.totalDeposited).toLocaleString('en-IN')}`}
                dotColor="#3B82F6"
                showDivider
              />
              <BreakdownRow
                label="Compounded Interest"
                value={`+₹${(mode === 'fd' ? fdResult.interestEarned : rdResult.interestEarned).toLocaleString('en-IN')}`}
                valueColor="#10B981"
                dotColor="#10B981"
                showDivider
              />
              {mode === 'fd' && deductTDS && (fdResult.tdsDeducted ?? 0) > 0 && (
                <BreakdownRow
                  label="TDS Deducted (10%)"
                  value={`-₹${fdResult.tdsDeducted?.toLocaleString('en-IN')}`}
                  valueColor="#EF4444"
                  dotColor="#EF4444"
                  showDivider
                />
              )}
              <BreakdownRow
                label={mode === 'fd' && deductTDS && (fdResult.tdsDeducted ?? 0) > 0 ? 'Gross Maturity' : 'Total Maturity Amount'}
                value={`₹${(mode === 'fd' ? fdResult.maturityAmount : rdResult.maturityAmount).toLocaleString('en-IN')}`}
                isBold={!deductTDS || (fdResult.tdsDeducted ?? 0) === 0}
                isHighlight={!deductTDS || (fdResult.tdsDeducted ?? 0) === 0}
                valueColor={theme.colors.primary}
                showDivider={mode === 'fd' && deductTDS && (fdResult.tdsDeducted ?? 0) > 0}
              />
              {mode === 'fd' && deductTDS && (fdResult.tdsDeducted ?? 0) > 0 && (
                <BreakdownRow
                  label="Net Post-Tax Maturity"
                  value={`₹${fdResult.postTaxMaturity?.toLocaleString('en-IN')}`}
                  isBold
                  isHighlight
                  valueColor="#10B981"
                />
              )}
            </Card>

            {/* Formula Explanations */}
            <FormulaTabs
              formula={mode === 'fd' ? 'A = P × [1 + (r / 400)]^(4 × t)' : 'M = Σ [P × (1 + r/400)^(remainingMonths / 3)]'}
              howItWorks={[
                '1. Standard Indian banks compound interest quarterly (4 times a year).',
                '2. Senior citizens receive an additional 0.50% interest rate premium across tenures.',
                '3. At completion of tenure, total deposited amount + accumulated compounded interest is paid.',
              ]}
              example={{
                input: mode === 'fd' ? '₹1,00,000 at 7.1% for 3 years' : '₹5,000/mo at 6.8% for 3 years',
                calculation: mode === 'fd' ? 'Interest: ₹23,439 | Quarterly compounding' : 'Total Deposit: ₹1,80,000 | Interest: ₹20,195',
                output: mode === 'fd' ? '₹1,23,439 Maturity' : '₹2,00,195 Maturity',
              }}
            />
          </>
        )}

        {/* ========================================================================= */}
        {/* 2. FD PAYOUT MODE */}
        {/* ========================================================================= */}
        {mode === 'fd_payout' && (
          <>
            <ResultHeroCard
              title="Regular Interest Payout"
              value={`₹${fdPayoutResult.monthlyPayout.toLocaleString('en-IN')} / mo`}
              subText={`Quarterly: ₹${fdPayoutResult.quarterlyPayout.toLocaleString('en-IN')}`}
              badgeText="Non-Cumulative Regular Cashflow"
              badgeType="info"
              secondaryStats={[
                { label: 'Monthly', value: `₹${fdPayoutResult.monthlyPayout.toLocaleString('en-IN')}` },
                { label: 'Quarterly', value: `₹${fdPayoutResult.quarterlyPayout.toLocaleString('en-IN')}` },
                { label: 'Annual', value: `₹${fdPayoutResult.annualPayout.toLocaleString('en-IN')}` },
              ]}
            />

            <Card style={styles.cardSpacing}>
              <CalcInputField
                label="Total Fixed Deposit"
                prefix="₹"
                value={deposit}
                onChangeText={setDeposit}
                keyboardType="numeric"
              />
              <PresetPills
                options={[{ label: '₹1L', value: '100000' }, { label: '₹2.5L', value: '250000' }, { label: '₹5L', value: '500000' }, { label: '₹10L', value: '1000000' }]}
                selectedValue={deposit}
                onSelect={(val) => setDeposit(String(val))}
              />

              <CalcInputField
                label="Annual Interest Rate"
                suffix="% p.a."
                value={rate}
                onChangeText={setRate}
                keyboardType="numeric"
              />
              <PresetPills
                options={[{ label: '6.5%', value: '6.5' }, { label: '7.0%', value: '7.0' }, { label: '7.5%', value: '7.5' }, { label: '8.0%', value: '8.0' }]}
                selectedValue={rate}
                onSelect={(val) => setRate(String(val))}
              />

              <CalcInputField
                label="Tenure"
                suffix="Years"
                value={years}
                onChangeText={setYears}
                keyboardType="numeric"
              />
              <PresetPills
                options={[{ label: '1Y', value: '1' }, { label: '2Y', value: '2' }, { label: '3Y', value: '3' }, { label: '5Y', value: '5' }]}
                selectedValue={years}
                onSelect={(val) => setYears(String(val))}
              />

              <View style={[styles.switchRow, { borderColor: theme.isDark ? '#2D3748' : '#E2E8F0' }]}>
                <View style={styles.switchInfo}>
                  <Text style={[styles.switchTitle, { color: theme.colors.text }]}>👴 Senior Citizen (+0.50%)</Text>
                  <Text style={[styles.switchSub, { color: theme.colors.textMuted }]}>Higher monthly cashflow</Text>
                </View>
                <Switch
                  value={isSeniorCitizen}
                  onValueChange={setIsSeniorCitizen}
                  trackColor={{ false: '#767577', true: '#2563EB' }}
                  thumbColor={isSeniorCitizen ? '#FFFFFF' : '#f4f3f4'}
                />
              </View>

              <TouchableOpacity
                onPress={handleReset}
                activeOpacity={0.7}
                style={[styles.bottomResetBtn, { borderColor: theme.colors.borderSubtle, backgroundColor: theme.colors.surfaceSubtle }]}
              >
                <Text style={[styles.bottomResetText, { color: theme.colors.textMuted }]}>↺ Reset Inputs</Text>
              </TouchableOpacity>
            </Card>

            <Card style={styles.cardSpacing}>
              <Text style={[styles.cardHeading, { color: theme.colors.text }]}>Payout Options</Text>
              <BreakdownRow
                label="Monthly Income Payout"
                value={`₹${fdPayoutResult.monthlyPayout.toLocaleString('en-IN')} / mo`}
                dotColor="#3B82F6"
                showDivider
              />
              <BreakdownRow
                label="Quarterly Income Payout"
                value={`₹${fdPayoutResult.quarterlyPayout.toLocaleString('en-IN')} / quarter`}
                dotColor="#8B5CF6"
                showDivider
              />
              <BreakdownRow
                label="Annual Cashflow"
                value={`₹${fdPayoutResult.annualPayout.toLocaleString('en-IN')} / yr`}
                dotColor="#10B981"
                showDivider
              />
              <BreakdownRow
                label={`Total Cashflow (${numYears} Years)`}
                value={`₹${fdPayoutResult.totalInterestOverTenure.toLocaleString('en-IN')}`}
                isBold
                isHighlight
                valueColor={theme.colors.primary}
              />
            </Card>

            <FormulaTabs
              formula="Monthly Payout = (P × r) / (12 × 100)   |   Quarterly Payout = (P × r) / 400"
              howItWorks={[
                '1. Principal amount remains intact and locked in the bank during the deposit tenure.',
                '2. Interest is credited directly into your linked savings bank account on monthly or quarterly cycles.',
                '3. At maturity, the entire original principal is refunded.',
              ]}
              example={{
                input: '₹5,00,000 at 7.5% for 5 years',
                calculation: 'Annual: ₹37,500 | Monthly: ₹3,125 | Quarterly: ₹9,375',
                output: '₹3,125 monthly payout (Total: ₹1,87,500)',
              }}
            />
          </>
        )}

        {/* ========================================================================= */}
        {/* 3. SIMPLE INTEREST MODE */}
        {/* ========================================================================= */}
        {mode === 'simple_interest' && (
          <>
            <ResultHeroCard
              title="Total Payable Amount"
              value={`₹${siResult.totalAmount.toLocaleString('en-IN')}`}
              subText={`Simple Interest: +₹${siResult.interestEarned.toLocaleString('en-IN')}`}
              badgeText="Linear Non-Compounding Interest"
              badgeType="info"
              secondaryStats={[
                { label: 'Principal', value: `₹${siResult.principal.toLocaleString('en-IN')}` },
                { label: 'Interest', value: `+₹${siResult.interestEarned.toLocaleString('en-IN')}`, color: '#10B981' },
                { label: 'Tenure', value: `${numYears} Years` },
              ]}
            />

            <Card style={styles.cardSpacing}>
              <CalcInputField
                label="Principal Amount (P)"
                prefix="₹"
                value={deposit}
                onChangeText={setDeposit}
                keyboardType="numeric"
              />
              <PresetPills
                options={[{ label: '₹10K', value: '10000' }, { label: '₹25K', value: '25000' }, { label: '₹50K', value: '50000' }, { label: '₹1L', value: '100000' }]}
                selectedValue={deposit}
                onSelect={(val) => setDeposit(String(val))}
              />

              <CalcInputField
                label="Annual Interest Rate (R)"
                suffix="% p.a."
                value={rate}
                onChangeText={setRate}
                keyboardType="numeric"
              />
              <PresetPills
                options={[{ label: '5%', value: '5' }, { label: '8%', value: '8' }, { label: '10%', value: '10' }, { label: '12%', value: '12' }]}
                selectedValue={rate}
                onSelect={(val) => setRate(String(val))}
              />

              <CalcInputField
                label="Time Period (T)"
                suffix="Years"
                value={years}
                onChangeText={setYears}
                keyboardType="numeric"
              />
              <PresetPills
                options={[{ label: '1Y', value: '1' }, { label: '2Y', value: '2' }, { label: '3Y', value: '3' }, { label: '5Y', value: '5' }]}
                selectedValue={years}
                onSelect={(val) => setYears(String(val))}
              />

              <TouchableOpacity
                onPress={handleReset}
                activeOpacity={0.7}
                style={[styles.bottomResetBtn, { borderColor: theme.colors.borderSubtle, backgroundColor: theme.colors.surfaceSubtle }]}
              >
                <Text style={[styles.bottomResetText, { color: theme.colors.textMuted }]}>↺ Reset Inputs</Text>
              </TouchableOpacity>
            </Card>

            <Card style={styles.cardSpacing}>
              <Text style={[styles.cardHeading, { color: theme.colors.text }]}>Summary</Text>
              <BreakdownRow
                label="Principal Amount"
                value={`₹${siResult.principal.toLocaleString('en-IN')}`}
                dotColor="#3B82F6"
                showDivider
              />
              <BreakdownRow
                label="Simple Interest"
                value={`+₹${siResult.interestEarned.toLocaleString('en-IN')}`}
                valueColor="#10B981"
                dotColor="#10B981"
                showDivider
              />
              <BreakdownRow
                label="Total Amount"
                value={`₹${siResult.totalAmount.toLocaleString('en-IN')}`}
                isBold
                isHighlight
                valueColor={theme.colors.primary}
              />
            </Card>

            <FormulaTabs
              formula="SI = (P × R × T) / 100   |   Total = P + SI"
              howItWorks={[
                '1. Simple interest does not compound on previous earnings.',
                '2. Annual interest remains fixed and constant based on initial principal.',
                '3. Widely used for short term loans and promissory notes.',
              ]}
              example={{
                input: 'P = ₹50,000, R = 10%, T = 2 years',
                calculation: 'SI = (50,000 × 10 × 2) / 100 = ₹10,000',
                output: '₹60,000 Total Payable',
              }}
            />
          </>
        )}

        {/* ========================================================================= */}
        {/* 4. SAVINGS INTEREST MODE */}
        {/* ========================================================================= */}
        {mode === 'savings' && (
          <>
            <ResultHeroCard
              title="Quarterly Savings Interest"
              value={`₹${savingsResult.quarterlyInterest.toLocaleString('en-IN')}`}
              subText={`Annual: ₹${savingsResult.annualInterest.toLocaleString('en-IN')}`}
              badgeText="RBI Daily Balance Method"
              badgeType="success"
              secondaryStats={[
                { label: 'Per Month', value: `₹${savingsResult.monthlyInterest.toLocaleString('en-IN')}` },
                { label: 'Per Quarter', value: `₹${savingsResult.quarterlyInterest.toLocaleString('en-IN')}`, color: '#10B981' },
                { label: 'Per Year', value: `₹${savingsResult.annualInterest.toLocaleString('en-IN')}` },
              ]}
            />

            <Card style={styles.cardSpacing}>
              <CalcInputField
                label="Average Daily Closing Balance"
                prefix="₹"
                value={savingsBalance}
                onChangeText={setSavingsBalance}
                keyboardType="numeric"
                helperText="Average daily closing balance maintained in account"
              />
              <PresetPills
                options={[{ label: '₹25K', value: '25000' }, { label: '₹50K', value: '50000' }, { label: '₹1L', value: '100000' }, { label: '₹2.5L', value: '250000' }]}
                selectedValue={savingsBalance}
                onSelect={(val) => setSavingsBalance(String(val))}
              />

              <CalcInputField
                label="Savings Interest Rate"
                suffix="% p.a."
                value={savingsRate}
                onChangeText={setSavingsRate}
                keyboardType="numeric"
                helperText="SBI/HDFC ~2.7-3.0%, Small Finance Banks ~4.0-7.0%"
              />
              <PresetPills
                options={[{ label: '2.7%', value: '2.7' }, { label: '3.0%', value: '3.0' }, { label: '3.5%', value: '3.5' }, { label: '4.0%', value: '4.0' }]}
                selectedValue={savingsRate}
                onSelect={(val) => setSavingsRate(String(val))}
              />

              <TouchableOpacity
                onPress={handleReset}
                activeOpacity={0.7}
                style={[styles.bottomResetBtn, { borderColor: theme.colors.borderSubtle, backgroundColor: theme.colors.surfaceSubtle }]}
              >
                <Text style={[styles.bottomResetText, { color: theme.colors.textMuted }]}>↺ Reset Inputs</Text>
              </TouchableOpacity>
            </Card>

            <Card style={styles.cardSpacing}>
              <Text style={[styles.cardHeading, { color: theme.colors.text }]}>Interest Accrual</Text>
              <BreakdownRow
                label="Monthly Equivalent (Approx)"
                value={`₹${savingsResult.monthlyInterest.toLocaleString('en-IN')}`}
                dotColor="#3B82F6"
                showDivider
              />
              <BreakdownRow
                label="Quarterly Bank Credit"
                value={`₹${savingsResult.quarterlyInterest.toLocaleString('en-IN')}`}
                valueColor="#10B981"
                dotColor="#10B981"
                showDivider
              />
              <BreakdownRow
                label="Total Annual Earnings"
                value={`₹${savingsResult.annualInterest.toLocaleString('en-IN')}`}
                isBold
                isHighlight
                valueColor={theme.colors.primary}
              />
            </Card>

            <FormulaTabs
              formula="Daily Interest = (Daily Closing Balance × Rate) / (365 × 100)"
              howItWorks={[
                '1. RBI mandates that savings interest is calculated on daily closing balance.',
                '2. Interest is credited directly to account at the end of each quarter.',
                '3. Interest up to ₹10,000/year is tax-exempt under Section 80TTA.',
              ]}
              example={{
                input: '₹1,50,000 balance at 3.5% rate',
                calculation: 'Quarterly: (1,50,000 × 3.5 × 91.25) / 36,500 = ₹1,313',
                output: '₹1,313 per quarter credit',
              }}
            />
          </>
        )}

        {/* ========================================================================= */}
        {/* 5. GRATUITY MODE */}
        {/* ========================================================================= */}
        {mode === 'gratuity' && (
          <>
            <ResultHeroCard
              title={gratuityResult.isEligible ? 'Payable Gratuity' : 'Projected Gratuity'}
              value={`₹${(gratuityResult.isEligible ? gratuityResult.cappedGratuity : gratuityResult.gratuityAmount).toLocaleString('en-IN')}`}
              subText={gratuityResult.isEligible ? `Tax-Exempt: ₹${gratuityResult.taxExemptAmount.toLocaleString('en-IN')}` : 'Requires 5+ continuous service years'}
              badgeText={gratuityResult.isEligible ? '✅ Eligible (5+ Years Completed)' : '⚠️ Not Eligible (< 5 Years)'}
              badgeType={gratuityResult.isEligible ? 'success' : 'danger'}
              secondaryStats={[
                { label: 'Calculated', value: `₹${gratuityResult.gratuityAmount.toLocaleString('en-IN')}` },
                { label: 'Tax-Free', value: `₹${gratuityResult.taxExemptAmount.toLocaleString('en-IN')}`, color: '#10B981' },
                { label: 'Status', value: gratuityResult.isEligible ? 'Eligible' : '<5 Yrs' },
              ]}
            />

            <Card style={styles.cardSpacing}>
              <CalcInputField
                label="Last Drawn Basic + DA"
                prefix="₹"
                value={salary}
                onChangeText={setSalary}
                keyboardType="numeric"
                helperText="Monthly Basic pay + Dearness Allowance (DA)"
              />
              <PresetPills
                options={[{ label: '₹30K', value: '30000' }, { label: '₹50K', value: '50000' }, { label: '₹75K', value: '75000' }, { label: '₹1L', value: '100000' }]}
                selectedValue={salary}
                onSelect={(val) => setSalary(String(val))}
              />

              <CalcInputField
                label="Years of Continuous Service"
                suffix="Years"
                value={tenureYears}
                onChangeText={setTenureYears}
                keyboardType="numeric"
                helperText="Months > 6 in final year are rounded to the next year"
              />
              <PresetPills
                options={[{ label: '3Y', value: '3' }, { label: '5Y', value: '5' }, { label: '7Y', value: '7' }, { label: '10Y', value: '10' }, { label: '15Y', value: '15' }]}
                selectedValue={tenureYears}
                onSelect={(val) => setTenureYears(String(val))}
              />

              <TouchableOpacity
                onPress={handleReset}
                activeOpacity={0.7}
                style={[styles.bottomResetBtn, { borderColor: theme.colors.borderSubtle, backgroundColor: theme.colors.surfaceSubtle }]}
              >
                <Text style={[styles.bottomResetText, { color: theme.colors.textMuted }]}>↺ Reset Inputs</Text>
              </TouchableOpacity>
            </Card>

            <Card style={styles.cardSpacing}>
              <Text style={[styles.cardHeading, { color: theme.colors.text }]}>Gratuity Breakdown</Text>
              <BreakdownRow
                label="Service Eligibility"
                value={gratuityResult.isEligible ? 'Eligible (5+ Yrs)' : 'Ineligible (< 5 Yrs)'}
                valueColor={gratuityResult.isEligible ? '#10B981' : '#EF4444'}
                dotColor={gratuityResult.isEligible ? '#10B981' : '#EF4444'}
                showDivider
              />
              <BreakdownRow
                label="Calculated Statutory Gratuity"
                value={`₹${gratuityResult.gratuityAmount.toLocaleString('en-IN')}`}
                dotColor="#3B82F6"
                showDivider
              />
              <BreakdownRow
                label="Statutory Tax-Exempt Limit"
                value="₹20,00,000 (Govt Ceiling)"
                dotColor="#8B5CF6"
                showDivider
              />
              <BreakdownRow
                label="Payable Gratuity"
                value={`₹${(gratuityResult.isEligible ? gratuityResult.cappedGratuity : gratuityResult.gratuityAmount).toLocaleString('en-IN')}`}
                isBold
                isHighlight
                valueColor={theme.colors.primary}
              />
            </Card>

            <FormulaTabs
              formula="Gratuity = (15 × Last Basic Salary × Completed Tenure) / 26"
              howItWorks={[
                '1. Payment of Gratuity Act 1972 mandates 15 days wages per completed service year.',
                '2. A working month is taken as 26 days (excluding 4 Sundays).',
                '3. Tax-exempt up to ₹20,00,000 for private and government employees.',
              ]}
              example={{
                input: 'Salary: ₹60,000, Tenure: 8 years',
                calculation: '(15 × 60,000 × 8) / 26 = 7,20,000 / 26 = ₹2,76,923',
                output: '₹2,76,923 (100% Tax Free)',
              }}
            />
          </>
        )}
      </ScrollView>

      {/* History Modal */}
      <CalculationHistoryModal
        visible={showHistory}
        onClose={() => setShowHistory(false)}
        records={history}
        onDeleteItem={deleteItem}
        onClearAll={clearHistory}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  cardSpacing: {
    marginBottom: 14,
  },
  cardHeading: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 10,
  },
  switchInfo: {
    flex: 1,
    marginRight: 10,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  switchSub: {
    fontSize: 12,
    marginTop: 2,
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
