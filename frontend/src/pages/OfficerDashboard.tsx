import { AlertTriangle, Filter, RefreshCw, Search, TimerReset, Wrench } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ComplaintTable } from '../components/ComplaintTable'
import { AsyncBanner, Button, Metric, SectionHeading } from '../components/UI'
import { useApp } from '../context/AppContext'
import type { Category, ComplaintStatus, Priority } from '../types'

export default function OfficerDashboard() {
  const { complaints, refreshComplaints, currentUser } = useApp()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ComplaintStatus | 'all'>('all')
  const [priority, setPriority] = useState<Priority | 'all'>('all')
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [asyncState, setAsyncState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const work = useMemo(
    () =>
      complaints
        .filter(item => item.status !== 'rejected' && item.status !== 'resolved')
        .filter(item => status === 'all' || item.status === status)
        .filter(item => priority === 'all' || item.priority === priority)
        .filter(item => category === 'all' || item.category === category)
        .filter(item => `${item.id} ${item.title} ${item.location.address}`.toLowerCase().includes(search.toLowerCase())),
    [complaints, status, priority, category, search]
  )

  const assigned = complaints.filter(item => item.assignedOfficerId === currentUser?.id && !['resolved', 'rejected'].includes(item.status))
  const categories = Array.from(new Set(complaints.map(item => item.category))).sort()

  const refresh = async () => {
    setAsyncState('loading')
    try {
      await refreshComplaints()
      setAsyncState('success')
      window.setTimeout(() => setAsyncState('idle'), 1600)
    } catch {
      setAsyncState('error')
    }
  }

  return (
    <div className="space-y-7">
      <SectionHeading
        eyebrow="Field Operations / Roads & Public Realm"
        title="Priority Work Queue"
        description="Safety-critical and SLA-sensitive work is automatically ordered first."
        action={
          <Button variant="secondary" icon={RefreshCw} loading={asyncState === 'loading'} onClick={refresh}>
            Refresh Queue
          </Button>
        }
      />

      <AsyncBanner state={asyncState} success="Work queue is current." error="Could not refresh from the API. Saved work remains available." />

      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Metric label="Critical Now" value={work.filter(item => item.priority === 'critical').length} detail="Immediate field triage" tone="critical" />
        <Metric label="My Active Work" value={assigned.length} detail="Accepted assignments" />
        <Metric label="Due Today" value={work.filter(item => new Date(item.dueAt).toDateString() === new Date().toDateString()).length} detail="Across all crews" />
        <Metric label="Completed / 7d" value={complaints.filter(item => item.status === 'resolved').length} detail="Evidence verified" tone="success" />
      </section>

      <section className="border border-[#DCDAD7] bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-[#DCDAD7] bg-[#F2F1F0]/50 px-5 py-3">
          <Filter size={15} strokeWidth={2} className="text-[#6B6F72]" />
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B6F72]">Queue Controls</p>
        </div>
        <div className="grid gap-3 p-5 md:grid-cols-[minmax(230px,1fr)_repeat(3,minmax(130px,.32fr))]">
          <label className="relative">
            <span className="sr-only">Search work queue</span>
            <Search className="absolute left-3.5 top-3 text-[#6B6F72]" size={16} strokeWidth={2} />
            <input
              className="w-full border border-[#DCDAD7] bg-[#F2F1F0]/40 pl-10 pr-3 py-2.5 text-xs text-[#2B3033] placeholder-[#6B6F72]/60 focus:border-[#15BCDF] focus:outline-none focus:ring-1 focus:ring-[#15BCDF]"
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search ID, issue, or location"
            />
          </label>
          <label>
            <span className="sr-only">Filter status</span>
            <select
              className="w-full border border-[#DCDAD7] bg-[#F2F1F0]/40 px-3 py-2.5 text-xs text-[#2B3033] focus:border-[#15BCDF] focus:outline-none"
              value={status}
              onChange={event => setStatus(event.target.value as ComplaintStatus | 'all')}
            >
              <option value="all">All statuses</option>
              <option value="submitted">Submitted</option>
              <option value="verified">Verified</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In progress</option>
            </select>
          </label>
          <label>
            <span className="sr-only">Filter priority</span>
            <select
              className="w-full border border-[#DCDAD7] bg-[#F2F1F0]/40 px-3 py-2.5 text-xs text-[#2B3033] focus:border-[#15BCDF] focus:outline-none"
              value={priority}
              onChange={event => setPriority(event.target.value as Priority | 'all')}
            >
              <option value="all">All priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
          <label>
            <span className="sr-only">Filter category</span>
            <select
              className="w-full border border-[#DCDAD7] bg-[#F2F1F0]/40 px-3 py-2.5 text-xs text-[#2B3033] focus:border-[#15BCDF] focus:outline-none"
              value={category}
              onChange={event => setCategory(event.target.value as Category | 'all')}
            >
              <option value="all">All categories</option>
              {categories.map(item => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {work.filter(item => item.priority === 'critical').length > 0 && (
        <div className="flex items-center gap-3 border-l-4 border-rose-600 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-800">
          <AlertTriangle size={17} strokeWidth={2} className="text-rose-600" />
          <span>
            <strong>{work.filter(item => item.priority === 'critical').length} CRITICAL REPORTS</strong> NEED IMMEDIATE ACKNOWLEDGEMENT.
          </span>
        </div>
      )}

      <ComplaintTable complaints={work} routePrefix="/officer/complaints" />

      <section className="grid gap-4 border-t border-[#DCDAD7] pt-6 sm:grid-cols-2">
        <div className="flex gap-3">
          <TimerReset size={19} strokeWidth={2} className="text-amber-500" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#2B3033]">SLA Ordering</p>
            <p className="mt-1 text-xs leading-5 text-[#6B6F72]">Priority, deadline, and public-safety impact determine queue position.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Wrench size={19} strokeWidth={2} className="text-[#15BCDF]" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#2B3033]">Completion Evidence</p>
            <p className="mt-1 text-xs leading-5 text-[#6B6F72]">A current location and after photo are required to close work.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
