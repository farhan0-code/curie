import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Mic,
  MicOff,
  Square,
  Loader2,
  Radio,
  FileText,
  Clock,
  Hash,
  Zap,
  ChevronRight,
  Globe,
  Play,
  Settings2,
  Monitor,
  Headphones,
  Sparkles,
  Volume2,
  VolumeX,
  FastForward,
  BookOpen,
} from 'lucide-react'
import CurieLogo from '../components/CurieLogo'
import FloatingMeetingBar from '../components/FloatingMeetingBar'
import { StreamingSTTService } from '../services/streamingSTTService'

const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'hi', label: 'Hindi' },
  { code: 'ja', label: 'Japanese' },
  { code: 'zh', label: 'Chinese' },
  { code: 'ko', label: 'Korean' },
  { code: 'pt', label: 'Português' },
  { code: 'it', label: 'Italiano' },
]

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// Floating waveform bars
function WaveformBars({ active }) {
  const count = 20
  return (
    <div className="flex items-center justify-center gap-[3px] h-12">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`w-[3px] rounded-full transition-all ${active ? 'bg-black' : 'bg-neutral-200'}`}
          style={{
            height: active
              ? `${Math.max(6, Math.round(8 + Math.abs(Math.sin(i * 0.7 + Date.now() / 800)) * 30))}px`
              : '6px',
            animation: active ? `waveAnim ${0.8 + (i % 4) * 0.2}s ease-in-out infinite` : 'none',
            animationDelay: `${(i * 80) % 600}ms`,
          }}
        />
      ))}
    </div>
  )
}

export default function MeetingCapturePage({ onBackToLanding, onNavigateToResults, onNavigateToDocs }) {
  const [meetingName, setMeetingName] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [audioSource, setAudioSource] = useState('tab_mic') // 'tab_mic' | 'mic_only'
  const [analysisModel, setAnalysisModel] = useState('claude-sonnet-4-6') // 'claude-sonnet-4-6' | 'gemini-3.5-flash'
  const [status, setStatus] = useState('idle') // idle | connecting | recording | stopping | error
  const [duration, setDuration] = useState(0)
  const [wordCount, setWordCount] = useState(0)
  const [fullTranscript, setFullTranscript] = useState('')
  const [partialText, setPartialText] = useState('')
  const [recentLines, setRecentLines] = useState([])
  const [errorMsg, setErrorMsg] = useState('')
  const [warningMsg, setWarningMsg] = useState('')
  const [waveActive, setWaveActive] = useState(false)
  const [showCompat, setShowCompat] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [isDemoMuted, setIsDemoMuted] = useState(false)
  const [isMicMuted, setIsMicMuted] = useState(false)

  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : ''
  const isFirefox = userAgent.includes('firefox')
  const isSafari = userAgent.includes('safari') && !userAgent.includes('chrome') && !userAgent.includes('chromium')
  const isMac = typeof navigator !== 'undefined' && (navigator.platform?.toLowerCase().includes('mac') || userAgent.includes('mac'))

  const sttRef = useRef(null)
  const timerRef = useRef(null)
  const startTimeRef = useRef(null)
  const transcriptRef = useRef('')
  const stopHandlerRef = useRef(null)
  const isDemoRef = useRef(false)
  const demoAudioRef = useRef(null)
  const demoIntervalRef = useRef(null)

  // Sync transcript to ref for access in callbacks
  useEffect(() => {
    transcriptRef.current = fullTranscript
  }, [fullTranscript])

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const startTimer = () => {
    startTimeRef.current = Date.now() - duration * 1000
    timerRef.current = setInterval(() => {
      setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000))
    }, 1000)
  }

  const handleStartMeeting = async () => {
    if (status === 'recording' || status === 'connecting') return
    setIsDemoMode(false)
    isDemoRef.current = false
    if (demoAudioRef.current) {
      demoAudioRef.current.pause()
      demoAudioRef.current = null
    }
    if (demoIntervalRef.current) {
      clearInterval(demoIntervalRef.current)
      demoIntervalRef.current = null
    }

    setErrorMsg('')
    setWarningMsg('')
    setStatus('connecting')
    setWaveActive(false)

    // Reset state
    setFullTranscript('')
    setPartialText('')
    setRecentLines([])
    setWordCount(0)
    setDuration(0)
    transcriptRef.current = ''

    try {
      // Get temp token from server
      const tokenRes = await fetch('/api/streaming-token')
      if (!tokenRes.ok) throw new Error('Could not get streaming token')
      const { token } = await tokenRes.json()

      const stt = new StreamingSTTService({
        onSessionStart: () => {
          setStatus('recording')
          setWaveActive(true)
          startTimer()
        },
        onPartial: ({ text }) => {
          setPartialText(text)
        },
        onFinal: ({ text, fullText, wordCount: wc }) => {
          setFullTranscript(fullText)
          transcriptRef.current = fullText
          setWordCount(wc)
          setPartialText('')
          setRecentLines((prev) => {
            const next = [...prev, text]
            return next.slice(-8) // keep last 8 lines visible
          })
        },
        onWarning: ({ message }) => {
          setWarningMsg(message)
        },
        onScreenShareEnded: () => {
          // When user clicks "Stop Sharing" on the browser floating bar, stop listening & analyze
          console.log('[MeetingCapturePage] Screen share ended, auto-stopping meeting')
          if (stopHandlerRef.current) {
            stopHandlerRef.current()
          }
        },
        onError: (err) => {
          console.error('[StreamingSTT error]:', err)
          setErrorMsg('Connection error. Please check your API key and try again.')
          setStatus('error')
          stopTimer()
          setWaveActive(false)
        },
        onClose: () => {
          if (status === 'recording') {
            setStatus('idle')
            setWaveActive(false)
            stopTimer()
          }
        },
      })

      sttRef.current = stt
      await stt.connect(token, selectedLanguage)
      await stt.startCapture({ captureTab: audioSource === 'tab_mic' })
    } catch (err) {
      console.error('[Meeting capture start error]:', err)
      setErrorMsg(err.message || 'Failed to start capture. Check microphone permissions.')
      setStatus('error')
      setWaveActive(false)
    }
  }

  const handleStopAndAnalyze = async () => {
    if (status !== 'recording') return
    setStatus('stopping')
    setWaveActive(false)
    stopTimer()

    // Stop demo audio & interval if running
    if (demoAudioRef.current) {
      demoAudioRef.current.pause()
      demoAudioRef.current = null
    }
    if (demoIntervalRef.current) {
      clearInterval(demoIntervalRef.current)
      demoIntervalRef.current = null
    }

    const stt = sttRef.current
    if (stt) {
      await stt.stopCapture()
      stt.terminate()
      // Small delay to flush final transcripts
      await new Promise((r) => setTimeout(r, 800))
      stt.disconnect()
    }

    let transcript = transcriptRef.current || sttRef.current?.getFullTranscript() || ''
    // If in demo mode and user stopped early, ensure rich analysis data
    if (isDemoRef.current && (!transcript || transcript.length < 50)) {
      transcript = DEMO_TRANSCRIPT
    }

    // Navigate to results
    onNavigateToResults({
      meetingName: meetingName || (isDemoRef.current ? 'Product Team Weekly — Demo' : 'Untitled Meeting'),
      transcript,
      duration: duration || (isDemoRef.current ? 35 : 0),
      wordCount: wordCount || (isDemoRef.current ? 459 : 0),
      language: selectedLanguage,
      analysisModel,
      isDemo: isDemoRef.current,
    })
  }
  stopHandlerRef.current = handleStopAndAnalyze

  const handleSkipDemoToEnd = () => {
    if (demoAudioRef.current) {
      demoAudioRef.current.pause()
      demoAudioRef.current = null
    }
    if (demoIntervalRef.current) {
      clearInterval(demoIntervalRef.current)
      demoIntervalRef.current = null
    }
    setStatus('stopping')
    setWaveActive(false)
    stopTimer()
    onNavigateToResults({
      meetingName: meetingName || 'Product Team Weekly — Demo',
      transcript: DEMO_TRANSCRIPT,
      duration: 165,
      wordCount: 459,
      language: selectedLanguage,
      analysisModel,
      isDemo: true,
    })
  }

  const toggleDemoMute = () => {
    if (demoAudioRef.current) {
      const nextMuted = !demoAudioRef.current.muted
      demoAudioRef.current.muted = nextMuted
      setIsDemoMuted(nextMuted)
      setIsMicMuted(nextMuted)
    }
  }

  const handleToggleMicMute = () => {
    if (isDemoMode) {
      toggleDemoMute()
      return
    }
    if (sttRef.current) {
      const nextMuted = !isMicMuted
      sttRef.current.setMicMuted(nextMuted)
      setIsMicMuted(nextMuted)
    }
  }

  const handleRunFixture = async () => {
    if (status === 'recording') return
    setErrorMsg('')
    setStatus('connecting')
    setFullTranscript('')
    setPartialText('')
    setRecentLines([])
    setWordCount(0)
    setDuration(0)
    transcriptRef.current = ''
    setIsDemoMode(true)
    isDemoRef.current = true
    setIsDemoMuted(false)

    // Stop previous demo instances if any
    if (demoAudioRef.current) {
      demoAudioRef.current.pause()
      demoAudioRef.current = null
    }
    if (demoIntervalRef.current) {
      clearInterval(demoIntervalRef.current)
      demoIntervalRef.current = null
    }

    try {
      // 1. Fetch timed lines metadata
      let timedLines = []
      try {
        const res = await fetch('/fixtures/meeting_demo_timed.json')
        if (res.ok) {
          const timedData = await res.json()
          timedLines = timedData.lines || []
        }
      } catch (err) {
        console.warn('Timed JSON load warning:', err)
      }

      // Fallback to text lines if timed JSON missing
      if (!timedLines || timedLines.length === 0) {
        let fixtureText = DEMO_TRANSCRIPT
        try {
          const txtRes = await fetch('/fixtures/meeting_demo_transcript.txt')
          if (txtRes.ok) fixtureText = await txtRes.text()
        } catch (e) {}
        const rawLines = fixtureText.split('\n').filter((l) => l.trim().length > 0)
        let cur = 0
        rawLines.forEach((t, i) => {
          timedLines.push({ index: i, text: t, startTime: cur, duration: 6 })
          cur += 6
        })
      }

      // 2. Initialize and play demo meeting audio
      const audio = new Audio('/fixtures/meeting_demo.mp3')
      audio.preload = 'auto'
      demoAudioRef.current = audio

      setStatus('recording')
      setWaveActive(true)
      startTimer()

      // Play audio right away from user click
      try {
        await audio.play()
      } catch (playErr) {
        console.warn('Demo audio autoplay notification:', playErr)
      }

      // 3. Synchronize streaming transcript with audio timeline
      let lineIndex = 0
      let accumulated = ''
      let wc = 0

      demoIntervalRef.current = setInterval(() => {
        if (!isDemoRef.current) {
          if (demoIntervalRef.current) clearInterval(demoIntervalRef.current)
          return
        }

        // Current playback time in seconds
        const currentTime = audio && !isNaN(audio.currentTime) && audio.currentTime > 0
          ? audio.currentTime
          : (Date.now() - startTimeRef.current) / 1000

        while (lineIndex < timedLines.length && currentTime >= timedLines[lineIndex].startTime) {
          const nextLine = timedLines[lineIndex].text
          accumulated += (accumulated ? ' ' : '') + nextLine
          wc += nextLine.split(/\s+/).filter(Boolean).length
          transcriptRef.current = accumulated
          setFullTranscript(accumulated)
          setWordCount(wc)
          setRecentLines((prev) => [...prev, nextLine].slice(-8))
          lineIndex++
        }

        // Finished all lines or audio ended
        if ((audio && audio.ended) || lineIndex >= timedLines.length) {
          if (demoIntervalRef.current) {
            clearInterval(demoIntervalRef.current)
            demoIntervalRef.current = null
          }
          if (audio) {
            audio.pause()
            demoAudioRef.current = null
          }
          setStatus('stopping')
          setWaveActive(false)
          stopTimer()

          setTimeout(() => {
            onNavigateToResults({
              meetingName: meetingName || 'Product Team Weekly — Demo',
              transcript: accumulated || DEMO_TRANSCRIPT,
              duration: Math.max(duration, Math.round(currentTime)),
              wordCount: wc || 459,
              language: selectedLanguage,
              analysisModel,
              isDemo: true,
            })
          }, 600)
        }
      }, 150)
    } catch (err) {
      console.error('Demo run error:', err)
      setStatus('error')
      setErrorMsg('Failed to run demo fixture.')
      setWaveActive(false)
      stopTimer()
      setIsDemoMode(false)
      isDemoRef.current = false
    }
  }

  const handleBack = () => {
    if (demoAudioRef.current) {
      demoAudioRef.current.pause()
      demoAudioRef.current = null
    }
    if (demoIntervalRef.current) {
      clearInterval(demoIntervalRef.current)
      demoIntervalRef.current = null
    }
    stopTimer()
    if (sttRef.current) {
      sttRef.current.stopCapture().catch(() => {})
      sttRef.current.disconnect()
    }
    onBackToLanding()
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer()
      if (demoAudioRef.current) {
        demoAudioRef.current.pause()
        demoAudioRef.current = null
      }
      if (demoIntervalRef.current) {
        clearInterval(demoIntervalRef.current)
        demoIntervalRef.current = null
      }
      if (sttRef.current) {
        sttRef.current.stopCapture().catch(() => {})
        sttRef.current.disconnect()
      }
    }
  }, [])

  const isActive = status === 'recording'
  const isConnecting = status === 'connecting' || status === 'stopping'

  return (
    <div className="min-h-screen w-full bg-white text-black font-sans flex flex-col relative">
      {/* Floating Meeting Controller: In-App Top Bar & Picture-in-Picture Pop-out */}
      <FloatingMeetingBar
        status={status}
        duration={duration}
        wordCount={wordCount}
        latestText={partialText || (recentLines.length > 0 ? recentLines[recentLines.length - 1] : '')}
        audioSource={audioSource}
        setAudioSource={setAudioSource}
        analysisModel={analysisModel}
        setAnalysisModel={setAnalysisModel}
        onStartMeeting={handleStartMeeting}
        onRunDemo={handleRunFixture}
        onStopAndAnalyze={handleStopAndAnalyze}
        isMicMuted={isMicMuted}
        onToggleMicMute={handleToggleMicMute}
        isDemoMode={isDemoMode}
      />

      {/* Header */}
      <header className="sticky top-0 z-30 w-full h-16 bg-white/95 backdrop-blur-md border-b border-neutral-200 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="text-xs font-semibold text-neutral-500 hover:text-black transition-colors cursor-pointer"
          >
            ← Back
          </button>
          <span className="text-neutral-300">|</span>
          <CurieLogo size={22} />
          <span className="font-display font-bold text-sm text-black">Meeting Intelligence</span>
        </div>
        <div className="flex items-center gap-2">
          {onNavigateToDocs && (
            <button
              onClick={onNavigateToDocs}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-neutral-200 text-neutral-600 hover:text-black hover:border-black text-xs font-semibold transition-all cursor-pointer bg-white"
            >
              <BookOpen className="w-3 h-3" />
              Docs
            </button>
          )}
          {isActive && (
            <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-black bg-neutral-100 px-2.5 py-1 rounded-lg border border-neutral-200">
              <span className="w-2 h-2 rounded-full bg-black animate-pulse inline-block" />
              LIVE
            </span>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 flex flex-col gap-8">

        {/* Title */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-black text-white shadow-md mb-4">
            <Mic className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-black tracking-tight">
            Meeting Intelligence
          </h1>
          <p className="text-sm text-neutral-500 mt-2 leading-relaxed">
            Run quietly in the background during any meeting. Get topics, key points, and a summary when you're done.
          </p>
        </div>

        {/* Config Card */}
        {!isActive && !isConnecting && (
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <Settings2 className="w-4 h-4 text-neutral-500" />
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-500">Session Setup</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700">Meeting Name (optional)</label>
              <input
                type="text"
                value={meetingName}
                onChange={(e) => setMeetingName(e.target.value)}
                placeholder="e.g. Product Team Weekly, Sprint Planning..."
                className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-black transition-colors bg-neutral-50 text-black placeholder:text-neutral-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                Meeting Language
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang.code)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      selectedLanguage === lang.code
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-black hover:text-black'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Source Picker */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Headphones className="w-3.5 h-3.5" />
                  Audio Source
                </span>
                <span className="text-[10px] font-mono text-neutral-400">Headphone friendly</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAudioSource('tab_mic')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    audioSource === 'tab_mic'
                      ? 'border-black bg-neutral-900 text-white shadow-xs'
                      : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Monitor className="w-4 h-4 shrink-0" />
                    <span className="font-bold text-xs">Meeting Tab + Mic</span>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                        audioSource === 'tab_mic'
                          ? 'bg-white text-black badge-light'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                      style={{ color: audioSource === 'tab_mic' ? '#000000' : undefined }}
                    >
                      Recommended
                    </span>
                  </div>
                  <p className={`text-[11px] leading-tight ${audioSource === 'tab_mic' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    Shares Google Meet / Zoom / YouTube tab audio + your microphone. Perfect for headphones.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setAudioSource('mic_only')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    audioSource === 'mic_only'
                      ? 'border-black bg-neutral-900 text-white shadow-xs'
                      : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Mic className="w-4 h-4 shrink-0" />
                    <span className="font-bold text-xs">Microphone Only</span>
                  </div>
                  <p className={`text-[11px] leading-tight ${audioSource === 'mic_only' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    Listens to your room / laptop speakers directly. No screen-sharing prompt.
                  </p>
                </button>
              </div>

              {isFirefox && audioSource === 'tab_mic' ? (
                <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200 text-[11px] text-amber-900 leading-normal flex items-start gap-2">
                  <div>
                    <strong>Firefox Note:</strong> Firefox does not support capturing tab/system audio. For digital YouTube or Google Meet tab audio, open Curie in <strong>Google Chrome</strong>, <strong>Edge</strong>, or <strong>Brave</strong>. In Firefox, use <strong>Microphone Only</strong> with your laptop speakers turned on.
                  </div>
                </div>
              ) : isSafari && audioSource === 'tab_mic' ? (
                <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200 text-[11px] text-amber-900 leading-normal flex items-start gap-2">
                  <div>
                    <strong>Safari Note:</strong> Apple Safari does not support capturing tab audio. For digital tab audio on Mac, open Curie in <strong>Google Chrome</strong> or <strong>Edge</strong>. In Safari, use <strong>Microphone Only</strong> with your speakers turned on.
                  </div>
                </div>
              ) : audioSource === 'tab_mic' ? (
                <p className="text-[11px] text-neutral-500 flex items-center gap-1.5 pt-0.5">
                  <span className="font-semibold text-neutral-700">Tip:</span> {isMac ? 'In Chrome/Edge on Mac' : 'In Chrome/Edge'}, be sure to check <strong>"Also share tab audio"</strong> at the bottom of the share picker.
                </p>
              ) : null}

              {/* Collapsible Browser & Mac Compatibility Guide */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowCompat(!showCompat)}
                  className="text-[11px] text-neutral-500 hover:text-black flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
                >
                  <span className="text-[9px]">{showCompat ? '▼' : '▶'}</span>
                  <span>Browser & Mac Compatibility Guide</span>
                </button>

                {showCompat && (
                  <div className="mt-2.5 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-2.5 animate-fadeIn">
                    <div className="font-semibold text-neutral-900 text-xs flex items-center justify-between">
                      <span>Audio Capture Support Matrix</span>
                      <span className="text-[10px] font-mono text-neutral-500">Windows & macOS</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 rounded-lg bg-white border border-neutral-200">
                        <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                          <span className="text-emerald-600 font-bold">✓</span> Chrome, Edge & Brave
                        </div>
                        <p className="mt-1 text-neutral-500 leading-relaxed">
                          <strong>Full support:</strong> Direct digital audio from any Meet/Zoom/YouTube tab + mic. In Windows, can also capture Zoom/Discord desktop apps via "Entire Screen + System Audio".
                        </p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-white border border-neutral-200">
                        <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                          <span className="text-neutral-400 font-bold">•</span> Firefox & Safari
                        </div>
                        <p className="mt-1 text-neutral-500 leading-relaxed">
                          <strong>Microphone Only:</strong> Listens to room/laptop speakers. (Browser engines lack tab audio capture APIs).
                        </p>
                      </div>
                    </div>

                    <div className="text-[11px] text-neutral-600 pt-2 border-t border-neutral-200/60 leading-relaxed">
                      <strong>Does Curie work on Mac?</strong> Yes, 100%!
                      <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[10.5px] text-neutral-500">
                        <li><strong>Chrome / Edge on macOS:</strong> Captures tab audio and mic cleanly. (First time: allow Microphone & Screen Recording in <em>System Settings → Privacy & Security</em>).</li>
                        <li><strong>Safari on macOS:</strong> Works smoothly with "Microphone Only".</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Synthesis Model Picker */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Synthesis Model
                </span>
                <span className="text-[10px] font-mono text-neutral-400">AssemblyAI LLM Gateway</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAnalysisModel('claude-sonnet-4-6')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    analysisModel === 'claude-sonnet-4-6'
                      ? 'border-black bg-neutral-900 text-white shadow-xs'
                      : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-xs">Executive · Claude Sonnet 4.6</span>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                        analysisModel === 'claude-sonnet-4-6'
                          ? 'bg-white text-black badge-light'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                      style={{ color: analysisModel === 'claude-sonnet-4-6' ? '#000000' : undefined }}
                    >
                      Polished
                    </span>
                  </div>
                  <p className={`text-[11px] leading-tight ${analysisModel === 'claude-sonnet-4-6' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    Sophisticated executive synthesis, polished business prose, and prioritized actions.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setAnalysisModel('gemini-3.5-flash')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    analysisModel === 'gemini-3.5-flash'
                      ? 'border-black bg-neutral-900 text-white shadow-xs'
                      : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-xs">Fast · Gemini Flash</span>
                  </div>
                  <p className={`text-[11px] leading-tight ${analysisModel === 'gemini-3.5-flash' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    Sub-second analysis with a massive 1M+ token context window.
                  </p>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                id="start-meeting-btn"
                onClick={handleStartMeeting}
                className="tactile-btn flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-black text-white text-sm font-bold hover:bg-neutral-800 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-sm"
              >
                <Mic className="w-4 h-4 text-white" />
                {audioSource === 'tab_mic' ? 'Share Tab & Start Listening' : 'Start Listening'}
              </button>
              <button
                id="run-demo-btn"
                onClick={handleRunFixture}
                className="tactile-btn flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-neutral-300 bg-white text-black text-sm font-semibold hover:bg-neutral-50 hover:border-black transition-all cursor-pointer"
              >
                <Play className="w-4 h-4" />
                Run Demo
              </button>
            </div>

            <p className="text-[11px] text-neutral-400 text-center leading-relaxed">
              AssemblyAI Universal-3.6 Pro · Real-time streaming · Your audio is never stored
            </p>
          </div>
        )}

        {/* Connecting State */}
        {isConnecting && (
          <div className="bg-white border border-neutral-200 rounded-2xl p-10 shadow-xs flex flex-col items-center gap-4 text-center">
            <Loader2 className="w-8 h-8 text-black animate-spin" />
            <p className="text-sm font-semibold text-black">
              {status === 'stopping' ? 'Processing transcript…' : 'Connecting to AssemblyAI…'}
            </p>
            <p className="text-xs text-neutral-500">Establishing real-time WebSocket stream</p>
          </div>
        )}

        {/* Recording State */}
        {isActive && (
          <div className="space-y-5">
            {/* Warning / Compatibility Notice */}
            {warningMsg && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3 shadow-2xs">
                <span className="text-base shrink-0">⚠️</span>
                <div className="flex-1 leading-relaxed">
                  <span className="font-bold">Audio Source Notice: </span>
                  {warningMsg}
                </div>
                <button
                  type="button"
                  onClick={() => setWarningMsg('')}
                  className="text-amber-800 hover:text-black font-semibold text-xs px-2 py-0.5 rounded cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Side-by-Side Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
              {/* Left Card: Live Audio Status & Waveform */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-black animate-pulse" />
                      <span className="text-sm font-bold text-black">Listening to meeting</span>
                    </div>
                    <span className="text-xs font-mono text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-lg">
                      {SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage)?.label}
                    </span>
                  </div>

                  <div className="my-2">
                    <WaveformBars active={waveActive} />
                  </div>

                  <div className="flex items-center justify-center gap-2 my-2">
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
                      {isDemoMode ? 'Demo Audio Playing' : audioSource === 'tab_mic' ? 'Tab + Mic Mixed' : 'Mic Only'}
                    </span>
                    {isDemoMode && (
                      <button
                        type="button"
                        onClick={toggleDemoMute}
                        className="flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200 transition-colors cursor-pointer"
                        title={isDemoMuted ? 'Unmute Demo Audio' : 'Mute Demo Audio'}
                      >
                        {isDemoMuted ? <VolumeX className="w-3 h-3 text-neutral-500" /> : <Volume2 className="w-3 h-3 text-black" />}
                        <span>{isDemoMuted ? 'Muted' : 'Audio On'}</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-100 mt-2">
                  <div className="text-center p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
                    <div className="flex items-center justify-center gap-1 text-neutral-500 mb-0.5">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div className="font-mono font-bold text-sm sm:text-base text-black">{formatDuration(duration)}</div>
                    <div className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wide mt-0.5">Duration</div>
                  </div>
                  <div className="text-center p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
                    <div className="flex items-center justify-center gap-1 text-neutral-500 mb-0.5">
                      <Hash className="w-3.5 h-3.5" />
                    </div>
                    <div className="font-mono font-bold text-sm sm:text-base text-black">{wordCount.toLocaleString()}</div>
                    <div className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wide mt-0.5">Words</div>
                  </div>
                  <div className="text-center p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
                    <div className="flex items-center justify-center gap-1 text-neutral-500 mb-0.5">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <div className="font-mono font-bold text-sm sm:text-base text-black">U-3.6 Pro</div>
                    <div className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wide mt-0.5">Model</div>
                  </div>
                </div>
              </div>

              {/* Right Card: Live Transcript Stream */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-black" />
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-500">Live Transcript</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">Streamed</span>
                </div>

                <div className="flex-1 min-h-[170px] max-h-[230px] overflow-y-auto custom-scrollbar space-y-2 p-3 rounded-xl bg-neutral-50/70 border border-neutral-100">
                  {recentLines.length === 0 && !partialText && (
                    <p className="text-sm text-neutral-400 italic">Waiting for speech…</p>
                  )}
                  {recentLines.map((line, i) => (
                    <p key={i} className="text-sm text-neutral-800 leading-relaxed">
                      {line}
                    </p>
                  ))}
                  {partialText && (
                    <p className="text-sm text-neutral-500 italic leading-relaxed">
                      {partialText}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Stop & Skip Buttons */}
            <div className="flex gap-3">
              <button
                id="stop-analyze-btn"
                onClick={handleStopAndAnalyze}
                className="tactile-btn flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-black text-white text-sm font-bold hover:bg-neutral-800 transition-all cursor-pointer shadow-sm"
              >
                <Square className="w-4 h-4 text-white" />
                Stop & Analyze Meeting
              </button>
              {isDemoMode && (
                <button
                  type="button"
                  id="skip-demo-btn"
                  onClick={handleSkipDemoToEnd}
                  className="tactile-btn flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl border border-neutral-300 bg-white text-neutral-800 text-sm font-semibold hover:border-black hover:text-black transition-all cursor-pointer"
                  title="Skip to end and analyze full meeting"
                >
                  <FastForward className="w-4 h-4" />
                  Skip to Analysis
                </button>
              )}
            </div>

            <p className="text-center text-xs text-neutral-400">
              {isDemoMode
                ? 'Playing simulated team meeting audio — click Stop & Analyze whenever you are ready'
                : meetingName
                ? `Recording: "${meetingName}" — click Stop when done`
                : 'Recording untitled meeting — click Stop when done'}
            </p>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-xs text-center space-y-3">
            <MicOff className="w-8 h-8 text-red-500 mx-auto" />
            <p className="text-sm font-semibold text-red-600">{errorMsg || 'Something went wrong'}</p>
            <button
              onClick={() => setStatus('idle')}
              className="tactile-btn px-4 py-2 rounded-xl bg-black text-white text-sm font-bold cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* How it works */}
        {status === 'idle' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: <Mic className="w-5 h-5 text-black" />,
                title: 'Listen in real-time',
                desc: 'AssemblyAI streams your meeting audio and transcribes instantly using Universal-3.6 Pro.',
              },
              {
                icon: <Radio className="w-5 h-5 text-black" />,
                title: 'Works in background',
                desc: 'Keep the tab open behind your meeting. Your meeting app audio is captured continuously.',
              },
              {
                icon: <FileText className="w-5 h-5 text-black" />,
                title: 'Smart summary + PDF',
                desc: 'When you stop, Gemini analyzes the full transcript and generates a structured report.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center mb-3">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-sm text-black mb-1">{item.title}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

// Fallback demo transcript
const DEMO_TRANSCRIPT = `Alright everyone, let's get started. We have a lot to cover today for our Q4 product planning.
First item on the agenda is the new dashboard redesign. Our designer Sarah has completed the mockups and they look great.
The main focus is improving the metrics overview section and making the navigation more intuitive for new users.
We need to ship this by end of October to align with the marketing campaign.
Next up is the backend performance issues. Our API response times have been degrading since last week's deployment.
The team identified that the database queries on the user analytics endpoint are not using indexes properly.
John has already started a fix. He estimates it will be merged by Thursday.
We should see a 60% improvement in response times after that.
Now let me talk about the mobile app update. We received feedback from beta testers that the onboarding flow is too long.
We're going to cut it from 7 steps down to 4. The key steps we'll keep are account creation, profile setup, and the feature tour.
This should improve our Day 1 retention by roughly 25% based on similar experiments at other companies.
For the Q4 roadmap overall, our three main priorities are: first, the dashboard redesign I mentioned; second, the mobile onboarding improvements; and third, integrating the new payment provider before the holiday shopping season.
The payment provider switch is critical because our current provider has been having reliability issues and our checkout failure rate went up 2% this month.
Let's discuss budget. We have 40 thousand dollars remaining in the engineering budget for Q4.
We're allocating 15k for infrastructure scaling, 10k for third party tools and licenses, and 15k stays as a reserve for unexpected work.
Everyone please update your project timelines in Jira by end of day Friday.
Our next all-hands is scheduled for October 15th. That's everything for today. Any final questions?
Great. Thanks everyone. Talk soon.`
