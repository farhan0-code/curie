export const CLINICAL_ENCOUNTERS = [
  {
    id: 'cardiology-stemi-followup',
    title: 'Cardiology: Post-STEMI Follow-Up',
    specialty: 'Cardiovascular Medicine',
    doctor: 'Dr. Evelyn Vance, MD, FACC',
    patient: {
      name: 'Robert Vance',
      age: 64,
      gender: 'Male',
      mrn: 'MRN-88241',
      dob: '1962-04-12',
      allergies: ['Sulfa drugs (urticaria)'],
      vitals: {
        bp: '138/84',
        bpStatus: 'Elevated',
        hr: 68,
        hrUnit: 'bpm',
        spo2: 98,
        temp: 98.4,
        bmi: 28.2
      }
    },
    chiefComplaint: 'Routine 6-month cardiology follow-up post LAD percutaneous coronary intervention',
    keyterms: [
      'Robert Vance',
      'Atorvastatin',
      'Metoprolol succinate',
      'Clopidogrel',
      'DAPT',
      'ejection fraction',
      'myalgias',
      'LAD',
      'ICD-10 I25.10',
      'CoQ10',
      'orthopnea',
      'paroxysmal nocturnal dyspnea',
      'troponin-I',
      'atherosclerosis'
    ],
    sttPrompt: "A board-certified cardiologist dictating an outpatient follow-up note for patient Robert Vance in cardiology clinic.",
    llmInstruction: "Remove filler words, false starts, and hesitation. Format strictly into formal clinical SOAP format (Subjective, Objective, Assessment with ICD-10 codes, Plan with prescription details). Retain all drug names, dosages, anatomical sites, and clinical measurements verbatim.",
    spokenTranscript: "Good morning, examining Mr. Robert Vance, 64-year-old male here for six month follow-up after stent placement to the LAD. Patient denies chest tightness, orthopnea, or paroxysmal nocturnal dyspnea. Tolerating Atorvastatin eighty milligrams daily, though reports mild bilateral calf myalgias. Echo shows preserved left ventricular ejection fraction at fifty-five percent. Blood pressure in clinic is one thirty-eight over eighty-four. Assessment is stable coronary artery disease and primary essential hypertension. Plan is to continue Dual Antiplatelet Therapy with Aspirin eighty-one milligrams and Clopidogrel seventy-five milligrams. We will add CoQ10 two hundred milligrams daily for statin-associated muscle symptoms, titrate Metoprolol succinate to fifty milligrams PO daily, order fasting lipid panel in three months, and schedule follow-up in six months.",
    soapNote: {
      subjective: "64-year-old male presents for routine 6-month cardiology follow-up post percutaneous coronary intervention with drug-eluting stent to the left anterior descending (LAD) artery. Patient reports overall good functional exercise tolerance. Denies angina, pressure, shortness of breath on exertion, orthopnea, or paroxysmal nocturnal dyspnea. Notes mild, intermittent bilateral calf myalgias on high-dose statin therapy; denies dark urine or severe muscle weakness.",
      objective: "Vitals: BP 138/84 mmHg, HR 68 bpm (regular), SpO2 98% ambient air, Temp 98.4°F, BMI 28.2 kg/m².\nPhysical Exam:\n• General: Alert, oriented ×3, in no acute cardiovascular distress.\n• Cardiovascular: Regular rate and rhythm. S1 and S2 present and physiological. No S3, S4, murmurs, or pericardial rubs. JVP flat.\n• Pulmonary: Clear to auscultation bilaterally without rales, rhonchi, or wheezes.\n• Extremities: Warm, well-perfused. No pretibial or pedal edema bilaterally. Calves soft, non-tender to palpation.\n• Diagnostics: Transthoracic Echocardiogram (TTE) reveals preserved Left Ventricular Ejection Fraction (LVEF) at 55% with normal diastolic filling.",
      assessment: [
        {
          code: 'I25.10',
          diagnosis: 'Atherosclerotic heart disease of native coronary artery without angina pectoris',
          notes: 'Stable 6 months post-LAD drug-eluting stent placement.'
        },
        {
          code: 'I10',
          diagnosis: 'Essential (primary) hypertension',
          notes: 'Mildly elevated in clinic (138/84); titrating beta-blockade.'
        },
        {
          code: 'M60.80',
          diagnosis: 'Statin-associated muscle symptoms (SAMS)',
          notes: 'Tolerable mild bilateral calf myalgias without frank rhabdomyolysis.'
        }
      ],
      plan: [
        'Continue Dual Antiplatelet Therapy (DAPT): Aspirin 81 mg PO daily + Clopidogrel (Plavix) 75 mg PO daily for minimum 12 months post-PCI.',
        'Maintain Atorvastatin 80 mg PO nightly for aggressive plaque stabilization. Initiate Coenzyme Q10 (CoQ10) 200 mg PO daily for statin-associated muscle symptoms.',
        'Titrate Metoprolol succinate ER from 25 mg to 50 mg PO daily for target blood pressure < 130/80 mmHg.',
        'Order fasting lipid panel, comprehensive metabolic panel (CMP), and serum Creatine Kinase (CK) at 12-week mark.',
        'Follow-up in outpatient cardiology clinic in 6 months; return precautions reviewed for acute coronary symptoms.'
      ]
    },
    prescriptions: [
      {
        drug: 'Clopidogrel (Plavix)',
        dosage: '75 mg',
        route: 'Oral (PO)',
        frequency: 'Once daily',
        quantity: 90,
        refills: 3,
        indication: 'Post-PCI Secondary Prevention'
      },
      {
        drug: 'Metoprolol Succinate ER',
        dosage: '50 mg',
        route: 'Oral (PO)',
        frequency: 'Once daily in morning',
        quantity: 90,
        refills: 3,
        indication: 'Hypertension / Beta-blockade'
      },
      {
        drug: 'Atorvastatin Calcium',
        dosage: '80 mg',
        route: 'Oral (PO)',
        frequency: 'Once nightly',
        quantity: 90,
        refills: 3,
        indication: 'Hyperlipidemia / Plaque Stabilization'
      },
      {
        drug: 'Coenzyme Q10 (CoQ10)',
        dosage: '200 mg',
        route: 'Oral (PO)',
        frequency: 'Once daily with meals',
        quantity: 90,
        refills: 3,
        indication: 'Statin Myalgia Relief'
      }
    ],
    audioUrl: '/fixtures/cardiology_consultation_en.wav',
    audioDuration: '58.1s'
  },
  {
    id: 'pediatrics-asthma-acute',
    title: 'Pediatrics: Acute Asthma Exacerbation',
    specialty: 'Pediatric Pulmonology',
    doctor: 'Dr. Sarah Jenkins, MD, FAAP',
    patient: {
      name: 'Maya Chen',
      age: 7,
      gender: 'Female',
      mrn: 'MRN-40192',
      dob: '2019-08-24',
      allergies: ['Penicillin (anaphylaxis)'],
      vitals: {
        bp: '102/64',
        bpStatus: 'Normal',
        hr: 112,
        hrUnit: 'bpm',
        spo2: 94,
        temp: 99.1,
        bmi: 16.4
      }
    },
    chiefComplaint: 'Acute wheezing and nocturnal dyspnea for 3 days after viral upper respiratory infection',
    keyterms: [
      'Maya Chen',
      'Albuterol HFA',
      'Ipratropium bromide',
      'Fluticasone propionate',
      'Prednisolone',
      'valved holding chamber',
      'subcostal retractions',
      'expiratory wheezing',
      'PEFR',
      'ICD-10 J45.901',
      'hypoxemia',
      'bronchospasm'
    ],
    sttPrompt: "A pediatric pulmonologist dictating an urgent clinical visit for 7-year-old female Maya Chen with acute asthma exacerbation.",
    llmInstruction: "Remove filler words, false starts, and hesitation. Format strictly into formal pediatric SOAP note format with ICD-10 diagnostics and specific inhalation spacer instructions.",
    spokenTranscript: "Seven-year-old female Maya Chen accompanied by mother for acute asthma flare-up. Symptoms began three days ago following cold symptoms with rhinorrhea. Mother has been administering Albuterol nebulizer every four hours with transient relief. Physical exam reveals bilateral expiratory wheezing across mid and lower lung zones, mild subcostal retractions, respiratory rate twenty-six, pulse oximetry ninety-four percent on ambient air. No cyanosis or grunting. Peak expiratory flow rate is sixty-five percent of predicted personal best. Assessment: Acute moderate exacerbation of mild persistent asthma. Plan: Administer oral Prednisolone fifteen milligrams PO now and continue for five days. Provide in-clinic nebulized Albuterol two point five milligrams with Ipratropium bromide zero point five milligrams. Step up maintenance therapy to Fluticasone propionate eighty-eight micrograms inhaled twice daily via valved holding chamber. Updated Asthma Action Plan provided to mother. Return to ED immediately for lethargy or persistent retractions; follow-up in clinic in one week.",
    soapNote: {
      subjective: "7-year-old female Maya Chen presents with mother for acute asthma exacerbation. Symptoms began 72 hours ago following viral rhinorrhea. Mother reports persistent cough, audible expiratory wheezing, and nocturnal awakenings. Albuterol nebulizations every 4 hours provided only transient relief. No fever, vomiting, or lethargy.",
      objective: "Vitals: BP 102/64 mmHg, HR 112 bpm (tachycardic, appropriate for age/distress), RR 26 breaths/min, SpO2 94% on room air, Temp 99.1°F.\nPhysical Exam:\n• General: Alert child in mild-to-moderate respiratory distress, speaking in short sentences.\n• Respiratory: Mild subcostal and intercostal retractions noted. Auscultation reveals diffuse bilateral expiratory wheezes with prolonged expiratory phase. Good bilateral air entry.\n• ENT: Mild nasal turbinate edema with clear rhinorrhea; oropharynx non-erythematous.\n• Spirometry / PEFR: Peak Expiratory Flow Rate measured at 165 L/min (65% of predicted personal best).",
      assessment: [
        {
          code: 'J45.901',
          diagnosis: 'Unspecified asthma with (acute) exacerbation',
          notes: 'Moderate acute exacerbation triggered by viral upper respiratory tract infection.'
        },
        {
          code: 'J00',
          diagnosis: 'Acute nasopharyngitis [common cold]',
          notes: 'Resolving viral prodrome.'
        }
      ],
      plan: [
        'Administer oral Prednisolone 15 mg (1 mg/kg) PO immediately in clinic; continue 15 mg PO daily for 5-day course (no taper required).',
        'In-office duo-nebulizer treatment: Albuterol sulfate 2.5 mg / 3 mL combined with Ipratropium bromide 0.5 mg / 2.5 mL.',
        'Step up maintenance controller: Fluticasone propionate (Flovent HFA) 44 mcg/puff, 2 puffs inhaled twice daily via valved holding chamber (spacer) with mask.',
        'Rescue bronchodilator: Albuterol HFA 90 mcg/actuation, 2 puffs inhaled every 4–6 hours as needed for wheeze or shortness of breath.',
        'Reviewed and signed comprehensive Pediatric Asthma Action Plan (Yellow Zone instructions). Return precautions given for persistent retractions, cyanosis, or SpO2 < 92%. In-clinic follow-up scheduled in 7 days.'
      ]
    },
    prescriptions: [
      {
        drug: 'Prednisolone Oral Solution (15mg/5mL)',
        dosage: '15 mg (5 mL)',
        route: 'Oral (PO)',
        frequency: 'Once daily in morning with food × 5 days',
        quantity: 25,
        refills: 0,
        indication: 'Acute Anti-inflammatory Burst'
      },
      {
        drug: 'Fluticasone Propionate (Flovent HFA 44mcg)',
        dosage: '88 mcg (2 puffs)',
        route: 'Inhalation via Valved Holding Chamber',
        frequency: 'Twice daily (morning and evening)',
        quantity: 1,
        refills: 5,
        indication: 'Long-term Asthma Maintenance'
      },
      {
        drug: 'Albuterol Sulfate HFA Inhaler (90mcg)',
        dosage: '180 mcg (2 puffs)',
        route: 'Inhalation via Spacer',
        frequency: 'Every 4-6 hours PRN wheezing/dyspnea',
        quantity: 1,
        refills: 3,
        indication: 'Rescue Bronchodilator'
      }
    ],
    audioUrl: '/fixtures/pediatric_asthma_en.wav',
    audioDuration: '71.8s'
  },
  {
    id: 'orthopedics-knee-acl',
    title: 'Orthopedics: Acute ACL & Meniscal Tear',
    specialty: 'Orthopedic Sports Surgery',
    doctor: 'Dr. Marcus Vance, MD, FAAOS',
    patient: {
      name: 'Lucas Miller',
      age: 28,
      gender: 'Male',
      mrn: 'MRN-19304',
      dob: '1998-11-03',
      allergies: ['No Known Drug Allergies (NKDA)'],
      vitals: {
        bp: '122/76',
        bpStatus: 'Normal',
        hr: 72,
        hrUnit: 'bpm',
        spo2: 99,
        temp: 98.6,
        bmi: 24.5
      }
    },
    chiefComplaint: 'Right knee acute twisting injury during soccer match with audible pop and rapid hemarthrosis',
    keyterms: [
      'Lucas Miller',
      'Lachman test',
      'Anterior Cruciate Ligament',
      'ACL rupture',
      'pivot shift',
      'McMurray test',
      'ballotable patella',
      'joint effusion',
      'medial meniscus',
      'Naproxen',
      'ICD-10 S83.511A',
      'hemarthrosis'
    ],
    sttPrompt: "An orthopedic sports medicine physician dictating a physical examination and diagnostic plan for right knee injury in patient Lucas Miller.",
    llmInstruction: "Remove filler words, false starts, and hesitation. Format strictly into formal orthopedic physical examination and surgical plan with ICD-10 codes.",
    spokenTranscript: "Evaluating Lucas Miller, twenty-eight-year-old male athlete presenting with acute right knee injury after non-contact deceleration and pivoting maneuver yesterday. Patient felt and heard an audible pop with inability to bear weight and marked joint swelling within two hours. On physical examination of right knee: large joint effusion with ballotable patella. Lachman test is positive with soft, mushy endpoint compared to intact contralateral left knee. Anterior drawer test is positive. Anterior cruciate ligament tear suspected. Joint line tenderness present along medial joint line; McMurray test equivocal due to guarding. Extensor mechanism intact. Distal neurovascular examination intact with two plus dorsalis pedis pulse. Assessment: Right knee acute anterior cruciate ligament rupture, rule out medial meniscus tear. Plan: High-field non-contrast MRI of right knee ordered stat. Provide hinged knee brace locked in extension and crutches for non-weight bearing ambulation. Prescribe Naproxen five hundred milligrams twice daily with food for analgesia. Apply RICE protocol. Refer to orthopedic sports surgery for surgical reconstruction consultation once effusion resolves.",
    soapNote: {
      subjective: "28-year-old male soccer player presents with acute right knee trauma sustained yesterday during competitive match. Mechanism: non-contact sudden deceleration with pivoting on planted foot. Patient felt a distinct pop and sudden instability. Acute large swelling developed within 90 minutes. Unable to return to play or bear weight without severe pain. No prior right knee injuries or surgeries.",
      objective: "Vitals: BP 122/76 mmHg, HR 72 bpm, SpO2 99% ambient air, Temp 98.6°F, BMI 24.5 kg/m².\nPhysical Exam (Right Lower Extremity):\n• Inspection: Moderate-to-severe joint effusion with loss of normal peripatellar dimples. Ballotable patella positive. No open wounds or ecchymosis.\n• Range of Motion: Active flexion limited to 90 degrees secondary to pain and tense effusion; extension lack of 5 degrees.\n• Stability Testing:\n  - Lachman Test: Strongly positive (Grade 2B) with soft, indistinct endpoint (contralateral left knee normal with firm endpoint).\n  - Anterior Drawer Test: Positive with increased anterior tibial translation.\n  - Pivot Shift Test: Equivocal secondary to protective hamstring spasm.\n  - Collateral Ligaments: Valgus and varus stress testing stable at 0° and 30° flexion.\n  - Meniscal Signs: Tenderness along posteromedial joint line; McMurray test deferred due to guarding.\n• Neurovascular: Distal pulses 2+ dorsalis pedis and posterior tibial. Sensation intact throughout L4-S1 dermatomes.",
      assessment: [
        {
          code: 'S83.511A',
          diagnosis: 'Sprain of anterior cruciate ligament of right knee, initial encounter',
          notes: 'Acute complete ACL tear clinically confirmed by positive Lachman.'
        },
        {
          code: 'S83.241A',
          diagnosis: 'Other tear of medial meniscus, current injury, right knee, initial encounter',
          notes: 'High clinical suspicion for concomitant meniscal pathology.'
        },
        {
          code: 'M25.061',
          diagnosis: 'Hemarthrosis, right knee',
          notes: 'Post-traumatic tense joint effusion.'
        }
      ],
      plan: [
        'Stat 3T non-contrast MRI of right knee to confirm full extent of ACL rupture and rule out meniscal root / bucket-handle tear or articular cartilage chondral shear.',
        'Immobilize right lower extremity in hinged knee brace locked at 0° extension; crutches provided for strict non-weight-bearing (NWB) status.',
        'Prescribe Naproxen 500 mg PO BID with meals for anti-inflammatory pain control; cryotherapy and elevation (RICE protocol) 20 mins every 2 hours.',
        'Pre-operative sports physical therapy consultation for prehabilitation (quadriceps reactivation, swelling reduction, restoring extension).',
        'Follow-up in clinic in 7 days with MRI imaging for surgical consultation regarding arthroscopic ACL reconstruction (autograft vs allograft discussion).'
      ]
    },
    prescriptions: [
      {
        drug: 'Naproxen (EC-Naprosyn)',
        dosage: '500 mg',
        route: 'Oral (PO)',
        frequency: 'Twice daily with meals',
        quantity: 30,
        refills: 1,
        indication: 'Post-Traumatic Analgesia & Anti-inflammatory'
      },
      {
        drug: 'Hinged Knee Brace (Locked at 0°)',
        dosage: '1 unit',
        route: 'Orthotic Device',
        frequency: 'Continuous wear for ambulation',
        quantity: 1,
        refills: 0,
        indication: 'Joint Stabilization / Motion Restriction'
      },
      {
        drug: 'Crutches (Axillary Pair)',
        dosage: '1 pair',
        route: 'Assistive Ambulation Device',
        frequency: 'Strict Non-Weight Bearing',
        quantity: 1,
        refills: 0,
        indication: 'Right Lower Extremity Unloading'
      }
    ],
    audioUrl: '/fixtures/orthopedic_knee_trauma_en.wav',
    audioDuration: '76.6s'
  }
];
