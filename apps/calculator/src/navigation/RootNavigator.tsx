import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@dailyapps/theme';
import { getDefaultScreenOptions } from '@dailyapps/navigation';
import { MainTabs } from './MainTabs';
import { HomeScreen } from '../screens/HomeScreen';
import { CategoryToolsScreen } from '../screens/CategoryToolsScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { MoreScreen } from '../screens/MoreScreen';
import { BasicCalculatorScreen } from '../screens/BasicCalculatorScreen';
import { ScientificCalculatorScreen } from '../screens/ScientificCalculatorScreen';
import { AgeCalculatorScreen } from '../screens/AgeCalculatorScreen';
import { PercentageCalculatorScreen } from '../screens/PercentageCalculatorScreen';
import { DiscountCalculatorScreen } from '../screens/DiscountCalculatorScreen';
import { EMICalculatorScreen } from '../screens/EMICalculatorScreen';
import { GSTCalculatorScreen } from '../screens/GSTCalculatorScreen';
import { UnitConverterScreen } from '../screens/UnitConverterScreen';
import { SIPCalculatorScreen } from '../screens/SIPCalculatorScreen';
import { StockProfitCalculatorScreen } from '../screens/StockProfitCalculatorScreen';
import { FuelCostCalculatorScreen } from '../screens/FuelCostCalculatorScreen';
import { BMICalculatorScreen } from '../screens/BMICalculatorScreen';
import { StudentCalculatorScreen } from '../screens/StudentCalculatorScreen';
import { ElectricityCalculatorScreen } from '../screens/ElectricityCalculatorScreen';
import { MathToolsCalculatorScreen } from '../screens/MathToolsCalculatorScreen';
import { AdvancedMathCalculatorScreen } from '../screens/AdvancedMathCalculatorScreen';
import { BankingCalculatorScreen } from '../screens/BankingCalculatorScreen';
import { TaxSalaryCalculatorScreen } from '../screens/TaxSalaryCalculatorScreen';
import { UnifiedMathScreen } from '../screens/UnifiedMathScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
  const theme = useTheme();
  const screenOptions = getDefaultScreenOptions(theme);

  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        ...screenOptions,
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CategoryTools" component={CategoryToolsScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
      <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
      <Stack.Screen name="MoreScreen" component={MoreScreen} />
      <Stack.Screen name="BasicCalculator" component={BasicCalculatorScreen} />
      <Stack.Screen name="ScientificCalculator" component={ScientificCalculatorScreen} />
      <Stack.Screen name="AgeCalculator" component={AgeCalculatorScreen} />
      <Stack.Screen name="PercentageCalculator" component={PercentageCalculatorScreen} />
      <Stack.Screen name="StudentCalculator" component={StudentCalculatorScreen} />
      <Stack.Screen name="DiscountCalculator" component={DiscountCalculatorScreen} />
      <Stack.Screen name="EMICalculator" component={EMICalculatorScreen} />
      <Stack.Screen name="GSTCalculator" component={GSTCalculatorScreen} />
      <Stack.Screen name="UnitConverter" component={UnitConverterScreen} />
      <Stack.Screen name="SIPCalculator" component={SIPCalculatorScreen} />
      <Stack.Screen name="StockProfitCalculator" component={StockProfitCalculatorScreen} />
      <Stack.Screen name="FuelCostCalculator" component={FuelCostCalculatorScreen} />
      <Stack.Screen name="BMICalculator" component={BMICalculatorScreen} />
      <Stack.Screen name="ElectricityCalculator" component={ElectricityCalculatorScreen} />
      <Stack.Screen name="MathToolsCalculator" component={MathToolsCalculatorScreen} />
      <Stack.Screen name="AdvancedMathCalculator" component={AdvancedMathCalculatorScreen} />
      <Stack.Screen name="BankingCalculator" component={BankingCalculatorScreen} />
      <Stack.Screen name="TaxSalaryCalculator" component={TaxSalaryCalculatorScreen} />
      <Stack.Screen name="UnifiedMath" component={UnifiedMathScreen} />
    </Stack.Navigator>
  );
};
