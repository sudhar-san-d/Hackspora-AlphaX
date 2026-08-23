import type { Complaint, ComplaintCategory, ComplaintStatus, Department, DepartmentCode, Evidence, Notification, Priority, PriorityBreakdown } from '../types.js';

interface SeedDefinition {
  title: string;
  description: string;
  category: ComplaintCategory;
  secondary?: ComplaintCategory[];
  priority: Priority;
  score: number;
  status: ComplaintStatus;
  department: DepartmentCode;
  address: string;
  lat: number;
  lng: number;
}

const definitions: SeedDefinition[] = [
  { title: 'Deep pothole beside school crossing', description: 'Large deep pothole beside Central School and the Route 4 bus stop; buses swerve into traffic.', category: 'pothole', priority: 'critical', score: 85, status: 'resolved', department: 'roads', address: 'Central School Rd & 5th Ave', lat: 13.08270, lng: 80.27070 },
  { title: 'Open drain at hospital entrance', description: 'Uncovered storm drain directly outside the emergency entrance with heavy pedestrian traffic.', category: 'open_drain', priority: 'critical', score: 88, status: 'assigned', department: 'drainage', address: 'General Hospital, North Gate', lat: 13.08710, lng: 80.27810 },
  { title: 'Burst main flooding intersection', description: 'Major water main burst is flooding two lanes and disabling the signal approach.', category: 'water_leakage', secondary: ['road_damage'], priority: 'critical', score: 82, status: 'in_progress', department: 'water', address: 'Harbor Rd & Market St', lat: 13.09020, lng: 80.28340 },
  { title: 'Traffic signal dark at junction', description: 'All traffic lights are dark at a busy four-way junction during peak hour.', category: 'traffic_signal', priority: 'high', score: 72, status: 'in_progress', department: 'traffic', address: 'Anna Blvd & Lake Rd', lat: 13.07540, lng: 80.25120 },
  { title: 'Garbage blocking market lane', description: 'Large dumped garbage pile blocks access behind the public market and attracts animals.', category: 'garbage', priority: 'high', score: 68, status: 'assigned', department: 'sanitation', address: 'Old Market Lane', lat: 13.08130, lng: 80.26420 },
  { title: 'Collapsed road shoulder', description: 'Road shoulder has collapsed beside a bus route, forcing cyclists into the vehicle lane.', category: 'road_damage', priority: 'high', score: 64, status: 'submitted', department: 'roads', address: 'Canal Bank Rd, Ward 3', lat: 13.09620, lng: 80.26010 },
  { title: 'Sewage overflow near apartments', description: 'Sewage is overflowing across the apartment entrance and footpath.', category: 'sewage', priority: 'high', score: 77, status: 'in_progress', department: 'drainage', address: 'Green Court Apartments', lat: 13.07080, lng: 80.26790 },
  { title: 'Flooded pedestrian underpass', description: 'Standing water fills the pedestrian underpass after rain and blocks safe passage.', category: 'flooding', priority: 'high', score: 61, status: 'triaged', department: 'drainage', address: 'East Station Underpass', lat: 13.08400, lng: 80.29110 },
  { title: 'Broken streetlight on footpath', description: 'Streetlight has failed along a frequently used evening footpath.', category: 'broken_streetlight', priority: 'medium', score: 52, status: 'assigned', department: 'electrical', address: 'Library Walk, Pole E-142', lat: 13.07920, lng: 80.27230 },
  { title: 'Potholes along residential street', description: 'Several potholes make the residential street difficult for two-wheelers.', category: 'pothole', priority: 'medium', score: 48, status: 'in_progress', department: 'roads', address: 'Jasmine Street, Ward 6', lat: 13.10120, lng: 80.24990 },
  { title: 'Water leak undermining pavement', description: 'Steady pipe leak is washing material from beneath the pavement edge.', category: 'water_leakage', secondary: ['road_damage'], priority: 'medium', score: 55, status: 'assigned', department: 'water', address: 'Temple Rd near No. 18', lat: 13.06870, lng: 80.28150 },
  { title: 'Overflowing public bins', description: 'Three public bins have overflowed since the weekend.', category: 'garbage', priority: 'medium', score: 41, status: 'submitted', department: 'sanitation', address: 'Riverside Park South Gate', lat: 13.09310, lng: 80.27360 },
  { title: 'Missing drain grate', description: 'Drain grate is missing beside a bicycle lane and needs a barrier.', category: 'open_drain', priority: 'medium', score: 58, status: 'triaged', department: 'drainage', address: 'College Ave Cycle Lane', lat: 13.07720, lng: 80.25810 },
  { title: 'Streetlight flickering nightly', description: 'Lamp alternates on and off every few minutes along the block.', category: 'broken_streetlight', priority: 'medium', score: 45, status: 'resolved_pending_verification', department: 'electrical', address: 'Beach Rd, Pole B-77', lat: 13.05830, lng: 80.28440 },
  { title: 'Cracked asphalt at lane edge', description: 'Asphalt has cracked and lifted along approximately four metres of the lane edge.', category: 'road_damage', priority: 'medium', score: 37, status: 'submitted', department: 'roads', address: 'Museum Crescent', lat: 13.07410, lng: 80.28620 },
  { title: 'Small pothole in parking bay', description: 'A shallow pothole is forming in a low-speed public parking bay.', category: 'pothole', priority: 'low', score: 28, status: 'triaged', department: 'roads', address: 'Civic Centre Parking B', lat: 13.08820, lng: 80.26910 },
  { title: 'Litter beside community hall', description: 'Several bags and loose litter were left beside the community hall bins.', category: 'garbage', priority: 'low', score: 22, status: 'submitted', department: 'sanitation', address: 'West Ward Community Hall', lat: 13.10210, lng: 80.27540 },
  { title: 'Single park lamp out', description: 'One lamp is not working in the small neighborhood park.', category: 'broken_streetlight', priority: 'low', score: 31, status: 'assigned', department: 'electrical', address: 'Lotus Pocket Park', lat: 13.06550, lng: 80.25480 },
  { title: 'Slow tap-box leak', description: 'A slow clean-water leak is visible inside the roadside meter box.', category: 'water_leakage', priority: 'low', score: 18, status: 'resolved', department: 'water', address: '22 Orchard Close', lat: 13.09770, lng: 80.28820 },
  { title: 'Faded patch breaking up', description: 'An old utility patch is beginning to crumble on a quiet service road.', category: 'road_damage', priority: 'low', score: 12, status: 'submitted', department: 'roads', address: 'Depot Service Rd', lat: 13.06120, lng: 80.26270 },
];

function breakdown(score: number, first = false): PriorityBreakdown {
  if (first) return { severity: 32, safety: 20, vulnerability: 15, location: 13, spread: 5 };
  const caps = [35, 25, 15, 15, 10];
  const ratios = [0.35, 0.25, 0.15, 0.15, 0.10];
  const values = ratios.map((ratio, index) => Math.min(caps[index]!, Math.floor(score * ratio)));
  let remainder = score - values.reduce((sum, value) => sum + value, 0);
  for (let i = 0; remainder > 0; i = (i + 1) % values.length) {
    if (values[i]! < caps[i]!) { values[i]! += 1; remainder -= 1; }
  }
  return { severity: values[0]!, safety: values[1]!, vulnerability: values[2]!, location: values[3]!, spread: values[4]! };
}

const departmentNames: Record<DepartmentCode, string> = {
  roads: 'Roads & Highways', sanitation: 'Sanitation', water: 'Water Services', drainage: 'Drainage & Sewerage',
  electrical: 'Street Lighting', traffic: 'Traffic Management', public_safety: 'Public Safety',
};

export const demoDepartments: Department[] = (Object.keys(departmentNames) as DepartmentCode[]).map((code) => ({
  code, name: departmentNames[code], description: `Municipal ${departmentNames[code].toLowerCase()} response team`, activeCases: 0,
}));

export function createDemoComplaints(): Complaint[] {
  return definitions.map((definition, index) => {
    const sequence = String(index + 1).padStart(12, '0');
    const id = `00000000-0000-4000-8000-${sequence}`;
    const reference = `CT-${1001 + index}`;
    const createdAt = new Date(Date.UTC(2026, 7, 1 + index, 8, 0, 0)).toISOString();
    const updatedAt = new Date(Date.UTC(2026, 7, 2 + index, 12, 0, 0)).toISOString();
    const priorityBreakdown = breakdown(definition.score, index === 0);
    const departments = definition.secondary?.includes('road_damage')
      ? [...new Set([definition.department, 'roads' as DepartmentCode, 'traffic' as DepartmentCode])]
      : [definition.department];
    const initialEvidence = {
      id: `evidence-initial-${index + 1}`, kind: 'initial' as const,
      url: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><rect width="100%" height="100%" fill="#d8d1c5"/><text x="30" y="60" font-size="28">${reference} demo evidence</text></svg>`)}`,
      mimeType: 'image/svg+xml', sizeBytes: 240, latitude: definition.lat, longitude: definition.lng, createdAt,
    };
    const evidence: Evidence[] = [initialEvidence];
    if (['resolved', 'resolved_pending_verification'].includes(definition.status)) evidence.push({
      id: `evidence-resolution-${index + 1}`, kind: 'resolution', url: initialEvidence.url,
      mimeType: 'image/svg+xml', sizeBytes: 240, latitude: definition.lat + (index === 0 ? 0.00005 : 0.0001), longitude: definition.lng + 0.00005, createdAt: updatedAt,
    });
    const analysis = {
      category: definition.category, secondaryCategories: definition.secondary ?? [], severity: Math.min(100, Math.round(definition.score * 1.1)), confidence: 0.89,
      observedFacts: [`Demo evidence associated with ${definition.category.replace('_', ' ')} report.`], hazards: definition.score >= 60 ? ['Public safety or access impact'] : [],
      imageQuality: 'clear' as const, requiresHumanReview: false, source: 'openrouter' as const,
    };
    const decision = {
      category: definition.category, priority: definition.priority, priorityScore: definition.score, priorityBreakdown, departments,
      responseDueAt: new Date(new Date(createdAt).getTime() + ({ critical: 6, high: 12, medium: 48, low: 120 }[definition.priority]) * 3_600_000).toISOString(),
      resolutionDueAt: new Date(new Date(createdAt).getTime() + ({ critical: 6, high: 12, medium: 48, low: 120 }[definition.priority]) * 3_600_000).toISOString(),
      reasoning: [`Seeded deterministic priority score ${definition.score}/100.`, `Routed to ${departments.join(', ')}.`], requiresHumanReview: false, source: 'deterministic_fallback' as const,
    };
    return {
      id, reference, title: definition.title, description: definition.description, category: definition.category,
      secondaryCategories: definition.secondary ?? [], status: definition.status, priority: definition.priority,
      priorityScore: definition.score, priorityBreakdown, latitude: definition.lat, longitude: definition.lng,
      address: definition.address, reporterId: `demo-citizen-${(index % 5) + 1}`, analysis, decision, createdAt, updatedAt,
      statusHistory: [
        { id: `history-${index + 1}-1`, status: 'submitted', note: 'Complaint submitted', actorId: `demo-citizen-${(index % 5) + 1}`, createdAt },
        { id: `history-${index + 1}-2`, status: definition.status, note: `Demo case moved to ${definition.status}`, actorId: 'demo-dispatcher-1', createdAt: updatedAt },
      ],
      assignments: [{ id: `assignment-${index + 1}`, department: definition.department, assigneeId: `demo-worker-${(index % 4) + 1}`, assignedBy: 'demo-dispatcher-1', createdAt: updatedAt }],
      evidence,
      ...(index === 0 ? { verification: { id: 'verification-ct-1001', visualScore: 91, gpsDistanceMeters: 8, confidence: 0.93, passed: true, notes: ['Pothole fill is visibly level with surrounding asphalt.', 'GPS evidence is within the 100 metre threshold.'], source: 'demo_seed' as const, createdAt: updatedAt } } : {}),
    };
  });
}

export function createDemoNotifications(): Notification[] {
  return [
    { id: 'notification-1', userId: 'demo-citizen-1', complaintId: '00000000-0000-4000-8000-000000000001', title: 'CT-1001 resolved', message: 'Your pothole report was resolved and verified at 93% confidence.', read: false, createdAt: '2026-08-23T09:00:00.000Z' },
    { id: 'notification-2', userId: 'demo-dispatcher-1', complaintId: '00000000-0000-4000-8000-000000000003', title: 'Critical multi-agency case', message: 'Water, roads, and traffic teams are required for CT-1003.', read: false, createdAt: '2026-08-23T08:30:00.000Z' },
  ];
}
