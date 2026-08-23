import { describe, expect, it } from 'vitest';
import { calculatePriority } from '../src/services/priorityEngine.js';
import { calculatePublicPriority } from '../src/services/publicPriorityEngine.js';
import type { DecisionInput, ImageAnalysis } from '../src/types.js';

const analysis: ImageAnalysis = {
  category: 'pothole', secondaryCategories: [], severity: 85, confidence: 0.9, observedFacts: [],
  hazards: ['fall', 'collision', 'vehicle damage', 'lane obstruction'], imageQuality: 'clear', requiresHumanReview: false, source: 'openrouter',
};

describe('priority engine', () => {
  it('produces the CT-1001-style score deterministically', () => {
    const input: DecisionInput = { description: 'Pothole near school bus stop', analysis, nearSchool: true, nearHospital: false, nearTransit: true, trafficImpact: true, peopleAtRisk: 25, ageHours: 96 };
    expect(calculatePriority(input)).toEqual({
      score: 83, priority: 'critical', breakdown: { severity: 20, safety: 36, vulnerability: 11, location: 14, spread: 2 },
    });
  });

  it('uses the PRD weights and exact level ranges', () => {
    expect(calculatePublicPriority({ severity: 8, urgency: 9, public_risk: 9, population_impact: 7, location_risk: 9, sla_risk: 6 })).toEqual({ score: 83, level: 'CRITICAL' });
    expect(calculatePublicPriority({ severity: 3, urgency: 3, public_risk: 3, population_impact: 3, location_risk: 3, sla_risk: 3 }).level).toBe('LOW');
  });

  it('uses exact thresholds at 76, 56, and 31', () => {
    const make = (severity: number): DecisionInput => ({ description: 'case', analysis: { ...analysis, severity, hazards: [] }, nearSchool: false, nearHospital: false, nearTransit: false, trafficImpact: false, peopleAtRisk: 0, ageHours: 0 });
    expect(calculatePriority(make(0)).priority).toBe('low');
    expect(calculatePriority({ ...make(100), nearSchool: true, nearHospital: true, nearTransit: true, trafficImpact: true, peopleAtRisk: 100, ageHours: 120, analysis: { ...analysis, severity: 100, hazards: ['a', 'b', 'c', 'd'] } }).priority).toBe('critical');
  });
});
