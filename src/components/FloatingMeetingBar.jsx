import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  Mic,
  MicOff,
  Square,
  Play,
  Monitor,
  Headphones,
  ExternalLink,
  ChevronDown,
  X,
  Minus,
  Maximize2,
  Volume2,
  VolumeX,
  Sparkles,
} from 'lucide-react'
import CurieLogo from './CurieLogo'

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function FloatingMeetingBar({
  status, // 'idle' | 'connecting' | 'recording' | 'stopping' | 'error'
  duration = 0,
  wordCount = 0,
  latestText = '',
  audioSource = 'tab_mic',
  setAudioSource,
  analysisModel = 'claude-sonnet-4-6',
  setAnalysisModel,
  onStartMeeting,
  onRunDemo,
  onStopAndAnalyze,
  isMicMuted = false,
  onToggleMicMute,
  isDemoMode = false,
}) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [showSourceMenu, setShowSourceMenu] = useState(false)
  const [showModelMenu, setShowModelMenu] = useState(false)
  const [pipWindow, setPipWindow] = useState(null)
  const [pipSupported, setPipSupported] = useState(false)
  const [pipError, setPipError] = useState('')

  const pipWindowRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'documentPictureInPicture' in window) {
      setPipSupported(true)
    }
  }, [])

  // Close PiP window on unmount
  useEffect(() => {
    return () => {
      if (pipWindowRef.current) {
        try {
          pipWindowRef.current.close()
        } catch (e) {}
        pipWindowRef.current = null
      }
    }
  }, [])

  const handleOpenPiP = async () => {
    if (!pipSupported) {
      setPipError('Desktop pop-out requires Chrome or Edge.')
      setTimeout(() => setPipError(''), 4000)
      return
    }

    try {
      if (pipWindowRef.current) {
        pipWindowRef.current.focus()
        return
      }

      // Request Picture-in-Picture window
      const pipWin = await window.documentPictureInPicture.requestWindow({
        width: 420,
        height: 220,
      })

      pipWindowRef.current = pipWin

      // Copy stylesheet rules to PiP document
      document.querySelectorAll('style, link[rel="stylesheet"]').forEach((styleEl) => {
        try {
          pipWin.document.head.appendChild(styleEl.cloneNode(true))
        } catch (e) {}
      })

      // Set base styling
      const baseStyle = pipWin.document.createElement('style')
      baseStyle.textContent = `
        body {
          margin: 0;
          padding: 0;
          background-color: #0c0c0e;
          color: #f3f4f6;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          overflow: hidden;
          user-select: none;
        }
        * { box-sizing: border-box; }
      `
      pipWin.document.head.appendChild(baseStyle)

      pipWin.addEventListener('pagehide', () => {
        pipWindowRef.current = null
        setPipWindow(null)
      })

      setPipWindow(pipWin)
    } catch (err) {
      console.warn('[PiP error]:', err)
      setPipError('Pop-out window closed or blocked by browser.')
      setTimeout(() => setPipError(''), 4000)
    }
  }

  const handleClosePiP = () => {
    if (pipWindowRef.current) {
      pipWindowRef.current.close()
      pipWindowRef.current = null
      setPipWindow(null)
    }
  }

  const handleFocusMain = () => {
    if (typeof window !== 'undefined') {
      window.focus()
    }
  }

  const isRecording = status === 'recording'
  const isConnecting = status === 'connecting' || status === 'stopping'

  // Micro waveform bars
  const microBars = [8, 14, 20, 10, 16, 22, 12, 18, 6, 15]

  return (
    <>
      {/* 1. In-App Floating Top Bar (Sticky Pill / Dynamic Island) */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 max-w-[95vw] transition-all">
        {isMinimized ? (
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/90 text-white backdrop-blur-md border border-neutral-700 shadow-xl hover:bg-black transition-all cursor-pointer text-xs"
          >
            <CurieLogo size={16} />
            <span className="font-mono font-bold">{formatDuration(duration)}</span>
            {isRecording && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
            <Maximize2 className="w-3 h-3 text-neutral-400" />
          </button>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3 px-3 py-2 rounded-2xl bg-neutral-900/95 text-white backdrop-blur-xl border border-neutral-700/80 shadow-2xl text-xs select-none">
            {/* Left Section: Logo & Status */}
            <div className="flex items-center gap-2 pr-2 border-r border-neutral-700/80">
              <CurieLogo size={18} />
              {isRecording ? (
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-mono font-bold text-white text-xs">{formatDuration(duration)}</span>
                </div>
              ) : (
                <span className="font-mono font-semibold text-neutral-400 text-xs">00:00</span>
              )}
            </div>

            {/* Micro Waveform (Active during recording) */}
            {isRecording && (
              <div className="hidden sm:flex items-center gap-[2px] h-4 px-1">
                {microBars.map((h, i) => (
                  <span
                    key={i}
                    className="w-[2px] rounded-full bg-neutral-300 animate-pulse"
                    style={{
                      height: `${h}px`,
                      animationDelay: `${i * 90}ms`,
                      animationDuration: '0.9s',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Action Button: Start or Stop */}
            {!isRecording && !isConnecting && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  id="float-start-btn"
                  onClick={onStartMeeting}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-neutral-950 font-bold text-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-neutral-950" />
                  <span>Start</span>
                </button>
                <button
                  type="button"
                  onClick={onRunDemo}
                  className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors cursor-pointer"
                >
                  <Play className="w-3 h-3" />
                  <span>Demo</span>
                </button>
              </div>
            )}

            {isConnecting && (
              <span className="text-neutral-400 text-xs px-2 animate-pulse">Connecting…</span>
            )}

            {isRecording && (
              <button
                type="button"
                id="float-stop-btn"
                onClick={onStopAndAnalyze}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm"
              >
                <Square className="w-3 h-3 fill-current" />
                <span>Stop & Analyze</span>
              </button>
            )}

            {/* Center: Live caption snippet (during recording) */}
            {isRecording && latestText && (
              <div className="hidden lg:block max-w-[200px] truncate text-[11px] text-neutral-300 px-2 py-0.5 rounded bg-neutral-800/80">
                "{latestText}"
              </div>
            )}

            {/* Controls: Mic Mute & Audio Source */}
            <div className="flex items-center gap-1 pl-1 border-l border-neutral-700/80">
              {/* Mic Mute Toggle */}
              <button
                type="button"
                onClick={onToggleMicMute}
                disabled={!isRecording}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isMicMuted
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
                title={isMicMuted ? 'Microphone is Muted (Click to Unmute)' : 'Mute Microphone'}
              >
                {isMicMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>

              {/* Audio Source Indicator / Menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSourceMenu(!showSourceMenu)}
                  className="flex items-center gap-1 px-1.5 py-1 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                  title="Audio Source"
                >
                  {audioSource === 'tab_mic' ? (
                    <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                  ) : (
                    <Headphones className="w-3.5 h-3.5 text-neutral-300" />
                  )}
                  <ChevronDown className="w-2.5 h-2.5 opacity-60" />
                </button>

                {showSourceMenu && !isRecording && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-neutral-900 border border-neutral-700 rounded-xl p-1.5 shadow-2xl z-50 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setAudioSource('tab_mic')
                        setShowSourceMenu(false)
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer ${
                        audioSource === 'tab_mic' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-neutral-300 hover:bg-neutral-800'
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span>Tab + Mic Mixed</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAudioSource('mic_only')
                        setShowSourceMenu(false)
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer ${
                        audioSource === 'mic_only' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-neutral-300 hover:bg-neutral-800'
                      }`}
                    >
                      <Headphones className="w-3.5 h-3.5" />
                      <span>Microphone Only</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Model Tag */}
              <span className="hidden xl:inline-block text-[10px] font-mono text-neutral-400 px-1.5 py-0.5 rounded bg-neutral-800">
                {analysisModel === 'gemini-3.5-flash' ? 'Gemini' : 'Sonnet 4.6'}
              </span>

              {/* Pop-Out Button (Picture-in-Picture for Desktop/Zoom overlay) */}
              <button
                type="button"
                onClick={handleOpenPiP}
                className="p-1.5 rounded-lg text-neutral-300 hover:text-cyan-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Pop out Always-On-Top floating controller (floats over Zoom & Desktop apps)"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              {/* Minimize */}
              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Minimize toolbar"
              >
                <Minus className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {pipError && (
          <div className="mt-1 text-center text-[10px] text-amber-400 bg-neutral-900/90 border border-amber-500/40 rounded-lg px-2 py-1 shadow-md">
            {pipError}
          </div>
        )}
      </div>

      {/* 2. Desktop Always-On-Top Picture-in-Picture Floating Window Portal */}
      {pipWindow &&
        createPortal(
          <div className="h-screen w-screen flex flex-col justify-between p-3 bg-neutral-950 text-white select-none">
            {/* Top Bar: Curie Header & Clock */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <div className="flex items-center gap-2">
                <CurieLogo size={16} />
                <span className="font-bold text-xs tracking-tight">Curie Meeting AI</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 font-mono text-xs font-bold text-white bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                  {isRecording && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                  {formatDuration(duration)}
                </span>
                <button
                  type="button"
                  onClick={handleClosePiP}
                  className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 cursor-pointer"
                  title="Close pop-out"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Center: Live Dialogue Transcript */}
            <div className="my-2 p-2 rounded-lg bg-neutral-900/80 border border-neutral-800 text-[11px] leading-relaxed flex-1 overflow-y-auto">
              {latestText ? (
                <div className="space-y-1">
                  <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-mono">Live Captions</div>
                  <div className="text-neutral-200 italic">"{latestText}"</div>
                </div>
              ) : isRecording ? (
                <div className="text-neutral-500 italic flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  Listening to audio stream…
                </div>
              ) : (
                <div className="text-neutral-400 text-xs">Ready to capture meeting audio.</div>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-neutral-800">
              <div className="flex items-center gap-1.5">
                {isRecording ? (
                  <button
                    type="button"
                    onClick={onStopAndAnalyze}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    <Square className="w-3 h-3 fill-current" />
                    <span>Stop & Analyze</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onStartMeeting}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-neutral-950 text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    <span className="w-2 h-2 rounded-full bg-neutral-950" />
                    <span>Start Meeting</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onToggleMicMute}
                  className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
                    isMicMuted
                      ? 'bg-red-500/20 border-red-500/50 text-red-400'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white'
                  }`}
                  title={isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
                >
                  {isMicMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-neutral-400">
                  {wordCount} words
                </span>
                <button
                  type="button"
                  onClick={handleFocusMain}
                  className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
                >
                  Open Tab
                </button>
              </div>
            </div>
          </div>,
          pipWindow.document.body
        )}
    </>
  )
}
