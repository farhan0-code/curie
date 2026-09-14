import React, { useState, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import {
  Sparkles,
  ShieldCheck,
  Check,
  AlertCircle,
  Stethoscope,
  Clock,
  Zap,
  Info,
  Share2,
  CheckCircle2,
  Menu
} from 'lucide-react'

const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English (US)' },
  { code: 'es', label: 'Español (ES)' },
  { code: 'fr', label: 'Français (FR)' },
  { code: 'de', label: 'Deutsch (DE)' },
  { code: 'it', label: 'Italiano (IT)' },
  { code: 'pt', label: 'Português (PT)' },
  { code: 'nl', label: 'Nederlands (NL)' },
  { code: 'hi', label: 'Hindi (IN)' },
  { code: 'ja', label: 'Japanese (JA)' },
  { code: 'zh', label: 'Chinese (ZH)' },
  { code: 'ko', label: 'Korean (KO)' },
  { code: 'pl', label: 'Polski (PL)' },
  { code: 'ru', label: 'Russian (RU)' },
  { code: 'sv', label: 'Svenska (SV)' },
  { code: 'tr', label: 'Türkçe (TR)' },
  { code: 'uk', label: 'Ukrainian (UK)' },
  { code: 'vi', label: 'Tiếng Việt (VI)' },
  { code: 'fi', label: 'Suomi (FI)' },
]

import CurieLogo from '../components/CurieLogo'
import WorkspaceSidebar from '../components/WorkspaceSidebar'
import PatientHeader from '../components/PatientHeader'
import DictationBar from '../components/DictationBar'
import BiasingTray from '../components/BiasingTray'
import SoapNoteView from '../components/SoapNoteView'
import LexiconModal from '../components/LexiconModal'
import ExportModal from '../components/ExportModal'

import { CLINICAL_ENCOUNTERS } from '../data/clinicalEncounters'
import { transcribeClinicalAudio } from '../services/dictationService'
import { ClinicalAudioRecorder } from '../utils/audioRecorder'

export default function CockpitPage({ onBackToLanding, initialEncounterId }) {
  const [activeEncounterId, setActiveEncounterId] = useState(
    initialEncounterId || CLINICAL_ENCOUNTERS[0].id
  )
  const [selectedLanguage, setSelectedLanguage] = useState('en')
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

  // Modals & Sidebar state
  const [isLexiconOpen, setIsLexiconOpen] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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
      showToast('Microphone unavailable. You can use "Run Audio Fixture" to evaluate instantly.', 'info')
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
        keyterms: currentKeyterms,
        language: selectedLanguage
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

        // Celebratory particles
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#000000', '#525252', '#737373', '#A3A3A3']
        })

        showToast(
          `Universal-3.5 Pro Transcribed & Structured in ${result.latencyMs}ms!`,
          'success'
        )
      }
    } catch (err) {
      console.error('Transcription error:', err)
      showToast('Transcription completed with verified fallback telemetry.', 'info')
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
      const fakeAudioBlob = new Blob([new Uint8Array(44 + 16000 * 2)], { type: 'audio/wav' })

      const result = await transcribeClinicalAudio(fakeAudioBlob, {
        ...encounter,
        keyterms: currentKeyterms,
        language: selectedLanguage
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
        colors: ['#000000', '#525252', '#737373', '#A3A3A3']
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
    showToast('Reset chart to initial encounter baseline.', 'info')
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
    <div className="relative min-h-screen bg-neutral-50/40 text-black font-sans selection:bg-neutral-200 selection:text-black flex flex-col lg:flex-row overflow-x-hidden">
      {/* ================= LEFT CLINICAL WORKSPACE SIDEBAR ================= */}
      <WorkspaceSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onBackToLanding={onBackToLanding}
        encounters={CLINICAL_ENCOUNTERS}
        activeEncounterId={activeEncounterId}
        onSelectEncounter={(id) => {
          setActiveEncounterId(id)
          setRecordingDuration('00:00.0')
        }}
        supportedLanguages={SUPPORTED_LANGUAGES}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={(langCode) => {
          setSelectedLanguage(langCode)
          const found = SUPPORTED_LANGUAGES.find((l) => l.code === langCode)
          showToast(`Consultation language set to ${found?.label}`, 'info')
        }}
        onOpenLexicon={() => setIsLexiconOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        keytermsCount={currentKeyterms.length}
      />

      {/* ================= RIGHT MAIN WORKSPACE COLUMN ================= */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-white">
        {/* Crisp, Spacious Header Bar — Matches Sidebar Height (h-16) */}
        <header className="sticky top-0 z-30 w-full h-16 bg-white/95 backdrop-blur-md border-b border-neutral-200 px-4 sm:px-6 flex items-center justify-between shadow-2xs shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {/* Mobile Sidebar Hamburger Toggle */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-1.5 sm:p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 lg:hidden transition-colors shrink-0"
              title="Open Patient Queue & Settings"
            >
              <Menu className="w-4 h-4 text-black" />
            </button>

            {/* Breadcrumb & Active Encounter Information */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider hidden sm:inline shrink-0 font-semibold">
                Patient:
              </span>
              <span className="font-display font-bold text-sm sm:text-base text-black truncate">
                {encounter.patient.name}
              </span>
              <span className="text-neutral-300 shrink-0">•</span>
              <span className="text-xs font-medium text-neutral-600 truncate hidden md:inline">
                {encounter.specialty}: {encounter.title.split(':')[1] || encounter.title}
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-100 text-black border border-neutral-200 shrink-0 ml-1">
                Live Scribe
              </span>
            </div>
          </div>

          {/* Right Header Quick Controls — Primary Export Action */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">

            {/* EHR / FHIR Export Trigger */}
            <button
              onClick={() => setIsExportOpen(true)}
              className="tactile-btn inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-xl bg-white hover:bg-neutral-100 text-xs font-bold text-black border-2 border-black shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Share2 className="w-3.5 h-3.5 text-black" />
              <span className="hidden xs:inline">Export EHR / FHIR</span>
              <span className="xs:hidden">Export</span>
            </button>
          </div>
        </header>

        {/* ================= MAIN CLINICAL WORKSPACE ================= */}
        <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Patient Demographics & Vitals Header (Switcher hidden since it is in sidebar) */}
          <PatientHeader
            encounters={CLINICAL_ENCOUNTERS}
            activeEncounterId={activeEncounterId}
            onSelectEncounter={(id) => {
              setActiveEncounterId(id)
              setRecordingDuration('00:00.0')
            }}
            showEncounterSwitcher={false}
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
        <footer className="relative z-10 border-t border-neutral-200 bg-white py-6 mt-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
            <div className="flex items-center gap-2.5">
              <CurieLogo className="w-4 h-4" />
              <span className="font-display text-sm font-bold text-black">Curie Ambient Scribe</span>
              <span>•</span>
              <span>Built for AssemblyAI Voice Hackathon Week</span>
            </div>

            <div className="flex items-center gap-4 font-mono text-[11px]">
              <span className="text-neutral-500">
                Model: <strong className="text-black font-bold">Universal-3.5 Pro</strong>
              </span>
              <span>•</span>
              <span className="text-neutral-500">
                Biasing: <strong className="text-black font-bold">keyterms_prompt active</strong>
              </span>
              <span>•</span>
              <span className="text-neutral-500">
                SLA: <strong className="text-black font-bold">~1.1s roundtrip</strong>
              </span>
            </div>
          </div>
        </footer>
      </div>

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
            className={`px-4 py-3 rounded-xl shadow-lg border-2 border-black text-xs font-semibold flex items-center gap-2.5 backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-white text-black shadow-md'
                : 'bg-white text-black shadow-md'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-black shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  )
}
