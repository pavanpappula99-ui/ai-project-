/**
 * Vercel Serverless Function: /api/translate
 * Translates text between Indian languages and English using Google Gemini AI,
 * with automatic fallback to Google Cloud translation gateway.
 * Reads GEMINI_API_KEY securely from process.env on the server.
 */

// Helper: Translate using Google Gemini AI
async function translateWithGemini(text, sourceLang, targetLang, apiKey) {
  if (!apiKey) return null;

  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  const prompt = `You are a professional multilingual translator specialized in Indian languages. Translate the following text from ${sourceLang} to ${targetLang}. Output ONLY the translated text in its authentic native script without explanations, notes, preamble, or markdown quotes:\n\n${text}`;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 300
        }
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(6000)
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

// Helper: Translate using Google Free Gateway (GTX)
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
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
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

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // Parse body (supports already parsed JSON or stream payload)
  let body = req.body;
  if (!body || (typeof body === 'object' && Object.keys(body).length === 0)) {
    try {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const raw = Buffer.concat(buffers).toString('utf8');
      if (raw) body = JSON.parse(raw);
    } catch (e) {}
  } else if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }
  }

  const { text, sourceLang, targetLang } = body || {};

  if (!text || !sourceLang || !targetLang) {
    return res.status(400).json({
      error: 'Missing required fields: text, sourceLang, targetLang'
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  let translatedText = null;
  let provider = 'none';

  // 1. Primary: Google Gemini AI
  if (apiKey) {
    try {
      translatedText = await translateWithGemini(text, sourceLang, targetLang, apiKey);
      if (translatedText) provider = 'google-gemini-ai';
    } catch (e) {
      console.warn('Gemini translation error, falling back:', e.message);
    }
  }

  // 2. High-speed Fallback: Google Cloud Free Gateway
  if (!translatedText) {
    translatedText = await translateWithFreeFallback(text, sourceLang, targetLang);
    if (translatedText) provider = 'google-cloud-gateway';
  }

  if (translatedText) {
    return res.status(200).json({
      translatedText,
      provider,
      sourceLang,
      targetLang
    });
  }

  return res.status(502).json({ error: 'All translation providers failed' });
}
