import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, ArrowRight, Activity, MapPin, CheckCircle2, FileText, ChevronRight, Menu, X } from 'lucide-react'

export default function Landing() {
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const heroVideoRef = useRef<HTMLVideoElement>(null)
  const aboutVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Video Autoplay Retry Logic
  useEffect(() => {
    const playVideos = () => {
      ;[heroVideoRef.current, aboutVideoRef.current].forEach((video) => {
        if (video) {
          video.muted = true
          video.play().catch(() => {})
        }
      })
    }

    playVideos()
    const interval = setInterval(playVideos, 1000)

    const handleUserInteraction = () => {
      playVideos()
    }

    document.addEventListener('click', handleUserInteraction)
    document.addEventListener('touchstart', handleUserInteraction)

    return () => {
      clearInterval(interval)
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
    }
  }, [])

  const handleNavClick = (target?: string) => {
    if (target === 'features' || target === 'about') {
      const el = document.getElementById('about-section')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/login')
    }
    setMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
      {/* SECTION 1: HERO */}
      <section className="relative min-h-[100dvh] flex flex-col justify-between overflow-hidden border-b border-slate-800">
        {/* Background Video */}
        <video
          ref={heroVideoRef}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260823_050407_500d0339-ab28-41c1-9688-132a74a3b5aa.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-30 mix-blend-luminosity"
        />

        {/* Gradient Scrim Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/90 to-[#0F172A]/40 pointer-events-none z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-[#0F172A]/60 pointer-events-none z-[1]" />

        {/* Navbar */}
        <header className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="h-10 w-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block">CivicTrack AI</span>
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">Municipal Platform</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <button onClick={() => navigate('/')} className="hover:text-white transition-colors">
              Home
            </button>
            <button onClick={() => handleNavClick('features')} className="hover:text-white transition-colors">
              Platform Features
            </button>
            <button onClick={() => handleNavClick('about')} className="hover:text-white transition-colors">
              Workflow
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/login')}
              className="group inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-blue-600/25 active:scale-95"
            >
              <span>Report an Issue</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-slate-300 hover:text-white p-2"
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden relative z-20 bg-slate-900 border-b border-slate-800 px-6 py-6 space-y-4">
            <button
              onClick={() => handleNavClick('features')}
              className="block w-full text-left text-slate-300 hover:text-white py-2"
            >
              Platform Features
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="block w-full text-left text-slate-300 hover:text-white py-2"
            >
              Workflow
            </button>
            <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg text-center"
              >
                Report an Issue
              </button>
            </div>
          </div>
        )}

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-6 py-12 md:py-20 flex-1 flex flex-col justify-center">
          <div className="max-w-3xl space-y-6">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono tracking-wide">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Municipal Operations & Triage Network</span>
            </div>

            {/* Main Professional Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Powering Swift Infrastructure Response for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Modern Cities</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
              CivicTrack AI turns resident field reports into verified, prioritized public-works action—from AI computer vision triage to automated SLA crew dispatch.
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-7 py-3.5 rounded-lg shadow-xl shadow-blue-600/30 transition-all text-base active:scale-98"
              >
                <span>Report an Issue</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold px-7 py-3.5 rounded-lg transition-all text-base"
              >
                <Activity className="w-5 h-5 text-blue-400" />
                <span>Explore Demo Workspace</span>
              </button>
            </div>

            {/* Live Metrics Row */}
            <div className="pt-10 grid grid-cols-3 gap-6 max-w-lg border-t border-slate-800/80 text-left">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white font-mono">4.2h</div>
                <div className="text-xs text-slate-400 mt-1">Median Triage Time</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono">87.4%</div>
                <div className="text-xs text-slate-400 mt-1">SLA Verified</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-blue-400 font-mono">20+</div>
                <div className="text-xs text-slate-400 mt-1">Active Cases</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: ABOUT / PLATFORM WORKFLOW */}
      <section id="about-section" className="relative py-24 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column Text */}
          <div className="space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-semibold">
                Accountable Infrastructure
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-snug">
                Accountable Civic Response & Automated Triage
              </h2>
            </div>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              CivicTrack AI builds the operational bridge between citizens and public works departments. Powered by computer vision and automated decision engines, we classify field evidence, eliminate duplicate reports, and route work orders instantly.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
                <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base">Automated AI Evidence Analysis</h3>
                  <p className="text-slate-400 text-sm mt-1">Instant severity rating, hazard detection, and department classification from single photo upload.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base">Geo-Fenced Duplicate Detection</h3>
                  <p className="text-slate-400 text-sm mt-1">Consolidate multiple citizen reports for the same incident to prevent duplicate work orders.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
                <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base">Transparent Public Audit Trail</h3>
                  <p className="text-slate-400 text-sm mt-1">Real-time status updates from initial submission to field crew completion evidence.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('/login')}
                className="group inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-md shadow-blue-600/20 active:scale-95"
              >
                <span>Access Demo Workspace</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column Video Preview */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-800">
            <video
              ref={aboutVideoRef}
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260823_063501_2e2c8971-de1e-473a-8611-a0c9ae7ee186.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="w-full h-full object-cover min-h-[340px]"
            />
            {/* Subtle Overlay Tint */}
            <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-950 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 CivicTrack AI · Municipal Public Works Platform</p>
          <button onClick={() => navigate('/login')} className="hover:text-white transition-colors">
            Access Role Workspaces →
          </button>
        </div>
      </footer>
    </div>
  )
}
