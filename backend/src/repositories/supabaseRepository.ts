import type { SupabaseClient } from '@supabase/supabase-js';
import { demoDepartments } from '../data/demoSeed.js';
import type { Assignment, Complaint, ComplaintStatus, Department, Evidence, Notification, StatusHistoryEntry, Verification } from '../types.js';
import { buildDashboard } from './memoryRepository.js';
import type { ComplaintFilters, DashboardData, PaginatedComplaints, Repository } from './repository.js';

const complaintSelect = '*,status_history(*),assignments(*),evidence(*),verification(*)';

function fail(error: { message: string } | null): void { if (error) throw new Error(`Supabase repository error: ${error.message}`); }

function mapComplaint(row: any): Complaint {
  const histories = (row.status_history ?? []).map((item: any) => ({ id: item.id, status: item.status, note: item.note, actorId: item.actor_id, createdAt: item.created_at }));
  const assignments = (row.assignments ?? []).map((item: any) => ({ id: item.id, department: item.department, assigneeId: item.assignee_id, assignedBy: item.assigned_by, createdAt: item.created_at }));
  const evidence = (row.evidence ?? []).map((item: any) => ({ id: item.id, kind: item.kind, url: item.url, mimeType: item.mime_type, sizeBytes: item.size_bytes, ...(item.latitude === null ? {} : { latitude: item.latitude }), ...(item.longitude === null ? {} : { longitude: item.longitude }), createdAt: item.created_at }));
  const verificationRow = Array.isArray(row.verification) ? row.verification[0] : row.verification;
  const verification = verificationRow ? {
    id: verificationRow.id, visualScore: verificationRow.visual_score, gpsDistanceMeters: verificationRow.gps_distance_meters,
    confidence: verificationRow.confidence, passed: verificationRow.passed, notes: verificationRow.notes,
    source: verificationRow.source, createdAt: verificationRow.created_at,
  } : undefined;
  return {
    id: row.id, reference: row.reference, title: row.title, description: row.description, category: row.category,
    secondaryCategories: row.secondary_categories ?? [], status: row.status, priority: row.priority,
    priorityScore: row.priority_score, priorityBreakdown: row.priority_breakdown,
    latitude: row.latitude, longitude: row.longitude, address: row.address, reporterId: row.reporter_id,
    analysis: row.analysis, decision: row.decision, ...(row.duplicate_of ? { duplicateOf: row.duplicate_of } : {}),
    createdAt: row.created_at, updatedAt: row.updated_at,
    statusHistory: histories.sort((a: StatusHistoryEntry, b: StatusHistoryEntry) => a.createdAt.localeCompare(b.createdAt)),
    assignments, evidence, ...(verification ? { verification } : {}),
  };
}

function complaintRow(item: Complaint): Record<string, unknown> {
  return {
    id: item.id, reference: item.reference, title: item.title, description: item.description, category: item.category,
    secondary_categories: item.secondaryCategories, status: item.status, priority: item.priority,
    priority_score: item.priorityScore, priority_breakdown: item.priorityBreakdown,
    latitude: item.latitude, longitude: item.longitude, address: item.address, reporter_id: item.reporterId,
    analysis: item.analysis, decision: item.decision, duplicate_of: item.duplicateOf ?? null,
    created_at: item.createdAt, updated_at: item.updatedAt,
  };
}

export class SupabaseRepository implements Repository {
  constructor(private readonly client: SupabaseClient) {}

  async createComplaint(complaint: Complaint): Promise<Complaint> {
    const { error } = await this.client.from('complaints').insert(complaintRow(complaint)); fail(error);
    const analysisResult = await this.client.from('complaint_ai_analysis').insert({ complaint_id: complaint.id, provider: complaint.analysis.source, model: complaint.analysis.source === 'openrouter' ? 'configured-openrouter-model' : 'deterministic-fallback', image_analysis: complaint.analysis, confidence: complaint.analysis.confidence, created_at: complaint.createdAt }); fail(analysisResult.error);
    const decisionResult = await this.client.from('complaint_decisions').insert({ complaint_id: complaint.id, decision: complaint.decision, priority_score: complaint.priorityScore, priority_level: complaint.priority, sla_due_at: complaint.decision.resolutionDueAt, created_at: complaint.createdAt }); fail(decisionResult.error);
    if (complaint.statusHistory.length) { const result = await this.client.from('status_history').insert(complaint.statusHistory.map((item) => ({ id: item.id, complaint_id: complaint.id, status: item.status, note: item.note, actor_id: item.actorId, created_at: item.createdAt }))); fail(result.error); }
    if (complaint.evidence.length) { const result = await this.client.from('evidence').insert(complaint.evidence.map((item) => this.evidenceRow(complaint.id, item))); fail(result.error); }
    return complaint;
  }

  async listComplaints(filters: ComplaintFilters): Promise<PaginatedComplaints> {
    const from = (filters.page - 1) * filters.pageSize;
    let query = this.client.from('complaints').select(complaintSelect, { count: 'exact' });
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.priority) query = query.eq('priority', filters.priority);
    if (filters.category) query = query.or(`category.eq.${filters.category},secondary_categories.cs.{${filters.category}}`);
    if (filters.department) query = query.contains('decision->departments', [filters.department]);
    if (filters.search) {
      const safe = filters.search.replace(/[,()%]/g, ' ');
      query = query.or(`reference.ilike.%${safe}%,title.ilike.%${safe}%,description.ilike.%${safe}%,address.ilike.%${safe}%`);
    }
    const { data, error, count } = await query.order('created_at', { ascending: false }).range(from, from + filters.pageSize - 1); fail(error);
    const total = count ?? 0;
    return { items: (data ?? []).map(mapComplaint), page: filters.page, pageSize: filters.pageSize, total, totalPages: Math.ceil(total / filters.pageSize) };
  }

  async getComplaint(idOrReference: string): Promise<Complaint | null> {
    const query = this.client.from('complaints').select(complaintSelect);
    const filtered = idOrReference.toUpperCase().startsWith('CT-') ? query.eq('reference', idOrReference.toUpperCase()) : query.eq('id', idOrReference);
    const { data, error } = await filtered.maybeSingle(); fail(error);
    return data ? mapComplaint(data) : null;
  }

  async getAllComplaints(): Promise<Complaint[]> {
    const { data, error } = await this.client.from('complaints').select(complaintSelect).order('created_at', { ascending: false }); fail(error);
    return (data ?? []).map(mapComplaint);
  }

  async addStatus(id: string, entry: StatusHistoryEntry, status: ComplaintStatus): Promise<Complaint | null> {
    const { error } = await this.client.from('complaints').update({ status, updated_at: entry.createdAt }).eq('id', id); fail(error);
    const result = await this.client.from('status_history').insert({ id: entry.id, complaint_id: id, status: entry.status, note: entry.note, actor_id: entry.actorId, created_at: entry.createdAt }); fail(result.error);
    return this.getComplaint(id);
  }

  async addAssignment(id: string, assignment: Assignment): Promise<Complaint | null> {
    const { error } = await this.client.from('assignments').insert({ id: assignment.id, complaint_id: id, department: assignment.department, assignee_id: assignment.assigneeId, assigned_by: assignment.assignedBy, created_at: assignment.createdAt }); fail(error);
    const entry: StatusHistoryEntry = { id: crypto.randomUUID(), status: 'assigned', note: `Assigned to ${assignment.department}/${assignment.assigneeId}`, actorId: assignment.assignedBy, createdAt: assignment.createdAt };
    return this.addStatus(id, entry, 'assigned');
  }

  async addEvidence(id: string, evidence: Evidence): Promise<Complaint | null> {
    const { error } = await this.client.from('evidence').insert(this.evidenceRow(id, evidence)); fail(error);
    return this.getComplaint(id);
  }

  async setVerification(id: string, verification: Verification, status: ComplaintStatus): Promise<Complaint | null> {
    const { error } = await this.client.from('verification').upsert({ complaint_id: id, visual_score: verification.visualScore, gps_distance_meters: verification.gpsDistanceMeters, confidence: verification.confidence, passed: verification.passed, notes: verification.notes, source: verification.source, created_at: verification.createdAt }, { onConflict: 'complaint_id' }); fail(error);
    return this.addStatus(id, { id: crypto.randomUUID(), status, note: verification.passed ? 'Resolution automatically verified' : 'Verification failed; complaint reopened', actorId: 'ai-verifier', createdAt: verification.createdAt }, status);
  }

  async getDepartments(): Promise<Department[]> {
    const dashboard = await this.dashboard();
    const { data, error } = await this.client.from('departments').select('*').eq('active', true).order('name'); fail(error);
    const source = data?.length ? data.map((item: any) => ({ code: item.code, name: item.name, description: item.description, activeCases: 0 })) : demoDepartments;
    return source.map((item: Department) => ({ ...item, activeCases: dashboard.byDepartment[item.code] ?? 0 }));
  }

  async getNotifications(userId?: string): Promise<Notification[]> {
    let query = this.client.from('notifications').select('*').order('created_at', { ascending: false }).limit(100);
    if (userId) query = query.eq('user_id', userId);
    const { data, error } = await query; fail(error);
    return (data ?? []).map((item: any) => ({ id: item.id, userId: item.user_id, ...(item.complaint_id ? { complaintId: item.complaint_id } : {}), title: item.title, message: item.message, read: item.read, createdAt: item.created_at }));
  }

  async addNotification(notification: Notification): Promise<void> {
    const { error } = await this.client.from('notifications').insert({ id: notification.id, user_id: notification.userId, complaint_id: notification.complaintId ?? null, title: notification.title, message: notification.message, read: notification.read, created_at: notification.createdAt }); fail(error);
  }

  async dashboard(): Promise<DashboardData> { return buildDashboard(await this.getAllComplaints()); }

  private evidenceRow(complaintId: string, item: Evidence): Record<string, unknown> {
    return { id: item.id, complaint_id: complaintId, kind: item.kind, url: item.url, mime_type: item.mimeType, size_bytes: item.sizeBytes, latitude: item.latitude ?? null, longitude: item.longitude ?? null, created_at: item.createdAt };
  }
}
