import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import { ScreenContainer, Card } from '@dailyapps/ui';
import { useTheme } from '@dailyapps/theme';
import { useAppStorage } from '@dailyapps/storage';
import { useAnalytics } from '@dailyapps/analytics';
import { CalculatorHeader } from '../components/CalculatorHeader';
import { FormulaTabs } from '../components/FormulaTabs';
import { useCalculationHistory } from '../hooks';

interface Props {
  navigation: any;
  route?: any;
}

export const ScientificCalculatorScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const storage = useAppStorage();
  const analytics = useAnalytics();
  const { saveCalculation } = useCalculationHistory('scientific', '🧮 Math');

  const tool = route?.params?.tool;

  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [isRad, setIsRad] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    async function loadHistory() {
      const saved = await storage.getJson<string[]>('scientific_history', []);
      setHistory(saved);
    }
    loadHistory();
    analytics.logScreenView('ScientificCalculator');
  }, [storage, analytics]);

  const saveHistory = async (entry: string) => {
    const updated = [entry, ...history.filter((h) => h !== entry)].slice(0, 20);
    setHistory(updated);
    await storage.setJson('scientific_history', updated);
  };

  const handleClearHistory = async () => {
    setHistory([]);
    await storage.setJson('scientific_history', []);
  };

  const handleSelectHistoryItem = (item: string) => {
    const parts = item.split(' = ');
    if (parts.length === 2) {
      setExpression(parts[0]);
      setResult(parts[1]);
    } else {
      setExpression(item);
    }
    setShowHistoryModal(false);
  };

  const handleInput = (char: string) => {
    setExpression((prev) => prev + char);
  };

  const handleClear = () => {
    setExpression('');
    setResult('0');
  };

  const handleDelete = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  const handleCalculate = () => {
    if (!expression.trim()) return;
    try {
      const _degToRad = (deg: number) => (deg * Math.PI) / 180;
      const _radToDeg = (rad: number) => (rad * 180) / Math.PI;
      
      // Trigonometric functions
      const _sin = (x: number) => Math.sin(isRad ? x : _degToRad(x));
      const _cos = (x: number) => Math.cos(isRad ? x : _degToRad(x));
      const _tan = (x: number) => Math.tan(isRad ? x : _degToRad(x));
      
      // Inverse trigonometric functions
      const _asin = (x: number) => isRad ? Math.asin(x) : _radToDeg(Math.asin(x));
      const _acos = (x: number) => isRad ? Math.acos(x) : _radToDeg(Math.acos(x));
      const _atan = (x: number) => isRad ? Math.atan(x) : _radToDeg(Math.atan(x));
      
      // Hyperbolic functions
      const _sinh = (x: number) => Math.sinh(x);
      const _cosh = (x: number) => Math.cosh(x);
      const _tanh = (x: number) => Math.tanh(x);
      
      // Logarithms
      const _ln = (x: number) => Math.log(x);
      const _log = (x: number) => Math.log10(x);
      const _sqrt = (x: number) => Math.sqrt(x);
      const _cbrt = (x: number) => Math.cbrt(x);
      
      // Factorial
      const _fact = (n: number): number => {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) result *= i;
        return result;
      };
      
      // Absolute value
      const _abs = (x: number) => Math.abs(x);

      let evalExpr = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, `${Math.PI}`)
        .replace(/e(?![a-z])/gi, `${Math.E}`) // Match 'e' not followed by letters
        .replace(/sin\(/g, '_sin(')
        .replace(/cos\(/g, '_cos(')
        .replace(/tan\(/g, '_tan(')
        .replace(/asin\(/g, '_asin(')
        .replace(/acos\(/g, '_acos(')
        .replace(/atan\(/g, '_atan(')
        .replace(/sinh\(/g, '_sinh(')
        .replace(/cosh\(/g, '_cosh(')
        .replace(/tanh\(/g, '_tanh(')
        .replace(/ln\(/g, '_ln(')
        .replace(/log\(/g, '_log(')
        .replace(/√\(/g, '_sqrt(')
        .replace(/∛\(/g, '_cbrt(')
        .replace(/abs\(/g, '_abs(')
        .replace(/(\d+)!/g, '_fact($1)')
        .replace(/\^/g, '**');

      const evalFn = new Function(
        '_sin', '_cos', '_tan', 
        '_asin', '_acos', '_atan',
        '_sinh', '_cosh', '_tanh',
        '_ln', '_log', '_sqrt', '_cbrt',
        '_fact', '_abs',
        `return (${evalExpr});`
      );
      
      const evalResult = evalFn(
        _sin, _cos, _tan,
        _asin, _acos, _atan,
        _sinh, _cosh, _tanh,
        _ln, _log, _sqrt, _cbrt,
        _fact, _abs
      );
      
      const formatted = Number.isFinite(evalResult)
        ? Math.round(evalResult * 100000000) / 100000000
        : 'Error';

      setResult(String(formatted));
      saveHistory(`${expression} = ${formatted}`);
      saveCalculation({
        toolId: tool?.id || 'scientific',
        toolName: tool?.name || 'Scientific Calculator',
        category: '🧮 Math',
        title: `${expression} = ${formatted}`,
        subtitle: isRad ? 'Radian Mode (RAD)' : 'Degree Mode (DEG)',
        result: String(formatted),
        badge: isRad ? 'RAD' : 'DEG',
        inputs: { expression, isRad },
      });
    } catch {
      setResult('Error');
    }
  };

  const scientificButtons = [
    [
      { label: isRad ? 'RAD' : 'DEG', action: () => setIsRad(!isRad), type: 'fn' },
      { label: 'sin', action: () => handleInput('sin('), type: 'fn' },
      { label: 'cos', action: () => handleInput('cos('), type: 'fn' },
      { label: 'tan', action: () => handleInput('tan('), type: 'fn' },
    ],
    [
      { label: 'asin', action: () => handleInput('asin('), type: 'fn' },
      { label: 'acos', action: () => handleInput('acos('), type: 'fn' },
      { label: 'atan', action: () => handleInput('atan('), type: 'fn' },
      { label: 'abs', action: () => handleInput('abs('), type: 'fn' },
    ],
    [
      { label: 'sinh', action: () => handleInput('sinh('), type: 'fn' },
      { label: 'cosh', action: () => handleInput('cosh('), type: 'fn' },
      { label: 'tanh', action: () => handleInput('tanh('), type: 'fn' },
      { label: 'x!', action: () => handleInput('!'), type: 'fn' },
    ],
    [
      { label: 'ln', action: () => handleInput('ln('), type: 'fn' },
      { label: 'log', action: () => handleInput('log('), type: 'fn' },
      { label: '√', action: () => handleInput('√('), type: 'fn' },
      { label: '∛', action: () => handleInput('∛('), type: 'fn' },
    ],
    [
      { label: 'π', action: () => handleInput('π'), type: 'fn' },
      { label: 'e', action: () => handleInput('e'), type: 'fn' },
      { label: '(', action: () => handleInput('('), type: 'fn' },
      { label: ')', action: () => handleInput(')'), type: 'fn' },
    ],
    [
      { label: 'x²', action: () => handleInput('^2'), type: 'fn' },
      { label: 'x³', action: () => handleInput('^3'), type: 'fn' },
      { label: '^', action: () => handleInput('^'), type: 'fn' },
      { label: 'mod', action: () => handleInput('%'), type: 'fn' },
    ],
  ];

  const standardButtons = [
    [
      { label: 'C', action: handleClear, type: 'action' },
      { label: '⌫', action: handleDelete, type: 'action' },
      { label: '%', action: () => handleInput('%'), type: 'op' },
      { label: '÷', action: () => handleInput('÷'), type: 'op' },
    ],
    [
      { label: '7', action: () => handleInput('7'), type: 'num' },
      { label: '8', action: () => handleInput('8'), type: 'num' },
      { label: '9', action: () => handleInput('9'), type: 'num' },
      { label: '×', action: () => handleInput('×'), type: 'op' },
    ],
    [
      { label: '4', action: () => handleInput('4'), type: 'num' },
      { label: '5', action: () => handleInput('5'), type: 'num' },
      { label: '6', action: () => handleInput('6'), type: 'num' },
      { label: '-', action: () => handleInput('-'), type: 'op' },
    ],
    [
      { label: '1', action: () => handleInput('1'), type: 'num' },
      { label: '2', action: () => handleInput('2'), type: 'num' },
      { label: '3', action: () => handleInput('3'), type: 'num' },
      { label: '+', action: () => handleInput('+'), type: 'op' },
    ],
    [
      { label: '0', action: () => handleInput('0'), type: 'num' },
      { label: '.', action: () => handleInput('.'), type: 'num' },
      { label: '=', action: handleCalculate, type: 'equals' },
    ],
  ];

  return (
    <ScreenContainer safeArea withPadding={false}>
      <CalculatorHeader
        title={tool?.name || 'Scientific'}
        subtitle={isRad ? 'Radian Mode (RAD)' : 'Degree Mode (DEG)'}
        icon={tool?.icon || '🔬'}
        category="🧮 Math"
        toolId={tool?.id || 'scientific'}
        onBack={() => navigation.goBack()}
        onHistory={() => setShowHistoryModal(true)}
      />

      <View style={styles.container}>
        {/* Display Card */}
        <Card
          style={StyleSheet.flatten([
            styles.displayCard,
            {
              backgroundColor: theme.colors.surfaceCard,
              borderColor: theme.colors.borderSubtle,
            },
          ])}
        >
          <Text style={[styles.exprText, { color: theme.colors.textMuted }]}>
            {expression || ' '}
          </Text>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[styles.resultText, { color: theme.colors.text }]}
          >
            {result}
          </Text>
        </Card>

        {/* Keypad */}
        <ScrollView style={styles.keypadScroll} showsVerticalScrollIndicator={false}>
          {/* Scientific Functions */}
          <View style={styles.scientificGrid}>
            {scientificButtons.map((row, rIdx) => (
              <View key={rIdx} style={styles.row}>
                {row.map((btn, cIdx) => (
                  <TouchableOpacity
                    key={cIdx}
                    activeOpacity={0.7}
                    onPress={btn.action}
                    style={[
                      styles.btn,
                      styles.fnBtn,
                      {
                        backgroundColor:
                          btn.label === (isRad ? 'RAD' : 'DEG')
                            ? '#2563EB'
                            : theme.colors.surfaceSubtle,
                        borderColor:
                          btn.label === (isRad ? 'RAD' : 'DEG')
                            ? (theme.isDark ? '#60A5FA' : '#1D4ED8')
                            : theme.colors.borderSubtle,
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.btnText,
                        styles.fnText,
                        {
                          color:
                            btn.label === (isRad ? 'RAD' : 'DEG')
                              ? '#ffffff'
                              : theme.colors.text,
                          fontWeight: btn.label === (isRad ? 'RAD' : 'DEG') ? '800' : '600',
                        },
                      ]}
                    >
                      {btn.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          {/* Standard Keypad */}
          <View style={styles.standardGrid}>
            {standardButtons.map((row, rIdx) => (
              <View key={rIdx} style={styles.row}>
                {row.map((btn, cIdx) => {
                  const isEquals = btn.type === 'equals';
                  const isOp = btn.type === 'op';
                  const isAction = btn.type === 'action';

                  let bg = theme.colors.surfaceCard;
                  let textCol = theme.colors.text;

                  if (isEquals) {
                    bg = '#2563EB';
                    textCol = '#ffffff';
                  } else if (isOp) {
                    bg = theme.isDark ? 'rgba(37, 99, 235, 0.18)' : '#EFF6FF';
                    textCol = theme.isDark ? '#60A5FA' : '#1D4ED8';
                  } else if (isAction) {
                    bg = theme.colors.surfaceSubtle;
                    textCol = theme.colors.textMuted;
                  }

                  return (
                    <TouchableOpacity
                      key={cIdx}
                      activeOpacity={0.7}
                      onPress={btn.action}
                      style={[
                        styles.btn,
                        isEquals ? styles.equalsBtn : null,
                        { backgroundColor: bg },
                      ]}
                    >
                      <Text style={[styles.btnText, { color: textCol }]}>
                        {btn.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>

          {/* Educational Formula, How it works, Example Tabs */}
          <FormulaTabs
            formula="sin²(θ) + cos²(θ) = 1   |   ln(e^x) = x   |   log₁₀(10^x) = x"
            formulaLabel="TRIGONOMETRY & LOGARITHMIC IDENTITIES"
            howItWorks={[
              '1. Angle Modes: DEG measures angles in degrees (0°–360°), while RAD uses radians (0–2π). For calculus and physics, radian mode is standard.',
              '2. Logarithmic Functions: ln(x) represents the natural logarithm base e (≈ 2.71828), and log(x) represents the common logarithm base 10.',
              '3. Exponents & Roots: x^y computes power exponentiation, and √(x) computes square root (x^(1/2)).',
              '4. Precision: Floating-point scientific operations evaluate with high precision up to 8 decimal places.',
            ]}
            example={{
              input: 'sin(30°) + log(100) × 2^3',
              calculation: 'sin(30°) = 0.5\nlog(100) = 2\n2^3 = 8\n0.5 + (2 × 8) = 0.5 + 16',
              output: 'Result = 16.5',
            }}
            style={styles.formulaSection}
          />
        </ScrollView>
      </View>

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
                  <Text style={styles.emptyHistoryEmoji}>🔬</Text>
                  <Text style={[styles.emptyHistoryTitle, { color: theme.colors.text }]}>
                    No calculations yet
                  </Text>
                  <Text style={[styles.emptyHistoryDesc, { color: theme.colors.textMuted }]}>
                    Your past scientific calculations will appear here. Tap any item to load it back into the calculator.
                  </Text>
                </View>
              ) : (
                history.map((eq, idx) => (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.7}
                    onPress={() => handleSelectHistoryItem(eq)}
                    style={[
                      styles.historyItemCard,
                      {
                        backgroundColor: theme.colors.surfaceSubtle,
                        borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.06)' : theme.colors.borderSubtle,
                      },
                    ]}
                  >
                    <Text style={[styles.historyItemEq, { color: theme.colors.text }]}>{eq}</Text>
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
  container: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  displayCard: {
    padding: 16,
    borderRadius: 16,
    minHeight: 110,
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  exprText: {
    fontSize: 16,
    textAlign: 'right',
    marginBottom: 6,
  },
  resultText: {
    fontSize: 38,
    fontWeight: '800',
    textAlign: 'right',
  },
  keypadScroll: {
    flex: 1,
  },
  scientificGrid: {
    marginBottom: 8,
  },
  standardGrid: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 8,
  },
  btn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fnBtn: {
    height: 40,
    borderRadius: 8,
  },
  equalsBtn: {
    flex: 2,
  },
  btnText: {
    fontSize: 20,
    fontWeight: '700',
  },
  fnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  formulaSection: {
    marginTop: 16,
    marginBottom: 24,
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
  historyItemEq: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    marginRight: 10,
  },
  historyTapHint: {
    fontSize: 12,
    fontWeight: '700',
  },
});
