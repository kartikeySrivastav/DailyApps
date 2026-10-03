import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { ScreenContainer, Card } from '@dailyapps/ui';
import { useTheme } from '@dailyapps/theme';
import { useAnalytics } from '@dailyapps/analytics';
import {
  CalculatorHeader,
  FormulaInfoCard,
  ResultHeroCard,
  CalcInputField,
  CalculationHistoryModal,
} from '../components';
import { useCalculationHistory } from '../hooks';
import { CalculationRecord } from '../types/history.types';

interface UnitConverterScreenProps {
  navigation: any;
  route?: any;
}

type Category = 'length' | 'weight' | 'temperature' | 'speed' | 'area' | 'volume' | 'data';

const CONVERSIONS: Record<
  Category,
  {
    units: { id: string; label: string; toBase: (v: number) => number; fromBase: (v: number) => number }[];
  }
> = {
  length: {
    units: [
      { id: 'm', label: 'Meters (m)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'km', label: 'Kilometers (km)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'cm', label: 'Centimeters (cm)', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      { id: 'mm', label: 'Millimeters (mm)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'mi', label: 'Miles (mi)', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
      { id: 'ft', label: 'Feet (ft)', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      { id: 'in', label: 'Inches (in)', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    ],
  },
  weight: {
    units: [
      { id: 'kg', label: 'Kilograms (kg)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'g', label: 'Grams (g)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'mg', label: 'Milligrams (mg)', toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
      { id: 'lb', label: 'Pounds (lb)', toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
      { id: 'oz', label: 'Ounces (oz)', toBase: (v) => v * 0.028349523, fromBase: (v) => v / 0.028349523 },
    ],
  },
  temperature: {
    units: [
      { id: 'c', label: 'Celsius (°C)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'f', label: 'Fahrenheit (°F)', toBase: (v) => ((v - 32) * 5) / 9, fromBase: (v) => (v * 9) / 5 + 32 },
      { id: 'k', label: 'Kelvin (K)', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
  },
  speed: {
    units: [
      { id: 'kmh', label: 'km/h', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
      { id: 'ms', label: 'm/s', toBase: (v) => v, fromBase: (v) => v },
      { id: 'mph', label: 'mph', toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
      { id: 'knot', label: 'Knots', toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
    ],
  },
  area: {
    units: [
      { id: 'sq_m', label: 'Sq Meters (m²)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'sq_ft', label: 'Sq Feet (ft²)', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
      { id: 'acre', label: 'Acres (ac)', toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
      { id: 'hectare', label: 'Hectares (ha)', toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
      { id: 'sq_km', label: 'Sq Km (km²)', toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
    ],
  },
  volume: {
    units: [
      { id: 'l', label: 'Liters (L)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'ml', label: 'Milliliters (mL)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'gal', label: 'US Gallons (gal)', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
      { id: 'm3', label: 'Cubic Meters (m³)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'ft3', label: 'Cubic Feet (ft³)', toBase: (v) => v * 28.3168, fromBase: (v) => v / 28.3168 },
    ],
  },
  data: {
    units: [
      { id: 'mb', label: 'Megabytes (MB)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'kb', label: 'Kilobytes (KB)', toBase: (v) => v / 1024, fromBase: (v) => v * 1024 },
      { id: 'gb', label: 'Gigabytes (GB)', toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
      { id: 'tb', label: 'Terabytes (TB)', toBase: (v) => v * 1024 * 1024, fromBase: (v) => v / (1024 * 1024) },
      { id: 'b', label: 'Bytes (B)', toBase: (v) => v / (1024 * 1024), fromBase: (v) => v * (1024 * 1024) },
    ],
  },
};

export const UnitConverterScreen: React.FC<UnitConverterScreenProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const analytics = useAnalytics();

  const tool = route?.params?.tool;
  const initialCategory: Category = tool?.id?.includes('weight') || tool?.id?.includes('mass')
    ? 'weight'
    : tool?.id?.includes('temp')
    ? 'temperature'
    : tool?.id?.includes('speed')
    ? 'speed'
    : tool?.id?.includes('area')
    ? 'area'
    : tool?.id?.includes('volume')
    ? 'volume'
    : tool?.id?.includes('data')
    ? 'data'
    : 'length';

  const [category, setCategory] = useState<Category>(initialCategory);
  const [inputValue, setInputValue] = useState('1');
  const [fromUnitId, setFromUnitId] = useState(
    initialCategory === 'weight'
      ? 'kg'
      : initialCategory === 'temperature'
      ? 'c'
      : initialCategory === 'speed'
      ? 'kmh'
      : initialCategory === 'area'
      ? 'sq_m'
      : initialCategory === 'volume'
      ? 'l'
      : initialCategory === 'data'
      ? 'mb'
      : 'km'
  );
  const [toUnitId, setToUnitId] = useState(
    initialCategory === 'weight'
      ? 'g'
      : initialCategory === 'temperature'
      ? 'f'
      : initialCategory === 'speed'
      ? 'ms'
      : initialCategory === 'area'
      ? 'sq_ft'
      : initialCategory === 'volume'
      ? 'ml'
      : initialCategory === 'data'
      ? 'gb'
      : 'm'
  );

  const categories: { id: Category; label: string; icon: string }[] = [
    { id: 'length', label: 'Length', icon: '📏' },
    { id: 'weight', label: 'Weight', icon: '⚖️' },
    { id: 'temperature', label: 'Temp', icon: '🌡️' },
    { id: 'speed', label: 'Speed', icon: '🚀' },
    { id: 'area', label: 'Area', icon: '📐' },
    { id: 'volume', label: 'Volume', icon: '🧪' },
    { id: 'data', label: 'Data', icon: '💾' },
  ];

  useEffect(() => {
    analytics.logScreenView(tool?.name || 'UnitConverter');
  }, [analytics, tool]);

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    const units = CONVERSIONS[cat].units;
    setFromUnitId(units[0].id);
    setToUnitId(units[1]?.id || units[0].id);
  };

  const handleSwap = () => {
    const temp = fromUnitId;
    setFromUnitId(toUnitId);
    setToUnitId(temp);
  };

  const handleReset = () => {
    setInputValue('1');
  };

  const currentUnits = CONVERSIONS[category].units;
  const fromUnit = currentUnits.find((u) => u.id === fromUnitId) || currentUnits[0];
  const toUnit = currentUnits.find((u) => u.id === toUnitId) || currentUnits[1] || currentUnits[0];

  const val = parseFloat(inputValue) || 0;
  const baseVal = fromUnit.toBase(val);
  const convertedVal = toUnit.fromBase(baseVal);

  const formattedResult =
    isNaN(convertedVal) || !isFinite(convertedVal)
      ? '0'
      : Number(convertedVal.toFixed(6)).toString();

  const [showHistory, setShowHistory] = useState(false);
  const { history, saveCalculation, clearHistory, deleteItem } = useCalculationHistory(
    tool?.id || 'unit_converter',
    '🔄 Converters'
  );

  // Auto-record calculation into history
  useEffect(() => {
    if (val <= 0 || !formattedResult || formattedResult === '0') return;
    const timer = setTimeout(() => {
      saveCalculation({
        toolId: tool?.id || 'unit_converter',
        toolName: `${category.toUpperCase()} Converter`,
        category: '🔄 Converters',
        title: `${inputValue} ${fromUnit.label} → ${formattedResult} ${toUnit.label}`,
        subtitle: `Category: ${category.toUpperCase()} | Conversion Ratio: ${toUnit.fromBase(fromUnit.toBase(1)).toFixed(4)}`,
        result: `${formattedResult} ${toUnit.label}`,
        badge: category.toUpperCase(),
        inputs: { category, inputValue, fromUnitId, toUnitId },
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [val, formattedResult, inputValue, fromUnit, toUnit, category, fromUnitId, toUnitId, saveCalculation, tool?.id]);

  const handleSelectHistory = (record: CalculationRecord) => {
    if (record.inputs) {
      if (record.inputs.category) setCategory(record.inputs.category as Category);
      if (record.inputs.inputValue) setInputValue(record.inputs.inputValue);
      if (record.inputs.fromUnitId) setFromUnitId(record.inputs.fromUnitId);
      if (record.inputs.toUnitId) setToUnitId(record.inputs.toUnitId);
    }
  };

  return (
    <ScreenContainer safeArea withPadding={false}>
      <CalculatorHeader
        title={tool?.name || 'Unit Converter'}
        subtitle={tool?.shortDescription || 'Length, mass, temperature & speed'}
        icon={tool?.icon || '🔄'}
        category="🔄 Converters"
        toolId={tool?.id || 'unit_converter'}
        onBack={() => navigation.goBack()}
        onHistory={() => setShowHistory(true)}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Category Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          {categories.map((cat) => {
            const isSelected = category === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => handleCategoryChange(cat.id)}
                activeOpacity={0.7}
                style={[
                  styles.catChip,
                  {
                    backgroundColor: isSelected
                      ? '#2563EB'
                      : theme.isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : '#F1F5F9',
                    borderColor: isSelected
                      ? '#60A5FA'
                      : theme.isDark
                      ? 'rgba(255, 255, 255, 0.16)'
                      : '#CBD5E1',
                    borderWidth: 1.2,
                  },
                ]}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    backgroundColor: isSelected
                      ? 'rgba(0, 0, 0, 0.14)'
                      : theme.isDark
                      ? 'rgba(255, 255, 255, 0.06)'
                      : 'rgba(0, 0, 0, 0.05)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 6,
                  }}
                >
                  <Text style={[styles.catIcon, { color: isSelected ? '#ffffff' : (theme.isDark ? '#F1F5F9' : '#1E293B') }]}>
                    {cat.icon}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.catText,
                    {
                      color: isSelected ? '#ffffff' : theme.colors.text,
                      fontWeight: isSelected ? '800' : '600',
                    },
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Input Value Card */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Value to Convert</Text>
          <CalcInputField
            label={`Magnitude (${fromUnit.label})`}
            keyboardType="numeric"
            value={inputValue}
            onChangeText={setInputValue}
            suffix={fromUnit.label}
            placeholder="0"
          />

          <TouchableOpacity
            onPress={handleReset}
            activeOpacity={0.7}
            style={[
              styles.resetButton,
              {
                backgroundColor: theme.isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2',
                borderColor: theme.isDark ? 'rgba(239, 68, 68, 0.3)' : '#FCA5A5',
              },
            ]}
          >
            <Text style={[styles.resetButtonText, { color: '#EF4444' }]}>↺ Reset Inputs</Text>
          </TouchableOpacity>
        </Card>

        {/* From / To Unit Pickers */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
          {/* From Unit */}
          <Text style={[styles.label, { color: theme.colors.textMuted }]}>Convert From</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.unitList}>
            {currentUnits.map((u) => {
              const active = u.id === fromUnitId;
              return (
                <TouchableOpacity
                  key={u.id}
                  onPress={() => setFromUnitId(u.id)}
                  style={[
                    styles.unitChip,
                    {
                      backgroundColor: active
                        ? '#2563EB'
                        : theme.isDark
                        ? 'rgba(255, 255, 255, 0.08)'
                        : '#F1F5F9',
                      borderColor: active
                        ? theme.isDark
                          ? '#60A5FA'
                          : '#1D4ED8'
                        : theme.isDark
                        ? 'rgba(255, 255, 255, 0.16)'
                        : '#CBD5E1',
                      borderWidth: 1.2,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.unitChipText,
                      {
                        color: active ? '#ffffff' : theme.colors.text,
                        fontWeight: active ? '800' : '600',
                      },
                    ]}
                  >
                    {u.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Swap Button */}
          <View style={styles.swapWrap}>
            <TouchableOpacity
              onPress={handleSwap}
              style={[
                styles.swapBtn,
                {
                  backgroundColor: theme.isDark ? 'rgba(59, 130, 246, 0.18)' : '#EFF6FF',
                  borderColor: theme.isDark ? '#3B82F6' : '#BFDBFE',
                  borderWidth: 1.2,
                },
              ]}
            >
              <Text style={[styles.swapIcon, { color: theme.isDark ? '#93C5FD' : '#2563EB', fontWeight: '800' }]}>
                ⇅ Swap Units
              </Text>
            </TouchableOpacity>
          </View>

          {/* To Unit */}
          <Text style={[styles.label, { color: theme.colors.textMuted }]}>Convert To</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.unitList}>
            {currentUnits.map((u) => {
              const active = u.id === toUnitId;
              return (
                <TouchableOpacity
                  key={u.id}
                  onPress={() => setToUnitId(u.id)}
                  style={[
                    styles.unitChip,
                    {
                      backgroundColor: active
                        ? '#2563EB'
                        : theme.isDark
                        ? 'rgba(255, 255, 255, 0.08)'
                        : '#F1F5F9',
                      borderColor: active
                        ? theme.isDark
                          ? '#60A5FA'
                          : '#1D4ED8'
                        : theme.isDark
                        ? 'rgba(255, 255, 255, 0.16)'
                        : '#CBD5E1',
                      borderWidth: 1.2,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.unitChipText,
                      {
                        color: active ? '#ffffff' : theme.colors.text,
                        fontWeight: active ? '800' : '600',
                      },
                    ]}
                  >
                    {u.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Card>

        {/* Result Hero Card */}
        <ResultHeroCard
          title="Converted Value"
          value={`${formattedResult} ${toUnit.label}`}
          subText={`${val} ${fromUnit.label} converted`}
          variant="primary"
          badgeText={`${category.toUpperCase()} • SI Standard`}
          badgeType="info"
          secondaryStats={[
            { label: 'From Unit', value: fromUnit.label },
            { label: 'To Unit', value: toUnit.label },
            { label: 'Ratio', value: `${toUnit.fromBase(fromUnit.toBase(1)).toFixed(4)}` },
          ]}
        />

        <FormulaInfoCard
          title="Conversion Standard Units"
          formula="Base SI Standard = Metric / Imperial Conversion Factors"
          explanation="Standardized scientific coefficients convert input values to international base SI units (meters, kilograms, Celsius, m/s) before projecting to target unit."
        />
      </ScrollView>

      <CalculationHistoryModal
        visible={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
        onSelect={handleSelectHistory}
        onClearAll={clearHistory}
        onDeleteItem={deleteItem}
        toolName="Unit Converter"
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  catScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 4,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  catIcon: {
    fontSize: 14,
  },
  catText: {
    fontSize: 13,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 18,
    fontWeight: '700',
  },
  unitList: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  unitChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  unitChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  swapWrap: {
    alignItems: 'center',
    marginVertical: 10,
  },
  swapBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  swapIcon: {
    fontSize: 13,
    fontWeight: '700',
  },
  heroCard: {
    padding: 22,
    borderRadius: 20,
    alignItems: 'center',
  },
  heroSub: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '600',
  },
  heroBig: {
    fontSize: 36,
    fontWeight: '900',
    color: '#ffffff',
    marginVertical: 6,
  },
  heroUnitLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '700',
    fontSize: 15,
  },
  resetButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
