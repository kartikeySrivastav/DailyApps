import { createTheme, baseColors } from '../src';

describe('@dailyapps/theme', () => {
  const brand = {
    brandPrimary: '#0284c7',
    brandSecondary: '#38bdf8',
    brandDark: '#0369a1',
  };

  it('creates light theme with brand accent and correct tokens', () => {
    const lightTheme = createTheme('light', brand);
    expect(lightTheme.mode).toBe('light');
    expect(lightTheme.isDark).toBe(false);
    expect(lightTheme.colors.primary).toBe('#0284c7');
    expect(lightTheme.colors.background).toBe('#f8fafc');
    expect(lightTheme.colors.surface).toBe('#ffffff');
    expect(lightTheme.spacing.lg).toBe(16);
    expect(lightTheme.borderRadius.md).toBe(8);
  });

  it('creates dark theme with dark surface and dark brand accent', () => {
    const darkTheme = createTheme('dark', brand);
    expect(darkTheme.mode).toBe('dark');
    expect(darkTheme.isDark).toBe(true);
    expect(darkTheme.colors.primary).toBe('#0369a1');
    expect(darkTheme.colors.background).toBe('#090d16');
    expect(darkTheme.colors.text).toBe('#f8fafc');
  });

  it('provides complete elevation and shadow tokens', () => {
    const theme = createTheme('light', brand);
    expect(theme.shadows.md.elevation).toBe(3);
    expect(theme.buttonHeights.md).toBe(44);
  });
});
