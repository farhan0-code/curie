import React, { useState } from 'react'
import {
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Search,
  Copy,
  Check,
  Cpu,
  Mic,
  Radio,
  Sparkles,
  Shield,
  Layers,
  Terminal,
  ExternalLink,
  ChevronRight,
  Monitor,
  Volume2,
  FileText,
  Key,
  Globe,
  HelpCircle,
  Code,
  Zap,
} from 'lucide-react'
import CurieLogo from '../components/CurieLogo'

function CodeBlock({ code, language = 'bash' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group my-3 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 font-mono text-xs">
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-neutral-800/80 bg-neutral-900/60 text-neutral-400">
        <span className="text-[11px] font-semibold tracking-wide uppercase">{language}</span>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-neutral-800/70 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer text-[10px]"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-3.5 overflow-x-auto text-neutral-200 leading-relaxed">
        <pre>{code}</pre>
      </div>
    </div>
  )
}

const SECTIONS = [
  { id: 'overview', title: 'Overview', group: 'Getting Started', icon: BookOpen },
  { id: 'architecture', title: 'Architecture & Pipeline', group: 'Getting Started', icon: Layers },
  { id: 'quickstart', title: 'Quickstart & Setup', group: 'Getting Started', icon: Terminal },
  { id: 'streaming-stt', title: 'AssemblyAI Universal-3.6 Pro', group: 'Core Engine', icon: Mic },
  { id: 'pip-overlay', title: 'Floating Bar & Document PiP', group: 'Core Engine', icon: Monitor },
  { id: 'llm-gateway', title: 'LLM Gateway (Claude & Gemini)', group: 'Core Engine', icon: Sparkles },
  { id: 'demo-mode', title: 'Synchronized Demo Mode', group: 'Core Engine', icon: Volume2 },
  { id: 'api-reference', title: 'API Reference', group: 'Developer & API', icon: Code },
  { id: 'security', title: 'Security & Single-Key Auth', group: 'Developer & API', icon: Shield },
  { id: 'languages', title: 'Supported Languages (32)', group: 'Reference', icon: Globe },
  { id: 'troubleshooting', title: 'Troubleshooting & FAQ', group: 'Reference', icon: HelpCircle },
]

export default function DocsPage({ onBackToHome, onLaunchMeeting }) {
  const [activeSection, setActiveSection] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSections = SECTIONS.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.group.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const currentIdx = SECTIONS.findIndex((s) => s.id === activeSection)
  const prevSection = currentIdx > 0 ? SECTIONS[currentIdx - 1] : null
  const nextSection = currentIdx < SECTIONS.length - 1 ? SECTIONS[currentIdx + 1] : null

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 text-black hover:opacity-80 transition-opacity cursor-pointer"
            >
              <CurieLogo size={22} />
              <span className="font-display font-bold text-base tracking-tight">Curie</span>
            </button>
            <span className="text-neutral-300">/</span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-neutral-100 border border-neutral-200 text-xs font-semibold text-neutral-800">
              <BookOpen className="w-3 h-3 text-neutral-600" />
              Documentation
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 hover:border-black text-xs font-semibold text-neutral-700 hover:text-black transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to App
            </button>
            <button
              onClick={onLaunchMeeting}
              className="tactile-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5" />
              Launch Curie
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 shrink-0">
          <div className="sticky top-24 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documentation..."
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors"
              />
            </div>

            {/* Navigation Groups */}
            <div className="space-y-5 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
              {['Getting Started', 'Core Engine', 'Developer & API', 'Reference'].map((group) => {
                const items = filteredSections.filter((s) => s.group === group)
                if (items.length === 0) return null

                return (
                  <div key={group} className="space-y-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-2.5 pb-1">
                      {group}
                    </p>
                    {items.map((item) => {
                      const Icon = item.icon
                      const isActive = activeSection === item.id
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveSection(item.id)
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                          }}
                          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                            isActive
                              ? 'bg-black text-white font-semibold shadow-xs'
                              : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
                          <span className="truncate">{item.title}</span>
                        </button>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 max-w-4xl pb-16">
          {activeSection === 'overview' && (
            <article className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs text-neutral-500 font-semibold mb-2">
                  <span>Getting Started</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-black">Overview</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-black">
                  Curie Documentation
                </h1>
                <p className="mt-3 text-base text-neutral-600 leading-relaxed">
                  Curie is an ambient, zero-bot meeting intelligence companion. It captures meeting audio directly in your browser, streams it in real-time to AssemblyAI's <span className="font-semibold text-black">Universal-3.6 Pro</span> speech engine, and produces executive summaries, decisions, and action items using the <span className="font-semibold text-black">AssemblyAI LLM Gateway</span> (Qwen 3.5 & Google Gemini Flash).
                </p>

                {/* Hackathon Track Banner */}
                <div className="mt-4 p-4 rounded-2xl bg-linear-to-r from-purple-50 via-indigo-50 to-blue-50 border border-indigo-200/80 shadow-2xs">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                      Hackathon Track
                    </span>
                    <span className="text-xs font-bold text-indigo-950">
                      AssemblyAI Realtime Speech-to-Text API Track
                    </span>
                  </div>
                  <p className="text-xs text-indigo-900 leading-relaxed">
                    Built for the <strong>AssemblyAI Voice Agent Hackathon</strong> on lablab.ai. Curie leverages AssemblyAI's sub-second WebSocket STT as the foundation for real-time speech transcription, bringing custom client-side audio orchestration (16kHz PCM downsampler, tab + mic mixer, Document Picture-in-Picture window) and post-session LLM synthesis.
                  </p>
                </div>
              </div>

              {/* Hero Screenshot */}
              <div className="rounded-2xl overflow-hidden border border-neutral-200 shadow-sm bg-neutral-50">
                <div className="px-4 py-2 bg-neutral-100/80 border-b border-neutral-200 flex items-center justify-between text-xs text-neutral-600 font-mono">
                  <span className="font-semibold">Curie Meeting Intelligence — Live Ambient Capture</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    WebSocket v3 Active
                  </span>
                </div>
                <img
                  src="/screenshots/meeting-capture.png"
                  alt="Curie Live Meeting Intelligence Console"
                  className="w-full object-cover"
                />
              </div>

              {/* Realtime STT Track Pillars Card */}
              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block">
                  🎯 Track Architecture & Capabilities
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-lg bg-white border border-neutral-200">
                    <div className="font-bold text-black flex items-center gap-1.5 mb-1">
                      <span className="text-indigo-600">✓</span> Real-Time WebSocket Streaming
                    </div>
                    <p className="text-neutral-500 text-[11px] leading-relaxed">
                      Streams 16 kHz Int16 binary PCM directly to <code className="text-neutral-800 bg-neutral-100 px-1 py-0.5 rounded">wss://streaming.assemblyai.com/v3/ws</code> with single-use JWT tokens.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-neutral-200">
                    <div className="font-bold text-black flex items-center gap-1.5 mb-1">
                      <span className="text-indigo-600">✓</span> Sub-Second Turn Latency
                    </div>
                    <p className="text-neutral-500 text-[11px] leading-relaxed">
                      Universal-3.6 Pro resolves speculative speech hypotheses in &lt; 280ms and punctuated turns in &lt; 420ms.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-neutral-200">
                    <div className="font-bold text-black flex items-center gap-1.5 mb-1">
                      <span className="text-indigo-600">✓</span> 32 Locales + Code-Switching
                    </div>
                    <p className="text-neutral-500 text-[11px] leading-relaxed">
                      Native multilingual recognition supporting international calls and mid-sentence language transitions without restarting.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-neutral-200">
                    <div className="font-bold text-black flex items-center gap-1.5 mb-1">
                      <span className="text-indigo-600">✓</span> Bring-Your-Own Orchestration
                    </div>
                    <p className="text-neutral-500 text-[11px] leading-relaxed">
                      Custom Web Audio mixer (tab + mic), Document PiP desktop floating portal, and AssemblyAI LLM Gateway synthesis.
                    </p>
                  </div>
                </div>
              </div>

              {/* The Real-World Enterprise Problem & Curie's Zero-Bot Solution */}
              <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <h2 className="text-base font-bold text-black">
                      The Real-World Enterprise Problem & Why We Solved It
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-200 text-neutral-800 font-bold uppercase tracking-wider">
                    Enterprise Pain Points
                  </span>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed">
                  Remote work has multiplied meeting volume, but traditional meeting note-takers have introduced severe enterprise security risks and social friction:
                </p>

                {/* 3 Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-white border border-neutral-200 shadow-2xs">
                    <div className="font-mono text-xl font-black text-black">70%</div>
                    <div className="text-[11px] font-bold text-neutral-800 mt-0.5">Unproductive Meetings</div>
                    <p className="text-[10px] text-neutral-500 mt-1 leading-tight">
                      Employees report meetings prevent focus and deep work (Harvard Business Review).
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-neutral-200 shadow-2xs">
                    <div className="font-mono text-xl font-black text-black">31+ hrs</div>
                    <div className="text-[11px] font-bold text-neutral-800 mt-0.5">Lost Monthly / Worker</div>
                    <p className="text-[10px] text-neutral-500 mt-1 leading-tight">
                      Costs US enterprises $37B+ annually in wasted meeting hours (Microsoft Work Trend).
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-neutral-200 shadow-2xs">
                    <div className="font-mono text-xl font-black text-black">42%+</div>
                    <div className="text-[11px] font-bold text-neutral-800 mt-0.5">IT Bot Bans</div>
                    <p className="text-[10px] text-neutral-500 mt-1 leading-tight">
                      Enterprise security teams banning third-party meeting bots due to Shadow AI & GDPR leaks.
                    </p>
                  </div>
                </div>

                {/* Why IT Bans Bots & How Curie Solves It */}
                <div className="p-4 rounded-xl bg-white border border-neutral-200 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-black">
                    The Meeting Bot Crisis vs. Curie's Ambient Zero-Bot Architecture
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[11px] text-left border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-200 text-neutral-500 font-mono text-[10px] uppercase">
                          <th className="py-2 pr-3 font-semibold">Challenge</th>
                          <th className="py-2 px-3 font-semibold text-red-600">Traditional AI Bots (Otter, Fireflies, Read)</th>
                          <th className="py-2 pl-3 font-semibold text-emerald-600">Curie (AssemblyAI Realtime STT)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 text-neutral-700">
                        <tr>
                          <td className="py-2 pr-3 font-semibold text-black">Meeting Presence</td>
                          <td className="py-2 px-3 text-red-700">Physical bot joins call as attendee; disrupts dynamics</td>
                          <td className="py-2 pl-3 text-emerald-800 font-medium">✓ Zero bots in room — 100% client-side ambient capture</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-3 font-semibold text-black">Audio Privacy & Storage</td>
                          <td className="py-2 px-3 text-red-700">Raw audio permanently retained on vendor cloud</td>
                          <td className="py-2 pl-3 text-emerald-800 font-medium">✓ Zero server storage — streams live & evaporates</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-3 font-semibold text-black">Security Compliance</td>
                          <td className="py-2 px-3 text-red-700">Banned by enterprise security & legal policies</td>
                          <td className="py-2 pl-3 text-emerald-800 font-medium">✓ Enterprise-friendly — uses standard Web Audio API</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-3 font-semibold text-black">Audio Quality</td>
                          <td className="py-2 px-3 text-neutral-600">VoIP dial-in / telephonic compression</td>
                          <td className="py-2 pl-3 text-emerald-800 font-medium">✓ Digital tab audio + local mic mixed at 16kHz PCM</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-3 font-semibold text-black">Turn Latency</td>
                          <td className="py-2 px-3 text-neutral-600">Minutes of batch processing post-meeting</td>
                          <td className="py-2 pl-3 text-emerald-800 font-medium">✓ &lt; 300ms turn latency via AssemblyAI WebSocket v3</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Ambient Meeting in Action Showcase */}
                <div className="rounded-xl overflow-hidden border border-neutral-200 shadow-2xs">
                  <div className="px-3.5 py-2 bg-neutral-900 text-white flex items-center justify-between text-[11px] font-mono">
                    <span className="font-semibold">Curie in Action: Google Meet with Document PiP</span>
                    <span className="text-emerald-400 font-bold">Zero Bot Presence</span>
                  </div>
                  <img
                    src="/screenshots/meeting-in-action.png"
                    alt="Curie ambient meeting capture during active Google Meet call"
                    className="w-full object-cover"
                  />
                  <div className="p-3 bg-white text-[11px] text-neutral-600 border-t border-neutral-200 leading-relaxed">
                    <strong>Real-World Ambient Experience:</strong> Notice the Google Meet participant roster contains only actual team members. Curie streams the tab audio directly to AssemblyAI Universal-3.6 Pro while the Document Picture-in-Picture window floats over the video stream with live subtitles.
                  </div>
                </div>
              </div>

              {/* Quick Navigation Links */}
              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-2.5">
                  ⚡ Quick Links & Navigation
                </span>
                <div className="flex flex-wrap gap-2">
                  {SECTIONS.filter((s) => s.id !== 'overview').map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => {
                        setActiveSection(sec.id)
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 hover:border-black text-xs font-medium text-neutral-700 hover:text-black transition-colors cursor-pointer shadow-2xs"
                    >
                      {sec.title} →
                    </button>
                  ))}
                </div>
              </div>

              {/* Key Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 hover:border-black transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center mb-3">
                    <Mic className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-black mb-1">Sub-Second Streaming STT</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Powered by AssemblyAI Universal-3.6 Pro over WebSocket v3 with 16kHz PCM audio, live partial turns, and 32 languages with code-switching.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 hover:border-black transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center mb-3">
                    <Monitor className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-black mb-1">Always-On-Top PiP Bar</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Pops out a native Document Picture-in-Picture window that floats over Zoom, Google Meet, Teams, or desktop apps with live transcript & controls.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 hover:border-black transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center mb-3">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-black mb-1">Dual LLM Gateway Reasoning</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Choose between Claude Sonnet 4.6 and Gemini Flash for structured synthesis: executive brief, key topics, decisions, and actionable task lists.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 hover:border-black transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center mb-3">
                    <Shield className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-black mb-1">Single-Key Zero-Storage Security</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    One AssemblyAI API key powers both speech and LLMs. Client uses short-lived tokens. No audio or transcript is permanently stored.
                  </p>
                </div>
              </div>

              {/* 3 Step Workflow */}
              <div className="pt-4">
                <h2 className="text-xl font-display font-bold text-black mb-4">How Curie Works</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3.5 rounded-xl border border-neutral-200">
                    <span className="w-6 h-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center shrink-0">1</span>
                    <div>
                      <p className="text-xs font-bold text-black">Start Listening</p>
                      <p className="text-xs text-neutral-600 mt-0.5">
                        Open Curie in your browser and click "Start Listening" or "Run Demo". Curie captures meeting audio from your microphone or shared browser tab.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl border border-neutral-200">
                    <span className="w-6 h-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center shrink-0">2</span>
                    <div>
                      <p className="text-xs font-bold text-black">Live Streaming & Desktop Pop-out</p>
                      <p className="text-xs text-neutral-600 mt-0.5">
                        Audio chunks are streamed to AssemblyAI Universal-3.6 Pro via WebSocket v3. Click the PiP icon to float a compact control bar over Zoom or Teams.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl border border-neutral-200">
                    <span className="w-6 h-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center shrink-0">3</span>
                    <div>
                      <p className="text-xs font-bold text-black">Instant AI Synthesis & PDF Export</p>
                      <p className="text-xs text-neutral-600 mt-0.5">
                        Click "End Meeting". AssemblyAI's LLM Gateway analyzes the transcript with Claude Sonnet 4.6 or Gemini Flash, generating a structured report ready for 1-click PDF download.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          )}

          {activeSection === 'architecture' && (
            <article className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs text-neutral-500 font-semibold mb-2">
                  <span>Getting Started</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-black">Architecture & Pipeline</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-black">
                  System Architecture & Pipeline
                </h1>
                <p className="mt-3 text-base text-neutral-600 leading-relaxed">
                  Curie uses an end-to-end streaming pipeline designed for low latency, high audio fidelity, and zero server storage of audio or transcripts.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-display font-bold text-black mb-1">End-to-End System Flow</h2>
                <p className="text-xs text-neutral-500 mb-3">
                  Visual architecture flowchart and subgraphs from client audio capture to LLM synthesis.
                </p>

                {/* 5 Stages Visual Cards */}
                <div className="space-y-2.5 mb-4">
                  <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold font-mono text-black uppercase">1. Client Audio & Ambient Capture Engine</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-200 text-neutral-800">Browser / PiP</span>
                    </div>
                    <p className="text-xs text-neutral-600">
                      Captures microphone and tab/system audio, downsampled to 16kHz PCM (pcm_s16le). Controls synchronized via the always-on-top Document PiP window.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold font-mono text-black uppercase">2. Security & Ephemeral Token Minting</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">GET /api/streaming-token</span>
                    </div>
                    <p className="text-xs text-neutral-600">
                      Backend mints a single-use JWT (valid 480s) from AssemblyAI. The client never sees your master API key.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold font-mono text-black uppercase">3. AssemblyAI Universal-3.6 Streaming Engine</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">WebSocket v3</span>
                    </div>
                    <p className="text-xs text-neutral-600">
                      Streams raw binary audio frames to wss://streaming.assemblyai.com/v3/ws. Emits sub-300ms partial turns and final punctuated sentences across 32 languages.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold font-mono text-black uppercase">4. AssemblyAI LLM Gateway (Reasoning Engine)</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black text-white">Claude 4.6 | Gemini Flash</span>
                    </div>
                    <p className="text-xs text-neutral-600">
                      POST /api/summarize dispatches transcripts through AssemblyAI LLM Gateway with dual-model choice (Claude Sonnet 4.6 or Gemini Flash) for structured JSON synthesis.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold font-mono text-black uppercase">5. Executive Brief & Export Layer</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-200 text-neutral-800">jsPDF Report</span>
                    </div>
                    <p className="text-xs text-neutral-600">
                      Interactive action item checklists, key decisions pills, and 1-click executive PDF report export with zero data retention.
                    </p>
                  </div>
                </div>

                {/* Mermaid Code Snippet */}
                <div className="mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                    Mermaid Diagram Definition (Copy for GitHub / Markdown)
                  </span>
                  <CodeBlock
                    code={`flowchart TD
    subgraph Client["1. Client Audio & Ambient Capture Engine"]
        UserAudio["Participant Audio<br/>(Microphone + Tab/System Audio)"]
        WebAudio["Web Audio API Context<br/>(16kHz Downsampler & Int16 PCM)"]
        CurieUI["Curie Web Application<br/>(React 19 + Real-time Waveform)"]
        PiPBar["Always-On-Top Floating Bar<br/>(Document Picture-in-Picture API)"]
        
        UserAudio --> WebAudio
        WebAudio --> CurieUI
        CurieUI <--> PiPBar
    end

    subgraph AuthLayer["2. Ephemeral Token Engine"]
        TokenReq["(1) Request Session Token<br/>GET /api/streaming-token"]
        TokenGen["Vite Middleware / Token Minter<br/>POST https://streaming.assemblyai.com/v3/token"]
        TokenResp["Short-Lived Ephemeral Token<br/>(expires_in_seconds = 480)"]
        
        CurieUI --> TokenReq
        TokenReq --> TokenGen
        TokenGen --> TokenResp
        TokenResp --> CurieUI
    end

    subgraph SpeechEngine["3. AssemblyAI Universal-3.6 Streaming Engine"]
        WSS["WebSocket v3 Connection<br/>wss://streaming.assemblyai.com/v3/ws"]
        STTModel["Universal-3.6 Pro STT<br/>(&lt; 300ms Turn Latency · 32 Locales)"]
        PartialEvent["PartialTranscript Event<br/>(Live speculative speech)"]
        FinalEvent["FinalTranscript Event<br/>(Punctuated speech turns)"]
        
        CurieUI -->|" (2) 16kHz PCM Binary Stream "| WSS
        WSS --> STTModel
        STTModel --> PartialEvent
        STTModel --> FinalEvent
        PartialEvent -->|" Live stream "| CurieUI
        FinalEvent -->|" Append transcript "| CurieUI
        PartialEvent -.->|" Live subtitle snippet "| PiPBar
    end

    subgraph LLMGateway["4. AssemblyAI LLM Gateway (Reasoning Engine)"]
        SummarizeReq["(3) POST /api/summarize<br/>(Punctuated Transcript + Meeting Context)"]
        LLMAPI["LLM Gateway API<br/>https://llm-gateway.assemblyai.com/v1/chat/completions"]
        ModelChoice{"Selected Model"}
        ClaudeModel["Anthropic Claude Sonnet 4.6<br/>(Strategic nuance & executive briefs)"]
        GeminiModel["Google Gemini 3.5 Flash<br/>(High-speed JSON extraction)"]
        
        CurieUI -->|" End Meeting clicked "| SummarizeReq
        SummarizeReq --> LLMAPI
        LLMAPI --> ModelChoice
        ModelChoice --> ClaudeModel
        ModelChoice --> GeminiModel
    end

    subgraph Insights["5. Meeting Intelligence & Export"]
        JSONOutput["Structured JSON Insights<br/>(Summary · Topics · Decisions · Action Items)"]
        ResultsDashboard["Curie Results Dashboard<br/>(Interactive Action Item Checklist)"]
        PDFExport["Executive Meeting Brief PDF<br/>(jsPDF One-Click Export)"]
        
        ClaudeModel --> JSONOutput
        GeminiModel --> JSONOutput
        JSONOutput --> ResultsDashboard
        ResultsDashboard --> PDFExport
    end`}
                    language="mermaid"
                  />
                </div>
              </div>

              {/* ASCII Diagram Card */}
              <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950 font-mono text-xs text-neutral-300 overflow-x-auto leading-relaxed">
                <pre>{`┌─────────────────────────────────────────────────────────────────┐
│                      AUDIO INGESTION LAYER                      │
│   • Device Microphone (navigator.mediaDevices.getUserMedia)     │
│   • Screen / Tab Audio (navigator.mediaDevices.getDisplayMedia) │
│   • Web Audio API AudioContext: Downsampled to 16kHz PCM        │
└────────────────────────────────┬────────────────────────────────┘
                                 │ Binary 16-bit PCM (pcm_s16le)
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              ASSEMBLYAI STREAMING STT v3 WEBSOCKET              │
│               wss://streaming.assemblyai.com/v3/ws              │
│       Model: universal-3-6-pro  |  Auth: Temp Token Header      │
└────────────────────────────────┬────────────────────────────────┘
                                 │ JSON Turn Events (Partial & Final)
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                  CURIE CLIENT INTERFACE LAYER                   │
│   • Live Transcript Feed with word count and visualizer         │
│   • Floating Meeting Bar (Document Picture-in-Picture API)      │
│   • Always-on-top desktop overlay over Zoom, Teams, Meet        │
└────────────────────────────────┬────────────────────────────────┘
                                 │ End Meeting → POST /api/summarize
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                 ASSEMBLYAI LLM GATEWAY ENGINE                   │
│         https://llm-gateway.assemblyai.com/v1/chat/completions  │
│         Choice: Claude Sonnet 4.6  OR  Gemini 3.5 Flash         │
└────────────────────────────────┬────────────────────────────────┘
                                 │ Strict JSON Schema Output
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MEETING INTELLIGENCE BRIEF                   │
│   • Executive Summary & Meeting Sentiment                       │
│   • Key Topics Pills & Bulleted Key Points                      │
│   • Action Items with Checkboxes & Key Decisions                │
│   • Client-side PDF Generation (jsPDF)                          │
└─────────────────────────────────────────────────────────────────┘`}</pre>
              </div>

              <div className="space-y-4 pt-2">
                <h2 className="text-xl font-display font-bold text-black">Pipeline Stages Explained</h2>
                <div className="space-y-3 text-xs text-neutral-600 leading-relaxed">
                  <div className="p-3.5 rounded-xl border border-neutral-200">
                    <span className="font-bold text-black block mb-1">1. Audio Normalization</span>
                    The browser Web Audio API reads incoming 44.1kHz or 48kHz audio streams, merges tab audio with microphone input if selected, downsamples to 16,000 Hz, and converts float32 samples to 16-bit Little-Endian signed integers (<code className="font-mono bg-neutral-100 px-1 py-0.5 rounded text-black">Int16Array</code>).
                  </div>
                  <div className="p-3.5 rounded-xl border border-neutral-200">
                    <span className="font-bold text-black block mb-1">2. WebSocket Streaming</span>
                    Binary PCM frames are transmitted in real time over a secure WebSocket connection to <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded text-black">wss://streaming.assemblyai.com/v3/ws</code>. Universal-3.6 Pro returns partial speech hypotheses (sub-300ms) and final punctuated sentences.
                  </div>
                  <div className="p-3.5 rounded-xl border border-neutral-200">
                    <span className="font-bold text-black block mb-1">3. PiP Sync</span>
                    The Document Picture-in-Picture window receives live state updates (transcripts, timer, mic mute) through React state and DOM event dispatching without losing connection when switching desktops or full-screen apps.
                  </div>
                  <div className="p-3.5 rounded-xl border border-neutral-200">
                    <span className="font-bold text-black block mb-1">4. LLM Synthesis</span>
                    Upon session conclusion, the full punctuated transcript is sent to <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded text-black">/api/summarize</code>, which calls AssemblyAI's unified LLM Gateway.
                  </div>
                </div>
              </div>
            </article>
          )}

          {activeSection === 'quickstart' && (
            <article className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs text-neutral-500 font-semibold mb-2">
                  <span>Getting Started</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-black">Quickstart & Setup</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-black">
                  Quickstart Guide
                </h1>
                <p className="mt-3 text-base text-neutral-600 leading-relaxed">
                  Run Curie locally in under 2 minutes. You only need a Node.js environment and an AssemblyAI API key.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-black mb-1">1. Clone the repository</h3>
                  <CodeBlock
                    code={`git clone https://github.com/farhan0-code/curie.git\ncd curie`}
                    language="bash"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-black mb-1">2. Install dependencies</h3>
                  <CodeBlock
                    code={`npm install`}
                    language="bash"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-black mb-1">3. Configure your API key</h3>
                  <p className="text-xs text-neutral-600 mb-2">
                    Create a <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded text-black">.env</code> file in the project root:
                  </p>
                  <CodeBlock
                    code={`ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here`}
                    language="env"
                  />
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                    <span className="font-bold">⚠️ Note:</span> You only need an AssemblyAI key. Both the speech transcription and the LLM summarization (Claude & Gemini) run through AssemblyAI's LLM Gateway using this single key.
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-black mb-1">4. Start the development server</h3>
                  <CodeBlock
                    code={`npm run dev`}
                    language="bash"
                  />
                  <p className="text-xs text-neutral-600 mt-2">
                    Open <a href="http://localhost:3000" target="_blank" rel="noreferrer" className="text-black font-semibold underline underline-offset-2">http://localhost:3000</a> in Google Chrome, Brave, or Microsoft Edge.
                  </p>
                </div>
              </div>
            </article>
          )}

          {activeSection === 'streaming-stt' && (
            <article className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs text-neutral-500 font-semibold mb-2">
                  <span>Core Engine</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-black">AssemblyAI Universal-3.6 Pro</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-black">
                  Universal-3.6 Pro Real-Time STT
                </h1>
                <p className="mt-3 text-base text-neutral-600 leading-relaxed">
                  Curie implements AssemblyAI's flagship streaming speech-to-text model, <span className="font-semibold text-black">Universal-3.6 Pro</span>, via WebSocket API v3.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Key Specifications</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-white border border-neutral-200">
                    <span className="text-neutral-500 block text-[11px]">Model</span>
                    <span className="font-bold text-black">universal-3-6-pro</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-neutral-200">
                    <span className="text-neutral-500 block text-[11px]">Protocol</span>
                    <span className="font-bold text-black">WebSocket v3</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-neutral-200">
                    <span className="text-neutral-500 block text-[11px]">Sample Rate</span>
                    <span className="font-bold text-black">16,000 Hz PCM</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-neutral-200">
                    <span className="text-neutral-500 block text-[11px]">Latency</span>
                    <span className="font-bold text-black">&lt; 300ms Turn</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-display font-bold text-black mb-2">WebSocket v3 Connection URL</h2>
                <p className="text-xs text-neutral-600 mb-2">
                  The client requests a temporary token from the backend, then opens the WebSocket with model parameters:
                </p>
                <CodeBlock
                  code={`wss://streaming.assemblyai.com/v3/ws?token=\${tempToken}&sample_rate=16000&encoding=pcm_s16le&speech_model=universal-3-6-pro&language_codes=["en"]`}
                  language="http"
                />
              </div>

              <div>
                <h2 className="text-xl font-display font-bold text-black mb-2">Message Types Received</h2>
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl border border-neutral-200">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-neutral-200 text-[10px] font-mono font-bold text-black">PartialTranscript</span>
                      <span className="text-xs text-neutral-500">Live typing hypotheses</span>
                    </div>
                    <p className="text-xs text-neutral-600">
                      Dispatched with low latency while a speaker is actively talking. Curie displays this with smooth grey text to give immediate feedback.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-neutral-200">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-black text-[10px] font-mono font-bold text-white">FinalTranscript</span>
                      <span className="text-xs text-neutral-500">Committed speaker turn</span>
                    </div>
                    <p className="text-xs text-neutral-600">
                      Dispatched when a speaker pauses or completes a thought. Contains fully punctuated text and word-level timestamps. Curie appends this to the permanent meeting transcript.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          )}

          {activeSection === 'pip-overlay' && (
            <article className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs text-neutral-500 font-semibold mb-2">
                  <span>Core Engine</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-black">Always-On-Top Document PiP</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-black">
                  Picture-in-Picture Desktop Window
                </h1>
                <p className="mt-3 text-base text-neutral-600 leading-relaxed">
                  Curie uses the modern <span className="font-semibold text-black">Document Picture-in-Picture API</span> to create a persistent, always-on-top desktop window that floats over Zoom, Google Meet, Teams, or your code editor.
                </p>
              </div>

              {/* PiP Screenshot */}
              <div className="rounded-2xl overflow-hidden border border-neutral-200 shadow-sm bg-neutral-900">
                <div className="px-4 py-2 bg-neutral-800 border-b border-neutral-700 flex items-center justify-between text-xs text-neutral-300 font-mono">
                  <span>Document Picture-in-Picture — Desktop Floating Subtitles</span>
                  <span className="text-cyan-400 font-bold">Always On Top</span>
                </div>
                <img
                  src="/screenshots/pip-window.png"
                  alt="Curie Document Picture-in-Picture Window"
                  className="w-full object-cover"
                />
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">What the PiP Window Delivers</h3>
                <ul className="text-xs text-neutral-600 space-y-2 list-disc list-inside">
                  <li><strong className="text-black">Autoscrolling Subtitles:</strong> Follows the live meeting conversation in real-time with automatic scroll-to-bottom.</li>
                  <li><strong className="text-black">Zero Context Switching:</strong> Keep Zoom or Google Meet full-screen while seeing real-time transcripts and speaker turns.</li>
                  <li><strong className="text-black">Active Session Telemetry:</strong> Live duration timer, word counter, and meeting status indicator.</li>
                  <li><strong className="text-black">Direct Meeting Wrap-up:</strong> Stop and trigger AI analysis straight from the floating window without hunting for the browser tab.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-display font-bold text-black mb-2">How Document PiP is Initialized</h2>
                <CodeBlock
                  code={`// Request native always-on-top window
const pipWindow = await window.documentPictureInPicture.requestWindow({
  width: 480,
  height: 220,
  disallowReturnToOpener: false,
})

// Clone parent styling & font definitions into PiP container
document.querySelectorAll('style, link[rel="stylesheet"]').forEach((styleEl) => {
  try { pipWindow.document.head.appendChild(styleEl.cloneNode(true)) } catch (e) {}
})

// Mount React portal into pipWindow.document.body
createPortal(<FloatingCaptionsView {...meetingState} />, pipWindow.document.body)`}
                  language="javascript"
                />
              </div>

              <div className="p-3.5 rounded-xl border border-neutral-200 text-xs text-neutral-600">
                <span className="font-bold text-black block mb-1">Browser Compatibility</span>
                The Document Picture-in-Picture API is supported natively in <strong>Google Chrome 116+</strong>, <strong>Brave</strong>, and <strong>Microsoft Edge</strong>.
              </div>
            </article>
          )}

          {activeSection === 'llm-gateway' && (
            <article className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs text-neutral-500 font-semibold mb-2">
                  <span>Core Engine</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-black">LLM Gateway (Qwen 3.5 & Gemini Flash)</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-black">
                  AssemblyAI LLM Gateway & Synthesis
                </h1>
                <p className="mt-3 text-base text-neutral-600 leading-relaxed">
                  Curie routes punctuated meeting transcripts through <span className="font-semibold text-black">AssemblyAI's LLM Gateway</span> (<code className="font-mono text-black bg-neutral-100 px-1 py-0.5 rounded">qwen3.5-4b-32k-fast</code>) or Google Gemini Flash to generate structured executive dossiers.
                </p>
              </div>

              {/* Synthesis Results Screenshot */}
              <div className="rounded-2xl overflow-hidden border border-neutral-200 shadow-sm bg-neutral-50">
                <div className="px-4 py-2 bg-neutral-100 border-b border-neutral-200 flex items-center justify-between text-xs text-neutral-600 font-mono">
                  <span className="font-semibold">Curie Synthesis — Executive Summary & Action Items</span>
                  <span className="text-black font-bold">1-Click PDF Export</span>
                </div>
                <img
                  src="/screenshots/meeting-results.png"
                  alt="Curie Executive Summary and Action Items"
                  className="w-full object-cover"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-black">Option 1</span>
                    <span className="px-2 py-0.5 rounded bg-black text-white text-[10px] font-mono font-bold">Single Key</span>
                  </div>
                  <h3 className="text-base font-bold text-black mb-1">AssemblyAI LLM Gateway · Qwen 3.5</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Uses the unified AssemblyAI LLM Gateway API (<code className="font-mono text-[10px]">qwen3.5-4b-32k-fast</code>). Unlocked on every AssemblyAI account with 32k context, sub-second execution, and zero extra keys needed.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-black">Option 2</span>
                    <span className="px-2 py-0.5 rounded bg-neutral-200 text-neutral-800 text-[10px] font-mono font-bold">Direct API</span>
                  </div>
                  <h3 className="text-base font-bold text-black mb-1">Google Gemini Flash</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Direct Google Gemini integration (Gemini 2.5 Flash / 3 Flash) for instant high-speed JSON schema extraction and strategic executive bullet points.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-display font-bold text-black mb-2">Structured JSON Output Schema</h2>
                <p className="text-xs text-neutral-600 mb-2">
                  The LLM Gateway is instructed with strict temperature (0.3) to return clean JSON without markdown fences:
                </p>
                <CodeBlock
                  code={`{\n  "summary": "2-3 sentence executive summary of the meeting",\n  "keyTopics": ["topic1", "topic2", "topic3", "topic4", "topic5"],\n  "keyPoints": ["key point 1", "key point 2", "key point 3", "key point 4", "key point 5"],\n  "decisions": ["decision 1", "decision 2", "decision 3"],\n  "actionItems": ["action item 1", "action item 2", "action item 3", "action item 4"],\n  "sentiment": "overall meeting sentiment in 3-5 words",\n  "modelUsed": "Claude Sonnet 4.6 via AssemblyAI LLM Gateway"\n}`}
                  language="json"
                />
              </div>
            </article>
          )}

          {activeSection === 'demo-mode' && (
            <article className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs text-neutral-500 font-semibold mb-2">
                  <span>Core Engine</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-black">Synchronized Demo Mode</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-black">
                  Zero-Mic Testing & Demo Mode
                </h1>
                <p className="mt-3 text-base text-neutral-600 leading-relaxed">
                  Curie includes a built-in simulation engine with synchronized audio playback and realistic speaker turns. You can test the entire pipeline anywhere without an active microphone.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-neutral-200 text-xs text-neutral-600">
                  <span className="font-bold text-black block mb-1">Synthesized Web Audio Narration</span>
                  The demo mode creates natural spoken dialogue using the browser's speech synthesis engine, feeding live multi-speaker conversation directly into the Curie transcript stream.
                </div>
                <div className="p-3.5 rounded-xl border border-neutral-200 text-xs text-neutral-600">
                  <span className="font-bold text-black block mb-1">Realistic Word-by-Word Animation</span>
                  Simulates realistic WebSocket packets with interim partial words and final punctuated sentences so you can test waveform meters, timer logic, and PiP overlays immediately.
                </div>
                <div className="p-3.5 rounded-xl border border-neutral-200 text-xs text-neutral-600">
                  <span className="font-bold text-black block mb-1">Audio Controls</span>
                  Includes a dedicated mute button in both the main view and the PiP floating bar to silence demo audio if testing in a quiet environment.
                </div>
              </div>
            </article>
          )}

          {activeSection === 'api-reference' && (
            <article className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs text-neutral-500 font-semibold mb-2">
                  <span>Developer & API</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-black">API Reference</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-black">
                  API Endpoints Reference
                </h1>
                <p className="mt-3 text-base text-neutral-600 leading-relaxed">
                  Curie exposes two lightweight backend endpoints in its server middleware to handle authentication and reasoning.
                </p>
              </div>

              {/* Endpoint 1 */}
              <div className="p-4 rounded-xl border border-neutral-200 space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-mono font-bold text-xs">GET</span>
                  <span className="font-mono text-sm font-bold text-black">/api/streaming-token</span>
                </div>
                <p className="text-xs text-neutral-600">
                  Generates an ephemeral, single-use token from AssemblyAI for initializing the WebSocket connection from the browser.
                </p>
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase">Response Example</span>
                  <CodeBlock
                    code={`{\n  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."\n}`}
                    language="json"
                  />
                </div>
              </div>

              {/* Endpoint 2 */}
              <div className="p-4 rounded-xl border border-neutral-200 space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-mono font-bold text-xs">POST</span>
                  <span className="font-mono text-sm font-bold text-black">/api/summarize</span>
                </div>
                <p className="text-xs text-neutral-600">
                  Sends full meeting transcript to AssemblyAI LLM Gateway for structured intelligence generation.
                </p>

                <div className="pt-2">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase">Request Body</span>
                  <CodeBlock
                    code={`{\n  "transcript": "Hello everyone, let's review the Q4 roadmap...",\n  "meetingName": "Product Sync",\n  "language": "en",\n  "analysisModel": "claude-sonnet-4-6"\n}`}
                    language="json"
                  />
                </div>

                <div className="pt-2">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase">Response</span>
                  <CodeBlock
                    code={`{\n  "summary": "Team agreed to prioritize the real-time streaming engine...",\n  "keyTopics": ["Universal-3.6 Pro", "PiP Overlay", "Beta Launch"],\n  "keyPoints": ["WebSocket latency under 300ms", "Zero storage policy confirmed"],\n  "decisions": ["Deploy beta next Tuesday"],\n  "actionItems": ["Alex: Finalize PDF export styles", "Sarah: Test 32 language codes"],\n  "sentiment": "Decisive and focused",\n  "modelUsed": "Claude Sonnet 4.6 via AssemblyAI LLM Gateway"\n}`}
                    language="json"
                  />
                </div>
              </div>
            </article>
          )}

          {activeSection === 'security' && (
            <article className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs text-neutral-500 font-semibold mb-2">
                  <span>Developer & API</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-black">Security & Single-Key Auth</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-black">
                  Security Architecture
                </h1>
                <p className="mt-3 text-base text-neutral-600 leading-relaxed">
                  Curie is engineered with enterprise privacy standards: ephemeral tokens, isolated API keys, and zero retention.
                </p>
              </div>

              <div className="space-y-3 text-xs text-neutral-600 leading-relaxed">
                <div className="p-4 rounded-xl border border-neutral-200">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Key className="w-4 h-4 text-black" />
                    <span className="font-bold text-black text-sm">No Client API Key Exposure</span>
                  </div>
                  <p>
                    Your primary <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded text-black">ASSEMBLYAI_API_KEY</code> is strictly stored server-side. The client application only ever requests temporary tokens with a 480-second validity window.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Shield className="w-4 h-4 text-black" />
                    <span className="font-bold text-black text-sm">Zero-Retention Data Model</span>
                  </div>
                  <p>
                    Curie operates strictly in-memory in your local browser session. No databases, no telemetry tracking, and no cloud log retention of your meeting minutes. When you close the tab, all local state is wiped.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Zap className="w-4 h-4 text-black" />
                    <span className="font-bold text-black text-sm">Unified LLM Gateway Security</span>
                  </div>
                  <p>
                    Because Claude Sonnet 4.6 and Gemini Flash are queried through AssemblyAI's internal gateway, you do not need to configure or expose separate Anthropic or Google Cloud API tokens.
                  </p>
                </div>
              </div>
            </article>
          )}

          {activeSection === 'languages' && (
            <article className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs text-neutral-500 font-semibold mb-2">
                  <span>Reference</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-black">Supported Languages</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-black">
                  32 Supported Languages
                </h1>
                <p className="mt-3 text-base text-neutral-600 leading-relaxed">
                  AssemblyAI Universal-3.6 Pro supports 32 languages with native code-switching capabilities (e.g. seamlessly switching between English and Spanish or English and Hindi mid-sentence).
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 text-xs">
                {[
                  { code: 'en', name: 'English' },
                  { code: 'es', name: 'Spanish' },
                  { code: 'fr', name: 'French' },
                  { code: 'de', name: 'German' },
                  { code: 'it', name: 'Italian' },
                  { code: 'pt', name: 'Portuguese' },
                  { code: 'hi', name: 'Hindi' },
                  { code: 'ja', name: 'Japanese' },
                  { code: 'ko', name: 'Korean' },
                  { code: 'zh', name: 'Chinese' },
                  { code: 'nl', name: 'Dutch' },
                  { code: 'pl', name: 'Polish' },
                  { code: 'ru', name: 'Russian' },
                  { code: 'tr', name: 'Turkish' },
                  { code: 'uk', name: 'Ukrainian' },
                  { code: 'vi', name: 'Vietnamese' },
                  { code: 'ar', name: 'Arabic' },
                  { code: 'sv', name: 'Swedish' },
                  { code: 'no', name: 'Norwegian' },
                  { code: 'fi', name: 'Finnish' },
                  { code: 'da', name: 'Danish' },
                  { code: 'el', name: 'Greek' },
                  { code: 'cs', name: 'Czech' },
                  { code: 'ro', name: 'Romanian' },
                  { code: 'hu', name: 'Hungarian' },
                  { code: 'id', name: 'Indonesian' },
                  { code: 'ms', name: 'Malay' },
                  { code: 'th', name: 'Thai' },
                  { code: 'he', name: 'Hebrew' },
                  { code: 'bn', name: 'Bengali' },
                  { code: 'ta', name: 'Tamil' },
                  { code: 'te', name: 'Telugu' },
                ].map((lang) => (
                  <div key={lang.code} className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50/50 flex items-center justify-between">
                    <span className="font-medium text-black">{lang.name}</span>
                    <span className="font-mono text-[10px] text-neutral-500 uppercase">{lang.code}</span>
                  </div>
                ))}
              </div>
            </article>
          )}

          {activeSection === 'troubleshooting' && (
            <article className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs text-neutral-500 font-semibold mb-2">
                  <span>Reference</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-black">Troubleshooting & FAQ</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-black">
                  Frequently Asked Questions
                </h1>
                <p className="mt-3 text-base text-neutral-600 leading-relaxed">
                  Common questions regarding audio devices, Picture-in-Picture permissions, and network stability.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-neutral-200">
                  <h3 className="text-sm font-bold text-black mb-1">
                    Why isn't tab/system audio captured on macOS?
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    macOS security settings restrict browser access to system audio unless you share an active browser tab (like Google Meet or YouTube) with the "Also share tab audio" checkbox checked. For full desktop meeting apps (e.g. desktop Zoom app), select <strong>"Microphone Only"</strong> mode in Curie so it picks up your room audio and computer speaker output without needing screen-capture permissions.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200">
                  <h3 className="text-sm font-bold text-black mb-1">
                    How do I enable the Always-On-Top Picture-in-Picture window?
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    When you start a meeting session, click the pop-out icon on the top floating bar. Chrome or Edge will spawn a small native always-on-top window. You can drag and position this over Zoom, PowerPoint, or your IDE.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200">
                  <h3 className="text-sm font-bold text-black mb-1">
                    What happens if my internet connection drops mid-meeting?
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Curie's streaming client catches WebSocket disconnect events and maintains all previously transcribed sentences in local memory. You can continue speaking once the connection restores, or conclude the meeting to summarize the captured transcript.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200">
                  <h3 className="text-sm font-bold text-black mb-1">
                    Is my voice data saved on AssemblyAI or Curie servers?
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    No. Curie streams raw audio directly through an encrypted WebSocket for real-time inference. No audio files are recorded or persisted on disk, and the transcript only lives in your local browser session until you export or close the page.
                  </p>
                </div>
              </div>
            </article>
          )}

          {/* Bottom Pagination Nav */}
          <div className="pt-10 border-t border-neutral-200 flex items-center justify-between gap-4">
            {prevSection ? (
              <button
                onClick={() => {
                  setActiveSection(prevSection.id)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-black transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous: {prevSection.title}</span>
              </button>
            ) : <div />}

            {nextSection && (
              <button
                onClick={() => {
                  setActiveSection(nextSection.id)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-black transition-colors cursor-pointer"
              >
                <span>Next: {nextSection.title}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
