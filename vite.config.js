import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiKey = env.ASSEMBLYAI_API_KEY || ''

  return {
    plugins: [
      react(),
      {
        name: 'meeting-intelligence-api',
        configureServer(server) {

          // ── /api/streaming-token — returns a short-lived temp token for browser WebSocket ──
          server.middlewares.use('/api/streaming-token', async (req, res) => {
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.setHeader('Content-Type', 'application/json')

            if (req.method === 'OPTIONS') {
              res.statusCode = 204
              res.end()
              return
            }

            if (req.method !== 'GET') {
              res.statusCode = 405
              res.end(JSON.stringify({ error: 'Method not allowed' }))
              return
            }

            try {
              const url = new URL('https://streaming.assemblyai.com/v3/token')
              url.search = new URLSearchParams({
                expires_in_seconds: '480',
                max_session_duration_seconds: '10800',
              }).toString()

              const tokenRes = await fetch(url, {
                method: 'GET',
                headers: {
                  'Authorization': apiKey,
                },
              })

              if (!tokenRes.ok) {
                const errText = await tokenRes.text()
                console.error('[StreamingToken] AssemblyAI error:', tokenRes.status, errText)
                // Fallback: return the API key directly (only for dev/demo)
                res.statusCode = 200
                res.end(JSON.stringify({ token: apiKey, fallback: true }))
                return
              }

              const data = await tokenRes.json()
              res.statusCode = 200
              res.end(JSON.stringify({ token: data.token || apiKey }))
            } catch (err) {
              console.error('[StreamingToken] Error:', err)
              // Dev fallback: pass API key as token
              res.statusCode = 200
              res.end(JSON.stringify({ token: apiKey, fallback: true }))
            }
          })

          // ── /api/summarize — analyzes meeting transcript via AssemblyAI LLM Gateway ──
          server.middlewares.use('/api/summarize', async (req, res) => {
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.setHeader('Content-Type', 'application/json')

            if (req.method === 'OPTIONS') {
              res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
              res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
              res.statusCode = 204
              res.end()
              return
            }

            if (req.method !== 'POST') {
              res.statusCode = 405
              res.end(JSON.stringify({ error: 'Method not allowed' }))
              return
            }

            try {
              const chunks = []
              for await (const chunk of req) chunks.push(chunk)
              const body = JSON.parse(Buffer.concat(chunks).toString())
              const { transcript, meetingName, language, analysisModel } = body
              const selectedModel = analysisModel === 'claude-sonnet-4-6' ? 'claude-sonnet-4-6' : 'gemini-3.5-flash'

              if (!transcript || transcript.trim().length < 50) {
                res.statusCode = 400
                res.end(JSON.stringify({ error: 'Transcript too short to analyze' }))
                return
              }

              const systemPrompt = `You are a meeting intelligence assistant. Analyze meeting transcripts and extract structured information.
Always respond with valid JSON only, no markdown, no explanation outside the JSON.`

              const userPrompt = `Analyze this meeting transcript and extract structured insights.

Meeting: "${meetingName || 'Untitled Meeting'}"
Language: ${language || 'en'}

TRANSCRIPT:
${transcript.slice(0, 15000)}

Respond with this exact JSON structure:
{
  "summary": "2-3 sentence executive summary of the meeting",
  "keyTopics": ["topic1", "topic2", "topic3", "topic4", "topic5"],
  "keyPoints": ["key point 1", "key point 2", "key point 3", "key point 4", "key point 5"],
  "decisions": ["decision 1", "decision 2", "decision 3"],
  "actionItems": ["action item 1", "action item 2", "action item 3", "action item 4"],
  "sentiment": "overall meeting sentiment in 3-5 words",
  "modelUsed": "${selectedModel === 'claude-sonnet-4-6' ? 'Claude Sonnet 4.6' : 'Gemini 3.5 Flash'} via AssemblyAI LLM Gateway"
}`

              const llmRes = await fetch('https://llm-gateway.assemblyai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                  'Authorization': apiKey,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  model: selectedModel,
                  messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                  ],
                  temperature: 0.3,
                  max_tokens: 1500,
                }),
              })

              if (!llmRes.ok) {
                const errText = await llmRes.text()
                console.error('[Summarize] LLM Gateway error:', llmRes.status, errText)
                res.statusCode = 500
                res.end(JSON.stringify({ error: 'LLM analysis failed', detail: errText }))
                return
              }

              const llmData = await llmRes.json()
              const rawContent = llmData.choices?.[0]?.message?.content || ''

              // Parse JSON from LLM response
              let parsed
              try {
                // Strip any markdown code fences if present
                const clean = rawContent.replace(/^```json?\s*/i, '').replace(/```\s*$/, '').trim()
                parsed = JSON.parse(clean)
              } catch (parseErr) {
                console.error('[Summarize] JSON parse error:', parseErr, '\nRaw:', rawContent)
                res.statusCode = 500
                res.end(JSON.stringify({ error: 'Failed to parse LLM response as JSON' }))
                return
              }

              res.statusCode = 200
              res.end(JSON.stringify(parsed))
            } catch (err) {
              console.error('[Summarize] Error:', err)
              res.statusCode = 500
              res.end(JSON.stringify({ error: err.message }))
            }
          })

          // ── Legacy /api/dictate — kept for backward compatibility ──
          server.middlewares.use('/api/dictate', async (req, res) => {
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.setHeader('Content-Type', 'application/json')

            if (req.method === 'OPTIONS') {
              res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
              res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
              res.statusCode = 204
              res.end()
              return
            }

            res.statusCode = 410
            res.end(JSON.stringify({ error: 'Dictation API removed. Use /api/streaming-token instead.' }))
          })
        }
      }
    ],
    server: {
      port: 3000,
      open: false,
    }
  }
})
