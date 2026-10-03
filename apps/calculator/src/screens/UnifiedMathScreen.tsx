import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { ScreenContainer, Card } from '@dailyapps/ui';
import { useTheme } from '@dailyapps/theme';
import { CalculatorHeader } from '../components/CalculatorHeader';
import { SegmentedTabs } from '../components/SegmentedTabs';

interface UnifiedMathScreenProps {
  navigation: any;
  route?: any;
}

type MainTab = 'calculators' | 'tools';

interface MathTool {
  id: string;
  name: string;
  icon: string;
  description: string;
  route: string;
  initialMode?: string;
  color: string;
}

const MATH_TOOLS: MathTool[] = [
  {
    id: 'percentage',
    name: 'Percentage & Discount',
    icon: '🏷️',
    description: 'Calculate percentages, discounts & price changes',
    route: 'PercentageCalculator',
    color: '#10B981',
  },
  {
    id: 'lcm_hcf',
    name: 'LCM & HCF',
    icon: '🔢',
    description: 'Least common multiple & highest common factor',
    route: 'MathToolsCalculator',
    initialMode: 'lcm_hcf',
    color: '#3B82F6',
  },
  {
    id: 'prime',
    name: 'Prime Numbers & Factors',
    icon: '⭐',
    description: 'Check primes, factorize & find divisors',
    route: 'MathToolsCalculator',
    initialMode: 'prime',
    color: '#8B5CF6',
  },
  {
    id: 'fraction',
    name: 'Fraction Calculator',
    icon: '½',
    description: 'Add, subtract, multiply & simplify fractions',
    route: 'MathToolsCalculator',
    initialMode: 'fraction',
    color: '#EC4899',
  },
  {
    id: 'ratio',
    name: 'Ratio & Proportion',
    icon: '⚖️',
    description: 'Simplify ratios & solve proportions',
    route: 'MathToolsCalculator',
    initialMode: 'ratio',
    color: '#F59E0B',
  },
  {
    id: 'average',
    name: 'Average & Statistics',
    icon: '📊',
    description: 'Mean, median, mode & range calculator',
    route: 'MathToolsCalculator',
    initialMode: 'average',
    color: '#06B6D4',
  },
  {
    id: 'random',
    name: 'Random Number Generator',
    icon: '🎰',
    description: 'Generate random numbers for lucky draws',
    route: 'MathToolsCalculator',
    initialMode: 'random',
    color: '#EF4444',
  },
  {
    id: 'factorial',
    name: 'Factorial & Permutations',
    icon: '❗',
    description: 'Calculate n!, nPr & nCr combinations',
    route: 'MathToolsCalculator',
    initialMode: 'factorial',
    color: '#14B8A6',
  },
  {
    id: 'probability',
    name: 'Probability Calculator',
    icon: '🎲',
    description: 'Calculate probability, odds & chances',
    route: 'MathToolsCalculator',
    initialMode: 'probability',
    color: '#A855F7',
  },
  {
    id: 'quadratic',
    name: 'Algebra & Equations',
    icon: '📐',
    description: 'Solve quadratic equations & find roots',
    route: 'AdvancedMathCalculator',
    initialMode: 'quadratic',
    color: '#6366F1',
  },
];

export const UnifiedMathScreen: React.FC<UnifiedMathScreenProps> = ({
  navigation,
  route,
}) => {
  const theme = useTheme();
  const tool = route?.params?.tool;

  const [mainTab, setMainTab] = useState<MainTab>('calculators');

  return (
    <ScreenContainer safeArea withPadding={false}>
      {/* Header */}
      <CalculatorHeader
        title="Math Hub"
        subtitle="All-in-one calculators & math tools"
        icon="➗"
        category="🧮 Math"
        toolId={tool?.id || 'math_hub'}
        onBack={() => navigation.goBack()}
      />

      {/* Main Tabs: Calculators vs Tools */}
      <View style={[styles.mainTabsContainer, { backgroundColor: theme.colors.background }]}>
        <SegmentedTabs
          activeTab={mainTab}
          onTabChange={(k) => setMainTab(k as MainTab)}
          tabs={[
            { key: 'calculators', label: 'Calculators', icon: '🔢' },
            { key: 'tools', label: 'Math Tools', icon: '🛠️' },
          ]}
        />
      </View>

      {/* Tab 1: Calculators (Basic & Scientific Options) */}
      {mainTab === 'calculators' && (
        <ScrollView
          style={styles.calculatorContainer}
          contentContainerStyle={styles.calculatorContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Quick access to calculators */}
          <View style={styles.calculatorGrid}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate('BasicCalculator', {
                  tool: { id: 'basic_calc', name: 'Basic Calculator', icon: '➗' },
                });
              }}
              style={[
                styles.calculatorCard,
                {
                  backgroundColor: theme.isDark ? '#1E40AF' : '#DBEAFE',
                  borderColor: theme.isDark ? '#3B82F6' : '#93C5FD',
                },
              ]}
            >
              <Text style={styles.calculatorCardIcon}>➗</Text>
              <Text style={[styles.calculatorCardTitle, { color: theme.isDark ? '#fff' : '#1E40AF' }]}>
                Basic Calculator
              </Text>
              <Text style={[styles.calculatorCardDesc, { color: theme.isDark ? '#BFDBFE' : '#3B82F6' }]}>
                Standard arithmetic with memory & history
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate('ScientificCalculator', {
                  tool: { id: 'scientific_calc', name: 'Scientific Calculator', icon: '🔬' },
                });
              }}
              style={[
                styles.calculatorCard,
                {
                  backgroundColor: theme.isDark ? '#5B21B6' : '#EDE9FE',
                  borderColor: theme.isDark ? '#8B5CF6' : '#C4B5FD',
                },
              ]}
            >
              <Text style={styles.calculatorCardIcon}>🔬</Text>
              <Text style={[styles.calculatorCardTitle, { color: theme.isDark ? '#fff' : '#5B21B6' }]}>
                Scientific Calculator
              </Text>
              <Text style={[styles.calculatorCardDesc, { color: theme.isDark ? '#DDD6FE' : '#7C3AED' }]}>
                Trig, logarithms, powers & radians
              </Text>
            </TouchableOpacity>
          </View>

          {/* Info card */}
          <Card
            style={[
              styles.infoCard,
              {
                backgroundColor: theme.isDark ? 'rgba(251, 191, 36, 0.1)' : '#FEF3C7',
                borderColor: theme.isDark ? 'rgba(251, 191, 36, 0.3)' : '#FCD34D',
              },
            ]}
          >
            <Text style={styles.infoIcon}>💡</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.infoTitle, { color: '#F59E0B' }]}>
                Pro Tip
              </Text>
              <Text style={[styles.infoText, { color: theme.colors.text }]}>
                Long press on calculator results to copy them to clipboard. Use memory functions (M+, M-, MR, MC) to store intermediate values.
              </Text>
            </View>
          </Card>
        </ScrollView>
      )}

      {/* Tab 2: Math Tools List */}
      {mainTab === 'tools' && (
        <ScrollView
          style={styles.toolsScrollView}
          contentContainerStyle={styles.toolsScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.toolsGrid}>
            {MATH_TOOLS.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                onPress={() => {
                  navigation.navigate(item.route, {
                    tool: { id: item.id, name: item.name, icon: item.icon },
                    defaultMode: item.initialMode,
                  });
                }}
                style={[
                  styles.toolCard,
                  {
                    backgroundColor: theme.colors.surfaceCard,
                    borderColor: theme.colors.borderSubtle,
                  },
                ]}
              >
                {/* Icon badge */}
                <View
                  style={[
                    styles.toolIconBadge,
                    {
                      backgroundColor: theme.isDark
                        ? `${item.color}20`
                        : `${item.color}15`,
                      borderColor: theme.isDark ? `${item.color}40` : `${item.color}30`,
                    },
                  ]}
                >
                  <Text style={styles.toolIcon}>{item.icon}</Text>
                </View>

                {/* Content */}
                <View style={styles.toolContent}>
                  <Text style={[styles.toolName, { color: theme.colors.text }]}>
                    {item.name}
                  </Text>
                  <Text
                    style={[styles.toolDescription, { color: theme.colors.textMuted }]}
                    numberOfLines={2}
                  >
                    {item.description}
                  </Text>
                </View>

                {/* Arrow indicator */}
                <View style={styles.toolArrow}>
                  <Text style={[styles.toolArrowText, { color: item.color }]}>›</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer info */}
          <View style={[styles.footerInfo, { backgroundColor: theme.colors.surfaceSubtle }]}>
            <Text style={styles.footerEmoji}>✨</Text>
            <Text style={[styles.footerText, { color: theme.colors.textMuted }]}>
              {MATH_TOOLS.length} powerful math tools at your fingertips
            </Text>
          </View>
        </ScrollView>
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  mainTabsContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  calculatorContainer: {
    flex: 1,
  },
  calculatorContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  calculatorGrid: {
    gap: 14,
  },
  calculatorCard: {
    padding: 20,
    borderRadius: 18,
    borderWidth: 2,
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  calculatorCardIcon: {
    fontSize: 48,
  },
  calculatorCardTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },
  calculatorCardDesc: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  infoCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: 28,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 19,
  },
  toolsScrollView: {
    flex: 1,
  },
  toolsScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  toolsGrid: {
    gap: 12,
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  toolIconBadge: {
    width: 54,
    height: 54,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolIcon: {
    fontSize: 28,
  },
  toolContent: {
    flex: 1,
    gap: 4,
  },
  toolName: {
    fontSize: 16,
    fontWeight: '700',
  },
  toolDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  toolArrow: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolArrowText: {
    fontSize: 28,
    fontWeight: '300',
  },
  footerInfo: {
    marginTop: 20,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    gap: 8,
  },
  footerEmoji: {
    fontSize: 32,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});
