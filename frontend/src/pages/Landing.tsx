import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useNavigate, Link } from 'react-router-dom'

/* ─── constants ─── */
const ACCENT = '#15BCDF'
const ACCENT_HOVER = '#3fd0ef'
const ACCENT_BORDER = '#0fa3c2'
const BG = '#F2F1F0'
const HEAD_COLOR = '#2b3033'
const NAV_COLOR = '#3a3a3a'
const BODY_GRAY = '#6b6f72'
const DARK = '#1a1c1e'
const FONT = "'Quantico', 'Arial Narrow', sans-serif"

const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260823_050407_500d0339-ab28-41c1-9688-132a74a3b5aa.mp4'
const ABOUT_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260823_063501_2e2c8971-de1e-473a-8611-a0c9ae7ee186.mp4'

const CHAMFER =
  'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))'
const CHAMFER_SM =
  'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'

const MOBILE = 700

/* ─── hooks ─── */
function useIsMobile() {
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= MOBILE : false,
  )
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth <= MOBILE)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return mobile
}

/* Robust autoplay: retry every 1 s + first user gesture */
function useAutoplay(ref: React.RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const v = ref.current
    if (!v) return

    const tryPlay = () => {
      if (!v) return
      v.muted = true
      v.play().catch(() => {})
    }

    tryPlay()
    const id = setInterval(tryPlay, 1000)

    const gesture = () => {
      tryPlay()
      document.removeEventListener('click', gesture)
      document.removeEventListener('touchstart', gesture)
    }
    document.addEventListener('click', gesture, { once: true })
    document.addEventListener('touchstart', gesture, { once: true })

    return () => {
      clearInterval(id)
      document.removeEventListener('click', gesture)
      document.removeEventListener('touchstart', gesture)
    }
  }, [ref])
}

/* ─── shared button ─── */
function ChamferedButton({
  children,
  style,
  onClick,
}: {
  children: React.ReactNode
  style?: CSSProperties
  onClick?: () => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: FONT,
        background: hovered ? ACCENT_HOVER : ACCENT,
        border: `1px solid ${ACCENT_BORDER}`,
        color: DARK,
        textTransform: 'uppercase',
        fontWeight: 700,
        letterSpacing: '0.14em',
        padding: '18px 34px',
        fontSize: 'clamp(13px, 2.2vw, 16px)',
        clipPath: CHAMFER,
        boxShadow: hovered
          ? `0 0 0 2px rgba(21,188,223,0.5), 0 14px 40px -10px rgba(15,163,194,0.7)`
          : `0 0 0 1px rgba(21,188,223,0.35), 0 10px 30px -12px rgba(15,163,194,0.6)`,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '14px',
        transition: 'background 0.2s, box-shadow 0.2s',
        lineHeight: 1,
        ...style,
      }}
    >
      {children}
      {/* Trailing line */}
      <span
        style={{
          display: 'inline-block',
          width: 22,
          height: 1,
          background: DARK,
          flexShrink: 0,
        }}
      />
    </button>
  )
}

/* ─── mail icon ─── */
function MailIcon() {
  return (
    <svg
      width="17"
      height="13"
      viewBox="0 0 17 13"
      fill="none"
      stroke="white"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="0.7" y="0.7" width="15.6" height="11.6" rx="1.5" />
      <path d="M0.7 0.7 L8.5 7 L16.3 0.7" />
    </svg>
  )
}

/* ─── hamburger ─── */
function Hamburger({
  open,
  onClick,
}: {
  open: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-label={open ? 'Close menu' : 'Open menu'}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        padding: 6,
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            display: 'block',
            width: 22,
            height: 2,
            background: open ? '#333' : '#fff',
            borderRadius: 1,
            transition: 'transform 0.25s, opacity 0.2s',
            ...(open && i === 0
              ? { transform: 'translateY(7px) rotate(45deg)' }
              : {}),
            ...(open && i === 1 ? { opacity: 0 } : {}),
            ...(open && i === 2
              ? { transform: 'translateY(-7px) rotate(-45deg)' }
              : {}),
          }}
        />
      ))}
    </button>
  )
}

/* ─── NAVBAR ─── */
function Navbar({ mobile }: { mobile: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const links = ['HOME', 'ABOUT', 'CONTACT US']

  return (
    <nav
      style={{
        position: 'relative',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 'clamp(20px, 5vw, 56px)',
        padding: `clamp(20px, 3vw, 38px) clamp(20px, 4vw, 48px) 0`,
        fontFamily: FONT,
        zIndex: 20,
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <svg width="38" height="38" viewBox="0 0 38 38">
          <circle cx="19" cy="19" r="19" fill="#111" />
          <ellipse
            cx="19"
            cy="19"
            rx="10"
            ry="4"
            fill="white"
            transform="rotate(-25 19 19)"
          />
        </svg>
        <span
          style={{
            fontSize: 'clamp(22px, 5vw, 30px)',
            fontWeight: 400,
            color: '#111',
            letterSpacing: '-0.5px',
            lineHeight: 1,
          }}
        >
          targo
        </span>
      </div>

      {/* Desktop links */}
      {!mobile && (
        <div
          style={{
            display: 'flex',
            gap: 34,
            alignItems: 'center',
          }}
        >
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(/\s/g, '')}`}
              style={{
                fontWeight: 700,
                fontSize: 'clamp(12px, 2.4vw, 15px)',
                letterSpacing: '0.06em',
                color: NAV_COLOR,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                textTransform: 'uppercase',
                fontFamily: FONT,
              }}
            >
              {l}
            </a>
          ))}
        </div>
      )}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Desktop Contact button */}
      {!mobile && (
        <ContactButton />
      )}

      {/* Mobile hamburger */}
      {mobile && (
        <Hamburger open={menuOpen} onClick={() => setMenuOpen((v) => !v)} />
      )}

      {/* Mobile menu */}
      {mobile && menuOpen && (
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            padding: '20px 0 12px 0',
          }}
        >
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(/\s/g, '')}`}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 15,
                color: DARK,
                textDecoration: 'none',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {l}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}

function ContactButton() {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate('/login')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: FONT,
        background: hovered ? 'rgba(255,255,255,0.14)' : 'transparent',
        border: 'none',
        color: 'white',
        textTransform: 'uppercase',
        letterSpacing: '0.14em',
        padding: '14px 26px',
        clipPath: CHAMFER_SM,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        fontWeight: 700,
        fontSize: 13,
        transition: 'background 0.2s',
        whiteSpace: 'nowrap',
      }}
    >
      <MailIcon />
      Contact us
    </button>
  )
}

/* ─── HERO SECTION ─── */
function HeroSection({ mobile }: { mobile: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  useAutoplay(videoRef)
  const navigate = useNavigate()

  const indent = 'min(238px, 28vw)'

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100svh',
        background: BG,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Background video */}
      <video
        ref={videoRef}
        src={HERO_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          objectFit: 'contain',
          height: 'auto',
          zIndex: 1,
          ...(mobile
            ? { top: 0, left: '-12%', width: '119%' }
            : { top: 0, right: '-20%', width: '99%' }),
        }}
      />

      {/* Desktop scrim */}
      {!mobile && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '70%',
            height: '100%',
            background: `linear-gradient(90deg, ${BG} 0%, ${BG} 55%, rgba(242,241,240,0.85) 78%, rgba(242,241,240,0) 100%)`,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Navbar */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Navbar mobile={mobile} />
      </div>

      {/* Headline + CTA */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: mobile ? 'flex-start' : 'center',
          ...(mobile
            ? { marginTop: 360, padding: '0 20px 28px 20px' }
            : {
                padding: `min(clamp(40px, 9vw, 120px), 9vh) 20px min(clamp(24px, 4vw, 44px), 5vh) clamp(20px, 9vw, 118px)`,
              }),
        }}
      >
        <h1
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.01em',
            lineHeight: 0.98,
            color: HEAD_COLOR,
            fontSize: mobile
              ? 'clamp(34px, 10vw, 56px)'
              : 'min(clamp(34px, 7.6vw, 80px), 9.2vh)',
            margin: 0,
          }}
        >
          <span style={{ display: 'block' }}>SCALING</span>
          <span style={{ display: 'block' }}>THE</span>
          <span style={{ display: 'block' }}>PLATFORM</span>
          <span
            style={{
              display: 'block',
              paddingLeft: `${indent}`,
            }}
          >
            FOR
          </span>
          <span
            style={{
              display: 'block',
              paddingLeft: `${indent}`,
            }}
          >
            YOUR
          </span>
          <span
            style={{
              display: 'block',
              paddingLeft: `${indent}`,
              color: ACCENT,
            }}
          >
            BUSINESS
          </span>
        </h1>

        {/* CTA */}
        <div
          style={{
            ...(mobile
              ? { padding: '28px 0 0 0' }
              : {
                  paddingLeft: `calc(clamp(20px, 9vw, 118px) + ${indent})`,
                  paddingBottom: `min(clamp(36px, 6vw, 80px), 7vh)`,
                  paddingTop: 'clamp(20px, 3vw, 36px)',
                }),
          }}
        >
          <ChamferedButton onClick={() => navigate('/login')}>GET STARTED</ChamferedButton>
        </div>
      </div>
    </section>
  )
}

/* ─── ABOUT SECTION ─── */
function AboutSection({ mobile }: { mobile: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  useAutoplay(videoRef)
  const navigate = useNavigate()

  const aboutIndent = 'min(160px, 18vw)'

  return (
    <section
      id="about"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 40,
        background: `linear-gradient(180deg, ${BG} 0%, #F7F6F8 18%, #F7F6F8 100%)`,
        padding: `clamp(60px, 10vw, 140px) 0 clamp(30px, 5vw, 70px) clamp(20px, 9vw, 118px)`,
      }}
    >
      {/* Left column */}
      <div
        style={{
          flex: '1 1 420px',
          minWidth: 300,
        }}
      >
        <h2
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.01em',
            lineHeight: 0.98,
            fontSize: 'clamp(34px, 6.5vw, 72px)',
            color: HEAD_COLOR,
            margin: 0,
          }}
        >
          <span style={{ display: 'block' }}>ABOUT</span>
          <span
            style={{
              display: 'block',
              paddingLeft: aboutIndent,
              color: ACCENT,
            }}
          >
            BUSINESS
          </span>
        </h2>

        <p
          style={{
            fontFamily: FONT,
            maxWidth: 520,
            marginTop: 32,
            marginLeft: aboutIndent,
            marginBottom: 0,
            marginRight: 0,
            fontSize: 'clamp(14px, 1.6vw, 17px)',
            lineHeight: 1.7,
            color: BODY_GRAY,
          }}
        >
          Targo builds the testing infrastructure modern teams rely on. From
          automated pipelines to full-scale QA audits, we make sure your software
          ships fast and breaks nothing. Hundreds of releases, zero surprises.
        </p>

        <div
          style={{
            marginTop: 36,
            marginLeft: aboutIndent,
          }}
        >
          <ChamferedButton onClick={() => navigate('/login')}>LEARN MORE</ChamferedButton>
        </div>
      </div>

      {/* Right column */}
      <div
        style={{
          flex: '1 1 360px',
          minWidth: 280,
          display: 'flex',
          justifyContent: 'flex-end',
          position: 'relative',
        }}
      >
        <div style={{ position: 'relative', width: '100%', maxWidth: 644 }}>
          <video
            ref={videoRef}
            src={ABOUT_VIDEO}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
          />
          {/* Hue overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100%',
              maxWidth: 644,
              height: '100%',
              background: ACCENT,
              mixBlendMode: 'hue',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
        </div>
      </div>
    </section>
  )
}

/* ─── LANDING PAGE ─── */
export default function Landing() {
  const mobile = useIsMobile()

  /* Force body styles for this page */
  useEffect(() => {
    const prev = {
      margin: document.body.style.margin,
      background: document.body.style.background,
      color: document.body.style.color,
      fontFamily: document.body.style.fontFamily,
    }
    document.body.style.margin = '0'
    document.body.style.background = BG
    document.body.style.color = HEAD_COLOR
    document.body.style.fontFamily = FONT
    return () => {
      document.body.style.margin = prev.margin
      document.body.style.background = prev.background
      document.body.style.color = prev.color
      document.body.style.fontFamily = prev.fontFamily
    }
  }, [])

  return (
    <div style={{ fontFamily: FONT, background: BG, minHeight: '100vh' }}>
      <HeroSection mobile={mobile} />
      <AboutSection mobile={mobile} />
    </div>
  )
}
