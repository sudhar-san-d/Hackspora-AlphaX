import { AlertTriangle, Check, LoaderCircle, RefreshCw, type LucideIcon } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { ComplaintStatus, Priority } from '../types'

const statusLabels: Record<ComplaintStatus, string> = {
  submitted: 'Submitted', analyzing: 'AI review', verified: 'Verified', assigned: 'Assigned', in_progress: 'In progress',
  resolution_submitted: 'Resolution submitted', verification_pending: 'Verification pending', resolved: 'Resolved',
  verification_failed: 'Verification failed', sla_breached: 'SLA breached', rejected: 'Closed',
}

const statusClasses: Record<ComplaintStatus, string> = {
  submitted: 'border-[#DCDAD7] text-[#6B6F72] bg-[#E8E7E5]',
  analyzing: 'border-[#0fa3c2] text-[#0fa3c2] bg-[#15BCDF]/10',
  verified: 'border-[#0fa3c2] text-[#0fa3c2] bg-[#15BCDF]/10',
  assigned: 'border-amber-500/50 text-amber-700 bg-amber-500/10',
  in_progress: 'border-amber-500/50 text-amber-700 bg-amber-500/10',
  resolution_submitted: 'border-[#0fa3c2] text-[#0fa3c2] bg-[#15BCDF]/10',
  verification_pending: 'border-amber-500/50 text-amber-700 bg-amber-500/10',
  resolved: 'border-emerald-500/50 text-emerald-700 bg-emerald-500/10',
  verification_failed: 'border-rose-500/50 text-rose-700 bg-rose-500/10',
  sla_breached: 'border-rose-500/50 text-rose-700 bg-rose-500/10',
  rejected: 'border-rose-500/50 text-rose-700 bg-rose-500/10',
}

const priorityClasses: Record<Priority, string> = {
  critical: 'bg-rose-500',
  high: 'bg-amber-500',
  medium: 'bg-[#15BCDF]',
  low: 'bg-emerald-500',
}

export function StatusBadge({ status }: { status: ComplaintStatus }) {
  return (
    <span className={`inline-flex whitespace-nowrap border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[.12em] ${statusClasses[status]}`}>
      {statusLabels[status]}
    </span>
  )
}

export function PriorityBadge({ priority, compact = false }: { priority: Priority; compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[.14em] text-[#2B3033]">
      <span aria-hidden="true" className={`h-2 w-2 rounded-full ${priorityClasses[priority]}`} />
      {compact ? priority.slice(0, 1) : priority}
    </span>
  )
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  loading?: boolean
  icon?: LucideIcon
}

export function Button({ variant = 'primary', loading, icon: Icon, children, className = '', disabled, ...props }: ButtonProps) {
  const styles = {
    primary: 'border-[#0fa3c2] bg-[#15BCDF] text-[#1A1C1E] hover:bg-[#3fd0ef] hover:shadow-md',
    secondary: 'border-[#DCDAD7] bg-white text-[#2B3033] hover:border-[#15BCDF] hover:bg-[#E8E7E5]',
    danger: 'border-rose-600 bg-rose-600 text-white hover:bg-rose-700',
    ghost: 'border-transparent bg-transparent text-[#6B6F72] hover:bg-[#E8E7E5] hover:text-[#2B3033]',
  }
  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 border px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition-all active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-45 ${styles[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <LoaderCircle aria-hidden="true" className="animate-spin" size={16} strokeWidth={2} /> : Icon ? <Icon aria-hidden="true" size={16} strokeWidth={2} /> : null}
      {children}
    </button>
  )
}

export function IconButton({ label, icon: Icon, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; icon: LucideIcon }) {
  return (
    <button
      aria-label={label}
      title={label}
      className={`inline-flex h-10 w-10 items-center justify-center border border-[#DCDAD7] bg-white text-[#6B6F72] transition-colors active:scale-[.94] hover:border-[#15BCDF] hover:text-[#2B3033] ${className}`}
      {...props}
    >
      <Icon size={18} strokeWidth={2} />
    </button>
  )
}

export function SectionHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 border-b border-[#DCDAD7] pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B6F72] mb-2">{eyebrow}</p>}
        <h1 className="font-sans text-2xl font-bold uppercase tracking-[0.01em] text-[#2B3033] sm:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B6F72]">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function AsyncBanner({ state, error, success }: { state: 'idle' | 'loading' | 'success' | 'error'; error?: string; success?: string }) {
  if (state === 'idle') return null
  const config =
    state === 'loading'
      ? { Icon: LoaderCircle, text: 'Working securely…', cls: 'border-[#15BCDF] text-[#15BCDF] bg-[#15BCDF]/10', spin: true }
      : state === 'success'
      ? { Icon: Check, text: success || 'Update completed.', cls: 'border-emerald-500 text-emerald-700 bg-emerald-50', spin: false }
      : { Icon: AlertTriangle, text: error || 'The action could not be completed.', cls: 'border-rose-500 text-rose-700 bg-rose-50', spin: false }
  return (
    <div role={state === 'error' ? 'alert' : 'status'} className={`flex items-center gap-2 border-l-3 px-4 py-3 text-xs font-bold uppercase tracking-wider ${config.cls}`}>
      <config.Icon className={config.spin ? 'animate-spin' : ''} size={16} strokeWidth={2} />
      <span>{config.text}</span>
    </div>
  )
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-[#E8E7E5] ${className}`} />
}

export function EmptyState({ icon: Icon = AlertTriangle, title, description, action }: { icon?: LucideIcon; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center border border-dashed border-[#DCDAD7] bg-white px-6 py-10 text-center">
      <Icon className="mb-4 text-[#6B6F72]" size={28} strokeWidth={2} />
      <h2 className="text-base font-bold uppercase tracking-wider text-[#2B3033]">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-[#6B6F72]">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function Retry({ onClick }: { onClick: () => void }) {
  return <Button variant="secondary" icon={RefreshCw} onClick={onClick}>Try again</Button>
}

export function Metric({ label, value, detail, tone = 'default' }: { label: string; value: ReactNode; detail: string; tone?: 'default' | 'critical' | 'success' }) {
  return (
    <div className="min-w-0 border-t border-[#DCDAD7] pt-4">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B6F72]">{label}</p>
      <div className={`mt-2 font-mono text-3xl font-bold ${tone === 'critical' ? 'text-rose-600' : tone === 'success' ? 'text-emerald-600' : 'text-[#2B3033]'}`}>
        {value}
      </div>
      <p className="mt-1 truncate text-xs text-[#6B6F72]">{detail}</p>
    </div>
  )
}
