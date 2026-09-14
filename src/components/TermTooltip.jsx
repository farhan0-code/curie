import React, { useState, useRef, useEffect } from 'react'
import { Info, HelpCircle } from 'lucide-react'

export const CLINICAL_TERMS = {
  'ASR': {
    term: 'ASR',
    fullForm: 'Automatic Speech Recognition',
    description: 'AI technology that transcribes spoken medical dialogue into digital text in real time.',
    category: 'Speech AI'
  },
  'SOAP': {
    term: 'SOAP',
    fullForm: 'Subjective, Objective, Assessment, Plan',
    description: 'The standard four-part documentation framework used by healthcare providers to record patient visits.',
    category: 'Clinical Documentation'
  },
  'EHR': {
    term: 'EHR',
    fullForm: 'Electronic Health Record',
    description: 'Digital repository of patient health records (such as Epic, Cerner, or Athenahealth).',
    category: 'Healthcare IT'
  },
  'FHIR': {
    term: 'FHIR',
    fullForm: 'Fast Healthcare Interoperability Resources',
    description: 'Modern HL7 REST API standard for securely transmitting electronic healthcare and diagnostic records.',
    category: 'Interoperability'
  },
  'PTT': {
    term: 'PTT',
    fullForm: 'Push-to-Talk',
    description: 'Hands-free dictation mode where holding a hotkey (like Spacebar) streams audio and releasing stops it.',
    category: 'Audio Control'
  },
  'RMS': {
    term: 'RMS',
    fullForm: 'Root Mean Square',
    description: 'Mathematical calculation of live microphone signal amplitude used to render speech waveform visualizers.',
    category: 'Acoustics'
  },
  'ICD-10': {
    term: 'ICD-10',
    fullForm: 'International Classification of Diseases, 10th Revision',
    description: 'Global standard diagnostic codes published by WHO used for medical diagnoses, billing, and insurance.',
    category: 'Medical Coding'
  },
  'DAPT': {
    term: 'DAPT',
    fullForm: 'Dual Antiplatelet Therapy',
    description: 'Cardiovascular medication regimen combining two blood-thinning drugs (e.g. Aspirin + Clopidogrel) post-stent.',
    category: 'Pharmacology'
  },
  'SLA': {
    term: 'SLA',
    fullForm: 'Service Level Agreement',
    description: 'Guaranteed performance benchmark (< 1,200 ms) for dictation transcription and SOAP generation.',
    category: 'Performance'
  },
  'LAD': {
    term: 'LAD',
    fullForm: 'Left Anterior Descending Artery',
    description: 'Major coronary artery supplying the anterior heart wall; critical site for stenting in coronary disease.',
    category: 'Anatomy'
  },
  'LVEF': {
    term: 'LVEF',
    fullForm: 'Left Ventricular Ejection Fraction',
    description: 'Percentage of blood pumped out of the left ventricle during each contraction (normal: 50% - 70%).',
    category: 'Cardiology'
  },
  'PEFR': {
    term: 'PEFR',
    fullForm: 'Peak Expiratory Flow Rate',
    description: 'Maximal air exhalation velocity measured by spirometry to monitor airway obstruction in asthma.',
    category: 'Pulmonology'
  },
  'SpO2': {
    term: 'SpO2',
    fullForm: 'Peripheral Capillary Oxygen Saturation',
    description: 'Blood oxygen saturation percentage measured non-invasively via pulse oximeter (normal: 95% - 100%).',
    category: 'Vitals'
  },
  'MRN': {
    term: 'MRN',
    fullForm: 'Medical Record Number',
    description: 'Unique numerical hospital identifier assigned to each patient for clinical chart tracking.',
    category: 'Administration'
  }
}

/**
 * TermTooltip Component
 * Wraps medical and technical acronyms with an accessible, interactive hover/click tooltip
 * showing its full form, clinical description, and category.
 */
export default function TermTooltip({
  term,
  children,
  className = '',
  showIcon = false
}) {
  const [isVisible, setIsVisible] = useState(false)
  const timeoutRef = useRef(null)
  const containerRef = useRef(null)

  const normalizedKey = term ? term.trim().toUpperCase() : ''
  const termData = CLINICAL_TERMS[normalizedKey] || CLINICAL_TERMS[term] || {
    term: term || 'Term',
    fullForm: term || 'Technical Term',
    description: 'Clinical abbreviation or specialized medical terminology.',
    category: 'Glossary'
  }

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current)
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false)
    }, 120)
  }

  const handleClick = (e) => {
    e.stopPropagation()
    setIsVisible((prev) => !prev)
  }

  // Close when clicking outside
  useEffect(() => {
    if (!isVisible) return
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsVisible(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isVisible])

  return (
    <span
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`relative inline-flex items-center gap-0.5 cursor-help group select-none ${className}`}
      title={`${termData.term}: ${termData.fullForm}`}
      aria-label={`${termData.term}: ${termData.fullForm} - ${termData.description}`}
    >
      <span className="border-b border-dashed border-neutral-400 group-hover:border-black group-hover:text-black transition-colors font-medium">
        {children || term}
      </span>
      {showIcon && (
        <HelpCircle className="w-3 h-3 text-neutral-400 group-hover:text-black inline shrink-0 transition-colors ml-0.5" />
      )}

      {/* Floating Tooltip Card */}
      {isVisible && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64 p-3 bg-neutral-900 text-white rounded-xl shadow-xl border border-neutral-700 text-left pointer-events-auto animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header with Term Badge and Category */}
          <span className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-neutral-800">
            <span className="font-mono text-xs font-bold text-white bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-700">
              {termData.term}
            </span>
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
              {termData.category}
            </span>
          </span>

          {/* Full Form */}
          <span className="block text-xs font-bold text-white leading-snug mb-1">
            {termData.fullForm}
          </span>

          {/* Plain English Description */}
          <span className="block text-[11px] text-neutral-300 leading-relaxed font-sans font-normal">
            {termData.description}
          </span>

          {/* Tooltip Arrow */}
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-neutral-900" />
        </span>
      )}
    </span>
  )
}
