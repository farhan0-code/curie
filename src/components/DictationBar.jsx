import React, { useRef, useEffect } from 'react'
import { Mic, Square, Play, Sparkles, Clock, Zap, Volume2, RotateCcw } from 'lucide-react'

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

  // Draw audio waveform on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

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

        // Dynamic gradient from Sage to Cyan
        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight)
        grad.addColorStop(0, '#34D399')
        grad.addColorStop(1, '#059669')

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.roundRect(x, y, barWidth, barHeight, 2)
        ctx.fill()
      }
    } else if (isProcessing) {
      // Shimmer loading wave
      const time = Date.now() * 0.005
      for (let i = 0; i < 32; i++) {
        const h = (Math.sin(time + i * 0.3) * 0.4 + 0.5) * (height - 6)
        const x = i * (width / 32)
        const y = (height - h) / 2

        ctx.fillStyle = '#10B981'
        ctx.fillRect(x, y, 3, h)
      }
    } else {
      // Idle flatline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(0, height / 2)
      ctx.lineTo(width, height / 2)
      ctx.stroke()
    }
  }, [isRecording, isProcessing, audioLevel, frequencyData])

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Recording Controls & Button */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Main Record Button */}
          <button
            onClick={isRecording ? onStopRecord : onStartRecord}
            disabled={isProcessing}
            className={`tactile-btn relative group px-5 py-3.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2.5 transition-all w-full sm:w-auto ${
              isRecording
                ? 'bg-rose-600 text-white shadow-[0_0_24px_rgba(244,63,94,0.4)] border border-rose-400/30 animate-pulse'
                : isProcessing
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-white/10'
                : 'bg-sage-600 hover:bg-sage-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.25)] border border-sage-400/30'
            }`}
          >
            {isRecording ? (
              <>
                <Square className="w-4 h-4 fill-current" />
                <span>Stop Recording</span>
              </>
            ) : isProcessing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-sage-400" />
                <span>Universal-3.5 Pro Transcribing...</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>Start Dictation</span>
              </>
            )}
          </button>

          {/* Preset Audio Scenario Run Button (1-Click Instant Demo) */}
          <button
            onClick={onRunFixture}
            disabled={isRecording || isProcessing}
            className="tactile-btn hidden sm:inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-slate-900/90 border border-white/[0.08] text-xs font-medium text-slate-300 hover:text-white hover:border-white/20 transition-colors disabled:opacity-50"
            title="Transcribe pre-recorded patient encounter directly through AssemblyAI"
          >
            <Play className="w-3.5 h-3.5 text-sage-400 fill-sage-400/20" />
            <span>Run Audio Fixture</span>
          </button>

          {/* Reset / Clear */}
          <button
            onClick={onReset}
            disabled={isRecording || isProcessing}
            className="tactile-btn p-3.5 rounded-xl bg-slate-900/70 border border-white/[0.06] text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-40"
            title="Reset to fresh chart"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Live Waveform Visualizer & Status */}
        <div className="flex-1 max-w-md w-full px-2 flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-rose-500 animate-ping' : 'bg-slate-600'}`} />
              {isRecording ? 'Microphone Active (16kHz PCM)' : isProcessing ? 'Dictation API Processing...' : 'Audio Input Ready'}
            </span>
            <span className="font-semibold text-white">
              {recordingDuration || '00:00.0'}
            </span>
          </div>
          
          <div className="w-full h-12 bg-obsidian-900 rounded-lg border border-white/[0.06] p-1 flex items-center justify-center overflow-hidden">
            <canvas ref={canvasRef} width={380} height={40} className="w-full h-full" />
          </div>

          <div className="w-full text-center mt-1">
            <span className="text-[10px] text-slate-400 font-mono">
              Hold <strong className="text-slate-300">Spacebar</strong> to dictate • Press <strong className="text-slate-300">Run Audio Fixture</strong> for instant evaluation
            </span>
          </div>
        </div>

        {/* Right: Telemetry & Turnaround SLA Pill */}
        <div className="flex flex-col items-end shrink-0 text-right">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <Zap className="w-3.5 h-3.5 text-sage-400" />
            <span>Turnaround Latency:</span>
            <strong className="text-white font-semibold">
              {telemetry?.latencyMs ? `${telemetry.latencyMs} ms` : '1,045ms – 1,240ms'}
            </strong>
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">
            {telemetry?.biasingHits ? (
              <span className="text-sage-400">
                {telemetry.biasingHits} medical keyterms locked in vocabulary
              </span>
            ) : (
              <span>Universal-3.5 Pro • Single-pass SOAP rewrite</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
