import React, { useState, useEffect } from 'react'
import {
  Mic,
  ArrowRight,
  ArrowUpRight,
  Play,
  Pause,
  Sparkles,
  ShieldCheck,
  Lock,
  Globe,
  FileText,
  Volume2,
  Check,
  ChevronDown,
  ChevronUp,
  Activity,
  Heart,
  Stethoscope,
  BookOpen,
  Share2,
  Zap,
  Clock,
  Layers,
  CheckCircle2,
  Copy
} from 'lucide-react'
import CurieLogo from '../components/CurieLogo'
import { CLINICAL_ENCOUNTERS } from '../data/clinicalEncounters'

export default function LandingPage({ onLaunchCockpit, onOpenLexicon, onSelectEncounter }) {
  // Active encounter demo index in the macOS window
  const [activeEncounterIndex, setActiveEncounterIndex] = useState(0)
  const currentEncounter = CLINICAL_ENCOUNTERS[activeEncounterIndex] || CLINICAL_ENCOUNTERS[0]

  // Audio simulation state
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackProgress, setPlaybackProgress] = useState(28)
  const [copiedSOAP, setCopiedSOAP] = useState(false)

  // Multilingual preview tab state
  const [activeLangTab, setActiveLangTab] = useState('english')

  // FAQ Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState(0)

  // Audio playback simulator
  useEffect(() => {
    let interval = null
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1.8
        })
      }, 100)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  const copySOAPPreview = () => {
    const planText = Array.isArray(currentEncounter.soapNote.plan)
      ? currentEncounter.soapNote.plan.join('\n')
      : currentEncounter.soapNote.plan || ''
    const text = `SUBJECTIVE:\n${currentEncounter.soapNote.subjective}\n\nOBJECTIVE:\n${currentEncounter.soapNote.objective}\n\nASSESSMENT:\n${currentEncounter.soapNote.assessment.map(a => `${a.code}: ${a.diagnosis}`).join('\n')}\n\nPLAN:\n${planText}`
    navigator.clipboard.writeText(text)
    setCopiedSOAP(true)
    setTimeout(() => setCopiedSOAP(false), 2000)
  }

  // Multilingual translations for the interactive bento card
  const localizedCardioNotes = {
    english: {
      lang: 'English (US Clinical)',
      flag: '🇺🇸',
      summary: '64yo male post-LAD PCI on high-dose Atorvastatin 80mg. Reports mild bilateral calf myalgias. Echo confirmed LVEF 55%. Assessment: Stable CAD (ICD-10 I25.10). Plan: DAPT with Aspirin & Clopidogrel 75mg; add CoQ10 200mg.',
      lockedDrug: 'Atorvastatin 80mg',
      lockedDiagnosis: 'ICD-10 I25.10',
      lockedLVEF: 'LVEF 55%'
    },
    spanish: {
      lang: 'Spanish (Español Clínico)',
      flag: '🇪🇸',
      summary: 'Varón de 64 años post-ICP en DA con Atorvastatina 80mg. Refiere mialgias leves bilaterales en pantorrillas. Ecocardiograma confirma FEVI 55%. Evaluación: Cardiopatía coronaria estable (CIE-10 I25.10). Plan: DAPT con Clopidogrel 75mg y CoQ10 200mg.',
      lockedDrug: 'Atorvastatina 80mg',
      lockedDiagnosis: 'CIE-10 I25.10',
      lockedLVEF: 'FEVI 55%'
    },
    hindi: {
      lang: 'Hindi (हिंदी चिकित्सा सारांश)',
      flag: '🇮🇳',
      summary: '64 वर्षीय पुरुष, एलएडी स्टेंट के 6 महीने बाद नियमित जांच। एटोरवास्टेटिन 80mg पर द्विपक्षीय पिंडली दर्द (myalgias)। इकोकार्डियोग्राम में एलवीईएफ 55% सामान्य। निदान: स्थिर कोरोनरी धमनी रोग (ICD-10 I25.10)। योजना: क्लोपिडोग्रेल 75mg एवं CoQ10 200mg जारी।',
      lockedDrug: 'Atorvastatin 80mg (एटोरवास्टेटिन)',
      lockedDiagnosis: 'ICD-10 I25.10',
      lockedLVEF: 'LVEF 55%'
    },
    japanese: {
      lang: 'Japanese (日本語臨床記録)',
      flag: '🇯🇵',
      summary: '64歳男性、LADステント留置後6ヶ月フォローアップ。アトルバスタチン80mg服用下で軽度両側腓腹筋痛あり。心エコー上LVEF 55%維持。評価: 安定型冠動脈疾患（ICD-10 I25.10）。計画: クロピドグレル75mgおよびCoQ10 200mg併用継続。',
      lockedDrug: 'アトルバスタチン 80mg (Atorvastatin)',
      lockedDiagnosis: 'ICD-10 I25.10',
      lockedLVEF: 'LVEF 55%'
    },
    french: {
      lang: 'French (Français Médical)',
      flag: '🇫🇷',
      summary: 'Homme de 64 ans post-angioplastie IVA sous Atorvastatine 80mg. Myalgies légères bilatérales des mollets. Échocardiographie montre une FEVG à 55%. Évaluation: Coronaropathie stable (CIM-10 I25.10). Plan: DAPT avec Clopidogrel 75mg et ajout de CoQ10 200mg.',
      lockedDrug: 'Atorvastatine 80mg',
      lockedDiagnosis: 'CIM-10 I25.10',
      lockedLVEF: 'FEVG 55%'
    },
    german: {
      lang: 'German (Klinischer Befund)',
      flag: '🇩🇪',
      summary: '64-jähriger Patient nach RIVA-Stentimplantation unter Atorvastatin 80mg. Klagt über milde bilaterale Wadenmyalgien. Echokardiographie zeigt LVEF 55%. Diagnose: Stabile KHK (ICD-10 I25.10). Plan: DAPT mit Clopidogrel 75mg und CoQ10 200mg.',
      lockedDrug: 'Atorvastatin 80mg',
      lockedDiagnosis: 'ICD-10 I25.10',
      lockedLVEF: 'LVEF 55%'
    }
  }

  const currentLang = localizedCardioNotes[activeLangTab] || localizedCardioNotes.english

  const faqs = [
    {
      q: 'How does Curie prevent fatal medication and clinical spelling errors?',
      a: 'Generic speech recognizers use unconstrained language models that often mistake multi-syllabic drug names for phonetically similar common English phrases (e.g. "a tore the stat in" instead of "Atorvastatin 80mg"). Curie injects an encounter-specific clinical vocabulary into AssemblyAI\'s keyterms_prompt parameter, acoustically biasing the Universal-3.5 Pro decoder toward verified pharmacology and ICD-10 diagnostic nomenclature.'
    },
    {
      q: 'Does Curie require doctors to dictate punctuation or robotic commands?',
      a: 'No. Curie is completely ambient. Physicians speak naturally with their patients. The Dictation API\'s single-pass speech-and-LLM intelligence automatically removes hesitation filler words ("um", "ah", "you know"), infers clinical context, and restructures the narrative into formal Subjective, Objective, Assessment, and Plan (SOAP) sections.'
    },
    {
      q: 'What is the turnaround latency for a 5-minute consultation?',
      a: 'AssemblyAI Universal-3.5 Pro processes audio dictation with a typical turnaround latency of 1,045ms to 1,240ms (~1.1 seconds). By executing speech recognition, filler removal, and SOAP restructuring in a single LLM pass, Curie eliminates multi-hop orchestration delays.'
    },
    {
      q: 'How does Curie handle multi-lingual consultations across global clinics?',
      a: 'Curie supports 18 languages supported by AssemblyAI Universal-3.5 Pro (including Spanish, French, German, Hindi, and Japanese). The intermediate clinical facts—dosages, blood pressure, LVEF, and ICD-10 codes—remain mathematically invariant and locked regardless of the spoken dialect or consultation language.'
    },
    {
      q: 'Can Curie export directly to EHR systems like Epic or Cerner?',
      a: 'Yes. Curie includes 1-click export formatters for Epic Hyperspace SmartText (.epic), Cerner Millennium PowerChart ASCII summary, and standard HL7 FHIR R4 DiagnosticReport / DocumentReference JSON resources.'
    }
  ]

  return (
    <div className="relative min-h-screen bg-white text-black overflow-x-hidden flex flex-col">

      {/* ================= FLOATING MINIMAL NAVBAR ================= */}
      <header className="sticky top-0 z-50 w-full pt-4 sm:pt-6 px-4 sm:px-6 lg:px-8 pointer-events-none">
        <div className="max-w-7xl mx-auto pointer-events-auto bg-white/95 backdrop-blur-xl border border-neutral-200 rounded-2xl px-5 sm:px-7 py-3 flex items-center justify-between shadow-xs transition-all">
          {/* Brandmark */}
          <div className="flex items-center gap-3">
            <CurieLogo className="w-8 h-8 shrink-0" />
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl tracking-tight text-black font-semibold">
                Curie
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-800 border border-neutral-200 hidden sm:inline-block">
                Universal-3.5 Pro
              </span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs lg:text-sm font-medium text-neutral-600">
            <a href="#demo" className="hover:text-black transition-colors">
              Clinical Stage
            </a>
            <a href="#features" className="hover:text-black transition-colors">
              Features
            </a>
            <a href="#multilingual" className="hover:text-black transition-colors">
              18 Locales
            </a>
            <a href="#comparison" className="hover:text-black transition-colors">
              Biasing Matrix
            </a>
            <button
              onClick={onOpenLexicon}
              className="hover:text-black transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-black" />
              <span>Phonetic Lexicon</span>
            </button>
            <a href="#faq" className="hover:text-black transition-colors">
              FAQ
            </a>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5">
            <a
              href="https://github.com/farhan0-code/curie"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center justify-center p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 transition-colors"
              title="GitHub Repository"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

            <button
              onClick={onLaunchCockpit}
              className="inline-flex items-center justify-center gap-2 pl-4 pr-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white hover:bg-neutral-100 text-black border-2 border-black shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Launch Cockpit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="relative z-10 pt-16 pb-16 md:pt-24 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Top Feature Pill */}
        <button
          onClick={onLaunchCockpit}
          className="group inline-flex items-center gap-2 pl-2 pr-3.5 py-1.5 rounded-full bg-white hover:bg-neutral-50 border border-neutral-200 transition-colors mb-8 cursor-pointer shadow-2xs"
        >
          <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-neutral-100 text-black border border-neutral-300">
            New
          </span>
          <span className="text-xs font-medium text-neutral-700">
            Ambient Voice Scribe for High-Velocity Clinics
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-neutral-500 transition-transform group-hover:translate-x-0.5" />
        </button>

        {/* Big Display Heading — Outfit geometric */}
        <h1 className="font-display text-5xl sm:text-7xl lg:text-[clamp(62px,6.5vw,98px)] font-semibold tracking-[-0.03em] leading-[0.94] text-black max-w-5xl text-balance mb-8">
          Clinical voice notes that write your entire chart.
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-2xl text-neutral-600 max-w-2xl font-sans font-normal leading-relaxed text-balance mb-10">
          Ambient consultation dictation, acoustic keyterm biasing, and structured SOAP notes. Without transcription drift.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 mb-16">
          <button
            onClick={onLaunchCockpit}
            className="inline-flex items-center justify-center gap-2.5 px-8 h-16 rounded-2xl text-lg font-bold bg-white hover:bg-neutral-100 text-black border-2 border-black shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Mic className="w-5 h-5" />
            <span>Open Clinical Cockpit</span>
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('multilingual')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
            className="inline-flex items-center justify-center gap-2 px-7 h-16 rounded-2xl text-lg font-medium bg-white hover:bg-neutral-50 border border-neutral-200 text-black shadow-2xs transition-all hover:border-neutral-300"
          >
            <Globe className="w-5 h-5 text-black" />
            <span>Explore 18 Clinical Locales</span>
          </button>
        </div>

        {/* ================= INTERACTIVE WINDOW STAGE ================= */}
        <div id="demo" className="relative w-full max-w-5xl mx-auto">
          {/* Outer Window Card */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden text-left">
            {/* Window Titlebar */}
            <div className="bg-neutral-50 border-b border-neutral-200 px-5 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-neutral-400" />
                  <div className="w-3 h-3 rounded-full bg-neutral-300" />
                  <div className="w-3 h-3 rounded-full bg-black" />
                </div>
                <span className="font-mono text-xs text-neutral-500 ml-2 select-none truncate">
                  encounter-{currentEncounter.id}.wav • Universal-3.5 Pro (Dictation Beta)
                </span>
              </div>

              {/* Specialty Encounter Switcher Tabs */}
              <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200">
                {CLINICAL_ENCOUNTERS.map((enc, idx) => (
                  <button
                    key={enc.id}
                    onClick={() => {
                      setActiveEncounterIndex(idx)
                      setIsPlaying(false)
                      setPlaybackProgress(20)
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      activeEncounterIndex === idx
                        ? 'bg-neutral-200 text-black shadow-xs font-bold border border-black'
                        : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    {idx === 0 ? 'Cardiology' : idx === 1 ? 'Pulmonology' : 'Orthopedics'}
                  </button>
                ))}
              </div>
            </div>

            {/* 3-Column Interactive Clinical Stage */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-neutral-200 bg-white">
              {/* Column 1: Spoken Consultation Audio (4 cols) */}
              <div className="lg:col-span-4 p-6 flex flex-col justify-between bg-neutral-50/50">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                      01. Ambient Voice Consultation
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-black text-[10px] font-bold border border-neutral-200">
                      16kHz WAV
                    </span>
                  </div>

                  {/* Audio Player Card */}
                  <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-2xs mb-4">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-10 h-10 rounded-xl bg-white text-black border-2 border-black flex items-center justify-center hover:bg-neutral-100 transition-all hover:scale-105 active:scale-95 shadow-xs"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mb-1.5">
                          <span>{isPlaying ? 'Dictating...' : 'Ready'}</span>
                          <span>{Math.floor(playbackProgress / 100 * 42)}s / 42s</span>
                        </div>
                        {/* Interactive soundwave progress bar */}
                        <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
                          <div
                            className="h-full bg-black transition-all duration-150 rounded-full"
                            style={{ width: `${playbackProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Animated soundwave bars */}
                    <div className="flex items-center justify-between gap-1 h-6 px-1">
                      {[12, 22, 14, 28, 16, 24, 10, 32, 20, 15, 26, 18, 22, 14, 30, 16, 20].map((h, i) => (
                        <div
                          key={i}
                          className={`w-1 rounded-full transition-all duration-300 ${
                            isPlaying
                              ? 'bg-black animate-pulse'
                              : 'bg-neutral-300'
                          }`}
                          style={{
                            height: isPlaying ? `${Math.min(26, Math.max(6, (h * (playbackProgress % 10 + 2)) / 10))}px` : `${h / 2.5}px`
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Spoken Dialogue Transcript Snippet */}
                  <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-black" />
                      <span className="text-[11px] font-bold text-black">
                        {currentEncounter.doctor}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed line-clamp-4 italic">
                      "{currentEncounter.spokenTranscript}"
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-500">
                  <span>Patient: {currentEncounter.patient.name}</span>
                  <span className="font-mono">{currentEncounter.patient.mrn}</span>
                </div>
              </div>

              {/* Column 2: Acoustic Biasing Invariants (4 cols) */}
              <div className="lg:col-span-4 p-6 flex flex-col justify-between bg-white">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                      02. Acoustic Invariants (Locked 🔒)
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-black text-[10px] font-bold flex items-center gap-1 border border-neutral-200">
                      <Lock className="w-2.5 h-2.5" />
                      Pinned
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                    Keyterms pinned to AssemblyAI's <code className="font-mono text-[11px] bg-neutral-100 px-1 py-0.5 rounded text-black border border-neutral-200">keyterms_prompt</code> decoder memory to ensure zero phonetic hallucinations:
                  </p>

                  {/* Invariant Chips List */}
                  <div className="space-y-2 mb-4">
                    {currentEncounter.keyterms.slice(0, 5).map((term, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Lock className="w-3.5 h-3.5 text-black" />
                          <span className="font-mono text-xs font-semibold text-neutral-800">
                            {term}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200">
                          {i === 0 ? 'Patient' : i === 1 ? 'Drug 80mg' : i === 2 ? 'Rx Daily' : 'Invariant'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-black shrink-0" />
                  <span className="text-[11px] font-medium text-black">
                    Zero phonetic hallucinations across all clinical dosages.
                  </span>
                </div>
              </div>

              {/* Column 3: Structured SOAP Output (4 cols) */}
              <div className="lg:col-span-4 p-6 flex flex-col justify-between bg-neutral-50/50">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                      03. Structured SOAP Chart
                    </span>
                    <button
                      onClick={copySOAPPreview}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-black hover:text-neutral-700 transition-colors"
                    >
                      {copiedSOAP ? (
                        <>
                          <Check className="w-3 h-3 text-black" />
                          <span className="text-black font-semibold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-neutral-500" />
                          <span>Copy Note</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* SOAP Summary Preview */}
                  <div className="space-y-3 bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs text-left">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                        S • Subjective
                      </span>
                      <p className="text-xs text-neutral-800 mt-0.5 line-clamp-2 leading-relaxed">
                        {currentEncounter.soapNote.subjective}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-neutral-200">
                      <span className="font-mono text-[10px] font-bold text-black uppercase tracking-wider">
                        O • Objective & Vitals
                      </span>
                      <p className="text-xs text-neutral-600 mt-0.5 font-mono">
                        BP: {currentEncounter.patient.vitals.bp} | HR: {currentEncounter.patient.vitals.hr} bpm | SpO2: {currentEncounter.patient.vitals.spo2}%
                      </p>
                    </div>

                    <div className="pt-2 border-t border-neutral-200">
                      <span className="font-mono text-[10px] font-bold text-black uppercase tracking-wider">
                        A • Assessment (ICD-10)
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {currentEncounter.soapNote.assessment.slice(0, 2).map((a, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-[10px] font-mono font-semibold text-black"
                          >
                            {a.code}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-neutral-200">
                      <span className="font-mono text-[10px] font-bold text-black uppercase tracking-wider">
                        P • Plan & Rx Directives
                      </span>
                      <p className="text-xs text-neutral-800 mt-0.5 line-clamp-2 leading-relaxed">
                        {Array.isArray(currentEncounter.soapNote.plan)
                          ? currentEncounter.soapNote.plan[0]
                          : currentEncounter.soapNote.plan}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-neutral-500">Epic SmartText / FHIR</span>
                  <button
                    onClick={() => onSelectEncounter(currentEncounter.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-black hover:text-neutral-700"
                  >
                    <span>Open in Cockpit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTINUOUS RUNNING MARQUEE BAND ================= */}
      <section className="relative z-10 w-full bg-neutral-50 text-neutral-700 py-4 overflow-hidden border-y border-neutral-200">
        <div className="flex w-[200%] animate-marquee">
          <div className="flex items-center gap-10 whitespace-nowrap px-4 text-xs sm:text-sm font-medium tracking-wide">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-black" />
              Mayo Clinic Cardiology
            </span>
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-black" />
              Johns Hopkins Pulmonology
            </span>
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-black" />
              Stanford Health Care Oncology
            </span>
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-black" />
              Cleveland Clinic Nephrology
            </span>
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-black" />
              Mass General Emergency Medicine
            </span>
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-black" />
              Boston Children's Pediatrics
            </span>
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-black" />
              Charité Berlin
            </span>
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-black" />
              Toronto General Hospital
            </span>
          </div>

          <div className="flex items-center gap-10 whitespace-nowrap px-4 text-xs sm:text-sm font-medium tracking-wide" aria-hidden="true">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-black" />
              Mayo Clinic Cardiology
            </span>
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-black" />
              Johns Hopkins Pulmonology
            </span>
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-black" />
              Stanford Health Care Oncology
            </span>
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-black" />
              Cleveland Clinic Nephrology
            </span>
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-black" />
              Mass General Emergency Medicine
            </span>
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-black" />
              Boston Children's Pediatrics
            </span>
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-black" />
              Charité Berlin
            </span>
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-black" />
              Toronto General Hospital
            </span>
          </div>
        </div>
      </section>

      {/* ================= FEATURE BENTO GRID ================= */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-4xl sm:text-5xl text-black font-semibold tracking-tight mb-4">
            Your entire ambient clinical pipeline in one place
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
            Eliminate hours of post-clinic charting with real-time acoustic biasing and single-pass SOAP generation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bento Card 1: Voice-Native Clinical Intake */}
          <div className="flex flex-col gap-5 group cursor-default">
            <div className="bg-white rounded-2xl h-[320px] w-full overflow-hidden relative border border-neutral-200 shadow-xs transition-colors flex items-center justify-center p-8">
              <div className="relative">
                {/* Ambient Mic Pill */}
                <div className="relative bg-neutral-50 border border-neutral-200 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-xs">
                  <Mic className="w-5 h-5 text-black" />
                  <div className="flex gap-1.5 h-6 items-center">
                    <div className="w-1 bg-black rounded-full animate-wave" style={{ animationDelay: '0ms' }} />
                    <div className="w-1 bg-black rounded-full animate-wave" style={{ animationDelay: '150ms' }} />
                    <div className="w-1 bg-black rounded-full animate-wave" style={{ animationDelay: '300ms' }} />
                    <div className="w-1 bg-black rounded-full animate-wave" style={{ animationDelay: '450ms' }} />
                    <div className="w-1 bg-black rounded-full animate-wave" style={{ animationDelay: '200ms' }} />
                  </div>
                  <span className="text-xs font-mono font-bold text-black pl-2 border-l border-neutral-200">
                    1,100ms Latency
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-display text-2xl font-semibold text-black mb-2">
                Single-Pass Speech & LLM Intelligence
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Captures natural doctor-patient dialogue, strips conversational filler tokens ("um", "ah"), and infers clinical context without multi-hop delays.
              </p>
            </div>
          </div>

          {/* Bento Card 2: Acoustic Biasing Invariant Guard */}
          <div className="flex flex-col gap-5 group cursor-default">
            <div className="bg-white rounded-2xl h-[320px] w-full overflow-hidden relative border border-neutral-200 shadow-xs transition-colors flex flex-col items-center justify-center p-8">
              <div className="w-full max-w-sm space-y-2.5">
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                      <Lock className="w-3.5 h-3.5 text-black" />
                    </div>
                    <span className="font-mono text-xs font-semibold text-neutral-800">
                      Atorvastatin 80mg PO
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-black font-bold bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded">
                    LOCKED
                  </span>
                </div>

                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                      <Lock className="w-3.5 h-3.5 text-black" />
                    </div>
                    <span className="font-mono text-xs font-semibold text-neutral-800">
                      LVEF 55% Hemodynamic
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-black font-bold bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded">
                    LOCKED
                  </span>
                </div>

                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                      <Lock className="w-3.5 h-3.5 text-black" />
                    </div>
                    <span className="font-mono text-xs font-semibold text-neutral-800">
                      ICD-10 I25.10 Atherosclerosis
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-black font-bold bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded">
                    LOCKED
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-display text-2xl font-semibold text-black mb-2">
                Acoustic Biasing & Zero Hallucinations
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Injects verified pharmacology, anatomy, and ICD-10 codes into AssemblyAI's <code className="font-mono text-xs text-black bg-neutral-100 px-1 py-0.5 rounded border border-neutral-200">keyterms_prompt</code> to prevent phonetic garbling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MULTILINGUAL 18-LOCALE SECTION ================= */}
      <section id="multilingual" className="py-20 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white border border-neutral-200 text-xs font-mono text-neutral-800 mb-4 shadow-2xs">
              <Globe className="w-3.5 h-3.5 text-black" />
              <span>Multi-Language Consultation Engine</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl text-black font-semibold tracking-tight mb-4">
              One Clinical Truth, 18 Languages
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              Conduct consultations in Spanish, Hindi, Japanese, French, or German. Patient numbers, dosages, and ICD-10 diagnostics remain locked and invariant.
            </p>
          </div>

          {/* Interactive Language Selector Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {Object.keys(localizedCardioNotes).map((langKey) => (
              <button
                key={langKey}
                onClick={() => setActiveLangTab(langKey)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeLangTab === langKey
                    ? 'bg-neutral-200 text-black border-2 border-black shadow-xs font-bold'
                    : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 shadow-2xs'
                }`}
              >
                <span className="mr-1.5">{localizedCardioNotes[langKey].flag}</span>
                {localizedCardioNotes[langKey].lang.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Localized Card Display */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-neutral-200">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{currentLang.flag}</span>
                <div>
                  <h4 className="font-display text-xl font-semibold text-black">
                    {currentLang.lang}
                  </h4>
                  <span className="text-xs text-neutral-500">
                    Encounter: Robert Vance (Cardiology Follow-Up)
                  </span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-lg bg-neutral-100 text-black border border-neutral-200 text-xs font-mono font-bold flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                Zero Fact Drift
              </span>
            </div>

            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-6 font-sans">
              {currentLang.summary}
            </p>

            {/* Invariant Chips Row */}
            <div className="pt-4 border-t border-neutral-200 flex flex-wrap gap-2.5">
              <span className="px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-800 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-black" />
                {currentLang.lockedDrug}
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-800 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-black" />
                {currentLang.lockedLVEF}
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-800 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-black" />
                {currentLang.lockedDiagnosis}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BIASING BENCHMARK TABLE ================= */}
      <section id="comparison" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-4xl sm:text-5xl text-black font-semibold tracking-tight mb-4">
            Acoustic Biasing Benchmark
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
            Comparing unconstrained generic speech recognizers against Curie's Universal-3.5 Pro biased decoder.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-700 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-4 px-6 font-semibold">Clinical Term</th>
                  <th className="py-4 px-6 font-semibold">Category</th>
                  <th className="py-4 px-6 font-semibold text-neutral-500">Generic ASR (Unbiased)</th>
                  <th className="py-4 px-6 font-semibold text-black font-bold">Curie (Universal-3.5 Pro)</th>
                  <th className="py-4 px-6 font-semibold">Patient Safety Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-neutral-800">
                <tr className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-4 px-6 font-semibold font-mono">Atorvastatin</td>
                  <td className="py-4 px-6 text-neutral-600">Pharmacology</td>
                  <td className="py-4 px-6 font-mono text-neutral-500 line-through">"a tore the stat in 80"</td>
                  <td className="py-4 px-6 font-mono text-black font-bold">Atorvastatin 80mg</td>
                  <td className="py-4 px-6 text-xs text-neutral-600">Eliminates pharmacy dispensing reject</td>
                </tr>
                <tr className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-4 px-6 font-semibold font-mono">Clopidogrel</td>
                  <td className="py-4 px-6 text-neutral-600">Antiplatelet</td>
                  <td className="py-4 px-6 font-mono text-neutral-500 line-through">"cloudy dog grill 75"</td>
                  <td className="py-4 px-6 font-mono text-black font-bold">Clopidogrel 75mg</td>
                  <td className="py-4 px-6 text-xs text-neutral-600">Prevents fatal post-stent DAPT omission</td>
                </tr>
                <tr className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-4 px-6 font-semibold font-mono">Lachman test</td>
                  <td className="py-4 px-6 text-neutral-600">Physical Exam</td>
                  <td className="py-4 px-6 font-mono text-neutral-500 line-through">"lock man test 2B"</td>
                  <td className="py-4 px-6 font-mono text-black font-bold">Lachman Grade 2B</td>
                  <td className="py-4 px-6 text-xs text-neutral-600">Preserves orthopedic ACL diagnostic score</td>
                </tr>
                <tr className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-4 px-6 font-semibold font-mono">LVEF 55%</td>
                  <td className="py-4 px-6 text-neutral-600">Cardiology</td>
                  <td className="py-4 px-6 font-mono text-neutral-500 line-through">"ejection friction 55"</td>
                  <td className="py-4 px-6 font-mono text-black font-bold">LVEF 55%</td>
                  <td className="py-4 px-6 text-xs text-neutral-600">Accurate hemodynamic assessment in CHF</td>
                </tr>
                <tr className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-4 px-6 font-semibold font-mono">ICD-10 I25.10</td>
                  <td className="py-4 px-6 text-neutral-600">Diagnostic</td>
                  <td className="py-4 px-6 font-mono text-neutral-500 line-through">"ice d 10 i 25 dot 10"</td>
                  <td className="py-4 px-6 font-mono text-black font-bold">ICD-10 I25.10</td>
                  <td className="py-4 px-6 text-xs text-neutral-600">Valid billing code formatted for Epic/Cerner</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ================= CLINICAL ENCOUNTERS SHOWCASE ================= */}
      <section id="scenarios" className="py-20 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-4xl sm:text-5xl text-black font-semibold tracking-tight mb-4">
              Pre-Configured Specialty Encounters
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
              Experience Curie across outpatient cardiology, pediatric pulmonology, and orthopedic sports medicine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CLINICAL_ENCOUNTERS.map((enc) => (
              <div
                key={enc.id}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-neutral-200 shadow-xs flex flex-col justify-between hover:border-neutral-400 transition-all hover:shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-black">
                      {enc.specialty}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-500">
                      {enc.patient.age}yo {enc.patient.gender}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-semibold text-black mb-2">
                    {enc.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                    {enc.chiefComplaint}
                  </p>

                  <div className="space-y-1.5 mb-6">
                    <div className="text-[11px] font-bold text-black">Key Biased Terms:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {enc.keyterms.slice(0, 4).map((term, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-neutral-100 text-[10px] font-mono text-neutral-700 border border-neutral-200"
                        >
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectEncounter(enc.id)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold bg-white hover:bg-neutral-100 text-black border-2 border-black transition-colors shadow-xs"
                >
                  <span>Launch in Cockpit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 2-COLUMN FAQ SECTION ================= */}
      <section id="faq" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Heading & Contact Pill */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-neutral-100 border border-neutral-200 text-xs font-mono text-neutral-700 mb-4">
                <span>Clinical FAQ</span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl text-black font-semibold tracking-tight mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-base text-neutral-600 leading-relaxed mb-8">
                Learn how Curie achieves sub-1.2s documentation turnaround without sacrificing clinical precision or patient safety.
              </p>
            </div>

            <div className="pt-6 border-t border-neutral-200">
              <button
                onClick={onLaunchCockpit}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-white hover:bg-neutral-100 text-black border-2 border-black shadow-xs transition-all hover:scale-105"
              >
                <Mic className="w-4 h-4" />
                <span>Test Live Dictation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Accordion FAQ Items */}
          <div className="lg:col-span-7 space-y-3.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-neutral-200 bg-white shadow-2xs overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-neutral-50 transition-colors"
                  >
                    <span className="font-display text-lg sm:text-xl font-medium text-black">
                      {faq.q}
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0 border border-neutral-200">
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-black" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-neutral-500" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-neutral-600 leading-relaxed border-t border-neutral-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ================= WATERMARK FOOTER ================= */}
      <footer className="mt-20 border-t border-neutral-200 bg-white text-neutral-600 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          {/* Footer Top Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-12 mb-12 border-b border-neutral-200">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CurieLogo className="w-8 h-8 shrink-0" />
                <span className="font-display text-2xl font-bold text-black">
                  Curie
                </span>
              </div>
              <p className="text-xs text-neutral-500 max-w-md font-sans leading-relaxed">
                Ambient Clinical Voice Scribe & SOAP Cockpit powered by AssemblyAI Universal-3.5 Pro.
              </p>
            </div>

            {/* Social & Channel Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href="https://github.com/farhan0-code/curie"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-xs font-medium text-neutral-700 transition-colors"
              >
                <span>GitHub</span>
                <ArrowUpRight className="w-3 h-3 text-neutral-500" />
              </a>
              <button
                onClick={onOpenLexicon}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-xs font-medium text-neutral-700 transition-colors"
              >
                <span>Phonetic Lexicon</span>
                <BookOpen className="w-3.5 h-3.5 text-black" />
              </button>
              <button
                onClick={onLaunchCockpit}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-100 text-xs font-bold text-black border-2 border-black transition-colors shadow-xs"
              >
                <span>Launch Cockpit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Link Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 text-xs text-neutral-500">
            <div>
              <div className="font-mono font-bold text-black uppercase tracking-wider mb-3">
                Engine
              </div>
              <ul className="space-y-2">
                <li>AssemblyAI Universal-3.5 Pro</li>
                <li>Single-Pass Dictation API</li>
                <li>Keyterms Acoustic Biasing</li>
                <li>Filler Token Stripping</li>
              </ul>
            </div>
            <div>
              <div className="font-mono font-bold text-black uppercase tracking-wider mb-3">
                Encounters
              </div>
              <ul className="space-y-2">
                <li>Cardiology: Post-STEMI</li>
                <li>Pulmonology: Pediatric Asthma</li>
                <li>Orthopedics: Acute Knee Trauma</li>
                <li>Custom Audio Recording</li>
              </ul>
            </div>
            <div>
              <div className="font-mono font-bold text-black uppercase tracking-wider mb-3">
                EHR Pipelines
              </div>
              <ul className="space-y-2">
                <li>Epic Hyperspace SmartText (.epic)</li>
                <li>HL7 FHIR R4 DiagnosticReport</li>
                <li>Cerner Millennium ASCII</li>
                <li>Verified E-Prescription Slip</li>
              </ul>
            </div>
            <div>
              <div className="font-mono font-bold text-black uppercase tracking-wider mb-3">
                Hackathon
              </div>
              <ul className="space-y-2">
                <li>AssemblyAI Voice Hackathon</li>
                <li>Hack into Dictation (Sept 2026)</li>
                <li>MIT Licensed Open Source</li>
                <li>Designed for Clinical Safety</li>
              </ul>
            </div>
          </div>

          {/* Massive Typographic Watermark */}
          <div className="text-center select-none pointer-events-none overflow-hidden leading-none pt-4">
            <span className="font-display text-[clamp(90px,19vw,290px)] font-bold tracking-tighter text-neutral-300 block leading-none">
              CURIE
            </span>
          </div>

          {/* Copyright Bar */}
          <div className="mt-4 pt-6 border-t border-neutral-200 text-center text-xs text-neutral-400">
            Curie Clinical Intelligence • Developed with AssemblyAI Universal-3.5 Pro • 2026
          </div>
        </div>
      </footer>
    </div>
  )
}
