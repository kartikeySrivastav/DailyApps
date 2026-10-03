/**
 * Electricity & Power Calculation Engines
 * Practical formulas for Electricity Bill Slabs, Appliance Running Cost,
 * Solar Rooftop Sizing, Inverter & Battery Backup, and Ohm's Law.
 */

// 1. Electricity Bill Slabs
export interface ElectricityBillInput {
  unitsConsumed: number;
  fixedCharges?: number;
  dutyRatePercent?: number; // e.g. 5% electricity duty
  tariffType?: 'standard' | 'low_tariff' | 'commercial' | 'custom';
  customRatePerUnit?: number;
}

export interface SlabBreakdown {
  slab: string;
  units: number;
  rate: number;
  amount: number;
}

export interface ElectricityBillResult {
  unitsConsumed: number;
  energyCharges: number;
  fixedCharges: number;
  regulatoryDuty: number;
  totalBill: number;
  averageRatePerUnit: number;
  slabs: SlabBreakdown[];
}

export function calculateElectricityBill(input: ElectricityBillInput): ElectricityBillResult {
  const {
    unitsConsumed,
    fixedCharges = 120,
    dutyRatePercent = 5,
    tariffType = 'standard',
    customRatePerUnit = 7.0,
  } = input;

  if (unitsConsumed <= 0 || isNaN(unitsConsumed)) {
    return {
      unitsConsumed: 0,
      energyCharges: 0,
      fixedCharges,
      regulatoryDuty: 0,
      totalBill: fixedCharges,
      averageRatePerUnit: 0,
      slabs: [],
    };
  }

  // If custom tariff is selected, calculate flat at customRatePerUnit
  if (tariffType === 'custom') {
    const rate = customRatePerUnit > 0 ? customRatePerUnit : 7.0;
    const energyCharges = unitsConsumed * rate;
    const regulatoryDuty = Math.round(((energyCharges + fixedCharges) * (dutyRatePercent / 100)) * 100) / 100;
    const totalBill = Math.round(energyCharges + fixedCharges + regulatoryDuty);
    return {
      unitsConsumed,
      energyCharges: Math.round(energyCharges),
      fixedCharges,
      regulatoryDuty,
      totalBill,
      averageRatePerUnit: Math.round((totalBill / unitsConsumed) * 100) / 100,
      slabs: [
        {
          slab: `All Units (Flat Custom Rate)`,
          units: unitsConsumed,
          rate,
          amount: Math.round(energyCharges * 100) / 100,
        },
      ],
    };
  }

  // Tariff Slabs (Standard Indian residential tier structure: 0-100, 101-200, 201-400, >400)
  const slabTiers =
    tariffType === 'low_tariff'
      ? [
          { limit: 100, rate: 3.0 },
          { limit: 200, rate: 4.5 },
          { limit: 400, rate: 6.0 },
          { limit: Infinity, rate: 7.0 },
        ]
      : tariffType === 'commercial'
      ? [
          { limit: 100, rate: 7.5 },
          { limit: 300, rate: 8.5 },
          { limit: Infinity, rate: 9.5 },
        ]
      : [
          { limit: 100, rate: 4.2 },
          { limit: 200, rate: 5.8 },
          { limit: 400, rate: 7.2 },
          { limit: Infinity, rate: 8.5 },
        ];

  let remaining = unitsConsumed;
  let prevLimit = 0;
  let energyCharges = 0;
  const slabs: SlabBreakdown[] = [];

  for (const tier of slabTiers) {
    const slabCapacity = tier.limit - prevLimit;
    const unitsInSlab = Math.min(remaining, slabCapacity);

    if (unitsInSlab > 0) {
      const amount = unitsInSlab * tier.rate;
      energyCharges += amount;
      slabs.push({
        slab: tier.limit === Infinity ? `>${prevLimit} units` : `${prevLimit + 1} - ${tier.limit} units`,
        units: unitsInSlab,
        rate: tier.rate,
        amount: Math.round(amount * 100) / 100,
      });
      remaining -= unitsInSlab;
    }
    prevLimit = tier.limit;
    if (remaining <= 0) break;
  }

  const regulatoryDuty = Math.round(((energyCharges + fixedCharges) * (dutyRatePercent / 100)) * 100) / 100;
  const totalBill = Math.round(energyCharges + fixedCharges + regulatoryDuty);
  const avgRate = Math.round((totalBill / unitsConsumed) * 100) / 100;

  return {
    unitsConsumed,
    energyCharges: Math.round(energyCharges),
    fixedCharges,
    regulatoryDuty,
    totalBill,
    averageRatePerUnit: avgRate,
    slabs,
  };
}

// 2. Appliance Consumption & Cost
export interface ApplianceInput {
  wattage: number;
  hoursPerDay: number;
  daysPerMonth?: number;
  ratePerUnit: number;
}

export interface ApplianceResult {
  dailyUnitsKwh: number;
  monthlyUnitsKwh: number;
  dailyCost: number;
  monthlyCost: number;
  annualCost: number;
}

export function calculateApplianceCost(input: ApplianceInput): ApplianceResult {
  const { wattage, hoursPerDay, daysPerMonth = 30, ratePerUnit } = input;

  if (wattage <= 0 || hoursPerDay <= 0 || ratePerUnit <= 0) {
    return {
      dailyUnitsKwh: 0,
      monthlyUnitsKwh: 0,
      dailyCost: 0,
      monthlyCost: 0,
      annualCost: 0,
    };
  }

  const dailyUnits = (wattage * hoursPerDay) / 1000;
  const monthlyUnits = dailyUnits * daysPerMonth;
  const dailyCost = dailyUnits * ratePerUnit;
  const monthlyCost = monthlyUnits * ratePerUnit;
  const annualCost = monthlyCost * 12;

  return {
    dailyUnitsKwh: Math.round(dailyUnits * 100) / 100,
    monthlyUnitsKwh: Math.round(monthlyUnits * 10) / 10,
    dailyCost: Math.round(dailyCost * 100) / 100,
    monthlyCost: Math.round(monthlyCost),
    annualCost: Math.round(annualCost),
  };
}

// 2b. Multi-Appliance Home Energy Audit
export interface ApplianceAuditItem {
  id: string;
  name: string;
  wattage: number;
  hoursPerDay: number;
  quantity: number;
  icon?: string;
  isCustom?: boolean;
}

export interface MultiApplianceAuditResult {
  totalConnectedWatts: number;
  totalConnectedKw: number;
  dailyUnitsKwh: number;
  monthlyUnitsKwh: number;
  monthlyCost: number;
  annualCost: number;
  itemBreakdown: {
    id: string;
    name: string;
    icon?: string;
    totalWatts: number;
    dailyUnits: number;
    monthlyUnits: number;
    monthlyCost: number;
    percentOfTotal: number;
  }[];
}

export function calculateMultiApplianceAudit(
  appliances: ApplianceAuditItem[],
  ratePerUnit: number = 7.0
): MultiApplianceAuditResult {
  let totalWatts = 0;
  let totalDailyUnits = 0;

  const validItems = appliances.filter(
    (a) => a.wattage > 0 && a.quantity > 0 && a.hoursPerDay > 0
  );

  const rawBreakdown = validItems.map((item) => {
    const itemWatts = item.wattage * item.quantity;
    const itemDailyUnits = (itemWatts * item.hoursPerDay) / 1000;
    const itemMonthlyUnits = itemDailyUnits * 30;
    const itemMonthlyCost = itemMonthlyUnits * ratePerUnit;

    totalWatts += itemWatts;
    totalDailyUnits += itemDailyUnits;

    return {
      id: item.id,
      name: item.name,
      icon: item.icon,
      totalWatts: itemWatts,
      dailyUnits: Math.round(itemDailyUnits * 100) / 100,
      monthlyUnits: Math.round(itemMonthlyUnits * 10) / 10,
      monthlyCost: Math.round(itemMonthlyCost),
      itemDailyUnits,
    };
  });

  const totalMonthlyUnits = totalDailyUnits * 30;
  const totalMonthlyCost = totalMonthlyUnits * ratePerUnit;
  const annualCost = totalMonthlyCost * 12;

  const itemBreakdown = rawBreakdown.map((b) => ({
    id: b.id,
    name: b.name,
    icon: b.icon,
    totalWatts: b.totalWatts,
    dailyUnits: b.dailyUnits,
    monthlyUnits: b.monthlyUnits,
    monthlyCost: b.monthlyCost,
    percentOfTotal:
      totalDailyUnits > 0
        ? Math.round((b.itemDailyUnits / totalDailyUnits) * 100)
        : 0,
  }));

  return {
    totalConnectedWatts: totalWatts,
    totalConnectedKw: Math.round((totalWatts / 1000) * 100) / 100,
    dailyUnitsKwh: Math.round(totalDailyUnits * 100) / 100,
    monthlyUnitsKwh: Math.round(totalMonthlyUnits * 10) / 10,
    monthlyCost: Math.round(totalMonthlyCost),
    annualCost: Math.round(annualCost),
    itemBreakdown,
  };
}

// 3. Solar Panel & Rooftop Sizing
export interface SolarInput {
  monthlyBillOrUnits: number;
  inputType: 'units' | 'bill';
  ratePerUnit?: number;
  sunlightHoursPerDay?: number;
}

export interface SolarResult {
  recommendedCapacityKw: number;
  numberOfPanels: number; // assuming 550W panels
  rooftopAreaSqFt: number; // ~100 sq ft per kW
  dailyGenerationUnits: number;
  monthlyGenerationUnits: number;
  monthlySavings: number;
  annualSavings: number;
  estimatedCost: number; // ~₹55,000 per kW after subsidy
  paybackYears: number;
}

export function calculateSolarRooftop(input: SolarInput): SolarResult {
  const {
    monthlyBillOrUnits,
    inputType,
    ratePerUnit = 7.0,
    sunlightHoursPerDay = 4.5,
  } = input;

  const monthlyUnits =
    inputType === 'units'
      ? monthlyBillOrUnits
      : (monthlyBillOrUnits / ratePerUnit);

  if (monthlyUnits <= 0) {
    return {
      recommendedCapacityKw: 0,
      numberOfPanels: 0,
      rooftopAreaSqFt: 0,
      dailyGenerationUnits: 0,
      monthlyGenerationUnits: 0,
      monthlySavings: 0,
      annualSavings: 0,
      estimatedCost: 0,
      paybackYears: 0,
    };
  }

  const dailyUnitsNeeded = monthlyUnits / 30;
  // 1 kW solar generates ~4 units/day
  const rawKw = dailyUnitsNeeded / sunlightHoursPerDay;
  const recommendedCapacityKw = Math.max(1, Math.round(rawKw * 10) / 10);
  const numberOfPanels = Math.ceil((recommendedCapacityKw * 1000) / 550);
  const rooftopAreaSqFt = Math.round(recommendedCapacityKw * 100);

  const dailyGen = Math.round(recommendedCapacityKw * sunlightHoursPerDay * 10) / 10;
  const monthlyGen = Math.round(dailyGen * 30);
  const monthlySavings = Math.round(monthlyGen * ratePerUnit);
  const annualSavings = monthlySavings * 12;

  // Approx standard rooftop solar cost in India ~Rs 55,000 / kW (net of PM Surya Ghar subsidy)
  const estimatedCost = Math.round(recommendedCapacityKw * 55000);
  const paybackYears = annualSavings > 0 ? Math.round((estimatedCost / annualSavings) * 10) / 10 : 0;

  return {
    recommendedCapacityKw,
    numberOfPanels,
    rooftopAreaSqFt,
    dailyGenerationUnits: dailyGen,
    monthlyGenerationUnits: monthlyGen,
    monthlySavings,
    annualSavings,
    estimatedCost,
    paybackYears,
  };
}

// 4. Inverter & Battery Backup
export interface InverterInput {
  totalWatts: number;
  backupHoursRequired: number;
  batteryVoltage?: number; // 12V (single) or 24V (double)
}

export interface InverterResult {
  totalWatts: number;
  recommendedInverterVA: number;
  batteryAhRequired: number;
  recommendedBatteryModel: string;
  actualBackupHours: number;
}

export function calculateInverterBattery(input: InverterInput): InverterResult {
  const { totalWatts, backupHoursRequired, batteryVoltage = 12 } = input;

  if (totalWatts <= 0 || backupHoursRequired <= 0) {
    return {
      totalWatts: 0,
      recommendedInverterVA: 0,
      batteryAhRequired: 0,
      recommendedBatteryModel: 'None',
      actualBackupHours: 0,
    };
  }

  // Power factor 0.8 + 20% safety margin for startup surge
  const inverterVA = Math.round((totalWatts / 0.8) * 1.2);
  const standardInverters = [700, 900, 1100, 1400, 1600, 2000, 2500, 3500];
  const recommendedInverterVA =
    standardInverters.find((v) => v >= inverterVA) || standardInverters[standardInverters.length - 1];

  // Battery Ah = (Total Watts * Backup Hours) / (Battery Voltage * Inverter Efficiency 0.85 * DoD 0.8)
  const rawAh = (totalWatts * backupHoursRequired) / (batteryVoltage * 0.85 * 0.8);
  const standardBatteries = [100, 120, 150, 180, 200, 220, 250];
  const recommendedAh =
    standardBatteries.find((ah) => ah >= rawAh) || Math.round(rawAh);

  const batteryModel = `${recommendedAh}Ah (${batteryVoltage}V Tubular)`;
  const actualBackupHours =
    Math.round(((recommendedAh * batteryVoltage * 0.85 * 0.8) / totalWatts) * 10) / 10;

  return {
    totalWatts,
    recommendedInverterVA,
    batteryAhRequired: Math.round(rawAh),
    recommendedBatteryModel: batteryModel,
    actualBackupHours,
  };
}

// 5. Ohm's Law & Electrical Power
export interface OhmsLawInput {
  voltage?: number;
  current?: number;
  resistance?: number;
  power?: number;
}

export interface OhmsLawResult {
  voltage: number;
  current: number;
  resistance: number;
  power: number;
  formulaUsed: string;
}

export function calculateOhmsLaw(input: OhmsLawInput): OhmsLawResult {
  const { voltage: V, current: I, resistance: R, power: P } = input;

  let v = V || 0;
  let i = I || 0;
  let r = R || 0;
  let p = P || 0;
  let formula = '';

  if (V && I) {
    r = V / I;
    p = V * I;
    formula = 'R = V / I | P = V × I';
  } else if (V && R) {
    i = V / R;
    p = (V * V) / R;
    formula = 'I = V / R | P = V² / R';
  } else if (I && R) {
    v = I * R;
    p = I * I * R;
    formula = 'V = I × R | P = I² × R';
  } else if (P && V) {
    i = P / V;
    r = (V * V) / P;
    formula = 'I = P / V | R = V² / P';
  } else if (P && I) {
    v = P / I;
    r = P / (I * I);
    formula = 'V = P / I | R = P / I²';
  } else if (P && R) {
    v = Math.sqrt(P * R);
    i = Math.sqrt(P / R);
    formula = 'V = √(P × R) | I = √(P / R)';
  }

  return {
    voltage: Math.round(v * 100) / 100,
    current: Math.round(i * 100) / 100,
    resistance: Math.round(r * 100) / 100,
    power: Math.round(p * 100) / 100,
    formulaUsed: formula || 'Enter any two values to calculate the other two',
  };
}
