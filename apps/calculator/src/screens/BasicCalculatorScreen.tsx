import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { ScreenContainer, Card } from '@dailyapps/ui';
import { CalculatorHeader } from '../components/CalculatorHeader';
import { useTheme } from '@dailyapps/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
import { useAppStorage } from '@dailyapps/storage';
import { useAnalytics } from '@dailyapps/analytics';
import { useCalculationHistory } from '../hooks';

interface BasicCalculatorScreenProps {
  navigation: any;
  route?: any;
}

const AnimatedButton: React.FC<{
  onPress: () => void;
  style?: any;
  children?: React.ReactNode;
  disabled?: boolean;
  animationScale?: number;
  animationDuration?: number;
}> = ({ onPress, style, children, disabled }) => (
  <TouchableOpacity
    activeOpacity={0.7}
    disabled={disabled}
    onPress={onPress}
    style={style}
  >
    {children}
  </TouchableOpacity>
);

export const BasicCalculatorScreen: React.FC<BasicCalculatorScreenProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const storage = useAppStorage();
  const analytics = useAnalytics();
  const { saveCalculation } = useCalculationHistory('basic', '🧮 Math');

  const tool = route?.params?.tool;

  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewNumber, setWaitingForNewNumber] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  
  // Undo/Redo functionality
  interface CalculatorState {
    display: string;
    previousValue: number | null;
    operation: string | null;
    waitingForNewNumber: boolean;
  }
  
  const [undoStack, setUndoStack] = useState<CalculatorState[]>([]);
  const [redoStack, setRedoStack] = useState<CalculatorState[]>([]);
  
  // Error handling
  const [error, setError] = useState<string | null>(null);
  
  // Auto-clear error after 4 seconds
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => {
      setError(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    async function loadHistory() {
      const saved = await storage.getJson<string[]>('calc_history', []);
      setHistory(saved);
    }
    loadHistory();
    analytics.logScreenView('BasicCalculator');
  }, [storage, analytics]);

  const saveHistory = async (entry: string) => {
    const updated = [entry, ...history.filter((h) => h !== entry)].slice(0, 15);
    setHistory(updated);
    await storage.setJson('calc_history', updated);
  };

  const handleClearHistory = async () => {
    setHistory([]);
    await storage.setJson('calc_history', []);
  };

  const handleSelectHistoryItem = (item: string) => {
    const parts = item.split('=');
    if (parts.length > 1) {
      const res = parts[1].trim().replace(/,/g, '');
      const parsed = parseFloat(res);
      if (!isNaN(parsed)) {
        setDisplay(String(parsed));
        setPreviousValue(null);
        setOperation(null);
        setWaitingForNewNumber(true);
      }
    }
    setShowHistoryModal(false);
  };

  const handleNumber = (digit: string) => {
    setError(null); // Clear error when user takes action
    saveStateToUndo(); // Save state before change
    if (waitingForNewNumber) {
      setDisplay(digit);
      setWaitingForNewNumber(false);
    } else {
      const newDisplay = display === '0' ? digit : display + digit;
      // Limit display length to prevent overflow
      if (newDisplay.length > 15) {
        setError('Maximum digit limit reached (15 digits)!');
        return;
      }
      setDisplay(newDisplay);
    }
  };

  const handleDecimal = () => {
    if (waitingForNewNumber) {
      setDisplay('0.');
      setWaitingForNewNumber(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handlePercent = () => {
    const current = parseFloat(display);
    
    if (isNaN(current)) {
      setError('Invalid number for percentage calculation!');
      return;
    }
    
    // Context-aware percentage calculation
    if (previousValue !== null && operation) {
      switch (operation) {
        case '+':
        case '-':
          // Calculate percentage of previous value
          // Example: 100 + 20% = 100 + 20 (not 100.2)
          // Example: 100 - 20% = 100 - 20 (not 99.8)
          const percentValue = (previousValue * current) / 100;
          setDisplay(String(percentValue));
          break;
          
        case '×':
        case '÷':
          // Convert to decimal for multiplication/division
          // Example: 50 × 10% = 50 × 0.1 = 5
          setDisplay(String(current / 100));
          break;
          
        default:
          setDisplay(String(current / 100));
      }
    } else {
      // Simple percentage conversion when no operation context
      // Example: 50% = 0.5
      setDisplay(String(current / 100));
    }
    
    setWaitingForNewNumber(true);
  };

  const handleOperation = (op: string) => {
    saveStateToUndo(); // Save state before operation
    const current = parseFloat(display);
    if (previousValue === null) {
      setPreviousValue(current);
    } else if (operation) {
      const result = calculate(previousValue, current, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }
    setOperation(op);
    setWaitingForNewNumber(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    // Clear any existing errors
    setError(null);
    
    let result: number;
    switch (op) {
      case '+': 
        result = a + b;
        break;
      case '-': 
        result = a - b;
        break;
      case '×': 
        result = a * b;
        break;
      case '÷': 
        if (b === 0) {
          setError('Cannot divide by zero! Try a different number.');
          return a; // Return previous value
        }
        result = a / b;
        break;
      default: 
        result = b;
    }
    
    // Check for overflow or invalid results
    if (!isFinite(result)) {
      setError('Result is too large! Try smaller numbers.');
      return a; // Return previous value
    }
    
    if (isNaN(result)) {
      setError('Invalid calculation! Please start over.');
      return 0;
    }
    
    // Check for very large numbers
    if (Math.abs(result) > 1e15) {
      setError('Number is too large to display accurately!');
      return a;
    }
    
    return result;
  };

  const handleEquals = () => {
    if (previousValue === null || operation === null) return;
    saveStateToUndo(); // Save state before equals
    const current = parseFloat(display);
    const result = calculate(previousValue, current, operation);
    const equation = `${formatNumber(previousValue)} ${operation} ${formatNumber(current)} = ${formatNumber(result)}`;
    saveHistory(equation);
    saveCalculation({
      toolId: 'basic',
      toolName: 'Basic Calculator',
      category: '🧮 Math',
      title: equation,
      subtitle: `${formatNumber(previousValue)} ${operation} ${formatNumber(current)}`,
      result: formatNumber(result),
      badge: 'MATH',
      inputs: { display: String(result) },
    });
    analytics.logToolCompleted('basic', { result });

    setDisplay(String(result));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewNumber(true);
  };

  const handleClear = () => {
    saveStateToUndo(); // Save state before clear
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewNumber(false);
    setError(null); // Clear any errors
  };

  const handleDelete = () => {
    if (waitingForNewNumber) return;
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleToggleSign = () => {
    const val = parseFloat(display) || 0;
    setDisplay(val === 0 ? '0' : String(-val));
  };
  
  // Undo/Redo Functions
  const saveStateToUndo = () => {
    const currentState: CalculatorState = {
      display,
      previousValue,
      operation,
      waitingForNewNumber,
    };
    setUndoStack(prev => [...prev, currentState].slice(-20)); // Keep last 20 states
    setRedoStack([]); // Clear redo stack when new action happens
  };
  
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    
    // Save current state to redo stack
    const currentState: CalculatorState = {
      display,
      previousValue,
      operation,
      waitingForNewNumber,
    };
    setRedoStack(prev => [...prev, currentState]);
    
    // Pop last state from undo stack
    const lastState = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    
    // Restore state
    setDisplay(lastState.display);
    setPreviousValue(lastState.previousValue);
    setOperation(lastState.operation);
    setWaitingForNewNumber(lastState.waitingForNewNumber);
  };
  
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    
    // Save current state to undo stack
    const currentState: CalculatorState = {
      display,
      previousValue,
      operation,
      waitingForNewNumber,
    };
    setUndoStack(prev => [...prev, currentState]);
    
    // Pop last state from redo stack
    const lastState = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    
    // Restore state
    setDisplay(lastState.display);
    setPreviousValue(lastState.previousValue);
    setOperation(lastState.operation);
    setWaitingForNewNumber(lastState.waitingForNewNumber);
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-IN', { maximumFractionDigits: 6 });
  };

  const buttons = [
    ['C', '⌫', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['±', '0', '.', '='],
  ];

  return (
    <ScreenContainer safeArea withPadding={false}>
      <CalculatorHeader
        title={tool?.name || 'Basic Calculator'}
        subtitle={tool?.shortDescription || 'Standard calculations & tape'}
        icon={tool?.icon || '➗'}
        category="🧮 Math"
        toolId={tool?.id || 'basic'}
        onHistory={() => setShowHistoryModal(true)}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.container}>
        {/* Floating Error Toast - Non-intrusive, never shifts layout */}
        {error && (
          <View style={styles.floatingToast}>
            <Text style={styles.floatingToastIcon}>⚠️</Text>
            <Text style={styles.floatingToastText} numberOfLines={2}>
              {error}
            </Text>
            <TouchableOpacity
              onPress={() => setError(null)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.floatingToastClose}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Display screen - Simple & Clean */}
        <Card
          style={StyleSheet.flatten([
            styles.displayCard,
            { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle },
          ])}
        >
          {operation && previousValue !== null ? (
            <Text style={[styles.subDisplay, { color: theme.colors.textMuted }]}>
              {formatNumber(previousValue)} {operation}
            </Text>
          ) : (
            <Text style={[styles.subDisplay, { color: 'transparent' }]}>0</Text>
          )}

          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[styles.displayText, { color: theme.colors.text }]}
          >
            {display}
          </Text>
        </Card>

        {/* Undo/Redo buttons */}
        <View style={styles.undoRedoRow}>
          <TouchableOpacity
            onPress={handleUndo}
            disabled={undoStack.length === 0}
            style={[
              styles.undoRedoBtn,
              {
                backgroundColor: undoStack.length === 0
                  ? theme.colors.surfaceSubtle
                  : theme.isDark
                  ? 'rgba(59, 130, 246, 0.15)'
                  : '#DBEAFE',
                borderColor: undoStack.length === 0
                  ? theme.colors.borderSubtle
                  : theme.isDark
                  ? 'rgba(59, 130, 246, 0.3)'
                  : '#93C5FD',
                opacity: undoStack.length === 0 ? 0.4 : 1,
              },
            ]}
          >
            <Text style={[styles.undoRedoIcon, { color: theme.colors.primary }]}>↶</Text>
            <Text style={[styles.undoRedoText, { color: theme.colors.text }]}>Undo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleRedo}
            disabled={redoStack.length === 0}
            style={[
              styles.undoRedoBtn,
              {
                backgroundColor: redoStack.length === 0
                  ? theme.colors.surfaceSubtle
                  : theme.isDark
                  ? 'rgba(59, 130, 246, 0.15)'
                  : '#DBEAFE',
                borderColor: redoStack.length === 0
                  ? theme.colors.borderSubtle
                  : theme.isDark
                  ? 'rgba(59, 130, 246, 0.3)'
                  : '#93C5FD',
                opacity: redoStack.length === 0 ? 0.4 : 1,
              },
            ]}
          >
            <Text style={[styles.undoRedoIcon, { color: theme.colors.primary }]}>↷</Text>
            <Text style={[styles.undoRedoText, { color: theme.colors.text }]}>Redo</Text>
          </TouchableOpacity>
        </View>

        {/* Keypad - Rock solid position, never pushed upward */}
        <View style={styles.keypad}>
          {buttons.map((row, rIdx) => (
            <View key={rIdx} style={styles.row}>
              {row.map((btn) => {
                const isOp = ['÷', '×', '-', '+', '='].includes(btn);
                const isClear = ['C', '⌫', '%'].includes(btn);
                let bg = theme.colors.surfaceSubtle;
                let textCol = theme.colors.text;

                if (isOp) {
                  bg = theme.isDark ? '#2563EB' : theme.colors.primary;
                  textCol = '#ffffff';
                } else if (isClear) {
                  bg = theme.isDark ? '#1E293B' : '#e2e8f0';
                  textCol = theme.isDark ? '#F87171' : '#DC2626';
                }

                return (
                  <AnimatedButton
                    key={btn}
                    onPress={() => {
                      if (btn === 'C') handleClear();
                      else if (btn === '⌫') handleDelete();
                      else if (btn === '=') handleEquals();
                      else if (['÷', '×', '-', '+'].includes(btn)) handleOperation(btn);
                      else if (btn === '.') handleDecimal();
                      else if (btn === '±') handleToggleSign();
                      else if (btn === '%') handlePercent();
                      else handleNumber(btn);
                    }}
                    animationScale={0.92}
                    animationDuration={80}
                    style={[
                      styles.btn,
                      {
                        backgroundColor: bg,
                        borderRadius: theme.borderRadius.lg,
                        borderColor: isOp
                          ? theme.isDark
                            ? '#60A5FA'
                            : '#1D4ED8'
                          : theme.isDark
                          ? 'rgba(255, 255, 255, 0.08)'
                          : theme.colors.borderSubtle,
                        borderWidth: 1.2,
                        flex: 1,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.btnText,
                        {
                          color: textCol,
                          fontWeight: isOp || isClear ? '800' : '600',
                          fontSize: 24,
                        },
                      ]}
                    >
                      {btn}
                    </Text>
                  </AnimatedButton>
                );
              })}
            </View>
          ))}
        </View>
      </View>

      {/* Dedicated Calculation History Modal */}
      <Modal
        visible={showHistoryModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowHistoryModal(false)}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.backdropDismiss}
            activeOpacity={1}
            onPress={() => setShowHistoryModal(false)}
          />
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
                  <Text style={styles.emptyHistoryEmoji}>📝</Text>
                  <Text style={[styles.emptyHistoryTitle, { color: theme.colors.text }]}>
                    No calculations yet
                  </Text>
                  <Text style={[styles.emptyHistoryDesc, { color: theme.colors.textMuted }]}>
                    Your past equation results will appear here. Tap any result to load it into the calculator.
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
    paddingTop: 6,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'android' ? 14 : 18,
  },
  displayCard: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: 32,
    minHeight: 106,
    maxHeight: 124,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: 6,
  },
  subDisplay: {
    fontSize: 14,
    marginBottom: 2,
  },
  displayText: {
    fontSize: 44,
    fontWeight: '700',
  },
  floatingToast: {
    position: 'absolute',
    top: 8,
    left: 16,
    right: 16,
    zIndex: 999,
    backgroundColor: '#1E293B',
    borderColor: 'rgba(239, 68, 68, 0.8)',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 20,
  },
  floatingToastIcon: {
    fontSize: 18,
  },
  floatingToastText: {
    color: '#FCA5A5',
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  floatingToastClose: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '700',
  },
  undoRedoRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  undoRedoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  undoRedoIcon: {
    fontSize: 16,
    fontWeight: '700',
  },
  undoRedoText: {
    fontSize: 13,
    fontWeight: '600',
  },
  keypad: {
    flex: 1,
    gap: 7,
    marginTop: 2,
    justifyContent: 'space-between',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    gap: 7,
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 22,
    fontWeight: '600',
  },
  backdropDismiss: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  historyModalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    maxHeight: '75%',
    paddingBottom: Platform.OS === 'android' ? 28 : 34,
    paddingHorizontal: 20,
    paddingTop: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.15)',
    marginBottom: 10,
  },
  modalTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalIcon: {
    fontSize: 18,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  modalActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  clearHistoryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  clearHistoryBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
  },
  closeModalBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeModalText: {
    fontSize: 16,
    fontWeight: '700',
  },
  historyList: {
    marginTop: 6,
  },
  emptyHistoryWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
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
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  historyItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  historyItemEq: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  historyTapHint: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 10,
  },
  // Memory Help Modal Styles
  memoryHelpModal: {
    height: SCREEN_HEIGHT * 0.78,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
    overflow: 'hidden',
  },
  modalHandleBarWrap: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  modalHandleBar: {
    width: 42,
    height: 4,
    borderRadius: 2,
  },
  memoryHelpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.15)',
  },
  memoryHelpTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  memoryHelpClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memoryHelpCloseText: {
    fontSize: 20,
    fontWeight: '700',
  },
  memoryHelpContent: {
    flex: 1,
  },
  memoryHelpScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  memoryHelpCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    gap: 12,
    alignItems: 'flex-start',
  },
  memoryHelpBadge: {
    fontSize: 16,
    fontWeight: '800',
    minWidth: 32,
  },
  memoryHelpText: {
    flex: 1,
    gap: 4,
  },
  memoryHelpLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  memoryHelpDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  memoryHelpExample: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  memoryHelpTip: {
    flexDirection: 'row',
    padding: 14,
    paddingRight: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 12,
    alignItems: 'flex-start',
  },
  memoryHelpTipIcon: {
    fontSize: 22,
  },
  memoryHelpTipTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  memoryHelpTipText: {
    fontSize: 13,
    lineHeight: 18,
  },
  memoryHelpBottomBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'android' ? 24 : 32,
    borderTopWidth: 1,
  },
  memoryHelpCloseBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memoryHelpCloseBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});