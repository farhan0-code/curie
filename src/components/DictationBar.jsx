import React, { useRef, useEffect } from 'react'
import { Mic, Square, Play, Sparkles, Clock, Zap, Volume2, RotateCcw } from 'lucide-react'
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

        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight)
        grad.addColorStop(0, '#000000')
        grad.addColorStop(1, '#525252')

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

        ctx.fillStyle = '#000000'
        ctx.fillRect(x, y, 3, h)
      }
    } else {
      // Idle flatline
      ctx.strokeStyle = '#737373'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(0, height / 2)
      ctx.lineTo(width, height / 2)
      ctx.stroke()
    }
  }, [isRecording, isProcessing, audioLevel, frequencyData])

  const isDemo = ['cardiology-stemi-followup', 'pediatric-asthma-exacerbation', 'ortho-sports-knee'].includes(activeEncounter?.id) || (!activeEncounter?.id?.startsWith('custom-'))

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200 shadow-xs">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Recording Controls & Button */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {isDemo ? (
            /* Demo Encounter Primary Action: Run Audio Fixture */
            <button
              onClick={onRunFixture}
              disabled={isProcessing}
              className={`tactile-btn relative group px-6 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all w-full sm:w-auto shadow-xs cursor-pointer ${
                isProcessing
                  ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200'
                  : 'bg-black hover:bg-neutral-800 text-white border-2 border-black'
              }`}
              title="Transcribe pre-recorded patient encounter directly through AssemblyAI"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-neutral-500" />
                  <span className="text-neutral-500 font-bold">Universal-3.5 Pro Processing...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white text-white" />
                  <span className="text-white font-bold">Run Audio Fixture</span>
                </>
              )}
            </button>
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
            className="tactile-btn p-3.5 rounded-xl bg-neutral-100 hover:bg-neutral-200/70 border border-neutral-200 text-neutral-500 hover:text-neutral-800 transition-colors disabled:opacity-40 cursor-pointer"
            title="Reset to fresh chart"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Live Waveform Visualizer & Status */}
        <div className="flex-1 max-w-md w-full px-2 flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-between text-[11px] font-mono text-neutral-500 mb-1.5 font-medium">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-black animate-ping' : 'bg-black'}`} />
              {isRecording ? 'Microphone Active (16kHz PCM)' : isProcessing ? 'Universal-3.5 Pro Transcribing...' : isDemo ? 'Benchmark Audio Fixture Ready' : 'Audio Hardware Ready'}
            </span>
            <span className="font-bold text-black">
              {recordingDuration || '00:00.0'}
            </span>
          </div>
          
          <div className="w-full h-12 bg-neutral-50 rounded-xl border border-neutral-200/80 p-1 flex items-center justify-center overflow-hidden">
            <canvas ref={canvasRef} width={380} height={40} className="w-full h-full" />
          </div>

          <div className="w-full text-center mt-1.5">
            <span className="text-[10px] text-neutral-500 font-mono">
              {isDemo ? (
                <>Click <strong className="text-neutral-800 font-semibold">Run Audio Fixture</strong> to transcribe pre-recorded encounter • Or click <strong className="text-neutral-800 font-semibold">+ New Patient</strong> to record live</>
              ) : (
                <>Hold <strong className="text-neutral-800 font-semibold bg-neutral-100 px-1 py-0.5 rounded border border-neutral-200"><TermTooltip term="PTT">Spacebar (PTT)</TermTooltip></strong> or click <strong className="text-neutral-800 font-semibold">Start Ambient Dictation</strong></>
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
