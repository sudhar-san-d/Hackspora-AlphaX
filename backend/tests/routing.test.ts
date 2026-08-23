import { describe, expect, it } from 'vitest';
import { routeDepartments } from '../src/services/departmentRouter.js';
import type { ComplaintCategory } from '../src/types.js';

const route = (category: ComplaintCategory, description: string, secondaryCategories: ComplaintCategory[] = [], trafficImpact = false) =>
  routeDepartments(description, { category, secondaryCategories, hazards: [] }, trafficImpact);

describe('department routing', () => {
  it.each([
    ['pothole', 'Deep pothole in road', ['roads']],
    ['garbage', 'Garbage pile', ['sanitation']],
    ['open_drain', 'Open drain by walkway', ['drainage', 'public_safety']],
    ['broken_streetlight', 'Broken streetlight', ['electrical']],
  ] as const)('routes %s', (category, description, expected) => {
    expect(route(category, description)).toEqual(expect.arrayContaining(expected));
  });

  it('supports water, road, and traffic multi-agency response', () => {
    expect(route('water_leakage', 'Burst water pipe damaged the road and blocks a traffic lane', ['road_damage'], true))
      .toEqual(expect.arrayContaining(['water', 'roads', 'traffic']));
  });
});
