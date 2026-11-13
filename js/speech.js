/**
 * Bharat Translator - Web Speech & Audio Engine v2.4.1
 * Features:
 * - High Definition Cloud Voice Streaming (Native Telugu, Hindi, Tamil, Kannada, Malayalam, Bengali, Marathi, etc.)
 * - Zero-install speech: Works out of the box on all phones, Windows, Mac, Linux, and iOS without downloading OS voice packs
 * - Seamless fallback to Web Speech API
 * - Native Speech-to-Text without audio device lock contention
 * - Seamless fallback for Edge / regional speech models
 */

import { getLanguage } from './config.js';

// Cloud Native Speech Mapping for all Indian languages + English
const CLOUD_TTS_MAP = {
  te: 'te',       // Telugu (Native)
  hi: 'hi',       // Hindi (Native)
  ta: 'ta',       // Tamil (Native)
  kn: 'kn',       // Kannada (Native)
  ml: 'ml',       // Malayalam (Native)
  bn: 'bn',       // Bengali (Native)
  mr: 'mr',       // Marathi (Native)
  gu: 'gu',       // Gujarati (Native)
  pa: 'pa',       // Punjabi (Native)
  ur: 'ur',       // Urdu (Native)
  en: 'en-IN',    // Indian English (Native)
  ne: 'ne',       // Nepali (Native)
  sd: 'sd',       // Sindhi (Native)
  as: 'bn',       // Assamese (Bengali-Assamese phonetic model)
  or: 'bn',       // Odia (Eastern Indic phonetic model)
  sa: 'hi',       // Sanskrit (Devanagari phonetic model)
  kok: 'mr',      // Konkani (Marathi-Devanagari phonetic model)
  mai: 'hi',      // Maithili (Bihari-Devanagari phonetic model)
  doi: 'hi',      // Dogri (Northern Indic phonetic model)
  brx: 'hi',      // Bodo (Devanagari phonetic model)
  sat: 'hi',      // Santali (Devanagari phonetic model)
  ks: 'ur',       // Kashmiri (Perso-Arabic Urdu phonetic model)
  mni: 'bn'       // Manipuri (Meetei-Bengali phonetic model)
};

class SpeechEngine {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.currentActiveId = null;
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.availableVoices = [];
    this.voicesLoaded = false;
    this.currentAudio = null;

    this.initVoices();
  }

  initVoices() {
    if (!this.synth) return;
    const load = () => {
      this.availableVoices = this.synth.getVoices() || [];
      if (this.availableVoices.length > 0) this.voicesLoaded = true;
    };
    load();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = load;
    }
  }

  isRecognitionSupported() {
    return (
      typeof window !== 'undefined' &&
      ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
    );
  }

  isSynthesisSupported() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  isEdge() {
    return typeof navigator !== 'undefined' && /Edg\//.test(navigator.userAgent);
  }

  isChrome() {
    return (
      typeof navigator !== 'undefined' &&
      /Chrome\//.test(navigator.userAgent) &&
      !/Edg\//.test(navigator.userAgent)
    );
  }

  /**
   * Split long text into speakable sentence chunks of <= 180 chars so audio streaming never truncates
   * @param {string} text
   * @param {number} maxLen
   * @returns {string[]}
   */
  splitTextForSpeech(text, maxLen = 180) {
    if (!text || typeof text !== 'string') return [];
    const clean = text.trim();
    if (clean.length <= maxLen) return [clean];

    const sentences = clean.split(/([.!?:;\n।|]+)/);
    const chunks = [];
    let current = '';

    for (let i = 0; i < sentences.length; i++) {
      const part = sentences[i];
      if (!part) continue;

      if ((current + part).length <= maxLen) {
        current += part;
      } else {
        if (current.trim()) chunks.push(current.trim());
        if (part.length <= maxLen) {
          current = part;
        } else {
          // Break at word boundaries
          const words = part.split(/\s+/);
          let wChunk = '';
          for (const w of words) {
            if ((wChunk + ' ' + w).length <= maxLen) {
              wChunk += (wChunk ? ' ' : '') + w;
            } else {
              if (wChunk.trim()) chunks.push(wChunk.trim());
              wChunk = w;
            }
          }
          current = wChunk;
        }
      }
    }
    if (current.trim()) chunks.push(current.trim());
    return chunks.length > 0 ? chunks : [clean.slice(0, maxLen)];
  }

  /**
   * Start Speech Recognition cleanly without hardware stream collisions
   */
  startListening({
    langCode,
    sessionId = 'default',
    onInterim,
    onFinal,
    onError,
    onEnd,
    retryStep = 0
  }) {
    // 1. Cleanly stop any existing recognition session
    this.stopListening();

    if (!this.isRecognitionSupported()) {
      if (onError) {
        onError({
          code: 'not-supported',
          message: 'Speech recognition is not supported in this browser. Please open in Google Chrome!'
        });
      }
      return false;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;

    // Use selected language, or fall back to Indian English/slang model on retry
    let effectiveLang = langCode || 'hi-IN';
    if (retryStep === 1) {
      effectiveLang = 'en-IN'; // Indian phonetic model handles slang like 'nuvvu', 'nenu'
    }

    this.recognition.lang = effectiveLang;
    this.currentActiveId = sessionId;

    let finalTranscript = '';
    let hasResult = false;

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
          hasResult = true;
        } else {
          interim += transcript;
        }
      }

      if (interim && onInterim) onInterim(interim);
      if (finalTranscript && onFinal) onFinal(finalTranscript);
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      console.warn(`[Speech Engine] ${event.error} on '${effectiveLang}' (retryStep: ${retryStep})`);

      // Auto-fallback once: if regional code failed with network/unsupported, retry with en-IN
      if (
        (event.error === 'network' || event.error === 'language-not-supported') &&
        retryStep === 0 &&
        effectiveLang !== 'en-IN' &&
        !hasResult
      ) {
        console.log(`[Speech Engine] Retrying with Indian English/slang speech model (en-IN)...`);
        this.stopListening();
        setTimeout(() => {
          this.startListening({
            langCode: 'en-IN',
            sessionId,
            onInterim,
            onFinal,
            onError,
            onEnd,
            retryStep: 1
          });
        }, 350);
        return;
      }

      if (event.error === 'aborted') {
        return; // Normal abort, no error toast needed
      }

      let msg = 'Speech recognition error.';
      switch (event.error) {
        case 'not-allowed':
        case 'service-not-allowed':
          msg = 'Microphone permission blocked. Please click the lock icon in the address bar and set Microphone to "Allow".';
          break;
        case 'no-speech':
          msg = 'No speech detected. Please speak closer to the mic, or use the quick slang words below!';
          break;
        case 'network':
          msg = this.isEdge()
            ? 'Edge speech service had a network timeout. Click "Open in Chrome" at the top for full voice support, or type slang below!'
            : 'Cloud speech service unreachable. Click "Open in Chrome" for native speech or type slang directly below!';
          break;
        case 'audio-capture':
          msg = 'Microphone not detected or in use by another app. Please check your mic connection.';
          break;
        default:
          msg = `Mic notice: ${event.error}. You can also type your slang words directly!`;
      }

      if (onError) onError({ code: event.error, message: msg });
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.currentActiveId = null;
      if (onEnd) onEnd(finalTranscript);
    };

    try {
      this.recognition.start();
      return true;
    } catch (e) {
      this.isListening = false;
      if (onError) onError({ code: 'start-failed', message: e.message });
      return false;
    }
  }

  stopListening() {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {}
      this.recognition = null;
    }
    this.isListening = false;
    this.currentActiveId = null;
  }

  getBestVoice(langId) {
    if (!this.synth) return { voice: null, fallbackUsed: false, fallbackNote: null };
    const langObj = getLanguage(langId);
    if (!langObj) return { voice: null, fallbackUsed: false, fallbackNote: null };

    const voices = this.synth.getVoices() || this.availableVoices;
    const targetCode = langObj.speechCode.toLowerCase();
    const shortCode = langObj.code.toLowerCase();

    let match = voices.find(
      (v) =>
        v.lang.toLowerCase() === targetCode ||
        v.lang.toLowerCase().replace('_', '-') === targetCode
    );

    if (!match) {
      match = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith(`${shortCode}-`) ||
          v.lang.toLowerCase() === shortCode
      );
    }

    if (match) return { voice: match, fallbackUsed: false, fallbackNote: null };

    if (langObj.fallbackSpeechCodes) {
      for (const fb of langObj.fallbackSpeechCodes) {
        const fbLower = fb.toLowerCase();
        const fbMatch = voices.find((v) => v.lang.toLowerCase() === fbLower);
        if (fbMatch) {
          return {
            voice: fbMatch,
            fallbackUsed: true,
            fallbackNote: null
          };
        }
      }
    }

    const defaultVoice = voices.find((v) => v.default) || voices[0] || null;
    return {
      voice: defaultVoice,
      fallbackUsed: true,
      fallbackNote: null
    };
  }

  /**
   * High-Fidelity Text-to-Speech Engine
   * 1. Uses Cloud Audio Streaming for authentic native Indian pronunciation (Telugu, Hindi, Tamil, Kannada, etc.)
   * 2. Requires zero local voice packs installed on user's device
   * 3. Seamlessly falls back to local Web Speech API if offline
   * @param {string} text
   * @param {string} langId
   * @param {object} [options]
   * @returns {boolean}
   */
  speak(text, langId, options = {}) {
    if (!text || !text.trim()) return false;
    this.stopSpeaking();

    const trimmed = text.trim();
    const cloudCode = CLOUD_TTS_MAP[langId];

    // Priority 1: High Definition Cloud Voice Streaming (Native Accent, Zero Installation)
    if (typeof window !== 'undefined' && navigator.onLine && cloudCode) {
      const chunks = this.splitTextForSpeech(trimmed);
      let idx = 0;

      const playNextChunk = () => {
        if (idx >= chunks.length) {
          this.currentAudio = null;
          if (options.onEnd) options.onEnd();
          return;
        }

        const chunk = chunks[idx++];
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(
          cloudCode
        )}&q=${encodeURIComponent(chunk)}`;

        const audio = new Audio(url);
        this.currentAudio = audio;

        if (options.rate && typeof audio.playbackRate !== 'undefined') {
          audio.playbackRate = Math.min(2.0, Math.max(0.5, options.rate));
        }

        audio.onended = () => {
          playNextChunk();
        };

        audio.onerror = (e) => {
          console.warn('Cloud audio stream encountered an error, falling back to Web Speech API', e);
          this.currentAudio = null;
          this.speakViaWebSpeech(trimmed, langId, options);
        };

        if (idx === 1 && options.onStart) {
          options.onStart();
        }

        audio.play().catch((playErr) => {
          console.warn('HTML5 Audio playback prevented, falling back to Web Speech API', playErr);
          this.currentAudio = null;
          this.speakViaWebSpeech(trimmed, langId, options);
        });
      };

      try {
        playNextChunk();
        return true;
      } catch (e) {
        console.warn('Failed to start cloud audio queue, using Web Speech fallback', e);
      }
    }

    // Priority 2: Web Speech Synthesis API Fallback
    return this.speakViaWebSpeech(trimmed, langId, options);
  }

  /**
   * Local Web Speech Synthesis Fallback
   */
  speakViaWebSpeech(text, langId, options = {}) {
    if (!this.isSynthesisSupported() || !text || !text.trim()) return false;

    this.synth.cancel();
    const langObj = getLanguage(langId);
    const { voice } = this.getBestVoice(langId);

    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.lang = langObj ? langObj.speechCode : 'en-IN';
    if (voice) utterance.voice = voice;
    utterance.rate = options.rate || 0.95;
    utterance.pitch = options.pitch || 1.0;

    if (options.onStart) utterance.onstart = options.onStart;
    if (options.onEnd) utterance.onend = options.onEnd;
    if (options.onError) utterance.onerror = (e) => options.onError && options.onError({ message: e.error });

    try {
      this.synth.speak(utterance);
      return true;
    } catch (e) {
      return false;
    }
  }

  stopSpeaking() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (e) {}
      this.currentAudio = null;
    }
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }
  }
}

export const speechEngine = new SpeechEngine();
