import { motion } from 'framer-motion'
import { AlertTriangle, Check, LoaderCircle, RefreshCw, type LucideIcon } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { ComplaintStatus, Priority } from '../types'

const statusLabels: Record<ComplaintStatus, string> = {
  submitted: 'Submitted', analyzing: 'AI review', verified: 'Verified', assigned: 'Assigned', in_progress: 'In progress',
  resolution_submitted: 'Resolution submitted', verification_pending: 'Verification pending', resolved: 'Resolved',
  verification_failed: 'Verification failed', sla_breached: 'SLA breached', rejected: 'Closed',
}
const statusClasses: Record<ComplaintStatus, string> = {
  submitted: 'border-civic-muted/40 text-civic-muted bg-civic-muted/5', analyzing: 'border-civic-accent/45 text-blue-300 bg-civic-accent/10', verified: 'border-civic-accent/45 text-blue-300 bg-civic-accent/10',
  assigned: 'border-civic-warning/45 text-amber-300 bg-civic-warning/10', in_progress: 'border-civic-warning/45 text-amber-300 bg-civic-warning/10',
  resolution_submitted: 'border-civic-accent/45 text-blue-300 bg-civic-accent/10', verification_pending: 'border-civic-warning/45 text-amber-300 bg-civic-warning/10',
  resolved: 'border-civic-success/45 text-green-300 bg-civic-success/10', verification_failed: 'border-civic-critical/45 text-red-300 bg-civic-critical/10',
  sla_breached: 'border-civic-critical/45 text-red-300 bg-civic-critical/10', rejected: 'border-civic-critical/45 text-red-300 bg-civic-critical/10',
}
const priorityClasses: Record<Priority, string> = { critical: 'bg-civic-critical', high: 'bg-civic-warning', medium: 'bg-civic-accent', low: 'bg-civic-success' }

export function StatusBadge({ status }: { status: ComplaintStatus }) {
  return <span className={`inline-flex whitespace-nowrap rounded-sm border px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-[.1em] ${statusClasses[status]}`}>{statusLabels[status]}</span>
}

export function PriorityBadge({ priority, compact = false }: { priority: Priority; compact?: boolean }) {
  return <span className="inline-flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[.12em] text-civic-text"><span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${priorityClasses[priority]}`} />{compact ? priority.slice(0, 1) : priority}</span>
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  loading?: boolean
  icon?: LucideIcon
}
export function Button({ variant = 'primary', loading, icon: Icon, children, className = '', disabled, ...props }: ButtonProps) {
  const styles = {
    primary: 'border-civic-accent bg-civic-accent text-white hover:bg-blue-700', secondary: 'border-civic-border bg-civic-secondary text-civic-text hover:border-civic-muted/60',
    danger: 'border-civic-critical bg-civic-critical text-white hover:bg-red-700', ghost: 'border-transparent bg-transparent text-civic-muted hover:bg-civic-secondary hover:text-civic-text',
  }
  return <button className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition-colors active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-45 ${styles[variant]} ${className}`} disabled={disabled || loading} {...props}>
    {loading ? <LoaderCircle aria-hidden="true" className="animate-spin" size={16} strokeWidth={1.6} /> : Icon ? <Icon aria-hidden="true" size={16} strokeWidth={1.6} /> : null}{children}
  </button>
}

export function IconButton({ label, icon: Icon, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; icon: LucideIcon }) {
  return <button aria-label={label} title={label} className={`inline-flex h-10 w-10 items-center justify-center rounded-md border border-civic-border bg-civic-secondary text-civic-muted transition-colors active:scale-[.94] hover:text-civic-text ${className}`} {...props}><Icon size={18} strokeWidth={1.6} /></button>
}

export function SectionHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="flex flex-col gap-4 border-b border-civic-border pb-5 sm:flex-row sm:items-end sm:justify-between"><div>{eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}<h1 className="text-2xl font-semibold tracking-tight text-civic-text sm:text-3xl">{title}</h1>{description && <p className="mt-2 max-w-2xl text-sm leading-6 text-civic-muted">{description}</p>}</div>{action}</div>
}

export function AsyncBanner({ state, error, success }: { state: 'idle' | 'loading' | 'success' | 'error'; error?: string; success?: string }) {
  if (state === 'idle') return null
  const config = state === 'loading' ? { Icon: LoaderCircle, text: 'Working securely…', cls: 'border-civic-accent/40 text-blue-200', spin: true } : state === 'success' ? { Icon: Check, text: success || 'Update completed.', cls: 'border-civic-success/40 text-green-200', spin: false } : { Icon: AlertTriangle, text: error || 'The action could not be completed.', cls: 'border-civic-critical/40 text-red-200', spin: false }
  return <div role={state === 'error' ? 'alert' : 'status'} className={`flex items-center gap-2 border-l-2 bg-civic-secondary px-3 py-2.5 text-sm ${config.cls}`}><config.Icon className={config.spin ? 'animate-spin' : ''} size={16} strokeWidth={1.6} /><span>{config.text}</span></div>
}

export function Skeleton({ className = '' }: { className?: string }) { return <div className={`animate-pulse bg-civic-secondary ${className}`} /> }

export function EmptyState({ icon: Icon = AlertTriangle, title, description, action }: { icon?: LucideIcon; title: string; description: string; action?: ReactNode }) {
  return <div className="flex min-h-52 flex-col items-center justify-center border border-dashed border-civic-border px-6 py-10 text-center"><Icon className="mb-4 text-civic-muted" size={28} strokeWidth={1.6} /><h2 className="font-semibold text-civic-text">{title}</h2><p className="mt-2 max-w-md text-sm leading-6 text-civic-muted">{description}</p>{action && <div className="mt-5">{action}</div>}</div>
}

export function Retry({ onClick }: { onClick: () => void }) { return <Button variant="secondary" icon={RefreshCw} onClick={onClick}>Try again</Button> }

export function Metric({ label, value, detail, tone = 'default' }: { label: string; value: ReactNode; detail: string; tone?: 'default' | 'critical' | 'success' }) {
  return <div className="min-w-0 border-t border-civic-border pt-4"><p className="eyebrow">{label}</p><div className={`data mt-3 text-3xl font-medium ${tone === 'critical' ? 'text-red-300' : tone === 'success' ? 'text-green-300' : 'text-civic-text'}`}>{value}</div><p className="mt-2 truncate text-xs text-civic-muted">{detail}</p></div>
}
