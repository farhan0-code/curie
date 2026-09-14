import React, { useState, useRef, useEffect } from 'react'
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
  ChevronDown,
  Check,
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
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false)
  const langDropdownRef = useRef(null)

  // Click outside to close custom language dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setIsLangDropdownOpen(false)
      }
    }
    if (isLangDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isLangDropdownOpen])

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
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-neutral-200 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:h-screen lg:shrink-0 lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:shadow-none'
        }`}
      >
        {/* Top Header & Brand — Exact h-16 to match Main Workspace Top Bar */}
        <div className="h-16 px-4 border-b border-neutral-200 flex items-center justify-between shrink-0">
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
            title="Return to Curie Landing"
          >
            <CurieLogo className="w-7 h-7 shrink-0 group-hover:scale-105 transition-transform" />
            <span className="font-display text-xl tracking-tight text-black font-semibold group-hover:text-neutral-700 transition-colors">
              Curie
            </span>
          </button>

          {/* Close Sidebar (Mobile only) */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-black lg:hidden hover:bg-neutral-100 transition-colors"
            title="Close patient queue"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Clinical Queue & Control Workspace */}
        <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3.5 custom-scrollbar">
          {/* Section 1: Active Encounter Queue Header */}
          <div>
            <div className="flex items-center justify-between px-1 mb-2">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-neutral-600" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
                  Patient Queue
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-neutral-400 font-medium">
                  {encounters.length} Total
                </span>
                <span className="text-[10px] font-mono text-neutral-300">•</span>
                <span className="text-[10px] font-mono text-neutral-400 font-semibold">
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
                    className={`w-full text-left p-2 rounded-xl border transition-all ${
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
                        MRN:{p.mrn.slice(-4)}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Section 2: Clinician Workplace Identity Card */}
          <div>
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
                Attending Clinician
              </span>
              <button
                onClick={onOpenClinicianProfile}
                className="text-[10px] font-semibold text-black hover:underline flex items-center gap-1"
                title="Edit physician workplace profile"
              >
                <Settings className="w-3 h-3 text-neutral-500" />
                <span>Edit</span>
              </button>
            </div>
            <div
              onClick={onOpenClinicianProfile}
              className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 hover:border-neutral-300 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-black font-bold text-xs shrink-0 shadow-2xs">
                  {clinicianProfile.name ? clinicianProfile.name.split(' ')[1]?.[0] || 'D' : 'D'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-xs text-black truncate">
                    {clinicianProfile.name}
                  </div>
                  <div className="text-[10px] text-neutral-500 truncate flex items-center gap-1">
                    <Building2 className="w-3 h-3 shrink-0 text-neutral-400" />
                    <span className="truncate">{clinicianProfile.clinic}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Acoustic Settings & Quick Controls */}
          <div>
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
                Acoustic Settings
              </span>
            </div>

            <div className="space-y-2">
              {/* Custom Scrollable Language Selector Dropdown */}
              <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 relative" ref={langDropdownRef}>
                <div className="flex items-center justify-between mb-1.5 text-[11px] font-medium text-neutral-600">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-black" />
                    <span>Consultation Language</span>
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400 font-semibold">
                    18 Locales
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsLangDropdownOpen((prev) => !prev)}
                  className="w-full bg-white text-xs font-semibold text-black border border-neutral-200 rounded-lg py-1.5 px-2.5 focus:outline-none focus:border-black cursor-pointer shadow-2xs flex items-center justify-between transition-colors hover:border-neutral-300"
                >
                  <span className="truncate">
                    {supportedLanguages.find((l) => l.code === selectedLanguage)?.label || selectedLanguage}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-neutral-500 transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLangDropdownOpen && (
                  <div className="absolute left-2.5 right-2.5 mt-1.5 z-50 bg-white border border-neutral-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-1 max-h-48 overflow-y-auto space-y-0.5 custom-scrollbar">
                      {supportedLanguages.map((lang) => {
                        const isSelected = lang.code === selectedLanguage
                        return (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => {
                              onSelectLanguage(lang.code)
                              setIsLangDropdownOpen(false)
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                              isSelected
                                ? 'bg-black text-white font-bold'
                                : 'text-neutral-700 hover:bg-neutral-100 hover:text-black font-medium'
                            }`}
                          >
                            <span className={isSelected ? 'text-white font-bold' : 'text-black'}>
                              {lang.label}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1.5" />}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom System Status Bar */}
        <div className="p-3 border-t border-neutral-200 bg-neutral-50/70 space-y-2 shrink-0">
          <div className="p-2.5 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-black font-mono">
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
            <span>AssemblyAI Speech Intelligence</span>
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
