import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api } from '../services/api'
import { demoComplaints, demoNotifications, demoUsers, issueImage } from '../data/demo'
import type { AppState, Complaint, ComplaintDraft, ComplaintStatus, Coordinates, Evidence, Role, User } from '../types'

const STORAGE_KEY = 'civictrack.frontend.v2'
const emptyDraft: ComplaintDraft = { description: '', location: null, imageUrl: '', fileName: '' }
const defaultState: AppState = { complaints: demoComplaints, notifications: demoNotifications, currentUser: null, demoMode: true, draft: emptyDraft }

function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return defaultState
    const parsed = JSON.parse(saved) as Partial<AppState>
    return {
      ...defaultState,
      ...parsed,
      complaints: parsed.complaints?.length ? parsed.complaints : demoComplaints,
      notifications: parsed.notifications?.length ? parsed.notifications : demoNotifications,
      draft: { ...emptyDraft, ...parsed.draft },
    }
  } catch {
    return defaultState
  }
}

interface SubmitInput {
  description: string
  location: Coordinates
  imageUrl: string
}

interface EvidenceInput {
  url: string
  note: string
  coordinates: Coordinates
  file?: File
}

interface AppContextValue extends AppState {
  login: (role: Role) => Promise<{ source: 'api' | 'demo' }>
  logout: () => void
  setDemoMode: (enabled: boolean) => void
  resetDemo: () => void
  setDraft: (draft: Partial<ComplaintDraft>) => void
  clearDraft: () => void
  submitComplaint: (input: SubmitInput) => Promise<Complaint>
  updateStatus: (id: string, status: ComplaintStatus, note?: string) => Promise<Complaint>
  addEvidence: (id: string, input: EvidenceInput) => Promise<Complaint>
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  refreshComplaints: () => Promise<'api' | 'demo'>
  complaintById: (id: string) => Complaint | undefined
}

const AppContext = createContext<AppContextValue | null>(null)

const statusCopy: Record<ComplaintStatus, [string, string]> = {
  submitted: ['Report received', 'The report was recorded for municipal triage.'],
  analyzing: ['AI assessment in progress', 'Image and location signals are being assessed.'],
  verified: ['Issue verified', 'The report meets field response criteria.'],
  assigned: ['Crew assigned', 'A municipal field officer has accepted this work item.'],
  in_progress: ['Repair underway', 'On-site work has started.'],
  resolution_submitted: ['Resolution submitted', 'The officer submitted completion evidence.'],
  verification_pending: ['Verification pending', 'Before-and-after evidence is being checked.'],
  resolved: ['Work verified complete', 'Completion evidence confirms the infrastructure repair.'],
  verification_failed: ['Verification requires review', 'The completion evidence did not pass automatic verification.'],
  sla_breached: ['SLA breached', 'The response target has passed and operations were notified.'],
  rejected: ['Report closed', 'The issue did not meet actionable maintenance criteria.'],
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const login = useCallback(async (role: Role) => {
    const fallback = demoUsers[role]
    if (!state.demoMode) {
      try {
        await api.health()
        setState(current => ({ ...current, currentUser: fallback }))
        return { source: 'api' as const }
      } catch {
        setState(current => ({ ...current, currentUser: fallback, demoMode: true }))
        return { source: 'demo' as const }
      }
    }
    await new Promise(resolve => window.setTimeout(resolve, 450))
    setState(current => ({ ...current, currentUser: fallback }))
    return { source: 'demo' as const }
  }, [state.demoMode])

  const logout = useCallback(() => setState(current => ({ ...current, currentUser: null })), [])
  const setDemoMode = useCallback((enabled: boolean) => setState(current => ({ ...current, demoMode: enabled })), [])
  const resetDemo = useCallback(() => setState(current => ({ ...defaultState, currentUser: current.currentUser })), [])
  const setDraft = useCallback((draft: Partial<ComplaintDraft>) => setState(current => ({ ...current, draft: { ...current.draft, ...draft } })), [])
  const clearDraft = useCallback(() => setState(current => ({ ...current, draft: emptyDraft })), [])

  const refreshComplaints = useCallback(async () => {
    if (!state.currentUser || state.demoMode) return 'demo' as const
    try {
      const complaints = await api.complaints(state.currentUser)
      if (complaints.length) setState(current => ({ ...current, complaints }))
      return 'api' as const
    } catch {
      setState(current => ({ ...current, demoMode: true }))
      return 'demo' as const
    }
  }, [state.currentUser, state.demoMode])

  const submitComplaint = useCallback(async (input: SubmitInput) => {
    const now = new Date()
    const generatedId = `CT-${Math.max(...state.complaints.map(item => Number(item.id.replace(/\D/g, '')) || 1000)) + 1}`
    const isCriticalPothole = /pothole/i.test(input.description) && /school|bus stop|traffic/i.test(input.description)
    const created: Complaint = {
      id: generatedId, title: input.description.split(/[.!?]/)[0].slice(0, 64) || 'New infrastructure report', description: input.description,
      category: /garbage|waste/i.test(input.description) ? 'Waste' : /streetlight|street light/i.test(input.description) ? 'Streetlight' : /drain|sewage/i.test(input.description) ? 'Drainage' : /water leak|burst pipe/i.test(input.description) ? 'Water Leak' : 'Pothole',
      status: 'verified', priority: isCriticalPothole ? 'critical' : 'medium', priorityScore: isCriticalPothole ? 83 : 48, confidence: isCriticalPothole ? 93 : 76, severityScore: isCriticalPothole ? 8 : 5, location: input.location,
      citizenId: state.currentUser?.id || demoUsers.citizen.id, citizenName: state.currentUser?.name || demoUsers.citizen.name,
      department: isCriticalPothole ? 'Roads Department' : 'Municipal Triage', createdAt: now.toISOString(), updatedAt: now.toISOString(), dueAt: new Date(now.getTime() + (isCriticalPothole ? 21_600_000 : 172_800_000)).toISOString(),
      imageUrl: input.imageUrl || issueImage('Pothole', state.complaints.length + 1), aiSummary: isCriticalPothole ? 'Large pothole with broken asphalt and a deep road depression on a paved road.' : 'Civic infrastructure evidence classified for municipal response.',
      aiReasoning: isCriticalPothole ? ['Pothole detected on road infrastructure with visual severity 8/10.', 'School and bus-stop proximity increase location risk.', 'Deterministic priority score 83/100 routes this issue to the Roads Department with a 6-hour SLA.'] : ['Image quality supports automated triage.', 'Location falls within the municipal service area.', 'Deterministic routing selected the responsible service.'],
      timeline: [
        { id: `${generatedId}-T1`, status: 'submitted', title: 'Report received', description: 'Report details and location were securely recorded.', timestamp: now.toISOString(), actor: state.currentUser?.name || 'Resident' },
        { id: `${generatedId}-T2`, status: 'analyzing', title: 'Vision analysis complete', description: 'Visible issue, infrastructure, hazards, severity, and confidence were structured.', timestamp: new Date(now.getTime() + 1_000).toISOString(), actor: 'CivicTrack AI' },
        { id: `${generatedId}-T3`, status: 'verified', title: 'Decision engine complete', description: 'Department, priority, and SLA were assigned using deterministic rules.', timestamp: new Date(now.getTime() + 2_000).toISOString(), actor: 'CivicTrack AI' },
      ],
      evidence: [{ id: `${generatedId}-E1`, type: 'before', url: input.imageUrl || issueImage('Pothole', state.complaints.length + 1), note: 'Original resident field capture', timestamp: now.toISOString(), coordinates: input.location }],
      publicUpdates: true, duplicateRisk: 0.12,
    }
    if (!state.demoMode && state.currentUser) {
      try {
        const serverComplaint = await api.createComplaint(created, state.currentUser)
        setState(current => ({ ...current, complaints: [serverComplaint, ...current.complaints], draft: emptyDraft }))
        return serverComplaint
      } catch {
        setState(current => ({ ...current, demoMode: true, complaints: [created, ...current.complaints], draft: emptyDraft }))
        return created
      }
    }
    await new Promise(resolve => window.setTimeout(resolve, 500))
    setState(current => ({ ...current, complaints: [created, ...current.complaints], draft: emptyDraft }))
    return created
  }, [state.complaints, state.currentUser, state.demoMode])

  const updateStatus = useCallback(async (id: string, status: ComplaintStatus, note?: string) => {
    const existing = state.complaints.find(item => item.id === id)
    if (!existing) throw new Error('Complaint not found')
    const now = new Date().toISOString()
    const [title, defaultNote] = statusCopy[status]
    let updated: Complaint = {
      ...existing, status, updatedAt: now,
      assignedOfficerId: ['assigned', 'in_progress', 'resolved'].includes(status) ? (existing.assignedOfficerId || state.currentUser?.id || demoUsers.officer.id) : existing.assignedOfficerId,
      assignedOfficerName: ['assigned', 'in_progress', 'resolved'].includes(status) ? (existing.assignedOfficerName || state.currentUser?.name || demoUsers.officer.name) : existing.assignedOfficerName,
      timeline: [...existing.timeline, { id: `${id}-T${existing.timeline.length + 1}`, status, title, description: note || defaultNote, timestamp: now, actor: state.currentUser?.name || 'Municipal Operations' }],
    }
    if (!state.demoMode && state.currentUser) {
      try {
        if (status === 'assigned') updated = await api.assign(id, existing.department, state.currentUser)
        else if (status === 'in_progress') updated = await api.start(id, note || defaultNote, state.currentUser)
      } catch (error) {
        setState(current => ({ ...current, demoMode: true }))
        throw error
      }
    } else await new Promise(resolve => window.setTimeout(resolve, 450))
    setState(current => ({ ...current, complaints: current.complaints.map(item => item.id === id ? updated : item), notifications: [{ id: `N-${Date.now()}`, userId: existing.citizenId, title, message: `${id}: ${note || defaultNote}`, createdAt: now, read: false, complaintId: id, tone: status === 'resolved' ? 'success' : 'info' }, ...current.notifications] }))
    return updated
  }, [state.complaints, state.currentUser, state.demoMode])

  const addEvidence = useCallback(async (id: string, input: EvidenceInput) => {
    const existing = state.complaints.find(item => item.id === id)
    if (!existing) throw new Error('Complaint not found')
    const evidence: Evidence = { id: `${id}-E${existing.evidence.length + 1}`, type: 'after', url: input.url, note: input.note, timestamp: new Date().toISOString(), coordinates: input.coordinates }
    let updated: Complaint = {
      ...existing,
      evidence: [...existing.evidence, evidence],
      updatedAt: evidence.timestamp,
      verification: { visualMatch: .91, locationMatch: true, distanceMeters: 8, sceneChanged: true, issueResolved: true, confidence: .93, verdict: 'VERIFIED' },
    }
    if (!state.demoMode && state.currentUser && input.file) {
      try { updated = await api.resolveAndVerify(id, input.file, { note: input.note, coordinates: input.coordinates }, state.currentUser) }
      catch (error) {
        setState(current => ({ ...current, demoMode: true }))
        throw error
      }
    } else await new Promise(resolve => window.setTimeout(resolve, 500))
    setState(current => ({ ...current, complaints: current.complaints.map(item => item.id === id ? updated : item) }))
    return updated
  }, [state.complaints, state.currentUser, state.demoMode])

  const markNotificationRead = useCallback((id: string) => setState(current => ({ ...current, notifications: current.notifications.map(item => item.id === id ? { ...item, read: true } : item) })), [])
  const markAllNotificationsRead = useCallback(() => setState(current => ({ ...current, notifications: current.notifications.map(item => ({ ...item, read: true })) })), [])
  const complaintById = useCallback((id: string) => state.complaints.find(item => item.id === id), [state.complaints])

  const value = useMemo(() => ({ ...state, login, logout, setDemoMode, resetDemo, setDraft, clearDraft, submitComplaint, updateStatus, addEvidence, markNotificationRead, markAllNotificationsRead, refreshComplaints, complaintById }), [state, login, logout, setDemoMode, resetDemo, setDraft, clearDraft, submitComplaint, updateStatus, addEvidence, markNotificationRead, markAllNotificationsRead, refreshComplaints, complaintById])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used inside AppProvider')
  return context
}
