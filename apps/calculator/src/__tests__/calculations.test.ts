import { calculateEMI } from '../calculations/emi';
import { calculateGST } from '../calculations/gst';
import {
  calculateSIP,
  calculateLumpsum,
  calculateSWP,
  calculateCAGR,
  calculateGoalSIP,
} from '../calculations/sip';
import {
  calculateStockTrade,
  calculateStockAverage,
  calculateTargetPrice,
  calculateStopLossAndSizing,
} from '../calculations/trading';
import {
  calculateFuelTrip,
  calculateMileage,
  calculateEVCharging,
} from '../calculations/fuel';
import {
  calculateBMI,
  calculateTDEE,
  calculateWaterIntake,
} from '../calculations/health';
import {
  calculateAttendance,
  calculateSGPA,
  calculateCGPAToPercentage,
} from '../calculations/student';
import {
  calculateFD,
  calculateRD,
  calculateGratuity,
} from '../calculations/banking';
import {
  calculateIncomeTax,
  calculateInHandSalary,
} from '../calculations/tax';
import {
  calculateExactAge,
  calculateDateDifference,
  calculateWorkingDays,
} from '../calculations/dateTime';

describe('SmartCalc V1 Pure Calculation Engines', () => {
  // ==========================================
  // 1. 💰 Loans Engine Tests
  // ==========================================
  describe('Loans / EMI Engine', () => {
    it('calculates standard monthly EMI accurately', () => {
      const result = calculateEMI({
        principal: 1000000,
        annualRate: 8.5,
        tenureMonths: 120,
      });
      expect(result.monthlyEMI).toBe(12399);
      expect(result.totalPayment).toBe(1487828);
      expect(result.totalInterest).toBe(487828);
      expect(result.principalRatio + result.interestRatio).toBeCloseTo(100, 0);
    });

    it('handles 0% interest loan as linear division', () => {
      const result = calculateEMI({
        principal: 120000,
        annualRate: 0,
        tenureMonths: 12,
      });
      expect(result.monthlyEMI).toBe(10000);
      expect(result.totalInterest).toBe(0);
      expect(result.totalPayment).toBe(120000);
    });

    it('safely handles zero or negative principal and tenure', () => {
      const zeroPrincipal = calculateEMI({
        principal: 0,
        annualRate: 8.5,
        tenureMonths: 24,
      });
      expect(zeroPrincipal.monthlyEMI).toBe(0);

      const zeroTenure = calculateEMI({
        principal: 50000,
        annualRate: 8.5,
        tenureMonths: 0,
      });
      expect(zeroTenure.monthlyEMI).toBe(0);
    });
  });

  // ==========================================
  // 2. 📈 Investments Engine Tests
  // ==========================================
  describe('Investments Engine', () => {
    it('calculates monthly SIP future value accurately', () => {
      const result = calculateSIP({
        monthlyInvestment: 5000,
        annualRate: 12,
        years: 10,
      });
      expect(result.investedAmount).toBe(600000);
      expect(result.totalValue).toBeGreaterThan(result.investedAmount);
      expect(result.estimatedReturns).toBe(result.totalValue - result.investedAmount);
      expect(result.investedRatio + result.returnsRatio).toBeCloseTo(100, 0);
    });

    it('calculates one-time Lumpsum compounding', () => {
      const result = calculateLumpsum({
        totalInvestment: 100000,
        annualRate: 10,
        years: 5,
      });
      expect(result.investedAmount).toBe(100000);
      expect(result.totalValue).toBe(161051);
      expect(result.estimatedReturns).toBe(61051);
    });

    it('calculates CAGR correctly', () => {
      const result = calculateCAGR({
        initialValue: 100000,
        finalValue: 200000,
        years: 5,
      });
      expect(result.absoluteGain).toBe(100000);
      expect(result.absoluteReturnPct).toBe(100);
      expect(result.cagrPercentage).toBeCloseTo(14.87, 1);
    });

    it('calculates Goal SIP monthly requirement', () => {
      const result = calculateGoalSIP({
        targetAmount: 1000000,
        annualRate: 12,
        years: 5,
      });
      expect(result.requiredMonthlySIP).toBeGreaterThan(10000);
      expect(result.totalInvested).toBeLessThan(1000000);
    });

    it('calculates SWP withdrawal schedule', () => {
      const result = calculateSWP({
        totalInvestment: 1000000,
        monthlyWithdrawal: 8000,
        annualRate: 10,
        years: 5,
      });
      expect(result.totalWithdrawn).toBe(8000 * 60);
      expect(result.isExhausted).toBe(false);
      expect(result.finalBalance).toBeGreaterThan(0);
    });
  });

  // ==========================================
  // 3. 💵 GST & Tax Engine Tests
  // ==========================================
  describe('GST & Tax Engines', () => {
    it('calculates exclusive GST (Add GST)', () => {
      const result = calculateGST({
        amount: 1000,
        rate: 18,
        isInclusive: false,
      });
      expect(result.baseAmount).toBe(1000);
      expect(result.totalGst).toBe(180);
      expect(result.cgst).toBe(90);
      expect(result.sgst).toBe(90);
      expect(result.grossAmount).toBe(1180);
    });

    it('calculates inclusive GST (Remove GST)', () => {
      const result = calculateGST({
        amount: 1180,
        rate: 18,
        isInclusive: true,
      });
      expect(result.baseAmount).toBe(1000);
      expect(result.totalGst).toBe(180);
      expect(result.cgst).toBe(90);
      expect(result.sgst).toBe(90);
      expect(result.grossAmount).toBe(1180);
    });

    it('handles zero or negative GST inputs safely', () => {
      const zeroResult = calculateGST({
        amount: 0,
        rate: 18,
        isInclusive: false,
      });
      expect(zeroResult.totalGst).toBe(0);
      expect(zeroResult.grossAmount).toBe(0);
    });

    it('calculates Income Tax comparison with 87A rebate for income <= 7 LPA', () => {
      const result = calculateIncomeTax(700000);
      expect(result.newTotalTax).toBe(0);
      expect(result.recommendedRegime).toBe('new');
    });

    it('calculates In-Hand salary breakdown from CTC', () => {
      const result = calculateInHandSalary(1200000);
      expect(result.monthlyGross).toBe(100000);
      expect(result.monthlyInHand).toBeGreaterThan(70000);
      expect(result.monthlyInHand).toBeLessThan(result.monthlyGross);
    });
  });

  // ==========================================
  // 4. 📊 Trading Engine Tests
  // ==========================================
  describe('Trading Engine', () => {
    it('calculates delivery trade profit and statutory charges', () => {
      const result = calculateStockTrade({
        market: 'india',
        buyPrice: 100,
        sellPrice: 120,
        quantity: 100,
        tradeType: 'delivery',
        brokerageType: 'flat',
        brokerageValue: 20,
      });
      expect(result.turnover).toBe(22000);
      expect(result.grossProfit).toBe(2000);
      expect(result.netProfit).toBeLessThan(result.grossProfit);
      expect(result.netProfit).toBeGreaterThan(1900);
      expect(result.isProfit).toBe(true);
    });

    it('calculates stock average down accurately', () => {
      const result = calculateStockAverage([
        { price: 200, quantity: 100 },
        { price: 100, quantity: 100 },
      ]);
      expect(result.totalQuantity).toBe(200);
      expect(result.totalInvestment).toBe(30000);
      expect(result.averagePrice).toBe(150);
    });

    it('calculates target price for desired profit', () => {
      const result = calculateTargetPrice(100, 50, 10, 'delivery');
      expect(result.targetPrice).toBeGreaterThan(110);
    });

    it('calculates position size based on stop-loss risk', () => {
      const result = calculateStopLossAndSizing(100000, 2, 100, 95);
      expect(result.maxRiskAmount).toBe(2000);
      expect(result.recommendedQuantity).toBe(400); // 2000 / 5 = 400
    });
  });

  // ==========================================
  // 5. 🚗 Vehicle Engine Tests
  // ==========================================
  describe('Vehicle Engine', () => {
    it('calculates fuel trip expense and passenger split', () => {
      const result = calculateFuelTrip({
        distanceKm: 200,
        mileageKmpl: 20,
        fuelPricePerLitre: 100,
        passengers: 4,
      });
      expect(result.fuelNeededLitres).toBe(10);
      expect(result.totalCost).toBe(1000);
      expect(result.costPerPerson).toBe(250);
    });

    it('calculates tank-to-tank mileage', () => {
      const result = calculateMileage({
        distanceKm: 500,
        fuelLitres: 25,
      });
      expect(result.mileageKmpl).toBe(20);
    });

    it('calculates EV charging energy and cost', () => {
      const result = calculateEVCharging({
        batteryCapacityKwh: 30,
        currentPct: 20,
        targetPct: 80,
        electricityRatePerUnit: 8,
        fullChargeRangeKm: 250,
      });
      expect(result.energyNeededKwh).toBe(18); // 30 * 60%
      expect(result.totalChargingCost).toBeGreaterThan(0);
      expect(result.rangeAddedKm).toBe(150); // 250 * 60%
    });
  });

  // ==========================================
  // 6. 🏃 Health Engine Tests
  // ==========================================
  describe('Health Engine', () => {
    it('calculates BMI and categories correctly (WHO Standard)', () => {
      const normalResult = calculateBMI({
        weightKg: 70,
        heightCm: 175,
      });
      expect(normalResult.bmi).toBeCloseTo(22.86, 1);
      expect(normalResult.category).toBe('Normal Weight');

      const overweightResult = calculateBMI({
        weightKg: 85,
        heightCm: 170,
      });
      expect(overweightResult.category).toBe('Overweight');

      const underweightResult = calculateBMI({
        weightKg: 45,
        heightCm: 170,
      });
      expect(underweightResult.category).toBe('Underweight');
    });

    it('calculates TDEE and calorie goal', () => {
      const result = calculateTDEE(70, 175, 25, 'male', 'moderate');
      expect(result.bmr).toBeGreaterThan(1500);
      expect(result.tdee).toBeGreaterThan(result.bmr);
      expect(result.weightLossCalories).toBeLessThan(result.tdee);
    });

    it('calculates daily water hydration intake', () => {
      const result = calculateWaterIntake(70, 30);
      expect(result.totalLiters).toBeGreaterThan(2);
      expect(result.glasses250ml).toBeGreaterThan(8);
    });
  });

  // ==========================================
  // 7. 🎓 Student Engine Tests
  // ==========================================
  describe('Student Engine', () => {
    it('calculates safe bunks when attendance is above target', () => {
      const result = calculateAttendance({
        presentClasses: 85,
        totalClasses: 100,
        targetPercentage: 75,
      });
      expect(result.currentPercentage).toBe(85);
      expect(result.status).toBe('safe');
      expect(result.canBunkClasses).toBeGreaterThan(0);
      expect(result.mustAttendClasses).toBe(0);
    });

    it('calculates must attend classes when attendance is below target', () => {
      const result = calculateAttendance({
        presentClasses: 60,
        totalClasses: 100,
        targetPercentage: 75,
      });
      expect(result.currentPercentage).toBe(60);
      expect(result.status).toBe('shortage');
      expect(result.canBunkClasses).toBe(0);
      expect(result.mustAttendClasses).toBeGreaterThan(0);
    });

    it('converts CGPA to percentage according to university scale', () => {
      const cbseResult = calculateCGPAToPercentage({ cgpa: 8.5, scaleType: 'cbse_9_5' });
      expect(cbseResult.percentage).toBe(80.75); // 8.5 * 9.5

      const tenResult = calculateCGPAToPercentage({ cgpa: 8.0, scaleType: 'direct_10' });
      expect(tenResult.percentage).toBe(80); // 8.0 * 10
    });

    it('calculates weighted SGPA across credit subjects', () => {
      const result = calculateSGPA([
        { id: '1', name: 'Math', credits: 4, gradePoints: 9 },
        { id: '2', name: 'Physics', credits: 3, gradePoints: 8 },
      ]);
      // (4*9 + 3*8) / 7 = 60 / 7 = 8.57
      expect(result.sgpa).toBeCloseTo(8.57, 1);
      expect(result.totalCredits).toBe(7);
    });
  });

  // ==========================================
  // 8. 🏦 Banking Engine Tests
  // ==========================================
  describe('Banking Engine', () => {
    it('calculates FD maturity with quarterly compounding', () => {
      const result = calculateFD({
        depositAmount: 100000,
        annualRate: 7.0,
        years: 3,
        compounding: 'quarterly',
      });
      expect(result.totalDeposited).toBe(100000);
      expect(result.maturityAmount).toBeGreaterThan(120000);
      expect(result.interestEarned).toBe(result.maturityAmount - 100000);
    });

    it('calculates RD maturity', () => {
      const result = calculateRD({
        monthlyDeposit: 5000,
        annualRate: 7.0,
        months: 24,
      });
      expect(result.totalDeposited).toBe(120000);
      expect(result.maturityAmount).toBeGreaterThan(result.totalDeposited);
    });

    it('calculates statutory Gratuity payout correctly', () => {
      const result = calculateGratuity({
        lastDrawnBasicSalary: 50000,
        yearsOfService: 10,
      });
      // (15 * 50000 * 10) / 26 = 7500000 / 26 = ~288461.5
      expect(result.gratuityAmount).toBe(288462);
      expect(result.isEligible).toBe(true);
    });
  });

  // ==========================================
  // 9. 📅 Date & Time Engine Tests
  // ==========================================
  describe('Date & Time Engine', () => {
    it('calculates chronological age between two dates', () => {
      const birth = new Date('2000-01-15');
      const target = new Date('2025-01-15');
      const age = calculateExactAge(birth, target);
      expect(age.years).toBe(25);
      expect(age.months).toBe(0);
      expect(age.days).toBe(0);
    });

    it('calculates duration difference between dates', () => {
      const d1 = new Date('2024-01-01');
      const d2 = new Date('2024-01-31');
      const diff = calculateDateDifference(d1, d2);
      expect(diff.totalDays).toBe(30);
    });

    it('calculates working business days excluding weekends', () => {
      // Monday to Friday = 5 working days
      const monday = new Date('2024-06-03');
      const sunday = new Date('2024-06-09');
      const result = calculateWorkingDays(monday, sunday);
      expect(result.businessWorkingDays).toBe(5);
      expect(result.weekendDays).toBe(2);
    });
  });
});
