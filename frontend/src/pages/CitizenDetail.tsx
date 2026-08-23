import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, CalendarClock, Check, CheckCircle2, Clipboard, Eye, GitBranch, MapPin, Navigation, ShieldCheck, Sparkles, UserRound } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CivicMap } from '../components/CivicMap'
import { Button, PriorityBadge, StatusBadge } from '../components/UI'
import { useApp } from '../context/AppContext'

export default function CitizenDetail() {
  const { id = '' } = useParams()
  const { complaintById } = useApp()
  const complaint = complaintById(id)
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  if (!complaint)
    return (
      <div className="border border-[#DCDAD7] bg-white p-8 shadow-sm">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B6F72]">Report unavailable</p>
        <h1 className="mt-3 font-sans text-2xl font-bold uppercase text-[#2B3033]">We could not find {id}</h1>
        <p className="mt-3 text-sm text-[#6B6F72]">The report may have been removed or belongs to another resident.</p>
        <Button className="mt-6" variant="secondary" icon={ArrowLeft} onClick={() => navigate('/citizen')}>
          Back to my reports
        </Button>
      </div>
    )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  const latest = complaint.timeline[complaint.timeline.length - 1]

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={() => navigate('/citizen')} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6B6F72] hover:text-[#2B3033]">
          <ArrowLeft size={16} strokeWidth={2} />
          My reports
        </button>
        <Button variant="secondary" icon={copied ? Check : Clipboard} onClick={copy}>
          {copied ? 'Tracking link copied' : 'Copy tracking link'}
        </Button>
      </div>

      <header className="grid gap-5 border-b border-[#DCDAD7] pb-7 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs font-bold text-[#6B6F72]">{complaint.id}</span>
            <PriorityBadge priority={complaint.priority} />
            <StatusBadge status={complaint.status} />
          </div>
          <h1 className="mt-4 max-w-3xl font-sans text-3xl font-bold uppercase tracking-[0.01em] text-[#2B3033] sm:text-4xl">
            {complaint.title}
          </h1>
          <p className="mt-4 flex items-start gap-2 text-sm text-[#6B6F72]">
            <MapPin className="mt-0.5 shrink-0 text-[#6B6F72]" size={16} strokeWidth={2} />
            {complaint.location.address}
          </p>
        </div>
        <div className="border-l-4 border-[#15BCDF] bg-white p-4 border border-[#DCDAD7] shadow-sm">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#6B6F72]">Latest Public Update</p>
          <p className="mt-1 text-sm font-bold text-[#2B3033]">{latest.title}</p>
          <p className="font-mono mt-1 text-[10px] text-[#6B6F72]">{new Date(latest.timestamp).toLocaleString()}</p>
        </div>
      </header>

      {complaint.status === 'resolved' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col justify-between gap-4 border border-emerald-600 bg-emerald-50 p-5 sm:flex-row sm:items-center shadow-sm"
        >
          <div className="flex gap-3">
            <CheckCircle2 className="shrink-0 text-emerald-600" size={22} strokeWidth={2} />
            <div>
              <p className="font-bold text-emerald-900 uppercase text-xs tracking-wider">Repair Complete and Field-Verified</p>
              <p className="mt-1 text-xs text-emerald-800">Before-and-after evidence is ready for public review.</p>
            </div>
          </div>
          <Link to={`/verification/${complaint.id}`} className="inline-flex min-h-10 items-center justify-center border border-emerald-700 bg-emerald-700 px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-emerald-800">
            View verified result
          </Link>
        </motion.div>
      )}

      <div className="grid gap-7 xl:grid-cols-[minmax(0,1.25fr)_minmax(340px,.75fr)]">
        <div className="space-y-7">
          <section className="overflow-hidden border border-[#DCDAD7] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[#DCDAD7] bg-[#F2F1F0]/50 px-5 py-4">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#6B6F72]">Location</p>
                <p className="mt-1 text-xs font-bold text-[#2B3033]">
                  Field Coordinates{' '}
                  <span className="font-mono ml-2 text-[10px] text-[#6B6F72]">
                    {complaint.location.lat.toFixed(4)}, {complaint.location.lng.toFixed(4)}
                  </span>
                </p>
              </div>
              <a
                href={`https://www.openstreetmap.org/?mlat=${complaint.location.lat}&mlon=${complaint.location.lng}#map=18/${complaint.location.lat}/${complaint.location.lng}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0fa3c2] hover:underline"
              >
                <Navigation size={14} strokeWidth={2} /> Open map
              </a>
            </div>
            <CivicMap complaints={[complaint]} selectedId={complaint.id} className="h-[340px] border-0" />
          </section>

          <section>
            <div className="mb-4">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B6F72]">Evidence Record</p>
              <h2 className="mt-1 font-sans text-xl font-bold uppercase text-[#2B3033]">Field Captures</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {complaint.evidence.map(item => (
                <figure key={item.id} className="overflow-hidden border border-[#DCDAD7] bg-white shadow-sm">
                  <img src={item.url} alt={`${item.type} evidence for ${complaint.id}`} className="aspect-[16/10] w-full object-cover" />
                  <figcaption className="border-t border-[#DCDAD7] p-4">
                    <div className="flex justify-between gap-3">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#2B3033]">{item.type} EVIDENCE</span>
                      <span className="font-mono text-[10px] text-[#6B6F72]">{new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-[#6B6F72]">{item.note}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-7">
          <section className="border border-[#DCDAD7] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <CalendarClock size={18} strokeWidth={2} className="text-[#15BCDF]" />
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B6F72]">Resolution Timeline</p>
            </div>
            <div className="mt-6">
              {complaint.timeline.map((item, index) => (
                <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.06 }} key={item.id} className="relative grid grid-cols-[28px_1fr] gap-3 pb-7 last:pb-0">
                  <div className="relative">
                    <span
                      className={`relative z-[1] grid h-7 w-7 place-items-center rounded-full border ${
                        index === complaint.timeline.length - 1 ? 'border-[#0fa3c2] bg-[#15BCDF] text-[#1A1C1E]' : 'border-emerald-600 bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      <Check size={14} strokeWidth={2.5} />
                    </span>
                    {index < complaint.timeline.length - 1 && <span className="absolute left-[13px] top-7 h-full w-px bg-[#DCDAD7]" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#2B3033]">{item.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-[#6B6F72]">{item.description}</p>
                    <div className="mt-2 flex justify-between gap-3 font-mono text-[9px] font-bold uppercase tracking-wider text-[#6B6F72]">
                      <span>{item.actor}</span>
                      <time>{new Date(item.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</time>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="border border-[#DCDAD7] bg-white shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between border-b border-[#DCDAD7] pb-3">
                <div className="flex items-center gap-2">
                  <Eye size={18} strokeWidth={2} className="text-[#15BCDF]" />
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B6F72]">Vision Analysis</p>
                </div>
                <span className="font-mono text-xs font-bold text-[#15BCDF]">{complaint.confidence}% CONFIDENCE</span>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-[#2B3033]">{complaint.aiSummary}</p>
              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-[#DCDAD7] pt-4">
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase text-[#6B6F72]">Detected Issue</p>
                  <p className="mt-1 text-xs font-bold text-[#2B3033]">{complaint.category}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase text-[#6B6F72]">Infrastructure</p>
                  <p className="mt-1 text-xs font-bold text-[#2B3033]">{complaint.category === 'Pothole' ? 'Road' : complaint.category}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase text-[#6B6F72]">Visual Severity</p>
                  <p className="font-mono mt-1 text-base font-bold text-[#2B3033]">{complaint.severityScore.toFixed(1)}/10</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase text-[#6B6F72]">Confidence</p>
                  <p className="font-mono mt-1 text-base font-bold text-[#2B3033]">{complaint.confidence}%</p>
                </div>
              </div>
            </div>

            <div className="border-t border-[#DCDAD7] bg-[#F2F1F0]/40 p-6">
              <div className="flex items-center gap-2">
                <GitBranch size={17} strokeWidth={2} className="text-amber-600" />
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B6F72]">Decision Engine</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase text-[#6B6F72]">Department</p>
                  <p className="mt-1 text-xs font-bold text-[#2B3033]">{complaint.department}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase text-[#6B6F72]">SLA Target</p>
                  <p className="font-mono mt-1 text-base font-bold text-[#2B3033]">
                    {complaint.priority === 'critical' ? 6 : complaint.priority === 'high' ? 12 : complaint.priority === 'medium' ? 48 : 120}h
                  </p>
                </div>
              </div>
              <div className="mt-5 space-y-2 border-t border-[#DCDAD7] pt-4">
                <p className="font-mono text-[10px] font-bold uppercase text-[#6B6F72]">Why This Decision</p>
                {complaint.aiReasoning.map(reason => (
                  <div key={reason} className="flex gap-2 text-xs leading-relaxed text-[#6B6F72]">
                    <Sparkles className="mt-0.5 shrink-0 text-[#15BCDF]" size={14} strokeWidth={2} />
                    {reason}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="border-l-4 border-[#DCDAD7] bg-white p-4 shadow-sm border border-[#DCDAD7]">
            <div className="flex gap-3">
              <UserRound className="shrink-0 text-[#6B6F72]" size={18} strokeWidth={2} />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#2B3033]">Assigned Service</p>
                <p className="mt-1 text-xs text-[#6B6F72]">{complaint.department}</p>
                <p className="mt-0.5 text-xs text-[#6B6F72]">{complaint.assignedOfficerName || 'Awaiting crew assignment'}</p>
              </div>
            </div>
          </section>
        </aside>
      </div>

      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="status"
            className="fixed bottom-5 right-5 z-[600] flex items-center gap-2 border border-emerald-600 bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-emerald-800 shadow-lg"
          >
            <ShieldCheck size={16} strokeWidth={2} className="text-emerald-600" />
            Tracking link copied
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
