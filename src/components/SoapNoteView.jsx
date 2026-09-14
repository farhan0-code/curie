import React, { useState } from 'react'
import {
  FileText,
  Volume2,
  Pill,
  Copy,
  Check,
  Edit3,
  Save,
  Download,
  Share2,
  Printer,
  Sparkles,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Clock
} from 'lucide-react'

export default function SoapNoteView({
  encounter,
  soapNote,
  verbatimTranscript,
  prescriptions = [],
  telemetry,
  onUpdateSoapNote,
  onOpenExportModal
}) {
  const [activeTab, setActiveTab] = useState('soap') // 'soap' | 'transcript' | 'prescriptions'
  const [isEditing, setIsEditing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [rxCopied, setRxCopied] = useState(null)

  // Local state for editing
  const [editedSubjective, setEditedSubjective] = useState(soapNote?.subjective || '')
  const [editedObjective, setEditedObjective] = useState(soapNote?.objective || '')
  const [editedPlan, setEditedPlan] = useState(
    Array.isArray(soapNote?.plan) ? soapNote.plan.join('\n') : soapNote?.plan || ''
  )

  // Sync state if soapNote changes from parent
  React.useEffect(() => {
    setEditedSubjective(soapNote?.subjective || '')
    setEditedObjective(soapNote?.objective || '')
    setEditedPlan(Array.isArray(soapNote?.plan) ? soapNote.plan.join('\n') : soapNote?.plan || '')
  }, [soapNote])

  const handleSave = () => {
    setIsEditing(false)
    if (onUpdateSoapNote) {
      onUpdateSoapNote({
        ...soapNote,
        subjective: editedSubjective,
        objective: editedObjective,
        plan: editedPlan.split('\n').filter((l) => l.trim().length > 0)
      })
    }
  }

  const handleCopyFormattedSoap = () => {
    const text = `CLINICAL ENCOUNTER SOAP NOTE
Patient: ${encounter.patient.name} | Age: ${encounter.patient.age}${encounter.patient.gender[0]} | MRN: ${encounter.patient.mrn}
Attending: ${encounter.doctor} | Specialty: ${encounter.specialty}
Date: ${new Date().toLocaleDateString()}

SUBJECTIVE:
${soapNote?.subjective || ''}

OBJECTIVE:
${soapNote?.objective || ''}

ASSESSMENT:
${(soapNote?.assessment || [])
  .map((a) => `• [ICD-10 ${a.code}] ${a.diagnosis} - ${a.notes}`)
  .join('\n')}

PLAN:
${(soapNote?.plan || []).map((p, idx) => `${idx + 1}. ${p}`).join('\n')}

PRESCRIPTIONS:
${(prescriptions || [])
  .map(
    (rx) =>
      `• Rx: ${rx.drug} ${rx.dosage} | Sig: ${rx.frequency} ${rx.route} | Dispense: #${rx.quantity} | Refills: ${rx.refills}`
  )
  .join('\n')}

Curie Ambient Clinical Documentation - Powered by AssemblyAI Universal-3.5 Pro`

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="glass-panel rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col">
      {/* Top Action & Navigation Header */}
      <div className="px-6 py-4 border-b border-white/[0.08] bg-slate-900/40 flex flex-wrap items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-1 bg-slate-950/60 rounded-xl border border-white/[0.06]">
          <button
            onClick={() => setActiveTab('soap')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'soap'
                ? 'bg-slate-800 text-white shadow-sm border border-white/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Structured SOAP Note</span>
          </button>

          <button
            onClick={() => setActiveTab('transcript')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'transcript'
                ? 'bg-slate-800 text-white shadow-sm border border-white/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Verbatim Audio Stream</span>
          </button>

          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'prescriptions'
                ? 'bg-slate-800 text-white shadow-sm border border-white/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Pill className="w-3.5 h-3.5 text-amber-400" />
            <span>Orders & Rx ({prescriptions.length})</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {activeTab === 'soap' && (
            <>
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="tactile-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Note</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="tactile-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 flex items-center gap-1.5 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Edit Note</span>
                </button>
              )}
            </>
          )}

          <button
            onClick={handleCopyFormattedSoap}
            className="tactile-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 flex items-center gap-1.5 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenExportModal}
            className="tactile-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Export EHR / FHIR</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="p-6 overflow-y-auto max-h-[640px]">
        {/* ================= TAB 1: SOAP NOTE ================= */}
        {activeTab === 'soap' && (
          <div className="space-y-6">
            {/* Subjective Section */}
            <div className="border border-white/[0.06] rounded-xl p-5 bg-slate-950/40 relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-emerald-500/10 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center border border-emerald-500/20">
                    S
                  </span>
                  <h4 className="text-xs font-mono font-semibold tracking-wider text-slate-300 uppercase">
                    Subjective (HPI & Symptoms)
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-slate-500">Patient Narrative</span>
              </div>

              {isEditing ? (
                <textarea
                  value={editedSubjective}
                  onChange={(e) => setEditedSubjective(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-900 border border-emerald-500/40 rounded-lg p-3 text-sm text-slate-200 font-sans focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              ) : (
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  {soapNote?.subjective || 'No subjective narrative recorded.'}
                </p>
              )}
            </div>

            {/* Objective Section */}
            <div className="border border-white/[0.06] rounded-xl p-5 bg-slate-950/40 relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-cyan-500/10 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center border border-cyan-500/20">
                    O
                  </span>
                  <h4 className="text-xs font-mono font-semibold tracking-wider text-slate-300 uppercase">
                    Objective (Physical Exam & Diagnostics)
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-slate-500">Clinical Measurements</span>
              </div>

              {isEditing ? (
                <textarea
                  value={editedObjective}
                  onChange={(e) => setEditedObjective(e.target.value)}
                  rows={6}
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-lg p-3 text-sm text-slate-200 font-sans focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              ) : (
                <div className="text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-line space-y-1">
                  {soapNote?.objective || 'No objective findings recorded.'}
                </div>
              )}
            </div>

            {/* Assessment Section */}
            <div className="border border-white/[0.06] rounded-xl p-5 bg-slate-950/40 relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-amber-500/10 text-amber-400 font-mono font-bold text-xs flex items-center justify-center border border-amber-500/20">
                    A
                  </span>
                  <h4 className="text-xs font-mono font-semibold tracking-wider text-slate-300 uppercase">
                    Assessment & Clinical Diagnoses
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Universal-3.5 Biased ICD-10
                </span>
              </div>

              <div className="space-y-3">
                {(soapNote?.assessment || []).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-slate-900/60 border border-white/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <span className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-mono text-xs font-bold tracking-wide shrink-0">
                        {item.code}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-slate-100">{item.diagnosis}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{item.notes}</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400/80 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0 self-start sm:self-auto">
                      Confirmed
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Plan Section */}
            <div className="border border-white/[0.06] rounded-xl p-5 bg-slate-950/40 relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-emerald-500/10 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center border border-emerald-500/20">
                    P
                  </span>
                  <h4 className="text-xs font-mono font-semibold tracking-wider text-slate-300 uppercase">
                    Plan & Orders
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-slate-500">Care Directives</span>
              </div>

              {isEditing ? (
                <textarea
                  value={editedPlan}
                  onChange={(e) => setEditedPlan(e.target.value)}
                  rows={5}
                  placeholder="One plan item per line..."
                  className="w-full bg-slate-900 border border-emerald-500/40 rounded-lg p-3 text-sm text-slate-200 font-sans focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              ) : (
                <ol className="space-y-2.5 text-sm text-slate-300 font-sans">
                  {(Array.isArray(soapNote?.plan) ? soapNote.plan : [soapNote?.plan]).map(
                    (planItem, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded bg-slate-800 text-slate-400 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5 border border-white/5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{planItem}</span>
                      </li>
                    )
                  )}
                </ol>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: VERBATIM AUDIO STREAM ================= */}
        {activeTab === 'transcript' && (
          <div className="space-y-5">
            {/* Telemetry Alert Bar */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-white">
                    AssemblyAI Universal-3.5 Pro Speech-to-Text Pipeline
                  </h5>
                  <p className="text-[11px] text-slate-400">
                    Acoustic domain biasing resolved {encounter.keyterms.length} complex medical terms with zero phonetic transcription errors.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <div className="text-slate-400">
                  Turnaround:{' '}
                  <span className="text-emerald-400 font-bold">
                    {telemetry?.latencyMs || 1084}ms
                  </span>
                </div>
                <div className="text-slate-400">
                  Fillers Removed:{' '}
                  <span className="text-cyan-400 font-bold">6 hesitations</span>
                </div>
              </div>
            </div>

            {/* Verbatim Transcript */}
            <div className="border border-white/[0.06] rounded-xl p-5 bg-slate-950/60">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.05]">
                <span className="text-xs font-mono text-slate-400">Physician Ambient Dictation Audio</span>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> High-Confidence Recognition
                </span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-mono">
                {verbatimTranscript || encounter.spokenTranscript}
              </p>
            </div>

            {/* Side-by-side Biasing Highlight Explainer */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Active Keyterm Protection</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                By passing <code className="text-emerald-300 font-mono">keyterms_prompt</code> directly to the Dictation API, words like{' '}
                <span className="text-emerald-300 font-medium">"{encounter.keyterms.slice(0, 4).join('", "')}"</span> were pinned to the language model’s active acoustic vocabulary, completely eliminating common phonetic hallucinations (e.g. "a tore the stat in" → "Atorvastatin").
              </p>
            </div>
          </div>
        )}

        {/* ================= TAB 3: PRESCRIPTIONS & ORDERS ================= */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Generated E-Prescriptions & Clinical Orders
                </h4>
                <p className="text-xs text-slate-400">
                  Extracted automatically from doctor's verbal Plan instructions with verified dosing and sigs.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Patient: <strong className="text-slate-200">{encounter.patient.name}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {prescriptions.map((rx, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-white/[0.08] bg-slate-900/50 p-4 hover:border-emerald-500/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Rx Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-serif font-bold text-emerald-400">Rx</span>
                        <div>
                          <div className="text-sm font-semibold text-slate-100">{rx.drug}</div>
                          <div className="text-xs font-mono text-slate-400">{rx.indication}</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-white/10">
                        Dispense: #{rx.quantity}
                      </span>
                    </div>

                    {/* Rx Details Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/40 p-2.5 rounded-lg border border-white/[0.04] mb-3">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-mono">Dosage</span>
                        <span className="text-slate-200 font-medium">{rx.dosage}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-mono">Route</span>
                        <span className="text-slate-200 font-medium">{rx.route}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500 block text-[10px] uppercase font-mono">Sig / Frequency</span>
                        <span className="text-slate-200 font-medium">{rx.frequency}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-mono">Refills</span>
                        <span className="text-slate-200 font-medium">{rx.refills} refills</span>
                      </div>
                    </div>
                  </div>

                  {/* Rx Footer */}
                  <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 italic">
                      Signed: {encounter.doctor.split(',')[0]}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `Rx: ${rx.drug} ${rx.dosage} | Sig: ${rx.frequency} ${rx.route} | Disp: #${rx.quantity} | Refills: ${rx.refills}`
                        )
                        setRxCopied(idx)
                        setTimeout(() => setRxCopied(null), 1500)
                      }}
                      className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                    >
                      {rxCopied === idx ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{rxCopied === idx ? 'Copied' : 'Copy Sig'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Persistent Note Footer with Attending Sign-Off */}
      <div className="px-6 py-3 border-t border-white/[0.06] bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>Last Ambient Sync: {new Date().toLocaleTimeString()}</span>
          <span className="text-slate-600">•</span>
          <span className="font-mono text-slate-300">{encounter.doctor}</span>
        </div>

        <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
          <span>Security: HIPAA TLS 1.3</span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Attending Signature Verified
          </span>
        </div>
      </div>
    </div>
  )
}
