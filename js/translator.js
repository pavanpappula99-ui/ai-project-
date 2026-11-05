/**
 * Bharat Translator - Multi-Tier Translation Client
 * Supports:
 * - Phonetic Transliteration (Typing Indian language slang in English letters: "nuvvu", "nenu", "aap kaise ho")
 * - Pure Native Script Translation (Outputs ALWAYS in pure script spellings for Indian languages)
 * - Multi-tier fallbacks: Google Web GTX -> Backend Proxy (/api/translate) -> MyMemory -> Offline Phrasebook
 */

import { getLanguage } from './config.js';
import { getOfflineTranslation } from './phrases.js';

class TranslationEngine {
  constructor() {
    this.cache = new Map();
    this.translitCache = new Map();
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
   * Main Translation function
   * Handles slang in English words, converts to pure native script, and translates.
   * Output is guaranteed to be in pure native script spellings (never English unless target is English).
   * @param {string} text - source text or phonetic slang in English letters
   * @param {string} sourceLang - source language id (e.g. 'te', 'hi', 'en')
   * @param {string} targetLang - target language id (e.g. 'hi', 'te', 'en')
   * @returns {Promise<{ translatedText: string, sourceTransliterated: string, provider: string, isOffline: boolean }>}
   */
  async translate(text, sourceLang, targetLang) {
    if (!text || !text.trim()) {
      return { translatedText: '', sourceTransliterated: '', provider: 'none', isOffline: false };
    }

    const trimmed = text.trim();

    // Step 1: Phonetic Slang Transliteration
    // If speaking language is an Indian language and user typed in English letters
    let sourceTransliterated = trimmed;
    let queryText = trimmed;

    if (sourceLang !== 'en' && /[a-zA-Z]/.test(trimmed)) {
      sourceTransliterated = await this.transliterate(trimmed, sourceLang);
      queryText = sourceTransliterated;
    }

    // Step 2: If source and target are the same language
    // e.g. User chose Telugu, typed "nuvvu", and wants pure Telugu spelling "నువ్వు"
    if (sourceLang === targetLang) {
      return {
        translatedText: sourceTransliterated,
        sourceTransliterated,
        provider: sourceTransliterated !== trimmed ? 'phonetic-transliteration' : 'identity',
        isOffline: false
      };
    }

    const cacheKey = this.getCacheKey(queryText, sourceLang, targetLang);
    if (this.cache.has(cacheKey)) {
      return {
        translatedText: this.cache.get(cacheKey),
        sourceTransliterated,
        provider: 'cache',
        isOffline: !navigator.onLine
      };
    }

    // Step 3: Offline check
    if (!navigator.onLine) {
      const offlineResult =
        getOfflineTranslation(queryText, sourceLang, targetLang) ||
        getOfflineTranslation(trimmed, sourceLang, targetLang);

      if (offlineResult) {
        this.cache.set(cacheKey, offlineResult);
        return {
          translatedText: offlineResult,
          sourceTransliterated,
          provider: 'offline-phrasebook',
          isOffline: true
        };
      }
      return {
        translatedText: targetLang === 'en' ? trimmed : sourceTransliterated,
        sourceTransliterated,
        provider: 'offline-untranslated',
        isOffline: true
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
        this.cache.set(cacheKey, gtxResult);
        return {
          translatedText: gtxResult,
          sourceTransliterated,
          provider: 'cloud-gtx',
          isOffline: false
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
          this.cache.set(cacheKey, data.translatedText);
          return {
            translatedText: data.translatedText,
            sourceTransliterated,
            provider: data.provider || 'backend-api',
            isOffline: false
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
        this.cache.set(cacheKey, myMemoryResult);
        return {
          translatedText: myMemoryResult,
          sourceTransliterated,
          provider: 'mymemory-cloud',
          isOffline: false
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
      this.cache.set(cacheKey, dictionaryMatch);
      return {
        translatedText: dictionaryMatch,
        sourceTransliterated,
        provider: 'offline-phrasebook',
        isOffline: false
      };
    }

    throw new Error('Unable to translate. Please check your internet connection.');
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
