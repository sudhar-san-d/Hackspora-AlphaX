import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [ctaHovered, setCtaHovered] = useState(false)
  const [contactHovered, setContactHovered] = useState(false)

  const heroVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 700)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Robust Video Autoplay Retry Logic
  useEffect(() => {
    const playVideos = () => {
      if (heroVideoRef.current) {
        heroVideoRef.current.muted = true
        heroVideoRef.current.play().catch(() => {})
      }
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

  const handleNavClick = () => {
    navigate('/login')
    setMenuOpen(false)
  }

  return (
    <div
      style={{
        margin: 0,
        backgroundColor: '#F2F1F0',
        color: '#2b3033',
        fontFamily: "'Quantico', 'Arial Narrow', sans-serif",
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      {/* SECTION 1: HERO */}
      <section
        style={{
          position: 'relative',
          minHeight: '100svh',
          backgroundColor: '#F2F1F0',
          overflow: 'hidden',
        }}
      >
        {/* Background Video */}
        <video
          ref={heroVideoRef}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260823_050407_500d0339-ab28-41c1-9688-132a74a3b5aa.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            position: 'absolute',
            top: 0,
            right: isMobile ? undefined : '-20%',
            left: isMobile ? '-12%' : undefined,
            width: isMobile ? '119%' : '99%',
            height: 'auto',
            objectFit: 'contain',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Desktop Scrim Overlay */}
        {!isMobile && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '70%',
              height: '100%',
              background:
                'linear-gradient(90deg, #F2F1F0 0%, #F2F1F0 55%, rgba(242,241,240,0.85) 78%, rgba(242,241,240,0) 100%)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
        )}

        {/* Navbar */}
        <header
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'clamp(20px, 5vw, 56px)',
            padding: 'clamp(20px, 3vw, 38px) clamp(20px, 4vw, 48px) 0 clamp(20px, 4vw, 48px)',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#111111',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  transform: 'rotate(-25deg)',
                }}
              />
            </div>
            <span
              style={{
                fontSize: 'clamp(22px, 5vw, 30px)',
                fontWeight: 400,
                color: '#111111',
                letterSpacing: '-0.5px',
                textTransform: 'lowercase',
              }}
            >
              civictrack
            </span>
          </div>

          {/* Desktop Nav Links */}
          {!isMobile && (
            <nav
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '34px',
              }}
            >
              {['HOME', 'FEATURES', 'REPORT ISSUE'].map((link) => (
                <button
                  key={link}
                  onClick={handleNavClick}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontFamily: "'Quantico', 'Arial Narrow', sans-serif",
                    fontWeight: 700,
                    fontSize: 'clamp(12px, 2.4vw, 15px)',
                    letterSpacing: '0.06em',
                    color: '#3a3a3a',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    padding: 0,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#000000')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#3a3a3a')}
                >
                  {link}
                </button>
              ))}
            </nav>
          )}

          {/* Desktop Contact / Action Button */}
          {!isMobile && (
            <button
              onClick={handleNavClick}
              onMouseEnter={() => setContactHovered(true)}
              onMouseLeave={() => setContactHovered(false)}
              style={{
                background: contactHovered ? 'rgba(255,255,255,0.14)' : 'transparent',
                border: 'none',
                color: '#FFFFFF',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                fontWeight: 700,
                fontSize: '13px',
                fontFamily: "'Quantico', 'Arial Narrow', sans-serif",
                padding: '14px 26px',
                clipPath:
                  'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'background 0.2s ease',
              }}
            >
              REPORT ISSUE
              <svg width="17" height="13" viewBox="0 0 17 13" fill="none" stroke="#FFFFFF" strokeWidth="1.4">
                <rect x="0.7" y="0.7" width="15.6" height="11.6" rx="1.3" />
                <path d="M1.5 1.5L8.5 7.5L15.5 1.5" />
              </svg>
            </button>
          )}

          {/* Mobile Hamburger Button */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen((v) => !v)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                padding: '8px',
              }}
              aria-label="Toggle navigation menu"
            >
              <div style={{ width: '22px', height: '2px', backgroundColor: '#FFFFFF' }} />
              <div style={{ width: '22px', height: '2px', backgroundColor: '#FFFFFF' }} />
              <div style={{ width: '22px', height: '2px', backgroundColor: '#FFFFFF' }} />
            </button>
          )}
        </header>

        {/* Mobile Dropdown Menu */}
        {isMobile && menuOpen && (
          <div
            style={{
              position: 'relative',
              zIndex: 20,
              backgroundColor: '#1a1c1e',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            {['HOME', 'FEATURES', 'REPORT ISSUE'].map((link) => (
              <button
                key={link}
                onClick={handleNavClick}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FFFFFF',
                  fontFamily: "'Quantico', 'Arial Narrow', sans-serif",
                  fontWeight: 700,
                  fontSize: '16px',
                  letterSpacing: '0.06em',
                  textAlign: 'left',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                {link}
              </button>
            ))}
          </div>
        )}

        {/* Hero Content Container */}
        <div style={{ position: 'relative', zIndex: 5 }}>
          {/* Headline */}
          <h1
            style={{
              fontFamily: "'Quantico', 'Arial Narrow', sans-serif",
              fontWeight: 700,
              textTransform: 'uppercase',
              lineHeight: 0.98,
              letterSpacing: '0.01em',
              color: '#2b3033',
              fontSize: isMobile ? 'clamp(34px, 10vw, 56px)' : 'min(clamp(34px, 7.6vw, 80px), 9.2vh)',
              margin: 0,
              marginTop: isMobile ? '440px' : undefined,
              padding: isMobile
                ? '20px 20px 28px 20px'
                : 'clamp(140px, 22vh, 280px) 20px min(clamp(24px, 4vw, 44px), 5vh) clamp(20px, 9vw, 118px)',
            }}
          >
            <div>POWERING THE</div>
            <div>FOR RESPONSE</div>
            <div style={{ color: '#15BCDF' }}>MODERN CITIES</div>
          </h1>

          {/* CTA Button Wrapper */}
          <div
            style={{
              paddingLeft: isMobile ? '20px' : 'clamp(20px, 9vw, 118px)',
              paddingTop: '24px',
              paddingBottom: 'min(clamp(36px, 6vw, 80px), 7vh)',
            }}
          >
            <button
              onClick={() => navigate('/login')}
              onMouseEnter={() => setCtaHovered(true)}
              onMouseLeave={() => setCtaHovered(false)}
              style={{
                backgroundColor: ctaHovered ? '#3fd0ef' : '#15BCDF',
                border: '1px solid #0fa3c2',
                color: '#1a1c1e',
                textTransform: 'uppercase',
                fontWeight: 700,
                letterSpacing: '0.14em',
                padding: '18px 34px',
                fontSize: 'clamp(13px, 2.2vw, 16px)',
                fontFamily: "'Quantico', 'Arial Narrow', sans-serif",
                clipPath:
                  'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
                boxShadow: ctaHovered
                  ? '0 0 0 1px rgba(63,208,239,0.5), 0 12px 35px -10px rgba(63,208,239,0.8)'
                  : '0 0 0 1px rgba(21,188,223,0.35), 0 10px 30px -12px rgba(15,163,194,0.6)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.25s ease',
              }}
            >
              <span>REPORT AN ISSUE</span>
              <span
                style={{
                  width: '22px',
                  height: '1px',
                  backgroundColor: '#1a1c1e',
                  display: 'inline-block',
                }}
              />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
