import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  Square,
  Monitor,
  Headphones,
  ChevronDown,
  ChevronUp,
  Radio,
  X,
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
  analysisModel = 'gemini-flash',
  setAnalysisModel,
  onStartMeeting,
  onRunDemo,
  onStopAndAnalyze,
  isMicMuted = false,
  onToggleMicMute,
  isDemoMode = false,
  externalPipWindow = null, // PiP window opened by parent (MeetingCapturePage)
  onCancelMeeting,
}) {
  const [showSourceMenu, setShowSourceMenu] = useState(false)
  const [showModelMenu, setShowModelMenu] = useState(false)
  const [pipWindow, setPipWindow] = useState(null)
  const [pipSupported, setPipSupported] = useState(false)
  const [pipError, setPipError] = useState('')
  const [pipExpanded, setPipExpanded] = useState(true)
  const [barExpanded, setBarExpanded] = useState(false)

  const pipWindowRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'documentPictureInPicture' in window) {
      setPipSupported(true)
    }
  }, [])

  // Sync with externally-opened PiP window (auto-opened by MeetingCapturePage on start)
  useEffect(() => {
    if (externalPipWindow && externalPipWindow !== pipWindowRef.current) {
      pipWindowRef.current = externalPipWindow
      setPipWindow(externalPipWindow)
    } else if (!externalPipWindow && pipWindowRef.current) {
      // Parent closed the PiP window
      pipWindowRef.current = null
      setPipWindow(null)
    }
  }, [externalPipWindow])

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

  const togglePipExpand = () => {
    const next = !pipExpanded
    setPipExpanded(next)
    if (pipWindowRef.current) {
      try {
        if (next) {
          pipWindowRef.current.resizeTo(480, 220)
        } else {
          pipWindowRef.current.resizeTo(480, 72)
        }
      } catch (e) {
        console.warn('[PiP resize error]:', e)
      }
    }
  }

  const handleOpenPiP = async () => {
    // If PiP is already open (e.g. auto-opened on start), just focus it
    if (pipWindowRef.current) {
      try { pipWindowRef.current.focus() } catch (e) {}
      return
    }

    if (!pipSupported) {
      setPipError('Desktop pop-out requires Chrome or Edge.')
      setTimeout(() => setPipError(''), 4000)
      return
    }

    try {
      const pipWin = await window.documentPictureInPicture.requestWindow({
        width: 480,
        height: pipExpanded ? 220 : 72,
        disallowReturnToOpener: false,
      })

      pipWindowRef.current = pipWin

      document.querySelectorAll('style, link[rel="stylesheet"]').forEach((styleEl) => {
        try { pipWin.document.head.appendChild(styleEl.cloneNode(true)) } catch (e) {}
      })

      const baseStyle = pipWin.document.createElement('style')
      baseStyle.textContent = `
        html, body { margin:0; padding:0; background:#0c0c0e; color:#f3f4f6;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          overflow:hidden; user-select:none; height:100%; width:100%; }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
      `
      pipWin.document.head.appendChild(baseStyle)

      pipWin.addEventListener('pagehide', () => {
        pipWindowRef.current = null
        setPipWindow(null)
      })

      setPipWindow(pipWin)
    } catch (err) {
      console.warn('[PiP error]:', err)
      setPipError('Pop-out window blocked. Try clicking "Float over tab" manually.')
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

  // Screen recorder behavior: Only stick above when listening/recording or connecting
  if (status === 'idle') {
    return null
  }

  return (
    <>
      {/* 1. In-App Floating Top Bar (Sticky Screen Recorder Pill / Dynamic Island) */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 max-w-[95vw] transition-all duration-300 animate-in fade-in slide-in-from-top-3 whitespace-nowrap">
        <div className="flex items-center gap-2 sm:gap-3 px-3.5 py-2 rounded-2xl bg-neutral-900/95 text-white backdrop-blur-xl border border-neutral-700/80 shadow-2xl text-xs select-none whitespace-nowrap shrink-0">
          {/* Left Section: Logo & Status */}
          <div className="flex items-center gap-2 pr-2 border-r border-neutral-700/80 shrink-0 whitespace-nowrap">
            <CurieLogo size={18} />
            {isRecording ? (
              <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                <span className="font-mono font-bold text-white text-xs whitespace-nowrap">{formatDuration(duration)}</span>
              </div>
            ) : (
              <span className="font-mono font-semibold text-neutral-400 text-xs whitespace-nowrap">00:00</span>
            )}
          </div>

          {/* Micro Waveform (Active during recording) */}
          {isRecording && (
            <div className="hidden sm:flex items-center gap-[2px] h-4 px-1 shrink-0">
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
            <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
              <button
                type="button"
                id="float-start-btn"
                onClick={onStartMeeting}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-neutral-950 font-bold text-xs whitespace-nowrap shrink-0 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-neutral-950 shrink-0" />
                <span className="whitespace-nowrap">Start</span>
              </button>
            </div>
          )}

          {isConnecting && (
            <span className="text-neutral-400 text-xs px-2 animate-pulse whitespace-nowrap shrink-0">Connecting…</span>
          )}

          {isRecording && (
            <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
              <button
                type="button"
                id="float-stop-btn"
                onClick={onStopAndAnalyze}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs whitespace-nowrap shrink-0 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm"
              >
                <Square className="w-3 h-3 fill-current shrink-0" />
                <span className="whitespace-nowrap">Stop & Analyze</span>
              </button>
              {onCancelMeeting && (
                <button
                  type="button"
                  id="float-cancel-btn"
                  onClick={onCancelMeeting}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer"
                  title="Cancel and discard session without analyzing"
                >
                  <X className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">Cancel</span>
                </button>
              )}
              <button
                type="button"
                id="float-live-toggle"
                onClick={() => setBarExpanded(!barExpanded)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  barExpanded
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-cyan-400 hover:text-cyan-300'
                }`}
                title={barExpanded ? 'Collapse live captions' : 'Expand live captions'}
              >
                <Radio className="w-3 h-3 text-cyan-400 animate-pulse shrink-0" />
                <span className="whitespace-nowrap">{barExpanded ? 'Hide' : 'Live'}</span>
                {barExpanded ? <ChevronUp className="w-3 h-3 shrink-0" /> : <ChevronDown className="w-3 h-3 shrink-0" />}
              </button>
            </div>
          )}


          {/* Controls: Audio Source & PiP Pop-Out */}
          <div className="flex items-center gap-1.5 pl-1 border-l border-neutral-700/80 shrink-0 whitespace-nowrap">
            {/* Audio Source Indicator / Menu */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setShowSourceMenu(!showSourceMenu)}
                className="flex items-center gap-1 px-1.5 py-1 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
                title="Audio Source"
              >
                {audioSource === 'tab_mic' ? (
                  <Monitor className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                ) : (
                  <Headphones className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                )}
                <ChevronDown className="w-2.5 h-2.5 opacity-60 shrink-0" />
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
                    <Monitor className="w-3.5 h-3.5 shrink-0" />
                    <span className="whitespace-nowrap">Tab + Mic Mixed</span>
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
                    <Headphones className="w-3.5 h-3.5 shrink-0" />
                    <span className="whitespace-nowrap">Microphone Only</span>
                  </button>
                </div>
              )}
            </div>


          </div>
        </div>

        {pipError && (
          <div className="mt-1 text-center text-[10px] text-amber-400 bg-neutral-900/90 border border-amber-500/40 rounded-lg px-2 py-1 shadow-md">
            {pipError}
          </div>
        )}

        {/* Collapsible In-App Live Captions Drawer */}
        {barExpanded && isRecording && (
          <div className="mt-2 p-3 rounded-2xl bg-neutral-900/95 text-white backdrop-blur-xl border border-neutral-700/80 shadow-2xl animate-in fade-in slide-in-from-top-2 text-xs max-w-lg mx-auto">
            <div className="flex items-center justify-between text-[10px] text-cyan-400 font-mono font-semibold uppercase tracking-wider mb-1.5">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Live Speech Captions
              </span>
              <span className="text-neutral-400">{wordCount.toLocaleString()} words</span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800 text-[11px] leading-relaxed text-neutral-100 max-h-24 overflow-y-auto custom-scrollbar">
              {latestText ? (
                <span className="italic">"{latestText}"</span>
              ) : (
                <span className="text-neutral-500 italic">Listening to audio stream in real-time…</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2. Desktop Always-On-Top Picture-in-Picture Floating Window Portal */}
      {pipWindow &&
        createPortal(
          <div className="h-screen w-screen flex flex-col justify-between p-2.5 bg-neutral-950 text-white select-none">
            {/* Top Bar: Unified sleek floating controller */}
            <div className="flex items-center justify-between gap-2 shrink-0">
              {/* Logo & Timer */}
              <div className="flex items-center gap-2 shrink-0">
                <CurieLogo size={16} />
                <span className="font-mono text-xs font-bold flex items-center gap-1.5 text-white">
                  {isRecording && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />}
                  {formatDuration(duration)}
                </span>
              </div>

              {/* Micro Waveform */}
              {isRecording && (
                <div className="flex items-center gap-[2px] h-3.5 px-1 shrink-0">
                  {microBars.slice(0, 8).map((h, i) => (
                    <span
                      key={i}
                      className="w-[2px] rounded-full bg-neutral-300 animate-pulse"
                      style={{
                        height: `${Math.round(h * 0.65)}px`,
                        animationDelay: `${i * 90}ms`,
                        animationDuration: '0.9s',
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Action Buttons: Stop, Cancel, Expand Live, Close */}
              <div className="flex items-center gap-1.5 shrink-0">
                {isRecording && (
                  <>
                    <button
                      type="button"
                      onClick={onStopAndAnalyze}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                      title="Stop & Analyze Meeting"
                    >
                      <Square className="w-3 h-3 fill-current shrink-0" />
                      <span>Stop</span>
                    </button>
                    {onCancelMeeting && (
                      <button
                        type="button"
                        onClick={onCancelMeeting}
                        className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold cursor-pointer"
                        title="Cancel without analyzing"
                      >
                        Cancel
                      </button>
                    )}
                  </>
                )}

                {/* Expand / Collapse Live Captions Toggle */}
                <button
                  type="button"
                  onClick={togglePipExpand}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    pipExpanded
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-cyan-400'
                  }`}
                  title={pipExpanded ? 'Collapse live captions' : 'Expand live captions'}
                >
                  <Radio className="w-3 h-3 animate-pulse shrink-0" />
                  <span>{pipExpanded ? 'Hide' : 'Live'}</span>
                  {pipExpanded ? <ChevronUp className="w-3 h-3 shrink-0" /> : <ChevronDown className="w-3 h-3 shrink-0" />}
                </button>

                {/* Close PiP */}
                <button
                  type="button"
                  onClick={handleClosePiP}
                  className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 cursor-pointer ml-0.5 shrink-0"
                  title="Close floating window"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* When expanded: Live Dialogue Transcript & Footer */}
            {pipExpanded && (
              <div className="mt-2 flex-1 flex flex-col justify-between overflow-hidden animate-in fade-in">
                <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] leading-relaxed flex-1 overflow-y-auto">
                  {latestText ? (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-cyan-400 font-mono font-semibold uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                          Live Captions
                        </span>
                        <span className="text-neutral-400">{wordCount.toLocaleString()} words</span>
                      </div>
                      <div className="text-neutral-100 italic leading-snug line-clamp-3">"{latestText}"</div>
                    </div>
                  ) : isRecording ? (
                    <div className="text-neutral-400 text-xs italic flex items-center gap-1.5 py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      Listening to audio stream in real-time…
                    </div>
                  ) : (
                    <div className="text-neutral-400 text-xs">Ready to capture meeting audio.</div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1.5 text-[10px] text-neutral-500">
                  <span>Curie Floating Over Tab</span>
                  <button
                    type="button"
                    onClick={handleFocusMain}
                    className="text-cyan-400 hover:underline cursor-pointer font-semibold"
                  >
                    Open Curie Tab →
                  </button>
                </div>
              </div>
            )}
          </div>,
          pipWindow.document.body
        )}
    </>
  )
}
