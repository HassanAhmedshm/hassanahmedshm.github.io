'use client'

import { useState } from 'react'
import {
  Eye,
  MousePointerClick,
  Terminal,
  Mic,
  Brain,
  Languages,
  Camera,
  Paperclip,
  Send,
  ChevronRight,
  Zap,
  Shield,
  History,
  Settings,
  MessageSquare,
  RotateCcw,
  Menu,
  X,
  Mail,
  ArrowRight,
} from 'lucide-react'

/* ────────────────────────────────────────────
   NAV
   ──────────────────────────────────────────── */
function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { label: 'Features', href: '#features' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'Providers', href: '#providers' },
    { label: 'Security', href: '#security' },
    { label: 'Beta', href: '#beta' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <a href="#" className="text-[#F5F5F5] font-semibold text-xl tracking-tight">
            AG
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-[#9E9E9E] hover:text-[#F5F5F5] transition-colors font-normal"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <a
              href="#beta"
              className="bg-[#FFFFFF] text-[#000000] hover:bg-[#E0E0E0] transition-colors text-sm font-normal px-4 py-1.5 rounded-md"
            >
              Apply for Beta
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-[#9E9E9E] hover:text-[#F5F5F5] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#2A2A2A] bg-[#0A0A0A]">
          <div className="px-4 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-[#9E9E9E] hover:text-[#F5F5F5] transition-colors font-normal py-1"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

/* ────────────────────────────────────────────
   HERO
   ──────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 border border-[#404040] bg-[#222222] rounded-md px-3 py-1 mb-6">
            <Zap size={14} className="text-[#9E9E9E]" />
            <span className="text-xs text-[#9E9E9E] font-normal uppercase tracking-wider">
              Closed Beta
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl text-[#F5F5F5] font-semibold leading-tight tracking-tight">
            AG controls your PC.
            <br />
            You stay in control.
          </h1>
          <p className="mt-6 text-lg text-[#9E9E9E] font-normal leading-relaxed max-w-2xl mx-auto">
            AG sees your screen, understands context, and acts on your behalf.
            Automate tasks, write code, and focus on what matters. Powered by
            Groq and completely local. Currently in closed beta.
          </p>

          {/* Actions */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#beta"
              className="bg-[#FFFFFF] text-[#000000] hover:bg-[#E0E0E0] transition-colors text-sm font-normal px-6 py-2.5 rounded-md inline-flex items-center gap-2"
            >
              Apply for Beta
              <ChevronRight size={16} />
            </a>
            <a
              href="#docs"
              className="bg-[#121212] border border-[#404040] text-[#F5F5F5] hover:bg-[#1A1A1A] hover:border-[#666666] transition-colors text-sm font-normal px-6 py-2.5 rounded-md inline-flex items-center gap-2"
            >
              View Documentation
            </a>
          </div>
        </div>

        {/* Simple Mode UI Mockup */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="border border-[#404040] bg-[#121212] rounded-md overflow-hidden">
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#2A2A2A]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#404040]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#404040]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#404040]" />
              </div>
              <span className="text-xs text-[#666666] font-normal">
                AG — Simple Mode
              </span>
              <div className="w-16" />
            </div>

            {/* Chat area */}
            <div className="px-6 py-12 flex flex-col items-center justify-center min-h-[180px]">
              <div className="flex items-start gap-3 w-full max-w-lg">
                <div className="w-7 h-7 rounded bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center shrink-0">
                  <Zap size={14} className="text-[#9E9E9E]" />
                </div>
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-md px-4 py-3 max-w-sm">
                  <p className="text-sm text-[#9E9E9E] font-normal">
                    Hello! I&apos;m AG. I can see your screen and help you with
                    anything. What would you like to do?
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom input bar */}
            <div className="px-4 py-3 border-t border-[#2A2A2A]">
              <div className="flex items-center gap-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-md px-3 py-2">
                <Camera size={16} className="text-[#666666] shrink-0" />
                <Paperclip size={16} className="text-[#666666] shrink-0" />
                <span className="text-sm text-[#666666] font-normal flex-1">
                  Ask AG anything...
                </span>
                <Send size={16} className="text-[#666666] shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────
   YOLO MODE
   ──────────────────────────────────────────── */
function YoloModeSection() {
  return (
    <section className="bg-[#1A1A1A] border-y border-[#2A2A2A] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 border border-[#404040] bg-[#222222] rounded-md px-3 py-1 mb-6">
            <Zap size={14} className="text-[#9E9E9E]" />
            <span className="text-xs text-[#9E9E9E] font-normal uppercase tracking-wider">
              YOLO Mode
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl text-[#F5F5F5] font-semibold tracking-tight">
            It doesn&apos;t stop until it&apos;s done.
          </h2>
          <p className="mt-4 text-[#9E9E9E] font-normal leading-relaxed max-w-xl mx-auto">
            When YOLO Mode is active, AG will retry up to{' '}
            <span className="text-[#F5F5F5] font-normal">50 times</span> to
            accomplish any task without throwing a generic error. It adapts,
            re-plans, and does whatever it takes to succeed. No more dead ends.
          </p>

          {/* Retry visualization */}
          <div className="mt-10 flex items-center justify-center gap-1 flex-wrap">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-normal"
                style={{
                  backgroundColor: i < 2 ? '#2A2A2A' : '#121212',
                  border: `1px solid ${i < 2 ? '#404040' : '#2A2A2A'}`,
                  color: i < 2 ? '#666666' : '#9E9E9E',
                }}
              >
                {i + 1}
              </div>
            ))}
            <span className="text-[#666666] text-sm font-normal mx-2">...</span>
            <div
              className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-normal"
              style={{
                backgroundColor: '#121212',
                border: '1px solid #404040',
                color: '#F5F5F5',
              }}
            >
              50
            </div>
            <ChevronRight size={14} className="text-[#666666] ml-1" />
            <div
              className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-normal"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #FFFFFF',
                color: '#000000',
              }}
            >
              ✓
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────
   CAPABILITIES GRID
   ──────────────────────────────────────────── */
const capabilities = [
  {
    icon: Eye,
    title: 'Vision & Observance',
    description: 'Sees your screen and understands context in real-time.',
  },
  {
    icon: MousePointerClick,
    title: 'Action & Control',
    description:
      'Controls mouse and keyboard securely, with full user supervision.',
  },
  {
    icon: Terminal,
    title: 'Code Execution',
    description: 'Writes and runs code directly in your terminal.',
  },
  {
    icon: Mic,
    title: 'Voice Companion',
    description: 'Talks, listens, and takes brief video/audio notes.',
  },
  {
    icon: Brain,
    title: 'Autonomous Memory',
    description:
      'Locally stores notes and context about you for smarter assistance.',
  },
  {
    icon: Languages,
    title: 'Multi-lingual',
    description: 'Full English and Arabic (RTL) support out of the box.',
  },
]

function CapabilitiesSection() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl text-[#F5F5F5] font-semibold tracking-tight">
            Core Capabilities
          </h2>
          <p className="mt-3 text-[#9E9E9E] font-normal max-w-lg mx-auto">
            Everything you need in an autonomous desktop agent.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {capabilities.map((cap) => {
            const Icon = cap.icon
            return (
              <div
                key={cap.title}
                className="bg-[#121212] border border-[#2A2A2A] rounded-md p-6 hover:border-[#404040] transition-colors"
              >
                <Icon size={22} className="text-[#9E9E9E] mb-4" />
                <h3 className="text-[#F5F5F5] font-semibold text-base mb-2">
                  {cap.title}
                </h3>
                <p className="text-[#9E9E9E] font-normal text-sm leading-relaxed">
                  {cap.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────
   UI TAILORED FOR EVERYONE
   ──────────────────────────────────────────── */
function UITailoredSection() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl text-[#F5F5F5] font-semibold tracking-tight">
            UI Tailored for Everyone
          </h2>
          <p className="mt-3 text-[#9E9E9E] font-normal max-w-lg mx-auto">
            Two modes designed for different workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Simple Mode */}
          <div className="bg-[#121212] border border-[#2A2A2A] rounded-md overflow-hidden">
            <div className="px-6 py-4 border-b border-[#2A2A2A]">
              <h3 className="text-[#F5F5F5] font-semibold text-base">
                Simple Mode
              </h3>
              <p className="text-[#9E9E9E] font-normal text-sm mt-1">
                Clean, minimal floating bar for everyday assistance.
              </p>
            </div>
            <div className="p-6">
              {/* Simple mode mockup */}
              <div className="border border-[#2A2A2A] bg-[#1A1A1A] rounded-md overflow-hidden">
                {/* Top bar */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-[#2A2A2A]">
                  <span className="text-xs text-[#666666] font-normal">
                    AG — Simple
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#404040]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#404040]" />
                  </div>
                </div>
                {/* Chat content */}
                <div className="px-4 py-6 space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded bg-[#222222] border border-[#2A2A2A] flex items-center justify-center shrink-0">
                      <Zap size={10} className="text-[#9E9E9E]" />
                    </div>
                    <div className="bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2">
                      <p className="text-xs text-[#9E9E9E] font-normal">
                        Ready to help!
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 justify-end">
                    <div className="bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2">
                      <p className="text-xs text-[#9E9E9E] font-normal">
                        Open my email
                      </p>
                    </div>
                  </div>
                </div>
                {/* Input bar */}
                <div className="px-3 py-2 border-t border-[#2A2A2A]">
                  <div className="flex items-center gap-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded px-2 py-1.5">
                    <Camera size={12} className="text-[#666666] shrink-0" />
                    <span className="text-xs text-[#666666] font-normal flex-1">
                      Ask AG...
                    </span>
                    <Send size={12} className="text-[#666666] shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Complex Mode */}
          <div className="bg-[#121212] border border-[#2A2A2A] rounded-md overflow-hidden">
            <div className="px-6 py-4 border-b border-[#2A2A2A]">
              <h3 className="text-[#F5F5F5] font-semibold text-base">
                Complex Mode
              </h3>
              <p className="text-[#9E9E9E] font-normal text-sm mt-1">
                Advanced sidebars for history, memory control, and instant LLM
                provider switching.
              </p>
            </div>
            <div className="p-6">
              {/* Complex mode mockup */}
              <div className="border border-[#2A2A2A] bg-[#1A1A1A] rounded-md overflow-hidden">
                <div className="flex h-48">
                  {/* Left sidebar */}
                  <div className="w-12 border-r border-[#2A2A2A] flex flex-col items-center py-2 gap-2">
                    <MessageSquare size={12} className="text-[#9E9E9E]" />
                    <History size={12} className="text-[#666666]" />
                    <Brain size={12} className="text-[#666666]" />
                    <Settings size={12} className="text-[#666666]" />
                  </div>
                  {/* Main chat area */}
                  <div className="flex-1 flex flex-col">
                    {/* Top bar */}
                    <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#2A2A2A]">
                      <span className="text-xs text-[#666666] font-normal">
                        AG — Complex
                      </span>
                      <div className="flex items-center gap-1">
                        <div className="bg-[#222222] border border-[#2A2A2A] rounded px-1.5 py-0.5">
                          <span className="text-[10px] text-[#9E9E9E] font-normal">
                            Groq
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Chat */}
                    <div className="flex-1 px-3 py-3 space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded bg-[#222222] border border-[#2A2A2A] flex items-center justify-center shrink-0">
                          <Zap size={8} className="text-[#9E9E9E]" />
                        </div>
                        <div className="bg-[#222222] border border-[#2A2A2A] rounded px-2 py-1.5">
                          <p className="text-[10px] text-[#9E9E9E] font-normal">
                            Task completed.
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Input */}
                    <div className="px-3 py-2 border-t border-[#2A2A2A]">
                      <div className="flex items-center gap-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded px-2 py-1">
                        <span className="text-[10px] text-[#666666] font-normal flex-1">
                          Ask AG...
                        </span>
                        <Send size={10} className="text-[#666666] shrink-0" />
                      </div>
                    </div>
                  </div>
                  {/* Right sidebar */}
                  <div className="w-16 border-l border-[#2A2A2A] p-2">
                    <p className="text-[9px] text-[#666666] font-normal uppercase tracking-wider mb-2">
                      Memory
                    </p>
                    <div className="space-y-1.5">
                      <div className="bg-[#222222] border border-[#2A2A2A] rounded px-1.5 py-1">
                        <p className="text-[8px] text-[#9E9E9E] font-normal truncate">
                          Pref: Dark mode
                        </p>
                      </div>
                      <div className="bg-[#222222] border border-[#2A2A2A] rounded px-1.5 py-1">
                        <p className="text-[8px] text-[#9E9E9E] font-normal truncate">
                          IDE: VS Code
                        </p>
                      </div>
                      <div className="bg-[#222222] border border-[#2A2A2A] rounded px-1.5 py-1">
                        <p className="text-[8px] text-[#9E9E9E] font-normal truncate">
                          Lang: EN/AR
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────
   PROVIDERS
   ──────────────────────────────────────────── */
const providers = [
  { name: 'Groqcloud', primary: true },
  { name: 'OpenAI', primary: false },
  { name: 'Mistral', primary: false },
  { name: 'Perplexity', primary: false },
  { name: 'Anthropic', primary: false },
  { name: 'Deepseek', primary: false },
  { name: 'Google', primary: false },
  { name: 'Meta', primary: false },
]

function ProvidersSection() {
  return (
    <section id="providers" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl text-[#F5F5F5] font-semibold tracking-tight">
            Model Agnostic
          </h2>
          <p className="mt-3 text-[#9E9E9E] font-normal max-w-lg mx-auto">
            Works with the providers you already trust.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto">
          {providers.map((p) => (
            <div
              key={p.name}
              className={`bg-[#121212] border rounded-md px-5 py-3 flex items-center gap-2 ${
                p.primary ? 'border-[#404040]' : 'border-[#2A2A2A]'
              }`}
            >
              {p.primary && (
                <span className="text-[10px] text-[#F5F5F5] bg-[#222222] border border-[#404040] rounded px-1.5 py-0.5 font-normal uppercase tracking-wider">
                  Primary
                </span>
              )}
              <span
                className={`text-sm font-normal ${
                  p.primary ? 'text-[#F5F5F5]' : 'text-[#9E9E9E]'
                }`}
              >
                {p.name}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-[#666666] font-normal text-sm">
          Bring your own API key. 100% Local Privacy.
        </p>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────
   SECURITY
   ──────────────────────────────────────────── */
function SecuritySection() {
  return (
    <section id="security" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <Shield size={28} className="text-[#9E9E9E] mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl text-[#F5F5F5] font-semibold tracking-tight">
            Your Data, Your Machine
          </h2>
          <p className="mt-4 text-[#9E9E9E] font-normal leading-relaxed max-w-xl mx-auto">
            All data is stored locally on your device. AG never sends your
            personal data to external servers. You maintain complete ownership
            and control over every interaction, every memory, every keystroke.
          </p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-md p-5">
              <RotateCcw size={18} className="text-[#9E9E9E] mb-3" />
              <h3 className="text-[#F5F5F5] font-semibold text-sm mb-1">
                Local Storage
              </h3>
              <p className="text-[#9E9E9E] font-normal text-xs leading-relaxed">
                All memories and preferences stay on your machine.
              </p>
            </div>
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-md p-5">
              <Shield size={18} className="text-[#9E9E9E] mb-3" />
              <h3 className="text-[#F5F5F5] font-semibold text-sm mb-1">
                User Supervision
              </h3>
              <p className="text-[#9E9E9E] font-normal text-xs leading-relaxed">
                Every action is visible. You approve what matters.
              </p>
            </div>
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-md p-5">
              <Eye size={18} className="text-[#9E9E9E] mb-3" />
              <h3 className="text-[#F5F5F5] font-semibold text-sm mb-1">
                Full Transparency
              </h3>
              <p className="text-[#9E9E9E] font-normal text-xs leading-relaxed">
                See exactly what AG sees, thinks, and does at all times.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────
   BETA CTA
   ──────────────────────────────────────────── */
function BetaSection() {
  const email = 'hassanahmedshm@gmail.com'
  const subject = encodeURIComponent('AG Beta Program — Enrollment Request')
  const body = encodeURIComponent(
    `Hello AG Team,\n\nI'd like to enroll in the AG Beta Program.\n\nAbout me:\n- Name:\n- Occupation/Role:\n- Operating System:\n\nHow I plan to use AG:\n\n\nWhy I'm interested in AG:\n\n\nI understand this is a closed beta and I will be contacted after review.\n\nThank you.`
  )
  const mailto = `mailto:${email}?subject=${subject}&body=${body}`

  return (
    <section id="beta" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mx-auto text-center">
          <Mail size={28} className="text-[#9E9E9E] mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl text-[#F5F5F5] font-semibold tracking-tight">
            Join the Closed Beta
          </h2>
          <p className="mt-4 text-[#9E9E9E] font-normal leading-relaxed max-w-xl mx-auto">
            AG is currently in closed beta. To request access, send us an email
            with information about yourself, how you plan to use AG, and why
            you&apos;re interested. We review every application and will get
            back to you.
          </p>

          {/* Steps */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-md p-5">
              <div className="w-7 h-7 rounded bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center mb-3">
                <span className="text-xs text-[#9E9E9E] font-normal">1</span>
              </div>
              <h3 className="text-[#F5F5F5] font-semibold text-sm mb-1">
                Send Email
              </h3>
              <p className="text-[#9E9E9E] font-normal text-xs leading-relaxed">
                Click the button below. Your email client will open with a
                pre-filled template.
              </p>
            </div>
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-md p-5">
              <div className="w-7 h-7 rounded bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center mb-3">
                <span className="text-xs text-[#9E9E9E] font-normal">2</span>
              </div>
              <h3 className="text-[#F5F5F5] font-semibold text-sm mb-1">
                Tell Us Why
              </h3>
              <p className="text-[#9E9E9E] font-normal text-xs leading-relaxed">
                Fill in how you&apos;ll use AG and why you want early access.
                The more detail, the better.
              </p>
            </div>
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-md p-5">
              <div className="w-7 h-7 rounded bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center mb-3">
                <span className="text-xs text-[#9E9E9E] font-normal">3</span>
              </div>
              <h3 className="text-[#F5F5F5] font-semibold text-sm mb-1">
                Get Access
              </h3>
              <p className="text-[#9E9E9E] font-normal text-xs leading-relaxed">
                We review every application. If accepted, you&apos;ll receive
                an email with setup instructions.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={mailto}
              className="bg-[#FFFFFF] text-[#000000] hover:bg-[#E0E0E0] transition-colors text-sm font-normal px-6 py-2.5 rounded-md inline-flex items-center gap-2"
            >
              <Mail size={16} />
              Apply for Beta Access
            </a>
            <a
              href={`mailto:${email}`}
              className="bg-[#121212] border border-[#404040] text-[#F5F5F5] hover:bg-[#1A1A1A] hover:border-[#666666] transition-colors text-sm font-normal px-6 py-2.5 rounded-md inline-flex items-center gap-2"
            >
              hassanahmedshm@gmail.com
              <ArrowRight size={14} />
            </a>
          </div>

          <p className="mt-6 text-[#666666] font-normal text-xs">
            All applications are reviewed manually. You will receive a response
            via email after review.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────
   FOOTER
   ──────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-[#2A2A2A] py-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="text-[#F5F5F5] font-semibold text-sm">AG</span>
            <span className="text-[#666666] font-normal text-xs">
              &copy; {new Date().getFullYear()} AG. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-xs text-[#9E9E9E] hover:text-[#F5F5F5] transition-colors font-normal"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-xs text-[#9E9E9E] hover:text-[#F5F5F5] transition-colors font-normal"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-xs text-[#9E9E9E] hover:text-[#F5F5F5] transition-colors font-normal"
            >
              Documentation
            </a>
            <a
              href="#"
              className="text-xs text-[#9E9E9E] hover:text-[#F5F5F5] transition-colors font-normal"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ────────────────────────────────────────────
   PAGE
   ──────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A]">
      <Navigation />
      <main className="flex-1">
        <HeroSection />
        <YoloModeSection />
        <CapabilitiesSection />
        <UITailoredSection />
        <ProvidersSection />
        <SecuritySection />
        <BetaSection />
      </main>
      <Footer />
    </div>
  )
}