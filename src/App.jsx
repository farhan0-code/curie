import React, { useState, useEffect, useRef, useCallback } from 'react'
import confetti from 'canvas-confetti'
import {
  Sparkles,
  Activity,
  ShieldCheck,
  Check,
  AlertCircle,
  Stethoscope,
  Clock,
  Zap,
  Info,
  Layers,
  CheckCircle2,
  FileCheck2
} from 'lucide-react'

import Navbar from './components/Navbar'
import PatientHeader from './components/PatientHeader'
import DictationBar from './components/DictationBar'
import BiasingTray from './components/BiasingTray'
import SoapNoteView from './components/SoapNoteView'
import LexiconModal from './components/LexiconModal'
import ExportModal from './components/ExportModal'

import { CLINICAL_ENCOUNTERS } from './data/clinicalEncounters'
import { transcribeClinicalAudio } from './services/dictationService'
import { ClinicalAudioRecorder } from './utils/audioRecorder'

export default function App() {
  const [activeEncounterId, setActiveEncounterId] = useState(CLINICAL_ENCOUNTERS[0].id)
  const encounter = CLINICAL_ENCOUNTERS.find((e) => e.id === activeEncounterId) || CLINICAL_ENCOUNTERS[0]

  // Keyterms per encounter state
  const [keytermsMap, setKeytermsMap] = useState(() => {
    const initial = {}
    CLINICAL_ENCOUNTERS.forEach((enc) => {
      initial[enc.id] = [...enc.keyterms]
    })
    return initial
  })

  // SOAP notes per encounter state
  const [soapNotesMap, setSoapNotesMap] = useState(() => {
    const initial = {}
    CLINICAL_ENCOUNTERS.forEach((enc) => {
      initial[enc.id] = { ...enc.soapNote }
    })
    return initial
  })

  // Transcripts per encounter state
  const [transcriptsMap, setTranscriptsMap] = useState(() => {
    const initial = {}
    CLINICAL_ENCOUNTERS.forEach((enc) => {
      initial[enc.id] = enc.spokenTranscript
    })
    return initial
  })

  // Telemetry per encounter state
  const [telemetry, setTelemetry] = useState({
    latencyMs: 1084,
    isLive: false,
    biasingHits: encounter.keyterms.length
  })

  // Audio Recording states
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [frequencyData, setFrequencyData] = useState(null)
  const [recordingDuration, setRecordingDuration] = useState('00:00.0')

  // Modals state
  const [isLexiconOpen, setIsLexiconOpen] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)

  // Toast feedback
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  const recorderRef = useRef(null)
  const timerIntervalRef = useRef(null)
  const isSpacePressedRef = useRef(false)

  const currentKeyterms = keytermsMap[activeEncounterId] || encounter.keyterms
  const currentSoapNote = soapNotesMap[activeEncounterId] || encounter.soapNote
  const currentTranscript = transcriptsMap[activeEncounterId] || encounter.spokenTranscript

  // Format recording timer
  const updateTimer = (startTime) => {
    const elapsed = Date.now() - startTime
    const seconds = Math.floor(elapsed / 1000)
    const tenths = Math.floor((elapsed % 1000) / 100)
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    setRecordingDuration(
      `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${tenths}`
    )
  }

  // Start Audio Recording
  const startRecording = async () => {
    if (isRecording || isProcessing) return
    try {
      const recorder = new ClinicalAudioRecorder((level, freqData) => {
        setAudioLevel(level)
        setFrequencyData(freqData)
      })

      await recorder.start()
      recorderRef.current = recorder
      setIsRecording(true)

      const startTime = Date.now()
      setRecordingDuration('00:00.0')
      timerIntervalRef.current = setInterval(() => updateTimer(startTime), 100)
    } catch (err) {
      console.error('Microphone capture error:', err)
      showToast('Microphone access denied. You can use "Run Audio Fixture" to evaluate instantly.', 'info')
    }
  }

  // Stop Audio Recording & Submit to Dictation API
  const stopRecording = async () => {
    if (!isRecording || !recorderRef.current) return
    setIsRecording(false)

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }

    setIsProcessing(true)

    try {
      const { blob } = await recorderRef.current.stop()

      // Call Curie Dictation Pipeline with Active Keyterms
      const result = await transcribeClinicalAudio(blob, {
        ...encounter,
        keyterms: currentKeyterms
      })

      if (result.success) {
        setSoapNotesMap((prev) => ({
          ...prev,
          [activeEncounterId]: result.soapNote
        }))
        setTranscriptsMap((prev) => ({
          ...prev,
          [activeEncounterId]: result.verbatim
        }))
        setTelemetry({
          latencyMs: result.latencyMs,
          isLive: result.isLive,
          biasingHits: currentKeyterms.length
        })

        // Fire rewarding celebratory particles
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#10B981', '#34D399', '#06B6D4']
        })

        showToast(
          `Universal-3.5 Pro Transcribed & Structured in ${result.latencyMs}ms!`,
          'success'
        )
      }
    } catch (err) {
      console.error('Transcription error:', err)
      showToast('Transcription error. Switched to fallback telemetry.', 'info')
    } finally {
      setIsProcessing(false)
      recorderRef.current = null
    }
  }

  // Instant Scenario Evaluation (1-Click Run Audio Fixture)
  const handleRunFixture = async () => {
    if (isRecording || isProcessing) return
    setIsProcessing(true)

    try {
      // Create lightweight silent buffer for real payload delivery to API
      const fakeAudioBlob = new Blob([new Uint8Array(44 + 16000 * 2)], { type: 'audio/wav' })

      const result = await transcribeClinicalAudio(fakeAudioBlob, {
        ...encounter,
        keyterms: currentKeyterms
      })

      setSoapNotesMap((prev) => ({
        ...prev,
        [activeEncounterId]: result.soapNote
      }))
      setTranscriptsMap((prev) => ({
        ...prev,
        [activeEncounterId]: result.verbatim
      }))
      setTelemetry({
        latencyMs: result.latencyMs,
        isLive: result.isLive,
        biasingHits: currentKeyterms.length
      })

      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.8 },
        colors: ['#10B981', '#34D399', '#06B6D4']
      })

      showToast(
        `Scenario "${encounter.title}" transcribed in ${result.latencyMs}ms with ${currentKeyterms.length} keyterms biased!`,
        'success'
      )
    } finally {
      setIsProcessing(false)
    }
  }

  // Reset current chart
  const handleReset = () => {
    setSoapNotesMap((prev) => ({
      ...prev,
      [activeEncounterId]: { ...encounter.soapNote }
    }))
    setTranscriptsMap((prev) => ({
      ...prev,
      [activeEncounterId]: encounter.spokenTranscript
    }))
    setKeytermsMap((prev) => ({
      ...prev,
      [activeEncounterId]: [...encounter.keyterms]
    }))
    showToast('Reset chart to initial encounter state.', 'info')
  }

  // Add custom keyterm
  const handleAddKeyterm = (term) => {
    setKeytermsMap((prev) => {
      const current = prev[activeEncounterId] || []
      return {
        ...prev,
        [activeEncounterId]: [...current, term]
      }
    })
    showToast(`Added "${term}" to Universal-3.5 Pro biasing dictionary.`, 'success')
  }

  // Remove keyterm
  const handleRemoveKeyterm = (term) => {
    setKeytermsMap((prev) => {
      const current = prev[activeEncounterId] || []
      return {
        ...prev,
        [activeEncounterId]: current.filter((t) => t !== term)
      }
    })
  }

  // Reset keyterms
  const handleResetKeyterms = () => {
    setKeytermsMap((prev) => ({
      ...prev,
      [activeEncounterId]: [...encounter.keyterms]
    }))
    showToast('Reset keyterms to encounter baseline.', 'info')
  }

  // Update SOAP note directly from editor
  const handleUpdateSoapNote = (newSoap) => {
    setSoapNotesMap((prev) => ({
      ...prev,
      [activeEncounterId]: newSoap
    }))
    showToast('Updated clinical SOAP record.', 'success')
  }

  // Global Spacebar Push-to-Talk listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input or textarea
      if (
        e.code === 'Space' &&
        !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)
      ) {
        if (!isSpacePressedRef.current && !isRecording && !isProcessing) {
          e.preventDefault()
          isSpacePressedRef.current = true
          startRecording()
        }
      }
    }

    const handleKeyUp = (e) => {
      if (
        e.code === 'Space' &&
        !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)
      ) {
        if (isSpacePressedRef.current) {
          e.preventDefault()
          isSpacePressedRef.current = false
          stopRecording()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [isRecording, isProcessing, activeEncounterId, currentKeyterms])

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 selection:bg-emerald-500/30 selection:text-white flex flex-col font-sans">
      {/* Top Application Navbar */}
      <Navbar
        onOpenLexicon={() => setIsLexiconOpen(true)}
        activeEncounter={encounter}
      />

      {/* Main Clinical Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Patient Demographics & Vitals Header */}
        <PatientHeader
          encounters={CLINICAL_ENCOUNTERS}
          activeEncounterId={activeEncounterId}
          onSelectEncounter={(id) => {
            setActiveEncounterId(id)
            setRecordingDuration('00:00.0')
          }}
        />

        {/* Dictation Command Bar (Record, Spacebar Push-to-Talk, Waveform, Fixture) */}
        <DictationBar
          isRecording={isRecording}
          isProcessing={isProcessing}
          recordingDuration={recordingDuration}
          audioLevel={audioLevel}
          frequencyData={frequencyData}
          onStartRecord={startRecording}
          onStopRecord={stopRecording}
          onRunFixture={handleRunFixture}
          onReset={handleReset}
          telemetry={telemetry}
          activeEncounter={encounter}
        />

        {/* Acoustic Biasing Dictionary Tray (keyterms_prompt) */}
        <BiasingTray
          activeEncounter={encounter}
          keyterms={currentKeyterms}
          onAddKeyterm={handleAddKeyterm}
          onRemoveKeyterm={handleRemoveKeyterm}
          onResetKeyterms={handleResetKeyterms}
        />

        {/* Formatted SOAP Note, Audio Stream, and E-Prescription Orders */}
        <SoapNoteView
          encounter={encounter}
          soapNote={currentSoapNote}
          verbatimTranscript={currentTranscript}
          prescriptions={encounter.prescriptions}
          telemetry={telemetry}
          onUpdateSoapNote={handleUpdateSoapNote}
          onOpenExportModal={() => setIsExportOpen(true)}
        />
      </main>

      {/* Footer Benchmark Bar */}
      <footer className="border-t border-white/[0.08] bg-obsidian-950 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white font-sans">Curie Ambient Scribe</span>
            <span>•</span>
            <span>Built for AssemblyAI Voice Hackathon Week (Hack into Dictation)</span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span className="text-slate-400">
              Model: <strong className="text-emerald-400">Universal-3.5 Pro</strong>
            </span>
            <span>•</span>
            <span className="text-slate-400">
              Biasing: <strong className="text-cyan-400">keyterms_prompt active</strong>
            </span>
            <span>•</span>
            <span className="text-slate-400">
              SLA: <strong className="text-white">~1.1s latency</strong>
            </span>
          </div>
        </div>
      </footer>

      {/* Lexicon Inspector Modal */}
      <LexiconModal
        isOpen={isLexiconOpen}
        onClose={() => setIsLexiconOpen(false)}
      />

      {/* EHR Export Modal (Epic, FHIR, Cerner) */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        encounter={encounter}
        soapNote={currentSoapNote}
        prescriptions={encounter.prescriptions}
      />

      {/* Toast Notification Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
          <div
            className={`px-4 py-3 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] border text-xs font-medium flex items-center gap-2.5 backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40'
                : 'bg-slate-900/90 text-slate-200 border-white/20'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  )
}
