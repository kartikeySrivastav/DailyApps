/**
 * Banking Calculation Engine
 * Standard Indian Banking (RBI / IBA) & Statutory Rules
 */

export interface FDInput {
  depositAmount: number; // Principal P
  annualRate: number;    // Annual interest rate r in percent (e.g. 7.1)
  years: number;         // Tenure in years
  compounding?: 'quarterly' | 'monthly' | 'half_yearly' | 'annual'; // Default quarterly
  isSeniorCitizen?: boolean; // +0.50% senior citizen bonus
  deductTDS?: boolean;
  tdsRate?: number; // Default 10%
}

export interface FDPayoutResult {
  depositAmount: number;
  annualRate: number;
  monthlyPayout: number;
  quarterlyPayout: number;
  annualPayout: number;
  totalInterestOverTenure: number;
}

export interface RDInput {
  monthlyDeposit: number; // Monthly deposit P
  annualRate: number;     // Annual interest rate r in percent (e.g. 6.8)
  months: number;         // Tenure in months
  isSeniorCitizen?: boolean;
}

export interface DepositResult {
  totalDeposited: number;
  interestEarned: number;
  maturityAmount: number;
  principalRatio: number;
  interestRatio: number;
  tdsDeducted?: number;
  postTaxMaturity?: number;
}

export interface SimpleInterestInput {
  principal: number;
  annualRate: number;
  years: number;
}

export interface SimpleInterestResult {
  principal: number;
  interestEarned: number;
  totalAmount: number;
  principalRatio: number;
  interestRatio: number;
}

export interface SavingsInterestInput {
  averageBalance: number; // Daily average balance
  annualRate: number;    // Usually 2.7% to 4.0%
  days?: number;          // Defaults to 90 (quarterly) or 365 (annual)
}

export interface SavingsInterestResult {
  averageBalance: number;
  quarterlyInterest: number;
  annualInterest: number;
  monthlyInterest: number;
}

export interface GratuityInput {
  lastDrawnBasicSalary: number; // Basic + DA
  yearsOfService: number;       // Completed years
}

export interface GratuityResult {
  isEligible: boolean;
  gratuityAmount: number;
  cappedGratuity: number;
  taxExemptAmount: number;
  taxableAmount: number;
  formulaNote: string;
}

/**
 * Calculate Fixed Deposit (FD) Maturity
 * Standard Indian banks compound interest quarterly: A = P * (1 + r / (n * 100))^(n * t)
 */
export function calculateFD(input: FDInput): DepositResult {
  const P = Math.max(0, input.depositAmount);
  let r = Math.max(0, input.annualRate);
  if (input.isSeniorCitizen) {
    r += 0.5;
  }
  const t = Math.max(0, input.years);

  if (P === 0 || t === 0) {
    return {
      totalDeposited: P,
      interestEarned: 0,
      maturityAmount: P,
      principalRatio: 100,
      interestRatio: 0,
      tdsDeducted: 0,
      postTaxMaturity: P,
    };
  }

  // Compounding frequency: monthly (12), quarterly (4), half-yearly (2), annual (1)
  const n =
    input.compounding === 'monthly'
      ? 12
      : input.compounding === 'half_yearly'
      ? 2
      : input.compounding === 'annual'
      ? 1
      : 4;
  const A = P * Math.pow(1 + r / (n * 100), n * t);
  const maturityAmount = Math.round(A);
  const interestEarned = Math.max(0, maturityAmount - P);

  // TDS Calculation (Sec 194A: 10% TDS if interest > ₹40k, or ₹50k for senior citizen)
  let tdsDeducted = 0;
  if (input.deductTDS) {
    const threshold = input.isSeniorCitizen ? 50000 : 40000;
    const annualInterest = interestEarned / Math.max(1, t);
    if (annualInterest > threshold || interestEarned > threshold) {
      const rate = (input.tdsRate || 10) / 100;
      tdsDeducted = Math.round(interestEarned * rate);
    }
  }

  const postTaxMaturity = Math.max(P, maturityAmount - tdsDeducted);

  const principalRatio = maturityAmount > 0 ? Number(((P / maturityAmount) * 100).toFixed(1)) : 100;
  const interestRatio = Number((100 - principalRatio).toFixed(1));

  return {
    totalDeposited: P,
    interestEarned,
    maturityAmount,
    principalRatio,
    interestRatio,
    tdsDeducted,
    postTaxMaturity,
  };
}

/**
 * Calculate Regular FD Interest Payouts (Non-cumulative FD)
 */
export function calculateFDPayout(input: FDInput): FDPayoutResult {
  const P = Math.max(0, input.depositAmount);
  let r = Math.max(0, input.annualRate);
  if (input.isSeniorCitizen) {
    r += 0.5;
  }
  const t = Math.max(0, input.years);

  const annualInterest = (P * r) / 100;
  const monthlyPayout = Math.round(annualInterest / 12);
  const quarterlyPayout = Math.round(annualInterest / 4);
  const totalInterestOverTenure = Math.round(annualInterest * t);

  return {
    depositAmount: P,
    annualRate: r,
    monthlyPayout,
    quarterlyPayout,
    annualPayout: Math.round(annualInterest),
    totalInterestOverTenure,
  };
}

/**
 * Calculate Recurring Deposit (RD) Maturity
 * In Indian Banks, RD interest is compounded quarterly on monthly deposits:
 * IBA formula: Sum of P * (1 + r/400)^(remainingMonths / 3)
 */
export function calculateRD(input: RDInput): DepositResult {
  const P = Math.max(0, input.monthlyDeposit);
  let r = Math.max(0, input.annualRate);
  if (input.isSeniorCitizen) {
    r += 0.5;
  }
  const totalMonths = Math.max(0, Math.round(input.months));
  const totalDeposited = P * totalMonths;

  if (P === 0 || totalMonths === 0) {
    return {
      totalDeposited,
      interestEarned: 0,
      maturityAmount: totalDeposited,
      principalRatio: 100,
      interestRatio: 0,
    };
  }

  let maturity = 0;
  for (let i = 1; i <= totalMonths; i++) {
    const remainingMonths = totalMonths - i + 1;
    const factor = Math.pow(1 + r / 400, remainingMonths / 3);
    maturity += P * factor;
  }

  const maturityAmount = Math.round(maturity);
  const interestEarned = Math.max(0, maturityAmount - totalDeposited);

  const principalRatio = maturityAmount > 0 ? Number(((totalDeposited / maturityAmount) * 100).toFixed(1)) : 100;
  const interestRatio = Number((100 - principalRatio).toFixed(1));

  return {
    totalDeposited,
    interestEarned,
    maturityAmount,
    principalRatio,
    interestRatio,
  };
}

/**
 * Calculate Simple Interest (SI)
 * Formula: SI = (P × R × T) / 100
 */
export function calculateSimpleInterest(input: SimpleInterestInput): SimpleInterestResult {
  const P = Math.max(0, input.principal);
  const R = Math.max(0, input.annualRate);
  const T = Math.max(0, input.years);

  const interestEarned = Math.round((P * R * T) / 100);
  const totalAmount = P + interestEarned;

  const principalRatio = totalAmount > 0 ? Number(((P / totalAmount) * 100).toFixed(1)) : 100;
  const interestRatio = Number((100 - principalRatio).toFixed(1));

  return {
    principal: P,
    interestEarned,
    totalAmount,
    principalRatio,
    interestRatio,
  };
}

/**
 * Calculate Savings Account Interest
 * RBI Mandate: Interest calculated on daily closing balance, credited quarterly:
 * Daily Interest = (Daily Balance × Rate) / (365 × 100)
 */
export function calculateSavingsInterest(input: SavingsInterestInput): SavingsInterestResult {
  const balance = Math.max(0, input.averageBalance);
  const rate = Math.max(0, input.annualRate);

  const annualInterest = Math.round((balance * rate) / 100);
  const quarterlyInterest = Math.round((balance * rate * 91.25) / 36500);
  const monthlyInterest = Math.round(annualInterest / 12);

  return {
    averageBalance: balance,
    annualInterest,
    quarterlyInterest,
    monthlyInterest,
  };
}

/**
 * Calculate Statutory Gratuity (Payment of Gratuity Act, 1972)
 * Formula: Gratuity = (15 × Last Drawn Salary × Tenure in Years) / 26
 * Eligibility: Minimum 5 continuous years of service (except death/disability).
 * Statutory Tax-Exempt Limit: ₹20,00,000 (Central Govt 7th CPC amendment).
 */
export function calculateGratuity(input: GratuityInput): GratuityResult {
  const salary = Math.max(0, input.lastDrawnBasicSalary);
  const rawYears = Math.max(0, input.yearsOfService);
  // Service > 6 months in the final year is rounded to the next year
  const tenure = Math.round(rawYears);
  const isEligible = tenure >= 5;

  if (!isEligible || salary === 0) {
    const projected = Math.round((15 * salary * tenure) / 26);
    return {
      isEligible: false,
      gratuityAmount: projected,
      cappedGratuity: 0,
      taxExemptAmount: 0,
      taxableAmount: 0,
      formulaNote: 'Minimum 5 continuous years of service required for statutory gratuity eligibility.',
    };
  }

  const rawGratuity = Math.round((15 * salary * tenure) / 26);
  const STATUTORY_CAP = 2000000; // 20 Lakhs
  const cappedGratuity = Math.min(rawGratuity, STATUTORY_CAP);
  const taxableAmount = Math.max(0, rawGratuity - STATUTORY_CAP);

  return {
    isEligible: true,
    gratuityAmount: rawGratuity,
    cappedGratuity,
    taxExemptAmount: cappedGratuity,
    taxableAmount,
    formulaNote: 'Formula: (15 × Last Salary × Completed Years) / 26. Tax exempt up to ₹20 Lakhs under IT Act Sec 10(10).',
  };
}

