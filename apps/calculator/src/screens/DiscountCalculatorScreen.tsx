import React, { useState, useEffect } from 'react';
import {
  View,
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
  BreakdownRow,
  FormulaInfoCard,
  CalculationHistoryModal,
} from '../components';
import { useCalculationHistory } from '../hooks';
import { CalculationRecord } from '../types/history.types';

interface DiscountCalculatorScreenProps {
  navigation: any;
  route?: any;
}

export const DiscountCalculatorScreen: React.FC<DiscountCalculatorScreenProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const analytics = useAnalytics();

  const tool = route?.params?.tool;

  const [price, setPrice] = useState('1200');
  const [discount, setDiscount] = useState('20');
  const [tax, setTax] = useState('0');
  const [showHistory, setShowHistory] = useState(false);

  const presets = [10, 15, 20, 25, 30, 40, 50];

  const { history, saveCalculation, clearHistory, deleteItem } = useCalculationHistory(
    tool?.id || 'discount',
    '💵 Tax & Salary'
  );

  useEffect(() => {
    analytics.logScreenView(tool?.name || 'DiscountCalculator');
  }, [analytics, tool]);

  const p = parseFloat(price) || 0;
  const d = parseFloat(discount) || 0;
  const t = parseFloat(tax) || 0;

  const discountAmount = (p * d) / 100;
  const priceAfterDiscount = p - discountAmount;
  const taxAmount = (priceAfterDiscount * t) / 100;
  const finalPrice = priceAfterDiscount + taxAmount;
  const totalSavings = discountAmount;

  // Auto-save calculation to history
  useEffect(() => {
    if (p <= 0 || d <= 0) return;
    const timer = setTimeout(() => {
      saveCalculation({
        toolId: tool?.id || 'discount',
        toolName: tool?.name || 'Discount & Sale',
        category: '💵 Tax & Salary',
        title: `₹${finalPrice.toFixed(2).replace(/\.00$/, '')} (${d}% OFF on ₹${p.toFixed(0)})`,
        subtitle: `Saved ₹${totalSavings.toFixed(2).replace(/\.00$/, '')}${t > 0 ? ` + ${t}% GST` : ''}`,
        result: `₹${finalPrice.toFixed(2).replace(/\.00$/, '')}`,
        badge: `${d}% OFF`,
        inputs: { price, discount, tax },
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [p, d, t, finalPrice, totalSavings, price, discount, tax, saveCalculation, tool?.id, tool?.name]);

  const handleSelectHistory = (record: CalculationRecord) => {
    if (record.inputs) {
      if (record.inputs.price) setPrice(record.inputs.price);
      if (record.inputs.discount) setDiscount(record.inputs.discount);
      if (record.inputs.tax !== undefined) setTax(record.inputs.tax);
    }
  };

  return (
    <ScreenContainer safeArea withPadding={false}>
      <CalculatorHeader
        title={tool?.name || 'Discount & Sale'}
        subtitle={tool?.shortDescription || 'Calculate final price & your savings'}
        icon={tool?.icon || '🏷️'}
        category="💵 Tax & Salary"
        toolId={tool?.id || 'discount'}
        onBack={() => navigation.goBack()}
        onHistory={() => setShowHistory(true)}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Input Card */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Price Details</Text>

          <CalcInputField
            label="Original Price"
            prefix="₹"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
            placeholder="0.00"
          />

          <CalcInputField
            label="Discount Percentage"
            suffix="%"
            keyboardType="numeric"
            value={discount}
            onChangeText={setDiscount}
            placeholder="0"
          />

          <Text style={[styles.presetLabel, { color: theme.isDark ? '#CBD5E1' : '#475569' }]}>
            Quick Select Discount
          </Text>
          <PresetPills
            options={presets.map((pct) => ({ label: `${pct}%`, value: pct }))}
            selectedValue={discount}
            onSelect={(val) => setDiscount(String(val))}
            scrollable
          />

          <View style={{ marginTop: 12 }}>
            <CalcInputField
              label="Tax / GST % (Optional)"
              suffix="%"
              keyboardType="numeric"
              value={tax}
              onChangeText={setTax}
              placeholder="0"
            />
          </View>
        </Card>

        {/* Highlight Result Card */}
        <ResultHeroCard
          title="Final Price to Pay"
          value={`₹${finalPrice.toFixed(2).replace(/\.00$/, '')}`}
          subText={`Originally ₹${p.toFixed(2).replace(/\.00$/, '')}`}
          variant="success"
          badgeText={`🎉 You Save: ₹${totalSavings.toFixed(2).replace(/\.00$/, '')} (${d}%)`}
          badgeType="success"
          secondaryStats={[
            { label: 'Original', value: `₹${p.toFixed(0)}` },
            { label: 'Discount', value: `-₹${discountAmount.toFixed(0)}`, color: '#10B981' },
            { label: 'Final Price', value: `₹${finalPrice.toFixed(0)}` },
          ]}
        />

        {/* Breakdown Card */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Savings Breakdown</Text>

          <BreakdownRow
            label="Original Price"
            value={`₹${p.toFixed(2).replace(/\.00$/, '')}`}
            showDivider
          />
          <BreakdownRow
            label={`Discount (${d}%)`}
            value={`-₹${discountAmount.toFixed(2).replace(/\.00$/, '')}`}
            valueColor="#10B981"
            dotColor="#10B981"
            showDivider
          />
          {t > 0 ? (
            <BreakdownRow
              label={`Tax / GST (${t}%)`}
              value={`+₹${taxAmount.toFixed(2).replace(/\.00$/, '')}`}
              valueColor="#F59E0B"
              dotColor="#F59E0B"
              showDivider
            />
          ) : null}
          <BreakdownRow
            label="You Pay"
            value={`₹${finalPrice.toFixed(2).replace(/\.00$/, '')}`}
            isBold
            isHighlight
            valueColor={theme.colors.primary}
          />
        </Card>

        <FormulaInfoCard
          title="Discount & Final Price Formula"
          formula="Final Price = Original – (Original × Discount%) + Tax"
          explanation="Computes the net amount payable after deducting the promotional discount percentage and adding applicable GST or sales tax."
        />
      </ScrollView>

      <CalculationHistoryModal
        visible={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
        onSelect={handleSelectHistory}
        onClearAll={clearHistory}
        onDeleteItem={deleteItem}
        toolName={tool?.name || 'Discount & Sale'}
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
