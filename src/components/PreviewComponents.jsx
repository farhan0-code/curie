import React from 'react'
import CurieLogo from './CurieLogo'
import {
  Mic,
  Video,
  Hand,
  Share2,
  PhoneOff,
  MoreVertical,
  MessageSquare,
  Users,
  Grid,
  Info,
  Square,
  Sparkles,
} from 'lucide-react'

// Dedicated Standalone PiP Window Preview
export function PiPWindowStandalone() {
  return (
    <div className="min-h-screen w-full bg-neutral-900 flex items-center justify-center p-6">
      <div
        className="w-[440px] bg-white rounded-2xl border border-neutral-300 shadow-2xl p-4 flex flex-col font-sans select-none"
        style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)' }}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <CurieLogo size={16} />
            <span className="text-xs font-bold text-neutral-900 tracking-tight">Curie Meeting AI</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold flex items-center gap-1.5 text-neutral-900">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              00:42
            </span>
          </div>
        </div>

        {/* Live Captions Body */}
        <div className="mt-3 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-600">
                Live Captions
              </span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">185 words · Universal-3.6 Pro</span>
          </div>

          <div className="space-y-1.5 text-xs text-neutral-800 leading-relaxed pr-1 min-h-[140px]">
            <p className="text-neutral-900 font-medium">
              <span className="text-neutral-500 font-normal">Alex: </span>Welcome everyone. Today we are reviewing the AssemblyAI Realtime STT integration.
            </p>
            <p className="text-neutral-900 font-medium">
              <span className="text-neutral-500 font-normal">Maya: </span>Turn-to-turn latency is down under 290 milliseconds with Universal-3.6 Pro.
            </p>
            <p className="text-neutral-900 font-medium">
              <span className="text-neutral-500 font-normal">David: </span>Client-side downsampler runs at 16kHz Int16 linear PCM with near-zero overhead.
            </p>
            <p className="text-neutral-500 italic">
              <span className="text-neutral-400 font-normal not-italic">Alex: </span>David will merge the ephemeral token endpoint today and Alex will finalize the executive synthesis...
            </p>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="flex items-center justify-between pt-3 mt-2 border-t border-neutral-200">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-xs">
              <Square className="w-3 h-3 fill-current" />
              Stop & Analyze
            </button>
            <button className="px-2.5 py-1.5 rounded-lg border border-neutral-300 text-neutral-700 text-xs font-semibold hover:bg-neutral-100 transition-colors">
              Cancel
            </button>
          </div>
          <span className="text-[11px] font-medium text-cyan-700 hover:underline cursor-pointer">
            Open Curie Tab →
          </span>
        </div>
      </div>
    </div>
  )
}

// Dedicated Ambient Meeting In Action Preview
export function MeetingActionPreview() {
  return (
    <div className="h-screen w-screen bg-[#202124] text-white font-sans flex flex-col overflow-hidden relative select-none">
      {/* Chrome Tab Audio Sharing Indicator */}
      <div className="bg-[#1a73e8] text-white text-xs py-1.5 px-4 flex items-center justify-center gap-3 shrink-0 font-medium shadow-xs">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          Sharing tab audio to <strong>localhost:3000</strong>
        </span>
        <button className="bg-white text-[#1a73e8] px-2 py-0.5 rounded text-[11px] font-bold hover:bg-neutral-100 transition-colors">
          Stop sharing
        </button>
      </div>

      {/* Google Meet Header */}
      <div className="px-6 py-3 flex items-center justify-between text-xs text-neutral-300 shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-white text-sm">Product & Engineering Sprint Sync</span>
          <span className="text-neutral-500">|</span>
          <span className="font-mono text-neutral-400">cur-ieai-stt</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-[#3c4043] px-2.5 py-1 rounded-md text-[11px] font-medium text-neutral-200 flex items-center gap-1.5">
            <Users className="w-3 h-3" /> 4 participants
          </span>
        </div>
      </div>

      {/* Participant Video Grid */}
      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-3 p-4 pt-1 max-w-6xl mx-auto w-full">
        {/* Tile 1: Alex */}
        <div className="bg-[#3c4043] rounded-2xl relative overflow-hidden flex items-center justify-center border border-[#5f6368]/30">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-2xl font-bold shadow-lg">
            AC
          </div>
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5">
            <span>Alex Chen (Product)</span>
          </div>
        </div>

        {/* Tile 2: Maya (Active Speaker with glowing border) */}
        <div className="bg-[#3c4043] rounded-2xl relative overflow-hidden flex items-center justify-center border-2 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-2xl font-bold shadow-lg">
            MP
          </div>
          <div className="absolute top-3 right-3 bg-emerald-500/90 text-white px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            SPEAKING
          </div>
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-emerald-400" />
            <span>Maya Patel (AI Engineer)</span>
          </div>
        </div>

        {/* Tile 3: David */}
        <div className="bg-[#3c4043] rounded-2xl relative overflow-hidden flex items-center justify-center border border-[#5f6368]/30">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-2xl font-bold shadow-lg">
            DK
          </div>
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5">
            <span>David Kim (Backend)</span>
          </div>
        </div>

        {/* Tile 4: Elena */}
        <div className="bg-[#3c4043] rounded-2xl relative overflow-hidden flex items-center justify-center border border-[#5f6368]/30">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-2xl font-bold shadow-lg">
            ER
          </div>
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5">
            <span>Elena Rostova (Design)</span>
          </div>
        </div>
      </div>

      {/* Meet Bottom Controls Bar */}
      <div className="h-16 px-6 flex items-center justify-between shrink-0 bg-[#202124]">
        <div className="text-xs text-neutral-300 font-mono">10:42 AM · cur-ieai-stt</div>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-[#3c4043] hover:bg-[#4a4e51] flex items-center justify-center text-white">
            <Mic className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 rounded-full bg-[#3c4043] hover:bg-[#4a4e51] flex items-center justify-center text-white">
            <Video className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 rounded-full bg-[#3c4043] hover:bg-[#4a4e51] flex items-center justify-center text-white">
            <Hand className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 rounded-full bg-[#8ab4f8] text-neutral-900 flex items-center justify-center">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 rounded-full bg-[#3c4043] hover:bg-[#4a4e51] flex items-center justify-center text-white">
            <MoreVertical className="w-4 h-4" />
          </button>
          <button className="px-5 h-10 rounded-full bg-[#ea4335] hover:bg-[#d93025] flex items-center justify-center text-white font-bold text-xs gap-2 ml-2">
            <PhoneOff className="w-4 h-4" /> Leave call
          </button>
        </div>
        <div className="flex items-center gap-2 text-neutral-400">
          <Info className="w-5 h-5 hover:text-white cursor-pointer" />
          <Users className="w-5 h-5 hover:text-white cursor-pointer" />
          <MessageSquare className="w-5 h-5 hover:text-white cursor-pointer" />
        </div>
      </div>

      {/* Floating Document PiP Window in Bottom-Right Corner */}
      <div
        className="absolute bottom-20 right-6 w-[410px] bg-white text-neutral-900 rounded-2xl border border-neutral-300 shadow-2xl p-3.5 z-50 flex flex-col font-sans"
        style={{ boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.7)' }}
      >
        {/* PiP Header */}
        <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <CurieLogo size={14} />
            <span className="text-xs font-bold text-neutral-900">Curie Meeting AI</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold flex items-center gap-1.5 text-neutral-900">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              00:42
            </span>
          </div>
        </div>

        {/* PiP Body */}
        <div className="mt-2 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-cyan-600">
                Live Captions
              </span>
            </div>
            <span className="text-[9px] font-mono text-neutral-400">185 words · Universal-3.6 Pro</span>
          </div>

          <div className="space-y-1 text-[11px] text-neutral-800 leading-relaxed pr-1">
            <p className="text-neutral-900 font-medium">
              <span className="text-neutral-500 font-normal">Alex: </span>Welcome everyone. Today we are reviewing the AssemblyAI Realtime STT integration.
            </p>
            <p className="text-neutral-900 font-medium">
              <span className="text-neutral-500 font-normal">Maya: </span>Turn-to-turn latency is down under 290 milliseconds with Universal-3.6 Pro.
            </p>
            <p className="text-neutral-500 italic">
              <span className="text-neutral-400 font-normal not-italic">David: </span>Client-side downsampler runs at 16kHz Int16 linear PCM with zero lag...
            </p>
          </div>
        </div>

        {/* PiP Controls */}
        <div className="flex items-center justify-between pt-2 mt-2 border-t border-neutral-200">
          <div className="flex items-center gap-1.5">
            <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600 text-white text-[11px] font-bold hover:bg-red-700 transition-colors">
              <Square className="w-2.5 h-2.5 fill-current" />
              Stop & Analyze
            </button>
            <button className="px-2 py-1 rounded-lg border border-neutral-300 text-neutral-700 text-[11px] font-semibold hover:bg-neutral-100 transition-colors">
              Cancel
            </button>
          </div>
          <span className="text-[10px] font-medium text-cyan-700">
            Open Curie Tab →
          </span>
        </div>
      </div>
    </div>
  )
}
