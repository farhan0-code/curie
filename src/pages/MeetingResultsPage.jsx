import React, { useState, useEffect, useRef } from 'react'
import {
  FileText,
  Download,
  Sparkles,
  Loader2,
  CheckCircle2,
  Clock,
  Hash,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Zap,
  BookOpen,
  ArrowRight,
  ListChecks,
  Target,
  MessageSquare,
} from 'lucide-react'
import CurieLogo from '../components/CurieLogo'

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function SectionCard({ icon, title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-neutral-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-black">{icon}</span>
          <span className="font-semibold text-sm text-black">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-neutral-100">
          {children}
        </div>
      )}
    </div>
  )
}

export default function MeetingResultsPage({ meetingData, onNewMeeting, onBackToLanding }) {
  const [summary, setSummary] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)
  const analysisRef = useRef(false)

  const { meetingName, transcript, duration, wordCount, language, isDemo } = meetingData || {}

  useEffect(() => {
    if (!analysisRef.current && transcript) {
      analysisRef.current = true
      analyzeMeeting()
    }
  }, [transcript])

  const analyzeMeeting = async () => {
    if (!transcript || isAnalyzing) return
    setIsAnalyzing(true)
    setAnalysisError('')

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          meetingName: meetingName || 'Meeting',
          language: language || 'en',
        }),
      })

      if (!res.ok) throw new Error(`Analysis failed: ${res.status}`)
      const data = await res.json()
      setSummary(data)
    } catch (err) {
      console.error('[Analysis error]:', err)
      // Fall back to local analysis
      setSummary(localAnalyze(transcript, meetingName))
      setAnalysisError('')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Local fallback analysis using keyword extraction
  const localAnalyze = (text, name) => {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 20)
    const words = text.toLowerCase().split(/\s+/)
    const wordFreq = {}
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'we', 'our', 'the', 'this', 'that', 'it', 'i', 'you', 'he', 'she', 'they', 'them', 'their', 'about', 'from', 'up', 'into', 'through', 'during', 'before', 'after', 'above', 'below'])
    words.forEach((w) => {
      const clean = w.replace(/[^a-z]/g, '')
      if (clean.length > 4 && !stopWords.has(clean)) {
        wordFreq[clean] = (wordFreq[clean] || 0) + 1
      }
    })
    const topics = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1))

    const keyPoints = sentences.slice(0, 5).map((s) => s.trim())
    const decisions = sentences
      .filter((s) => /\b(decided|agreed|will|going to|plan|schedule|allocat|priorit)\b/i.test(s))
      .slice(0, 3)
      .map((s) => s.trim())

    const actionItems = sentences
      .filter((s) => /\b(need to|should|must|action|task|assign|by|deadline|complete|ship|deploy|merge|update|send)\b/i.test(s))
      .slice(0, 4)
      .map((s) => s.trim())

    const wordCount = text.split(/\s+/).length
    const avgWordsPerMinute = 130
    const estimatedMinutes = Math.ceil(wordCount / avgWordsPerMinute)

    return {
      summary: `This ${estimatedMinutes}-minute meeting covered ${topics.slice(0, 3).join(', ')} and other agenda items. The discussion included updates, decisions, and planning for upcoming work.`,
      keyTopics: topics,
      keyPoints,
      decisions: decisions.length > 0 ? decisions : ['Review meeting transcript for specific decisions'],
      actionItems: actionItems.length > 0 ? actionItems : ['Follow up on items discussed in the meeting'],
      sentiment: 'Constructive and collaborative',
      modelUsed: 'Local extraction (API fallback)',
    }
  }

  const handleDownloadPDF = async () => {
    if (!summary) return
    setIsDownloading(true)

    try {
      // Build HTML for the PDF
      const dateStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })

      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Meeting Report — ${meetingName || 'Meeting'}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #000; background: #fff; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { font-size: 24px; font-weight: 800; margin-bottom: 4px; }
    .meta { font-size: 12px; color: #666; margin-bottom: 32px; padding-bottom: 16px; border-bottom: 2px solid #000; }
    .meta span { margin-right: 16px; }
    h2 { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #000; margin-bottom: 12px; margin-top: 28px; padding-bottom: 6px; border-bottom: 1px solid #eee; }
    p { font-size: 14px; line-height: 1.7; color: #333; margin-bottom: 8px; }
    ul { padding-left: 20px; margin-bottom: 8px; }
    li { font-size: 14px; line-height: 1.7; color: #333; margin-bottom: 4px; }
    .badge { display: inline-block; background: #f5f5f5; border: 1px solid #e5e5e5; border-radius: 6px; padding: 3px 8px; font-size: 12px; font-weight: 600; margin: 3px 3px 3px 0; }
    .transcript-section { margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; }
    .transcript-section p { font-size: 12px; line-height: 1.8; color: #555; }
    .footer { margin-top: 40px; padding-top: 12px; border-top: 1px solid #eee; font-size: 11px; color: #999; text-align: center; }
  </style>
</head>
<body>
  <h1>${meetingName || 'Meeting Report'}</h1>
  <div class="meta">
    <span>📅 ${dateStr}</span>
    <span>⏱ ${formatDuration(duration || 0)}</span>
    <span>💬 ${(wordCount || 0).toLocaleString()} words</span>
    <span>🤖 Powered by AssemblyAI + Gemini</span>
  </div>

  <h2>Summary</h2>
  <p>${summary.summary}</p>

  <h2>Key Topics</h2>
  <div>${(summary.keyTopics || []).map((t) => `<span class="badge">${t}</span>`).join('')}</div>

  <h2>Key Points</h2>
  <ul>${(summary.keyPoints || []).map((p) => `<li>${p}</li>`).join('')}</ul>

  <h2>Decisions Made</h2>
  <ul>${(summary.decisions || []).map((d) => `<li>${d}</li>`).join('')}</ul>

  <h2>Action Items</h2>
  <ul>${(summary.actionItems || []).map((a) => `<li>${a}</li>`).join('')}</ul>

  <div class="transcript-section">
    <h2>Full Transcript</h2>
    <p>${(transcript || '').replace(/\n/g, '<br>')}</p>
  </div>

  <div class="footer">Generated by Curie Meeting Intelligence · AssemblyAI Streaming STT · ${new Date().getFullYear()}</div>
</body>
</html>`

      const blob = new Blob([htmlContent], { type: 'text/html' })
      const url = URL.createObjectURL(blob)

      // Open in new window and trigger print to PDF
      const win = window.open(url, '_blank')
      if (win) {
        win.onload = () => {
          setTimeout(() => {
            win.print()
            URL.revokeObjectURL(url)
          }, 500)
        }
      } else {
        // Fallback: download as HTML
        const a = document.createElement('a')
        a.href = url
        a.download = `meeting-report-${(meetingName || 'meeting').toLowerCase().replace(/\s+/g, '-')}.html`
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (err) {
      console.error('Download error:', err)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-neutral-50/50 text-black font-sans flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full h-16 bg-white/95 backdrop-blur-md border-b border-neutral-200 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <CurieLogo size={22} />
          <span className="font-display font-bold text-sm text-black">Meeting Report</span>
          {isDemo && (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 border border-amber-200 uppercase tracking-wider">
              Demo
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onNewMeeting}
            className="tactile-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-300 bg-white text-xs font-semibold text-black hover:bg-neutral-50 hover:border-black transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            New Meeting
          </button>
          {summary && (
            <button
              id="download-pdf-btn"
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="tactile-btn inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-all cursor-pointer disabled:opacity-60"
            >
              {isDownloading ? (
                <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5 text-white" />
              )}
              Download PDF
            </button>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 space-y-5">

        {/* Meeting Header Card */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display font-bold text-xl text-black">
                {meetingName || 'Untitled Meeting'}
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            {summary && (
              <span className="shrink-0 flex items-center gap-1.5 text-xs font-semibold bg-neutral-100 px-2.5 py-1 rounded-xl border border-neutral-200 text-black">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Analyzed
              </span>
            )}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="text-center p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
              <Clock className="w-3.5 h-3.5 text-neutral-400 mx-auto mb-1" />
              <div className="font-mono font-bold text-sm text-black">{formatDuration(duration || 0)}</div>
              <div className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wide">Duration</div>
            </div>
            <div className="text-center p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
              <Hash className="w-3.5 h-3.5 text-neutral-400 mx-auto mb-1" />
              <div className="font-mono font-bold text-sm text-black">{(wordCount || 0).toLocaleString()}</div>
              <div className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wide">Words</div>
            </div>
            <div className="text-center p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
              <Zap className="w-3.5 h-3.5 text-neutral-400 mx-auto mb-1" />
              <div className="font-mono font-bold text-sm text-black">U-3.5</div>
              <div className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wide">Model</div>
            </div>
          </div>
        </div>

        {/* Analyzing State */}
        {isAnalyzing && (
          <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-xs flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-black">Analyzing your meeting…</p>
              <p className="text-xs text-neutral-500 mt-1">Gemini is extracting topics, key points, and action items</p>
            </div>
            <Loader2 className="w-6 h-6 text-black animate-spin" />
          </div>
        )}

        {/* Summary Results */}
        {summary && !isAnalyzing && (
          <>
            {/* Summary */}
            <SectionCard icon={<MessageSquare className="w-4 h-4" />} title="Executive Summary">
              <p className="text-sm text-neutral-700 leading-relaxed mt-3">{summary.summary}</p>
            </SectionCard>

            {/* Key Topics */}
            <SectionCard icon={<Target className="w-4 h-4" />} title="Key Topics Discussed">
              <div className="mt-3 flex flex-wrap gap-2">
                {(summary.keyTopics || []).map((topic, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-neutral-100 text-black border border-neutral-200"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </SectionCard>

            {/* Key Points */}
            <SectionCard icon={<BookOpen className="w-4 h-4" />} title="Key Discussion Points">
              <ul className="mt-3 space-y-2">
                {(summary.keyPoints || []).map((point, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-700 leading-relaxed">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-bold text-neutral-600 flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </SectionCard>

            {/* Decisions */}
            <SectionCard icon={<CheckCircle2 className="w-4 h-4" />} title="Decisions Made">
              <ul className="mt-3 space-y-2">
                {(summary.decisions || []).map((decision, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-700 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-black mt-0.5" />
                    {decision}
                  </li>
                ))}
              </ul>
            </SectionCard>

            {/* Action Items */}
            <SectionCard icon={<ListChecks className="w-4 h-4" />} title="Action Items">
              <ul className="mt-3 space-y-2">
                {(summary.actionItems || []).map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-700 leading-relaxed">
                    <ArrowRight className="w-4 h-4 shrink-0 text-black mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </SectionCard>

            {/* Full Transcript (collapsed by default) */}
            <SectionCard icon={<FileText className="w-4 h-4" />} title="Full Transcript" defaultOpen={false}>
              <div className="mt-3 max-h-80 overflow-y-auto custom-scrollbar">
                <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap">
                  {transcript || 'No transcript available.'}
                </p>
              </div>
            </SectionCard>

            {/* Download CTA */}
            <div className="bg-black rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-white text-sm">Download Full Report</p>
                <p className="text-xs text-neutral-400 mt-0.5">Summary, topics, action items + full transcript in PDF format</p>
              </div>
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="shrink-0 tactile-btn inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black text-sm font-bold hover:bg-neutral-100 transition-all cursor-pointer disabled:opacity-60"
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Download PDF
              </button>
            </div>
          </>
        )}

        {/* Error */}
        {analysisError && (
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs text-center">
            <p className="text-sm text-neutral-500">{analysisError}</p>
            <button
              onClick={analyzeMeeting}
              className="mt-3 text-xs font-semibold text-black underline cursor-pointer"
            >
              Retry analysis
            </button>
          </div>
        )}

        {/* Footer Attribution */}
        <div className="text-center py-4 text-xs text-neutral-400">
          Powered by{' '}
          <span className="font-semibold text-neutral-600">AssemblyAI Universal-3.6 Pro</span>
          {' '}+{' '}
          <span className="font-semibold text-neutral-600">Gemini Flash</span>
          {' '}via LLM Gateway
        </div>
      </main>
    </div>
  )
}
