import React, { useState, useRef, useEffect } from 'react'
import { Mic, Square, Play, Pause, Sparkles, Zap, Volume2, RotateCcw } from 'lucide-react'
import TermTooltip from './TermTooltip'

export default function DictationBar({
  isRecording,
  isProcessing,
  recordingDuration,
  audioLevel,
  frequencyData,
  onStartRecord,
  onStopRecord,
  onRunFixture,
  onReset,
  telemetry,
  activeEncounter
}) {
  const canvasRef = useRef(null)
  const audioRef = useRef(null)
  const animFrameRef = useRef(null)

  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [audioCurrentTime, setAudioCurrentTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)

  const isDemo = ['cardiology-stemi-followup', 'pediatric-asthma-exacerbation', 'ortho-sports-knee'].includes(activeEncounter?.id) || (!activeEncounter?.id?.startsWith('custom-'))

  const fixtureUrl = activeEncounter?.audioUrl || (
    activeEncounter?.id?.includes('cardio')
      ? '/fixtures/cardiology_consultation_en.wav'
      : activeEncounter?.id?.includes('pediatric')
        ? '/fixtures/pediatric_asthma_en.wav'
        : '/fixtures/orthopedic_knee_trauma_en.wav'
  )

  // Pause audio when switching encounter
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlayingAudio(false)
      setAudioCurrentTime(0)
    }
  }, [activeEncounter?.id])

  const togglePlayAudio = () => {
    if (!audioRef.current) return
    if (isPlayingAudio) {
      audioRef.current.pause()
      setIsPlayingAudio(false)
    } else {
      audioRef.current.play()
        .then(() => setIsPlayingAudio(true))
        .catch((err) => console.warn('Audio play error:', err))
    }
  }

  const formatTime = (secs) => {
    if (isNaN(secs) || secs === Infinity) return '00:00'
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  // Draw audio waveform on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      if (isRecording && frequencyData) {
        const barCount = 32
        const barWidth = Math.floor(width / barCount) - 2
        const step = Math.floor(frequencyData.length / barCount)

        for (let i = 0; i < barCount; i++) {
          const val = frequencyData[i * step] || 0
          const percent = Math.min(1, Math.max(0.1, val / 255))
          const barHeight = percent * (height - 4)
          const x = i * (barWidth + 2)
          const y = (height - barHeight) / 2

          const grad = ctx.createLinearGradient(0, y, 0, y + barHeight)
          grad.addColorStop(0, '#000000')
          grad.addColorStop(1, '#525252')

          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.roundRect(x, y, barWidth, barHeight, 2)
          ctx.fill()
        }
      } else if (isPlayingAudio) {
        // Audio playback waveform animation
        const time = Date.now() * 0.007
        const barCount = 32
        const barWidth = Math.floor(width / barCount) - 2

        for (let i = 0; i < barCount; i++) {
          const amp = Math.sin(time + i * 0.35) * 0.3 + Math.cos(time * 0.6 + i * 0.25) * 0.2 + 0.5
          const barHeight = Math.max(4, amp * (height - 6))
          const x = i * (barWidth + 2)
          const y = (height - barHeight) / 2

          ctx.fillStyle = '#000000'
          ctx.beginPath()
          ctx.roundRect(x, y, barWidth, barHeight, 2)
          ctx.fill()
        }
        animFrameRef.current = requestAnimationFrame(draw)
      } else if (isProcessing) {
        // Shimmer loading wave
        const time = Date.now() * 0.005
        for (let i = 0; i < 32; i++) {
          const h = (Math.sin(time + i * 0.3) * 0.4 + 0.5) * (height - 6)
          const x = i * (width / 32)
          const y = (height - h) / 2

          ctx.fillStyle = '#000000'
          ctx.fillRect(x, y, 3, h)
        }
      } else {
        // Idle flatline
        ctx.strokeStyle = '#D4D4D4'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(0, height / 2)
        ctx.lineTo(width, height / 2)
        ctx.stroke()
      }
    }

    draw()

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [isRecording, isProcessing, isPlayingAudio, audioLevel, frequencyData])

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200 shadow-xs">
      {/* Hidden audio element for demo fixtures */}
      {isDemo && (
        <audio
          ref={audioRef}
          src={fixtureUrl}
          preload="metadata"
          onTimeUpdate={() => {
            if (audioRef.current) setAudioCurrentTime(audioRef.current.currentTime)
          }}
          onLoadedMetadata={() => {
            if (audioRef.current) setAudioDuration(audioRef.current.duration)
          }}
          onEnded={() => {
            setIsPlayingAudio(false)
            setAudioCurrentTime(0)
          }}
        />
      )}

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left: Recording & Playback Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {isDemo ? (
            <>
              {/* Primary Demo Action: Run Audio Fixture through AI */}
              <button
                onClick={onRunFixture}
                disabled={isProcessing}
                className={`tactile-btn relative group px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
                  isProcessing
                    ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200'
                    : 'bg-black hover:bg-neutral-800 text-white border-2 border-black'
                }`}
                title="Transcribe pre-recorded patient encounter directly through AssemblyAI"
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-neutral-400" />
                    <span className="text-neutral-500 font-bold">Transcribing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white text-white" />
                    <span className="text-white font-bold">Run Audio Fixture</span>
                  </>
                )}
              </button>

              {/* Demo Audio Player Button: Listen to pre-recorded doctor voice */}
              <button
                onClick={togglePlayAudio}
                disabled={isProcessing}
                className={`tactile-btn px-4 py-3 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer shadow-2xs ${
                  isPlayingAudio
                    ? 'bg-black text-white border-black ring-2 ring-neutral-300'
                    : 'bg-white hover:bg-neutral-50 text-black border-neutral-300 hover:border-black'
                }`}
                title="Listen to the pre-recorded clinical encounter audio fixture"
              >
                {isPlayingAudio ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-white fill-white" />
                    <span className="text-white font-bold">Pause Voice</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-black" />
                    <span className="text-black font-bold">Play Voice ({formatTime(audioDuration || 58)})</span>
                  </>
                )}
              </button>
            </>
          ) : (
            /* Custom Live Patient Action: Start/Stop Ambient Dictation */
            <button
              onClick={isRecording ? onStopRecord : onStartRecord}
              disabled={isProcessing}
              className={`tactile-btn relative group px-6 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all w-full sm:w-auto cursor-pointer ${
                isRecording
                  ? 'bg-white hover:bg-neutral-100 text-black border-2 border-black shadow-sm animate-pulse'
                  : isProcessing
                  ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200'
                  : 'bg-black hover:bg-neutral-800 text-white border-2 border-black shadow-sm'
              }`}
            >
              {isRecording ? (
                <>
                  <Square className="w-4 h-4 fill-current" />
                  <span className="text-black font-bold">Stop Dictation</span>
                </>
              ) : isProcessing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-white" />
                  <span className="text-white font-bold">Universal-3.5 Pro Processing...</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 text-white" />
                  <span className="text-white font-bold">Start Ambient Dictation</span>
                </>
              )}
            </button>
          )}

          {/* Reset / Clear */}
          <button
            onClick={onReset}
            disabled={isRecording || isProcessing}
            className="tactile-btn p-3.5 rounded-xl bg-neutral-100 hover:bg-neutral-200/70 border border-neutral-200 text-neutral-500 hover:text-neutral-800 transition-colors disabled:opacity-40 cursor-pointer shrink-0"
            title="Reset to fresh chart"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Live Waveform Visualizer & Status */}
        <div className="flex-1 max-w-xl w-full px-2 flex flex-col items-center justify-center min-w-0">
          <div className="w-full flex items-center justify-between text-[11px] font-mono mb-1.5 font-medium gap-3">
            <div className="flex items-center gap-2 min-w-0">
              {isDemo && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-red-50 border border-red-200 text-red-600 font-mono font-bold text-[10px] whitespace-nowrap shrink-0 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse shrink-0" />
                  <span>Pre-recorded Voice</span>
                </span>
              )}
              <span className="flex items-center gap-1.5 text-neutral-500 whitespace-nowrap truncate">
                <span className={`w-2 h-2 rounded-full shrink-0 ${isRecording || isPlayingAudio ? 'bg-black animate-ping' : 'bg-black'}`} />
                <span className="truncate">
                  {isRecording
                    ? 'Mic Active (16kHz PCM)'
                    : isProcessing
                    ? 'Universal-3.5 Pro Transcribing...'
                    : isPlayingAudio
                    ? 'Playing Encounter Audio...'
                    : isDemo
                    ? 'Audio Fixture Ready'
                    : 'Audio Hardware Ready'}
                </span>
              </span>
            </div>
            <span className="font-bold text-black font-mono whitespace-nowrap shrink-0">
              {isPlayingAudio
                ? `${formatTime(audioCurrentTime)} / ${formatTime(audioDuration || 58)}`
                : (recordingDuration || '00:00.0')}
            </span>
          </div>
          
          <div className="w-full h-12 bg-neutral-50 rounded-xl border border-neutral-200/80 p-1 flex items-center justify-center overflow-hidden">
            <canvas ref={canvasRef} width={420} height={40} className="w-full h-full" />
          </div>

          {/* Interactive Scrub Bar when Demo Audio is Loaded */}
          {isDemo && (
            <div className="w-full flex items-center gap-2 mt-1.5">
              <input
                type="range"
                min="0"
                max={audioDuration || 60}
                step="0.1"
                value={audioCurrentTime}
                onChange={(e) => {
                  const newTime = parseFloat(e.target.value)
                  if (audioRef.current) audioRef.current.currentTime = newTime
                  setAudioCurrentTime(newTime)
                }}
                className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-black"
                title="Seek pre-recorded audio"
              />
            </div>
          )}

          <div className="w-full text-center mt-1.5">
            <span className="text-[10px] text-neutral-500 font-mono whitespace-nowrap truncate block">
              {isDemo ? (
                <>Listen with <strong className="text-black font-semibold">Play Voice</strong> • Click <strong className="text-black font-semibold">Run Audio Fixture</strong> to transcribe</>
              ) : (
                <>Hold <strong className="text-black font-semibold bg-neutral-100 px-1 py-0.5 rounded border border-neutral-200"><TermTooltip term="PTT">Spacebar (PTT)</TermTooltip></strong> or click <strong className="text-black font-semibold">Start Ambient Dictation</strong></>
              )}
            </span>
          </div>
        </div>

        {/* Right: Telemetry & Turnaround SLA Pill */}
        <div className="flex flex-col items-end shrink-0 text-right">
          <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-800">
            <Zap className="w-3.5 h-3.5 text-black" />
            <span><TermTooltip term="SLA">Turnaround SLA</TermTooltip>:</span>
            <strong className="text-black font-bold bg-neutral-100 px-2 py-0.5 rounded-lg border border-neutral-200">
              {telemetry?.latencyMs ? `${telemetry.latencyMs} ms` : 'Ready'}
            </strong>
          </div>
          <div className="text-[11px] font-mono text-neutral-500 mt-1">
            {telemetry?.biasingHits ? (
              <span className="text-neutral-700 font-medium">
                {telemetry.biasingHits} medical terms locked in vocabulary
              </span>
            ) : (
              <span>Universal-3.5 Pro • Single-pass <TermTooltip term="SOAP">SOAP</TermTooltip> rewrite</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
