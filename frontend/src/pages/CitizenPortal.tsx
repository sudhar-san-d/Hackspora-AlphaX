import { ChevronRight, FilePlus2, FileText, MapPin, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, EmptyState, Metric, PriorityBadge, SectionHeading, StatusBadge } from '../components/UI'
import { useApp } from '../context/AppContext'
import type { ComplaintStatus, Priority } from '../types'

export default function CitizenPortal() {
  const { currentUser, complaints } = useApp()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>('all')

  const mine = useMemo(() => complaints.filter(item => item.citizenId === currentUser?.id), [complaints, currentUser])

  const filtered = useMemo(
    () =>
      mine
        .filter(item => statusFilter === 'all' || item.status === statusFilter)
        .filter(item => `${item.id} ${item.title} ${item.location.address} ${item.category}`.toLowerCase().includes(search.toLowerCase())),
    [mine, statusFilter, search]
  )

  const open = mine.filter(item => !['resolved', 'rejected'].includes(item.status)).length

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Resident Service Portal"
        title={`Good ${new Date().getHours() < 12 ? 'morning' : 'afternoon'}, ${currentUser?.name.split(' ')[0]}`}
        description="Follow municipal work on your submitted infrastructure reports from verification through completion."
        action={
          <Button icon={FilePlus2} onClick={() => navigate('/citizen/new')} className="py-3">
            Submit New Report
          </Button>
        }
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4" aria-label="Report summary">
        <Metric label="My Reports" value={mine.length} detail="All submitted cases" />
        <Metric label="Open Cases" value={open} detail="Awaiting completion" />
        <Metric label="Resolved" value={mine.filter(item => item.status === 'resolved').length} detail="Field verified" tone="success" />
        <Metric label="Avg. Response" value="2.8h" detail="Current service period" />
      </section>

      {/* Reports List Section */}
      <section className="border border-[#DCDAD7] bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-[#DCDAD7] bg-[#F2F1F0]/50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B6F72]">My Activity</p>
            <h2 className="mt-1 font-sans text-xl font-bold uppercase tracking-[0.01em] text-[#2B3033]">Submitted Reports</h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px]">
              <Search className="absolute left-3 top-2.5 text-[#6B6F72]" size={15} strokeWidth={2} />
              <input
                type="text"
                className="w-full border border-[#DCDAD7] bg-white pl-9 pr-3 py-2 text-xs text-[#2B3033] placeholder-[#6B6F72]/60 focus:border-[#15BCDF] focus:outline-none"
                placeholder="Search my reports..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="border border-[#DCDAD7] bg-white px-3 py-2 text-xs text-[#2B3033] focus:border-[#15BCDF] focus:outline-none"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as ComplaintStatus | 'all')}
            >
              <option value="all">All statuses</option>
              <option value="submitted">Submitted</option>
              <option value="in_progress">In progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {filtered.length ? (
          <div className="divide-y divide-[#DCDAD7]">
            {filtered.map(item => (
              <button
                key={item.id}
                onClick={() => navigate(`/citizen/complaints/${item.id}`)}
                className="group grid w-full grid-cols-[80px_1fr_auto] items-center gap-5 p-5 text-left transition-colors hover:bg-[#F2F1F0]/60"
              >
                <img src={item.imageUrl} alt="" className="h-16 w-20 border border-[#DCDAD7] object-cover" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-[#6B6F72]">{item.id}</span>
                    <PriorityBadge priority={item.priority} compact />
                  </div>
                  <span className="mt-1 block truncate text-base font-bold text-[#2B3033]">{item.title}</span>
                  <span className="mt-1 flex items-center gap-1.5 truncate text-xs text-[#6B6F72]">
                    <MapPin size={14} strokeWidth={2} className="shrink-0 text-[#6B6F72]" />
                    {item.location.address}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={item.status} />
                  <ChevronRight className="text-[#6B6F72] transition-transform group-hover:translate-x-1" size={18} strokeWidth={2} />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="No reports found"
            description={mine.length ? "No reports match your current search criteria." : "Your first infrastructure report will appear here with live municipal updates."}
            action={
              <Button icon={FilePlus2} onClick={() => navigate('/citizen/new')}>
                Submit New Report
              </Button>
            }
          />
        )}
      </section>
    </div>
  )
}
