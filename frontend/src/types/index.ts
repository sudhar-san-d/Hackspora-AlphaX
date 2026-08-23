export type Role = 'citizen' | 'officer' | 'admin'
export type ComplaintStatus = 'submitted' | 'analyzing' | 'verified' | 'assigned' | 'in_progress' | 'resolution_submitted' | 'verification_pending' | 'resolved' | 'verification_failed' | 'sla_breached' | 'rejected'
export type Priority = 'critical' | 'high' | 'medium' | 'low'
export type Category = 'Pothole' | 'Streetlight' | 'Drainage' | 'Waste' | 'Sidewalk' | 'Traffic Signal' | 'Water Leak' | 'Graffiti'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  department?: string
}

export interface Coordinates {
  lat: number
  lng: number
  address: string
}

export interface TimelineEvent {
  id: string
  status: ComplaintStatus
  title: string
  description: string
  timestamp: string
  actor: string
}

export interface Evidence {
  id: string
  type: 'before' | 'after' | 'verification'
  url: string
  note: string
  timestamp: string
  coordinates?: Coordinates
}

export interface VerificationResult {
  visualMatch: number
  locationMatch: boolean
  distanceMeters: number
  sceneChanged: boolean
  issueResolved: boolean
  confidence: number
  verdict: 'VERIFIED' | 'REVIEW REQUIRED' | 'VERIFICATION FAILED'
}

export interface Complaint {
  id: string
  serverId?: string
  title: string
  description: string
  category: Category
  status: ComplaintStatus
  priority: Priority
  confidence: number
  severityScore: number
  location: Coordinates
  citizenId: string
  citizenName: string
  assignedOfficerId?: string
  assignedOfficerName?: string
  department: string
  createdAt: string
  updatedAt: string
  dueAt: string
  imageUrl: string
  aiSummary: string
  aiReasoning: string[]
  timeline: TimelineEvent[]
  evidence: Evidence[]
  publicUpdates: boolean
  duplicateRisk: number
  priorityScore?: number
  verification?: VerificationResult
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  createdAt: string
  read: boolean
  complaintId?: string
  tone: 'info' | 'success' | 'warning'
}

export interface ComplaintDraft {
  description: string
  location: Coordinates | null
  imageUrl: string
  fileName: string
}

export interface AppState {
  complaints: Complaint[]
  notifications: Notification[]
  currentUser: User | null
  demoMode: boolean
  draft: ComplaintDraft
}

export interface ComplaintFilters {
  search: string
  status: ComplaintStatus | 'all'
  priority: Priority | 'all'
  category: Category | 'all'
}

export interface ApiResult<T> {
  data: T
  source: 'api' | 'demo'
}
