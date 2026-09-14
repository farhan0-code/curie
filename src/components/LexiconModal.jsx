import React, { useState, useEffect } from 'react'
import { X, Search, AlertTriangle, ShieldCheck, ArrowRight, BookOpen, Check } from 'lucide-react'
import { MEDICAL_LEXICON } from '../data/medicalLexicon'

export default function LexiconModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Extract unique categories
  const categories = ['all', ...new Set(MEDICAL_LEXICON.map((item) => item.category))]

  const filteredItems = MEDICAL_LEXICON.filter((item) => {
    const matchesSearch =
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.genericAsrError.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.biasedOutput.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.risk.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      {/* Modal Card */}
      <div className="bg-slate-900 border border-white/[0.12] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[0_16px_64px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/[0.08] flex items-start justify-between gap-4 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white">
                  Acoustic Biasing Lexicon Benchmark
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Universal-3.5 Pro STT
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Side-by-side empirical comparison: standard un-biased ASR phonetic hallucinations vs. Curie domain-biased clinical transcription.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="px-6 py-3.5 border-b border-white/[0.06] bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search medical terminology..."
              className="w-full bg-slate-950/60 border border-white/[0.08] focus:border-emerald-500/50 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-y-auto p-6 space-y-3">
          {filteredItems.map((item, idx) => (
            <div
              key={idx}
              className="border border-white/[0.06] rounded-xl p-4 bg-slate-950/40 hover:border-white/[0.12] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Term & Category */}
              <div className="md:w-1/4">
                <div className="text-sm font-semibold text-slate-100 font-mono">{item.term}</div>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-white/5">
                  {item.category}
                </span>
              </div>

              {/* Comparison: Generic ASR vs Biased */}
              <div className="md:w-2/5 flex items-center gap-3">
                {/* Generic ASR Error */}
                <div className="flex-1 p-2 rounded-lg bg-rose-950/20 border border-rose-500/20">
                  <div className="flex items-center gap-1 text-[10px] uppercase font-mono text-rose-400 font-semibold mb-1">
                    <AlertTriangle className="w-3 h-3" /> Generic ASR Error
                  </div>
                  <div className="text-xs font-mono text-rose-300 line-through opacity-80">
                    "{item.genericAsrError}"
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />

                {/* Curie Biased Output */}
                <div className="flex-1 p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/30">
                  <div className="flex items-center gap-1 text-[10px] uppercase font-mono text-emerald-400 font-semibold mb-1">
                    <ShieldCheck className="w-3 h-3" /> Curie Biased
                  </div>
                  <div className="text-xs font-mono text-emerald-300 font-medium">
                    {item.biasedOutput}
                  </div>
                </div>
              </div>

              {/* Clinical Risk */}
              <div className="md:w-1/3 text-xs text-slate-400 leading-relaxed border-t md:border-t-0 md:border-l border-white/[0.06] pt-2 md:pt-0 md:pl-4">
                <span className="text-slate-500 text-[10px] uppercase font-mono block mb-0.5">Clinical Risk</span>
                {item.risk}
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-sm">
              No medical terms matched your query.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/[0.08] bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active in all Curie dictation sessions via AssemblyAI Dictation API</span>
          </div>
          <button
            onClick={onClose}
            className="tactile-btn px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 font-medium transition-all"
          >
            Close Lexicon
          </button>
        </div>
      </div>
    </div>
  )
}
