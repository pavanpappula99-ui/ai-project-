/**
 * Bharat Translator - Storage & Persistence
 * Manages favorites, conversation history, and user settings using LocalStorage.
 */

const STORAGE_KEYS = {
  FAVORITES: 'bharat_translator_favorites',
  HISTORY: 'bharat_translator_history',
  SETTINGS: 'bharat_translator_settings'
};

const DEFAULT_SETTINGS = {
  theme: 'dark',
  sourceLang: 'hi',
  targetLang: 'en',
  speechRate: 0.95,
  autoSpeakTranslation: true
};

class StorageManager {
  // --- Settings ---
  getSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : { ...DEFAULT_SETTINGS };
    } catch (e) {
      return { ...DEFAULT_SETTINGS };
    }
  }

  saveSettings(partialSettings) {
    try {
      const current = this.getSettings();
      const updated = { ...current, ...partialSettings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('Failed to save settings:', e);
      return partialSettings;
    }
  }

  // --- Favorites ---
  getFavorites() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  saveFavorite({ originalText, translatedText, sourceLang, targetLang }) {
    if (!originalText || !translatedText) return false;
    const favorites = this.getFavorites();

    // Avoid duplicates
    const exists = favorites.some(
      (f) =>
        f.originalText.toLowerCase() === originalText.toLowerCase() &&
        f.sourceLang === sourceLang &&
        f.targetLang === targetLang
    );

    if (exists) return false;

    const newFav = {
      id: 'fav_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      originalText,
      translatedText,
      sourceLang,
      targetLang,
      createdAt: new Date().toISOString()
    };

    favorites.unshift(newFav);
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
      return newFav;
    } catch (e) {
      console.warn('Failed to persist favorite:', e);
      return false;
    }
  }

  removeFavorite(id) {
    const favorites = this.getFavorites().filter((f) => f.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
      return true;
    } catch (e) {
      return false;
    }
  }

  isFavorite(originalText, sourceLang, targetLang) {
    if (!originalText) return false;
    const favorites = this.getFavorites();
    return favorites.some(
      (f) =>
        f.originalText.toLowerCase() === originalText.toLowerCase() &&
        f.sourceLang === sourceLang &&
        f.targetLang === targetLang
    );
  }

  // --- Conversation History ---
  getHistory() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  addHistoryEntry({ speaker, originalText, translatedText, sourceLang, targetLang }) {
    const history = this.getHistory();
    const entry = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      speaker: speaker || 'person1', // 'person1' (Speaking) or 'person2' (Partner)
      originalText,
      translatedText,
      sourceLang,
      targetLang,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString()
    };

    history.push(entry);
    // Limit to latest 100 entries
    if (history.length > 100) history.shift();

    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
      return entry;
    } catch (e) {
      return entry;
    }
  }

  clearHistory() {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
      return true;
    } catch (e) {
      return false;
    }
  }
}

export const storage = new StorageManager();
