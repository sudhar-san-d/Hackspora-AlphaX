import type { ComplaintCategory } from '../types.js';

const rules: Record<ComplaintCategory, string[]> = {
  pothole: ['pothole', 'pot hole', 'road crater', 'deep hole'],
  garbage: ['garbage', 'trash', 'rubbish', 'waste pile', 'dumping'],
  open_drain: ['open drain', 'uncovered drain', 'missing drain cover', 'manhole open'],
  broken_streetlight: ['streetlight', 'street light', 'lamp post', 'dark road', 'light not working'],
  water_leakage: ['water leak', 'leaking pipe', 'burst pipe', 'water main', 'water flowing'],
  road_damage: ['road damage', 'cracked road', 'collapsed road', 'broken asphalt', 'washed out road'],
  traffic_signal: ['traffic signal', 'traffic light', 'signal broken'],
  flooding: ['flood', 'waterlogged', 'standing water'],
  sewage: ['sewage', 'sewer', 'wastewater', 'foul water'],
  other: [],
};

export function inferCategories(text: string): ComplaintCategory[] {
  const normalized = text.toLowerCase().replace(/[_-]/g, ' ').replace(/\s+/g, ' ');
  return (Object.entries(rules) as [ComplaintCategory, string[]][])
    .filter(([, terms]) => terms.some((term) => normalized.includes(term)))
    .map(([category]) => category);
}

export function inferCategory(text: string): ComplaintCategory {
  return inferCategories(text)[0] ?? 'other';
}
