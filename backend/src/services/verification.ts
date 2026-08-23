import type { Complaint, Verification } from '../types.js';
import { haversineMeters } from './duplicateDetection.js';

export function deterministicVerification(complaint: Complaint, visualScore: number, confidence: number, now = new Date()): Verification {
  const resolutionEvidence = [...complaint.evidence].reverse().find((item) => item.kind === 'resolution');
  const gpsDistanceMeters = resolutionEvidence?.latitude !== undefined && resolutionEvidence.longitude !== undefined
    ? Math.round(haversineMeters(complaint, { latitude: resolutionEvidence.latitude, longitude: resolutionEvidence.longitude }) * 10) / 10
    : Number.POSITIVE_INFINITY;
  const passed = visualScore >= 80 && confidence >= 0.75 && gpsDistanceMeters <= 100;
  const notes = [
    visualScore >= 80 ? 'Resolution evidence indicates substantial remediation.' : 'Visual remediation is insufficient or unclear.',
    gpsDistanceMeters <= 100 ? 'Resolution evidence GPS is within 100 metres.' : 'Resolution evidence GPS is missing or outside 100 metres.',
    confidence >= 0.75 ? 'Verification confidence meets threshold.' : 'Verification confidence requires human review.',
  ];
  return {
    id: `ver-${complaint.id}-${now.getTime()}`,
    visualScore,
    gpsDistanceMeters,
    confidence: Math.round(confidence * 100) / 100,
    passed,
    notes,
    source: 'deterministic_fallback',
    createdAt: now.toISOString(),
  };
}
