import type { DecisionFactors, Member2Request, Member2Response } from '../schemas/aiContracts.js';
import { DEPARTMENT_NAMES } from '../config/departments.js';
import { inferCategories } from './fuzzyRules.js';
import { routeDepartments } from './departmentRouter.js';
import { calculatePublicPriority, PUBLIC_SLA_HOURS } from './publicPriorityEngine.js';
import type { ComplaintCategory, DepartmentCode, ImageAnalysis } from '../types.js';

const issueLabels: Record<ComplaintCategory, { category: string; subcategory: string; issue: string }> = {
  pothole: { category: 'Road Infrastructure', subcategory: 'Road Damage', issue: 'Pothole' },
  road_damage: { category: 'Road Infrastructure', subcategory: 'Road Damage', issue: 'Road Damage' },
  garbage: { category: 'Solid Waste', subcategory: 'Waste Accumulation', issue: 'Garbage Accumulation' },
  open_drain: { category: 'Drainage Infrastructure', subcategory: 'Drain Safety', issue: 'Open Drain' },
  broken_streetlight: { category: 'Electrical Infrastructure', subcategory: 'Street Lighting', issue: 'Broken Streetlight' },
  water_leakage: { category: 'Water Infrastructure', subcategory: 'Distribution Leak', issue: 'Water Leakage' },
  traffic_signal: { category: 'Traffic Infrastructure', subcategory: 'Signal Failure', issue: 'Traffic Signal' },
  flooding: { category: 'Drainage Infrastructure', subcategory: 'Urban Flooding', issue: 'Flooding' },
  sewage: { category: 'Sewerage Infrastructure', subcategory: 'Sewage Overflow', issue: 'Sewage Overflow' },
  other: { category: 'General Civic Infrastructure', subcategory: 'Manual Review', issue: 'Unknown' },
};

function contractCategory(input: Member2Request): ComplaintCategory {
  const issue = `${input.image_analysis.detected_issue} ${input.citizen.description}`.toLowerCase();
  return inferCategories(issue)[0] ?? (input.image_analysis.detected_issue === 'Unknown' ? 'other' : 'other');
}

export function deterministicDecisionFactors(input: Member2Request): DecisionFactors {
  const category = contractCategory(input);
  const labels = issueLabels[category];
  const text = `${input.citizen.description} ${input.image_analysis.safety_indicators.join(' ')}`.toLowerCase();
  const sensitive = input.location.nearby_sensitive_places.map((place) => place.toLowerCase());
  const nearSchool = sensitive.some((place) => place.includes('school'));
  const nearHospital = sensitive.some((place) => place.includes('hospital'));
  const nearTransit = /bus|station|transit/.test(`${input.location.nearby_landmark ?? ''} ${text}`);
  const publicAccess = /road|street|footpath|sidewalk|market|park|public|bus/.test(text);
  const electricalHazard = /electrical|wire|electrocution/.test(text);
  const sewageHazard = category === 'sewage' || /sewage|sewer/.test(text);
  const highTraffic = input.location.traffic_level === 'HIGH' || /high.?traffic|main road|intersection|bus stop/.test(text);
  const pedestrianHazard = /pedestrian|footpath|sidewalk|crossing|school/.test(text);
  const baseSeverity = input.image_analysis.confidence < 0.45 ? 0 : input.image_analysis.estimated_visual_severity;
  const urgency = Math.min(10, Math.max(baseSeverity, electricalHazard && publicAccess ? 9 : 0, sewageHazard && nearHospital ? 10 : 0, category === 'pothole' && highTraffic ? 9 : 0));
  const publicRisk = Math.min(10, Math.max(baseSeverity, input.image_analysis.safety_indicators.length ? baseSeverity + 1 : baseSeverity, sewageHazard && nearHospital ? 10 : 0));
  const locationRisk = Math.min(10, Math.max(nearSchool && pedestrianHazard ? 9 : 0, nearHospital ? 9 : 0, nearTransit ? 8 : 0, baseSeverity));
  const populationImpact = Math.min(10, Math.max(highTraffic ? 7 : 4, nearTransit ? 7 : 0, nearSchool ? 7 : 0));
  const slaRisk = Math.min(10, Math.max(baseSeverity >= 8 ? 6 : 3, electricalHazard || sewageHazard ? 7 : 0));
  const context = [highTraffic && 'high-traffic route', nearSchool && 'school', nearHospital && 'hospital', nearTransit && 'public transit'].filter(Boolean).join(', ');
  return {
    ...labels,
    severity: baseSeverity,
    urgency,
    public_risk: publicRisk,
    population_impact: populationImpact,
    location_risk: locationRisk,
    sla_risk: slaRisk,
    confidence: Math.max(0.35, Math.min(0.98, input.image_analysis.confidence)),
    reason: input.image_analysis.detected_issue === 'Unknown'
      ? 'The image is inconclusive, so this report requires manual review before field dispatch.'
      : `${labels.issue} detected${context ? ` near ${context}` : ''}. Visible damage and reported safety context determine the response priority.`,
  };
}

export function buildMember2Response(input: Member2Request, factors: DecisionFactors, duplicateConfidence = 0.12): Member2Response {
  const category = contractCategory(input);
  const internalAnalysis: Pick<ImageAnalysis, 'category' | 'secondaryCategories' | 'hazards'> = {
    category,
    secondaryCategories: inferCategories(input.citizen.description).filter((item) => item !== category),
    hazards: input.image_analysis.safety_indicators,
  };
  const trafficImpact = /traffic signal|intersection blocked|lane blocked|road blocked|blocks? traffic/.test(input.citizen.description.toLowerCase());
  const departments = routeDepartments(input.citizen.description, internalAnalysis, trafficImpact);
  const routed = departments.length ? departments : ['public_safety' as DepartmentCode];
  const primary = routed[0]!;
  const priority = calculatePublicPriority(factors);
  return {
    complaint_id: input.complaint_id,
    classification: { category: factors.category, subcategory: factors.subcategory, issue: factors.issue },
    responsibility: {
      primary_department: DEPARTMENT_NAMES[primary],
      secondary_departments: routed.slice(1).map((department) => DEPARTMENT_NAMES[department]),
      multi_agency: routed.length > 1,
    },
    priority: {
      severity: factors.severity,
      urgency: factors.urgency,
      public_risk: factors.public_risk,
      population_impact: factors.population_impact,
      location_risk: factors.location_risk,
      sla_risk: factors.sla_risk,
      priority_score: priority.score,
      priority_level: priority.level,
    },
    sla: { target_hours: PUBLIC_SLA_HOURS[priority.level] },
    location: {
      latitude: input.location.latitude,
      longitude: input.location.longitude,
      ward: input.location.ward,
      zone: input.location.zone,
    },
    incident: { possible_duplicate: duplicateConfidence >= 0.72, duplicate_confidence: duplicateConfidence },
    ai: { confidence: factors.confidence, reason: factors.reason },
  };
}
