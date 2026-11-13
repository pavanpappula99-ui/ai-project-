/**
 * Bharat Translator - Main Application Controller
 * Coordinates UI, Speech Engine, Translation Engine, and Storage.
 */

import { LANGUAGES, getLanguageLabel, getLanguage, DEFAULT_SOURCE_LANG, DEFAULT_TARGET_LANG } from './config.js';
import { CATEGORIES, PRESET_PHRASES, LANGUAGE_SLANG_CHIPS } from './phrases.js';
import { speechEngine } from './speech.js';
import { translationEngine } from './translator.js';
import { storage } from './storage.js';
import { ocrEngine } from './ocr.js';
import { pdfHelper } from './pdf-helper.js';

// Application State
const state = {
  currentMode: 'text-voice', // 'text-voice' | 'conversation' | 'image' | 'pdf'
  sourceLang: DEFAULT_SOURCE_LANG,
  targetLang: DEFAULT_TARGET_LANG,
  isConversationMode: false,
  activeMicSpeaker: null, // 'source', 'person1', 'person2'
  debounceTimer: null,
  isTranslating: false,
  isSpeaking: false,
  selectedCategory: 'all',
  searchQuery: '',
  // Image Translator State
  imageSourceLang: 'auto',
  imageTargetLang: 'te',
  imageExtractedText: '',
  imageTranslatedText: '',
  imageFileUrl: null,
  // PDF Translator State
  pdfSourceLang: 'auto',
  pdfTargetLang: 'te',
  pdfPages: [],
  pdfCurrentTab: 'all',
  pdfFileName: 'document.pdf'
};

// DOM Elements
const elements = {
  // Theme & Navigation
  html: document.documentElement,
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  toggleConvModeBtn: document.getElementById('toggleConvModeBtn'),
  openPhrasesBtn: document.getElementById('openPhrasesBtn'),
  openSettingsBtn: document.getElementById('openSettingsBtn'),
  toastNotice: document.getElementById('toastNotice'),

  // Mode Navigation Tabs & Quick Triggers
  navTextVoiceBtn: document.getElementById('navTextVoiceBtn'),
  navConversationBtn: document.getElementById('navConversationBtn'),
  navImageTranslatorBtn: document.getElementById('navImageTranslatorBtn'),
  navPdfTranslatorBtn: document.getElementById('navPdfTranslatorBtn'),
  quickImageTranslateBtn: document.getElementById('quickImageTranslateBtn'),
  quickPdfTranslateBtn: document.getElementById('quickPdfTranslateBtn'),

  // Sections
  dualPanelSection: document.getElementById('dualPanelSection'),
  conversationSection: document.getElementById('conversationSection'),
  imageTranslatorSection: document.getElementById('imageTranslatorSection'),
  pdfTranslatorSection: document.getElementById('pdfTranslatorSection'),

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

  // Image Translator Elements
  imageSourceLangSelect: document.getElementById('imageSourceLangSelect'),
  imageSwapLangBtn: document.getElementById('imageSwapLangBtn'),
  imageTargetLangSelect: document.getElementById('imageTargetLangSelect'),
  imageDropzone: document.getElementById('imageDropzone'),
  imageFileInput: document.getElementById('imageFileInput'),
  cameraFileInput: document.getElementById('cameraFileInput'),
  browseImageBtn: document.getElementById('browseImageBtn'),
  captureCameraBtn: document.getElementById('captureCameraBtn'),
  imageProcessingCard: document.getElementById('imageProcessingCard'),
  imageProgressStatus: document.getElementById('imageProgressStatus'),
  imageProgressSub: document.getElementById('imageProgressSub'),
  imageProgressPercent: document.getElementById('imageProgressPercent'),
  imageProgressBarFill: document.getElementById('imageProgressBarFill'),
  imageResultsContainer: document.getElementById('imageResultsContainer'),
  imageConfidenceBadge: document.getElementById('imageConfidenceBadge'),
  imagePreviewImg: document.getElementById('imagePreviewImg'),
  imageExtractedText: document.getElementById('imageExtractedText'),
  imageTargetLangTitle: document.getElementById('imageTargetLangTitle'),
  imageTranslatedOutput: document.getElementById('imageTranslatedOutput'),
  retranslateImageBtn: document.getElementById('retranslateImageBtn'),
  copyExtractedImageBtn: document.getElementById('copyExtractedImageBtn'),
  imageListenBtn: document.getElementById('imageListenBtn'),
  imageCopyBtn: document.getElementById('imageCopyBtn'),
  imageDownloadBtn: document.getElementById('imageDownloadBtn'),
  imageSendToDualBtn: document.getElementById('imageSendToDualBtn'),
  imageNewBtn: document.getElementById('imageNewBtn'),

  // PDF Translator Elements
  pdfSourceLangSelect: document.getElementById('pdfSourceLangSelect'),
  pdfSwapLangBtn: document.getElementById('pdfSwapLangBtn'),
  pdfTargetLangSelect: document.getElementById('pdfTargetLangSelect'),
  pdfDropzone: document.getElementById('pdfDropzone'),
  pdfFileInput: document.getElementById('pdfFileInput'),
  browsePdfBtn: document.getElementById('browsePdfBtn'),
  pdfProcessingCard: document.getElementById('pdfProcessingCard'),
  pdfFileName: document.getElementById('pdfFileName'),
  pdfFileMeta: document.getElementById('pdfFileMeta'),
  pdfProgressStatus: document.getElementById('pdfProgressStatus'),
  pdfProgressSub: document.getElementById('pdfProgressSub'),
  pdfProgressPercent: document.getElementById('pdfProgressPercent'),
  pdfProgressBarFill: document.getElementById('pdfProgressBarFill'),
  pdfResultsContainer: document.getElementById('pdfResultsContainer'),
  pdfPageTabs: document.getElementById('pdfPageTabs'),
  pdfDownloadPdfBtn: document.getElementById('pdfDownloadPdfBtn'),
  pdfDownloadTxtBtn: document.getElementById('pdfDownloadTxtBtn'),
  pdfCopyAllBtn: document.getElementById('pdfCopyAllBtn'),
  pdfListenBtn: document.getElementById('pdfListenBtn'),
  pdfNewBtn: document.getElementById('pdfNewBtn'),
  pdfSourcePageTitle: document.getElementById('pdfSourcePageTitle'),
  pdfSourceCharBadge: document.getElementById('pdfSourceCharBadge'),
  pdfOriginalContent: document.getElementById('pdfOriginalContent'),
  pdfTargetPageTitle: document.getElementById('pdfTargetPageTitle'),
  pdfTranslatedContent: document.getElementById('pdfTranslatedContent'),

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
  const standardSelects = [
    { el: elements.sourceLangSelect, cur: state.sourceLang },
    { el: elements.targetLangSelect, cur: state.targetLang },
    { el: elements.imageTargetLangSelect, cur: state.imageTargetLang },
    { el: elements.pdfTargetLangSelect, cur: state.pdfTargetLang }
  ];

  standardSelects.forEach(({ el, cur }) => {
    if (!el) return;
    el.innerHTML = '';
    LANGUAGES.forEach((lang) => {
      const opt = document.createElement('option');
      opt.value = lang.id;
      opt.textContent = getLanguageLabel(lang);
      if (lang.id === cur) opt.selected = true;
      el.appendChild(opt);
    });
  });

  // Source selects for Image & PDF include Auto-Detect option at the top
  const toolSourceSelects = [
    { el: elements.imageSourceLangSelect, cur: state.imageSourceLang },
    { el: elements.pdfSourceLangSelect, cur: state.pdfSourceLang }
  ];

  toolSourceSelects.forEach(({ el, cur }) => {
    if (!el) return;
    el.innerHTML = '';

    const autoOpt = document.createElement('option');
    autoOpt.value = 'auto';
    autoOpt.textContent = '🌐 Auto-Detect (English / Indian Scripts)';
    if (cur === 'auto' || !cur) autoOpt.selected = true;
    el.appendChild(autoOpt);

    LANGUAGES.forEach((lang) => {
      const opt = document.createElement('option');
      opt.value = lang.id;
      opt.textContent = getLanguageLabel(lang);
      if (lang.id === cur) opt.selected = true;
      el.appendChild(opt);
    });
  });

  updateConversationLabels();
  updateImageTargetHeader();
  updatePdfTargetHeader();
}

function updateImageTargetHeader() {
  if (!elements.imageTargetLangTitle) return;
  const lang = getLanguage(state.imageTargetLang);
  elements.imageTargetLangTitle.textContent = lang ? lang.name : 'Target Language';
}

function updatePdfTargetHeader() {
  if (!elements.pdfTargetPageTitle) return;
  const lang = getLanguage(state.pdfTargetLang);
  elements.pdfTargetPageTitle.textContent = lang ? lang.name : 'Target Language';
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

  // ==========================================
  // Mode Navigation Tabs & Quick Buttons
  // ==========================================
  if (elements.navTextVoiceBtn) {
    elements.navTextVoiceBtn.addEventListener('click', () => setAppMode('text-voice'));
  }
  if (elements.navConversationBtn) {
    elements.navConversationBtn.addEventListener('click', () => setAppMode('conversation'));
  }
  if (elements.navImageTranslatorBtn) {
    elements.navImageTranslatorBtn.addEventListener('click', () => setAppMode('image'));
  }
  if (elements.navPdfTranslatorBtn) {
    elements.navPdfTranslatorBtn.addEventListener('click', () => setAppMode('pdf'));
  }
  if (elements.quickImageTranslateBtn) {
    elements.quickImageTranslateBtn.addEventListener('click', () => setAppMode('image'));
  }
  if (elements.quickPdfTranslateBtn) {
    elements.quickPdfTranslateBtn.addEventListener('click', () => setAppMode('pdf'));
  }

  // ==========================================
  // Image Translator Event Handlers
  // ==========================================
  if (elements.imageSourceLangSelect) {
    elements.imageSourceLangSelect.addEventListener('change', (e) => {
      state.imageSourceLang = e.target.value;
    });
  }
  if (elements.imageTargetLangSelect) {
    elements.imageTargetLangSelect.addEventListener('change', (e) => {
      state.imageTargetLang = e.target.value;
      updateImageTargetHeader();
      if (elements.imageExtractedText && elements.imageExtractedText.value.trim()) {
        retranslateImageText();
      }
    });
  }
  if (elements.imageSwapLangBtn) {
    elements.imageSwapLangBtn.addEventListener('click', () => {
      const temp = state.imageSourceLang;
      state.imageSourceLang = state.imageTargetLang;
      state.imageTargetLang = temp;
      if (elements.imageSourceLangSelect) elements.imageSourceLangSelect.value = state.imageSourceLang;
      if (elements.imageTargetLangSelect) elements.imageTargetLangSelect.value = state.imageTargetLang;
      updateImageTargetHeader();
      if (elements.imageExtractedText && elements.imageExtractedText.value.trim()) {
        retranslateImageText();
      }
    });
  }

  if (elements.browseImageBtn && elements.imageFileInput) {
    elements.browseImageBtn.addEventListener('click', () => elements.imageFileInput.click());
  }
  if (elements.captureCameraBtn && elements.cameraFileInput) {
    elements.captureCameraBtn.addEventListener('click', () => elements.cameraFileInput.click());
  }
  if (elements.imageFileInput) {
    elements.imageFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleImageFile(e.target.files[0]);
      }
    });
  }
  if (elements.cameraFileInput) {
    elements.cameraFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleImageFile(e.target.files[0]);
      }
    });
  }

  if (elements.imageDropzone) {
    elements.imageDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      elements.imageDropzone.classList.add('dragover');
    });
    elements.imageDropzone.addEventListener('dragleave', () => {
      elements.imageDropzone.classList.remove('dragover');
    });
    elements.imageDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      elements.imageDropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleImageFile(e.dataTransfer.files[0]);
      }
    });
  }

  // Paste image directly (Ctrl+V)
  window.addEventListener('paste', (e) => {
    if (state.currentMode !== 'image') return;
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          handleImageFile(file);
          break;
        }
      }
    }
  });

  // Sample Image Buttons
  document.querySelectorAll('#imageTranslatorSection .sample-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const type = chip.dataset.sample;
      const dataUrl = generateSampleImage(type);
      processImageDataUrl(dataUrl);
    });
  });

  // Image Action Buttons
  if (elements.retranslateImageBtn) {
    elements.retranslateImageBtn.addEventListener('click', retranslateImageText);
  }
  if (elements.copyExtractedImageBtn) {
    elements.copyExtractedImageBtn.addEventListener('click', () => {
      const text = elements.imageExtractedText?.value || '';
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => showToast('Original extracted text copied!'));
    });
  }
  if (elements.imageListenBtn) {
    elements.imageListenBtn.addEventListener('click', () => {
      const text = elements.imageTranslatedOutput?.textContent || '';
      if (text) speakText(text, state.imageTargetLang);
    });
  }
  if (elements.imageCopyBtn) {
    elements.imageCopyBtn.addEventListener('click', () => {
      const text = elements.imageTranslatedOutput?.textContent || '';
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => showToast('Translated text copied!'));
    });
  }
  if (elements.imageDownloadBtn) {
    elements.imageDownloadBtn.addEventListener('click', () => {
      const text = elements.imageTranslatedOutput?.textContent || '';
      if (!text) return;
      const targetLangObj = getLanguage(state.imageTargetLang);
      const targetName = targetLangObj ? targetLangObj.name : 'Translated';
      pdfHelper.downloadTextFile(text, `Image_Translation_${targetName}.txt`);
      showToast('Downloaded translated text file!');
    });
  }
  if (elements.imageSendToDualBtn) {
    elements.imageSendToDualBtn.addEventListener('click', () => {
      const orig = elements.imageExtractedText?.value || '';
      const trans = elements.imageTranslatedOutput?.textContent || '';
      if (!orig && !trans) return;

      state.sourceLang = state.imageSourceLang === 'auto' ? translationEngine.detectLanguage(orig) : state.imageSourceLang;
      state.targetLang = state.imageTargetLang;
      if (elements.sourceLangSelect) elements.sourceLangSelect.value = state.sourceLang;
      if (elements.targetLangSelect) elements.targetLangSelect.value = state.targetLang;
      if (elements.sourceTextInput) elements.sourceTextInput.value = orig;
      if (elements.targetTextOutput) elements.targetTextOutput.textContent = trans;

      setAppMode('text-voice');
      showToast('Loaded into Voice & Text panels!');
    });
  }
  if (elements.imageNewBtn) {
    elements.imageNewBtn.addEventListener('click', () => {
      if (elements.imageFileInput) elements.imageFileInput.value = '';
      if (elements.cameraFileInput) elements.cameraFileInput.value = '';
      if (elements.imageResultsContainer) elements.imageResultsContainer.classList.add('hidden');
      if (elements.imageDropzone) {
        elements.imageDropzone.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // ==========================================
  // PDF Translator Event Handlers
  // ==========================================
  if (elements.pdfSourceLangSelect) {
    elements.pdfSourceLangSelect.addEventListener('change', (e) => {
      state.pdfSourceLang = e.target.value;
    });
  }
  if (elements.pdfTargetLangSelect) {
    elements.pdfTargetLangSelect.addEventListener('change', async (e) => {
      state.pdfTargetLang = e.target.value;
      updatePdfTargetHeader();
      if (state.pdfPages && state.pdfPages.length > 0) {
        showToast('Re-translating PDF for newly selected language...');
        if (elements.pdfProcessingCard) elements.pdfProcessingCard.classList.remove('hidden');
        try {
          for (let i = 0; i < state.pdfPages.length; i++) {
            updatePdfProgress({
              status: `Translating Page ${i + 1} of ${state.pdfPages.length}...`,
              progress: Math.round(((i + 1) / state.pdfPages.length) * 100)
            });
            const res = await translationEngine.translateLongText(
              state.pdfPages[i].originalText,
              state.pdfSourceLang,
              state.pdfTargetLang
            );
            state.pdfPages[i].translatedText = typeof res === 'string' ? res : (res?.translatedText || '');
          }
          showPdfTab(state.pdfCurrentTab);
          showToast('Updated PDF translation!');
        } catch (err) {
          showToast(`Error: ${err.message}`);
        } finally {
          if (elements.pdfProcessingCard) elements.pdfProcessingCard.classList.add('hidden');
        }
      }
    });
  }
  if (elements.pdfSwapLangBtn) {
    elements.pdfSwapLangBtn.addEventListener('click', () => {
      const temp = state.pdfSourceLang;
      state.pdfSourceLang = state.pdfTargetLang;
      state.pdfTargetLang = temp;
      if (elements.pdfSourceLangSelect) elements.pdfSourceLangSelect.value = state.pdfSourceLang;
      if (elements.pdfTargetLangSelect) elements.pdfTargetLangSelect.value = state.pdfTargetLang;
      updatePdfTargetHeader();
    });
  }

  if (elements.browsePdfBtn && elements.pdfFileInput) {
    elements.browsePdfBtn.addEventListener('click', () => elements.pdfFileInput.click());
  }
  if (elements.pdfFileInput) {
    elements.pdfFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handlePdfFile(e.target.files[0]);
      }
    });
  }

  if (elements.pdfDropzone) {
    elements.pdfDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      elements.pdfDropzone.classList.add('dragover');
    });
    elements.pdfDropzone.addEventListener('dragleave', () => {
      elements.pdfDropzone.classList.remove('dragover');
    });
    elements.pdfDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      elements.pdfDropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handlePdfFile(e.dataTransfer.files[0]);
      }
    });
  }

  // Sample PDF Buttons
  document.querySelectorAll('#pdfTranslatorSection .sample-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const type = chip.dataset.pdfSample;
      generateSamplePdf(type);
    });
  });

  // PDF Action Buttons
  if (elements.pdfDownloadPdfBtn) {
    elements.pdfDownloadPdfBtn.addEventListener('click', downloadTranslatedPdfDocument);
  }
  if (elements.pdfDownloadTxtBtn) {
    elements.pdfDownloadTxtBtn.addEventListener('click', downloadTranslatedPdfTextDocument);
  }
  if (elements.pdfCopyAllBtn) {
    elements.pdfCopyAllBtn.addEventListener('click', copyAllPdfTranslations);
  }
  if (elements.pdfListenBtn) {
    elements.pdfListenBtn.addEventListener('click', speakPdfCurrentView);
  }
  if (elements.pdfNewBtn) {
    elements.pdfNewBtn.addEventListener('click', () => {
      if (elements.pdfFileInput) elements.pdfFileInput.value = '';
      if (elements.pdfResultsContainer) elements.pdfResultsContainer.classList.add('hidden');
      state.pdfPages = [];
      if (elements.pdfDropzone) {
        elements.pdfDropzone.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }
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
      if (notice && !notice.toLowerCase().includes('not installed')) {
        showToast(notice);
      }
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
// MODE NAVIGATION & APP MODES
// ============================================================================
function setAppMode(mode) {
  state.currentMode = mode;

  // Update Navigation Tab Buttons
  const navTabs = [
    { btn: elements.navTextVoiceBtn, id: 'text-voice' },
    { btn: elements.navConversationBtn, id: 'conversation' },
    { btn: elements.navImageTranslatorBtn, id: 'image' },
    { btn: elements.navPdfTranslatorBtn, id: 'pdf' }
  ];
  navTabs.forEach(({ btn, id }) => {
    if (btn) btn.classList.toggle('active', id === mode);
  });

  // Update Header Pill
  if (elements.toggleConvModeBtn) {
    elements.toggleConvModeBtn.classList.toggle('active', mode === 'conversation');
    elements.toggleConvModeBtn.setAttribute('aria-pressed', mode === 'conversation' ? 'true' : 'false');
  }

  // Hide all sections first
  if (elements.dualPanelSection) elements.dualPanelSection.classList.add('hidden');
  if (elements.conversationSection) elements.conversationSection.classList.add('hidden');
  if (elements.imageTranslatorSection) elements.imageTranslatorSection.classList.add('hidden');
  if (elements.pdfTranslatorSection) elements.pdfTranslatorSection.classList.add('hidden');

  // Stop any active mic/audio
  speechEngine.stopListening();
  speechEngine.stopSpeaking();
  resetMicUI();

  // Show selected mode
  if (mode === 'conversation') {
    state.isConversationMode = true;
    if (elements.conversationSection) elements.conversationSection.classList.remove('hidden');
    updateConversationLabels();
    scrollConversationToBottom();
    setConvStatus('Conversation Mode Active: Tap a mic below to speak', 'ready');
  } else if (mode === 'image') {
    state.isConversationMode = false;
    if (elements.imageTranslatorSection) elements.imageTranslatorSection.classList.remove('hidden');
    updateImageTargetHeader();
  } else if (mode === 'pdf') {
    state.isConversationMode = false;
    if (elements.pdfTranslatorSection) elements.pdfTranslatorSection.classList.remove('hidden');
    updatePdfTargetHeader();
  } else {
    // 'text-voice' default
    state.isConversationMode = false;
    if (elements.dualPanelSection) elements.dualPanelSection.classList.remove('hidden');
  }
}

function toggleConversationMode() {
  if (state.currentMode === 'conversation') {
    setAppMode('text-voice');
  } else {
    setAppMode('conversation');
  }
}

function setConversationMode(enable) {
  setAppMode(enable ? 'conversation' : 'text-voice');
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
      <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 12px; line-height: 1.5;">
        <div style="color: #10B981; font-weight: 600; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
          <span>🟢</span> Cloud HD Native Speech Engine Active
        </div>
        <div style="color: var(--text-secondary); font-size: 0.85rem;">
          Real human pronunciation for Telugu, Hindi, Tamil, Kannada, Malayalam, Bengali, Marathi, and all Indian languages is streamed online. No OS voice pack download required!
        </div>
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
// IMAGE TRANSLATOR ENGINE & UI CONTROLLER
// ============================================================================
async function handleImageFile(file) {
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast('Please upload an image file (PNG, JPG, WEBP, BMP, etc.)');
    return;
  }

  const reader = new FileReader();
  reader.onload = async (e) => {
    const dataUrl = e.target.result;
    await processImageDataUrl(dataUrl);
  };
  reader.onerror = () => {
    showToast('Failed to read image file.');
  };
  reader.readAsDataURL(file);
}

async function processImageDataUrl(dataUrl) {
  if (!dataUrl) return;
  state.imageFileUrl = dataUrl;

  if (elements.imagePreviewImg) {
    elements.imagePreviewImg.src = dataUrl;
  }

  if (elements.imageProcessingCard) {
    elements.imageProcessingCard.classList.remove('hidden');
  }
  if (elements.imageResultsContainer) {
    elements.imageResultsContainer.classList.add('hidden');
  }

  updateImageProgress({ status: 'Starting client-side OCR scan...', progress: 10 });

  try {
    const ocrResult = await ocrEngine.recognize(dataUrl, state.imageSourceLang, (prog) => {
      updateImageProgress(prog);
    });

    const extracted = (ocrResult.text || '').trim();
    if (!extracted) {
      if (elements.imageProcessingCard) elements.imageProcessingCard.classList.add('hidden');
      showToast('No readable text detected in this image. Try a sharper image or change the language.');
      return;
    }

    state.imageExtractedText = extracted;
    if (elements.imageExtractedText) {
      elements.imageExtractedText.value = extracted;
    }
    if (elements.imageConfidenceBadge) {
      elements.imageConfidenceBadge.textContent = `OCR Confidence: ${Math.round(ocrResult.confidence || 92)}%`;
    }

    // Translate extracted text
    const targetLangObj = getLanguage(state.imageTargetLang);
    const targetName = targetLangObj ? targetLangObj.name : 'Target Language';

    updateImageProgress({
      status: `Translating text into pure ${targetName} script...`,
      progress: 85
    });

    const transResult = await translationEngine.translateLongText(
      extracted,
      state.imageSourceLang,
      state.imageTargetLang,
      (tProg) => {
        updateImageProgress({
          status: `Translating: ${tProg.currentChunk} of ${tProg.totalChunks}...`,
          progress: Math.min(98, 85 + Math.round((tProg.currentChunk / tProg.totalChunks) * 13))
        });
      }
    );

    const translated = typeof transResult === 'string' ? transResult : (transResult?.translatedText || '');

    state.imageTranslatedText = translated;
    if (elements.imageTranslatedOutput) {
      elements.imageTranslatedOutput.textContent = translated;
    }

    if (elements.imageProcessingCard) {
      elements.imageProcessingCard.classList.add('hidden');
    }
    if (elements.imageResultsContainer) {
      elements.imageResultsContainer.classList.remove('hidden');
      elements.imageResultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    showToast(`Image translated successfully into ${targetName}!`);
  } catch (err) {
    console.error('Image translation error:', err);
    if (elements.imageProcessingCard) {
      elements.imageProcessingCard.classList.add('hidden');
    }
    showToast(`Image translation error: ${err.message || 'Failed to process'}`);
  }
}

function updateImageProgress({ status, progress }) {
  if (elements.imageProgressStatus && status) {
    elements.imageProgressStatus.textContent = status;
  }
  if (elements.imageProgressPercent && typeof progress === 'number') {
    elements.imageProgressPercent.textContent = `${progress}%`;
  }
  if (elements.imageProgressBarFill && typeof progress === 'number') {
    elements.imageProgressBarFill.style.width = `${progress}%`;
  }
}

async function retranslateImageText() {
  const currentText = (elements.imageExtractedText?.value || '').trim();
  if (!currentText) {
    showToast('Please enter or extract text first.');
    return;
  }

  const targetLangObj = getLanguage(state.imageTargetLang);
  const targetName = targetLangObj ? targetLangObj.name : 'Target Language';

  showToast(`Re-translating into ${targetName}...`);
  if (elements.imageProcessingCard) {
    elements.imageProcessingCard.classList.remove('hidden');
    updateImageProgress({ status: `Translating into ${targetName}...`, progress: 50 });
  }

  try {
    const transResult = await translationEngine.translateLongText(
      currentText,
      state.imageSourceLang,
      state.imageTargetLang
    );
    const translated = typeof transResult === 'string' ? transResult : (transResult?.translatedText || '');
    state.imageTranslatedText = translated;
    if (elements.imageTranslatedOutput) {
      elements.imageTranslatedOutput.textContent = translated;
    }
    showToast(`Updated translation for ${targetName}!`);
  } catch (err) {
    showToast(`Translation error: ${err.message}`);
  } finally {
    if (elements.imageProcessingCard) {
      elements.imageProcessingCard.classList.add('hidden');
    }
  }
}

function generateSampleImage(sampleType) {
  const canvas = document.createElement('canvas');
  canvas.width = 900;
  canvas.height = 520;
  const ctx = canvas.getContext('2d');

  if (sampleType === 'sign') {
    state.imageSourceLang = 'hi';
    if (elements.imageSourceLangSelect) elements.imageSourceLangSelect.value = 'hi';

    // Classic Indian Railways Navy Blue & Gold Header
    ctx.fillStyle = '#0f2b5c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 10;
    ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);

    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(25, 25, canvas.width - 50, 70);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('भारतीय रेल  •  INDIAN RAILWAYS', canvas.width / 2, 70);

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 50px system-ui, sans-serif';
    ctx.fillText('नई दिल्ली रेलवे स्टेशन', canvas.width / 2, 175);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px system-ui, sans-serif';
    ctx.fillText('NEW DELHI RAILWAY STATION', canvas.width / 2, 230);

    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.roundRect(canvas.width / 2 - 220, 275, 440, 65, 12);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px system-ui, sans-serif';
    ctx.fillText('प्लेटफ़ॉर्म सं. ३ / PLATFORM 3', canvas.width / 2, 318);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '24px system-ui, sans-serif';
    ctx.fillText('कृपया गाड़ी संख्या १२७२८ में चढ़ने से पहले अपना टिकट जाँचें।', canvas.width / 2, 390);
    ctx.fillText('चलती गाड़ी में न चढ़ें। सुरक्षित यात्रा की शुभकामनाएँ।', canvas.width / 2, 435);
  } else if (sampleType === 'menu') {
    state.imageSourceLang = 'hi';
    if (elements.imageSourceLangSelect) elements.imageSourceLangSelect.value = 'hi';

    ctx.fillStyle = '#fffbeb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 8;
    ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);

    ctx.fillStyle = '#92400e';
    ctx.font = 'bold 38px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🍽️ दक्षिण भारतीय भोजन मेनू', canvas.width / 2, 75);

    ctx.fillStyle = '#78350f';
    ctx.font = '19px system-ui, sans-serif';
    ctx.fillText('शुद्ध शाकाहारी व स्वच्छ स्वादिष्ट भोजन', canvas.width / 2, 110);

    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, 125);
    ctx.lineTo(canvas.width - 80, 125);
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.font = 'bold 26px system-ui, sans-serif';

    const items = [
      { hi: '१. मसाला डोसा (Masala Dosa)', pr: '₹८०' },
      { hi: '२. रवा इडली व सांबर (Rava Idli)', pr: '₹५०' },
      { hi: '३. मेदु वड़ा - २ पीस (Medu Vada)', pr: '₹४०' },
      { hi: '४. पूरी भाजी स्पेशल (Poori Bhaji)', pr: '₹७०' },
      { hi: '५. मद्रास फ़िल्टर कॉफ़ी (Filter Coffee)', pr: '₹३०' }
    ];

    let y = 180;
    items.forEach((item) => {
      ctx.fillStyle = '#1e293b';
      ctx.fillText(item.hi, 90, y);
      ctx.fillStyle = '#047857';
      ctx.fillText(item.pr, canvas.width - 180, y);
      y += 55;
    });

    ctx.fillStyle = '#6b7280';
    ctx.font = 'italic 20px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('सभी कर सहित • आपका हार्दिक स्वागत है', canvas.width / 2, 475);
  } else {
    // Telugu Notice
    state.imageSourceLang = 'te';
    if (elements.imageSourceLangSelect) elements.imageSourceLangSelect.value = 'te';

    ctx.fillStyle = '#064e3b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 8;
    ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);

    ctx.fillStyle = '#ecfdf5';
    ctx.font = 'bold 38px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('రైల్వే స్టేషన్ సమాచార బోర్డు', canvas.width / 2, 85);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 44px system-ui, sans-serif';
    ctx.fillText('సికింద్రాబాద్ జంక్షన్', canvas.width / 2, 170);

    ctx.fillStyle = '#ffffff';
    ctx.font = '28px system-ui, sans-serif';
    ctx.fillText('SECUNDERABAD JUNCTION • PLATFORM 1', canvas.width / 2, 220);

    ctx.fillStyle = '#a7f3d0';
    ctx.font = '26px system-ui, sans-serif';
    ctx.fillText('ప్రయాణికులందరికీ శుభోదయం మరియు స్వాగతం.', canvas.width / 2, 310);
    ctx.fillText('దయచేసి రైలు ఎక్కేముందు మీ టికెట్ తనిఖీ చేయండి.', canvas.width / 2, 360);
    ctx.fillText('సహాయం లేదా విచారణ కోసం 139 నంబర్‌కు కాల్ చేయండి.', canvas.width / 2, 410);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 24px system-ui, sans-serif';
    ctx.fillText('మీ ప్రయాణం ఆహ్లాదకరంగా సాగాలని కోరుకుంటున్నాము.', canvas.width / 2, 470);
  }

  return canvas.toDataURL('image/png');
}

// ============================================================================
// PDF TRANSLATOR ENGINE & UI CONTROLLER
// ============================================================================
async function handlePdfFile(file) {
  if (!file) return;
  if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
    showToast('Please upload a PDF document (.pdf)');
    return;
  }

  state.pdfFileName = file.name;
  if (elements.pdfFileName) elements.pdfFileName.textContent = file.name;

  try {
    const arrayBuffer = await file.arrayBuffer();
    await processPdfArrayBuffer(arrayBuffer, file.name);
  } catch (err) {
    showToast(`Failed to read PDF: ${err.message}`);
  }
}

async function processPdfArrayBuffer(arrayBuffer, fileName = 'document.pdf') {
  if (!arrayBuffer) return;

  state.pdfFileName = fileName;
  if (elements.pdfFileName) elements.pdfFileName.textContent = fileName;
  if (elements.pdfFileMeta) elements.pdfFileMeta.textContent = 'Analyzing PDF pages...';

  if (elements.pdfProcessingCard) elements.pdfProcessingCard.classList.remove('hidden');
  if (elements.pdfResultsContainer) elements.pdfResultsContainer.classList.add('hidden');

  updatePdfProgress({ status: 'Extracting text from PDF pages...', progress: 10 });

  try {
    const extracted = await pdfHelper.extractPdf(
      arrayBuffer,
      state.pdfSourceLang,
      (prog) => {
        updatePdfProgress({
          status: prog.status || 'Extracting pages...',
          progress: Math.min(50, Math.round((prog.percent || 0) * 0.5))
        });
      }
    );

    if (!extracted.pages || extracted.pages.length === 0) {
      if (elements.pdfProcessingCard) elements.pdfProcessingCard.classList.add('hidden');
      showToast('No readable pages found in this PDF.');
      return;
    }

    const totalChars = extracted.pages.reduce((acc, p) => acc + (p.text || '').length, 0);
    if (elements.pdfFileMeta) {
      elements.pdfFileMeta.textContent = `${extracted.pages.length} Pages • ${totalChars.toLocaleString()} characters`;
    }

    const targetLangObj = getLanguage(state.pdfTargetLang);
    const targetName = targetLangObj ? targetLangObj.name : 'Target Language';

    state.pdfPages = [];

    for (let i = 0; i < extracted.pages.length; i++) {
      const page = extracted.pages[i];
      const pageProg = Math.round(50 + ((i + 1) / extracted.pages.length) * 48);

      updatePdfProgress({
        status: `Translating Page ${page.pageNum} of ${extracted.pages.length} into pure ${targetName} script...`,
        progress: pageProg
      });

      const transResult = await translationEngine.translateLongText(
        page.text,
        state.pdfSourceLang,
        state.pdfTargetLang
      );
      const translated = typeof transResult === 'string' ? transResult : (transResult?.translatedText || '');

      state.pdfPages.push({
        pageNum: page.pageNum,
        originalText: page.text,
        translatedText: translated
      });
    }

    updatePdfProgress({ status: 'Translation complete!', progress: 100 });

    renderPdfPageTabs();
    showPdfTab('all');

    if (elements.pdfProcessingCard) elements.pdfProcessingCard.classList.add('hidden');
    if (elements.pdfResultsContainer) {
      elements.pdfResultsContainer.classList.remove('hidden');
      elements.pdfResultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    showToast(`Successfully translated all ${state.pdfPages.length} PDF pages!`);
  } catch (err) {
    console.error('PDF translation error:', err);
    if (elements.pdfProcessingCard) elements.pdfProcessingCard.classList.add('hidden');
    showToast(`PDF error: ${err.message || 'Failed to process'}`);
  }
}

function updatePdfProgress({ status, progress }) {
  if (elements.pdfProgressStatus && status) {
    elements.pdfProgressStatus.textContent = status;
  }
  if (elements.pdfProgressPercent && typeof progress === 'number') {
    elements.pdfProgressPercent.textContent = `${progress}%`;
  }
  if (elements.pdfProgressBarFill && typeof progress === 'number') {
    elements.pdfProgressBarFill.style.width = `${progress}%`;
  }
}

function renderPdfPageTabs() {
  if (!elements.pdfPageTabs) return;
  elements.pdfPageTabs.innerHTML = '';

  const allBtn = document.createElement('button');
  allBtn.type = 'button';
  allBtn.className = `pdf-tab-pill ${state.pdfCurrentTab === 'all' ? 'active' : ''}`;
  allBtn.dataset.tab = 'all';
  allBtn.textContent = `All Pages (${state.pdfPages.length})`;
  allBtn.addEventListener('click', () => showPdfTab('all'));
  elements.pdfPageTabs.appendChild(allBtn);

  state.pdfPages.forEach((p) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `pdf-tab-pill ${state.pdfCurrentTab === p.pageNum ? 'active' : ''}`;
    btn.dataset.tab = p.pageNum;
    btn.textContent = `Page ${p.pageNum}`;
    btn.addEventListener('click', () => showPdfTab(p.pageNum));
    elements.pdfPageTabs.appendChild(btn);
  });
}

function showPdfTab(tabKey) {
  state.pdfCurrentTab = tabKey;

  if (elements.pdfPageTabs) {
    elements.pdfPageTabs.querySelectorAll('.pdf-tab-pill').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tab === String(tabKey));
    });
  }

  const targetLangObj = getLanguage(state.pdfTargetLang);
  const targetName = targetLangObj ? targetLangObj.name : 'Target Language';
  if (elements.pdfTargetPageTitle) {
    elements.pdfTargetPageTitle.textContent = targetName;
  }

  if (tabKey === 'all') {
    if (elements.pdfSourcePageTitle) {
      elements.pdfSourcePageTitle.textContent = `All Pages (1-${state.pdfPages.length})`;
    }

    let origCombined = '';
    let transCombined = '';
    let totalChars = 0;

    state.pdfPages.forEach((p) => {
      const orig = typeof p.originalText === 'string' ? p.originalText : (p.originalText?.text || '');
      const trans = typeof p.translatedText === 'string' ? p.translatedText : (p.translatedText?.translatedText || '');
      totalChars += orig.length;
      origCombined += `<div class="pdf-page-divider">📄 Page ${p.pageNum}</div>\n${escapeHtml(orig)}\n\n`;
      transCombined += `<div class="pdf-page-divider">📄 Page ${p.pageNum} (${targetName})</div>\n${escapeHtml(trans)}\n\n`;
    });

    if (elements.pdfSourceCharBadge) {
      elements.pdfSourceCharBadge.textContent = `${totalChars.toLocaleString()} chars`;
    }
    if (elements.pdfOriginalContent) {
      elements.pdfOriginalContent.innerHTML = origCombined;
    }
    if (elements.pdfTranslatedContent) {
      elements.pdfTranslatedContent.innerHTML = transCombined;
    }
  } else {
    const pageNum = parseInt(tabKey, 10);
    const page = state.pdfPages.find((p) => p.pageNum === pageNum);
    if (!page) return;

    const orig = typeof page.originalText === 'string' ? page.originalText : (page.originalText?.text || '');
    const trans = typeof page.translatedText === 'string' ? page.translatedText : (page.translatedText?.translatedText || '');

    if (elements.pdfSourcePageTitle) {
      elements.pdfSourcePageTitle.textContent = `Page ${pageNum}`;
    }
    if (elements.pdfSourceCharBadge) {
      elements.pdfSourceCharBadge.textContent = `${orig.length.toLocaleString()} chars`;
    }
    if (elements.pdfOriginalContent) {
      elements.pdfOriginalContent.innerHTML = `<div class="pdf-page-divider">📄 Page ${pageNum} Original</div>\n${escapeHtml(orig)}`;
    }
    if (elements.pdfTranslatedContent) {
      elements.pdfTranslatedContent.innerHTML = `<div class="pdf-page-divider">📄 Page ${pageNum} (${targetName})</div>\n${escapeHtml(trans)}`;
    }
  }
}

async function generateSamplePdf(sampleType) {
  if (typeof window === 'undefined' || !window.jspdf || !window.jspdf.jsPDF) {
    showToast('jsPDF library loading... please try again in a second.');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  if (sampleType === 'ticket') {
    state.pdfSourceLang = 'en';
    if (elements.pdfSourceLangSelect) elements.pdfSourceLangSelect.value = 'en';

    doc.setFontSize(16);
    doc.setTextColor(20, 50, 120);
    doc.text('INDIAN RAILWAYS - ELECTRONIC RESERVATION SLIP (ERS)', 15, 20);

    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    doc.text('PNR Number: 452-9812470', 15, 32);
    doc.text('Train No. & Name: 12728 / GODAVARI SUPERFAST EXPRESS', 15, 40);
    doc.text('Quota: GENERAL (GN) | Class: 3rd AC (3A) | Date of Journey: 18-Nov-2026', 15, 48);
    doc.text('From: HYDERABAD DECCAN (HYB) -> To: VISAKHAPATNAM (VSKP)', 15, 56);
    doc.text('Scheduled Departure: 17:05 hrs | Scheduled Arrival: 05:45 hrs', 15, 64);

    doc.line(15, 70, 195, 70);

    doc.setFontSize(13);
    doc.setTextColor(20, 50, 120);
    doc.text('PASSENGER DETAILS', 15, 80);

    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text('1. Rajesh Kumar Pappula | Age: 34 | Gender: Male | Coach: B3 | Berth: 25 (Lower Berth)', 15, 90);
    doc.text('2. Sunita Sharma Pappula | Age: 31 | Gender: Female | Coach: B3 | Berth: 26 (Middle Berth)', 15, 98);
    doc.text('Total Fare: Rs. 2,480 (Inclusive of GST & IRCTC Convenience fee)', 15, 108);

    doc.line(15, 115, 195, 115);

    doc.setFontSize(12);
    doc.setTextColor(180, 50, 20);
    doc.text('IMPORTANT PASSENGER INSTRUCTIONS', 15, 125);

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const instructions = [
      '1. One of the passengers must carry an original government-approved Photo ID card (Aadhaar, Passport, or Driving License).',
      '2. Please report to the boarding station at least 30 minutes prior to departure.',
      '3. Smoking and carrying inflammable substances on trains is strictly prohibited and punishable by law.',
      '4. Contact railway helpline 139 for real-time train status, security assistance, and medical emergencies.',
      '5. Wishing all passengers a safe, comfortable, and memorable journey.'
    ];
    let yPos = 135;
    instructions.forEach((ins) => {
      const lines = doc.splitTextToSize(ins, 175);
      doc.text(lines, 15, yPos);
      yPos += lines.length * 6 + 2;
    });

    doc.addPage();
    doc.setFontSize(15);
    doc.setTextColor(20, 50, 120);
    doc.text('TRAVEL ADVISORY & HEALTH GUIDELINES', 15, 20);

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const page2Text = [
      'Welcome to Indian Railways. Our dedicated staff is available round-the-clock for passenger comfort.',
      'Clean Food & Refreshments: Pantry car services are available. You can also order hygienic e-catering meals directly to your berth via the official IRCTC app.',
      'Baggage Allowance: Passengers travelling in 3A can carry up to 40 kg luggage free of charge. Please lock and safely store luggage under your seat.',
      'Emergency Assistance: In case of any difficulty during the journey, call 139 or alert the Train Ticket Examiner (TTE) in coach B3.',
      'Thank you for traveling with Bharat Rail.'
    ];
    let yPos2 = 32;
    page2Text.forEach((t) => {
      const lines = doc.splitTextToSize(t, 175);
      doc.text(lines, 15, yPos2);
      yPos2 += lines.length * 6 + 2;
    });

    const buffer = doc.output('arraybuffer');
    await processPdfArrayBuffer(buffer, 'Train_Ticket_Sample.pdf');
  } else {
    state.pdfSourceLang = 'en';
    if (elements.pdfSourceLangSelect) elements.pdfSourceLangSelect.value = 'en';

    doc.setFontSize(16);
    doc.setTextColor(20, 100, 60);
    doc.text('INDIA HERITAGE & TOURISM TRAVEL GUIDE', 15, 20);

    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    doc.text('Destination: New Delhi, Agra, Jaipur & South India', 15, 30);
    doc.text('Duration: 7 Days Cultural Tour Package', 15, 38);

    doc.line(15, 45, 195, 45);

    doc.setFontSize(12);
    doc.setTextColor(20, 100, 60);
    doc.text('Day 1 & Day 2: Historic New Delhi & Agra', 15, 55);

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const day1Text = [
      'Explore the architectural wonders of the Red Fort, India Gate, and Qutub Minar in New Delhi.',
      'In the morning, travel to Agra to experience the sunrise at the Taj Mahal, one of the seven wonders of the world.',
      'Travel Tip: Always carry a light scarf when visiting sacred temples, and remember to remove shoes before entering temple premises.'
    ];
    let y = 63;
    day1Text.forEach((t) => {
      const lines = doc.splitTextToSize(t, 175);
      doc.text(lines, 15, y);
      y += lines.length * 6 + 2;
    });

    doc.setFontSize(12);
    doc.setTextColor(20, 100, 60);
    doc.text('Day 3 to Day 5: Pink City of Jaipur & Royal Palaces', 15, y + 5);
    y += 13;

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const day3Text = [
      'Discover the magnificent Amber Fort, Hawa Mahal (Palace of Winds), and City Palace in Jaipur.',
      'Taste traditional Rajasthani cuisine including Dal Baati Churma and sweet Ghevar.',
      'Local Language Tip: Use "Namaste" for greetings and "Dhanyavaad" for thank you.'
    ];
    day3Text.forEach((t) => {
      const lines = doc.splitTextToSize(t, 175);
      doc.text(lines, 15, y);
      y += lines.length * 6 + 2;
    });

    const buffer = doc.output('arraybuffer');
    await processPdfArrayBuffer(buffer, 'India_Travel_Itinerary.pdf');
  }
}

function downloadTranslatedPdfDocument() {
  if (!state.pdfPages || state.pdfPages.length === 0) {
    showToast('No translated PDF to download.');
    return;
  }
  const targetLangObj = getLanguage(state.pdfTargetLang);
  const targetName = targetLangObj ? targetLangObj.name : 'Translated';
  pdfHelper.exportPdf(state.pdfPages, targetName, state.pdfFileName);
  showToast(`Downloading translated PDF in ${targetName}...`);
}

function downloadTranslatedPdfTextDocument() {
  if (!state.pdfPages || state.pdfPages.length === 0) {
    showToast('No translated text to download.');
    return;
  }
  const targetLangObj = getLanguage(state.pdfTargetLang);
  const targetName = targetLangObj ? targetLangObj.name : 'Translated';

  let formatted = `========================================================\n`;
  formatted += `BHARAT TRANSLATOR - PDF TRANSLATION DOCUMENT\n`;
  formatted += `Document: ${state.pdfFileName}\n`;
  formatted += `Target Language: ${targetName}\n`;
  formatted += `Total Pages: ${state.pdfPages.length}\n`;
  formatted += `========================================================\n\n`;

  state.pdfPages.forEach((p) => {
    const trans = typeof p.translatedText === 'string' ? p.translatedText : (p.translatedText?.translatedText || String(p.translatedText || ''));
    formatted += `--- PAGE ${p.pageNum} (${targetName}) ---\n`;
    formatted += `${trans}\n\n`;
  });

  const downloadName = state.pdfFileName.replace(/\.[^/.]+$/, '') + `_${targetName}_translated.txt`;
  pdfHelper.downloadTextFile(formatted, downloadName);
  showToast(`Downloading text file: ${downloadName}`);
}

function copyAllPdfTranslations() {
  if (!state.pdfPages || state.pdfPages.length === 0) {
    showToast('No translation to copy.');
    return;
  }
  const fullTranslated = state.pdfPages
    .map((p) => {
      const trans = typeof p.translatedText === 'string' ? p.translatedText : (p.translatedText?.translatedText || String(p.translatedText || ''));
      return `--- Page ${p.pageNum} ---\n${trans}`;
    })
    .join('\n\n');

  navigator.clipboard
    .writeText(fullTranslated)
    .then(() => showToast('All translated PDF pages copied to clipboard!'))
    .catch(() => showToast('Failed to copy to clipboard.'));
}

function speakPdfCurrentView() {
  if (!state.pdfPages || state.pdfPages.length === 0) {
    showToast('No text available to read.');
    return;
  }

  let textToSpeak = '';
  if (state.pdfCurrentTab === 'all') {
    textToSpeak = state.pdfPages
      .map((p) => (typeof p.translatedText === 'string' ? p.translatedText : (p.translatedText?.translatedText || '')))
      .join('. ');
  } else {
    const pageNum = parseInt(state.pdfCurrentTab, 10);
    const p = state.pdfPages.find((pg) => pg.pageNum === pageNum);
    textToSpeak = p ? (typeof p.translatedText === 'string' ? p.translatedText : (p.translatedText?.translatedText || '')) : '';
  }

  if (!textToSpeak) {
    showToast('No text on this page to speak.');
    return;
  }

  speakText(textToSpeak, state.pdfTargetLang);
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
  const s = typeof str === 'string' ? str : (str?.translatedText || str?.text || String(str));
  return s
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
