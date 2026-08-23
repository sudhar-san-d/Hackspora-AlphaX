export interface PriorityFactors {
  severity: number;
  urgency: number;
  public_risk: number;
  population_impact: number;
  location_risk: number;
  sla_risk: number;
}

export type PublicPriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

const clampFactor = (value: number) => Math.max(0, Math.min(10, Math.round(value)));

export function calculatePublicPriority(factors: PriorityFactors): { score: number; level: PublicPriorityLevel } {
  const normalized = {
    severity: clampFactor(factors.severity),
    urgency: clampFactor(factors.urgency),
    public_risk: clampFactor(factors.public_risk),
    population_impact: clampFactor(factors.population_impact),
    location_risk: clampFactor(factors.location_risk),
    sla_risk: clampFactor(factors.sla_risk),
  };
  const score = Math.round((
    normalized.severity * 0.25
    + normalized.urgency * 0.20
    + normalized.public_risk * 0.20
    + normalized.population_impact * 0.15
    + normalized.location_risk * 0.15
    + normalized.sla_risk * 0.05
  ) * 10);
  const level: PublicPriorityLevel = score <= 30 ? 'LOW' : score <= 55 ? 'MEDIUM' : score <= 75 ? 'HIGH' : 'CRITICAL';
  return { score, level };
}

export const PUBLIC_SLA_HOURS: Record<PublicPriorityLevel, 6 | 12 | 48 | 120> = {
  CRITICAL: 6,
  HIGH: 12,
  MEDIUM: 48,
  LOW: 120,
};
