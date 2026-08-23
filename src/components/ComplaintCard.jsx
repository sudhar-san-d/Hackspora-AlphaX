import React from 'react';
import { MapPin, ChevronRight, CheckCircle2 } from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import SLAIndicator from './SLAIndicator';

export default function ComplaintCard({ complaint, onSelect, selected }) {
  const isCritical = complaint.priority_level === 'CRITICAL';
  
  const borderColors = {
    CRITICAL: 'border-l-critical',
    HIGH: 'border-l-high',
    MEDIUM: 'border-l-medium',
    LOW: 'border-l-low'
  };

  const leftBorderClass = borderColors[complaint.priority_level] || 'border-l-primary-500';

  return (
    <div
      onClick={() => onSelect && onSelect(complaint)}
      className={`bg-white rounded-lg p-4 border-l-4 ${leftBorderClass} border border-neutral-200 shadow-sm hover:shadow-md transition-all cursor-pointer relative group ${
        selected ? 'ring-2 ring-primary-500 bg-primary-050/30' : ''
      } ${isCritical ? 'shadow-red-pulse/10' : ''}`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <span className="font-mono font-bold text-xs tracking-widest text-primary-600 block mb-0.5">
            {complaint.complaint_id}
          </span>
          <h3 className="font-display font-bold text-base text-neutral-900 group-hover:text-primary-600 transition-colors">
            {complaint.issue}
          </h3>
        </div>
        <PriorityBadge level={complaint.priority_level} score={complaint.priority} />
      </div>

      <p className="text-xs text-neutral-500 mb-3 flex items-center gap-1">
        <span>{complaint.department}</span>
        {complaint.status === 'VERIFIED' && (
          <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold text-verified bg-verified-bg px-2 py-0.5 rounded border border-verified-glow/30">
            <CheckCircle2 className="w-3 h-3 text-verified-glow" /> VERIFIED
          </span>
        )}
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs">
        <div className="flex items-center gap-1 text-neutral-500 font-mono text-[11px]">
          <MapPin className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
          <span className="truncate max-w-[150px]">{complaint.location?.address || `${complaint.location?.latitude}, ${complaint.location?.longitude}`}</span>
        </div>

        <div className="flex items-center gap-2">
          <SLAIndicator minutes={complaint.sla_remaining_minutes} />
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
}
