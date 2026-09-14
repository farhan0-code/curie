import React from 'react'
import { Activity, Sparkles, BookOpen, ExternalLink, ArrowRight } from 'lucide-react'
import CurieLogo from './CurieLogo'

export default function Navbar({ onOpenLexicon, activeEncounter, activeView, onSelectView }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <CurieLogo className="w-8 h-8 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-black font-sans">
                Curie
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-800 font-semibold border border-neutral-200">
                v1.0 Pro
              </span>
            </div>
            <p className="text-[11px] font-medium text-neutral-500 hidden sm:block">
              Ambient Clinical Voice Intelligence &amp; Workspace
            </p>
          </div>
        </div>

        {/* View Switcher Navigation (Overview vs Workspace) */}
        <div className="hidden md:flex items-center gap-1 p-1 bg-neutral-100 rounded-xl border border-neutral-200">
          <button
            onClick={() => onSelectView('landing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeView === 'landing'
                ? 'bg-white text-black shadow-xs font-semibold'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            Platform Overview
          </button>
          <button
            onClick={() => onSelectView('cockpit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'cockpit' || activeView === 'workspace'
                ? 'bg-neutral-200 text-black border border-black font-bold shadow-xs'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
            </span>
            <span>Clinical Workspace</span>
          </button>
        </div>

        {/* Engine Status & Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Universal-3.5 Pro Engine Status Pill */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-[11px] font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
            </span>
            <span className="text-neutral-500">AssemblyAI</span>
            <span className="text-neutral-300">•</span>
            <span className="text-black font-bold">Universal-3.5 Pro</span>
          </div>

          {/* Lexicon Inspector Button */}
          <button
            onClick={onOpenLexicon}
            className="tactile-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-black shadow-xs transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-black" />
            <span className="hidden sm:inline">Clinical Lexicon</span>
            <span className="sm:hidden">Lexicon</span>
          </button>

          {/* GitHub Link */}
          <a
            href="https://github.com/farhan0-code/curie"
            target="_blank"
            rel="noreferrer"
            className="tactile-btn p-2 rounded-lg bg-white border border-neutral-200 text-neutral-600 hover:text-black hover:bg-neutral-50 shadow-xs transition-colors"
            title="GitHub Repository"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  )
}
