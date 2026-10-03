import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from '@dailyapps/ui';
import { useTheme } from '@dailyapps/theme';

interface YearlyData {
  year: number;
  invested: number;
  returns: number;
  total: number;
}

interface YearlyBreakdownTableProps {
  monthlyInvestment: number;
  annualRate: number;
  years: number;
}

export const YearlyBreakdownTable: React.FC<YearlyBreakdownTableProps> = ({
  monthlyInvestment,
  annualRate,
  years,
}) => {
  const theme = useTheme();

  const yearlyData = useMemo((): YearlyData[] => {
    const data: YearlyData[] = [];
    const monthlyRate = annualRate / (12 * 100);
    let balance = 0;
    let totalInvested = 0;

    for (let year = 1; year <= years; year++) {
      // Calculate for 12 months
      for (let month = 1; month <= 12; month++) {
        totalInvested += monthlyInvestment;
        balance = (balance + monthlyInvestment) * (1 + monthlyRate);
      }

      const returns = balance - totalInvested;
      data.push({
        year,
        invested: totalInvested,
        returns,
        total: balance,
      });
    }

    return data;
  }, [monthlyInvestment, annualRate, years]);

  const formatValue = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)}L`;
    } else if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)}K`;
    }
    return `₹${Math.round(value)}`;
  };

  return (
    <Card
      style={[
        styles.card,
        { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>📈 Year-by-Year Growth</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
          {years} years projection
        </Text>
      </View>

      {/* Table Header */}
      <View style={styles.tableRow}>
        <Text style={[styles.tableHeader, styles.col1, { color: theme.colors.textMuted }]}>Year</Text>
        <Text style={[styles.tableHeader, styles.col2, { color: theme.colors.textMuted }]}>Invested</Text>
        <Text style={[styles.tableHeader, styles.col3, { color: theme.colors.textMuted }]}>Returns</Text>
        <Text style={[styles.tableHeader, styles.col4, { color: theme.colors.textMuted }]}>
          Total Value
        </Text>
      </View>

      {/* Table Body */}
      <ScrollView style={styles.tableScroll} nestedScrollEnabled>
        {yearlyData.map((row, idx) => (
          <View
            key={idx}
            style={[
              styles.tableRow,
              styles.dataRow,
              idx % 2 === 0 && {
                backgroundColor: theme.isDark ? 'rgba(37, 99, 235, 0.06)' : 'rgba(37, 99, 235, 0.04)',
              },
            ]}
          >
            <Text style={[styles.tableCell, styles.col1, { color: theme.colors.text }]}>
              {row.year}
            </Text>
            <Text style={[styles.tableCell, styles.col2, { color: '#2563EB' }]}>
              {formatValue(row.invested)}
            </Text>
            <Text style={[styles.tableCell, styles.col3, { color: '#10B981' }]}>
              {formatValue(row.returns)}
            </Text>
            <Text style={[styles.tableCell, styles.col4, { color: theme.colors.text, fontWeight: '800' }]}>
              {formatValue(row.total)}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Summary Footer */}
      <View style={[styles.footer, { backgroundColor: theme.isDark ? 'rgba(37, 99, 235, 0.1)' : '#EFF6FF' }]}>
        <View style={styles.footerRow}>
          <Text style={[styles.footerLabel, { color: theme.colors.textMuted }]}>Final Invested</Text>
          <Text style={[styles.footerValue, { color: '#2563EB' }]}>
            {formatValue(yearlyData[yearlyData.length - 1]?.invested || 0)}
          </Text>
        </View>
        <View style={styles.footerRow}>
          <Text style={[styles.footerLabel, { color: theme.colors.textMuted }]}>Final Returns</Text>
          <Text style={[styles.footerValue, { color: '#10B981' }]}>
            {formatValue(yearlyData[yearlyData.length - 1]?.returns || 0)}
          </Text>
        </View>
        <View style={[styles.footerRow, styles.finalRow]}>
          <Text style={[styles.footerLabel, { color: theme.colors.text, fontWeight: '800' }]}>
            Final Value
          </Text>
          <Text style={[styles.footerValue, { color: theme.colors.text, fontWeight: '900', fontSize: 16 }]}>
            {formatValue(yearlyData[yearlyData.length - 1]?.total || 0)}
          </Text>
        </View>
      </View>
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
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  dataRow: {
    borderBottomWidth: 0,
    paddingVertical: 12,
  },
  tableHeader: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  tableCell: {
    fontSize: 12,
    fontWeight: '600',
  },
  col1: { flex: 0.6, textAlign: 'left' },
  col2: { flex: 1.2, textAlign: 'right' },
  col3: { flex: 1.2, textAlign: 'right' },
  col4: { flex: 1.3, textAlign: 'right' },
  tableScroll: {
    maxHeight: 400,
  },
  footer: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  finalRow: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    marginTop: 4,
  },
  footerLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  footerValue: {
    fontSize: 14,
    fontWeight: '800',
  },
});
