# Decimal Precision Feature Guide

## Overview
SmartCalc includes a **Decimal Precision** setting that allows users to control how many decimal places are displayed in calculation results.

## Location
**Settings > Calculator Preferences > Decimal Precision**

Users can select from:
- **2 Decimals** (Default) - e.g., ₹1,234.56
- **3 Decimals** - e.g., ₹1,234.567
- **4 Decimals** - e.g., ₹1,234.5678

## Storage
The setting is stored in AsyncStorage:
```typescript
Key: 'calc_decimal_precision'
Default Value: 2
Possible Values: 2, 3, 4
```

## How to Use in Calculators

### Step 1: Import Storage Hook
```typescript
import { useAppStorage } from '@dailyapps/storage';
```

### Step 2: Load Precision Setting
```typescript
const storage = useAppStorage();
const [precision, setPrecision] = useState<number>(2);

useEffect(() => {
  storage.getJson<number>('calc_decimal_precision', 2).then(setPrecision);
}, [storage]);
```

### Step 3: Apply to Number Formatting
```typescript
// For currency
const formattedAmount = amount.toFixed(precision);

// For display with toLocaleString
const displayAmount = parseFloat(amount.toFixed(precision)).toLocaleString('en-IN', {
  minimumFractionDigits: precision,
  maximumFractionDigits: precision,
});

// For percentages
const formattedPercentage = `${percentage.toFixed(precision)}%`;
```

## Example Implementation

### EMI Calculator
```typescript
const EMICalculatorScreen = () => {
  const storage = useAppStorage();
  const [precision, setPrecision] = useState(2);
  
  useEffect(() => {
    storage.getJson<number>('calc_decimal_precision', 2).then(setPrecision);
  }, [storage]);
  
  const monthlyEMI = calculateEMI(principal, rate, tenure);
  const displayEMI = `₹${monthlyEMI.toLocaleString('en-IN', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })}`;
  
  return (
    <ResultHeroCard
      title="Monthly EMI"
      value={displayEMI}
    />
  );
};
```

### SIP Calculator
```typescript
const futureValue = calculateSIPFutureValue(monthly, years, returns);
const displayValue = `₹${parseFloat(futureValue.toFixed(precision)).toLocaleString('en-IN')}`;
```

### GST Calculator
```typescript
const gstAmount = (baseAmount * gstRate) / 100;
const totalAmount = baseAmount + gstAmount;

const displayGST = `₹${gstAmount.toFixed(precision)}`;
const displayTotal = `₹${totalAmount.toFixed(precision)}`;
```

## Best Practices

### ✅ DO
- Use precision for **final display values**
- Apply to currency amounts, percentages, and tax calculations
- Keep internal calculations at full precision
- Round only at display time

### ❌ DON'T
- Don't round intermediate calculation values
- Don't apply precision to counts (loans, years, months)
- Don't use precision for percentages > 100% (like 150%)

## Current Implementation Status

### ✅ Fully Implemented
- Settings UI in MoreScreen
- Storage persistence
- User selection (2, 3, 4 decimals)

### 🔄 Needs Implementation
Most calculator screens need to:
1. Load precision setting from storage
2. Apply to result displays
3. Apply to breakdown values
4. Apply to chart tooltips (where applicable)

### Priority Calculators for Precision
1. **EMI Calculator** - Monthly EMI, interest, principal
2. **SIP Calculator** - Future value, returns, wealth created
3. **GST Calculator** - GST amount, total with GST
4. **Stock P&L** - Profit/loss, brokerage, taxes
5. **Tax Calculator** - Net salary, tax amount, take-home
6. **Banking** - Interest earned, maturity amount
7. **Fuel Cost** - Cost per km, monthly fuel expense

## Testing
To test precision:
1. Go to Settings > Calculator Preferences
2. Change precision to 4 decimals
3. Open any financial calculator
4. Verify results show 4 decimal places
5. Change back to 2 decimals
6. Verify results update to 2 decimal places

## Future Enhancements
- **Currency format option** (₹ vs $ vs €)
- **Thousands separator** (1,000 vs 1.000 vs 1 000)
- **Rounding mode** (round vs floor vs ceil)
- **Per-calculator precision** override
