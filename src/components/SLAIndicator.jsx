import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { useSLACountdown } from '../hooks/useSLACountdown';

export default function SLAIndicator({ minutes = 462 }) {
  const { displayText, isBreached, isUrgent, isWarning } = useSLACountdown(minutes);

  let colorClasses = 'bg-neutral-100 text-neutral-700 border-neutral-300';
  if (isBreached) {
    colorClasses = 'bg-critical-bg text-critical border-critical/40 shadow-red-pulse animate-pulse';
  } else if (isUrgent) {
    colorClasses = 'bg-high-bg text-high border-high/40';
  } else if (isWarning) {
    colorClasses = 'bg-medium-bg text-medium border-medium/40';
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-semibold border ${colorClasses}`}>
      {isBreached ? (
        <AlertTriangle className="w-3.5 h-3.5 animate-bounce text-critical" />
      ) : (
        <Clock className="w-3.5 h-3.5" />
      )}
      <span>{displayText}</span>
    </div>
  );
}
