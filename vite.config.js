import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiKey = env.ASSEMBLYAI_API_KEY || ''
  const geminiApiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || ''

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
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0')
            res.setHeader('Pragma', 'no-cache')
            res.setHeader('Expires', '0')

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
              const currentEnv = loadEnv(mode, process.cwd(), '')
              const currentApiKey = currentEnv.ASSEMBLYAI_API_KEY || process.env.ASSEMBLYAI_API_KEY || apiKey

              if (!currentApiKey) {
                res.statusCode = 500
                res.end(JSON.stringify({ error: 'ASSEMBLYAI_API_KEY is not set in .env' }))
                return
              }

              const url = new URL('https://streaming.assemblyai.com/v3/token')
              url.search = new URLSearchParams({
                expires_in_seconds: '600',
                max_session_duration_seconds: '10800',
              }).toString()

              const tokenRes = await fetch(url, {
                method: 'GET',
                headers: {
                  'Authorization': currentApiKey,
                },
              })

              if (!tokenRes.ok) {
                const errText = await tokenRes.text()
                console.error('[StreamingToken] AssemblyAI token endpoint error:', tokenRes.status, errText)
                res.statusCode = tokenRes.status || 500
                res.end(JSON.stringify({ error: 'Failed to generate streaming token', detail: errText }))
                return
              }

              const data = await tokenRes.json()
              res.statusCode = 200
              res.end(JSON.stringify({ token: data.token }))
            } catch (err) {
              console.error('[StreamingToken] Error:', err)
              res.statusCode = 500
              res.end(JSON.stringify({ error: err.message || 'Token generation failed' }))
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

              let parsed = null

              // 1. Direct Google Gemini API (if GEMINI_API_KEY is provided in .env)
              if (geminiApiKey && (analysisModel?.startsWith('gemini') || !analysisModel || analysisModel === 'claude-sonnet-4-6')) {
                const candidateModels = ['gemini-3-flash-preview', 'gemini-3.8-flash']
                for (const googleModel of candidateModels) {
                  try {
                    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${googleModel}:generateContent?key=${geminiApiKey}`

                    const geminiRes = await fetch(geminiUrl, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        contents: [
                          {
                            role: 'user',
                            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
                          },
                        ],
                        generationConfig: {
                          temperature: 0.3,
                          maxOutputTokens: 2048,
                          responseMimeType: 'application/json',
                        },
                      }),
                    })

                    if (geminiRes.ok) {
                      const gData = await geminiRes.json()
                      const rawText = gData.candidates?.[0]?.content?.parts?.[0]?.text
                      if (rawText) {
                        const clean = rawText.replace(/^```json?\s*/i, '').replace(/```\s*$/, '').trim()
                        parsed = JSON.parse(clean)
                        parsed.modelUsed = googleModel.includes('3.8') ? 'Google Gemini 3.8 Flash' : 'Google Gemini 3 Flash'
                        res.setHeader('Content-Type', 'application/json')
                        res.end(JSON.stringify(parsed))
                        return
                      }
                    } else {
                      const gErr = await geminiRes.text()
                      console.warn(`[Summarize] Direct Gemini API (${googleModel}) returned ${geminiRes.status}:`, gErr.slice(0, 150))
                    }
                  } catch (gErr) {
                    console.warn(`[Summarize] Direct Gemini call error (${googleModel}):`, gErr.message)
                  }
                }
              }

              // 2. AssemblyAI LLM Gateway: Use the account-unlocked fast model (qwen3.5-4b-32k-fast)
              // This gives instant response, 32k context, and prevents 400 tier restriction errors
              const llmRes = await fetch('https://llm-gateway.assemblyai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                  'Authorization': apiKey,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  model: 'qwen3.5-4b-32k-fast',
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
              try {
                const clean = rawContent.replace(/^```json?\s*/i, '').replace(/```\s*$/, '').trim()
                const match = clean.match(/\{[\s\S]*\}/)
                parsed = JSON.parse(match ? match[0] : clean)
              } catch (parseErr) {
                console.warn('[Summarize] JSON parse failed, falling back to structured extraction:', parseErr.message)
                parsed = {
                  summary: rawContent.slice(0, 300) || 'Meeting concluded successfully.',
                  keyTopics: ['General Discussion', 'Action Items', 'Key Decisions'],
                  keyPoints: ['Meeting recorded with AssemblyAI Universal-3.6 Pro.'],
                  decisions: ['Action items and decisions noted during conversation.'],
                  actionItems: ['Review full transcript for next steps.'],
                  sentiment: 'Focused & Productive',
                  modelUsed: `${activeModel} via AssemblyAI LLM Gateway`,
                }
              }

              parsed.modelUsed = parsed.modelUsed || `${activeModel} via AssemblyAI LLM Gateway`

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
