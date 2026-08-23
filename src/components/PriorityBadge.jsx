import React from 'react';

const priorityConfig = {
  CRITICAL: {
    label: 'CRITICAL',
    className: 'bg-critical-bg text-critical border-critical/30',
    dot: '🔴'
  },
  HIGH: {
    label: 'HIGH',
    className: 'bg-high-bg text-high border-high/30',
    dot: '🟠'
  },
  MEDIUM: {
    label: 'MEDIUM',
    className: 'bg-medium-bg text-medium border-medium/30',
    dot: '🟡'
  },
  LOW: {
    label: 'LOW',
    className: 'bg-low-bg text-low border-low/30',
    dot: '🟢'
  }
};

export default function PriorityBadge({ level = 'MEDIUM', score }) {
  const config = priorityConfig[level.toUpperCase()] || priorityConfig.MEDIUM;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-display font-bold uppercase tracking-wide border ${config.className}`}>
      <span>{config.dot}</span>
      <span>{config.label}</span>
      {score !== undefined && (
        <span className="ml-1 pl-1.5 border-l border-current/20 font-mono text-[11px]">
          {score}/100
        </span>
      )}
    </div>
  );
}
