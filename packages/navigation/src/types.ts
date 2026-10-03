import { Theme } from '@dailyapps/theme';

export interface ReactNavigationTheme {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
  };
}

/**
 * Converts @dailyapps/theme to React Navigation compatible theme object.
 */
export function createNavigationTheme(theme: Theme): any {
  return {
    dark: theme.isDark,
    colors: {
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surfaceCard,
      text: theme.colors.text,
      border: theme.colors.borderSubtle,
      notification: theme.colors.primaryLight,
    },
    fonts: {
      regular: {
        fontFamily: 'System',
        fontWeight: '400' as const,
      },
      medium: {
        fontFamily: 'System',
        fontWeight: '500' as const,
      },
      bold: {
        fontFamily: 'System',
        fontWeight: '700' as const,
      },
      heavy: {
        fontFamily: 'System',
        fontWeight: '900' as const,
      },
    },
  };
}

/**
 * Default Stack Navigator Screen Options
 */
export function getDefaultScreenOptions(theme: Theme) {
  return {
    headerStyle: {
      backgroundColor: theme.colors.surfaceCard,
    },
    headerTintColor: theme.colors.text,
    headerTitleStyle: {
      fontWeight: '700' as const,
      fontSize: theme.typography.fontSize.lg,
    },
    headerShadowVisible: false,
    contentStyle: {
      backgroundColor: theme.colors.background,
    },
  };
}
