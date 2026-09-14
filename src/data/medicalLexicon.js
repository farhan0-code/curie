export const MEDICAL_LEXICON = [
  {
    term: 'Atorvastatin',
    category: 'Pharmacology',
    genericAsrError: 'a tore the stat in',
    biasedOutput: 'Atorvastatin 80mg',
    risk: 'Misspelled medication causes prescription fill delays or automated dispensing failure.'
  },
  {
    term: 'Lisinopril',
    category: 'Pharmacology',
    genericAsrError: 'listen no pill',
    biasedOutput: 'Lisinopril 20mg',
    risk: 'Phonetic corruption to non-drug word in EHR chart note.'
  },
  {
    term: 'Clopidogrel',
    category: 'Pharmacology',
    genericAsrError: 'cloudy dog grill',
    biasedOutput: 'Clopidogrel (Plavix)',
    risk: 'Fatal omission of crucial stent antiplatelet therapy.'
  },
  {
    term: 'Lachman test',
    category: 'Physical Exam',
    genericAsrError: 'lock man test',
    biasedOutput: 'Lachman test (Grade 2B)',
    risk: 'Physical exam maneuver garbled; loss of orthopedic diagnostic precision.'
  },
  {
    term: 'Fluticasone propionate',
    category: 'Pulmonology',
    genericAsrError: 'flu tick a zone proper mate',
    biasedOutput: 'Fluticasone propionate',
    risk: 'Inhaled corticosteroid unrecognized in pediatric respiratory chart.'
  },
  {
    term: 'Ejection fraction (LVEF)',
    category: 'Cardiology',
    genericAsrError: 'ejection friction 55%',
    biasedOutput: 'LVEF 55%',
    risk: 'Inaccurate hemodynamic documentation.'
  },
  {
    term: 'Paroxysmal nocturnal dyspnea',
    category: 'Cardiology',
    genericAsrError: 'proximal nocturnal distance',
    biasedOutput: 'Paroxysmal nocturnal dyspnea (PND)',
    risk: 'Missed hallmark symptom of decompensated congestive heart failure.'
  },
  {
    term: 'Hemarthrosis',
    category: 'Orthopedics',
    genericAsrError: 'heme are throw sis',
    biasedOutput: 'Hemarthrosis (right knee)',
    risk: 'Pathological intra-articular bleeding not coded properly.'
  },
  {
    term: 'Ballotable patella',
    category: 'Physical Exam',
    genericAsrError: 'bell audible nutella',
    biasedOutput: 'Ballotable patella',
    risk: 'Nonsensical phonetic substitution for knee joint effusion test.'
  },
  {
    term: 'Ipratropium bromide',
    category: 'Pulmonology',
    genericAsrError: 'eye prah trope yum bro might',
    biasedOutput: 'Ipratropium bromide',
    risk: 'Anticholinergic bronchodilator missing from emergency orders.'
  },
  {
    term: 'Troponin-I',
    category: 'Diagnostics',
    genericAsrError: 'toe pony eye',
    biasedOutput: 'Troponin-I cardiac biomarker',
    risk: 'Myocardial injury lab test not flagged in acute note.'
  },
  {
    term: 'Peak expiratory flow rate',
    category: 'Diagnostics',
    genericAsrError: 'pique expert tree slow rate',
    biasedOutput: 'PEFR 65% predicted',
    risk: 'Asthma severity staging rendered unusable in EHR.'
  }
];
