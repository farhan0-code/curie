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
    this.sessionStarted = false
    this.lastErrorMessage = ''
    this.wordCount = 0
    this.finalTranscript = ''
    this.partialText = ''
    this.hasTabAudio = false
  }

  async connect(tempToken, languageCode = 'en') {
    const params = new URLSearchParams()
    params.set('sample_rate', '16000')
    params.set('encoding', 'pcm_s16le')
    params.set('speech_model', 'universal-3-6-pro')
    params.set('token', tempToken)

    if (languageCode) {
      params.set('language_codes', JSON.stringify([languageCode]))
    }

    const url = `${STREAMING_WSS_URL}?${params.toString()}`

    return new Promise((resolve, reject) => {
      this.lastErrorMessage = ''
      this.sessionStarted = false
      this.ws = new WebSocket(url)

      this.ws.onopen = () => {
        this.isConnected = true
        resolve()
      }

      this.ws.onerror = (err) => {
        if (!this.isConnected) {
          reject(new Error('WebSocket connection error'))
        }
        this.onError(err)
      }

      this.ws.onclose = (event) => {
        console.log('[StreamingSTT WS Closed]', event.code, event.reason)
        this.isConnected = false
        this.isRecording = false
        this.sessionStarted = false

        if (event.code !== 1000 && event.code !== 1005) {
          let reason = this.lastErrorMessage
          if (!reason || reason === 'See Error message for details') {
            if (event.reason && event.reason !== 'See Error message for details') {
              reason = event.reason
            } else if (event.code === 3007) {
              reason = 'Audio chunk format or transmission rate error (Code 3007).'
            } else if (event.code === 3008) {
              reason = 'Session duration limit reached.'
            } else if (event.code === 3009) {
              reason = 'Concurrent session limit reached on AssemblyAI. Please wait a few seconds and click Try Again.'
            } else if (event.code === 1008) {
              if (event.reason && event.reason.toLowerCase().includes('concurrent')) {
                reason = 'Concurrent session limit reached on AssemblyAI. Please wait a few seconds and click Try Again.'
              } else {
                reason = 'Authentication failed. Please verify your AssemblyAI API key in .env.'
              }
            } else {
              reason = `Connection closed (Code ${event.code}${event.reason ? ': ' + event.reason : ''})`
            }
          }
          this.onError(new Error(reason))
        }
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
        this.sessionStarted = true
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
      case 'SessionError': {
        const errorDetail = msg.error || msg.message || 'AssemblyAI streaming error'
        console.error('[StreamingSTT] AssemblyAI Server Error:', errorDetail, msg)
        this.lastErrorMessage = errorDetail
        this.onError(new Error(errorDetail))
        break
      }

      default:
        break
    }
  }

  _downsampleTo16k(inputData, inputSampleRate) {
    if (!inputSampleRate || inputSampleRate === 16000) {
      const output = new Int16Array(inputData.length)
      for (let i = 0; i < inputData.length; i++) {
        const s = Math.max(-1, Math.min(1, inputData[i]))
        output[i] = s < 0 ? s * 0x8000 : s * 0x7fff
      }
      return output
    }

    const sampleRateRatio = inputSampleRate / 16000
    const newLength = Math.round(inputData.length / sampleRateRatio)
    const result = new Int16Array(newLength)
    let offsetResult = 0
    let offsetBuffer = 0

    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio)
      let accum = 0
      let count = 0
      for (let i = offsetBuffer; i < nextOffsetBuffer && i < inputData.length; i++) {
        accum += inputData[i]
        count++
      }
      const val = count > 0 ? accum / count : inputData[offsetBuffer] || 0
      const clamped = Math.max(-1, Math.min(1, val))
      result[offsetResult] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff
      offsetResult++
      offsetBuffer = nextOffsetBuffer
    }

    return result
  }

  async startCapture({ captureTab = false } = {}) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    this.audioContext = new AudioContextClass({ sampleRate: 16000 })
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }

    // Buffer size 4096 produces ~85ms at 48kHz and ~92ms at 44.1kHz (well inside AssemblyAI 50ms-1000ms bounds)
    const bufferSize = 4096
    this.scriptProcessor = this.audioContext.createScriptProcessor(bufferSize, 1, 1)

    this.scriptProcessor.onaudioprocess = (e) => {
      // Only stream when session has officially started via Begin message from AssemblyAI
      if (!this.sessionStarted || !this.isRecording || !this.isConnected || this.ws?.readyState !== WebSocket.OPEN) return

      const float32 = e.inputBuffer.getChannelData(0)
      const int16 = this._downsampleTo16k(float32, this.audioContext.sampleRate)

      if (int16 && int16.length > 0) {
        this.ws.send(int16.buffer)
      }
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
        console.warn('[StreamingSTT] Tab audio share cancelled or denied:', tabErr)
        await this.stopCapture().catch(() => {})
        throw tabErr
      }
    }

    // 2. Also capture microphone (for the user's voice + room audio)
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: true,
        },
      })
      const micSource = this.audioContext.createMediaStreamSource(this.mediaStream)
      micSource.connect(this.scriptProcessor)
      connectedSources++
    } catch (micErr) {
      console.warn('[StreamingSTT] Microphone error with constraints, trying fallback:', micErr.message)
      try {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const micSource = this.audioContext.createMediaStreamSource(this.mediaStream)
        micSource.connect(this.scriptProcessor)
        connectedSources++
      } catch (fallbackErr) {
        console.warn('[StreamingSTT] Microphone fallback failed:', fallbackErr.message)
        if (connectedSources === 0) {
          throw new Error('Microphone permission denied or device not found. Please allow microphone access.')
        }
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
