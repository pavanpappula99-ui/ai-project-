/**
 * Bharat Translator - OCR (Optical Character Recognition) Engine
 * Powered by Tesseract.js client-side WebAssembly.
 * Extracts text from photos, signboards, menus, notes, and document images
 * in English and Indian languages with adaptive contrast preprocessing.
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
   * Convert file / blob / canvas / dataUrl to an optimized Image Data URL
   * Applies adaptive contrast enhancement for clearer handwriting and Indian scripts
   * @param {File|Blob|HTMLCanvasElement|string} imageInput
   * @returns {Promise<string>}
   */
  async prepareImage(imageInput) {
    if (typeof HTMLCanvasElement !== 'undefined' && imageInput instanceof HTMLCanvasElement) {
      return imageInput.toDataURL('image/jpeg', 0.95);
    }

    return new Promise((resolve, reject) => {
      const processImg = (img) => {
        try {
          const maxDim = 2200;
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;

          // Scale if overly large to prevent mobile GPU crashes
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          // If image is too small (< 700px), upscale slightly so handwriting is legible to OCR
          if (width < 700 && height < 700) {
            const scale = Math.min(2.0, 900 / Math.max(width, height));
            width = Math.round(width * scale);
            height = Math.round(height * scale);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          // Draw base image
          ctx.drawImage(img, 0, 0, width, height);

          // Contrast stretch to suppress shadows and enhance handwriting/sign text
          try {
            const imgData = ctx.getImageData(0, 0, width, height);
            const d = imgData.data;
            for (let i = 0; i < d.length; i += 4) {
              const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
              // Background whitening / ink darkening
              const enhanced = gray > 140 ? Math.min(255, gray * 1.15) : Math.max(0, (gray - 20) * 1.15);
              d[i] = enhanced;
              d[i + 1] = enhanced;
              d[i + 2] = enhanced;
            }
            ctx.putImageData(imgData, 0, 0);
          } catch (pixelErr) {
            // If cross-origin or canvas security restricts getImageData, use standard canvas
          }

          resolve(canvas.toDataURL('image/jpeg', 0.95));
        } catch (err) {
          reject(err);
        }
      };

      if (typeof imageInput === 'string') {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => processImg(img);
        img.onerror = () => reject(new Error('Failed to load image.'));
        img.src = imageInput;
      } else if (imageInput instanceof Blob) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => processImg(img);
          img.onerror = () => reject(new Error('Failed to parse image from file.'));
          img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error('Failed to read image file.'));
        reader.readAsDataURL(imageInput);
      } else {
        reject(new Error('Unsupported image format.'));
      }
    });
  }

  /**
   * Extract text from an image
   * @param {File|Blob|HTMLCanvasElement|string} imageInput
   * @param {string} langId - Language ID (e.g. 'auto', 'en', 'te', 'hi')
   * @param {function} [onProgress] - callback({ status: string, progress: number, stage: string })
   * @returns {Promise<{ text: string, confidence: number, rawData: object }>}
   */
  async recognize(imageInput, langId = 'auto', onProgress = null) {
    if (!this.isSupported()) {
      throw new Error('OCR engine library (Tesseract.js) is not loaded. Please check your internet connection and refresh.');
    }

    this.isProcessing = true;

    try {
      if (onProgress) {
        onProgress({ status: 'Enhancing image for text recognition...', progress: 10, stage: 'prepare' });
      }

      const imageUrl = await this.prepareImage(imageInput);

      // Determine OCR language codes (e.g. 'eng', 'tel+eng', 'hin+eng')
      let ocrLang = 'eng';
      if (langId && langId !== 'auto') {
        ocrLang = getOcrCode(langId);
      }

      if (onProgress) {
        onProgress({ status: `Loading language recognition model (${ocrLang})...`, progress: 20, stage: 'init' });
      }

      const result = await window.Tesseract.recognize(imageUrl, ocrLang, {
        logger: (m) => {
          if (!onProgress) return;
          if (m.status === 'loading tesseract core') {
            onProgress({ status: 'Loading OCR core engine...', progress: 25, stage: 'core' });
          } else if (m.status === 'initializing tesseract') {
            onProgress({ status: 'Initializing recognition neural net...', progress: 35, stage: 'init' });
          } else if (m.status === 'loading language traineddata') {
            const p = Math.round(35 + (m.progress || 0) * 30);
            onProgress({ status: `Downloading language models: ${Math.round((m.progress || 0) * 100)}%`, progress: p, stage: 'lang' });
          } else if (m.status === 'initializing api') {
            onProgress({ status: 'Starting recognition engine...', progress: 70, stage: 'api' });
          } else if (m.status === 'recognizing text') {
            const p = Math.round(70 + (m.progress || 0) * 28);
            onProgress({ status: `Scanning & reading text: ${Math.round((m.progress || 0) * 100)}%`, progress: p, stage: 'scan' });
          }
        }
      });

      if (onProgress) {
        onProgress({ status: 'Text extraction complete!', progress: 100, stage: 'done' });
      }

      const rawText = result?.data?.text || '';

      // Clean up OCR artifacts, noise lines, and common handwriting OCR misreads
      const lines = rawText.split('\n').map((l) => l.trim());
      const cleanedLines = [];

      for (const line of lines) {
        if (!line) continue;
        // Check if line contains letters or numbers
        const hasLetters = /[\p{L}\p{N}]/u.test(line);
        if (!hasLetters) continue; // Skip lines with only punctuation like "! - | ;"

        // Strip leading/trailing stray non-alphanumeric noise
        let clean = line
          .replace(/^[-—_+=~`"':;\\/.,|*#^<>{}\[\]\s]+/, '')
          .replace(/[-—_+=~`"':;\\/.,|*#^<>{}\[\]\s]+$/, '')
          .trim();

        // Fix common handwriting OCR misreads
        clean = clean
          .replace(/\\Jou\b/g, 'you')
          .replace(/\\jou\b/g, 'you')
          .replace(/\bevcited\b/gi, 'excited');

        // Only keep if meaningful text remains
        if (/[\p{L}\p{N}]/u.test(clean)) {
          cleanedLines.push(clean);
        }
      }

      const cleanedText = cleanedLines.length > 0 ? cleanedLines.join('\n') : rawText.trim();

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
