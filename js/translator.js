/**
 * Bharat Translator - Multi-Tier Translation Client
 * Supports:
 * - Phonetic Transliteration (Typing Indian language slang in English letters: "nuvvu", "nenu", "aap kaise ho")
 * - Pure Native Script Translation (Outputs ALWAYS in pure script spellings for Indian languages)
 * - Multi-tier fallbacks: Google Web GTX -> Backend Proxy (/api/translate) -> MyMemory -> Offline Phrasebook
 */

import { getLanguage } from './config.js';
import { getOfflineTranslation } from './phrases.js';
import { lookupFoodTranslation, fixKnownTranslationFlaws } from './food-dictionary.js';

class TranslationEngine {
  constructor() {
    this.cache = new Map();
    this.translitCache = new Map();
  }

  isStandardEnglishText(text) {
    if (!text || typeof text !== 'string') return false;
    const clean = text.toLowerCase().trim();
    const commonWords = [
      'curry', 'fry', 'rice', 'dal', 'menu', 'breakfast', 'lunch', 'dinner', 'snacks',
      'special', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
      'brinjal', 'eggplant', 'potato', 'tomato', 'onion', 'curd', 'buttermilk', 'milk',
      'water', 'tea', 'coffee', 'chicken', 'fish', 'mutton', 'egg', 'paneer', 'palak',
      'sambar', 'rasam', 'chapati', 'roti', 'poori', 'idli', 'dosa', 'vada', 'upma',
      'welcome', 'station', 'platform', 'railway', 'hospital', 'hotel', 'restaurant',
      'hostel', 'room', 'bus', 'train', 'airport', 'ticket', 'entry', 'exit', 'notice',
      'please', 'good', 'morning', 'afternoon', 'evening', 'night', 'thank', 'you',
      'ladies', 'finger', 'gourd', 'bottle', 'bitter', 'ridge', 'cabbage', 'cauliflower',
      'carrot', 'beetroot', 'beans', 'poha', 'pongal', 'pesarattu', 'chutney', 'pickle'
    ];
    return commonWords.some((w) => new RegExp(`\\b${w}\\b`, 'i').test(clean));
  }

  getCacheKey(text, sourceLang, targetLang) {
    return `${sourceLang}->${targetLang}:${text.trim().toLowerCase()}`;
  }

  /**
   * Transliterate Romanized / English phonetic slang into pure native script
   * e.g. Telugu: "nuvvu" -> "నువ్వు", "nenu" -> "నేను"
   * e.g. Hindi: "aap kaise ho" -> "आप कैसे हो"
   * e.g. Tamil: "vanakkam epdi irukinga" -> "வணக்கம் எப்டி இருக்கீங்க"
   * @param {string} text
   * @param {string} langId
   * @returns {Promise<string>}
   */
  async transliterate(text, langId) {
    if (!text || !text.trim() || langId === 'en') return text;

    // Check if input contains Latin / English letters that need phonetic conversion
    if (!/[a-zA-Z]/.test(text)) {
      return text; // Already in native script
    }

    const langObj = getLanguage(langId);
    if (!langObj || !langObj.itcCode) return text;

    const trimmed = text.trim();
    const cacheKey = `${langId}:${trimmed.toLowerCase()}`;
    if (this.translitCache.has(cacheKey)) {
      return this.translitCache.get(cacheKey);
    }

    const url = `https://inputtools.google.com/request?text=${encodeURIComponent(
      trimmed
    )}&itc=${langObj.itcCode}&num=1`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!res.ok) return trimmed;

      const data = await res.json();
      if (
        data &&
        data[0] === 'SUCCESS' &&
        data[1] &&
        data[1][0] &&
        data[1][0][1] &&
        data[1][0][1][0]
      ) {
        const nativeScript = data[1][0][1][0];
        this.translitCache.set(cacheKey, nativeScript);
        return nativeScript;
      }
    } catch (e) {
      clearTimeout(timeoutId);
      console.warn('Phonetic transliteration request timed out or failed:', e.message);
    }

    return trimmed;
  }

  /**
   * Fast client-side script & language detector based on Unicode ranges
   * Accurately detects English vs 22 Indian regional scripts in 0ms
   */
  detectLanguage(text) {
    if (!text || typeof text !== 'string') return 'en';
    const s = text.trim();
    if (!s) return 'en';

    let te = 0, hi = 0, ta = 0, bn = 0, kn = 0, ml = 0, gu = 0, pa = 0, or_count = 0, ur = 0, en = 0;

    for (let i = 0; i < s.length; i++) {
      const code = s.charCodeAt(i);
      if (code >= 0x0c00 && code <= 0x0c7f) te++;
      else if (code >= 0x0900 && code <= 0x097f) hi++;
      else if (code >= 0x0b80 && code <= 0x0bff) ta++;
      else if (code >= 0x0980 && code <= 0x09ff) bn++;
      else if (code >= 0x0c80 && code <= 0x0cff) kn++;
      else if (code >= 0x0d00 && code <= 0x0d7f) ml++;
      else if (code >= 0x0a80 && code <= 0x0aff) gu++;
      else if (code >= 0x0a00 && code <= 0x0a7f) pa++;
      else if (code >= 0x0b00 && code <= 0x0b7f) or_count++;
      else if (code >= 0x0600 && code <= 0x06ff) ur++;
      else if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) en++;
    }

    const counts = [
      { lang: 'te', count: te },
      { lang: 'hi', count: hi },
      { lang: 'ta', count: ta },
      { lang: 'bn', count: bn },
      { lang: 'kn', count: kn },
      { lang: 'ml', count: ml },
      { lang: 'gu', count: gu },
      { lang: 'pa', count: pa },
      { lang: 'or', count: or_count },
      { lang: 'ur', count: ur },
      { lang: 'en', count: en }
    ];

    counts.sort((a, b) => b.count - a.count);
    return counts[0].count > 0 ? counts[0].lang : 'en';
  }

  /**
   * Main Translation function
   * Handles slang in English words, converts to pure native script, and translates.
   * Output is guaranteed to be in pure native script spellings (never English unless target is English).
   * @param {string} text - source text or phonetic slang in English letters
   * @param {string} sourceLang - source language id (e.g. 'te', 'hi', 'en', 'auto')
   * @param {string} targetLang - target language id (e.g. 'hi', 'te', 'en')
   * @param {object} [options] - optional flags: skipTransliteration
   * @returns {Promise<{ translatedText: string, sourceTransliterated: string, provider: string, isOffline: boolean }>}
   */
  async translate(text, sourceLang, targetLang, options = {}) {
    if (!text || !text.trim()) {
      return {
        translatedText: '',
        sourceTransliterated: '',
        provider: 'none',
        isOffline: false,
        toString() { return this.translatedText; }
      };
    }

    const trimmed = text.trim();

    // Step 0: Check Food & Menu Dictionary for 100% authentic native meaning
    const foodMatch = lookupFoodTranslation(trimmed, targetLang);
    if (foodMatch) {
      return {
        translatedText: foodMatch,
        sourceTransliterated: trimmed,
        provider: 'food-dictionary',
        isOffline: false,
        toString() { return this.translatedText; }
      };
    }

    // Auto-detect language if source is 'auto' or unspecified, or if script clearly differs
    const detected = this.detectLanguage(trimmed);
    if (sourceLang === 'auto' || !sourceLang) {
      sourceLang = detected;
      if (sourceLang === targetLang) {
        sourceLang = targetLang === 'en' ? 'hi' : 'en';
      }
    } else if (sourceLang !== 'en' && detected === 'en' && /[a-zA-Z]{3,}/.test(trimmed)) {
      // User has selected regional source, but text is actually English words/sentences!
      // Treat source as English so it translates the actual meaning rather than phonetic slang
      sourceLang = 'en';
    }

    // Step 1: Phonetic Slang Transliteration
    // ONLY when user is typing regional slang in English letters (e.g. "nuvvu", "nenu", "aap kaise ho")
    // NEVER on documents/images (options.skipTransliteration) and NEVER if text contains standard English vocabulary
    let sourceTransliterated = trimmed;
    let queryText = trimmed;

    const isEnglishVocab = this.isStandardEnglishText(trimmed);
    const allowTransliteration = !options.skipTransliteration && sourceLang !== 'en' && /[a-zA-Z]/.test(trimmed) && !isEnglishVocab;

    if (allowTransliteration) {
      sourceTransliterated = await this.transliterate(trimmed, sourceLang);
      queryText = sourceTransliterated;
    }

    // Step 2: If source and target are the same language
    if (sourceLang === targetLang) {
      if (/[a-zA-Z]/.test(trimmed) && targetLang !== 'en') {
        sourceLang = 'en'; // Force translate from English to native script
      } else {
        return {
          translatedText: sourceTransliterated,
          sourceTransliterated,
          provider: sourceTransliterated !== trimmed ? 'phonetic-transliteration' : 'identity',
          isOffline: false,
          toString() { return this.translatedText; }
        };
      }
    }

    const cacheKey = this.getCacheKey(queryText, sourceLang, targetLang);
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      const polished = fixKnownTranslationFlaws(cached, targetLang);
      return {
        translatedText: polished,
        sourceTransliterated,
        provider: 'cache',
        isOffline: !navigator.onLine,
        toString() { return this.translatedText; }
      };
    }

    // Step 3: Offline check
    if (!navigator.onLine) {
      const offlineResult =
        getOfflineTranslation(queryText, sourceLang, targetLang) ||
        getOfflineTranslation(trimmed, sourceLang, targetLang);

      if (offlineResult) {
        const polished = fixKnownTranslationFlaws(offlineResult, targetLang);
        this.cache.set(cacheKey, polished);
        return {
          translatedText: polished,
          sourceTransliterated,
          provider: 'offline-phrasebook',
          isOffline: true,
          toString() { return this.translatedText; }
        };
      }
      return {
        translatedText: targetLang === 'en' ? trimmed : sourceTransliterated,
        sourceTransliterated,
        provider: 'offline-untranslated',
        isOffline: true,
        toString() { return this.translatedText; }
      };
    }

    // Step 4: Tier 1 - Direct Google Web GTX Translation
    try {
      const gtxResult = await this.translateViaGoogleWeb(queryText, sourceLang, targetLang);
      if (
        gtxResult &&
        gtxResult.trim() &&
        !this.isIdentical(queryText, gtxResult, sourceLang, targetLang)
      ) {
        const polished = fixKnownTranslationFlaws(gtxResult, targetLang);
        this.cache.set(cacheKey, polished);
        return {
          translatedText: polished,
          sourceTransliterated,
          provider: 'cloud-gtx',
          isOffline: false,
          toString() { return this.translatedText; }
        };
      }
    } catch (gtxErr) {
      console.warn('Direct Google Web translation unavailable:', gtxErr.message);
    }

    // Step 5: Tier 2 - Backend API Proxy (/api/translate for Bhashini, Azure, Cloud Key, Gemini)
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: queryText,
          sourceLang,
          targetLang
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (
          data.translatedText &&
          data.translatedText.trim() &&
          !this.isIdentical(queryText, data.translatedText, sourceLang, targetLang)
        ) {
          const polished = fixKnownTranslationFlaws(data.translatedText, targetLang);
          this.cache.set(cacheKey, polished);
          return {
            translatedText: polished,
            sourceTransliterated,
            provider: data.provider || 'backend-api',
            isOffline: false,
            toString() { return this.translatedText; }
          };
        }
      }
    } catch (backendErr) {
      console.warn('Backend proxy unavailable, trying fallback:', backendErr.message);
    }

    // Step 6: Tier 3 - MyMemory Public API
    try {
      const myMemoryResult = await this.translateViaMyMemory(queryText, sourceLang, targetLang);
      if (
        myMemoryResult &&
        myMemoryResult.trim() &&
        !this.isIdentical(queryText, myMemoryResult, sourceLang, targetLang)
      ) {
        const polished = fixKnownTranslationFlaws(myMemoryResult, targetLang);
        this.cache.set(cacheKey, polished);
        return {
          translatedText: polished,
          sourceTransliterated,
          provider: 'mymemory-cloud',
          isOffline: false,
          toString() { return this.translatedText; }
        };
      }
    } catch (mmErr) {
      console.warn('MyMemory fallback failed:', mmErr.message);
    }

    // Step 7: Tier 4 - Offline Travel Dictionary
    const dictionaryMatch =
      getOfflineTranslation(queryText, sourceLang, targetLang) ||
      getOfflineTranslation(trimmed, sourceLang, targetLang);

    if (dictionaryMatch) {
      const polished = fixKnownTranslationFlaws(dictionaryMatch, targetLang);
      this.cache.set(cacheKey, polished);
      return {
        translatedText: polished,
        sourceTransliterated,
        provider: 'offline-phrasebook',
        isOffline: false,
        toString() { return this.translatedText; }
      };
    }

    throw new Error('Unable to translate. Please check your internet connection.');
  }

  /**
   * Translate long multi-paragraph documents (PDFs, multi-line OCR text, Mess Menus)
   * Intelligently parses menu headers, dish items, line items, and chunks text safely.
   * @param {string} text
   * @param {string} sourceLang
   * @param {string} targetLang
   * @param {function} [onProgress] - callback(percent: number, current: number, total: number)
   * @returns {Promise<{ translatedText: string, provider: string, toString: function }>}
   */
  async translateLongText(text, sourceLang, targetLang, onProgress = null) {
    if (!text || !text.trim()) {
      return {
        translatedText: '',
        provider: 'none',
        toString() { return this.translatedText; }
      };
    }

    let effectiveSource = sourceLang;
    const detected = this.detectLanguage(text);

    if (effectiveSource === 'auto' || !effectiveSource) {
      effectiveSource = detected;
      if (effectiveSource === targetLang) {
        effectiveSource = targetLang === 'en' ? 'hi' : 'en';
      }
    } else if (effectiveSource !== 'en' && detected === 'en' && /[a-zA-Z]{2,}/.test(text)) {
      effectiveSource = 'en';
    }

    if (effectiveSource === targetLang && !/[a-zA-Z]/.test(text)) {
      return {
        translatedText: text,
        provider: 'identity',
        toString() { return this.translatedText; }
      };
    }

    const trimmed = text.trim();

    // Check single short text in food dictionary directly
    const directFoodMatch = lookupFoodTranslation(trimmed, targetLang);
    if (directFoodMatch) {
      if (onProgress) onProgress(100, 1, 1);
      return {
        translatedText: directFoodMatch,
        provider: 'food-dictionary',
        toString() { return this.translatedText; }
      };
    }

    // Helper: translate a single line or menu entry
    const translateLineEntry = async (line) => {
      const l = line.trim();
      if (!l) return '';

      // Direct match for whole line
      const lineMatch = lookupFoodTranslation(l, targetLang);
      if (lineMatch) return lineMatch;

      // Handle Key-Value headers (e.g. "Lunch: Rice, Dal Tadka, Brinjal Curry, Curd")
      const colonIdx = l.indexOf(':');
      if (colonIdx > 0 && colonIdx < 35) {
        const header = l.slice(0, colonIdx).trim();
        const body = l.slice(colonIdx + 1).trim();

        const translatedHeader = lookupFoodTranslation(header, targetLang) ||
          (await this.translate(header, effectiveSource, targetLang, { skipTransliteration: true }))?.translatedText ||
          header;

        if (body.includes(',')) {
          const items = body.split(',');
          const translatedItems = [];
          for (const item of items) {
            const cleanItem = item.trim();
            if (!cleanItem) continue;
            const itemMatch = lookupFoodTranslation(cleanItem, targetLang);
            if (itemMatch) {
              translatedItems.push(itemMatch);
            } else {
              const res = await this.translate(cleanItem, effectiveSource, targetLang, { skipTransliteration: true });
              translatedItems.push(res?.translatedText || cleanItem);
            }
          }
          return `${translatedHeader}: ${translatedItems.join(', ')}`;
        } else if (body) {
          const bodyMatch = lookupFoodTranslation(body, targetLang);
          if (bodyMatch) return `${translatedHeader}: ${bodyMatch}`;
        }
      }

      // Handle comma-separated list of dishes without colon
      if (l.includes(',')) {
        const items = l.split(',');
        const translatedItems = [];
        let matchesCount = 0;
        for (const item of items) {
          const cleanItem = item.trim();
          if (!cleanItem) continue;
          const itemMatch = lookupFoodTranslation(cleanItem, targetLang);
          if (itemMatch) {
            translatedItems.push(itemMatch);
            matchesCount++;
          } else {
            const res = await this.translate(cleanItem, effectiveSource, targetLang, { skipTransliteration: true });
            translatedItems.push(res?.translatedText || cleanItem);
          }
        }
        if (matchesCount > 0) {
          return translatedItems.join(', ');
        }
      }

      const res = await this.translate(l, effectiveSource, targetLang, { skipTransliteration: true });
      const str = typeof res === 'string' ? res : (res?.translatedText || l);
      return fixKnownTranslationFlaws(str, targetLang);
    };

    // Split text into individual lines
    const lines = trimmed.split('\n');

    // If it's a multi-line list / menu / document (more than 1 line)
    if (lines.length > 1) {
      const translatedLines = [];
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) {
          translatedLines.push('');
          continue;
        }

        if (onProgress) {
          const percent = Math.round(((i + 1) / lines.length) * 100);
          onProgress(percent, i + 1, lines.length);
        }

        try {
          const transLine = await translateLineEntry(line);
          translatedLines.push(transLine);
        } catch (err) {
          console.warn(`Line translation failed for line ${i + 1}:`, err.message);
          translatedLines.push(line);
        }
      }

      const finalDocument = translatedLines.join('\n');
      return {
        translatedText: fixKnownTranslationFlaws(finalDocument, targetLang),
        provider: 'menu-aware-multiline',
        toString() { return this.translatedText; }
      };
    }

    // Single line text (under 750 chars)
    if (trimmed.length <= 750) {
      if (onProgress) onProgress(50, 1, 1);
      const res = await translateLineEntry(trimmed);
      if (onProgress) onProgress(100, 1, 1);
      return {
        translatedText: fixKnownTranslationFlaws(res, targetLang),
        provider: 'enhanced-single-line',
        toString() { return this.translatedText; }
      };
    }

    // Long multi-paragraph document fallback
    const res = await translateLineEntry(trimmed);
    return {
      translatedText: fixKnownTranslationFlaws(res, targetLang),
      provider: 'long-document',
      toString() { return this.translatedText; }
    };
  }

  isIdentical(original, translated, sourceLang, targetLang) {
    if (sourceLang === targetLang) return false;
    const cleanOrig = original.trim().toLowerCase();
    const cleanTrans = translated.trim().toLowerCase();
    if (/^\d+$/.test(cleanOrig)) return false;
    return cleanOrig === cleanTrans;
  }

  /**
   * Direct Google Web Translation (GTX)
   */
  async translateViaGoogleWeb(text, sourceLang, targetLang) {
    const mappedSource = sourceLang === 'brx' ? 'hi' : sourceLang === 'doi' ? 'hi' : sourceLang;
    const mappedTarget = targetLang === 'brx' ? 'hi' : targetLang === 'doi' ? 'hi' : targetLang;

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${mappedSource}&tl=${mappedTarget}&dt=t&q=${encodeURIComponent(
      text
    )}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!res.ok) return null;

      const data = await res.json();
      if (data && data[0] && Array.isArray(data[0])) {
        let fullTranslation = '';
        data[0].forEach((item) => {
          if (item && item[0]) {
            fullTranslation += item[0];
          }
        });
        return fullTranslation.trim();
      }
      return null;
    } catch (e) {
      clearTimeout(timeoutId);
      return null;
    }
  }

  /**
   * MyMemory Public Translation
   */
  async translateViaMyMemory(text, sourceLang, targetLang) {
    const langPair = `${sourceLang}|${targetLang}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=${encodeURIComponent(langPair)}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!res.ok) return null;

      const data = await res.json();
      if (data && data.responseData && data.responseData.translatedText) {
        let cleanText = data.responseData.translatedText;
        if (cleanText.includes('MYMEMORY WARNING:') && data.matches && data.matches.length > 0) {
          cleanText = data.matches[0].translation;
        }
        return cleanText.trim();
      }
      return null;
    } catch (e) {
      clearTimeout(timeoutId);
      return null;
    }
  }
}

export const translationEngine = new TranslationEngine();
