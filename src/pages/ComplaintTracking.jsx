import React, { useState } from 'react';
import { ArrowLeft, MapPin, RefreshCw, Award } from 'lucide-react';
import PriorityBadge from '../components/PriorityBadge';
import SLAIndicator from '../components/SLAIndicator';
import StatusTimeline from '../components/StatusTimeline';
import VerificationCard from '../components/VerificationCard';

export default function ComplaintTracking({ complaint, onBack, onNavigateOfficer }) {
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const isVerified = complaint?.status === 'VERIFIED' || complaint?.status === 'AWAITING_VERIFICATION';

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 space-y-5">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-display font-bold text-lg text-neutral-900">
              Complaint Status
            </h2>
            <span className="font-mono text-xs text-primary-600 font-bold tracking-wider">
              {complaint?.complaint_id || 'CT-1001'}
            </span>
          </div>
        </div>

        <SLAIndicator minutes={complaint?.sla_remaining_minutes || 462} />
      </div>

      {/* Complaint Info Banner */}
      <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-sm space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-neutral-900">
              {complaint?.issue || 'Pothole'}
            </h3>
            <p className="text-xs text-neutral-500">{complaint?.department || 'Roads Department'}</p>
          </div>
          <PriorityBadge level={complaint?.priority_level || 'CRITICAL'} score={complaint?.priority || 86} />
        </div>

        {complaint?.location && (
          <div className="flex items-center gap-1 text-xs font-mono text-neutral-500 pt-1 border-t border-neutral-100">
            <MapPin className="w-3.5 h-3.5 text-primary-500" />
            <span>{complaint.location.address || `${complaint.location.latitude}, ${complaint.location.longitude}`}</span>
          </div>
        )}
      </div>

      {/* Verification Banner if Verified */}
      {isVerified && (
        <div className="bg-verified-bg border border-verified-glow/50 p-4 rounded-xl shadow-sm text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-verified font-display font-bold text-sm">
            <Award className="w-5 h-5 text-verified-glow" /> Work Resolved & AI Verified!
          </div>
          <button
            onClick={() => setShowVerificationModal(true)}
            className="btn-primary w-full py-2.5 text-xs bg-verified hover:bg-amber-800"
          >
            View Verification Proof & Score
          </button>
        </div>
      )}

      {/* Status Timeline */}
      <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-sm space-y-4">
        <h4 className="font-display font-bold text-sm text-neutral-900 border-b border-neutral-100 pb-2">
          Real-time Action Timeline
        </h4>

        <StatusTimeline timeline={complaint?.timeline} />
      </div>

      {/* Quick Role Shift Helper for Demo */}
      {onNavigateOfficer && complaint?.status !== 'VERIFIED' && (
        <div className="p-3 bg-neutral-100 rounded-xl text-center text-xs text-neutral-600 border border-neutral-200">
          <span>Officer view needed to advance field action?</span>
          <button
            onClick={() => onNavigateOfficer(complaint)}
            className="ml-2 text-primary-600 font-bold hover:underline"
          >
            Open in Officer Portal →
          </button>
        </div>
      )}

      {/* Verification Modal / Overlay */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg relative">
            <button
              onClick={() => setShowVerificationModal(false)}
              className="absolute top-3 right-3 z-20 bg-neutral-800 text-white p-2 rounded-full hover:bg-neutral-900"
            >
              ✕
            </button>
            <VerificationCard
              complaint={complaint}
              onReopen={() => setShowVerificationModal(false)}
              onReupload={() => setShowVerificationModal(false)}
            />
          </div>
        </div>
      )}

    </div>
  );
}
