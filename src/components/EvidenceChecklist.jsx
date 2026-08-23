import React from 'react';
import { Camera, MapPin, Clock, CheckCircle2 } from 'lucide-react';

export default function EvidenceChecklist({ hasPhoto, location, timestamp }) {
  const isGPSLocked = hasPhoto && location;
  const isTimeLocked = hasPhoto;

  return (
    <div className="space-y-2.5 bg-neutral-100 p-4 rounded-xl border border-neutral-200">
      <h4 className="font-display font-semibold text-xs text-neutral-500 uppercase tracking-wider mb-3">
        Proof Evidence Checklist
      </h4>

      {/* Row 1: Photo */}
      <div className={`flex items-center justify-between p-3 rounded-lg border text-xs font-display transition-all ${
        hasPhoto
          ? 'bg-success-bg text-success border-green-200 font-semibold'
          : 'bg-white text-neutral-500 border-neutral-200'
      }`}>
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4" />
          <span>Resolution Photo Added</span>
        </div>
        {hasPhoto ? (
          <span className="flex items-center gap-1 font-bold text-success">
            <CheckCircle2 className="w-4 h-4" /> Added
          </span>
        ) : (
          <span className="text-neutral-400 font-mono text-[11px]">Pending</span>
        )}
      </div>

      {/* Row 2: GPS */}
      <div className={`flex items-center justify-between p-3 rounded-lg border text-xs font-display transition-all ${
        isGPSLocked
          ? 'bg-success-bg text-success border-green-200 font-semibold'
          : 'bg-white text-neutral-500 border-neutral-200'
      }`}>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>Geo-Location Stamp</span>
        </div>
        {isGPSLocked ? (
          <span className="flex items-center gap-1 font-mono text-[11px] font-bold text-success">
            <CheckCircle2 className="w-4 h-4" /> {location?.latitude || '11.0168'}, {location?.longitude || '76.9558'}
          </span>
        ) : (
          <span className="text-neutral-400 font-mono text-[11px]">Pending</span>
        )}
      </div>

      {/* Row 3: Timestamp */}
      <div className={`flex items-center justify-between p-3 rounded-lg border text-xs font-display transition-all ${
        isTimeLocked
          ? 'bg-success-bg text-success border-green-200 font-semibold'
          : 'bg-white text-neutral-500 border-neutral-200'
      }`}>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>Time & Date Stamp</span>
        </div>
        {isTimeLocked ? (
          <span className="flex items-center gap-1 font-mono text-[11px] font-bold text-success">
            <CheckCircle2 className="w-4 h-4" /> {timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        ) : (
          <span className="text-neutral-400 font-mono text-[11px]">Pending</span>
        )}
      </div>
    </div>
  );
}
