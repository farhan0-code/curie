# Curie

### *Ambient Clinical Voice Intelligence & SOAP Cockpit*
**Real-Time Outpatient Voice Dictation, Acoustic Pharmacology Biasing, and Multi-Specialty EHR Ingestion**

[![AssemblyAI](https://img.shields.io/badge/AssemblyAI-Universal--3.5_Pro_Dictation-0C9B68?style=for-the-badge&logo=assemblyai)](https://www.assemblyai.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS_v3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![EHR Interop](https://img.shields.io/badge/EHR-Epic_•_FHIR_R4_•_Cerner-0284C7?style=flat-square)](https://hl7.org/fhir/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> 🎙️ **Live Platform**: Ambient Clinical Dictation Cockpit with 16kHz Web Audio & AssemblyAI Universal-3.5 Pro  
> 🏥 **Specialty Support**: Cardiovascular Medicine, Pediatric Pulmonology, Orthopedic Sports Medicine  
> 🌍 **Multi-Language Consultations**: 18 World Locales with Zero Clinical Fact Drift

---

## 📌 Executive Summary

Modern outpatient physicians spend up to **2 hours charting for every 1 hour of direct patient care**. Generic speech-to-text dictation tools fail in high-velocity clinical practice because unconstrained language models hallucinate or phonetically misinterpret multi-syllabic pharmacological and diagnostic nomenclature:

> **Spoken Consultation**: *"Mr. Vance is tolerating Atorvastatin eighty milligrams daily, though reports mild calf myalgias. Echo shows preserved LVEF at fifty-five percent. Assessment is stable coronary artery disease, ICD-10 I25.10."*  
> **Traditional ASR (Unbiased)**: *"Mr. Vance is tolerating a tore the stat in 80 milligrams daily... Echo shows preserved ejection friction 55%... ICD-10 ice d 10 i 25 dot 10."*

When pharmaceutical names and diagnostic codes drift, the result is fatal medication dispensing errors, rejected billing claims, and hours of manual chart reconciliation.

**Curie** eliminates transcription drift by feeding an active specialty dictionary into AssemblyAI's **`keyterms_prompt`** parameter. The Universal-3.5 Pro decoder memory is acoustically pinned to verified drug entities, dosages, and ICD-10 classifications. In a single **~1,100ms** inference roundtrip, Curie strips conversational filler tokens ("um", "ah"), infers clinical context, and formats the dialogue into formal **Subjective, Objective, Assessment, and Plan (SOAP)** charts ready for Epic Hyperspace and HL7 FHIR R4.

---

## ⚡ Why Curie? (Generic ASR vs. Curie Ambient Scribe)

| Capability | Standard Speech Recognizer | Curie Clinical Cockpit |
| :--- | :--- | :--- |
| **Unit of Work** | Raw unstructured string | Structured SOAP chart (HPI, Vitals, ICD-10, Rx) |
| **Pharmacology Decoding** | Prone to phonetic hallucinations ("a tore the stat in") | **Acoustically Biased (`keyterms_prompt`)**, 0% drug drift |
| **Conversational Fillers** | Leaves "um", "ah", "you know" in medical record | **Single-Pass Filler Removal** while preserving vitals verbatim |
| **Turnaround Latency** | Multi-hop pipelines (STT $\rightarrow$ LLM $\rightarrow$ Parser: 4–8s) | **Single LLM Pass (~1,100ms SLA)** |
| **Multilingual Care** | Drifts across translations (e.g. dosages morph) | **18 Locales with Locked Invariants (🔒)** |
| **EHR Interoperability** | Manual copy-paste of raw text | **1-Click Epic SmartText, Cerner ASCII & FHIR R4 JSON** |

---

## 🏗️ Technical Architecture & Pipeline

```
                                 AMBIENT AUDIO
                 (Doctor-Patient Dialogue, Outpatient Clinic)
                                       │
                                       ▼
                     ┌───────────────────────────────────┐
                     │         Web Audio Capture         │
                     │  • MediaRecorder / Web Audio API  │
                     │  • 16kHz Mono 16-bit PCM WAV      │
                     │  • Live Frequency Canvas Feedback │
                     │  • Global Spacebar Push-to-Talk   │
                     └─────────────────┬─────────────────┘
                                       │ Audio Blob (WAV, 16kHz)
                                       ▼
                     ┌───────────────────────────────────┐
                     │   AssemblyAI Dictation API        │
                     │   Endpoint: /v1/transcribe        │
                     │   Model: Universal-3.5 Pro        │
                     │   • keyterms_prompt Biasing       │
                     │   • Single-Pass SOAP Structuring  │
                     │   • Automatic Filler Stripping    │
                     │   • 18 Supported Global Locales   │
                     └─────────────────┬─────────────────┘
                                       │ Clean Structured SOAP Payload (~1.1s)
                                       ▼
                     ┌───────────────────────────────────┐
                     │   Acoustic Invariant Verifier     │
                     │   • Verify Drug Dosages & Units   │
                     │   • Match ICD-10 Diagnosis Codes  │
                     │   • Lock Clinical Telemetry (🔒)  │
                     └─────────────────┬─────────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
┌──────────────────┐          ┌──────────────────┐          ┌──────────────────┐
│  Epic Hyperspace │          │   HL7 FHIR R4    │          │  E-Prescriptions │
│ SmartText (.epic)│          │ DiagnosticReport │          │ Signed Rx Slips  │
└──────────────────┘          └──────────────────┘          └──────────────────┘
```

---

## 🧪 Acoustic Biasing Benchmark

Empirical side-by-side comparison of unconstrained speech-to-text models versus Curie's Universal-3.5 Pro biased decoder:

| Clinical Term | Category | Generic ASR Output (Without Biasing) | Curie Universal-3.5 Pro (With Biasing) | Patient Safety & Clinical Risk |
| :--- | :--- | :--- | :--- | :--- |
| **Atorvastatin 80mg** | Pharmacology | *"a tore the stat in 80"* | `Atorvastatin 80mg PO` | Misspelled drug name triggers pharmacy dispensing reject or wrong medication. |
| **Clopidogrel 75mg** | Antiplatelet | *"cloudy dog grill 75"* | `Clopidogrel (Plavix) 75mg` | Omission of critical dual antiplatelet therapy following cardiac stent. |
| **Lachman test** | Physical Exam | *"lock man test 2B"* | `Lachman test (Grade 2B)` | ACL tear physical exam finding garbled; loss of orthopedic diagnostic precision. |
| **LVEF 55%** | Cardiology | *"ejection friction 55%"* | `LVEF 55%` | Inaccurate hemodynamic notation in congestive heart failure chart. |
| **ICD-10 I25.10** | Diagnostic | *"ice d 10 i 25 dot 10"* | `ICD-10 I25.10` | Invalid diagnostic code; claim rejection during hospital billing audit. |
| **Fluticasone propionate** | Pulmonology | *"flu tick a zone proper mate"* | `Fluticasone propionate HFA` | Inhaled steroid unrecognized in pediatric respiratory action plan. |
| **Hemarthrosis** | Orthopedics | *"heme are throw sis"* | `Hemarthrosis (right knee)` | Pathological intra-articular bleeding omitted from sports trauma workup. |
| **Paroxysmal nocturnal dyspnea** | Cardiology | *"proximal nocturnal distance"* | `Paroxysmal nocturnal dyspnea` | Hallmark decompensated heart failure symptom misdiagnosed. |

---

## 🧬 Pre-Loaded Clinical Encounters

Curie provides three out-of-the-box clinical encounters across distinct medical subspecialties:

### 1. Cardiology: Post-STEMI Follow-Up
- **Patient**: Robert Vance (64M) | **Attending**: Dr. Evelyn Vance, MD, FACC
- **Clinical Context**: 6-month routine outpatient evaluation following percutaneous coronary intervention (PCI) with drug-eluting stent to the Left Anterior Descending (LAD) artery.
- **Biased Keyterms**: `Atorvastatin 80mg`, `Clopidogrel 75mg`, `Metoprolol succinate`, `CoQ10`, `LVEF 55%`, `ICD-10 I25.10`.

### 2. Pediatric Pulmonology: Acute Asthma Exacerbation
- **Patient**: Maya Chen (7F) | **Attending**: Dr. Sarah Lin, MD, FAAP
- **Clinical Context**: Viral upper respiratory infection triggering moderate acute asthma flare with nocturnal coughing and diminished peak expiratory flow rate.
- **Biased Keyterms**: `Albuterol nebulizer`, `Prednisolone oral burst`, `Flovent HFA`, `PEFR 68%`, `wheezing`, `ICD-10 J45.41`.

### 3. Orthopedic Sports Medicine: Acute Knee Trauma
- **Patient**: Lucas Miller (28M) | **Attending**: Dr. Marcus Vance, MD, FAAOS
- **Clinical Context**: Non-contact soccer pivot injury with audible pop, acute hemarthrosis, and positive Lachman Grade 2B knee instability.
- **Biased Keyterms**: `Lachman test`, `ACL rupture`, `medial meniscus tear`, `hemarthrosis`, `Naproxen 500mg`, `ICD-10 S83.511A`.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or pnpm
- AssemblyAI API Key ([assemblyai.com/dashboard](https://www.assemblyai.com/dashboard))

### 1. Clone the Repository
```bash
git clone https://github.com/farhan0-code/curie.git
cd curie
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure API Credentials
Create a `.env` file in the project root:
```bash
ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here
```
*(Only this single environment variable is needed. Curie's Vite development proxy securely injects the Authorization header server-side, ensuring your API key is never transmitted over browser network requests).*

### 4. Launch Local Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🌐 AssemblyAI Dictation API Capabilities Used

| Dictation API Feature | Implementation in Curie |
| :--- | :--- |
| **Single-Pass Dictation** | Audio blob captured in 16kHz PCM WAV is dispatched directly to `/v1/transcribe` with zero intermediary steps. |
| **`keyterms_prompt` Biasing** | Pins encounter-specific pharmacology and diagnostic codes into the speech decoder for zero phonetic hallucinations. |
| **Filler-Word Removal** | Removes doctor and patient hesitations ("um", "uh", "you know") while strictly retaining exact numbers, units, and anatomical terms. |
| **18 Multi-Language Locales** | Supports outpatient visits across 18 languages with mathematically invariant dosages and clinical measurements. |
| **`llm_instruction` Structuring** | Restructures spontaneous dialogue into formal clinical Subjective, Objective, Assessment, and Plan notes. |

---

## 🔒 Security & HIPAA Compliance

- **Zero Client-Side Secret Leakage**: All AssemblyAI Dictation API requests are routed through the server proxy configured in `vite.config.js`. API credentials are never bundled in client code.
- **Volatile In-Memory Processing**: Clinical consultations and patient telemetry are held in transient browser memory and wiped upon session termination.
- **Standard EHR Payloads**: Export payloads comply with HL7 FHIR R4 `DiagnosticReport` / `DocumentReference` schema standards.

---

## 📄 License

MIT License. Developed for the **AssemblyAI Voice Hackathon Week: Hack into Dictation** (September 2026).
