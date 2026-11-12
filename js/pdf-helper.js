/**
 * Bharat Translator - PDF Processing & Export Helper
 * Powered by Mozilla PDF.js & jsPDF client-side libraries.
 * Handles:
 * - Extracting text page-by-page from digital and scanned PDFs
 * - Generating and downloading translated PDFs
 * - UTF-8 formatted document downloads
 */

import { ocrEngine } from './ocr.js';

class PdfHelper {
  constructor() {
    this.isProcessing = false;
    this.initWorker();
  }

  initWorker() {
    if (typeof window !== 'undefined' && window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
  }

  isSupported() {
    return typeof window !== 'undefined' && typeof window.pdfjsLib !== 'undefined';
  }

  /**
   * Extract text from all pages of a PDF file
   * @param {File|Blob|ArrayBuffer} pdfInput
   * @param {string} [ocrLangId] - Optional OCR language if scanned page encountered
   * @param {function} [onProgress] - callback({ status: string, current: number, total: number, percent: number })
   * @returns {Promise<{ filename: string, totalPages: number, pages: Array<{ pageNum: number, text: string }>, fullText: string }>}
   */
  async extractPdf(pdfInput, ocrLangId = 'en', onProgress = null) {
    if (!this.isSupported()) {
      throw new Error('PDF.js library is not loaded. Please check your internet connection.');
    }

    this.initWorker();
    this.isProcessing = true;

    try {
      if (onProgress) {
        onProgress({ status: 'Loading PDF document...', current: 0, total: 0, percent: 5 });
      }

      let arrayBuffer;
      let filename = 'document.pdf';

      if (pdfInput instanceof File) {
        filename = pdfInput.name;
        arrayBuffer = await pdfInput.arrayBuffer();
      } else if (pdfInput instanceof Blob) {
        arrayBuffer = await pdfInput.arrayBuffer();
      } else if (pdfInput instanceof ArrayBuffer) {
        arrayBuffer = pdfInput;
      } else {
        throw new Error('Invalid PDF input type.');
      }

      const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const totalPages = pdf.numPages;

      const pages = [];
      let fullTextParts = [];

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const percent = Math.round((pageNum / totalPages) * 100);
        if (onProgress) {
          onProgress({
            status: `Reading page ${pageNum} of ${totalPages}...`,
            current: pageNum,
            total: totalPages,
            percent
          });
        }

        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        // Extract and format text lines from PDF items
        let pageText = '';
        let lastY = null;

        for (const item of textContent.items) {
          if (!item.str) continue;
          if (lastY !== null && Math.abs(item.transform[5] - lastY) > 8) {
            pageText += '\n';
          } else if (pageText && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
            pageText += ' ';
          }
          pageText += item.str;
          lastY = item.transform[5];
        }

        pageText = pageText.trim();

        // If page has almost no text (scanned PDF image), render to canvas and OCR it!
        if (pageText.length < 30 && ocrEngine.isSupported()) {
          try {
            if (onProgress) {
              onProgress({
                status: `Page ${pageNum} is a scanned image, running OCR...`,
                current: pageNum,
                total: totalPages,
                percent
              });
            }
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d');
            await page.render({ canvasContext: ctx, viewport }).promise;

            const ocrResult = await ocrEngine.recognize(canvas, ocrLangId);
            if (ocrResult.text && ocrResult.text.length > pageText.length) {
              pageText = ocrResult.text;
            }
          } catch (ocrErr) {
            console.warn(`OCR fallback on PDF page ${pageNum} failed:`, ocrErr.message);
          }
        }

        pages.push({
          pageNum,
          text: pageText || `[Page ${pageNum}: No text detected]`
        });

        if (pageText) {
          fullTextParts.push(`--- Page ${pageNum} ---\n${pageText}`);
        }
      }

      return {
        filename,
        totalPages,
        pages,
        fullText: fullTextParts.join('\n\n')
      };
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Download a text file with UTF-8 BOM so Indian languages render cleanly in Notepad/Word
   */
  downloadTextFile(content, filename = 'translated-document.txt') {
    // \uFEFF is the UTF-8 Byte Order Mark for proper regional font decoding
    const blob = new Blob(['\uFEFF' + content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }

  /**
   * Export translated pages into a formatted PDF file using jsPDF
   * @param {Array<{ pageNum: number, text: string }>} translatedPages
   * @param {string} targetLangName
   * @param {string} originalFilename
   */
  async exportPdf(translatedPages, targetLangName = 'Translated', originalFilename = 'document.pdf') {
    const baseName = originalFilename.replace(/\.[^/.]+$/, '');
    const exportFilename = `${baseName}_${targetLangName}_translated.pdf`;

    if (typeof window !== 'undefined' && window.jspdf && window.jspdf.jsPDF) {
      try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 18;
        const maxLineWidth = pageWidth - margin * 2;

        translatedPages.forEach((pageObj, index) => {
          if (index > 0) doc.addPage();

          const rawText = pageObj.translatedText || pageObj.text || '';
          const pageStr = typeof rawText === 'string' ? rawText : (rawText?.translatedText || String(rawText));

          // Header
          doc.setFontSize(10);
          doc.setTextColor(120, 120, 120);
          doc.text(`Bharat Translator | ${targetLangName} Translation`, margin, 12);
          doc.setDrawColor(220, 220, 220);
          doc.line(margin, 14, pageWidth - margin, 14);

          // Page Title
          doc.setFontSize(13);
          doc.setTextColor(30, 41, 59);
          doc.text(`Page ${pageObj.pageNum}`, margin, 22);

          // Content
          doc.setFontSize(11);
          doc.setTextColor(51, 65, 85);
          const splitLines = doc.splitTextToSize(pageStr, maxLineWidth);
          
          let y = 30;
          const lineHeight = 6;
          for (const line of splitLines) {
            if (y > pageHeight - 18) {
              doc.addPage();
              y = 20;
            }
            doc.text(line, margin, y);
            y += lineHeight;
          }

          // Footer
          doc.setFontSize(9);
          doc.setTextColor(140, 140, 140);
          doc.text(
            `Page ${index + 1} of ${translatedPages.length}`,
            pageWidth / 2,
            pageHeight - 10,
            { align: 'center' }
          );
        });

        doc.save(exportFilename);
        return true;
      } catch (pdfErr) {
        console.warn('jsPDF export error, falling back to printable view / text file:', pdfErr);
      }
    }

    // Fallback: If jsPDF font rendering has script limitations, download UTF-8 text file and trigger print view
    const combinedText = translatedPages
      .map((p) => {
        const raw = p.translatedText || p.text || '';
        const s = typeof raw === 'string' ? raw : (raw?.translatedText || String(raw));
        return `==================== PAGE ${p.pageNum} (${targetLangName}) ====================\n\n${s}`;
      })
      .join('\n\n\n');
    this.downloadTextFile(combinedText, `${baseName}_${targetLangName}_translated.txt`);
    return false;
  }
}

export const pdfHelper = new PdfHelper();
