import React from 'react'
import { User, AlertCircle, Heart, Activity, Thermometer, Wind, CheckCircle2, ShieldAlert } from 'lucide-react'

export default function PatientHeader({ encounters, activeEncounterId, onSelectEncounter }) {
  const current = encounters.find((e) => e.id === activeEncounterId) || encounters[0]
  const p = current.patient

  return (
    <div className="space-y-4">
      {/* Encounter Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold">
            Active Encounter:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {encounters.map((enc) => {
            const isActive = enc.id === activeEncounterId
            return (
              <button
                key={enc.id}
                onClick={() => onSelectEncounter(enc.id)}
                className={`tactile-btn px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-neutral-200 text-black border border-black shadow-xs font-bold'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:text-black hover:bg-neutral-50 shadow-2xs'
                }`}
              >
                {enc.title}
              </button>
            )
          })}
        </div>
      </div>

      {/* Patient Profile Card (Clinical Light Mode) */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Patient Demographics */}
          <div className="flex items-start gap-4">
            <div className="w-13 h-13 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 font-mono font-bold text-lg shrink-0">
              {p.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-2xl font-display font-semibold text-black tracking-tight">
                  {p.name}
                </h2>
                <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-lg bg-neutral-100 text-neutral-600 border border-neutral-200">
                  {p.age} y/o {p.gender}
                </span>
                <span className="text-xs font-mono font-semibold text-black bg-neutral-100 px-2.5 py-0.5 rounded-lg border border-neutral-200">
                  {p.mrn}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-neutral-500">
                <span>DOB: <strong className="text-neutral-800 font-mono">{p.dob}</strong></span>
                <span>•</span>
                <span>Specialty: <strong className="text-black font-medium">{current.specialty}</strong></span>
                <span>•</span>
                <span>Attending: <strong className="text-neutral-800">{current.doctor}</strong></span>
              </div>
            </div>
          </div>

          {/* Vitals Summary Pill Grid */}
          <div className="flex flex-wrap items-center gap-2.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-neutral-100">
            {/* Blood Pressure */}
            <div className="px-3.5 py-2 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-black border border-neutral-200">
                <Heart className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono font-medium text-neutral-400">BP</div>
                <div className="text-xs font-mono font-bold text-black">
                  {p.vitals.bp} <span className="text-[10px] font-normal text-neutral-500">mmHg</span>
                </div>
              </div>
            </div>

            {/* Heart Rate */}
            <div className="px-3.5 py-2 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-black border border-neutral-200">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono font-medium text-neutral-400">HR</div>
                <div className="text-xs font-mono font-bold text-black">
                  {p.vitals.hr} <span className="text-[10px] font-normal text-neutral-500">bpm</span>
                </div>
              </div>
            </div>

            {/* SpO2 */}
            <div className="px-3.5 py-2 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-black border border-neutral-200">
                <Wind className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono font-medium text-neutral-400">SpO2</div>
                <div className="text-xs font-mono font-bold text-black">
                  {p.vitals.spo2}%
                </div>
              </div>
            </div>

            {/* Body Temperature */}
            <div className="px-3.5 py-2 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-black border border-neutral-200">
                <Thermometer className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono font-medium text-neutral-400">Temp</div>
                <div className="text-xs font-mono font-bold text-black">
                  {p.vitals.temp}°F
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chief Complaint & Allergy Alert Banner */}
        <div className="mt-4 pt-3.5 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-neutral-800">
            <span className="font-semibold text-neutral-500 font-mono text-[11px] uppercase tracking-wide">
              Chief Complaint:
            </span>
            <span className="font-medium text-neutral-800">
              "{current.chiefComplaint}"
            </span>
          </div>

          {/* Allergies Alert */}
          {p.allergies && p.allergies.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-100 border border-neutral-200 text-black font-medium text-[11px] shrink-0 self-start sm:self-auto">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Allergy Alert: {p.allergies.join(', ')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
