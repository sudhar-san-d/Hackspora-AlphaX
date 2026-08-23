import type { Complaint, ComplaintCategory, Coordinates } from '../types.js';

export function haversineMeters(a: Coordinates, b: Coordinates): number {
  const radius = 6_371_000;
  const toRad = (degrees: number) => degrees * Math.PI / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon;
  return 2 * radius * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function findDuplicate(complaints: Complaint[], point: Coordinates, categories: ComplaintCategory[], maxMeters = 100): Complaint | undefined {
  const categorySet = new Set(categories);
  return complaints
    .filter((item) => !['resolved', 'rejected'].includes(item.status))
    .filter((item) => categorySet.has(item.category) || item.secondaryCategories.some((category) => categorySet.has(category)))
    .map((item) => ({ item, distance: haversineMeters(point, item) }))
    .filter(({ distance }) => distance <= maxMeters)
    .sort((a, b) => a.distance - b.distance)[0]?.item;
}
