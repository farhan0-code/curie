import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  Square,
  ChevronDown,
  ChevronUp,
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
  recentLines = [],
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
  const [pipWindow, setPipWindow] = useState(null)
  const [pipSupported, setPipSupported] = useState(false)
  const [pipError, setPipError] = useState('')
  const [pipExpanded, setPipExpanded] = useState(true)

  const pipWindowRef = useRef(null)
  const pipScrollRef = useRef(null)

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

  // Auto-scroll PiP transcript to bottom when new lines arrive
  useEffect(() => {
    if (pipScrollRef.current) {
      pipScrollRef.current.scrollTop = pipScrollRef.current.scrollHeight
    }
  }, [recentLines, latestText])

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
        html, body { margin:0; padding:0; background:#ffffff; color:#0a0a0a;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          overflow:hidden; user-select:none; height:100%; width:100%; }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #d4d4d4; border-radius: 4px; }
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

  if (!pipWindow) {
    return null
  }

  return (
    <>
      {/* Desktop Always-On-Top Picture-in-Picture Floating Window Portal */}
      {pipWindow &&
        createPortal(
          <div className="h-screen w-screen flex flex-col p-3 bg-white text-black select-none" style={{background:'#fff',color:'#0a0a0a'}}>

            {/* Top Bar */}
            <div className="flex items-center justify-between gap-2 shrink-0 pb-2 border-b" style={{borderColor:'#e5e5e5'}}>
              {/* Logo & Timer */}
              <div className="flex items-center gap-2 shrink-0">
                <CurieLogo size={15} />
                <span className="text-xs font-bold" style={{color:'#111'}}>Curie Meeting AI</span>
              </div>

              {/* Timer */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-xs font-bold flex items-center gap-1.5" style={{color:'#111'}}>
                  {isRecording && <span className="w-2 h-2 rounded-full animate-pulse shrink-0" style={{background:'#ef4444'}} />}
                  {formatDuration(duration)}
                </span>
              </div>
            </div>

            {/* Live Captions Body */}
            {pipExpanded && (
              <div className="mt-2 flex-1 flex flex-col overflow-hidden">
                {/* LIVE CAPTIONS label */}
                <div className="flex items-center gap-1.5 mb-1.5 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0" style={{background:'#06b6d4'}} />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{color:'#06b6d4'}}>Live Captions</span>
                  <span className="ml-auto text-[10px]" style={{color:'#9ca3af'}}>{wordCount.toLocaleString()} words</span>
                </div>

                {/* Scrollable transcript — shows all accumulated lines + live partial */}
                <div
                  ref={pipScrollRef}
                  className="flex-1 overflow-y-auto text-[13px] leading-relaxed pr-1"
                  style={{color:'#111', scrollbarWidth:'thin', scrollbarColor:'#d4d4d4 transparent'}}
                >
                  {recentLines.length > 0 || latestText ? (
                    <div className="space-y-1">
                      {recentLines.map((line, i) => (
                        <p key={i} style={{color:'#222', margin:0}}>{line}</p>
                      ))}
                      {latestText && (
                        <p className="italic" style={{color:'#6b7280', margin:0}}>{latestText}</p>
                      )}
                    </div>
                  ) : isRecording ? (
                    <span style={{color:'#9ca3af', fontStyle:'italic'}}>Listening to audio stream in real-time…</span>
                  ) : (
                    <span style={{color:'#9ca3af'}}>Ready to capture meeting audio.</span>
                  )}
                </div>
              </div>
            )}

            {/* Bottom Bar: Stop, Cancel, words, focus link */}
            <div className="flex items-center justify-between gap-2 pt-2 mt-auto border-t shrink-0" style={{borderColor:'#e5e5e5'}}>
              <div className="flex items-center gap-1.5">
                {isRecording && (
                  <>
                    <button
                      type="button"
                      onClick={onStopAndAnalyze}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-white text-xs font-bold transition-all cursor-pointer active:scale-95"
                      style={{background:'#dc2626'}}
                      onMouseOver={e => e.currentTarget.style.background='#ef4444'}
                      onMouseOut={e => e.currentTarget.style.background='#dc2626'}
                      title="Stop & Analyze Meeting"
                    >
                      <Square className="w-3 h-3 fill-current shrink-0" />
                      <span>Stop & Analyze</span>
                    </button>
                    {onCancelMeeting && (
                      <button
                        type="button"
                        onClick={onCancelMeeting}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                        style={{background:'#f3f4f6',color:'#374151',border:'1px solid #e5e7eb'}}
                        onMouseOver={e => e.currentTarget.style.background='#e5e7eb'}
                        onMouseOut={e => e.currentTarget.style.background='#f3f4f6'}
                        title="Cancel without analyzing"
                      >
                        Cancel
                      </button>
                    )}
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={togglePipExpand}
                  className="flex items-center gap-1 text-[10px] font-semibold cursor-pointer transition-colors"
                  style={{color:'#06b6d4'}}
                  title={pipExpanded ? 'Collapse captions' : 'Expand captions'}
                >
                  {pipExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                <button
                  type="button"
                  onClick={handleFocusMain}
                  className="text-[10px] font-semibold cursor-pointer hover:underline"
                  style={{color:'#06b6d4'}}
                >
                  Open Curie Tab →
                </button>
              </div>
            </div>
          </div>,
          pipWindow.document.body
        )}
    </>
  )
}
