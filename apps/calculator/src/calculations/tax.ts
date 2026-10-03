/**
 * Comprehensive Indian Tax & Salary Calculation Engines
 * Compliant with Finance Act 2024-25 (Budget 2024 Section 115BAC Revised Slabs)
 */

export interface TaxSlabBreakdown {
  slab: string;
  rate: string;
  taxableInSlab: number;
  taxAmount: number;
}

export interface IncomeTaxResult {
  grossIncome: number;
  // New Regime
  newTaxableIncome: number;
  newStandardDeduction: number;
  newBaseTax: number;
  newRebate87A: number;
  newCess: number;
  newTotalTax: number;
  newEffectiveRate: number;
  newSlabs: TaxSlabBreakdown[];
  // Old Regime
  oldTaxableIncome: number;
  oldStandardDeduction: number;
  oldTotalDeductions: number;
  oldBaseTax: number;
  oldRebate87A: number;
  oldCess: number;
  oldTotalTax: number;
  oldEffectiveRate: number;
  oldSlabs: TaxSlabBreakdown[];
  // Comparison
  recommendedRegime: 'new' | 'old';
  taxSavings: number;
}

export function calculateIncomeTax(
  grossIncome: number,
  deductions80C: number = 150000,
  deductions80D: number = 25000,
  otherDeductions: number = 0
): IncomeTaxResult {
  if (grossIncome <= 0 || isNaN(grossIncome)) {
    return {
      grossIncome: 0,
      newTaxableIncome: 0,
      newStandardDeduction: 0,
      newBaseTax: 0,
      newRebate87A: 0,
      newCess: 0,
      newTotalTax: 0,
      newEffectiveRate: 0,
      newSlabs: [],
      oldTaxableIncome: 0,
      oldStandardDeduction: 0,
      oldTotalDeductions: 0,
      oldBaseTax: 0,
      oldRebate87A: 0,
      oldCess: 0,
      oldTotalTax: 0,
      oldEffectiveRate: 0,
      oldSlabs: [],
      recommendedRegime: 'new',
      taxSavings: 0,
    };
  }

  // =========================================================================
  // 1. REVISED NEW REGIME (Budget 2024 Section 115BAC)
  // Standard deduction increased to ₹75,000 for salaried individuals
  // =========================================================================
  const newStandardDeduction = Math.min(grossIncome, 75000);
  const newTaxableIncome = Math.max(0, grossIncome - newStandardDeduction);

  const newSlabs: TaxSlabBreakdown[] = [];
  let newBaseTax = 0;

  // Slabs:
  // 0 - 3,00,000 : 0%
  // 3,00,001 - 7,00,000 : 5%
  // 7,00,001 - 10,00,000 : 10%
  // 10,00,001 - 12,00,000 : 15%
  // 12,00,001 - 15,00,000 : 20%
  // Above 15,00,000 : 30%

  if (newTaxableIncome > 300000) {
    const taxable5 = Math.min(newTaxableIncome - 300000, 400000);
    const tax5 = taxable5 * 0.05;
    newBaseTax += tax5;
    newSlabs.push({ slab: '₹3L - ₹7L', rate: '5%', taxableInSlab: taxable5, taxAmount: tax5 });
  }

  if (newTaxableIncome > 700000) {
    const taxable10 = Math.min(newTaxableIncome - 700000, 300000);
    const tax10 = taxable10 * 0.10;
    newBaseTax += tax10;
    newSlabs.push({ slab: '₹7L - ₹10L', rate: '10%', taxableInSlab: taxable10, taxAmount: tax10 });
  }

  if (newTaxableIncome > 1000000) {
    const taxable15 = Math.min(newTaxableIncome - 1000000, 200000);
    const tax15 = taxable15 * 0.15;
    newBaseTax += tax15;
    newSlabs.push({ slab: '₹10L - ₹12L', rate: '15%', taxableInSlab: taxable15, taxAmount: tax15 });
  }

  if (newTaxableIncome > 1200000) {
    const taxable20 = Math.min(newTaxableIncome - 1200000, 300000);
    const tax20 = taxable20 * 0.20;
    newBaseTax += tax20;
    newSlabs.push({ slab: '₹12L - ₹15L', rate: '20%', taxableInSlab: taxable20, taxAmount: tax20 });
  }

  if (newTaxableIncome > 1500000) {
    const taxable30 = newTaxableIncome - 1500000;
    const tax30 = taxable30 * 0.30;
    newBaseTax += tax30;
    newSlabs.push({ slab: 'Above ₹15L', rate: '30%', taxableInSlab: taxable30, taxAmount: tax30 });
  }

  // Section 87A Rebate for New Regime: Income up to ₹7,00,000 is 100% tax free
  let newRebate87A = 0;
  if (newTaxableIncome <= 700000) {
    newRebate87A = newBaseTax;
    newBaseTax = 0;
  }

  const newCess = Math.round(newBaseTax * 0.04);
  const newTotalTax = Math.round(newBaseTax + newCess);
  const newEffectiveRate = grossIncome > 0 ? Number(((newTotalTax / grossIncome) * 100).toFixed(2)) : 0;

  // =========================================================================
  // 2. OLD REGIME
  // Standard deduction ₹50,000 + 80C (max ₹1.5L) + 80D (max ₹25k) + Other
  // =========================================================================
  const oldStandardDeduction = Math.min(grossIncome, 50000);
  const capped80C = Math.min(Math.max(0, deductions80C), 150000);
  const capped80D = Math.min(Math.max(0, deductions80D), 100000); // 25k self + parents up to 50k
  const cappedOther = Math.max(0, otherDeductions);
  const oldTotalDeductions = oldStandardDeduction + capped80C + capped80D + cappedOther;
  const oldTaxableIncome = Math.max(0, grossIncome - oldTotalDeductions);

  const oldSlabs: TaxSlabBreakdown[] = [];
  let oldBaseTax = 0;

  // Slabs:
  // 0 - 2,50,000 : 0%
  // 2,50,001 - 5,00,000 : 5%
  // 5,00,001 - 10,00,000 : 20%
  // Above 10,00,000 : 30%

  if (oldTaxableIncome > 250000) {
    const taxable5 = Math.min(oldTaxableIncome - 250000, 250000);
    const tax5 = taxable5 * 0.05;
    oldBaseTax += tax5;
    oldSlabs.push({ slab: '₹2.5L - ₹5L', rate: '5%', taxableInSlab: taxable5, taxAmount: tax5 });
  }

  if (oldTaxableIncome > 500000) {
    const taxable20 = Math.min(oldTaxableIncome - 500000, 500000);
    const tax20 = taxable20 * 0.20;
    oldBaseTax += tax20;
    oldSlabs.push({ slab: '₹5L - ₹10L', rate: '20%', taxableInSlab: taxable20, taxAmount: tax20 });
  }

  if (oldTaxableIncome > 1000000) {
    const taxable30 = oldTaxableIncome - 1000000;
    const tax30 = taxable30 * 0.30;
    oldBaseTax += tax30;
    oldSlabs.push({ slab: 'Above ₹10L', rate: '30%', taxableInSlab: taxable30, taxAmount: tax30 });
  }

  // Section 87A Rebate for Old Regime: Income up to ₹5,00,000 is 100% tax free (max ₹12,500)
  let oldRebate87A = 0;
  if (oldTaxableIncome <= 500000) {
    oldRebate87A = oldBaseTax;
    oldBaseTax = 0;
  }

  const oldCess = Math.round(oldBaseTax * 0.04);
  const oldTotalTax = Math.round(oldBaseTax + oldCess);
  const oldEffectiveRate = grossIncome > 0 ? Number(((oldTotalTax / grossIncome) * 100).toFixed(2)) : 0;

  // Comparison
  const recommendedRegime: 'new' | 'old' = newTotalTax <= oldTotalTax ? 'new' : 'old';
  const taxSavings = Math.abs(newTotalTax - oldTotalTax);

  return {
    grossIncome,
    newTaxableIncome,
    newStandardDeduction,
    newBaseTax,
    newRebate87A,
    newCess,
    newTotalTax,
    newEffectiveRate,
    newSlabs,
    oldTaxableIncome,
    oldStandardDeduction,
    oldTotalDeductions,
    oldBaseTax,
    oldRebate87A,
    oldCess,
    oldTotalTax,
    oldEffectiveRate,
    oldSlabs,
    recommendedRegime,
    taxSavings,
  };
}

export interface InHandSalaryResult {
  annualCTC: number;
  monthlyGross: number;
  monthlyBasic: number;
  monthlyHRA: number;
  monthlySpecialAllowance: number;
  monthlyEmployeePF: number;
  monthlyEmployerPF: number;
  monthlyProfessionalTax: number;
  monthlyTDS: number;
  monthlyInHand: number;
  annualInHand: number;
  annualTotalDeductions: number;
}

export function calculateInHandSalary(
  annualCTC: number,
  basicPct: number = 40
): InHandSalaryResult {
  if (annualCTC <= 0) {
    return {
      annualCTC: 0,
      monthlyGross: 0,
      monthlyBasic: 0,
      monthlyHRA: 0,
      monthlySpecialAllowance: 0,
      monthlyEmployeePF: 0,
      monthlyEmployerPF: 0,
      monthlyProfessionalTax: 0,
      monthlyTDS: 0,
      monthlyInHand: 0,
      annualInHand: 0,
      annualTotalDeductions: 0,
    };
  }

  const monthlyGross = Math.round(annualCTC / 12);
  const monthlyBasic = Math.round(monthlyGross * (basicPct / 100));
  const monthlyHRA = Math.round(monthlyBasic * 0.50); // 50% of basic
  const monthlySpecialAllowance = Math.max(0, monthlyGross - monthlyBasic - monthlyHRA);

  // Employee PF (12% of Basic, standard ceiling ₹1,800 or actual 12%)
  const monthlyEmployeePF = Math.round(Math.min(monthlyBasic * 0.12, 1800));
  const monthlyEmployerPF = monthlyEmployeePF;

  // Professional Tax (Standard across states: ~₹200/mo)
  const monthlyProfessionalTax = 200;

  // Estimated Monthly TDS using New Tax Regime
  const taxResult = calculateIncomeTax(annualCTC);
  const monthlyTDS = Math.round(taxResult.newTotalTax / 12);

  const totalMonthlyDeductions = monthlyEmployeePF + monthlyProfessionalTax + monthlyTDS;
  const monthlyInHand = Math.max(0, monthlyGross - totalMonthlyDeductions);
  const annualInHand = monthlyInHand * 12;
  const annualTotalDeductions = totalMonthlyDeductions * 12;

  return {
    annualCTC,
    monthlyGross,
    monthlyBasic,
    monthlyHRA,
    monthlySpecialAllowance,
    monthlyEmployeePF,
    monthlyEmployerPF,
    monthlyProfessionalTax,
    monthlyTDS,
    monthlyInHand,
    annualInHand,
    annualTotalDeductions,
  };
}

export interface HRAExemptionResult {
  annualBasic: number;
  annualHRA: number;
  annualRent: number;
  exemptHRA: number;
  taxableHRA: number;
  condition1ActualHRA: number;
  condition2RentMinus10Pct: number;
  condition3SalaryCap: number;
}

export function calculateHRAExemption(
  monthlyBasic: number,
  monthlyHRAReceived: number,
  monthlyRentPaid: number,
  isMetro: boolean = true
): HRAExemptionResult {
  const annualBasic = monthlyBasic * 12;
  const annualHRA = monthlyHRAReceived * 12;
  const annualRent = monthlyRentPaid * 12;

  if (annualBasic <= 0 || annualRent <= 0) {
    return {
      annualBasic,
      annualHRA,
      annualRent,
      exemptHRA: 0,
      taxableHRA: annualHRA,
      condition1ActualHRA: annualHRA,
      condition2RentMinus10Pct: 0,
      condition3SalaryCap: 0,
    };
  }

  // 1. Actual HRA received
  const condition1 = annualHRA;

  // 2. Rent paid minus 10% of basic salary
  const condition2 = Math.max(0, annualRent - (annualBasic * 0.10));

  // 3. 50% of basic (Metro) or 40% (Non-Metro)
  const condition3 = annualBasic * (isMetro ? 0.50 : 0.40);

  // Exempt HRA is minimum of the three
  const exemptHRA = Math.round(Math.min(condition1, condition2, condition3));
  const taxableHRA = Math.max(0, annualHRA - exemptHRA);

  return {
    annualBasic,
    annualHRA,
    annualRent,
    exemptHRA,
    taxableHRA,
    condition1ActualHRA: Math.round(condition1),
    condition2RentMinus10Pct: Math.round(condition2),
    condition3SalaryCap: Math.round(condition3),
  };
}

export interface GSTResult {
  baseAmount: number;
  gstAmount: number;
  cgst: number;
  sgst: number;
  totalAmount: number;
  rate: number;
}

export function calculateGSTDetailed(
  amount: number,
  rate: number,
  isInclusive: boolean
): GSTResult {
  if (amount <= 0 || rate <= 0) {
    return { baseAmount: 0, gstAmount: 0, cgst: 0, sgst: 0, totalAmount: 0, rate };
  }

  let baseAmount = 0;
  let gstAmount = 0;
  let totalAmount = 0;

  if (isInclusive) {
    // Amount includes GST
    baseAmount = (amount * 100) / (100 + rate);
    gstAmount = amount - baseAmount;
    totalAmount = amount;
  } else {
    // Amount excludes GST
    baseAmount = amount;
    gstAmount = (amount * rate) / 100;
    totalAmount = amount + gstAmount;
  }

  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;

  return {
    baseAmount: Number(baseAmount.toFixed(2)),
    gstAmount: Number(gstAmount.toFixed(2)),
    cgst: Number(cgst.toFixed(2)),
    sgst: Number(sgst.toFixed(2)),
    totalAmount: Number(totalAmount.toFixed(2)),
    rate,
  };
}
