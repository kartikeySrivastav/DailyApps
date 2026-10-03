import { AppFeature } from '@dailyapps/config';

export type CalculatorCategory =
  | '💰 Loans'
  | '📈 Investments'
  | '📊 Trading'
  | '🏦 Banking'
  | '💵 Tax & Salary'
  | '🚗 Vehicle'
  | '🏠 Home'
  | '🏃 Health'
  | '🎓 Student'
  | '🧮 Math'
  | '📅 Date & Time'
  | '🔄 Converters';

export type CalculatorStatus = 'available' | 'coming_soon';

export interface CalculatorItem extends AppFeature {
  id: string;
  name: string; // User-facing name (maps to title)
  title: string;
  shortDescription: string; // maps to description
  description: string;
  category: CalculatorCategory;
  icon: string;
  keywords: string[];
  aliases?: string[];
  route: string;
  initialMode?: string;
  popularity: number;
  isPopular?: boolean;
  status: CalculatorStatus;
  badge?: string;
  disclaimer?: string;
}
