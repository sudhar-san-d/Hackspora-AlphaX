import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import VerificationCard from '../components/VerificationCard';

export default function VerificationResult({ complaint, onHome, onTrack, onReupload }) {
  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onHome}
          className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-mono text-xs font-bold text-primary-600">
          Verification Outcome
        </span>
      </div>

      {/* Verification Card Component */}
      <VerificationCard
        complaint={complaint}
        onReopen={onHome}
        onReupload={onReupload}
      />

      {/* Bottom Action Navigation */}
      <div className="pt-4 space-y-2">
        <button
          onClick={() => onTrack(complaint)}
          className="btn-primary w-full py-3.5 text-sm"
        >
          <span>View Public Complaint Timeline</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onHome}
          className="btn-secondary w-full py-3 text-sm"
        >
          Return to Citizen Home
        </button>
      </div>

    </div>
  );
}
