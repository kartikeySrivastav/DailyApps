import React, { useState, useEffect } from 'react';
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
  calculateFuelTrip,
  calculateMileage,
  calculateTripPlanner,
  calculateEVCharging,
  CustomTripExpense,
  FUEL_FORMULA_EXPLANATION,
} from '../calculations/fuel';

interface FuelCostCalculatorScreenProps {
  navigation: any;
  route?: any;
}

type FuelMode = 'fuel' | 'mileage' | 'trip' | 'ev';

export const FuelCostCalculatorScreen: React.FC<FuelCostCalculatorScreenProps> = ({
  navigation,
  route,
}) => {
  const theme = useTheme();
  const analytics = useAnalytics();

  const tool = route?.params?.tool;
  const initialMode: FuelMode =
    tool?.id === 'mileage_calc' || tool?.id === 'mileage'
      ? 'mileage'
      : tool?.id === 'trip_planner' || tool?.id === 'travel_cost'
      ? 'trip'
      : tool?.id === 'ev_charging' || tool?.id === 'ev_cost'
      ? 'ev'
      : 'fuel';

  const [mode, setMode] = useState<FuelMode>(initialMode);

  // 1. Fuel & Split State
  const [distance, setDistance] = useState('250');
  const [mileage, setMileage] = useState('18');
  const [fuelPrice, setFuelPrice] = useState('96');
  const [passengers, setPassengers] = useState('4');

  // 2. Mileage (Tank-to-Tank) State
  const [drivenKm, setDrivenKm] = useState('420');
  const [refillLitres, setRefillLitres] = useState('22');
  const [fuelRatePerLitre, setFuelRatePerLitre] = useState('96');

  // 3. Trip Planner State (with dynamic custom expenses)
  const [tripDistance, setTripDistance] = useState('350');
  const [tripMileage, setTripMileage] = useState('17');
  const [tripFuelPrice, setTripFuelPrice] = useState('96');
  const [tripPax, setTripPax] = useState('4');

  const DEFAULT_TRIP_EXPENSES: CustomTripExpense[] = [
    { id: 'toll', name: 'FASTag Highway Tolls', amount: 380 },
    { id: 'parking', name: 'Parking & Entry Permits', amount: 150 },
    { id: 'food', name: 'Food & Dhaba Meals', amount: 600 },
  ];
  const [tripExpenses, setTripExpenses] = useState<CustomTripExpense[]>(DEFAULT_TRIP_EXPENSES);

  // Add custom expense form
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');

  // 4. EV Charging State (with charger speeds)
  const [evBatteryKwh, setEvBatteryKwh] = useState('30.2'); // e.g. Tiago/Nexon EV
  const [evCurrentPct, setEvCurrentPct] = useState('20');
  const [evTargetPct, setEvTargetPct] = useState('100');
  const [evRatePerUnit, setEvRatePerUnit] = useState('8.0'); // ₹/kWh home or public
  const [evFullRangeKm, setEvFullRangeKm] = useState('315');
  const [evChargerPower, setEvChargerPower] = useState('3.3');
  const [customChargerKw, setCustomChargerKw] = useState('');

  const handleReset = () => {
    if (mode === 'fuel') {
      setDistance('250');
      setMileage('18');
      setFuelPrice('96');
      setPassengers('4');
    } else if (mode === 'mileage') {
      setDrivenKm('420');
      setRefillLitres('22');
      setFuelRatePerLitre('96');
    } else if (mode === 'trip') {
      setTripDistance('350');
      setTripMileage('17');
      setTripFuelPrice('96');
      setTripPax('4');
      setTripExpenses(DEFAULT_TRIP_EXPENSES);
    } else if (mode === 'ev') {
      setEvBatteryKwh('30.2');
      setEvCurrentPct('20');
      setEvTargetPct('100');
      setEvRatePerUnit('8.0');
      setEvFullRangeKm('315');
      setEvChargerPower('3.3');
      setCustomChargerKw('');
    }
  };

  useEffect(() => {
    analytics.logScreenView(tool?.name || 'VehicleCalculator');
  }, [analytics, tool]);

  // Calculations
  const fuelResult = calculateFuelTrip({
    distanceKm: parseFloat(distance) || 0,
    mileageKmpl: parseFloat(mileage) || 0,
    fuelPricePerLitre: parseFloat(fuelPrice) || 0,
    passengers: parseInt(passengers, 10) || 1,
  });

  const mileageResult = calculateMileage({
    distanceKm: parseFloat(drivenKm) || 0,
    fuelLitres: parseFloat(refillLitres) || 0,
    fuelPricePerLitre: parseFloat(fuelRatePerLitre) || 96,
  });

  const tripResult = calculateTripPlanner({
    distanceKm: parseFloat(tripDistance) || 0,
    mileageKmpl: parseFloat(tripMileage) || 0,
    fuelPricePerLitre: parseFloat(tripFuelPrice) || 0,
    customExpenses: tripExpenses,
    passengers: parseInt(tripPax, 10) || 1,
  });

  const effectiveChargerKw =
    evChargerPower === 'custom'
      ? parseFloat(customChargerKw) || 3.3
      : parseFloat(evChargerPower) || 3.3;

  const evResult = calculateEVCharging({
    batteryCapacityKwh: parseFloat(evBatteryKwh) || 0,
    currentPct: parseFloat(evCurrentPct) || 0,
    targetPct: parseFloat(evTargetPct) || 100,
    electricityRatePerUnit: parseFloat(evRatePerUnit) || 8,
    fullChargeRangeKm: parseFloat(evFullRangeKm) || 0,
    chargerPowerKw: effectiveChargerKw,
  });

  const storage = useAppStorage();

  useEffect(() => {
    storage.getJson<CustomTripExpense[]>('custom_trip_expenses', []).then((savedExpenses) => {
      if (savedExpenses && savedExpenses.length > 0) {
        setTripExpenses([...DEFAULT_TRIP_EXPENSES, ...savedExpenses]);
      }
    });
  }, [storage]);

  // Trip custom expense handlers
  const handleAddCustomExpense = async () => {
    const amt = parseFloat(newExpenseAmount);
    if (!newExpenseName.trim() || !amt || amt <= 0) return;

    const newExp: CustomTripExpense = {
      id: `custom_exp_${Date.now()}`,
      name: newExpenseName.trim(),
      amount: amt,
    };

    const updated = [...tripExpenses, newExp];
    setTripExpenses(updated);
    setNewExpenseName('');
    setNewExpenseAmount('');
    setShowAddExpense(false);

    const customs = updated.filter((e) => e.id.startsWith('custom_exp_'));
    await storage.setJson('custom_trip_expenses', customs);
  };

  const removeTripExpense = async (id: string) => {
    const updated = tripExpenses.filter((exp) => exp.id !== id);
    setTripExpenses(updated);
    const customs = updated.filter((e) => e.id.startsWith('custom_exp_'));
    await storage.setJson('custom_trip_expenses', customs);
  };

  const handleClearAllCustomExpenses = async () => {
    setTripExpenses(DEFAULT_TRIP_EXPENSES);
    await storage.setJson('custom_trip_expenses', []);
  };

  const updateTripExpenseAmount = (id: string, newAmt: string) => {
    const amt = parseFloat(newAmt) || 0;
    setTripExpenses((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, amount: amt } : exp))
    );
  };

  const currentTitle =
    mode === 'fuel'
      ? 'Fuel & Trip Split'
      : mode === 'mileage'
      ? 'Vehicle Mileage (km/L)'
      : mode === 'trip'
      ? 'Road Trip Cost Planner'
      : 'EV Charging & Cost';

  const [showHistory, setShowHistory] = useState(false);
  const { history, saveCalculation, clearHistory, deleteItem } = useCalculationHistory(
    tool?.id || 'fuel_cost',
    '🚗 Vehicle'
  );

  // Auto-record calculation into history
  useEffect(() => {
    const numDist = parseFloat(distance) || 0;
    const numDriven = parseFloat(drivenKm) || 0;
    const numTripDist = parseFloat(tripDistance) || 0;
    const numEvBatt = parseFloat(evBatteryKwh) || 0;

    const timer = setTimeout(() => {
      if (mode === 'fuel' && numDist > 0) {
        saveCalculation({
          toolId: tool?.id || 'fuel_cost',
          toolName: 'Fuel Cost Calculator',
          category: '🚗 Vehicle',
          title: `Trip ${distance}km: ₹${fuelResult.totalCost.toLocaleString('en-IN')}`,
          subtitle: `${fuelResult.fuelNeededLitres}L @ ₹${fuelPrice}/L | Split: ₹${fuelResult.costPerPerson}/pax`,
          result: `Total: ₹${fuelResult.totalCost.toLocaleString('en-IN')}`,
          secondaryResult: `Split (${passengers} pax): ₹${fuelResult.costPerPerson}`,
          badge: 'FUEL',
          inputs: { mode: 'fuel', distance, mileage, fuelPrice, passengers },
        });
      } else if (mode === 'mileage' && numDriven > 0) {
        saveCalculation({
          toolId: tool?.id || 'mileage_calc',
          toolName: 'Mileage Calculator',
          category: '🚗 Vehicle',
          title: `Mileage: ${mileageResult.mileageKmpl} km/L`,
          subtitle: `${drivenKm}km driven with ${refillLitres}L refill | ₹${mileageResult.costPerKm}/km`,
          result: `${mileageResult.mileageKmpl} km/L`,
          secondaryResult: `Running Cost: ₹${mileageResult.costPerKm}/km`,
          badge: 'MILEAGE',
          inputs: { mode: 'mileage', drivenKm, refillLitres, fuelRatePerLitre },
        });
      } else if (mode === 'trip' && numTripDist > 0) {
        saveCalculation({
          toolId: tool?.id || 'trip_planner',
          toolName: 'Trip Cost Planner',
          category: '🚗 Vehicle',
          title: `Road Trip: ₹${tripResult.totalTripCost.toLocaleString('en-IN')} (${tripPax} Pax)`,
          subtitle: `Fuel: ₹${tripResult.fuelCost} + Other Expenses: ₹${tripResult.otherExpenses}`,
          result: `₹${tripResult.totalTripCost.toLocaleString('en-IN')} (₹${tripResult.costPerPerson}/person)`,
          badge: 'TRIP',
          inputs: { mode: 'trip', tripDistance, tripMileage, tripFuelPrice, tripPax },
        });
      } else if (mode === 'ev' && numEvBatt > 0) {
        saveCalculation({
          toolId: tool?.id || 'ev_charging',
          toolName: 'EV Charging & Range',
          category: '🚗 Vehicle',
          title: `EV Charge (${evCurrentPct}% → ${evTargetPct}%): ₹${evResult.totalChargingCost}`,
          subtitle: `+${evResult.rangeAddedKm} km Range Added | Rate: ₹${evResult.costPerKm}/km`,
          result: `₹${evResult.totalChargingCost} (+${evResult.rangeAddedKm} km)`,
          badge: 'EV',
          inputs: { mode: 'ev', evBatteryKwh, evCurrentPct, evTargetPct, evRatePerUnit, evFullRangeKm, evChargerPower },
        });
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [
    mode,
    distance,
    mileage,
    fuelPrice,
    passengers,
    drivenKm,
    refillLitres,
    fuelRatePerLitre,
    tripDistance,
    tripMileage,
    tripFuelPrice,
    tripPax,
    tripExpenses,
    evBatteryKwh,
    evCurrentPct,
    evTargetPct,
    evRatePerUnit,
    evFullRangeKm,
    evChargerPower,
    effectiveChargerKw,
    fuelResult,
    mileageResult,
    tripResult,
    evResult,
    saveCalculation,
    tool?.id,
  ]);

  const handleSelectHistory = (record: CalculationRecord) => {
    if (record.inputs) {
      if (record.inputs.mode) setMode(record.inputs.mode as FuelMode);
      if (record.inputs.distance) setDistance(record.inputs.distance);
      if (record.inputs.mileage) setMileage(record.inputs.mileage);
      if (record.inputs.fuelPrice) setFuelPrice(record.inputs.fuelPrice);
      if (record.inputs.passengers) setPassengers(record.inputs.passengers);
      if (record.inputs.drivenKm) setDrivenKm(record.inputs.drivenKm);
      if (record.inputs.refillLitres) setRefillLitres(record.inputs.refillLitres);
      if (record.inputs.fuelRatePerLitre) setFuelRatePerLitre(record.inputs.fuelRatePerLitre);
      if (record.inputs.tripDistance) setTripDistance(record.inputs.tripDistance);
      if (record.inputs.tripMileage) setTripMileage(record.inputs.tripMileage);
      if (record.inputs.tripFuelPrice) setTripFuelPrice(record.inputs.tripFuelPrice);
      if (record.inputs.tripPax) setTripPax(record.inputs.tripPax);
      if (record.inputs.evBatteryKwh) setEvBatteryKwh(record.inputs.evBatteryKwh);
      if (record.inputs.evCurrentPct) setEvCurrentPct(record.inputs.evCurrentPct);
      if (record.inputs.evTargetPct) setEvTargetPct(record.inputs.evTargetPct);
      if (record.inputs.evRatePerUnit) setEvRatePerUnit(record.inputs.evRatePerUnit);
      if (record.inputs.evFullRangeKm) setEvFullRangeKm(record.inputs.evFullRangeKm);
      if (record.inputs.evChargerPower) setEvChargerPower(record.inputs.evChargerPower);
    }
  };

  return (
    <ScreenContainer safeArea withPadding={false}>
      <CalculatorHeader
        title={currentTitle}
        subtitle={
          mode === 'fuel'
            ? 'Travel distance, mileage & per person split'
            : mode === 'mileage'
            ? 'Tank-to-tank actual fuel economy & cost/km'
            : mode === 'trip'
            ? 'Fuel, FASTag tolls, custom expenses & companion split'
            : 'Battery capacity, kWh cost, range & charging speed'
        }
        icon={mode === 'ev' ? '⚡' : '⛽'}
        category="🚗 Vehicle"
        toolId={tool?.id || 'fuel_cost'}
        onBack={() => navigation.goBack()}
        onHistory={() => setShowHistory(true)}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SegmentedTabs
          activeTab={mode}
          onTabChange={(key) => setMode(key as FuelMode)}
          scrollable
          tabs={[
            { key: 'fuel', label: 'Fuel & Split', icon: '⛽' },
            { key: 'mileage', label: 'Mileage (km/L)', icon: '🚗' },
            { key: 'trip', label: 'Trip Planner', icon: '🗺️' },
            { key: 'ev', label: 'EV Charging', icon: '⚡' },
          ]}
        />

        {/* 1. FUEL & PASSENGER SPLIT */}
        {mode === 'fuel' && (
          <>
            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Trip Fuel Details</Text>

              <CalcInputField
                label="One-Way or Total Distance"
                suffix="km"
                keyboardType="numeric"
                value={distance}
                onChangeText={setDistance}
                placeholder="250"
              />

              <Text style={[styles.sectionLabel, { color: theme.isDark ? '#CBD5E1' : '#475569' }]}>
                Quick Distance Presets
              </Text>
              <PresetPills
                options={['50 km', '100 km', '250 km', '500 km', '1000 km']}
                selectedValue={`${distance} km`}
                onSelect={(val) => setDistance(String(val).replace(' km', ''))}
                scrollable
              />

              <View style={styles.rowInputs}>
                <View style={styles.flex1}>
                  <CalcInputField
                    label="Mileage"
                    suffix="km/L"
                    keyboardType="numeric"
                    value={mileage}
                    onChangeText={setMileage}
                    placeholder="18"
                  />
                </View>
                <View style={styles.flex1}>
                  <CalcInputField
                    label="Fuel Price"
                    prefix="₹"
                    suffix="/L"
                    keyboardType="numeric"
                    value={fuelPrice}
                    onChangeText={setFuelPrice}
                    placeholder="96"
                  />
                </View>
              </View>

              <Text style={[styles.sectionLabel, { color: theme.isDark ? '#CBD5E1' : '#475569' }]}>
                Common Fuel Rates (India Avg)
              </Text>
              <PresetPills
                options={[
                  { label: 'Petrol (₹96/L)', value: '96' },
                  { label: 'Diesel (₹88/L)', value: '88' },
                  { label: 'CNG (₹76/kg)', value: '76' },
                ]}
                selectedValue={fuelPrice}
                onSelect={(val) => setFuelPrice(String(val))}
              />

              <View style={{ marginTop: 12 }}>
                <CalcInputField
                  label="Number of Persons / Passengers to Split"
                  suffix="Persons"
                  keyboardType="numeric"
                  value={passengers}
                  onChangeText={setPassengers}
                  placeholder="4"
                />
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
              title="Total Fuel Cost"
              value={`₹${fuelResult.totalCost.toLocaleString('en-IN')}`}
              subText={`Cost per person: ₹${fuelResult.costPerPerson.toLocaleString('en-IN')} (${passengers} passengers)`}
              variant="primary"
              badgeText={`Requires ~${fuelResult.fuelNeededLitres} Litres of Fuel`}
              badgeType="warning"
              secondaryStats={[
                { label: 'Fuel Volume', value: `${fuelResult.fuelNeededLitres} L` },
                { label: 'Cost / km', value: `₹${fuelResult.costPerKm}` },
                { label: 'Per Person', value: `₹${fuelResult.costPerPerson}`, color: '#10B981' },
              ]}
            />

            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Summary & Split Details</Text>
              <BreakdownRow
                label="Total Travel Distance"
                value={`${distance} km`}
                showDivider
              />
              <BreakdownRow
                label="Vehicle Fuel Economy"
                value={`${mileage} km/L`}
                showDivider
              />
              <BreakdownRow
                label="Fuel Rate"
                value={`₹${fuelPrice} per Litre`}
                showDivider
              />
              <BreakdownRow
                label="Total Fuel Quantity"
                value={`${fuelResult.fuelNeededLitres} Litres`}
                showDivider
              />
              <BreakdownRow
                label="Total Fuel Expense"
                value={`₹${fuelResult.totalCost.toLocaleString('en-IN')}`}
                showDivider
              />
              <BreakdownRow
                label={`Cost per Person (${passengers} Pax)`}
                value={`₹${fuelResult.costPerPerson.toLocaleString('en-IN')}`}
                isBold
                isHighlight
                valueColor={theme.colors.primary}
              />
            </Card>

            <FormulaInfoCard
              title={FUEL_FORMULA_EXPLANATION.title}
              formula={FUEL_FORMULA_EXPLANATION.formula}
              explanation={FUEL_FORMULA_EXPLANATION.description}
            />
          </>
        )}

        {/* 2. TANK-TO-TANK MILEAGE */}
        {mode === 'mileage' && (
          <>
            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Refill Log Details</Text>

              <CalcInputField
                label="Distance Driven on Trip Meter"
                suffix="km"
                keyboardType="numeric"
                value={drivenKm}
                onChangeText={setDrivenKm}
                placeholder="420"
              />

              <View style={styles.rowInputs}>
                <View style={styles.flex1}>
                  <CalcInputField
                    label="Fuel to Refill Tank"
                    suffix="Litres"
                    keyboardType="numeric"
                    value={refillLitres}
                    onChangeText={setRefillLitres}
                    placeholder="22"
                  />
                </View>
                <View style={styles.flex1}>
                  <CalcInputField
                    label="Fuel Rate Paid"
                    prefix="₹"
                    suffix="/L"
                    keyboardType="numeric"
                    value={fuelRatePerLitre}
                    onChangeText={setFuelRatePerLitre}
                    placeholder="96"
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
              title="Calculated Mileage"
              value={`${mileageResult.mileageKmpl} km/L`}
              subText={`Running Cost: ₹${mileageResult.costPerKm} per km driven`}
              variant="primary"
              badgeText={mileageResult.rating}
              badgeType="success"
              secondaryStats={[
                { label: 'Distance', value: `${drivenKm} km` },
                { label: 'Refill', value: `${refillLitres} L` },
                { label: 'Consumption', value: `${mileageResult.litresPer100Km} L/100km` },
              ]}
            />

            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Efficiency Insights</Text>
              <BreakdownRow
                label="Real-World Mileage"
                value={`${mileageResult.mileageKmpl} km/L`}
                isBold
                showDivider
              />
              <BreakdownRow
                label="Efficiency Benchmark"
                value={mileageResult.rating}
                showDivider
              />
              <BreakdownRow
                label="Litres per 100 km"
                value={`${mileageResult.litresPer100Km} L/100km`}
                showDivider
              />
              <BreakdownRow
                label="Running Cost per Kilometer"
                value={`₹${mileageResult.costPerKm}/km`}
                isBold
                isHighlight
                valueColor={theme.colors.primary}
              />
            </Card>

            <FormulaInfoCard
              title="Tank-to-Tank Method"
              formula="Mileage = Distance Driven / Litres to Fill Tank Again"
              explanation="The most reliable way to check true real-world vehicle mileage is filling the fuel tank to auto-cut, resetting the trip meter, and calculating km divided by litres on the next refill."
            />
          </>
        )}

        {/* 3. TRIP PLANNER & CUSTOM EXPENSES */}
        {mode === 'trip' && (
          <>
            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Road Trip Parameters</Text>

              <CalcInputField
                label="Total Trip Distance"
                suffix="km"
                keyboardType="numeric"
                value={tripDistance}
                onChangeText={setTripDistance}
                placeholder="350"
              />

              <View style={styles.rowInputs}>
                <View style={styles.flex1}>
                  <CalcInputField
                    label="Mileage"
                    suffix="km/L"
                    keyboardType="numeric"
                    value={tripMileage}
                    onChangeText={setTripMileage}
                    placeholder="17"
                  />
                </View>
                <View style={styles.flex1}>
                  <CalcInputField
                    label="Fuel Price"
                    prefix="₹"
                    suffix="/L"
                    keyboardType="numeric"
                    value={tripFuelPrice}
                    onChangeText={setTripFuelPrice}
                    placeholder="96"
                  />
                </View>
              </View>

              <View style={{ marginTop: 12 }}>
                <CalcInputField
                  label="Number of Travelers / Companions to Split"
                  suffix="Pax"
                  keyboardType="numeric"
                  value={tripPax}
                  onChangeText={setTripPax}
                  placeholder="4"
                />
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
              title="Total Road Trip Budget"
              value={`₹${tripResult.totalTripCost.toLocaleString('en-IN')}`}
              subText={`₹${tripResult.costPerPerson.toLocaleString('en-IN')} per person for ${tripPax} travelers`}
              variant="accent"
              badgeText={`Effective Rate: ₹${tripResult.costPerKm} per km`}
              badgeType="info"
              secondaryStats={[
                { label: 'Fuel Cost', value: `₹${tripResult.fuelCost}` },
                { label: 'Other Expenses', value: `₹${tripResult.otherExpenses}` },
                { label: 'Per Person', value: `₹${tripResult.costPerPerson}`, color: '#10B981' },
              ]}
            />

            {/* Dynamic Custom Trip Expenses List */}
            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <View style={styles.cardHeaderRow}>
                <Text style={[styles.cardTitle, { color: theme.colors.text, marginBottom: 0, flex: 1 }]} numberOfLines={1}>
                  Trip Expenses & Custom Items
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  {tripExpenses.filter((e) => e.id.startsWith('custom_exp_')).length > 0 && !showAddExpense && (
                    <TouchableOpacity
                      onPress={handleClearAllCustomExpenses}
                      style={[
                        styles.addCustomBtn,
                        {
                          borderColor: 'rgba(239, 68, 68, 0.4)',
                          backgroundColor: theme.isDark ? 'rgba(239, 68, 68, 0.18)' : '#FEE2E2',
                        },
                      ]}
                    >
                      <Text style={[styles.addCustomBtnText, { color: '#EF4444' }]}>
                        🗑️ Clear ({tripExpenses.filter((e) => e.id.startsWith('custom_exp_')).length})
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => setShowAddExpense(!showAddExpense)}
                    style={[styles.addCustomBtn, { borderColor: theme.colors.primary }]}
                  >
                    <Text style={[styles.addCustomBtnText, { color: theme.colors.primary }]}>
                      {showAddExpense ? '✕ Close' : '＋ Add Expense'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Add Custom Expense Form */}
              {showAddExpense && (
                <View style={[styles.customFormBox, { backgroundColor: theme.isDark ? '#0F172A' : '#F1F5F9', borderColor: theme.colors.primary }]}>
                  <Text style={[styles.customFormTitle, { color: theme.colors.primary }]}>
                    New Expense Item
                  </Text>
                  <CalcInputField
                    label="Expense Name"
                    keyboardType="default"
                    value={newExpenseName}
                    onChangeText={setNewExpenseName}
                    placeholder="e.g. Hotel Stay, Driver Batta, Safari Tickets"
                  />
                  <CalcInputField
                    label="Amount"
                    prefix="₹"
                    keyboardType="numeric"
                    value={newExpenseAmount}
                    onChangeText={setNewExpenseAmount}
                    placeholder="e.g. 1500"
                  />
                  <TouchableOpacity
                    onPress={handleAddCustomExpense}
                    style={[styles.addSubmitBtn, { backgroundColor: theme.colors.primary }]}
                  >
                    <Text style={styles.addSubmitBtnText}>✓ Add Expense</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Fuel row */}
              <BreakdownRow
                label={`Fuel (${tripResult.fuelLitres}L @ ₹${tripFuelPrice}/L)`}
                value={`₹${tripResult.fuelCost}`}
                subLabel="Calculated from distance & mileage"
                showDivider
              />

              {/* Dynamic expenses */}
              {tripExpenses.map((exp) => (
                <View key={exp.id} style={styles.customExpenseRow}>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={[styles.expNameText, { color: theme.colors.text }]}>{exp.name}</Text>
                  </View>
                  <View style={{ width: 100 }}>
                    <CalcInputField
                      label=""
                      prefix="₹"
                      keyboardType="numeric"
                      value={String(exp.amount)}
                      onChangeText={(val) => updateTripExpenseAmount(exp.id, val)}
                      placeholder="0"
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => removeTripExpense(exp.id)}
                    style={{ paddingLeft: 8, paddingVertical: 4 }}
                  >
                    <Text style={{ color: '#EF4444', fontSize: 16, fontWeight: '700' }}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <BreakdownRow
                label="Total Trip Cost"
                value={`₹${tripResult.totalTripCost.toLocaleString('en-IN')}`}
                isBold
                showDivider
              />

              <BreakdownRow
                label={`Per Person Share (${tripPax} Pax)`}
                value={`₹${tripResult.costPerPerson.toLocaleString('en-IN')}`}
                isBold
                isHighlight
                valueColor={theme.colors.primary}
              />
            </Card>

            <FormulaInfoCard
              title="Road Trip Cost & Split Method"
              formula="Total = Fuel Cost + ∑(Custom Expenses) | Per Person = Total / Passengers"
              explanation="Plan road trips with complete financial transparency by combining dynamic fuel expenses with custom hotel, toll, parking, driver, and food items."
            />
          </>
        )}

        {/* 4. EV CHARGING & RANGE */}
        {mode === 'ev' && (
          <>
            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>EV Battery & State of Charge</Text>

              <Text style={[styles.sectionLabel, { color: theme.isDark ? '#CBD5E1' : '#475569' }]}>
                Popular Indian EV Presets
              </Text>
              <PresetPills
                options={[
                  { label: 'Tiago EV (24 kWh / 315km)', value: '24|315' },
                  { label: 'Punch EV (35 kWh / 421km)', value: '35|421' },
                  { label: 'Nexon EV (40.5 kWh / 465km)', value: '40.5|465' },
                  { label: 'ZS EV (50.3 kWh / 461km)', value: '50.3|461' },
                ]}
                selectedValue={`${evBatteryKwh}|${evFullRangeKm}`}
                onSelect={(val) => {
                  const [b, r] = String(val).split('|');
                  setEvBatteryKwh(b);
                  setEvFullRangeKm(r);
                }}
                scrollable
              />

              <View style={[styles.rowInputs, { marginTop: 12 }]}>
                <View style={styles.flex1}>
                  <CalcInputField
                    label="Battery Capacity"
                    suffix="kWh"
                    keyboardType="numeric"
                    value={evBatteryKwh}
                    onChangeText={setEvBatteryKwh}
                    placeholder="30.2"
                  />
                </View>
                <View style={styles.flex1}>
                  <CalcInputField
                    label="Full Range"
                    suffix="km"
                    keyboardType="numeric"
                    value={evFullRangeKm}
                    onChangeText={setEvFullRangeKm}
                    placeholder="315"
                  />
                </View>
              </View>

              <View style={styles.rowInputs}>
                <View style={styles.flex1}>
                  <CalcInputField
                    label="Current Battery %"
                    suffix="%"
                    keyboardType="numeric"
                    value={evCurrentPct}
                    onChangeText={setEvCurrentPct}
                    placeholder="20"
                  />
                </View>
                <View style={styles.flex1}>
                  <CalcInputField
                    label="Target Battery %"
                    suffix="%"
                    keyboardType="numeric"
                    value={evTargetPct}
                    onChangeText={setEvTargetPct}
                    placeholder="100"
                  />
                </View>
              </View>

              <View style={{ marginTop: 12 }}>
                <CalcInputField
                  label="Electricity Rate / Charging Tariff"
                  prefix="₹"
                  suffix="/kWh"
                  keyboardType="numeric"
                  value={evRatePerUnit}
                  onChangeText={setEvRatePerUnit}
                  placeholder="8.0"
                />
              </View>

              {/* Charger Speed Selector */}
              <Text style={[styles.sectionLabel, { color: theme.isDark ? '#CBD5E1' : '#475569' }]}>
                Charger Speed (Power Rating)
              </Text>
              <PresetPills
                options={[
                  { label: '3.3 kW (Home Socket)', value: '3.3' },
                  { label: '7.2 kW (Wallbox AC)', value: '7.2' },
                  { label: '30 kW (DC Fast)', value: '30' },
                  { label: '60 kW (Ultra DC)', value: '60' },
                  { label: 'Custom kW', value: 'custom' },
                ]}
                selectedValue={evChargerPower}
                onSelect={(val) => setEvChargerPower(String(val))}
                scrollable
              />

              {evChargerPower === 'custom' && (
                <View style={{ marginTop: 12 }}>
                  <CalcInputField
                    label="Custom Charger Output Power"
                    suffix="kW"
                    keyboardType="numeric"
                    value={customChargerKw}
                    onChangeText={setCustomChargerKw}
                    placeholder="e.g. 11"
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
              title="Estimated EV Charging Cost"
              value={`₹${evResult.totalChargingCost.toLocaleString('en-IN')}`}
              subText={`Adds +${evResult.rangeAddedKm} km driving range`}
              variant="primary"
              badgeText={`Running Cost: ₹${evResult.costPerKm} per km`}
              badgeType="success"
              secondaryStats={[
                { label: 'Energy Needed', value: `${evResult.energyNeededKwh} kWh` },
                { label: 'Cost / km', value: `₹${evResult.costPerKm}` },
                { label: 'Time on Charger', value: `${evResult.selectedChargerTimeHours} Hours`, color: '#10B981' },
              ]}
            />

            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>EV Session Charging Specs</Text>
              <BreakdownRow
                label="Battery Delta"
                value={`${evCurrentPct}% → ${evTargetPct}%`}
                showDivider
              />
              <BreakdownRow
                label="Grid Energy to Draw (~90% Eff)"
                value={`${evResult.energyNeededKwh} kWh`}
                showDivider
              />
              <BreakdownRow
                label="Estimated Charging Time"
                value={`~${evResult.selectedChargerTimeHours} Hours (${effectiveChargerKw} kW)`}
                isBold
                showDivider
              />
              <BreakdownRow
                label="Slow Home AC (3.3 kW)"
                value={`~${evResult.chargingTimeHours} Hours`}
                showDivider
              />
              <BreakdownRow
                label="Highway DC Fast (30 kW)"
                value={`~${evResult.fastChargingTimeHours} Hours`}
                showDivider
              />
              <BreakdownRow
                label="Total Session Cost"
                value={`₹${evResult.totalChargingCost.toLocaleString('en-IN')}`}
                isBold
                isHighlight
                valueColor={theme.colors.primary}
              />
            </Card>

            <FormulaInfoCard
              title="EV Charging & Range Mathematics"
              formula="Cost = (Battery Capacity × % Charge / 0.9 Efficiency) × Rate/kWh"
              explanation="Electric vehicles cost only ₹1.0 - ₹2.5 per km to run compared to ₹5.5 - ₹8.0 per km for petrol/diesel vehicles."
            />
          </>
        )}
      </ScrollView>

      <CalculationHistoryModal
        visible={showHistory}
        onClose={() => setShowHistory(false)}
        title="Vehicle & Fuel History"
        subtitle="Past trips, mileage & EV calculations"
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
  customExpenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(148, 163, 184, 0.2)',
  },
  expNameText: {
    fontSize: 13,
    fontWeight: '600',
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
