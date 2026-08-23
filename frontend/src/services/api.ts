import type { Category, Complaint, ComplaintStatus, Evidence, Priority, Role, TimelineEvent, User, VerificationResult } from '../types'

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api').replace(/\/$/, '')
const REQUEST_TIMEOUT = 25_000

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

function extractData<T>(payload: unknown): T {
  if (payload && typeof payload === 'object' && 'data' in payload) return (payload as { data: T }).data
  return payload as T
}

const backendRole = (role?: Role) => role === 'officer' ? 'field_worker' : role || 'citizen'

async function request<T>(path: string, options: RequestInit = {}, user?: User | null): Promise<T> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT)
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        'x-demo-role': backendRole(user?.role),
        'x-demo-user': user?.id || 'USR-C-204',
        ...options.headers,
      },
    })
    const payload = response.status === 204 ? undefined : await response.json().catch(() => undefined)
    if (!response.ok) {
      const message = payload && typeof payload === 'object' && 'error' in payload
        ? String((payload as { error?: { message?: string } }).error?.message || `Request failed with status ${response.status}`)
        : `Request failed with status ${response.status}`
      throw new ApiError(message, response.status)
    }
    return extractData<T>(payload)
  } catch (error) {
    if (error instanceof ApiError) throw error
    if (error instanceof DOMException && error.name === 'AbortError') throw new ApiError('The municipal service did not respond in time.')
    throw new ApiError('The municipal service is currently unavailable.')
  } finally {
    window.clearTimeout(timeout)
  }
}

interface BackendComplaint {
  id: string
  reference: string
  title: string
  description: string
  category: string
  status: string
  priority: Priority
  priorityScore: number
  latitude: number
  longitude: number
  address: string
  reporterId: string
  createdAt: string
  updatedAt: string
  analysis: { confidence: number; severity: number; observedFacts: string[]; hazards: string[]; requiresHumanReview: boolean }
  decision: { departments: string[]; responseDueAt: string; reasoning: string[] }
  statusHistory: Array<{ id: string; status: string; note: string; actorId: string; createdAt: string }>
  assignments: Array<{ assigneeId: string; department: string }>
  evidence: Array<{ id: string; kind: 'initial' | 'resolution'; url: string; createdAt: string; latitude?: number; longitude?: number }>
  verification?: { visualScore: number; gpsDistanceMeters: number; confidence: number; passed: boolean; notes: string[] }
}

const categories: Record<string, Category> = {
  pothole: 'Pothole', garbage: 'Waste', open_drain: 'Drainage', broken_streetlight: 'Streetlight',
  water_leakage: 'Water Leak', road_damage: 'Pothole', traffic_signal: 'Traffic Signal', flooding: 'Drainage', sewage: 'Drainage', other: 'Sidewalk',
}
const departments: Record<string, string> = {
  roads: 'Roads Department', sanitation: 'Waste Management', water: 'Water Department', drainage: 'Drainage Department',
  electrical: 'Electrical Department', traffic: 'Traffic Department', public_safety: 'Public Safety Department',
}
const statuses: Record<string, ComplaintStatus> = {
  submitted: 'submitted', triaged: 'verified', assigned: 'assigned', in_progress: 'in_progress',
  resolved_pending_verification: 'verification_pending', resolved: 'resolved', rejected: 'rejected', reopened: 'verification_failed',
}
const statusTitle: Record<ComplaintStatus, string> = {
  submitted: 'Report received', analyzing: 'AI assessment in progress', verified: 'Issue verified', assigned: 'Crew assigned',
  in_progress: 'Repair underway', resolution_submitted: 'Resolution submitted', verification_pending: 'Verification pending',
  resolved: 'Work verified complete', verification_failed: 'Verification requires review', sla_breached: 'SLA breached', rejected: 'Report closed',
}

export function normalizeComplaint(raw: BackendComplaint): Complaint {
  const location = { lat: raw.latitude, lng: raw.longitude, address: raw.address }
  const evidence: Evidence[] = raw.evidence.map(item => ({
    id: item.id, type: item.kind === 'initial' ? 'before' : 'after', url: item.url,
    note: item.kind === 'initial' ? 'Original resident field capture' : 'Officer completion evidence', timestamp: item.createdAt,
    coordinates: item.latitude !== undefined && item.longitude !== undefined ? { lat: item.latitude, lng: item.longitude, address: raw.address } : location,
  }))
  const timeline: TimelineEvent[] = raw.statusHistory.map(item => {
    const status = statuses[item.status] || 'submitted'
    return { id: item.id, status, title: statusTitle[status], description: item.note, timestamp: item.createdAt, actor: item.actorId.includes('ai') ? 'CivicTrack AI' : 'Municipal Operations' }
  })
  const assignment = raw.assignments.at(-1)
  const primaryDepartment = raw.decision.departments[0] || assignment?.department || 'public_safety'
  const verification: VerificationResult | undefined = raw.verification ? {
    visualMatch: raw.verification.visualScore / 100,
    locationMatch: raw.verification.gpsDistanceMeters <= 100,
    distanceMeters: raw.verification.gpsDistanceMeters,
    sceneChanged: raw.verification.visualScore >= 60,
    issueResolved: raw.verification.passed,
    confidence: raw.verification.confidence,
    verdict: raw.verification.passed ? 'VERIFIED' : raw.verification.confidence >= .5 ? 'REVIEW REQUIRED' : 'VERIFICATION FAILED',
  } : undefined
  return {
    id: raw.reference,
    serverId: raw.id,
    title: raw.title,
    description: raw.description,
    category: categories[raw.category] || 'Sidewalk',
    status: statuses[raw.status] || 'submitted',
    priority: raw.priority,
    priorityScore: raw.priorityScore,
    confidence: Math.round(raw.analysis.confidence * 100),
    severityScore: raw.analysis.severity / 10,
    location,
    citizenId: raw.reporterId,
    citizenName: 'Resident reporter',
    assignedOfficerId: assignment?.assigneeId,
    assignedOfficerName: assignment ? 'Assigned field officer' : undefined,
    department: departments[primaryDepartment] || 'Municipal Triage',
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    dueAt: raw.decision.responseDueAt,
    imageUrl: evidence.find(item => item.type === 'before')?.url || '',
    aiSummary: raw.analysis.observedFacts[0] || `${categories[raw.category] || 'Civic'} issue classified for municipal response.`,
    aiReasoning: raw.decision.reasoning,
    timeline,
    evidence,
    verification,
    publicUpdates: true,
    duplicateRisk: 0.12,
  }
}

function normalizeList(payload: BackendComplaint[] | { items?: BackendComplaint[]; complaints?: BackendComplaint[] }): Complaint[] {
  const items = Array.isArray(payload) ? payload : payload.items || payload.complaints || []
  return items.map(normalizeComplaint)
}

export const api = {
  baseUrl: API_BASE,
  health: () => request<{ status: string }>('/health'),
  async complaints(user: User) {
    return normalizeList(await request<BackendComplaint[] | { items?: BackendComplaint[] }>('/complaints?pageSize=100', {}, user))
  },
  async complaint(id: string, user: User) {
    return normalizeComplaint(await request<BackendComplaint>(`/complaints/${encodeURIComponent(id)}`, {}, user))
  },
  async createComplaint(input: Partial<Complaint>, user: User) {
    const description = input.description || ''
    const location = input.location
    const raw = await request<BackendComplaint>('/complaints', {
      method: 'POST',
      body: JSON.stringify({
        title: input.title,
        description,
        latitude: location?.lat,
        longitude: location?.lng,
        address: location?.address,
        imageDataUrl: input.imageUrl,
        nearSchool: /school/i.test(description),
        nearHospital: /hospital/i.test(description),
        nearTransit: /bus|station|transit/i.test(description),
        trafficImpact: /traffic signal|intersection blocked|lane blocked|road blocked|blocks? traffic/i.test(description),
        peopleAtRisk: /school|bus|market|crowd/i.test(description) ? 25 : 5,
      }),
    }, user)
    return normalizeComplaint(raw)
  },
  async assign(id: string, department: string, user: User) {
    const reverse = Object.entries(departments).find(([, label]) => label === department)?.[0] || 'roads'
    return normalizeComplaint(await request<BackendComplaint>(`/complaints/${encodeURIComponent(id)}/assign`, { method: 'POST', body: JSON.stringify({ department: reverse, assigneeId: user.id }) }, user))
  },
  async start(id: string, note: string, user: User) {
    return normalizeComplaint(await request<BackendComplaint>(`/complaints/${encodeURIComponent(id)}/start`, { method: 'POST', body: JSON.stringify({ note }) }, user))
  },
  async resolveAndVerify(id: string, file: File, metadata: { note: string; coordinates: { lat: number; lng: number } }, user: User) {
    const form = new FormData()
    form.append('evidence', file)
    form.append('note', metadata.note)
    form.append('latitude', String(metadata.coordinates.lat))
    form.append('longitude', String(metadata.coordinates.lng))
    await request<BackendComplaint>(`/complaints/${encodeURIComponent(id)}/resolve`, { method: 'POST', body: form }, user)
    const verification = await request<{ visual_match: number; location_match: boolean; distance_meters: number; scene_changed: boolean; issue_resolved: boolean; confidence: number; verdict: VerificationResult['verdict'] }>(`/complaints/${encodeURIComponent(id)}/verify-resolution`, { method: 'POST', body: JSON.stringify({}) }, user)
    const complaint = await this.complaint(id, user)
    return {
      ...complaint,
      verification: {
        visualMatch: verification.visual_match,
        locationMatch: verification.location_match,
        distanceMeters: verification.distance_meters,
        sceneChanged: verification.scene_changed,
        issueResolved: verification.issue_resolved,
        confidence: verification.confidence,
        verdict: verification.verdict,
      },
    }
  },
}
