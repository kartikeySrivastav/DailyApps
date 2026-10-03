import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import { ScreenContainer, Card } from '@dailyapps/ui';
import { useTheme } from '@dailyapps/theme';
import { CalculatorHeader } from '../components/CalculatorHeader';
import { SegmentedTabs } from '../components/SegmentedTabs';
import { FormulaTabs } from '../components/FormulaTabs';
import { useCalculationHistory } from '../hooks';

interface AdvancedMathCalculatorScreenProps {
  navigation: any;
  route?: any;
}

type AdvancedMathMode = 'quadratic' | 'logarithm' | 'root' | 'power';

interface HistoryEntry {
  id: string;
  mode: AdvancedMathMode;
  timestamp: Date;
  input: string;
  result: string;
}

export const AdvancedMathCalculatorScreen: React.FC<AdvancedMathCalculatorScreenProps> = ({
  navigation,
  route,
}) => {
  const theme = useTheme();
  const tool = route?.params?.tool;
  const { saveCalculation } = useCalculationHistory(tool?.id || 'advanced_math', '🧮 Math');

  // Determine initial mode based on opened tool id
  const getInitialMode = (): AdvancedMathMode => {
    const id = tool?.id || route?.params?.defaultMode || 'quadratic';
    if (id === 'logarithm') return 'logarithm';
    if (id === 'root') return 'root';
    if (id === 'power') return 'power';
    return 'quadratic';
  };

  const [mode, setMode] = useState<AdvancedMathMode>(getInitialMode);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    setMode(getInitialMode());
  }, [tool?.id, route?.params?.defaultMode]);

  // Helper to add history
  const addToHistory = (input: string, result: string) => {
    if (!input || !result) return;
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      mode,
      timestamp: new Date(),
      input,
      result,
    };
    saveCalculation({
      toolId: tool?.id || mode,
      toolName:
        mode === 'quadratic'
          ? 'Quadratic Equation'
          : mode === 'logarithm'
          ? 'Logarithm Calculator'
          : mode === 'root'
          ? 'Root Calculator'
          : 'Power Calculator',
      category: '🧮 Math',
      title: input,
      subtitle: result,
      result,
      badge: mode.toUpperCase(),
      inputs: { mode, input, result },
    });
    setHistory((prev) => {
      if (prev.length > 0 && prev[0].input === input && prev[0].result === result) {
        return prev;
      }
      return [entry, ...prev.slice(0, 19)];
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    setShowHistoryModal(false);
  };

  // 1. State for Quadratic Equation (ax² + bx + c = 0)
  const [quadA, setQuadA] = useState('1');
  const [quadB, setQuadB] = useState('-5');
  const [quadC, setQuadC] = useState('6');

  // 2. State for Logarithm Calculator
  const [logValue, setLogValue] = useState('100');
  const [logBase, setLogBase] = useState('10');

  // 3. State for Root Calculator
  const [rootValue, setRootValue] = useState('64');
  const [rootN, setRootN] = useState('3');

  // 4. State for Power Calculator
  const [powerBase, setPowerBase] = useState('2');
  const [powerExponent, setPowerExponent] = useState('8');

  // Calculation 1: Quadratic Equation Solver
  const quadraticResults = useMemo(() => {
    const a = parseFloat(quadA) || 1;
    const b = parseFloat(quadB) || 0;
    const c = parseFloat(quadC) || 0;

    const discriminant = b * b - 4 * a * c;

    let root1: string;
    let root2: string;
    let nature: string;

    if (discriminant > 0) {
      const sqrtD = Math.sqrt(discriminant);
      const r1 = (-b + sqrtD) / (2 * a);
      const r2 = (-b - sqrtD) / (2 * a);
      root1 = r1.toFixed(4).replace(/\.?0+$/, '');
      root2 = r2.toFixed(4).replace(/\.?0+$/, '');
      nature = 'Two distinct real roots';
    } else if (discriminant === 0) {
      const r = -b / (2 * a);
      root1 = r.toFixed(4).replace(/\.?0+$/, '');
      root2 = root1;
      nature = 'One repeated real root';
    } else {
      const realPart = -b / (2 * a);
      const imagPart = Math.sqrt(-discriminant) / (2 * a);
      root1 = `${realPart.toFixed(2)} + ${imagPart.toFixed(2)}i`;
      root2 = `${realPart.toFixed(2)} - ${imagPart.toFixed(2)}i`;
      nature = 'Two complex conjugate roots';
    }

    return { discriminant, root1, root2, nature };
  }, [quadA, quadB, quadC]);

  // Calculation 2: Logarithm Calculator
  const logarithmResults = useMemo(() => {
    const value = parseFloat(logValue) || 1;
    const base = parseFloat(logBase) || 10;

    if (value <= 0 || base <= 0 || base === 1) {
      return { result: 'Invalid', log10: 'N/A', ln: 'N/A' };
    }

    const result = Math.log(value) / Math.log(base);
    const log10 = Math.log10(value);
    const ln = Math.log(value);

    return {
      result: result.toFixed(6).replace(/\.?0+$/, ''),
      log10: log10.toFixed(6).replace(/\.?0+$/, ''),
      ln: ln.toFixed(6).replace(/\.?0+$/, ''),
    };
  }, [logValue, logBase]);

  // Calculation 3: Root Calculator
  const rootResults = useMemo(() => {
    const value = parseFloat(rootValue) || 0;
    const n = parseInt(rootN, 10) || 2;

    if (n === 0) {
      return { result: 'Invalid (n = 0)', sqrt: 'N/A', cbrt: 'N/A' };
    }

    if (value < 0 && n % 2 === 0) {
      return { result: 'Complex (negative even root)', sqrt: 'N/A', cbrt: 'N/A' };
    }

    const result = Math.sign(value) * Math.pow(Math.abs(value), 1 / n);
    const sqrt = Math.sqrt(Math.abs(value));
    const cbrt = Math.cbrt(value);

    return {
      result: result.toFixed(6).replace(/\.?0+$/, ''),
      sqrt: sqrt.toFixed(6).replace(/\.?0+$/, ''),
      cbrt: cbrt.toFixed(6).replace(/\.?0+$/, ''),
    };
  }, [rootValue, rootN]);

  // Calculation 4: Power Calculator
  const powerResults = useMemo(() => {
    const base = parseFloat(powerBase) || 0;
    const exponent = parseFloat(powerExponent) || 0;

    const result = Math.pow(base, exponent);
    const inverse = exponent !== 0 ? Math.pow(base, -exponent) : Infinity;

    return {
      result: Number.isFinite(result) ? result.toFixed(6).replace(/\.?0+$/, '') : 'Infinity',
      inverse: Number.isFinite(inverse) ? inverse.toFixed(6).replace(/\.?0+$/, '') : 'Infinity',
      squared: Math.pow(base, 2).toFixed(2),
      cubed: Math.pow(base, 3).toFixed(2),
    };
  }, [powerBase, powerExponent]);

  // Log calculation to history with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mode === 'quadratic' && quadA) {
        addToHistory(
          `${quadA}x² + (${quadB})x + (${quadC}) = 0`,
          `x₁ = ${quadraticResults.root1}, x₂ = ${quadraticResults.root2} (${quadraticResults.nature})`
        );
      } else if (mode === 'logarithm' && logValue && logBase) {
        addToHistory(
          `log_${logBase}(${logValue})`,
          `log = ${logarithmResults.result}, ln = ${logarithmResults.ln}`
        );
      } else if (mode === 'root' && rootValue && rootN) {
        addToHistory(
          `ⁿ√${rootValue} (n=${rootN})`,
          `Result = ${rootResults.result}`
        );
      } else if (mode === 'power' && powerBase && powerExponent) {
        addToHistory(
          `${powerBase}^${powerExponent}`,
          `Result = ${powerResults.result}`
        );
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [mode, quadA, quadB, quadC, logValue, logBase, rootValue, rootN, powerBase, powerExponent]);

  const handleSelectHistoryItem = (item: HistoryEntry) => {
    setMode(item.mode);
    setShowHistoryModal(false);
  };

  return (
    <ScreenContainer safeArea withPadding={false}>
      <CalculatorHeader
        title={
          mode === 'quadratic'
            ? 'Quadratic Equation Solver'
            : mode === 'logarithm'
            ? 'Logarithm Calculator'
            : mode === 'root'
            ? 'Root Calculator'
            : 'Power Calculator'
        }
        subtitle={
          mode === 'quadratic'
            ? 'Solve ax² + bx + c = 0 for roots'
            : mode === 'logarithm'
            ? 'Log base n and natural logarithm'
            : mode === 'root'
            ? 'Square root, cube root & nth root'
            : 'Exponentiation (base^exponent)'
        }
        icon={
          mode === 'quadratic' ? '📉' : mode === 'logarithm' ? '📈' : mode === 'root' ? '√' : '⚡'
        }
        category="🧮 Math"
        toolId={tool?.id || 'quadratic'}
        onBack={() => navigation.goBack()}
        onHistory={() => setShowHistoryModal(true)}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Navigation Mode Tabs */}
        <SegmentedTabs
          activeTab={mode}
          onTabChange={(k) => setMode(k as AdvancedMathMode)}
          scrollable
          tabs={[
            { key: 'quadratic', label: 'Quadratic', icon: '📉' },
            { key: 'logarithm', label: 'Logarithm', icon: '📈' },
            { key: 'root', label: 'Root', icon: '√' },
            { key: 'power', label: 'Power', icon: '⚡' },
          ]}
        />

        {/* ============================================================ */}
        {/* TAB 1: QUADRATIC EQUATION SOLVER */}
        {/* ============================================================ */}
        {mode === 'quadratic' && (
          <>
            <Card
              style={[
                styles.card,
                { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle },
              ]}
            >
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                Enter Coefficients (ax² + bx + c = 0)
              </Text>

              <View style={styles.inputsRow}>
                <View style={styles.inputFlex}>
                  <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>a (x²)</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: theme.colors.surfaceSubtle,
                        borderColor: theme.colors.borderSubtle,
                        color: theme.colors.text,
                      },
                    ]}
                    value={quadA}
                    onChangeText={setQuadA}
                    keyboardType="numeric"
                    placeholder="1"
                    placeholderTextColor={theme.colors.textMuted}
                  />
                </View>

                <View style={styles.inputFlex}>
                  <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>b (x)</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: theme.colors.surfaceSubtle,
                        borderColor: theme.colors.borderSubtle,
                        color: theme.colors.text,
                      },
                    ]}
                    value={quadB}
                    onChangeText={setQuadB}
                    keyboardType="numeric"
                    placeholder="-5"
                    placeholderTextColor={theme.colors.textMuted}
                  />
                </View>

                <View style={styles.inputFlex}>
                  <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>c (constant)</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: theme.colors.surfaceSubtle,
                        borderColor: theme.colors.borderSubtle,
                        color: theme.colors.text,
                      },
                    ]}
                    value={quadC}
                    onChangeText={setQuadC}
                    keyboardType="numeric"
                    placeholder="6"
                    placeholderTextColor={theme.colors.textMuted}
                  />
                </View>
              </View>
            </Card>

            <Card
              style={[
                styles.resultCard,
                {
                  backgroundColor: theme.isDark ? '#0D1526' : '#EFF6FF',
                  borderColor: theme.isDark ? 'rgba(59, 130, 246, 0.4)' : '#93C5FD',
                },
              ]}
            >
              <Text style={[styles.resultHeader, { color: theme.colors.text }]}>Solutions</Text>

              <View style={styles.singleMetric}>
                <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>
                  Nature of Roots
                </Text>
                <Text style={[styles.metricValueSmall, { color: theme.colors.text }]}>
                  {quadraticResults.nature}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.metricGrid}>
                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>Root 1 (x₁)</Text>
                  <Text style={[styles.metricValueLarge, { color: '#2563EB' }]}>
                    {quadraticResults.root1}
                  </Text>
                </View>

                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>Root 2 (x₂)</Text>
                  <Text style={[styles.metricValueLarge, { color: '#10B981' }]}>
                    {quadraticResults.root2}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.singleMetric}>
                <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>
                  Discriminant (Δ = b² - 4ac)
                </Text>
                <Text style={[styles.metricValueSmall, { color: theme.colors.text }]}>
                  {quadraticResults.discriminant.toFixed(2)}
                </Text>
              </View>
            </Card>

            <FormulaTabs
              formula="x = [-b ± √(b² - 4ac)] / (2a)"
              formulaLabel="QUADRATIC FORMULA"
              howItWorks={[
                '1. Calculate the discriminant: Δ = b² - 4ac',
                '2. If Δ > 0: Two distinct real roots',
                '3. If Δ = 0: One repeated real root (both roots are equal)',
                '4. If Δ < 0: Two complex conjugate roots (a ± bi)',
                '5. Apply the quadratic formula to find x₁ and x₂',
              ]}
              example={{
                input: 'x² - 5x + 6 = 0  (a=1, b=-5, c=6)',
                calculation:
                  'Δ = (-5)² - 4(1)(6) = 25 - 24 = 1\nx = [5 ± √1] / 2\nx₁ = (5 + 1)/2 = 3\nx₂ = (5 - 1)/2 = 2',
                output: 'Roots: x₁ = 3, x₂ = 2',
              }}
            />
          </>
        )}

        {/* ============================================================ */}
        {/* TAB 2: LOGARITHM CALCULATOR */}
        {/* ============================================================ */}
        {mode === 'logarithm' && (
          <>
            <Card
              style={[
                styles.card,
                { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle },
              ]}
            >
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                Calculate Logarithm
              </Text>

              <View style={styles.inputsRow}>
                <View style={styles.inputFlex}>
                  <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>Value (x)</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: theme.colors.surfaceSubtle,
                        borderColor: theme.colors.borderSubtle,
                        color: theme.colors.text,
                      },
                    ]}
                    value={logValue}
                    onChangeText={setLogValue}
                    keyboardType="numeric"
                    placeholder="100"
                    placeholderTextColor={theme.colors.textMuted}
                  />
                </View>

                <View style={styles.inputFlex}>
                  <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>Base (b)</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: theme.colors.surfaceSubtle,
                        borderColor: theme.colors.borderSubtle,
                        color: theme.colors.text,
                      },
                    ]}
                    value={logBase}
                    onChangeText={setLogBase}
                    keyboardType="numeric"
                    placeholder="10"
                    placeholderTextColor={theme.colors.textMuted}
                  />
                </View>
              </View>
            </Card>

            <Card
              style={[
                styles.resultCard,
                {
                  backgroundColor: theme.isDark ? '#0D1526' : '#EFF6FF',
                  borderColor: theme.isDark ? 'rgba(59, 130, 246, 0.4)' : '#93C5FD',
                },
              ]}
            >
              <Text style={[styles.resultHeader, { color: theme.colors.text }]}>Logarithm Results</Text>

              <View style={styles.singleMetric}>
                <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>
                  log_({logBase}) {logValue}
                </Text>
                <Text style={[styles.metricValueLarge, { color: '#2563EB' }]}>
                  {logarithmResults.result}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.metricGrid}>
                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>
                    log₁₀ (Common)
                  </Text>
                  <Text style={[styles.metricValueLarge, { color: '#10B981' }]}>
                    {logarithmResults.log10}
                  </Text>
                </View>

                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>ln (Natural)</Text>
                  <Text style={[styles.metricValueLarge, { color: '#8B5CF6' }]}>
                    {logarithmResults.ln}
                  </Text>
                </View>
              </View>
            </Card>

            <FormulaTabs
              formula="log_b(x) = ln(x) / ln(b)   |   log₁₀(x) = log(x)   |   ln(x) = log_e(x)"
              formulaLabel="LOGARITHM PROPERTIES"
              howItWorks={[
                '1. Logarithm is the inverse operation of exponentiation: if b^y = x, then log_b(x) = y',
                '2. Common logarithm (log): Base 10, used in science and engineering',
                '3. Natural logarithm (ln): Base e (≈ 2.718), used in mathematics and calculus',
                '4. Change of base formula: log_b(x) = log_c(x) / log_c(b) for any valid base c',
              ]}
              example={{
                input: 'log₁₀(100)',
                calculation: '10^? = 100\n10² = 100\nTherefore, log₁₀(100) = 2',
                output: 'Result: 2',
              }}
            />
          </>
        )}

        {/* ============================================================ */}
        {/* TAB 3: ROOT CALCULATOR */}
        {/* ============================================================ */}
        {mode === 'root' && (
          <>
            <Card
              style={[
                styles.card,
                { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle },
              ]}
            >
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Calculate Root</Text>

              <View style={styles.inputsRow}>
                <View style={styles.inputFlex}>
                  <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>Value</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: theme.colors.surfaceSubtle,
                        borderColor: theme.colors.borderSubtle,
                        color: theme.colors.text,
                      },
                    ]}
                    value={rootValue}
                    onChangeText={setRootValue}
                    keyboardType="numeric"
                    placeholder="64"
                    placeholderTextColor={theme.colors.textMuted}
                  />
                </View>

                <View style={styles.inputFlex}>
                  <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>Root (n)</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: theme.colors.surfaceSubtle,
                        borderColor: theme.colors.borderSubtle,
                        color: theme.colors.text,
                      },
                    ]}
                    value={rootN}
                    onChangeText={setRootN}
                    keyboardType="numeric"
                    placeholder="3"
                    placeholderTextColor={theme.colors.textMuted}
                  />
                </View>
              </View>
            </Card>

            <Card
              style={[
                styles.resultCard,
                {
                  backgroundColor: theme.isDark ? '#0D1526' : '#EFF6FF',
                  borderColor: theme.isDark ? 'rgba(59, 130, 246, 0.4)' : '#93C5FD',
                },
              ]}
            >
              <Text style={[styles.resultHeader, { color: theme.colors.text }]}>Root Results</Text>

              <View style={styles.singleMetric}>
                <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>
                  {rootN}√{rootValue}
                </Text>
                <Text style={[styles.metricValueLarge, { color: '#2563EB' }]}>
                  {rootResults.result}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.metricGrid}>
                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>
                    Square Root (√)
                  </Text>
                  <Text style={[styles.metricValueLarge, { color: '#10B981' }]}>
                    {rootResults.sqrt}
                  </Text>
                </View>

                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>Cube Root (∛)</Text>
                  <Text style={[styles.metricValueLarge, { color: '#8B5CF6' }]}>
                    {rootResults.cbrt}
                  </Text>
                </View>
              </View>
            </Card>

            <FormulaTabs
              formula="ⁿ√x = x^(1/n)   |   √x = x^(1/2)   |   ∛x = x^(1/3)"
              formulaLabel="ROOT CALCULATION"
              howItWorks={[
                '1. The nth root of x is the number that, when raised to the power n, equals x',
                '2. Square root (n=2): √x means x^(1/2)',
                '3. Cube root (n=3): ∛x means x^(1/3)',
                '4. Even roots of negative numbers result in complex numbers',
                '5. Odd roots of negative numbers are real and negative',
              ]}
              example={{
                input: 'Cube root of 64',
                calculation: '∛64 = 64^(1/3)\nWhat number cubed equals 64?\n4³ = 4 × 4 × 4 = 64',
                output: 'Result: 4',
              }}
            />
          </>
        )}

        {/* ============================================================ */}
        {/* TAB 4: POWER CALCULATOR */}
        {/* ============================================================ */}
        {mode === 'power' && (
          <>
            <Card
              style={[
                styles.card,
                { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle },
              ]}
            >
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                Calculate Power (base^exponent)
              </Text>

              <View style={styles.inputsRow}>
                <View style={styles.inputFlex}>
                  <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>Base</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: theme.colors.surfaceSubtle,
                        borderColor: theme.colors.borderSubtle,
                        color: theme.colors.text,
                      },
                    ]}
                    value={powerBase}
                    onChangeText={setPowerBase}
                    keyboardType="numeric"
                    placeholder="2"
                    placeholderTextColor={theme.colors.textMuted}
                  />
                </View>

                <View style={styles.inputFlex}>
                  <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>Exponent</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: theme.colors.surfaceSubtle,
                        borderColor: theme.colors.borderSubtle,
                        color: theme.colors.text,
                      },
                    ]}
                    value={powerExponent}
                    onChangeText={setPowerExponent}
                    keyboardType="numeric"
                    placeholder="8"
                    placeholderTextColor={theme.colors.textMuted}
                  />
                </View>
              </View>
            </Card>

            <Card
              style={[
                styles.resultCard,
                {
                  backgroundColor: theme.isDark ? '#0D1526' : '#EFF6FF',
                  borderColor: theme.isDark ? 'rgba(59, 130, 246, 0.4)' : '#93C5FD',
                },
              ]}
            >
              <Text style={[styles.resultHeader, { color: theme.colors.text }]}>Power Results</Text>

              <View style={styles.singleMetric}>
                <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>
                  {powerBase}^{powerExponent}
                </Text>
                <Text style={[styles.metricValueLarge, { color: '#2563EB' }]}>
                  {powerResults.result}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.metricGrid}>
                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>
                    Squared ({powerBase}²)
                  </Text>
                  <Text style={[styles.metricValueSmall, { color: theme.colors.text }]}>
                    {powerResults.squared}
                  </Text>
                </View>

                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>
                    Cubed ({powerBase}³)
                  </Text>
                  <Text style={[styles.metricValueSmall, { color: theme.colors.text }]}>
                    {powerResults.cubed}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.singleMetric}>
                <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>
                  Inverse ({powerBase}^-{powerExponent})
                </Text>
                <Text style={[styles.metricValueSmall, { color: theme.colors.text }]}>
                  {powerResults.inverse}
                </Text>
              </View>
            </Card>

            <FormulaTabs
              formula="base^exponent = base × base × ... (exponent times)"
              formulaLabel="EXPONENTIATION"
              howItWorks={[
                '1. Positive exponent: Multiply base by itself exponent times',
                '2. Negative exponent: base^(-n) = 1 / base^n (reciprocal)',
                '3. Zero exponent: Any base^0 = 1 (except 0^0 which is undefined)',
                '4. Fractional exponent: base^(1/n) = nth root of base',
                '5. Product rule: base^a × base^b = base^(a+b)',
              ]}
              example={{
                input: '2^8',
                calculation: '2^8 = 2 × 2 × 2 × 2 × 2 × 2 × 2 × 2\n= 4 × 4 × 4 × 4\n= 16 × 16\n= 256',
                output: 'Result: 256',
              }}
            />
          </>
        )}
      </ScrollView>

      {/* Slide-Up Calculation History Modal */}
      <Modal
        visible={showHistoryModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowHistoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.historyModalContent,
              {
                backgroundColor: theme.colors.surfaceCard,
                borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : theme.colors.borderSubtle,
              },
            ]}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleWrap}>
                <Text style={styles.modalIcon}>🕒</Text>
                <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                  Calculation History
                </Text>
              </View>
              <View style={styles.modalActions}>
                {history.length > 0 && (
                  <TouchableOpacity
                    onPress={handleClearHistory}
                    activeOpacity={0.7}
                    style={[
                      styles.clearHistoryBtn,
                      {
                        backgroundColor: theme.isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2',
                        borderColor: theme.isDark ? 'rgba(239, 68, 68, 0.3)' : '#FCA5A5',
                      },
                    ]}
                  >
                    <Text style={styles.clearHistoryBtnText}>Clear All</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => setShowHistoryModal(false)}
                  activeOpacity={0.7}
                  style={[styles.closeModalBtn, { backgroundColor: theme.colors.surfaceSubtle }]}
                >
                  <Text style={[styles.closeModalText, { color: theme.colors.text }]}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* List */}
            <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
              {history.length === 0 ? (
                <View style={styles.emptyHistoryWrap}>
                  <Text style={styles.emptyHistoryEmoji}>📈</Text>
                  <Text style={[styles.emptyHistoryTitle, { color: theme.colors.text }]}>
                    No calculations yet
                  </Text>
                  <Text style={[styles.emptyHistoryDesc, { color: theme.colors.textMuted }]}>
                    Your past equation solves, logarithms, roots, and powers will appear here.
                  </Text>
                </View>
              ) : (
                history.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.7}
                    onPress={() => handleSelectHistoryItem(item)}
                    style={[
                      styles.historyItemCard,
                      {
                        backgroundColor: theme.colors.surfaceSubtle,
                        borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.06)' : theme.colors.borderSubtle,
                      },
                    ]}
                  >
                    <View style={styles.historyItemLeft}>
                      <View style={styles.historyItemTag}>
                        <Text style={styles.historyItemTagText}>
                          {item.mode.toUpperCase()}
                        </Text>
                      </View>
                      <Text style={[styles.historyItemInput, { color: theme.colors.text }]}>
                        {item.input}
                      </Text>
                      <Text style={[styles.historyItemResult, { color: '#2563EB' }]}>
                        {item.result}
                      </Text>
                    </View>
                    <Text style={[styles.historyTapHint, { color: theme.colors.primary }]}>
                      Tap to use ›
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 16,
  },
  card: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  inputsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputFlex: {
    flex: 1,
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  textInput: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '700',
  },
  resultCard: {
    padding: 18,
    borderRadius: 18,
    borderWidth: 1.5,
    gap: 14,
  },
  resultHeader: {
    fontSize: 14.5,
    fontWeight: '800',
  },
  metricGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  metricItem: {
    flex: 1,
    gap: 4,
  },
  singleMetric: {
    gap: 4,
  },
  metricLabel: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  metricValueLarge: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  metricValueSmall: {
    fontSize: 15,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  historyModalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1.5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 32,
    maxHeight: '68%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalIcon: {
    fontSize: 20,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  modalActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  clearHistoryBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  clearHistoryBtnText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
  },
  closeModalBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeModalText: {
    fontSize: 15,
    fontWeight: '700',
  },
  historyList: {
    maxHeight: 380,
  },
  emptyHistoryWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    gap: 8,
  },
  emptyHistoryEmoji: {
    fontSize: 36,
    marginBottom: 4,
  },
  emptyHistoryTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyHistoryDesc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 260,
  },
  historyItemCard: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyItemLeft: {
    flex: 1,
    marginRight: 10,
    gap: 4,
  },
  historyItemTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  historyItemTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2563EB',
  },
  historyItemInput: {
    fontSize: 14,
    fontWeight: '700',
  },
  historyItemResult: {
    fontSize: 13,
    fontWeight: '600',
  },
  historyTapHint: {
    fontSize: 12,
    fontWeight: '700',
  },
});
