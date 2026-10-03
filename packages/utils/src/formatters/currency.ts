/**
 * Format a number as currency.
 */
export function formatCurrency(
  value: number | string,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '$0.00';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(num);
}
