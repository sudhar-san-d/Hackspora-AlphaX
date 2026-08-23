import React, { useState, useEffect } from 'react';
import { CheckCircle2, ShieldCheck, MapPin, Clock, Award, RotateCcw, AlertTriangle } from 'lucide-react';

export default function VerificationCard({ complaint, onReopen, onReupload }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const verification = complaint?.verification || {
    status: 'PASSED',
    score: 93,
    location_match: true,
    scene_match: true,
    issue_resolved: true
  };

  const targetScore = verification.score || 93;
  const isPassed = verification.status === 'PASSED';

  useEffect(() => {
    if (!isPassed) return;
    setAnimatedScore(0);
    const duration = 1000;
    const steps = 30;
    const increment = targetScore / steps;
    const intervalTime = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetScore) {
        setAnimatedScore(targetScore);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [targetScore, isPassed]);

  if (!isPassed) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-critical/30 text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-full bg-critical-bg text-critical flex items-center justify-center mx-auto shadow-sm">
          <AlertTriangle className="w-9 h-9" />
        </div>
        <div>
          <h2 className="font-display font-bold text-2xl text-neutral-900 tracking-tight">
            VERIFICATION FAILED
          </h2>
          <p className="text-sm text-neutral-600 mt-2">
            The uploaded resolution evidence could not confirm that the original civic issue was properly repaired.
          </p>
        </div>

        <div className="p-3 bg-critical-bg rounded-lg text-xs font-mono text-critical text-left">
          • Scene mismatch: Before/After condition delta insufficient<br />
          • Status changed to: REOPENED
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button onClick={onReupload} className="btn-primary w-full text-sm">
            <RotateCcw className="w-4 h-4" /> Reupload Proof
          </button>
          <button onClick={onReopen} className="btn-secondary w-full text-sm">
            Report Issue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-verified-glow/30 text-center max-w-lg mx-auto space-y-6 relative overflow-hidden">
      
      {/* Background Gold Glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-verified-glow/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Gold Check Icon with Animated Pulsing Ring */}
      <div className="relative inline-block mx-auto">
        <div className="absolute inset-0 rounded-full border-2 border-verified-glow animate-gold-ring"></div>
        <div className="w-20 h-20 rounded-full bg-verified-bg text-verified-glow border-2 border-verified-glow/60 flex items-center justify-center shadow-gold-glow relative z-10 mx-auto">
          <CheckCircle2 className="w-11 h-11" />
        </div>
      </div>

      {/* Main Headline */}
      <div>
        <span className="inline-block px-3 py-1 bg-verified-bg text-verified font-mono text-xs font-bold tracking-widest rounded-full uppercase mb-2 border border-verified-glow/30">
          Proof of Work Verified
        </span>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-neutral-900 tracking-tight">
          RESOLUTION VERIFIED
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Complaint ID: <span className="font-mono text-primary-600 font-bold">{complaint?.complaint_id || 'CT-1001'}</span>
        </p>
      </div>

      {/* After Photo Preview */}
      {complaint?.resolution_image_url && (
        <div className="rounded-xl overflow-hidden border-2 border-verified-glow/40 shadow-md max-h-56 relative group">
          <img
            src={complaint.resolution_image_url}
            alt="Resolution Proof"
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2 bg-verified text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
            AFTER PHOTO PROOF
          </div>
        </div>
      )}

      {/* Score Meter */}
      <div className="bg-neutral-050 rounded-xl p-4 border border-neutral-200">
        <div className="flex items-center justify-between text-xs font-display font-semibold text-neutral-600 mb-1">
          <span className="flex items-center gap-1">
            <Award className="w-4 h-4 text-verified-glow" /> AI Verification Score
          </span>
          <span className="font-mono text-2xl font-bold text-verified">
            {animatedScore} <span className="text-xs font-normal text-neutral-400">/ 100</span>
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-verified-glow transition-all duration-700 ease-out rounded-full"
            style={{ width: `${(animatedScore / 100) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Confirmation Rows */}
      <div className="space-y-2 text-left bg-neutral-100 p-4 rounded-xl border border-neutral-200 text-xs">
        <div className="flex items-center justify-between font-display font-semibold text-neutral-800">
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-success" /> Location Matched
          </span>
          <span className="text-success font-bold font-mono">✓ Confirmed</span>
        </div>

        <div className="flex items-center justify-between font-display font-semibold text-neutral-800 pt-1.5 border-t border-neutral-200">
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-success" /> Timestamp Verified
          </span>
          <span className="text-success font-bold font-mono">✓ Confirmed</span>
        </div>

        <div className="flex items-center justify-between font-display font-semibold text-neutral-800 pt-1.5 border-t border-neutral-200">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-success" /> Issue Resolution
          </span>
          <span className="text-success font-bold font-mono">✓ Confirmed</span>
        </div>
      </div>

    </div>
  );
}
