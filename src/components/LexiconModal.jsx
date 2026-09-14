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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      {/* Modal Card */}
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-black shrink-0 shadow-2xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-xl font-semibold text-slate-900">
                  Acoustic Biasing Lexicon Benchmark
                </h3>
                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-neutral-100 text-black border border-neutral-200">
                  Universal-3.5 Pro
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Empirical benchmark: standard un-biased ASR phonetic hallucinations vs. Curie domain-biased clinical transcription.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="px-6 py-3.5 border-b border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search medical terminology..."
              className="w-full bg-neutral-50 border border-neutral-200 focus:border-black focus:bg-white rounded-xl pl-9 pr-3.5 py-2 text-xs text-black placeholder-neutral-400 focus:outline-none transition-all font-mono"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-neutral-200 text-black border border-black font-bold shadow-xs'
                    : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-y-auto p-6 space-y-3 bg-neutral-50/50">
          {filteredItems.map((item, idx) => (
            <div
              key={idx}
              className="border border-neutral-200 rounded-2xl p-4 bg-white hover:border-neutral-400 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs"
            >
              {/* Term & Category */}
              <div className="md:w-1/4">
                <div className="text-sm font-bold text-black font-mono">{item.term}</div>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-medium bg-neutral-100 text-neutral-700 border border-neutral-200">
                  {item.category}
                </span>
              </div>

              {/* Comparison: Generic ASR vs Biased */}
              <div className="md:w-2/5 flex items-center gap-3">
                {/* Generic ASR Error */}
                <div className="flex-1 p-2.5 rounded-xl bg-neutral-100 border border-neutral-200">
                  <div className="flex items-center gap-1 text-[10px] uppercase font-mono text-neutral-500 font-bold mb-1">
                    <AlertTriangle className="w-3 h-3 text-neutral-600" /> Generic ASR Error
                  </div>
                  <div className="text-xs font-mono text-neutral-500 line-through font-medium">
                    "{item.genericAsrError}"
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-neutral-400 shrink-0" />

                {/* Curie Biased Output */}
                <div className="flex-1 p-2.5 rounded-xl bg-neutral-100 text-black border-2 border-black">
                  <div className="flex items-center gap-1 text-[10px] uppercase font-mono text-black font-bold mb-1">
                    <ShieldCheck className="w-3 h-3 text-black" /> Curie Biased
                  </div>
                  <div className="text-xs font-mono text-black font-bold">
                    {item.biasedOutput}
                  </div>
                </div>
              </div>

              {/* Clinical Risk */}
              <div className="md:w-1/3 text-xs text-neutral-600 leading-relaxed border-t md:border-t-0 md:border-l border-neutral-200 pt-2 md:pt-0 md:pl-4">
                <span className="text-neutral-400 text-[10px] uppercase font-mono font-bold block mb-0.5">Clinical Risk</span>
                {item.risk}
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-neutral-500 text-sm">
              No medical terms matched your query.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
            <span className="font-medium text-black">Active in all Curie dictation sessions via AssemblyAI Dictation API</span>
          </div>
          <button
            onClick={onClose}
            className="tactile-btn px-5 py-2 rounded-xl bg-white hover:bg-neutral-100 text-black border-2 border-black font-bold transition-all shadow-xs"
          >
            Close Lexicon
          </button>
        </div>
      </div>
    </div>
  )
}
