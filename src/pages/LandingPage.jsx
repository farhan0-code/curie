import React, { useState, useEffect } from 'react'
import {
  Mic,
  ArrowRight,
  Sparkles,
  Radio,
  FileText,
  Shield,
  Globe,
  Zap,
  Clock,
  CheckCircle2,
  Play,
  Users,
  Target,
  BookOpen,
  Download,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import CurieLogo from '../components/CurieLogo'

export default function LandingPage({ onLaunchMeeting }) {
  const [openFaq, setOpenFaq] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  // Waveform animation tick
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 120)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const faqs = [
    {
      q: 'How does it capture meeting audio?',
      a: 'Curie uses your device microphone via the browser. Keep the Curie tab open alongside your Google Meet, Zoom, or any other meeting. Your microphone picks up audio from your speakers/headphones and the conversation.',
    },
    {
      q: 'Is my audio stored or sent to third parties?',
      a: 'Audio streams in real-time to AssemblyAI for transcription and is not persistently stored. The transcript is analyzed by Gemini via AssemblyAI\'s LLM Gateway. Nothing is saved on any server after your session ends.',
    },
    {
      q: 'Which languages are supported?',
      a: 'AssemblyAI Universal-3.6 Pro supports 32 languages including English, Spanish, French, German, Hindi, Japanese, Chinese, Korean, Portuguese, Italian, and more.',
    },
    {
      q: 'Can I use this for long meetings?',
      a: 'Yes — the streaming WebSocket connection stays alive for the duration of your meeting. There\'s no time limit on the capture session.',
    },
    {
      q: 'How accurate is the transcription?',
      a: 'AssemblyAI Universal-3.6 Pro is the flagship streaming model with industry-leading accuracy, sub-second latency, and native code-switching support.',
    },
  ]

  return (
    <div className="min-h-screen w-full bg-white text-black font-sans overflow-x-hidden">

      {/* Navbar */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-2xs' : 'bg-transparent'}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CurieLogo size={24} />
            <span className="font-display font-bold text-black text-base">Curie</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-black text-white uppercase tracking-wider">
              Meet AI
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              id="hero-launch-btn"
              onClick={onLaunchMeeting}
              className="tactile-btn inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white text-sm font-bold hover:bg-neutral-800 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5 text-white" />
              Start Free
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-36 pb-24 px-4 sm:px-6 text-center relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:40px_40px] opacity-40 pointer-events-none" />

        <div className="relative max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-neutral-100 border border-neutral-200 rounded-full px-4 py-1.5 text-xs font-semibold text-neutral-700 mb-8">
            <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
            AssemblyAI Voice Hackathon · Sep 2026
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight text-black leading-[1.05] mb-6">
            Your meeting,
            <br />
            <span className="relative">
              analyzed
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 8" fill="none">
                <path d="M0 6 Q75 2 150 6 Q225 10 300 6" stroke="black" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </svg>
            </span>
            {' '}instantly.
          </h1>

          <p className="text-lg sm:text-xl text-neutral-600 max-w-xl mx-auto leading-relaxed mb-10">
            Curie listens to your Google Meet, Zoom, or any call in the background — then delivers a structured summary, key topics, and action items the moment you stop.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="start-free-btn"
              onClick={onLaunchMeeting}
              className="tactile-btn w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-black text-white text-base font-bold hover:bg-neutral-800 transition-all hover:scale-[1.02] active:scale-[0.99] shadow-md cursor-pointer"
            >
              <Mic className="w-5 h-5 text-white" />
              Start Listening Free
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
            <button
              id="try-demo-btn"
              onClick={onLaunchMeeting}
              className="tactile-btn w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl border-2 border-neutral-200 text-black text-base font-semibold hover:border-black hover:bg-neutral-50 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4" />
              Try with Demo Meeting
            </button>
          </div>

          <p className="mt-5 text-xs text-neutral-400">
            No account required · Free to try · Powered by AssemblyAI Universal-3.6 Pro
          </p>
        </div>

        {/* Animated Waveform */}
        <div className="relative max-w-2xl mx-auto mt-14">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-black animate-pulse" />
              <span className="text-xs font-mono font-semibold text-black uppercase tracking-wider">LIVE — Meeting Intelligence Active</span>
              <span className="ml-auto text-xs font-mono text-neutral-400">14:32</span>
            </div>

            <div className="flex items-center justify-center gap-[3px] h-14 mb-4">
              {Array.from({ length: 32 }).map((_, i) => {
                const h = Math.abs(Math.sin(i * 0.5 + tick * 0.3)) * 36 + 6
                return (
                  <div
                    key={i}
                    className="w-[3px] rounded-full bg-black transition-all duration-150"
                    style={{ height: `${h}px`, opacity: 0.7 + Math.sin(i + tick * 0.2) * 0.3 }}
                  />
                )
              })}
            </div>

            <div className="space-y-2">
              {[
                '…we need to ship the dashboard redesign by end of October to align with',
                '…the backend query fix should reduce API response time by 60%. John\'s',
                '…our three Q4 priorities are: dashboard, mobile onboarding, and payment…',
              ].map((line, i) => (
                <div key={i} className={`text-xs font-mono rounded-lg px-3 py-2 ${i === 2 ? 'bg-neutral-900 text-white' : 'bg-neutral-50 text-neutral-500'}`}>
                  {line}
                  {i === 2 && <span className="inline-block w-1.5 h-3.5 bg-white ml-0.5 animate-pulse align-middle" />}
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
              <span className="font-mono">3,241 words transcribed</span>
              <span className="flex items-center gap-1.5 font-semibold text-black">
                <Sparkles className="w-3.5 h-3.5" />
                AssemblyAI Universal-3.6 Pro
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 bg-neutral-50/60 border-t border-neutral-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500 mb-3 block">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-black">Three steps, zero friction</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                icon: <Mic className="w-6 h-6 text-black" />,
                title: 'Open Curie',
                desc: 'Launch Curie in a browser tab alongside your meeting. Name the session and pick your language.',
              },
              {
                step: '02',
                icon: <Radio className="w-6 h-6 text-black" />,
                title: 'Curie listens',
                desc: 'AssemblyAI\'s streaming WebSocket captures every word in real-time as you meet. Live transcript appears instantly.',
              },
              {
                step: '03',
                icon: <FileText className="w-6 h-6 text-black" />,
                title: 'Get your report',
                desc: 'Stop the session. Gemini analyzes the transcript and delivers topics, key points, decisions, and action items — plus a PDF.',
              },
            ].map((item) => (
              <div key={item.step} className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs relative overflow-hidden">
                <span className="absolute top-4 right-4 text-[40px] font-black text-neutral-100 font-mono leading-none select-none">
                  {item.step}
                </span>
                <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-display font-bold text-base text-black mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-black">Built on the best voice AI</h2>
            <p className="text-neutral-500 text-sm mt-2 max-w-xl mx-auto">
              We use AssemblyAI's Universal-3.6 Pro for streaming transcription and the LLM Gateway for meeting analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: <Zap className="w-5 h-5 text-black" />,
                title: 'Sub-second latency',
                desc: 'Streaming WebSocket delivers partial transcripts as you speak — no waiting for sentences to finish.',
              },
              {
                icon: <Globe className="w-5 h-5 text-black" />,
                title: '32 languages',
                desc: 'Universal-3.6 Pro handles 32 languages including English, Spanish, Hindi, French, German, Japanese, Chinese, and more with code-switching.',
              },
              {
                icon: <Sparkles className="w-5 h-5 text-black" />,
                title: 'Gemini-powered analysis',
                desc: 'After your meeting, Gemini Flash via the AssemblyAI LLM Gateway extracts insights from the full transcript.',
              },
              {
                icon: <Shield className="w-5 h-5 text-black" />,
                title: 'Privacy first',
                desc: 'Audio streams in real-time and is not stored. Transcripts exist only for your session.',
              },
              {
                icon: <Download className="w-5 h-5 text-black" />,
                title: 'PDF export',
                desc: 'Download a full meeting report with summary, topics, action items, and the complete transcript.',
              },
              {
                icon: <Clock className="w-5 h-5 text-black" />,
                title: 'No time limit',
                desc: 'Stream for 5 minutes or 5 hours — the WebSocket stays open for the duration of your meeting.',
              },
            ].map((f, i) => (
              <div key={i} className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs hover:border-black transition-colors group">
                <div className="w-9 h-9 rounded-xl bg-neutral-100 group-hover:bg-black flex items-center justify-center mb-3 transition-colors">
                  <span className="group-hover:text-white transition-colors">{f.icon}</span>
                </div>
                <h3 className="font-semibold text-sm text-black mb-1.5">{f.title}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Output Preview */}
      <section className="py-20 px-4 sm:px-6 bg-neutral-50/60 border-t border-neutral-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-black">What you get after every meeting</h2>
          </div>

          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-5">
            {[
              {
                icon: <Target className="w-4 h-4 text-black" />,
                label: 'Key Topics',
                content: (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['Q4 Roadmap', 'Dashboard Redesign', 'Backend Performance', 'Mobile App', 'Budget Allocation', 'Payment Provider'].map((t) => (
                      <span key={t} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-neutral-100 text-black border border-neutral-200">{t}</span>
                    ))}
                  </div>
                ),
              },
              {
                icon: <BookOpen className="w-4 h-4 text-black" />,
                label: 'Executive Summary',
                content: (
                  <p className="text-xs text-neutral-600 leading-relaxed mt-2">
                    This 22-minute Q4 planning meeting covered dashboard redesign, backend performance fixes, mobile onboarding improvements, and budget allocation. The team agreed on three priorities for Q4 with specific timelines and owner assignments.
                  </p>
                ),
              },
              {
                icon: <CheckCircle2 className="w-4 h-4 text-black" />,
                label: 'Decisions Made',
                content: (
                  <ul className="mt-2 space-y-1.5">
                    {[
                      'Dashboard redesign ships by end of October',
                      'Mobile onboarding cut from 7 to 4 steps',
                      '$15k infrastructure budget for Q4 scaling',
                    ].map((d) => (
                      <li key={d} className="flex items-start gap-2 text-xs text-neutral-600">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-black mt-0.5" />
                        {d}
                      </li>
                    ))}
                  </ul>
                ),
              },
              {
                icon: <ArrowRight className="w-4 h-4 text-black" />,
                label: 'Action Items',
                content: (
                  <ul className="mt-2 space-y-1.5">
                    {[
                      'John to merge database index fix by Thursday',
                      'Everyone update Jira project timelines by Friday',
                      'Sarah to share final dashboard mockups with team',
                    ].map((a) => (
                      <li key={a} className="flex items-start gap-2 text-xs text-neutral-600">
                        <ArrowRight className="w-3.5 h-3.5 shrink-0 text-black mt-0.5" />
                        {a}
                      </li>
                    ))}
                  </ul>
                ),
              },
            ].map((section) => (
              <div key={section.label} className="border-b border-neutral-100 last:border-0 pb-4 last:pb-0">
                <div className="flex items-center gap-2">
                  {section.icon}
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">{section.label}</span>
                </div>
                {section.content}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center text-black mb-10">Frequently asked</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-neutral-50 transition-colors cursor-pointer text-left"
                >
                  <span className="font-semibold text-sm text-black">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-neutral-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 border-t border-neutral-100">
                    <p className="text-sm text-neutral-600 leading-relaxed mt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4 sm:px-6 bg-black">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            Your next meeting, summarized.
          </h2>
          <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
            Open Curie, join your meeting, and walk away with a full report. No plugins, no bots joining your call.
          </p>
          <button
            id="bottom-cta-btn"
            onClick={onLaunchMeeting}
            className="tactile-btn inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-white text-black text-base font-bold hover:bg-neutral-100 transition-all hover:scale-[1.02] cursor-pointer shadow-md"
          >
            <Mic className="w-5 h-5 text-black" />
            Start Listening Free
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-neutral-800 py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2.5">
            <CurieLogo size={18} className="opacity-50" />
            <span className="font-semibold">Curie Meeting Intelligence</span>
          </div>
          <div className="flex items-center gap-4">
            <span>AssemblyAI Voice Hackathon 2026</span>
            <span className="text-neutral-700">·</span>
            <span>Powered by Universal-3.6 Pro + Gemini Flash</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
