import React from 'react'
import { User, AlertCircle, Heart, Activity, Thermometer, Wind, CheckCircle2 } from 'lucide-react'

export default function PatientHeader({ encounters, activeEncounterId, onSelectEncounter }) {
  const current = encounters.find((e) => e.id === activeEncounterId) || encounters[0]
  const p = current.patient

  return (
    <div className="space-y-4">
      {/* Encounter Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Active Clinical Scenario:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {encounters.map((enc) => {
            const isActive = enc.id === activeEncounterId
            return (
              <button
                key={enc.id}
                onClick={() => onSelectEncounter(enc.id)}
                className={`tactile-btn px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-sage-500/15 border border-sage-500/40 text-sage-300 font-semibold shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                    : 'bg-slate-900/80 border border-white/[0.06] text-slate-400 hover:text-slate-200 hover:border-white/15'
                }`}
              >
                {enc.title}
              </button>
            )
          })}
        </div>
      </div>

      {/* Patient Profile Card */}
      <div className="glass-panel rounded-xl p-4 sm:p-5 border border-white/[0.08] relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-32 bg-sage-500/[0.03] blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Patient Demographics */}
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-800/90 border border-white/10 flex items-center justify-center text-slate-300 font-mono font-bold text-lg shrink-0">
              {p.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {p.name}
                </h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/[0.06] border border-white/10 text-slate-300">
                  {p.age} y/o {p.gender}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {p.mrn}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-400">
                <span>DOB: <strong className="text-slate-300 font-mono">{p.dob}</strong></span>
                <span>•</span>
                <span>Specialty: <strong className="text-sage-400">{current.specialty}</strong></span>
                <span>•</span>
                <span>Attending: <strong className="text-slate-300">{current.doctor}</strong></span>
              </div>
            </div>
          </div>

          {/* Vitals Summary Pill Grid */}
          <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/[0.06]">
            {/* Blood Pressure */}
            <div className="px-2.5 py-1.5 rounded-lg bg-obsidian-900 border border-white/[0.08] flex items-center gap-2">
              <Heart className="w-3.5 h-3.5 text-vital-rose" />
              <div>
                <div className="text-[10px] uppercase font-mono text-slate-400">BP</div>
                <div className="text-xs font-mono font-semibold text-white">
                  {p.vitals.bp} <span className="text-[10px] font-normal text-slate-400">mmHg</span>
                </div>
              </div>
            </div>

            {/* Heart Rate */}
            <div className="px-2.5 py-1.5 rounded-lg bg-obsidian-900 border border-white/[0.08] flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-vital-cyan" />
              <div>
                <div className="text-[10px] uppercase font-mono text-slate-400">HR</div>
                <div className="text-xs font-mono font-semibold text-white">
                  {p.vitals.hr} <span className="text-[10px] font-normal text-slate-400">bpm</span>
                </div>
              </div>
            </div>

            {/* SpO2 */}
            <div className="px-2.5 py-1.5 rounded-lg bg-obsidian-900 border border-white/[0.08] flex items-center gap-2">
              <Wind className="w-3.5 h-3.5 text-sage-400" />
              <div>
                <div className="text-[10px] uppercase font-mono text-slate-400">SpO2</div>
                <div className="text-xs font-mono font-semibold text-white">
                  {p.vitals.spo2}%
                </div>
              </div>
            </div>

            {/* Temp */}
            <div className="px-2.5 py-1.5 rounded-lg bg-obsidian-900 border border-white/[0.08] flex items-center gap-2">
              <Thermometer className="w-3.5 h-3.5 text-vital-amber" />
              <div>
                <div className="text-[10px] uppercase font-mono text-slate-400">Temp</div>
                <div className="text-xs font-mono font-semibold text-white">
                  {p.vitals.temp}°F
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chief Complaint & Allergy Callout Bar */}
        <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Chief Complaint:</span>
            <span className="text-slate-400 truncate max-w-xl">
              {current.chiefComplaint}
            </span>
          </div>
          {p.allergies && p.allergies.length > 0 && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-vital-amber/10 border border-vital-amber/25 text-vital-amber text-[11px] font-mono shrink-0">
              <AlertCircle className="w-3 h-3" />
              <span>Allergies: {p.allergies.join(', ')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
