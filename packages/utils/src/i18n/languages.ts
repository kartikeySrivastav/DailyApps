export type SupportedLanguage =
  | 'en'    // English
  | 'hi'    // हिन्दी (Hindi)
  | 'hi_en' // Hinglish
  | 'bn'    // বাংলা (Bengali)
  | 'mr'    // मराठी (Marathi)
  | 'te'    // తెలుగు (Telugu)
  | 'ta'    // தமிழ் (Tamil)
  | 'gu'    // ગુજરાતી (Gujarati)
  | 'ur'    // اردو (Urdu - RTL)
  | 'kn'    // ಕನ್ನಡ (Kannada)
  | 'or'    // ଓଡ଼ିଆ (Odia)
  | 'ml'    // മലയാളം (Malayalam)
  | 'pa'    // ਪੰਜਾਬੀ (Punjabi)
  | 'as'    // অসমীয়া (Assamese)
  | 'bho';  // भोजपुरी (Bhojpuri)

export type DocumentLanguage = SupportedLanguage;

export interface LanguageMeta {
  code: SupportedLanguage;
  nativeName: string;
  englishName: string;
  script: string;
  flag: string;
  textDirection: 'ltr' | 'rtl';
  fontFamily: string;
  pdfCssFont: string;
}

export const ALL_INDIAN_LANGUAGES: LanguageMeta[] = [
  {
    code: 'en',
    nativeName: 'English',
    englishName: 'English',
    script: 'Latin',
    flag: '🇬🇧',
    textDirection: 'ltr',
    fontFamily: 'Inter, -apple-system, Roboto, sans-serif',
    pdfCssFont: "'Inter', 'Roboto', sans-serif",
  },
  {
    code: 'hi',
    nativeName: 'हिन्दी',
    englishName: 'Hindi',
    script: 'Devanagari',
    flag: '🇮🇳',
    textDirection: 'ltr',
    fontFamily: "'Noto Sans Devanagari', 'Hind', sans-serif",
    pdfCssFont: "'Noto Sans Devanagari', 'Hind', sans-serif",
  },
  {
    code: 'hi_en',
    nativeName: 'Hinglish',
    englishName: 'Hinglish',
    script: 'Latin',
    flag: '🇮🇳',
    textDirection: 'ltr',
    fontFamily: 'Inter, Roboto, sans-serif',
    pdfCssFont: "'Inter', 'Roboto', sans-serif",
  },
  {
    code: 'bn',
    nativeName: 'বাংলা',
    englishName: 'Bengali',
    script: 'Bengali',
    flag: '🇮🇳',
    textDirection: 'ltr',
    fontFamily: "'Noto Sans Bengali', sans-serif",
    pdfCssFont: "'Noto Sans Bengali', sans-serif",
  },
  {
    code: 'mr',
    nativeName: 'मराठी',
    englishName: 'Marathi',
    script: 'Devanagari',
    flag: '🇮🇳',
    textDirection: 'ltr',
    fontFamily: "'Noto Sans Devanagari', 'Hind', sans-serif",
    pdfCssFont: "'Noto Sans Devanagari', 'Hind', sans-serif",
  },
  {
    code: 'te',
    nativeName: 'తెలుగు',
    englishName: 'Telugu',
    script: 'Telugu',
    flag: '🇮🇳',
    textDirection: 'ltr',
    fontFamily: "'Noto Sans Telugu', sans-serif",
    pdfCssFont: "'Noto Sans Telugu', sans-serif",
  },
  {
    code: 'ta',
    nativeName: 'தமிழ்',
    englishName: 'Tamil',
    script: 'Tamil',
    flag: '🇮🇳',
    textDirection: 'ltr',
    fontFamily: "'Noto Sans Tamil', sans-serif",
    pdfCssFont: "'Noto Sans Tamil', sans-serif",
  },
  {
    code: 'gu',
    nativeName: 'ગુજરાતી',
    englishName: 'Gujarati',
    script: 'Gujarati',
    flag: '🇮🇳',
    textDirection: 'ltr',
    fontFamily: "'Noto Sans Gujarati', sans-serif",
    pdfCssFont: "'Noto Sans Gujarati', sans-serif",
  },
  {
    code: 'ur',
    nativeName: 'اردو',
    englishName: 'Urdu',
    script: 'Arabic-Nastaliq',
    flag: '🇮🇳',
    textDirection: 'rtl',
    fontFamily: "'Noto Nastaliq Urdu', sans-serif",
    pdfCssFont: "'Noto Nastaliq Urdu', sans-serif",
  },
  {
    code: 'kn',
    nativeName: 'ಕನ್ನಡ',
    englishName: 'Kannada',
    script: 'Kannada',
    flag: '🇮🇳',
    textDirection: 'ltr',
    fontFamily: "'Noto Sans Kannada', sans-serif",
    pdfCssFont: "'Noto Sans Kannada', sans-serif",
  },
  {
    code: 'or',
    nativeName: 'ଓଡ଼ିଆ',
    englishName: 'Odia',
    script: 'Odia',
    flag: '🇮🇳',
    textDirection: 'ltr',
    fontFamily: "'Noto Sans Odia', sans-serif",
    pdfCssFont: "'Noto Sans Odia', sans-serif",
  },
  {
    code: 'ml',
    nativeName: 'മലയാളം',
    englishName: 'Malayalam',
    script: 'Malayalam',
    flag: '🇮🇳',
    textDirection: 'ltr',
    fontFamily: "'Noto Sans Malayalam', sans-serif",
    pdfCssFont: "'Noto Sans Malayalam', sans-serif",
  },
  {
    code: 'pa',
    nativeName: 'ਪੰਜਾਬੀ',
    englishName: 'Punjabi',
    script: 'Gurmukhi',
    flag: '🇮🇳',
    textDirection: 'ltr',
    fontFamily: "'Noto Sans Gurmukhi', sans-serif",
    pdfCssFont: "'Noto Sans Gurmukhi', sans-serif",
  },
  {
    code: 'as',
    nativeName: 'অসমীয়া',
    englishName: 'Assamese',
    script: 'Bengali-Assamese',
    flag: '🇮🇳',
    textDirection: 'ltr',
    fontFamily: "'Noto Sans Bengali', sans-serif",
    pdfCssFont: "'Noto Sans Bengali', sans-serif",
  },
  {
    code: 'bho',
    nativeName: 'भोजपुरी',
    englishName: 'Bhojpuri',
    script: 'Devanagari',
    flag: '🇮🇳',
    textDirection: 'ltr',
    fontFamily: "'Noto Sans Devanagari', 'Hind', sans-serif",
    pdfCssFont: "'Noto Sans Devanagari', 'Hind', sans-serif",
  },
];

export function isRtlLanguage(lang: SupportedLanguage): boolean {
  return lang === 'ur';
}

export function getLanguageMeta(lang: SupportedLanguage): LanguageMeta {
  return (
    ALL_INDIAN_LANGUAGES.find((l) => l.code === lang) ||
    ALL_INDIAN_LANGUAGES[0]
  );
}
