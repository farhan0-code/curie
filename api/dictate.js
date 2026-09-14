// Vercel Serverless Function Proxy for AssemblyAI Dictation API
// Securely forwards audio streams to AssemblyAI using the server-side API key

export const config = {
  api: {
    bodyParser: false, // Stream raw multipart body directly
  },
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Content-Type', 'application/json');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.ASSEMBLYAI_API_KEY || '';
    if (!apiKey) {
      console.warn('[Vercel Dictate Proxy Warning]: ASSEMBLYAI_API_KEY not configured.');
    }

    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const bodyBuffer = Buffer.concat(chunks);
    const contentType = req.headers['content-type'] || '';

    const targetUrl = 'https://dictation.assemblyai.com/v1/transcribe';
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': contentType,
      },
      body: bodyBuffer,
    });

    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    return res.status(response.status).json(data);
  } catch (err) {
    console.error('[Vercel Dictate Proxy Error]:', err);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ error: err.message });
  }
}
