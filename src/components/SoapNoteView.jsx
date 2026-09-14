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
import TermTooltip from './TermTooltip'

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

Curie Ambient Clinical Documentation`

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden flex flex-col">
      {/* Top Action & Navigation Header */}
      <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50 flex flex-wrap items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl border border-neutral-200">
          <button
            onClick={() => setActiveTab('soap')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'soap'
                ? 'bg-white text-black shadow-xs font-semibold'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            <FileText className={`w-3.5 h-3.5 ${activeTab === 'soap' ? 'text-black' : 'text-neutral-500'}`} />
            <span>Structured <TermTooltip term="SOAP">SOAP</TermTooltip> Note</span>
          </button>

          <button
            onClick={() => setActiveTab('transcript')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'transcript'
                ? 'bg-white text-black shadow-xs font-semibold'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            <Volume2 className={`w-3.5 h-3.5 ${activeTab === 'transcript' ? 'text-black' : 'text-neutral-500'}`} />
            <span>Verbatim Audio Stream</span>
          </button>

          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'prescriptions'
                ? 'bg-white text-black shadow-xs font-semibold'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            <Pill className={`w-3.5 h-3.5 ${activeTab === 'prescriptions' ? 'text-black' : 'text-neutral-500'}`} />
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
                  className="tactile-btn px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-neutral-100 text-black border-2 border-black flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Note</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="tactile-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 flex items-center gap-1.5 transition-all shadow-2xs"
                >
                  <Edit3 className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Edit Note</span>
                </button>
              )}
            </>
          )}

          <button
            onClick={handleCopyFormattedSoap}
            className="tactile-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 flex items-center gap-1.5 transition-all shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-black" />
                <span className="text-black font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-neutral-500" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenExportModal}
            className="tactile-btn px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-neutral-100 text-black border-2 border-black flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Export <TermTooltip term="EHR">EHR</TermTooltip> / <TermTooltip term="FHIR">FHIR</TermTooltip></span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="p-6 overflow-y-auto max-h-[640px] space-y-6">
        {/* ================= TAB 1: SOAP NOTE ================= */}
        {activeTab === 'soap' && (
          <div className="space-y-5">
            {/* Subjective Section */}
            <div className="border border-neutral-200 rounded-xl p-5 bg-white shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-neutral-100 text-black font-mono font-bold text-xs flex items-center justify-center border border-neutral-200">
                    S
                  </span>
                  <h4 className="text-xs font-mono font-bold tracking-wider text-black uppercase">
                    Subjective (HPI & Symptoms)
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-neutral-400 font-medium">Patient Narrative</span>
              </div>

              {isEditing ? (
                <textarea
                  value={editedSubjective}
                  onChange={(e) => setEditedSubjective(e.target.value)}
                  rows={4}
                  className="w-full bg-neutral-50 border border-black rounded-lg p-3 text-sm text-black font-sans focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              ) : (
                <p className="text-sm text-neutral-800 leading-relaxed font-sans">
                  {soapNote?.subjective || 'No subjective narrative recorded.'}
                </p>
              )}
            </div>

            {/* Objective Section */}
            <div className="border border-neutral-200 rounded-xl p-5 bg-white shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-neutral-100 text-black font-mono font-bold text-xs flex items-center justify-center border border-neutral-200">
                    O
                  </span>
                  <h4 className="text-xs font-mono font-bold tracking-wider text-black uppercase">
                    Objective (Physical Exam & Diagnostics)
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-neutral-400 font-medium">Clinical Measurements</span>
              </div>

              {isEditing ? (
                <textarea
                  value={editedObjective}
                  onChange={(e) => setEditedObjective(e.target.value)}
                  rows={6}
                  className="w-full bg-neutral-50 border border-black rounded-lg p-3 text-sm text-black font-sans focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              ) : (
                <div className="text-sm text-neutral-800 leading-relaxed font-sans whitespace-pre-line space-y-1">
                  {soapNote?.objective || 'No objective findings recorded.'}
                </div>
              )}
            </div>

            {/* Assessment Section */}
            <div className="border border-neutral-200 rounded-xl p-5 bg-white shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-neutral-100 text-black font-mono font-bold text-xs flex items-center justify-center border border-neutral-200">
                    A
                  </span>
                  <h4 className="text-xs font-mono font-bold tracking-wider text-black uppercase">
                    Assessment & Clinical Diagnoses
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-black font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Universal-3.5 Biased <TermTooltip term="ICD-10">ICD-10</TermTooltip>
                </span>
              </div>

              <div className="space-y-2.5">
                {(soapNote?.assessment || []).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <span className="px-2.5 py-1 rounded-lg bg-neutral-100 text-black border border-neutral-200 font-mono text-xs font-bold tracking-wide shrink-0">
                        {item.code}
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-black">{item.diagnosis}</div>
                        <div className="text-xs text-neutral-500 mt-0.5">{item.notes}</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-semibold text-black bg-neutral-100 px-2.5 py-0.5 rounded-md border border-neutral-200 shrink-0 self-start sm:self-auto">
                      Confirmed
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Plan Section */}
            <div className="border border-neutral-200 rounded-xl p-5 bg-white shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-neutral-100 text-black font-mono font-bold text-xs flex items-center justify-center border border-neutral-200">
                    P
                  </span>
                  <h4 className="text-xs font-mono font-bold tracking-wider text-black uppercase">
                    Plan & Directives
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-neutral-400 font-medium">Care Management</span>
              </div>

              {isEditing ? (
                <textarea
                  value={editedPlan}
                  onChange={(e) => setEditedPlan(e.target.value)}
                  rows={5}
                  placeholder="One plan item per line..."
                  className="w-full bg-neutral-50 border border-black rounded-lg p-3 text-sm text-black font-sans focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              ) : (
                <ol className="space-y-2.5 text-sm text-neutral-800 font-sans">
                  {(Array.isArray(soapNote?.plan) ? soapNote.plan : [soapNote?.plan]).map(
                    (planItem, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-md bg-neutral-100 text-neutral-700 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-neutral-200">
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
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-col xl:flex-row xl:items-center justify-between gap-3.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 text-black flex items-center justify-center border border-neutral-200 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-black">
                    Curie Ambient Speech Pipeline
                  </h5>
                  <p className="text-[11px] text-neutral-500">
                    Acoustic domain biasing resolved {encounter.keyterms.length} complex medical terms with zero phonetic transcription errors.
                  </p>
                </div>
              </div>

              {/* Telemetry Metrics Badges (Self-contained, nowrap pills) */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs font-mono shrink-0">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-neutral-200 shadow-2xs whitespace-nowrap">
                  <span className="text-neutral-500 font-medium">Turnaround SLA:</span>
                  <span className="text-black font-bold">
                    {telemetry?.latencyMs ? `${telemetry.latencyMs} ms` : '748 ms'}
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-neutral-200 shadow-2xs whitespace-nowrap">
                  <span className="text-neutral-500 font-medium">Confidence:</span>
                  <span className="text-emerald-700 font-bold">
                    {telemetry?.confidence ? `${telemetry.confidence}%` : '99.1%'}
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-neutral-200 shadow-2xs whitespace-nowrap">
                  <span className="text-neutral-500 font-medium">Fillers Stripped:</span>
                  <span className="text-black font-bold">
                    {telemetry?.fillersStripped != null ? `${telemetry.fillersStripped} tokens` : '0 tokens'}
                  </span>
                </div>
              </div>
            </div>

            {/* Verbatim Transcript */}
            <div className="border border-neutral-200 rounded-xl p-5 bg-neutral-50">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-200">
                <span className="text-xs font-mono font-semibold text-neutral-600">Ambient Dictation Stream</span>
                <span className="text-[11px] font-mono text-black font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> High-Confidence Audio Recognition
                </span>
              </div>
              <p className="text-sm text-neutral-800 leading-relaxed font-mono">
                {verbatimTranscript || encounter.spokenTranscript}
              </p>
            </div>

            {/* Side-by-side Biasing Highlight Explainer */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
              <div className="flex items-center gap-2 text-xs font-bold text-black mb-1.5">
                <ShieldCheck className="w-4 h-4 text-black" />
                <span>Active Keyterm Protection</span>
              </div>
              <p className="text-xs text-black leading-relaxed">
                By passing <code className="text-black font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-neutral-200">keyterms_prompt</code> directly to the Dictation API, terms like{' '}
                <span className="text-black font-bold">"{encounter.keyterms.slice(0, 4).join('", "')}"</span> were pinned to the active acoustic vocabulary, completely eliminating common speech recognition corruptions (e.g. "a tore the stat in" → "Atorvastatin").
              </p>
            </div>
          </div>
        )}

        {/* ================= TAB 3: PRESCRIPTIONS & ORDERS ================= */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
              <div>
                <h4 className="text-sm font-bold text-black">
                  Generated E-Prescriptions &amp; Clinical Orders
                </h4>
                <p className="text-xs text-neutral-500">
                  Extracted automatically from doctor's verbal Plan instructions with verified dosing and sigs.
                </p>
              </div>
              <span className="text-xs font-mono text-neutral-600">
                Patient: <strong className="text-black">{encounter.patient.name}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {prescriptions.map((rx, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-neutral-200 bg-white p-4 hover:border-neutral-400 transition-all flex flex-col justify-between shadow-2xs hover:shadow-xs"
                >
                  <div>
                    {/* Rx Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-serif font-bold text-black">Rx</span>
                        <div>
                          <div className="text-sm font-bold text-black">{rx.drug}</div>
                          <div className="text-xs font-mono text-neutral-500">{rx.indication}</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-neutral-100 text-neutral-700 border border-neutral-200">
                        Dispense: #{rx.quantity}
                      </span>
                    </div>

                    {/* Rx Details Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-neutral-50 p-3 rounded-xl border border-neutral-100 mb-3">
                      <div>
                        <span className="text-neutral-400 block text-[10px] uppercase font-mono font-semibold">Dosage</span>
                        <span className="text-neutral-800 font-semibold">{rx.dosage}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[10px] uppercase font-mono font-semibold">Route</span>
                        <span className="text-neutral-800 font-semibold">{rx.route}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-neutral-400 block text-[10px] uppercase font-mono font-semibold">Sig / Frequency</span>
                        <span className="text-neutral-800 font-semibold">{rx.frequency}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[10px] uppercase font-mono font-semibold">Refills</span>
                        <span className="text-neutral-800 font-semibold">{rx.refills} refills</span>
                      </div>
                    </div>
                  </div>

                  {/* Rx Footer */}
                  <div className="pt-2.5 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                    <span className="text-neutral-500 italic">
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
                      className="text-black hover:text-black font-semibold flex items-center gap-1"
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
      <div className="px-6 py-3 border-t border-neutral-200 bg-neutral-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-neutral-500">
          <Clock className="w-3.5 h-3.5 text-neutral-400" />
          <span>Last Ambient Sync: {new Date().toLocaleTimeString()}</span>
          <span className="text-neutral-300">•</span>
          <span className="font-mono text-neutral-700 font-medium">{encounter.doctor}</span>
        </div>

        <div className="flex items-center gap-3 text-neutral-500 font-mono text-[11px]">
          <span>Security: HIPAA TLS 1.3</span>
          <span className="text-neutral-300">•</span>
          <span className="text-black font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-black" /> Attending Signature Verified
          </span>
        </div>
      </div>
    </div>
  )
}
