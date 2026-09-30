/**
 * Vercel Serverless Function: /api/streaming-token
 * Generates a short-lived AssemblyAI WebSocket streaming token for the browser.
 * This replaces the Vite dev server middleware that only runs locally.
 */
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cache-Control, Pragma')
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.ASSEMBLYAI_API_KEY

  if (!apiKey) {
    console.error('[streaming-token] ASSEMBLYAI_API_KEY is not set in Vercel environment variables')
    return res.status(500).json({
      error: 'Server configuration error: ASSEMBLYAI_API_KEY is not configured. Please add it in Vercel project settings → Environment Variables.',
    })
  }

  try {
    const url = new URL('https://streaming.assemblyai.com/v3/token')
    url.search = new URLSearchParams({
      expires_in_seconds: '600',
      max_session_duration_seconds: '10800',
    }).toString()

    const tokenRes = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: apiKey,
      },
    })

    if (!tokenRes.ok) {
      const errText = await tokenRes.text()
      console.error('[streaming-token] AssemblyAI error:', tokenRes.status, errText)
      return res.status(tokenRes.status || 500).json({
        error: 'Failed to generate streaming token',
        detail: errText,
      })
    }

    const data = await tokenRes.json()
    return res.status(200).json({ token: data.token })
  } catch (err) {
    console.error('[streaming-token] Unexpected error:', err)
    return res.status(500).json({ error: err.message || 'Token generation failed' })
  }
}
