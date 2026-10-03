import {
  formatNumber,
  formatPercent,
  formatCurrency,
  formatFileSize,
  capitalize,
  truncate,
  slugify,
  isNumeric,
  isEmail,
  trySafe,
} from '../src';

describe('@dailyapps/utils', () => {
  describe('Formatters', () => {
    it('formats numbers properly', () => {
      expect(formatNumber(1234567)).toBe('1,234,567');
      expect(formatNumber('invalid')).toBe('0');
    });

    it('formats percent properly', () => {
      expect(formatPercent(12.3456, 1)).toBe('12.3%');
    });

    it('formats currency properly', () => {
      const formatted = formatCurrency(50.5, 'USD');
      expect(formatted).toContain('50.50');
    });

    it('formats file size properly', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
    });
  });

  describe('String utils', () => {
    it('capitalizes string', () => {
      expect(capitalize('calculator')).toBe('Calculator');
      expect(capitalize('')).toBe('');
    });

    it('truncates string', () => {
      expect(truncate('Hello world this is a test', 10)).toBe('Hello w...');
      expect(truncate('Short', 10)).toBe('Short');
    });

    it('slugifies string', () => {
      expect(slugify('Daily Apps Pro & Tools!')).toBe('daily-apps-pro-tools');
    });
  });

  describe('Validation', () => {
    it('checks numeric values', () => {
      expect(isNumeric(42)).toBe(true);
      expect(isNumeric('42.5')).toBe(true);
      expect(isNumeric('abc')).toBe(false);
    });

    it('checks email addresses', () => {
      expect(isEmail('support@dailyapps.com')).toBe(true);
      expect(isEmail('invalid')).toBe(false);
    });
  });

  describe('Async utils', () => {
    it('trySafe handles successful promises', async () => {
      const [res, err] = await trySafe(Promise.resolve('success'));
      expect(res).toBe('success');
      expect(err).toBeNull();
    });

    it('trySafe handles rejected promises', async () => {
      const [res, err] = await trySafe(Promise.reject(new Error('failed')));
      expect(res).toBeNull();
      expect(err).toBeInstanceOf(Error);
    });
  });
});
