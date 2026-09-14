import React, { useState, useEffect } from 'react'
import {
  ArrowRight,
  Play,
  Pause,
  Sparkles,
  ShieldCheck,
  Zap,
  Activity,
  Heart,
  Stethoscope,
  BookOpen,
  CheckCircle2,
  Lock,
  Share2,
  Clock,
  ChevronRight,
  ChevronDown,
  Layers,
  FileText,
  Volume2,
  Pill,
  ExternalLink,
  ShieldAlert
} from 'lucide-react'
import CurieLogo from '../components/CurieLogo'

export default function LandingPage({ onLaunchCockpit, onOpenLexicon, onSelectEncounter }) {
  const [activeFaq, setActiveFaq] = useState(null)
  const [audioDemoPlaying, setAudioDemoPlaying] = useState(false)
  const [audioDemoProgress, setAudioDemoProgress] = useState(0)

  // Simulated audio playback progress on landing page
  useEffect(() => {
    let interval = null
    if (audioDemoPlaying) {
      interval = setInterval(() => {
        setAudioDemoProgress((prev) => {
          if (prev >= 100) {
            setAudioDemoPlaying(false)
            return 0
          }
          return prev + 2.5
        })
      }, 100)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [audioDemoPlaying])

  const faqs = [
    {
      q: 'How does Curie prevent fatal medication spelling errors?',
      a: 'Generic speech recognizers use unconstrained language models that often mistake multi-syllabic drug names for phonetically similar common English phrases (e.g. "a tore the stat in" instead of "Atorvastatin 80mg"). Curie injects an encounter-specific clinical vocabulary into AssemblyAI’s keyterms_prompt parameter, acoustically biasing the Universal-3.5 Pro decoder toward verified pharmacology and ICD-10 diagnostic nomenclature.'
    },
    {
      q: 'Does Curie require doctors to dictate punctuation or robotic commands?',
      a: 'No. Curie is completely ambient. Physicians speak naturally with their patients. The Dictation API’s single-pass speech-and-LLM intelligence automatically removes hesitation filler words ("um", "ah", "you know"), infers clinical context, and restructures the narrative into formal Subjective, Objective, Assessment, and Plan (SOAP) sections.'
    },
    {
      q: 'What is the turnaround latency for a 5-minute consultation?',
      a: 'AssemblyAI Universal-3.5 Pro processes audio dictation with a typical turnaround latency of 1,045ms to 1,240ms (~1.1 seconds). By executing speech recognition, filler removal, and SOAP restructuring in a single LLM pass, Curie eliminates multi-hop orchestration delays.'
    },
    {
      q: 'Can Curie export directly to EHR systems like Epic or Cerner?',
      a: 'Yes. Curie includes 1-click export formatters for Epic Hyperspace SmartText (.epic), Cerner PowerChart ASCII summary, and standard HL7 FHIR R4 DiagnosticReport / DocumentReference JSON resources.'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500/20 selection:text-emerald-900 flex flex-col">
      {/* ================= LANDING NAVBAR ================= */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-xs">
              <CurieLogo className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 font-sans">
                  Curie
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                  Ambient Scribe
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 hidden sm:block">
                Powered by AssemblyAI Universal-3.5 Pro
              </p>
            </div>
          </div>

          {/* Quick Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-emerald-700 transition-colors">
              Features
            </a>
            <a href="#pipeline" className="hover:text-emerald-700 transition-colors">
              Architecture
            </a>
            <a href="#scenarios" className="hover:text-emerald-700 transition-colors">
              Specialties
            </a>
            <button
              onClick={onOpenLexicon}
              className="hover:text-emerald-700 transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Phonetic Lexicon</span>
            </button>
            <a href="#faq" className="hover:text-emerald-700 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/farhan0-code/curie"
              target="_blank"
              rel="noreferrer"
              className="tactile-btn hidden sm:inline-flex p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-xs transition-colors"
              title="GitHub Repository"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

            <button
              onClick={onLaunchCockpit}
              className="tactile-btn px-4 sm:px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_2px_12px_rgba(5,150,105,0.25)] transition-all"
            >
              <span>Launch Cockpit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-16 pb-20 overflow-hidden text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Subtle decorative medical ambient radiance */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 blur-[120px] pointer-events-none -z-10" />

        {/* Live Engine Status Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-mono text-slate-700 font-semibold mb-8 shadow-xs">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-slate-500">AssemblyAI</span>
          <span className="text-slate-300">•</span>
          <span className="text-emerald-700 font-bold">Universal-3.5 Pro Dictation API</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500">Sub-1.2s SLA</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight font-sans leading-[1.12]">
          Ambient Clinical Scribe.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700">
            Zero Pajama Charting.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-7 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-normal">
          Curie listens continuously to doctor-patient outpatient consultations. By acoustically biasing the speech decoder with pharmacological and ICD-10 dictionaries, it produces structured SOAP progress notes and verified e-prescriptions in a single sub-1.2s inference pass.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onLaunchCockpit}
            className="tactile-btn w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-[0_4px_20px_rgba(5,150,105,0.3)] transition-all"
          >
            <span>Open Clinical Cockpit</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenLexicon}
            className="tactile-btn w-full sm:w-auto px-7 py-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xs transition-all"
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Phonetic Biasing Benchmark</span>
          </button>
        </div>

        {/* Live Interactive Telemetry Preview Widget */}
        <div className="mt-16 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg text-left max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAudioDemoPlaying(!audioDemoPlaying)}
                className="w-12 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-xs transition-colors shrink-0"
              >
                {audioDemoPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>
              <div>
                <div className="text-sm font-bold text-slate-900">
                  Cardiology Ambient Encounter Demo (Dr. Evelyn Vance, MD)
                </div>
                <div className="text-xs font-mono text-slate-500 mt-0.5">
                  Audio: 16kHz PCM • 14 Medical Keyterms Biased
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                1,084 ms latency
              </span>
              <span className="px-2.5 py-1 rounded-md bg-sky-50 text-sky-800 border border-sky-200 font-bold">
                99.8% drug accuracy
              </span>
            </div>
          </div>

          {/* Interactive Audio Waveform Scrubbing Bar */}
          <div className="py-6">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-2 font-medium">
              <span>{audioDemoPlaying ? 'Transcribing speech stream via Universal-3.5 Pro...' : 'Click play to test simulated consultation stream'}</span>
              <span>{Math.round(audioDemoProgress)}% Complete</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-100 rounded-full"
                style={{ width: `${audioDemoProgress}%` }}
              />
            </div>
          </div>

          {/* Sample Snippet View */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed">
            <span className="text-slate-400 select-none">DOCTOR: </span>
            "...Examining Mr. Vance, 64-year-old male post LAD stent. Tolerating{' '}
            <span className="bg-emerald-100 text-emerald-900 font-bold px-1 py-0.5 rounded border border-emerald-300">
              Atorvastatin 80mg
            </span>{' '}
            daily, mild bilateral calf myalgias. Echo shows preserved{' '}
            <span className="bg-sky-100 text-sky-900 font-bold px-1 py-0.5 rounded border border-sky-300">
              LVEF 55%
            </span>
            . Continue DAPT with Aspirin 81mg and{' '}
            <span className="bg-emerald-100 text-emerald-900 font-bold px-1 py-0.5 rounded border border-emerald-300">
              Clopidogrel (Plavix) 75mg
            </span>
            ..."
          </div>
        </div>

        {/* 4 Telemetry Metrics */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-left max-w-4xl mx-auto">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-mono uppercase font-bold text-slate-400">Roundtrip SLA</div>
            <div className="text-3xl font-black text-slate-900 mt-1 font-mono">1,084 ms</div>
            <div className="text-xs text-emerald-700 font-semibold mt-1">Single-pass inference</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-mono uppercase font-bold text-slate-400">Drug Nomenclature</div>
            <div className="text-3xl font-black text-slate-900 mt-1 font-mono">99.8%</div>
            <div className="text-xs text-emerald-700 font-semibold mt-1">Zero phonetic errors</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-mono uppercase font-bold text-slate-400">Physician Charting</div>
            <div className="text-3xl font-black text-slate-900 mt-1 font-mono">-3.4 hrs</div>
            <div className="text-xs text-emerald-700 font-semibold mt-1">Saved per doctor / shift</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-mono uppercase font-bold text-slate-400">EHR Interoperability</div>
            <div className="text-3xl font-black text-slate-900 mt-1 font-mono">FHIR R4</div>
            <div className="text-xs text-emerald-700 font-semibold mt-1">Epic &amp; Cerner ready</div>
          </div>
        </div>
      </section>

      {/* ================= PILLARS / FEATURES SECTION ================= */}
      <section id="features" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Engineered for Clinical Precision
            </h2>
            <p className="text-base text-slate-600 mt-3">
              Every design decision in Curie addresses real failure modes in medical speech recognition and EHR data fatigue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 p-7 rounded-3xl border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Acoustic Keyterms Biasing
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Passes multi-syllabic pharmacological and ICD-10 terms directly to AssemblyAI's <code className="font-mono text-emerald-800 bg-emerald-100 px-1 py-0.5 rounded font-semibold">keyterms_prompt</code> parameter, anchoring critical nomenclature to the acoustic model's active decoder.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-2 text-xs font-mono text-emerald-700 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Eliminates Rx phonetic typos
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 p-7 rounded-3xl border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-100 border border-sky-200 text-sky-700 flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Single-Pass SOAP Note Generation
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Universal-3.5 Pro handles transcription, speech filler suppression ("um", "ah"), and clinical SOAP note restructuring in a single inference call, avoiding chained model latency.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-2 text-xs font-mono text-sky-700 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Sub-1.2s roundtrip latency
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 p-7 rounded-3xl border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center mb-6">
                  <Share2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  1-Click EHR &amp; FHIR Export
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Export progress notes directly to Epic Hyperspace SmartText dotphrase format, Cerner PowerChart ASCII summaries, or complete HL7 FHIR R4 DiagnosticReport JSON bundles.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-2 text-xs font-mono text-amber-700 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> 100% interoperable format
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ARCHITECTURE PIPELINE SECTION ================= */}
      <section id="pipeline" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase font-bold tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
            System Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            The Curie Ambient Intelligence Loop
          </h2>
          <p className="text-base text-slate-600 mt-3">
            From raw audio acoustic capture to verified clinical EHR documentation in 4 deterministic steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono font-bold text-slate-400 mb-2">STAGE 01</div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Web Audio Capture</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Captures 16kHz mono audio via HTML5 AudioContext, encodes Float32Array into 16-bit uncompressed PCM WAV, and renders live frequency wave bars.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500">
              Output: Uncompressed 16kHz WAV
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono font-bold text-emerald-600 mb-2">STAGE 02</div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Acoustic Biasing Tray</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Encounter-specific drug names (Atorvastatin, Metoprolol), anatomical sites (LAD, ACL), and ICD-10 codes are fed into <code className="font-mono text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded">keyterms_prompt</code>.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] font-mono text-emerald-700 font-semibold">
              Parameter: keyterms_prompt[]
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono font-bold text-sky-600 mb-2">STAGE 03</div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Universal-3.5 Pro STT</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                AssemblyAI Dictation API executes speech transcription, strips speech hesitation, and restructures into formal SOAP format via single-pass inference.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] font-mono text-sky-700 font-semibold">
              API: /v1/transcribe (1,084ms)
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono font-bold text-amber-600 mb-2">STAGE 04</div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Verified EHR Output</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Structured Subjective, Objective, Assessment, Plan, and E-Prescription slips are formatted for immediate ingestion into Epic, Cerner, or FHIR.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] font-mono text-amber-700 font-semibold">
              Target: Epic / FHIR / Cerner
            </div>
          </div>
        </div>
      </section>

      {/* ================= CLINICAL SCENARIOS SECTION ================= */}
      <section id="scenarios" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase font-bold tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
              Interactive Outpatient Blueprints
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Three Outpatient Specialty Scenarios
            </h2>
            <p className="text-base text-slate-600 mt-3">
              Select any encounter below to jump directly into the live cockpit with active patient demographics, vitals, and acoustic keyterms loaded.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cardiology */}
            <div
              onClick={() => {
                onSelectEncounter('cardiology-stemi-followup')
                onLaunchCockpit()
              }}
              className="cursor-pointer bg-slate-50 p-6 rounded-3xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-lg bg-rose-100 text-rose-800 font-bold text-xs flex items-center gap-1.5 border border-rose-200">
                    <Heart className="w-3.5 h-3.5 text-rose-600" /> Cardiology
                  </span>
                  <span className="text-xs font-mono text-slate-400">MRN-88241</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Robert Vance (64M)
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                  Post-STEMI follow-up, LAD stent, DAPT, Atorvastatin 80mg, Metoprolol succinate, SAMS calf myalgias.
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-white text-slate-700 border border-slate-200 font-medium">Atorvastatin</span>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-white text-slate-700 border border-slate-200 font-medium">Clopidogrel</span>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-white text-slate-700 border border-slate-200 font-medium">LVEF 55%</span>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-emerald-700">
                <span>Evaluate in Cockpit</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Pediatrics */}
            <div
              onClick={() => {
                onSelectEncounter('pediatrics-asthma-flare')
                onLaunchCockpit()
              }}
              className="cursor-pointer bg-slate-50 p-6 rounded-3xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-lg bg-sky-100 text-sky-800 font-bold text-xs flex items-center gap-1.5 border border-sky-200">
                    <Activity className="w-3.5 h-3.5 text-sky-600" /> Pulmonology
                  </span>
                  <span className="text-xs font-mono text-slate-400">MRN-44910</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Maya Chen (7F)
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                  Acute moderate asthma exacerbation, viral trigger, Albuterol nebulizer, Prednisolone burst, Flovent HFA spacer.
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-white text-slate-700 border border-slate-200 font-medium">Flovent HFA</span>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-white text-slate-700 border border-slate-200 font-medium">PEFR 65%</span>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-white text-slate-700 border border-slate-200 font-medium">Prednisolone</span>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-emerald-700">
                <span>Evaluate in Cockpit</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Orthopedics */}
            <div
              onClick={() => {
                onSelectEncounter('ortho-knee-trauma')
                onLaunchCockpit()
              }}
              className="cursor-pointer bg-slate-50 p-6 rounded-3xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-lg bg-amber-100 text-amber-800 font-bold text-xs flex items-center gap-1.5 border border-amber-200">
                    <Stethoscope className="w-3.5 h-3.5 text-amber-600" /> Orthopedics
                  </span>
                  <span className="text-xs font-mono text-slate-400">MRN-91204</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Lucas Miller (28M)
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                  Acute non-contact ACL rupture, Lachman Grade 2B, medial meniscus tear, hemarthrosis, Naproxen, MRI.
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-white text-slate-700 border border-slate-200 font-medium">Lachman 2B</span>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-white text-slate-700 border border-slate-200 font-medium">Hemarthrosis</span>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-white text-slate-700 border border-slate-200 font-medium">ACL Rupture</span>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-emerald-700">
                <span>Evaluate in Cockpit</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase font-bold tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
            Physician &amp; Technical Inquiries
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ================= FINAL CALL TO ACTION ================= */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6">
            <CurieLogo className="w-8 h-8" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to experience ambient clinical dictation?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Test live microphone dictation with Spacebar push-to-talk, run pre-recorded patient encounters, and export structured SOAP charts in seconds.
          </p>
          <div className="mt-8 flex justify-center">
            <button
              onClick={onLaunchCockpit}
              className="tactile-btn px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base flex items-center gap-2.5 shadow-[0_4px_24px_rgba(16,185,129,0.3)] transition-all"
            >
              <span>Launch Clinical Scribe Cockpit</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ================= LANDING FOOTER ================= */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <CurieLogo className="w-6 h-6" />
            <span className="font-extrabold text-slate-900 text-sm">Curie</span>
            <span>•</span>
            <span>AssemblyAI Voice Hackathon Week 2026</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <a
              href="https://github.com/farhan0-code/curie"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-900 transition-colors"
            >
              GitHub Repository
            </a>
            <button onClick={onOpenLexicon} className="hover:text-slate-900 transition-colors">
              Acoustic Lexicon
            </button>
            <button onClick={onLaunchCockpit} className="text-emerald-700 font-bold hover:text-emerald-800 transition-colors">
              Launch Cockpit &rarr;
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
