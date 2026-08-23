import { AnimatePresence, motion } from 'framer-motion'
import { Activity, BarChart3, CheckCircle2, Download, Filter, MapPin, RefreshCw, Search, Settings2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CivicMap } from '../components/CivicMap'
import { ComplaintTable } from '../components/ComplaintTable'
import { AsyncBanner, Button, IconButton, Metric, PriorityBadge, SectionHeading, StatusBadge } from '../components/UI'
import { useApp } from '../context/AppContext'
import type { ComplaintStatus, Priority } from '../types'

const priorityColor: Record<Priority, string> = { critical: '#EF4444', high: '#F59E0B', medium: '#15BCDF', low: '#10B981' }
const tooltipStyle = { background: '#FFFFFF', border: '1px solid #DCDAD7', borderRadius: 2, color: '#2B3033', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }

export default function AdminDashboard() {
  const { complaints, demoMode, setDemoMode, resetDemo, refreshComplaints } = useApp()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ComplaintStatus | 'all'>('all')
  const [priority, setPriority] = useState<Priority | 'all'>('all')
  const [selected, setSelected] = useState<string>()
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const filtered = useMemo(
    () =>
      complaints
        .filter(item => status === 'all' || item.status === status)
        .filter(item => priority === 'all' || item.priority === priority)
        .filter(item => `${item.id} ${item.title} ${item.location.address} ${item.department}`.toLowerCase().includes(search.toLowerCase())),
    [complaints, search, status, priority]
  )

  const selectedComplaint = complaints.find(item => item.id === selected)
  const categoryData = useMemo(
    () =>
      Object.entries(complaints.reduce<Record<string, number>>((all, item) => ({ ...all, [item.category]: (all[item.category] || 0) + 1 }), {}))
        .map(([name, reports]) => ({ name, reports }))
        .sort((a, b) => b.reports - a.reports),
    [complaints]
  )

  const trendData = [
    { day: 'Aug 17', received: 7, resolved: 3 },
    { day: 'Aug 18', received: 5, resolved: 4 },
    { day: 'Aug 19', received: 9, resolved: 6 },
    { day: 'Aug 20', received: 6, resolved: 8 },
    { day: 'Aug 21', received: 11, resolved: 7 },
    { day: 'Aug 22', received: 8, resolved: 9 },
    { day: 'Aug 23', received: 12, resolved: 8 },
  ]

  const priorityData = (['critical', 'high', 'medium', 'low'] as Priority[]).map(name => ({
    name,
    value: complaints.filter(item => item.priority === name).length,
  }))

  const refresh = async () => {
    setState('loading')
    try {
      const source = await refreshComplaints()
      setState('success')
      window.setTimeout(() => setState('idle'), 1800)
      if (source === 'demo') setDemoMode(true)
    } catch {
      setState('error')
    }
  }

  const exportCsv = () => {
    const rows = [
      ['ID', 'Title', 'Category', 'Priority', 'Status', 'Address', 'Department'],
      ...filtered.map(item => [item.id, item.title, item.category, item.priority, item.status, item.location.address, item.department]),
    ]
    const csv = rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `civictrack-operations-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const clear = () => {
    setSearch('')
    setStatus('all')
    setPriority('all')
  }

  return (
    <div className="space-y-7">
      <SectionHeading
        eyebrow="Municipal Operations / Citywide"
        title="Command Center"
        description="Live infrastructure demand, field capacity, and public service performance."
        action={
          <div className="flex gap-2">
            <Button variant="secondary" icon={Download} onClick={exportCsv}>
              Export
            </Button>
            <Button variant="secondary" icon={RefreshCw} loading={state === 'loading'} onClick={refresh}>
              Refresh
            </Button>
          </div>
        }
      />

      <AsyncBanner state={state} success="Operations data is current." error="Live API refresh failed. The saved operations snapshot remains active." />

      <section className="grid grid-cols-2 gap-4 xl:grid-cols-5">
        <Metric label="Open Reports" value={complaints.filter(item => !['resolved', 'rejected'].includes(item.status)).length} detail="Across all services" />
        <Metric label="Critical" value={complaints.filter(item => item.priority === 'critical' && item.status !== 'resolved').length} detail="Immediate intervention" tone="critical" />
        <Metric label="Resolved / 7d" value={complaints.filter(item => item.status === 'resolved').length} detail="With field evidence" tone="success" />
        <Metric label="Median Response" value="4.2h" detail="Down 36 min this week" />
        <Metric label="SLA Health" value="87.4%" detail="Within service target" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,.65fr)]">
        <div className="overflow-hidden border border-[#DCDAD7] bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCDAD7] bg-[#F2F1F0]/50 px-5 py-3">
            <div className="flex items-center gap-2">
              <MapPin size={15} strokeWidth={2} className="text-[#15BCDF]" />
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B6F72]">Operational Map</p>
            </div>
            <div className="flex gap-4">
              {(['critical', 'high', 'medium', 'low'] as Priority[]).map(item => (
                <span key={item} className="hidden items-center gap-1.5 font-mono text-[9px] font-bold uppercase text-[#6B6F72] sm:flex">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: priorityColor[item] }} />
                  {item}
                </span>
              ))}
            </div>
          </div>
          <CivicMap complaints={filtered} selectedId={selected} onSelect={setSelected} routePrefix="/admin/complaints" className="h-[480px] border-0" />
        </div>

        <div className="border border-[#DCDAD7] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#DCDAD7] bg-[#F2F1F0]/50 px-5 py-3">
            <div className="flex items-center gap-2">
              <BarChart3 size={15} strokeWidth={2} className="text-[#15BCDF]" />
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B6F72]">Priority Load</p>
            </div>
            <span className="font-mono text-[10px] font-bold text-[#6B6F72]">ACTIVE / {complaints.length}</span>
          </div>
          <div className="h-[270px] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} margin={{ top: 10, right: 4, left: -25, bottom: 0 }}>
                <CartesianGrid stroke="#E8E7E5" vertical={false} />
                <XAxis dataKey="name" stroke="#6B6F72" tick={{ fill: '#6B6F72', fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} stroke="#6B6F72" tick={{ fill: '#6B6F72', fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" radius={0}>
                  {priorityData.map(entry => (
                    <Cell key={entry.name} fill={priorityColor[entry.name]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-px border-t border-[#DCDAD7] bg-[#DCDAD7]">
            {priorityData.map(item => (
              <button
                key={item.name}
                onClick={() => setPriority(priority === item.name ? 'all' : item.name)}
                className={`bg-white p-3 text-left transition-colors hover:bg-[#F2F1F0] ${priority === item.name ? 'border-l-3 border-[#15BCDF]' : ''}`}
              >
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-[#6B6F72]">{item.name}</p>
                <p className="font-mono mt-1 text-lg font-bold text-[#2B3033]">{item.value}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="border border-[#DCDAD7] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#DCDAD7] bg-[#F2F1F0]/50 px-5 py-3">
          <div className="flex items-center gap-2">
            <Filter size={15} strokeWidth={2} className="text-[#6B6F72]" />
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B6F72]">Case Matrix</p>
          </div>
          <button onClick={clear} className="text-xs font-bold uppercase tracking-wider text-[#6B6F72] hover:text-[#2B3033]">
            Clear filters
          </button>
        </div>
        <div className="grid gap-3 p-4 md:grid-cols-[1fr_180px_180px]">
          <label className="relative">
            <span className="sr-only">Search cases</span>
            <Search className="absolute left-3.5 top-3 text-[#6B6F72]" size={16} strokeWidth={2} />
            <input
              className="w-full border border-[#DCDAD7] bg-[#F2F1F0]/40 pl-10 pr-3 py-2.5 text-xs text-[#2B3033] placeholder-[#6B6F72]/60 focus:border-[#15BCDF] focus:outline-none focus:ring-1 focus:ring-[#15BCDF]"
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search ID, issue, address, or service"
            />
          </label>
          <select
            aria-label="Filter by status"
            className="w-full border border-[#DCDAD7] bg-[#F2F1F0]/40 px-3 py-2.5 text-xs text-[#2B3033] focus:border-[#15BCDF] focus:outline-none"
            value={status}
            onChange={event => setStatus(event.target.value as ComplaintStatus | 'all')}
          >
            <option value="all">All statuses</option>
            <option value="submitted">Submitted</option>
            <option value="verified">Verified</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <select
            aria-label="Filter by priority"
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
        </div>
      </section>

      <ComplaintTable complaints={filtered} routePrefix="/admin/complaints" selectedId={selected} onSelect={setSelected} />

      <section className="grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
        <div className="border border-[#DCDAD7] bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-[#DCDAD7] bg-[#F2F1F0]/50 px-5 py-3">
            <Activity size={15} strokeWidth={2} className="text-[#15BCDF]" />
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B6F72]">Seven-Day Throughput</p>
          </div>
          <div className="h-[300px] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#E8E7E5" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: '#6B6F72', fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#6B6F72', fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="received" stroke="#15BCDF" strokeWidth={2.5} dot={{ fill: '#15BCDF', r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2.5} dot={{ fill: '#10B981', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-5 border-t border-[#DCDAD7] px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B6F72]">
            <span className="flex items-center gap-2">
              <span className="h-1 w-5 bg-[#15BCDF]" />
              Received
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1 w-5 bg-emerald-500" />
              Resolved
            </span>
          </div>
        </div>

        <div className="border border-[#DCDAD7] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#DCDAD7] bg-[#F2F1F0]/50 px-5 py-3">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B6F72]">Demand by Service</p>
            <span className="font-mono text-[10px] font-bold text-[#6B6F72]">{categoryData.length} TYPES</span>
          </div>
          <div className="divide-y divide-[#DCDAD7]">
            {categoryData.map(item => (
              <div key={item.name} className="grid grid-cols-[1fr_80px_30px] items-center gap-3 px-5 py-3">
                <div>
                  <p className="text-xs font-bold text-[#2B3033]">{item.name}</p>
                  <div className="mt-2 h-1.5 bg-[#E8E7E5]">
                    <div className="h-full bg-[#15BCDF]" style={{ width: `${(item.reports / categoryData[0].reports) * 100}%` }} />
                  </div>
                </div>
                <span className="font-mono text-right text-xs text-[#6B6F72]">{Math.round((item.reports / complaints.length) * 100)}%</span>
                <span className="font-mono text-right text-xs font-bold text-[#2B3033]">{item.reports}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 border-t border-[#DCDAD7] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Settings2 size={16} strokeWidth={2} className="text-[#6B6F72]" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#2B3033]">Developer Data Source</p>
            <p className="mt-0.5 text-[11px] text-[#6B6F72]">Operational control; resident views do not expose this switch.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            role="switch"
            aria-checked={demoMode}
            onClick={() => setDemoMode(!demoMode)}
            className={`relative h-6 w-11 rounded-full border transition-colors ${demoMode ? 'border-amber-500 bg-amber-100' : 'border-emerald-500 bg-emerald-100'}`}
          >
            <span className={`absolute top-1 h-3.5 w-3.5 rounded-full bg-[#1A1C1E] transition-transform ${demoMode ? 'translate-x-1' : 'translate-x-6'}`} />
            <span className="sr-only">Toggle demo mode</span>
          </button>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#6B6F72]">{demoMode ? 'Demo AI' : 'Live AI'}</span>
          <Button variant="ghost" onClick={resetDemo}>
            Reset demo
          </Button>
        </div>
      </section>

      <AnimatePresence>
        {selectedComplaint && (
          <>
            <motion.button
              aria-label="Close complaint drawer"
              className="fixed inset-0 z-[650] bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(undefined)}
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label={`Details for ${selectedComplaint.id}`}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 230, damping: 28 }}
              className="fixed inset-y-0 right-0 z-[700] w-full max-w-lg overflow-y-auto border-l border-[#DCDAD7] bg-white shadow-xl"
            >
              <div className="sticky top-0 flex items-center justify-between border-b border-[#DCDAD7] bg-[#F2F1F0] px-6 py-4">
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#6B6F72]">Case Inspection</p>
                  <p className="font-mono mt-0.5 text-sm font-bold text-[#2B3033]">{selectedComplaint.id}</p>
                </div>
                <IconButton icon={X} label="Close drawer" onClick={() => setSelected(undefined)} />
              </div>
              <div className="p-6 sm:p-7">
                <img src={selectedComplaint.imageUrl} alt="Reported infrastructure condition" className="aspect-video w-full border border-[#DCDAD7] object-cover" />
                <div className="mt-5 flex items-center justify-between gap-3">
                  <PriorityBadge priority={selectedComplaint.priority} />
                  <StatusBadge status={selectedComplaint.status} />
                </div>
                <h2 className="mt-5 text-xl font-bold uppercase tracking-[0.01em] text-[#2B3033]">{selectedComplaint.title}</h2>
                <p className="mt-3 flex gap-2 text-xs text-[#6B6F72]">
                  <MapPin className="mt-0.5 shrink-0" size={16} strokeWidth={2} />
                  {selectedComplaint.location.address}
                </p>
                <p className="mt-5 text-sm leading-relaxed text-[#6B6F72]">{selectedComplaint.description}</p>
                <div className="mt-7 grid grid-cols-2 gap-px border border-[#DCDAD7] bg-[#DCDAD7]">
                  {[
                    ['AI confidence', `${selectedComplaint.confidence}%`],
                    ['Severity', `${selectedComplaint.severityScore.toFixed(1)}/10`],
                    ['Department', selectedComplaint.department],
                    ['Updated', new Date(selectedComplaint.updatedAt).toLocaleString()],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-[#F2F1F0] p-4">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#6B6F72]">{label}</p>
                      <p className="mt-1 text-xs font-bold text-[#2B3033]">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-7">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#6B6F72]">Recent Activity</p>
                  <div className="mt-3 divide-y divide-[#DCDAD7] border-y border-[#DCDAD7]">
                    {selectedComplaint.timeline
                      .slice(-3)
                      .reverse()
                      .map(item => (
                        <div key={item.id} className="py-3">
                          <div className="flex justify-between gap-3">
                            <p className="text-xs font-bold text-[#2B3033]">{item.title}</p>
                            <time className="font-mono text-[10px] text-[#6B6F72]">{new Date(item.timestamp).toLocaleDateString()}</time>
                          </div>
                          <p className="mt-1 text-xs leading-5 text-[#6B6F72]">{item.description}</p>
                        </div>
                      ))}
                  </div>
                </div>
                {selectedComplaint.status === 'resolved' && (
                  <Link
                    to={`/verification/${selectedComplaint.id}`}
                    className="mt-7 inline-flex min-h-11 w-full items-center justify-center gap-2 border border-emerald-600 bg-emerald-600 px-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-emerald-700"
                  >
                    <CheckCircle2 size={16} strokeWidth={2} /> Open verified result
                  </Link>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
