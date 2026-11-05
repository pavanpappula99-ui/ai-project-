/**
 * Bharat Translator - Node.js Backend Proxy Server
 * Zero-dependency pure Node.js HTTP server.
 * Proxies translation requests to keep API keys secure.
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const idx = trimmed.indexOf('=');
    if (idx !== -1) {
      const key = trimmed.substring(0, idx).trim();
      const val = trimmed.substring(idx + 1).trim();
      env[key] = val;
    }
  });
  return env;
}

const env = { ...loadEnv(), ...process.env };
const PORT = parseInt(env.PORT || '3000', 10);

// MIME Types
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json'
};

// Translation Handlers
async function translateWithBhashini(text, sourceLang, targetLang) {
  if (!env.BHASHINI_API_KEY || !env.BHASHINI_USER_ID) return null;

  const url = 'https://dhruva-api.bhashini.gov.in/services/inference/pipeline';
  const payload = {
    pipelineTasks: [
      {
        taskType: 'translation',
        config: {
          language: {
            sourceLanguage: sourceLang,
            targetLanguage: targetLang
          }
        }
      }
    ],
    inputData: {
      input: [{ source: text }]
    }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: env.BHASHINI_API_KEY,
      userID: env.BHASHINI_USER_ID
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error(`Bhashini API error: ${res.statusText}`);
  const data = await res.json();
  const output = data.pipelineResponse?.[0]?.output?.[0]?.target;
  return output || null;
}

async function translateWithGoogleCloud(text, sourceLang, targetLang) {
  if (!env.GOOGLE_TRANSLATE_API_KEY) return null;

  const url = `https://translation.googleapis.com/language/translate/v2?key=${env.GOOGLE_TRANSLATE_API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: text,
      source: sourceLang,
      target: targetLang,
      format: 'text'
    })
  });

  if (!res.ok) throw new Error(`Google Translate API error: ${res.statusText}`);
  const data = await res.json();
  return data.data?.translations?.[0]?.translatedText || null;
}

async function translateWithAzure(text, sourceLang, targetLang) {
  if (!env.AZURE_TRANSLATOR_KEY) return null;

  const region = env.AZURE_TRANSLATOR_REGION || 'centralindia';
  const url = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${sourceLang}&to=${targetLang}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': env.AZURE_TRANSLATOR_KEY,
      'Ocp-Apim-Subscription-Region': region,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([{ text }])
  });

  if (!res.ok) throw new Error(`Azure Translator error: ${res.statusText}`);
  const data = await res.json();
  return data[0]?.translations?.[0]?.text || null;
}

async function translateWithGemini(text, sourceLang, targetLang) {
  if (!env.GEMINI_API_KEY) return null;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`;
  const prompt = `Translate the following text strictly from ${sourceLang} to ${targetLang}. Output ONLY the translated text in its native script without commentary or quotes:\n\n${text}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  if (!res.ok) throw new Error(`Gemini API error: ${res.statusText}`);
  const data = await res.json();
  const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return candidate ? candidate.trim() : null;
}

async function translateWithFreeFallback(text, sourceLang, targetLang) {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data[0] && Array.isArray(data[0])) {
      let full = '';
      data[0].forEach((item) => {
        if (item && item[0]) full += item[0];
      });
      return full.trim() || null;
    }
  } catch (e) {
    console.warn('GTX fallback error:', e.message);
  }
  return null;
}

// HTTP Server
const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Proxy Route: POST /api/translate
  if (req.method === 'POST' && req.url === '/api/translate') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', async () => {
      try {
        const { text, sourceLang, targetLang } = JSON.parse(body || '{}');

        if (!text || !sourceLang || !targetLang) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing required fields: text, sourceLang, targetLang' }));
          return;
        }

        let translatedText = null;
        let provider = 'none';

        // 1. Try Bhashini if configured
        if (env.BHASHINI_API_KEY) {
          try {
            translatedText = await translateWithBhashini(text, sourceLang, targetLang);
            if (translatedText) provider = 'bhashini';
          } catch (e) {
            console.warn('Bhashini failed, falling back:', e.message);
          }
        }

        // 2. Try Google Cloud Translation
        if (!translatedText && env.GOOGLE_TRANSLATE_API_KEY) {
          try {
            translatedText = await translateWithGoogleCloud(text, sourceLang, targetLang);
            if (translatedText) provider = 'google-cloud';
          } catch (e) {
            console.warn('Google Cloud failed, falling back:', e.message);
          }
        }

        // 3. Try Azure Translator
        if (!translatedText && env.AZURE_TRANSLATOR_KEY) {
          try {
            translatedText = await translateWithAzure(text, sourceLang, targetLang);
            if (translatedText) provider = 'azure';
          } catch (e) {
            console.warn('Azure failed, falling back:', e.message);
          }
        }

        // 4. Try Gemini
        if (!translatedText && env.GEMINI_API_KEY) {
          try {
            translatedText = await translateWithGemini(text, sourceLang, targetLang);
            if (translatedText) provider = 'gemini';
          } catch (e) {
            console.warn('Gemini failed, falling back:', e.message);
          }
        }

        // 5. Fallback Free Provider
        if (!translatedText) {
          try {
            translatedText = await translateWithFreeFallback(text, sourceLang, targetLang);
            if (translatedText) provider = 'cloud-free';
          } catch (e) {
            console.warn('Free fallback failed:', e.message);
          }
        }

        if (translatedText) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ translatedText, provider }));
        } else {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'All translation providers failed' }));
        }
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Static File Serving
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const filePath = path.join(__dirname, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🇮🇳 Bharat Translator Server running!`);
  console.log(`📍 Local URL: http://localhost:${PORT}`);
  console.log(`🔒 API Keys loaded from .env`);
  console.log(`===============================================`);
});
