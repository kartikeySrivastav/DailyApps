import { Theme, BrandOptions } from './types';
import { createLightColors, createDarkColors } from './tokens/colors';
import { typography } from './tokens/typography';
import { spacing } from './tokens/spacing';
import { borderRadius, borderWidth } from './tokens/borders';
import { shadows } from './tokens/shadows';
import { iconSizes, buttonHeights, inputHeights } from './tokens/sizes';

export function createTheme(mode: 'light' | 'dark', brand: BrandOptions): Theme {
  const isDark = mode === 'dark';
  const colors = isDark
    ? createDarkColors(brand.brandPrimary, brand.brandDark)
    : createLightColors(brand.brandPrimary, brand.brandSecondary);

  return {
    mode,
    isDark,
    colors,
    typography,
    spacing,
    borderRadius,
    borderWidth,
    shadows,
    iconSizes,
    buttonHeights,
    inputHeights,
  };
}
