/**
 * Check if a value is a valid numeric string or number.
 */
export function isNumeric(val: any): boolean {
  if (typeof val === 'number') return !isNaN(val) && isFinite(val);
  if (typeof val !== 'string') return false;
  return !isNaN(Number(val)) && !isNaN(parseFloat(val));
}

/**
 * Basic email format validator.
 */
export function isEmail(val: string): boolean {
  if (!val) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

/**
 * Validates if number is within [min, max] range.
 */
export function inRange(val: number, min: number, max: number): boolean {
  return val >= min && val <= max;
}

/**
 * Checks if a string is non-empty after trimming.
 */
export function isNonEmpty(val: unknown): val is string {
  return typeof val === 'string' && val.trim().length > 0;
}
