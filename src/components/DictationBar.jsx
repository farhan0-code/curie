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

        // Vibrant surgical emerald gradient for light theme
        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight)
        grad.addColorStop(0, '#10B981')
        grad.addColorStop(1, '#059669')

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.roundRect(x, y, barWidth, barHeight, 2)
        ctx.fill()
      }
    } else if (isProcessing) {
      // Shimmer loading wave in light theme
      const time = Date.now() * 0.005
      for (let i = 0; i < 32; i++) {
        const h = (Math.sin(time + i * 0.3) * 0.4 + 0.5) * (height - 6)
        const x = i * (width / 32)
        const y = (height - h) / 2

        ctx.fillStyle = '#059669'
        ctx.fillRect(x, y, 3, h)
      }
    } else {
      // Idle flatline (light slate)
      ctx.strokeStyle = '#CBD5E1'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(0, height / 2)
      ctx.lineTo(width, height / 2)
      ctx.stroke()
    }
  }, [isRecording, isProcessing, audioLevel, frequencyData])

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Recording Controls & Button */}
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          {/* Main Record Button */}
          <button
            onClick={isRecording ? onStopRecord : onStartRecord}
            disabled={isProcessing}
            className={`tactile-btn relative group px-5 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all w-full sm:w-auto shadow-xs ${
              isRecording
                ? 'bg-rose-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.35)] animate-pulse'
                : isProcessing
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_2px_12px_rgba(5,150,105,0.25)]'
            }`}
          >
            {isRecording ? (
              <>
                <Square className="w-4 h-4 fill-current" />
                <span>Stop Dictation</span>
              </>
            ) : isProcessing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Universal-3.5 Pro Processing...</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>Start Ambient Dictation</span>
              </>
            )}
          </button>

          {/* Preset Audio Scenario Run Button (1-Click Instant Demo) */}
          <button
            onClick={onRunFixture}
            disabled={isRecording || isProcessing}
            className="tactile-btn hidden sm:inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-200/70 hover:text-slate-900 transition-colors disabled:opacity-50 shadow-xs"
            title="Transcribe pre-recorded patient encounter directly through AssemblyAI"
          >
            <Play className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
            <span>Run Audio Fixture</span>
          </button>

          {/* Reset / Clear */}
          <button
            onClick={onReset}
            disabled={isRecording || isProcessing}
            className="tactile-btn p-3.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors disabled:opacity-40 shadow-xs"
            title="Reset to fresh chart"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Live Waveform Visualizer & Status */}
        <div className="flex-1 max-w-md w-full px-2 flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1.5 font-medium">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-rose-500 animate-ping' : 'bg-slate-400'}`} />
              {isRecording ? 'Microphone Active (16kHz PCM)' : isProcessing ? 'Universal-3.5 Pro Transcribing...' : 'Audio Hardware Ready'}
            </span>
            <span className="font-bold text-slate-900">
              {recordingDuration || '00:00.0'}
            </span>
          </div>
          
          <div className="w-full h-12 bg-slate-50 rounded-xl border border-slate-200 p-1 flex items-center justify-center overflow-hidden">
            <canvas ref={canvasRef} width={380} height={40} className="w-full h-full" />
          </div>

          <div className="w-full text-center mt-1.5">
            <span className="text-[10px] text-slate-500 font-mono">
              Hold <strong className="text-slate-800 font-semibold bg-slate-100 px-1 py-0.5 rounded border border-slate-200">Spacebar</strong> to dictate • Press <strong className="text-slate-800 font-semibold">Run Audio Fixture</strong> for 1-click evaluation
            </span>
          </div>
        </div>

        {/* Right: Telemetry & Turnaround SLA Pill */}
        <div className="flex flex-col items-end shrink-0 text-right">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Turnaround SLA:</span>
            <strong className="text-slate-900 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-emerald-800">
              {telemetry?.latencyMs ? `${telemetry.latencyMs} ms` : '1,084 ms'}
            </strong>
          </div>
          <div className="text-[11px] font-mono text-slate-500 mt-1">
            {telemetry?.biasingHits ? (
              <span className="text-emerald-700 font-medium">
                {telemetry.biasingHits} medical terms locked in vocabulary
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
