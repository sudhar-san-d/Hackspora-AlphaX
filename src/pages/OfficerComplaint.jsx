import React, { useState } from 'react';
import { ArrowLeft, MapPin, ExternalLink, ShieldCheck, Play, Upload, CheckCircle2 } from 'lucide-react';
import PriorityBadge from '../components/PriorityBadge';
import SLAIndicator from '../components/SLAIndicator';
import { updateComplaintStatus } from '../services/api';

export default function OfficerComplaint({
  complaint,
  onClose,
  onStatusUpdated,
  onNavigateProof
}) {
  const [updating, setUpdating] = useState(false);
  const [currentComplaint, setCurrentComplaint] = useState(complaint);

  if (!currentComplaint) return null;

  const isFieldAction = currentComplaint.status === 'FIELD_ACTION' || currentComplaint.status === 'AWAITING_VERIFICATION' || currentComplaint.status === 'VERIFIED';
  const isVerified = currentComplaint.status === 'VERIFIED';

  const handleStartAction = async () => {
    setUpdating(true);
    const updated = await updateComplaintStatus(currentComplaint.complaint_id, 'FIELD_ACTION');
    setCurrentComplaint(updated);
    setUpdating(false);
    if (onStatusUpdated) onStatusUpdated(updated);
  };

  return (
    <div className="space-y-5 text-neutral-900">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <span className="text-[11px] font-mono font-bold text-primary-600 tracking-wider uppercase block">
              Complaint Detail
            </span>
            <h2 className="font-mono font-bold text-lg tracking-widest text-primary-900">
              {currentComplaint.complaint_id}
            </h2>
          </div>
        </div>

        <PriorityBadge level={currentComplaint.priority_level} score={currentComplaint.priority} />
      </div>

      {/* Main Title & SLA */}
      <div className="flex items-center justify-between bg-neutral-050 p-3.5 rounded-xl border border-neutral-200">
        <div>
          <h3 className="font-display font-extrabold text-xl">
            {currentComplaint.issue}
          </h3>
          <p className="text-xs text-neutral-500 font-medium">
            {currentComplaint.department}
          </p>
        </div>
        <SLAIndicator minutes={currentComplaint.sla_remaining_minutes} />
      </div>

      {/* Location Details */}
      <div className="space-y-1.5">
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
          📍 Location Details
        </span>
        <div className="bg-white p-3 rounded-lg border border-neutral-200 flex items-center justify-between text-xs">
          <div className="font-mono text-neutral-800">
            {currentComplaint.location?.address || `${currentComplaint.location?.latitude}, ${currentComplaint.location?.longitude}`}
          </div>
          <a
            href={`https://maps.google.com/?q=${currentComplaint.location?.latitude},${currentComplaint.location?.longitude}`}
            target="_blank"
            rel="noreferrer"
            className="text-primary-600 hover:underline flex items-center gap-1 font-semibold text-[11px]"
          >
            <span>Open Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Citizen Description */}
      <div className="space-y-1">
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
          Citizen Description
        </span>
        <p className="text-xs text-neutral-800 bg-neutral-100 p-3 rounded-lg border border-neutral-200 italic font-body">
          "{currentComplaint.description}"
        </p>
      </div>

      {/* AI Analysis Insight */}
      <div className="bg-primary-050 border-l-4 border-l-primary-500 p-3.5 rounded-lg border border-primary-100 space-y-1 text-xs">
        <div className="flex items-center gap-1.5 font-display font-bold text-primary-700">
          <ShieldCheck className="w-4 h-4 text-primary-500" /> AI Diagnostic Insight
        </div>
        <p className="text-neutral-700 leading-relaxed font-body">
          {currentComplaint.ai_explanation}
        </p>
      </div>

      {/* Citizen Uploaded Image */}
      {currentComplaint.image_url && (
        <div className="space-y-1">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
            Complaint Image Evidence
          </span>
          <div className="rounded-xl overflow-hidden border border-neutral-200 shadow-sm max-h-48">
            <img
              src={currentComplaint.image_url}
              alt="Citizen Upload"
              className="w-full h-40 object-cover"
            />
          </div>
        </div>
      )}

      {/* Primary Field Action CTAs */}
      <div className="pt-2">
        {isVerified ? (
          <div className="bg-verified-bg border border-verified-glow/40 p-3 rounded-xl text-center space-y-1">
            <span className="font-display font-bold text-xs text-verified flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-verified-glow" /> WORK COMPLETED & VERIFIED
            </span>
          </div>
        ) : isFieldAction ? (
          <button
            onClick={() => onNavigateProof && onNavigateProof(currentComplaint)}
            className="btn-primary w-full py-3.5 text-sm bg-verified hover:bg-amber-800"
          >
            <span>📷 UPLOAD RESOLUTION PROOF</span>
          </button>
        ) : (
          <button
            onClick={handleStartAction}
            disabled={updating}
            className="btn-primary w-full py-3.5 text-sm"
          >
            {updating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Starting Field Action...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Play className="w-4 h-4 fill-current text-verified-glow" /> START FIELD ACTION
              </span>
            )}
          </button>
        )}
      </div>

    </div>
  );
}
