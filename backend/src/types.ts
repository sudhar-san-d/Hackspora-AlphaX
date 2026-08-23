export const complaintCategories = [
  'pothole', 'garbage', 'open_drain', 'broken_streetlight', 'water_leakage',
  'road_damage', 'traffic_signal', 'flooding', 'sewage', 'other',
] as const;
export type ComplaintCategory = (typeof complaintCategories)[number];

export const priorities = ['critical', 'high', 'medium', 'low'] as const;
export type Priority = (typeof priorities)[number];

export const complaintStatuses = [
  'submitted', 'triaged', 'assigned', 'in_progress',
  'resolved_pending_verification', 'resolved', 'rejected', 'reopened',
] as const;
export type ComplaintStatus = (typeof complaintStatuses)[number];

export const departmentCodes = ['roads', 'sanitation', 'water', 'drainage', 'electrical', 'traffic', 'public_safety'] as const;
export type DepartmentCode = (typeof departmentCodes)[number];

export type Coordinates = { latitude: number; longitude: number };

export interface ImageAnalysis {
  category: ComplaintCategory;
  secondaryCategories: ComplaintCategory[];
  severity: number;
  confidence: number;
  observedFacts: string[];
  hazards: string[];
  imageQuality: 'clear' | 'limited' | 'unclear';
  requiresHumanReview: boolean;
  source: 'openrouter' | 'deterministic_fallback';
}

export interface DecisionInput {
  description: string;
  analysis: ImageAnalysis;
  nearSchool: boolean;
  nearHospital: boolean;
  nearTransit: boolean;
  trafficImpact: boolean;
  peopleAtRisk: number;
  ageHours: number;
}

export interface PriorityBreakdown {
  severity: number;
  safety: number;
  vulnerability: number;
  location: number;
  spread: number;
}

export interface Decision {
  category: ComplaintCategory;
  priority: Priority;
  priorityScore: number;
  priorityBreakdown: PriorityBreakdown;
  departments: DepartmentCode[];
  responseDueAt: string;
  resolutionDueAt: string;
  reasoning: string[];
  requiresHumanReview: boolean;
  source: 'groq' | 'deterministic_fallback';
}

export interface Department {
  code: DepartmentCode;
  name: string;
  description: string;
  activeCases: number;
}

export interface StatusHistoryEntry {
  id: string;
  status: ComplaintStatus;
  note: string;
  actorId: string;
  createdAt: string;
}

export interface Assignment {
  id: string;
  department: DepartmentCode;
  assigneeId: string;
  assignedBy: string;
  createdAt: string;
}

export interface Evidence {
  id: string;
  kind: 'initial' | 'resolution';
  url: string;
  mimeType: string;
  sizeBytes: number;
  latitude?: number;
  longitude?: number;
  createdAt: string;
}

export interface Verification {
  id: string;
  visualScore: number;
  gpsDistanceMeters: number;
  confidence: number;
  passed: boolean;
  notes: string[];
  source: 'openrouter' | 'deterministic_fallback' | 'demo_seed';
  createdAt: string;
}

export interface Complaint {
  id: string;
  reference: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  secondaryCategories: ComplaintCategory[];
  status: ComplaintStatus;
  priority: Priority;
  priorityScore: number;
  priorityBreakdown: PriorityBreakdown;
  latitude: number;
  longitude: number;
  address: string;
  reporterId: string;
  analysis: ImageAnalysis;
  decision: Decision;
  duplicateOf?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusHistoryEntry[];
  assignments: Assignment[];
  evidence: Evidence[];
  verification?: Verification;
}

export interface Notification {
  id: string;
  userId: string;
  complaintId?: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export type DemoRole = 'citizen' | 'dispatcher' | 'field_worker' | 'supervisor' | 'admin';
export interface RequestActor { id: string; role: DemoRole }
