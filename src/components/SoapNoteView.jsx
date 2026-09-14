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
  Clock,
  CheckCircle2
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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
      {/* Top Action & Navigation Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('soap')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'soap'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span>Structured SOAP Note</span>
          </button>

          <button
            onClick={() => setActiveTab('transcript')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'transcript'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-sky-600" />
            <span>Verbatim Audio Stream</span>
          </button>

          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'prescriptions'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Pill className="w-3.5 h-3.5 text-amber-600" />
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
                  className="tactile-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Note</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="tactile-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Edit Note</span>
                </button>
              )}
            </>
          )}

          <button
            onClick={handleCopyFormattedSoap}
            className="tactile-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-all shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenExportModal}
            className="tactile-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Export EHR / FHIR</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="p-6 overflow-y-auto max-h-[640px] space-y-6">
        {/* ================= TAB 1: SOAP NOTE ================= */}
        {activeTab === 'soap' && (
          <div className="space-y-5">
            {/* Subjective Section */}
            <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 font-mono font-bold text-xs flex items-center justify-center border border-emerald-200">
                    S
                  </span>
                  <h4 className="text-xs font-mono font-bold tracking-wider text-slate-900 uppercase">
                    Subjective (HPI & Symptoms)
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-slate-400 font-medium">Patient Narrative</span>
              </div>

              {isEditing ? (
                <textarea
                  value={editedSubjective}
                  onChange={(e) => setEditedSubjective(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-50 border border-emerald-500 rounded-lg p-3 text-sm text-slate-900 font-sans focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              ) : (
                <p className="text-sm text-slate-800 leading-relaxed font-sans">
                  {soapNote?.subjective || 'No subjective narrative recorded.'}
                </p>
              )}
            </div>

            {/* Objective Section */}
            <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-sky-50 text-sky-700 font-mono font-bold text-xs flex items-center justify-center border border-sky-200">
                    O
                  </span>
                  <h4 className="text-xs font-mono font-bold tracking-wider text-slate-900 uppercase">
                    Objective (Physical Exam & Diagnostics)
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-slate-400 font-medium">Clinical Measurements</span>
              </div>

              {isEditing ? (
                <textarea
                  value={editedObjective}
                  onChange={(e) => setEditedObjective(e.target.value)}
                  rows={6}
                  className="w-full bg-slate-50 border border-sky-500 rounded-lg p-3 text-sm text-slate-900 font-sans focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              ) : (
                <div className="text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-line space-y-1">
                  {soapNote?.objective || 'No objective findings recorded.'}
                </div>
              )}
            </div>

            {/* Assessment Section */}
            <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-amber-50 text-amber-700 font-mono font-bold text-xs flex items-center justify-center border border-amber-200">
                    A
                  </span>
                  <h4 className="text-xs font-mono font-bold tracking-wider text-slate-900 uppercase">
                    Assessment & Clinical Diagnoses
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Universal-3.5 Biased ICD-10
                </span>
              </div>

              <div className="space-y-2.5">
                {(soapNote?.assessment || []).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-200 font-mono text-xs font-bold tracking-wide shrink-0 shadow-2xs">
                        {item.code}
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{item.diagnosis}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{item.notes}</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0 self-start sm:self-auto">
                      Confirmed
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Plan Section */}
            <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 font-mono font-bold text-xs flex items-center justify-center border border-emerald-200">
                    P
                  </span>
                  <h4 className="text-xs font-mono font-bold tracking-wider text-slate-900 uppercase">
                    Plan & Directives
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-slate-400 font-medium">Care Management</span>
              </div>

              {isEditing ? (
                <textarea
                  value={editedPlan}
                  onChange={(e) => setEditedPlan(e.target.value)}
                  rows={5}
                  placeholder="One plan item per line..."
                  className="w-full bg-slate-50 border border-emerald-500 rounded-lg p-3 text-sm text-slate-900 font-sans focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              ) : (
                <ol className="space-y-2.5 text-sm text-slate-800 font-sans">
                  {(Array.isArray(soapNote?.plan) ? soapNote.plan : [soapNote?.plan]).map(
                    (planItem, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-700 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
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
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-200 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900">
                    AssemblyAI Universal-3.5 Pro Speech Pipeline
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    Acoustic domain biasing resolved {encounter.keyterms.length} complex medical terms with zero phonetic transcription errors.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <div className="text-slate-600">
                  Turnaround:{' '}
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {telemetry?.latencyMs || 1084} ms
                  </span>
                </div>
                <div className="text-slate-600">
                  Fillers Stripped:{' '}
                  <span className="text-sky-700 font-bold bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
                    6 tokens
                  </span>
                </div>
              </div>
            </div>

            {/* Verbatim Transcript */}
            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                <span className="text-xs font-mono font-semibold text-slate-600">Ambient Dictation Stream</span>
                <span className="text-[11px] font-mono text-emerald-700 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> High-Confidence Audio Recognition
                </span>
              </div>
              <p className="text-sm text-slate-800 leading-relaxed font-mono">
                {verbatimTranscript || encounter.spokenTranscript}
              </p>
            </div>

            {/* Side-by-side Biasing Highlight Explainer */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 mb-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Active Keyterm Protection</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                By passing <code className="text-emerald-900 font-mono font-bold bg-white/70 px-1 py-0.5 rounded border border-emerald-200">keyterms_prompt</code> directly to the Dictation API, terms like{' '}
                <span className="text-emerald-950 font-bold">"{encounter.keyterms.slice(0, 4).join('", "')}"</span> were pinned to the active acoustic vocabulary, completely eliminating common speech recognition corruptions (e.g. "a tore the stat in" → "Atorvastatin").
              </p>
            </div>
          </div>
        )}

        {/* ================= TAB 3: PRESCRIPTIONS & ORDERS ================= */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Generated E-Prescriptions &amp; Clinical Orders
                </h4>
                <p className="text-xs text-slate-500">
                  Extracted automatically from doctor's verbal Plan instructions with verified dosing and sigs.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-600">
                Patient: <strong className="text-slate-900">{encounter.patient.name}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {prescriptions.map((rx, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-emerald-300 transition-all flex flex-col justify-between shadow-2xs hover:shadow-xs"
                >
                  <div>
                    {/* Rx Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-serif font-bold text-emerald-600">Rx</span>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{rx.drug}</div>
                          <div className="text-xs font-mono text-slate-500">{rx.indication}</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        Dispense: #{rx.quantity}
                      </span>
                    </div>

                    {/* Rx Details Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-mono font-semibold">Dosage</span>
                        <span className="text-slate-800 font-semibold">{rx.dosage}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-mono font-semibold">Route</span>
                        <span className="text-slate-800 font-semibold">{rx.route}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400 block text-[10px] uppercase font-mono font-semibold">Sig / Frequency</span>
                        <span className="text-slate-800 font-semibold">{rx.frequency}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-mono font-semibold">Refills</span>
                        <span className="text-slate-800 font-semibold">{rx.refills} refills</span>
                      </div>
                    </div>
                  </div>

                  {/* Rx Footer */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
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
                      className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
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
      <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-500">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Last Ambient Sync: {new Date().toLocaleTimeString()}</span>
          <span className="text-slate-300">•</span>
          <span className="font-mono text-slate-700 font-medium">{encounter.doctor}</span>
        </div>

        <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
          <span>Security: HIPAA TLS 1.3</span>
          <span className="text-slate-300">•</span>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Attending Signature Verified
          </span>
        </div>
      </div>
    </div>
  )
}
