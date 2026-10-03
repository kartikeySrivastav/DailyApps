export interface FuelTripInput {
  distanceKm: number;
  mileageKmpl: number;
  fuelPricePerLitre: number;
  passengers: number;
}

export interface FuelTripResult {
  fuelNeededLitres: number;
  totalCost: number;
  costPerPerson: number;
  costPerKm: number;
}

export function validateFuelInput(input: FuelTripInput): { isValid: boolean; error?: string } {
  if (input.distanceKm <= 0 || isNaN(input.distanceKm)) {
    return { isValid: false, error: 'Distance must be greater than 0' };
  }
  if (input.mileageKmpl <= 0 || isNaN(input.mileageKmpl)) {
    return { isValid: false, error: 'Mileage must be greater than 0' };
  }
  if (input.fuelPricePerLitre <= 0 || isNaN(input.fuelPricePerLitre)) {
    return { isValid: false, error: 'Fuel price must be greater than 0' };
  }
  if (input.passengers < 1 || isNaN(input.passengers)) {
    return { isValid: false, error: 'Number of passengers must be at least 1' };
  }
  return { isValid: true };
}

export function calculateFuelTrip(input: FuelTripInput): FuelTripResult {
  const { distanceKm, mileageKmpl, fuelPricePerLitre, passengers } = input;

  if (distanceKm <= 0 || mileageKmpl <= 0 || fuelPricePerLitre <= 0 || passengers <= 0) {
    return {
      fuelNeededLitres: 0,
      totalCost: 0,
      costPerPerson: 0,
      costPerKm: 0,
    };
  }

  const fuelNeededLitres = distanceKm / mileageKmpl;
  const totalCost = fuelNeededLitres * fuelPricePerLitre;
  const costPerPerson = totalCost / passengers;
  const costPerKm = totalCost / distanceKm;

  return {
    fuelNeededLitres: Number(fuelNeededLitres.toFixed(2)),
    totalCost: Math.round(totalCost),
    costPerPerson: Math.round(costPerPerson),
    costPerKm: Number(costPerKm.toFixed(2)),
  };
}

// 2. Mileage & Fuel Economy Calculation (Tank-to-Tank)
export interface MileageInput {
  distanceKm: number;
  fuelLitres: number;
  fuelPricePerLitre?: number;
}

export interface MileageResult {
  mileageKmpl: number;
  costPerKm: number;
  litresPer100Km: number;
  rating: string;
}

export function calculateMileage(input: MileageInput): MileageResult {
  const { distanceKm, fuelLitres, fuelPricePerLitre = 96 } = input;
  if (distanceKm <= 0 || fuelLitres <= 0) {
    return { mileageKmpl: 0, costPerKm: 0, litresPer100Km: 0, rating: 'N/A' };
  }

  const mileageKmpl = distanceKm / fuelLitres;
  const litresPer100Km = (fuelLitres / distanceKm) * 100;
  const costPerKm = (fuelLitres * fuelPricePerLitre) / distanceKm;

  let rating = 'Standard';
  if (mileageKmpl >= 25) rating = 'Excellent (High Efficiency)';
  else if (mileageKmpl >= 18) rating = 'Good (Highway/Hatchback)';
  else if (mileageKmpl >= 12) rating = 'Average (City Traffic/Sedan)';
  else rating = 'Low (Heavy SUV/Traffic)';

  return {
    mileageKmpl: Number(mileageKmpl.toFixed(2)),
    costPerKm: Number(costPerKm.toFixed(2)),
    litresPer100Km: Number(litresPer100Km.toFixed(2)),
    rating,
  };
}

// 3. Complete Trip Cost Planner (Fuel + Toll + Parking + Custom Expenses)
export interface CustomTripExpense {
  id: string;
  name: string;
  amount: number;
}

export interface TripPlannerInput {
  distanceKm: number;
  mileageKmpl: number;
  fuelPricePerLitre: number;
  tollFees?: number;
  parkingCost?: number;
  otherCost?: number;
  customExpenses?: CustomTripExpense[];
  passengers: number;
}

export interface TripPlannerResult {
  fuelCost: number;
  fuelLitres: number;
  otherExpenses: number;
  totalTripCost: number;
  costPerPerson: number;
  costPerKm: number;
}

export function calculateTripPlanner(input: TripPlannerInput): TripPlannerResult {
  const {
    distanceKm,
    mileageKmpl,
    fuelPricePerLitre,
    tollFees = 0,
    parkingCost = 0,
    otherCost = 0,
    customExpenses = [],
    passengers,
  } = input;
  const pass = Math.max(1, passengers || 1);
  if (distanceKm <= 0 || mileageKmpl <= 0) {
    return { fuelCost: 0, fuelLitres: 0, otherExpenses: 0, totalTripCost: 0, costPerPerson: 0, costPerKm: 0 };
  }

  const fuelLitres = distanceKm / mileageKmpl;
  const fuelCost = fuelLitres * fuelPricePerLitre;
  const customTotal = customExpenses.reduce((sum, item) => sum + (item.amount || 0), 0);
  const otherExpenses = (tollFees || 0) + (parkingCost || 0) + (otherCost || 0) + customTotal;
  const totalTripCost = fuelCost + otherExpenses;
  const costPerPerson = totalTripCost / pass;
  const costPerKm = totalTripCost / distanceKm;

  return {
    fuelCost: Math.round(fuelCost),
    fuelLitres: Number(fuelLitres.toFixed(2)),
    otherExpenses: Math.round(otherExpenses),
    totalTripCost: Math.round(totalTripCost),
    costPerPerson: Math.round(costPerPerson),
    costPerKm: Number(costPerKm.toFixed(2)),
  };
}

// 4. EV (Electric Vehicle) Charging & Range
export interface EVChargingInput {
  batteryCapacityKwh: number;
  currentPct: number;
  targetPct: number;
  electricityRatePerUnit: number;
  fullChargeRangeKm: number;
  chargerPowerKw?: number;
}

export interface EVChargingResult {
  energyNeededKwh: number;
  totalChargingCost: number;
  costPerKm: number;
  rangeAddedKm: number;
  chargingTimeHours: number;
  fastChargingTimeHours: number;
  selectedChargerTimeHours: number;
}

export function calculateEVCharging(input: EVChargingInput): EVChargingResult {
  const {
    batteryCapacityKwh,
    currentPct,
    targetPct,
    electricityRatePerUnit,
    fullChargeRangeKm,
    chargerPowerKw = 3.3,
  } = input;
  const pctDelta = Math.max(0, (targetPct - currentPct) / 100);
  const energyNeededKwh = batteryCapacityKwh * pctDelta;
  const gridUnitsConsumed = energyNeededKwh / 0.9; // ~90% charger efficiency
  const totalChargingCost = gridUnitsConsumed * electricityRatePerUnit;
  const rangeAddedKm = fullChargeRangeKm * pctDelta;
  const costPerKm = rangeAddedKm > 0 ? totalChargingCost / rangeAddedKm : 0;
  const chargingTimeHours = energyNeededKwh / 3.3; // 3.3kW slow charger
  const fastChargingTimeHours = energyNeededKwh / 30; // 30kW DC fast charger
  const selectedKw = chargerPowerKw > 0 ? chargerPowerKw : 3.3;
  const selectedChargerTimeHours = energyNeededKwh / selectedKw;

  return {
    energyNeededKwh: Number(energyNeededKwh.toFixed(1)),
    totalChargingCost: Math.round(totalChargingCost),
    costPerKm: Number(costPerKm.toFixed(2)),
    rangeAddedKm: Math.round(rangeAddedKm),
    chargingTimeHours: Number(chargingTimeHours.toFixed(1)),
    fastChargingTimeHours: Number(fastChargingTimeHours.toFixed(1)),
    selectedChargerTimeHours: Number(selectedChargerTimeHours.toFixed(1)),
  };
}

export const FUEL_FORMULA_EXPLANATION = {
  title: 'Fuel & Trip Split Formula',
  formula: 'Fuel Required = Distance / Mileage | Total = Fuel × Price | Per Person = Total / Passengers',
  description: 'Calculates the exact fuel volume and allows splitting trip fuel costs evenly among companions.',
};
