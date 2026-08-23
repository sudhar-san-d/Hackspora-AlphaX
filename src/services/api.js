import { demoComplaint, demoComplaintsList } from '../demo/demoData';

const BACKEND_BASE_URL = 'http://localhost:8000/api';
const STORAGE_KEY = 'fixmycity_complaints';

function getStoredComplaints() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoComplaintsList));
    return demoComplaintsList;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return demoComplaintsList;
  }
}

function saveStoredComplaints(complaints) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
}

// 1. Create Complaint
export async function createComplaint(data) {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (response.ok) {
      const result = await response.json();
      return result;
    }
  } catch (err) {
    console.warn('Backend server offline, using local fallback createComplaint', err);
  }

  // Fallback
  await new Promise(res => setTimeout(res, 1200));
  const newId = `CT-${Math.floor(1000 + Math.random() * 9000)}`;
  const newComplaint = {
    complaint_id: newId,
    citizen_id: data.citizen_id || 'U1001',
    issue: data.issue || 'Pothole',
    category: data.category || 'Road Infrastructure',
    department: data.department || 'Roads Department',
    priority: data.priority || 86,
    priority_level: data.priority_level || 'CRITICAL',
    status: 'SUBMITTED',
    sla_remaining_minutes: 360,
    description: data.description || 'Civic complaint submitted by citizen.',
    image_url: data.image_url || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=800&auto=format&fit=crop',
    location: data.location || {
      latitude: 11.0168,
      longitude: 76.9558,
      address: '11.0168, 76.9558'
    },
    ai_explanation: data.ai_explanation || 'Identified high risk safety hazard near traffic flow.',
    created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timeline: [
      { title: 'Complaint Submitted', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true },
      { title: 'AI Analyzed', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true },
      { title: 'Department Assigned', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true },
      { title: 'Officer Assigned', time: 'Pending', completed: false },
      { title: 'Field Action', time: 'Pending', completed: false },
      { title: 'Resolution Verification', time: 'Pending', completed: false },
      { title: 'Closed', time: 'Pending', completed: false }
    ]
  };

  const complaints = getStoredComplaints();
  complaints.unshift(newComplaint);
  saveStoredComplaints(complaints);
  return newComplaint;
}

// 2. Get Complaint Details
export async function getComplaint(complaintId) {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/complaints/${complaintId}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn('Backend server offline, using local fallback getComplaint', err);
  }

  const complaints = getStoredComplaints();
  return complaints.find(c => c.complaint_id === complaintId) || demoComplaint;
}

// 3. Get Officer Complaints
export async function getOfficerComplaints() {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/officer/complaints`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.complaints) {
        return data.complaints;
      }
    }
  } catch (err) {
    console.warn('Backend server offline, using local fallback getOfficerComplaints', err);
  }

  const complaints = getStoredComplaints();
  const priorityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
  return complaints.sort((a, b) => {
    const pDiff = (priorityOrder[b.priority_level] || 0) - (priorityOrder[a.priority_level] || 0);
    if (pDiff !== 0) return pDiff;
    return (a.sla_remaining_minutes || 0) - (b.sla_remaining_minutes || 0);
  });
}

// 4. Update Status
export async function updateComplaintStatus(complaintId, status, updatedBy = 'OFFICER_12') {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/complaints/${complaintId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, updated_by: updatedBy })
    });
    if (response.ok) {
      return await getComplaint(complaintId);
    }
  } catch (err) {
    console.warn('Backend server offline, using local fallback updateComplaintStatus', err);
  }

  const complaints = getStoredComplaints();
  const index = complaints.findIndex(c => c.complaint_id === complaintId);
  if (index !== -1) {
    complaints[index].status = status;
    saveStoredComplaints(complaints);
    return complaints[index];
  }
  return { ...demoComplaint, status };
}

// 5. Upload Resolution Evidence
export async function uploadResolutionProof(complaintId, evidenceData) {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/complaints/${complaintId}/evidence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evidenceData)
    });
    if (response.ok) {
      return await getComplaint(complaintId);
    }
  } catch (err) {
    console.warn('Backend server offline, using local fallback uploadResolutionProof', err);
  }

  const complaints = getStoredComplaints();
  const index = complaints.findIndex(c => c.complaint_id === complaintId);
  
  const verificationResult = {
    status: 'PASSED',
    score: 93,
    location_match: true,
    scene_match: true,
    issue_resolved: true,
    verified_at: new Date().toISOString()
  };

  if (index !== -1) {
    complaints[index].status = 'VERIFIED';
    complaints[index].resolution_image_url = evidenceData.image_url || demoComplaint.resolution_image_url;
    complaints[index].verification = verificationResult;
    saveStoredComplaints(complaints);
    return complaints[index];
  }

  return {
    ...demoComplaint,
    status: 'VERIFIED',
    verification: verificationResult
  };
}
