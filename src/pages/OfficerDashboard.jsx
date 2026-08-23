import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle2, SlidersHorizontal, Sparkles, MapPin, Search } from 'lucide-react';
import ComplaintCard from '../components/ComplaintCard';
import SkeletonCard from '../components/SkeletonCard';
import OfficerComplaint from './OfficerComplaint';
import { getOfficerComplaints } from '../services/api';

export default function OfficerDashboard({ onSelectComplaint, activeComplaint, onRefreshData, onNavigateProof }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchComplaints = async () => {
    setLoading(true);
    const data = await getOfficerComplaints();
    setComplaints(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchComplaints();
  }, [onRefreshData]);

  // Statistics
  const assignedCount = complaints.length;
  const criticalCount = complaints.filter(c => c.priority_level === 'CRITICAL').length;
  const overdueCount = complaints.filter(c => c.sla_remaining_minutes <= 0).length;

  const filteredComplaints = complaints.filter(c => {
    if (filter === 'CRITICAL' && c.priority_level !== 'CRITICAL') return false;
    if (filter === 'ACTION' && c.status !== 'FIELD_ACTION') return false;
    if (filter === 'OVERDUE' && c.sla_remaining_minutes > 0) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.complaint_id.toLowerCase().includes(q) ||
        c.issue.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-neutral-050 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation (Desktop) */}
      <aside className="w-full md:w-64 bg-primary-900 text-white p-5 border-r border-primary-800 flex-shrink-0 flex md:flex-col justify-between">
        <div className="space-y-6">
          {/* Officer Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-800 border border-primary-700 flex items-center justify-center text-verified-glow">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base tracking-tight leading-none">
                Officer Portal
              </h2>
              <p className="text-xs text-neutral-400 mt-1">Field Operations</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:space-y-1 md:block pt-4 border-t border-primary-800/80">
            <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-primary-800 text-white font-display font-semibold text-sm shadow-sm">
              <SlidersHorizontal className="w-4 h-4 text-verified-glow" />
              <span>Assigned Issues</span>
            </button>
          </nav>
        </div>

        {/* Officer Profile Badge */}
        <div className="hidden md:flex items-center gap-3 p-3 bg-primary-800/60 rounded-xl border border-primary-700/60 text-xs">
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center font-bold text-white">
            RK
          </div>
          <div>
            <p className="font-semibold text-white">Ravi K.</p>
            <p className="text-neutral-400 font-mono text-[11px]">ID #OFFICER-12</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        
        {/* Top Header & Stat Cards */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-neutral-900">
                Action Queue
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500">
                Prioritized by AI urgency scoring & shortest SLA.
              </p>
            </div>

            {/* AI Auto-sort Pill Indicator */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-050 border border-primary-100 rounded-full text-xs font-display text-primary-700">
              <Sparkles className="w-3.5 h-3.5 text-verified-glow animate-pulse" />
              <span>Auto-sorted by AI Priority</span>
            </div>
          </div>

          {/* Dashboard Stat Bar */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
                Total Assigned
              </span>
              <span className="text-2xl sm:text-3xl font-display font-extrabold text-neutral-900 mt-1 block">
                {assignedCount}
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm border-l-4 border-l-critical">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
                Critical Priority
              </span>
              <span className="text-2xl sm:text-3xl font-display font-extrabold text-critical mt-1 block flex items-center gap-1">
                {criticalCount} <span className="text-sm">🔴</span>
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm border-l-4 border-l-high">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
                SLA Overdue
              </span>
              <span className="text-2xl sm:text-3xl font-display font-extrabold text-high mt-1 block flex items-center gap-1">
                {overdueCount} <AlertTriangle className="w-5 h-5 text-high" />
              </span>
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex gap-1.5 bg-neutral-200 p-1 rounded-lg text-xs font-display w-full sm:w-auto">
              {['ALL', 'CRITICAL', 'ACTION', 'OVERDUE'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all flex-1 sm:flex-initial ${
                    filter === f ? 'bg-white text-primary-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search ID, issue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field py-1.5 pl-9 pr-3 text-xs min-h-[36px] w-full"
              />
            </div>
          </div>
        </div>

        {/* Complaints Grid & Desktop Detail Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Cards List Column */}
          <div className={activeComplaint ? 'lg:col-span-6 space-y-3' : 'lg:col-span-12 space-y-3'}>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            ) : filteredComplaints.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-neutral-200 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-success mx-auto" />
                <h3 className="font-display font-bold text-neutral-900 text-base">No matching complaints found</h3>
                <p className="text-xs text-neutral-500">All field actions in this view are completed!</p>
              </div>
            ) : (
              filteredComplaints.map((complaint) => (
                <ComplaintCard
                  key={complaint.complaint_id}
                  complaint={complaint}
                  selected={activeComplaint?.complaint_id === complaint.complaint_id}
                  onSelect={onSelectComplaint}
                />
              ))
            )}
          </div>

          {/* Desktop Sliding Drawer Panel */}
          {activeComplaint && (
            <div className="lg:col-span-6 bg-white rounded-2xl border border-neutral-200 shadow-xl p-4 sm:p-6 h-fit sticky top-20">
              <OfficerComplaint
                complaint={activeComplaint}
                onClose={() => onSelectComplaint(null)}
                onStatusUpdated={() => {
                  fetchComplaints();
                }}
                onNavigateProof={(c) => {
                  if (onNavigateProof) onNavigateProof(c);
                }}
              />
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
