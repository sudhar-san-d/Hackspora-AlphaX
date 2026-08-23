import type { ComplaintCategory, DepartmentCode, ImageAnalysis } from '../types.js';
import { inferCategories } from './fuzzyRules.js';

const primaryRoutes: Record<ComplaintCategory, DepartmentCode[]> = {
  pothole: ['roads'],
  garbage: ['sanitation'],
  open_drain: ['drainage', 'public_safety'],
  broken_streetlight: ['electrical'],
  water_leakage: ['water'],
  road_damage: ['roads'],
  traffic_signal: ['traffic', 'electrical'],
  flooding: ['drainage', 'roads'],
  sewage: ['drainage', 'water'],
  other: ['public_safety'],
};

export function routeDepartments(description: string, analysis: Pick<ImageAnalysis, 'category' | 'secondaryCategories' | 'hazards'>, trafficImpact = false): DepartmentCode[] {
  const categories = new Set<ComplaintCategory>([analysis.category, ...analysis.secondaryCategories, ...inferCategories(description)]);
  const departments = new Set<DepartmentCode>();
  for (const category of categories) for (const department of primaryRoutes[category]) departments.add(department);
  const combined = `${description} ${analysis.hazards.join(' ')}`.toLowerCase();
  if (trafficImpact || /traffic|intersection|lane|bus route|road blocked/.test(combined)) departments.add('traffic');
  if (categories.has('water_leakage') && (categories.has('road_damage') || /road|asphalt|pavement/.test(combined))) departments.add('roads');
  return [...departments];
}
