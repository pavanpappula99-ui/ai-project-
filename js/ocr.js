/**
 * Bharat Translator - OCR (Optical Character Recognition) Engine
 * Powered by Tesseract.js client-side WebAssembly.
 * Extracts text from photos, signboards, menus, and document images
 * in English and Indian languages.
 */

import { getOcrCode } from './config.js';

class OcrEngine {
  constructor() {
    this.isProcessing = false;
  }

  /**
   * Check if Tesseract.js is loaded in the browser
   */
  isSupported() {
    return typeof window !== 'undefined' && typeof window.Tesseract !== 'undefined';
  }

  /**
   * Convert file / blob to an optimized Image Data URL
   * Optionally enhances contrast for better OCR recognition of Indian scripts
   * @param {File|Blob|string} imageInput
   * @returns {Promise<string>}
   */
  async prepareImage(imageInput) {
    if (typeof imageInput === 'string' && imageInput.startsWith('data:')) {
      return imageInput;
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Downscale if ridiculously large (> 2400px) to prevent mobile browser crash
          const maxDim = 2400;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL('image/jpeg', 0.92));
        };
        img.onerror = () => reject(new Error('Failed to load image file.'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read image file.'));

      if (imageInput instanceof Blob) {
        reader.readAsDataURL(imageInput);
      } else {
        resolve(imageInput);
      }
    });
  }

  /**
   * Extract text from an image
   * @param {File|Blob|string} imageInput - Image file, blob, or base64/URL
   * @param {string} langId - Language ID (e.g. 'te', 'hi', 'en') or direct OCR code (e.g. 'eng+tel')
   * @param {function} [onProgress] - callback({ status: string, progress: number, stage: string })
   * @returns {Promise<{ text: string, confidence: number, rawData: object }>}
   */
  async recognize(imageInput, langId = 'en', onProgress = null) {
    if (!this.isSupported()) {
      throw new Error('OCR engine library (Tesseract.js) is not loaded. Please check your internet connection and refresh.');
    }

    this.isProcessing = true;

    try {
      if (onProgress) {
        onProgress({ status: 'Preparing image...', progress: 5, stage: 'prepare' });
      }

      const imageUrl = await this.prepareImage(imageInput);

      // Determine OCR language codes (e.g. 'tel+eng', 'hin+eng', 'eng')
      let ocrLang = langId;
      if (!langId.includes('+') && langId.length <= 4) {
        ocrLang = getOcrCode(langId);
      }

      if (onProgress) {
        onProgress({ status: `Loading language recognition model (${ocrLang})...`, progress: 15, stage: 'init' });
      }

      const result = await window.Tesseract.recognize(imageUrl, ocrLang, {
        logger: (m) => {
          if (!onProgress) return;
          if (m.status === 'loading tesseract core') {
            onProgress({ status: 'Loading OCR core...', progress: 20, stage: 'core' });
          } else if (m.status === 'initializing tesseract') {
            onProgress({ status: 'Initializing engine...', progress: 30, stage: 'init' });
          } else if (m.status === 'loading language traineddata') {
            const p = Math.round(30 + (m.progress || 0) * 25);
            onProgress({ status: `Downloading language models: ${Math.round((m.progress || 0) * 100)}%`, progress: p, stage: 'lang' });
          } else if (m.status === 'initializing api') {
            onProgress({ status: 'Starting recognition engine...', progress: 60, stage: 'api' });
          } else if (m.status === 'recognizing text') {
            const p = Math.round(60 + (m.progress || 0) * 38);
            onProgress({ status: `Scanning & reading text: ${Math.round((m.progress || 0) * 100)}%`, progress: p, stage: 'scan' });
          }
        }
      });

      if (onProgress) {
        onProgress({ status: 'Text extraction complete!', progress: 100, stage: 'done' });
      }

      const rawText = result?.data?.text || '';
      // Clean up multiple trailing empty lines while preserving paragraph spacing
      const cleanedText = rawText
        .split('\n')
        .map((line) => line.trim())
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

      return {
        text: cleanedText,
        confidence: Math.round(result?.data?.confidence || 0),
        rawData: result?.data
      };
    } finally {
      this.isProcessing = false;
    }
  }
}

export const ocrEngine = new OcrEngine();
