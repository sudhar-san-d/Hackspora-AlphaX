export const demoComplaint = {
  complaint_id: 'CT-1001',
  citizen_id: 'U1001',
  issue: 'Pothole',
  category: 'Road Infrastructure',
  department: 'Roads Department',
  priority: 86,
  priority_level: 'CRITICAL',
  status: 'FIELD_ACTION',
  sla_remaining_minutes: 462,
  description: 'Large pothole near the bus stop causing severe traffic slowdown and hazard for riders.',
  image_url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=800&auto=format&fit=crop',
  resolution_image_url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?q=80&w=800&auto=format&fit=crop',
  location: {
    latitude: 11.0168,
    longitude: 76.9558,
    address: 'Near Central Bus Station, Sector 4'
  },
  ai_explanation: 'Large pothole detected near a school and bus stop, creating significant vehicle and pedestrian safety risk.',
  created_at: '10:42 AM',
  timeline: [
    { title: 'Complaint Submitted', time: '10:42 AM', completed: true },
    { title: 'AI Analyzed', time: '10:42 AM', completed: true },
    { title: 'Department Assigned', time: '10:43 AM', completed: true },
    { title: 'Officer Assigned', time: '10:47 AM', completed: true, officer: 'Ravi K. (Field Officer #12)' },
    { title: 'Field Action', time: '11:15 AM', completed: true, inProgress: true },
    { title: 'Resolution Verification', time: 'Pending', completed: false },
    { title: 'Closed', time: 'Pending', completed: false }
  ],
  verification: {
    status: 'PASSED',
    score: 93,
    location_match: true,
    scene_match: true,
    issue_resolved: true,
    verified_at: '2026-08-23T11:30:00+05:30'
  }
};

export const demoComplaintsList = [
  demoComplaint,
  {
    complaint_id: 'CT-1007',
    citizen_id: 'U1004',
    issue: 'Open Drain',
    category: 'Sanitation',
    department: 'Drainage & Waste Dept.',
    priority: 78,
    priority_level: 'HIGH',
    status: 'ASSIGNED',
    sla_remaining_minutes: 921,
    description: 'Uncovered sewer drain on main road corner.',
    image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?q=80&w=800&auto=format&fit=crop',
    location: {
      latitude: 11.0210,
      longitude: 76.9602,
      address: 'Cross Cut Road, ward 12'
    },
    ai_explanation: 'Open drain presents immediate fall hazard and public health risk.',
    created_at: '09:15 AM',
    timeline: [
      { title: 'Complaint Submitted', time: '09:15 AM', completed: true },
      { title: 'AI Analyzed', time: '09:16 AM', completed: true },
      { title: 'Department Assigned', time: '09:20 AM', completed: true },
      { title: 'Officer Assigned', time: '09:30 AM', completed: true },
      { title: 'Field Action', time: 'Pending', completed: false },
      { title: 'Resolution Verification', time: 'Pending', completed: false },
      { title: 'Closed', time: 'Pending', completed: false }
    ]
  },
  {
    complaint_id: 'CT-1012',
    citizen_id: 'U1009',
    issue: 'Streetlight Failure',
    category: 'Electrical Infrastructure',
    department: 'Electrical Department',
    priority: 54,
    priority_level: 'MEDIUM',
    status: 'SUBMITTED',
    sla_remaining_minutes: 1340,
    description: 'Dark alleyway due to broken lamp post LED.',
    image_url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=800&auto=format&fit=crop',
    location: {
      latitude: 11.0090,
      longitude: 76.9480,
      address: '7th Street Junction'
    },
    ai_explanation: 'Low light area, medium priority for safety enhancement.',
    created_at: '08:00 AM',
    timeline: [
      { title: 'Complaint Submitted', time: '08:00 AM', completed: true },
      { title: 'AI Analyzed', time: '08:01 AM', completed: true },
      { title: 'Department Assigned', time: 'Pending', completed: false },
      { title: 'Officer Assigned', time: 'Pending', completed: false },
      { title: 'Field Action', time: 'Pending', completed: false },
      { title: 'Resolution Verification', time: 'Pending', completed: false },
      { title: 'Closed', time: 'Pending', completed: false }
    ]
  },
  {
    complaint_id: 'CT-1002',
    citizen_id: 'U1002',
    issue: 'Garbage Dump Overflow',
    category: 'Public Health',
    department: 'Sanitation Dept.',
    priority: 92,
    priority_level: 'CRITICAL',
    status: 'AWAITING_VERIFICATION',
    sla_remaining_minutes: 45,
    description: 'Massive garbage pile overflowing on sidewalk.',
    image_url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=800&auto=format&fit=crop',
    resolution_image_url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?q=80&w=800&auto=format&fit=crop',
    location: {
      latitude: 11.0188,
      longitude: 76.9580,
      address: 'Market Road'
    },
    ai_explanation: 'Hazardous waste accumulation near market stalls.',
    created_at: '06:30 AM',
    timeline: [
      { title: 'Complaint Submitted', time: '06:30 AM', completed: true },
      { title: 'AI Analyzed', time: '06:31 AM', completed: true },
      { title: 'Department Assigned', time: '06:35 AM', completed: true },
      { title: 'Officer Assigned', time: '06:40 AM', completed: true },
      { title: 'Field Action', time: '07:30 AM', completed: true },
      { title: 'Resolution Verification', time: 'In Progress', completed: false, inProgress: true },
      { title: 'Closed', time: 'Pending', completed: false }
    ],
    verification: {
      status: 'PASSED',
      score: 95,
      location_match: true,
      scene_match: true,
      issue_resolved: true,
      verified_at: '2026-08-23T10:00:00+05:30'
    }
  }
];
