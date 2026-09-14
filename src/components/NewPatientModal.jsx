import React, { useState, useEffect } from 'react'
import { X, UserPlus, Stethoscope, AlertCircle, Sparkles, Check, Heart, Activity } from 'lucide-react'

const SPECIALTIES = [
  'Family Medicine',
  'Cardiovascular Medicine',
  'Pediatric Pulmonology',
  'Orthopedic Sports Surgery',
  'Internal Medicine',
  'Neurology',
  'Dermatology',
  'Psychiatry',
  'Urgent Care'
]

export default function NewPatientModal({
  isOpen,
  onClose,
  onCreatePatient,
  onAddEncounter,
  defaultDoctor = 'Dr. Evelyn Vance, MD'
}) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    specialty: 'Family Medicine',
    chiefComplaint: '',
    allergies: 'No Known Drug Allergies (NKDA)',
    bp: '120/80',
    hr: '72',
    spo2: '98',
    temp: '98.6',
    keytermsText: '',
    doctor: defaultDoctor
  })

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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.chiefComplaint.trim()) return

    const randomMrn = `MRN-${Math.floor(10000 + Math.random() * 90000)}`
    const parsedKeyterms = formData.keytermsText
      ? formData.keytermsText.split(',').map((k) => k.trim()).filter(Boolean)
      : [formData.name, formData.specialty]

    const newEncounter = {
      id: `custom-patient-${Date.now()}`,
      title: `${formData.specialty}: ${formData.chiefComplaint.slice(0, 32)}...`,
      specialty: formData.specialty,
      doctor: formData.doctor || defaultDoctor,
      patient: {
        name: formData.name.trim(),
        age: parseInt(formData.age, 10) || 45,
        gender: formData.gender,
        mrn: randomMrn,
        dob: `${new Date().getFullYear() - (parseInt(formData.age, 10) || 45)}-01-15`,
        allergies: [formData.allergies.trim() || 'No Known Drug Allergies (NKDA)'],
        vitals: {
          bp: formData.bp || '120/80',
          bpStatus: 'Normal',
          hr: parseInt(formData.hr, 10) || 72,
          hrUnit: 'bpm',
          spo2: parseInt(formData.spo2, 10) || 98,
          temp: parseFloat(formData.temp) || 98.6,
          bmi: 24.2
        }
      },
      chiefComplaint: formData.chiefComplaint.trim(),
      keyterms: parsedKeyterms,
      sttPrompt: `A physician dictating a clinical note for patient ${formData.name.trim()} in ${formData.specialty}.`,
      llmInstruction: `Remove filler words, false starts, and hesitation. Format strictly into formal clinical SOAP format (Subjective, Objective, Assessment with ICD-10 codes, Plan with prescription details). Retain all drug names, dosages, anatomical sites, and clinical measurements verbatim.`,
      spokenTranscript: `Patient ${formData.name.trim()}, presenting with ${formData.chiefComplaint.trim()}.`,
      soapNote: {
        subjective: `Patient ${formData.name.trim()} (${formData.age} yo ${formData.gender}) presents with: ${formData.chiefComplaint.trim()}. [Ready for live ambient dictation or consultation recording...]`,
        objective: `Vitals: BP ${formData.bp || '120/80'} mmHg, HR ${formData.hr || '72'} bpm, SpO2 ${formData.spo2 || '98'}%, Temp ${formData.temp || '98.6'}°F.\nPhysical Exam: Pending active clinician dictation...`,
        assessment: [
          {
            code: 'R69',
            diagnosis: formData.chiefComplaint.trim() || 'Illness, unspecified',
            notes: 'Evaluation in progress'
          }
        ],
        plan: [
          'Awaiting real-time physician consultation dictation via Spacebar Push-to-Talk or audio capture.'
        ]
      },
      prescriptions: [],
      audioDuration: '0.0s',
      latencyMs: 1100
    }

    const handleAdd = onCreatePatient || onAddEncounter
    if (handleAdd) handleAdd(newEncounter)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-bold">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-display font-bold text-black tracking-tight">
                Intake New Patient Encounter
              </h2>
              <p className="text-xs text-neutral-500">
                Add an outpatient case to your queue for live ambient consultation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
            title="Close modal (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Patient Demographics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-neutral-700 mb-1">
                Patient Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. David Miller"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-black focus:outline-none transition-colors text-black font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Age & Gender <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  required
                  placeholder="Age"
                  min="0"
                  max="120"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-16 px-2 py-2 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-black focus:outline-none text-black font-medium"
                />
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="flex-1 px-2 py-2 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-black focus:outline-none text-black font-medium"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Specialty & Attending */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Clinical Specialty / Clinic
              </label>
              <select
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-black focus:outline-none text-black font-medium"
              >
                {SPECIALTIES.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Attending Clinician
              </label>
              <input
                type="text"
                value={formData.doctor}
                onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                placeholder="Dr. Evelyn Vance, MD"
                className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-black focus:outline-none text-black font-medium"
              />
            </div>
          </div>

          {/* Chief Complaint */}
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Chief Complaint / Visit Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={2}
              placeholder="e.g. Acute onset right ankle swelling and tenderness after twisting injury during basketball..."
              value={formData.chiefComplaint}
              onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-black focus:outline-none text-black font-medium resize-none"
            />
          </div>

          {/* Initial Vitals (Compact grid) */}
          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-bold block">
              Initial Vitals (Optional)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <span className="text-[10px] text-neutral-500 block mb-0.5">BP (mmHg)</span>
                <input
                  type="text"
                  placeholder="120/80"
                  value={formData.bp}
                  onChange={(e) => setFormData({ ...formData, bp: e.target.value })}
                  className="w-full px-2 py-1.5 rounded-lg bg-white border border-neutral-200 text-black font-mono text-xs"
                />
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 block mb-0.5">Heart Rate</span>
                <input
                  type="number"
                  placeholder="72"
                  value={formData.hr}
                  onChange={(e) => setFormData({ ...formData, hr: e.target.value })}
                  className="w-full px-2 py-1.5 rounded-lg bg-white border border-neutral-200 text-black font-mono text-xs"
                />
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 block mb-0.5">SpO2 (%)</span>
                <input
                  type="number"
                  placeholder="98"
                  value={formData.spo2}
                  onChange={(e) => setFormData({ ...formData, spo2: e.target.value })}
                  className="w-full px-2 py-1.5 rounded-lg bg-white border border-neutral-200 text-black font-mono text-xs"
                />
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 block mb-0.5">Temp (°F)</span>
                <input
                  type="text"
                  placeholder="98.6"
                  value={formData.temp}
                  onChange={(e) => setFormData({ ...formData, temp: e.target.value })}
                  className="w-full px-2 py-1.5 rounded-lg bg-white border border-neutral-200 text-black font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Biasing Keywords to Seed */}
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Acoustic Biasing Keywords (Comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Naproxen, anterior talofibular ligament, Ottawa ankle rules, X-ray"
              value={formData.keytermsText}
              onChange={(e) => setFormData({ ...formData, keytermsText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-black focus:outline-none text-black font-medium"
            />
            <p className="text-[10px] text-neutral-400 mt-1">
              These terms are pinned into AssemblyAI's <code className="font-mono">keyterms_prompt</code> to prevent phonetic misrecognition.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-100 text-black font-semibold transition-colors cursor-pointer"
            >
              <span className="text-black">Cancel</span>
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 text-white" />
              <span className="text-white font-bold">Create Patient Encounter</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
