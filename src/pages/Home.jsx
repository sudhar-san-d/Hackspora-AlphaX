import React from 'react';
import { Zap, ClipboardList, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Home({ onNavigate, activeCount = 2, resolvedCount = 5 }) {
  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-primary-050 border border-primary-100 p-6 shadow-sm">
        {/* Topographic line SVG background accent */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#2155A3_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-xs font-mono font-semibold text-primary-600 border border-primary-100 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-verified-glow" /> AI-Powered Civic Action
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-primary-900 tracking-tight leading-tight">
            FixMyCity <span className="text-primary-500">AI</span>
          </h1>

          <div className="space-y-1 text-neutral-700 font-body text-base">
            <p className="font-semibold text-neutral-900">Report civic issues.</p>
            <p>Track resolution in real time.</p>
            <p className="text-primary-600 font-medium">Verify real work with AI proof.</p>
          </div>
        </div>
      </div>

      {/* Main Action CTAs */}
      <div className="space-y-3">
        <button
          onClick={() => onNavigate('report')}
          className="btn-primary w-full text-base py-4"
        >
          <Zap className="w-5 h-5 text-verified-glow" />
          <span>Report a Problem</span>
        </button>

        <button
          onClick={() => onNavigate('tracking')}
          className="btn-secondary w-full text-base py-3.5"
        >
          <ClipboardList className="w-5 h-5 text-primary-600" />
          <span>Track My Complaints</span>
        </button>
      </div>

      {/* Stat Chips */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div
          onClick={() => onNavigate('tracking')}
          className="bg-primary-050 border border-primary-100 p-4 rounded-xl cursor-pointer hover:border-primary-300 transition-all text-center"
        >
          <span className="text-2xl font-display font-bold text-primary-600 block">
            {activeCount}
          </span>
          <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
            Active Issues
          </span>
        </div>

        <div className="bg-success-bg border border-green-200 p-4 rounded-xl text-center">
          <span className="text-2xl font-display font-bold text-success flex items-center justify-center gap-1">
            <CheckCircle2 className="w-5 h-5 text-success" /> {resolvedCount}
          </span>
          <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
            Verified Repairs
          </span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center pt-4">
        <p className="text-xs text-neutral-400">
          Powered by Vision AI & Automated SLA Routing
        </p>
      </div>

    </div>
  );
}
