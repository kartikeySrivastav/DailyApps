export interface SIPInput {
  monthlyInvestment: number;
  annualRate: number; // in %
  years: number;
  stepUpPercentage?: number; // Optional annual step up % (e.g. 10%)
}

export interface SIPResult {
  investedAmount: number;
  estimatedReturns: number;
  totalValue: number;
  investedRatio: number; // 0 - 100
  returnsRatio: number; // 0 - 100
}

export interface LumpsumInput {
  totalInvestment: number;
  annualRate: number;
  years: number;
}

export interface LumpsumResult {
  investedAmount: number;
  estimatedReturns: number;
  totalValue: number;
  investedRatio: number;
  returnsRatio: number;
}

export interface SWPInput {
  totalInvestment: number; // Initial corpus
  monthlyWithdrawal: number;
  annualRate: number; // in %
  years: number;
}

export interface SWPResult {
  totalInvested: number;
  totalWithdrawn: number;
  finalBalance: number;
  isExhausted: boolean;
  exhaustedMonth?: number;
}

export interface CAGRInput {
  initialValue: number;
  finalValue: number;
  years: number;
}

export interface CAGRResult {
  initialValue: number;
  finalValue: number;
  absoluteGain: number;
  absoluteReturnPct: number;
  cagrPercentage: number;
}

export interface GoalSIPInput {
  targetAmount: number;
  annualRate: number;
  years: number;
}

export interface GoalSIPResult {
  targetAmount: number;
  requiredMonthlySIP: number;
  totalInvested: number;
  expectedGrowth: number;
}

export interface InflationInput {
  currentAmount: number;
  inflationRate: number; // in % (e.g. 6%)
  years: number;
}

export interface InflationResult {
  currentAmount: number;
  futureCost: number;
  purchasingPowerLossPct: number;
  equivalentToday: number;
}

export interface PPFInput {
  annualDeposit: number; // max 1,50,000 / year
  years?: number; // default 15
  annualRate?: number; // default 7.1%
}

export interface PPFResult {
  totalDeposited: number;
  interestEarned: number;
  maturityAmount: number;
}

export interface CompoundingPoint {
  year: number;
  invested: number;
  totalValue: number;
  gain: number;
}

export function validateSIPInput(input: SIPInput): { isValid: boolean; error?: string } {
  if (input.monthlyInvestment <= 0 || isNaN(input.monthlyInvestment)) {
    return { isValid: false, error: 'Monthly investment must be greater than 0' };
  }
  if (input.annualRate <= 0 || input.annualRate > 100 || isNaN(input.annualRate)) {
    return { isValid: false, error: 'Expected return rate must be between 0.1% and 100%' };
  }
  if (input.years <= 0 || input.years > 50 || isNaN(input.years)) {
    return { isValid: false, error: 'Time period must be between 1 and 50 years' };
  }
  return { isValid: true };
}

/**
 * Pure calculation function for Systematic Investment Plan (SIP)
 * Supports Step-Up SIP (increasing monthly deposit annually by X%)
 */
export function calculateSIP(input: SIPInput): SIPResult {
  const p = Math.max(0, input.monthlyInvestment);
  const years = Math.max(0, input.years);
  const r = Math.max(0, input.annualRate);
  const stepUp = Math.max(0, input.stepUpPercentage || 0);

  if (p <= 0 || years <= 0 || r <= 0) {
    return {
      investedAmount: 0,
      estimatedReturns: 0,
      totalValue: 0,
      investedRatio: 50,
      returnsRatio: 50,
    };
  }

  const monthlyRate = r / (12 * 100);

  // If no step up, use standard direct formula for speed
  if (stepUp === 0) {
    const n = years * 12;
    const totalValue = p * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) * (1 + monthlyRate);
    const investedAmount = p * n;
    const estimatedReturns = Math.max(0, totalValue - investedAmount);
    const investedRatio = (investedAmount / totalValue) * 100;
    const returnsRatio = (estimatedReturns / totalValue) * 100;

    return {
      investedAmount: Math.round(investedAmount),
      estimatedReturns: Math.round(estimatedReturns),
      totalValue: Math.round(totalValue),
      investedRatio: Number(investedRatio.toFixed(1)),
      returnsRatio: Number(returnsRatio.toFixed(1)),
    };
  }

  // With Step-Up SIP: Monthly investment increases by stepUp% every 12 months
  let currentMonthly = p;
  let investedAmount = 0;
  let totalValue = 0;

  for (let year = 1; year <= years; year++) {
    for (let month = 1; month <= 12; month++) {
      investedAmount += currentMonthly;
      totalValue = (totalValue + currentMonthly) * (1 + monthlyRate);
    }
    currentMonthly = currentMonthly * (1 + stepUp / 100);
  }

  const estimatedReturns = Math.max(0, totalValue - investedAmount);
  const investedRatio = totalValue > 0 ? (investedAmount / totalValue) * 100 : 100;
  const returnsRatio = totalValue > 0 ? (estimatedReturns / totalValue) * 100 : 0;

  return {
    investedAmount: Math.round(investedAmount),
    estimatedReturns: Math.round(estimatedReturns),
    totalValue: Math.round(totalValue),
    investedRatio: Number(investedRatio.toFixed(1)),
    returnsRatio: Number(returnsRatio.toFixed(1)),
  };
}

/**
 * Pure calculation for Lumpsum Investment
 * Formula: M = P * (1 + r/100)^t
 */
export function calculateLumpsum(input: LumpsumInput): LumpsumResult {
  const p = Math.max(0, input.totalInvestment);
  const r = Math.max(0, input.annualRate) / 100;
  const t = Math.max(0, input.years);

  if (p <= 0 || t <= 0 || r <= 0) {
    return {
      investedAmount: 0,
      estimatedReturns: 0,
      totalValue: 0,
      investedRatio: 50,
      returnsRatio: 50,
    };
  }

  const totalValue = p * Math.pow(1 + r, t);
  const estimatedReturns = Math.max(0, totalValue - p);
  const investedRatio = (p / totalValue) * 100;
  const returnsRatio = (estimatedReturns / totalValue) * 100;

  return {
    investedAmount: Math.round(p),
    estimatedReturns: Math.round(estimatedReturns),
    totalValue: Math.round(totalValue),
    investedRatio: Number(investedRatio.toFixed(1)),
    returnsRatio: Number(returnsRatio.toFixed(1)),
  };
}

/**
 * Systematic Withdrawal Plan (SWP)
 */
export function calculateSWP(input: SWPInput): SWPResult {
  const corpus = Math.max(0, input.totalInvestment);
  const withdrawal = Math.max(0, input.monthlyWithdrawal);
  const monthlyRate = Math.max(0, input.annualRate) / (12 * 100);
  const totalMonths = Math.max(0, input.years * 12);

  let balance = corpus;
  let totalWithdrawn = 0;
  let isExhausted = false;
  let exhaustedMonth: number | undefined;

  for (let m = 1; m <= totalMonths; m++) {
    // Interest earned in month
    balance = balance * (1 + monthlyRate);
    if (balance >= withdrawal) {
      balance -= withdrawal;
      totalWithdrawn += withdrawal;
    } else {
      totalWithdrawn += balance;
      balance = 0;
      isExhausted = true;
      exhaustedMonth = m;
      break;
    }
  }

  return {
    totalInvested: corpus,
    totalWithdrawn: Math.round(totalWithdrawn),
    finalBalance: Math.round(balance),
    isExhausted,
    exhaustedMonth,
  };
}

/**
 * Compound Annual Growth Rate (CAGR)
 * Formula: CAGR = (Final / Initial)^(1 / Years) - 1
 */
export function calculateCAGR(input: CAGRInput): CAGRResult {
  const initial = Math.max(1, input.initialValue);
  const finalVal = Math.max(0, input.finalValue);
  const years = Math.max(0.1, input.years);

  const absoluteGain = finalVal - initial;
  const absoluteReturnPct = Number(((absoluteGain / initial) * 100).toFixed(2));
  const cagr = (Math.pow(finalVal / initial, 1 / years) - 1) * 100;

  return {
    initialValue: initial,
    finalValue: finalVal,
    absoluteGain: Math.round(absoluteGain),
    absoluteReturnPct,
    cagrPercentage: Number(cagr.toFixed(2)),
  };
}

/**
 * Goal-Based SIP Calculator
 * Calculates monthly SIP needed to reach a target corpus
 */
export function calculateGoalSIP(input: GoalSIPInput): GoalSIPResult {
  const target = Math.max(0, input.targetAmount);
  const years = Math.max(0, input.years);
  const monthlyRate = Math.max(0, input.annualRate) / (12 * 100);
  const n = years * 12;

  if (target === 0 || n === 0 || monthlyRate === 0) {
    return {
      targetAmount: target,
      requiredMonthlySIP: 0,
      totalInvested: 0,
      expectedGrowth: 0,
    };
  }

  // Formula: P = M / [ (( (1+i)^n - 1 ) / i) * (1+i) ]
  const factor = ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) * (1 + monthlyRate);
  const requiredMonthly = Math.round(target / factor);
  const totalInvested = requiredMonthly * n;
  const expectedGrowth = Math.max(0, target - totalInvested);

  return {
    targetAmount: target,
    requiredMonthlySIP: requiredMonthly,
    totalInvested,
    expectedGrowth,
  };
}

/**
 * Inflation Calculator
 * Computes future cost of goods and purchasing power erosion
 */
export function calculateInflation(input: InflationInput): InflationResult {
  const current = Math.max(0, input.currentAmount);
  const rate = Math.max(0, input.inflationRate) / 100;
  const years = Math.max(0, input.years);

  const futureCost = Math.round(current * Math.pow(1 + rate, years));
  const equivalentToday = Math.round(current / Math.pow(1 + rate, years));
  const purchasingPowerLossPct = Number(((1 - equivalentToday / (current || 1)) * 100).toFixed(1));

  return {
    currentAmount: current,
    futureCost,
    purchasingPowerLossPct,
    equivalentToday,
  };
}

/**
 * Public Provident Fund (PPF)
 * 15 Year Government scheme compounding annually (Current rate ~7.1%)
 */
export function calculatePPF(input: PPFInput): PPFResult {
  const annual = Math.min(150000, Math.max(500, input.annualDeposit));
  const years = input.years || 15;
  const rate = (input.annualRate || 7.1) / 100;

  let balance = 0;
  let totalDeposited = 0;

  for (let y = 1; y <= years; y++) {
    totalDeposited += annual;
    balance = (balance + annual) * (1 + rate);
  }

  const maturityAmount = Math.round(balance);
  const interestEarned = Math.max(0, maturityAmount - totalDeposited);

  return {
    totalDeposited,
    interestEarned,
    maturityAmount,
  };
}

/**
 * Generate real year-by-year compounding points for charts
 */
export function getYearlyCompoundingSchedule(
  type: 'sip' | 'lumpsum' | 'swp',
  principal: number,
  annualRate: number,
  years: number,
  extraParam: number = 0 // stepUpPct for SIP, or monthlyWithdrawal for SWP
): CompoundingPoint[] {
  const points: CompoundingPoint[] = [];
  const safeYears = Math.min(40, Math.max(1, Math.round(years)));

  if (type === 'sip') {
    const monthlyRate = annualRate / (12 * 100);
    let currentMonthly = principal;
    let cumInvested = 0;
    let balance = 0;

    for (let y = 1; y <= safeYears; y++) {
      for (let m = 1; m <= 12; m++) {
        cumInvested += currentMonthly;
        balance = (balance + currentMonthly) * (1 + monthlyRate);
      }
      if (extraParam > 0) {
        currentMonthly = currentMonthly * (1 + extraParam / 100);
      }
      points.push({
        year: y,
        invested: Math.round(cumInvested),
        totalValue: Math.round(balance),
        gain: Math.round(Math.max(0, balance - cumInvested)),
      });
    }
  } else if (type === 'lumpsum') {
    const r = annualRate / 100;
    for (let y = 1; y <= safeYears; y++) {
      const val = principal * Math.pow(1 + r, y);
      points.push({
        year: y,
        invested: Math.round(principal),
        totalValue: Math.round(val),
        gain: Math.round(Math.max(0, val - principal)),
      });
    }
  }

  return points;
}

export const SIP_FORMULA_EXPLANATION = {
  title: 'SIP Compounding Formula',
  formula: 'M = P × [((1 + i)ⁿ - 1) / i] × (1 + i)',
  description:
    'Where P is monthly deposit, i is monthly return rate (Annual % / 1200), and n is total months. Returns compound month-on-month.',
};

