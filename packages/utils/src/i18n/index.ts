export * from './languages';
export * from './dictionaries';

import { SupportedLanguage } from './languages';
import { TranslationDictionary, DICTIONARIES, BASE_ENGLISH, BASE_HINDI } from './dictionaries';

/**
 * Universal translation function with smart cascading fallback:
 * Selected Language -> Hindi -> English -> Key
 */
export function t(key: keyof TranslationDictionary, lang: SupportedLanguage = 'en'): string {
  const dict = DICTIONARIES[lang];
  if (dict && dict[key]) {
    return dict[key] as string;
  }
  // Fallback to Hindi if applicable, else English
  if (BASE_HINDI[key]) {
    return BASE_HINDI[key];
  }
  return BASE_ENGLISH[key] || String(key);
}

/**
 * Get a bound translator function for a specific language
 */
export function getTranslator(lang: SupportedLanguage = 'en') {
  return (key: keyof TranslationDictionary): string => t(key, lang);
}

/**
 * Common Indian currency formatting helper
 */
export function formatIndianCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
