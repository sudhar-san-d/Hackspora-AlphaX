import type { Assignment, Complaint, ComplaintCategory, ComplaintStatus, Department, DepartmentCode, Evidence, Notification, Priority, StatusHistoryEntry, Verification } from '../types.js';

export interface ComplaintFilters {
  page: number;
  pageSize: number;
  status?: ComplaintStatus;
  priority?: Priority;
  category?: ComplaintCategory;
  department?: DepartmentCode;
  search?: string;
}

export interface PaginatedComplaints { items: Complaint[]; page: number; pageSize: number; total: number; totalPages: number }

export interface DashboardData {
  totals: { all: number; open: number; resolved: number; overdue: number };
  byPriority: Record<Priority, number>;
  byStatus: Partial<Record<ComplaintStatus, number>>;
  byDepartment: Partial<Record<DepartmentCode, number>>;
  recent: Complaint[];
}

export interface Repository {
  createComplaint(complaint: Complaint): Promise<Complaint>;
  listComplaints(filters: ComplaintFilters): Promise<PaginatedComplaints>;
  getComplaint(idOrReference: string): Promise<Complaint | null>;
  getAllComplaints(): Promise<Complaint[]>;
  addStatus(id: string, entry: StatusHistoryEntry, status: ComplaintStatus): Promise<Complaint | null>;
  addAssignment(id: string, assignment: Assignment): Promise<Complaint | null>;
  addEvidence(id: string, evidence: Evidence): Promise<Complaint | null>;
  setVerification(id: string, verification: Verification, status: ComplaintStatus): Promise<Complaint | null>;
  getDepartments(): Promise<Department[]>;
  getNotifications(userId?: string): Promise<Notification[]>;
  addNotification(notification: Notification): Promise<void>;
  dashboard(): Promise<DashboardData>;
  reset?(): Promise<void>;
}
