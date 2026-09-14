import React, { useState, useMemo } from 'react'
import {
  BookOpen,
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
  HelpCircle,
  Code,
  Menu,
  X,
  Lock,
  Cpu,
  Terminal
} from 'lucide-react'
import CurieLogo from '../components/CurieLogo'
import { CLINICAL_TERMS } from '../components/TermTooltip'
import { CLINICAL_ENCOUNTERS } from '../data/clinicalEncounters'

const DOCS_NAV_GROUPS = [
  {
    group: 'GETTING STARTED',
    items: [
      { id: 'intro', label: 'Introduction & Overview', icon: Sparkles },
      { id: 'getting-started', label: 'Clinician Workflow & Setup', icon: Activity }
    ]
  },
  {
    group: 'CLINICAL BENCHMARKS',
    items: [
      { id: 'demos', label: '3 Benchmark Encounters', icon: Heart },
      { id: 'multilingual', label: 'Multilingual Dictation (18 Locales)', icon: Globe }
    ]
  },
  {
    group: 'ACOUSTIC ARCHITECTURE',
    items: [
      { id: 'biasing', label: 'Acoustic Keyterm Biasing', icon: ShieldCheck },
      { id: 'pipeline', label: 'Single-Pass SOAP Pipeline', icon: Layers }
    ]
  },
  {
    group: 'EHR INTEROPERABILITY',
    items: [
      { id: 'ehr', label: 'Multi-EHR Export Formats', icon: Share2 },
      { id: 'fhir-spec', label: 'HL7 FHIR R4 JSON Resource', icon: FileText }
    ]
  },
  {
    group: 'SPECIFICATION & GLOSSARY',
    items: [
      { id: 'api', label: 'AssemblyAI Dictation API Spec', icon: Zap },
      { id: 'glossary', label: 'Acronyms & Medical Glossary', icon: HelpCircle }
    ]
  }
]

export default function DocsPage({ onBackToLanding, onLaunchWorkspace, onSelectEncounter }) {
  const [activeTab, setActiveTab] = useState('intro')
  const [activeDemoIdx, setActiveDemoIdx] = useState(0)
  const [copiedFormat, setCopiedFormat] = useState(null)
  const [sidebarFilter, setSidebarFilter] = useState('')
  const [glossarySearch, setGlossarySearch] = useState('')
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const selectedDemo = CLINICAL_ENCOUNTERS[activeDemoIdx] || CLINICAL_ENCOUNTERS[0]

  const handleCopy = (text, formatKey) => {
    navigator.clipboard.writeText(text)
    setCopiedFormat(formatKey)
    setTimeout(() => setCopiedFormat(null), 2500)
  }

  // Filter sidebar navigation items
  const filteredNavGroups = useMemo(() => {
    if (!sidebarFilter.trim()) return DOCS_NAV_GROUPS
    const q = sidebarFilter.toLowerCase()
    return DOCS_NAV_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q) ||
          group.group.toLowerCase().includes(q)
      )
    })).filter((group) => group.items.length > 0)
  }, [sidebarFilter])

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-black font-sans selection:bg-neutral-200">
      {/* ================= TOP NAVIGATION BAR ================= */}
      <header className="border-b border-neutral-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Brand & Back Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="lg:hidden p-2 rounded-xl text-neutral-600 hover:text-black hover:bg-neutral-100 border border-neutral-200 cursor-pointer"
              aria-label="Toggle Documentation Sidebar"
            >
              {isMobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <button
              onClick={onBackToLanding}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
              title="Return to Home"
            >
              <CurieLogo className="w-7 h-7 shrink-0 group-hover:scale-105 transition-transform" />
              <div className="flex items-center gap-2">
                <span className="font-display text-xl tracking-tight text-black font-semibold group-hover:text-neutral-700 transition-colors">
                  Curie
                </span>
              </div>
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            <a
              href="https://github.com/farhan0-code/curie"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-black text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
              title="View Curie on GitHub"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

            <button
              onClick={onLaunchWorkspace}
              className="tactile-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-black hover:bg-neutral-800 text-xs font-bold text-white shadow-xs transition-all cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-white" />
              <span className="text-white font-bold">Open Cockpit</span>
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTAINER WITH DUAL-COLUMN LAYOUT ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex">
        {/* Mobile Backdrop Overlay */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* ================= LEFT SIDEBAR (STICKY ON DESKTOP) ================= */}
        <aside
          className={`fixed lg:sticky top-16 bottom-0 left-0 z-50 lg:z-10 w-72 sm:w-80 shrink-0 bg-white lg:bg-transparent border-r border-neutral-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 h-[calc(100vh-4rem)] overflow-y-auto ${
            isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:shadow-none'
          }`}
        >
          {/* Sidebar Search Filter */}
          <div className="p-4 border-b border-neutral-100 bg-white sticky top-0 z-20">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={sidebarFilter}
                onChange={(e) => setSidebarFilter(e.target.value)}
                placeholder="Filter documentation..."
                className="w-full bg-neutral-50 hover:bg-neutral-100/70 border border-neutral-200 rounded-xl pl-8 pr-3 py-2 text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white shadow-2xs font-sans transition-all"
              />
              {sidebarFilter && (
                <button
                  onClick={() => setSidebarFilter('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Navigation Links Grouped */}
          <div className="p-3 space-y-6 flex-1">
            {filteredNavGroups.map((group) => (
              <div key={group.group} className="space-y-1">
                <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                  {group.group}
                </div>
                <div className="space-y-0.5 pt-1">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.id
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id)
                          setIsMobileSidebarOpen(false)
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer group ${
                          isActive
                            ? 'bg-black text-white shadow-sm font-semibold'
                            : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-neutral-400 group-hover:text-black'}`} />
                          <span className={`truncate ${isActive ? 'text-white font-bold' : ''}`}>
                            {item.label}
                          </span>
                        </div>
                        {isActive && (
                          <ChevronRight className="w-3.5 h-3.5 text-white shrink-0" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Bottom Telemetry Card (Reference Exact Match) */}
          <div className="p-4 border-t border-neutral-200 bg-neutral-50/70 shrink-0 font-mono text-[11px] space-y-2">
            <div className="flex items-center justify-between text-neutral-500">
              <span>Model Engine</span>
              <strong className="text-black font-semibold">Universal-3.5 Pro</strong>
            </div>
            <div className="flex items-center justify-between text-neutral-500">
              <span>Measured Latency</span>
              <strong className="text-black font-semibold">748ms – 809ms</strong>
            </div>
            <div className="flex items-center justify-between text-neutral-500">
              <span>Biasing Slot Limit</span>
              <strong className="text-black font-semibold">100 Keyterms</strong>
            </div>
            <div className="flex items-center justify-between text-neutral-500">
              <span>Supported Langs</span>
              <strong className="text-black font-semibold">18 Languages</strong>
            </div>
          </div>
        </aside>

        {/* ================= RIGHT MAIN DOCUMENTATION PANE ================= */}
        <main className="flex-1 min-w-0 py-8 lg:pl-10 lg:pr-4">
          {/* ================= SECTION 1: INTRODUCTION & OVERVIEW ================= */}
          {(activeTab === 'intro' || activeTab === 'pipeline') && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-bold mb-1.5 flex items-center gap-2">
                  <span>INTRODUCTION &amp; PROBLEM STATEMENT</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-black tracking-tight mb-3">
                  Ambient Outpatient Voice Scribe &amp; SOAP Intelligence Engine
                </h1>
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-3xl">
                  Curie bridges spoken clinical conversation and medical EHR execution. Standard speech-to-text engines fail when clinicians speak multi-syllabic pharmaceuticals and ICD-10 diagnostic entities—turning medical vocabulary into generic phonetic approximations. Curie extracts pre-visit chart context and dynamically biases AssemblyAI's streaming Dictation API for rapid, zero-drift clinical SOAP notes.
                </p>
              </div>

              {/* Dual Acoustic Comparison Cards (Exact reference styling) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Left: The Acoustic Gap */}
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 shadow-2xs space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
                    THE ACOUSTIC GAP
                  </div>
                  <h3 className="font-display font-bold text-base text-rose-700">
                    Generic Speech Recognition
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                    Transcribes multi-syllabic clinical entities as phonetic phonetic approximations, e.g. <span className="font-mono text-neutral-700 bg-white px-1.5 py-0.5 rounded border border-neutral-200 line-through">"a tore the stat in 80"</span> and <span className="font-mono text-neutral-700 bg-white px-1.5 py-0.5 rounded border border-neutral-200 line-through">"cloudy dog grill 75"</span>, risking catastrophic pharmacy dispensing omissions.
                  </p>
                </div>

                {/* Right: The Curie Approach */}
                <div className="p-5 rounded-2xl bg-white border-2 border-black shadow-xs space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
                    THE CURIE APPROACH
                  </div>
                  <h3 className="font-display font-bold text-base text-black flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-black" />
                    <span>Domain-Biased Universal-3.5 Pro</span>
                  </h3>
                  <p className="text-xs text-neutral-700 leading-relaxed font-sans">
                    Patient-specific medications and ICD-10 codes are pre-injected into the acoustic decoder vocabulary via <code className="text-black font-mono font-bold bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200">keyterms_prompt</code>. Exact chemical nomenclature, dosages, and diagnostic structures are guaranteed.
                  </p>
                </div>
              </div>

              {/* 5-Stage Clinical Pipeline */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <h3 className="text-base font-display font-bold text-black">
                    Curie 5-Stage Speech-to-EHR Architecture
                  </h3>
                  <span className="text-[10px] font-mono bg-neutral-100 px-2 py-0.5 rounded-lg border border-neutral-200 text-neutral-700 font-semibold">
                    Sub-Second Turnaround
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { step: '01', title: '16kHz Audio Capture', desc: 'Browser AudioContext streams clean PCM linear mono WAV audio directly from the clinician mic.' },
                    { step: '02', title: 'Lexicon Biasing Tray', desc: 'Pre-loads up to 100 pharmacological and diagnostic terms into decoder beam search vocabulary.' },
                    { step: '03', title: 'Single-Pass Inference', desc: 'AssemblyAI Universal-3.5 Pro transcribes audio and strips conversational hesitations in one pass.' },
                    { step: '04', title: 'SOAP Restructuring', desc: 'Formats verbatim discourse into formal Subjective, Objective, Assessment, and Plan.' },
                    { step: '05', title: 'Multi-EHR Interop', desc: 'Generates HL7 FHIR R4 JSON resources and Epic Hyperspace dot-phrase SmartText exports.' }
                  ].map((s) => (
                    <div key={s.step} className="p-4 rounded-xl bg-neutral-50/70 border border-neutral-200 space-y-1.5">
                      <span className="font-mono text-[10px] font-bold text-neutral-400">STAGE {s.step}</span>
                      <h4 className="text-xs font-bold text-black font-display">{s.title}</h4>
                      <p className="text-[11px] text-neutral-600 leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= SECTION 2: HOW TO USE / WORKFLOW ================= */}
          {activeTab === 'getting-started' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-bold mb-1.5">
                  QUICKSTART &amp; CLINICIAN WORKFLOW
                </div>
                <h1 className="text-3xl font-display font-bold text-black tracking-tight mb-2">
                  Outpatient Doctor Workflow Guide
                </h1>
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
                    desc: 'Hold down Spacebar during consultation, or click "Start Ambient Dictation". The Web Audio meter visualizes live RMS energy and gives gentle silence prompts.'
                  },
                  {
                    step: '04',
                    title: 'Single-Pass SOAP Synthesis',
                    desc: 'Upon releasing Spacebar, Universal-3.5 Pro strips hesitation words and synthesizes formal Subjective, Objective, Assessment, and Plan sections in ~800ms.'
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

          {/* ================= SECTION 3: CLINICAL BENCHMARK DEMOS ================= */}
          {(activeTab === 'demos' || activeTab === 'multilingual') && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-bold mb-1.5">
                  CLINICAL BENCHMARK CASES
                </div>
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <h1 className="text-3xl font-display font-bold text-black tracking-tight">
                    3 Pre-Loaded Benchmark Clinical Encounters
                  </h1>
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
                    <span className="text-white font-bold">Test This Case in Cockpit</span>
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
                    Synthesized Clinical SOAP Note (~800ms SLA)
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

          {/* ================= SECTION 4: ACOUSTIC BIASING DEEP DIVE ================= */}
          {activeTab === 'biasing' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-bold mb-1.5">
                  SPEECH RECOGNITION ARCHITECTURE
                </div>
                <h1 className="text-3xl font-display font-bold text-black tracking-tight mb-2">
                  Specialty Lexicon &amp; Acoustic Biasing Mechanics
                </h1>
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

          {/* ================= SECTION 5: MULTI-EHR INTEROPERABILITY ================= */}
          {(activeTab === 'ehr' || activeTab === 'fhir-spec') && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-bold mb-1.5">
                  ELECTRONIC HEALTH RECORDS
                </div>
                <h1 className="text-3xl font-display font-bold text-black tracking-tight mb-2">
                  Multi-EHR Export Formats &amp; Specifications
                </h1>
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

          {/* ================= SECTION 6: ASSEMBLYAI API SPEC ================= */}
          {activeTab === 'api' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-bold mb-1.5">
                  SPEECH AI SPECIFICATION
                </div>
                <h1 className="text-3xl font-display font-bold text-black tracking-tight mb-2">
                  AssemblyAI Dictation API Protocol
                </h1>
                <p className="text-xs text-neutral-600 leading-relaxed max-w-3xl">
                  Curie uses AssemblyAI's Universal-3.5 Pro Dictation API. It combines acoustic decoding and LLM structuring into a single round-trip, delivering sub-second clinical synthesis.
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

          {/* ================= SECTION 7: ACRONYMS & MEDICAL GLOSSARY ================= */}
          {activeTab === 'glossary' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-bold mb-1.5">
                    CLINICAL ABBREVIATION REFERENCE
                  </div>
                  <h1 className="text-3xl font-display font-bold text-black tracking-tight flex items-center gap-2">
                    <span>Clinical &amp; Technical Acronyms Glossary</span>
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-lg bg-neutral-100 text-neutral-700 border border-neutral-200 font-semibold">
                      {Object.keys(CLINICAL_TERMS).length} Standard Acronyms
                    </span>
                  </h1>
                  <p className="text-xs text-neutral-600 leading-relaxed mt-1 max-w-2xl">
                    Reference directory of specialized clinical abbreviations, pharmacology terminology, and speech recognition architecture specifications.
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={glossarySearch}
                    onChange={(e) => setGlossarySearch(e.target.value)}
                    placeholder="Search acronym or meaning..."
                    className="w-full bg-white border border-neutral-200 rounded-xl pl-8 pr-3 py-2 text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:border-black shadow-2xs font-sans"
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
                              <span className="px-2 py-1 rounded-md bg-neutral-100 border border-neutral-200 text-neutral-900 text-xs font-mono">
                                {item.term}
                              </span>
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
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
