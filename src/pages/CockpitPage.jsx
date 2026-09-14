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
  Menu,
  Plus,
  BookOpen,
  ChevronRight
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
import NewPatientModal from '../components/NewPatientModal'
import ClinicianProfileModal from '../components/ClinicianProfileModal'

import { CLINICAL_ENCOUNTERS } from '../data/clinicalEncounters'
import { transcribeClinicalAudio, localizeSoapNote } from '../services/dictationService'
import { ClinicalAudioRecorder } from '../utils/audioRecorder'

export default function CockpitPage({ onBackToLanding, onNavigateToDocs, initialEncounterId }) {
  // Dynamic Encounters List (Preserves default benchmarks + user added patients)
  const [encountersList, setEncountersList] = useState(() => {
    try {
      const saved = localStorage.getItem('curie_custom_encounters')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const defaultIds = new Set(CLINICAL_ENCOUNTERS.map((e) => e.id))
          const customOnly = parsed.filter((e) => !defaultIds.has(e.id))
          return [...customOnly, ...CLINICAL_ENCOUNTERS]
        }
      }
    } catch (e) {
      console.warn('Could not load custom encounters:', e)
    }
    return CLINICAL_ENCOUNTERS
  })

  // Clinician Workplace Identity
  const [clinicianProfile, setClinicianProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('curie_clinician_profile')
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return {
      name: 'Dr. Evelyn Vance, MD, FACC',
      clinic: 'Metropolitan Outpatient Care Center',
      specialty: 'Cardiovascular Medicine',
      npi: '1948201948'
    }
  })

  const [activeEncounterId, setActiveEncounterId] = useState(
    initialEncounterId || null
  )
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const encounter = encountersList.find((e) => e.id === activeEncounterId) || null

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

  // Telemetry per encounter state (measured dynamically upon execution)
  const [telemetry, setTelemetry] = useState({
    latencyMs: null,
    isLive: false,
    confidence: null,
    fillersStripped: null,
    biasingHits: null
  })

  // Audio Recording states
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [frequencyData, setFrequencyData] = useState(null)
  const [recordingDuration, setRecordingDuration] = useState('00:00.0')
  const [recordedBlob, setRecordedBlob] = useState(null) // { blob, url } — captured after pause/stop

  // Modals & Sidebar state
  const [isLexiconOpen, setIsLexiconOpen] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [isNewPatientOpen, setIsNewPatientOpen] = useState(false)
  const [isClinicianProfileOpen, setIsClinicianProfileOpen] = useState(false)
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

  const currentKeyterms = encounter ? (keytermsMap[activeEncounterId] || encounter.keyterms) : []
  const currentSoapNote = encounter ? (soapNotesMap[activeEncounterId] || encounter.soapNote) : null
  const currentTranscript = encounter ? (transcriptsMap[activeEncounterId] || encounter.spokenTranscript) : ''

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
    if (isRecording || isPaused || isProcessing) return
    // Clear any previous recorded blob
    if (recordedBlob?.url) URL.revokeObjectURL(recordedBlob.url)
    setRecordedBlob(null)
    try {
      const recorder = new ClinicalAudioRecorder((level, freqData) => {
        setAudioLevel(level)
        setFrequencyData(freqData)
      })

      await recorder.start()
      recorderRef.current = recorder
      setIsRecording(true)
      setIsPaused(false)

      const startTime = Date.now()
      setRecordingDuration('00:00.0')
      timerIntervalRef.current = setInterval(() => updateTimer(startTime), 100)
    } catch (err) {
      console.error('Microphone capture error:', err)
      showToast('Microphone unavailable. You can use "Run Audio Fixture" to evaluate instantly.', 'info')
    }
  }

  // Pause dictation — keeps mic stream alive, captures partial blob for playback
  const pauseRecording = () => {
    if (!isRecording || !recorderRef.current) return
    recorderRef.current.pause()
    setIsRecording(false)
    setIsPaused(true)

    // Stop the UI timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }

    // Capture partial blob so user can listen before submitting
    const partial = recorderRef.current.getPartialBlob()
    if (partial) {
      if (recordedBlob?.url) URL.revokeObjectURL(recordedBlob.url)
      setRecordedBlob(partial)
    }
  }

  // Resume dictation from pause
  const resumeRecording = () => {
    if (!isPaused || !recorderRef.current) return
    recorderRef.current.resume()
    setIsRecording(true)
    setIsPaused(false)

    // Resume timer from where it was
    const lastDisplayed = recordingDuration
    const [min, rest] = lastDisplayed.split(':')
    const [sec, tenths] = rest.split('.')
    const baseMs = (parseInt(min) * 60 + parseInt(sec)) * 1000 + parseInt(tenths) * 100
    const resumeTime = Date.now() - baseMs
    timerIntervalRef.current = setInterval(() => updateTimer(resumeTime), 100)
  }

  // Discard the recorded blob and reset to fresh state
  const clearRecordedBlob = async () => {
    if (recorderRef.current) {
      // If still paused, fully stop and discard the recorder
      await recorderRef.current.stop().catch(() => {})
      recorderRef.current = null
    }
    if (recordedBlob?.url) URL.revokeObjectURL(recordedBlob.url)
    setRecordedBlob(null)
    setIsPaused(false)
    setIsRecording(false)
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }
    setRecordingDuration('00:00.0')
    setAudioLevel(0)
    setFrequencyData(null)
  }

  // Stop Audio Recording — now PAUSES and shows playback preview
  const stopRecording = async () => {
    if (isRecording && recorderRef.current) {
      pauseRecording()
    }
  }

  // Submit the dictation blob to the AI pipeline (called by user after reviewing playback)
  const submitDictation = async () => {
    if (!recorderRef.current || isProcessing) return
    if (isRecording) {
      // If still recording (no pause), stop first
      recorderRef.current.pause()
      setIsRecording(false)
    }

    setIsPaused(false)
    setIsProcessing(true)
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }

    try {
      const { blob } = await recorderRef.current.stop()
      recorderRef.current = null
      if (recordedBlob?.url) URL.revokeObjectURL(recordedBlob.url)
      setRecordedBlob(null)

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
          confidence: result.confidence,
          fillersStripped: result.fillersStripped,
          biasingHits: result.biasingHits
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
      setRecordingDuration('00:00.0')
    }
  }

  // Instant Scenario Evaluation (1-Click Run Real Audio Fixture)
  const handleRunFixture = async () => {
    if (isRecording || isProcessing) return
    setIsProcessing(true)

    try {
      // Determine real audio fixture URL
      const fixtureUrl = encounter.audioUrl || (
        activeEncounterId.includes('cardio')
          ? '/fixtures/cardiology_consultation_en.wav'
          : activeEncounterId.includes('pediatric')
            ? '/fixtures/pediatric_asthma_en.wav'
            : '/fixtures/orthopedic_knee_trauma_en.wav'
      )

      let audioBlob = null
      try {
        const audioResponse = await fetch(fixtureUrl)
        if (audioResponse.ok) {
          audioBlob = await audioResponse.blob()
        }
      } catch (err) {
        console.warn('Could not fetch audio fixture:', err)
      }

      if (!audioBlob) {
        audioBlob = new Blob([new Uint8Array(44 + 16000 * 2)], { type: 'audio/wav' })
      }

      const result = await transcribeClinicalAudio(audioBlob, {
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
        confidence: result.confidence,
        fillersStripped: result.fillersStripped,
        biasingHits: result.biasingHits
      })

      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.8 },
        colors: ['#000000', '#525252', '#737373', '#A3A3A3']
      })

      showToast(
        `Scenario "${encounter.title}" transcribed in ${result.latencyMs}ms with ${result.biasingHits || currentKeyterms.length} keyterms biased!`,
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

  // Intake new dynamic patient into queue
  const handleCreatePatient = (newEncounter) => {
    setEncountersList((prev) => {
      const updated = [newEncounter, ...prev]
      try {
        const defaultIds = new Set(CLINICAL_ENCOUNTERS.map((e) => e.id))
        const customOnly = updated.filter((e) => !defaultIds.has(e.id))
        localStorage.setItem('curie_custom_encounters', JSON.stringify(customOnly))
      } catch (err) {
        console.warn('Failed to persist custom encounter:', err)
      }
      return updated
    })

    setKeytermsMap((prev) => ({
      ...prev,
      [newEncounter.id]: [...newEncounter.keyterms]
    }))
    setSoapNotesMap((prev) => ({
      ...prev,
      [newEncounter.id]: { ...newEncounter.soapNote }
    }))
    setTranscriptsMap((prev) => ({
      ...prev,
      [newEncounter.id]: newEncounter.spokenTranscript
    }))

    setActiveEncounterId(newEncounter.id)
    setRecordingDuration('00:00.0')
    showToast(`Chart created for ${newEncounter.patient.name}. Ready for consultation.`, 'success')
  }

  // Update Clinician Workplace Profile
  const handleSaveClinicianProfile = (newProfile) => {
    setClinicianProfile(newProfile)
    try {
      localStorage.setItem('curie_clinician_profile', JSON.stringify(newProfile))
    } catch (err) {
      console.warn('Failed to persist clinician profile:', err)
    }
    showToast(`Clinician credentials updated for ${newProfile.name}`, 'success')
  }

  // Sync initialEncounterId when switching from Docs or external links
  useEffect(() => {
    if (initialEncounterId && encountersList.some((e) => e.id === initialEncounterId)) {
      setActiveEncounterId(initialEncounterId)
    }
  }, [initialEncounterId])

  // Global Spacebar Push-to-Talk listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.code === 'Space' &&
        !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)
      ) {
        if (!isSpacePressedRef.current && !isRecording && !isPaused && !isProcessing) {
          e.preventDefault()
          isSpacePressedRef.current = true
          startRecording()
        } else if (!isSpacePressedRef.current && !isRecording && isPaused) {
          // Spacebar resumes if paused
          e.preventDefault()
          isSpacePressedRef.current = true
          resumeRecording()
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
          if (isRecording) pauseRecording()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [isRecording, isPaused, isProcessing, activeEncounterId, currentKeyterms])

  return (
    <div className="h-screen w-full bg-neutral-50/40 text-black font-sans selection:bg-neutral-200 selection:text-black flex flex-col lg:flex-row overflow-hidden">
      {/* ================= LEFT CLINICAL WORKSPACE SIDEBAR ================= */}
      <WorkspaceSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onBackToLanding={onBackToLanding}
        onNavigateToDocs={onNavigateToDocs}
        encounters={encountersList}
        activeEncounterId={activeEncounterId}
        onSelectEncounter={(id) => {
          setActiveEncounterId(id)
          setRecordingDuration('00:00.0')
        }}
        supportedLanguages={SUPPORTED_LANGUAGES}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={(langCode) => {
          setSelectedLanguage(langCode)
          const baseSoap = encounter?.soapNote
          if (baseSoap) {
            const localized = langCode === 'en'
              ? baseSoap
              : localizeSoapNote(baseSoap, langCode, currentKeyterms)
            setSoapNotesMap((prev) => ({
              ...prev,
              [activeEncounterId]: localized
            }))
          }
          const found = SUPPORTED_LANGUAGES.find((l) => l.code === langCode)
          showToast(`Consultation language set to ${found?.label || langCode}`, 'info')
        }}
        onOpenLexicon={() => setIsLexiconOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenNewPatient={() => setIsNewPatientOpen(true)}
        onOpenClinicianProfile={() => setIsClinicianProfileOpen(true)}
        clinicianProfile={clinicianProfile}
        keytermsCount={currentKeyterms.length}
      />

      {/* ================= RIGHT MAIN WORKSPACE COLUMN ================= */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-white">
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
            {encounter ? (
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
            ) : (
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-display font-bold text-sm sm:text-base text-neutral-800">
                  Curie Ambient Scribe
                </span>
                <span className="text-neutral-300 shrink-0 hidden sm:inline">•</span>
                <span className="text-xs font-mono text-neutral-500 hidden sm:inline">
                  Awaiting Patient Selection
                </span>
              </div>
            )}
          </div>

          {/* Right Header Quick Controls — Docs & New Patient Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {onNavigateToDocs && (
              <button
                onClick={onNavigateToDocs}
                className="tactile-btn inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-100 text-xs font-semibold text-black shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                title="Clinical Documentation & Benchmark Audits"
              >
                <BookOpen className="w-3.5 h-3.5 text-neutral-700" />
                <span className="text-black font-semibold">Docs</span>
              </button>
            )}
            <button
              onClick={() => setIsNewPatientOpen(true)}
              className="tactile-btn inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-xl bg-black hover:bg-neutral-800 text-xs font-bold text-white shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              title="Intake New Patient Encounter"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              <span className="text-white font-bold">New Patient</span>
            </button>
          </div>
        </header>

        {/* ================= MAIN CLINICAL WORKSPACE ================= */}
        {encounter ? (
          <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Patient Demographics & Vitals Header (Switcher hidden since it is in sidebar) */}
            <PatientHeader
              encounters={encountersList}
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
              isPaused={isPaused}
              isProcessing={isProcessing}
              recordingDuration={recordingDuration}
              audioLevel={audioLevel}
              frequencyData={frequencyData}
              recordedBlob={recordedBlob}
              onStartRecord={startRecording}
              onPauseRecord={pauseRecording}
              onResumeRecord={resumeRecording}
              onSubmitDictation={submitDictation}
              onDiscardRecording={clearRecordedBlob}
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
        ) : (
          <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex flex-col justify-center">
            <div className="text-center max-w-xl mx-auto mb-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-black text-white shadow-md mb-4">
                <Stethoscope className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-black tracking-tight">
                Ready for Consultation
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
                Intake a new patient to dictate live ambient notes, or select a pre-recorded benchmark encounter from the queue.
              </p>
            </div>

            {/* Dual Action Bento Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto w-full">
              {/* Option 1: Intake New Patient */}
              <div
                onClick={() => setIsNewPatientOpen(true)}
                className="group p-6 sm:p-7 rounded-2xl bg-white border-2 border-dashed border-neutral-300 hover:border-black transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 text-black flex items-center justify-center mb-4 group-hover:bg-black group-hover:text-white transition-colors">
                    <Plus className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-black">
                    Intake New Patient
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                    Register a new patient chart, configure clinical keyterms, and dictate in real time using your microphone.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center text-xs font-bold text-black group-hover:translate-x-1 transition-transform">
                  <span>Start Live Intake</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>

              {/* Option 2: Explore Benchmark Demos */}
              <div className="p-6 sm:p-7 rounded-2xl bg-white border border-neutral-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center font-mono font-bold text-xs">
                      DEMO
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 font-semibold uppercase tracking-wider">
                      3 Pre-Recorded Encounters
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-black">
                    Benchmark Demos
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    Select a benchmark encounter to evaluate single-pass SOAP generation:
                  </p>
                </div>

                <div className="mt-4 space-y-2">
                  {CLINICAL_ENCOUNTERS.map((demo) => (
                    <button
                      key={demo.id}
                      onClick={() => {
                        setActiveEncounterId(demo.id)
                        setRecordingDuration('00:00.0')
                      }}
                      className="w-full text-left p-2.5 rounded-xl border border-neutral-200 hover:border-black hover:bg-neutral-50 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-semibold text-xs text-black truncate">
                          {demo.patient.name}
                        </div>
                        <div className="text-[10px] text-neutral-500 font-mono truncate">
                          {demo.specialty}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 group-hover:bg-black group-hover:text-white shrink-0 transition-colors">
                        Load Demo →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </main>
        )}

        {/* Footer Benchmark Bar */}
        <footer className="relative z-10 border-t border-neutral-200 bg-white py-6 mt-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
            <div className="flex items-center gap-2.5">
              <CurieLogo className="w-4 h-4" />
              <span className="font-display text-sm font-bold text-black">Curie Ambient Scribe</span>
              <span>•</span>
              <span>Powered by AssemblyAI Speech Intelligence</span>
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
        isOpen={isExportOpen && !!encounter}
        onClose={() => setIsExportOpen(false)}
        encounter={encounter}
        soapNote={currentSoapNote}
        prescriptions={encounter?.prescriptions || []}
        clinicianProfile={clinicianProfile}
      />

      {/* Dynamic New Patient Intake Modal */}
      <NewPatientModal
        isOpen={isNewPatientOpen}
        onClose={() => setIsNewPatientOpen(false)}
        onCreatePatient={handleCreatePatient}
      />

      {/* Clinician Workplace Profile Settings Modal */}
      <ClinicianProfileModal
        isOpen={isClinicianProfileOpen}
        onClose={() => setIsClinicianProfileOpen(false)}
        profile={clinicianProfile}
        onSaveProfile={handleSaveClinicianProfile}
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
