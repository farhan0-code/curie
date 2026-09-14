import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiKey = env.ASSEMBLYAI_API_KEY || ''

  return {
    plugins: [
      react(),
      {
        name: 'assemblyai-dictation-proxy',
        configureServer(server) {
          server.middlewares.use('/api/dictate', async (req, res) => {
            if (req.method === 'OPTIONS') {
              res.setHeader('Access-Control-Allow-Origin', '*')
              res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
              res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
              res.statusCode = 204
              res.end()
              return
            }

            if (req.method !== 'POST') {
              res.statusCode = 405
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Method not allowed' }))
              return
            }

            try {
              const chunks = []
              for await (const chunk of req) {
                chunks.push(chunk)
              }
              const bodyBuffer = Buffer.concat(chunks)
              const contentType = req.headers['content-type'] || ''

              const targetUrl = 'https://dictation.assemblyai.com/v1/transcribe'
              const response = await fetch(targetUrl, {
                method: 'POST',
                headers: {
                  'Authorization': apiKey,
                  'Content-Type': contentType,
                },
                body: bodyBuffer,
              })

              const data = await response.json()
              res.statusCode = response.status
              res.setHeader('Content-Type', 'application/json')
              res.setHeader('Access-Control-Allow-Origin', '*')
              res.end(JSON.stringify(data))
            } catch (err) {
              console.error('[Curie API Proxy Error]:', err)
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: err.message }))
            }
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
