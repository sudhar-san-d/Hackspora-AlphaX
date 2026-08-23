import { createDemoComplaints, createDemoNotifications, demoDepartments } from '../data/demoSeed.js';
import type { Assignment, Complaint, ComplaintStatus, Department, DepartmentCode, Evidence, Notification, Priority, StatusHistoryEntry, Verification } from '../types.js';
import type { ComplaintFilters, DashboardData, PaginatedComplaints, Repository } from './repository.js';

const clone = <T>(value: T): T => structuredClone(value);
const openStatuses: ComplaintStatus[] = ['submitted', 'triaged', 'assigned', 'in_progress', 'resolved_pending_verification', 'reopened'];

export function buildDashboard(complaints: Complaint[], now = new Date()): DashboardData {
  const byPriority = { critical: 0, high: 0, medium: 0, low: 0 } satisfies Record<Priority, number>;
  const byStatus: Partial<Record<ComplaintStatus, number>> = {};
  const byDepartment: Partial<Record<DepartmentCode, number>> = {};
  for (const complaint of complaints) {
    byPriority[complaint.priority] += 1;
    byStatus[complaint.status] = (byStatus[complaint.status] ?? 0) + 1;
    for (const department of complaint.decision.departments) byDepartment[department] = (byDepartment[department] ?? 0) + 1;
  }
  const open = complaints.filter((item) => openStatuses.includes(item.status));
  return {
    totals: {
      all: complaints.length,
      open: open.length,
      resolved: complaints.filter((item) => item.status === 'resolved').length,
      overdue: open.filter((item) => new Date(item.decision.resolutionDueAt) < now).length,
    },
    byPriority,
    byStatus,
    byDepartment,
    recent: [...complaints].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
  };
}

export class MemoryRepository implements Repository {
  private complaints = createDemoComplaints();
  private notifications = createDemoNotifications();

  async createComplaint(complaint: Complaint): Promise<Complaint> {
    this.complaints.unshift(clone(complaint));
    return clone(complaint);
  }

  async listComplaints(filters: ComplaintFilters): Promise<PaginatedComplaints> {
    let items = [...this.complaints];
    if (filters.status) items = items.filter((item) => item.status === filters.status);
    if (filters.priority) items = items.filter((item) => item.priority === filters.priority);
    if (filters.category) items = items.filter((item) => item.category === filters.category || item.secondaryCategories.includes(filters.category!));
    if (filters.department) items = items.filter((item) => item.decision.departments.includes(filters.department!));
    if (filters.search) {
      const search = filters.search.toLowerCase();
      items = items.filter((item) => `${item.reference} ${item.title} ${item.description} ${item.address}`.toLowerCase().includes(search));
    }
    items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const total = items.length;
    const start = (filters.page - 1) * filters.pageSize;
    return { items: clone(items.slice(start, start + filters.pageSize)), page: filters.page, pageSize: filters.pageSize, total, totalPages: Math.ceil(total / filters.pageSize) };
  }

  async getComplaint(idOrReference: string): Promise<Complaint | null> {
    const item = this.complaints.find((complaint) => complaint.id === idOrReference || complaint.reference.toLowerCase() === idOrReference.toLowerCase());
    return item ? clone(item) : null;
  }

  async getAllComplaints(): Promise<Complaint[]> { return clone(this.complaints); }

  async addStatus(id: string, entry: StatusHistoryEntry, status: ComplaintStatus): Promise<Complaint | null> {
    const item = this.findMutable(id);
    if (!item) return null;
    item.status = status;
    item.updatedAt = entry.createdAt;
    item.statusHistory.push(clone(entry));
    return clone(item);
  }

  async addAssignment(id: string, assignment: Assignment): Promise<Complaint | null> {
    const item = this.findMutable(id);
    if (!item) return null;
    item.assignments.push(clone(assignment));
    item.status = 'assigned';
    item.updatedAt = assignment.createdAt;
    item.statusHistory.push({ id: `history-${assignment.id}`, status: 'assigned', note: `Assigned to ${assignment.department}/${assignment.assigneeId}`, actorId: assignment.assignedBy, createdAt: assignment.createdAt });
    return clone(item);
  }

  async addEvidence(id: string, evidence: Evidence): Promise<Complaint | null> {
    const item = this.findMutable(id);
    if (!item) return null;
    item.evidence.push(clone(evidence));
    item.updatedAt = evidence.createdAt;
    return clone(item);
  }

  async setVerification(id: string, verification: Verification, status: ComplaintStatus): Promise<Complaint | null> {
    const item = this.findMutable(id);
    if (!item) return null;
    item.verification = clone(verification);
    item.status = status;
    item.updatedAt = verification.createdAt;
    item.statusHistory.push({ id: `history-${verification.id}`, status, note: verification.passed ? 'Resolution automatically verified' : 'Verification failed; complaint reopened', actorId: 'ai-verifier', createdAt: verification.createdAt });
    return clone(item);
  }

  async getDepartments(): Promise<Department[]> {
    const active = await this.dashboard();
    return demoDepartments.map((department) => ({ ...department, activeCases: active.byDepartment[department.code] ?? 0 }));
  }

  async getNotifications(userId?: string): Promise<Notification[]> {
    const items = userId ? this.notifications.filter((item) => item.userId === userId) : this.notifications;
    return clone([...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  }

  async addNotification(notification: Notification): Promise<void> { this.notifications.unshift(clone(notification)); }
  async dashboard(): Promise<DashboardData> { return buildDashboard(this.complaints); }
  async reset(): Promise<void> { this.complaints = createDemoComplaints(); this.notifications = createDemoNotifications(); }

  private findMutable(id: string): Complaint | undefined {
    return this.complaints.find((item) => item.id === id || item.reference.toLowerCase() === id.toLowerCase());
  }
}
