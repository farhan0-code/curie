import React, { useState, useRef, useEffect } from 'react'
import { BookOpen } from 'lucide-react'

export const CLINICAL_TERMS = {
  'ASR': {
    term: 'ASR',
    fullForm: 'Automatic Speech Recognition',
    category: 'SPEECH RECOGNITION ARCHITECTURE',
    description: 'AI technology that translates spoken human dialogue into digital text tokens in real time.',
    inCurie: 'curie injects specialty clinical vocabulary into AssemblyAI Universal-3.5 Pro to eliminate phonetic hallucinations.'
  },
  'SOAP': {
    term: 'SOAP',
    fullForm: 'Subjective, Objective, Assessment, Plan',
    category: 'CLINICAL DOCUMENTATION METHOD',
    description: 'The standardized 4-part clinical documentation framework used across modern hospital medicine.',
    inCurie: 'curie’s single-pass model structures raw ambient doctor-patient discourse into formal SOAP sections in ~800ms.'
  },
  'EHR': {
    term: 'EHR',
    fullForm: 'Electronic Health Record',
    category: 'HEALTHCARE DATA SYSTEMS',
    description: 'Digital chart system (e.g. Epic, Cerner) containing patient medical history, vitals, and encounter notes.',
    inCurie: 'curie formats notes for 1-click export into Epic Hyperspace dot-phrases and Cerner PowerChart ASCII.'
  },
  'FHIR': {
    term: 'FHIR',
    fullForm: 'Fast Healthcare Interoperability Resources',
    category: 'INTEROPERABILITY PROTOCOL',
    description: 'Modern HL7 REST API standard for securely exchanging electronic healthcare data between clinical systems.',
    inCurie: 'curie generates valid HL7 FHIR R4 DiagnosticReport resources with LOINC 11506-3 and ICD-10 codes.'
  },
  'PTT': {
    term: 'PTT',
    fullForm: 'Push-to-Talk',
    category: 'AUDIO RECORDING CONTROLS',
    description: 'Hands-free dictation mechanism where holding a trigger key streams audio and releasing stops recording.',
    inCurie: 'hold Spacebar in curie to capture dictation; releasing triggers sub-second clinical SOAP structuring.'
  },
  'RMS': {
    term: 'RMS',
    fullForm: 'Root Mean Square',
    category: 'ACOUSTIC SIGNAL ANALYSIS',
    description: 'Mathematical measure of microphone signal magnitude used to detect voice energy and calculate sound volume.',
    inCurie: 'curie visualizes live RMS energy in the dictation bar to provide immediate visual feedback.'
  },
  'ICD-10': {
    term: 'ICD-10',
    fullForm: 'International Classification of Diseases, 10th Revision',
    category: 'MEDICAL DIAGNOSTIC CODING',
    description: 'Standardized alphanumeric code set established by WHO used globally for diagnosis and billing.',
    inCurie: 'curie anchors ICD-10 diagnostic codes to the active acoustic vocabulary to eliminate billing denials.'
  },
  'DAPT': {
    term: 'DAPT',
    fullForm: 'Dual Antiplatelet Therapy',
    category: 'CARDIOVASCULAR PHARMACOLOGY',
    description: 'Cardiovascular treatment combining two blood-thinning medications (e.g. Aspirin + Clopidogrel).',
    inCurie: 'curie pins DAPT regimens into the acoustic decoder, preventing dangerous medication dropouts.'
  },
  'SLA': {
    term: 'SLA',
    fullForm: 'Service Level Agreement',
    category: 'PERFORMANCE SLA BENCHMARK',
    description: 'Guaranteed turnaround time commitment (< 1,200 ms) for dictation transcription and SOAP generation.',
    inCurie: 'curie achieves an empirical 748ms – 809ms turnaround via single-pass AssemblyAI inference.'
  },
  'LAD': {
    term: 'LAD',
    fullForm: 'Left Anterior Descending Artery',
    category: 'CARDIAC ANATOMY',
    description: 'Major coronary artery supplying blood to the anterior wall of the heart; prime site for stent placement.',
    inCurie: 'curie preserves anatomical landmarks verbatim in post-PCI cardiology follow-ups.'
  },
  'LVEF': {
    term: 'LVEF',
    fullForm: 'Left Ventricular Ejection Fraction',
    category: 'CARDIOLOGY HEMODYNAMICS',
    description: 'Volumetric fraction of fluid ejected with each contraction (normal reference range: 50% – 70%).',
    inCurie: 'curie eliminates phonetic corruption (e.g. "ejection friction" → "LVEF 55%").'
  },
  'PEFR': {
    term: 'PEFR',
    fullForm: 'Peak Expiratory Flow Rate',
    category: 'PULMONARY FUNCTION TESTING',
    description: 'Maximum velocity of exhalation (L/min) measuring airway obstruction during asthma exacerbations.',
    inCurie: 'curie locks PEFR values into pediatric respiratory documentation for accurate asthma staging.'
  },
  'SpO2': {
    term: 'SpO2',
    fullForm: 'Peripheral Capillary Oxygen Saturation',
    category: 'PATIENT VITAL SIGNS',
    description: 'Percentage of oxygenated hemoglobin in the bloodstream measured by pulse oximetry.',
    inCurie: 'curie displays SpO2 vitals and retains oxygen levels verbatim in objective findings.'
  },
  'MRN': {
    term: 'MRN',
    fullForm: 'Medical Record Number',
    category: 'HOSPITAL ADMINISTRATION',
    description: 'Unique alphanumeric patient identifier assigned by healthcare institutions to individual medical charts.',
    inCurie: 'curie binds MRNs to FHIR R4 subjects and Epic export headers for zero-mixup chart synchronization.'
  }
}

/**
 * TermTooltip Component
 * Styled with precision matching the dark editorial developer card aesthetics.
 * - Warm terracotta/orange dotted underline on trigger word
 * - NO native browser title popup (avoids double tooltips)
 * - Smart viewport collision detection (never cuts off screen)
 * - Category badge with icon + full form in gold amber + plain-English definition + "In curie" callout
 */
export default function TermTooltip({
  term,
  children,
  className = '',
  accentColor = true
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [placement, setPlacement] = useState('top') // 'top' | 'bottom'
  const [horizontalAlign, setHorizontalAlign] = useState('center') // 'center' | 'left' | 'right'

  const timeoutRef = useRef(null)
  const containerRef = useRef(null)

  const normalizedKey = term ? term.trim().toUpperCase() : ''
  const termData = CLINICAL_TERMS[normalizedKey] || CLINICAL_TERMS[term] || {
    term: term || 'Term',
    fullForm: term || 'Technical Term',
    category: 'CLINICAL GLOSSARY',
    description: 'Specialized medical abbreviation or clinical terminology.',
    inCurie: 'curie recognizes and preserves this clinical term with zero phonetic degradation.'
  }

  const updatePosition = () => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    
    // If element is in top 280px of screen, pop BELOW to avoid clipping
    if (rect.top < 280) {
      setPlacement('bottom')
    } else {
      setPlacement('top')
    }

    // Horizontal bounds safety
    if (rect.left < 160) {
      setHorizontalAlign('left')
    } else if (window.innerWidth - rect.right < 160) {
      setHorizontalAlign('right')
    } else {
      setHorizontalAlign('center')
    }
  }

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current)
    updatePosition()
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false)
    }, 120)
  }

  const handleClick = (e) => {
    e.stopPropagation()
    updatePosition()
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

  // Compute position classes
  const getPositionClasses = () => {
    let classes = ''
    if (placement === 'bottom') {
      classes += 'top-full mt-2 '
    } else {
      classes += 'bottom-full mb-2 '
    }

    if (horizontalAlign === 'left') {
      classes += 'left-0 '
    } else if (horizontalAlign === 'right') {
      classes += 'right-0 '
    } else {
      classes += 'left-1/2 -translate-x-1/2 '
    }

    return classes
  }

  const triggerColorClass = accentColor
    ? 'text-[#E25C34] hover:text-[#C54722] border-[#E25C34]/70 hover:border-[#E25C34]'
    : 'text-black border-neutral-400 hover:border-black'

  return (
    <span
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`relative inline-flex items-baseline cursor-help group select-none ${className}`}
      // NOTE: Intentionally NO `title` attribute to prevent native browser tooltip overlap!
      aria-label={`${termData.term}: ${termData.fullForm}`}
    >
      {/* Trigger Text with Terracotta/Orange Dotted Underline */}
      <span className={`border-b border-dotted font-medium transition-colors ${triggerColorClass}`}>
        {children || term}
      </span>

      {/* Floating Tooltip Card (Exact match to reference) */}
      {isVisible && (
        <span
          role="tooltip"
          className={`absolute ${getPositionClasses()} z-[9999] w-72 sm:w-80 p-4 bg-[#141416] text-white rounded-2xl shadow-2xl border border-neutral-700/80 text-left pointer-events-auto animate-in fade-in zoom-in-95 duration-150`}
        >
          {/* Header Line */}
          <span className="flex items-center justify-between gap-2 pb-2 border-b border-neutral-800/80">
            <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#E25C34]">
              <BookOpen className="w-3 h-3 text-[#E25C34] shrink-0" />
              <span>{termData.category}</span>
            </span>
            <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-500 font-semibold">
              TOOLTIP
            </span>
          </span>

          {/* Term Name (White Bold) */}
          <span className="block font-mono text-sm font-bold text-white mt-2.5">
            {termData.term}
          </span>

          {/* Full Form (Gold Amber) */}
          <span className="block text-xs font-bold text-[#E5A93C] mt-0.5 leading-snug">
            {termData.fullForm}
          </span>

          {/* Description Paragraph */}
          <span className="block text-xs text-neutral-300 leading-relaxed font-sans font-normal mt-2">
            {termData.description}
          </span>

          {/* Bottom In curie Note */}
          <span className="block mt-3 pt-2.5 border-t border-neutral-800/80 text-[11px] font-mono leading-relaxed text-neutral-300">
            <strong className="text-[#E25C34] font-bold">In curie:</strong>{' '}
            <span>{termData.inCurie}</span>
          </span>

          {/* Arrow */}
          {placement === 'top' ? (
            <span
              className={`absolute top-full -mt-px border-4 border-transparent border-t-[#141416] ${
                horizontalAlign === 'left' ? 'left-6' : horizontalAlign === 'right' ? 'right-6' : 'left-1/2 -translate-x-1/2'
              }`}
            />
          ) : (
            <span
              className={`absolute bottom-full -mb-px border-4 border-transparent border-b-[#141416] ${
                horizontalAlign === 'left' ? 'left-6' : horizontalAlign === 'right' ? 'right-6' : 'left-1/2 -translate-x-1/2'
              }`}
            />
          )}
        </span>
      )}
    </span>
  )
}
