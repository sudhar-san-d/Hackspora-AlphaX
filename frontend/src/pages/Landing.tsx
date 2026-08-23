import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Menu, X } from 'lucide-react'

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0B1220] text-gray-900 dark:text-white font-['Inter',sans-serif] selection:bg-[#2E7DF3] selection:text-white">
      {/* 🧭 Navigation Bar */}
      <header className="w-full border-b border-gray-100 dark:border-gray-800/60 bg-white/80 dark:bg-[#0B1220]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#2E7DF3] to-blue-400 flex items-center justify-center text-sm shadow-md shadow-[#2E7DF3]/20 group-hover:scale-105 transition-transform">
              🌍
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
              Terra
            </span>
          </Link>

          {/* Desktop Nav Links (≥ lg) */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#product" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium text-sm transition-colors">
              Product
            </a>
            <a href="#solutions" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium text-sm transition-colors">
              Solutions
            </a>
            <div className="relative group">
              <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium text-sm transition-colors py-2">
                <span>Resources</span>
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-transform group-hover:rotate-180" />
              </button>
            </div>
            <a href="#examples" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium text-sm transition-colors">
              Examples
            </a>
            <a href="#pricing" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium text-sm transition-colors">
              Pricing
            </a>
          </nav>

          {/* Right Side Desktop Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-full border border-gray-300 dark:border-gray-700 px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/login?role=citizen"
              className="rounded-full bg-[#2E7DF3] text-white px-5 py-2 text-sm font-medium hover:bg-[#256BD4] transition-colors shadow-md shadow-[#2E7DF3]/20"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile/Tablet Hamburger Menu Button (< lg) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile / Tablet Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0B1220] px-4 pt-2 pb-6 space-y-3">
            <a
              href="#product"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Product
            </a>
            <a
              href="#solutions"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Solutions
            </a>
            <a
              href="#resources"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <span>Resources</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </a>
            <a
              href="#examples"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Examples
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Pricing
            </a>
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center rounded-full border border-gray-300 dark:border-gray-700 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Login
              </Link>
              <Link
                to="/login?role=citizen"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center rounded-full bg-[#2E7DF3] text-white px-5 py-2.5 text-sm font-medium hover:bg-[#256BD4]"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 🚀 Hero Content (Centered, Flex Column) */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-8 pb-20 text-center max-w-6xl mx-auto w-full">
        {/* Product Hunt Badge */}
        <div className="mt-10 inline-flex items-center gap-2 rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 px-3.5 py-1.5 shadow-xs transition-transform hover:scale-[1.02]">
          <span className="text-base leading-none">🏆</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
            PRODUCT HUNT
          </span>
          <span className="text-xs text-red-300 dark:text-red-800 font-light">•</span>
          <span className="text-[14px] font-semibold text-red-500 dark:text-red-400">
            #1 Product of the Day
          </span>
        </div>

        {/* Heading */}
        <h1
          className="font-medium tracking-tight text-5xl md:text-7xl max-w-4xl mt-8 leading-[1.15] md:leading-[1.1]"
          style={{ letterSpacing: '-0.03em' }}
        >
          <span className="text-[#2E7DF3]">The ultimate geo </span>
          <span className="text-[#2E7DF3]">map </span>
          <span className="relative inline-block px-3 py-1 my-1">
            <span
              className="bg-clip-text text-transparent inline-block"
              style={{
                backgroundImage: 'linear-gradient(135deg, #767676 0%, #D3D3D3 100%)',
              }}
            >
              builder
            </span>
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none -rotate-[0.5deg]"
              viewBox="0 0 200 95"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M5 5 L195 5 L195 88 L5 72 Z"
                fill="none"
                stroke="#B0B0B0"
                strokeWidth="1.2"
                strokeDasharray="6 4"
              />
              {/* Corner dots */}
              <circle cx="5" cy="5" r="3.5" fill="#B0B0B0" />
              <circle cx="195" cy="5" r="3.5" fill="#B0B0B0" />
              <circle cx="5" cy="72" r="3.5" fill="#B0B0B0" />
              <circle cx="195" cy="88" r="3.5" fill="#B0B0B0" />
              {/* Midpoint dots */}
              <circle cx="100" cy="5" r="3" fill="#B0B0B0" />
              <circle cx="100" cy="80" r="3" fill="#B0B0B0" />
              <circle cx="5" cy="38.5" r="3" fill="#B0B0B0" />
              <circle cx="195" cy="46.5" r="3" fill="#B0B0B0" />
            </svg>
          </span>
        </h1>

        {/* Subtext */}
        <p className="mt-8 text-gray-500 dark:text-gray-400 text-base md:text-lg max-w-lg text-center leading-relaxed font-normal">
          Terra is how teams build maps and run spatial intelligence together.
          <br className="hidden sm:inline" />
          Design, collaborate, share — all in one place.
        </p>

        {/* CTA Button */}
        <Link
          to="/login?role=citizen"
          className="mt-8 px-10 py-4 bg-[#2E7DF3] text-white font-semibold rounded-full shadow-lg shadow-[#2E7DF3]/20 hover:bg-[#256BD4] transition-all hover:scale-105 active:scale-95 inline-block text-base"
        >
          Get Started Free
        </Link>

        {/* Video */}
        <div className="mt-12 w-full max-w-5xl rounded-xl overflow-hidden shadow-none border border-gray-200 dark:border-gray-800/60 bg-gray-900/50">
          <video
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_092310_5c71bab5-63cd-4a95-9390-cc6a1189d553.mp4"
            muted
            autoPlay
            loop
            playsInline
            className="w-full h-auto object-cover block"
          />
        </div>
      </main>
    </div>
  )
}
