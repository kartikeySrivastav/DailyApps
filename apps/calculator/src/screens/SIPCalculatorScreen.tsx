import React, { useState, useEffect, useMemo } from 'react';
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
  YearlyBreakdownTable,
  CalculationHistoryModal,
} from '../components';
import { useTheme } from '@dailyapps/theme';
import { useAnalytics } from '@dailyapps/analytics';
import { useCalculationHistory } from '../hooks';
import {
  calculateSIP,
  calculateLumpsum,
  calculateSWP,
  calculateCAGR,
  calculateGoalSIP,
  calculateInflation,
  calculatePPF,
  getYearlyCompoundingSchedule,
} from '../calculations/sip';

interface SIPCalculatorScreenProps {
  navigation: any;
  route?: any;
}

type InvestmentMode = 'sip' | 'lumpsum' | 'swp' | 'goal' | 'cagr' | 'inflation' | 'ppf';

export const SIPCalculatorScreen: React.FC<SIPCalculatorScreenProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const analytics = useAnalytics();

  const tool = route?.params?.tool;

  const initialMode: InvestmentMode = useMemo(() => {
    const id = tool?.id || '';
    if (id.includes('swp')) return 'swp';
    if (id.includes('cagr')) return 'cagr';
    if (id.includes('goal') || id.includes('retirement')) return 'goal';
    if (id.includes('inflation')) return 'inflation';
    if (id.includes('ppf') || id.includes('ssy') || id.includes('epf') || id.includes('nps')) return 'ppf';
    if (id.includes('lump') || id.includes('compound')) return 'lumpsum';
    return 'sip';
  }, [tool?.id]);

  const [mode, setMode] = useState<InvestmentMode>(initialMode);

  // Standard inputs
  const [investment, setInvestment] = useState('5000');
  const [rate, setRate] = useState('12');
  const [years, setYears] = useState('10');

  // Step-Up SIP states
  const [isStepUp, setIsStepUp] = useState(false);
  const [stepUpPct, setStepUpPct] = useState('10');

  // Inflation-adjusted toggle
  const [adjustInflation, setAdjustInflation] = useState(false);
  const [inflationRate, setInflationRate] = useState('6');

  // SWP specific states
  const [swpCorpus, setSwpCorpus] = useState('2500000');
  const [swpMonthly, setSwpMonthly] = useState('20000');

  // Goal SIP specific states
  const [goalTarget, setGoalTarget] = useState('5000000');

  // CAGR specific states
  const [cagrInitial, setCagrInitial] = useState('100000');
  const [cagrFinal, setCagrFinal] = useState('250000');

  // History modal
  const [showHistory, setShowHistory] = useState(false);
  const { history, saveCalculation, deleteItem, clearHistory } = useCalculationHistory(
    mode,
    '📈 Investments'
  );

  useEffect(() => {
    analytics.logScreenView('InvestmentCalculatorScreen');
  }, [analytics]);

  useEffect(() => {
    if (tool?.id) {
      if (tool.id.includes('swp')) {
        setMode('swp');
      } else if (tool.id.includes('cagr')) {
        setMode('cagr');
      } else if (tool.id.includes('goal') || tool.id.includes('retirement')) {
        setMode('goal');
      } else if (tool.id.includes('inflation')) {
        setMode('inflation');
      } else if (tool.id.includes('ppf') || tool.id.includes('ssy') || tool.id.includes('epf') || tool.id.includes('nps')) {
        setMode('ppf');
      } else if (tool.id.includes('lump') || tool.id.includes('compound')) {
        setMode('lumpsum');
        setInvestment('50000');
      } else {
        setMode('sip');
        setInvestment('5000');
      }
    }
  }, [tool?.id]);

  const numInv = parseFloat(investment) || 0;
  const numRate = parseFloat(rate) || 0;
  const numYears = parseFloat(years) || 0;
  const numStepUp = isStepUp ? (parseFloat(stepUpPct) || 0) : 0;
  const numInfRate = parseFloat(inflationRate) || 6;

  // 1. SIP Result
  const sipResult = useMemo(() => {
    return calculateSIP({
      monthlyInvestment: numInv,
      annualRate: numRate,
      years: numYears,
      stepUpPercentage: numStepUp,
    });
  }, [numInv, numRate, numYears, numStepUp]);

  // 2. Lumpsum Result
  const lumpsumResult = useMemo(() => {
    return calculateLumpsum({
      totalInvestment: numInv,
      annualRate: numRate,
      years: numYears,
    });
  }, [numInv, numRate, numYears]);

  // 3. SWP Result
  const swpResult = useMemo(() => {
    return calculateSWP({
      totalInvestment: parseFloat(swpCorpus) || 0,
      monthlyWithdrawal: parseFloat(swpMonthly) || 0,
      annualRate: numRate,
      years: numYears,
    });
  }, [swpCorpus, swpMonthly, numRate, numYears]);

  // 4. Goal Result
  const goalResult = useMemo(() => {
    return calculateGoalSIP({
      targetAmount: parseFloat(goalTarget) || 0,
      annualRate: numRate,
      years: numYears,
    });
  }, [goalTarget, numRate, numYears]);

  // 5. CAGR Result
  const cagrResult = useMemo(() => {
    return calculateCAGR({
      initialValue: parseFloat(cagrInitial) || 0,
      finalValue: parseFloat(cagrFinal) || 0,
      years: numYears,
    });
  }, [cagrInitial, cagrFinal, numYears]);

  // 6. Inflation Result
  const inflationResult = useMemo(() => {
    return calculateInflation({
      currentAmount: numInv,
      inflationRate: numInfRate,
      years: numYears,
    });
  }, [numInv, numInfRate, numYears]);

  // 7. PPF Result
  const ppfResult = useMemo(() => {
    return calculatePPF({
      annualDeposit: numInv,
      years: numYears,
      annualRate: 7.1,
    });
  }, [numInv, numYears]);

  // Dynamic real compounding curve for chart
  const chartPoints = useMemo(() => {
    if (mode === 'sip') {
      return getYearlyCompoundingSchedule('sip', numInv, numRate, numYears, numStepUp);
    } else if (mode === 'lumpsum') {
      return getYearlyCompoundingSchedule('lumpsum', numInv, numRate, numYears);
    }
    return [];
  }, [mode, numInv, numRate, numYears, numStepUp]);

  // Inflation adjusted values for display
  const finalValue = mode === 'sip' ? sipResult.totalValue : lumpsumResult.totalValue;
  const inflationDiscountFactor = adjustInflation ? Math.pow(1 + numInfRate / 100, numYears) : 1;
  const displayTotalValue = Math.round(finalValue / inflationDiscountFactor);

  // Auto-record calculation to history
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mode === 'sip' && numInv > 0 && numYears > 0) {
        saveCalculation({
          toolId: 'sip',
          toolName: 'SIP Calculator',
          category: '📈 Investments',
          title: `SIP: ₹${numInv.toLocaleString('en-IN')}/mo (${numYears}Y @ ${numRate}%)`,
          subtitle: `Corpus: ₹${sipResult.totalValue.toLocaleString('en-IN')}`,
          result: `₹${sipResult.totalValue.toLocaleString('en-IN')}`,
          secondaryResult: `Returns: +₹${sipResult.estimatedReturns.toLocaleString('en-IN')}`,
          badge: isStepUp ? 'STEP-UP' : 'SIP',
          inputs: { investment, rate, years, isStepUp, stepUpPct },
        });
      } else if (mode === 'lumpsum' && numInv > 0 && numYears > 0) {
        saveCalculation({
          toolId: 'lumpsum',
          toolName: 'Lumpsum Calculator',
          category: '📈 Investments',
          title: `Lumpsum: ₹${numInv.toLocaleString('en-IN')} (${numYears}Y @ ${numRate}%)`,
          subtitle: `Maturity: ₹${lumpsumResult.totalValue.toLocaleString('en-IN')}`,
          result: `₹${lumpsumResult.totalValue.toLocaleString('en-IN')}`,
          secondaryResult: `Returns: +₹${lumpsumResult.estimatedReturns.toLocaleString('en-IN')}`,
          badge: 'LUMPSUM',
          inputs: { investment, rate, years },
        });
      } else if (mode === 'swp') {
        saveCalculation({
          toolId: 'swp',
          toolName: 'SWP Calculator',
          category: '📈 Investments',
          title: `SWP: ₹${parseFloat(swpCorpus).toLocaleString('en-IN')} (₹${parseFloat(swpMonthly).toLocaleString('en-IN')}/mo)`,
          subtitle: `Total Withdrawn: ₹${swpResult.totalWithdrawn.toLocaleString('en-IN')}`,
          result: `₹${swpResult.totalWithdrawn.toLocaleString('en-IN')}`,
          secondaryResult: `Balance: ₹${swpResult.finalBalance.toLocaleString('en-IN')}`,
          badge: 'SWP',
          inputs: { swpCorpus, swpMonthly, rate, years },
        });
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [mode, numInv, numRate, numYears, numStepUp, isStepUp, swpCorpus, swpMonthly]);

  const handleReset = () => {
    if (mode === 'sip') {
      setInvestment('5000');
      setRate('12');
      setYears('10');
      setIsStepUp(false);
      setAdjustInflation(false);
    } else if (mode === 'lumpsum') {
      setInvestment('50000');
      setRate('12');
      setYears('10');
      setAdjustInflation(false);
    } else if (mode === 'swp') {
      setSwpCorpus('2500000');
      setSwpMonthly('20000');
      setRate('8');
      setYears('10');
    } else if (mode === 'goal') {
      setGoalTarget('5000000');
      setRate('12');
      setYears('10');
    } else if (mode === 'cagr') {
      setCagrInitial('100000');
      setCagrFinal('250000');
      setYears('5');
    } else if (mode === 'inflation') {
      setInvestment('50000');
      setInflationRate('6');
      setYears('10');
    } else if (mode === 'ppf') {
      setInvestment('150000');
      setYears('15');
    }
  };

  const getHeaderInfo = () => {
    switch (mode) {
      case 'sip':
        return { title: 'SIP Calculator', subtitle: 'Systematic monthly compounding wealth', icon: '📈' };
      case 'lumpsum':
        return { title: 'Lumpsum Calculator', subtitle: 'One-time investment compounding', icon: '💰' };
      case 'swp':
        return { title: 'SWP Calculator', subtitle: 'Systematic regular monthly cash withdrawal', icon: '💸' };
      case 'goal':
        return { title: 'Goal Investment Planner', subtitle: 'Target corpus monthly SIP requirement', icon: '🎯' };
      case 'cagr':
        return { title: 'CAGR Calculator', subtitle: 'Compound annual growth rate of portfolio', icon: '📊' };
      case 'inflation':
        return { title: 'Inflation Impact', subtitle: 'Purchasing power erosion over time', icon: '📉' };
      case 'ppf':
        return { title: 'PPF Calculator', subtitle: 'Public Provident Fund 15-year tax-free returns', icon: '🏛️' };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <ScreenContainer safeArea withPadding={false}>
      <CalculatorHeader
        title={headerInfo.title}
        subtitle={headerInfo.subtitle}
        category="📈 Investments"
        icon={headerInfo.icon}
        toolId={tool?.id || mode}
        onBack={() => navigation.goBack()}
        onHistory={() => setShowHistory(true)}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Navigation Tabs for Investments */}
        <SegmentedTabs
          tabs={[
            { key: 'sip', label: 'SIP', icon: '📈' },
            { key: 'lumpsum', label: 'Lumpsum', icon: '💰' },
            { key: 'swp', label: 'SWP', icon: '💸' },
            { key: 'goal', label: 'Goal SIP', icon: '🎯' },
            { key: 'cagr', label: 'CAGR', icon: '📊' },
            { key: 'inflation', label: 'Inflation', icon: '📉' },
            { key: 'ppf', label: 'PPF', icon: '🏛️' },
          ]}
          activeTab={mode}
          onTabChange={(k) => setMode(k as InvestmentMode)}
          scrollable
        />

        {/* ========================================================================= */}
        {/* 1. SIP & LUMPSUM MODES */}
        {/* ========================================================================= */}
        {(mode === 'sip' || mode === 'lumpsum') && (
          <>
            <ResultHeroCard
              title={adjustInflation ? "Inflation-Adjusted Real Value" : "Expected Total Wealth"}
              value={`₹${displayTotalValue.toLocaleString('en-IN')}`}
              subText={adjustInflation ? `Nominal: ₹${finalValue.toLocaleString('en-IN')}` : `for ${numYears} years at ${numRate}% p.a.`}
              badgeText={
                adjustInflation
                  ? `Real purchasing power in today's money (${numInfRate}% inflation)`
                  : isStepUp && mode === 'sip'
                  ? `Step-up (+${numStepUp}%/yr) Applied`
                  : `Gain: +₹${(mode === 'sip' ? sipResult.estimatedReturns : lumpsumResult.estimatedReturns).toLocaleString('en-IN')}`
              }
              badgeType="success"
              secondaryStats={[
                { label: 'Invested', value: `₹${(mode === 'sip' ? sipResult.investedAmount : lumpsumResult.investedAmount).toLocaleString('en-IN')}` },
                { label: 'Returns', value: `+₹${(mode === 'sip' ? sipResult.estimatedReturns : lumpsumResult.estimatedReturns).toLocaleString('en-IN')}`, color: '#10B981' },
                { label: 'Tenure', value: `${numYears} Years` },
              ]}
            />

            {/* Input Card */}
            <Card style={styles.cardSpacing}>
              <CalcInputField
                label={mode === 'sip' ? 'Monthly SIP Amount' : 'Total Lumpsum Investment'}
                prefix="₹"
                value={investment}
                onChangeText={setInvestment}
                keyboardType="numeric"
              />
              <PresetPills
                options={mode === 'sip' ? [{ label: '₹2.5K', value: '2500' }, { label: '₹5K', value: '5000' }, { label: '₹10K', value: '10000' }, { label: '₹25K', value: '25000' }] : [{ label: '₹25K', value: '25000' }, { label: '₹50K', value: '50000' }, { label: '₹1L', value: '100000' }, { label: '₹5L', value: '500000' }]}
                selectedValue={investment}
                onSelect={(val) => setInvestment(String(val))}
              />

              <CalcInputField
                label="Expected Annual Return Rate"
                suffix="% p.a."
                value={rate}
                onChangeText={setRate}
                keyboardType="numeric"
                helperText="Nifty 50 historical average ~12-14% CAGR"
              />
              <PresetPills
                options={[{ label: '10%', value: '10' }, { label: '12%', value: '12' }, { label: '14%', value: '14' }, { label: '15%', value: '15' }, { label: '18%', value: '18' }]}
                selectedValue={rate}
                onSelect={(val) => setRate(String(val))}
              />

              <CalcInputField
                label="Time Horizon"
                suffix="Years"
                value={years}
                onChangeText={setYears}
                keyboardType="numeric"
              />
              <PresetPills
                options={[{ label: '3Y', value: '3' }, { label: '5Y', value: '5' }, { label: '10Y', value: '10' }, { label: '15Y', value: '15' }, { label: '20Y', value: '20' }, { label: '25Y', value: '25' }]}
                selectedValue={years}
                onSelect={(val) => setYears(String(val))}
              />

              {/* Step-up SIP Toggle (Only for SIP) */}
              {mode === 'sip' && (
                <>
                  <View style={[styles.switchRow, { borderColor: theme.isDark ? '#2D3748' : '#E2E8F0' }]}>
                    <View style={styles.switchInfo}>
                      <Text style={[styles.switchTitle, { color: theme.colors.text }]}>🚀 Step-Up SIP (+{stepUpPct}%/yr)</Text>
                      <Text style={[styles.switchSub, { color: theme.colors.textMuted }]}>Increase SIP annually with salary increments</Text>
                    </View>
                    <Switch
                      value={isStepUp}
                      onValueChange={setIsStepUp}
                      trackColor={{ false: '#767577', true: '#2563EB' }}
                      thumbColor={isStepUp ? '#FFFFFF' : '#f4f3f4'}
                    />
                  </View>
                  {isStepUp && (
                    <PresetPills
                      options={[{ label: '+5%/yr', value: '5' }, { label: '+10%/yr', value: '10' }, { label: '+15%/yr', value: '15' }, { label: '+20%/yr', value: '20' }]}
                      selectedValue={stepUpPct}
                      onSelect={(val) => setStepUpPct(String(val))}
                    />
                  )}
                </>
              )}

              {/* Inflation Toggle */}
              <View style={[styles.switchRow, { borderColor: theme.isDark ? '#2D3748' : '#E2E8F0' }]}>
                <View style={styles.switchInfo}>
                  <Text style={[styles.switchTitle, { color: theme.colors.text }]}>🛡️ Adjust for Inflation ({inflationRate}%)</Text>
                  <Text style={[styles.switchSub, { color: theme.colors.textMuted }]}>Show real purchasing power in today's money</Text>
                </View>
                <Switch
                  value={adjustInflation}
                  onValueChange={setAdjustInflation}
                  trackColor={{ false: '#767577', true: '#2563EB' }}
                  thumbColor={adjustInflation ? '#FFFFFF' : '#f4f3f4'}
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

            {/* Modern Zerodha/Groww Style Wealth Compounding Curve Chart */}
            <Card style={styles.cardSpacing}>
              <View style={styles.chartHeaderContainer}>
                <View>
                  <Text style={[styles.cardHeading, { color: theme.colors.text, marginBottom: 2 }]}>
                    Wealth Compounding
                  </Text>
                  <Text style={[styles.chartSubHeading, { color: theme.colors.textMuted }]}>
                    Growth curve over {numYears} years
                  </Text>
                </View>

                {/* Legend with clean badges */}
                <View style={styles.legendContainer}>
                  <View style={styles.legendBadge}>
                    <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
                    <Text style={[styles.legendText, { color: theme.colors.textMuted }]}>Invested</Text>
                  </View>
                  <View style={styles.legendBadge}>
                    <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
                    <Text style={[styles.legendText, { color: theme.colors.textMuted }]}>Gains</Text>
                  </View>
                </View>
              </View>

              {/* Dynamic Year-by-Year Stacked Bars */}
              {chartPoints.length > 0 && (
                <View style={styles.chartBarsArea}>
                  {chartPoints.map((pt, idx) => {
                    const maxVal = chartPoints[chartPoints.length - 1].totalValue || 1;
                    const barHeightPct = Math.max(12, Math.round((pt.totalValue / maxVal) * 95));
                    const investedRatio = pt.totalValue > 0 ? pt.invested / pt.totalValue : 1;
                    const investedHeight = Math.round(barHeightPct * investedRatio);
                    const gainHeight = Math.max(0, barHeightPct - investedHeight);

                    return (
                      <View key={idx} style={styles.chartColumn}>
                        {gainHeight > 0 && (
                          <View
                            style={[
                              styles.chartGainBar,
                              {
                                height: gainHeight,
                                backgroundColor: '#10B981',
                              },
                            ]}
                          />
                        )}
                        <View
                          style={[
                            styles.chartInvestedBar,
                            {
                              height: Math.max(8, investedHeight),
                              backgroundColor: '#3B82F6',
                              borderTopLeftRadius: gainHeight === 0 ? 3 : 0,
                              borderTopRightRadius: gainHeight === 0 ? 3 : 0,
                            },
                          ]}
                        />
                        <Text style={[styles.chartYearLabel, { color: theme.colors.textMuted }]}>
                          Y{pt.year}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              )}

              {/* Breakdown Rows */}
              <View style={styles.breakdownSection}>
                <BreakdownRow
                  label="Total Capital Invested"
                  value={`₹${(mode === 'sip' ? sipResult.investedAmount : lumpsumResult.investedAmount).toLocaleString('en-IN')}`}
                  dotColor="#3B82F6"
                  showDivider
                />
                <BreakdownRow
                  label="Estimated Wealth Gains"
                  value={`+₹${(mode === 'sip' ? sipResult.estimatedReturns : lumpsumResult.estimatedReturns).toLocaleString('en-IN')}`}
                  valueColor="#10B981"
                  dotColor="#10B981"
                  showDivider
                />
                <BreakdownRow
                  label="Total Expected Value"
                  value={`₹${finalValue.toLocaleString('en-IN')}`}
                  isBold
                  isHighlight
                  valueColor={theme.colors.primary}
                />
              </View>
            </Card>

            {/* Yearly Breakdown Table for SIP */}
            {mode === 'sip' && numYears >= 3 && (
              <YearlyBreakdownTable
                monthlyInvestment={numInv}
                annualRate={numRate}
                years={numYears}
              />
            )}

            {/* Formula Card */}
            <FormulaTabs
              formula={mode === 'sip' ? 'M = P × [((1 + i)ⁿ - 1) / i] × (1 + i)' : 'M = P × (1 + r)ⁿ'}
              howItWorks={[
                '1. Regular monthly deposits are invested on a disciplined schedule.',
                '2. Compounding interest accelerates exponentially in the latter half of the tenure.',
                '3. Disciplined Step-up SIP adds significant compounding power to your corpus.',
              ]}
              example={{
                input: mode === 'sip' ? '₹5,000/mo at 12% for 10 years' : '₹50,000 lumpsum at 12% for 10 years',
                calculation: mode === 'sip' ? 'Invested: ₹6,00,000 | Compounded Gain: ₹5,61,695' : 'Invested: ₹50,000 | Gain: ₹1,05,292',
                output: mode === 'sip' ? '₹11,61,695 Maturity' : '₹1,55,292 Maturity',
              }}
            />
          </>
        )}

        {/* ========================================================================= */}
        {/* 2. SWP MODE */}
        {/* ========================================================================= */}
        {mode === 'swp' && (
          <>
            <ResultHeroCard
              title="Total Amount Withdrawn"
              value={`₹${swpResult.totalWithdrawn.toLocaleString('en-IN')}`}
              subText={`Final Remaining Corpus: ₹${swpResult.finalBalance.toLocaleString('en-IN')}`}
              badgeText={swpResult.isExhausted ? `⚠️ Corpus depleted at Month ${swpResult.exhaustedMonth}` : '✅ Corpus remains sustainable'}
              badgeType={swpResult.isExhausted ? 'warning' : 'success'}
              secondaryStats={[
                { label: 'Corpus', value: `₹${swpResult.totalInvested.toLocaleString('en-IN')}` },
                { label: 'Withdrawn', value: `₹${swpResult.totalWithdrawn.toLocaleString('en-IN')}`, color: '#10B981' },
                { label: 'Balance', value: `₹${swpResult.finalBalance.toLocaleString('en-IN')}` },
              ]}
            />

            <Card style={styles.cardSpacing}>
              <CalcInputField
                label="Total Initial Corpus"
                prefix="₹"
                value={swpCorpus}
                onChangeText={setSwpCorpus}
                keyboardType="numeric"
              />
              <PresetPills
                options={[{ label: '₹10L', value: '1000000' }, { label: '₹25L', value: '2500000' }, { label: '₹50L', value: '5000000' }, { label: '₹1Cr', value: '10000000' }]}
                selectedValue={swpCorpus}
                onSelect={(val) => setSwpCorpus(String(val))}
              />

              <CalcInputField
                label="Monthly Withdrawal Amount"
                prefix="₹"
                value={swpMonthly}
                onChangeText={setSwpMonthly}
                keyboardType="numeric"
              />
              <PresetPills
                options={[{ label: '₹10K', value: '10000' }, { label: '₹20K', value: '20000' }, { label: '₹35K', value: '35000' }, { label: '₹50K', value: '50000' }]}
                selectedValue={swpMonthly}
                onSelect={(val) => setSwpMonthly(String(val))}
              />

              <CalcInputField
                label="Expected Annual Return on Balance"
                suffix="% p.a."
                value={rate}
                onChangeText={setRate}
                keyboardType="numeric"
              />
              <PresetPills
                options={[{ label: '7%', value: '7' }, { label: '8%', value: '8' }, { label: '9%', value: '9' }, { label: '10%', value: '10' }]}
                selectedValue={rate}
                onSelect={(val) => setRate(String(val))}
              />

              <CalcInputField
                label="Withdrawal Period"
                suffix="Years"
                value={years}
                onChangeText={setYears}
                keyboardType="numeric"
              />
              <PresetPills
                options={[{ label: '5Y', value: '5' }, { label: '10Y', value: '10' }, { label: '15Y', value: '15' }, { label: '20Y', value: '20' }]}
                selectedValue={years}
                onSelect={(val) => setYears(String(val))}
              />
            </Card>

            <Card style={styles.cardSpacing}>
              <Text style={[styles.cardHeading, { color: theme.colors.text }]}>SWP Summary</Text>
              <BreakdownRow
                label="Initial Investment"
                value={`₹${swpResult.totalInvested.toLocaleString('en-IN')}`}
                dotColor="#3B82F6"
                showDivider
              />
              <BreakdownRow
                label="Total Cash Flow Received"
                value={`₹${swpResult.totalWithdrawn.toLocaleString('en-IN')}`}
                valueColor="#10B981"
                dotColor="#10B981"
                showDivider
              />
              <BreakdownRow
                label="Remaining Balance in Fund"
                value={`₹${swpResult.finalBalance.toLocaleString('en-IN')}`}
                isBold
                isHighlight
                valueColor={theme.colors.primary}
              />
            </Card>

            <FormulaTabs
              formula="Monthly Balance = (Prev Balance × (1 + r/12)) - Monthly Withdrawal"
              howItWorks={[
                '1. Regular fixed monthly amount is withdrawn and credited to bank.',
                '2. Undrawn balance continues to generate monthly compounded interest.',
                '3. If annual return rate matches withdrawal rate, capital lasts indefinitely.',
              ]}
              example={{
                input: '₹25,00,000 corpus, ₹20,000/mo withdrawal at 8% for 10 years',
                calculation: 'Total Withdrawn: ₹24,00,000 | Capital growth covers payouts',
                output: '₹28,32,042 balance remaining',
              }}
            />
          </>
        )}

        {/* ========================================================================= */}
        {/* 3. GOAL-BASED SIP MODE */}
        {/* ========================================================================= */}
        {mode === 'goal' && (
          <>
            <ResultHeroCard
              title="Required Monthly SIP"
              value={`₹${goalResult.requiredMonthlySIP.toLocaleString('en-IN')} / mo`}
              subText={`Target: ₹${goalResult.targetAmount.toLocaleString('en-IN')} in ${numYears} Years`}
              badgeText={`At ${numRate}% p.a. expected returns`}
              badgeType="info"
              secondaryStats={[
                { label: 'Target', value: `₹${goalResult.targetAmount.toLocaleString('en-IN')}` },
                { label: 'SIP Needed', value: `₹${goalResult.requiredMonthlySIP.toLocaleString('en-IN')}`, color: '#10B981' },
                { label: 'Growth', value: `+₹${goalResult.expectedGrowth.toLocaleString('en-IN')}` },
              ]}
            />

            <Card style={styles.cardSpacing}>
              <CalcInputField
                label="Target Goal Amount"
                prefix="₹"
                value={goalTarget}
                onChangeText={setGoalTarget}
                keyboardType="numeric"
                helperText="e.g. Dream House, Higher Education, Retirement Corpus"
              />
              <PresetPills
                options={[{ label: '₹10L', value: '1000000' }, { label: '₹25L', value: '2500000' }, { label: '₹50L', value: '5000000' }, { label: '₹1Cr', value: '10000000' }]}
                selectedValue={goalTarget}
                onSelect={(val) => setGoalTarget(String(val))}
              />

              <CalcInputField
                label="Expected Return Rate"
                suffix="% p.a."
                value={rate}
                onChangeText={setRate}
                keyboardType="numeric"
              />
              <PresetPills
                options={[{ label: '10%', value: '10' }, { label: '12%', value: '12' }, { label: '14%', value: '14' }, { label: '15%', value: '15' }]}
                selectedValue={rate}
                onSelect={(val) => setRate(String(val))}
              />

              <CalcInputField
                label="Time to Achieve Goal"
                suffix="Years"
                value={years}
                onChangeText={setYears}
                keyboardType="numeric"
              />
              <PresetPills
                options={[{ label: '3Y', value: '3' }, { label: '5Y', value: '5' }, { label: '7Y', value: '7' }, { label: '10Y', value: '10' }, { label: '15Y', value: '15' }]}
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
              <Text style={[styles.cardHeading, { color: theme.colors.text }]}>Goal Breakdown</Text>
              <BreakdownRow
                label="Total You Will Invest"
                value={`₹${goalResult.totalInvested.toLocaleString('en-IN')}`}
                dotColor="#3B82F6"
                showDivider
              />
              <BreakdownRow
                label="Wealth Growth Component"
                value={`+₹${goalResult.expectedGrowth.toLocaleString('en-IN')}`}
                valueColor="#10B981"
                dotColor="#10B981"
                showDivider
              />
              <BreakdownRow
                label="Target Corpus Achieved"
                value={`₹${goalResult.targetAmount.toLocaleString('en-IN')}`}
                isBold
                isHighlight
                valueColor={theme.colors.primary}
              />
            </Card>

            <FormulaTabs
              formula="P = M / [ (( (1+i)ⁿ - 1 ) / i) × (1+i) ]"
              howItWorks={[
                '1. Reverse compounds target corpus to determine monthly investment needed.',
                '2. Higher return rates drastically reduce the monthly capital requirement.',
                '3. Starting even 3 years earlier can cut required monthly SIP by over 40%.',
              ]}
              example={{
                input: 'Target: ₹50,00,000 at 12% in 10 years',
                calculation: 'Required Monthly SIP: ₹21,520 | Capital invested: ₹25.82 Lakhs',
                output: '₹21,520/month',
              }}
            />
          </>
        )}

        {/* ========================================================================= */}
        {/* 4. CAGR MODE */}
        {/* ========================================================================= */}
        {mode === 'cagr' && (
          <>
            <ResultHeroCard
              title="Compound Annual Growth Rate"
              value={`${cagrResult.cagrPercentage}% p.a.`}
              subText={`Absolute Gain: +₹${cagrResult.absoluteGain.toLocaleString('en-IN')} (+${cagrResult.absoluteReturnPct}%)`}
              badgeText={`Annualized return over ${numYears} years`}
              badgeType="success"
              secondaryStats={[
                { label: 'Initial', value: `₹${cagrResult.initialValue.toLocaleString('en-IN')}` },
                { label: 'CAGR', value: `${cagrResult.cagrPercentage}%`, color: '#10B981' },
                { label: 'Final', value: `₹${cagrResult.finalValue.toLocaleString('en-IN')}` },
              ]}
            />

            <Card style={styles.cardSpacing}>
              <CalcInputField
                label="Initial Investment Value"
                prefix="₹"
                value={cagrInitial}
                onChangeText={setCagrInitial}
                keyboardType="numeric"
              />
              <PresetPills
                options={[{ label: '₹50K', value: '50000' }, { label: '₹1L', value: '100000' }, { label: '₹2.5L', value: '250000' }, { label: '₹5L', value: '500000' }]}
                selectedValue={cagrInitial}
                onSelect={(val) => setCagrInitial(String(val))}
              />

              <CalcInputField
                label="Final Maturity / Current Value"
                prefix="₹"
                value={cagrFinal}
                onChangeText={setCagrFinal}
                keyboardType="numeric"
              />
              <PresetPills
                options={[{ label: '₹1.5L', value: '150000' }, { label: '₹2.5L', value: '250000' }, { label: '₹5L', value: '500000' }, { label: '₹10L', value: '1000000' }]}
                selectedValue={cagrFinal}
                onSelect={(val) => setCagrFinal(String(val))}
              />

              <CalcInputField
                label="Holding Period"
                suffix="Years"
                value={years}
                onChangeText={setYears}
                keyboardType="numeric"
              />
              <PresetPills
                options={[{ label: '1Y', value: '1' }, { label: '3Y', value: '3' }, { label: '5Y', value: '5' }, { label: '7Y', value: '7' }, { label: '10Y', value: '10' }]}
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
              <Text style={[styles.cardHeading, { color: theme.colors.text }]}>Return Metrics</Text>
              <BreakdownRow
                label="Absolute Total Return"
                value={`+${cagrResult.absoluteReturnPct}%`}
                dotColor="#3B82F6"
                showDivider
              />
              <BreakdownRow
                label="Net Wealth Increase"
                value={`+₹${cagrResult.absoluteGain.toLocaleString('en-IN')}`}
                valueColor="#10B981"
                dotColor="#10B981"
                showDivider
              />
              <BreakdownRow
                label="Annualized Compounded Return (CAGR)"
                value={`${cagrResult.cagrPercentage}% p.a.`}
                isBold
                isHighlight
                valueColor={theme.colors.primary}
              />
            </Card>

            <FormulaTabs
              formula="CAGR = (Final Value / Initial Value)^(1 / Years) - 1"
              howItWorks={[
                '1. Standard measure for comparing performance across mutual funds and stocks.',
                '2. Smoothens out volatile ups and downs to provide a true annualized growth rate.',
                '3. Essential for assessing whether returns beat inflation.',
              ]}
              example={{
                input: '₹1,00,000 grew to ₹2,50,000 over 5 years',
                calculation: '(2,50,000 / 1,00,000)^(1/5) - 1 = (2.5)^0.2 - 1 = 20.11%',
                output: '20.11% CAGR',
              }}
            />
          </>
        )}

        {/* ========================================================================= */}
        {/* 5. INFLATION MODE */}
        {/* ========================================================================= */}
        {mode === 'inflation' && (
          <>
            <ResultHeroCard
              title="Future Equivalent Cost"
              value={`₹${inflationResult.futureCost.toLocaleString('en-IN')}`}
              subText={`Purchasing Power Loss: -${inflationResult.purchasingPowerLossPct}%`}
              badgeText={`Cost in ${numYears} years at ${numInfRate}% inflation`}
              badgeType="danger"
              secondaryStats={[
                { label: 'Today', value: `₹${inflationResult.currentAmount.toLocaleString('en-IN')}` },
                { label: 'Future', value: `₹${inflationResult.futureCost.toLocaleString('en-IN')}`, color: '#EF4444' },
                { label: 'Purchasing Loss', value: `-${inflationResult.purchasingPowerLossPct}%` },
              ]}
            />

            <Card style={styles.cardSpacing}>
              <CalcInputField
                label="Current Expense or Amount"
                prefix="₹"
                value={investment}
                onChangeText={setInvestment}
                keyboardType="numeric"
              />
              <PresetPills
                options={[{ label: '₹25K', value: '25000' }, { label: '₹50K', value: '50000' }, { label: '₹1L', value: '100000' }, { label: '₹5L', value: '500000' }]}
                selectedValue={investment}
                onSelect={(val) => setInvestment(String(val))}
              />

              <CalcInputField
                label="Annual Inflation Rate"
                suffix="% p.a."
                value={inflationRate}
                onChangeText={setInflationRate}
                keyboardType="numeric"
                helperText="India CPI average rate ~5.5-6.5%"
              />
              <PresetPills
                options={[{ label: '4%', value: '4' }, { label: '5%', value: '5' }, { label: '6%', value: '6' }, { label: '7%', value: '7' }]}
                selectedValue={inflationRate}
                onSelect={(val) => setInflationRate(String(val))}
              />

              <CalcInputField
                label="Time Horizon"
                suffix="Years"
                value={years}
                onChangeText={setYears}
                keyboardType="numeric"
              />
              <PresetPills
                options={[{ label: '5Y', value: '5' }, { label: '10Y', value: '10' }, { label: '15Y', value: '15' }, { label: '20Y', value: '20' }]}
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
              <Text style={[styles.cardHeading, { color: theme.colors.text }]}>Inflation Impact</Text>
              <BreakdownRow
                label="Today's Cost"
                value={`₹${inflationResult.currentAmount.toLocaleString('en-IN')}`}
                dotColor="#3B82F6"
                showDivider
              />
              <BreakdownRow
                label="Future Cost (To buy the same items)"
                value={`₹${inflationResult.futureCost.toLocaleString('en-IN')}`}
                valueColor="#EF4444"
                dotColor="#EF4444"
                showDivider
              />
              <BreakdownRow
                label="What ₹1 Lakh today will feel like"
                value={`₹${inflationResult.equivalentToday.toLocaleString('en-IN')}`}
                isBold
                isHighlight
                valueColor={theme.colors.primary}
              />
            </Card>

            <FormulaTabs
              formula="Future Cost = Today's Cost × (1 + Inflation Rate)ⁿ"
              howItWorks={[
                '1. Inflation reduces purchasing power of currency over time.',
                '2. At 6% inflation, costs double approximately every 12 years (Rule of 72).',
                '3. Equities and mutual funds beat inflation over the long term.',
              ]}
              example={{
                input: '₹50,000 monthly expenses at 6% inflation for 10 years',
                calculation: 'Future Cost = 50,000 × (1.06)^10 = ₹89,542',
                output: '₹89,542 / month needed',
              }}
            />
          </>
        )}

        {/* ========================================================================= */}
        {/* 6. PPF MODE */}
        {/* ========================================================================= */}
        {mode === 'ppf' && (
          <>
            <ResultHeroCard
              title="PPF Maturity Amount"
              value={`₹${ppfResult.maturityAmount.toLocaleString('en-IN')}`}
              subText={`Tax-Free Interest Earned: +₹${ppfResult.interestEarned.toLocaleString('en-IN')}`}
              badgeText="Govt Backed (EEE Status - 100% Tax Free)"
              badgeType="success"
              secondaryStats={[
                { label: 'Invested', value: `₹${ppfResult.totalDeposited.toLocaleString('en-IN')}` },
                { label: 'Interest', value: `+₹${ppfResult.interestEarned.toLocaleString('en-IN')}`, color: '#10B981' },
                { label: 'Tenure', value: `${numYears} Years` },
              ]}
            />

            <Card style={styles.cardSpacing}>
              <CalcInputField
                label="Annual Contribution"
                prefix="₹"
                value={investment}
                onChangeText={setInvestment}
                keyboardType="numeric"
                helperText="Statutory maximum limit is ₹1,50,000 per financial year"
              />
              <PresetPills
                options={[{ label: '₹25K', value: '25000' }, { label: '₹50K', value: '50000' }, { label: '₹1L', value: '100000' }, { label: '₹1.5L', value: '150000' }]}
                selectedValue={investment}
                onSelect={(val) => setInvestment(String(val))}
              />

              <CalcInputField
                label="Govt Interest Rate (% p.a.)"
                value="7.1"
                onChangeText={() => {}}
                keyboardType="numeric"
                editable={false}
                helperText="Fixed quarterly by Govt of India (100% Tax-Free)"
              />

              <CalcInputField
                label="Maturity Tenure"
                suffix="Years"
                value={years}
                onChangeText={setYears}
                keyboardType="numeric"
                helperText="Mandatory 15-year initial lock-in with 5-year extensions"
              />
              <PresetPills
                options={[{ label: '15Y', value: '15' }, { label: '20Y', value: '20' }, { label: '25Y', value: '25' }]}
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
              <Text style={[styles.cardHeading, { color: theme.colors.text }]}>PPF Breakdown</Text>
              <BreakdownRow
                label="Total Invested Amount"
                value={`₹${ppfResult.totalDeposited.toLocaleString('en-IN')}`}
                dotColor="#3B82F6"
                showDivider
              />
              <BreakdownRow
                label="Tax-Free Interest Earned"
                value={`+₹${ppfResult.interestEarned.toLocaleString('en-IN')}`}
                valueColor="#10B981"
                dotColor="#10B981"
                showDivider
              />
              <BreakdownRow
                label="Total Maturity Sum"
                value={`₹${ppfResult.maturityAmount.toLocaleString('en-IN')}`}
                isBold
                isHighlight
                valueColor={theme.colors.primary}
              />
            </Card>

            <FormulaTabs
              formula="Maturity = Σ [Deposit × (1 + r)ⁿ] compounded annually"
              howItWorks={[
                '1. EEE Tax Status: Exemption at investment, accrual, and withdrawal.',
                '2. Interest compounded annually, calculated on minimum balance between 5th & end of month.',
                '3. Backed by sovereign government guarantee with zero default risk.',
              ]}
              example={{
                input: '₹1,50,000 / year for 15 years at 7.1%',
                calculation: 'Invested: ₹22,50,000 | Interest: ₹18,18,209',
                output: '₹40,68,209 (100% Tax Free)',
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
  },
  chartSubHeading: {
    fontSize: 12,
    marginTop: 2,
  },
  chartHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chartBarsArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 110,
    paddingTop: 10,
    paddingBottom: 8,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 1.5,
  },
  chartGainBar: {
    width: 8,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  chartInvestedBar: {
    width: 8,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  chartYearLabel: {
    fontSize: 8.5,
    fontWeight: '600',
    marginTop: 4,
  },
  breakdownSection: {
    marginTop: 6,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
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
