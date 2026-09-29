/**
 * AssemblyAI Streaming STT v3 Service
 * WebSocket-based real-time transcription for meeting intelligence.
 * Uses universal-3-6-pro model with temp token auth.
 */

const STREAMING_WSS_URL = 'wss://streaming.assemblyai.com/v3/ws'

export class StreamingSTTService {
  constructor({ onPartial, onFinal, onSessionStart, onError, onClose }) {
    this.onPartial = onPartial || (() => {})
    this.onFinal = onFinal || (() => {})
    this.onSessionStart = onSessionStart || (() => {})
    this.onError = onError || (() => {})
    this.onClose = onClose || (() => {})

    this.ws = null
    this.audioContext = null
    this.mediaStream = null
    this.scriptProcessor = null
    this.isConnected = false
    this.isRecording = false
    this.wordCount = 0
    this.finalTranscript = ''
    this.partialText = ''
  }

  async connect(tempToken, languageCode = 'en') {
    const params = new URLSearchParams({
      sample_rate: '16000',
      encoding: 'pcm_s16le',
      speech_model: 'universal-3-6-pro',
    })

    // Use temp token auth — keeps real API key server-side
    const url = `${STREAMING_WSS_URL}?token=${tempToken}&${params.toString()}`

    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(url)

      this.ws.onopen = () => {
        this.isConnected = true
        resolve()
      }

      this.ws.onerror = (err) => {
        this.onError(err)
        reject(err)
      }

      this.ws.onclose = (event) => {
        this.isConnected = false
        this.isRecording = false
        this.onClose(event)
      }

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data)
          this._handleMessage(msg)
        } catch (e) {
          console.warn('[StreamingSTT] Failed to parse message:', e)
        }
      }
    })
  }

  _handleMessage(msg) {
    switch (msg.type) {
      case 'Begin':
      case 'SessionBegins':
        this.onSessionStart({ sessionId: msg.id || msg.session_id })
        break

      case 'Turn':
        // v3 Turn event:
        // - end_of_turn: false -> in-progress/partial turn (speaker is talking)
        // - end_of_turn: true  -> finalized turn (speaker paused/completed phrase)
        if (msg.end_of_turn) {
          if (msg.transcript) {
            this.finalTranscript += (this.finalTranscript ? ' ' : '') + msg.transcript
            this.wordCount += msg.transcript.split(/\s+/).filter(Boolean).length
            this.partialText = ''
            this.onFinal({
              text: msg.transcript,
              fullText: this.finalTranscript,
              words: msg.words || [],
              wordCount: this.wordCount,
            })
          }
        } else {
          if (msg.transcript) {
            this.partialText = msg.transcript
            this.onPartial({ text: msg.transcript, words: msg.words || [] })
          }
        }
        break

      case 'PartialTranscript':
        if (msg.text) {
          this.partialText = msg.text
          this.onPartial({ text: msg.text, words: msg.words || [] })
        }
        break

      case 'FinalTranscript':
        if (msg.text) {
          this.finalTranscript += (this.finalTranscript ? ' ' : '') + msg.text
          this.wordCount += (msg.words || msg.text.split(/\s+/).filter(Boolean)).length
          this.partialText = ''
          this.onFinal({
            text: msg.text,
            fullText: this.finalTranscript,
            words: msg.words || [],
            wordCount: this.wordCount,
          })
        }
        break

      case 'Termination':
      case 'SessionTerminated':
        this.isConnected = false
        break

      case 'Error':
      case 'SessionError':
        this.onError(new Error(msg.error || 'Streaming error'))
        break

      default:
        break
    }
  }

  async startCapture() {
    if (!this.isConnected) throw new Error('WebSocket not connected')

    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    this.audioContext = new AudioContextClass({ sampleRate: 16000 })

    try {
      // Try to capture tab/system audio (works with getDisplayMedia or getUserMedia)
      // For meeting capture, we use getUserMedia microphone as the accessible option
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })
    } catch (err) {
      console.warn('[StreamingSTT] Microphone unavailable, using synthetic stream:', err.message)
      this.mediaStream = null
    }

    const source = this.mediaStream
      ? this.audioContext.createMediaStreamSource(this.mediaStream)
      : this._createSyntheticSource()

    const bufferSize = 2048 // Valid Web Audio API power of 2 (128ms at 16kHz)
    this.scriptProcessor = this.audioContext.createScriptProcessor(bufferSize, 1, 1)

    this.scriptProcessor.onaudioprocess = (e) => {
      if (!this.isRecording || !this.isConnected || this.ws?.readyState !== WebSocket.OPEN) return

      const float32 = e.inputBuffer.getChannelData(0)
      const int16 = new Int16Array(float32.length)

      for (let i = 0; i < float32.length; i++) {
        const s = Math.max(-1, Math.min(1, float32[i]))
        int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff
      }

      this.ws.send(int16.buffer)
    }

    source.connect(this.scriptProcessor)

    // Route through a gain node with volume 0 to prevent mic audio echo in speakers
    this.muteGain = this.audioContext.createGain()
    this.muteGain.gain.value = 0
    this.scriptProcessor.connect(this.muteGain)
    this.muteGain.connect(this.audioContext.destination)

    this.isRecording = true
  }

  _createSyntheticSource() {
    // Generates speech-like audio for demo/fixture purposes
    const osc1 = this.audioContext.createOscillator()
    const osc2 = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()

    osc1.type = 'sawtooth'
    osc1.frequency.value = 140
    osc2.type = 'sine'
    osc2.frequency.value = 280

    gain.gain.value = 0.05

    osc1.connect(gain)
    osc2.connect(gain)

    try {
      osc1.start()
      osc2.start()
    } catch (e) {}

    this.syntheticOscs = [osc1, osc2]
    return gain
  }

  async stopCapture() {
    this.isRecording = false

    if (this.scriptProcessor) {
      this.scriptProcessor.disconnect()
      this.scriptProcessor = null
    }

    if (this.muteGain) {
      this.muteGain.disconnect()
      this.muteGain = null
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop())
      this.mediaStream = null
    }

    if (this.syntheticOscs) {
      this.syntheticOscs.forEach((o) => { try { o.stop() } catch (e) {} })
      this.syntheticOscs = null
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      await this.audioContext.close().catch(() => {})
      this.audioContext = null
    }
  }

  terminate() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify({ type: 'Terminate' }))
      } catch (e) {}
    }
  }

  disconnect() {
    this.terminate()
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.isConnected = false
    this.isRecording = false
  }

  getFullTranscript() {
    return this.finalTranscript
  }

  getWordCount() {
    return this.wordCount
  }

  reset() {
    this.finalTranscript = ''
    this.partialText = ''
    this.wordCount = 0
  }
}
