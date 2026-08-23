import { AnimatePresence, motion } from 'framer-motion'
import { Bell, Building2, ChevronRight, ClipboardList, FilePlus2, Home, LogOut, Menu, ShieldCheck, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import type { Role } from '../types'
import { IconButton } from './UI'

const navByRole: Record<Role, Array<{ to: string; label: string; icon: typeof Home }>> = {
  citizen: [{ to: '/citizen', label: 'My reports', icon: Home }, { to: '/citizen#new-report', label: 'New report', icon: FilePlus2 }, { to: '/notifications', label: 'Notifications', icon: Bell }],
  officer: [{ to: '/officer', label: 'Work queue', icon: ClipboardList }, { to: '/notifications', label: 'Notifications', icon: Bell }],
  admin: [{ to: '/admin', label: 'Command center', icon: Building2 }, { to: '/notifications', label: 'Notifications', icon: Bell }],
}

export function Brand({ compact = false }: { compact?: boolean }) {
  return <Link to="/" className="inline-flex items-center gap-3" aria-label="CivicTrack AI home"><span className="grid h-9 w-9 place-items-center border border-civic-border bg-civic-secondary"><span className="relative h-4 w-4 border border-civic-muted"><span className="absolute -right-1 -top-1 h-2 w-2 bg-civic-accent" /></span></span>{!compact && <span><span className="block text-sm font-semibold tracking-tight text-civic-text">CivicTrack AI</span><span className="block font-mono text-[9px] uppercase tracking-[.17em] text-civic-muted">Public works network</span></span>}</Link>
}

export function AppLayout({ children }: { children: ReactNode }) {
  const { currentUser, notifications, logout, demoMode } = useApp()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  if (!currentUser) return <>{children}</>
  const nav = navByRole[currentUser.role]
  const unread = notifications.filter(item => !item.read && (item.userId === currentUser.id || currentUser.role === 'admin')).length
  const roleHome = `/${currentUser.role}`

  const links = <>{nav.map(item => {
    const Icon = item.icon
    const base = item.to.split('#')[0]
    return <NavLink key={item.to} onClick={() => setMobileOpen(false)} to={item.to} className={({ isActive }) => `group flex items-center justify-between border-l-2 px-4 py-3 text-sm transition-colors ${isActive && location.pathname === base ? 'border-civic-accent bg-civic-secondary text-civic-text' : 'border-transparent text-civic-muted hover:bg-civic-secondary/60 hover:text-civic-text'}`}><span className="flex items-center gap-3"><Icon size={17} strokeWidth={1.6} />{item.label}</span>{item.label === 'Notifications' && unread > 0 ? <span className="data rounded-sm bg-civic-accent px-1.5 py-0.5 text-[10px] text-white">{unread}</span> : <ChevronRight className="opacity-0 transition-opacity group-hover:opacity-100" size={14} strokeWidth={1.6} />}</NavLink>
  })}</>

  return <div className="min-h-[100dvh] bg-civic-bg">
    <header className="sticky top-0 z-[500] flex h-16 items-center justify-between border-b border-civic-border bg-civic-bg px-4 lg:hidden"><Brand /><IconButton icon={mobileOpen ? X : Menu} label={mobileOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMobileOpen(value => !value)} /></header>
    <AnimatePresence>{mobileOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[450] bg-civic-bg/80 lg:hidden" onClick={() => setMobileOpen(false)}><motion.nav initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', stiffness: 220, damping: 28 }} aria-label="Mobile navigation" className="mt-16 h-[calc(100dvh-4rem)] w-[min(86vw,320px)] border-r border-civic-border bg-civic-surface py-5" onClick={event => event.stopPropagation()}>{links}</motion.nav></motion.div>}</AnimatePresence>
    <aside className="fixed inset-y-0 left-0 z-[400] hidden w-64 border-r border-civic-border bg-civic-surface lg:flex lg:flex-col">
      <div className="flex h-20 items-center border-b border-civic-border px-5"><Brand /></div>
      <nav aria-label="Primary navigation" className="flex-1 py-6">{links}</nav>
      <div className="border-t border-civic-border p-4">
        {currentUser.role !== 'citizen' && <div className="mb-3 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[.15em] text-civic-muted"><span className={`h-1.5 w-1.5 rounded-full ${demoMode ? 'bg-civic-warning' : 'bg-civic-success'}`} />{demoMode ? 'Demo data active' : 'Live API connected'}</div>}
        <div className="mb-3 min-w-0"><p className="truncate text-sm font-medium text-civic-text">{currentUser.name}</p><p className="truncate text-xs text-civic-muted">{currentUser.email}</p></div>
        <button onClick={logout} className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs text-civic-muted transition-colors hover:bg-civic-secondary hover:text-civic-text"><LogOut size={15} strokeWidth={1.6} />Sign out</button>
      </div>
    </aside>
    <main className="min-h-[100dvh] lg:pl-64"><div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">{children}</div></main>
  </div>
}

export function PublicHeader() {
  return <header className="absolute inset-x-0 top-0 z-20 border-b border-civic-border/70 bg-civic-bg/95"><div className="shell flex h-20 items-center justify-between"><Brand /><nav className="flex items-center gap-2" aria-label="Public"><Link className="hidden rounded-md px-3 py-2 text-sm text-civic-muted hover:text-civic-text sm:block" to="/#how-it-works">How it works</Link><Link className="rounded-md border border-civic-border bg-civic-secondary px-4 py-2 text-sm font-semibold text-civic-text transition-colors hover:border-civic-muted" to="/login"><ShieldCheck className="mr-2 inline" size={16} strokeWidth={1.6} />Demo access</Link></nav></div></header>
}
