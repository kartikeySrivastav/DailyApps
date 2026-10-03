import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { ScreenContainer, Card } from '@dailyapps/ui';
import {
  CalculatorHeader,
  ResultHeroCard,
  CalcInputField,
  PresetPills,
  BreakdownRow,
  SegmentedTabs,
  FormulaTabs,
  TaxBreakdownCard,
  TradingProfitChart,
  CalculationHistoryModal,
} from '../components';
import { useTheme } from '@dailyapps/theme';
import { useAnalytics } from '@dailyapps/analytics';
import { useCalculationHistory } from '../hooks';
import {
  calculateStockTrade,
  calculateStockAverage,
  calculateTargetPrice,
  calculateStopLossAndSizing,
  calculateRiskReward,
  MarketType,
} from '../calculations/trading';

interface StockProfitCalculatorScreenProps {
  navigation: any;
  route?: any;
}

type TradingMode = 'pnl' | 'average' | 'target' | 'sl_sizing' | 'risk_reward';

export const StockProfitCalculatorScreen: React.FC<StockProfitCalculatorScreenProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const analytics = useAnalytics();

  const tool = route?.params?.tool;
  const initialMode: TradingMode = (() => {
    const id = tool?.id || '';
    if (id.includes('avg') || id.includes('average')) return 'average';
    if (id.includes('target') || id.includes('break_even')) return 'target';
    if (id.includes('stop_loss') || id.includes('position_size')) return 'sl_sizing';
    if (id.includes('risk_reward')) return 'risk_reward';
    return 'pnl';
  })();

  const [mode, setMode] = useState<TradingMode>(initialMode);

  // 1. P&L States
  const isIntradayTool = tool?.id === 'intraday_pnl';
  const isBrokerageTool = tool?.id === 'brokerage' || tool?.id === 'trading_charges';
  const [market, setMarket] = useState<MarketType>('india');
  const [tradeType, setTradeType] = useState<'delivery' | 'intraday'>(isIntradayTool ? 'intraday' : 'delivery');
  const [buyPrice, setBuyPrice] = useState('500');
  const [sellPrice, setSellPrice] = useState('550');
  const [quantity, setQuantity] = useState('100');
  const [showAdvanced, setShowAdvanced] = useState(isBrokerageTool);
  const [brokerageFlat, setBrokerageFlat] = useState('20');

  // 2. Average States (DCA - Dynamic Lots)
  interface BuyLot {
    id: string;
    price: string;
    quantity: string;
  }
  const DEFAULT_BUY_LOTS: BuyLot[] = [
    { id: 'lot_1', price: '500', quantity: '100' },
    { id: 'lot_2', price: '450', quantity: '150' },
  ];
  const [buyLots, setBuyLots] = useState<BuyLot[]>(DEFAULT_BUY_LOTS);

  const addBuyLot = () => {
    setBuyLots((prev) => [
      ...prev,
      {
        id: `lot_${Date.now()}`,
        price: '',
        quantity: '',
      },
    ]);
  };

  const removeBuyLot = (id: string) => {
    if (buyLots.length <= 1) return;
    setBuyLots((prev) => prev.filter((l) => l.id !== id));
  };

  const updateBuyLot = (id: string, field: 'price' | 'quantity', val: string) => {
    setBuyLots((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: val } : l))
    );
  };

  // 3. Target & Break-Even States
  const [targetBuyPrice, setTargetBuyPrice] = useState('500');
  const [targetQty, setTargetQty] = useState('100');
  const [targetProfitPct, setTargetProfitPct] = useState('10');
  const [targetTradeType, setTargetTradeType] = useState<'delivery' | 'intraday'>('delivery');

  // 4. Stop-Loss & Position Sizing States
  const [slCapital, setSlCapital] = useState('100000');
  const [slRiskPct, setSlRiskPct] = useState('1');
  const [slEntryPrice, setSlEntryPrice] = useState('500');
  const [slPrice, setSlPrice] = useState('480');

  // 5. Risk-Reward States
  const [rrEntry, setRrEntry] = useState('500');
  const [rrStopLoss, setRrStopLoss] = useState('480');
  const [rrTarget, setRrTarget] = useState('550');
  const [rrQty, setRrQty] = useState('100');

  // History modal
  const [showHistory, setShowHistory] = useState(false);
  const { history, saveCalculation, clearHistory, deleteItem } = useCalculationHistory(
    mode,
    '📊 Trading'
  );

  useEffect(() => {
    analytics.logScreenView('StockProfitCalculatorScreen');
  }, [analytics]);

  useEffect(() => {
    if (tool?.id) {
      if (tool.id.includes('avg') || tool.id.includes('average')) {
        setMode('average');
      } else if (tool.id.includes('target') || tool.id.includes('break_even')) {
        setMode('target');
      } else if (tool.id.includes('stop_loss') || tool.id.includes('position_size')) {
        setMode('sl_sizing');
      } else if (tool.id.includes('risk_reward')) {
        setMode('risk_reward');
      }
    }
  }, [tool?.id]);

  // Calculations
  const bPrice = parseFloat(buyPrice) || 0;
  const sPrice = parseFloat(sellPrice) || 0;
  const qty = parseFloat(quantity) || 0;
  const bFlat = parseFloat(brokerageFlat) || 0;

  const pnlResult = calculateStockTrade({
    market,
    buyPrice: bPrice,
    sellPrice: sPrice,
    quantity: qty,
    tradeType,
    brokerageType: 'flat',
    brokerageValue: bFlat,
  });

  const avgResult = calculateStockAverage(
    buyLots.map((l) => ({
      price: parseFloat(l.price) || 0,
      quantity: parseFloat(l.quantity) || 0,
    }))
  );

  const targetResult = calculateTargetPrice(
    parseFloat(targetBuyPrice) || 0,
    parseFloat(targetQty) || 0,
    parseFloat(targetProfitPct) || 0,
    targetTradeType
  );

  const slResult = calculateStopLossAndSizing(
    parseFloat(slCapital) || 0,
    parseFloat(slRiskPct) || 0,
    parseFloat(slEntryPrice) || 0,
    parseFloat(slPrice) || 0
  );

  const rrResult = calculateRiskReward(
    parseFloat(rrEntry) || 0,
    parseFloat(rrStopLoss) || 0,
    parseFloat(rrTarget) || 0,
    parseFloat(rrQty) || 0
  );

  const handleReset = () => {
    if (mode === 'pnl') {
      if (market === 'india') {
        setBuyPrice('500');
        setSellPrice('550');
        setBrokerageFlat('20');
      } else {
        setBuyPrice('150');
        setSellPrice('165');
        setBrokerageFlat('0');
      }
      setQuantity('100');
    } else if (mode === 'average') {
      setBuyLots(DEFAULT_BUY_LOTS);
    } else if (mode === 'target') {
      setTargetBuyPrice('500');
      setTargetQty('100');
      setTargetProfitPct('10');
      setTargetTradeType('delivery');
    } else if (mode === 'sl_sizing') {
      setSlCapital('100000');
      setSlRiskPct('1');
      setSlEntryPrice('500');
      setSlPrice('480');
    } else if (mode === 'risk_reward') {
      setRrEntry('500');
      setRrStopLoss('480');
      setRrTarget('550');
      setRrQty('100');
    }
  };

  const handleMarketChange = (m: MarketType) => {
    setMarket(m);
    if (m === 'india') {
      setBuyPrice('500');
      setSellPrice('550');
      setBrokerageFlat('20');
    } else {
      setBuyPrice('150');
      setSellPrice('165');
      setBrokerageFlat('0');
    }
  };

  const isProfit = pnlResult.netProfit >= 0;
  const sym = pnlResult.currencySymbol;

  // Auto-record calculations into history
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mode === 'pnl' && bPrice > 0 && sPrice > 0 && qty > 0) {
        saveCalculation({
          toolId: 'stock_pnl',
          toolName: 'Stock Profit & Loss',
          category: '📊 Trading',
          title: `${tradeType.toUpperCase()}: Buy ${sym}${bPrice} → Sell ${sym}${sPrice}`,
          subtitle: `Qty: ${qty} shares | Turnover: ${sym}${pnlResult.turnover.toLocaleString()}`,
          result: `${pnlResult.netProfit >= 0 ? '+' : ''}${sym}${pnlResult.netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${pnlResult.roiPercentage >= 0 ? '+' : ''}${pnlResult.roiPercentage.toFixed(2)}%)`,
          secondaryResult: `Charges: ${sym}${pnlResult.charges.totalCharges.toFixed(2)} | Break-even: ${sym}${pnlResult.breakEvenPrice.toFixed(2)}`,
          badge: pnlResult.netProfit >= 0 ? 'PROFIT' : 'LOSS',
          inputs: { market, tradeType, buyPrice, sellPrice, quantity, brokerageFlat },
        });
      } else if (mode === 'average' && avgResult.totalQuantity > 0) {
        saveCalculation({
          toolId: 'stock_average',
          toolName: 'Stock Average Price',
          category: '📊 Trading',
          title: `Avg Cost: ₹${avgResult.averagePrice} (${avgResult.totalQuantity} Qty)`,
          subtitle: `Total Capital: ₹${avgResult.totalInvestment.toLocaleString('en-IN')}`,
          result: `₹${avgResult.averagePrice}`,
          secondaryResult: `${avgResult.totalQuantity} Shares @ ₹${avgResult.totalInvestment.toLocaleString('en-IN')}`,
          badge: 'AVERAGE',
          inputs: { buyLots },
        });
      } else if (mode === 'target' && targetResult.targetPrice > 0) {
        saveCalculation({
          toolId: 'target_price',
          toolName: 'Target & Break-Even',
          category: '📊 Trading',
          title: `Target: ₹${targetResult.targetPrice} (+${targetProfitPct}%)`,
          subtitle: `Break-even Exit: ₹${targetResult.breakEvenPrice}`,
          result: `₹${targetResult.targetPrice}`,
          secondaryResult: `Net Profit: +₹${targetResult.targetNetProfit.toLocaleString('en-IN')}`,
          badge: 'TARGET',
          inputs: { targetBuyPrice, targetQty, targetProfitPct, targetTradeType },
        });
      } else if (mode === 'sl_sizing' && slResult.recommendedQuantity > 0) {
        saveCalculation({
          toolId: 'position_size',
          toolName: 'Stop-Loss Sizing',
          category: '📊 Trading',
          title: `Size: ${slResult.recommendedQuantity} Qty (${slRiskPct}% Risk)`,
          subtitle: `Max Loss: ₹${slResult.actualRiskAmount} | Trade Capital: ₹${slResult.totalTradeCapital.toLocaleString('en-IN')}`,
          result: `${slResult.recommendedQuantity} Shares`,
          secondaryResult: `Risk: -₹${slResult.actualRiskAmount}`,
          badge: 'SIZING',
          inputs: { slCapital, slRiskPct, slEntryPrice, slPrice },
        });
      } else if (mode === 'risk_reward' && rrResult.ratio > 0) {
        saveCalculation({
          toolId: 'risk_reward',
          toolName: 'Risk-to-Reward',
          category: '📊 Trading',
          title: `R:R = ${rrResult.ratioFormatted} (${rrResult.verdict})`,
          subtitle: `Risk: ₹${rrResult.totalRisk} | Reward: ₹${rrResult.totalReward}`,
          result: rrResult.ratioFormatted,
          secondaryResult: `Risk ₹${rrResult.totalRisk} vs Reward ₹${rrResult.totalReward}`,
          badge: 'R:R',
          inputs: { rrEntry, rrStopLoss, rrTarget, rrQty },
        });
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [
    mode,
    bPrice,
    sPrice,
    qty,
    tradeType,
    market,
    brokerageFlat,
    avgResult.totalQuantity,
    avgResult.averagePrice,
    avgResult.totalInvestment,
    targetResult.targetPrice,
    targetResult.breakEvenPrice,
    targetResult.targetNetProfit,
    slResult.recommendedQuantity,
    slResult.actualRiskAmount,
    slResult.totalTradeCapital,
    rrResult.ratio,
    rrResult.ratioFormatted,
    rrResult.totalRisk,
    rrResult.totalReward,
  ]);

  const getHeaderInfo = () => {
    switch (mode) {
      case 'average':
        return {
          title: 'Stock Average Calculator',
          subtitle: 'Average down or up multiple buy tranches',
          icon: '📉',
        };
      case 'target':
        return {
          title: 'Target & Break-Even',
          subtitle: 'Required sell price to cover taxes & profit',
          icon: '🎯',
        };
      case 'sl_sizing':
        return {
          title: 'Stop-Loss & Sizing',
          subtitle: '1% portfolio risk rule & share quantity',
          icon: '🛡️',
        };
      case 'risk_reward':
        return {
          title: 'Risk-to-Reward Ratio',
          subtitle: 'Trade setup quality & payoff ratio',
          icon: '⚖️',
        };
      default:
        return {
          title: tool?.name || 'Stock Profit & Loss',
          subtitle: market === 'india' ? 'NSE & BSE equity P&L' : 'US & global stocks P&L',
          icon: tool?.icon || '📊',
        };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <ScreenContainer safeArea withPadding={false}>
      <CalculatorHeader
        title={headerInfo.title}
        subtitle={headerInfo.subtitle}
        icon={headerInfo.icon}
        category="📊 Trading"
        toolId={tool?.id || mode}
        onBack={() => navigation.goBack()}
        onHistory={() => setShowHistory(true)}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Navigation Tabs for Trading Calculators */}
        <SegmentedTabs
          tabs={[
            { key: 'pnl', label: 'Trade P&L', icon: '📊' },
            { key: 'average', label: 'Stock Average', icon: '📉' },
            { key: 'target', label: 'Target / Exit', icon: '🎯' },
            { key: 'sl_sizing', label: 'SL & Sizing', icon: '🛡️' },
            { key: 'risk_reward', label: 'Risk-Reward', icon: '⚖️' },
          ]}
          activeTab={mode}
          onTabChange={(k) => setMode(k as TradingMode)}
          scrollable
        />

        {/* ========================================================================= */}
        {/* 1. TRADE P&L MODE */}
        {/* ========================================================================= */}
        {mode === 'pnl' && (
          <>
            {/* Market Selector Tabs */}
            <SegmentedTabs
              activeTab={market}
              onTabChange={(key) => handleMarketChange(key as MarketType)}
              tabs={[
                { key: 'india', label: 'India (NSE/BSE)', icon: '🇮🇳' },
                { key: 'us_global', label: 'US & Global ($)', icon: '🇺🇸' },
              ]}
            />

            {/* Trade Type Tabs for India */}
            {market === 'india' && (
              <SegmentedTabs
                activeTab={tradeType}
                onTabChange={(key) => setTradeType(key as 'delivery' | 'intraday')}
                tabs={[
                  { key: 'delivery', label: 'Delivery (CNC)', icon: '📦' },
                  { key: 'intraday', label: 'Intraday (MIS)', icon: '⚡' },
                ]}
              />
            )}

            {/* Trade Inputs Card */}
            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Trade Inputs</Text>

              <View style={styles.rowInputs}>
                <View style={styles.flex1}>
                  <CalcInputField
                    label="Buy Price"
                    prefix={sym}
                    keyboardType="numeric"
                    value={buyPrice}
                    onChangeText={setBuyPrice}
                    placeholder="500"
                  />
                </View>

                <View style={styles.flex1}>
                  <CalcInputField
                    label="Sell Price"
                    prefix={sym}
                    keyboardType="numeric"
                    value={sellPrice}
                    onChangeText={setSellPrice}
                    placeholder="550"
                  />
                </View>
              </View>

              <CalcInputField
                label="Quantity / Shares"
                suffix="Qty"
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
                placeholder="100"
              />

              {/* Advanced Charges Toggle Card */}
              <View
                style={[
                  styles.advancedContainer,
                  {
                    backgroundColor: theme.isDark ? 'rgba(30, 41, 59, 0.4)' : '#F8FAFC',
                    borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0',
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => setShowAdvanced(!showAdvanced)}
                  activeOpacity={0.7}
                  style={styles.advancedHeader}
                >
                  <View style={styles.advancedHeaderLeft}>
                    <View
                      style={[
                        styles.gearIconBox,
                        {
                          backgroundColor: theme.isDark
                            ? 'rgba(59, 130, 246, 0.15)'
                            : 'rgba(37, 99, 235, 0.1)',
                          borderColor: theme.isDark
                            ? 'rgba(59, 130, 246, 0.3)'
                            : 'rgba(37, 99, 235, 0.2)',
                        },
                      ]}
                    >
                      <Text style={styles.gearIcon}>⚙️</Text>
                    </View>
                    <View>
                      <Text style={[styles.advancedTitle, { color: theme.colors.text }]}>
                        Brokerage & Charges
                      </Text>
                      <Text style={[styles.advancedSubtitle, { color: theme.colors.textMuted }]}>
                        {market === 'india' ? '₹20/order default' : 'Zero commission'}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.togglePill,
                      {
                        backgroundColor: showAdvanced
                          ? theme.isDark
                            ? 'rgba(59, 130, 246, 0.2)'
                            : 'rgba(37, 99, 235, 0.1)'
                          : theme.colors.surfaceSubtle,
                        borderColor: showAdvanced
                          ? theme.colors.primary
                          : theme.colors.borderSubtle,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.togglePillText,
                        {
                          color: showAdvanced
                            ? theme.isDark
                              ? '#93C5FD'
                              : '#1D4ED8'
                            : theme.isDark
                            ? '#CBD5E1'
                            : '#334155',
                          fontWeight: showAdvanced ? '800' : '700',
                        },
                      ]}
                    >
                      {showAdvanced ? '✕ Close' : '⚙️ Charges'}
                    </Text>
                  </View>
                </TouchableOpacity>

                {showAdvanced && (
                  <View
                    style={[
                      styles.advancedBox,
                      {
                        borderTopColor: theme.isDark
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(0, 0, 0, 0.06)',
                      },
                    ]}
                  >
                    <CalcInputField
                      label={market === 'india' ? 'Brokerage per executed order (₹)' : 'Commission per trade ($)'}
                      prefix={sym}
                      keyboardType="numeric"
                      value={brokerageFlat}
                      onChangeText={setBrokerageFlat}
                      placeholder={market === 'india' ? '20' : '0'}
                    />
                  </View>
                )}
              </View>

              {/* Bottom Reset Button */}
              <TouchableOpacity
                onPress={handleReset}
                activeOpacity={0.7}
                style={[styles.bottomResetBtn, { borderColor: theme.colors.borderSubtle, backgroundColor: theme.colors.surfaceSubtle }]}
              >
                <Text style={[styles.bottomResetText, { color: theme.colors.textMuted }]}>↺ Reset Inputs</Text>
              </TouchableOpacity>
            </Card>

            {/* Hero Result Card */}
            <ResultHeroCard
              title={isProfit ? 'Net Realized Profit' : 'Net Realized Loss'}
              value={`${isProfit ? '+' : ''}${sym}${Math.abs(pnlResult.netProfit).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              subText={`ROI / Return: ${pnlResult.roiPercentage >= 0 ? '+' : ''}${pnlResult.roiPercentage}% on investment`}
              variant={isProfit ? 'success' : 'danger'}
              badgeText={`Total Taxes & Charges: ${sym}${pnlResult.charges.totalCharges.toFixed(2)}`}
              badgeType={isProfit ? 'success' : 'danger'}
              secondaryStats={[
                { label: 'Buy Value', value: `${sym}${pnlResult.buyTotal.toLocaleString('en-IN')}` },
                { label: 'Sell Value', value: `${sym}${pnlResult.sellTotal.toLocaleString('en-IN')}` },
                { label: 'Break-Even', value: `${sym}${pnlResult.breakEvenPrice.toFixed(2)}` },
              ]}
            />

            {/* Trading Profit Visual Chart */}
            <TradingProfitChart
              buyPrice={bPrice}
              sellPrice={sPrice}
              quantity={qty}
              breakEvenPrice={pnlResult.breakEvenPrice}
              currencySymbol={sym}
              totalCharges={pnlResult.charges.totalCharges}
              netProfit={pnlResult.netProfit}
            />

            {/* Charges Breakdown Card */}
            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Charges & Tax Breakdown</Text>
              <BreakdownRow
                label="Brokerage (Buy + Sell)"
                value={`-${sym}${pnlResult.charges.brokerage.toFixed(2)}`}
                showDivider
              />
              {market === 'india' && (
                <>
                  <BreakdownRow
                    label={`STT / CTT (${tradeType === 'delivery' ? '0.1%' : '0.025%'})`}
                    value={`-${sym}${pnlResult.charges.stt.toFixed(2)}`}
                    showDivider
                  />
                  <BreakdownRow
                    label="Exchange Txn Fee (NSE 0.00307%)"
                    value={`-${sym}${pnlResult.charges.exchangeTxnFee.toFixed(2)}`}
                    showDivider
                  />
                  <BreakdownRow
                    label="SEBI Turnover Fee"
                    value={`-${sym}${pnlResult.charges.sebiCharges.toFixed(2)}`}
                    showDivider
                  />
                  <BreakdownRow
                    label="Stamp Duty + GST (18%)"
                    value={`-${sym}${(pnlResult.charges.stampDuty + pnlResult.charges.gst).toFixed(2)}`}
                    showDivider
                  />
                </>
              )}
              <BreakdownRow
                label="Total Regulatory Charges"
                value={`-${sym}${pnlResult.charges.totalCharges.toFixed(2)}`}
                isBold
                valueColor="#F59E0B"
                showDivider
              />
              <BreakdownRow
                label="Net In-Hand P&L"
                value={`${isProfit ? '+' : ''}${sym}${pnlResult.netProfit.toFixed(2)}`}
                isBold
                isHighlight
                valueColor={isProfit ? '#10B981' : '#EF4444'}
              />
            </Card>

            {/* Tax Breakdown for Indian Market */}
            {market === 'india' && isProfit && (
              <TaxBreakdownCard
                profit={pnlResult.netProfit}
                holdingPeriod={tradeType === 'delivery' ? 'long' : 'short'}
                assetType={tradeType === 'intraday' ? 'intraday' : 'equity'}
                showDetails={true}
              />
            )}

            <FormulaTabs
              formula="Net P&L = Gross P&L – (Brokerage + STT + Turnover + GST + Stamp Duty)"
              howItWorks={[
                '1. Gross P&L = (Selling Price – Buying Price) × Quantity.',
                '2. Exchange Turnover fees, SEBI charges, STT, and 18% GST on brokerage are calculated.',
                '3. In-Hand Net Profit/Loss is credited after all mandatory regulatory deductions.',
              ]}
              example={{
                input: `Buy 100 shares @ ${sym}500 | Sell @ ${sym}560`,
                calculation: `Gross Profit: +${sym}6,000 | Taxes & Charges: -${sym}1,050`,
                output: `Net P&L: +${sym}4,950 (ROI: +9.90%)`,
              }}
            />
          </>
        )}

        {/* ========================================================================= */}
        {/* 2. STOCK AVERAGE / DCA MODE */}
        {/* ========================================================================= */}
        {mode === 'average' && (
          <>
            <ResultHeroCard
              title="Blended Average Buy Price"
              value={`₹${avgResult.averagePrice.toLocaleString('en-IN')}`}
              subText={`Across ${avgResult.totalQuantity} accumulated shares`}
              badgeText={`Total Invested: ₹${avgResult.totalInvestment.toLocaleString('en-IN')}`}
              badgeType="info"
              secondaryStats={[
                { label: 'Total Shares', value: `${avgResult.totalQuantity}` },
                { label: 'Total Capital', value: `₹${avgResult.totalInvestment.toLocaleString('en-IN')}` },
                { label: 'Tranches', value: `${buyLots.length} Buys` },
              ]}
            />

            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, gap: 12 }}>
                <Text style={[styles.cardTitle, { color: theme.colors.text, marginBottom: 0, flex: 1 }]} numberOfLines={1}>
                  Purchase Lots (Tranches)
                </Text>
                <TouchableOpacity
                  onPress={addBuyLot}
                  style={{
                    borderWidth: 1,
                    borderColor: theme.colors.primary,
                    backgroundColor: theme.isDark ? 'rgba(59, 130, 246, 0.12)' : 'rgba(59, 130, 246, 0.08)',
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '700', color: theme.colors.primary }}>
                    ＋ Add Lot
                  </Text>
                </TouchableOpacity>
              </View>

              {buyLots.map((lot, idx) => {
                const lotCost = (parseFloat(lot.price) || 0) * (parseFloat(lot.quantity) || 0);
                return (
                  <View key={lot.id} style={{ marginBottom: 14 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: theme.colors.text }}>
                        {idx + 1}. Purchase Lot {lotCost > 0 ? `(₹${lotCost.toLocaleString('en-IN')})` : ''}
                      </Text>
                      {buyLots.length > 1 && (
                        <TouchableOpacity
                          onPress={() => removeBuyLot(lot.id)}
                          style={{ paddingHorizontal: 6, paddingVertical: 2 }}
                        >
                          <Text style={{ fontSize: 12, fontWeight: '700', color: '#EF4444' }}>✕ Remove</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    <View style={styles.rowInputs}>
                      <View style={styles.flex1}>
                        <CalcInputField
                          label="Buy Price"
                          prefix="₹"
                          value={lot.price}
                          onChangeText={(val) => updateBuyLot(lot.id, 'price', val)}
                          keyboardType="numeric"
                          placeholder="e.g. 500"
                        />
                      </View>
                      <View style={styles.flex1}>
                        <CalcInputField
                          label="Quantity"
                          suffix="Shares"
                          value={lot.quantity}
                          onChangeText={(val) => updateBuyLot(lot.id, 'quantity', val)}
                          keyboardType="numeric"
                          placeholder="e.g. 100"
                        />
                      </View>
                    </View>
                  </View>
                );
              })}

              <TouchableOpacity
                onPress={handleReset}
                activeOpacity={0.7}
                style={[styles.bottomResetBtn, { borderColor: theme.colors.borderSubtle, backgroundColor: theme.colors.surfaceSubtle }]}
              >
                <Text style={[styles.bottomResetText, { color: theme.colors.textMuted }]}>↺ Reset Inputs</Text>
              </TouchableOpacity>
            </Card>

            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Averaging Summary</Text>
              {buyLots.map((lot, idx) => {
                const cost = (parseFloat(lot.price) || 0) * (parseFloat(lot.quantity) || 0);
                return (
                  <BreakdownRow
                    key={lot.id}
                    label={`Lot ${idx + 1} (${lot.quantity || 0} @ ₹${lot.price || 0})`}
                    value={`₹${cost.toLocaleString('en-IN')}`}
                    showDivider
                  />
                );
              })}
              <BreakdownRow
                label="Total Portfolio Shares"
                value={`${avgResult.totalQuantity} Qty`}
                showDivider
              />
              <BreakdownRow
                label="Revised Average Cost"
                value={`₹${avgResult.averagePrice} / share`}
                isBold
                isHighlight
                valueColor={theme.colors.primary}
              />
            </Card>

            <FormulaTabs
              formula="Average Price = (Total Capital Invested) / (Total Shares Bought)"
              howItWorks={[
                '1. Weighted average calculates the true cost basis across multiple order tranches.',
                '2. Buying lower reduces your breakeven price and enables faster profit realization.',
                '3. Always ensure sound fundamentals before averaging down on losing trades.',
              ]}
              example={{
                input: '100 shares @ ₹500 + 150 shares @ ₹450',
                calculation: '(₹50,000 + ₹67,500) / 250 shares',
                output: 'Average Price: ₹470.00 / share',
              }}
            />
          </>
        )}

        {/* ========================================================================= */}
        {/* 3. TARGET & BREAK-EVEN MODE */}
        {/* ========================================================================= */}
        {mode === 'target' && (
          <>
            <ResultHeroCard
              title="Required Target Exit Price"
              value={`₹${targetResult.targetPrice.toLocaleString('en-IN')}`}
              subText={`To net +₹${targetResult.targetNetProfit.toLocaleString('en-IN')} (+${targetProfitPct}%) in hand`}
              badgeText={`Break-Even Zero-Loss Sell: ₹${targetResult.breakEvenPrice}`}
              badgeType="success"
              secondaryStats={[
                { label: 'Break-Even', value: `₹${targetResult.breakEvenPrice}` },
                { label: 'Net Profit', value: `+₹${targetResult.targetNetProfit.toLocaleString('en-IN')}`, color: '#10B981' },
                { label: 'Charges Covered', value: `₹${targetResult.totalCharges.toFixed(2)}` },
              ]}
            />

            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Target Inputs</Text>

              <SegmentedTabs
                activeTab={targetTradeType}
                onTabChange={(k) => setTargetTradeType(k as 'delivery' | 'intraday')}
                tabs={[
                  { key: 'delivery', label: 'Delivery (CNC)', icon: '📦' },
                  { key: 'intraday', label: 'Intraday (MIS)', icon: '⚡' },
                ]}
              />

              <View style={styles.rowInputs}>
                <View style={styles.flex1}>
                  <CalcInputField
                    label="Buy Price"
                    prefix="₹"
                    value={targetBuyPrice}
                    onChangeText={setTargetBuyPrice}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.flex1}>
                  <CalcInputField
                    label="Quantity"
                    suffix="Qty"
                    value={targetQty}
                    onChangeText={setTargetQty}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <CalcInputField
                label="Desired Profit Target (%)"
                suffix="%"
                value={targetProfitPct}
                onChangeText={setTargetProfitPct}
                keyboardType="numeric"
                helperText="Desired percentage gain over total buy capital"
              />
              <PresetPills
                options={[{ label: '5%', value: '5' }, { label: '10%', value: '10' }, { label: '15%', value: '15' }, { label: '20%', value: '20' }, { label: '25%', value: '25' }]}
                selectedValue={targetProfitPct}
                onSelect={(val) => setTargetProfitPct(String(val))}
              />

              <TouchableOpacity
                onPress={handleReset}
                activeOpacity={0.7}
                style={[styles.bottomResetBtn, { borderColor: theme.colors.borderSubtle, backgroundColor: theme.colors.surfaceSubtle }]}
              >
                <Text style={[styles.bottomResetText, { color: theme.colors.textMuted }]}>↺ Reset Inputs</Text>
              </TouchableOpacity>
            </Card>

            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Exit Analysis</Text>
              <BreakdownRow
                label="Total Capital Invested"
                value={`₹${((parseFloat(targetBuyPrice) || 0) * (parseFloat(targetQty) || 0)).toLocaleString('en-IN')}`}
                showDivider
              />
              <BreakdownRow
                label="Break-Even Exit (0 Profit/Loss)"
                value={`₹${targetResult.breakEvenPrice} / share`}
                valueColor="#F59E0B"
                showDivider
              />
              <BreakdownRow
                label="Taxes & Brokerage Covered"
                value={`₹${targetResult.totalCharges.toFixed(2)}`}
                showDivider
              />
              <BreakdownRow
                label="Target Selling Price"
                value={`₹${targetResult.targetPrice} / share`}
                isBold
                isHighlight
                valueColor="#10B981"
              />
            </Card>

            <FormulaTabs
              formula="Target Sell Price = (Buy Capital + Desired Profit + Roundtrip Taxes) / Quantity"
              howItWorks={[
                '1. Break-even price accounts for brokerage, STT, turnover charges, and GST.',
                '2. Exiting below the break-even price produces a net loss even if gross profit is positive.',
                '3. Set limit target orders based on technical resistance and buffer fees.',
              ]}
              example={{
                input: 'Buy 100 shares @ ₹500 for +10% target',
                calculation: 'Target Profit: ₹5,000 | Taxes: ~₹150 | Sell Total: ₹55,150',
                output: 'Target Sell Price: ₹551.50 / share',
              }}
            />
          </>
        )}

        {/* ========================================================================= */}
        {/* 4. STOP-LOSS & POSITION SIZING MODE */}
        {/* ========================================================================= */}
        {mode === 'sl_sizing' && (
          <>
            <ResultHeroCard
              title="Recommended Position Size"
              value={`${slResult.recommendedQuantity} Shares`}
              subText={`Max risk: ₹${slResult.actualRiskAmount} (${slRiskPct}% of ₹${(parseFloat(slCapital) || 0).toLocaleString('en-IN')})`}
              badgeText="1% Risk Rule Compliant"
              badgeType="success"
              secondaryStats={[
                { label: 'Trade Capital', value: `₹${slResult.totalTradeCapital.toLocaleString('en-IN')}` },
                { label: 'Max Risk', value: `-₹${slResult.actualRiskAmount}`, color: '#EF4444' },
                { label: 'SL Distance', value: `₹${slResult.riskPerShare} (${slResult.riskPercentPerShare.toFixed(1)}%)` },
              ]}
            />

            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Position Sizing Inputs</Text>

              <CalcInputField
                label="Total Trading Portfolio Capital"
                prefix="₹"
                value={slCapital}
                onChangeText={setSlCapital}
                keyboardType="numeric"
              />
              <PresetPills
                options={[{ label: '₹25K', value: '25000' }, { label: '₹50K', value: '50000' }, { label: '₹1L', value: '100000' }, { label: '₹2L', value: '200000' }, { label: '₹5L', value: '500000' }]}
                selectedValue={slCapital}
                onSelect={(val) => setSlCapital(String(val))}
              />

              <CalcInputField
                label="Max Risk per Trade (%)"
                suffix="%"
                value={slRiskPct}
                onChangeText={setSlRiskPct}
                keyboardType="numeric"
                helperText="Pro traders recommend 1% to 2% max portfolio risk"
              />
              <PresetPills
                options={[{ label: '0.5%', value: '0.5' }, { label: '1.0%', value: '1' }, { label: '1.5%', value: '1.5' }, { label: '2.0%', value: '2' }]}
                selectedValue={slRiskPct}
                onSelect={(val) => setSlRiskPct(String(val))}
              />

              <View style={styles.rowInputs}>
                <View style={styles.flex1}>
                  <CalcInputField
                    label="Entry Price"
                    prefix="₹"
                    value={slEntryPrice}
                    onChangeText={setSlEntryPrice}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.flex1}>
                  <CalcInputField
                    label="Stop-Loss Price"
                    prefix="₹"
                    value={slPrice}
                    onChangeText={setSlPrice}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={handleReset}
                activeOpacity={0.7}
                style={[styles.bottomResetBtn, { borderColor: theme.colors.borderSubtle, backgroundColor: theme.colors.surfaceSubtle }]}
              >
                <Text style={[styles.bottomResetText, { color: theme.colors.textMuted }]}>↺ Reset Inputs</Text>
              </TouchableOpacity>
            </Card>

            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Risk Management Metrics</Text>
              <BreakdownRow
                label="Stop Loss Distance"
                value={`₹${slResult.riskPerShare} / share`}
                valueColor="#EF4444"
                showDivider
              />
              <BreakdownRow
                label="Maximum Acceptable Loss"
                value={`-₹${slResult.actualRiskAmount}`}
                valueColor="#EF4444"
                showDivider
              />
              <BreakdownRow
                label="Required Trade Allocation"
                value={`₹${slResult.totalTradeCapital.toLocaleString('en-IN')} (${slResult.capitalAllocationPct.toFixed(1)}% of capital)`}
                showDivider
              />
              <BreakdownRow
                label="Max Quantity to Buy"
                value={`${slResult.recommendedQuantity} Shares`}
                isBold
                isHighlight
                valueColor={theme.colors.primary}
              />
            </Card>

            <FormulaTabs
              formula="Quantity = (Capital × Risk%) / (Entry Price – Stop Loss)"
              howItWorks={[
                '1. Position sizing protects against catastrophic account drawdowns.',
                '2. Never adjust your stop loss to fit a larger position size; adjust size to fit the stop loss.',
                '3. Strict 1% risk rule ensures you can survive 20+ consecutive losses without ruin.',
              ]}
              example={{
                input: '₹1,00,000 capital, 1% risk rule, Buy ₹500, SL ₹480',
                calculation: 'Max Risk: ₹1,000 | Risk/share: ₹20 | Qty: 1000 / 20',
                output: 'Buy exactly 50 shares (₹25,000 trade value)',
              }}
            />
          </>
        )}

        {/* ========================================================================= */}
        {/* 5. RISK-TO-REWARD RATIO MODE */}
        {/* ========================================================================= */}
        {mode === 'risk_reward' && (
          <>
            <ResultHeroCard
              title="Risk-to-Reward Ratio"
              value={rrResult.ratioFormatted}
              subText={`Target payoff vs downside protection`}
              badgeText={rrResult.verdict}
              badgeType={rrResult.isFavorable ? 'success' : 'warning'}
              secondaryStats={[
                { label: 'Risk / Share', value: `₹${rrResult.riskPerShare}`, color: '#EF4444' },
                { label: 'Reward / Share', value: `₹${rrResult.rewardPerShare}`, color: '#10B981' },
                { label: 'Ratio', value: `${rrResult.ratio.toFixed(2)}x` },
              ]}
            />

            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Trade Setup Price Levels</Text>

              <CalcInputField
                label="Target Sell Price"
                prefix="₹"
                value={rrTarget}
                onChangeText={setRrTarget}
                keyboardType="numeric"
                helperText="Technical resistance or profit exit level"
              />

              <CalcInputField
                label="Entry Buy Price"
                prefix="₹"
                value={rrEntry}
                onChangeText={setRrEntry}
                keyboardType="numeric"
              />

              <CalcInputField
                label="Stop-Loss Price"
                prefix="₹"
                value={rrStopLoss}
                onChangeText={setRrStopLoss}
                keyboardType="numeric"
                helperText="Technical support or invalidation point"
              />

              <CalcInputField
                label="Position Quantity (Shares)"
                suffix="Qty"
                value={rrQty}
                onChangeText={setRrQty}
                keyboardType="numeric"
              />

              <TouchableOpacity
                onPress={handleReset}
                activeOpacity={0.7}
                style={[styles.bottomResetBtn, { borderColor: theme.colors.borderSubtle, backgroundColor: theme.colors.surfaceSubtle }]}
              >
                <Text style={[styles.bottomResetText, { color: theme.colors.textMuted }]}>↺ Reset Inputs</Text>
              </TouchableOpacity>
            </Card>

            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Risk vs Reward Breakdown</Text>
              <BreakdownRow
                label="Total Potential Loss (SL hit)"
                value={`-₹${rrResult.totalRisk.toLocaleString('en-IN')}`}
                valueColor="#EF4444"
                showDivider
              />
              <BreakdownRow
                label="Total Potential Gain (Target hit)"
                value={`+₹${rrResult.totalReward.toLocaleString('en-IN')}`}
                valueColor="#10B981"
                showDivider
              />
              <BreakdownRow
                label="Trade Setup Verdict"
                value={rrResult.verdict}
                isBold
                isHighlight
                valueColor={rrResult.isFavorable ? '#10B981' : '#F59E0B'}
              />
            </Card>

            <FormulaTabs
              formula="R:R Ratio = (Target Price – Entry) / (Entry – Stop Loss)"
              howItWorks={[
                '1. A 1:2 ratio means risking ₹1 to make ₹2.',
                '2. With a 1:2 R:R, you only need a 35% win rate to be consistently profitable.',
                '3. Avoid trades with less than 1:1.5 ratio regardless of hype or rumors.',
              ]}
              example={{
                input: 'Buy ₹500 | Stop Loss ₹480 | Target ₹550',
                calculation: 'Risk: ₹20 | Reward: ₹50 | Ratio: 50 / 20',
                output: '1 : 2.50 Ratio (Favorable Setup)',
              }}
            />
          </>
        )}
      </ScrollView>

      <CalculationHistoryModal
        visible={showHistory}
        onClose={() => setShowHistory(false)}
        title="Trade History"
        subtitle="Past trades, setups & returns"
        records={history}
        onSelectRecord={(rec) => {
          if (rec.inputs) {
            if (rec.inputs.buyPrice) setBuyPrice(rec.inputs.buyPrice);
            if (rec.inputs.sellPrice) setSellPrice(rec.inputs.sellPrice);
            if (rec.inputs.quantity) setQuantity(rec.inputs.quantity);
          }
        }}
        onClearAll={clearHistory}
        onDeleteItem={deleteItem}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  advancedContainer: {
    marginTop: 10,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  advancedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  advancedHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  gearIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gearIcon: {
    fontSize: 15,
  },
  advancedTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  advancedSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  togglePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  togglePillText: {
    fontSize: 12,
  },
  advancedBox: {
    padding: 14,
    borderTopWidth: 1,
  },
  bottomResetBtn: {
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomResetText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
