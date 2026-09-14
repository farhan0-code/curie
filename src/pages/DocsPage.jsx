import React, { useState } from 'react'
import {
  BookOpen,
  ArrowLeft,
  Activity,
  Heart,
  Stethoscope,
  ShieldCheck,
  Zap,
  Globe,
  Share2,
  FileText,
  Check,
  Copy,
  ExternalLink,
  ChevronRight,
  Play,
  User,
  AlertCircle,
  Building2,
  Sparkles,
  Layers,
  ArrowRight,
  Search,
  HelpCircle
} from 'lucide-react'
import CurieLogo from '../components/CurieLogo'
import TermTooltip, { CLINICAL_TERMS } from '../components/TermTooltip'
import { CLINICAL_ENCOUNTERS } from '../data/clinicalEncounters'

export default function DocsPage({ onBackToLanding, onLaunchWorkspace, onSelectEncounter }) {
  const [activeTab, setActiveTab] = useState('getting-started') // 'getting-started' | 'demos' | 'biasing' | 'ehr' | 'api' | 'glossary'
  const [activeDemoIdx, setActiveDemoIdx] = useState(0)
  const [copiedFormat, setCopiedFormat] = useState(null)
  const [glossarySearch, setGlossarySearch] = useState('')

  const selectedDemo = CLINICAL_ENCOUNTERS[activeDemoIdx] || CLINICAL_ENCOUNTERS[0]

  const handleCopy = (text, formatKey) => {
    navigator.clipboard.writeText(text)
    setCopiedFormat(formatKey)
    setTimeout(() => setCopiedFormat(null), 2500)
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-black font-sans selection:bg-neutral-200">
      {/* Top Header Banner */}
      <header className="border-b border-neutral-200 bg-white sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToLanding}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-xs font-semibold text-neutral-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <div className="h-4 w-px bg-neutral-200 mx-1" />
            <div className="flex items-center gap-2">
              <CurieLogo className="w-5 h-5 text-black" />
              <span className="font-display font-bold text-base text-black tracking-tight">Curie Docs</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onLaunchWorkspace}
              className="tactile-btn px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-neutral-100 text-black border-2 border-black flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Open Workspace</span>
            </button>
          </div>
        </div>
      </header>

      {/* Docs Title & Description */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5 text-black" />
            <span>Developer &amp; Clinician Reference</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-black tracking-tight mb-3">
            Documentation &amp; Clinical Architecture
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 max-w-3xl leading-relaxed">
            A comprehensive guide to ambient outpatient voice transcription, targeted pharmacology keyterm biasing, single-pass SOAP restructuring with AssemblyAI Universal-3.5 Pro, and pre-loaded clinical reference encounters.
          </p>

          {/* Navigation Pill Tabs */}
          <div className="flex flex-wrap gap-2 pt-4">
            {[
              { id: 'getting-started', label: '1. How to Use Curie', icon: Sparkles },
              { id: 'demos', label: '2. Clinical Benchmark Demos (3 Cases)', icon: Activity },
              { id: 'biasing', label: '3. Acoustic Keyterm Biasing', icon: ShieldCheck },
              { id: 'ehr', label: '4. Multi-EHR Interoperability', icon: Share2 },
              { id: 'api', label: '5. AssemblyAI Dictation API Spec', icon: Zap },
              { id: 'glossary', label: '6. Acronyms & Medical Glossary', icon: HelpCircle }
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-200'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-neutral-700'}`} />
                  <span className={isActive ? 'text-white font-bold' : 'text-neutral-800'}>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        {/* ================= TAB 1: HOW TO USE CURIE ================= */}
        {activeTab === 'getting-started' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-display font-bold text-black tracking-tight mb-2">
                Outpatient Clinician Workflow Guide
              </h2>
              <p className="text-xs text-neutral-600 leading-relaxed max-w-3xl">
                Curie is designed to operate unobtrusively during active outpatient encounters. Clinicians do not spend time learning complicated UI software; they speak naturally with their patients while Curie drafts load-bearing medical records.
              </p>
            </div>

            {/* 6-Step Workflow Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  step: '01',
                  title: 'Patient Intake & Queue',
                  desc: 'Select an existing patient from the left sidebar or click "+ New Patient" to intake a real outpatient case with custom demographics, vitals, and chief complaints.'
                },
                {
                  step: '02',
                  title: 'Acoustic Biasing Tray',
                  desc: 'Curie automatically loads relevant drugs, anatomy, and ICD-10 codes into AssemblyAI keyterms_prompt. Doctors can freely add custom drug names or patient specifics.'
                },
                {
                  step: '03',
                  title: 'Spacebar Ambient Recording',
                  desc: 'Hold down the Spacebar during the consultation, or click "Start Ambient Dictation". The Web Audio meter visualizes live RMS energy and gives gentle silence prompts.'
                },
                {
                  step: '04',
                  title: 'Single-Pass SOAP Synthesis',
                  desc: 'Upon releasing Spacebar, Universal-3.5 Pro strips hesitation words and synthesizes formal Subjective, Objective, Assessment, and Plan sections in ~1.1 seconds.'
                },
                {
                  step: '05',
                  title: 'Review Invariants & Orders',
                  desc: 'Clinicians review locked vital badges (BP, HR, SpO2), confirm ICD-10 diagnostic codes, and verify auto-extracted electronic prescription instructions.'
                },
                {
                  step: '06',
                  title: '1-Click Multi-EHR Export',
                  desc: 'Export immediately formatted for your hospital system: Epic Hyperspace dot-phrase SmartText, HL7 FHIR R4 DiagnosticReport JSON, or Cerner PowerChart ASCII.'
                }
              ].map((card) => (
                <div key={card.step} className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-neutral-400">STEP {card.step}</span>
                    <span className="w-2 h-2 rounded-full bg-black"></span>
                  </div>
                  <h3 className="font-display font-bold text-sm text-black">{card.title}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>

            {/* Keyboard Shortcuts Table */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xs space-y-3">
              <h3 className="text-sm font-display font-bold text-black uppercase tracking-wider">
                Keyboard Shortcuts &amp; Ergonomics
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-500 font-mono">
                      <th className="py-2 px-3">Hotkey</th>
                      <th className="py-2 px-3">Action</th>
                      <th className="py-2 px-3">Behavior &amp; Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    <tr>
                      <td className="py-2.5 px-3 font-mono font-bold text-black">Hold Spacebar</td>
                      <td className="py-2.5 px-3 font-semibold text-black">Push-to-Talk Capture</td>
                      <td className="py-2.5 px-3 text-neutral-600">Opens 16kHz audio stream; animates RMS soundwave bar</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono font-bold text-black">Release Spacebar</td>
                      <td className="py-2.5 px-3 font-semibold text-black">Trigger Synthesis</td>
                      <td className="py-2.5 px-3 text-neutral-600">Finalizes PCM WAV and initiates sub-second AssemblyAI SOAP structuring</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono font-bold text-black">Escape (Esc)</td>
                      <td className="py-2.5 px-3 font-semibold text-black">Close Modal</td>
                      <td className="py-2.5 px-3 text-neutral-600">Closes EHR Export, Lexicon, or New Patient Intake modals</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: CLINICAL BENCHMARK DEMOS ================= */}
        {activeTab === 'demos' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <h2 className="text-2xl font-display font-bold text-black tracking-tight">
                  3 Pre-Loaded Benchmark Clinical Encounters
                </h2>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-lg bg-neutral-100 text-neutral-700 border border-neutral-200 font-semibold">
                  Gold Standard Reference Cases
                </span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed max-w-3xl">
                These encounters represent realistic outpatient consultations across three major hospital specialties. They serve as reproducible benchmarks for acoustic keyterm biasing, dosage preservation, and EHR export.
              </p>
            </div>

            {/* Case Selector Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {CLINICAL_ENCOUNTERS.map((enc, idx) => {
                const isSelected = idx === activeDemoIdx
                const p = enc.patient
                return (
                  <button
                    key={enc.id}
                    onClick={() => setActiveDemoIdx(idx)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-2 border-black shadow-sm'
                        : 'bg-neutral-100/60 border-neutral-200 hover:bg-white text-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">
                        {enc.specialty}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 font-bold text-black border border-neutral-200">
                        {enc.audioDuration || `${enc.keyterms.length} terms`}
                      </span>
                    </div>
                    <div className="font-display font-bold text-sm text-black mb-1">{p.name}</div>
                    <div className="text-xs text-neutral-500 line-clamp-1">{enc.chiefComplaint}</div>
                  </button>
                )
              })}
            </div>

            {/* Selected Case Deep Dive Card */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-neutral-100 text-black border border-neutral-200">
                      {selectedDemo.specialty}
                    </span>
                    <span className="text-xs font-medium text-neutral-500">Attending: {selectedDemo.doctor}</span>
                  </div>
                  <h3 className="text-xl font-display font-bold text-black">
                    {selectedDemo.patient.name} ({selectedDemo.patient.age} y/o {selectedDemo.patient.gender})
                  </h3>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    <strong>Chief Complaint:</strong> "{selectedDemo.chiefComplaint}"
                  </p>
                </div>

                <button
                  onClick={() => {
                    onSelectEncounter(selectedDemo.id)
                    onLaunchWorkspace()
                  }}
                  className="tactile-btn inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black hover:bg-neutral-800 text-xs font-bold text-white shadow-xs transition-all cursor-pointer self-start sm:self-center shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-white" />
                  <span className="text-white font-bold">Test This Case in Clinical Cockpit</span>
                </button>
              </div>

              {/* Patient Vitals Grid */}
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-bold block mb-2">
                  Recorded Baseline Vitals
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                    <span className="text-[10px] text-neutral-500 block">Blood Pressure</span>
                    <span className="font-mono font-bold text-sm text-black">{selectedDemo.patient.vitals.bp} mmHg</span>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                    <span className="text-[10px] text-neutral-500 block">Heart Rate</span>
                    <span className="font-mono font-bold text-sm text-black">{selectedDemo.patient.vitals.hr} bpm</span>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                    <span className="text-[10px] text-neutral-500 block">Oxygen Saturation</span>
                    <span className="font-mono font-bold text-sm text-black">{selectedDemo.patient.vitals.spo2}% SpO2</span>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                    <span className="text-[10px] text-neutral-500 block">Temperature</span>
                    <span className="font-mono font-bold text-sm text-black">{selectedDemo.patient.vitals.temp}°F</span>
                  </div>
                </div>
              </div>

              {/* Pinned Keyterms */}
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-bold block mb-2">
                  Acoustically Biased Keyterms ({selectedDemo.keyterms.length} Pinned Terms)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDemo.keyterms.map((term, i) => (
                    <span key={i} className="text-xs font-mono font-medium px-2.5 py-1 rounded-lg bg-neutral-100 border border-neutral-200 text-black">
                      {term}
                    </span>
                  ))}
                </div>
              </div>

              {/* Spoken Utterance */}
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-bold block mb-1.5">
                  Spoken Doctor-Patient Utterance
                </span>
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-700 italic leading-relaxed">
                  "{selectedDemo.spokenTranscript}"
                </div>
              </div>

              {/* Synthesized SOAP Note Preview */}
              <div className="space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-bold block">
                  Synthesized Clinical SOAP Note (~{selectedDemo.latencyMs} ms SLA)
                </span>
                <div className="border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-200 text-xs">
                  <div className="p-3.5 bg-neutral-50/50">
                    <span className="font-bold text-neutral-900 block mb-1">SUBJECTIVE</span>
                    <p className="text-neutral-700 leading-relaxed">{selectedDemo.soapNote.subjective}</p>
                  </div>
                  <div className="p-3.5 bg-white">
                    <span className="font-bold text-neutral-900 block mb-1">OBJECTIVE</span>
                    <p className="text-neutral-700 whitespace-pre-line leading-relaxed">{selectedDemo.soapNote.objective}</p>
                  </div>
                  <div className="p-3.5 bg-neutral-50/50">
                    <span className="font-bold text-neutral-900 block mb-1">ASSESSMENT</span>
                    <ul className="space-y-1">
                      {selectedDemo.soapNote.assessment.map((a, i) => (
                        <li key={i} className="text-neutral-800">
                          <span className="font-mono font-bold">[{a.code}]</span> {a.diagnosis} — <span className="text-neutral-500">{a.notes}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3.5 bg-white">
                    <span className="font-bold text-neutral-900 block mb-1">PLAN</span>
                    <ol className="list-decimal list-inside space-y-1 text-neutral-800">
                      {selectedDemo.soapNote.plan.map((p, i) => (
                        <li key={i} className="leading-relaxed">{p}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: ACOUSTIC BIASING DEEP DIVE ================= */}
        {activeTab === 'biasing' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-display font-bold text-black tracking-tight mb-2">
                Specialty Lexicon &amp; Acoustic Biasing Mechanics
              </h2>
              <p className="text-xs text-neutral-600 leading-relaxed max-w-3xl">
                Generic automatic speech recognition (ASR) engines routinely fail when decoding complex multi-syllabic pharmaceuticals and diagnostic codes. Curie eliminates phonetic drift through targeted beam search vocabulary biasing.
              </p>
            </div>

            {/* Comparison Table */}
            <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-100 border-b border-neutral-200 text-neutral-600 font-mono">
                    <th className="py-2.5 px-4">Clinical Entity</th>
                    <th className="py-2.5 px-4">Category</th>
                    <th className="py-2.5 px-4">Unbiased Generic ASR</th>
                    <th className="py-2.5 px-4">Curie Universal-3.5 Pro</th>
                    <th className="py-2.5 px-4">Clinical Risk Prevented</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  <tr>
                    <td className="py-3 px-4 font-bold text-black">Atorvastatin 80mg</td>
                    <td className="py-3 px-4 text-neutral-500 font-mono">Statin</td>
                    <td className="py-3 px-4 text-red-600 font-mono">"a tore the stat in 80"</td>
                    <td className="py-3 px-4 text-emerald-700 font-mono font-bold">Atorvastatin 80mg PO</td>
                    <td className="py-3 px-4 text-neutral-600">Dispensing failure at pharmacy</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-black">Clopidogrel 75mg</td>
                    <td className="py-3 px-4 text-neutral-500 font-mono">Antiplatelet</td>
                    <td className="py-3 px-4 text-red-600 font-mono">"cloudy dog grill 75"</td>
                    <td className="py-3 px-4 text-emerald-700 font-mono font-bold">Clopidogrel 75mg PO</td>
                    <td className="py-3 px-4 text-neutral-600">Omission of mandatory post-stent DAPT</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-black">LVEF 55%</td>
                    <td className="py-3 px-4 text-neutral-500 font-mono">Cardiology Metric</td>
                    <td className="py-3 px-4 text-red-600 font-mono">"ejection friction 55"</td>
                    <td className="py-3 px-4 text-emerald-700 font-mono font-bold">LVEF 55%</td>
                    <td className="py-3 px-4 text-neutral-600">Inaccurate hemodynamic tracking</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-black">ICD-10 I25.10</td>
                    <td className="py-3 px-4 text-neutral-500 font-mono">Diagnostic Code</td>
                    <td className="py-3 px-4 text-red-600 font-mono">"ice d 10 i 25 dot 10"</td>
                    <td className="py-3 px-4 text-emerald-700 font-mono font-bold">ICD-10 I25.10</td>
                    <td className="py-3 px-4 text-neutral-600">Insurance billing denial</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-black">Lachman Grade 2B</td>
                    <td className="py-3 px-4 text-neutral-500 font-mono">Orthopedic Exam</td>
                    <td className="py-3 px-4 text-red-600 font-mono">"lock man test 2B"</td>
                    <td className="py-3 px-4 text-emerald-700 font-mono font-bold">Lachman Grade 2B</td>
                    <td className="py-3 px-4 text-neutral-600">Misdiagnosed ACL ligament tear</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Code Snippet */}
            <div className="bg-neutral-900 text-neutral-100 rounded-2xl p-6 font-mono text-xs space-y-2">
              <span className="text-neutral-400 block text-[11px] uppercase tracking-wider font-semibold">
                AssemblyAI Dictation API Payload Assembly (Client / Service)
              </span>
              <pre className="overflow-x-auto text-neutral-200 leading-relaxed">
{`const formData = new FormData();
formData.append('audio', audioBlob, 'clinical_dictation.wav');
formData.append('stt_prompt', "A board-certified cardiologist dictating an outpatient note...");
formData.append('language_code', 'en');
formData.append('keyterms_prompt', JSON.stringify([
  "Robert Vance", "Atorvastatin", "Metoprolol succinate",
  "Clopidogrel", "DAPT", "ejection fraction", "ICD-10 I25.10"
]));
formData.append('llm_instruction', "Format into formal SOAP note with ICD-10 diagnostics.");

const response = await fetch('/api/dictate', {
  method: 'POST',
  body: formData
});`}
              </pre>
            </div>
          </div>
        )}

        {/* ================= TAB 4: MULTI-EHR INTEROPERABILITY ================= */}
        {activeTab === 'ehr' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-display font-bold text-black tracking-tight mb-2">
                Multi-EHR Export Formats &amp; Specifications
              </h2>
              <p className="text-xs text-neutral-600 leading-relaxed max-w-3xl">
                Hospital health systems utilize distinct electronic medical record platforms. Curie synthesizes the single-pass structured note into standard Epic Hyperspace dot-phrases, HL7 FHIR R4 JSON, and Cerner PowerChart plain text.
              </p>
            </div>

            {/* 3 Formats Grid */}
            <div className="space-y-6">
              {/* Epic SmartText */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-display font-bold text-black">1. Epic Hyperspace SmartText (.epic)</h3>
                    <p className="text-xs text-neutral-500">Standard dot-phrase format (.SUBJECTIVE, .VITALS, .PLAN) for direct paste into Epic Hyperspace.</p>
                  </div>
                  <button
                    onClick={() => handleCopy(`=== EPIC HYPERSPACE PROGRESS NOTE ===\nATTENDING: Dr. Evelyn Vance, MD\nPATIENT: Robert Vance (MRN: MRN-88241)\n.SUBJECTIVE\n64yo male post-LAD PCI...\n.ASSESSMENT\n• [I25.10] Atherosclerotic heart disease\n.PLAN\n1. Continue DAPT (Aspirin 81mg + Clopidogrel 75mg)`, 'epic')}
                    className="tactile-btn flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-xs font-semibold text-black cursor-pointer"
                  >
                    {copiedFormat === 'epic' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-black" />}
                    <span>{copiedFormat === 'epic' ? 'Copied' : 'Copy Sample'}</span>
                  </button>
                </div>
                <pre className="p-4 bg-neutral-50 rounded-xl font-mono text-xs text-neutral-800 overflow-x-auto border border-neutral-200">
{`=== EPIC HYPERSPACE PROGRESS NOTE ===
ATTENDING: Dr. Evelyn Vance, MD, FACC
PATIENT: Robert Vance (MRN: MRN-88241, DOB: 1962-04-12)
SERVICE: Cardiovascular Medicine

.CHIEFCOMPLAINT
Routine 6-month cardiology follow-up post LAD percutaneous coronary intervention

.VITALS
BP: 138/84 | HR: 68 bpm | SpO2: 98% | Temp: 98.4°F

.SUBJECTIVE
64-year-old male presents for routine 6-month cardiology follow-up post PCI with DES to LAD...

.ASSESSMENT
• [I25.10] Atherosclerotic heart disease of native coronary artery
• [I10] Essential hypertension

.PLAN
1. Continue Dual Antiplatelet Therapy (DAPT) with Aspirin 81mg and Clopidogrel 75mg daily.
2. Add CoQ10 200mg daily for statin-associated muscle symptoms.`}
                </pre>
              </div>

              {/* HL7 FHIR R4 */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-display font-bold text-black">2. HL7 FHIR R4 DiagnosticReport (.json)</h3>
                    <p className="text-xs text-neutral-500">Fully compliant FHIR R4 resource with LOINC 11506-3 progress note coding and ICD-10 conclusionCode objects.</p>
                  </div>
                  <button
                    onClick={() => handleCopy(`{\n  "resourceType": "DiagnosticReport",\n  "code": { "coding": [{ "system": "http://loinc.org", "code": "11506-3" }] }\n}`, 'fhir')}
                    className="tactile-btn flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-xs font-semibold text-black cursor-pointer"
                  >
                    {copiedFormat === 'fhir' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-black" />}
                    <span>{copiedFormat === 'fhir' ? 'Copied' : 'Copy Sample'}</span>
                  </button>
                </div>
                <pre className="p-4 bg-neutral-50 rounded-xl font-mono text-xs text-neutral-800 overflow-x-auto border border-neutral-200">
{`{
  "resourceType": "DiagnosticReport",
  "id": "curie-cardiology-stemi-followup-1726315200000",
  "status": "final",
  "code": {
    "coding": [
      {
        "system": "http://loinc.org",
        "code": "11506-3",
        "display": "Progress note"
      }
    ]
  },
  "subject": {
    "reference": "Patient/MRN-88241",
    "display": "Robert Vance"
  },
  "conclusionCode": [
    {
      "coding": [
        {
          "system": "http://hl7.org/fhir/sid/icd-10-cm",
          "code": "I25.10",
          "display": "Atherosclerotic heart disease of native coronary artery"
        }
      ]
    }
  ]
}`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: ASSEMBLYAI API SPEC ================= */}
        {activeTab === 'api' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-display font-bold text-black tracking-tight mb-2">
                AssemblyAI Dictation API Technical Specification
              </h2>
              <p className="text-xs text-neutral-600 leading-relaxed max-w-3xl">
                Curie connects to AssemblyAI's production single-pass speech-to-text and structuring endpoint (<code className="font-mono">https://dictation.assemblyai.com/v1/transcribe</code>).
              </p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-100 border-b border-neutral-200 text-neutral-600 font-mono">
                    <th className="py-2.5 px-4">Parameter</th>
                    <th className="py-2.5 px-4">Type</th>
                    <th className="py-2.5 px-4">Curie Production Value</th>
                    <th className="py-2.5 px-4">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-mono">
                  <tr>
                    <td className="py-3 px-4 font-bold text-black">audio</td>
                    <td className="py-3 px-4 text-neutral-500">File / Blob</td>
                    <td className="py-3 px-4 text-neutral-800">16kHz mono linear PCM WAV</td>
                    <td className="py-3 px-4 text-neutral-600 font-sans">Acoustic audio stream recorded via HTML5 AudioContext</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-black">stt_prompt</td>
                    <td className="py-3 px-4 text-neutral-500">String</td>
                    <td className="py-3 px-4 text-neutral-800">"A cardiologist dictating..."</td>
                    <td className="py-3 px-4 text-neutral-600 font-sans">Initializes specialty domain context in decoder</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-black">keyterms_prompt</td>
                    <td className="py-3 px-4 text-neutral-500">JSON Array</td>
                    <td className="py-3 px-4 text-neutral-800">["Atorvastatin", "Clopidogrel", ...]</td>
                    <td className="py-3 px-4 text-neutral-600 font-sans">Pins high-risk pharmacology and ICD-10 diagnostic codes</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-black">llm_instruction</td>
                    <td className="py-3 px-4 text-neutral-500">String</td>
                    <td className="py-3 px-4 text-neutral-800">"Format into formal SOAP note..."</td>
                    <td className="py-3 px-4 text-neutral-600 font-sans">Instructs single-pass model to strip disfluency and structure sections</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-black">language_code</td>
                    <td className="py-3 px-4 text-neutral-500">String</td>
                    <td className="py-3 px-4 text-neutral-800">en, es, fr, de, hi, ja...</td>
                    <td className="py-3 px-4 text-neutral-600 font-sans">Selects acoustic language model across 18 supported global locales</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 6: ACRONYMS & MEDICAL GLOSSARY ================= */}
        {activeTab === 'glossary' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-display font-bold text-black tracking-tight flex items-center gap-2">
                  <span>Clinical &amp; Technical Acronyms Glossary</span>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-lg bg-neutral-100 text-neutral-700 border border-neutral-200 font-semibold">
                    Interactive Tooltips Enabled
                  </span>
                </h2>
                <p className="text-xs text-neutral-600 leading-relaxed mt-1 max-w-2xl">
                  Hover over or tap any acronym across Curie to view its full medical definition and clinical explanation in plain English.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={glossarySearch}
                  onChange={(e) => setGlossarySearch(e.target.value)}
                  placeholder="Search acronym or term..."
                  className="w-full bg-white border border-neutral-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:border-black shadow-2xs font-sans"
                />
              </div>
            </div>

            {/* Glossary Table */}
            <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-700 font-mono text-[11px] uppercase tracking-wider">
                      <th className="py-3.5 px-5 font-semibold w-28">Term</th>
                      <th className="py-3.5 px-5 font-semibold w-64">Full Form</th>
                      <th className="py-3.5 px-5 font-semibold w-36">Category</th>
                      <th className="py-3.5 px-5 font-semibold">Plain-English Meaning &amp; Clinical Context</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 text-neutral-800">
                    {Object.values(CLINICAL_TERMS)
                      .filter((item) => {
                        if (!glossarySearch.trim()) return true
                        const q = glossarySearch.toLowerCase()
                        return (
                          item.term.toLowerCase().includes(q) ||
                          item.fullForm.toLowerCase().includes(q) ||
                          item.description.toLowerCase().includes(q) ||
                          item.category.toLowerCase().includes(q)
                        )
                      })
                      .map((item) => (
                        <tr key={item.term} className="hover:bg-neutral-50/80 transition-colors">
                          <td className="py-3.5 px-5 font-mono font-bold text-black">
                            <TermTooltip term={item.term} showIcon={true}>
                              {item.term}
                            </TermTooltip>
                          </td>
                          <td className="py-3.5 px-5 font-semibold text-black">
                            {item.fullForm}
                          </td>
                          <td className="py-3.5 px-5">
                            <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200">
                              {item.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 text-xs text-neutral-600 leading-relaxed font-sans">
                            {item.description}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Interactive Tooltip Demonstration Callout */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-black shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-black">
                  Interactive Contextual Tooltips in Clinical Practice
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed mt-0.5">
                  Words with a subtle dotted underline (e.g.{' '}
                  <TermTooltip term="ASR">ASR</TermTooltip>,{' '}
                  <TermTooltip term="SOAP">SOAP</TermTooltip>,{' '}
                  <TermTooltip term="EHR">EHR</TermTooltip>,{' '}
                  <TermTooltip term="FHIR">FHIR</TermTooltip>,{' '}
                  <TermTooltip term="PTT">PTT</TermTooltip>,{' '}
                  <TermTooltip term="RMS">RMS</TermTooltip>,{' '}
                  <TermTooltip term="ICD-10">ICD-10</TermTooltip>,{' '}
                  <TermTooltip term="DAPT">DAPT</TermTooltip>) reveal instant contextual popovers on hover or touch, ensuring healthcare administrative staff, junior doctors, and non-specialists understand every abbreviation.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
