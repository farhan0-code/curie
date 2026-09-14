import React from 'react'
import {
  ArrowLeft,
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
  Zap
} from 'lucide-react'
import CurieLogo from './CurieLogo'

export default function WorkspaceSidebar({
  isOpen,
  onClose,
  onBackToLanding,
  encounters,
  activeEncounterId,
  onSelectEncounter,
  supportedLanguages,
  selectedLanguage,
  onSelectLanguage,
  onOpenLexicon,
  onOpenExport,
  keytermsCount = 0
}) {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-neutral-200 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Brand */}
        <div className="flex flex-col">
          {/* Brand Row */}
          <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CurieLogo className="w-7 h-7 shrink-0" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-lg tracking-tight text-black">
                    Curie
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-800 border border-neutral-200 font-semibold">
                    v1.0 Pro
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 font-medium truncate max-w-[140px]">
                  Clinical Workspace
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Back to landing button */}
              <button
                onClick={onBackToLanding}
                className="p-1.5 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
                title="Return to Overview"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              {/* Close button for mobile */}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors lg:hidden"
                title="Close Sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Back to Landing Link */}
          <div className="px-3 pt-3 pb-1">
            <button
              onClick={onBackToLanding}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-neutral-600 hover:text-black hover:bg-neutral-100 border border-transparent hover:border-neutral-200 transition-all"
            >
              <div className="flex items-center gap-2">
                <ArrowLeft className="w-3.5 h-3.5 text-neutral-500" />
                <span>Product Overview</span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">Landing &rarr;</span>
            </button>
          </div>

          {/* Patient Queue / Encounters */}
          <div className="px-3 pt-3">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
                Patient Queue
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-600 border border-neutral-200 font-semibold">
                {encounters.length} Encounters
              </span>
            </div>

            <div className="space-y-1.5">
              {encounters.map((enc) => {
                const isActive = enc.id === activeEncounterId
                const p = enc.patient
                const initials = p.name.split(' ').map((n) => n[0]).join('')
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
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                            isActive
                              ? 'bg-black text-white'
                              : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                          }`}
                        >
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-black truncate flex items-center gap-1.5">
                            <span className="truncate">{p.name}</span>
                            {isActive && (
                              <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 animate-pulse" />
                            )}
                          </div>
                          <div className="text-[10px] text-neutral-500 font-mono truncate">
                            {p.age}yo {p.gender} • {p.mrn}
                          </div>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-3.5 h-3.5 shrink-0 mt-1 transition-transform ${
                          isActive ? 'text-black translate-x-0.5' : 'text-neutral-400'
                        }`}
                      />
                    </div>
                    <div className="mt-1.5 pl-9 text-[11px] text-neutral-600 font-medium truncate">
                      {enc.specialty}: {enc.title.split(':')[1] || enc.title}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Acoustic & Configuration Settings */}
          <div className="px-3 pt-5">
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
                    <div className="text-xs font-semibold text-black">Export EHR / FHIR</div>
                    <div className="text-[10px] text-neutral-500 font-mono">
                      Epic • FHIR R4 • Cerner
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Engine Telemetry Card & Footer */}
        <div className="p-3 border-t border-neutral-200 space-y-2">
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
