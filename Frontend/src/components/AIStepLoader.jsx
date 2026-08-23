import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

export default function AIStepLoader({
  title = "Analyzing your report...",
  steps = [],
  onComplete
}) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    if (steps.length === 0) return;

    const interval = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          if (onComplete) onComplete();
          return prev;
        }
      });
    }, 700);

    return () => clearInterval(interval);
  }, [steps, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-primary-900 text-white flex flex-col items-center justify-center p-6 select-none">
      
      {/* Pulse Shield Icon */}
      <div className="w-20 h-20 rounded-full bg-primary-800 border border-primary-700 flex items-center justify-center text-verified-glow shadow-gold-glow mb-6 animate-pulse">
        <ShieldCheck className="w-10 h-10" />
      </div>

      <h2 className="font-display font-bold text-2xl sm:text-3xl text-center mb-2 tracking-tight">
        FixMyCity <span className="text-verified-glow">AI Engine</span>
      </h2>
      <p className="text-neutral-400 text-sm mb-8 text-center">{title}</p>

      {/* Pipeline Steps List */}
      <div className="w-full max-w-sm space-y-4 bg-primary-800/60 p-6 rounded-2xl border border-primary-700/60 backdrop-blur-md shadow-2xl">
        {steps.map((step, idx) => {
          const isDone = idx < activeStepIndex;
          const isActive = idx === activeStepIndex;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 text-sm font-display transition-all duration-300 ${
                isDone
                  ? 'text-white'
                  : isActive
                  ? 'text-verified-glow font-semibold translate-x-1'
                  : 'text-neutral-500 opacity-60'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
              ) : isActive ? (
                <Clock className="w-5 h-5 text-verified-glow animate-spin flex-shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-neutral-600 flex-shrink-0" />
              )}
              <span>{step}</span>
            </div>
          );
        })}
      </div>

    </div>
  );
}
