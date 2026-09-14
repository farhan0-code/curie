import React from 'react'
import { User, AlertCircle, Heart, Activity, Thermometer, Wind, CheckCircle2, ShieldAlert } from 'lucide-react'

export default function PatientHeader({ encounters, activeEncounterId, onSelectEncounter }) {
  const current = encounters.find((e) => e.id === activeEncounterId) || encounters[0]
  const p = current.patient

  return (
    <div className="space-y-4">
      {/* Encounter Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
            Active Clinical Encounter:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {encounters.map((enc) => {
            const isActive = enc.id === activeEncounterId
            return (
              <button
                key={enc.id}
                onClick={() => onSelectEncounter(enc.id)}
                className={`tactile-btn px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-50 border border-emerald-300 text-emerald-800 font-semibold shadow-xs ring-2 ring-emerald-500/10'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {enc.title}
              </button>
            )
          })}
        </div>
      </div>

      {/* Patient Profile Card (Crisp Clinical Light Theme) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
        {/* Subtle decorative gradient */}
        <div className="absolute top-0 right-0 w-80 h-32 bg-emerald-500/[0.04] blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Patient Demographics */}
          <div className="flex items-start gap-4">
            <div className="w-13 h-13 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-mono font-bold text-lg shrink-0 shadow-xs">
              {p.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
                  {p.name}
                </h2>
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                  {p.age} y/o {p.gender}
                </span>
                <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {p.mrn}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                <span>DOB: <strong className="text-slate-700 font-mono">{p.dob}</strong></span>
                <span>•</span>
                <span>Specialty: <strong className="text-emerald-700 font-medium">{current.specialty}</strong></span>
                <span>•</span>
                <span>Attending: <strong className="text-slate-800">{current.doctor}</strong></span>
              </div>
            </div>
          </div>

          {/* Vitals Summary Pill Grid */}
          <div className="flex flex-wrap items-center gap-2.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            {/* Blood Pressure */}
            <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono font-medium text-slate-400">BP</div>
                <div className="text-xs font-mono font-bold text-slate-900">
                  {p.vitals.bp} <span className="text-[10px] font-normal text-slate-500">mmHg</span>
                </div>
              </div>
            </div>

            {/* Heart Rate */}
            <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 border border-sky-100">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono font-medium text-slate-400">HR</div>
                <div className="text-xs font-mono font-bold text-slate-900">
                  {p.vitals.hr} <span className="text-[10px] font-normal text-slate-500">bpm</span>
                </div>
              </div>
            </div>

            {/* SpO2 */}
            <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                <Wind className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono font-medium text-slate-400">SpO2</div>
                <div className="text-xs font-mono font-bold text-slate-900">
                  {p.vitals.spo2}%
                </div>
              </div>
            </div>

            {/* Body Temperature */}
            <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
                <Thermometer className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono font-medium text-slate-400">Temp</div>
                <div className="text-xs font-mono font-bold text-slate-900">
                  {p.vitals.temp}°F
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chief Complaint & Allergy Alert Banner */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <span className="font-semibold text-slate-900 font-mono text-[11px] uppercase tracking-wide">
              Chief Complaint:
            </span>
            <span className="font-medium text-slate-600">
              "{current.chiefComplaint}"
            </span>
          </div>

          {/* Allergies Alert */}
          {p.allergies && p.allergies.length > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 font-medium text-[11px] shrink-0 self-start sm:self-auto">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Allergy Alert: {p.allergies.join(', ')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
