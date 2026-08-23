import type { Priority } from '../types.js';

export const SLA_HOURS: Record<Priority, { response: number; resolution: number }> = {
  critical: { response: 6, resolution: 6 },
  high: { response: 12, resolution: 12 },
  medium: { response: 48, resolution: 48 },
  low: { response: 120, resolution: 120 },
};

export function calculateSla(priority: Priority, from: Date = new Date()): { responseDueAt: string; resolutionDueAt: string } {
  const thresholds = SLA_HOURS[priority];
  return {
    responseDueAt: new Date(from.getTime() + thresholds.response * 3_600_000).toISOString(),
    resolutionDueAt: new Date(from.getTime() + thresholds.resolution * 3_600_000).toISOString(),
  };
}
