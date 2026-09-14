import React from 'react'
import {
  Users,
  Globe,
  BookOpen,
  Share2,
  Sparkles,
  Activity,
  Heart,
  Stethoscope,
  X,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Zap,
  Building2,
  Settings
} from 'lucide-react'
import CurieLogo from './CurieLogo'
import TermTooltip from './TermTooltip'

export default function WorkspaceSidebar({
  isOpen,
  onClose,
  onBackToLanding,
  onNavigateToDocs,
  encounters,
  activeEncounterId,
  onSelectEncounter,
  selectedLanguage,
  onSelectLanguage,
  supportedLanguages,
  onOpenLexicon,
  onOpenExport,
  onOpenNewPatient,
  onOpenClinicianProfile,
  clinicianProfile = { name: 'Dr. Evelyn Vance, MD, FACC', clinic: 'Metropolitan Outpatient Care Center' },
  keytermsCount = 0
}) {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Persistent Left Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-neutral-200 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:shadow-none'
        }`}
      >
        {/* Top Header & Brand — Exact h-16 to match Main Workspace Top Bar */}
        <div className="h-16 px-4 border-b border-neutral-200 flex items-center justify-between shrink-0">
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity text-left cursor-pointer"
            title="Return to Product Overview"
          >
            <CurieLogo className="w-6 h-6 shrink-0" />
            <div>
              <span className="font-display font-bold text-base tracking-tight text-black block leading-none mb-0.5">
                Curie
              </span>
              <p className="text-[11px] text-neutral-500 font-medium truncate">
                Clinical Workspace
              </p>
            </div>
          </button>

          {/* Close button for mobile only */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors lg:hidden"
            title="Close Sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Middle Container */}
        <div className="flex-1 overflow-y-auto">
          {/* Patient Queue / Encounters */}
          <div className="px-3 pt-3">
            <div className="flex items-center justify-between px-3 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
                  Patient Queue
                </span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                  3 Demos
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              {encounters.map((enc) => {
                const isActive = enc.id === activeEncounterId
                const p = enc.patient
                const initials = p.name.split(' ').map((n) => n[0]).join('')
                const isDemo = ['cardiology-stemi-followup', 'pediatric-asthma-exacerbation', 'ortho-sports-knee'].includes(enc.id) || !enc.id.startsWith('custom-')
                return (
                  <button
                    key={enc.id}
                    onClick={() => {
                      onSelectEncounter(enc.id)
                      if (onClose) onClose()
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-neutral-100/90 border-black shadow-2xs text-black'
                        : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center ${
                            isActive
                              ? 'bg-black text-white'
                              : 'bg-neutral-100 text-neutral-800 border border-neutral-200'
                          }`}
                        >
                          {initials}
                        </div>
                        <span className="font-semibold text-xs text-black truncate max-w-[110px]">
                          {p.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isDemo ? (
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                              isActive
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            Demo
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Live
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-neutral-500">
                          {p.age}yo {p.gender[0]}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-neutral-500">
                      <span className="truncate max-w-[130px] font-medium">
                        {enc.specialty.split(' ')[0]}
                      </span>
                      <span className="font-mono text-[10px] text-neutral-400">
                        {isDemo ? 'Pre-recorded' : p.mrn}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Acoustic & Configuration Settings */}
          <div className="px-3 pt-5 pb-3">
            <div className="px-3 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
                Acoustic Settings
              </span>
            </div>

            <div className="space-y-2">
              {/* Language Selector Dropdown */}
              <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
                <div className="flex items-center justify-between mb-1.5 text-[11px] font-medium text-neutral-600">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-black" />
                    <span>Consultation Language</span>
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400 font-semibold">
                    18 Locales
                  </span>
                </div>
                <select
                  value={selectedLanguage}
                  onChange={(e) => onSelectLanguage(e.target.value)}
                  className="w-full bg-white text-xs font-semibold text-black border border-neutral-200 rounded-lg py-1.5 px-2.5 focus:outline-none focus:border-black cursor-pointer shadow-2xs"
                >
                  {supportedLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Docs Navigation Trigger */}
              {onNavigateToDocs && (
                <button
                  onClick={onNavigateToDocs}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-200 transition-colors text-left group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-black">
                      <BookOpen className="w-3.5 h-3.5 text-black" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-black">Docs</div>
                      <div className="text-[10px] text-neutral-500 font-mono">
                        Reference Benchmarks
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                </button>
              )}

              {/* Phonetic Lexicon Trigger */}
              <button
                onClick={onOpenLexicon}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 transition-colors text-left group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-black shadow-2xs">
                    <BookOpen className="w-3.5 h-3.5 text-black" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-black">Clinical Lexicon</div>
                    <div className="text-[10px] text-neutral-500 font-mono">
                      {keytermsCount} Invariants Pinned
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Quick Export Trigger */}
              <button
                onClick={onOpenExport}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-200 text-black transition-all shadow-2xs group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-black">
                    <Share2 className="w-3.5 h-3.5 text-black" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-semibold text-black">Export <TermTooltip term="EHR">EHR</TermTooltip> / <TermTooltip term="FHIR">FHIR</TermTooltip></div>
                    <div className="text-[10px] text-neutral-500 font-mono">
                      Epic • <TermTooltip term="FHIR">FHIR R4</TermTooltip> • Cerner
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Engine Telemetry Card & Footer */}
        <div className="p-3 border-t border-neutral-200 space-y-2 shrink-0">
          {/* Clinician Workplace Profile Card */}
          <button
            onClick={onOpenClinicianProfile}
            className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-200 transition-colors shadow-2xs group cursor-pointer"
            title="Clinician Workplace Profile Settings"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-black shrink-0">
                  <Building2 className="w-3.5 h-3.5 text-black" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-black truncate">
                    {clinicianProfile?.name || 'Dr. Evelyn Vance, MD'}
                  </div>
                  <div className="text-[10px] text-neutral-500 truncate">
                    {clinicianProfile?.clinic || 'Metropolitan Outpatient Care'}
                  </div>
                </div>
              </div>
              <Settings className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black transition-colors shrink-0" />
            </div>
          </button>

          {/* Engine Status Card */}
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
                </span>
                <span className="text-[11px] font-bold text-black font-mono">
                  Universal-3.5 Pro
                </span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white text-neutral-700 border border-neutral-200 font-semibold">
                Single-Pass
              </span>
            </div>
            <p className="text-[10px] text-neutral-500 leading-tight">
              Acoustic biasing active via AssemblyAI Dictation API.
            </p>
          </div>

          <div className="flex items-center justify-between px-1 text-[11px] text-neutral-400">
            <span>AssemblyAI Voice Hackathon</span>
            <a
              href="https://github.com/farhan0-code/curie"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-600 hover:text-black flex items-center gap-1"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </aside>
    </>
  )
}
