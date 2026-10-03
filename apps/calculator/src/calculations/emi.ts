export interface EMIInput {
  principal: number;
  annualRate: number;
  tenureMonths: number;
}

export interface EMIResult {
  monthlyEMI: number;
  totalInterest: number;
  totalPayment: number;
  principalRatio: number;
  interestRatio: number;
}

export function calculateEMI(input: EMIInput): EMIResult {
  const { principal, annualRate, tenureMonths } = input;

  if (principal <= 0 || tenureMonths <= 0) {
    return {
      monthlyEMI: 0,
      totalInterest: 0,
      totalPayment: 0,
      principalRatio: 50,
      interestRatio: 50,
    };
  }

  const monthlyRate = annualRate / (12 * 100);
  let emi = 0;

  if (monthlyRate > 0) {
    const factor = Math.pow(1 + monthlyRate, tenureMonths);
    emi = (principal * monthlyRate * factor) / (factor - 1);
  } else {
    emi = principal / tenureMonths;
  }

  const totalPayment = emi * tenureMonths;
  const totalInterest = Math.max(0, totalPayment - principal);
  const principalRatio = totalPayment > 0 ? (principal / totalPayment) * 100 : 50;
  const interestRatio = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 50;

  return {
    monthlyEMI: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
    principalRatio: Number(principalRatio.toFixed(1)),
    interestRatio: Number(interestRatio.toFixed(1)),
  };
}

export const EMI_FORMULA_EXPLANATION = {
  title: 'Equated Monthly Installment (EMI) Formula',
  formula: 'EMI = [P × r × (1 + r)ⁿ] / [(1 + r)ⁿ - 1]',
  description: 'Where P is loan principal, r is monthly interest rate, and n is total tenure in months.',
};
