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
  CalculationHistoryModal,
} from '../components';
import { useTheme } from '@dailyapps/theme';
import { useAnalytics } from '@dailyapps/analytics';
import { useCalculationHistory } from '../hooks';
import {
  calculateIncomeTax,
  calculateInHandSalary,
  calculateHRAExemption,
  calculateGSTDetailed,
} from '../calculations/tax';

interface TaxSalaryCalculatorScreenProps {
  navigation: any;
  route?: any;
}

type TaxMode = 'income_tax' | 'inhand' | 'hra' | 'gst_tds';

export const TaxSalaryCalculatorScreen: React.FC<TaxSalaryCalculatorScreenProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const analytics = useAnalytics();

  const tool = route?.params?.tool;
  const initialMode: TaxMode =
    tool?.id === 'inhand_salary' || tool?.id === 'salary_hike'
      ? 'inhand'
      : tool?.id === 'hra'
      ? 'hra'
      : tool?.id === 'gst' || tool?.id === 'gst_inc_exc' || tool?.id === 'gst_split' || tool?.id === 'tds'
      ? 'gst_tds'
      : 'income_tax';

  const [mode, setMode] = useState<TaxMode>(initialMode);

  // History
  const [showHistory, setShowHistory] = useState(false);
  const { history, saveCalculation, deleteItem, clearHistory } = useCalculationHistory(
    mode,
    '💵 Tax & Salary'
  );

  // Mode 1: Income Tax States
  const [grossIncome, setGrossIncome] = useState('1200000');
  const [deductions80C, setDeductions80C] = useState('150000');
  const [deductions80D, setDeductions80D] = useState('25000');
  const [otherDeductions, setOtherDeductions] = useState('50000');

  // Mode 2: In-Hand Salary States
  const [annualCTC, setAnnualCTC] = useState('1200000');
  const [basicPct, setBasicPct] = useState('40');

  // Mode 3: HRA States
  const [monthlyBasic, setMonthlyBasic] = useState('40000');
  const [monthlyHRA, setMonthlyHRA] = useState('20000');
  const [monthlyRent, setMonthlyRent] = useState('18000');
  const [isMetro, setIsMetro] = useState(true);

  // Mode 4: GST & TDS States
  const [gstType, setGstType] = useState<'gst' | 'tds'>('gst');
  const [gstAmount, setGstAmount] = useState('10000');
  const [gstRate, setGstRate] = useState('18');
  const [isInclusive, setIsInclusive] = useState(false); // false = Exclusive (Add), true = Inclusive (Remove)

  // TDS States
  const [tdsAmount, setTdsAmount] = useState('50000');
  const [tdsCategoryRate, setTdsCategoryRate] = useState('10'); // 1%, 2%, 5%, 10%

  useEffect(() => {
    analytics.logScreenView('TaxSalaryCalculatorScreen');
  }, [analytics]);

  useEffect(() => {
    if (tool?.id) {
      if (tool.id === 'inhand_salary' || tool.id === 'salary_hike') {
        setMode('inhand');
      } else if (tool.id === 'hra') {
        setMode('hra');
      } else if (tool.id === 'gst' || tool.id === 'gst_inc_exc' || tool.id === 'gst_split') {
        setMode('gst_tds');
        setGstType('gst');
        if (tool.id === 'gst_inc_exc') setIsInclusive(true);
      } else if (tool.id === 'tds') {
        setMode('gst_tds');
        setGstType('tds');
      } else {
        setMode('income_tax');
      }
    }
  }, [tool?.id]);

  // Calculations
  const incomeTaxResult = useMemo(() => {
    const gross = parseFloat(grossIncome) || 0;
    const c80 = parseFloat(deductions80C) || 0;
    const d80 = parseFloat(deductions80D) || 0;
    const other = parseFloat(otherDeductions) || 0;
    return calculateIncomeTax(gross, c80, d80, other);
  }, [grossIncome, deductions80C, deductions80D, otherDeductions]);

  const inHandResult = useMemo(() => {
    const ctc = parseFloat(annualCTC) || 0;
    const bp = parseFloat(basicPct) || 40;
    return calculateInHandSalary(ctc, bp);
  }, [annualCTC, basicPct]);

  const hraResult = useMemo(() => {
    const basic = parseFloat(monthlyBasic) || 0;
    const hra = parseFloat(monthlyHRA) || 0;
    const rent = parseFloat(monthlyRent) || 0;
    return calculateHRAExemption(basic, hra, rent, isMetro);
  }, [monthlyBasic, monthlyHRA, monthlyRent, isMetro]);

  const gstResult = useMemo(() => {
    const amt = parseFloat(gstAmount) || 0;
    const rate = parseFloat(gstRate) || 18;
    return calculateGSTDetailed(amt, rate, isInclusive);
  }, [gstAmount, gstRate, isInclusive]);

  const tdsResult = useMemo(() => {
    const amt = parseFloat(tdsAmount) || 0;
    const rate = parseFloat(tdsCategoryRate) || 10;
    const deduction = Math.round((amt * rate) / 100);
    const netReceived = Math.max(0, amt - deduction);
    return { amt, rate, deduction, netReceived };
  }, [tdsAmount, tdsCategoryRate]);

  // Reset Handlers
  const handleReset = () => {
    if (mode === 'income_tax') {
      setGrossIncome('1200000');
      setDeductions80C('150000');
      setDeductions80D('25000');
      setOtherDeductions('50000');
    } else if (mode === 'inhand') {
      setAnnualCTC('1200000');
      setBasicPct('40');
    } else if (mode === 'hra') {
      setMonthlyBasic('40000');
      setMonthlyHRA('20000');
      setMonthlyRent('18000');
      setIsMetro(true);
    } else {
      setGstAmount('10000');
      setGstRate('18');
      setIsInclusive(false);
      setTdsAmount('50000');
      setTdsCategoryRate('10');
    }
  };

  // Auto-save history
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mode === 'income_tax' && incomeTaxResult.grossIncome > 0) {
        saveCalculation({
          toolId: 'income_tax',
          toolName: 'Income Tax (Old vs New)',
          category: '💵 Tax & Salary',
          title: `Tax on ₹${(incomeTaxResult.grossIncome / 100000).toFixed(1)}L Gross`,
          subtitle: `Recommended: ${incomeTaxResult.recommendedRegime.toUpperCase()} Regime (Saves ₹${incomeTaxResult.taxSavings.toLocaleString('en-IN')})`,
          result: `New: ₹${incomeTaxResult.newTotalTax.toLocaleString('en-IN')} | Old: ₹${incomeTaxResult.oldTotalTax.toLocaleString('en-IN')}`,
          badge: incomeTaxResult.recommendedRegime.toUpperCase(),
          inputs: { grossIncome, deductions80C, deductions80D, otherDeductions },
        });
      } else if (mode === 'inhand' && inHandResult.annualCTC > 0) {
        saveCalculation({
          toolId: 'inhand_salary',
          toolName: 'CTC to In-Hand Salary',
          category: '💵 Tax & Salary',
          title: `₹${(inHandResult.annualCTC / 100000).toFixed(1)}L CTC → ₹${inHandResult.monthlyInHand.toLocaleString('en-IN')}/mo`,
          subtitle: `Monthly Gross: ₹${inHandResult.monthlyGross.toLocaleString('en-IN')}`,
          result: `Annual In-Hand: ₹${inHandResult.annualInHand.toLocaleString('en-IN')}`,
          badge: 'TAKE-HOME',
          inputs: { annualCTC, basicPct },
        });
      } else if (mode === 'hra' && hraResult.annualRent > 0) {
        saveCalculation({
          toolId: 'hra',
          toolName: 'HRA Exemption Sec 10(13A)',
          category: '💵 Tax & Salary',
          title: `HRA Exempt: ₹${hraResult.exemptHRA.toLocaleString('en-IN')}/yr`,
          subtitle: `Taxable HRA: ₹${hraResult.taxableHRA.toLocaleString('en-IN')}/yr`,
          result: `Exemption: ₹${Math.round(hraResult.exemptHRA / 12).toLocaleString('en-IN')}/mo`,
          badge: isMetro ? 'METRO' : 'NON-METRO',
          inputs: { monthlyBasic, monthlyHRA, monthlyRent, isMetro },
        });
      } else if (mode === 'gst_tds') {
        if (gstType === 'gst' && gstResult.totalAmount > 0) {
          saveCalculation({
            toolId: 'gst',
            toolName: `GST ${gstResult.rate}% (${isInclusive ? 'Inclusive' : 'Exclusive'})`,
            category: '💵 Tax & Salary',
            title: `Base: ₹${gstResult.baseAmount.toLocaleString('en-IN')} + GST: ₹${gstResult.gstAmount.toLocaleString('en-IN')}`,
            subtitle: `CGST: ₹${gstResult.cgst.toLocaleString('en-IN')} | SGST: ₹${gstResult.sgst.toLocaleString('en-IN')}`,
            result: `Total: ₹${gstResult.totalAmount.toLocaleString('en-IN')}`,
            badge: isInclusive ? 'INCLUSIVE' : 'EXCLUSIVE',
            inputs: { gstAmount, gstRate, isInclusive },
          });
        }
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [mode, incomeTaxResult, inHandResult, hraResult, gstResult, gstType, isInclusive, isMetro, saveCalculation, grossIncome, deductions80C, deductions80D, otherDeductions, annualCTC, basicPct, monthlyBasic, monthlyHRA, monthlyRent, gstAmount, gstRate]);

  return (
    <ScreenContainer safeArea withPadding={false}>
      <CalculatorHeader
        title="Tax & Salary Suite"
        subtitle="Income Tax, In-Hand CTC, HRA & GST"
        icon="💵"
        category="💵 Tax & Salary"
        toolId={tool?.id || 'tax_salary'}
        onBack={() => navigation.goBack()}
        onHistory={() => setShowHistory(true)}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Unified Category Tabs */}
        <SegmentedTabs
          scrollable
          activeTab={mode}
          onTabChange={(key) => setMode(key as TaxMode)}
          tabs={[
            { key: 'income_tax', label: 'Income Tax', icon: '📋' },
            { key: 'inhand', label: 'In-Hand Salary', icon: '💵' },
            { key: 'hra', label: 'HRA Exemption', icon: '🏠' },
            { key: 'gst_tds', label: 'GST & TDS', icon: '🧾' },
          ]}
        />

        {/* ========================================================================= */}
        {/* TAB 1: INCOME TAX (Budget 2024-25 Old vs New Regime) */}
        {/* ========================================================================= */}
        {mode === 'income_tax' && (
          <>
            <ResultHeroCard
              title={
                incomeTaxResult.recommendedRegime === 'new'
                  ? 'New Regime Recommended'
                  : 'Old Regime Recommended'
              }
              value={`₹${(incomeTaxResult.recommendedRegime === 'new'
                ? incomeTaxResult.newTotalTax
                : incomeTaxResult.oldTotalTax
              ).toLocaleString('en-IN')}`}
              subText={
                incomeTaxResult.taxSavings > 0
                  ? `Saves ₹${incomeTaxResult.taxSavings.toLocaleString('en-IN')} vs ${
                      incomeTaxResult.recommendedRegime === 'new' ? 'Old' : 'New'
                    } Regime`
                  : 'Both regimes yield equal tax liability'
              }
              badgeText={
                incomeTaxResult.recommendedRegime === 'new'
                  ? 'BUDGET 2024 REVISED'
                  : 'OLD REGIME DEDUCTIONS'
              }
              badgeType="success"
              secondaryStats={[
                { label: 'New Tax', value: `₹${incomeTaxResult.newTotalTax.toLocaleString('en-IN')}` },
                { label: 'Old Tax', value: `₹${incomeTaxResult.oldTotalTax.toLocaleString('en-IN')}` },
                { label: 'Effective Rate', value: `${incomeTaxResult.newEffectiveRate}%` },
              ]}
            />

            {/* Input Form Card */}
            <Card
              style={[
                styles.card,
                { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle },
              ]}
            >
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Annual Income & Deductions</Text>

              <CalcInputField
                label="Annual Gross Salary / Income"
                prefix="₹"
                keyboardType="numeric"
                value={grossIncome}
                onChangeText={setGrossIncome}
                placeholder="e.g. 1200000"
              />

              <PresetPills
                options={[
                  { label: '₹7.5L', value: '750000' },
                  { label: '₹10L', value: '1000000' },
                  { label: '₹12L', value: '1200000' },
                  { label: '₹15L', value: '1500000' },
                  { label: '₹20L', value: '2000000' },
                  { label: '₹25L', value: '2500000' },
                ]}
                selectedValue={grossIncome}
                onSelect={(val) => setGrossIncome(String(val))}
              />

              <View style={styles.deductionSection}>
                <Text style={[styles.subSectionTitle, { color: theme.colors.textMuted }]}>
                  Old Regime Deductions (Optional)
                </Text>

                <CalcInputField
                  label="Section 80C (PPF, ELSS, EPF, Life Ins.)"
                  prefix="₹"
                  keyboardType="numeric"
                  value={deductions80C}
                  onChangeText={setDeductions80C}
                  placeholder="Max ₹1,50,000"
                />

                <CalcInputField
                  label="Section 80D (Health Insurance)"
                  prefix="₹"
                  keyboardType="numeric"
                  value={deductions80D}
                  onChangeText={setDeductions80D}
                  placeholder="Max ₹25,000 / ₹50,000"
                />

                <CalcInputField
                  label="Other Deductions (NPS 80CCD, Home Loan 24b)"
                  prefix="₹"
                  keyboardType="numeric"
                  value={otherDeductions}
                  onChangeText={setOtherDeductions}
                  placeholder="e.g. 50000"
                />
              </View>

              {/* Bottom Reset Button */}
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

            {/* Comparison Side-by-Side Cards */}
            <Card
              style={[
                styles.card,
                { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle },
              ]}
            >
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>New vs Old Regime Comparison</Text>

              {/* Recommendation Callout Banner */}
              <View
                style={[
                  styles.regimeBanner,
                  {
                    backgroundColor:
                      incomeTaxResult.taxSavings > 0
                        ? theme.isDark
                          ? 'rgba(16, 185, 129, 0.16)'
                          : '#DCFCE7'
                        : theme.isDark
                        ? 'rgba(59, 130, 246, 0.16)'
                        : '#DBEAFE',
                    borderColor:
                      incomeTaxResult.taxSavings > 0
                        ? '#10B981'
                        : '#3B82F6',
                  },
                ]}
              >
                <Text style={styles.bannerEmoji}>
                  {incomeTaxResult.taxSavings > 0 ? '🏆' : '⚖️'}
                </Text>
                <View style={styles.flex1}>
                  <Text
                    style={[
                      styles.bannerHeading,
                      { color: incomeTaxResult.taxSavings > 0 ? '#10B981' : '#3B82F6' },
                    ]}
                  >
                    {incomeTaxResult.taxSavings > 0
                      ? `${incomeTaxResult.recommendedRegime === 'new' ? 'New' : 'Old'} Regime Saves ₹${incomeTaxResult.taxSavings.toLocaleString('en-IN')}!`
                      : 'Both Regimes have Equal Tax'}
                  </Text>
                  <Text style={[styles.bannerSub, { color: theme.colors.textMuted }]}>
                    {incomeTaxResult.taxSavings > 0
                      ? `Opt for ${incomeTaxResult.recommendedRegime === 'new' ? 'Revised New Regime (Sec 115BAC)' : 'Old Regime with deductions'} to maximize your savings.`
                      : 'You can choose either regime as taxable liability is identical.'}
                  </Text>
                </View>
              </View>

              {/* Side-by-Side Regime Cards */}
              <View style={styles.regimeCardsRow}>
                {/* New Regime Card */}
                <View
                  style={[
                    styles.regimeCard,
                    {
                      backgroundColor: theme.isDark ? 'rgba(30, 41, 59, 0.7)' : '#F8FAFC',
                      borderColor:
                        incomeTaxResult.recommendedRegime === 'new'
                          ? '#10B981'
                          : theme.colors.borderSubtle,
                      borderWidth: incomeTaxResult.recommendedRegime === 'new' ? 2 : 1,
                    },
                  ]}
                >
                  <View style={styles.regimeCardHeader}>
                    <Text style={[styles.regimeCardTitle, { color: theme.colors.text }]}>New Regime</Text>
                    {incomeTaxResult.recommendedRegime === 'new' && (
                      <View style={[styles.miniBadge, { backgroundColor: '#10B981' }]}>
                        <Text style={styles.miniBadgeText}>BEST</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.regimeTaxValue, { color: '#10B981' }]}>
                    ₹{incomeTaxResult.newTotalTax.toLocaleString('en-IN')}
                  </Text>
                  <Text style={[styles.regimeRateSub, { color: theme.colors.textMuted }]}>
                    Effective: {incomeTaxResult.newEffectiveRate}%
                  </Text>

                  <View style={styles.regimeMetricDivider} />

                  <View style={styles.regimeMetricRow}>
                    <Text style={[styles.regimeMetricLabel, { color: theme.colors.textMuted }]}>Std Ded</Text>
                    <Text style={[styles.regimeMetricVal, { color: theme.colors.text }]}>₹75,000</Text>
                  </View>
                  <View style={styles.regimeMetricRow}>
                    <Text style={[styles.regimeMetricLabel, { color: theme.colors.textMuted }]}>Taxable</Text>
                    <Text style={[styles.regimeMetricVal, { color: theme.colors.text }]}>
                      ₹{Math.round(incomeTaxResult.newTaxableIncome / 1000)}k
                    </Text>
                  </View>
                </View>

                {/* Old Regime Card */}
                <View
                  style={[
                    styles.regimeCard,
                    {
                      backgroundColor: theme.isDark ? 'rgba(30, 41, 59, 0.7)' : '#F8FAFC',
                      borderColor:
                        incomeTaxResult.recommendedRegime === 'old'
                          ? '#10B981'
                          : theme.colors.borderSubtle,
                      borderWidth: incomeTaxResult.recommendedRegime === 'old' ? 2 : 1,
                    },
                  ]}
                >
                  <View style={styles.regimeCardHeader}>
                    <Text style={[styles.regimeCardTitle, { color: theme.colors.text }]}>Old Regime</Text>
                    {incomeTaxResult.recommendedRegime === 'old' && (
                      <View style={[styles.miniBadge, { backgroundColor: '#10B981' }]}>
                        <Text style={styles.miniBadgeText}>BEST</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.regimeTaxValue, { color: theme.colors.primary }]}>
                    ₹{incomeTaxResult.oldTotalTax.toLocaleString('en-IN')}
                  </Text>
                  <Text style={[styles.regimeRateSub, { color: theme.colors.textMuted }]}>
                    Effective: {incomeTaxResult.oldEffectiveRate}%
                  </Text>

                  <View style={styles.regimeMetricDivider} />

                  <View style={styles.regimeMetricRow}>
                    <Text style={[styles.regimeMetricLabel, { color: theme.colors.textMuted }]}>Deductions</Text>
                    <Text style={[styles.regimeMetricVal, { color: theme.colors.text }]}>
                      ₹{Math.round(incomeTaxResult.oldTotalDeductions / 1000)}k
                    </Text>
                  </View>
                  <View style={styles.regimeMetricRow}>
                    <Text style={[styles.regimeMetricLabel, { color: theme.colors.textMuted }]}>Taxable</Text>
                    <Text style={[styles.regimeMetricVal, { color: theme.colors.text }]}>
                      ₹{Math.round(incomeTaxResult.oldTaxableIncome / 1000)}k
                    </Text>
                  </View>
                </View>
              </View>

              {/* Detailed Comparative Rows */}
              <View style={styles.detailsDivider} />
              <BreakdownRow
                label="Gross Income"
                value={`₹${incomeTaxResult.grossIncome.toLocaleString('en-IN')}`}
                showDivider
              />
              <BreakdownRow
                label="Standard Deduction"
                value={`₹${incomeTaxResult.newStandardDeduction.toLocaleString('en-IN')} vs ₹${incomeTaxResult.oldStandardDeduction.toLocaleString('en-IN')}`}
                showDivider
              />
              <BreakdownRow
                label="80C / 80D Deductions"
                value={`Nil vs ₹${incomeTaxResult.oldTotalDeductions.toLocaleString('en-IN')}`}
                showDivider
              />
              <BreakdownRow
                label="Rebate u/s 87A"
                value={`₹${incomeTaxResult.newRebate87A.toLocaleString('en-IN')} vs ₹${incomeTaxResult.oldRebate87A.toLocaleString('en-IN')}`}
                valueColor="#10B981"
                showDivider
              />
              <BreakdownRow
                label="Health & Edu Cess (4%)"
                value={`₹${incomeTaxResult.newCess.toLocaleString('en-IN')} vs ₹${incomeTaxResult.oldCess.toLocaleString('en-IN')}`}
                showDivider
              />
              <BreakdownRow
                label="Total Tax Difference"
                value={`₹${Math.abs(incomeTaxResult.newTotalTax - incomeTaxResult.oldTotalTax).toLocaleString('en-IN')}`}
                isBold
                isHighlight
                valueColor={incomeTaxResult.taxSavings > 0 ? '#10B981' : theme.colors.text}
              />
            </Card>

            {/* Revised Slabs Information */}
            <Card
              style={[
                styles.card,
                { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle },
              ]}
            >
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Budget 2024 Revised Slabs (Sec 115BAC)</Text>
              <Text style={[styles.infoParagraph, { color: theme.colors.textMuted }]}>
                • ₹0 to ₹3,00,000 : Nil{'\n'}
                • ₹3,00,001 to ₹7,00,000 : 5%{'\n'}
                • ₹7,00,001 to ₹10,00,000 : 10%{'\n'}
                • ₹10,00,001 to ₹12,00,000 : 15%{'\n'}
                • ₹12,00,001 to ₹15,00,000 : 20%{'\n'}
                • Above ₹15,00,000 : 30%{'\n'}
                * Standard deduction is ₹75,000 for salaried employees. Tax rebate u/s 87A covers total income up to ₹7,00,000 (effectively zero tax).
              </Text>
            </Card>
          </>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: IN-HAND SALARY (CTC to Net Take-Home) */}
        {/* ========================================================================= */}
        {mode === 'inhand' && (
          <>
            <ResultHeroCard
              title="Monthly Take-Home Salary"
              value={`₹${inHandResult.monthlyInHand.toLocaleString('en-IN')}`}
              subText={`Annual In-Hand: ₹${inHandResult.annualInHand.toLocaleString('en-IN')} (Net)`}
              badgeText="ESTIMATED IN-HAND"
              badgeType="success"
              secondaryStats={[
                { label: 'Gross / mo', value: `₹${inHandResult.monthlyGross.toLocaleString('en-IN')}` },
                { label: 'Deductions / mo', value: `₹${(inHandResult.monthlyGross - inHandResult.monthlyInHand).toLocaleString('en-IN')}` },
                { label: 'Net Take Home', value: `₹${inHandResult.monthlyInHand.toLocaleString('en-IN')}` },
              ]}
            />

            <Card
              style={[
                styles.card,
                { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle },
              ]}
            >
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Cost To Company (CTC)</Text>

              <CalcInputField
                label="Annual CTC Package"
                prefix="₹"
                keyboardType="numeric"
                value={annualCTC}
                onChangeText={setAnnualCTC}
                placeholder="e.g. 1200000"
              />

              <PresetPills
                options={[
                  { label: '₹6L', value: '600000' },
                  { label: '₹10L', value: '1000000' },
                  { label: '₹15L', value: '1500000' },
                  { label: '₹20L', value: '2000000' },
                  { label: '₹30L', value: '3000000' },
                ]}
                selectedValue={annualCTC}
                onSelect={(val) => setAnnualCTC(String(val))}
              />

              <CalcInputField
                label="Basic Salary Percentage (% of Gross)"
                suffix="%"
                keyboardType="numeric"
                value={basicPct}
                onChangeText={setBasicPct}
                placeholder="Standard: 40% or 50%"
              />

              {/* Bottom Reset Button */}
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

            {/* Monthly Earnings Breakdown */}
            <Card
              style={[
                styles.card,
                { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle },
              ]}
            >
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Monthly Earnings Breakdown</Text>
              <BreakdownRow
                label="Gross Monthly Salary"
                value={`₹${inHandResult.monthlyGross.toLocaleString('en-IN')}`}
                isBold
                showDivider
              />
              <BreakdownRow
                label="Basic Salary"
                value={`₹${inHandResult.monthlyBasic.toLocaleString('en-IN')}`}
                showDivider
              />
              <BreakdownRow
                label="House Rent Allowance (HRA 50%)"
                value={`₹${inHandResult.monthlyHRA.toLocaleString('en-IN')}`}
                showDivider
              />
              <BreakdownRow
                label="Special & Other Allowances"
                value={`₹${inHandResult.monthlySpecialAllowance.toLocaleString('en-IN')}`}
              />
            </Card>

            {/* Monthly Statutory Deductions */}
            <Card
              style={[
                styles.card,
                { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle },
              ]}
            >
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Monthly Deductions</Text>
              <BreakdownRow
                label="Employee Provident Fund (EPF)"
                value={`₹${inHandResult.monthlyEmployeePF.toLocaleString('en-IN')}`}
                valueColor="#EF4444"
                showDivider
              />
              <BreakdownRow
                label="Professional Tax (PT)"
                value={`₹${inHandResult.monthlyProfessionalTax.toLocaleString('en-IN')}`}
                valueColor="#EF4444"
                showDivider
              />
              <BreakdownRow
                label="Estimated Monthly TDS / Income Tax"
                value={`₹${inHandResult.monthlyTDS.toLocaleString('en-IN')}`}
                valueColor="#EF4444"
                showDivider
              />
              <BreakdownRow
                label="Total Monthly Deductions"
                value={`₹${(
                  inHandResult.monthlyEmployeePF +
                  inHandResult.monthlyProfessionalTax +
                  inHandResult.monthlyTDS
                ).toLocaleString('en-IN')}`}
                isBold
                valueColor="#EF4444"
                showDivider
              />
              <BreakdownRow
                label="Net Monthly In-Hand"
                value={`₹${inHandResult.monthlyInHand.toLocaleString('en-IN')}`}
                isBold
                isHighlight
                valueColor="#10B981"
              />
            </Card>
          </>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: HRA EXEMPTION (Section 10(13A)) */}
        {/* ========================================================================= */}
        {mode === 'hra' && (
          <>
            <ResultHeroCard
              title="Tax-Exempt HRA Amount"
              value={`₹${hraResult.exemptHRA.toLocaleString('en-IN')} / yr`}
              subText={`Monthly Exemption: ₹${Math.round(hraResult.exemptHRA / 12).toLocaleString('en-IN')}/mo`}
              badgeText={isMetro ? 'METRO (50% CAP)' : 'NON-METRO (40% CAP)'}
              badgeType="success"
              secondaryStats={[
                { label: 'Exempt HRA', value: `₹${hraResult.exemptHRA.toLocaleString('en-IN')}` },
                { label: 'Taxable HRA', value: `₹${hraResult.taxableHRA.toLocaleString('en-IN')}` },
                { label: 'Total HRA', value: `₹${hraResult.annualHRA.toLocaleString('en-IN')}` },
              ]}
            />

            <Card
              style={[
                styles.card,
                { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle },
              ]}
            >
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Salary & Rent Particulars</Text>

              <CalcInputField
                label="Monthly Basic Salary"
                prefix="₹"
                keyboardType="numeric"
                value={monthlyBasic}
                onChangeText={setMonthlyBasic}
                placeholder="e.g. 40000"
              />

              <CalcInputField
                label="Monthly HRA Received from Employer"
                prefix="₹"
                keyboardType="numeric"
                value={monthlyHRA}
                onChangeText={setMonthlyHRA}
                placeholder="e.g. 20000"
              />

              <CalcInputField
                label="Actual Monthly Rent Paid"
                prefix="₹"
                keyboardType="numeric"
                value={monthlyRent}
                onChangeText={setMonthlyRent}
                placeholder="e.g. 18000"
              />

              {/* Metro City Switch */}
              <View style={styles.switchRow}>
                <View style={styles.switchTextWrap}>
                  <Text style={[styles.switchLabel, { color: theme.colors.text }]}>Metro City</Text>
                  <Text style={[styles.switchSub, { color: theme.colors.textMuted }]}>
                    Delhi, Mumbai, Kolkata, Chennai (50% rule)
                  </Text>
                </View>
                <Switch
                  value={isMetro}
                  onValueChange={setIsMetro}
                  trackColor={{ false: '#767577', true: '#10B981' }}
                  thumbColor={isMetro ? '#FFFFFF' : '#F4F3F4'}
                />
              </View>

              {/* Bottom Reset Button */}
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

            {/* Statutory Test Breakdown */}
            <Card
              style={[
                styles.card,
                { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle },
              ]}
            >
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Section 10(13A) 3-Rule Exemption Test</Text>
              <Text style={[styles.infoParagraph, { color: theme.colors.textMuted, marginBottom: 12 }]}>
                The lowest of the following 3 amounts is 100% tax exempt:
              </Text>

              <BreakdownRow
                label="1. Actual HRA Received"
                value={`₹${hraResult.condition1ActualHRA.toLocaleString('en-IN')}`}
                isBold={hraResult.exemptHRA === hraResult.condition1ActualHRA}
                valueColor={hraResult.exemptHRA === hraResult.condition1ActualHRA ? '#10B981' : undefined}
                showDivider
              />
              <BreakdownRow
                label="2. Rent Paid Minus 10% of Basic"
                value={`₹${hraResult.condition2RentMinus10Pct.toLocaleString('en-IN')}`}
                isBold={hraResult.exemptHRA === hraResult.condition2RentMinus10Pct}
                valueColor={hraResult.exemptHRA === hraResult.condition2RentMinus10Pct ? '#10B981' : undefined}
                showDivider
              />
              <BreakdownRow
                label={`3. ${isMetro ? '50%' : '40%'} of Basic Salary`}
                value={`₹${hraResult.condition3SalaryCap.toLocaleString('en-IN')}`}
                isBold={hraResult.exemptHRA === hraResult.condition3SalaryCap}
                valueColor={hraResult.exemptHRA === hraResult.condition3SalaryCap ? '#10B981' : undefined}
                showDivider
              />
              <BreakdownRow
                label="Annual Tax-Exempt HRA"
                value={`₹${hraResult.exemptHRA.toLocaleString('en-IN')}`}
                isBold
                valueColor="#10B981"
                showDivider
              />
              <BreakdownRow
                label="Annual Taxable HRA"
                value={`₹${hraResult.taxableHRA.toLocaleString('en-IN')}`}
                isBold
                valueColor={hraResult.taxableHRA > 0 ? '#EF4444' : '#10B981'}
              />
            </Card>
          </>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: GST & TDS */}
        {/* ========================================================================= */}
        {mode === 'gst_tds' && (
          <>
            {/* Sub-selector for GST vs TDS */}
            <SegmentedTabs
              activeTab={gstType}
              onTabChange={(key) => setGstType(key as 'gst' | 'tds')}
              tabs={[
                { key: 'gst', label: 'GST', icon: '🧾' },
                { key: 'tds', label: 'TDS (Withholding)', icon: '📄' },
              ]}
            />

            {gstType === 'gst' ? (
              <>
                <ResultHeroCard
                  title={isInclusive ? 'Extracted GST Amount' : 'Total Amount (With GST)'}
                  value={`₹${(isInclusive ? gstResult.gstAmount : gstResult.totalAmount).toLocaleString('en-IN')}`}
                  subText={`Base: ₹${gstResult.baseAmount.toLocaleString('en-IN')} | GST: ₹${gstResult.gstAmount.toLocaleString('en-IN')}`}
                  badgeText={isInclusive ? 'INCLUSIVE (REMOVED)' : 'EXCLUSIVE (ADDED)'}
                  badgeType="info"
                  secondaryStats={[
                    { label: 'Base Amount', value: `₹${gstResult.baseAmount.toLocaleString('en-IN')}` },
                    { label: 'CGST (50%)', value: `₹${gstResult.cgst.toLocaleString('en-IN')}` },
                    { label: 'SGST (50%)', value: `₹${gstResult.sgst.toLocaleString('en-IN')}` },
                  ]}
                />

                <Card
                  style={[
                    styles.card,
                    { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle },
                  ]}
                >
                  <Text style={[styles.cardTitle, { color: theme.colors.text }]}>GST Calculation</Text>

                  {/* Inclusive / Exclusive Toggle */}
                  <SegmentedTabs
                    activeTab={isInclusive ? 'inclusive' : 'exclusive'}
                    onTabChange={(key) => setIsInclusive(key === 'inclusive')}
                    tabs={[
                      { key: 'exclusive', label: 'Add GST (Exclusive)', icon: '➕' },
                      { key: 'inclusive', label: 'Remove GST (Inclusive)', icon: '➖' },
                    ]}
                  />

                  <CalcInputField
                    label={isInclusive ? 'Gross Amount (Including Tax)' : 'Base Amount (Excluding Tax)'}
                    prefix="₹"
                    keyboardType="numeric"
                    value={gstAmount}
                    onChangeText={setGstAmount}
                    placeholder="e.g. 10000"
                  />

                  <Text style={[styles.subSectionTitle, { color: theme.colors.textMuted }]}>
                    GST Slab Rate
                  </Text>
                  <PresetPills
                    options={[
                      { label: '3%', value: '3' },
                      { label: '5%', value: '5' },
                      { label: '12%', value: '12' },
                      { label: '18%', value: '18' },
                      { label: '28%', value: '28' },
                    ]}
                    selectedValue={gstRate}
                    onSelect={(val) => setGstRate(String(val))}
                  />

                  {/* Bottom Reset Button */}
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

                {/* Split Tax Breakdown */}
                <Card
                  style={[
                    styles.card,
                    { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle },
                  ]}
                >
                  <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Tax Split Breakdown</Text>
                  <BreakdownRow
                    label="Net Base Price"
                    value={`₹${gstResult.baseAmount.toLocaleString('en-IN')}`}
                    showDivider
                  />
                  <BreakdownRow
                    label={`CGST (${gstResult.rate / 2}% Central)`}
                    value={`₹${gstResult.cgst.toLocaleString('en-IN')}`}
                    showDivider
                  />
                  <BreakdownRow
                    label={`SGST (${gstResult.rate / 2}% State)`}
                    value={`₹${gstResult.sgst.toLocaleString('en-IN')}`}
                    showDivider
                  />
                  <BreakdownRow
                    label="Total GST Amount"
                    value={`₹${gstResult.gstAmount.toLocaleString('en-IN')}`}
                    isBold
                    valueColor="#F59E0B"
                    showDivider
                  />
                  <BreakdownRow
                    label="Final Total Amount"
                    value={`₹${gstResult.totalAmount.toLocaleString('en-IN')}`}
                    isBold
                    isHighlight
                    valueColor={theme.colors.primary}
                  />
                </Card>
              </>
            ) : (
              <>
                <ResultHeroCard
                  title="Net Amount to Receive / Pay"
                  value={`₹${tdsResult.netReceived.toLocaleString('en-IN')}`}
                  subText={`TDS Deducted: ₹${tdsResult.deduction.toLocaleString('en-IN')} (${tdsResult.rate}%)`}
                  badgeText={`SECTION ${tdsResult.rate}% RATE`}
                  badgeType="info"
                  secondaryStats={[
                    { label: 'Gross Invoice', value: `₹${tdsResult.amt.toLocaleString('en-IN')}` },
                    { label: 'TDS Rate', value: `${tdsResult.rate}%` },
                    { label: 'Net Payable', value: `₹${tdsResult.netReceived.toLocaleString('en-IN')}` },
                  ]}
                />

                <Card
                  style={[
                    styles.card,
                    { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle },
                  ]}
                >
                  <Text style={[styles.cardTitle, { color: theme.colors.text }]}>TDS Particulars</Text>

                  <CalcInputField
                    label="Bill / Gross Invoice Amount"
                    prefix="₹"
                    keyboardType="numeric"
                    value={tdsAmount}
                    onChangeText={setTdsAmount}
                    placeholder="e.g. 50000"
                  />

                  <Text style={[styles.subSectionTitle, { color: theme.colors.textMuted }]}>
                    TDS Category & Rate
                  </Text>
                  <PresetPills
                    options={[
                      { label: '1% (Contractor Ind.)', value: '1' },
                      { label: '2% (Contractor Co.)', value: '2' },
                      { label: '5% (Rent / Comm.)', value: '5' },
                      { label: '10% (Prof. Fees / FD)', value: '10' },
                    ]}
                    selectedValue={tdsCategoryRate}
                    onSelect={(val) => setTdsCategoryRate(String(val))}
                  />

                  {/* Bottom Reset Button */}
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

                <Card
                  style={[
                    styles.card,
                    { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle },
                  ]}
                >
                  <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Payment Breakdown</Text>
                  <BreakdownRow
                    label="Gross Bill Amount"
                    value={`₹${tdsResult.amt.toLocaleString('en-IN')}`}
                    showDivider
                  />
                  <BreakdownRow
                    label={`TDS Deducted @ ${tdsResult.rate}%`}
                    value={`- ₹${tdsResult.deduction.toLocaleString('en-IN')}`}
                    valueColor="#EF4444"
                    isBold
                    showDivider
                  />
                  <BreakdownRow
                    label="Net Credited / Received Amount"
                    value={`₹${tdsResult.netReceived.toLocaleString('en-IN')}`}
                    isBold
                    isHighlight
                    valueColor="#10B981"
                  />
                </Card>
              </>
            )}
          </>
        )}

        {/* Formula Information */}
        <FormulaTabs
          formula={
            mode === 'income_tax'
              ? 'New Tax = Slabs(Income - ₹75k) + 4% Cess\nOld Tax = Slabs(Income - 80C - 80D - ₹50k) + 4% Cess'
              : mode === 'inhand'
              ? 'Net Take-Home = Gross CTC/12 - (EPF + PT + TDS)'
              : mode === 'hra'
              ? 'Exempt HRA = Min(Actual HRA, Rent - 10% Basic, 50% Basic)'
              : 'GST = (Base × Rate)/100 | CGST = SGST = GST / 2'
          }
          howItWorks={[
            '1. Under revised Budget 2024 Section 115BAC, standard deduction is ₹75,000 for salaried individuals.',
            '2. Section 87A tax rebate effectively makes annual taxable income up to ₹7,00,000 completely tax-free.',
            '3. HRA exemption checks the minimum among Actual HRA, Rent - 10% Basic, and 50%/40% city cap.',
          ]}
          example={{
            input: 'Gross Income ₹12,00,000 under New Regime',
            calculation: 'Taxable = ₹12L - ₹75k = ₹11.25L | Slabs: 5% (₹20k) + 10% (₹30k) + 15% (₹18.75k) = ₹68,750 + 4% Cess',
            output: 'Total Tax = ₹71,500',
          }}
        />
      </ScrollView>

      {/* History Modal */}
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
  subSectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 8,
  },
  deductionSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  infoParagraph: {
    fontSize: 13,
    lineHeight: 20,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 6,
  },
  switchTextWrap: {
    flex: 1,
    marginRight: 10,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  switchSub: {
    fontSize: 12,
    marginTop: 2,
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
  regimeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
    gap: 10,
  },
  bannerEmoji: {
    fontSize: 22,
  },
  bannerHeading: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  bannerSub: {
    fontSize: 12,
    lineHeight: 16,
  },
  regimeCardsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  regimeCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
  },
  regimeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  regimeCardTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  miniBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  miniBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  regimeTaxValue: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  regimeRateSub: {
    fontSize: 11,
    marginTop: 2,
  },
  regimeMetricDivider: {
    height: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
    marginVertical: 8,
  },
  regimeMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  regimeMetricLabel: {
    fontSize: 11,
  },
  regimeMetricVal: {
    fontSize: 11,
    fontWeight: '700',
  },
  detailsDivider: {
    height: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
    marginVertical: 10,
  },
  flex1: {
    flex: 1,
  },
});
