import React, { createContext, useState, useMemo, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { Theme, ThemeMode, BrandOptions } from './types';
import { createTheme } from './createTheme';

export interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  brand: BrandOptions;
  initialMode?: ThemeMode;
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  brand,
  initialMode = 'system',
  children,
}) => {
  let systemScheme: 'light' | 'dark' = 'light';
  try {
    // Safely call useColorScheme in React Native environment
    const scheme = useColorScheme();
    if (scheme === 'dark') systemScheme = 'dark';
  } catch {
    // Fallback if running in node/jest
    systemScheme = 'light';
  }

  const [mode, setMode] = useState<ThemeMode>(initialMode);

  const resolvedMode: 'light' | 'dark' =
    mode === 'system' ? systemScheme : mode;

  const theme = useMemo(
    () => createTheme(resolvedMode, brand),
    [resolvedMode, brand.brandPrimary, brand.brandSecondary, brand.brandDark]
  );

  const toggleTheme = () => {
    setMode((current) => {
      const active = current === 'system' ? systemScheme : current;
      return active === 'dark' ? 'light' : 'dark';
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        mode,
        resolvedMode,
        setMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
