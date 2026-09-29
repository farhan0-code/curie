/**
 * AssemblyAI Streaming STT v3 Service
 * WebSocket-based real-time transcription for meeting intelligence.
 * Uses universal-3-6-pro model with temp token auth.
 */

const STREAMING_WSS_URL = 'wss://streaming.assemblyai.com/v3/ws'

export class StreamingSTTService {
  constructor({ onPartial, onFinal, onSessionStart, onError, onClose, onWarning, onScreenShareEnded }) {
    this.onPartial = onPartial || (() => {})
    this.onFinal = onFinal || (() => {})
    this.onSessionStart = onSessionStart || (() => {})
    this.onError = onError || (() => {})
    this.onClose = onClose || (() => {})
    this.onWarning = onWarning || (() => {})
    this.onScreenShareEnded = onScreenShareEnded || (() => {})

    this.ws = null
    this.audioContext = null
    this.mediaStream = null
    this.tabStream = null
    this.scriptProcessor = null
    this.muteGain = null
    this.isConnected = false
    this.isRecording = false
    this.wordCount = 0
    this.finalTranscript = ''
    this.partialText = ''
    this.hasTabAudio = false
  }

  async connect(tempToken, languageCode = 'en') {
    const params = new URLSearchParams({
      sample_rate: '16000',
      encoding: 'pcm_s16le',
      speech_model: 'universal-3-6-pro',
    })

    if (languageCode) {
      params.append('language_codes', JSON.stringify([languageCode]))
    }

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

  async startCapture({ captureTab = false } = {}) {
    if (!this.isConnected) throw new Error('WebSocket not connected')

    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    this.audioContext = new AudioContextClass({ sampleRate: 16000 })

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

    let connectedSources = 0
    this.hasTabAudio = false

    // 1. If tab/meeting audio requested, capture Google Meet / Zoom tab audio
    if (captureTab && navigator.mediaDevices?.getDisplayMedia) {
      try {
        this.tabStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true, // Use boolean true for max browser compatibility
          systemAudio: 'include',
          selfBrowserSurface: 'exclude',
          surfaceSwitching: 'include',
        })

        // Auto-stop listening when user clicks "Stop Sharing" in browser bar
        const handleShareEnded = () => {
          if (this.isRecording) {
            console.log('[StreamingSTT] Screen/tab share ended by user')
            this.onScreenShareEnded()
          }
        }
        this.tabStream.getVideoTracks().forEach((track) => {
          track.addEventListener('ended', handleShareEnded, { once: true })
        })
        this.tabStream.getAudioTracks().forEach((track) => {
          track.addEventListener('ended', handleShareEnded, { once: true })
        })

        const audioTracks = this.tabStream.getAudioTracks()
        if (audioTracks.length > 0) {
          const tabSource = this.audioContext.createMediaStreamSource(this.tabStream)
          tabSource.connect(this.scriptProcessor)
          this.hasTabAudio = true
          connectedSources++
        } else {
          const ua = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : ''
          const isFirefox = ua.includes('firefox')
          const isSafari = ua.includes('safari') && !ua.includes('chrome') && !ua.includes('chromium')
          let message = 'The tab was shared without audio. In Chrome/Edge, be sure to check "Also share tab audio" at the bottom of the share picker.'
          if (isFirefox) {
            message = 'Firefox cannot capture tab/system audio. To transcribe digital audio from YouTube or Google Meet, please open this app in Google Chrome, Microsoft Edge, or Brave.'
          } else if (isSafari) {
            message = 'Apple Safari cannot capture tab audio. On Mac, open this app in Google Chrome or Microsoft Edge for digital tab audio, or switch to Microphone Only.'
          }
          this.onWarning({
            type: 'no_tab_audio',
            isFirefox,
            isSafari,
            message,
          })
        }
      } catch (tabErr) {
        console.warn('[StreamingSTT] Tab audio share cancelled or failed, falling back to mic:', tabErr)
      }
    }

    // 2. Also capture microphone (for the user's voice + room audio)
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          // Set to false so browser echo cancellation doesn't cancel out laptop speaker voices
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: true,
        },
      })
      const micSource = this.audioContext.createMediaStreamSource(this.mediaStream)
      micSource.connect(this.scriptProcessor)
      connectedSources++
    } catch (micErr) {
      console.warn('[StreamingSTT] Microphone error:', micErr.message)
      if (connectedSources === 0) {
        // Fall back to synthetic speech simulation if neither mic nor tab is available
        const synthetic = this._createSyntheticSource()
        synthetic.connect(this.scriptProcessor)
      }
    }

    // Route through a gain node with volume 0 to prevent mic/tab feedback in speakers
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

  setMicMuted(muted) {
    if (this.mediaStream) {
      this.mediaStream.getAudioTracks().forEach((track) => {
        track.enabled = !muted
      })
    }
  }

  isMicMuted() {
    if (this.mediaStream) {
      const tracks = this.mediaStream.getAudioTracks()
      if (tracks.length > 0) return !tracks[0].enabled
    }
    return false
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

    if (this.tabStream) {
      this.tabStream.getTracks().forEach((t) => t.stop())
      this.tabStream = null
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
