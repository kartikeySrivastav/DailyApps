/**
 * Format a number with thousands separators and optional decimals.
 */
export function formatNumber(
  value: number | string,
  options?: {
    decimals?: number;
    locale?: string;
  }
): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';

  const locale = options?.locale || 'en-US';
  const decimals = options?.decimals;

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Format a number as percentage.
 */
export function formatPercent(value: number, decimals: number = 2): string {
  if (isNaN(value)) return '0%';
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format large numbers in compact form (e.g. 1.2K, 3.4M).
 */
export function formatCompactNumber(value: number, locale = 'en-US'): string {
  if (isNaN(value)) return '0';
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
}
