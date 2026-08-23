import { describe, expect, it } from 'vitest';
import { calculateSla, SLA_HOURS } from '../src/services/slaEngine.js';

describe('SLA engine', () => {
  it('exposes exact response/resolution thresholds', () => {
    expect(SLA_HOURS).toEqual({ critical: { response: 6, resolution: 6 }, high: { response: 12, resolution: 12 }, medium: { response: 48, resolution: 48 }, low: { response: 120, resolution: 120 } });
  });

  it('calculates absolute due dates', () => {
    expect(calculateSla('critical', new Date('2026-01-01T00:00:00.000Z'))).toEqual({ responseDueAt: '2026-01-01T06:00:00.000Z', resolutionDueAt: '2026-01-01T06:00:00.000Z' });
  });
});
