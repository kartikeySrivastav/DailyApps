import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@dailyapps/ui';
import { useTheme } from '@dailyapps/theme';
import { BreakdownRow } from './BreakdownRow';

interface TaxBreakdownCardProps {
  profit: number;
  holdingPeriod: 'short' | 'long'; // < 1yr or > 1yr
  assetType: 'equity' | 'debt' | 'intraday';
  showDetails?: boolean;
}

export const TaxBreakdownCard: React.FC<TaxBreakdownCardProps> = ({
  profit,
  holdingPeriod,
  assetType,
  showDetails = true,
}) => {
  const theme = useTheme();

  const taxData = useMemo(() => {
    if (profit <= 0) {
      return {
        type: 'No Tax',
        rate: '0%',
        exemption: 0,
        taxable: 0,
        tax: 0,
        netProfit: profit,
        description: 'No tax on losses',
      };
    }

    // Intraday trading - taxed as business income
    if (assetType === 'intraday') {
      return {
        type: 'Business Income',
        rate: 'As per slab',
        exemption: 0,
        taxable: profit,
        tax: 0, // Not calculated, depends on slab
        netProfit: profit,
        description: 'Intraday gains are taxed as business income at your income tax slab rate',
      };
    }

    // Equity LTCG: > 1 year, 10% above ₹1L
    if (assetType === 'equity' && holdingPeriod === 'long') {
      const exemption = 100000;
      const taxable = Math.max(0, profit - exemption);
      const tax = taxable * 0.10;
      return {
        type: 'LTCG',
        rate: '10%',
        exemption,
        taxable,
        tax,
        netProfit: profit - tax,
        description: 'Long Term Capital Gains on Equity (held > 1 year): 10% tax on gains above ₹1 Lakh',
      };
    }

    // Equity STCG: < 1 year, 15%
    if (assetType === 'equity' && holdingPeriod === 'short') {
      const tax = profit * 0.15;
      return {
        type: 'STCG',
        rate: '15%',
        exemption: 0,
        taxable: profit,
        tax,
        netProfit: profit - tax,
        description: 'Short Term Capital Gains on Equity (held < 1 year): Flat 15% tax',
      };
    }

    // Debt LTCG: > 3 years, 20% with indexation
    if (assetType === 'debt' && holdingPeriod === 'long') {
      const tax = profit * 0.20;
      return {
        type: 'LTCG (Debt)',
        rate: '20%',
        exemption: 0,
        taxable: profit,
        tax,
        netProfit: profit - tax,
        description: 'Long Term Capital Gains on Debt (held > 3 years): 20% with indexation benefit',
      };
    }

    // Debt STCG: < 3 years, as per slab
    if (assetType === 'debt' && holdingPeriod === 'short') {
      return {
        type: 'STCG (Debt)',
        rate: 'As per slab',
        exemption: 0,
        taxable: profit,
        tax: 0,
        netProfit: profit,
        description: 'Short Term Capital Gains on Debt (held < 3 years): Taxed at your income tax slab',
      };
    }

    return {
      type: 'Unknown',
      rate: '0%',
      exemption: 0,
      taxable: 0,
      tax: 0,
      netProfit: profit,
      description: '',
    };
  }, [profit, holdingPeriod, assetType]);

  if (profit <= 0) {
    return (
      <Card
        style={[
          styles.card,
          {
            backgroundColor: theme.isDark ? 'rgba(239, 68, 68, 0.1)' : '#FEE2E2',
            borderColor: theme.isDark ? 'rgba(239, 68, 68, 0.3)' : '#FCA5A5',
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>💰 Tax Calculation</Text>
        </View>
        <Text style={[styles.infoText, { color: theme.colors.textMuted }]}>
          No tax liability on loss transactions
        </Text>
      </Card>
    );
  }

  return (
    <Card
      style={[
        styles.card,
        {
          backgroundColor: theme.isDark ? 'rgba(245, 158, 11, 0.1)' : '#FEF3C7',
          borderColor: theme.isDark ? 'rgba(245, 158, 11, 0.3)' : '#FCD34D',
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>💰 Tax Calculation</Text>
        <View style={[styles.taxBadge, { backgroundColor: '#F59E0B' }]}>
          <Text style={styles.taxBadgeText}>{taxData.type}</Text>
        </View>
      </View>

      {showDetails && (
        <>
          <BreakdownRow label="Gross Profit" value={`₹${profit.toLocaleString('en-IN')}`} showDivider />

          {taxData.exemption > 0 && (
            <BreakdownRow
              label={`${taxData.type} Exemption`}
              value={`-₹${taxData.exemption.toLocaleString('en-IN')}`}
              valueColor="#10B981"
              showDivider
            />
          )}

          {taxData.tax > 0 && (
            <>
              <BreakdownRow
                label="Taxable Amount"
                value={`₹${Math.round(taxData.taxable).toLocaleString('en-IN')}`}
                showDivider
              />

              <BreakdownRow
                label={`Tax @ ${taxData.rate}`}
                value={`-₹${Math.round(taxData.tax).toLocaleString('en-IN')}`}
                valueColor="#EF4444"
                showDivider
              />
            </>
          )}

          <BreakdownRow
            label="Net Profit (After Tax)"
            value={`₹${Math.round(taxData.netProfit).toLocaleString('en-IN')}`}
            isBold
            isHighlight
            valueColor="#10B981"
          />
        </>
      )}

      {/* Info Banner */}
      <View style={[styles.infoBanner, { backgroundColor: theme.isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)' }]}>
        <Text style={styles.infoIcon}>ℹ️</Text>
        <Text style={[styles.infoText, { color: theme.colors.textMuted }]}>{taxData.description}</Text>
      </View>

      {/* Savings Badge if LTCG */}
      {taxData.type === 'LTCG' && taxData.exemption > 0 && (
        <View style={[styles.savingsBadge, { backgroundColor: '#10B981' }]}>
          <Text style={styles.savingsText}>
            💡 Tax saved on ₹{taxData.exemption.toLocaleString('en-IN')} exemption: ₹
            {(taxData.exemption * 0.1).toLocaleString('en-IN')}
          </Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  taxBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  taxBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  infoBanner: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 10,
    gap: 8,
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: 16,
    marginTop: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
  },
  savingsBadge: {
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  savingsText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
