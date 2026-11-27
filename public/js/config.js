/**
 * Bharat Translator - Language Configuration
 * All 22 scheduled Indian languages plus English (sorted alphabetically A-Z).
 * Each language entry includes English name, native script name, ISO code,
 * Web Speech API recognition/synthesis codes, fallback speech codes,
 * and Google Input Tools transliteration code (itcCode) for English/slang phonetic typing.
 */

export const LANGUAGES = [
  {
    id: 'as',
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    speechCode: 'as-IN',
    itcCode: 'as-t-i0-und',
    ocrCode: 'asm',
    fallbackSpeechCodes: ['bn-IN', 'hi-IN', 'en-IN'],
    direction: 'ltr'
  },
  {
    id: 'bn',
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    speechCode: 'bn-IN',
    itcCode: 'bn-t-i0-und',
    ocrCode: 'ben',
    fallbackSpeechCodes: ['bn-BD', 'hi-IN', 'en-IN'],
    direction: 'ltr'
  },
  {
    id: 'brx',
    code: 'brx',
    name: 'Bodo',
    nativeName: 'बड़ो',
    speechCode: 'brx-IN',
    itcCode: 'hi-t-i0-und',
    ocrCode: 'hin',
    fallbackSpeechCodes: ['hi-IN', 'as-IN', 'en-IN'],
    direction: 'ltr'
  },
  {
    id: 'doi',
    code: 'doi',
    name: 'Dogri',
    nativeName: 'डोगरी',
    speechCode: 'doi-IN',
    itcCode: 'hi-t-i0-und',
    ocrCode: 'hin',
    fallbackSpeechCodes: ['hi-IN', 'pa-IN', 'en-IN'],
    direction: 'ltr'
  },
  {
    id: 'en',
    code: 'en',
    name: 'English',
    nativeName: 'English',
    speechCode: 'en-IN',
    itcCode: null,
    ocrCode: 'eng',
    fallbackSpeechCodes: ['en-US', 'en-GB'],
    direction: 'ltr'
  },
  {
    id: 'gu',
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    speechCode: 'gu-IN',
    itcCode: 'gu-t-i0-und',
    ocrCode: 'guj',
    fallbackSpeechCodes: ['hi-IN', 'en-IN'],
    direction: 'ltr'
  },
  {
    id: 'hi',
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    speechCode: 'hi-IN',
    itcCode: 'hi-t-i0-und',
    ocrCode: 'hin',
    fallbackSpeechCodes: ['en-IN'],
    direction: 'ltr'
  },
  {
    id: 'kn',
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    speechCode: 'kn-IN',
    itcCode: 'kn-t-i0-und',
    ocrCode: 'kan',
    fallbackSpeechCodes: ['te-IN', 'ta-IN', 'en-IN'],
    direction: 'ltr'
  },
  {
    id: 'ks',
    code: 'ks',
    name: 'Kashmiri',
    nativeName: 'कॉशुर / کٲشُر',
    speechCode: 'ks-IN',
    itcCode: 'ur-t-i0-und',
    ocrCode: 'urd',
    fallbackSpeechCodes: ['ur-IN', 'hi-IN', 'en-IN'],
    direction: 'rtl'
  },
  {
    id: 'kok',
    code: 'kok',
    name: 'Konkani',
    nativeName: 'कोंकणी',
    speechCode: 'kok-IN',
    itcCode: 'mr-t-i0-und',
    ocrCode: 'mar',
    fallbackSpeechCodes: ['mr-IN', 'hi-IN', 'en-IN'],
    direction: 'ltr'
  },
  {
    id: 'mai',
    code: 'mai',
    name: 'Maithili',
    nativeName: 'मैथिली',
    speechCode: 'mai-IN',
    itcCode: 'hi-t-i0-und',
    ocrCode: 'hin',
    fallbackSpeechCodes: ['hi-IN', 'bn-IN', 'en-IN'],
    direction: 'ltr'
  },
  {
    id: 'ml',
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    speechCode: 'ml-IN',
    itcCode: 'ml-t-i0-und',
    ocrCode: 'mal',
    fallbackSpeechCodes: ['ta-IN', 'kn-IN', 'en-IN'],
    direction: 'ltr'
  },
  {
    id: 'mni',
    code: 'mni',
    name: 'Manipuri (Meitei)',
    nativeName: 'মৈতৈলোন্',
    speechCode: 'mni-IN',
    itcCode: 'bn-t-i0-und',
    ocrCode: 'ben',
    fallbackSpeechCodes: ['bn-IN', 'as-IN', 'en-IN'],
    direction: 'ltr'
  },
  {
    id: 'mr',
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    speechCode: 'mr-IN',
    itcCode: 'mr-t-i0-und',
    ocrCode: 'mar',
    fallbackSpeechCodes: ['hi-IN', 'en-IN'],
    direction: 'ltr'
  },
  {
    id: 'ne',
    code: 'ne',
    name: 'Nepali',
    nativeName: 'नेपाली',
    speechCode: 'ne-NP',
    itcCode: 'ne-t-i0-und',
    ocrCode: 'nep',
    fallbackSpeechCodes: ['ne-IN', 'hi-IN', 'en-IN'],
    direction: 'ltr'
  },
  {
    id: 'or',
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    speechCode: 'or-IN',
    itcCode: 'or-t-i0-und',
    ocrCode: 'ori',
    fallbackSpeechCodes: ['hi-IN', 'bn-IN', 'en-IN'],
    direction: 'ltr'
  },
  {
    id: 'pa',
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    speechCode: 'pa-IN',
    itcCode: 'pa-t-i0-und',
    ocrCode: 'pan',
    fallbackSpeechCodes: ['hi-IN', 'ur-IN', 'en-IN'],
    direction: 'ltr'
  },
  {
    id: 'sa',
    code: 'sa',
    name: 'Sanskrit',
    nativeName: 'संस्कृतम्',
    speechCode: 'sa-IN',
    itcCode: 'sa-t-i0-und',
    ocrCode: 'san',
    fallbackSpeechCodes: ['hi-IN', 'en-IN'],
    direction: 'ltr'
  },
  {
    id: 'sat',
    code: 'sat',
    name: 'Santali',
    nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ',
    speechCode: 'sat-IN',
    itcCode: 'hi-t-i0-und',
    ocrCode: 'hin',
    fallbackSpeechCodes: ['hi-IN', 'bn-IN', 'en-IN'],
    direction: 'ltr'
  },
  {
    id: 'sd',
    code: 'sd',
    name: 'Sindhi',
    nativeName: 'سنڌي / सिंधी',
    speechCode: 'sd-IN',
    itcCode: 'sd-t-i0-und',
    ocrCode: 'snd',
    fallbackSpeechCodes: ['ur-IN', 'hi-IN', 'en-IN'],
    direction: 'rtl'
  },
  {
    id: 'ta',
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    speechCode: 'ta-IN',
    itcCode: 'ta-t-i0-und',
    ocrCode: 'tam',
    fallbackSpeechCodes: ['ta-LK', 'te-IN', 'en-IN'],
    direction: 'ltr'
  },
  {
    id: 'te',
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    speechCode: 'te-IN',
    itcCode: 'te-t-i0-und',
    ocrCode: 'tel',
    fallbackSpeechCodes: ['kn-IN', 'ta-IN', 'hi-IN', 'en-IN'],
    direction: 'ltr'
  },
  {
    id: 'ur',
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    speechCode: 'ur-IN',
    itcCode: 'ur-t-i0-und',
    ocrCode: 'urd',
    fallbackSpeechCodes: ['ur-PK', 'hi-IN', 'en-IN'],
    direction: 'rtl'
  }
];

// Helper to get formatted label "Name - NativeName"
export function getLanguageLabel(lang) {
  return `${lang.name} - ${lang.nativeName}`;
}

// Find language by ID or Code
export function getLanguage(codeOrId) {
  if (!codeOrId) return null;
  const normalized = codeOrId.toLowerCase().trim();
  return (
    LANGUAGES.find(
      (l) => l.id === normalized || l.code === normalized || l.speechCode.toLowerCase() === normalized
    ) || LANGUAGES[4] // defaults to English
  );
}

// Get OCR language code for Tesseract.js (supports multi-lang e.g. "eng+hin", "tel+eng")
export function getOcrCode(langId) {
  const lang = getLanguage(langId);
  if (!lang || !lang.ocrCode) return 'eng+hin';
  if (lang.ocrCode === 'eng') return 'eng';
  // Include English alongside regional language for optimal detection of numbers, code, and mixed signage
  return `${lang.ocrCode}+eng`;
}

// Default pair: Telugu (Speaking) -> Hindi (Translated) or Hindi -> English
export const DEFAULT_SOURCE_LANG = 'te';
export const DEFAULT_TARGET_LANG = 'hi';

export const APP_CONFIG = {
  appName: 'Bharat Translator',
  tagline: 'Real-Time Voice & Text Translation for All Indian Languages',
  version: '2.4.0',
  defaultDebounceMs: 500,
  maxHistoryItems: 100
};
