import React, { useState, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { ScreenContainer, Card } from '@dailyapps/ui';
import {
  CalculatorHeader,
  ResultHeroCard,
  PresetPills,
  CalcInputField,
  BreakdownRow,
  SegmentedTabs,
  FormulaInfoCard,
  CalculationHistoryModal,
} from '../components';
import { useTheme } from '@dailyapps/theme';
import { useAnalytics } from '@dailyapps/analytics';
import { useCalculationHistory } from '../hooks';
import { CalculationRecord } from '../types/history.types';

interface GSTCalculatorScreenProps {
  navigation: any;
  route?: any;
}

export const GSTCalculatorScreen: React.FC<GSTCalculatorScreenProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const analytics = useAnalytics();

  const tool = route?.params?.tool;
  const isIncExc = tool?.id === 'gst_inc_exc';
  const isSplit = tool?.id === 'gst_split';

  const [amount, setAmount] = useState('1000');
  const [gstRate, setGstRate] = useState('18');
  const [isInclusive, setIsInclusive] = useState(isIncExc); // false = Add GST, true = Remove GST

  const slabs = [3, 5, 12, 18, 28];

  useEffect(() => {
    analytics.logScreenView(tool?.name || 'GSTCalculator');
  }, [analytics, tool]);

  const rawAmount = parseFloat(amount) || 0;
  const rate = parseFloat(gstRate) || 0;

  let netAmount = 0;
  let totalGst = 0;
  let grossAmount = 0;

  if (rawAmount > 0 && rate >= 0) {
    if (isInclusive) {
      // Amount includes GST
      grossAmount = rawAmount;
      netAmount = (rawAmount * 100) / (100 + rate);
      totalGst = grossAmount - netAmount;
    } else {
      // Amount excludes GST (Add GST)
      netAmount = rawAmount;
      totalGst = (rawAmount * rate) / 100;
      grossAmount = netAmount + totalGst;
    }
  }

  const cgst = totalGst / 2;
  const sgst = totalGst / 2;

  const screenTitle = tool?.name || 'GST / VAT Calculator';
  const screenSubtitle = isSplit
    ? 'Central & State tax split'
    : isIncExc
    ? 'Add or extract GST amount'
    : 'Goods & Services Tax slabs';
  const screenIcon = tool?.icon || '🧾';

  const [showHistory, setShowHistory] = useState(false);
  const { history, saveCalculation, clearHistory, deleteItem } = useCalculationHistory(
    tool?.id || 'gst',
    '💵 Tax & Salary'
  );

  // Auto-record calculation into history
  useEffect(() => {
    if (netAmount <= 0 || rate <= 0 || grossAmount <= 0) return;
    const timer = setTimeout(() => {
      saveCalculation({
        toolId: tool?.id || 'gst',
        toolName: screenTitle,
        category: '💵 Tax & Salary',
        title: `${screenTitle}: ₹${grossAmount.toFixed(2)} (${isInclusive ? 'Inc' : 'Exc'} @ ${rate}%)`,
        subtitle: `Base Price: ₹${netAmount.toFixed(2)}`,
        result: `Total GST: ₹${totalGst.toFixed(2)}`,
        secondaryResult: `CGST (50%): ₹${cgst.toFixed(2)} | SGST (50%): ₹${sgst.toFixed(2)}`,
        badge: isInclusive ? 'INCLUSIVE' : 'EXCLUSIVE',
        inputs: {
          amount,
          gstRate,
          isInclusive,
        },
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [netAmount, rate, grossAmount, totalGst, cgst, sgst, isInclusive, amount, gstRate, saveCalculation, screenTitle, tool?.id]);

  const handleSelectHistory = (record: CalculationRecord) => {
    if (record.inputs) {
      if (record.inputs.amount) setAmount(record.inputs.amount);
      if (record.inputs.gstRate) setGstRate(record.inputs.gstRate);
      if (typeof record.inputs.isInclusive === 'boolean') {
        setIsInclusive(record.inputs.isInclusive);
      }
    }
  };

  return (
    <ScreenContainer safeArea withPadding={false}>
      <CalculatorHeader
        title={screenTitle}
        subtitle={screenSubtitle}
        icon={screenIcon}
        category="💵 Tax & Salary"
        toolId={tool?.id || 'gst'}
        onBack={() => navigation.goBack()}
        onHistory={() => setShowHistory(true)}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Toggle Mode */}
        <SegmentedTabs
          activeTab={isInclusive ? 'inclusive' : 'exclusive'}
          onTabChange={(key) => setIsInclusive(key === 'inclusive')}
          tabs={[
            { key: 'exclusive', label: 'Add GST (Exclusive)', icon: '➕' },
            { key: 'inclusive', label: 'Remove GST (Inclusive)', icon: '➖' },
          ]}
        />

        {/* Input Card */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Amount & Tax Rate</Text>

          <CalcInputField
            label={isInclusive ? 'Total Price (Including GST)' : 'Base Price (Excluding GST)'}
            prefix="₹"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholder="e.g. 1000"
          />

          <CalcInputField
            label="GST Rate Percentage"
            suffix="%"
            keyboardType="numeric"
            value={gstRate}
            onChangeText={setGstRate}
            placeholder="18"
          />

          <Text style={[styles.presetLabel, { color: theme.isDark ? '#CBD5E1' : '#475569' }]}>
            Standard GST Slabs
          </Text>
          <PresetPills
            options={slabs.map((s) => ({ label: `${s}%`, value: s }))}
            selectedValue={gstRate}
            onSelect={(val) => setGstRate(String(val))}
          />
        </Card>

        {/* Result Hero Card */}
        <ResultHeroCard
          title={isInclusive ? 'Net Base Amount' : 'Total Invoice Amount'}
          value={`₹${(isInclusive ? netAmount : grossAmount).toFixed(2)}`}
          subText={isInclusive ? `Includes ₹${totalGst.toFixed(2)} GST tax` : `Base Price: ₹${netAmount.toFixed(2)}`}
          variant="primary"
          badgeText={`Total GST (${rate}%): ₹${totalGst.toFixed(2)}`}
          badgeType="warning"
          secondaryStats={[
            { label: 'Base Price', value: `₹${netAmount.toFixed(2)}` },
            { label: 'Total Tax', value: `₹${totalGst.toFixed(2)}`, color: '#F59E0B' },
            { label: 'Gross Value', value: `₹${grossAmount.toFixed(2)}` },
          ]}
        />

        {/* Tax Breakdown Card */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Tax Split (CGST & SGST)</Text>

          <BreakdownRow
            label="Net Base Price"
            value={`₹${netAmount.toFixed(2)}`}
            showDivider
          />
          <BreakdownRow
            label={`CGST (${(rate / 2).toFixed(1)}%)`}
            value={`₹${cgst.toFixed(2)}`}
            subLabel="Central Goods & Services Tax"
            valueColor="#F59E0B"
            dotColor="#F59E0B"
            showDivider
          />
          <BreakdownRow
            label={`SGST (${(rate / 2).toFixed(1)}%)`}
            value={`₹${sgst.toFixed(2)}`}
            subLabel="State Goods & Services Tax"
            valueColor="#F59E0B"
            dotColor="#F59E0B"
            showDivider
          />
          <BreakdownRow
            label="Total GST Amount"
            value={`₹${totalGst.toFixed(2)}`}
            isBold
            valueColor="#F59E0B"
            showDivider
          />
          <BreakdownRow
            label="Final Amount"
            value={`₹${grossAmount.toFixed(2)}`}
            isBold
            isHighlight
            valueColor={theme.colors.primary}
          />
        </Card>

        <FormulaInfoCard
          title={isInclusive ? 'Inclusive GST Formula (MRP Extraction)' : 'Exclusive GST Formula (Add Tax)'}
          formula={
            isInclusive
              ? 'Base Price = (Total Amount × 100) / (100 + GST Rate)'
              : 'GST Tax = (Base Price × GST Rate) / 100'
          }
          explanation={
            isInclusive
              ? 'Extracts the underlying pre-tax cost and tax component from a maximum retail price (MRP).'
              : 'Applies statutory goods & service tax slabs (3%, 5%, 12%, 18%, 28%) equally divided into 50% CGST and 50% SGST.'
          }
        />
      </ScrollView>

      <CalculationHistoryModal
        visible={showHistory}
        onClose={() => setShowHistory(false)}
        title={`${screenTitle} History`}
        subtitle="Past GST calculations & tax invoices"
        records={history}
        onSelectRecord={handleSelectHistory}
        onClearAll={clearHistory}
        onDeleteItem={deleteItem}
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
  presetLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
    marginBottom: 4,
  },
});
