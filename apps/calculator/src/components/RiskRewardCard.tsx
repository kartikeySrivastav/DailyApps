import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '@dailyapps/ui';
import { useTheme } from '@dailyapps/theme';
import { CalcInputField } from './CalcInputField';

interface RiskRewardCardProps {
  entryPrice: number;
  currencySymbol: string;
  onCalculate?: (stopLoss: number, target: number) => void;
}

export const RiskRewardCard: React.FC<RiskRewardCardProps> = ({
  entryPrice,
  currencySymbol,
  onCalculate: _onCalculate,
}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [stopLoss, setStopLoss] = useState('');
  const [target, setTarget] = useState('');

  const sl = parseFloat(stopLoss) || 0;
  const tgt = parseFloat(target) || 0;

  const riskAmount = entryPrice - sl;
  const rewardAmount = tgt - entryPrice;
  const riskRewardRatio = riskAmount > 0 ? rewardAmount / riskAmount : 0;
  
  const riskPercent = entryPrice > 0 ? (riskAmount / entryPrice) * 100 : 0;
  const rewardPercent = entryPrice > 0 ? (rewardAmount / entryPrice) * 100 : 0;

  const isValidSetup = sl > 0 && tgt > 0 && tgt > entryPrice && sl < entryPrice;
  const isGoodRR = riskRewardRatio >= 2;

  const handleReset = () => {
    setStopLoss('');
    setTarget('');
  };

  const handlePreset = (rrRatio: number) => {
    if (entryPrice > 0) {
      const suggestedRisk = entryPrice * 0.02; // 2% risk
      const suggestedSL = entryPrice - suggestedRisk;
      const suggestedReward = suggestedRisk * rrRatio;
      const suggestedTarget = entryPrice + suggestedReward;
      
      setStopLoss(suggestedSL.toFixed(2));
      setTarget(suggestedTarget.toFixed(2));
    }
  };

  return (
    <Card
      style={[
        styles.card,
        { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle },
      ]}
    >
      {/* Header */}
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.iconBox,
              {
                backgroundColor: theme.isDark ? 'rgba(245, 158, 11, 0.15)' : '#FEF3C7',
                borderColor: theme.isDark ? 'rgba(245, 158, 11, 0.3)' : '#FCD34D',
              },
            ]}
          >
            <Text style={styles.icon}>🎯</Text>
          </View>
          <View style={styles.headerTextCol}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Risk-Reward Calculator
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
              {isExpanded ? 'Set your stop-loss & target' : 'Plan your trade setup'}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.expandBtn,
            {
              backgroundColor: isExpanded
                ? theme.isDark ? 'rgba(245, 158, 11, 0.2)' : '#FEF3C7'
                : theme.isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9',
            },
          ]}
        >
          <Text style={[styles.expandBtnText, { color: isExpanded ? '#F59E0B' : theme.colors.textMuted }]}>
            {isExpanded ? '✕' : '+'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Expanded Content */}
      {isExpanded && (
        <View style={styles.expandedContent}>
          {/* Quick Presets */}
          <View style={styles.presetsRow}>
            <Text style={[styles.presetsLabel, { color: theme.colors.textMuted }]}>
              Quick Setup:
            </Text>
            <View style={styles.presetBtns}>
              {[
                { label: '1:2', ratio: 2 },
                { label: '1:3', ratio: 3 },
                { label: '1:5', ratio: 5 },
              ].map((preset) => (
                <TouchableOpacity
                  key={preset.ratio}
                  onPress={() => handlePreset(preset.ratio)}
                  style={[
                    styles.presetBtn,
                    {
                      backgroundColor: theme.isDark ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF',
                      borderColor: theme.isDark ? 'rgba(59, 130, 246, 0.3)' : '#BFDBFE',
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.presetBtnText, { color: '#3B82F6' }]}>
                    {preset.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Inputs */}
          <View style={styles.inputsRow}>
            <View style={styles.flex1}>
              <CalcInputField
                label="Stop Loss"
                prefix={currencySymbol}
                keyboardType="numeric"
                value={stopLoss}
                onChangeText={setStopLoss}
                placeholder={(entryPrice * 0.98).toFixed(2)}
              />
            </View>

            <View style={styles.flex1}>
              <CalcInputField
                label="Target Price"
                prefix={currencySymbol}
                keyboardType="numeric"
                value={target}
                onChangeText={setTarget}
                placeholder={(entryPrice * 1.04).toFixed(2)}
              />
            </View>
          </View>

          <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
            <Text style={[styles.resetText, { color: theme.colors.primary }]}>↺ Reset</Text>
          </TouchableOpacity>

          {/* Results */}
          {isValidSetup && (
            <View
              style={[
                styles.resultBox,
                {
                  backgroundColor: isGoodRR
                    ? theme.isDark ? 'rgba(16, 185, 129, 0.1)' : '#ECFDF5'
                    : theme.isDark ? 'rgba(245, 158, 11, 0.1)' : '#FEF3C7',
                  borderColor: isGoodRR
                    ? theme.isDark ? 'rgba(16, 185, 129, 0.3)' : '#6EE7B7'
                    : theme.isDark ? 'rgba(245, 158, 11, 0.3)' : '#FCD34D',
                },
              ]}
            >
              {/* R:R Ratio Badge */}
              <View style={styles.rrHeader}>
                <Text style={[styles.rrLabel, { color: theme.colors.textMuted }]}>
                  Risk-Reward Ratio
                </Text>
                <View
                  style={[
                    styles.rrBadge,
                    {
                      backgroundColor: isGoodRR
                        ? theme.isDark ? '#065F46' : '#10B981'
                        : theme.isDark ? '#92400E' : '#F59E0B',
                    },
                  ]}
                >
                  <Text style={styles.rrBadgeText}>
                    1:{riskRewardRatio.toFixed(2)}
                  </Text>
                </View>
              </View>

              {/* Stats Grid */}
              <View style={styles.statsGrid}>
                <View style={styles.statCol}>
                  <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>
                    Risk per trade
                  </Text>
                  <Text style={[styles.statValue, { color: '#EF4444' }]}>
                    -{currencySymbol}{riskAmount.toFixed(2)}
                  </Text>
                  <Text style={[styles.statPercent, { color: '#EF4444' }]}>
                    ({riskPercent.toFixed(2)}%)
                  </Text>
                </View>

                <View style={[styles.statDivider, { backgroundColor: theme.colors.borderSubtle }]} />

                <View style={styles.statCol}>
                  <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>
                    Reward potential
                  </Text>
                  <Text style={[styles.statValue, { color: '#10B981' }]}>
                    +{currencySymbol}{rewardAmount.toFixed(2)}
                  </Text>
                  <Text style={[styles.statPercent, { color: '#10B981' }]}>
                    (+{rewardPercent.toFixed(2)}%)
                  </Text>
                </View>
              </View>

              {/* Trading Advice */}
              <View style={styles.adviceBox}>
                <Text style={[styles.adviceText, { color: theme.colors.textMuted }]}>
                  {isGoodRR
                    ? '✅ Excellent setup! R:R ratio above 1:2 is favorable for risk management.'
                    : '⚠️ Consider improving your R:R ratio. Target at least 1:2 for better risk management.'}
                </Text>
              </View>
            </View>
          )}

          {!isValidSetup && (stopLoss || target) && (
            <View
              style={[
                styles.warningBox,
                {
                  backgroundColor: theme.isDark ? 'rgba(239, 68, 68, 0.1)' : '#FEE2E2',
                  borderColor: theme.isDark ? 'rgba(239, 68, 68, 0.3)' : '#FCA5A5',
                },
              ]}
            >
              <Text style={[styles.warningText, { color: '#EF4444' }]}>
                ⚠️ Invalid setup: Stop-loss must be below entry price and target must be above entry price.
              </Text>
            </View>
          )}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
  },
  headerTextCol: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  expandBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandBtnText: {
    fontSize: 18,
    fontWeight: '700',
  },
  expandedContent: {
    marginTop: 16,
    gap: 12,
  },
  presetsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  presetsLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  presetBtns: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  presetBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  presetBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  inputsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  resetBtn: {
    alignSelf: 'flex-end',
  },
  resetText: {
    fontSize: 12,
    fontWeight: '700',
  },
  resultBox: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  rrHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rrLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  rrBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  rrBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  statsGrid: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    marginHorizontal: 12,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 2,
  },
  statPercent: {
    fontSize: 11,
    fontWeight: '700',
  },
  adviceBox: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  adviceText: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 16,
    textAlign: 'center',
  },
  warningBox: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  warningText: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 16,
  },
});
