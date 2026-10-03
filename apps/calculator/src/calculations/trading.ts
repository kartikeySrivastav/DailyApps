export type MarketType = 'india' | 'us_global';

export interface StockTradeInput {
  market: MarketType;
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  tradeType: 'delivery' | 'intraday';
  // Configurable charges
  brokerageType: 'percentage' | 'flat';
  brokerageValue: number; // in INR or USD
  sttRate?: number; // Securities Transaction Tax % (India)
  exchangeTxnRate?: number; // Exchange transaction charges %
  sebiRate?: number; // SEBI charges %
  gstRate?: number; // GST %
  stampDutyRate?: number; // Stamp duty on buy %
  dpCharges?: number; // Flat DP charge on selling delivery shares (e.g., Rs 15.34)
  // US / Global specific
  secFeeRate?: number; // US SEC transaction fee % on sell
  tafFeePerShare?: number; // FINRA Trading Activity Fee per share
}

export interface StockTradeCharges {
  brokerage: number;
  stt: number;
  exchangeTxnFee: number;
  sebiCharges: number;
  gst: number;
  stampDuty: number;
  dpCharges: number;
  regulatoryFees: number; // for US SEC + TAF
  totalCharges: number;
}

export interface StockTradeResult {
  currencySymbol: string;
  buyTotal: number;
  sellTotal: number;
  turnover: number;
  grossProfit: number;
  charges: StockTradeCharges;
  netProfit: number;
  roiPercentage: number;
  breakEvenPrice: number;
  isProfit: boolean;
}

export const INDIAN_MARKET_CONFIG = {
  delivery: {
    brokerageType: 'flat' as const,
    brokerageValue: 20, // Rs 20 flat (or 0 for Zerodha)
    sttRate: 0.1, // 0.1% on buy & sell (turnover)
    exchangeTxnRate: 0.00307, // Official NSE equity rate: 0.00307%
    sebiRate: 0.0001, // Rs 10 per crore
    gstRate: 18, // 18% on (Brokerage + Txn + SEBI)
    stampDutyRate: 0.015, // 0.015% on buy
    dpCharges: 15.34, // CDSL DP charge on sell (Rs 13.50 + 18% GST)
  },
  intraday: {
    brokerageType: 'flat' as const,
    brokerageValue: 20, // 0.03% or Rs 20 per order
    sttRate: 0.025, // 0.025% on sell only
    exchangeTxnRate: 0.00307,
    sebiRate: 0.0001,
    gstRate: 18,
    stampDutyRate: 0.003, // 0.003% on buy
    dpCharges: 0, // No DP charges for intraday
  },
};

export const US_MARKET_CONFIG = {
  brokerageType: 'flat' as const,
  brokerageValue: 0, // Zero commission (Robinhood, DriveWealth, Vested)
  secFeeRate: 0.00278, // $27.80 per million of sales (0.00278%)
  tafFeePerShare: 0.000166, // $0.000166 per share sold
};

export function validateTradeInput(input: StockTradeInput): { isValid: boolean; error?: string } {
  if (input.buyPrice <= 0 || isNaN(input.buyPrice)) {
    return { isValid: false, error: 'Buy price must be greater than 0' };
  }
  if (input.sellPrice <= 0 || isNaN(input.sellPrice)) {
    return { isValid: false, error: 'Sell price must be greater than 0' };
  }
  if (input.quantity <= 0 || isNaN(input.quantity)) {
    return { isValid: false, error: 'Quantity must be greater than 0' };
  }
  return { isValid: true };
}

/**
 * Pure calculation function supporting both Indian Stock Market (NSE/BSE) and US/Foreign Market
 */
export function calculateStockTrade(input: StockTradeInput): StockTradeResult {
  const { market, buyPrice, sellPrice, quantity, tradeType } = input;
  const currencySymbol = market === 'india' ? '₹' : '$';

  const buyTotal = buyPrice * quantity;
  const sellTotal = sellPrice * quantity;
  const turnover = buyTotal + sellTotal;
  const grossProfit = sellTotal - buyTotal;

  if (market === 'india') {
    const config = INDIAN_MARKET_CONFIG[tradeType];
    const brokerageVal = input.brokerageValue ?? config.brokerageValue;
    const sttRate = input.sttRate ?? config.sttRate;
    const exchangeTxnRate = input.exchangeTxnRate ?? config.exchangeTxnRate;
    const sebiRate = input.sebiRate ?? config.sebiRate;
    const gstRate = input.gstRate ?? config.gstRate;
    const stampDutyRate = input.stampDutyRate ?? config.stampDutyRate;
    const dpCharges = tradeType === 'delivery' ? (input.dpCharges ?? config.dpCharges) : 0;

    // 1. Brokerage (Buy leg + Sell leg)
    let brokerage = 0;
    if (tradeType === 'intraday') {
      // 0.03% or flat fee whichever is lower per executed leg (standard discount broker rule)
      const buyBrok = Math.min(brokerageVal, (buyTotal * 0.03) / 100);
      const sellBrok = Math.min(brokerageVal, (sellTotal * 0.03) / 100);
      brokerage = buyBrok + sellBrok;
    } else if (input.brokerageType === 'flat') {
      brokerage = brokerageVal * 2;
    } else {
      brokerage = ((buyTotal * brokerageVal) / 100) + ((sellTotal * brokerageVal) / 100);
    }

    // 2. STT
    let stt = 0;
    if (tradeType === 'delivery') {
      stt = (turnover * sttRate) / 100;
    } else {
      stt = (sellTotal * sttRate) / 100;
    }

    // 3. Exchange transaction charges
    const exchangeTxnFee = (turnover * exchangeTxnRate) / 100;

    // 4. SEBI turnover charges
    const sebiCharges = (turnover * sebiRate) / 100;

    // 5. GST (18% on Brokerage + Exchange fees + SEBI fees)
    const gst = ((brokerage + exchangeTxnFee + sebiCharges) * gstRate) / 100;

    // 6. Stamp Duty (on buy side)
    const stampDuty = (buyTotal * stampDutyRate) / 100;

    const totalCharges = brokerage + stt + exchangeTxnFee + sebiCharges + gst + stampDuty + dpCharges;
    const netProfit = grossProfit - totalCharges;
    const roiPercentage = buyTotal > 0 ? (netProfit / buyTotal) * 100 : 0;
    const breakEvenPrice = (buyTotal + totalCharges) / quantity;

    return {
      currencySymbol,
      buyTotal: Number(buyTotal.toFixed(2)),
      sellTotal: Number(sellTotal.toFixed(2)),
      turnover: Number(turnover.toFixed(2)),
      grossProfit: Number(grossProfit.toFixed(2)),
      charges: {
        brokerage: Number(brokerage.toFixed(2)),
        stt: Number(stt.toFixed(2)),
        exchangeTxnFee: Number(exchangeTxnFee.toFixed(2)),
        sebiCharges: Number(sebiCharges.toFixed(2)),
        gst: Number(gst.toFixed(2)),
        stampDuty: Number(stampDuty.toFixed(2)),
        dpCharges: Number(dpCharges.toFixed(2)),
        regulatoryFees: 0,
        totalCharges: Number(totalCharges.toFixed(2)),
      },
      netProfit: Number(netProfit.toFixed(2)),
      roiPercentage: Number(roiPercentage.toFixed(2)),
      breakEvenPrice: Number(breakEvenPrice.toFixed(2)),
      isProfit: netProfit >= 0,
    };
  } else {
    // US / Global Stocks (USD)
    const brokerageVal = input.brokerageValue ?? US_MARKET_CONFIG.brokerageValue;
    const secFeeRate = input.secFeeRate ?? US_MARKET_CONFIG.secFeeRate;
    const tafFeePerShare = input.tafFeePerShare ?? US_MARKET_CONFIG.tafFeePerShare;

    // SEC Fee (on sell value)
    const secFee = (sellTotal * secFeeRate) / 100;

    // FINRA TAF Fee ($0.000166 per share sold, max $8.30)
    const tafFee = Math.min(8.30, quantity * tafFeePerShare);

    const regulatoryFees = secFee + tafFee;
    const totalCharges = (brokerageVal * 2) + regulatoryFees;
    const netProfit = grossProfit - totalCharges;
    const roiPercentage = buyTotal > 0 ? (netProfit / buyTotal) * 100 : 0;
    const breakEvenPrice = (buyTotal + totalCharges) / quantity;

    return {
      currencySymbol,
      buyTotal: Number(buyTotal.toFixed(2)),
      sellTotal: Number(sellTotal.toFixed(2)),
      turnover: Number(turnover.toFixed(2)),
      grossProfit: Number(grossProfit.toFixed(2)),
      charges: {
        brokerage: Number((brokerageVal * 2).toFixed(2)),
        stt: 0,
        exchangeTxnFee: 0,
        sebiCharges: 0,
        gst: 0,
        stampDuty: 0,
        dpCharges: 0,
        regulatoryFees: Number(regulatoryFees.toFixed(2)),
        totalCharges: Number(totalCharges.toFixed(2)),
      },
      netProfit: Number(netProfit.toFixed(2)),
      roiPercentage: Number(roiPercentage.toFixed(2)),
      breakEvenPrice: Number(breakEvenPrice.toFixed(2)),
      isProfit: netProfit >= 0,
    };
  }
}

export const TRADING_FORMULA_EXPLANATION = {
  title: 'Statutory Charges Breakdown',
  formula: 'Net P&L = (Sell Value - Buy Value) - Total Statutory Charges',
  description:
    'For India (NSE/BSE): STT (0.1% delivery / 0.025% intraday), Brokerage (₹20), Exchange Txn fees, SEBI charges, Stamp Duty, DP charges, and 18% GST. For US/Global stocks: SEC fee, FINRA TAF, and broker commission.',
};

export interface StockLot {
  price: number;
  quantity: number;
}

export interface StockAverageResult {
  totalQuantity: number;
  totalInvestment: number;
  averagePrice: number;
}

export function calculateStockAverage(lots: StockLot[]): StockAverageResult {
  let totalQty = 0;
  let totalCost = 0;
  for (const lot of lots) {
    if (lot.price > 0 && lot.quantity > 0) {
      totalQty += lot.quantity;
      totalCost += lot.price * lot.quantity;
    }
  }
  const avg = totalQty > 0 ? totalCost / totalQty : 0;
  return {
    totalQuantity: totalQty,
    totalInvestment: Number(totalCost.toFixed(2)),
    averagePrice: Number(avg.toFixed(2)),
  };
}

export interface TargetPriceResult {
  breakEvenPrice: number;
  targetPrice: number;
  targetGrossProfit: number;
  targetNetProfit: number;
  totalCharges: number;
  percentageGain: number;
}

export function calculateTargetPrice(
  buyPrice: number,
  quantity: number,
  targetProfitPct: number,
  tradeType: 'delivery' | 'intraday' = 'delivery'
): TargetPriceResult {
  if (buyPrice <= 0 || quantity <= 0) {
    return {
      breakEvenPrice: 0,
      targetPrice: 0,
      targetGrossProfit: 0,
      targetNetProfit: 0,
      totalCharges: 0,
      percentageGain: 0,
    };
  }

  const buyTotal = buyPrice * quantity;
  // Estimated roundtrip statutory charges rate (~0.22% for delivery, ~0.06% for intraday + brokerage)
  const chargeRate = tradeType === 'delivery' ? 0.0022 : 0.0006;
  const flatBrokerage = 40; // buy + sell leg

  // Break even sell price
  const estimatedBreakEvenCharges = (buyTotal * chargeRate * 2) + flatBrokerage;
  const breakEvenPrice = Number(((buyTotal + estimatedBreakEvenCharges) / quantity).toFixed(2));

  // Desired profit
  const desiredProfit = buyTotal * (targetProfitPct / 100);
  const estimatedTargetCharges = ((buyTotal + desiredProfit) * chargeRate * 2) + flatBrokerage;
  const targetPrice = Number(((buyTotal + desiredProfit + estimatedTargetCharges) / quantity).toFixed(2));
  const targetGrossProfit = Number(((targetPrice * quantity) - buyTotal).toFixed(2));
  const targetNetProfit = Number((targetGrossProfit - estimatedTargetCharges).toFixed(2));

  return {
    breakEvenPrice,
    targetPrice,
    targetGrossProfit,
    targetNetProfit,
    totalCharges: Number(estimatedTargetCharges.toFixed(2)),
    percentageGain: targetProfitPct,
  };
}

export interface StopLossSizingResult {
  maxRiskAmount: number;
  riskPerShare: number;
  riskPercentPerShare: number;
  recommendedQuantity: number;
  totalTradeCapital: number;
  capitalAllocationPct: number;
  actualRiskAmount: number;
}

export function calculateStopLossAndSizing(
  capital: number,
  riskPct: number,
  entryPrice: number,
  stopLossPrice: number
): StopLossSizingResult {
  if (capital <= 0 || entryPrice <= 0 || stopLossPrice <= 0 || stopLossPrice >= entryPrice) {
    return {
      maxRiskAmount: 0,
      riskPerShare: 0,
      riskPercentPerShare: 0,
      recommendedQuantity: 0,
      totalTradeCapital: 0,
      capitalAllocationPct: 0,
      actualRiskAmount: 0,
    };
  }

  const maxRiskAmount = capital * (riskPct / 100);
  const riskPerShare = entryPrice - stopLossPrice;
  const riskPercentPerShare = (riskPerShare / entryPrice) * 100;
  const recommendedQuantity = Math.max(1, Math.floor(maxRiskAmount / riskPerShare));
  const totalTradeCapital = recommendedQuantity * entryPrice;
  const capitalAllocationPct = (totalTradeCapital / capital) * 100;
  const actualRiskAmount = recommendedQuantity * riskPerShare;

  return {
    maxRiskAmount: Number(maxRiskAmount.toFixed(2)),
    riskPerShare: Number(riskPerShare.toFixed(2)),
    riskPercentPerShare: Number(riskPercentPerShare.toFixed(2)),
    recommendedQuantity,
    totalTradeCapital: Number(totalTradeCapital.toFixed(2)),
    capitalAllocationPct: Number(capitalAllocationPct.toFixed(2)),
    actualRiskAmount: Number(actualRiskAmount.toFixed(2)),
  };
}

export interface RiskRewardResult {
  riskPerShare: number;
  rewardPerShare: number;
  ratio: number;
  ratioFormatted: string;
  totalRisk: number;
  totalReward: number;
  isFavorable: boolean;
  verdict: string;
}

export function calculateRiskReward(
  entryPrice: number,
  stopLossPrice: number,
  targetPrice: number,
  quantity: number = 100
): RiskRewardResult {
  if (entryPrice <= 0 || stopLossPrice <= 0 || targetPrice <= 0 || stopLossPrice >= entryPrice || targetPrice <= entryPrice) {
    return {
      riskPerShare: 0,
      rewardPerShare: 0,
      ratio: 0,
      ratioFormatted: '1 : 0',
      totalRisk: 0,
      totalReward: 0,
      isFavorable: false,
      verdict: 'Invalid Levels (SL must be < Entry < Target)',
    };
  }

  const riskPerShare = entryPrice - stopLossPrice;
  const rewardPerShare = targetPrice - entryPrice;
  const ratio = rewardPerShare / riskPerShare;
  const isFavorable = ratio >= 2.0;

  let verdict = 'Poor (< 1:1.5)';
  if (ratio >= 3.0) {
    verdict = '🌟 Excellent (1:3+)';
  } else if (ratio >= 2.0) {
    verdict = '✅ Favorable (1:2+)';
  } else if (ratio >= 1.5) {
    verdict = '⚠️ Acceptable (1:1.5)';
  }

  return {
    riskPerShare: Number(riskPerShare.toFixed(2)),
    rewardPerShare: Number(rewardPerShare.toFixed(2)),
    ratio: Number(ratio.toFixed(2)),
    ratioFormatted: `1 : ${ratio.toFixed(2)}`,
    totalRisk: Number((riskPerShare * quantity).toFixed(2)),
    totalReward: Number((rewardPerShare * quantity).toFixed(2)),
    isFavorable,
    verdict,
  };
}

