import React, { useState } from 'react';
import { CheckCircle2, Copy, ArrowRight, MessageSquare, ShieldCheck, Clock } from 'lucide-react';
import PriorityBadge from '../components/PriorityBadge';
import Toast from '../components/Toast';

export default function ComplaintResult({ complaint, onTrack }) {
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const handleCopyId = () => {
    if (complaint?.complaint_id) {
      navigator.clipboard.writeText(complaint.complaint_id);
      setToastMessage(`Copied ${complaint.complaint_id} to clipboard!`);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 space-y-5 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex items-center gap-2 text-success font-display font-bold text-lg bg-success-bg p-3.5 rounded-xl border border-green-200 shadow-sm">
        <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
        <span>AI Analysis Complete</span>
      </div>

      {/* Main Result Card */}
      <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-md space-y-4">
        
        {/* Detected Issue */}
        <div>
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
            Detected Issue
          </span>
          <h3 className="font-display font-extrabold text-2xl text-neutral-900">
            {complaint?.issue || 'Pothole'}
          </h3>
        </div>

        <div className="border-t border-neutral-100 pt-3">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
            Responsible Department
          </span>
          <p className="font-display font-semibold text-base text-primary-900">
            {complaint?.department || 'Roads Department'}
          </p>
        </div>

        {/* Priority & Score */}
        <div className="border-t border-neutral-100 pt-3 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
              Priority Assessment
            </span>
            <PriorityBadge level={complaint?.priority_level || 'CRITICAL'} score={complaint?.priority || 86} />
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
              Expected SLA
            </span>
            <span className="font-mono font-bold text-sm text-neutral-800 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-primary-500" /> 6 Hours
            </span>
          </div>
        </div>

      </div>

      {/* AI Explanation Card */}
      <div className="bg-primary-050 border-l-4 border-l-primary-500 border border-primary-100 rounded-xl p-4 shadow-sm space-y-1.5">
        <div className="flex items-center gap-1.5 font-display font-bold text-xs text-primary-700 uppercase tracking-wide">
          <MessageSquare className="w-4 h-4 text-primary-500" /> Why this priority score?
        </div>
        <p className="text-xs text-neutral-700 leading-relaxed font-body">
          {complaint?.ai_explanation || 'Large pothole detected near a school and bus stop, creating significant vehicle and pedestrian safety risk.'}
        </p>
      </div>

      {/* Complaint ID Card */}
      <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
            Complaint Tracking ID
          </span>
          <span className="font-mono font-bold text-xl tracking-widest text-primary-600">
            {complaint?.complaint_id || 'CT-1001'}
          </span>
        </div>
        <button
          onClick={handleCopyId}
          className="btn-secondary py-2 px-3 text-xs flex items-center gap-1.5 min-h-[38px]"
          title="Copy Complaint ID"
        >
          <Copy className="w-3.5 h-3.5" /> Copy ID
        </button>
      </div>

      {/* Track Button */}
      <button
        onClick={() => onTrack(complaint)}
        className="btn-primary w-full text-base py-4"
      >
        <span>Track My Complaint</span>
        <ArrowRight className="w-5 h-5" />
      </button>

      <Toast message={toastMessage} visible={toastVisible} />

    </div>
  );
}
