import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Card } from '@dailyapps/ui';
import { useTheme } from '@dailyapps/theme';

interface TradingProfitChartProps {
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  breakEvenPrice: number;
  netProfit: number;
  totalCharges: number;
  currencySymbol: string;
}

export const TradingProfitChart: React.FC<TradingProfitChartProps> = ({
  buyPrice,
  sellPrice,
  quantity,
  breakEvenPrice,
  netProfit,
  totalCharges,
  currencySymbol,
}) => {
  const theme = useTheme();

  // Stop loss selector state
  // Default to 1:2 R:R or 2% below buy price
  const initialSL =
    sellPrice > buyPrice
      ? (buyPrice - (sellPrice - buyPrice) / 2).toFixed(2)
      : (buyPrice * 0.97).toFixed(2);

  const [stopLossInput, setStopLossInput] = useState(initialSL);
  const [activePreset, setActivePreset] = useState<'1:2' | '1:3' | '2%' | 'custom'>('1:2');
  const [showBreakeven, setShowBreakeven] = useState(true);
  const [chartView, setChartView] = useState<'candles' | 'zones'>('candles');
  const [isEditingSL, setIsEditingSL] = useState(false);

  const isProfit = netProfit >= 0;
  const slPrice = Math.max(0, parseFloat(stopLossInput) || buyPrice * 0.97);

  // Math for Risk, Reward and Percentages
  const rewardPerShare = Math.max(0, sellPrice - buyPrice);
  const riskPerShare = Math.max(0, buyPrice - slPrice);
  const totalReward = rewardPerShare * quantity;
  const totalRisk = riskPerShare * quantity;
  const rewardPct = buyPrice > 0 ? (rewardPerShare / buyPrice) * 100 : 0;
  const riskPct = buyPrice > 0 ? (riskPerShare / buyPrice) * 100 : 0;
  const rrRatio = riskPerShare > 0 ? rewardPerShare / riskPerShare : 0;

  // Chart Y-scale calculations (clamp to 10% - 90% space so lines don't clip)
  const allPrices = [buyPrice, sellPrice, slPrice];
  if (showBreakeven && breakEvenPrice > 0) allPrices.push(breakEvenPrice);

  const minP = Math.min(...allPrices.filter((p) => p > 0));
  const maxP = Math.max(...allPrices);
  const spread = Math.max(1, maxP - minP);

  // Add 15% visual headroom top and bottom
  const chartMin = minP - spread * 0.15;
  const chartMax = maxP + spread * 0.15;
  const chartRange = chartMax - chartMin;

  const getYPercent = (price: number) => {
    if (chartRange <= 0) return 50;
    const pct = ((price - chartMin) / chartRange) * 100;
    return Math.max(8, Math.min(92, pct));
  };

  const targetY = getYPercent(sellPrice);
  const entryRawY = getYPercent(buyPrice);
  // Guarantee vertical clearance between Target and Entry on the right side
  const entryY = isProfit
    ? Math.min(targetY - 10, entryRawY)
    : Math.max(targetY + 10, entryRawY);
  const beY = getYPercent(breakEvenPrice);
  const slY = getYPercent(slPrice);

  // Zone bounds
  const profitZoneBottom = Math.min(targetY, entryY);
  const profitZoneHeight = Math.max(2, Math.abs(targetY - entryY));

  const lossZoneBottom = Math.min(entryY, slY);
  const lossZoneHeight = Math.max(2, Math.abs(entryY - slY));

  const formatPrice = (val: number) => {
    return `${currencySymbol}${val.toFixed(2)}`;
  };

  const formatCurrency = (val: number, decimals: number = 0) => {
    return `${currencySymbol}${val.toLocaleString('en-IN', {
      maximumFractionDigits: decimals,
    })}`;
  };

  const handleSelectPreset = (preset: '1:2' | '1:3' | '2%') => {
    setActivePreset(preset);
    setIsEditingSL(false);
    if (preset === '1:2') {
      const rew = Math.max(0, sellPrice - buyPrice);
      const sl = rew > 0 ? buyPrice - rew / 2 : buyPrice * 0.98;
      setStopLossInput(Math.max(0, sl).toFixed(2));
    } else if (preset === '1:3') {
      const rew = Math.max(0, sellPrice - buyPrice);
      const sl = rew > 0 ? buyPrice - rew / 3 : buyPrice * 0.98;
      setStopLossInput(Math.max(0, sl).toFixed(2));
    } else if (preset === '2%') {
      setStopLossInput((buyPrice * 0.98).toFixed(2));
    }
  };

  // Generate realistic 7-period price candles with volume like Zerodha & Groww
  const candles = useMemo(() => {
    const ep = buyPrice;
    const tp = sellPrice;
    const sl = slPrice;
    const diff = Math.max(1, tp - ep);
    const risk = Math.max(1, ep - sl);

    return [
      // 1. Initial base consolidation
      {
        open: ep - risk * 0.2,
        close: ep - risk * 0.35,
        high: ep - risk * 0.05,
        low: ep - risk * 0.45,
        volume: 0.35,
      },
      // 2. Dip testing support near SL
      {
        open: ep - risk * 0.35,
        close: ep - risk * 0.65,
        high: ep - risk * 0.25,
        low: ep - risk * 0.85,
        volume: 0.5,
      },
      // 3. Hammer reversal bounce candle
      {
        open: ep - risk * 0.65,
        close: ep - risk * 0.2,
        high: ep - risk * 0.1,
        low: ep - risk * 0.75,
        volume: 0.7,
      },
      // 4. Momentum breakout crossing Entry
      {
        open: ep - risk * 0.2,
        close: ep + diff * 0.15,
        high: ep + diff * 0.22,
        low: ep - risk * 0.25,
        volume: 0.85,
      },
      // 5. Mild pullback testing Entry as support
      {
        open: ep + diff * 0.15,
        close: ep + diff * 0.06,
        high: ep + diff * 0.2,
        low: ep - risk * 0.04,
        volume: 0.4,
      },
      // 6. Strong bullish thrust pushing through Break-Even
      {
        open: ep + diff * 0.06,
        close: ep + diff * 0.6,
        high: ep + diff * 0.7,
        low: ep + diff * 0.02,
        volume: 0.95,
      },
      // 7. Latest candle reaching Target with live pulse
      {
        open: ep + diff * 0.6,
        close: isProfit ? tp : ep - risk * 0.3,
        high: isProfit ? tp * 1.006 : ep + diff * 0.65,
        low: isProfit ? ep + diff * 0.52 : sl * 0.99,
        volume: 1.0,
      },
    ];
  }, [buyPrice, sellPrice, slPrice, isProfit]);

  // Non-overlapping Price Badges for the Right Price Axis (exact Zerodha/Groww scale)
  const axisLevels = useMemo(() => {
    const items = [
      {
        id: 'sl',
        label: formatPrice(slPrice),
        bg: '#EF4444',
        textColor: '#FFFFFF',
        rawY: slY,
      },
      {
        id: 'entry',
        label: formatPrice(buyPrice),
        bg: '#3B82F6',
        textColor: '#FFFFFF',
        rawY: entryY,
      },
      ...(showBreakeven && breakEvenPrice > 0
        ? [
            {
              id: 'be',
              label: formatPrice(breakEvenPrice),
              bg: '#F59E0B',
              textColor: '#000000',
              rawY: beY,
            },
          ]
        : []),
      {
        id: 'target',
        label: formatPrice(sellPrice),
        bg: isProfit ? '#10B981' : '#EF4444',
        textColor: '#FFFFFF',
        rawY: targetY,
      },
    ];

    // Sort by rawY ascending
    items.sort((a, b) => a.rawY - b.rawY);

    // Enforce minimum vertical clearance of 8% between badges to eliminate overlap
    const adjusted = items.map((item) => ({ ...item, displayY: item.rawY }));
    for (let i = 1; i < adjusted.length; i++) {
      if (adjusted[i].displayY - adjusted[i - 1].displayY < 8) {
        adjusted[i].displayY = Math.min(93, adjusted[i - 1].displayY + 8);
      }
    }
    for (let i = adjusted.length - 2; i >= 0; i--) {
      if (adjusted[i + 1].displayY - adjusted[i].displayY < 8) {
        adjusted[i].displayY = Math.max(7, adjusted[i + 1].displayY - 8);
      }
    }

    return adjusted;
  }, [slPrice, buyPrice, breakEvenPrice, sellPrice, showBreakeven, isProfit, slY, entryY, beY, targetY, currencySymbol]);

  return (
    <Card
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surfaceCard,
          borderColor: theme.colors.borderSubtle,
        },
      ]}
    >
      {/* Header: Title + Mode Switch [Candles | Zones] + BE Toggle */}
      <View style={styles.header}>
        <View style={styles.headerTitleCol}>
          <Text numberOfLines={1} style={[styles.title, { color: theme.colors.text }]}>
            📈 Trade Setup
          </Text>
          <Text numberOfLines={1} style={[styles.subtitle, { color: theme.colors.textMuted }]}>
            Risk vs Reward
          </Text>
        </View>

        <View style={styles.headerControls}>
          {/* Clear Segmented Switch: Candles vs Zones */}
          <View
            style={[
              styles.segmentPill,
              {
                backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9',
                borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => setChartView('candles')}
              activeOpacity={0.7}
              style={[
                styles.segmentItem,
                chartView === 'candles' && {
                  backgroundColor: theme.isDark ? 'rgba(59, 130, 246, 0.25)' : '#DBEAFE',
                },
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  {
                    color: chartView === 'candles' ? '#3B82F6' : theme.colors.textMuted,
                    fontWeight: chartView === 'candles' ? '800' : '600',
                  },
                ]}
              >
                Candles
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setChartView('zones')}
              activeOpacity={0.7}
              style={[
                styles.segmentItem,
                chartView === 'zones' && {
                  backgroundColor: theme.isDark ? 'rgba(59, 130, 246, 0.25)' : '#DBEAFE',
                },
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  {
                    color: chartView === 'zones' ? '#3B82F6' : theme.colors.textMuted,
                    fontWeight: chartView === 'zones' ? '800' : '600',
                  },
                ]}
              >
                Zones
              </Text>
            </TouchableOpacity>
          </View>

          {/* BE Toggle */}
          <TouchableOpacity
            onPress={() => setShowBreakeven(!showBreakeven)}
            activeOpacity={0.7}
            style={[
              styles.beToggleBtn,
              {
                backgroundColor: showBreakeven
                  ? theme.isDark ? 'rgba(245, 158, 11, 0.18)' : '#FEF3C7'
                  : theme.isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9',
                borderColor: showBreakeven ? '#F59E0B' : 'transparent',
              },
            ]}
          >
            <Text
              style={[
                styles.beToggleText,
                { color: showBreakeven ? '#F59E0B' : theme.colors.textMuted },
              ]}
            >
              {showBreakeven ? 'BE: ON' : 'BE: OFF'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick SL Presets Bar */}
      <View style={styles.presetsSection}>
        <View style={styles.presetsHeaderRow}>
          <View style={styles.labelWithIcon}>
            <Text style={styles.slIcon}>🛑</Text>
            <Text style={[styles.presetsLabel, { color: theme.colors.text }]}>
              Stop-Loss Presets
            </Text>
          </View>
          <View style={styles.activePresetIndicator}>
            <Text style={[styles.activePresetHint, { color: theme.colors.textMuted }]}>
              Current SL:
            </Text>
            <Text style={[styles.activePresetValue, { color: '#EF4444' }]}>
              {formatPrice(slPrice)}
            </Text>
          </View>
        </View>

        <View style={styles.presetGroup}>
          {(['1:2', '1:3', '2%'] as const).map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => handleSelectPreset(p)}
              style={[
                styles.presetPill,
                activePreset === p && !isEditingSL && {
                  backgroundColor: theme.isDark ? 'rgba(59, 130, 246, 0.25)' : '#DBEAFE',
                  borderColor: '#3B82F6',
                },
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.presetText,
                  {
                    color:
                      activePreset === p && !isEditingSL
                        ? '#3B82F6'
                        : theme.colors.textMuted,
                  },
                ]}
              >
                {p === '2%' ? '-2% SL' : `${p} R:R`}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Custom SL Toggle */}
          <TouchableOpacity
            onPress={() => {
              setIsEditingSL(!isEditingSL);
              setActivePreset('custom');
            }}
            style={[
              styles.presetPill,
              isEditingSL && {
                backgroundColor: theme.isDark ? 'rgba(239, 68, 68, 0.25)' : '#FEE2E2',
                borderColor: '#EF4444',
              },
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.presetText,
                { color: isEditingSL ? '#EF4444' : theme.colors.textMuted },
              ]}
            >
              ✏️ Custom
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Editable SL Field when custom is open */}
      {isEditingSL && (
        <View
          style={[
            styles.customInputRow,
            {
              backgroundColor: theme.isDark ? 'rgba(239, 68, 68, 0.08)' : '#FEF2F2',
              borderColor: theme.isDark ? 'rgba(239, 68, 68, 0.25)' : '#FECACA',
            },
          ]}
        >
          <Text style={[styles.customInputLabel, { color: theme.colors.text }]}>
            Set Stop-Loss Price:
          </Text>
          <TextInput
            keyboardType="numeric"
            value={stopLossInput}
            onChangeText={setStopLossInput}
            style={[
              styles.customInput,
              {
                color: '#EF4444',
                backgroundColor: theme.colors.surfaceCard,
                borderColor: theme.colors.borderSubtle,
              },
            ]}
          />
        </View>
      )}

      {/* REAL TRADING TERMINAL CHART CANVAS (Zerodha Kite & Groww Architecture) */}
      <View
        style={[
          styles.chartCanvas,
          {
            backgroundColor: theme.isDark ? '#080C14' : '#F8FAFC',
            borderColor: theme.colors.borderSubtle,
          },
        ]}
      >
        {/* LEFT: MAIN CHART PLOT AREA */}
        <View style={styles.chartPlotArea}>
          {/* Subtle Background Reference Grid Lines */}
          {['25%', '50%', '75%'].map((topPct, idx) => (
            <View
              key={idx}
              style={[
                styles.gridHLine,
                {
                  top: topPct as any,
                  borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                },
              ]}
            />
          ))}

          {/* Top-Left Terminal Indicator Badge */}
          <View
            style={[
              styles.terminalWatermark,
              {
                backgroundColor: theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                borderColor: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              },
            ]}
          >
            <View style={[styles.liveDot, { backgroundColor: isProfit ? '#10B981' : '#EF4444' }]} />
            <Text style={[styles.terminalWatermarkText, { color: theme.colors.textMuted }]}>
              {chartView === 'candles' ? '1D • CANDLES' : 'PROFIT/LOSS ZONES'} | R:R 1:{rrRatio.toFixed(1)}
            </Text>
          </View>

          {/* 🟢/🔴 SHADED ZONES (When in Zones mode) */}
          {chartView === 'zones' && (
            <>
              <View
                style={[
                  styles.zoneBox,
                  {
                    bottom: `${profitZoneBottom}%`,
                    height: `${profitZoneHeight}%`,
                    backgroundColor: isProfit
                      ? 'rgba(16, 185, 129, 0.08)'
                      : 'rgba(239, 68, 68, 0.08)',
                    borderLeftColor: isProfit ? '#10B981' : '#EF4444',
                  },
                ]}
              />
              <View
                style={[
                  styles.zoneBox,
                  {
                    bottom: `${lossZoneBottom}%`,
                    height: `${lossZoneHeight}%`,
                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                    borderLeftColor: '#EF4444',
                  },
                ]}
              />
              {/* Payoff Trajectory Milestone Nodes */}
              <View style={[styles.payoffNode, { left: '15%', bottom: `${slY}%`, backgroundColor: '#EF4444' }]} />
              <View style={[styles.payoffNode, { left: '50%', bottom: `${entryY}%`, backgroundColor: '#3B82F6' }]} />
              <View style={[styles.payoffNode, { left: '85%', bottom: `${targetY}%`, backgroundColor: isProfit ? '#10B981' : '#EF4444' }]} />
            </>
          )}

          {/* 🕯️ REALISTIC CANDLESTICKS (When in Candles mode) */}
          {chartView === 'candles' && (
            <View style={styles.candlesContainer} pointerEvents="none">
              {candles.map((candle, idx) => {
                const isGreen = candle.close >= candle.open;
                const candleColor = isGreen ? '#10B981' : '#EF4444';
                const highY = getYPercent(candle.high);
                const lowY = getYPercent(candle.low);
                const openY = getYPercent(candle.open);
                const closeY = getYPercent(candle.close);

                const bodyBottom = Math.min(openY, closeY);
                const bodyHeight = Math.max(3, Math.abs(closeY - openY));
                const wickBottom = lowY;
                const wickHeight = Math.max(2, highY - lowY);
                const isLast = idx === candles.length - 1;

                // 7 candles evenly spaced across the plot canvas
                const leftPercent = 8 + idx * 13.5;

                return (
                  <View
                    key={idx}
                    style={[styles.candleItem, { left: `${leftPercent}%` }]}
                  >
                    {/* Wick */}
                    <View
                      style={[
                        styles.candleWick,
                        {
                          bottom: `${wickBottom}%`,
                          height: `${wickHeight}%`,
                          backgroundColor: candleColor,
                        },
                      ]}
                    />
                    {/* Candle Body */}
                    <View
                      style={[
                        styles.candleBody,
                        {
                          bottom: `${bodyBottom}%`,
                          height: `${bodyHeight}%`,
                          backgroundColor: isGreen
                            ? theme.isDark ? '#065F46' : '#10B981'
                            : theme.isDark ? '#991B1B' : '#EF4444',
                          borderColor: candleColor,
                        },
                      ]}
                    />

                    {/* Live Market Pulsing Dot on Current/Last Candle */}
                    {isLast && (
                      <View
                        style={[
                          styles.livePriceBeacon,
                          {
                            bottom: `${closeY}%`,
                            transform: [{ translateY: 6 }],
                          },
                        ]}
                      >
                        <View style={[styles.pulseRing, { borderColor: candleColor }]} />
                        <View style={[styles.pulseCore, { backgroundColor: candleColor }]} />
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}

          {/* CLEAN LEVEL HORIZONTAL REFERENCE LINES (Full width, zero clutter, exact Zerodha / Groww look) */}
          {/* 1. 🟢 Target Level Line */}
          <View style={[styles.cleanLevelLine, { bottom: `${targetY}%` }]}>
            <View style={[styles.levelLineStroke, { backgroundColor: isProfit ? '#10B981' : '#EF4444' }]} />
          </View>

          {/* 2. 🟡 Break-Even Level Line (Dashed) */}
          {showBreakeven && (
            <View style={[styles.cleanLevelLine, { bottom: `${beY}%` }]}>
              <View style={[styles.levelLineStrokeDashed, { borderColor: '#F59E0B' }]} />
            </View>
          )}

          {/* 3. 🔵 Entry Level Line */}
          <View style={[styles.cleanLevelLine, { bottom: `${entryY}%` }]}>
            <View style={[styles.levelLineStroke, { backgroundColor: '#3B82F6' }]} />
          </View>

          {/* 4. 🔴 Stop-Loss Level Line */}
          <View style={[styles.cleanLevelLine, { bottom: `${slY}%` }]}>
            <View style={[styles.levelLineStroke, { backgroundColor: '#EF4444' }]} />
          </View>
        </View>

        {/* RIGHT: DEDICATED PRICE AXIS SCALE (Zerodha Kite / Groww style price tags) */}
        <View
          style={[
            styles.chartPriceAxis,
            {
              backgroundColor: theme.isDark ? '#060A12' : '#F1F5F9',
              borderLeftColor: theme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
            },
          ]}
        >
          {axisLevels.map((lvl) => (
            <View
              key={lvl.id}
              style={[
                styles.axisPriceBadge,
                {
                  bottom: `${lvl.displayY}%`,
                  backgroundColor: lvl.bg,
                },
              ]}
            >
              <Text
                style={[styles.axisPriceText, { color: lvl.textColor }]}
                numberOfLines={1}
              >
                {lvl.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* 📊 Trade Levels Breakdown Ladder */}
      <View
        style={[
          styles.positionLadder,
          {
            backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC',
            borderColor: theme.colors.borderSubtle,
          },
        ]}
      >
        {/* Target */}
        <View style={styles.ladderRow}>
          <View style={styles.ladderLabelCol}>
            <View style={[styles.dotIndicator, { backgroundColor: isProfit ? '#10B981' : '#EF4444' }]} />
            <Text style={[styles.ladderTitle, { color: theme.colors.text }]}>Target Profit</Text>
          </View>
          <Text style={[styles.ladderPrice, { color: isProfit ? '#10B981' : '#EF4444' }]}>
            {formatPrice(sellPrice)}
          </Text>
          <View
            style={[
              styles.ladderBadge,
              {
                backgroundColor: isProfit
                  ? (theme.isDark ? 'rgba(16,185,129,0.18)' : '#D1FAE5')
                  : (theme.isDark ? 'rgba(239,68,68,0.18)' : '#FEE2E2'),
              },
            ]}
          >
            <Text style={[styles.ladderBadgeText, { color: isProfit ? '#10B981' : '#EF4444' }]}>
              {rewardPct >= 0 ? '+' : ''}{rewardPct.toFixed(1)}% (+{formatCurrency(totalReward)})
            </Text>
          </View>
        </View>

        {/* Break-Even (when enabled) */}
        {showBreakeven && (
          <View style={styles.ladderRow}>
            <View style={styles.ladderLabelCol}>
              <View style={[styles.dotIndicator, { backgroundColor: '#F59E0B' }]} />
              <Text style={[styles.ladderTitle, { color: theme.colors.text }]}>Break-Even</Text>
            </View>
            <Text style={[styles.ladderPrice, { color: '#F59E0B' }]}>
              {formatPrice(breakEvenPrice)}
            </Text>
            <View
              style={[
                styles.ladderBadge,
                {
                  backgroundColor: theme.isDark ? 'rgba(245,158,11,0.18)' : '#FEF3C7',
                },
              ]}
            >
              <Text style={[styles.ladderBadgeText, { color: '#F59E0B' }]}>
                +{formatCurrency(totalCharges, 0)} fees covered
              </Text>
            </View>
          </View>
        )}

        {/* Entry */}
        <View style={styles.ladderRow}>
          <View style={styles.ladderLabelCol}>
            <View style={[styles.dotIndicator, { backgroundColor: '#3B82F6' }]} />
            <Text style={[styles.ladderTitle, { color: theme.colors.text }]}>Entry Price</Text>
          </View>
          <Text style={[styles.ladderPrice, { color: '#3B82F6' }]}>
            {formatPrice(buyPrice)}
          </Text>
          <View
            style={[
              styles.ladderBadge,
              {
                backgroundColor: theme.isDark ? 'rgba(59,130,246,0.15)' : '#DBEAFE',
              },
            ]}
          >
            <Text style={[styles.ladderBadgeText, { color: '#3B82F6' }]}>
              Qty: {quantity} ({formatCurrency(buyPrice * quantity, 0)})
            </Text>
          </View>
        </View>

        {/* Stop-Loss */}
        <View style={styles.ladderRow}>
          <View style={styles.ladderLabelCol}>
            <View style={[styles.dotIndicator, { backgroundColor: '#EF4444' }]} />
            <Text style={[styles.ladderTitle, { color: theme.colors.text }]}>Stop-Loss</Text>
          </View>
          <Text style={[styles.ladderPrice, { color: '#EF4444' }]}>
            {formatPrice(slPrice)}
          </Text>
          <View
            style={[
              styles.ladderBadge,
              {
                backgroundColor: theme.isDark ? 'rgba(239,68,68,0.18)' : '#FEE2E2',
              },
            ]}
          >
            <Text style={[styles.ladderBadgeText, { color: '#EF4444' }]}>
              -{riskPct.toFixed(1)}% (-{formatCurrency(totalRisk)})
            </Text>
          </View>
        </View>
      </View>

      {/* Trade Metrics Footer Strip */}
      <View
        style={[
          styles.metricsStrip,
          {
            backgroundColor: theme.isDark
              ? 'rgba(255, 255, 255, 0.04)'
              : '#F1F5F9',
          },
        ]}
      >
        <View style={styles.metricCol}>
          <Text style={[styles.metricStripLabel, { color: theme.colors.textMuted }]}>
            Risk : Reward
          </Text>
          <Text
            style={[
              styles.metricStripValue,
              { color: rrRatio >= 2 ? '#10B981' : rrRatio >= 1 ? '#F59E0B' : '#EF4444' },
            ]}
          >
            1 : {rrRatio.toFixed(2)}
          </Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricCol}>
          <Text style={[styles.metricStripLabel, { color: theme.colors.textMuted }]}>
            Max Risk
          </Text>
          <Text style={[styles.metricStripValue, { color: '#EF4444' }]}>
            -{formatCurrency(totalRisk, 0)}
          </Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricCol}>
          <Text style={[styles.metricStripLabel, { color: theme.colors.textMuted }]}>
            Reward
          </Text>
          <Text style={[styles.metricStripValue, { color: '#10B981' }]}>
            +{formatCurrency(totalReward, 0)}
          </Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricCol}>
          <Text style={[styles.metricStripLabel, { color: theme.colors.textMuted }]}>
            Net In-Hand
          </Text>
          <Text
            style={[
              styles.metricStripValue,
              { color: isProfit ? '#10B981' : '#EF4444' },
            ]}
          >
            {isProfit ? '+' : ''}{formatCurrency(netProfit, 0)}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitleCol: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  segmentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    padding: 2,
    gap: 2,
  },
  segmentItem: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  segmentText: {
    fontSize: 10,
    letterSpacing: 0.2,
  },
  beToggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  beToggleText: {
    fontSize: 10,
    fontWeight: '800',
  },
  presetsSection: {
    marginBottom: 14,
    gap: 8,
  },
  presetsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  slIcon: {
    fontSize: 13,
  },
  presetsLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  activePresetIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  activePresetHint: {
    fontSize: 11,
    fontWeight: '500',
  },
  activePresetValue: {
    fontSize: 12,
    fontWeight: '800',
  },
  presetGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  presetPill: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetText: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  customInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  customInputLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  customInput: {
    width: 90,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'right',
  },
  chartCanvas: {
    height: 235,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 12,
  },
  chartPlotArea: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  terminalWatermark: {
    position: 'absolute',
    top: 7,
    left: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 4,
    borderWidth: 1,
    zIndex: 10,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  terminalWatermarkText: {
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  gridHLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderBottomWidth: 0.7,
    borderStyle: 'dashed',
    zIndex: 1,
  },
  zoneBox: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderLeftWidth: 2,
    zIndex: 2,
  },
  payoffNode: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    zIndex: 4,
    transform: [{ translateX: -4 }, { translateY: 4 }],
  },
  candlesContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 3,
  },
  candleItem: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  candleWick: {
    position: 'absolute',
    width: 1.5,
    borderRadius: 1,
  },
  candleBody: {
    position: 'absolute',
    width: 10,
    borderRadius: 1.5,
    borderWidth: 1,
  },
  livePriceBeacon: {
    position: 'absolute',
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 6,
  },
  pulseRing: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    opacity: 0.45,
  },
  pulseCore: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  cleanLevelLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 5,
  },
  levelLineStroke: {
    flex: 1,
    height: 1,
  },
  levelLineStrokeDashed: {
    flex: 1,
    height: 1,
    borderTopWidth: 1,
    borderStyle: 'dashed',
  },
  chartPriceAxis: {
    width: 56,
    position: 'relative',
    borderLeftWidth: 1,
    overflow: 'hidden',
  },
  axisPriceBadge: {
    position: 'absolute',
    left: 3,
    right: 3,
    paddingVertical: 2.5,
    borderRadius: 3.5,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: 8 }],
    zIndex: 6,
  },
  axisPriceText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  positionLadder: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    marginBottom: 12,
    gap: 6,
  },
  ladderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  ladderLabelCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1.2,
  },
  dotIndicator: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  ladderTitle: {
    fontSize: 11,
    fontWeight: '700',
  },
  ladderPrice: {
    fontSize: 12,
    fontWeight: '800',
    flex: 1,
    textAlign: 'center',
  },
  ladderBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    flex: 1.4,
    alignItems: 'flex-end',
  },
  ladderBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  metricsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 12,
  },
  metricCol: {
    alignItems: 'center',
    flex: 1,
  },
  metricStripLabel: {
    fontSize: 9,
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  metricStripValue: {
    fontSize: 13,
    fontWeight: '900',
  },
  metricDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});
