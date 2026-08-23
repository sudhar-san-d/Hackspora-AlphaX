import type { DecisionInput, Priority, PriorityBreakdown } from '../types.js';
import { calculatePublicPriority } from './publicPriorityEngine.js';

export const PRIORITY_THRESHOLDS = { critical: 76, high: 56, medium: 31 } as const;

const clamp10 = (value: number) => Math.max(0, Math.min(10, Math.round(value)));

export function calculatePriority(input: DecisionInput): { score: number; priority: Priority; breakdown: PriorityBreakdown } {
  const severity = clamp10(Math.floor(input.analysis.severity / 10));
  const urgency = clamp10(Math.max(
    severity,
    input.trafficImpact ? 9 : 0,
    input.analysis.hazards.length ? severity + 1 : severity,
    input.ageHours >= 72 ? 7 : 0,
  ));
  const publicRisk = clamp10(Math.max(severity, input.analysis.hazards.length ? severity + 1 : severity));
  const populationImpact = clamp10(Math.max(
    Math.ceil(input.peopleAtRisk / 5),
    input.nearTransit || input.nearSchool ? 7 : 4,
    input.nearHospital ? 8 : 0,
  ));
  const locationRisk = clamp10(Math.max(
    input.nearSchool ? 9 : 0,
    input.nearHospital ? 9 : 0,
    input.nearTransit ? 8 : 0,
    input.trafficImpact ? 8 : 0,
    severity,
  ));
  const slaRisk = clamp10(Math.max(input.ageHours >= 72 ? 6 : input.ageHours >= 24 ? 4 : 2, severity >= 8 ? 6 : 0));
  const result = calculatePublicPriority({ severity, urgency, public_risk: publicRisk, population_impact: populationImpact, location_risk: locationRisk, sla_risk: slaRisk });
  const priority: Priority = result.level.toLowerCase() as Priority;
  const weighted = {
    severity: Math.round(severity * 2.5),
    safety: Math.round(urgency * 2 + publicRisk * 2),
    vulnerability: Math.round(populationImpact * 1.5),
    location: Math.round(locationRisk * 1.5),
    spread: Math.round(slaRisk * 0.5),
  };
  const difference = result.score - Object.values(weighted).reduce((sum, value) => sum + value, 0);
  const breakdown: PriorityBreakdown = { ...weighted, spread: Math.max(0, weighted.spread + difference) };
  return { score: result.score, priority, breakdown };
}
