/**
 * Bharat Translator - Node.js Backend Proxy Server
 * Zero-dependency pure Node.js HTTP server.
 * Uses Google Gemini AI as the primary translation engine with seamless cloud fallbacks.
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
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json'
};

/**
 * Primary Translation: Google Gemini AI
 * Translates semantic meaning accurately across all Indian regional languages.
 */
async function translateWithGemini(text, sourceLang, targetLang) {
  if (!env.GEMINI_API_KEY) return null;

  const models = ['gemini-flash-latest', 'gemini-3.5-flash'];
  const prompt = `You are a professional multilingual translator specialized in Indian languages. Translate the following text from ${sourceLang} to ${targetLang}. Output ONLY the translated text in its authentic native script without explanations, notes, preamble, or markdown quotes:\n\n${text}`;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;
      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 250
        }
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        console.warn(`Gemini (${model}) returned HTTP ${res.status}`);
        continue;
      }

      const data = await res.json();
      const output = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (output && output.trim()) {
        return output.trim();
      }
    } catch (e) {
      console.warn(`Gemini (${model}) request failed:`, e.message);
    }
  }

  return null;
}

/**
 * Secondary Fallback: Direct Google Cloud Free Gateway
 */
async function translateWithFreeFallback(text, sourceLang, targetLang) {
  try {
    const mapLang = (l) => {
      if (l === 'mni') return 'mni-Mtei';
      if (l === 'brx') return 'hi';
      if (l === 'ks') return 'ur';
      return l;
    };
    const sl = mapLang(sourceLang);
    const tl = mapLang(targetLang);

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
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
    console.warn('Google Free Gateway fallback error:', e.message);
  }
  return null;
}

// Main Request Handler
export default async function requestHandler(req, res) {
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
  if (req.method === 'POST' && (req.url === '/api/translate' || req.url.startsWith('/api/translate?'))) {
    const processTranslation = async (payload) => {
      try {
        const { text, sourceLang, targetLang } = payload || {};

        if (!text || !sourceLang || !targetLang) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing required fields: text, sourceLang, targetLang' }));
          return;
        }

        let translatedText = null;
        let provider = 'none';

        // 1. Primary: Google Gemini AI
        if (env.GEMINI_API_KEY) {
          try {
            translatedText = await translateWithGemini(text, sourceLang, targetLang);
            if (translatedText) provider = 'google-gemini-ai';
          } catch (e) {
            console.warn('Gemini translation error, switching to fallback:', e.message);
          }
        }

        // 2. High-speed Fallback: Google Free Cloud Gateway
        if (!translatedText) {
          translatedText = await translateWithFreeFallback(text, sourceLang, targetLang);
          if (translatedText) provider = 'google-cloud-gateway';
        }

        if (translatedText) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              translatedText,
              provider,
              sourceLang,
              targetLang
            })
          );
        } else {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'All translation providers failed' }));
        }
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error: ' + err.message }));
      }
    };

    // If body was already parsed by serverless runtime (e.g. Vercel)
    if (req.body) {
      const parsed = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      await processTranslation(parsed);
      return;
    }

    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', async () => {
      try {
        await processTranslation(JSON.parse(body || '{}'));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload: ' + err.message }));
      }
    });
    return;
  }

  // TTS Proxy Route: GET /api/tts?tl=...&q=...
  if (req.method === 'GET' && req.url.startsWith('/api/tts')) {
    try {
      const urlObj = new URL(req.url, 'http://localhost');
      const tl = urlObj.searchParams.get('tl');
      const q = urlObj.searchParams.get('q');
      if (!tl || !q) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing tl or q parameter' }));
        return;
      }
      const googleTTSUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(
        tl
      )}&q=${encodeURIComponent(q)}`;
      const response = await fetch(googleTTSUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Referer: 'https://translate.google.com/'
        }
      });
      if (!response.ok) {
        res.writeHead(response.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'TTS upstream error' }));
        return;
      }
      const buf = await response.arrayBuffer();
      res.writeHead(200, { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'public, max-age=86400' });
      res.end(Buffer.from(buf));
      return;
    } catch (e) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
      return;
    }
  }

  // Static File Serving
  const cleanUrl = req.url === '/' ? 'index.html' : req.url.split('?')[0].replace(/^\//, '');
  let filePath = path.join(__dirname, 'public', cleanUrl);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, cleanUrl);
  }
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
      res.end(content);
    }
  });
}

// Only listen on PORT when running server.js directly (local development)
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  const server = http.createServer(requestHandler);
  server.listen(PORT, () => {
    console.log('========================================================');
    console.log(`🇮🇳 Bharat Translator Server Running on http://localhost:${PORT}`);
    console.log(`-> Primary Engine: ${env.GEMINI_API_KEY ? 'Google Gemini AI (Active)' : 'Zero-Config Cloud Gateway'}`);
    console.log('-> Fallback Engine: Google Cloud Free Gateway (Active)');
    console.log('========================================================');
  });
}
