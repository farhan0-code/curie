# Curie — Real-Time Meeting Intelligence & AI Summaries

> **"Turn unstructured meeting conversations into instant, actionable intelligence."**  
> Ambient meeting intelligence engine powered by **AssemblyAI Universal-3.6 Pro** streaming STT and **Gemini** via the AssemblyAI LLM Gateway. Live transcription, automatic summaries, key decisions, action items, and instant PDF report export.

[![Engine](https://img.shields.io/badge/Speech%20Engine-AssemblyAI%20Universal--3.6%20Pro-0C9B68?logo=assemblyai&logoColor=white)](https://www.assemblyai.com/)
[![Streaming STT](https://img.shields.io/badge/Streaming-v3%20WebSocket-0052FF)](https://www.assemblyai.com/docs/streaming/getting-started/transcribe-streaming-audio)
[![LLM Gateway](https://img.shields.io/badge/LLM%20Gateway-Gemini%20Flash-black)](https://www.assemblyai.com/docs/llm-gateway/quickstart)
[![Languages](https://img.shields.io/badge/Languages-32%20Locales%20with%20Code--Switching-4a4642)](https://www.assemblyai.com/docs/streaming/multilingual-transcription)
[![Latency](https://img.shields.io/badge/Latency-Sub--300ms%20Realtime-ff571a)](https://www.assemblyai.com/products/streaming-speech-to-text)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 What is Curie?

**Curie** is a browser-based ambient meeting companion built for Google Meet, Zoom, Microsoft Teams, and in-person discussions.

1. **Ambient Background Listening**: Keep Curie open in a browser tab. It captures meeting audio via your device microphone at 16,000 Hz PCM and streams it live over WebSocket to AssemblyAI.
2. **Universal-3.6 Pro Streaming**: Real-time word-by-word transcription with sub-second latency and native multilingual code-switching across 32 languages.
3. **Gemini Post-Meeting Synthesis**: The instant you conclude a meeting, AssemblyAI's LLM Gateway routes the transcript through **Gemini Flash** to extract:
   - **Executive Summary**: 2-3 sentence high-level brief.
   - **Key Topics**: Core themes discussed.
   - **Key Points**: Bulleted takeaways from the conversation.
   - **Decisions Made**: Explicit agreements reached by participants.
   - **Action Items**: Next steps, assignees, and deadlines with interactive checkboxes.
4. **Instant PDF Report**: Download a beautifully styled executive meeting brief in one click.
5. **No-Mic Demo Mode**: Test the full end-to-end pipeline instantly using simulated meeting audio and transcripts without needing an active microphone.

---

## 🏗️ Architecture & Pipeline

```
┌────────────────────────────────────────────────────────┐
│                   MEETING AUDIO                        │
│   (Microphone / Browser Audio / Built-in Demo Mode)    │
└───────────────────────────┬────────────────────────────┘
                            │ 16kHz PCM Audio Stream
                            ▼
┌────────────────────────────────────────────────────────┐
│         ASSEMBLYAI STREAMING STT v3 WEBSOCKET         │
│          wss://streaming.assemblyai.com/v3/ws          │
│               Model: universal-3-6-pro                 │
└───────────────────────────┬────────────────────────────┘
                            │ Live Turn Events (Partial & Final)
                            ▼
┌────────────────────────────────────────────────────────┐
│             CURIE REAL-TIME CAPTURE UI                │
│    • Live transcript display with word counter        │
│    • Audio waveform visualizer & session timer        │
│    • Speaker turns & live partial speech updates      │
└───────────────────────────┬────────────────────────────┘
                            │ Meeting Ended → POST /api/summarize
                            ▼
┌────────────────────────────────────────────────────────┐
│            ASSEMBLYAI LLM GATEWAY (GEMINI)            │
│  https://llm-gateway.assemblyai.com/v1/chat/completions│
│                 Model: gemini-3.5-flash                │
└───────────────────────────┬────────────────────────────┘
                            │ Structured JSON Insights
                            ▼
┌────────────────────────────────────────────────────────┐
│               CURIE RESULTS DASHBOARD                  │
│    • Executive Summary & Sentiment Analysis           │
│    • Key Topics pills & Key Points checklist          │
│    • Decisions & Interactive Action Items             │
│    • One-Click Downloadable PDF Report                │
└────────────────────────────────────────────────────────┘
```

---

## 🔒 Single-Key Security Architecture

Curie requires **only one API key** (`ASSEMBLYAI_API_KEY`):
- **Temporary Authentication Tokens**: The frontend never exposes your permanent API key. The server endpoint `GET /api/streaming-token` issues a short-lived, single-use token (`expires_in_seconds=480`) to initialize the browser's WebSocket connection.
- **Unified LLM Gateway**: The post-meeting Gemini summary runs through AssemblyAI's LLM Gateway using the same AssemblyAI API key. **No external Google Gemini key is needed.**
- **Privacy-First**: Audio streams in real-time and is not persistently stored on any server after the session concludes.

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- Node.js 18+ (tested on Node 22)
- npm or pnpm
- AssemblyAI API Key ([Get one free at assemblyai.com](https://www.assemblyai.com/dashboard/home))

### 1. Clone & Install
```bash
git clone https://github.com/farhan0-code/curie.git
cd curie
npm install
```

### 2. Configure Environment
Create a `.env` file in the project root:
```env
ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here
```

*(Note: The API key is kept secure server-side in Vite middleware and is never bundled into client JavaScript).*

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 💡 How to Use

1. **Start Free**: Click "Start Free" from the landing page.
2. **Configure Session**: Name your meeting (e.g., *"Q4 Strategy Review"*) and select your language.
3. **Capture Options**:
   - **Start Listening**: Uses your microphone to transcribe live meeting audio in real-time using `universal-3-6-pro`.
   - **Run Demo**: Simulates a live multi-speaker product meeting without requiring microphone permissions.
4. **End & Generate Summary**: Concludes the session, sends the transcript through the AssemblyAI LLM Gateway (Gemini), and displays your structured dashboard.
5. **Download PDF**: Click **Download PDF** to export your meeting minutes and action items.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Tailwind CSS, Lucide Icons, Framer Motion
- **Voice Intelligence**: AssemblyAI Streaming STT v3 (`universal-3-6-pro`)
- **Reasoning & Summarization**: AssemblyAI LLM Gateway (`gemini-3.5-flash`)
- **Audio Ingestion**: Web Audio API (16kHz PCM Little-Endian, 2048 buffer size)
- **Tooling**: Vite 6, PostCSS, Autoprefixer

---

## 📄 License

MIT License — Copyright (c) 2026 Curie Contributors.
