import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Card } from '@dailyapps/ui';
import { useTheme } from '@dailyapps/theme';

interface WealthGrowthChartProps {
  investedAmount: number;
  returnsAmount: number;
  totalValue: number;
  years: number;
  monthlyInvestment?: number;
  annualRate?: number;
  mode?: 'bar' | 'line'; // New: chart type selector
}

export const WealthGrowthChart: React.FC<WealthGrowthChartProps> = ({
  investedAmount,
  returnsAmount,
  totalValue,
  years,
  monthlyInvestment,
  annualRate,
  mode: initialMode = 'bar',
}) => {
  const theme = useTheme();
  const [selectedBar, setSelectedBar] = useState<number | null>(null);
  const [chartMode, setChartMode] = useState<'bar' | 'line'>(initialMode);
  const screenWidth = Dimensions.get('window').width;
  const _chartWidth = screenWidth - 64; // 32px padding on each side
  void _chartWidth;

  // Calculate year-wise data for bars
  const generateYearlyData = () => {
    if (!monthlyInvestment || !annualRate) {
      // Simple linear distribution if no calculation data
      return Array.from({ length: Math.min(10, years) }, (_, idx) => {
        const year = idx + 1;
        const progress = year / years;
        return {
          year: Math.round((years / 10) * year),
          invested: investedAmount * progress,
          returns: returnsAmount * progress,
          total: totalValue * progress,
        };
      });
    }

    // Calculate actual SIP growth year by year
    const data = [];
    const monthlyRate = annualRate / (12 * 100);
    let balance = 0;
    let totalInvested = 0;

    const displayYears = Math.min(10, years);
    const yearStep = years / displayYears;

    for (let i = 1; i <= displayYears; i++) {
      const targetYear = Math.round(yearStep * i);
      
      // Calculate up to target year
      for (let y = (data.length > 0 ? Math.round(yearStep * (i - 1)) : 0) + 1; y <= targetYear; y++) {
        for (let m = 1; m <= 12; m++) {
          totalInvested += monthlyInvestment;
          balance = (balance + monthlyInvestment) * (1 + monthlyRate);
        }
      }

      const returns = balance - totalInvested;
      data.push({
        year: targetYear,
        invested: totalInvested,
        returns,
        total: balance,
      });
    }

    return data;
  };

  const yearlyData = generateYearlyData();
  const maxValue = Math.max(...yearlyData.map((d) => d.total));

  const formatValue = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
    return `₹${Math.round(value)}`;
  };

  const cagrPercentage = years > 0 
    ? ((Math.pow(totalValue / investedAmount, 1 / years) - 1) * 100).toFixed(2)
    : '0.00';

  return (
    <Card
      style={[
        styles.card,
        { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle },
      ]}
    >
      {/* Header with Chart Mode Toggle */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.title, { color: theme.colors.text }]}>📈 Wealth Growth Journey</Text>
          <Text style={[styles.cagrBadge, { color: '#10B981', backgroundColor: theme.isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5' }]}>
            CAGR: {cagrPercentage}% 📊
          </Text>
        </View>
        
        {/* Chart Type Toggle */}
        <View style={[styles.chartToggle, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9' }]}>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              chartMode === 'bar' && { backgroundColor: theme.colors.primary }
            ]}
            onPress={() => setChartMode('bar')}
            activeOpacity={0.7}
          >
            <Text style={[styles.toggleText, { color: chartMode === 'bar' ? '#FFF' : theme.colors.textMuted }]}>
              📊
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              chartMode === 'line' && { backgroundColor: theme.colors.primary }
            ]}
            onPress={() => setChartMode('line')}
            activeOpacity={0.7}
          >
            <Text style={[styles.toggleText, { color: chartMode === 'line' ? '#FFF' : theme.colors.textMuted }]}>
              📈
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
          <Text style={[styles.legendText, { color: theme.colors.textMuted }]}>Principal Invested</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
          <Text style={[styles.legendText, { color: theme.colors.textMuted }]}>Market Returns</Text>
        </View>
      </View>

      {/* Chart Area */}
      <View style={styles.chartContainer}>
        {/* Y-axis labels */}
        <View style={styles.yAxis}>
          <Text style={[styles.yAxisLabel, { color: theme.colors.textMuted }]}>
            {formatValue(maxValue)}
          </Text>
          <Text style={[styles.yAxisLabel, { color: theme.colors.textMuted }]}>
            {formatValue(maxValue * 0.5)}
          </Text>
          <Text style={[styles.yAxisLabel, { color: theme.colors.textMuted }]}>₹0</Text>
        </View>

        {/* Render based on mode */}
        {chartMode === 'bar' ? (
          <View style={styles.barsContainer}>
            {yearlyData.map((data, idx) => {
              const heightPercent = (data.total / maxValue) * 100;
              const investedPercent = (data.invested / data.total) * 100;
              const returnsPercent = (data.returns / data.total) * 100;
              const isSelected = selectedBar === idx;

              return (
                <View key={idx} style={styles.barWrapper}>
                  {/* Tooltip on tap */}
                  {isSelected && (
                    <View
                      style={[
                        styles.tooltip,
                        {
                          backgroundColor: theme.isDark ? '#1E293B' : '#FFFFFF',
                          borderColor: theme.colors.borderSubtle,
                        },
                      ]}
                    >
                      <Text style={[styles.tooltipYear, { color: theme.colors.text }]}>
                        Year {data.year}
                      </Text>
                      <Text style={[styles.tooltipValue, { color: '#10B981' }]}>
                        {formatValue(data.total)}
                      </Text>
                      <View style={styles.tooltipRow}>
                        <View style={[styles.tooltipDot, { backgroundColor: '#3B82F6' }]} />
                        <Text style={[styles.tooltipLabel, { color: theme.colors.textMuted }]}>
                          {formatValue(data.invested)}
                        </Text>
                      </View>
                      <View style={styles.tooltipRow}>
                        <View style={[styles.tooltipDot, { backgroundColor: '#10B981' }]} />
                        <Text style={[styles.tooltipLabel, { color: theme.colors.textMuted }]}>
                          {formatValue(data.returns)}
                        </Text>
                      </View>
                      {/* Show Year-on-Year Growth */}
                      {idx > 0 && (
                        <Text style={[styles.tooltipGrowth, { color: '#F59E0B' }]}>
                          YoY: +{((data.total - yearlyData[idx - 1].total) / yearlyData[idx - 1].total * 100).toFixed(1)}%
                        </Text>
                      )}
                    </View>
                  )}

                  {/* Bar */}
                  <View
                    style={[
                      styles.barColumn,
                      { height: `${heightPercent}%` },
                      isSelected && styles.barSelected,
                    ]}
                    onTouchEnd={() => setSelectedBar(isSelected ? null : idx)}
                  >
                    {/* Returns part (top) */}
                    <View
                      style={[
                        styles.barSegment,
                        styles.returnsSegment,
                        {
                          height: `${returnsPercent}%`,
                          backgroundColor: isSelected ? '#059669' : '#10B981',
                        },
                      ]}
                    />
                    {/* Invested part (bottom) */}
                    <View
                      style={[
                        styles.barSegment,
                        styles.investedSegment,
                        {
                          height: `${investedPercent}%`,
                          backgroundColor: isSelected ? '#1D4ED8' : '#3B82F6',
                        },
                      ]}
                    />
                  </View>

                  {/* X-axis label */}
                  <Text style={[styles.xAxisLabel, { color: theme.colors.textMuted }]}>
                    {data.year}y
                  </Text>
                </View>
              );
            })}
          </View>
        ) : (
          /* Line Chart Mode */
          <View style={styles.lineChartContainer}>
            <View style={styles.lineChartCanvas}>
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.gridLine,
                    {
                      bottom: `${ratio * 100}%`,
                      borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    },
                  ]}
                />
              ))}

              {/* Line path visualization */}
              {yearlyData.map((data, idx) => {
                if (idx === 0) return null;
                const prevData = yearlyData[idx - 1];
                
                const x1 = ((idx - 1) / (yearlyData.length - 1)) * 100;
                const x2 = (idx / (yearlyData.length - 1)) * 100;
                const y1 = (prevData.total / maxValue) * 100;
                const y2 = (data.total / maxValue) * 100;

                const isSelected = selectedBar === idx;
                void isSelected;

                return (
                  <View key={idx} style={styles.lineSegmentWrapper}>
                    {/* Connecting line */}
                    <View
                      style={[
                        styles.lineSegment,
                        {
                          left: `${x1}%`,
                          bottom: `${y1}%`,
                          width: `${x2 - x1}%`,
                          height: Math.abs(y2 - y1) < 1 ? 3 : Math.abs(y2 - y1),
                          backgroundColor: '#10B981',
                          transform: [
                            { rotate: `${Math.atan2(y2 - y1, x2 - x1)}rad` }
                          ],
                        },
                      ]}
                    />
                  </View>
                );
              })}

              {/* Data points (dots) */}
              {yearlyData.map((data, idx) => {
                const x = (idx / (yearlyData.length - 1)) * 100;
                const y = (data.total / maxValue) * 100;
                const isSelected = selectedBar === idx;

                return (
                  <TouchableOpacity
                    key={`dot-${idx}`}
                    style={[
                      styles.dataDot,
                      {
                        left: `${x}%`,
                        bottom: `${y}%`,
                        backgroundColor: isSelected ? '#F59E0B' : '#10B981',
                        borderColor: theme.isDark ? '#1E293B' : '#FFFFFF',
                        transform: [{ scale: isSelected ? 1.5 : 1 }],
                      },
                    ]}
                    onPress={() => setSelectedBar(isSelected ? null : idx)}
                    activeOpacity={0.7}
                  >
                    {/* Tooltip on selected dot */}
                    {isSelected && (
                      <View
                        style={[
                          styles.lineTooltip,
                          {
                            backgroundColor: theme.isDark ? '#1E293B' : '#FFFFFF',
                            borderColor: theme.colors.borderSubtle,
                          },
                        ]}
                      >
                        <Text style={[styles.lineTooltipYear, { color: theme.colors.text }]}>
                          Year {data.year}
                        </Text>
                        <Text style={[styles.lineTooltipValue, { color: '#10B981' }]}>
                          {formatValue(data.total)}
                        </Text>
                        <Text style={[styles.lineTooltipSub, { color: theme.colors.textMuted }]}>
                          Principal: {formatValue(data.invested)}
                        </Text>
                        <Text style={[styles.lineTooltipSub, { color: theme.colors.textMuted }]}>
                          Returns: {formatValue(data.returns)}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* X-axis labels for line chart */}
            <View style={styles.lineXAxis}>
              {yearlyData.map((data, idx) => (
                <Text
                  key={idx}
                  style={[
                    styles.lineXAxisLabel,
                    { color: theme.colors.textMuted },
                  ]}
                >
                  {data.year}y
                </Text>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Summary Stats Row */}
      <View
        style={[
          styles.summaryRow,
          { backgroundColor: theme.isDark ? 'rgba(37, 99, 235, 0.1)' : '#EFF6FF' },
        ]}
      >
        <View style={styles.statBox}>
          <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>Invested</Text>
          <Text style={[styles.statValue, { color: '#3B82F6' }]}>
            {formatValue(investedAmount)}
          </Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: theme.colors.borderSubtle }]} />
        <View style={styles.statBox}>
          <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>Returns</Text>
          <Text style={[styles.statValue, { color: '#10B981' }]}>
            {formatValue(returnsAmount)}
          </Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: theme.colors.borderSubtle }]} />
        <View style={styles.statBox}>
          <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>Total</Text>
          <Text style={[styles.statValue, { color: theme.colors.text, fontWeight: '900' }]}>
            {formatValue(totalValue)}
          </Text>
        </View>
      </View>

      {/* Tap hint */}
      <Text style={[styles.hint, { color: theme.colors.textMuted }]}>
        💡 Tap on any bar to see details
      </Text>
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
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  cagrBadge: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  chartToggle: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 2,
    gap: 2,
  },
  toggleBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  legendRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chartContainer: {
    flexDirection: 'row',
    height: 200,
    marginBottom: 16,
  },
  yAxis: {
    width: 50,
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  yAxisLabel: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'right',
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    paddingBottom: 8,
    gap: 4,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  tooltip: {
    position: 'absolute',
    bottom: '100%',
    marginBottom: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    minWidth: 110,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  tooltipYear: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
  },
  tooltipValue: {
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 6,
  },
  tooltipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  tooltipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  tooltipLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  tooltipGrowth: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },
  barColumn: {
    width: '100%',
    minHeight: 20,
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barSelected: {
    transform: [{ scale: 1.05 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  barSegment: {
    width: '100%',
  },
  returnsSegment: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  investedSegment: {
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  xAxisLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  lineChartContainer: {
    flex: 1,
  },
  lineChartCanvas: {
    flex: 1,
    position: 'relative',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    borderTopWidth: 1,
    borderStyle: 'dashed',
  },
  lineSegmentWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  lineSegment: {
    position: 'absolute',
    height: 3,
    borderRadius: 1.5,
  },
  dataDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    marginLeft: -5,
    marginBottom: -5,
    zIndex: 5,
  },
  lineTooltip: {
    position: 'absolute',
    bottom: 20,
    left: -55,
    width: 110,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 20,
  },
  lineTooltipYear: {
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 3,
  },
  lineTooltipValue: {
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 4,
  },
  lineTooltipSub: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
  },
  lineXAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  lineXAxisLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    marginHorizontal: 8,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '800',
  },
  hint: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
