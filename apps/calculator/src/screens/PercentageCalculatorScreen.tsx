import React, { useState, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { ScreenContainer, Card } from '@dailyapps/ui';
import { useTheme } from '@dailyapps/theme';
import { useAnalytics } from '@dailyapps/analytics';
import {
  CalculatorHeader,
  ResultHeroCard,
  PresetPills,
  CalcInputField,
  SegmentedTabs,
  FormulaInfoCard,
  CalculationHistoryModal,
} from '../components';
import { useCalculationHistory } from '../hooks';
import { CalculationRecord } from '../types/history.types';

interface PercentageCalculatorScreenProps {
  navigation: any;
  route?: any;
}

type PctMode = 'percent_of' | 'is_what_percent' | 'percent_change';

export const PercentageCalculatorScreen: React.FC<PercentageCalculatorScreenProps> = ({
  navigation,
  route,
}) => {
  const theme = useTheme();
  const analytics = useAnalytics();

  const tool = route?.params?.tool;

  const resolveInitialMode = (toolId?: string): PctMode => {
    const id = toolId || '';
    if (id.includes('hike') || id.includes('change') || id.includes('growth') || id.includes('appraisal')) {
      return 'percent_change';
    }
    if (id.includes('ratio') || id.includes('proportion') || id.includes('is_what') || id.includes('share')) {
      return 'is_what_percent';
    }
    return 'percent_of';
  };

  const [activeTab, setActiveTab] = useState<PctMode>(resolveInitialMode(tool?.id));
  const [showHistory, setShowHistory] = useState(false);

  const { history, saveCalculation, clearHistory, deleteItem } = useCalculationHistory(
    tool?.id || 'percentage',
    '🎓 Student'
  );

  // Mode 1: What is P% of X?
  const [m1Pct, setM1Pct] = useState('15');
  const [m1Val, setM1Val] = useState('250');

  // Mode 2: X is what % of Y?
  const [m2Val, setM2Val] = useState('25');
  const [m2Total, setM2Total] = useState('200');

  // Mode 3: Percentage Change from X to Y
  const [m3Initial, setM3Initial] = useState('100');
  const [m3Final, setM3Final] = useState('125');

  useEffect(() => {
    analytics.logScreenView(tool?.name || 'PercentageCalculator');
    if (tool?.id) {
      setActiveTab(resolveInitialMode(tool.id));
    }
  }, [analytics, tool?.id, tool?.name]);

  // Calculations
  const res1 = () => {
    const p = parseFloat(m1Pct);
    const v = parseFloat(m1Val);
    if (isNaN(p) || isNaN(v)) return '—';
    return ((p / 100) * v).toFixed(2).replace(/\.00$/, '');
  };

  const res2 = () => {
    const v = parseFloat(m2Val);
    const t = parseFloat(m2Total);
    if (isNaN(v) || isNaN(t) || t === 0) return '—';
    return `${((v / t) * 100).toFixed(2).replace(/\.00$/, '')}%`;
  };

  const res3 = () => {
    const init = parseFloat(m3Initial);
    const fin = parseFloat(m3Final);
    if (isNaN(init) || isNaN(fin) || init === 0) {
      return { pct: '0%', diff: '0', isIncrease: true };
    }
    const diff = fin - init;
    const pct = (diff / init) * 100;
    return {
      pct: `${pct >= 0 ? '+' : ''}${pct.toFixed(2).replace(/\.00$/, '')}%`,
      diff: `${diff >= 0 ? '+' : ''}${diff.toFixed(2).replace(/\.00$/, '')}`,
      isIncrease: diff >= 0,
    };
  };

  const changeResult = res3();

  // Auto-record calculation into history
  useEffect(() => {
    let title = '';
    let subtitle = '';
    let result = '';
    let badge = '';

    if (activeTab === 'percent_of') {
      const r = res1();
      if (r === '—' || parseFloat(m1Val) <= 0) return;
      title = `${m1Pct}% of ${m1Val} = ${r}`;
      subtitle = `Percentage: ${m1Pct}% | Base: ${m1Val}`;
      result = r;
      badge = `${m1Pct}%`;
    } else if (activeTab === 'is_what_percent') {
      const r = res2();
      if (r === '—' || parseFloat(m2Total) <= 0) return;
      title = `${m2Val} is ${r} of ${m2Total}`;
      subtitle = `Part: ${m2Val} | Total: ${m2Total}`;
      result = r;
      badge = r;
    } else if (activeTab === 'percent_change') {
      if (parseFloat(m3Initial) <= 0 || parseFloat(m3Final) <= 0) return;
      title = `${m3Initial} → ${m3Final} (${changeResult.pct})`;
      subtitle = `Difference: ${changeResult.diff} | ${changeResult.isIncrease ? 'Increase' : 'Decrease'}`;
      result = changeResult.pct;
      badge = changeResult.pct;
    }

    const timer = setTimeout(() => {
      saveCalculation({
        toolId: tool?.id || 'percentage',
        toolName: tool?.name || 'Percentage Calculator',
        category: '🎓 Student',
        title,
        subtitle,
        result,
        badge,
        inputs: {
          activeTab,
          m1Pct,
          m1Val,
          m2Val,
          m2Total,
          m3Initial,
          m3Final,
        },
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [
    activeTab,
    m1Pct,
    m1Val,
    m2Val,
    m2Total,
    m3Initial,
    m3Final,
    changeResult.diff,
    changeResult.isIncrease,
    changeResult.pct,
    saveCalculation,
    tool?.id,
    tool?.name,
  ]);

  const handleSelectHistory = (record: CalculationRecord) => {
    if (record.inputs) {
      if (record.inputs.activeTab) setActiveTab(record.inputs.activeTab as PctMode);
      if (record.inputs.m1Pct) setM1Pct(record.inputs.m1Pct);
      if (record.inputs.m1Val) setM1Val(record.inputs.m1Val);
      if (record.inputs.m2Val) setM2Val(record.inputs.m2Val);
      if (record.inputs.m2Total) setM2Total(record.inputs.m2Total);
      if (record.inputs.m3Initial) setM3Initial(record.inputs.m3Initial);
      if (record.inputs.m3Final) setM3Final(record.inputs.m3Final);
    }
  };

  return (
    <ScreenContainer safeArea withPadding={false}>
      <CalculatorHeader
        title={tool?.name || 'Percentage Calculator'}
        subtitle={tool?.shortDescription || "Proportions & percentage change"}
        icon={tool?.icon || '📊'}
        category="🎓 Student"
        toolId={tool?.id || 'percentage'}
        onBack={() => navigation.goBack()}
        onHistory={() => setShowHistory(true)}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SegmentedTabs
          activeTab={activeTab}
          onTabChange={(key) => setActiveTab(key as PctMode)}
          tabs={[
            { key: 'percent_of', label: 'X% of Y', icon: '🔢' },
            { key: 'is_what_percent', label: 'X is % of Y', icon: '➗' },
            { key: 'percent_change', label: 'Change %', icon: '📈' },
          ]}
        />

        {/* TAB 1: What is X% of Y */}
        {activeTab === 'percent_of' && (
          <>
            <Card
              style={[
                styles.card,
                {
                  backgroundColor: theme.colors.surfaceCard,
                  borderColor: theme.colors.borderSubtle,
                },
              ]}
            >
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                Calculate Percentage Value
              </Text>

              <CalcInputField
                label="Percentage (%)"
                keyboardType="numeric"
                value={m1Pct}
                onChangeText={setM1Pct}
                suffix="%"
              />

              <Text style={[styles.sectionLabel, { color: theme.isDark ? '#CBD5E1' : '#475569' }]}>
                Quick Select Percentage
              </Text>
              <PresetPills
                options={['5%', '10%', '15%', '18%', '20%', '25%', '50%']}
                selectedValue={`${m1Pct}%`}
                onSelect={(val) => setM1Pct(String(val).replace('%', ''))}
              />

              <CalcInputField
                label="Total Base Value (Y)"
                keyboardType="numeric"
                value={m1Val}
                onChangeText={setM1Val}
                style={{ marginTop: 12 }}
              />
            </Card>

            <ResultHeroCard
              title="Calculated Value"
              value={res1()}
              subText={`${m1Pct}% of ${m1Val}`}
              variant="primary"
              badgeText={`Proportion: ${m1Pct}%`}
              badgeType="info"
              secondaryStats={[
                { label: 'Percentage', value: `${m1Pct}%` },
                { label: 'Base Value', value: m1Val },
                { label: 'Result', value: res1() },
              ]}
            />

            <FormulaInfoCard
              title="Percentage Value Formula"
              formula="Result = (Percentage / 100) × Base Value"
              explanation="To find P percent of a number, convert the percentage into a decimal by dividing by 100, then multiply by the total value."
            />
          </>
        )}

        {/* TAB 2: X is what % of Y */}
        {activeTab === 'is_what_percent' && (
          <>
            <Card
              style={[
                styles.card,
                {
                  backgroundColor: theme.colors.surfaceCard,
                  borderColor: theme.colors.borderSubtle,
                },
              ]}
            >
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                Calculate Proportion Percentage
              </Text>

              <CalcInputField
                label="Part Value (X)"
                keyboardType="numeric"
                value={m2Val}
                onChangeText={setM2Val}
              />

              <CalcInputField
                label="Total Whole Value (Y)"
                keyboardType="numeric"
                value={m2Total}
                onChangeText={setM2Total}
              />
            </Card>

            <ResultHeroCard
              title="Resulting Percentage"
              value={res2()}
              subText={`${m2Val} out of ${m2Total}`}
              variant="primary"
              badgeText={`Ratio: ${(parseFloat(m2Val) / (parseFloat(m2Total) || 1)).toFixed(2)}`}
              badgeType="info"
              secondaryStats={[
                { label: 'Part (X)', value: m2Val },
                { label: 'Total (Y)', value: m2Total },
                { label: 'Percentage', value: res2() },
              ]}
            />

            <FormulaInfoCard
              title="Proportion Percentage Formula"
              formula="Percentage = (Part / Total) × 100"
              explanation="Calculates the fractional relationship of a sub-amount compared to the complete sum as a standardized percentage out of 100."
            />
          </>
        )}

        {/* TAB 3: Percentage Change */}
        {activeTab === 'percent_change' && (
          <>
            <Card
              style={[
                styles.card,
                {
                  backgroundColor: theme.colors.surfaceCard,
                  borderColor: theme.colors.borderSubtle,
                },
              ]}
            >
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                Initial & Final Values
              </Text>

              <CalcInputField
                label="Initial Value (From)"
                keyboardType="numeric"
                value={m3Initial}
                onChangeText={setM3Initial}
              />

              <CalcInputField
                label="Final Value (To)"
                keyboardType="numeric"
                value={m3Final}
                onChangeText={setM3Final}
              />
            </Card>

            <ResultHeroCard
              title={changeResult.isIncrease ? 'Percentage Increase' : 'Percentage Decrease'}
              value={changeResult.pct}
              subText={`From ${m3Initial} to ${m3Final}`}
              variant={changeResult.isIncrease ? 'success' : 'danger'}
              badgeText={`Absolute Change: ${changeResult.diff}`}
              badgeType={changeResult.isIncrease ? 'success' : 'danger'}
              secondaryStats={[
                { label: 'Initial', value: m3Initial },
                { label: 'Final', value: m3Final },
                { label: 'Difference', value: changeResult.diff },
              ]}
            />

            <FormulaInfoCard
              title="Percentage Change Formula"
              formula="Change % = [(Final – Initial) / Initial] × 100"
              explanation="Positive result indicates growth or inflation, whereas a negative result denotes a depreciation or reduction from the baseline value."
            />
          </>
        )}
      </ScrollView>

      <CalculationHistoryModal
        visible={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
        onSelect={handleSelectHistory}
        onClearAll={clearHistory}
        onDeleteItem={deleteItem}
        toolName={tool?.name || 'Percentage Calculator'}
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
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
    marginBottom: 4,
  },
});
