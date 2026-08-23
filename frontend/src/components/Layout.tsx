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
  return (
    <Link to="/" className="inline-flex items-center gap-2.5" aria-label="CivicTrack AI home">
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
      {!compact && (
        <span
          style={{
            fontFamily: "'Quantico', 'Arial Narrow', sans-serif",
            fontSize: '22px',
            fontWeight: 400,
            color: '#111111',
            letterSpacing: '-0.5px',
            textTransform: 'lowercase',
          }}
        >
          civictrack
        </span>
      )}
    </Link>
  )
}

export function AppLayout({ children }: { children: ReactNode }) {
  const { currentUser, notifications, logout, demoMode } = useApp()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  if (!currentUser) return <>{children}</>
  const nav = navByRole[currentUser.role]
  const unread = notifications.filter(item => !item.read && (item.userId === currentUser.id || currentUser.role === 'admin')).length

  const links = (
    <>
      {nav.map(item => {
        const Icon = item.icon
        const base = item.to.split('#')[0]
        const isActive = location.pathname === base
        return (
          <NavLink
            key={item.to}
            onClick={() => setMobileOpen(false)}
            to={item.to}
            style={{
              fontFamily: "'Quantico', 'Arial Narrow', sans-serif",
              borderLeftWidth: '3px',
              borderLeftColor: isActive ? '#15BCDF' : 'transparent',
              backgroundColor: isActive ? '#FFFFFF' : 'transparent',
              color: isActive ? '#111111' : '#6B6F72',
            }}
            className="group flex items-center justify-between px-5 py-3.5 text-sm font-bold uppercase tracking-wider transition-all hover:bg-white hover:text-[#111111]"
          >
            <span className="flex items-center gap-3">
              <Icon size={18} strokeWidth={2} style={{ color: isActive ? '#15BCDF' : 'currentColor' }} />
              {item.label}
            </span>
            {item.label === 'Notifications' && unread > 0 ? (
              <span className="font-mono rounded-full bg-[#15BCDF] px-2 py-0.5 text-[10px] font-bold text-[#1A1C1E]">
                {unread}
              </span>
            ) : (
              <ChevronRight className="opacity-0 transition-opacity group-hover:opacity-100" size={15} strokeWidth={2} />
            )}
          </NavLink>
        )
      })}
    </>
  )

  return (
    <div
      style={{
        margin: 0,
        backgroundColor: '#F2F1F0',
        color: '#2B3033',
        fontFamily: "'Quantico', 'Arial Narrow', sans-serif",
        minHeight: '100vh',
      }}
    >
      {/* Mobile Top Header */}
      <header className="sticky top-0 z-[500] flex h-16 items-center justify-between border-b border-[#DCDAD7] bg-[#F2F1F0]/95 px-4 backdrop-blur-sm lg:hidden">
        <Brand />
        <IconButton icon={mobileOpen ? X : Menu} label={mobileOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMobileOpen(value => !value)} />
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[450] bg-black/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.nav
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 220, damping: 28 }}
              aria-label="Mobile navigation"
              className="mt-16 h-[calc(100dvh-4rem)] w-[min(86vw,320px)] border-r border-[#DCDAD7] bg-[#F2F1F0] py-5"
              onClick={event => event.stopPropagation()}
            >
              {links}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-[400] hidden w-64 border-r border-[#DCDAD7] bg-[#F2F1F0] lg:flex lg:flex-col">
        <div className="flex h-20 items-center border-b border-[#DCDAD7] px-6">
          <Brand />
        </div>
        <nav aria-label="Primary navigation" className="flex-1 space-y-1 py-6">
          {links}
        </nav>
        <div className="border-t border-[#DCDAD7] p-5">
          {currentUser.role !== 'citizen' && (
            <div className="mb-3 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[#6B6F72]">
              <span className={`h-2 w-2 rounded-full ${demoMode ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              {demoMode ? 'Demo workspace' : 'Live API connected'}
            </div>
          )}
          <div className="mb-4 min-w-0">
            <p className="truncate text-sm font-bold uppercase tracking-wider text-[#2B3033]">{currentUser.name}</p>
            <p className="truncate text-xs text-[#6B6F72]">{currentUser.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-md border border-[#DCDAD7] bg-white px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-[#2B3033] transition-colors hover:border-[#15BCDF] hover:bg-[#15BCDF] hover:text-[#1A1C1E]"
          >
            <LogOut size={15} strokeWidth={2} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="min-h-[100dvh] lg:pl-64">
        <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}

export function PublicHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 border-b border-[#DCDAD7] bg-[#F2F1F0]/95">
      <div className="shell flex h-20 items-center justify-between">
        <Brand />
        <nav className="flex items-center gap-3" aria-label="Public">
          <Link
            className="rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-[#1A1C1E] transition-opacity hover:opacity-80"
            style={{
              backgroundColor: '#15BCDF',
              border: '1px solid #0fa3c2',
            }}
            to="/login"
          >
            <ShieldCheck className="mr-2 inline" size={15} strokeWidth={2} />
            Demo Access
          </Link>
        </nav>
      </div>
    </header>
  )
}
