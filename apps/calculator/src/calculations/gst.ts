export interface GSTInput {
  amount: number;
  rate: number;
  isInclusive: boolean; // false = Add GST (exclusive), true = Remove GST (inclusive)
}

export interface GSTResult {
  baseAmount: number;
  totalGst: number;
  cgst: number;
  sgst: number;
  grossAmount: number;
}

export function calculateGST(input: GSTInput): GSTResult {
  const { amount, rate, isInclusive } = input;

  if (amount <= 0 || rate < 0) {
    return {
      baseAmount: 0,
      totalGst: 0,
      cgst: 0,
      sgst: 0,
      grossAmount: 0,
    };
  }

  let baseAmount = 0;
  let totalGst = 0;
  let grossAmount = 0;

  if (isInclusive) {
    grossAmount = amount;
    baseAmount = (amount * 100) / (100 + rate);
    totalGst = grossAmount - baseAmount;
  } else {
    baseAmount = amount;
    totalGst = (amount * rate) / 100;
    grossAmount = baseAmount + totalGst;
  }

  return {
    baseAmount: Number(baseAmount.toFixed(2)),
    totalGst: Number(totalGst.toFixed(2)),
    cgst: Number((totalGst / 2).toFixed(2)),
    sgst: Number((totalGst / 2).toFixed(2)),
    grossAmount: Number(grossAmount.toFixed(2)),
  };
}

export const GST_FORMULA_EXPLANATION = {
  title: 'GST Tax Calculation Formula',
  formula: 'Exclusive: GST = (Amount × Rate) / 100 | Inclusive: Base = (Amount × 100) / (100 + Rate)',
  description: 'Total GST is split equally between CGST (Central) and SGST (State) for intra-state supply.',
};
