import { ArrowLeft, MapPinned } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Brand } from '../components/Layout'

export default function NotFound() {
  return <main className="relative grid min-h-[100dvh] place-items-center overflow-hidden bg-civic-bg px-5"><div className="pointer-events-none absolute inset-0 grid-signature opacity-[.13]"/><div className="relative max-w-xl border-l border-civic-border pl-7 sm:pl-10"><Brand/><MapPinned className="mt-16 text-civic-accent" size={36} strokeWidth={1.6}/><p className="data mt-7 text-xs text-civic-muted">ERROR / 404</p><h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">This route is outside the service area.</h1><p className="mt-5 text-sm leading-6 text-civic-muted">The requested CivicTrack page does not exist or has moved to a role-specific workspace.</p><Link to="/" className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-md bg-civic-accent px-4 text-sm font-semibold text-white"><ArrowLeft size={16} strokeWidth={1.6}/>Return to CivicTrack</Link></div></main>
}
