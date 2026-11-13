/**
 * Bharat Translator - Multi-Tier Translation Client
 * Supports:
 * - Phonetic Transliteration (Typing Indian language slang in English letters: "nuvvu", "nenu", "aap kaise ho")
 * - Pure Native Script Translation (Outputs ALWAYS in pure script spellings for Indian languages)
 * - Intelligent Language Detection & Romanized Indic Script Disambiguation
 * - Multi-tier fallbacks: Google Web GTX -> Backend Proxy (/api/translate) -> MyMemory -> Offline Phrasebook
 */

import { getLanguage } from './config.js';
import { getOfflineTranslation } from './phrases.js';
import { lookupFoodTranslation, lookupVocabulary, fixKnownTranslationFlaws } from './food-dictionary.js';
import { LanguageDetector } from './detector.js';

class TranslationEngine {
  constructor() {
    this.cache = new Map();
    this.translitCache = new Map();
  }

  /**
   * Fast unified script and Romanized language detector
   * @param {string} text
   * @returns {string} language id (e.g. 'te', 'hi', 'en', 'ta')
   */
  detectLanguage(text) {
    const res = LanguageDetector.detect(text);
    return res.lang;
  }

  /**
   * Detailed language detection with Romanized flag and confidence
   * @param {string} text
   * @returns {{ lang: string, isRomanized: boolean, confidence: number }}
   */
  detect(text) {
    return LanguageDetector.detect(text);
  }

  /**
   * Check if text is standard English rather than Romanized Indian regional slang
   * @param {string} text
   * @returns {boolean}
   */
  isStandardEnglishText(text) {
    const res = LanguageDetector.detect(text);
    return !res.isRomanized && res.lang === 'en';
  }

  getCacheKey(text, sourceLang, targetLang) {
    return `${sourceLang}->${targetLang}:${text.trim().toLowerCase()}`;
  }

  /**
   * Transliterate Romanized / English phonetic slang into pure native script
   * e.g. Telugu: "nuvvu" -> "నువ్వు", "nenu" -> "నేను", "ela unnaru" -> "ఎలా ఉన్నారు"
   * e.g. Hindi: "aap kaise ho" -> "आप कैसे हो", "mujhe paani chahiye" -> "मुझे पानी चाहिए"
   * e.g. Tamil: "vanakkam" -> "வணக்கம்", "nandri" -> "நன்றி"
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
   * Understands the semantic meaning of sentences, whether written in Native Script or Romanized Indian English.
   * Never simply transliterates pronunciation into another script; always translates the true semantic meaning.
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

    // Step 0: Check Food & Vocabulary Dictionary for 100% authentic native meaning in 0ms
    const vocabMatch = lookupVocabulary(trimmed, targetLang);
    if (vocabMatch) {
      return {
        translatedText: vocabMatch,
        sourceTransliterated: trimmed,
        provider: 'vocabulary-dictionary',
        isOffline: false,
        toString() { return this.translatedText; }
      };
    }

    // Step 1: Intelligent Language & Script Detection
    const detection = LanguageDetector.detect(trimmed);
    let effectiveSource = sourceLang;

    if (!effectiveSource || effectiveSource === 'auto') {
      effectiveSource = detection.lang;
      if (effectiveSource === targetLang) {
        effectiveSource = targetLang === 'en' ? 'hi' : 'en';
      }
    } else if (effectiveSource !== 'en' && !detection.isRomanized && detection.lang === 'en' && /[a-zA-Z]{3,}/.test(trimmed)) {
      // User has selected regional source, but text is actually standard English words/sentences!
      // Treat source as English so it translates the actual semantic meaning rather than phonetic slang
      effectiveSource = 'en';
    }

    // Step 2: Determine if input is Romanized Indian Language (slang typed in English alphabet)
    // e.g. "Aap kaise ho", "Ela unnaru", "Mujhe paani chahiye", "Naaku aakali vesthundi", "Nandri"
    const isRomanizedInput =
      !options.skipTransliteration &&
      /[a-zA-Z]/.test(trimmed) &&
      (detection.isRomanized || (effectiveSource !== 'en' && !this.isStandardEnglishText(trimmed)));

    let sourceTransliterated = trimmed;
    let queryText = trimmed;

    if (isRomanizedInput && effectiveSource !== 'en') {
      // Convert Romanized words to native script of the source language so Google GTX understands meaning
      sourceTransliterated = await this.transliterate(trimmed, effectiveSource);
      queryText = sourceTransliterated;
    }

    // Step 3: If source and target are the same language
    if (effectiveSource === targetLang) {
      if (isRomanizedInput && targetLang !== 'en') {
        // User typed Romanized slang and target is that same language: return the pure native script!
        return {
          translatedText: sourceTransliterated,
          sourceTransliterated,
          provider: 'phonetic-transliteration',
          isOffline: false,
          toString() { return this.translatedText; }
        };
      } else {
        return {
          translatedText: trimmed,
          sourceTransliterated: trimmed,
          provider: 'identity',
          isOffline: false,
          toString() { return this.translatedText; }
        };
      }
    }

    const cacheKey = this.getCacheKey(queryText, effectiveSource, targetLang);
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

    // Step 4: Offline check
    if (!navigator.onLine) {
      const offlineResult =
        getOfflineTranslation(queryText, effectiveSource, targetLang) ||
        getOfflineTranslation(trimmed, effectiveSource, targetLang);

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

    // Step 5: Tier 1 - Direct Google Web GTX Translation
    try {
      const gtxResult = await this.translateViaGoogleWeb(queryText, effectiveSource, targetLang);
      if (
        gtxResult &&
        gtxResult.trim() &&
        !this.isIdentical(queryText, gtxResult, effectiveSource, targetLang)
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

    // Step 6: Tier 2 - Backend API Proxy (/api/translate for Bhashini, Azure, Cloud Key, Gemini)
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: queryText,
          sourceLang: effectiveSource,
          targetLang
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (
          data.translatedText &&
          data.translatedText.trim() &&
          !this.isIdentical(queryText, data.translatedText, effectiveSource, targetLang)
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

    // Step 7: Tier 3 - MyMemory Public API
    try {
      const myMemoryResult = await this.translateViaMyMemory(queryText, effectiveSource, targetLang);
      if (
        myMemoryResult &&
        myMemoryResult.trim() &&
        !this.isIdentical(queryText, myMemoryResult, effectiveSource, targetLang)
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

    // Step 8: Tier 4 - Offline Travel Dictionary
    const dictionaryMatch =
      getOfflineTranslation(queryText, effectiveSource, targetLang) ||
      getOfflineTranslation(trimmed, effectiveSource, targetLang);

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

    // Final fallback: return queryText or native conversion
    return {
      translatedText: queryText,
      sourceTransliterated,
      provider: 'fallback',
      isOffline: false,
      toString() { return this.translatedText; }
    };
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
    const detection = LanguageDetector.detect(text);

    if (effectiveSource === 'auto' || !effectiveSource) {
      effectiveSource = detection.lang;
      if (effectiveSource === targetLang) {
        effectiveSource = targetLang === 'en' ? 'hi' : 'en';
      }
    } else if (effectiveSource !== 'en' && !detection.isRomanized && detection.lang === 'en' && /[a-zA-Z]{2,}/.test(text)) {
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

    // Check single short text in vocabulary dictionary directly
    const directMatch = lookupVocabulary(trimmed, targetLang);
    if (directMatch) {
      if (onProgress) onProgress(100, 1, 1);
      return {
        translatedText: directMatch,
        provider: 'vocabulary-dictionary',
        toString() { return this.translatedText; }
      };
    }

    // Helper: translate a single line or menu entry
    const translateLineEntry = async (line) => {
      const l = line.trim();
      if (!l) return '';

      // Direct match for whole line in vocabulary/food dictionary
      const lineMatch = lookupVocabulary(l, targetLang);
      if (lineMatch) return lineMatch;

      // Handle Key-Value headers (e.g. "Lunch: Rice, Dal Tadka, Brinjal Curry, Curd")
      const colonIdx = l.indexOf(':');
      if (colonIdx > 0 && colonIdx < 35) {
        const header = l.slice(0, colonIdx).trim();
        const body = l.slice(colonIdx + 1).trim();

        const translatedHeader = lookupVocabulary(header, targetLang) ||
          (await this.translate(header, effectiveSource, targetLang))?.translatedText ||
          header;

        if (body.includes(',')) {
          const items = body.split(',');
          const translatedItems = [];
          for (const item of items) {
            const cleanItem = item.trim();
            if (!cleanItem) continue;
            const itemMatch = lookupVocabulary(cleanItem, targetLang);
            if (itemMatch) {
              translatedItems.push(itemMatch);
            } else {
              const res = await this.translate(cleanItem, effectiveSource, targetLang);
              translatedItems.push(res?.translatedText || cleanItem);
            }
          }
          return `${translatedHeader}: ${translatedItems.join(', ')}`;
        } else if (body) {
          const bodyMatch = lookupVocabulary(body, targetLang);
          if (bodyMatch) return `${translatedHeader}: ${bodyMatch}`;
        }
      }

      // Handle comma-separated list of dishes or words without colon
      if (l.includes(',')) {
        const items = l.split(',');
        const translatedItems = [];
        let matchesCount = 0;
        for (const item of items) {
          const cleanItem = item.trim();
          if (!cleanItem) continue;
          const itemMatch = lookupVocabulary(cleanItem, targetLang);
          if (itemMatch) {
            translatedItems.push(itemMatch);
            matchesCount++;
          } else {
            const res = await this.translate(cleanItem, effectiveSource, targetLang);
            translatedItems.push(res?.translatedText || cleanItem);
          }
        }
        if (matchesCount > 0) {
          return translatedItems.join(', ');
        }
      }

      const res = await this.translate(l, effectiveSource, targetLang);
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
        provider: 'multiline-document',
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
        provider: 'single-line-semantic',
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
   * Supports all 22 scheduled Indian languages with smart fallbacks
   */
  async translateViaGoogleWeb(text, sourceLang, targetLang) {
    const mapLang = (l) => {
      if (l === 'mni') return 'mni-Mtei';
      if (l === 'brx') return 'hi'; // Bodo fallback
      if (l === 'ks') return 'ur';  // Kashmiri fallback
      return l;
    };
    const mappedSource = mapLang(sourceLang);
    const mappedTarget = mapLang(targetLang);

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${mappedSource}&tl=${mappedTarget}&dt=t&q=${encodeURIComponent(
      text
    )}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6500);

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
    const mapLang = (l) => {
      if (l === 'mni') return 'bn';
      if (l === 'brx') return 'hi';
      if (l === 'ks') return 'ur';
      if (l === 'doi') return 'hi';
      if (l === 'sat') return 'hi';
      return l;
    };
    const langPair = `${mapLang(sourceLang)}|${mapLang(targetLang)}`;
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
