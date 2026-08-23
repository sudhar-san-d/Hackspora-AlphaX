import { describe, expect, it } from 'vitest';
import { createDemoComplaints } from '../src/data/demoSeed.js';
import { haversineMeters } from '../src/services/duplicateDetection.js';
import { deterministicVerification } from '../src/services/verification.js';

describe('verification', () => {
  it('calculates Haversine distance and requires all thresholds', () => {
    const complaint = createDemoComplaints()[0]!;
    expect(haversineMeters(complaint, { latitude: complaint.latitude, longitude: complaint.longitude })).toBe(0);
    const result = deterministicVerification(complaint, 91, 0.93, new Date('2026-08-23T00:00:00.000Z'));
    expect(result.passed).toBe(true);
    expect(result.gpsDistanceMeters).toBeLessThan(100);
  });

  it('fails unclear visual evidence even with valid GPS', () => {
    const complaint = createDemoComplaints()[0]!;
    expect(deterministicVerification(complaint, 0, 0).passed).toBe(false);
  });
});
