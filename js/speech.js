/**
 * Bharat Translator - Web Speech & Audio Engine v2.2.0
 * Features:
 * - Native Speech-to-Text without audio device lock contention
 * - Seamless fallback for Edge / regional speech models
 * - Direct Google Chrome integration support
 * - Text-to-Speech with regional voices
 */

import { getLanguage } from './config.js';

class SpeechEngine {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.currentActiveId = null;
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.availableVoices = [];
    this.voicesLoaded = false;

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
            fallbackNote: `Using ${fbMatch.name} voice fallback.`
          };
        }
      }
    }

    const defaultVoice = voices.find((v) => v.default) || voices[0] || null;
    return {
      voice: defaultVoice,
      fallbackUsed: true,
      fallbackNote: `Native voice for ${langObj.name} is not installed on this browser.`
    };
  }

  speak(text, langId, options = {}) {
    if (!this.isSynthesisSupported() || !text || !text.trim()) return false;

    this.synth.cancel();
    const langObj = getLanguage(langId);
    const { voice, fallbackUsed, fallbackNote } = this.getBestVoice(langId);

    if (fallbackUsed && fallbackNote && options.onFallbackNotice) {
      options.onFallbackNotice(fallbackNote);
    }

    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.lang = langObj ? langObj.speechCode : 'en-IN';
    if (voice) utterance.voice = voice;
    utterance.rate = options.rate || 0.95;
    utterance.pitch = options.pitch || 1.0;

    if (options.onStart) utterance.onstart = options.onStart;
    if (options.onEnd) utterance.onend = options.onEnd;
    if (options.onError) utterance.onerror = (e) => options.onError({ message: e.error });

    try {
      this.synth.speak(utterance);
      return true;
    } catch (e) {
      return false;
    }
  }

  stopSpeaking() {
    if (this.synth) this.synth.cancel();
  }
}

export const speechEngine = new SpeechEngine();
