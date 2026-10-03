import { useContext } from 'react';
import { ThemeContext, ThemeContextValue } from './ThemeProvider';
import { Theme } from './types';

export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}

export function useTheme(): Theme {
  return useThemeContext().theme;
}
