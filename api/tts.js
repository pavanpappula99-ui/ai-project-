/**
 * Vercel Serverless Function: /api/tts
 * High Definition Native Voice Streaming Proxy
 * Supports all 22 Indian regional languages + Indian English
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { tl, q } = req.query || {};

  if (!tl || !q) {
    return res.status(400).json({ error: 'Missing required parameters: tl, q' });
  }

  try {
    const googleTTSUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(
      tl
    )}&q=${encodeURIComponent(q)}`;

    const response = await fetch(googleTTSUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Referer: 'https://translate.google.com/'
      },
      signal: AbortSignal.timeout(8000)
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Upstream TTS service error' });
    }

    const audioBuffer = await response.arrayBuffer();

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    return res.status(200).send(Buffer.from(audioBuffer));
  } catch (error) {
    console.error('TTS proxy error:', error);
    return res.status(502).json({ error: 'Failed to fetch TTS audio: ' + error.message });
  }
}
