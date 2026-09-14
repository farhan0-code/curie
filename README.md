# Curie

### Ambient Clinical Voice Scribe & SOAP Cockpit

Curie is an ambient clinical intelligence and documentation cockpit for physicians. Powered by the **AssemblyAI Universal-3.5 Pro Dictation API**, Curie continuously captures doctor-patient outpatient consultations, acoustically biases speech recognition for complex pharmacological entities and ICD-10 diagnostic codes, and automatically structures formal SOAP progress notes, prescription orders, and FHIR resources in a single sub-1.2s inference roundtrip.

Developed for the **AssemblyAI Voice Hackathon Week: Hack into Dictation**.

---

## Key Innovations & Clinical Architecture

### 1. Acoustic Keyterms Biasing (`keyterms_prompt`)
Standard speech-to-text engines notoriously garble multi-syllabic pharmacological and anatomical terms (e.g. transcribing *"Atorvastatin"* as *"a tore the stat in"*, or *"Lachman test"* as *"lock man test"*). Curie feeds an active clinical dictionary into AssemblyAI's `keyterms_prompt` parameter, acoustically pinning critical nomenclature to the decoder for zero phonetic hallucinations.

### 2. Real-Time Filler Word Stripping
Physicians and patients naturally speak with hesitations, pauses, and conversational fillers ("um", "ah", "you know", "like"). Curie utilizes the Dictation API to automatically remove extraneous filler tokens while preserving exact numeric measurements (vitals, laboratory values, dosages) with 100% fidelity.

### 3. Single-Pass SOAP Note Restructuring (`llm_instruction`)
Instead of chaining multiple latency-inducing pipelines, Curie instructs Universal-3.5 Pro to transcribe and structure the consultation into formal clinical sections in a single pass:
- **Subjective (S):** Chief complaint, history of present illness (HPI), and patient narrative.
- **Objective (O):** Physical examination findings, telemetry/vitals grid, and diagnostic readouts.
- **Assessment (A):** Primary & secondary diagnoses mapped to verified ICD-10 codes.
- **Plan (P):** Structured treatment directives, lab workups, and follow-up timeline.

### 4. Verified E-Prescriptions & EHR Export
Extracts formal prescription orders with verified drug names, dosages, administration routes (PO, inhalation), frequencies, dispense quantities, and refills. 1-click export to:
- **Epic Hyperspace** SmartText format (`.epic`)
- **HL7 FHIR R4** `DiagnosticReport` / `DocumentReference` JSON
- **Cerner Millennium** PowerChart ASCII summary

---

## AssemblyAI Dictation API Capabilities Used

Curie leverages all core capabilities of the AssemblyAI Dictation API:

| Dictation API Capability | How Curie Uses It |
| :--- | :--- |
| **Real-time dictation / live transcription** | Web Audio API captures 16kHz mono audio from ambient consultations with Spacebar push-to-talk and real-time frequency waveforms. |
| **Multi-language support (18 languages)** | Outpatient clinics can conduct and transcribe consultations in 18 supported languages (English, Spanish, French, German, Portuguese, Hindi, etc.). |
| **Filler-word removal / clean output** | Strips patient and doctor conversational hesitations ("um", "ah", "you know") without altering critical clinical dosages or vitals. |
| **Custom vocabulary / other integration** | `keyterms_prompt` acoustic memory biasing eliminates phonetic hallucinations for rare drugs and ICD-10 codes, coupled with Epic/Cerner/FHIR EHR pipelines. |

---

## Acoustic Biasing Benchmark

| Clinical Term | Category | Generic ASR Output (Without Biasing) | Curie Universal-3.5 Pro (With Biasing) | Clinical & Patient Safety Risk |
| :--- | :--- | :--- | :--- | :--- |
| **Atorvastatin** | Pharmacology | *"a tore the stat in 80"* | `Atorvastatin 80mg` | Misspelled medication causes pharmacy dispensing delay. |
| **Lisinopril** | Pharmacology | *"listen no pill 20"* | `Lisinopril 20mg PO` | Phonetic corruption to non-drug word in patient chart. |
| **Clopidogrel** | Pharmacology | *"cloudy dog grill"* | `Clopidogrel (Plavix) 75mg` | Fatal omission of stent antiplatelet therapy post-PCI. |
| **Lachman test** | Physical Exam | *"lock man test 2B"* | `Lachman test (Grade 2B)` | Physical exam maneuver garbled; loss of orthopedic diagnostic precision. |
| **Fluticasone propionate** | Pulmonology | *"flu tick a zone proper mate"* | `Fluticasone propionate (Flovent)` | Inhaled corticosteroid unrecognized in pediatric respiratory chart. |
| **LVEF 55%** | Cardiology | *"ejection friction 55%"* | `LVEF 55%` | Inaccurate hemodynamic documentation in congestive heart failure. |
| **PND** | Cardiology | *"proximal nocturnal distance"* | `Paroxysmal nocturnal dyspnea` | Missed hallmark symptom of decompensated heart failure. |
| **Hemarthrosis** | Orthopedics | *"heme are throw sis"* | `Hemarthrosis (right knee)` | Pathological intra-articular bleeding unrecorded. |

---

## Pre-Loaded Clinical Encounters

Curie includes three pre-configured clinical encounter scenarios for immediate evaluation:

1. **Cardiology: Post-STEMI Follow-Up**
   - **Patient:** Robert Vance (64M) | Attending: Dr. Evelyn Vance, MD, FACC
   - **Pathology:** Atherosclerotic heart disease post-LAD drug-eluting stent, DAPT, Atorvastatin, Metoprolol succinate, SAMS calf myalgias.
2. **Pediatric Pulmonology: Acute Asthma Exacerbation**
   - **Patient:** Maya Chen (7F) | Attending: Dr. Sarah Lin, MD, FAAP
   - **Pathology:** Viral-triggered moderate asthma flare, Albuterol nebulizer, Prednisolone oral burst, Flovent HFA spacer, PEFR monitoring.
3. **Orthopedic Sports Medicine: Acute Knee Trauma**
   - **Patient:** Lucas Miller (28M) | Attending: Dr. Marcus Vance, MD, FAAOS
   - **Pathology:** Non-contact deceleration injury, Lachman Grade 2B, medial meniscus tear, hemarthrosis, MRI order, Naproxen.

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- AssemblyAI API Key ([Get one here](https://www.assemblyai.com/dashboard))

### Installation
```bash
git clone https://github.com/farhan0-code/curie.git
cd curie
npm install
```

### Environment Configuration
Create a `.env` file in the root directory:
```bash
ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here
```
*(Only a single `ASSEMBLYAI_API_KEY` variable is required. Curie's Vite server proxy securely injects the key server-side so it is never exposed in browser network traffic.)*

### Running the Application
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## Technology Stack

- **Speech-to-Text & LLM Engine:** AssemblyAI Universal-3.5 Pro Dictation API (`/v1/transcribe`)
- **Frontend Framework:** React 19 + Vite 6
- **Styling & Design System:** Tailwind CSS (Swiss-Clinical Light Aesthetic, custom typography tokens)
- **Audio Processing:** Web Audio API (16kHz mono, 16-bit PCM WAV encoding, real-time RMS visualizer)
- **Icons:** Lucide React
- **Celebration Effects:** Canvas Confetti

---

## Security & HIPAA Considerations

- **Server-Side API Proxy:** Dictation API credentials remain strictly server-side in `vite.config.js` and are never exposed to the client bundle.
- **Audio Encoding:** Uncompressed 16-bit PCM WAV at 16,000 Hz, matching clinical medical transcription standards.
- **Zero Client-Side Persistence of PHI:** Encounter data and telemetry remain in volatile browser state with manual EHR export triggers.

---

## License

MIT License. Built for the AssemblyAI Voice Hackathon Week (September 2026).
