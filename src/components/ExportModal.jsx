import React, { useState, useEffect } from 'react'
import { X, Copy, Check, Download, Printer, Share2, Code, FileText, CheckCircle2 } from 'lucide-react'

export default function ExportModal({ isOpen, onClose, encounter, soapNote, prescriptions }) {
  const [selectedFormat, setSelectedFormat] = useState('epic') // 'epic' | 'fhir' | 'cerner'
  const [copied, setCopied] = useState(false)

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

  // Generate Epic Hyperspace SmartText
  const generateEpicText = () => {
    return `=== EPIC HYPERSPACE PROGRESS NOTE ===
ATTENDING: ${encounter.doctor}
PATIENT: ${encounter.patient.name} (MRN: ${encounter.patient.mrn}, DOB: ${encounter.patient.dob})
SERVICE: ${encounter.specialty}
ENCOUNTER DATE: ${new Date().toISOString().split('T')[0]}

.CHIEFCOMPLAINT
${encounter.chiefComplaint}

.VITALS
BP: ${encounter.patient.vitals.bp} | HR: ${encounter.patient.vitals.hr} bpm | SpO2: ${encounter.patient.vitals.spo2}% | Temp: ${encounter.patient.vitals.temp}°F

.SUBJECTIVE
${soapNote?.subjective || ''}

.PHYSICALEXAM
${soapNote?.objective || ''}

.ASSESSMENT
${(soapNote?.assessment || []).map((a) => `• [${a.code}] ${a.diagnosis} (${a.notes})`).join('\n')}

.PLAN
${(soapNote?.plan || []).map((p, i) => `${i + 1}. ${p}`).join('\n')}

.ORDERS_RX
${(prescriptions || []).map((r) => `Rx: ${r.drug} ${r.dosage} - ${r.frequency} ${r.route} - Disp: #${r.quantity} (Refills: ${r.refills})`).join('\n')}

ELECTRONICALLY SIGNED BY: ${encounter.doctor}
GENERATED VIA CURIE CLINICAL SCRIBE (ASSEMBLYAI UNIVERSAL-3.5 PRO)`
  }

  // Generate FHIR R4 DiagnosticReport JSON
  const generateFhirJson = () => {
    const fhirResource = {
      resourceType: 'DiagnosticReport',
      id: `curie-${encounter.id}-${Date.now()}`,
      status: 'final',
      category: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
              code: 'GE',
              display: 'General Medical'
            }
          ]
        }
      ],
      code: {
        coding: [
          {
            system: 'http://loinc.org',
            code: '11506-3',
            display: 'Progress note'
          }
        ],
        text: 'Ambient Clinical SOAP Progress Note'
      },
      subject: {
        reference: `Patient/${encounter.patient.mrn}`,
        display: encounter.patient.name
      },
      effectiveDateTime: new Date().toISOString(),
      performer: [
        {
          display: encounter.doctor
        }
      ],
      conclusion: (soapNote?.assessment || []).map((a) => `${a.code}: ${a.diagnosis}`).join('; '),
      conclusionCode: (soapNote?.assessment || []).map((a) => ({
        coding: [
          {
            system: 'http://hl7.org/fhir/sid/icd-10-cm',
            code: a.code,
            display: a.diagnosis
          }
        ]
      })),
      presentedForm: [
        {
          contentType: 'text/plain',
          language: 'en',
          data: btoa(unescape(encodeURIComponent(generateEpicText())))
        }
      ]
    }

    return JSON.stringify(fhirResource, null, 2)
  }

  // Generate Cerner PowerChart ASCII
  const generateCernerText = () => {
    return `=====================================================
CERNER POWERCHART OUTPATIENT SUMMARY
=====================================================
Patient: ${encounter.patient.name}   MRN: ${encounter.patient.mrn}
Provider: ${encounter.doctor}
Encounter: ${encounter.specialty} Follow-Up
Date: ${new Date().toLocaleDateString()}

[S] SUBJECTIVE
${soapNote?.subjective || ''}

[O] OBJECTIVE
${soapNote?.objective || ''}

[A] ASSESSMENT
${(soapNote?.assessment || []).map((a) => `* ICD-10: ${a.code} - ${a.diagnosis}`).join('\n')}

[P] PLAN & MANAGEMENT
${(soapNote?.plan || []).map((p, i) => `${i + 1}. ${p}`).join('\n')}

[MEDICATIONS ORDERED]
${(prescriptions || []).map((r) => `* ${r.drug} ${r.dosage} | Sig: ${r.frequency} | Quantity: #${r.quantity} | Refills: ${r.refills}`).join('\n')}

Curie Voice Intelligence Engine - Verified
=====================================================`
  }

  const getContent = () => {
    switch (selectedFormat) {
      case 'fhir':
        return generateFhirJson()
      case 'cerner':
        return generateCernerText()
      case 'epic':
      default:
        return generateEpicText()
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(getContent())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const text = getContent()
    const extension = selectedFormat === 'fhir' ? 'json' : 'txt'
    const mime = selectedFormat === 'fhir' ? 'application/json' : 'text/plain'
    const blob = new Blob([text], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `curie_${encounter.patient.name.replace(/\s+/g, '_')}_${selectedFormat}.${extension}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-white/[0.12] rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-[0_16px_64px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/[0.08] flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                Export Clinical Encounter & SOAP Note
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Targeting EHR interop: Epic Hyperspace, Cerner Millennium, or HL7 FHIR R4 standard.
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

        {/* Format Selector Bar */}
        <div className="px-6 py-3 border-b border-white/[0.06] bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2 p-1 bg-slate-950/60 rounded-xl border border-white/[0.05]">
            <button
              onClick={() => setSelectedFormat('epic')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedFormat === 'epic'
                  ? 'bg-slate-800 text-white shadow-sm border border-white/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Epic SmartText (.epic)
            </button>

            <button
              onClick={() => setSelectedFormat('fhir')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                selectedFormat === 'fhir'
                  ? 'bg-slate-800 text-white shadow-sm border border-white/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5 text-cyan-400" />
              <span>HL7 FHIR R4 (.json)</span>
            </button>

            <button
              onClick={() => setSelectedFormat('cerner')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedFormat === 'cerner'
                  ? 'bg-slate-800 text-white shadow-sm border border-white/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cerner PowerChart
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="tactile-btn px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Payload</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="tactile-btn px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Download</span>
            </button>

            <button
              onClick={handlePrint}
              className="tactile-btn px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 text-xs font-medium flex items-center gap-1.5 transition-all"
              title="Print formatted note"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Code / Text Preview */}
        <div className="p-6 overflow-y-auto max-h-[500px] bg-slate-950/80">
          <pre className="text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap select-all">
            {getContent()}
          </pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/[0.08] bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px] text-emerald-400/90 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Ready for EHR Integration & Ingestion
          </span>
          <button
            onClick={onClose}
            className="tactile-btn px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 font-medium transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
