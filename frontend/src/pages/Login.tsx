import { ArrowLeft, Building2, Check, HardHat, LoaderCircle, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Brand } from '../components/Layout'
import { useApp } from '../context/AppContext'
import type { Role } from '../types'

const roles: Array<{ role: Role; title: string; account: string; description: string; icon: typeof UserRound }> = [
  { role: 'citizen', title: 'Resident portal', account: 'Maya Thompson', description: 'Submit reports, follow progress, and review completed work.', icon: UserRound },
  { role: 'officer', title: 'Field operations', account: 'Elias Morgan', description: 'Prioritize assignments, navigate on site, and attach evidence.', icon: HardHat },
  { role: 'admin', title: 'Command center', account: 'Nadia Okafor', description: 'Monitor citywide workload, SLA pressure, and service outcomes.', icon: Building2 },
]

export default function Login() {
  const { login, currentUser } = useApp()
  const [params] = useSearchParams()
  const [selected, setSelected] = useState<Role>((params.get('role') as Role) || 'citizen')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [btnHovered, setBtnHovered] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser) navigate(`/${currentUser.role}`, { replace: true })
  }, [currentUser, navigate])

  const enter = async () => {
    setStatus('loading')
    setMessage('')
    try {
      const result = await login(selected)
      setMessage(result.source === 'demo' ? 'Demo workspace ready.' : 'Municipal API connected.')
      navigate(`/${selected}`)
    } catch {
      setStatus('error')
      setMessage('Unable to prepare this workspace. Please try again.')
    }
  }

  return (
    <main
      style={{
        margin: 0,
        backgroundColor: '#F2F1F0',
        color: '#2B3033',
        fontFamily: "'Quantico', 'Arial Narrow', sans-serif",
        minHeight: '100vh',
      }}
      className="relative min-h-[100dvh] overflow-hidden"
    >
      <div className="relative mx-auto grid min-h-[100dvh] max-w-[1280px] lg:grid-cols-[.8fr_1.2fr]">
        {/* Left Side Info Panel */}
        <section className="flex flex-col border-b border-[#DCDAD7] px-6 py-8 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-10">
          <Brand />
          <div className="my-auto py-12 lg:py-16">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B6F72]">
              Secure Demonstration Access
            </p>
            <h1 className="mt-4 max-w-md text-3xl font-bold uppercase leading-[1.05] tracking-[0.01em] text-[#2B3033] sm:text-4xl">
              CHOOSE YOUR <span style={{ color: '#15BCDF' }}>PUBLIC SERVICE</span> WORKSPACE
            </h1>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-[#6B6F72]">
              Each account opens a complete role-based workflow. Progress is preserved on this device, even when offline.
            </p>
            <div className="mt-8 space-y-3.5">
              {[
                'No password or personal data required',
                'Realistic municipal case workflows',
                'Full CT-1001 repair evidence history',
              ].map((item) => (
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wide text-[#2B3033]" key={item}>
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-[#15BCDF]/20 text-[#15BCDF]">
                    <Check size={12} strokeWidth={2.5} />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#6B6F72] transition-colors hover:text-[#2B3033]"
          >
            <ArrowLeft size={14} strokeWidth={2} />
            Return to public landing page
          </Link>
        </section>

        {/* Right Side Selection Panel */}
        <section className="flex items-center px-6 py-12 sm:px-10 lg:px-16">
          <div className="w-full max-w-2xl">
            <div className="mb-6 flex items-end justify-between border-b border-[#DCDAD7] pb-4">
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B6F72]">
                  Demo Accounts
                </p>
                <h2 className="mt-1 text-2xl font-bold uppercase tracking-[0.01em] text-[#2B3033]">
                  Select a Role
                </h2>
              </div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#15BCDF]">
                AUTH / DEMO
              </span>
            </div>

            <div className="space-y-3" role="radiogroup" aria-label="Demo roles">
              {roles.map((item) => {
                const Icon = item.icon
                const active = selected === item.role
                return (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={active}
                    key={item.role}
                    onClick={() => setSelected(item.role)}
                    style={{
                      borderColor: active ? '#0fa3c2' : '#DCDAD7',
                      backgroundColor: active ? '#FFFFFF' : '#E8E7E5',
                      boxShadow: active ? '0 0 0 1px #15BCDF, 0 4px 16px rgba(21, 188, 223, 0.15)' : 'none',
                    }}
                    className="grid w-full grid-cols-[44px_1fr_auto] items-center gap-4 border p-4 text-left transition-all sm:p-5"
                  >
                    <span
                      style={{
                        backgroundColor: active ? '#15BCDF' : '#DCDAD7',
                        color: active ? '#1A1C1E' : '#6B6F72',
                      }}
                      className="grid h-11 w-11 place-items-center font-bold"
                    >
                      <Icon size={20} strokeWidth={2} />
                    </span>
                    <span>
                      <span className="block text-sm font-bold uppercase tracking-wider text-[#2B3033]">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-xs text-[#6B6F72]">
                        {item.account} · {item.description}
                      </span>
                    </span>
                    <span
                      style={{
                        borderColor: active ? '#15BCDF' : '#6B6F72',
                      }}
                      className="h-4 w-4 rounded-full border p-[2px]"
                    >
                      {active && <span className="block h-full w-full rounded-full bg-[#15BCDF]" />}
                    </span>
                  </button>
                )
              })}
            </div>

            {message && (
              <p
                role={status === 'error' ? 'alert' : 'status'}
                className={`mt-4 text-xs font-bold uppercase tracking-wider ${
                  status === 'error' ? 'text-red-500' : 'text-emerald-600'
                }`}
              >
                {message}
              </p>
            )}

            <div className="mt-8">
              <button
                onClick={enter}
                disabled={status === 'loading'}
                onMouseEnter={() => setBtnHovered(true)}
                onMouseLeave={() => setBtnHovered(false)}
                style={{
                  backgroundColor: btnHovered ? '#3fd0ef' : '#15BCDF',
                  border: '1px solid #0fa3c2',
                  color: '#1a1c1e',
                  clipPath:
                    'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
                  boxShadow: btnHovered
                    ? '0 0 0 1px rgba(63,208,239,0.5), 0 10px 25px -8px rgba(63,208,239,0.7)'
                    : '0 0 0 1px rgba(21,188,223,0.35), 0 8px 20px -8px rgba(15,163,194,0.5)',
                }}
                className="inline-flex min-h-12 w-full items-center justify-center gap-3 px-6 py-3.5 text-sm font-bold uppercase tracking-[0.14em] transition-all disabled:opacity-50"
              >
                {status === 'loading' && <LoaderCircle className="animate-spin" size={17} strokeWidth={2} />}
                ENTER {roles.find((item) => item.role === selected)?.title}
                <span className="h-px w-5 bg-[#1A1C1E]" />
              </button>
            </div>
            <p className="mt-4 text-center text-[11px] leading-5 text-[#6B6F72]">
              The app attempts live backend API first and automatically preserves work in local demo mode if unavailable.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
