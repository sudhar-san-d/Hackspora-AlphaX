import { AnimatePresence, motion } from 'framer-motion'
import { Camera, Check, ChevronRight, FileText, LocateFixed, MapPin, Navigation, Send, Upload, X } from 'lucide-react'
import { useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AsyncBanner, Button, EmptyState, Metric, PriorityBadge, SectionHeading, StatusBadge } from '../components/UI'
import { useApp } from '../context/AppContext'
import type { Coordinates } from '../types'

const stages = ['Securing image evidence', 'Reading infrastructure signals', 'Checking nearby duplicates', 'Routing municipal response']

export default function CitizenPortal() {
  const { currentUser, complaints, draft, setDraft, submitComplaint } = useApp()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [address, setAddress] = useState(draft.location?.address || '')
  const [locating, setLocating] = useState(false)
  const [stage, setStage] = useState(-1)
  const [asyncState, setAsyncState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const mine = useMemo(() => complaints.filter(item => item.citizenId === currentUser?.id), [complaints, currentUser])
  const open = mine.filter(item => !['resolved', 'rejected'].includes(item.status)).length

  const upload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setFieldErrors(value => ({ ...value, image: 'Choose a JPEG, PNG, or WebP image.' })); return }
    if (file.size > 8 * 1024 * 1024) { setFieldErrors(value => ({ ...value, image: 'Image must be smaller than 8 MB.' })); return }
    const reader = new FileReader()
    reader.onload = () => { setDraft({ imageUrl: String(reader.result), fileName: file.name }); setFieldErrors(value => ({ ...value, image: '' })) }
    reader.onerror = () => setFieldErrors(value => ({ ...value, image: 'This image could not be read.' }))
    reader.readAsDataURL(file)
  }

  const locate = () => {
    setLocating(true); setError('')
    if (!navigator.geolocation) { setLocating(false); setError('Location services are unavailable. Enter the street location below.'); return }
    navigator.geolocation.getCurrentPosition(position => {
      const location: Coordinates = { lat: position.coords.latitude, lng: position.coords.longitude, address: address || 'Current device location' }
      setDraft({ location }); setAddress(location.address); setLocating(false); setFieldErrors(value => ({ ...value, location: '' }))
    }, () => { setLocating(false); setError('We could not access your location. Enter a nearby street or landmark below.') }, { enableHighAccuracy: true, timeout: 8000 })
  }

  const setManualAddress = (value: string) => {
    setAddress(value)
    setDraft({ location: value.trim().length > 4 ? { lat: 40.7185, lng: -74.006, address: value } : null })
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const errors: Record<string, string> = {}
    if (!draft.imageUrl) errors.image = 'Add a clear image of the issue.'
    if (draft.description.trim().length < 20) errors.description = 'Describe the impact in at least 20 characters.'
    if (!draft.location || address.trim().length < 5) errors.location = 'Use your location or enter a nearby street.'
    setFieldErrors(errors)
    if (Object.keys(errors).length) return
    setAsyncState('loading'); setStage(0); setError('')
    try {
      for (let index = 0; index < stages.length; index += 1) { setStage(index); await new Promise(resolve => window.setTimeout(resolve, 520)) }
      const complaint = await submitComplaint({ description: draft.description.trim(), imageUrl: draft.imageUrl, location: { ...draft.location!, address: address.trim() } })
      setAsyncState('success'); setStage(stages.length)
      await new Promise(resolve => window.setTimeout(resolve, 650))
      navigate(`/citizen/complaints/${complaint.id}`)
    } catch (caught) { setAsyncState('error'); setError(caught instanceof Error ? caught.message : 'Report submission failed. Your draft is preserved.') }
  }

  return <div className="space-y-8"><SectionHeading eyebrow="Resident service portal" title={`Good ${new Date().getHours() < 12 ? 'morning' : 'afternoon'}, ${currentUser?.name.split(' ')[0]}`} description="Report public infrastructure conditions and follow municipal work from verification through completion." />
    <section className="grid grid-cols-2 gap-4 lg:grid-cols-4" aria-label="Report summary"><Metric label="My reports" value={mine.length} detail="All submitted cases"/><Metric label="Open" value={open} detail="Awaiting completion"/><Metric label="Resolved" value={mine.filter(item => item.status === 'resolved').length} detail="Field verified" tone="success"/><Metric label="Avg. first update" value="2.8h" detail="Current service period"/></section>
    <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,.95fr)_minmax(420px,.75fr)]">
      <section id="new-report" className="panel scroll-mt-24 overflow-hidden"><div className="border-b border-civic-border px-5 py-5 sm:px-7"><p className="eyebrow">New infrastructure report</p><h2 className="mt-2 text-xl font-semibold">Show us what needs attention</h2><p className="mt-2 text-sm text-civic-muted">One clear photo and precise location help crews respond faster.</p></div>
        <form onSubmit={submit} className="space-y-6 p-5 sm:p-7" noValidate>
          <div><label className="label">1. Add a clear photo</label><input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={upload}/>{draft.imageUrl ? <div className="relative overflow-hidden border border-civic-border bg-civic-bg"><img src={draft.imageUrl} alt="Selected issue preview" className="aspect-[16/9] w-full object-cover"/><div className="flex items-center justify-between gap-3 border-t border-civic-border px-3 py-2"><span className="truncate text-xs text-civic-muted">{draft.fileName || 'Issue image'}</span><button type="button" onClick={() => { setDraft({ imageUrl: '', fileName: '' }); if (inputRef.current) inputRef.current.value = '' }} className="inline-flex items-center gap-1 text-xs text-civic-muted hover:text-civic-text"><X size={14} strokeWidth={1.6}/>Remove</button></div></div> : <button type="button" onClick={() => inputRef.current?.click()} className="grid min-h-44 w-full place-items-center border border-dashed border-civic-border bg-civic-bg px-5 text-center transition-colors hover:border-civic-accent"><span><span className="mx-auto grid h-11 w-11 place-items-center bg-civic-secondary text-civic-muted"><Camera size={21} strokeWidth={1.6}/></span><span className="mt-3 block text-sm font-medium text-civic-text">Choose photo</span><span className="mt-1 block text-xs text-civic-muted">JPEG, PNG or WebP · Max 8 MB</span></span></button>}{fieldErrors.image && <p className="mt-2 text-xs text-red-300" role="alert">{fieldErrors.image}</p>}</div>
          <div><label htmlFor="description" className="label">2. Describe the issue</label><textarea id="description" value={draft.description} onChange={event => setDraft({ description: event.target.value })} rows={4} maxLength={500} className="field resize-y" placeholder="What is damaged, where is it, and who may be affected?" aria-describedby="description-help description-error"/><div id="description-help" className="mt-2 flex justify-between text-[11px] text-civic-muted"><span>Include safety or accessibility impacts.</span><span className="data">{draft.description.length}/500</span></div>{fieldErrors.description && <p id="description-error" className="mt-2 text-xs text-red-300" role="alert">{fieldErrors.description}</p>}</div>
          <div><label className="label" htmlFor="address">3. Confirm location</label><Button type="button" variant="secondary" icon={locating ? Navigation : LocateFixed} loading={locating} onClick={locate} className="mb-3 w-full">Use my current location</Button><div className="relative"><MapPin className="absolute left-3.5 top-3.5 text-civic-muted" size={16} strokeWidth={1.6}/><input id="address" className="field pl-10" value={address} onChange={event => setManualAddress(event.target.value)} placeholder="Street, intersection, or nearby landmark"/></div><p className="mt-2 text-[11px] leading-5 text-civic-muted">If device location is blocked, the demo map uses the city-center coordinate with your entered address.</p>{fieldErrors.location && <p className="mt-2 text-xs text-red-300" role="alert">{fieldErrors.location}</p>}</div>
          <AsyncBanner state={asyncState} error={error} success="Report verified and routed."/>
          <AnimatePresence>{asyncState === 'loading' && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border border-civic-border bg-civic-bg p-4" role="status" aria-live="polite"><p className="eyebrow mb-4">AI assessment</p><div className="space-y-3">{stages.map((label, index) => <div key={label} className={`flex items-center gap-3 text-xs ${index <= stage ? 'text-civic-text' : 'text-civic-muted/50'}`}><span className={`grid h-5 w-5 place-items-center rounded-full border ${index < stage ? 'border-civic-success bg-civic-success/15 text-green-300' : index === stage ? 'border-civic-accent text-blue-300' : 'border-civic-border'}`}>{index < stage ? <Check size={11} strokeWidth={1.6}/> : <span className="data text-[9px]">{index + 1}</span>}</span>{label}</div>)}</div></motion.div>}</AnimatePresence>
          <Button type="submit" icon={Send} loading={asyncState === 'loading'} className="w-full">Analyze and submit report</Button>
        </form>
      </section>
      <section><div className="mb-5 flex items-end justify-between"><div><p className="eyebrow">My activity</p><h2 className="mt-2 text-xl font-semibold">Recent reports</h2></div><span className="data text-xs text-civic-muted">{mine.length} total</span></div>{mine.length ? <div className="divide-y divide-civic-border border-y border-civic-border">{mine.slice(0, 8).map(item => <button key={item.id} onClick={() => navigate(`/citizen/complaints/${item.id}`)} className="group grid w-full grid-cols-[72px_1fr_auto] items-center gap-4 py-4 text-left"><img src={item.imageUrl} alt="" className="h-14 w-[72px] border border-civic-border object-cover"/><span className="min-w-0"><span className="flex items-center gap-2"><span className="data text-[10px] text-civic-muted">{item.id}</span><PriorityBadge priority={item.priority} compact/></span><span className="mt-1 block truncate text-sm font-medium text-civic-text">{item.title}</span><span className="mt-1 block truncate text-xs text-civic-muted">{item.location.address}</span></span><span className="flex flex-col items-end gap-2"><StatusBadge status={item.status}/><ChevronRight className="text-civic-muted transition-transform group-hover:translate-x-1" size={16} strokeWidth={1.6}/></span></button>)}</div> : <EmptyState icon={FileText} title="No reports yet" description="Your first infrastructure report will appear here with live municipal updates." action={<Button icon={Upload} onClick={() => document.getElementById('new-report')?.scrollIntoView()}>Start a report</Button>}/>}</section>
    </div>
  </div>
}
