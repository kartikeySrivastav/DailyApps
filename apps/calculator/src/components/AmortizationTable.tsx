import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Card } from '@dailyapps/ui';
import { useTheme } from '@dailyapps/theme';

interface AmortizationEntry {
  month: number;
  year: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

interface AmortizationTableProps {
  principal: number;
  annualRate: number;
  months: number;
  emi: number;
  showYearlyOnly?: boolean;
}

export const AmortizationTable: React.FC<AmortizationTableProps> = ({
  principal,
  annualRate,
  months,
  emi,
  showYearlyOnly = false,
}) => {
  const theme = useTheme();
  const [showFullTable, setShowFullTable] = useState(false);

  const schedule = useMemo(() => {
    let balance = principal;
    const entries: AmortizationEntry[] = [];
    const monthlyRate = annualRate / (12 * 100);

    for (let i = 1; i <= months; i++) {
      const interest = balance * monthlyRate;
      const principalPart = emi - interest;
      balance = Math.max(0, balance - principalPart);

      entries.push({
        month: i,
        year: Math.ceil(i / 12),
        emi,
        principal: principalPart,
        interest,
        balance,
      });
    }

    return entries;
  }, [principal, annualRate, months, emi]);

  // Group by year if yearly view
  const yearlyData = useMemo(() => {
    if (!showYearlyOnly) return [];

    const years: { [key: number]: AmortizationEntry[] } = {};
    schedule.forEach((entry) => {
      if (!years[entry.year]) years[entry.year] = [];
      years[entry.year].push(entry);
    });

    return Object.keys(years).map((year) => {
      const yearEntries = years[Number(year)];
      const totalPrincipal = yearEntries.reduce((sum, e) => sum + e.principal, 0);
      const totalInterest = yearEntries.reduce((sum, e) => sum + e.interest, 0);
      const totalEMI = yearEntries.reduce((sum, e) => sum + e.emi, 0);
      const endBalance = yearEntries[yearEntries.length - 1].balance;

      return {
        year: Number(year),
        emi: totalEMI,
        principal: totalPrincipal,
        interest: totalInterest,
        balance: endBalance,
      };
    });
  }, [schedule, showYearlyOnly]);

  const displayData = showYearlyOnly
    ? yearlyData
    : showFullTable
    ? schedule
    : schedule.slice(0, 12);

  return (
    <Card
      style={[
        styles.card,
        { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          📊 {showYearlyOnly ? 'Year-by-Year' : 'Month-by-Month'} Breakdown
        </Text>
        {!showYearlyOnly && months > 12 && (
          <Text style={[styles.countBadge, { color: theme.colors.textMuted }]}>
            {showFullTable ? `All ${months}` : '1-12'}
          </Text>
        )}
      </View>

      {/* Table Header */}
      <View style={styles.tableRow}>
        <Text style={[styles.tableHeader, styles.col1, { color: theme.colors.textMuted }]}>
          {showYearlyOnly ? 'Year' : 'Month'}
        </Text>
        <Text style={[styles.tableHeader, styles.col2, { color: theme.colors.textMuted }]}>EMI</Text>
        <Text style={[styles.tableHeader, styles.col3, { color: theme.colors.textMuted }]}>Principal</Text>
        <Text style={[styles.tableHeader, styles.col4, { color: theme.colors.textMuted }]}>Interest</Text>
        <Text style={[styles.tableHeader, styles.col5, { color: theme.colors.textMuted }]}>Balance</Text>
      </View>

      {/* Table Body */}
      <ScrollView style={styles.tableScroll} nestedScrollEnabled>
        {displayData.map((entry: any, idx) => (
          <View
            key={idx}
            style={[
              styles.tableRow,
              styles.dataRow,
              idx % 2 === 0 && {
                backgroundColor: theme.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
              },
            ]}
          >
            <Text style={[styles.tableCell, styles.col1, { color: theme.colors.text }]}>
              {showYearlyOnly ? entry.year : entry.month}
            </Text>
            <Text style={[styles.tableCell, styles.col2, { color: theme.colors.text }]}>
              ₹{Math.round(entry.emi).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </Text>
            <Text style={[styles.tableCell, styles.col3, { color: '#2563EB' }]}>
              ₹{Math.round(entry.principal).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </Text>
            <Text style={[styles.tableCell, styles.col4, { color: '#F59E0B' }]}>
              ₹{Math.round(entry.interest).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </Text>
            <Text style={[styles.tableCell, styles.col5, { color: theme.colors.text, fontWeight: '700' }]}>
              ₹{Math.round(entry.balance).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Show More Button */}
      {!showYearlyOnly && months > 12 && (
        <TouchableOpacity
          onPress={() => setShowFullTable(!showFullTable)}
          style={styles.showMoreBtn}
          activeOpacity={0.7}
        >
          <Text style={[styles.showMoreText, { color: theme.colors.primary }]}>
            {showFullTable ? '▲ Show Less' : `▼ Show All ${months} Months`}
          </Text>
        </TouchableOpacity>
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
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  countBadge: {
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  dataRow: {
    borderBottomWidth: 0,
  },
  tableHeader: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  tableCell: {
    fontSize: 11,
    fontWeight: '600',
  },
  col1: { flex: 0.7 },
  col2: { flex: 1.1, textAlign: 'right' },
  col3: { flex: 1.1, textAlign: 'right' },
  col4: { flex: 1.1, textAlign: 'right' },
  col5: { flex: 1.3, textAlign: 'right' },
  tableScroll: {
    maxHeight: 400,
  },
  showMoreBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  showMoreText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
