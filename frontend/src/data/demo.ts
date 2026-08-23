import type { Category, Complaint, ComplaintStatus, Evidence, Notification, Priority, User } from '../types'

export const demoUsers: Record<'citizen' | 'officer' | 'admin', User> = {
  citizen: { id: 'USR-C-204', name: 'Maya Thompson', email: 'citizen@demo.com', role: 'citizen' },
  officer: { id: 'USR-O-018', name: 'Elias Morgan', email: 'officer@demo.com', role: 'officer', department: 'Roads Department' },
  admin: { id: 'USR-A-003', name: 'Nadia Okafor', email: 'admin@demo.com', role: 'admin', department: 'Municipal Operations' },
}

const palette: Record<Category, string> = {
  Pothole: '#D97706', Streetlight: '#2563EB', Drainage: '#16A34A', Waste: '#94A3B8',
  Sidewalk: '#D97706', 'Traffic Signal': '#DC2626', 'Water Leak': '#2563EB', Graffiti: '#94A3B8',
}

export function issueImage(category: Category, seed: number, after = false): string {
  const color = after ? '#16A34A' : palette[category]
  const label = after ? 'REPAIR VERIFIED' : category.toUpperCase()
  const detail = after ? 'Completed municipal work' : `Field capture ${String(seed).padStart(2, '0')}`
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 640"><rect width="960" height="640" fill="#172033"/><path d="M0 430L170 315 330 372 520 220 710 327 960 170V640H0Z" fill="#111827"/><path d="M0 522C214 440 328 552 521 468S760 385 960 433" fill="none" stroke="#263244" stroke-width="72"/><path d="M0 522C214 440 328 552 521 468S760 385 960 433" fill="none" stroke="#94A3B8" stroke-opacity=".35" stroke-width="2" stroke-dasharray="18 18"/><rect x="48" y="48" width="304" height="88" fill="#0B1220"/><rect x="48" y="48" width="6" height="88" fill="${color}"/><text x="76" y="84" fill="#F8FAFC" font-family="monospace" font-size="20" font-weight="700">${label}</text><text x="76" y="113" fill="#94A3B8" font-family="sans-serif" font-size="15">${detail}</text><circle cx="760" cy="190" r="62" fill="${color}" fill-opacity=".16"/><circle cx="760" cy="190" r="10" fill="${color}"/><path d="M760 212v86" stroke="${color}" stroke-width="3" stroke-dasharray="8 8"/></svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

const baseIssues: Array<[string, Category, Priority, ComplaintStatus, string, number, number, number]> = [
  ['Collapsed asphalt beside school crossing', 'Pothole', 'critical', 'in_progress', 'Mercer Ave & 8th Street', 40.7217, -74.0041, 96],
  ['Traffic signal stuck on red', 'Traffic Signal', 'critical', 'assigned', 'Canal Street & Centre Street', 40.7185, -74.0007, 94],
  ['Storm drain blocked after rainfall', 'Drainage', 'high', 'verified', 'Franklin Street near Hudson', 40.7199, -74.0095, 91],
  ['Water pooling over accessible ramp', 'Drainage', 'high', 'submitted', 'Chambers Street Civic Plaza', 40.7143, -74.0078, 88],
  ['Streetlight out along pedestrian path', 'Streetlight', 'high', 'in_progress', 'Washington Market Park', 40.7170, -74.0117, 89],
  ['Broken sidewalk slab creates trip edge', 'Sidewalk', 'high', 'assigned', 'Greenwich Street, block 420', 40.7231, -74.0090, 87],
  ['Hydrant connection leaking continuously', 'Water Leak', 'critical', 'verified', 'Worth Street & Lafayette', 40.7153, -74.0022, 95],
  ['Overflowing litter bins near bus stop', 'Waste', 'medium', 'submitted', 'Broadway & Thomas Street', 40.7161, -74.0051, 84],
  ['Deep pothole in northbound cycle lane', 'Pothole', 'high', 'resolved', 'Hudson Street & Duane', 40.7174, -74.0101, 93],
  ['Pedestrian signal button unresponsive', 'Traffic Signal', 'medium', 'analyzing', 'West Broadway & Reade', 40.7164, -74.0082, 81],
  ['Graffiti across public wayfinding panel', 'Graffiti', 'low', 'assigned', 'Leonard Street plaza', 40.7177, -74.0064, 78],
  ['Loose utility cover rattles under traffic', 'Pothole', 'medium', 'verified', 'Church Street & Murray', 40.7139, -74.0106, 86],
  ['Illegal dumping beside recycling point', 'Waste', 'high', 'in_progress', 'Staple Street passage', 40.7192, -74.0070, 90],
  ['Cracked curb at mobility loading zone', 'Sidewalk', 'medium', 'resolved', 'Harrison Street & Greenwich', 40.7186, -74.0110, 85],
  ['Two lamps flickering throughout night', 'Streetlight', 'medium', 'submitted', 'Thomas Paine Park south edge', 40.7147, -74.0020, 82],
  ['Catch basin grate displaced', 'Drainage', 'critical', 'assigned', 'Varick Street & North Moore', 40.7204, -74.0068, 92],
  ['Fresh water surfacing through roadway', 'Water Leak', 'critical', 'in_progress', 'Beach Street & West Broadway', 40.7208, -74.0077, 97],
  ['Construction debris blocking footway', 'Waste', 'high', 'resolved', 'White Street, block 110', 40.7188, -74.0036, 88],
  ['Faded crossing markings at daycare', 'Traffic Signal', 'medium', 'verified', 'Jay Street & Staple Street', 40.7180, -74.0098, 83],
  ['Graffiti on retaining wall', 'Graffiti', 'low', 'rejected', 'Duane Park west wall', 40.7172, -74.0109, 74],
]

const departments: Record<Category, string> = {
  Pothole: 'Roads & Public Realm', Streetlight: 'Electrical Services', Drainage: 'Water & Drainage', Waste: 'Sanitation',
  Sidewalk: 'Roads & Public Realm', 'Traffic Signal': 'Mobility Operations', 'Water Leak': 'Water & Drainage', Graffiti: 'Public Realm Response',
}

const statusTitle: Record<ComplaintStatus, string> = {
  submitted: 'Report received', analyzing: 'AI assessment in progress', verified: 'Issue verified', assigned: 'Crew assigned',
  in_progress: 'Repair underway', resolution_submitted: 'Resolution submitted', verification_pending: 'Verification pending',
  resolved: 'Work verified complete', verification_failed: 'Verification requires review', sla_breached: 'SLA breached', rejected: 'Report closed',
}

function timelineFor(status: ComplaintStatus, created: Date, id: string) {
  const order: ComplaintStatus[] = ['submitted', 'analyzing', 'verified', 'assigned', 'in_progress', 'resolved']
  const limit = status === 'rejected' ? 2 : Math.max(0, order.indexOf(status))
  const items = order.slice(0, limit + 1).map((stage, index) => ({
    id: `${id}-T${index + 1}`, status: stage, title: statusTitle[stage],
    description: index === 0 ? 'Report details and location were securely recorded.' : index === 1 ? 'Image and location signals were classified.' : 'Municipal workflow updated with field evidence.',
    timestamp: new Date(created.getTime() + index * 3_600_000 * 9).toISOString(), actor: index < 2 ? 'CivicTrack AI' : 'Municipal Operations',
  }))
  if (status === 'rejected') items.push({ id: `${id}-TR`, status: 'rejected' as const, title: 'Report closed', description: 'No actionable infrastructure defect was confirmed.', timestamp: new Date(created.getTime() + 28_800_000).toISOString(), actor: 'Municipal Operations' })
  return items
}

export const demoComplaints: Complaint[] = baseIssues.map((issue, index) => {
  const [title, category, priority, status, address, lat, lng, confidence] = issue
  const id = `CT-${1001 + index}`
  const created = new Date(Date.UTC(2026, 7, 22 - Math.floor(index / 2), 8 + (index % 7), 14))
  const timeline = timelineFor(status, created, id)
  const assigned = ['assigned', 'in_progress', 'resolved'].includes(status)
  const evidence: Evidence[] = [{ id: `${id}-E1`, type: 'before', url: issueImage(category, index + 1), note: 'Original resident field capture', timestamp: created.toISOString(), coordinates: { lat, lng, address } }]
  if (status === 'resolved') evidence.push({ id: `${id}-E2`, type: 'after' as const, url: issueImage(category, index + 1, true), note: 'Completion evidence captured on site', timestamp: new Date(created.getTime() + 172_800_000).toISOString(), coordinates: { lat: lat + 0.00008, lng: lng - 0.00006, address } })
  return {
    id, title, description: `${title}. The condition is affecting safe, reliable use of the public right-of-way and needs municipal review.`, category, status, priority,
    confidence, severityScore: priority === 'critical' ? 9.2 : priority === 'high' ? 7.6 : priority === 'medium' ? 5.1 : 2.8,
    location: { lat, lng, address }, citizenId: index < 7 || index === 8 ? 'USR-C-204' : `USR-C-${310 + index}`, citizenName: index < 7 || index === 8 ? 'Maya Thompson' : ['Mateo Ruiz', 'Leila Bennett', 'Owen Park', 'Priya Raman'][index % 4],
    assignedOfficerId: assigned ? 'USR-O-018' : undefined, assignedOfficerName: assigned ? 'Elias Morgan' : undefined,
    department: departments[category], createdAt: created.toISOString(), updatedAt: timeline[timeline.length - 1].timestamp,
    dueAt: new Date(created.getTime() + (priority === 'critical' ? 86_400_000 : priority === 'high' ? 259_200_000 : 604_800_000)).toISOString(),
    imageUrl: issueImage(category, index + 1), aiSummary: `${category} issue detected with ${confidence}% visual confidence. ${priority === 'critical' ? 'Immediate safety triage recommended.' : 'Routing and field validation recommended.'}`,
    aiReasoning: [`Visual pattern aligns with ${category.toLowerCase()} maintenance criteria.`, `Location context indicates ${priority} public impact.`, `No likely duplicate found within 80 metres in the last 14 days.`],
    timeline, evidence, publicUpdates: true, duplicateRisk: 0.08 + (index % 5) * 0.07,
  }
})

export const demoNotifications: Notification[] = [
  { id: 'N-1', userId: 'USR-C-204', title: 'Repair is underway', message: 'A field crew started work on CT-1001.', createdAt: '2026-08-23T09:42:00.000Z', read: false, complaintId: 'CT-1001', tone: 'info' },
  { id: 'N-2', userId: 'USR-O-018', title: 'Critical task assigned', message: 'CT-1002 requires traffic operations response.', createdAt: '2026-08-23T08:28:00.000Z', read: false, complaintId: 'CT-1002', tone: 'warning' },
  { id: 'N-3', userId: 'USR-A-003', title: 'SLA pressure detected', message: 'Three high-priority reports are within six hours of target.', createdAt: '2026-08-22T18:10:00.000Z', read: true, tone: 'warning' },
  { id: 'N-4', userId: 'USR-C-204', title: 'Report resolved', message: 'CT-1009 was repaired and field-verified.', createdAt: '2026-08-22T15:06:00.000Z', read: true, complaintId: 'CT-1009', tone: 'success' },
]
