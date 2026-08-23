import { AnimatePresence, motion } from 'framer-motion'
import { Camera, Check, LocateFixed, MapPin, Navigation, Send, X } from 'lucide-react'
import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AsyncBanner, Button, SectionHeading } from '../components/UI'
import { useApp } from '../context/AppContext'
import type { Coordinates } from '../types'

const stages = [
  'Securing image evidence',
  'Reading infrastructure signals',
  'Checking nearby duplicates',
  'Routing municipal response',
]

export default function NewReport() {
  const { draft, setDraft, submitComplaint } = useApp()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [address, setAddress] = useState(draft.location?.address || '')
  const [locating, setLocating] = useState(false)
  const [stage, setStage] = useState(-1)
  const [asyncState, setAsyncState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const upload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setFieldErrors(value => ({ ...value, image: 'Choose a JPEG, PNG, or WebP image.' }))
      return
    }
    if (file.size > 8 * 1024 * 1024) {
      setFieldErrors(value => ({ ...value, image: 'Image must be smaller than 8 MB.' }))
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setDraft({ imageUrl: String(reader.result), fileName: file.name })
      setFieldErrors(value => ({ ...value, image: '' }))
    }
    reader.onerror = () => setFieldErrors(value => ({ ...value, image: 'This image could not be read.' }))
    reader.readAsDataURL(file)
  }

  const locate = () => {
    setLocating(true)
    setError('')
    if (!navigator.geolocation) {
      setLocating(false)
      setError('Location services are unavailable. Enter the street location below.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      position => {
        const location: Coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          address: address || 'Current device location',
        }
        setDraft({ location })
        setAddress(location.address)
        setLocating(false)
        setFieldErrors(value => ({ ...value, location: '' }))
      },
      () => {
        setLocating(false)
        setError('We could not access your location. Enter a nearby street or landmark below.')
      },
      { enableHighAccuracy: true, timeout: 8000 }
    )
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

    setAsyncState('loading')
    setStage(0)
    setError('')
    try {
      for (let index = 0; index < stages.length; index += 1) {
        setStage(index)
        await new Promise(resolve => window.setTimeout(resolve, 520))
      }
      const complaint = await submitComplaint({
        description: draft.description.trim(),
        imageUrl: draft.imageUrl,
        location: { ...draft.location!, address: address.trim() },
      })
      setAsyncState('success')
      setStage(stages.length)
      await new Promise(resolve => window.setTimeout(resolve, 650))
      navigate(`/citizen/complaints/${complaint.id}`)
    } catch (caught) {
      setAsyncState('error')
      setError(caught instanceof Error ? caught.message : 'Report submission failed. Your draft is preserved.')
    }
  }

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Resident Service Portal"
        title="Submit New Infrastructure Report"
        description="One clear photo and precise location help municipal crews assess and respond to issues fast."
      />

      <div className="mx-auto max-w-3xl">
        <section className="overflow-hidden border border-[#DCDAD7] bg-white shadow-sm">
          <div className="border-b border-[#DCDAD7] bg-[#F2F1F0]/60 px-6 py-5">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B6F72]">
              New Report Form
            </p>
            <h2 className="mt-1 font-sans text-xl font-bold uppercase tracking-[0.01em] text-[#2B3033]">
              Show Us What Needs Attention
            </h2>
          </div>

          <form onSubmit={submit} className="space-y-6 p-6 sm:p-8" noValidate>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#2B3033]">
                1. Add a clear photo
              </label>
              <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={upload} />
              {draft.imageUrl ? (
                <div className="relative overflow-hidden border border-[#DCDAD7] bg-[#F2F1F0]">
                  <img src={draft.imageUrl} alt="Selected issue preview" className="aspect-[16/9] w-full object-cover" />
                  <div className="flex items-center justify-between gap-3 border-t border-[#DCDAD7] bg-white px-4 py-2.5">
                    <span className="truncate text-xs text-[#6B6F72]">{draft.fileName || 'Issue image'}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setDraft({ imageUrl: '', fileName: '' })
                        if (inputRef.current) inputRef.current.value = ''
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-rose-600 hover:text-rose-700"
                    >
                      <X size={14} strokeWidth={2} /> Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="grid min-h-48 w-full place-items-center border border-dashed border-[#DCDAD7] bg-[#F2F1F0]/60 px-5 text-center transition-colors hover:border-[#15BCDF]"
                >
                  <span>
                    <span className="mx-auto grid h-12 w-12 place-items-center border border-[#DCDAD7] bg-white text-[#15BCDF]">
                      <Camera size={22} strokeWidth={2} />
                    </span>
                    <span className="mt-3 block text-xs font-bold uppercase tracking-wider text-[#2B3033]">
                      Choose photo
                    </span>
                    <span className="mt-1 block text-xs text-[#6B6F72]">JPEG, PNG or WebP · Max 8 MB</span>
                  </span>
                </button>
              )}
              {fieldErrors.image && <p className="mt-2 text-xs font-bold text-rose-600" role="alert">{fieldErrors.image}</p>}
            </div>

            <div>
              <label htmlFor="description" className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#2B3033]">
                2. Describe the issue
              </label>
              <textarea
                id="description"
                value={draft.description}
                onChange={event => setDraft({ description: event.target.value })}
                rows={4}
                maxLength={500}
                className="w-full border border-[#DCDAD7] bg-[#F2F1F0]/40 px-4 py-3 text-sm text-[#2B3033] placeholder-[#6B6F72]/60 focus:border-[#15BCDF] focus:outline-none focus:ring-1 focus:ring-[#15BCDF]"
                placeholder="What is damaged, where is it, and who may be affected?"
                aria-describedby="description-help description-error"
              />
              <div id="description-help" className="mt-2 flex justify-between text-[11px] text-[#6B6F72]">
                <span>Include safety or accessibility impacts.</span>
                <span className="font-mono">{draft.description.length}/500</span>
              </div>
              {fieldErrors.description && (
                <p id="description-error" className="mt-2 text-xs font-bold text-rose-600" role="alert">
                  {fieldErrors.description}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#2B3033]" htmlFor="address">
                3. Confirm location
              </label>
              <Button type="button" variant="secondary" icon={locating ? Navigation : LocateFixed} loading={locating} onClick={locate} className="mb-3 w-full">
                Use current device location
              </Button>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 text-[#6B6F72]" size={16} strokeWidth={2} />
                <input
                  id="address"
                  className="w-full border border-[#DCDAD7] bg-[#F2F1F0]/40 pl-10 pr-4 py-3 text-sm text-[#2B3033] placeholder-[#6B6F72]/60 focus:border-[#15BCDF] focus:outline-none focus:ring-1 focus:ring-[#15BCDF]"
                  value={address}
                  onChange={event => setManualAddress(event.target.value)}
                  placeholder="Street, intersection, or nearby landmark"
                />
              </div>
              <p className="mt-2 text-[11px] leading-5 text-[#6B6F72]">
                If device location is blocked, the demo map uses the city-center coordinate with your entered address.
              </p>
              {fieldErrors.location && (
                <p className="mt-2 text-xs font-bold text-rose-600" role="alert">
                  {fieldErrors.location}
                </p>
              )}
            </div>

            <AsyncBanner state={asyncState} error={error} success="Report verified and routed." />

            <AnimatePresence>
              {asyncState === 'loading' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border border-[#DCDAD7] bg-[#F2F1F0] p-4" role="status" aria-live="polite">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#6B6F72] mb-3">AI assessment sequence</p>
                  <div className="space-y-2.5">
                    {stages.map((label, index) => (
                      <div key={label} className={`flex items-center gap-3 text-xs ${index <= stage ? 'text-[#2B3033] font-bold' : 'text-[#6B6F72]/50'}`}>
                        <span className={`grid h-5 w-5 place-items-center rounded-full border ${index < stage ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : index === stage ? 'border-[#15BCDF] text-[#15BCDF]' : 'border-[#DCDAD7]'}`}>
                          {index < stage ? <Check size={11} strokeWidth={2} /> : <span className="font-mono text-[9px]">{index + 1}</span>}
                        </span>
                        {label}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Button type="submit" icon={Send} loading={asyncState === 'loading'} className="w-full py-3.5">
              Analyze and submit report
            </Button>
          </form>
        </section>
      </div>
    </div>
  )
}
