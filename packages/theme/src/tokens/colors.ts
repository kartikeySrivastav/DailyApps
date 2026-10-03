export const baseColors = {
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
  // Slate grayscale
  slate50: '#f8fafc',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate300: '#cbd5e1',
  slate400: '#94a3b8',
  slate500: '#64748b',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1e293b',
  slate900: '#0f172a',
  slate950: '#020617',
  // Semantic
  emerald500: '#10b981',
  emerald600: '#059669',
  amber500: '#f59e0b',
  amber600: '#d97706',
  rose500: '#f43f5e',
  rose600: '#e11d48',
  sky500: '#0ea5e9',
  sky600: '#0284c7',
};

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  background: string;
  surface: string;
  surfaceSubtle: string;
  surfaceCard: string;
  border: string;
  borderSubtle: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  textInverse: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export function createLightColors(brandPrimary: string, brandSecondary?: string): ThemeColors {
  return {
    primary: brandPrimary,
    primaryLight: brandSecondary || '#38bdf8',
    primaryDark: '#0369a1',
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceSubtle: '#f1f5f9',
    surfaceCard: '#ffffff',
    border: '#e2e8f0',
    borderSubtle: '#f1f5f9',
    text: '#0f172a',
    textMuted: '#64748b',
    textSubtle: '#94a3b8',
    textInverse: '#ffffff',
    success: baseColors.emerald500,
    warning: baseColors.amber500,
    error: baseColors.rose500,
    info: baseColors.sky500,
  };
}

export function createDarkColors(brandPrimary: string, brandDark?: string): ThemeColors {
  return {
    primary: brandDark || brandPrimary,
    primaryLight: '#38bdf8',
    primaryDark: '#0284c7',
    background: '#090d16',
    surface: '#121826',
    surfaceSubtle: '#1a2234',
    surfaceCard: '#151d2d',
    border: '#232e42',
    borderSubtle: '#1a2234',
    text: '#f8fafc',
    textMuted: '#94a3b8',
    textSubtle: '#64748b',
    textInverse: '#0f172a',
    success: baseColors.emerald500,
    warning: baseColors.amber500,
    error: baseColors.rose500,
    info: baseColors.sky500,
  };
}
