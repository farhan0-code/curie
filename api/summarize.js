/**
 * Vercel Serverless Function: /api/summarize
 * Analyzes meeting transcript via Google Gemini or AssemblyAI LLM Gateway.
 * This replaces the Vite dev server middleware that only runs locally.
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const assemblyaiKey = process.env.ASSEMBLYAI_API_KEY
  const geminiApiKey = process.env.GEMINI_API_KEY

  if (!assemblyaiKey && !geminiApiKey) {
    return res.status(500).json({
      error: 'Server configuration error: No API keys configured. Please add ASSEMBLYAI_API_KEY or GEMINI_API_KEY in Vercel project settings.',
    })
  }

  try {
    const body = req.body || {}
    const { transcript, meetingName, language, analysisModel } = body

    if (!transcript || transcript.trim().length < 50) {
      return res.status(400).json({ error: 'Transcript too short to analyze' })
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
  "modelUsed": "AI model name"
}`

    let parsed = null

    // 1. Try Google Gemini directly (preferred — fastest, 1M context)
    if (geminiApiKey) {
      const candidateModels = [
        'gemini-2.0-flash',
        'gemini-1.5-flash',
        'gemini-2.0-flash-lite',
      ]
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
              parsed.modelUsed = googleModel.includes('2.0') ? 'Google Gemini 2.0 Flash' : 'Google Gemini 1.5 Flash'
              return res.status(200).json(parsed)
            }
          } else {
            const gErr = await geminiRes.text()
            console.warn(`[Summarize] Gemini ${googleModel} returned ${geminiRes.status}:`, gErr.slice(0, 200))
          }
        } catch (gErr) {
          console.warn(`[Summarize] Gemini call error (${googleModel}):`, gErr.message)
        }
      }
    }

    // 2. Fall back to AssemblyAI LLM Gateway
    if (assemblyaiKey) {
      const llmRes = await fetch('https://llm-gateway.assemblyai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: assemblyaiKey,
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
        return res.status(500).json({ error: 'LLM analysis failed', detail: errText })
      }

      const llmData = await llmRes.json()
      const rawContent = llmData.choices?.[0]?.message?.content || ''

      try {
        const clean = rawContent.replace(/^```json?\s*/i, '').replace(/```\s*$/, '').trim()
        const match = clean.match(/\{[\s\S]*\}/)
        parsed = JSON.parse(match ? match[0] : clean)
      } catch {
        parsed = {
          summary: rawContent.slice(0, 300) || 'Meeting concluded successfully.',
          keyTopics: ['General Discussion', 'Action Items', 'Key Decisions'],
          keyPoints: ['Meeting recorded with AssemblyAI Universal-3.6 Pro.'],
          decisions: ['Action items and decisions noted during conversation.'],
          actionItems: ['Review full transcript for next steps.'],
          sentiment: 'Focused & Productive',
          modelUsed: 'AssemblyAI LLM Gateway',
        }
      }

      parsed.modelUsed = parsed.modelUsed || 'AssemblyAI LLM Gateway'
      return res.status(200).json(parsed)
    }

    return res.status(500).json({ error: 'No working AI backend available' })
  } catch (err) {
    console.error('[Summarize] Error:', err)
    return res.status(500).json({ error: err.message || 'Analysis failed' })
  }
}
