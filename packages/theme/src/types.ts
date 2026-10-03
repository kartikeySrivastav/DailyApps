import { ThemeColors } from './tokens/colors';
import { Typography } from './tokens/typography';
import { Spacing } from './tokens/spacing';
import { BorderRadius, BorderWidth } from './tokens/borders';
import { Shadows } from './tokens/shadows';
import { IconSizes, ButtonHeights, InputHeights } from './tokens/sizes';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  mode: 'light' | 'dark';
  isDark: boolean;
  colors: ThemeColors;
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
  borderWidth: BorderWidth;
  shadows: Shadows;
  iconSizes: IconSizes;
  buttonHeights: ButtonHeights;
  inputHeights: InputHeights;
}

export interface BrandOptions {
  brandPrimary: string;
  brandSecondary?: string;
  brandDark?: string;
}
