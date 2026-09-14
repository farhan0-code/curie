import React from 'react'
import { Stethoscope, Activity, Sparkles, BookOpen } from 'lucide-react'

export default function Navbar({ onOpenLexicon, activeEncounter }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-obsidian-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sage-500/10 border border-sage-500/25 flex items-center justify-center text-sage-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <Stethoscope className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white font-sans">
                Curie
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-300 border border-white/[0.08]">
                v1.0
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 hidden sm:block">
              Ambient Clinical Voice Scribe &amp; SOAP Engine
            </p>
          </div>
        </div>

        {/* Engine Status & Quick Actions */}
        <div className="flex items-center gap-3">
          {/* Universal-3.5 Pro Engine Status Pill */}
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/90 border border-white/[0.08] text-[11px] font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sage-500"></span>
            </span>
            <span className="text-slate-300">AssemblyAI</span>
            <span className="text-slate-500">•</span>
            <span className="text-sage-400 font-medium">Universal-3.5 Pro</span>
          </div>

          {/* Lexicon Inspector Button */}
          <button
            onClick={onOpenLexicon}
            className="tactile-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/[0.08] text-xs font-medium text-slate-300 hover:text-white hover:border-white/20 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-sage-400" />
            <span className="hidden sm:inline">Phonetic Biasing Lexicon</span>
            <span className="sm:hidden">Lexicon</span>
          </button>

          {/* GitHub Link */}
          <a
            href="https://github.com/farhan0-code/curie"
            target="_blank"
            rel="noreferrer"
            className="tactile-btn p-2 rounded-lg bg-slate-900 border border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20 transition-colors"
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
