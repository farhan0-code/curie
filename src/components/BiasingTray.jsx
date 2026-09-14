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
        return 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100'
      case 'pharma':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
      case 'anatomy':
        return 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
    }
  }

  const filteredTerms = keyterms.filter((term) => {
    if (filterCategory === 'all') return true
    return categorizeTerm(term) === filterCategory
  })

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 tracking-wide font-sans">
                Universal-3.5 Pro Acoustic Biasing Dictionary
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {keyterms.length} terms locked
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Fed directly to AssemblyAI <code className="text-slate-700 font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-semibold">keyterms_prompt</code> to force zero-error phonetic decoding of complex pharmacological & ICD-10 nomenclature.
            </p>
          </div>
        </div>

        {/* Categories Filter */}
        <div className="flex items-center gap-1 self-start sm:self-auto bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
              filterCategory === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({keyterms.length})
          </button>
          <button
            onClick={() => setFilterCategory('pharma')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
              filterCategory === 'pharma'
                ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            Rx
          </button>
          <button
            onClick={() => setFilterCategory('icd')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
              filterCategory === 'icd'
                ? 'bg-sky-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-sky-700'
            }`}
          >
            ICD-10
          </button>
          <button
            onClick={() => setFilterCategory('anatomy')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
              filterCategory === 'anatomy'
                ? 'bg-amber-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-amber-700'
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
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-medium border transition-all shadow-2xs group ${badgeClass}`}
            >
              <ShieldCheck className="w-3.5 h-3.5 opacity-80" />
              <span>{term}</span>
              <button
                onClick={() => onRemoveKeyterm(term)}
                title="Remove keyterm"
                className="opacity-40 hover:opacity-100 hover:text-rose-600 transition-opacity ml-1"
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
      <form onSubmit={handleAdd} className="mt-4 pt-3.5 border-t border-slate-100 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={newTermInput}
            onChange={(e) => setNewTermInput(e.target.value)}
            placeholder="Add custom drug name, rare pathology, or ICD-10 code (e.g. Empagliflozin, L40.0)..."
            className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/15 transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={!newTermInput.trim()}
          className="tactile-btn px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all shadow-xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span>Add to Prompt</span>
        </button>
        <button
          type="button"
          onClick={onResetKeyterms}
          title="Reset to default encounter keyterms"
          className="text-xs text-slate-500 hover:text-slate-800 px-2 py-2 transition-colors font-mono shrink-0 font-medium"
        >
          Reset
        </button>
      </form>
    </div>
  )
}
