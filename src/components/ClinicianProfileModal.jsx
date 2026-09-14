import React, { useState, useEffect } from 'react'
import { X, Building2, User, Stethoscope, Check, Award, ShieldCheck } from 'lucide-react'

export default function ClinicianProfileModal({ isOpen, onClose, profile, onSaveProfile }) {
  const [formData, setFormData] = useState({
    name: profile.name || 'Dr. Evelyn Vance, MD, FACC',
    clinic: profile.clinic || 'Metropolitan Outpatient Care Center',
    specialty: profile.specialty || 'Cardiovascular Medicine',
    npi: profile.npi || '1948201948'
  })

  useEffect(() => {
    setFormData({
      name: profile.name || 'Dr. Evelyn Vance, MD, FACC',
      clinic: profile.clinic || 'Metropolitan Outpatient Care Center',
      specialty: profile.specialty || 'Cardiovascular Medicine',
      npi: profile.npi || '1948201948'
    })
  }, [profile, isOpen])

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
    onSaveProfile(formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-display font-bold text-black tracking-tight">
                Clinician Workplace Profile
              </h2>
              <p className="text-xs text-neutral-500">
                Personalize attending physician signatures & hospital affiliation
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Attending Clinician Full Name & Credentials <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Dr. Toufiq Farhan, MD, FACC"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-black focus:outline-none text-black font-medium"
              />
              <User className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            </div>
            <p className="text-[10px] text-neutral-400 mt-1">
              Appears on electronically signed progress notes and EHR exports.
            </p>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Hospital / Clinic Workplace Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.clinic}
                onChange={(e) => setFormData({ ...formData, clinic: e.target.value })}
                placeholder="e.g. Central Health Ambulatory Care"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-black focus:outline-none text-black font-medium"
              />
              <Building2 className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Primary Specialty
              </label>
              <input
                type="text"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                placeholder="e.g. Cardiovascular Medicine"
                className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-black focus:outline-none text-black font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                National Provider ID (NPI)
              </label>
              <input
                type="text"
                value={formData.npi}
                onChange={(e) => setFormData({ ...formData, npi: e.target.value })}
                placeholder="e.g. 1948201948"
                className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-black focus:outline-none text-black font-mono font-medium"
              />
            </div>
          </div>

          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-neutral-600 leading-relaxed">
              Updating your workplace profile dynamically updates all <strong>Epic Hyperspace</strong> SmartText dot-phrases, <strong>HL7 FHIR R4</strong> practitioner attribution, and <strong>Cerner</strong> ASCII headers.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-neutral-200">
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
              <span className="text-white font-bold">Save Workplace Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
