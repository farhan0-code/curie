import React, { useState } from 'react'
import { Plus, Tag, ShieldCheck, Check, Sparkles, X, RotateCcw } from 'lucide-react'

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
        return 'bg-neutral-100 text-black border-neutral-200 hover:bg-neutral-200'
      case 'pharma':
        return 'bg-neutral-100 text-black border-neutral-200 hover:bg-neutral-200'
      case 'anatomy':
        return 'bg-neutral-100 text-black border-neutral-200 hover:bg-neutral-200'
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200/70'
    }
  }

  const filteredTerms = keyterms.filter((term) => {
    if (filterCategory === 'all') return true
    return categorizeTerm(term) === filterCategory
  })

  return (
    <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-black shrink-0">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-black tracking-wide font-sans">
                Universal-3.5 Pro Acoustic Biasing Dictionary
              </h3>
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-semibold bg-neutral-100 text-black border border-neutral-200">
                {keyterms.length} terms locked
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Fed directly to AssemblyAI <code className="text-black font-mono text-[11px] bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200 font-semibold">keyterms_prompt</code> to eliminate phonetic hallucinations of pharmacology & ICD-10 codes.
            </p>
          </div>
        </div>

        {/* Categories Filter */}
        <div className="flex items-center gap-1 self-start sm:self-auto bg-neutral-100 p-1 rounded-xl border border-neutral-200">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
              filterCategory === 'all'
                ? 'bg-neutral-200 text-black border border-black font-bold shadow-xs'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            All ({keyterms.length})
          </button>
          <button
            onClick={() => setFilterCategory('pharma')}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
              filterCategory === 'pharma'
                ? 'bg-neutral-200 text-black border border-black font-bold shadow-xs'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            Rx
          </button>
          <button
            onClick={() => setFilterCategory('icd')}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
              filterCategory === 'icd'
                ? 'bg-neutral-200 text-black border border-black font-bold shadow-xs'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            ICD-10
          </button>
          <button
            onClick={() => setFilterCategory('anatomy')}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
              filterCategory === 'anatomy'
                ? 'bg-neutral-200 text-black border border-black font-bold shadow-xs'
                : 'text-neutral-600 hover:text-black'
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
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-medium border transition-all group shadow-2xs ${badgeClass}`}
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
          <div className="text-xs text-neutral-500 italic py-2">
            No terms matching current category filter.
          </div>
        )}
      </div>

      {/* Add Custom Term Input Bar */}
      <form onSubmit={handleAdd} className="mt-4 pt-3.5 border-t border-neutral-100 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={newTermInput}
            onChange={(e) => setNewTermInput(e.target.value)}
            placeholder="Add custom drug name, diagnostic code, or anatomy..."
            className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-black placeholder-slate-400 focus:outline-none focus:bg-white focus:border-black transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={!newTermInput.trim()}
          className="tactile-btn px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-black border-2 border-black text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add to Biasing</span>
        </button>

        <button
          type="button"
          onClick={onResetKeyterms}
          title="Reset keyterms to encounter baseline"
          className="tactile-btn p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-500 hover:text-neutral-800 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  )
}
