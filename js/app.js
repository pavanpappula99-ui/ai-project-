/**
 * Bharat Translator - Main Application Controller
 * Coordinates UI, Speech Engine, Translation Engine, and Storage.
 */

import { LANGUAGES, getLanguageLabel, getLanguage, DEFAULT_SOURCE_LANG, DEFAULT_TARGET_LANG } from './config.js';
import { CATEGORIES, PRESET_PHRASES, LANGUAGE_SLANG_CHIPS } from './phrases.js';
import { speechEngine } from './speech.js';
import { translationEngine } from './translator.js';
import { storage } from './storage.js';

// Application State
const state = {
  sourceLang: DEFAULT_SOURCE_LANG,
  targetLang: DEFAULT_TARGET_LANG,
  isConversationMode: false,
  activeMicSpeaker: null, // 'source', 'person1', 'person2'
  debounceTimer: null,
  isTranslating: false,
  isSpeaking: false,
  selectedCategory: 'all',
  searchQuery: ''
};

// DOM Elements
const elements = {
  // Theme & Navigation
  html: document.documentElement,
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  openChromeBtn: document.getElementById('openChromeBtn'),
  browserNoticeBanner: document.getElementById('browserNoticeBanner'),
  bannerOpenChromeBtn: document.getElementById('bannerOpenChromeBtn'),
  closeBannerBtn: document.getElementById('closeBannerBtn'),
  toggleConvModeBtn: document.getElementById('toggleConvModeBtn'),
  openPhrasesBtn: document.getElementById('openPhrasesBtn'),
  openSettingsBtn: document.getElementById('openSettingsBtn'),
  toastNotice: document.getElementById('toastNotice'),

  // Sections
  dualPanelSection: document.getElementById('dualPanelSection'),
  conversationSection: document.getElementById('conversationSection'),

  // Dual Panel: Left
  sourceLangSelect: document.getElementById('sourceLangSelect'),
  sourceTextInput: document.getElementById('sourceTextInput'),
  sourceSlangChips: document.getElementById('sourceSlangChips'),
  sourceTranslitPreview: document.getElementById('sourceTranslitPreview'),
  sourceTranslitText: document.getElementById('sourceTranslitText'),
  useTranslitBtn: document.getElementById('useTranslitBtn'),
  sourceLiveStatus: document.getElementById('sourceLiveStatus'),
  sourceLiveText: document.getElementById('sourceLiveText'),
  clearSourceBtn: document.getElementById('clearSourceBtn'),
  sourceMicBtn: document.getElementById('sourceMicBtn'),
  sourceTtsBtn: document.getElementById('sourceTtsBtn'),
  sourceCharCount: document.getElementById('sourceCharCount'),
  manualTranslateBtn: document.getElementById('manualTranslateBtn'),

  // Swap
  swapLanguagesBtn: document.getElementById('swapLanguagesBtn'),

  // Dual Panel: Right
  targetLangSelect: document.getElementById('targetLangSelect'),
  targetTextOutput: document.getElementById('targetTextOutput'),
  translatingLoader: document.getElementById('translatingLoader'),
  targetTtsBtn: document.getElementById('targetTtsBtn'),
  copyTranslatedBtn: document.getElementById('copyTranslatedBtn'),
  starFavoriteBtn: document.getElementById('starFavoriteBtn'),
  providerBadge: document.getElementById('providerBadge'),

  // Conversation Mode
  convStatusDot: document.getElementById('convStatusDot'),
  convStatusText: document.getElementById('convStatusText'),
  convHistoryFeed: document.getElementById('convHistoryFeed'),
  convLiveBanner: document.getElementById('convLiveBanner'),
  convLiveSpeakerTag: document.getElementById('convLiveSpeakerTag'),
  convLiveTranscript: document.getElementById('convLiveTranscript'),
  convSlangChips: document.getElementById('convSlangChips'),
  convTextInput: document.getElementById('convTextInput'),
  convSendPerson1Btn: document.getElementById('convSendPerson1Btn'),
  convSendPerson2Btn: document.getElementById('convSendPerson2Btn'),
  convSendYouLabel: document.getElementById('convSendYouLabel'),
  convSendPartnerLabel: document.getElementById('convSendPartnerLabel'),
  convPerson1MicBtn: document.getElementById('convPerson1MicBtn'),
  convPerson2MicBtn: document.getElementById('convPerson2MicBtn'),
  convPerson1LangName: document.getElementById('convPerson1LangName'),
  convPerson2LangName: document.getElementById('convPerson2LangName'),
  clearConvHistoryBtn: document.getElementById('clearConvHistoryBtn'),
  exitConvModeBtn: document.getElementById('exitConvModeBtn'),

  // Phrases Modal
  phrasesModal: document.getElementById('phrasesModal'),
  closePhrasesBtn: document.getElementById('closePhrasesBtn'),
  phraseCategoryTabs: document.getElementById('phraseCategoryTabs'),
  phraseSearchInput: document.getElementById('phraseSearchInput'),
  phrasesListContainer: document.getElementById('phrasesListContainer'),

  // Settings Modal
  settingsModal: document.getElementById('settingsModal'),
  closeSettingsBtn: document.getElementById('closeSettingsBtn'),
  speechRateRange: document.getElementById('speechRateRange'),
  speechRateValue: document.getElementById('speechRateValue'),
  autoSpeakCheckbox: document.getElementById('autoSpeakCheckbox'),
  deviceVoicesDiagnostic: document.getElementById('deviceVoicesDiagnostic')
};

// ============================================================================
// Initialization
// ============================================================================
function initApp() {
  loadSavedSettings();
  populateLanguageDropdowns();
  renderSlangChips(state.sourceLang);
  bindEventListeners();
  renderHistoryFeed();
  registerServiceWorker();
  updateStarState();
}

// Load saved settings & theme
function loadSavedSettings() {
  const settings = storage.getSettings();
  state.sourceLang = settings.sourceLang || DEFAULT_SOURCE_LANG;
  state.targetLang = settings.targetLang || DEFAULT_TARGET_LANG;

  // Apply Theme
  elements.html.setAttribute('data-theme', settings.theme || 'dark');

  // Apply sliders
  if (elements.speechRateRange) {
    elements.speechRateRange.value = settings.speechRate || 0.95;
    elements.speechRateValue.textContent = `${elements.speechRateRange.value}x`;
  }
  if (elements.autoSpeakCheckbox) {
    elements.autoSpeakCheckbox.checked = settings.autoSpeakTranslation !== false;
  }
}

// Register PWA Service Worker
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js')
        .then((reg) => console.log('Service Worker registered:', reg.scope))
        .catch((err) => console.warn('Service Worker registration skipped:', err));
    });
  }
}

// ============================================================================
// Language Dropdowns (Sorted A to Z)
// ============================================================================
function populateLanguageDropdowns() {
  // Clear existing
  elements.sourceLangSelect.innerHTML = '';
  elements.targetLangSelect.innerHTML = '';

  // LANGUAGES array in config.js is pre-sorted A to Z
  LANGUAGES.forEach((lang) => {
    const optSource = document.createElement('option');
    optSource.value = lang.id;
    optSource.textContent = getLanguageLabel(lang);
    if (lang.id === state.sourceLang) optSource.selected = true;
    elements.sourceLangSelect.appendChild(optSource);

    const optTarget = document.createElement('option');
    optTarget.value = lang.id;
    optTarget.textContent = getLanguageLabel(lang);
    if (lang.id === state.targetLang) optTarget.selected = true;
    elements.targetLangSelect.appendChild(optTarget);
  });

  updateConversationLabels();
}

function updateConversationLabels() {
  const sLang = getLanguage(state.sourceLang);
  const tLang = getLanguage(state.targetLang);

  if (elements.convPerson1LangName && sLang) {
    elements.convPerson1LangName.textContent = getLanguageLabel(sLang);
  }
  if (elements.convPerson2LangName && tLang) {
    elements.convPerson2LangName.textContent = getLanguageLabel(tLang);
  }
  if (elements.convSendYouLabel && sLang) {
    elements.convSendYouLabel.textContent = `YOU (${sLang.name})`;
  }
  if (elements.convSendPartnerLabel && tLang) {
    elements.convSendPartnerLabel.textContent = `PARTNER (${tLang.name})`;
  }
}

// Render dynamic 1-tap quick slang chips for speaking language
function renderSlangChips(langId) {
  const chips = LANGUAGE_SLANG_CHIPS[langId] || (langId !== 'en' ? LANGUAGE_SLANG_CHIPS['te'] : []);

  // Left Panel Slang Palette
  if (elements.sourceSlangChips) {
    elements.sourceSlangChips.innerHTML = '';
    if (chips.length === 0) {
      elements.sourceSlangChips.parentElement.classList.add('hidden');
    } else {
      elements.sourceSlangChips.parentElement.classList.remove('hidden');
      chips.forEach((c) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'slang-chip';
        btn.innerHTML = `<span class="slang-word">${c.slang}</span> <span class="slang-native-sub">(${c.native})</span>`;
        btn.title = `Meaning: ${c.meaning}`;
        btn.addEventListener('click', () => {
          elements.sourceTextInput.value = c.slang;
          handleSourceTextChange();
        });
        elements.sourceSlangChips.appendChild(btn);
      });
    }
  }

  // Conversation Mode Slang Palette
  if (elements.convSlangChips) {
    elements.convSlangChips.innerHTML = '';
    if (chips.length === 0) {
      elements.convSlangChips.parentElement.classList.add('hidden');
    } else {
      elements.convSlangChips.parentElement.classList.remove('hidden');
      chips.forEach((c) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'slang-chip';
        btn.innerHTML = `<span class="slang-word">${c.slang}</span> <span class="slang-native-sub">(${c.native})</span>`;
        btn.title = `Send "${c.slang}" (${c.meaning})`;
        btn.addEventListener('click', () => {
          sendConversationTextMessage('person1', c.slang);
        });
        elements.convSlangChips.appendChild(btn);
      });
    }
  }
}

// ============================================================================
// Event Binding
// ============================================================================
function bindEventListeners() {
  // --- Theme Toggle ---
  elements.themeToggleBtn.addEventListener('click', toggleTheme);

  // --- Conversation Mode Toggle ---
  elements.toggleConvModeBtn.addEventListener('click', toggleConversationMode);
  elements.exitConvModeBtn.addEventListener('click', () => setConversationMode(false));

  // --- Language Select Changes ---
  elements.sourceLangSelect.addEventListener('change', (e) => {
    state.sourceLang = e.target.value;
    storage.saveSettings({ sourceLang: state.sourceLang });
    updateConversationLabels();
    renderSlangChips(state.sourceLang);
    handleSourceTextChange();
    updateStarState();
  });

  elements.targetLangSelect.addEventListener('change', (e) => {
    state.targetLang = e.target.value;
    storage.saveSettings({ targetLang: state.targetLang });
    updateConversationLabels();
    handleSourceTextChange();
    updateStarState();
  });

  // --- Launch Google Chrome Handlers ---
  const launchChrome = async () => {
    showToast('Launching Google Chrome with Bharat Translator...');
    try {
      const res = await fetch('/api/open-chrome', { method: 'POST' });
      const data = await res.json();
      if (data.status === 'ok') {
        showToast('Google Chrome launched! Full native voice recognition ready.');
      } else {
        showToast('Please open Google Chrome and visit http://localhost:3000');
      }
    } catch (e) {
      showToast('Please open Google Chrome and visit http://localhost:3000');
    }
  };

  if (elements.openChromeBtn) {
    elements.openChromeBtn.addEventListener('click', launchChrome);
  }
  if (elements.bannerOpenChromeBtn) {
    elements.bannerOpenChromeBtn.addEventListener('click', launchChrome);
  }
  if (elements.closeBannerBtn) {
    elements.closeBannerBtn.addEventListener('click', () => {
      if (elements.browserNoticeBanner) {
        elements.browserNoticeBanner.classList.add('hidden');
      }
    });
  }

  // Show voice notice banner in Microsoft Edge
  if (elements.browserNoticeBanner && speechEngine.isEdge()) {
    elements.browserNoticeBanner.classList.remove('hidden');
  }

  // --- Swap Languages Button (⇄) ---
  elements.swapLanguagesBtn.addEventListener('click', swapLanguages);

  // --- Source Text Area Typing & Debounce ---
  elements.sourceTextInput.addEventListener('input', handleSourceTextChange);
  elements.clearSourceBtn.addEventListener('click', clearSourceText);
  elements.manualTranslateBtn.addEventListener('click', triggerManualTranslation);

  // --- Phonetic Transliteration Use Button ---
  if (elements.useTranslitBtn) {
    elements.useTranslitBtn.addEventListener('click', () => {
      if (elements.sourceTranslitText && elements.sourceTranslitText.textContent) {
        elements.sourceTextInput.value = elements.sourceTranslitText.textContent;
        elements.sourceTranslitPreview.classList.add('hidden');
        handleSourceTextChange();
      }
    });
  }

  // --- Text-To-Speech Buttons ---
  elements.sourceTtsBtn.addEventListener('click', () => {
    const text = elements.sourceTextInput.value;
    speakText(text, state.sourceLang);
  });

  elements.targetTtsBtn.addEventListener('click', () => {
    const text = getTargetText();
    speakText(text, state.targetLang);
  });

  // --- Copy to Clipboard ---
  elements.copyTranslatedBtn.addEventListener('click', copyTranslatedText);

  // --- Star / Favorite Button ---
  elements.starFavoriteBtn.addEventListener('click', toggleFavorite);

  // --- Microphone Speech-to-Text (Dual Panel) ---
  elements.sourceMicBtn.addEventListener('click', toggleSourceMic);

  // --- Conversation Mode Dual Microphones ---
  elements.convPerson1MicBtn.addEventListener('click', () => toggleConversationMic('person1'));
  elements.convPerson2MicBtn.addEventListener('click', () => toggleConversationMic('person2'));
  elements.clearConvHistoryBtn.addEventListener('click', clearConversationHistory);

  // --- Conversation Mode Quick Text & Slang Input ---
  if (elements.convSendPerson1Btn) {
    elements.convSendPerson1Btn.addEventListener('click', () => sendConversationTextMessage('person1'));
  }
  if (elements.convSendPerson2Btn) {
    elements.convSendPerson2Btn.addEventListener('click', () => sendConversationTextMessage('person2'));
  }
  if (elements.convTextInput) {
    elements.convTextInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        sendConversationTextMessage('person1');
      }
    });
  }

  // --- Modals ---
  if (elements.openPhrasesBtn) {
    elements.openPhrasesBtn.addEventListener('click', openPhrasesModal);
  }
  elements.closePhrasesBtn.addEventListener('click', closePhrasesModal);
  elements.openSettingsBtn.addEventListener('click', openSettingsModal);
  elements.closeSettingsBtn.addEventListener('click', closeSettingsModal);

  // Close modals on backdrop click
  window.addEventListener('click', (e) => {
    if (e.target === elements.phrasesModal) closePhrasesModal();
    if (e.target === elements.settingsModal) closeSettingsModal();
  });

  // Phrases category tabs & search
  elements.phraseCategoryTabs.addEventListener('click', (e) => {
    const tab = e.target.closest('.cat-tab');
    if (!tab) return;
    elements.phraseCategoryTabs.querySelectorAll('.cat-tab').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    state.selectedCategory = tab.dataset.category;
    renderPhrasesList();
  });

  elements.phraseSearchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.toLowerCase().trim();
    renderPhrasesList();
  });

  // Settings inputs
  elements.speechRateRange.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    elements.speechRateValue.textContent = `${val}x`;
    storage.saveSettings({ speechRate: val });
  });

  elements.autoSpeakCheckbox.addEventListener('change', (e) => {
    storage.saveSettings({ autoSpeakTranslation: e.target.checked });
  });
}

// ============================================================================
// Theming
// ============================================================================
function toggleTheme() {
  const current = elements.html.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  elements.html.setAttribute('data-theme', next);
  storage.saveSettings({ theme: next });
  showToast(`Switched to ${next} theme`);
}

// ============================================================================
// Dual Panel Translation & Typing Handlers
// ============================================================================
function handleSourceTextChange() {
  const text = elements.sourceTextInput.value;
  const count = text.length;

  elements.sourceCharCount.textContent = `${count} char${count === 1 ? '' : 's'}`;
  elements.clearSourceBtn.classList.toggle('hidden', count === 0);

  if (!text.trim()) {
    setTargetText('');
    elements.providerBadge.textContent = 'Ready';
    updateStarState();
    return;
  }

  // Debounced translation as user types
  clearTimeout(state.debounceTimer);
  state.debounceTimer = setTimeout(() => {
    performTranslation(text, state.sourceLang, state.targetLang);
  }, 650);
}

function clearSourceText() {
  elements.sourceTextInput.value = '';
  setTargetText('');
  elements.sourceCharCount.textContent = '0 chars';
  elements.clearSourceBtn.classList.add('hidden');
  if (elements.sourceTranslitPreview) {
    elements.sourceTranslitPreview.classList.add('hidden');
    elements.sourceTranslitText.textContent = '';
  }
  elements.providerBadge.textContent = 'Ready';
  speechEngine.stopSpeaking();
  speechEngine.stopListening();
  updateStarState();
}

function triggerManualTranslation() {
  const text = elements.sourceTextInput.value;
  if (text.trim()) {
    performTranslation(text, state.sourceLang, state.targetLang);
  }
}

async function performTranslation(text, sourceLang, targetLang) {
  if (!text || !text.trim()) return;

  state.isTranslating = true;
  elements.translatingLoader.classList.remove('hidden');

  try {
    const result = await translationEngine.translate(text, sourceLang, targetLang);
    setTargetText(result.translatedText);

    // Show phonetic transliteration preview if source was slang in English letters
    if (
      elements.sourceTranslitPreview &&
      result.sourceTransliterated &&
      result.sourceTransliterated.trim() !== text.trim()
    ) {
      elements.sourceTranslitPreview.classList.remove('hidden');
      elements.sourceTranslitText.textContent = result.sourceTransliterated;
    } else if (elements.sourceTranslitPreview) {
      elements.sourceTranslitPreview.classList.add('hidden');
    }

    elements.providerBadge.textContent = result.isOffline
      ? 'Offline Phrasebook'
      : result.provider === 'phonetic-transliteration'
      ? 'Pure Script Transliteration'
      : result.provider === 'backend-api'
      ? 'Cloud API'
      : result.provider === 'cache'
      ? 'Instant Cache'
      : 'Cloud Web';

    updateStarState();
  } catch (err) {
    setTargetText(`[Translation Error] ${err.message}`);
    elements.providerBadge.textContent = 'Error';
    if (elements.sourceTranslitPreview) {
      elements.sourceTranslitPreview.classList.add('hidden');
    }
    showToast('Translation failed. Please try again or check network.');
  } finally {
    state.isTranslating = false;
    elements.translatingLoader.classList.add('hidden');
  }
}

function setTargetText(text) {
  if (!text) {
    elements.targetTextOutput.innerHTML = '<span class="placeholder-text">Translation will appear here instantly...</span>';
  } else {
    elements.targetTextOutput.textContent = text;
  }
}

function getTargetText() {
  const placeholder = elements.targetTextOutput.querySelector('.placeholder-text');
  if (placeholder) return '';
  return elements.targetTextOutput.textContent.trim();
}

// Swap languages (⇄)
function swapLanguages() {
  const oldSource = state.sourceLang;
  const oldTarget = state.targetLang;
  const currentSourceText = elements.sourceTextInput.value;
  const currentTargetText = getTargetText();

  state.sourceLang = oldTarget;
  state.targetLang = oldSource;

  elements.sourceLangSelect.value = state.sourceLang;
  elements.targetLangSelect.value = state.targetLang;

  storage.saveSettings({ sourceLang: state.sourceLang, targetLang: state.targetLang });
  updateConversationLabels();
  renderSlangChips(state.sourceLang);

  // Swap text boxes
  elements.sourceTextInput.value = currentTargetText;
  if (currentSourceText) {
    setTargetText(currentSourceText);
  } else {
    setTargetText('');
  }

  handleSourceTextChange();
  showToast(`Swapped languages: ${getLanguage(state.sourceLang).name} ⇄ ${getLanguage(state.targetLang).name}`);
}

// Copy translated text
async function copyTranslatedText() {
  const text = getTargetText();
  if (!text) {
    showToast('Nothing to copy yet.');
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    showToast('Copied translated text to clipboard!');
  } catch (e) {
    showToast('Unable to copy to clipboard.');
  }
}

// Favorite / Star Phrase
function toggleFavorite() {
  const originalText = elements.sourceTextInput.value.trim();
  const translatedText = getTargetText();

  if (!originalText || !translatedText) {
    showToast('Translate a phrase first to save it to favorites.');
    return;
  }

  const isFav = storage.isFavorite(originalText, state.sourceLang, state.targetLang);
  if (isFav) {
    // Find and remove
    const list = storage.getFavorites();
    const item = list.find(
      (f) =>
        f.originalText.toLowerCase() === originalText.toLowerCase() &&
        f.sourceLang === state.sourceLang &&
        f.targetLang === state.targetLang
    );
    if (item) {
      storage.removeFavorite(item.id);
      showToast('Removed from favorites.');
    }
  } else {
    storage.saveFavorite({
      originalText,
      translatedText,
      sourceLang: state.sourceLang,
      targetLang: state.targetLang
    });
    showToast('Saved phrase to favorites! ⭐');
  }

  updateStarState();
}

function updateStarState() {
  const originalText = elements.sourceTextInput ? elements.sourceTextInput.value.trim() : '';
  const isFav = storage.isFavorite(originalText, state.sourceLang, state.targetLang);
  if (elements.starFavoriteBtn) {
    elements.starFavoriteBtn.classList.toggle('is-starred', isFav);
  }
}

// ============================================================================
// Text-to-Speech Execution
// ============================================================================
function speakText(text, langId) {
  if (!text || !text.trim()) {
    showToast('No text available to read aloud.');
    return;
  }

  const settings = storage.getSettings();
  speechEngine.speak(text, langId, {
    rate: settings.speechRate || 0.95,
    onStart: () => {
      state.isSpeaking = true;
    },
    onEnd: () => {
      state.isSpeaking = false;
    },
    onError: (err) => {
      state.isSpeaking = false;
      showToast(err.message);
    },
    onFallbackNotice: (notice) => {
      showToast(notice);
    }
  });
}

// ============================================================================
// Speech-to-Text (Dual Panel Left Mic)
// ============================================================================
function toggleSourceMic() {
  if (speechEngine.isListening && state.activeMicSpeaker === 'source') {
    speechEngine.stopListening();
    resetMicUI();
    return;
  }

  const langObj = getLanguage(state.sourceLang);
  elements.sourceMicBtn.classList.add('is-recording');
  elements.sourceLiveStatus.classList.remove('hidden');
  elements.sourceLiveText.textContent = `Listening in ${langObj.name}...`;
  state.activeMicSpeaker = 'source';

  speechEngine.startListening({
    langCode: langObj.speechCode,
    sessionId: 'source',
    onInterim: (interim) => {
      elements.sourceLiveText.textContent = `Listening: "${interim}"`;
    },
    onFinal: (finalText) => {
      elements.sourceTextInput.value = finalText;
      handleSourceTextChange();
    },
    onError: (err) => {
      resetMicUI();
      showToast(err.message);
    },
    onEnd: (finalTranscript) => {
      resetMicUI();
      if (finalTranscript) {
        elements.sourceTextInput.value = finalTranscript;
        handleSourceTextChange();
      }
    }
  });
}

function resetMicUI() {
  state.activeMicSpeaker = null;
  elements.sourceMicBtn.classList.remove('is-recording');
  elements.sourceLiveStatus.classList.add('hidden');
  elements.convPerson1MicBtn.classList.remove('is-active');
  elements.convPerson2MicBtn.classList.remove('is-active');
  elements.convLiveBanner.classList.add('hidden');
  setConvStatus('Ready', 'ready');
}

// ============================================================================
// CONVERSATION MODE (Two-Way Live Talking)
// ============================================================================
function toggleConversationMode() {
  setConversationMode(!state.isConversationMode);
}

function setConversationMode(enable) {
  state.isConversationMode = enable;
  elements.toggleConvModeBtn.classList.toggle('active', enable);
  elements.toggleConvModeBtn.setAttribute('aria-pressed', enable ? 'true' : 'false');

  if (enable) {
    elements.dualPanelSection.classList.add('hidden');
    elements.conversationSection.classList.remove('hidden');
    updateConversationLabels();
    scrollConversationToBottom();
    setConvStatus('Conversation Mode Active: Tap a mic below to speak', 'ready');
  } else {
    elements.conversationSection.classList.add('hidden');
    elements.dualPanelSection.classList.remove('hidden');
    speechEngine.stopListening();
    speechEngine.stopSpeaking();
    resetMicUI();
  }
}

function setConvStatus(text, type = 'ready') {
  if (!elements.convStatusText || !elements.convStatusDot) return;
  elements.convStatusText.textContent = text;
  elements.convStatusDot.className = 'status-dot';
  if (type === 'listening') elements.convStatusDot.classList.add('listening');
  if (type === 'translating') elements.convStatusDot.classList.add('translating');
  if (type === 'speaking') elements.convStatusDot.classList.add('speaking');
}

/**
 * Handle Conversation Turn Microphone
 * @param {'person1'|'person2'} speaker
 */
async function toggleConversationMic(speaker) {
  // If already listening on this mic, stop it
  if (speechEngine.isListening && state.activeMicSpeaker === speaker) {
    speechEngine.stopListening();
    resetMicUI();
    return;
  }

  // Stop any other active speaker
  speechEngine.stopListening();
  speechEngine.stopSpeaking();

  const isPerson1 = speaker === 'person1';
  const speakerLangId = isPerson1 ? state.sourceLang : state.targetLang;
  const recipientLangId = isPerson1 ? state.targetLang : state.sourceLang;

  const speakerLang = getLanguage(speakerLangId);
  const recipientLang = getLanguage(recipientLangId);

  state.activeMicSpeaker = speaker;
  const activeBtn = isPerson1 ? elements.convPerson1MicBtn : elements.convPerson2MicBtn;
  activeBtn.classList.add('is-active');

  // Show live banner
  elements.convLiveBanner.classList.remove('hidden');
  elements.convLiveSpeakerTag.textContent = isPerson1 ? 'YOU' : 'PARTNER';
  elements.convLiveTranscript.textContent = `Listening in ${speakerLang.name}...`;

  setConvStatus(`Listening to ${isPerson1 ? 'You' : 'Partner'} (${speakerLang.name})...`, 'listening');

  speechEngine.startListening({
    langCode: speakerLang.speechCode,
    sessionId: speaker,
    onInterim: (interim) => {
      elements.convLiveTranscript.textContent = interim;
    },
    onFinal: async (finalTranscript) => {
      await handleConversationSpokenResult({
        speaker,
        text: finalTranscript,
        sourceLang: speakerLangId,
        targetLang: recipientLangId,
        speakerLang,
        recipientLang
      });
    },
    onError: (err) => {
      resetMicUI();
      showToast(err.message);
    },
    onEnd: (finalTranscript) => {
      if (!finalTranscript) {
        resetMicUI();
      }
    }
  });
}

/**
 * Send typed message from Conversation Mode text bar
 */
async function sendConversationTextMessage(speaker, overrideText = null) {
  const rawText = overrideText ? overrideText.trim() : (elements.convTextInput ? elements.convTextInput.value.trim() : '');
  if (!rawText) return;

  if (elements.convTextInput && !overrideText) {
    elements.convTextInput.value = '';
  }

  const isPerson1 = speaker === 'person1';
  const speakerLangId = isPerson1 ? state.sourceLang : state.targetLang;
  const recipientLangId = isPerson1 ? state.targetLang : state.sourceLang;

  const speakerLang = getLanguage(speakerLangId);
  const recipientLang = getLanguage(recipientLangId);

  await handleConversationSpokenResult({
    speaker,
    text: rawText,
    sourceLang: speakerLangId,
    targetLang: recipientLangId,
    speakerLang,
    recipientLang
  });
}

/**
 * Process spoken or typed message in conversation mode
 */
async function handleConversationSpokenResult({
  speaker,
  text,
  sourceLang,
  targetLang,
  speakerLang,
  recipientLang
}) {
  if (!text || !text.trim()) {
    resetMicUI();
    return;
  }

  elements.convLiveTranscript.textContent = `Translating into ${recipientLang.name}...`;
  setConvStatus(`Translating into ${recipientLang.name}...`, 'translating');

  try {
    const result = await translationEngine.translate(text, sourceLang, targetLang);
    const translatedText = result.translatedText;

    // Show slang and pure native spelling if converted
    const originalDisplay =
      result.sourceTransliterated && result.sourceTransliterated.trim() !== text.trim()
        ? `${text} (${result.sourceTransliterated})`
        : text;

    // Save to conversation history
    const entry = storage.addHistoryEntry({
      speaker,
      originalText: originalDisplay,
      translatedText,
      sourceLang,
      targetLang
    });

    renderHistoryFeed();
    scrollConversationToBottom();

    // Auto-speak in recipient's language if enabled
    const settings = storage.getSettings();
    if (settings.autoSpeakTranslation !== false) {
      setConvStatus(`Speaking aloud in ${recipientLang.name}...`, 'speaking');
      speakText(translatedText, targetLang);
    } else {
      setConvStatus('Ready for next speaker', 'ready');
    }
  } catch (err) {
    showToast(`Translation error: ${err.message}`);
    setConvStatus('Error during translation', 'ready');
  } finally {
    resetMicUI();
  }
}

// Render Conversation History
function renderHistoryFeed() {
  const history = storage.getHistory();
  if (history.length === 0) {
    elements.convHistoryFeed.innerHTML = `
      <div class="empty-history-placeholder">
        <div class="empty-icon">🗣️ ⇄ 👥</div>
        <h3>Two-Way Face-to-Face Mode</h3>
        <p>1. Tap <strong>YOU</strong> to speak in your language; the app translates and speaks aloud for your partner.</p>
        <p>2. Tap <strong>PARTNER</strong> for them to reply; the app translates and speaks/shows it in your language.</p>
      </div>
    `;
    return;
  }

  elements.convHistoryFeed.innerHTML = '';
  history.forEach((msg) => {
    const isPerson1 = msg.speaker === 'person1';
    const sLangObj = getLanguage(msg.sourceLang);
    const tLangObj = getLanguage(msg.targetLang);

    const bubble = document.createElement('div');
    bubble.className = `chat-bubble-card ${isPerson1 ? 'bubble-you' : 'bubble-partner'}`;

    bubble.innerHTML = `
      <div class="bubble-meta">
        <span class="speaker-pill">${isPerson1 ? 'You' : 'Partner'} (${sLangObj ? sLangObj.name : msg.sourceLang} → ${tLangObj ? tLangObj.name : msg.targetLang})</span>
        <span class="bubble-time">${msg.timestamp}</span>
      </div>
      <div class="bubble-original-text">"${escapeHtml(msg.originalText)}"</div>
      <div class="bubble-translated-text">${escapeHtml(msg.translatedText)}</div>
      <div class="bubble-tools">
        <button class="bubble-tool-btn play-bubble-btn" title="Listen aloud">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
          Listen
        </button>
        <button class="bubble-tool-btn copy-bubble-btn" title="Copy translated text">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          Copy
        </button>
      </div>
    `;

    // Bind item actions
    bubble.querySelector('.play-bubble-btn').addEventListener('click', () => {
      speakText(msg.translatedText, msg.targetLang);
    });

    bubble.querySelector('.copy-bubble-btn').addEventListener('click', async () => {
      await navigator.clipboard.writeText(msg.translatedText);
      showToast('Copied to clipboard!');
    });

    elements.convHistoryFeed.appendChild(bubble);
  });
}

function clearConversationHistory() {
  if (confirm('Clear the entire conversation history?')) {
    storage.clearHistory();
    renderHistoryFeed();
    showToast('Conversation history cleared.');
  }
}

function scrollConversationToBottom() {
  setTimeout(() => {
    elements.convHistoryFeed.scrollTop = elements.convHistoryFeed.scrollHeight;
  }, 60);
}

// ============================================================================
// Modals: Essential & Saved Phrases
// ============================================================================
function openPhrasesModal() {
  renderPhrasesList();
  elements.phrasesModal.classList.remove('hidden');
}

function closePhrasesModal() {
  elements.phrasesModal.classList.add('hidden');
}

function renderPhrasesList() {
  elements.phrasesListContainer.innerHTML = '';
  const currentTargetLang = state.targetLang;

  let phrases = [];

  if (state.selectedCategory === 'favorites') {
    // Show saved user favorites
    const favs = storage.getFavorites();
    if (favs.length === 0) {
      elements.phrasesListContainer.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
          <p>No favorites saved yet. Star any translation with the ★ button to keep it here!</p>
        </div>
      `;
      return;
    }

    phrases = favs.map((f) => ({
      id: f.id,
      isUserFav: true,
      en: f.originalText,
      targetText: f.translatedText,
      sourceLang: f.sourceLang,
      targetLang: f.targetLang
    }));
  } else {
    // Standard preloaded preset phrases
    let filtered = PRESET_PHRASES;
    if (state.selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === state.selectedCategory);
    }

    phrases = filtered.map((p) => ({
      id: p.id,
      isUserFav: false,
      en: p.en,
      targetText: p.translations[currentTargetLang] || p.translations['hi'] || p.en,
      sourceLang: 'en',
      targetLang: currentTargetLang
    }));
  }

  // Filter by search query
  if (state.searchQuery) {
    phrases = phrases.filter(
      (p) =>
        p.en.toLowerCase().includes(state.searchQuery) ||
        (p.targetText && p.targetText.toLowerCase().includes(state.searchQuery))
    );
  }

  if (phrases.length === 0) {
    elements.phrasesListContainer.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
        <p>No matching phrases found for "${escapeHtml(state.searchQuery)}".</p>
      </div>
    `;
    return;
  }

  phrases.forEach((phrase) => {
    const card = document.createElement('div');
    card.className = 'phrase-card';

    card.innerHTML = `
      <div class="phrase-card-text">
        <div class="phrase-en">${escapeHtml(phrase.en)}</div>
        <div class="phrase-translation">${escapeHtml(phrase.targetText)}</div>
      </div>
      <div class="phrase-card-actions">
        <button class="phrase-act-btn use-btn" title="Insert into translator">Use</button>
        <button class="phrase-act-btn speak-phrase-btn" title="Read aloud">🔊</button>
        ${
          phrase.isUserFav
            ? `<button class="phrase-act-btn delete-fav-btn" title="Remove favorite" style="color: #EF4444;">&times;</button>`
            : ''
        }
      </div>
    `;

    // "Use" button inserts phrase into input & translates
    card.querySelector('.use-btn').addEventListener('click', () => {
      elements.sourceTextInput.value = phrase.en;
      elements.sourceLangSelect.value = phrase.sourceLang || 'en';
      state.sourceLang = elements.sourceLangSelect.value;
      closePhrasesModal();
      handleSourceTextChange();
      speakText(phrase.targetText, state.targetLang);
    });

    // "Speak" button reads translation immediately
    card.querySelector('.speak-phrase-btn').addEventListener('click', () => {
      speakText(phrase.targetText, phrase.targetLang);
    });

    // If user favorite, allow deletion
    if (phrase.isUserFav) {
      card.querySelector('.delete-fav-btn').addEventListener('click', () => {
        storage.removeFavorite(phrase.id);
        renderPhrasesList();
        updateStarState();
      });
    }

    elements.phrasesListContainer.appendChild(card);
  });
}

// ============================================================================
// Modals: Settings & Voice Diagnostics
// ============================================================================
function openSettingsModal() {
  elements.settingsModal.classList.remove('hidden');
  runVoiceDiagnostics();
}

function closeSettingsModal() {
  elements.settingsModal.classList.add('hidden');
}

function runVoiceDiagnostics() {
  if (!elements.deviceVoicesDiagnostic) return;

  const synth = window.speechSynthesis;
  if (!synth) {
    elements.deviceVoicesDiagnostic.innerHTML = `
      <span style="color:#EF4444;">Speech Synthesis API is not supported on this browser.</span>
    `;
    return;
  }

  const voices = synth.getVoices() || [];
  if (voices.length === 0) {
    elements.deviceVoicesDiagnostic.innerHTML = `
      <span>Loading voices... (Trigger speech or re-open to refresh)</span>
    `;
    return;
  }

  // Filter for Indian language voices
  const indianVoices = voices.filter(
    (v) =>
      v.lang.toLowerCase().includes('in') ||
      v.lang.toLowerCase().includes('hi') ||
      v.lang.toLowerCase().includes('ta') ||
      v.lang.toLowerCase().includes('te') ||
      v.lang.toLowerCase().includes('bn') ||
      v.lang.toLowerCase().includes('mr') ||
      v.lang.toLowerCase().includes('pa') ||
      v.lang.toLowerCase().includes('gu')
  );

  if (indianVoices.length === 0) {
    elements.deviceVoicesDiagnostic.innerHTML = `
      <div style="color: var(--text-secondary); line-height: 1.5;">
        <span>No dedicated regional Indian TTS voices detected on this device.</span><br/>
        <small>Bharat Translator automatically provides fallback voices and preserves the full native text translation!</small>
      </div>
    `;
    return;
  }

  elements.deviceVoicesDiagnostic.innerHTML = indianVoices
    .map(
      (v) => `
      <div class="voice-item">
        <strong>${escapeHtml(v.name)}</strong>
        <span>${escapeHtml(v.lang)}</span>
      </div>
    `
    )
    .join('');
}

// ============================================================================
// Helper Utilities
// ============================================================================
function showToast(message) {
  if (!elements.toastNotice) return;
  elements.toastNotice.textContent = message;
  elements.toastNotice.classList.add('show');
  setTimeout(() => {
    elements.toastNotice.classList.remove('show');
  }, 3500);
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Kick off when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
