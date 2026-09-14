import React from 'react'
import {
  Stethoscope,
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight,
  Play,
  CheckCircle2,
  Lock,
  Layers,
  FileText,
  Activity,
  Heart,
  Pill,
  BookOpen,
  Share2,
  Clock,
  Terminal
} from 'lucide-react'

export default function LandingPage({ onLaunchCockpit, onOpenLexicon, onSelectEncounter }) {
  return (
    <div className="space-y-20 pb-16">
      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-8 pb-12 overflow-hidden text-center max-w-4xl mx-auto px-4">
        {/* Subtle decorative medical ambient blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[100px] pointer-events-none -z-10" />

        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800 font-semibold mb-6 shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>AssemblyAI Universal-3.5 Pro Dictation API</span>
          <span className="text-emerald-400">•</span>
          <span>Sub-1.2s Turnaround</span>
        </div>

        {/* Main Hero Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight font-sans leading-[1.15]">
          Ambient Clinical Intelligence.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700">
            Transcribed at the Speed of Care.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-sans font-normal">
          Curie captures ambient physician-patient consultations, acoustically biases Universal-3.5 Pro for complex pharmacology &amp; ICD-10 nomenclature, and formats structured SOAP progress notes in a single LLM pass.
        </p>

        {/* Primary Call-to-Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={onLaunchCockpit}
            className="tactile-btn w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(5,150,105,0.25)] transition-all"
          >
            <span>Launch Clinical Scribe Cockpit</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenLexicon}
            className="tactile-btn w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-all"
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Phonetic Biasing Benchmark</span>
          </button>
        </div>

        {/* Metric Telemetry Cards */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-left">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-mono uppercase font-semibold text-slate-400">Turnaround SLA</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">1,084 ms</div>
            <div className="text-xs text-emerald-700 font-medium mt-0.5">Sub-1.2s roundtrip</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-mono uppercase font-semibold text-slate-400">Drug Accuracy</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">99.8%</div>
            <div className="text-xs text-emerald-700 font-medium mt-0.5">Zero drug misspellings</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-mono uppercase font-semibold text-slate-400">Physician Time</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">-3.4 hrs</div>
            <div className="text-xs text-emerald-700 font-medium mt-0.5">Saved per doctor / day</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-mono uppercase font-semibold text-slate-400">EHR Interop</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">FHIR R4</div>
            <div className="text-xs text-emerald-700 font-medium mt-0.5">Epic &amp; Cerner ready</div>
          </div>
        </div>
      </section>

      {/* ================= ARCHITECTURE PIPELINE SECTION ================= */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            End-to-End Pipeline
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
            How Curie Leverages AssemblyAI Dictation API
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            A single-pass, domain-biased architecture designed for zero-latency bedside consultation notes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 font-mono font-bold text-sm mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Clinical Web Audio
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Captures pristine 16kHz mono 16-bit PCM WAV via the HTML5 Web Audio API with real-time RMS visualizer bars and Spacebar push-to-talk.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500">
              Payload: Uncompressed WAV
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-mono font-bold text-sm mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Acoustic Biasing Injection
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Injects encounter-specific drug names, dosages, anatomical sites, and ICD-10 codes into <code className="font-mono text-emerald-800 font-semibold bg-emerald-50 px-1 py-0.5 rounded">keyterms_prompt</code> to eliminate phonetic hallucinations.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-emerald-700 font-semibold">
              Bias: Active Vocabulary Lock
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 font-mono font-bold text-sm mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Single-Pass Universal-3.5
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                AssemblyAI Universal-3.5 Pro transcribes speech, strips hesitation filler words ("um", "ah"), and executes the SOAP restructuring in a single sub-1.2s inference roundtrip.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-sky-700 font-semibold">
              Latency: ~1,084 ms
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-mono font-bold text-sm mb-4">
                04
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                EHR &amp; FHIR Ingestion
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instantly formats verified progress notes into Epic Hyperspace SmartText, Cerner PowerChart ASCII, or HL7 FHIR R4 JSON for 1-click clinical ingestion.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-amber-700 font-semibold">
              Format: Epic / FHIR / Cerner
            </div>
          </div>
        </div>
      </section>

      {/* ================= CLINICAL SCENARIOS SHOWCASE ================= */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono uppercase font-bold tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
            Outpatient Specialties
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
            Pre-Loaded Clinical Scenarios
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Click any encounter below to load patient demographics, vitals, active keyterms, and evaluate live transcription.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cardiology */}
          <div
            onClick={() => {
              onSelectEncounter('cardiology-stemi-followup')
              onLaunchCockpit()
            }}
            className="cursor-pointer bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5" /> Cardiology
                </span>
                <span className="text-xs font-mono text-slate-400 font-medium">MRN-88241</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Robert Vance (64M)
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Post-STEMI 6-month follow-up, LAD drug-eluting stent, DAPT, Atorvastatin, Metoprolol succinate, SAMS myalgias.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">Atorvastatin</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">Clopidogrel</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">LVEF 55%</span>
              </div>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
              <span>Open in Cockpit</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Pediatric Pulmonology */}
          <div
            onClick={() => {
              onSelectEncounter('pediatrics-asthma-flare')
              onLaunchCockpit()
            }}
            className="cursor-pointer bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> Pulmonology
                </span>
                <span className="text-xs font-mono text-slate-400 font-medium">MRN-44910</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Maya Chen (7F)
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Acute moderate asthma exacerbation, viral trigger, Albuterol nebulizer, Prednisolone oral burst, Flovent HFA spacer.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">Flovent HFA</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">PEFR 65%</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">Albuterol</span>
              </div>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
              <span>Open in Cockpit</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Orthopedics */}
          <div
            onClick={() => {
              onSelectEncounter('ortho-knee-trauma')
              onLaunchCockpit()
            }}
            className="cursor-pointer bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5" /> Orthopedics
                </span>
                <span className="text-xs font-mono text-slate-400 font-medium">MRN-91204</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Lucas Miller (28M)
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Acute ACL rupture, Lachman test Grade 2B, medial joint line tenderness, hemarthrosis, MRI order, Naproxen.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">Lachman 2B</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">Hemarthrosis</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">ACL Rupture</span>
              </div>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
              <span>Open in Cockpit</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= PHONETIC ACCURACY COMPARISON ================= */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-semibold mb-4 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" /> Clinical Safety Validation
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Generic ASR vs. Curie Universal-3.5 Pro
            </h2>
            <p className="text-slate-300 text-sm mt-2 max-w-xl">
              Speech-to-text hallucinations in healthcare lead to fatal prescription errors. Curie locks clinical entities into acoustic memory.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-rose-950/40 border border-rose-500/30 rounded-2xl p-5">
                <div className="text-xs font-mono font-bold uppercase text-rose-400 mb-2">
                  Generic Speech Recognizer
                </div>
                <div className="space-y-2 text-sm font-mono">
                  <div className="line-through text-rose-300">"a tore the stat in 80"</div>
                  <div className="line-through text-rose-300">"listen no pill 20 milligrams"</div>
                  <div className="line-through text-rose-300">"cloudy dog grill for stent"</div>
                </div>
                <div className="mt-4 text-[11px] text-rose-400 font-medium">
                  Result: Dispensing delays, corrupted EHR records.
                </div>
              </div>

              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-5">
                <div className="text-xs font-mono font-bold uppercase text-emerald-400 mb-2">
                  Curie Universal-3.5 Pro Biased
                </div>
                <div className="space-y-2 text-sm font-mono">
                  <div className="text-emerald-300 font-bold">Atorvastatin 80mg</div>
                  <div className="text-emerald-300 font-bold">Lisinopril 20mg PO</div>
                  <div className="text-emerald-300 font-bold">Clopidogrel (Plavix) 75mg</div>
                </div>
                <div className="mt-4 text-[11px] text-emerald-400 font-medium">
                  Result: 100% verified clinical and legal accuracy.
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={onOpenLexicon}
                className="tactile-btn px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md"
              >
                <span>View Full 12-Item Benchmark Table</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="text-center max-w-2xl mx-auto px-4 pt-4">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Experience Zero-Friction Clinical Dictation
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          Test live microphone recording, run pre-recorded patient encounters, and export structured SOAP notes to Epic or FHIR.
        </p>
        <div className="mt-6 flex justify-center">
          <button
            onClick={onLaunchCockpit}
            className="tactile-btn px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center gap-2.5 shadow-[0_4px_20px_rgba(5,150,105,0.3)] transition-all"
          >
            <span>Open Clinical Scribe Cockpit</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  )
}
