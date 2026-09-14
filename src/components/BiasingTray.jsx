import React, { useState } from 'react'
import { Plus, Tag, ShieldCheck, Check, Sparkles, X } from 'lucide-react'

export default function BiasingTray({
  activeEncounter,
  keyterms,
  onAddKeyterm,
  onRemoveKeyterm,
  onResetKeyterms
}) {
  const [newTermInput, setNewTermInput] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  const handleAdd = (e) => {
    e.preventDefault()
    const trimmed = newTermInput.trim()
    if (!trimmed) return
    if (!keyterms.includes(trimmed)) {
      onAddKeyterm(trimmed)
    }
    setNewTermInput('')
  }

  // Categorize terms based on common patterns
  const categorizeTerm = (term) => {
    if (/^(ICD-10|[A-Z]\d{2})/i.test(term)) return 'icd'
    if (/(statin|pril|lol|grel|erol|sone|naproxen|aspirin|coq10|mg|albuterol|prednisolone)/i.test(term)) return 'pharma'
    if (/(lad|lvef|pefr|lachman|acl|knee|cardiac|lung|patella|meniscus|effusion|stent)/i.test(term)) return 'anatomy'
    return 'clinical'
  }

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'icd':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
      case 'pharma':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
      case 'anatomy':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30'
      default:
        return 'bg-slate-800 text-slate-300 border-white/10'
    }
  }

  const filteredTerms = keyterms.filter((term) => {
    if (filterCategory === 'all') return true
    return categorizeTerm(term) === filterCategory
  })

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white tracking-wide">
                Universal-3.5 Pro Acoustic Biasing Dictionary
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {keyterms.length} active terms
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Fed directly to AssemblyAI <code className="text-slate-300 font-mono text-[11px] bg-white/5 px-1 py-0.5 rounded">keyterms_prompt</code> to force zero-error phonetic decoding of complex pharmacological & ICD nomenclature.
            </p>
          </div>
        </div>

        {/* Categories Filter */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-900/60 p-1 rounded-lg border border-white/[0.05]">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
              filterCategory === 'all'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({keyterms.length})
          </button>
          <button
            onClick={() => setFilterCategory('pharma')}
            className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
              filterCategory === 'pharma'
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            Rx
          </button>
          <button
            onClick={() => setFilterCategory('icd')}
            className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
              filterCategory === 'icd'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-cyan-300'
            }`}
          >
            ICD-10
          </button>
          <button
            onClick={() => setFilterCategory('anatomy')}
            className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
              filterCategory === 'anatomy'
                ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-amber-300'
            }`}
          >
            Anatomy
          </button>
        </div>
      </div>

      {/* Pill Badges Grid */}
      <div className="pt-4 flex flex-wrap gap-2 items-center min-h-[56px]">
        {filteredTerms.map((term) => {
          const cat = categorizeTerm(term)
          const badgeClass = getCategoryBadgeClass(cat)
          return (
            <span
              key={term}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-medium border transition-all hover:brightness-110 group ${badgeClass}`}
            >
              <ShieldCheck className="w-3.5 h-3.5 opacity-70" />
              <span>{term}</span>
              <button
                onClick={() => onRemoveKeyterm(term)}
                title="Remove keyterm"
                className="opacity-40 hover:opacity-100 hover:text-rose-400 transition-opacity ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )
        })}

        {filteredTerms.length === 0 && (
          <div className="text-xs text-slate-500 italic py-2">
            No terms matching current category filter.
          </div>
        )}
      </div>

      {/* Add Custom Term Input Bar */}
      <form onSubmit={handleAdd} className="mt-4 pt-3 border-t border-white/[0.04] flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={newTermInput}
            onChange={(e) => setNewTermInput(e.target.value)}
            placeholder="Add custom drug name, rare pathology, or ICD-10 code (e.g. Empagliflozin, L40.0)..."
            className="w-full bg-slate-950/60 border border-white/[0.08] focus:border-emerald-500/50 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={!newTermInput.trim()}
          className="tactile-btn px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-200 rounded-xl text-xs font-medium border border-white/10 flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span>Add to Prompt</span>
        </button>
        <button
          type="button"
          onClick={onResetKeyterms}
          title="Reset to default encounter keyterms"
          className="text-xs text-slate-500 hover:text-slate-300 px-2 py-2 transition-colors font-mono"
        >
          Reset
        </button>
      </form>
    </div>
  )
}
