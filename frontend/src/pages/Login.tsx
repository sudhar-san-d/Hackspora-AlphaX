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
  const navigate = useNavigate()
  useEffect(() => { if (currentUser) navigate(`/${currentUser.role}`, { replace: true }) }, [currentUser, navigate])
  const enter = async () => {
    setStatus('loading'); setMessage('')
    try { const result = await login(selected); setMessage(result.source === 'demo' ? 'Demo workspace ready.' : 'Municipal API connected.'); navigate(`/${selected}`) }
    catch { setStatus('error'); setMessage('Unable to prepare this workspace. Please try again.') }
  }
  return <main className="relative min-h-[100dvh] overflow-hidden bg-civic-bg"><div className="pointer-events-none absolute inset-0 grid-signature opacity-[.12]"/><div className="relative mx-auto grid min-h-[100dvh] max-w-[1280px] lg:grid-cols-[.72fr_1.28fr]">
    <section className="flex flex-col border-civic-border px-5 py-7 sm:px-10 lg:border-r lg:px-12 lg:py-10"><Brand /><div className="my-auto py-16"><p className="eyebrow">Secure demonstration access</p><h1 className="mt-4 max-w-md text-4xl font-semibold tracking-[-.035em] sm:text-5xl">Choose the public service view you need.</h1><p className="mt-6 max-w-md text-sm leading-7 text-civic-muted">Each account opens a complete role-based workflow. Progress is preserved on this device, even when the API is offline.</p><div className="mt-10 hidden space-y-4 lg:block">{['No password or personal data required','Twenty realistic municipal cases','Full CT-1001 repair workflow'].map(item => <div className="flex items-center gap-3 text-sm text-civic-muted" key={item}><span className="grid h-6 w-6 place-items-center border border-civic-success/40 bg-civic-success/10"><Check size={13} strokeWidth={1.6} className="text-green-300"/></span>{item}</div>)}</div></div><Link to="/" className="inline-flex items-center gap-2 text-xs text-civic-muted hover:text-civic-text"><ArrowLeft size={14} strokeWidth={1.6}/>Return to public site</Link></section>
    <section className="flex items-center px-5 py-12 sm:px-10 lg:px-16"><div className="w-full max-w-2xl"><div className="mb-6 flex items-end justify-between"><div><p className="eyebrow">Demo accounts</p><h2 className="mt-2 text-2xl font-semibold">Select a role</h2></div><span className="data text-[10px] text-civic-muted">AUTH / DEMO</span></div><div className="space-y-3" role="radiogroup" aria-label="Demo roles">{roles.map(item => { const Icon = item.icon; const active = selected === item.role; return <button type="button" role="radio" aria-checked={active} key={item.role} onClick={() => setSelected(item.role)} className={`grid w-full grid-cols-[44px_1fr_auto] items-center gap-4 border p-4 text-left transition-colors sm:p-5 ${active ? 'border-civic-accent bg-civic-secondary' : 'border-civic-border bg-civic-surface hover:border-civic-muted/60'}`}><span className={`grid h-11 w-11 place-items-center ${active ? 'bg-civic-accent text-white' : 'bg-civic-secondary text-civic-muted'}`}><Icon size={20} strokeWidth={1.6}/></span><span><span className="block text-sm font-semibold text-civic-text">{item.title}</span><span className="mt-1 block text-xs text-civic-muted">{item.account} · {item.description}</span></span><span className={`h-4 w-4 rounded-full border p-[3px] ${active ? 'border-civic-accent' : 'border-civic-muted'}`}>{active && <span className="block h-full w-full rounded-full bg-civic-accent"/>}</span></button> })}</div>{message && <p role={status === 'error' ? 'alert' : 'status'} className={`mt-4 text-xs ${status === 'error' ? 'text-red-300' : 'text-green-300'}`}>{message}</p>}<button onClick={enter} disabled={status === 'loading'} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-civic-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50">{status === 'loading' && <LoaderCircle className="animate-spin" size={17} strokeWidth={1.6}/>}Enter {roles.find(item => item.role === selected)?.title}</button><p className="mt-4 text-center text-[11px] leading-5 text-civic-muted">The app attempts <span className="data">VITE_API_BASE_URL</span> first and automatically preserves work in local demo mode if unavailable.</p></div></section>
  </div></main>
}
