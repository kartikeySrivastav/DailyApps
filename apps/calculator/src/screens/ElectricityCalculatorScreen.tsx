import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
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
import { useAppStorage } from '@dailyapps/storage';
import { useCalculationHistory } from '../hooks';
import { CalculationRecord } from '../types/history.types';
import {
  calculateElectricityBill,
  calculateApplianceCost,
  calculateSolarRooftop,
  calculateInverterBattery,
  calculateOhmsLaw,
  calculateMultiApplianceAudit,
  ApplianceAuditItem,
} from '../calculations/electricity';

interface ElectricityCalculatorScreenProps {
  navigation: any;
  route?: any;
}

type ElecMode = 'bill' | 'appliance' | 'solar' | 'inverter' | 'ohms';

export const ElectricityCalculatorScreen: React.FC<ElectricityCalculatorScreenProps> = ({
  navigation,
  route,
}) => {
  const theme = useTheme();
  const analytics = useAnalytics();

  const tool = route?.params?.tool;
  const initialMode: ElecMode =
    tool?.id === 'solar_rooftop' || tool?.id === 'solar_calc'
      ? 'solar'
      : tool?.id === 'inverter_battery' || tool?.id === 'battery_backup'
      ? 'inverter'
      : tool?.id === 'appliance_cost' || tool?.id === 'power_consumption'
      ? 'appliance'
      : tool?.id === 'ohms_law'
      ? 'ohms'
      : 'bill';

  const [mode, setMode] = useState<ElecMode>(initialMode);

  // 1. Bill State
  const [units, setUnits] = useState('240');
  const [fixedCharge, setFixedCharge] = useState('120');
  const [tariff, setTariff] = useState<'standard' | 'low_tariff' | 'commercial' | 'custom'>('standard');
  const [customTariffRate, setCustomTariffRate] = useState('7.5');

  // 2. Appliance States
  const [applianceView, setApplianceView] = useState<'audit' | 'single'>('audit');
  // Single mode inputs
  const [wattage, setWattage] = useState('1500');
  const [hours, setHours] = useState('8');
  const [ratePerUnit, setRatePerUnit] = useState('7.0');

  // Multi-Appliance Audit list
  const DEFAULT_APPLIANCES: ApplianceAuditItem[] = [
    { id: 'ac', name: 'Air Conditioner 1.5T', wattage: 1500, hoursPerDay: 8, quantity: 1, icon: '❄️' },
    { id: 'fridge', name: 'Refrigerator', wattage: 200, hoursPerDay: 24, quantity: 1, icon: '🧊' },
    { id: 'geyser', name: 'Water Geyser', wattage: 2000, hoursPerDay: 1, quantity: 1, icon: '🚿' },
    { id: 'fans', name: 'Ceiling Fans', wattage: 75, hoursPerDay: 12, quantity: 4, icon: '🌀' },
    { id: 'tv', name: 'Smart TV', wattage: 100, hoursPerDay: 5, quantity: 1, icon: '📺' },
    { id: 'lights', name: 'LED Lights', wattage: 12, hoursPerDay: 6, quantity: 8, icon: '💡' },
    { id: 'wm', name: 'Washing Machine', wattage: 500, hoursPerDay: 1, quantity: 1, icon: '🧺' },
    { id: 'laptop', name: 'Laptop / PC', wattage: 65, hoursPerDay: 8, quantity: 2, icon: '💻' },
  ];

  const [appliancesList, setAppliancesList] = useState<ApplianceAuditItem[]>(DEFAULT_APPLIANCES);

  // Custom Appliance Builder Form
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customWatts, setCustomWatts] = useState('');
  const [customHours, setCustomHours] = useState('4');
  const [customQty, setCustomQty] = useState('1');

  // 3. Solar State
  const [solarBill, setSolarBill] = useState('3500');

  // 4. Inverter State
  const [totalLoadWatts, setTotalLoadWatts] = useState('450');
  const [backupHours, setBackupHours] = useState('4');

  // 5. Ohm's Law State
  const [voltage, setVoltage] = useState('230');
  const [current, setCurrent] = useState('5');

  const handleReset = () => {
    if (mode === 'bill') {
      setUnits('240');
      setFixedCharge('120');
      setTariff('standard');
      setCustomTariffRate('7.5');
    } else if (mode === 'appliance') {
      setWattage('1500');
      setHours('8');
      setRatePerUnit('7.0');
      setAppliancesList(DEFAULT_APPLIANCES);
    } else if (mode === 'solar') {
      setSolarBill('3500');
      setRatePerUnit('7.0');
    } else if (mode === 'inverter') {
      setTotalLoadWatts('450');
      setBackupHours('4');
    } else if (mode === 'ohms') {
      setVoltage('230');
      setCurrent('5');
    }
  };

  useEffect(() => {
    analytics.logScreenView(tool?.name || 'ElectricityCalculator');
  }, [analytics, tool]);

  // Calculations
  const billResult = calculateElectricityBill({
    unitsConsumed: parseFloat(units) || 0,
    fixedCharges: parseFloat(fixedCharge) || 0,
    tariffType: tariff,
    customRatePerUnit: parseFloat(customTariffRate) || 7.0,
  });

  const applianceResult = calculateApplianceCost({
    wattage: parseFloat(wattage) || 0,
    hoursPerDay: parseFloat(hours) || 0,
    ratePerUnit: parseFloat(ratePerUnit) || 7,
  });

  const multiApplianceResult = useMemo(() => {
    return calculateMultiApplianceAudit(appliancesList, parseFloat(ratePerUnit) || 7);
  }, [appliancesList, ratePerUnit]);

  const solarResult = calculateSolarRooftop({
    monthlyBillOrUnits: parseFloat(solarBill) || 0,
    inputType: 'bill',
    ratePerUnit: parseFloat(ratePerUnit) || 7,
  });

  const inverterResult = calculateInverterBattery({
    totalWatts: parseFloat(totalLoadWatts) || 0,
    backupHoursRequired: parseFloat(backupHours) || 0,
  });

  const ohmsResult = calculateOhmsLaw({
    voltage: parseFloat(voltage) || undefined,
    current: parseFloat(current) || undefined,
  });

  const appliancePresets = [
    { label: 'AC 1.5T (1500W)', value: '1500' },
    { label: 'Geyser (2000W)', value: '2000' },
    { label: 'Fridge (200W)', value: '200' },
    { label: 'Fan (75W)', value: '75' },
    { label: 'TV (100W)', value: '100' },
    { label: 'Laptop (65W)', value: '65' },
  ];

  // Helpers for multi-appliance list
  const updateApplianceQty = (id: string, delta: number) => {
    setAppliancesList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const updateApplianceHours = (id: string, delta: number) => {
    setAppliancesList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newHours = Math.max(0.5, Math.min(24, Math.round((item.hoursPerDay + delta) * 10) / 10));
          return { ...item, hoursPerDay: newHours };
        }
        return item;
      })
    );
  };

  const storage = useAppStorage();

  useEffect(() => {
    storage.getJson<ApplianceAuditItem[]>('custom_appliances_audit', []).then((savedCustoms) => {
      if (savedCustoms && savedCustoms.length > 0) {
        setAppliancesList((prev) => {
          const nonCustom = prev.filter((p) => !p.isCustom);
          return [...savedCustoms, ...nonCustom];
        });
      }
    });
  }, [storage]);

  const removeAppliance = async (id: string) => {
    const updated = appliancesList.filter((item) => item.id !== id);
    setAppliancesList(updated);
    const customItems = updated.filter((item) => item.isCustom);
    await storage.setJson('custom_appliances_audit', customItems);
  };

  const handleClearAllCustomAppliances = async () => {
    const remaining = appliancesList.filter((item) => !item.isCustom);
    setAppliancesList(remaining);
    await storage.setJson('custom_appliances_audit', []);
  };

  const handleAddCustomAppliance = async () => {
    const w = parseFloat(customWatts);
    const h = parseFloat(customHours) || 4;
    const q = parseInt(customQty, 10) || 1;
    if (!customName.trim() || !w || w <= 0) return;

    const newItem: ApplianceAuditItem = {
      id: `custom_${Date.now()}`,
      name: customName.trim(),
      wattage: w,
      hoursPerDay: h,
      quantity: q,
      icon: '⚡',
      isCustom: true,
    };

    const updated = [newItem, ...appliancesList];
    setAppliancesList(updated);
    setCustomName('');
    setCustomWatts('');
    setCustomHours('4');
    setCustomQty('1');
    setShowAddCustom(false);

    const customItems = updated.filter((item) => item.isCustom);
    await storage.setJson('custom_appliances_audit', customItems);
  };

  const [showHistory, setShowHistory] = useState(false);
  const currentTitle =
    mode === 'bill'
      ? 'Electricity Bill Calculator'
      : mode === 'appliance'
      ? 'Appliance Power & Cost'
      : mode === 'solar'
      ? 'Solar Panel Sizing'
      : mode === 'inverter'
      ? 'Inverter & Battery Backup'
      : "Ohm's Law & Power";

  const { history, saveCalculation, clearHistory, deleteItem } = useCalculationHistory(
    tool?.id || 'electricity_bill',
    '🏠 Home'
  );

  // Auto-record calculation into history
  useEffect(() => {
    const numUnits = parseFloat(units) || 0;
    const numWatts = parseFloat(wattage) || 0;
    const numHours = parseFloat(hours) || 0;
    const numSolarBill = parseFloat(solarBill) || 0;
    const numLoadWatts = parseFloat(totalLoadWatts) || 0;
    const numV = parseFloat(voltage) || 0;
    const numI = parseFloat(current) || 0;

    const timer = setTimeout(() => {
      if (mode === 'bill' && numUnits > 0) {
        saveCalculation({
          toolId: tool?.id || 'electricity_bill',
          toolName: 'Electricity Bill Calculator',
          category: '🏠 Home',
          title: `Bill: ₹${billResult.totalBill.toLocaleString('en-IN')} (${units} units)`,
          subtitle: `Energy: ₹${billResult.energyCharges} | Fixed: ₹${fixedCharge}`,
          result: `Total: ₹${billResult.totalBill.toLocaleString('en-IN')}`,
          secondaryResult: `Duty & Surcharge: ₹${billResult.regulatoryDuty}`,
          badge: tariff.toUpperCase(),
          inputs: { mode: 'bill', units, fixedCharge, tariff, customTariffRate },
        });
      } else if (mode === 'appliance') {
        if (applianceView === 'audit' && multiApplianceResult.monthlyCost > 0) {
          saveCalculation({
            toolId: 'appliance_audit',
            toolName: 'Home Energy Audit (Multi-Appliance)',
            category: '🏠 Home',
            title: `Home Audit: ₹${multiApplianceResult.monthlyCost.toLocaleString('en-IN')}/mo`,
            subtitle: `${multiApplianceResult.totalConnectedKw} kW Connected | ${multiApplianceResult.monthlyUnitsKwh} units/mo`,
            result: `₹${multiApplianceResult.monthlyCost.toLocaleString('en-IN')}/mo`,
            secondaryResult: `Annual: ₹${multiApplianceResult.annualCost.toLocaleString('en-IN')}`,
            badge: 'AUDIT',
            inputs: { mode: 'appliance', applianceView: 'audit', ratePerUnit },
          });
        } else if (numWatts > 0 && numHours > 0) {
          saveCalculation({
            toolId: tool?.id || 'appliance_cost',
            toolName: 'Appliance Running Cost',
            category: '🏠 Home',
            title: `${wattage}W Appliance: ₹${applianceResult.monthlyCost} / mo`,
            subtitle: `${wattage}W × ${hours}h/day (${applianceResult.monthlyUnitsKwh} units/mo)`,
            result: `₹${applianceResult.monthlyCost}/month`,
            secondaryResult: `Annual Cost: ₹${applianceResult.annualCost}`,
            badge: 'APPLIANCE',
            inputs: { mode: 'appliance', wattage, hours, ratePerUnit },
          });
        }
      } else if (mode === 'solar' && numSolarBill > 0) {
        saveCalculation({
          toolId: tool?.id || 'solar_rooftop',
          toolName: 'Solar Panel Sizing',
          category: '🏠 Home',
          title: `Solar: ${solarResult.recommendedCapacityKw} kW Plant`,
          subtitle: `Roof: ${solarResult.rooftopAreaSqFt} sq ft | Payback: ${solarResult.paybackYears} yrs`,
          result: `${solarResult.recommendedCapacityKw} kW Plant`,
          secondaryResult: `Annual Savings: ₹${solarResult.annualSavings.toLocaleString('en-IN')}`,
          badge: 'SOLAR',
          inputs: { mode: 'solar', solarBill },
        });
      } else if (mode === 'inverter' && numLoadWatts > 0) {
        saveCalculation({
          toolId: tool?.id || 'inverter_battery',
          toolName: 'Inverter & Battery Backup',
          category: '🏠 Home',
          title: `Inverter: ${inverterResult.recommendedInverterVA} VA | ${inverterResult.batteryAhRequired} Ah`,
          subtitle: `Load: ${totalLoadWatts}W | Target: ${backupHours}h`,
          result: `${inverterResult.recommendedInverterVA} VA / ${inverterResult.batteryAhRequired} Ah`,
          badge: 'INVERTER',
          inputs: { mode: 'inverter', totalLoadWatts, backupHours },
        });
      } else if (mode === 'ohms' && numV > 0 && numI > 0) {
        saveCalculation({
          toolId: tool?.id || 'ohms_law',
          toolName: "Ohm's Law Calculator",
          category: '🏠 Home',
          title: `Ohm's Law: ${ohmsResult.power} W Power`,
          subtitle: `Voltage: ${voltage} V | Current: ${current} A | Resistance: ${ohmsResult.resistance} Ω`,
          result: `${ohmsResult.power} Watts (${ohmsResult.resistance} Ω)`,
          badge: 'OHMS',
          inputs: { mode: 'ohms', voltage, current },
        });
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [
    mode,
    units,
    fixedCharge,
    tariff,
    customTariffRate,
    wattage,
    hours,
    ratePerUnit,
    solarBill,
    totalLoadWatts,
    backupHours,
    voltage,
    current,
    billResult,
    applianceResult,
    multiApplianceResult,
    solarResult,
    inverterResult,
    ohmsResult,
    applianceView,
    saveCalculation,
    tool?.id,
  ]);

  const handleSelectHistory = (record: CalculationRecord) => {
    if (record.inputs) {
      if (record.inputs.mode) setMode(record.inputs.mode as ElecMode);
      if (record.inputs.units) setUnits(record.inputs.units);
      if (record.inputs.fixedCharge) setFixedCharge(record.inputs.fixedCharge);
      if (record.inputs.tariff) setTariff(record.inputs.tariff);
      if (record.inputs.customTariffRate) setCustomTariffRate(record.inputs.customTariffRate);
      if (record.inputs.wattage) setWattage(record.inputs.wattage);
      if (record.inputs.hours) setHours(record.inputs.hours);
      if (record.inputs.ratePerUnit) setRatePerUnit(record.inputs.ratePerUnit);
      if (record.inputs.solarBill) setSolarBill(record.inputs.solarBill);
      if (record.inputs.totalLoadWatts) setTotalLoadWatts(record.inputs.totalLoadWatts);
      if (record.inputs.backupHours) setBackupHours(record.inputs.backupHours);
      if (record.inputs.voltage) setVoltage(record.inputs.voltage);
      if (record.inputs.current) setCurrent(record.inputs.current);
    }
  };

  return (
    <ScreenContainer safeArea withPadding={false}>
      <CalculatorHeader
        title={currentTitle}
        subtitle={
          mode === 'bill'
            ? 'State tariff slab, custom rates & duty breakdown'
            : mode === 'appliance'
            ? 'Home appliances audit & monthly electricity bill'
            : mode === 'solar'
            ? 'PM Surya Ghar & kW rooftop requirements'
            : mode === 'inverter'
            ? 'Home load to VA rating & Ah battery backup'
            : 'Voltage, Current, Resistance & Power'
        }
        icon={mode === 'solar' ? '☀️' : mode === 'inverter' ? '🔋' : '⚡'}
        category="🏠 Home"
        toolId={tool?.id || 'electricity_bill'}
        onBack={() => navigation.goBack()}
        onHistory={() => setShowHistory(true)}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SegmentedTabs
          activeTab={mode}
          onTabChange={(key) => setMode(key as ElecMode)}
          scrollable
          tabs={[
            { key: 'bill', label: 'Power Bill', icon: '💡' },
            { key: 'appliance', label: 'Appliance & Home', icon: '🔌' },
            { key: 'solar', label: 'Solar Rooftop', icon: '☀️' },
            { key: 'inverter', label: 'Inverter & Battery', icon: '🔋' },
            { key: 'ohms', label: "Ohm's Law", icon: '⚡' },
          ]}
        />

        {/* 1. ELECTRICITY BILL SLABS */}
        {mode === 'bill' && (
          <>
            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Meter Consumption</Text>

              <CalcInputField
                label="Units Consumed (kWh)"
                suffix="Units"
                keyboardType="numeric"
                value={units}
                onChangeText={setUnits}
                placeholder="e.g. 240"
              />

              <Text style={[styles.sectionLabel, { color: theme.isDark ? '#CBD5E1' : '#475569' }]}>
                Quick Select Units
              </Text>
              <PresetPills
                options={['100', '150', '200', '250', '350', '500']}
                selectedValue={units}
                onSelect={(val) => setUnits(String(val))}
                scrollable
              />

              <View style={{ marginTop: 12 }}>
                <CalcInputField
                  label="Fixed Meter Rent / Demand Charge"
                  prefix="₹"
                  keyboardType="numeric"
                  value={fixedCharge}
                  onChangeText={setFixedCharge}
                  placeholder="120"
                />
              </View>

              <Text style={[styles.sectionLabel, { color: theme.isDark ? '#CBD5E1' : '#475569' }]}>
                Tariff Category
              </Text>
              <PresetPills
                options={[
                  { label: 'Standard Domestic', value: 'standard' },
                  { label: 'Subsidized / Low', value: 'low_tariff' },
                  { label: 'Commercial', value: 'commercial' },
                  { label: 'Custom Rate', value: 'custom' },
                ]}
                selectedValue={tariff}
                onSelect={(val) => setTariff(val as any)}
                scrollable
              />

              {tariff === 'custom' && (
                <View style={{ marginTop: 12 }}>
                  <CalcInputField
                    label="Custom Tariff Rate per Unit"
                    prefix="₹"
                    suffix="/kWh"
                    keyboardType="numeric"
                    value={customTariffRate}
                    onChangeText={setCustomTariffRate}
                    placeholder="7.50"
                  />
                </View>
              )}

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

            <ResultHeroCard
              title="Estimated Monthly Bill"
              value={`₹${billResult.totalBill.toLocaleString('en-IN')}`}
              subText={`Average Rate: ₹${billResult.averageRatePerUnit} per unit (kWh)`}
              variant="primary"
              badgeText={`Energy Charges: ₹${billResult.energyCharges} + Duty: ₹${billResult.regulatoryDuty}`}
              badgeType="warning"
              secondaryStats={[
                { label: 'Units', value: `${units} kWh` },
                { label: 'Energy Cost', value: `₹${billResult.energyCharges}` },
                { label: 'Fixed Charge', value: `₹${fixedCharge}` },
              ]}
            />

            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Slab-Wise Breakdown</Text>
              {billResult.slabs.map((slab, idx) => (
                <BreakdownRow
                  key={idx}
                  label={`${slab.slab} (${slab.units} units)`}
                  value={`₹${slab.amount.toFixed(2)}`}
                  subLabel={`@ ₹${slab.rate}/unit`}
                  showDivider
                />
              ))}
              <BreakdownRow
                label="Fixed Meter Charges"
                value={`₹${billResult.fixedCharges}`}
                showDivider
              />
              <BreakdownRow
                label="Electricity Duty / Surcharge (5%)"
                value={`₹${billResult.regulatoryDuty}`}
                showDivider
              />
              <BreakdownRow
                label="Total Payable"
                value={`₹${billResult.totalBill.toLocaleString('en-IN')}`}
                isBold
                isHighlight
                valueColor={theme.colors.primary}
              />
            </Card>

            <FormulaInfoCard
              title="Electricity Tariff Slab Calculation"
              formula="Total Bill = Fixed Charges + (Units × Slab Rate) + Govt Electricity Duty"
              explanation="Power distribution companies calculate bills using progressive telescopic slabs or custom flat DISCOM rates. Initial units have lower rates while high consumption enters higher tiers."
            />
          </>
        )}

        {/* 2. APPLIANCE & HOME AUDIT */}
        {mode === 'appliance' && (
          <>
            {/* Sub-view switcher */}
            <View style={styles.subModeContainer}>
              <TouchableOpacity
                onPress={() => setApplianceView('audit')}
                style={[
                  styles.subModeTab,
                  applianceView === 'audit' && {
                    backgroundColor: theme.colors.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.subModeText,
                    { color: applianceView === 'audit' ? '#FFF' : theme.colors.textMuted },
                  ]}
                >
                  🏠 Full Home Audit ({appliancesList.filter((a) => a.quantity > 0).length} active)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setApplianceView('single')}
                style={[
                  styles.subModeTab,
                  applianceView === 'single' && {
                    backgroundColor: theme.colors.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.subModeText,
                    { color: applianceView === 'single' ? '#FFF' : theme.colors.textMuted },
                  ]}
                >
                  ⚡ Single Appliance
                </Text>
              </TouchableOpacity>
            </View>

            {/* Rate Per Unit Controller for All Appliance Calculations */}
            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle, marginBottom: 12 }]}>
              <View style={styles.rateRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.itemTitle, { color: theme.colors.text }]}>⚡ Power Tariff Rate</Text>
                  <Text style={{ fontSize: 12, color: theme.colors.textMuted }}>State rate per unit (kWh)</Text>
                </View>
                <View style={{ width: 120 }}>
                  <CalcInputField
                    label=""
                    prefix="₹"
                    suffix="/u"
                    keyboardType="numeric"
                    value={ratePerUnit}
                    onChangeText={setRatePerUnit}
                    placeholder="7.0"
                  />
                </View>
              </View>
            </Card>

            {/* A. MULTI-APPLIANCE HOME AUDIT */}
            {applianceView === 'audit' && (
              <>
                <ResultHeroCard
                  title="Total Estimated Monthly Bill"
                  value={`₹${multiApplianceResult.monthlyCost.toLocaleString('en-IN')}`}
                  subText={`Total ${multiApplianceResult.monthlyUnitsKwh} units (kWh)/month`}
                  variant="primary"
                  badgeText={`Total Connected Load: ${multiApplianceResult.totalConnectedKw} kW (${multiApplianceResult.totalConnectedWatts}W)`}
                  badgeType="warning"
                  secondaryStats={[
                    { label: 'Daily Units', value: `${multiApplianceResult.dailyUnitsKwh} kWh` },
                    { label: 'Monthly Units', value: `${multiApplianceResult.monthlyUnitsKwh} kWh` },
                    { label: 'Annual Bill', value: `₹${multiApplianceResult.annualCost.toLocaleString('en-IN')}` },
                  ]}
                />

                {/* Appliances List with Multi-item and Custom Controls */}
                <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
                  <View style={[styles.cardHeaderRow, { gap: 12 }]}>
                    <Text style={[styles.cardTitle, { color: theme.colors.text, marginBottom: 0, flex: 1 }]} numberOfLines={1}>
                      Household Appliances
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      {appliancesList.filter((item) => item.isCustom).length > 0 && !showAddCustom && (
                        <TouchableOpacity
                          onPress={handleClearAllCustomAppliances}
                          style={[
                            styles.addCustomBtn,
                            {
                              borderColor: 'rgba(239, 68, 68, 0.4)',
                              backgroundColor: theme.isDark ? 'rgba(239, 68, 68, 0.18)' : '#FEE2E2',
                            },
                          ]}
                        >
                          <Text style={[styles.addCustomBtnText, { color: '#EF4444' }]}>
                            🗑️ Clear ({appliancesList.filter((item) => item.isCustom).length})
                          </Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        onPress={() => setShowAddCustom(!showAddCustom)}
                        style={[
                          styles.addCustomBtn,
                          {
                            borderColor: theme.colors.primary,
                            backgroundColor: theme.isDark ? 'rgba(59, 130, 246, 0.12)' : 'rgba(59, 130, 246, 0.08)',
                          },
                        ]}
                      >
                        <Text style={[styles.addCustomBtnText, { color: theme.colors.primary }]}>
                          {showAddCustom ? '✕ Close' : '＋ Custom'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Add Custom Appliance Form */}
                  {showAddCustom && (
                    <View style={[styles.customFormBox, { backgroundColor: theme.isDark ? '#0F172A' : '#F1F5F9', borderColor: theme.colors.primary }]}>
                      <Text style={[styles.customFormTitle, { color: theme.colors.primary }]}>
                        Add Custom Appliance
                      </Text>

                      <CalcInputField
                        label="Appliance Name"
                        keyboardType="default"
                        value={customName}
                        onChangeText={setCustomName}
                        placeholder="e.g. Gaming PC, Room Heater, Motor"
                      />

                      <View style={styles.rowInputs}>
                        <View style={styles.flex1}>
                          <CalcInputField
                            label="Power (Watts)"
                            suffix="W"
                            keyboardType="numeric"
                            value={customWatts}
                            onChangeText={setCustomWatts}
                            placeholder="e.g. 750"
                          />
                        </View>
                        <View style={styles.flex1}>
                          <CalcInputField
                            label="Daily Run Time"
                            suffix="hrs"
                            keyboardType="numeric"
                            value={customHours}
                            onChangeText={setCustomHours}
                            placeholder="4"
                          />
                        </View>
                        <View style={{ width: 75 }}>
                          <CalcInputField
                            label="Qty"
                            keyboardType="numeric"
                            value={customQty}
                            onChangeText={setCustomQty}
                            placeholder="1"
                          />
                        </View>
                      </View>

                      <TouchableOpacity
                        onPress={handleAddCustomAppliance}
                        style={[styles.addSubmitBtn, { backgroundColor: theme.colors.primary }]}
                      >
                        <Text style={styles.addSubmitBtnText}>✓ Add to Audit</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Appliance Rows */}
                  {appliancesList.map((item) => {
                    const itemWatts = item.wattage * item.quantity;
                    const itemUnitsMonth = Math.round((itemWatts * item.hoursPerDay * 30) / 1000);
                    const itemCostMonth = Math.round(itemUnitsMonth * (parseFloat(ratePerUnit) || 7));
                    const isActive = item.quantity > 0 && item.hoursPerDay > 0;

                    return (
                      <View
                        key={item.id}
                        style={[
                          styles.applianceItemRow,
                          {
                            borderColor: theme.colors.borderSubtle,
                            opacity: isActive ? 1 : 0.5,
                            backgroundColor: isActive
                              ? theme.isDark
                                ? 'rgba(30, 41, 59, 0.4)'
                                : '#F8FAFC'
                              : 'transparent',
                          },
                        ]}
                      >
                        {/* Top: Icon + Name + Monthly Cost */}
                        <View style={styles.itemHeader}>
                          <View style={styles.itemTitleGroup}>
                            <Text style={styles.itemIcon}>{item.icon || '⚡'}</Text>
                            <View>
                              <Text style={[styles.itemTitle, { color: theme.colors.text }]}>
                                {item.name}
                              </Text>
                              <Text style={{ fontSize: 11, color: theme.colors.textMuted }}>
                                {item.wattage}W × {item.quantity} Qty = {itemWatts}W total
                              </Text>
                            </View>
                          </View>

                          <View style={{ alignItems: 'flex-end' }}>
                            <Text style={[styles.itemCost, { color: isActive ? theme.colors.primary : theme.colors.textMuted }]}>
                              ₹{itemCostMonth.toLocaleString('en-IN')}/mo
                            </Text>
                            <Text style={{ fontSize: 11, color: theme.colors.textMuted }}>
                              ~{itemUnitsMonth} units/mo
                            </Text>
                          </View>
                        </View>

                        {/* Bottom: Quantity & Hours Controls */}
                        <View style={styles.controlsRow}>
                          {/* Quantity control */}
                          <View style={styles.stepperGroup}>
                            <Text style={[styles.controlLabel, { color: theme.colors.textMuted }]}>Qty:</Text>
                            <TouchableOpacity
                              onPress={() => updateApplianceQty(item.id, -1)}
                              style={[styles.stepBtn, { borderColor: theme.colors.borderSubtle }]}
                            >
                              <Text style={[styles.stepBtnText, { color: theme.colors.text }]}>-</Text>
                            </TouchableOpacity>
                            <Text style={[styles.stepValue, { color: theme.colors.text }]}>{item.quantity}</Text>
                            <TouchableOpacity
                              onPress={() => updateApplianceQty(item.id, 1)}
                              style={[styles.stepBtn, { borderColor: theme.colors.borderSubtle }]}
                            >
                              <Text style={[styles.stepBtnText, { color: theme.colors.text }]}>+</Text>
                            </TouchableOpacity>
                          </View>

                          {/* Hours per day control */}
                          <View style={styles.stepperGroup}>
                            <Text style={[styles.controlLabel, { color: theme.colors.textMuted }]}>Hours:</Text>
                            <TouchableOpacity
                              onPress={() => updateApplianceHours(item.id, -1)}
                              style={[styles.stepBtn, { borderColor: theme.colors.borderSubtle }]}
                            >
                              <Text style={[styles.stepBtnText, { color: theme.colors.text }]}>-</Text>
                            </TouchableOpacity>
                            <Text style={[styles.stepValue, { color: theme.colors.text }]}>{item.hoursPerDay}h</Text>
                            <TouchableOpacity
                              onPress={() => updateApplianceHours(item.id, 1)}
                              style={[styles.stepBtn, { borderColor: theme.colors.borderSubtle }]}
                            >
                              <Text style={[styles.stepBtnText, { color: theme.colors.text }]}>+</Text>
                            </TouchableOpacity>
                          </View>

                          {/* Delete Item button */}
                          <TouchableOpacity
                            onPress={() => removeAppliance(item.id)}
                            style={styles.deleteBtn}
                          >
                            <Text style={styles.deleteBtnText}>✕</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}

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
                    <Text style={[styles.resetButtonText, { color: '#EF4444' }]}>↺ Reset to Defaults</Text>
                  </TouchableOpacity>
                </Card>

                {/* Energy Consumption Ranking */}
                <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
                  <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Appliance Consumption Share</Text>
                  {multiApplianceResult.itemBreakdown
                    .filter((b) => b.dailyUnits > 0)
                    .sort((a, b) => b.monthlyCost - a.monthlyCost)
                    .map((item, idx) => (
                      <BreakdownRow
                        key={idx}
                        label={`${item.name} (${item.percentOfTotal}%)`}
                        value={`₹${item.monthlyCost}/mo`}
                        subLabel={`${item.monthlyUnits} kWh / mo`}
                        showDivider
                      />
                    ))}
                  <BreakdownRow
                    label="Total Household Bill"
                    value={`₹${multiApplianceResult.monthlyCost.toLocaleString('en-IN')}`}
                    isBold
                    isHighlight
                    valueColor={theme.colors.primary}
                  />
                </Card>
              </>
            )}

            {/* B. SINGLE APPLIANCE MODE */}
            {applianceView === 'single' && (
              <>
                <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
                  <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Appliance Details</Text>

                  <Text style={[styles.sectionLabel, { color: theme.isDark ? '#CBD5E1' : '#475569' }]}>
                    Preset Common Appliances
                  </Text>
                  <PresetPills
                    options={appliancePresets}
                    selectedValue={wattage}
                    onSelect={(val) => setWattage(String(val))}
                    scrollable
                  />

                  <View style={{ marginTop: 12 }}>
                    <CalcInputField
                      label="Appliance Power Wattage"
                      suffix="Watts (W)"
                      keyboardType="numeric"
                      value={wattage}
                      onChangeText={setWattage}
                      placeholder="e.g. 1500"
                    />
                  </View>

                  <View style={styles.rowInputs}>
                    <View style={styles.flex1}>
                      <CalcInputField
                        label="Daily Run Time"
                        suffix="Hours/Day"
                        keyboardType="numeric"
                        value={hours}
                        onChangeText={setHours}
                        placeholder="8"
                      />
                    </View>

                    <View style={styles.flex1}>
                      <CalcInputField
                        label="Cost Per Unit"
                        prefix="₹"
                        suffix="/kWh"
                        keyboardType="numeric"
                        value={ratePerUnit}
                        onChangeText={setRatePerUnit}
                        placeholder="7.0"
                      />
                    </View>
                  </View>

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

                <ResultHeroCard
                  title="Monthly Running Cost"
                  value={`₹${applianceResult.monthlyCost.toLocaleString('en-IN')}`}
                  subText={`Consumes ${applianceResult.monthlyUnitsKwh} units (kWh) per month`}
                  variant="primary"
                  badgeText={`Annual Cost: ₹${applianceResult.annualCost.toLocaleString('en-IN')}/year`}
                  badgeType="info"
                  secondaryStats={[
                    { label: 'Daily Units', value: `${applianceResult.dailyUnitsKwh} kWh` },
                    { label: 'Daily Cost', value: `₹${applianceResult.dailyCost}` },
                    { label: 'Monthly Units', value: `${applianceResult.monthlyUnitsKwh} kWh` },
                  ]}
                />
              </>
            )}

            <FormulaInfoCard
              title="Home Appliance Energy Calculation"
              formula="Monthly Units (kWh) = (Watts × Quantity × Hours/day × 30) / 1000"
              explanation="Power consumed by appliances is measured in kilowatt-hours (Units). Multiplying total monthly units by your tariff rate gives your exact monthly electricity expense."
            />
          </>
        )}

        {/* 3. SOLAR ROOFTOP */}
        {mode === 'solar' && (
          <>
            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Current Electricity Expense</Text>

              <CalcInputField
                label="Average Monthly Electricity Bill"
                prefix="₹"
                keyboardType="numeric"
                value={solarBill}
                onChangeText={setSolarBill}
                placeholder="e.g. 3500"
              />

              <Text style={[styles.sectionLabel, { color: theme.isDark ? '#CBD5E1' : '#475569' }]}>
                Quick Bill Presets
              </Text>
              <PresetPills
                options={['₹1,500', '₹2,500', '₹3,500', '₹5,000', '₹7,500', '₹10,000']}
                selectedValue={`₹${Number(solarBill).toLocaleString('en-IN')}`}
                onSelect={(val) => setSolarBill(String(val).replace(/[₹,]/g, ''))}
                scrollable
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

            <ResultHeroCard
              title="Recommended Solar Rooftop Plant"
              value={`${solarResult.recommendedCapacityKw} kW Plant`}
              subText={`Generates ~${solarResult.monthlyGenerationUnits} units/month`}
              variant="primary"
              badgeText={`Est. Subsidy Benefit (PM Surya Ghar)`}
              badgeType="success"
              secondaryStats={[
                { label: 'Panels Needed', value: `${solarResult.numberOfPanels} panels` },
                { label: 'Rooftop Area', value: `${solarResult.rooftopAreaSqFt} sq ft` },
                { label: 'Annual Savings', value: `₹${solarResult.annualSavings.toLocaleString('en-IN')}` },
                { label: 'Payback Period', value: `${solarResult.paybackYears} Years` },
              ]}
            />

            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Solar Feasibility & Cost Summary</Text>
              <BreakdownRow
                label="Plant Capacity"
                value={`${solarResult.recommendedCapacityKw} kW (Rooftop)`}
                showDivider
              />
              <BreakdownRow
                label="Solar Panels (550W DCR)"
                value={`${solarResult.numberOfPanels} Modules`}
                showDivider
              />
              <BreakdownRow
                label="Roof Shadow-Free Area"
                value={`~${solarResult.rooftopAreaSqFt} sq ft`}
                showDivider
              />
              <BreakdownRow
                label="Expected Daily Generation"
                value={`~${solarResult.dailyGenerationUnits} units/day`}
                showDivider
              />
              <BreakdownRow
                label="Expected Monthly Generation"
                value={`~${solarResult.monthlyGenerationUnits} units/month`}
                showDivider
              />
              <BreakdownRow
                label="Net Cost (Post Subsidy)"
                value={`~₹${solarResult.estimatedCost.toLocaleString('en-IN')}`}
                showDivider
              />
              <BreakdownRow
                label="Annual Power Savings"
                value={`₹${solarResult.annualSavings.toLocaleString('en-IN')}/year`}
                isBold
                isHighlight
                valueColor={theme.colors.primary}
              />
            </Card>

            <FormulaInfoCard
              title="PM Surya Ghar Muft Bijli Yojana Formula"
              formula="Capacity (kW) = Monthly Units / (Sun Hours × 30 × 0.8 System Efficiency)"
              explanation="Solar capacity is sized to offset 100% of your average grid consumption. Under the PM Surya Ghar scheme, 1kW-3kW systems receive up to ₹78,000 central government capital subsidy."
            />
          </>
        )}

        {/* 4. INVERTER & BATTERY */}
        {mode === 'inverter' && (
          <>
            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Power Cut Backup Requirement</Text>

              <CalcInputField
                label="Total Running Load during Power Cut"
                suffix="Watts (W)"
                keyboardType="numeric"
                value={totalLoadWatts}
                onChangeText={setTotalLoadWatts}
                placeholder="e.g. 450"
              />

              <Text style={[styles.sectionLabel, { color: theme.isDark ? '#CBD5E1' : '#475569' }]}>
                Common Home Load Presets
              </Text>
              <PresetPills
                options={[
                  { label: 'Basic (2 Fans + 3 Lights) ~200W', value: '200' },
                  { label: 'Medium (3 Fans + 4 Lights + TV) ~450W', value: '450' },
                  { label: 'Heavy (+ Fridge / PC) ~750W', value: '750' },
                  { label: 'Max (+ Washing/Motor) ~1200W', value: '1200' },
                ]}
                selectedValue={totalLoadWatts}
                onSelect={(val) => setTotalLoadWatts(String(val))}
                scrollable
              />

              <View style={{ marginTop: 12 }}>
                <CalcInputField
                  label="Required Backup Duration"
                  suffix="Hours"
                  keyboardType="numeric"
                  value={backupHours}
                  onChangeText={setBackupHours}
                  placeholder="e.g. 4"
                />
              </View>

              <Text style={[styles.sectionLabel, { color: theme.isDark ? '#CBD5E1' : '#475569' }]}>
                Quick Backup Hours
              </Text>
              <PresetPills
                options={['2 Hours', '3 Hours', '4 Hours', '6 Hours', '8 Hours']}
                selectedValue={`${backupHours} Hours`}
                onSelect={(val) => setBackupHours(String(val).replace(' Hours', ''))}
                scrollable
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

            <ResultHeroCard
              title="Recommended Inverter & Battery"
              value={`${inverterResult.recommendedInverterVA} VA`}
              subText={`Paired with ${inverterResult.batteryAhRequired} Ah (12V) Battery`}
              variant="primary"
              badgeText={`Standard Model: ${inverterResult.recommendedBatteryModel}`}
              badgeType="info"
              secondaryStats={[
                { label: 'Actual Load', value: `${totalLoadWatts} Watts` },
                { label: 'Backup Time', value: `${backupHours} Hours` },
                { label: 'Energy Needed', value: `${(parseFloat(totalLoadWatts) || 0) * (parseFloat(backupHours) || 0)} Wh` },
                { label: 'Battery Volts', value: `12 V` },
              ]}
            />

            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Hardware Sizing Breakdown</Text>
              <BreakdownRow
                label="Peak Power Required"
                value={`${totalLoadWatts} W`}
                showDivider
              />
              <BreakdownRow
                label="Inverter VA (Base Load / 0.8 PF)"
                value={`${Math.round((parseFloat(totalLoadWatts) || 0) / 0.8)} VA`}
                subLabel="Minimum rating before safety buffer"
                showDivider
              />
              <BreakdownRow
                label="Recommended Inverter"
                value={`${inverterResult.recommendedInverterVA} VA`}
                isBold
                showDivider
              />
              <BreakdownRow
                label="Calculated Battery Capacity"
                value={`${inverterResult.batteryAhRequired} Ah`}
                subLabel="At 12V with 80% Depth of Discharge"
                showDivider
              />
              <BreakdownRow
                label="Market Battery Choice"
                value={inverterResult.recommendedBatteryModel}
                isBold
                isHighlight
                valueColor={theme.colors.primary}
              />
            </Card>

            <FormulaInfoCard
              title="Inverter & Battery Sizing Equations"
              formula="Inverter VA = Total Watts / 0.8   |   Battery Ah = (Watts × Hours) / (12V × 0.8 DoD)"
              explanation="Inverters need head-room for appliance starting surge currents. Lead-acid tubular batteries are sized with an 80% DoD (Depth of Discharge) so they don't deep-discharge and degrade."
            />
          </>
        )}

        {/* 5. OHM'S LAW */}
        {mode === 'ohms' && (
          <>
            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Circuit Parameters (Enter Any Two)</Text>

              <View style={styles.rowInputs}>
                <View style={styles.flex1}>
                  <CalcInputField
                    label="Voltage (V)"
                    suffix="Volts"
                    keyboardType="numeric"
                    value={voltage}
                    onChangeText={setVoltage}
                    placeholder="230"
                  />
                </View>
                <View style={styles.flex1}>
                  <CalcInputField
                    label="Current (I)"
                    suffix="Amps"
                    keyboardType="numeric"
                    value={current}
                    onChangeText={setCurrent}
                    placeholder="5"
                  />
                </View>
              </View>

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

            <ResultHeroCard
              title="Electrical Power & Resistance"
              value={`${ohmsResult.power} Watts`}
              subText="Active electrical circuit calculation"
              variant="primary"
              badgeText={`Resistance: ${ohmsResult.resistance} Ω (Ohms)`}
              badgeType="info"
              secondaryStats={[
                { label: 'Voltage', value: `${ohmsResult.voltage} V` },
                { label: 'Current', value: `${ohmsResult.current} A` },
                { label: 'Resistance', value: `${ohmsResult.resistance} Ω` },
              ]}
            />

            <FormulaInfoCard
              title="Ohm's Law & Electrical Power Equations"
              formula="V = I × R   |   P = V × I   |   P = I² × R"
              explanation="Ohm's Law expresses the fundamental relationship between Voltage (V in Volts), Current (I in Amperes), Resistance (R in Ohms Ω), and Electrical Power (P in Watts)."
            />
          </>
        )}
      </ScrollView>

      <CalculationHistoryModal
        visible={showHistory}
        onClose={() => setShowHistory(false)}
        title="Power & Energy History"
        subtitle="Past bills, solar & power calculations"
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
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
    marginBottom: 4,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  subModeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  subModeTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(100, 116, 139, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subModeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addCustomBtn: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addCustomBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  customFormBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  customFormTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
  },
  addSubmitBtn: {
    marginTop: 8,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addSubmitBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  applianceItemRow: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  itemIcon: {
    fontSize: 20,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  itemCost: {
    fontSize: 14,
    fontWeight: '800',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
  },
  stepperGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  controlLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  stepValue: {
    fontSize: 13,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
  },
  deleteBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  deleteBtnText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '700',
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
