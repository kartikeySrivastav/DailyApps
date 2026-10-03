import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Modal,
  FlatList,
} from 'react-native';
import { ScreenContainer, Card } from '@dailyapps/ui';
import { useTheme } from '@dailyapps/theme';
import { CalculatorHeader } from '../components/CalculatorHeader';
import { SegmentedTabs } from '../components/SegmentedTabs';
import { FormulaTabs } from '../components/FormulaTabs';
import { useCalculationHistory } from '../hooks';

interface MathToolsCalculatorScreenProps {
  navigation: any;
  route?: any;
}

type MathToolMode = 'lcm_hcf' | 'random' | 'factorial' | 'prime' | 'average' | 'fraction' | 'ratio' | 'proportion' | 'probability';

interface HistoryEntry {
  id: string;
  mode: MathToolMode;
  timestamp: Date;
  input: string;
  result: string;
}

export const MathToolsCalculatorScreen: React.FC<MathToolsCalculatorScreenProps> = ({
  navigation,
  route,
}) => {
  const theme = useTheme();
  const tool = route?.params?.tool;
  const { saveCalculation } = useCalculationHistory(tool?.id || 'math_tools', '🧮 Math');

  // Determine initial mode based on opened tool id or params
  const getInitialMode = (): MathToolMode => {
    const id = tool?.id || route?.params?.defaultMode || 'lcm';
    if (id === 'random_number') return 'random';
    if (id === 'factorial' || id === 'permutation_combination') return 'factorial';
    if (id === 'prime_number') return 'prime';
    if (id === 'average') return 'average';
    if (id === 'ratio') return 'ratio';
    if (id === 'proportion') return 'proportion';
    if (id === 'probability') return 'probability';
    if (id === 'fraction') return 'fraction';
    return 'lcm_hcf';
  };

  const [mode, setMode] = useState<MathToolMode>(getInitialMode);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setMode(getInitialMode());
  }, [tool?.id, route?.params?.defaultMode]);

  // 1. State for LCM & HCF
  const [lcmNum1, setLcmNum1] = useState('12');
  const [lcmNum2, setLcmNum2] = useState('18');
  const [lcmNum3, setLcmNum3] = useState('');

  // 2. State for Random Number Generator
  const [rngMin, setRngMin] = useState('1');
  const [rngMax, setRngMax] = useState('100');
  const [rngCount, setRngCount] = useState('3');
  const [rngUnique, setRngUnique] = useState(true);
  const [rngResults, setRngResults] = useState<number[]>([42, 17, 88]);

  // 3. State for Factorial & Permutations
  const [factN, setFactN] = useState('6');
  const [factR, setFactR] = useState('2');

  // 4. State for Prime Number & Factors
  const [primeInput, setPrimeInput] = useState('36');

  // 5. State for Average / Statistics
  const [avgInput, setAvgInput] = useState('12, 15, 20, 15, 28, 30');

  // 6. State for Fraction Calculator
  const [fracNum1, setFracNum1] = useState('1');
  const [fracDen1, setFracDen1] = useState('2');
  const [fracOp, setFracOp] = useState<'+' | '-' | '×' | '÷'>('+');
  const [fracNum2, setFracNum2] = useState('2');
  const [fracDen2, setFracDen2] = useState('3');

  // 7. State for Ratio Calculator
  const [ratioA, setRatioA] = useState('3');
  const [ratioB, setRatioB] = useState('4');
  const [ratioTotal, setRatioTotal] = useState('350');

  // 8. State for Proportion Calculator
  const [propA, setPropA] = useState('5');
  const [propB, setPropB] = useState('10');
  const [propC, setPropC] = useState('15');

  // 9. State for Probability Calculator
  const [probFavorable, setProbFavorable] = useState('1');
  const [probTotal, setProbTotal] = useState('6');

  // Helper function to add to history
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
        mode === 'lcm_hcf'
          ? 'LCM & HCF'
          : mode === 'random'
          ? 'Random Number'
          : mode === 'factorial'
          ? 'Factorial & Permutations'
          : mode === 'prime'
          ? 'Prime Number'
          : mode === 'average'
          ? 'Average & Stats'
          : mode === 'fraction'
          ? 'Fraction Solver'
          : mode === 'ratio'
          ? 'Ratio Calculator'
          : mode === 'proportion'
          ? 'Proportion Calculator'
          : 'Probability Calculator',
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

  // Helper function to clear history
  const clearHistory = () => {
    setHistory([]);
    setShowHistory(false);
  };

  // Helper gcd and lcm algorithms
  const gcd = (a: number, b: number): number => {
    let x = Math.abs(a);
    let y = Math.abs(b);
    while (y !== 0) {
      const t = y;
      y = x % y;
      x = t;
    }
    return x || 1;
  };

  const lcm = (a: number, b: number): number => {
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / gcd(a, b);
  };

  // Helper prime factors
  const getPrimeFactors = (n: number): { [key: number]: number } => {
    let num = Math.abs(n);
    const factors: { [key: number]: number } = {};
    if (num <= 1) return factors;
    for (let d = 2; d * d <= num; d++) {
      while (num % d === 0) {
        factors[d] = (factors[d] || 0) + 1;
        num /= d;
      }
    }
    if (num > 1) {
      factors[num] = (factors[num] || 0) + 1;
    }
    return factors;
  };

  const formatPrimeFactors = (factors: { [key: number]: number }): string => {
    const keys = Object.keys(factors).map(Number);
    if (keys.length === 0) return 'None';
    return keys.map((k) => (factors[k] > 1 ? `${k}^${factors[k]}` : `${k}`)).join(' × ');
  };

  // Calculation 1: LCM & HCF Results
  const lcmHcfResults = useMemo(() => {
    const n1 = parseInt(lcmNum1, 10) || 0;
    const n2 = parseInt(lcmNum2, 10) || 0;
    const n3 = lcmNum3 ? parseInt(lcmNum3, 10) : null;

    if (n1 <= 0 || n2 <= 0) {
      return { hcfVal: 0, lcmVal: 0, productVal: 0, step1: '', step2: '', step3: '' };
    }

    let hcfVal = gcd(n1, n2);
    let lcmVal = lcm(n1, n2);
    let productVal = n1 * n2;

    if (n3 !== null && n3 > 0) {
      hcfVal = gcd(hcfVal, n3);
      lcmVal = lcm(lcmVal, n3);
      productVal *= n3;
    }

    const step1 = `${n1} = ${formatPrimeFactors(getPrimeFactors(n1))}`;
    const step2 = `${n2} = ${formatPrimeFactors(getPrimeFactors(n2))}`;
    const step3 = n3 ? `${n3} = ${formatPrimeFactors(getPrimeFactors(n3))}` : '';

    return { hcfVal, lcmVal, productVal, step1, step2, step3 };
  }, [lcmNum1, lcmNum2, lcmNum3]);

  // Calculation 2: Random Number Generation
  const handleGenerateRandom = () => {
    const min = parseInt(rngMin, 10) || 1;
    const max = parseInt(rngMax, 10) || 100;
    const count = Math.min(Math.max(parseInt(rngCount, 10) || 1, 1), 10);

    if (min >= max) {
      setRngResults([min]);
      return;
    }

    const results: number[] = [];
    const used = new Set<number>();
    const range = max - min + 1;

    for (let i = 0; i < count; i++) {
      if (rngUnique && range >= count) {
        let r: number;
        do {
          r = Math.floor(Math.random() * range) + min;
        } while (used.has(r));
        used.add(r);
        results.push(r);
      } else {
        results.push(Math.floor(Math.random() * range) + min);
      }
    }

    setRngResults(results);
    addToHistory(`Random (${min}..${max}) [count: ${count}]`, results.join(', '));
  };

  // Calculation 3: Factorial, nPr, nCr
  const factorialResults = useMemo(() => {
    const n = Math.min(Math.max(parseInt(factN, 10) || 0, 0), 20); // safe limit
    const r = Math.min(Math.max(parseInt(factR, 10) || 0, 0), n);

    const fact = (val: number): number => {
      let res = 1;
      for (let i = 2; i <= val; i++) res *= i;
      return res;
    };

    const nFact = fact(n);
    const nPr = fact(n) / fact(n - r);
    const nCr = nPr / fact(r);

    let expansion = `${n}! = `;
    if (n === 0 || n === 1) {
      expansion += '1';
    } else {
      const parts: number[] = [];
      for (let i = n; i >= 1; i--) parts.push(i);
      expansion += parts.slice(0, 6).join(' × ') + (n > 6 ? ' ... × 1' : '') + ` = ${nFact.toLocaleString()}`;
    }

    return { nFact, nPr, nCr, expansion };
  }, [factN, factR]);

  // Calculation 4: Prime Number & Divisors
  const primeResults = useMemo(() => {
    const n = Math.abs(parseInt(primeInput, 10) || 0);
    if (n === 0) return { isPrime: false, factors: [], divisors: [] };

    let isPrime = n > 1;
    for (let i = 2; i * i <= n; i++) {
      if (n % i === 0) {
        isPrime = false;
        break;
      }
    }

    // Divisors
    const divs: number[] = [];
    for (let i = 1; i * i <= n; i++) {
      if (n % i === 0) {
        divs.push(i);
        if (i * i !== n) divs.push(n / i);
      }
    }
    divs.sort((a, b) => a - b);

    const pFactors = formatPrimeFactors(getPrimeFactors(n));

    return { isPrime, primeFactorization: pFactors, divisors: divs };
  }, [primeInput]);

  // Calculation 5: Average (Mean, Median, Mode)
  const averageResults = useMemo(() => {
    const nums = avgInput
      .split(/[\s,]+/)
      .map(Number)
      .filter((n) => !isNaN(n));

    if (nums.length === 0) {
      return { mean: 0, median: 0, mode: 'None', min: 0, max: 0, sum: 0, count: 0 };
    }

    const count = nums.length;
    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / count;

    const sorted = [...nums].sort((a, b) => a - b);
    const mid = Math.floor(count / 2);
    const median = count % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

    // Mode
    const freq: { [key: number]: number } = {};
    let maxFreq = 0;
    nums.forEach((n) => {
      freq[n] = (freq[n] || 0) + 1;
      if (freq[n] > maxFreq) maxFreq = freq[n];
    });

    const modes = Object.keys(freq)
      .map(Number)
      .filter((k) => freq[k] === maxFreq && maxFreq > 1);

    const modeStr = modes.length > 0 ? modes.join(', ') : 'None (unique)';

    return {
      mean,
      median,
      mode: modeStr,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      sum,
      count,
    };
  }, [avgInput]);

  // Calculation 6: Fraction Solver
  const fractionResults = useMemo(() => {
    const a = parseInt(fracNum1, 10) || 0;
    const b = parseInt(fracDen1, 10) || 1;
    const c = parseInt(fracNum2, 10) || 0;
    const d = parseInt(fracDen2, 10) || 1;

    let resNum = 0;
    let resDen = 1;

    if (fracOp === '+') {
      resNum = a * d + c * b;
      resDen = b * d;
    } else if (fracOp === '-') {
      resNum = a * d - c * b;
      resDen = b * d;
    } else if (fracOp === '×') {
      resNum = a * c;
      resDen = b * d;
    } else if (fracOp === '÷') {
      resNum = a * d;
      resDen = b * c;
    }

    if (resDen === 0) {
      return { simple: 'Undefined (÷ 0)', decimal: 'N/A', mixed: 'N/A' };
    }

    const common = gcd(resNum, resDen);
    const simNum = resNum / common;
    const simDen = resDen / common;

    const simpleStr = simDen === 1 ? `${simNum}` : `${simNum} / ${simDen}`;
    const decimalStr = (resNum / resDen).toFixed(4).replace(/\.?0+$/, '');

    // Mixed number
    let mixedStr = 'N/A';
    if (Math.abs(simNum) >= simDen && simDen > 1) {
      const whole = Math.floor(Math.abs(simNum) / simDen) * (simNum < 0 ? -1 : 1);
      const rem = Math.abs(simNum) % simDen;
      mixedStr = rem !== 0 ? `${whole} (${rem}/${simDen})` : `${whole}`;
    }

    return { simple: simpleStr, decimal: decimalStr, mixed: mixedStr };
  }, [fracNum1, fracDen1, fracOp, fracNum2, fracDen2]);

  // Calculation 7: Ratio Calculator
  const ratioResults = useMemo(() => {
    const a = parseInt(ratioA, 10) || 0;
    const b = parseInt(ratioB, 10) || 0;
    const total = parseFloat(ratioTotal) || 0;

    if (a <= 0 || b <= 0 || total <= 0) {
      return { simplified: '0:0', shareA: 0, shareB: 0, gcdVal: 0 };
    }

    const gcdVal = gcd(a, b);
    const simpA = a / gcdVal;
    const simpB = b / gcdVal;
    const simplified = `${simpA}:${simpB}`;

    const sum = a + b;
    const shareA = (a / sum) * total;
    const shareB = (b / sum) * total;

    return { simplified, shareA, shareB, gcdVal };
  }, [ratioA, ratioB, ratioTotal]);

  // Calculation 8: Proportion Solver (A/B = C/X, solve for X)
  const proportionResults = useMemo(() => {
    const a = parseFloat(propA) || 0;
    const b = parseFloat(propB) || 0;
    const c = parseFloat(propC) || 0;

    if (b === 0) {
      return { x: 0, equation: 'Invalid (B = 0)' };
    }

    const x = (c * b) / a;
    const equation = `${a} / ${b} = ${c} / ${x.toFixed(2)}`;

    return { x, equation };
  }, [propA, propB, propC]);

  // Calculation 9: Probability Calculator
  const probabilityResults = useMemo(() => {
    const favorable = parseInt(probFavorable, 10) || 0;
    const total = parseInt(probTotal, 10) || 1;

    if (total <= 0 || favorable < 0 || favorable > total) {
      return { probability: 0, percentage: '0%', odds: '0:0' };
    }

    const prob = favorable / total;
    const percentage = `${(prob * 100).toFixed(2)}%`;
    const against = total - favorable;
    const odds = `${favorable}:${against}`;

    return { probability: prob, percentage, odds };
  }, [probFavorable, probTotal]);

  // Record calculations to history with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mode === 'lcm_hcf' && lcmHcfResults.lcmVal > 0) {
        addToHistory(
          `LCM/HCF (${lcmNum1}, ${lcmNum2}${lcmNum3 ? `, ${lcmNum3}` : ''})`,
          `LCM = ${lcmHcfResults.lcmVal}, HCF = ${lcmHcfResults.hcfVal}`
        );
      } else if (mode === 'factorial') {
        addToHistory(
          `${factN}! & P(${factN}, ${factR})`,
          `n! = ${factorialResults.nFact}, nPr = ${factorialResults.nPr}, nCr = ${factorialResults.nCr}`
        );
      } else if (mode === 'prime' && primeInput) {
        addToHistory(
          `Prime: ${primeInput}`,
          primeResults.isPrime ? `${primeInput} is Prime` : `${primeInput} is Composite`
        );
      } else if (mode === 'average' && avgInput) {
        addToHistory(
          `Average (${avgInput})`,
          `Mean = ${averageResults.mean.toFixed(2)}, Median = ${averageResults.median}, Mode = ${averageResults.mode}`
        );
      } else if (mode === 'fraction') {
        addToHistory(
          `${fracNum1}/${fracDen1} ${fracOp} ${fracNum2}/${fracDen2}`,
          `${fractionResults.simple} (${fractionResults.decimal})`
        );
      } else if (mode === 'ratio' && ratioTotal) {
        addToHistory(
          `${ratioA}:${ratioB} of ${ratioTotal}`,
          `Part A = ${ratioResults.shareA.toFixed(2)}, Part B = ${ratioResults.shareB.toFixed(2)}`
        );
      } else if (mode === 'proportion') {
        addToHistory(
          `${propA}/${propB} = ${propC}/x`,
          `x = ${proportionResults.x.toFixed(2)}`
        );
      } else if (mode === 'probability') {
        addToHistory(
          `${probFavorable} / ${probTotal}`,
          `${probabilityResults.percentage} (${probabilityResults.odds})`
        );
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [
    mode,
    lcmNum1,
    lcmNum2,
    lcmNum3,
    lcmHcfResults,
    factN,
    factR,
    factorialResults,
    primeInput,
    primeResults,
    avgInput,
    averageResults,
    fracNum1,
    fracDen1,
    fracOp,
    fracNum2,
    fracDen2,
    fractionResults,
    ratioA,
    ratioB,
    ratioTotal,
    ratioResults,
    propA,
    propB,
    propC,
    proportionResults,
    probFavorable,
    probTotal,
    probabilityResults,
  ]);

  return (
    <ScreenContainer safeArea withPadding={false}>
      {/* 1. Standard Top Calculator Header */}
      <CalculatorHeader
        title={
          mode === 'lcm_hcf'
            ? 'LCM & HCF Calculator'
            : mode === 'random'
            ? 'Random Number Generator'
            : mode === 'factorial'
            ? 'Factorial & Permutations'
            : mode === 'prime'
            ? 'Prime Number & Factors'
            : mode === 'average'
            ? 'Average & Statistics'
            : mode === 'ratio'
            ? 'Ratio Calculator'
            : mode === 'proportion'
            ? 'Proportion Calculator'
            : mode === 'probability'
            ? 'Probability Calculator'
            : 'Fraction Calculator'
        }
        subtitle={
          mode === 'lcm_hcf'
            ? 'Least common multiple & highest common factor'
            : mode === 'random'
            ? 'Fair randomized lucky number draw'
            : mode === 'factorial'
            ? 'n!, arrangements (nPr) & combinations (nCr)'
            : mode === 'prime'
            ? 'Prime factor tree & divisor finder'
            : mode === 'average'
            ? 'Mean, median, mode, range & sum'
            : mode === 'ratio'
            ? 'Simplify ratios & divide proportionally'
            : mode === 'proportion'
            ? 'Solve for X in proportion equations'
            : mode === 'probability'
            ? 'Calculate likelihood of events'
            : 'Simplify, add, multiply & divide fractions'
        }
        icon={
          mode === 'lcm_hcf'
            ? '🔢'
            : mode === 'random'
            ? '🎰'
            : mode === 'factorial'
            ? '❗'
            : mode === 'prime'
            ? '⭐'
            : mode === 'average'
            ? '📊'
            : mode === 'ratio'
            ? '⚖️'
            : mode === 'proportion'
            ? '✖️'
            : mode === 'probability'
            ? '🎲'
            : '½'
        }
        category="🧮 Math"
        toolId={tool?.id || 'lcm'}
        onBack={() => navigation.goBack()}
        onHistory={() => setShowHistory(true)}
      />

      {/* 2. Scrollable Body with generous top padding so input NEVER touches header */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Navigation Mode Tabs */}
        <SegmentedTabs
          activeTab={mode}
          onTabChange={(k) => setMode(k as MathToolMode)}
          scrollable
          tabs={[
            { key: 'lcm_hcf', label: 'LCM / HCF', icon: '🔢' },
            { key: 'random', label: 'Random', icon: '🎰' },
            { key: 'factorial', label: 'Factorial', icon: '❗' },
            { key: 'prime', label: 'Prime', icon: '⭐' },
            { key: 'average', label: 'Average', icon: '📊' },
            { key: 'fraction', label: 'Fraction', icon: '½' },
            { key: 'ratio', label: 'Ratio', icon: '⚖️' },
            { key: 'proportion', label: 'Proportion', icon: '✖️' },
            { key: 'probability', label: 'Probability', icon: '🎲' },
          ]}
        />

        {/* ============================================================ */}
        {/* TAB 1: LCM & HCF CALCULATOR */}
        {/* ============================================================ */}
        {mode === 'lcm_hcf' && (
          <>
            <Card
              style={[
                styles.card,
                { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle },
              ]}
            >
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                Enter Numbers for LCM & HCF
              </Text>

              <View style={styles.inputsRow}>
                <View style={styles.inputFlex}>
                  <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>First Number</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: theme.colors.surfaceSubtle,
                        borderColor: theme.colors.borderSubtle,
                        color: theme.colors.text,
                      },
                    ]}
                    value={lcmNum1}
                    onChangeText={setLcmNum1}
                    keyboardType="numeric"
                    placeholder="e.g. 12"
                    placeholderTextColor={theme.colors.textMuted}
                  />
                </View>

                <View style={styles.inputFlex}>
                  <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>Second Number</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: theme.colors.surfaceSubtle,
                        borderColor: theme.colors.borderSubtle,
                        color: theme.colors.text,
                      },
                    ]}
                    value={lcmNum2}
                    onChangeText={setLcmNum2}
                    keyboardType="numeric"
                    placeholder="e.g. 18"
                    placeholderTextColor={theme.colors.textMuted}
                  />
                </View>
              </View>

              <View style={styles.singleInputWrap}>
                <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>
                  Third Number (Optional)
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: theme.colors.surfaceSubtle,
                      borderColor: theme.colors.borderSubtle,
                      color: theme.colors.text,
                    },
                  ]}
                  value={lcmNum3}
                  onChangeText={setLcmNum3}
                  keyboardType="numeric"
                  placeholder="Leave blank if only 2 numbers"
                  placeholderTextColor={theme.colors.textMuted}
                />
              </View>
            </Card>

            {/* Results Card */}
            <Card
              style={[
                styles.resultCard,
                {
                  backgroundColor: theme.isDark ? '#0D1526' : '#EFF6FF',
                  borderColor: theme.isDark ? 'rgba(59, 130, 246, 0.4)' : '#93C5FD',
                },
              ]}
            >
              <Text style={[styles.resultHeader, { color: theme.colors.text }]}>Calculation Results</Text>

              <View style={styles.metricGrid}>
                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>
                    LCM (Least Common Multiple)
                  </Text>
                  <Text style={[styles.metricValueLarge, { color: '#2563EB' }]}>
                    {lcmHcfResults.lcmVal.toLocaleString()}
                  </Text>
                </View>

                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>
                    HCF / GCD (Greatest Divisor)
                  </Text>
                  <Text style={[styles.metricValueLarge, { color: '#10B981' }]}>
                    {lcmHcfResults.hcfVal.toLocaleString()}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.stepsWrap}>
                <Text style={[styles.stepsTitle, { color: theme.colors.text }]}>Prime Factorization:</Text>
                <Text style={[styles.stepLine, { color: theme.colors.textMuted }]}>• {lcmHcfResults.step1}</Text>
                <Text style={[styles.stepLine, { color: theme.colors.textMuted }]}>• {lcmHcfResults.step2}</Text>
                {lcmHcfResults.step3 ? (
                  <Text style={[styles.stepLine, { color: theme.colors.textMuted }]}>• {lcmHcfResults.step3}</Text>
                ) : null}
              </View>
            </Card>

            <FormulaTabs
              formula="LCM(a, b) = (|a × b|) / HCF(a, b)"
              formulaLabel="LCM & HCF RELATIONSHIP"
              howItWorks={[
                '1. Find the prime factorization of each number.',
                '2. For HCF: Take the lowest power of each common prime factor.',
                '3. For LCM: Take the highest power of all prime factors appearing in either number.',
                '4. Alternatively, use the Euclidean algorithm to divide until remainder is zero.',
              ]}
              example={{
                input: 'Numbers: 12 and 18',
                calculation: '12 = 2² × 3,  18 = 2 × 3²\nHCF = 2¹ × 3¹ = 6\nLCM = 2² × 3² = 4 × 9 = 36',
                output: 'LCM = 36,  HCF = 6',
              }}
            />
          </>
        )}

        {/* ============================================================ */}
        {/* TAB 2: RANDOM NUMBER GENERATOR */}
        {/* ============================================================ */}
        {mode === 'random' && (
          <>
            <Card
              style={[
                styles.card,
                { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle },
              ]}
            >
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Configure Random Range</Text>

              <View style={styles.inputsRow}>
                <View style={styles.inputFlex}>
                  <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>Minimum (Min)</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: theme.colors.surfaceSubtle,
                        borderColor: theme.colors.borderSubtle,
                        color: theme.colors.text,
                      },
                    ]}
                    value={rngMin}
                    onChangeText={setRngMin}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputFlex}>
                  <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>Maximum (Max)</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: theme.colors.surfaceSubtle,
                        borderColor: theme.colors.borderSubtle,
                        color: theme.colors.text,
                      },
                    ]}
                    value={rngMax}
                    onChangeText={setRngMax}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputsRow}>
                <View style={styles.inputFlex}>
                  <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>
                    Quantity (1 - 10)
                  </Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: theme.colors.surfaceSubtle,
                        borderColor: theme.colors.borderSubtle,
                        color: theme.colors.text,
                      },
                    ]}
                    value={rngCount}
                    onChangeText={setRngCount}
                    keyboardType="numeric"
                  />
                </View>

                <View style={[styles.inputFlex, styles.switchAlign]}>
                  <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>No Duplicates</Text>
                  <Switch
                    value={rngUnique}
                    onValueChange={setRngUnique}
                    trackColor={{ false: '#CBD5E1', true: '#2563EB' }}
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={handleGenerateRandom}
                activeOpacity={0.8}
                style={styles.actionBtn}
              >
                <Text style={styles.actionBtnText}>🎲 Generate Random Number</Text>
              </TouchableOpacity>
            </Card>

            {/* Lucky Result Display */}
            <Card
              style={[
                styles.resultCard,
                {
                  backgroundColor: theme.isDark ? '#0D1526' : '#EFF6FF',
                  borderColor: theme.isDark ? 'rgba(59, 130, 246, 0.4)' : '#93C5FD',
                },
              ]}
            >
              <Text style={[styles.resultHeader, { color: theme.colors.text }]}>Generated Numbers</Text>

              <View style={styles.rngResultsGrid}>
                {rngResults.map((num, idx) => (
                  <View key={idx} style={[styles.rngBadge, { backgroundColor: '#2563EB' }]}>
                    <Text style={styles.rngBadgeText}>{num}</Text>
                  </View>
                ))}
              </View>

              <Text style={[styles.rngMetaText, { color: theme.colors.textMuted }]}>
                Range: {rngMin} to {rngMax} • Count: {rngResults.length} {rngUnique ? '• Unique' : ''}
              </Text>
            </Card>

            <FormulaTabs
              formula="Result = floor(random() × (Max - Min + 1)) + Min"
              formulaLabel="UNIFORM DISTRIBUTION FORMULA"
              howItWorks={[
                '1. Standard Math.random() produces a floating-point number in range [0, 1).',
                '2. Multiplying by (Max - Min + 1) scales the interval to cover all integers in the range.',
                '3. Math.floor() rounds down to the nearest integer.',
                '4. Adding Min shifts the lower bound from 0 to your custom starting number.',
              ]}
              example={{
                input: 'Range: 1 to 100, Count: 3',
                calculation: 'Generate 3 independent samples without replacement.',
                output: `Result: ${rngResults.join(', ')}`,
              }}
            />
          </>
        )}

        {/* ============================================================ */}
        {/* TAB 3: FACTORIAL & PERMUTATIONS */}
        {/* ============================================================ */}
        {mode === 'factorial' && (
          <>
            <Card
              style={[
                styles.card,
                { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle },
              ]}
            >
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                Enter n and r for Combinatorics
              </Text>

              <View style={styles.inputsRow}>
                <View style={styles.inputFlex}>
                  <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>
                    Total Items (n ≤ 20)
                  </Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: theme.colors.surfaceSubtle,
                        borderColor: theme.colors.borderSubtle,
                        color: theme.colors.text,
                      },
                    ]}
                    value={factN}
                    onChangeText={setFactN}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputFlex}>
                  <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>
                    Selected Items (r ≤ n)
                  </Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: theme.colors.surfaceSubtle,
                        borderColor: theme.colors.borderSubtle,
                        color: theme.colors.text,
                      },
                    ]}
                    value={factR}
                    onChangeText={setFactR}
                    keyboardType="numeric"
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
              <Text style={[styles.resultHeader, { color: theme.colors.text }]}>Combinatorics Values</Text>

              <View style={styles.metricGrid}>
                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>
                    Factorial ({factN}!)
                  </Text>
                  <Text style={[styles.metricValueLarge, { color: '#2563EB' }]}>
                    {factorialResults.nFact.toLocaleString()}
                  </Text>
                </View>

                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>
                    Permutation ({factN} P {factR})
                  </Text>
                  <Text style={[styles.metricValueLarge, { color: '#8B5CF6' }]}>
                    {factorialResults.nPr.toLocaleString()}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.singleMetric}>
                <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>
                  Combination ({factN} C {factR})
                </Text>
                <Text style={[styles.metricValueLarge, { color: '#10B981' }]}>
                  {factorialResults.nCr.toLocaleString()}
                </Text>
              </View>

              <View style={styles.stepsWrap}>
                <Text style={[styles.stepsTitle, { color: theme.colors.text }]}>Expansion:</Text>
                <Text style={[styles.stepLine, { color: theme.colors.textMuted }]}>
                  {factorialResults.expansion}
                </Text>
              </View>
            </Card>

            <FormulaTabs
              formula="nPr = n! / (n - r)!   |   nCr = n! / (r! × (n - r)!)"
              formulaLabel="FACTORIAL, PERMUTATION & COMBINATION"
              howItWorks={[
                '1. Factorial (n!): Product of all positive integers from 1 up to n.',
                '2. Permutation (nPr): Number of ways to choose and arrange r items from n distinct items where order matters.',
                '3. Combination (nCr): Number of ways to choose r items from n items where order does NOT matter.',
                '4. Note: 0! is mathematically defined as 1.',
              ]}
              example={{
                input: 'n = 5,  r = 2',
                calculation: '5! = 5 × 4 × 3 × 2 × 1 = 120\n5P2 = 5! / 3! = (120) / (6) = 20\n5C2 = 5P2 / 2! = (20) / (2) = 10',
                output: '5! = 120,  5P2 = 20,  5C2 = 10',
              }}
            />
          </>
        )}

        {/* ============================================================ */}
        {/* TAB 4: PRIME NUMBER & FACTORS */}
        {/* ============================================================ */}
        {mode === 'prime' && (
          <>
            <Card
              style={[
                styles.card,
                { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle },
              ]}
            >
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Check Prime & Factorize</Text>

              <View style={styles.singleInputWrap}>
                <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>Enter Integer</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: theme.colors.surfaceSubtle,
                      borderColor: theme.colors.borderSubtle,
                      color: theme.colors.text,
                    },
                  ]}
                  value={primeInput}
                  onChangeText={setPrimeInput}
                  keyboardType="numeric"
                  placeholder="e.g. 36"
                />
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
              <View style={styles.primeBannerRow}>
                <View
                  style={[
                    styles.primeStatusBadge,
                    { backgroundColor: primeResults.isPrime ? '#10B981' : '#F59E0B' },
                  ]}
                >
                  <Text style={styles.primeStatusText}>
                    {primeResults.isPrime ? '✓ PRIME NUMBER' : 'COMPOSITE NUMBER'}
                  </Text>
                </View>
              </View>

              <View style={styles.stepsWrap}>
                <Text style={[styles.stepsTitle, { color: theme.colors.text }]}>Prime Factorization:</Text>
                <Text style={[styles.stepLineHighlight, { color: '#2563EB' }]}>
                  {primeInput} = {primeResults.primeFactorization}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.stepsWrap}>
                <Text style={[styles.stepsTitle, { color: theme.colors.text }]}>
                  All Divisors ({primeResults.divisors.length}):
                </Text>
                <Text style={[styles.stepLine, { color: theme.colors.textMuted }]}>
                  {primeResults.divisors.join(', ')}
                </Text>
              </View>
            </Card>

            <FormulaTabs
              formula="N is Prime iff Divisors(N) = {1, N} and N > 1"
              formulaLabel="PRIME TEST ALGORITHM"
              howItWorks={[
                '1. If N <= 1, it is neither prime nor composite.',
                '2. 2 is the only even prime number.',
                '3. Test trial division up to sqrt(N). If no integer divides N evenly, N is prime.',
                '4. By the Fundamental Theorem of Arithmetic, every integer > 1 can be represented as a unique product of primes.',
              ]}
              example={{
                input: 'Number = 36',
                calculation: '36 ÷ 2 = 18\n18 ÷ 2 = 9\n9 ÷ 3 = 3\n3 ÷ 3 = 1',
                output: '36 = 2² × 3² (Composite, 9 divisors)',
              }}
            />
          </>
        )}

        {/* ============================================================ */}
        {/* TAB 5: AVERAGE & STATISTICS */}
        {/* ============================================================ */}
        {mode === 'average' && (
          <>
            <Card
              style={[
                styles.card,
                { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle },
              ]}
            >
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Enter Numbers Set</Text>

              <View style={styles.singleInputWrap}>
                <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>
                  Numbers (separated by commas or spaces)
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: theme.colors.surfaceSubtle,
                      borderColor: theme.colors.borderSubtle,
                      color: theme.colors.text,
                    },
                  ]}
                  value={avgInput}
                  onChangeText={setAvgInput}
                  placeholder="e.g. 10, 20, 30, 40"
                  multiline
                />
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
              <Text style={[styles.resultHeader, { color: theme.colors.text }]}>Statistical Summary</Text>

              <View style={styles.metricGrid}>
                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>Mean (Average)</Text>
                  <Text style={[styles.metricValueLarge, { color: '#2563EB' }]}>
                    {averageResults.mean.toFixed(2).replace(/\.00$/, '')}
                  </Text>
                </View>

                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>Median (Middle)</Text>
                  <Text style={[styles.metricValueLarge, { color: '#10B981' }]}>
                    {averageResults.median.toFixed(2).replace(/\.00$/, '')}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.metricGrid}>
                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>Mode (Frequent)</Text>
                  <Text style={[styles.metricValueSmall, { color: theme.colors.text }]}>
                    {averageResults.mode}
                  </Text>
                </View>

                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>
                    Range (Max - Min)
                  </Text>
                  <Text style={[styles.metricValueSmall, { color: theme.colors.text }]}>
                    {averageResults.max - averageResults.min} ({averageResults.min} to {averageResults.max})
                  </Text>
                </View>
              </View>
            </Card>

            <FormulaTabs
              formula="Mean = Σ(X) / N   |   Median = Middle(Sorted X)"
              formulaLabel="DESCRIPTIVE STATISTICS"
              howItWorks={[
                '1. Mean: Sum of all observations divided by the total number of items.',
                '2. Median: Middle value when items are arranged in ascending order.',
                '3. Mode: Value that appears with the highest frequency in the data set.',
                '4. Range: Difference between the highest (Max) and lowest (Min) observations.',
              ]}
              example={{
                input: 'Set: 10, 20, 20, 50',
                calculation: 'Sum = 100, Count = 4\nMean = 100 / 4 = 25\nSorted: 10, 20, 20, 50 -> Middle avg = (20 + 20) / 2 = 20\nMode = 20 (appears twice)',
                output: 'Mean = 25, Median = 20, Mode = 20',
              }}
            />
          </>
        )}

        {/* ============================================================ */}
        {/* TAB 6: FRACTION CALCULATOR */}
        {/* ============================================================ */}
        {mode === 'fraction' && (
          <>
            <Card
              style={[
                styles.card,
                { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle },
              ]}
            >
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Fraction Operation</Text>

              <View style={styles.fractionEquationRow}>
                {/* Fraction 1 */}
                <View style={styles.fracBox}>
                  <TextInput
                    style={[styles.fracInput, { color: theme.colors.text }]}
                    value={fracNum1}
                    onChangeText={setFracNum1}
                    keyboardType="numeric"
                  />
                  <View style={[styles.fracLine, { backgroundColor: theme.colors.border }]} />
                  <TextInput
                    style={[styles.fracInput, { color: theme.colors.text }]}
                    value={fracDen1}
                    onChangeText={setFracDen1}
                    keyboardType="numeric"
                  />
                </View>

                {/* Operator Selector */}
                <View style={styles.opRow}>
                  {(['+', '-', '×', '÷'] as const).map((op) => (
                    <TouchableOpacity
                      key={op}
                      onPress={() => setFracOp(op)}
                      style={[
                        styles.opBtn,
                        {
                          backgroundColor: fracOp === op ? '#2563EB' : theme.colors.surfaceSubtle,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.opBtnText,
                          { color: fracOp === op ? '#ffffff' : theme.colors.text },
                        ]}
                      >
                        {op}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Fraction 2 */}
                <View style={styles.fracBox}>
                  <TextInput
                    style={[styles.fracInput, { color: theme.colors.text }]}
                    value={fracNum2}
                    onChangeText={setFracNum2}
                    keyboardType="numeric"
                  />
                  <View style={[styles.fracLine, { backgroundColor: theme.colors.border }]} />
                  <TextInput
                    style={[styles.fracInput, { color: theme.colors.text }]}
                    value={fracDen2}
                    onChangeText={setFracDen2}
                    keyboardType="numeric"
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
              <Text style={[styles.resultHeader, { color: theme.colors.text }]}>Solved Fraction</Text>

              <View style={styles.metricGrid}>
                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>
                    Simplified Result
                  </Text>
                  <Text style={[styles.metricValueLarge, { color: '#2563EB' }]}>
                    {fractionResults.simple}
                  </Text>
                </View>

                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>Decimal Form</Text>
                  <Text style={[styles.metricValueLarge, { color: '#10B981' }]}>
                    {fractionResults.decimal}
                  </Text>
                </View>
              </View>

              {fractionResults.mixed !== 'N/A' && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.singleMetric}>
                    <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>Mixed Number</Text>
                    <Text style={[styles.metricValueSmall, { color: theme.colors.text }]}>
                      {fractionResults.mixed}
                    </Text>
                  </View>
                </>
              )}
            </Card>

            <FormulaTabs
              formula="A/B ± C/D = (A·D ± B·C) / (B·D)   |   A/B × C/D = AC / BD"
              formulaLabel="FRACTION ARITHMETIC"
              howItWorks={[
                '1. Addition/Subtraction: Convert to common denominator BD, cross multiply numerators.',
                '2. Multiplication: Multiply numerators directly and denominators directly.',
                '3. Division: Multiply by the reciprocal of the second fraction (A/B × D/C).',
                '4. Simplify by dividing numerator and denominator by their greatest common divisor (GCD).',
              ]}
              example={{
                input: '1/2 + 2/3',
                calculation: '(1 × 3 + 2 × 2) / (2 × 3) = (3 + 4) / 6 = 7/6',
                output: 'Result: 7/6 = 1 (1/6) ≈ 1.1667',
              }}
            />
          </>
        )}

        {/* ============================================================ */}
        {/* TAB 7: RATIO CALCULATOR */}
        {/* ============================================================ */}
        {mode === 'ratio' && (
          <>
            <Card
              style={[
                styles.card,
                { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle },
              ]}
            >
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Enter Ratio & Total Amount</Text>

              <View style={styles.inputsRow}>
                <View style={styles.inputFlex}>
                  <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>Part A</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: theme.colors.surfaceSubtle,
                        borderColor: theme.colors.borderSubtle,
                        color: theme.colors.text,
                      },
                    ]}
                    value={ratioA}
                    onChangeText={setRatioA}
                    keyboardType="numeric"
                    placeholder="e.g. 3"
                    placeholderTextColor={theme.colors.textMuted}
                  />
                </View>

                <View style={styles.inputFlex}>
                  <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>Part B</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: theme.colors.surfaceSubtle,
                        borderColor: theme.colors.borderSubtle,
                        color: theme.colors.text,
                      },
                    ]}
                    value={ratioB}
                    onChangeText={setRatioB}
                    keyboardType="numeric"
                    placeholder="e.g. 4"
                    placeholderTextColor={theme.colors.textMuted}
                  />
                </View>
              </View>

              <View style={styles.singleInputWrap}>
                <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>Total Amount to Divide</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: theme.colors.surfaceSubtle,
                      borderColor: theme.colors.borderSubtle,
                      color: theme.colors.text,
                    },
                  ]}
                  value={ratioTotal}
                  onChangeText={setRatioTotal}
                  keyboardType="numeric"
                  placeholder="e.g. 350"
                  placeholderTextColor={theme.colors.textMuted}
                />
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
              <Text style={[styles.resultHeader, { color: theme.colors.text }]}>Ratio Results</Text>

              <View style={styles.singleMetric}>
                <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>Simplified Ratio</Text>
                <Text style={[styles.metricValueLarge, { color: '#2563EB' }]}>
                  {ratioResults.simplified}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.metricGrid}>
                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>A's Share</Text>
                  <Text style={[styles.metricValueLarge, { color: '#10B981' }]}>
                    {ratioResults.shareA.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>B's Share</Text>
                  <Text style={[styles.metricValueLarge, { color: '#8B5CF6' }]}>
                    {ratioResults.shareB.toFixed(2)}
                  </Text>
                </View>
              </View>
            </Card>

            <FormulaTabs
              formula="Simplified Ratio = A/GCD : B/GCD   |   Share = (Part / Sum) × Total"
              formulaLabel="RATIO & PROPORTION"
              howItWorks={[
                '1. Find the Greatest Common Divisor (GCD) of both parts.',
                '2. Divide each part by the GCD to get the simplest form.',
                '3. To divide a total amount: Calculate each part as (Part / Sum of Parts) × Total.',
                '4. Example: Ratio 3:4 means A gets 3/(3+4) = 3/7 of total, B gets 4/7.',
              ]}
              example={{
                input: 'Ratio: 3:4, Total: 350',
                calculation: 'GCD(3,4) = 1, so simplified = 3:4\nSum = 7\nA = (3/7) × 350 = 150\nB = (4/7) × 350 = 200',
                output: 'Simplified: 3:4, A gets 150, B gets 200',
              }}
            />
          </>
        )}

        {/* ============================================================ */}
        {/* TAB 8: PROPORTION CALCULATOR */}
        {/* ============================================================ */}
        {mode === 'proportion' && (
          <>
            <Card
              style={[
                styles.card,
                { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle },
              ]}
            >
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Solve Proportion: A/B = C/X</Text>

              <View style={styles.inputsRow}>
                <View style={styles.inputFlex}>
                  <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>A (First)</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: theme.colors.surfaceSubtle,
                        borderColor: theme.colors.borderSubtle,
                        color: theme.colors.text,
                      },
                    ]}
                    value={propA}
                    onChangeText={setPropA}
                    keyboardType="numeric"
                    placeholder="e.g. 5"
                    placeholderTextColor={theme.colors.textMuted}
                  />
                </View>

                <View style={styles.inputFlex}>
                  <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>B (Second)</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: theme.colors.surfaceSubtle,
                        borderColor: theme.colors.borderSubtle,
                        color: theme.colors.text,
                      },
                    ]}
                    value={propB}
                    onChangeText={setPropB}
                    keyboardType="numeric"
                    placeholder="e.g. 10"
                    placeholderTextColor={theme.colors.textMuted}
                  />
                </View>
              </View>

              <View style={styles.singleInputWrap}>
                <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>C (Third)</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: theme.colors.surfaceSubtle,
                      borderColor: theme.colors.borderSubtle,
                      color: theme.colors.text,
                    },
                  ]}
                  value={propC}
                  onChangeText={setPropC}
                  keyboardType="numeric"
                  placeholder="e.g. 15"
                  placeholderTextColor={theme.colors.textMuted}
                />
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
              <Text style={[styles.resultHeader, { color: theme.colors.text }]}>Solution</Text>

              <View style={styles.singleMetric}>
                <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>Value of X</Text>
                <Text style={[styles.metricValueLarge, { color: '#2563EB' }]}>
                  {proportionResults.x.toFixed(2)}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.stepsWrap}>
                <Text style={[styles.stepsTitle, { color: theme.colors.text }]}>Equation:</Text>
                <Text style={[styles.stepLine, { color: theme.colors.textMuted }]}>
                  {proportionResults.equation}
                </Text>
              </View>
            </Card>

            <FormulaTabs
              formula="A / B = C / X   →   X = (C × B) / A"
              formulaLabel="PROPORTION SOLVER"
              howItWorks={[
                '1. In a proportion, the product of means equals the product of extremes.',
                '2. Cross multiply: A × X = B × C',
                '3. Solve for X: X = (B × C) / A',
                '4. Used to find unknown values when ratios are equal.',
              ]}
              example={{
                input: 'A = 5, B = 10, C = 15',
                calculation: '5 / 10 = 15 / X\nCross multiply: 5X = 10 × 15 = 150\nX = 150 / 5 = 30',
                output: 'X = 30',
              }}
            />
          </>
        )}

        {/* ============================================================ */}
        {/* TAB 9: PROBABILITY CALCULATOR */}
        {/* ============================================================ */}
        {mode === 'probability' && (
          <>
            <Card
              style={[
                styles.card,
                { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle },
              ]}
            >
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Calculate Probability</Text>

              <View style={styles.inputsRow}>
                <View style={styles.inputFlex}>
                  <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>Favorable Outcomes</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: theme.colors.surfaceSubtle,
                        borderColor: theme.colors.borderSubtle,
                        color: theme.colors.text,
                      },
                    ]}
                    value={probFavorable}
                    onChangeText={setProbFavorable}
                    keyboardType="numeric"
                    placeholder="e.g. 1"
                    placeholderTextColor={theme.colors.textMuted}
                  />
                </View>

                <View style={styles.inputFlex}>
                  <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>Total Outcomes</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: theme.colors.surfaceSubtle,
                        borderColor: theme.colors.borderSubtle,
                        color: theme.colors.text,
                      },
                    ]}
                    value={probTotal}
                    onChangeText={setProbTotal}
                    keyboardType="numeric"
                    placeholder="e.g. 6"
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
              <Text style={[styles.resultHeader, { color: theme.colors.text }]}>Probability Results</Text>

              <View style={styles.metricGrid}>
                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>Probability (Decimal)</Text>
                  <Text style={[styles.metricValueLarge, { color: '#2563EB' }]}>
                    {probabilityResults.probability.toFixed(4)}
                  </Text>
                </View>

                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>Percentage</Text>
                  <Text style={[styles.metricValueLarge, { color: '#10B981' }]}>
                    {probabilityResults.percentage}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.singleMetric}>
                <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>Odds (Favorable:Against)</Text>
                <Text style={[styles.metricValueSmall, { color: theme.colors.text }]}>
                  {probabilityResults.odds}
                </Text>
              </View>
            </Card>

            <FormulaTabs
              formula="P(Event) = Favorable Outcomes / Total Outcomes"
              formulaLabel="BASIC PROBABILITY"
              howItWorks={[
                '1. Probability is a number between 0 and 1 (or 0% to 100%).',
                '2. P = 0 means the event is impossible; P = 1 means it is certain.',
                '3. Count the number of favorable outcomes for your event.',
                '4. Divide by the total number of equally likely outcomes.',
              ]}
              example={{
                input: 'Rolling a 6 on a standard die',
                calculation: 'Favorable outcomes = 1 (only one 6)\nTotal outcomes = 6 (numbers 1-6)\nP(6) = 1/6 ≈ 0.1667 = 16.67%',
                output: 'Probability: 0.1667 (16.67%), Odds: 1:5',
              }}
            />
          </>
        )}
      </ScrollView>

      {/* History Modal */}
      <Modal
        visible={showHistory}
        transparent
        animationType="slide"
        onRequestClose={() => setShowHistory(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.borderSubtle,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                Calculation History
              </Text>
              <View style={styles.modalActions}>
                <TouchableOpacity
                  onPress={clearHistory}
                  style={[styles.clearBtn, { backgroundColor: '#EF4444' }]}
                >
                  <Text style={styles.clearBtnText}>Clear All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowHistory(false)}
                  style={[
                    styles.closeBtn,
                    {
                      backgroundColor: theme.colors.surfaceSubtle,
                      borderColor: theme.colors.borderSubtle,
                    },
                  ]}
                >
                  <Text style={[styles.closeBtnText, { color: theme.colors.text }]}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>

            {history.length === 0 ? (
              <View style={styles.emptyHistory}>
                <Text style={[styles.emptyHistoryText, { color: theme.colors.textMuted }]}>
                  No calculations yet
                </Text>
              </View>
            ) : (
              <FlatList
                data={history}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.historyItem,
                      {
                        backgroundColor: theme.colors.surfaceCard,
                        borderColor: theme.colors.borderSubtle,
                      },
                    ]}
                  >
                    <View style={styles.historyItemHeader}>
                      <Text style={[styles.historyItemMode, { color: '#2563EB' }]}>
                        {item.mode.toUpperCase().replace('_', ' / ')}
                      </Text>
                      <Text style={[styles.historyItemTime, { color: theme.colors.textMuted }]}>
                        {item.timestamp.toLocaleTimeString()}
                      </Text>
                    </View>
                    <Text style={[styles.historyItemInput, { color: theme.colors.textMuted }]}>
                      {item.input}
                    </Text>
                    <Text style={[styles.historyItemResult, { color: theme.colors.text }]}>
                      {item.result}
                    </Text>
                  </View>
                )}
                contentContainerStyle={styles.historyList}
              />
            )}
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
  singleInputWrap: {
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
  switchAlign: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtn: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
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
  stepsWrap: {
    gap: 4,
  },
  stepsTitle: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  stepLine: {
    fontSize: 12,
    lineHeight: 18,
  },
  stepLineHighlight: {
    fontSize: 15,
    fontWeight: '800',
  },
  rngResultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: 4,
  },
  rngBadge: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rngBadgeText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
  },
  rngMetaText: {
    fontSize: 11.5,
    marginTop: 4,
  },
  primeBannerRow: {
    flexDirection: 'row',
  },
  primeStatusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  primeStatusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  fractionEquationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  fracBox: {
    width: 70,
    alignItems: 'center',
    gap: 4,
  },
  fracInput: {
    width: '100%',
    height: 40,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 8,
  },
  fracLine: {
    width: '100%',
    height: 2,
  },
  opRow: {
    flexDirection: 'row',
    gap: 4,
  },
  opBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  opBtnText: {
    fontSize: 16,
    fontWeight: '800',
  },
  historyBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  historyIcon: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  clearBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptyHistory: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyHistoryText: {
    fontSize: 15,
    fontWeight: '600',
  },
  historyList: {
    padding: 16,
    gap: 12,
  },
  historyItem: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyItemMode: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  historyItemTime: {
    fontSize: 10,
    fontWeight: '600',
  },
  historyItemInput: {
    fontSize: 12,
    fontWeight: '500',
  },
  historyItemResult: {
    fontSize: 15,
    fontWeight: '800',
  },
});
