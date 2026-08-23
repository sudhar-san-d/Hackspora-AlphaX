import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';

export default function StatusTimeline({ timeline = [] }) {
  if (!timeline || timeline.length === 0) return null;

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-3.5 before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-neutral-200">
      {timeline.map((step, idx) => {
        const isLast = idx === timeline.length - 1;
        const isCompleted = step.completed;
        const isInProgress = step.inProgress;

        return (
          <div key={idx} className="relative flex items-start gap-4">
            
            {/* Step Node Icon */}
            <div className="absolute -left-6 top-0.5 flex items-center justify-center">
              {isCompleted ? (
                <div className="w-6 h-6 rounded-full bg-success text-white flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : isInProgress ? (
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-primary-500 opacity-40"></span>
                  <div className="w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-sm relative z-10">
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                  </div>
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-white border-2 border-neutral-300 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-neutral-300"></div>
                </div>
              )}
            </div>

            {/* Step Label & Metadata */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className={`font-display font-semibold text-sm ${isCompleted ? 'text-neutral-900' : isInProgress ? 'text-primary-600 font-bold' : 'text-neutral-500'}`}>
                  {step.title}
                </p>
                <span className="text-xs font-mono text-neutral-500">{step.time}</span>
              </div>
              {step.officer && (
                <p className="text-xs text-neutral-500 mt-0.5">{step.officer}</p>
              )}
              {isInProgress && (
                <span className="inline-block mt-1 text-[11px] font-semibold text-primary-500 bg-primary-050 px-2 py-0.5 rounded border border-primary-100 italic">
                  In Progress
                </span>
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
}
