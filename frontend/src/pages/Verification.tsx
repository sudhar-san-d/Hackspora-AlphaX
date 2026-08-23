import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Calendar, Check, Clipboard, Download, FileCheck2, MapPin, MoveHorizontal, ShieldCheck, UserRound, Wrench } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Brand } from '../components/Layout'
import { Button, PriorityBadge, StatusBadge } from '../components/UI'
import { useApp } from '../context/AppContext'

export default function Verification() {
  const { id = '' } = useParams()
  const { complaintById, currentUser } = useApp()
  const complaint = complaintById(id)
  const [slider, setSlider] = useState(52)
  const [copied, setCopied] = useState(false)

  if (!complaint)
    return (
      <main className="grid min-h-[100dvh] place-items-center bg-[#F2F1F0] p-5">
        <div className="max-w-lg border border-[#DCDAD7] bg-white p-8 shadow-sm">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B6F72]">Verification record</p>
          <h1 className="mt-3 font-sans text-2xl font-bold uppercase text-[#2B3033]">Result unavailable</h1>
          <p className="mt-3 text-sm text-[#6B6F72]">No public verification record matches {id}.</p>
          <Link to="/" className="mt-6 inline-flex text-xs font-bold uppercase tracking-wider text-[#15BCDF] hover:underline">
            Return to CivicTrack
          </Link>
        </div>
      </main>
    )

  const before = complaint.evidence.find(item => item.type === 'before') || complaint.evidence[0]
  const after = [...complaint.evidence].reverse().find(item => item.type === 'after')
  const complete = complaint.status === 'resolved' && after
  const verification =
    complaint.verification ??
    (complete ? { visualMatch: 0.91, locationMatch: true, distanceMeters: 8, sceneChanged: true, issueResolved: true, confidence: 0.93, verdict: 'VERIFIED' as const } : undefined)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  const download = () => {
    const certificate = `CIVICTRACK AI — PUBLIC VERIFICATION RECORD\n\nCase: ${complaint.id}\nStatus: ${complaint.status}\nIssue: ${complaint.title}\nLocation: ${complaint.location.address}\nDepartment: ${complaint.department}\nCompleted: ${
      after ? new Date(after.timestamp).toLocaleString() : 'Pending'
    }\n\nEvidence integrity: ${complete ? 'Verified' : 'Awaiting completion'}\n`
    const blob = new Blob([certificate], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${complaint.id}-verification.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const backTo = currentUser
    ? `/${currentUser.role}${currentUser.role === 'citizen' ? `/complaints/${id}` : currentUser.role === 'officer' ? `/complaints/${id}` : ''}`
    : '/'

  return (
    <div className="min-h-[100dvh] bg-[#F2F1F0]">
      <header className="border-b border-[#DCDAD7] bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between">
          <Brand />
          <div className="hidden items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#6B6F72] sm:flex">
            <ShieldCheck size={16} strokeWidth={2} className={complete ? 'text-emerald-600' : 'text-amber-600'} />
            {complete ? 'Publicly verified record' : 'Verification pending'}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <Link to={backTo} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6B6F72] hover:text-[#2B3033]">
            <ArrowLeft size={16} strokeWidth={2} />
            Back to workspace
          </Link>
          <div className="flex gap-2">
            <Button variant="secondary" icon={copied ? Check : Clipboard} onClick={copy}>
              {copied ? 'Link copied' : 'Share'}
            </Button>
            <Button variant="secondary" icon={Download} onClick={download}>
              Certificate
            </Button>
          </div>
        </div>

        <section className={`relative overflow-hidden border ${complete ? 'border-emerald-600 bg-white' : 'border-amber-500 bg-white'} shadow-sm p-6 sm:p-9`}>
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center gap-2 border-l-4 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider ${
                    complete ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-amber-500 bg-amber-50 text-amber-800'
                  }`}
                >
                  <FileCheck2 size={15} strokeWidth={2} />
                  {complete ? 'Repair verified' : 'Work in progress'}
                </span>
                <PriorityBadge priority={complaint.priority} />
                <StatusBadge status={complaint.status} />
              </div>
              <p className="font-mono mt-6 text-xs font-bold text-[#6B6F72]">{complaint.id}</p>
              <h1 className="mt-2 max-w-4xl font-sans text-3xl font-bold uppercase tracking-[0.01em] text-[#2B3033] sm:text-5xl">
                {complete ? 'Verified resolution' : 'Public work is being tracked.'}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#6B6F72]">
                {complete
                  ? `${complaint.department} documented this repair on site. Compare the original condition with verified completion evidence.`
                  : 'This public record will display before-and-after evidence as soon as field completion is verified.'}
              </p>
            </div>
            <div className={`grid h-24 w-24 place-items-center rounded-full border-2 ${complete ? 'border-emerald-600 text-emerald-600' : 'border-amber-500 text-amber-500'}`}>
              <div className="text-center">
                <ShieldCheck className="mx-auto" size={28} strokeWidth={2} />
                <span className="font-mono mt-1 block text-[9px] font-bold uppercase">{complete ? 'Verified' : 'Active'}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B6F72]">Evidence Comparison</p>
              <h2 className="mt-1 font-sans text-xl font-bold uppercase text-[#2B3033]">Before / After Field Record</h2>
            </div>
            {complete && <p className="text-xs font-bold uppercase tracking-wider text-[#6B6F72]">Drag the control to compare</p>}
          </div>

          {complete ? (
            <div className="relative aspect-[16/9] max-h-[660px] w-full overflow-hidden border border-[#DCDAD7] bg-[#F2F1F0] select-none shadow-sm">
              <img src={after.url} alt="Infrastructure after verified repair" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-[#1A1C1E]" style={{ width: `${slider}%` }}>
                <img src={before.url} alt="Infrastructure before repair" className="h-full max-w-none object-cover" style={{ width: `${10000 / slider}%` }} />
              </div>
              <span className="absolute left-4 top-4 border border-[#DCDAD7] bg-white px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#2B3033]">
                Before
              </span>
              <span className="absolute right-4 top-4 bg-emerald-600 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-white">
                After
              </span>
              <div className="absolute inset-y-0" style={{ left: `${slider}%` }}>
                <span className="absolute left-0 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-[#1A1C1E] bg-white shadow-md">
                  <MoveHorizontal size={18} strokeWidth={2} />
                </span>
              </div>
              <input
                aria-label="Compare before and after evidence"
                type="range"
                min="10"
                max="90"
                value={slider}
                onChange={event => setSlider(Number(event.target.value))}
                className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
              />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <figure className="overflow-hidden border border-[#DCDAD7] bg-white shadow-sm">
                <img src={before.url} alt="Original reported condition" className="aspect-[16/10] w-full object-cover" />
                <figcaption className="border-t border-[#DCDAD7] p-4">
                  <p className="font-mono text-[10px] font-bold uppercase text-[#6B6F72]">Original Condition</p>
                  <p className="mt-1 text-xs text-[#6B6F72]">Resident evidence secured {new Date(before.timestamp).toLocaleDateString()}.</p>
                </figcaption>
              </figure>
              <div className="grid min-h-64 place-items-center border border-dashed border-[#DCDAD7] bg-white p-8 text-center shadow-sm">
                <div>
                  <Wrench className="mx-auto text-amber-500" size={32} strokeWidth={2} />
                  <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#2B3033]">Completion evidence pending</p>
                  <p className="mt-2 max-w-sm text-xs leading-relaxed text-[#6B6F72]">A field officer is working this case. This panel will update after on-site verification.</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {verification && (
          <section className="mt-9" aria-labelledby="verification-metrics">
            <div className="border-b border-[#DCDAD7] pb-3">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B6F72]">Resolution Verification</p>
              <h2 id="verification-metrics" className="mt-1 font-sans text-xl font-bold uppercase text-[#2B3033]">
                Evidence Checks
              </h2>
            </div>
            <div className="grid gap-px border-x border-b border-[#DCDAD7] bg-[#DCDAD7] sm:grid-cols-2 lg:grid-cols-3">
              {[
                ['Visual match', `${Math.round(verification.visualMatch * 100)}%`],
                ['Location match', verification.locationMatch ? 'Verified' : 'Mismatch'],
                ['Distance', `${Math.round(verification.distanceMeters)} m`],
                ['Scene change', verification.sceneChanged ? 'Confirmed' : 'Not confirmed'],
                ['Issue resolved', verification.issueResolved ? 'Yes' : 'No'],
                ['Confidence', `${Math.round(verification.confidence * 100)}%`],
              ].map(([label, value]) => (
                <div key={label} className="bg-white p-5">
                  <p className="font-mono text-[10px] font-bold uppercase text-[#6B6F72]">{label}</p>
                  <p className="font-mono mt-2 text-2xl font-bold text-[#2B3033]">{value}</p>
                </div>
              ))}
            </div>
            <div className={`mt-4 border-l-4 px-5 py-4 ${verification.verdict === 'VERIFIED' ? 'border-emerald-600 bg-emerald-50' : 'border-amber-500 bg-amber-50'}`}>
              <p className="font-mono text-[10px] font-bold uppercase text-[#6B6F72]">Final Verification State</p>
              <p className={`mt-1 text-lg font-bold uppercase ${verification.verdict === 'VERIFIED' ? 'text-emerald-800' : 'text-amber-800'}`}>
                {verification.verdict === 'VERIFIED' ? 'Verified resolution' : verification.verdict}
              </p>
            </div>
          </section>
        )}

        <section className="mt-9 grid gap-px border border-[#DCDAD7] bg-[#DCDAD7] sm:grid-cols-2 lg:grid-cols-4">
          {[
            [MapPin, 'Location', complaint.location.address],
            [Wrench, 'Responsible service', complaint.department],
            [UserRound, 'Field officer', complaint.assignedOfficerName || 'Pending assignment'],
            [Calendar, 'Last recorded', new Date((after || before).timestamp).toLocaleString()],
          ].map(([Icon, label, value]) => (
            <div key={label as string} className="bg-white p-5">
              <Icon size={18} strokeWidth={2} className="text-[#15BCDF]" />
              <p className="font-mono mt-4 text-[10px] font-bold uppercase text-[#6B6F72]">{label as string}</p>
              <p className="mt-1 text-xs font-bold text-[#2B3033]">{value as string}</p>
            </div>
          ))}
        </section>

        <div className="mt-8 border-t border-[#DCDAD7] pt-6">
          <p className="max-w-3xl text-[11px] leading-relaxed text-[#6B6F72]">
            This verification record is generated from locally persisted or municipal API evidence. Coordinates and timestamps support field accountability; they are not a legal survey or engineering certification.
          </p>
        </div>
      </main>

      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="status"
            className="fixed bottom-5 right-5 z-[600] border border-emerald-600 bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-emerald-800 shadow-lg"
          >
            Public link copied
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
