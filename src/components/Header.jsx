import React from 'react';
import { ShieldCheck, User, Shield, Sparkles } from 'lucide-react';

export default function Header({ role, setRole, onTriggerDemo }) {
  return (
    <header className="sticky top-0 z-50 bg-primary-800/90 backdrop-blur-md border-b border-primary-700 text-white px-4 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-primary-700 border border-primary-500/30 flex items-center justify-center text-verified-glow shadow-inner">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-display font-bold text-lg leading-tight tracking-tight flex items-center gap-1.5">
              FixMyCity <span className="text-verified-glow text-xs uppercase px-1.5 py-0.5 rounded bg-primary-900 border border-verified-glow/30">AI</span>
            </div>
            <p className="text-[11px] text-neutral-300 hidden sm:block">Civic Issue Tracker & Verification Engine</p>
          </div>
        </div>

        {/* Role Switcher & Demo Toggle */}
        <div className="flex items-center gap-2">
          
          {/* Role Pill Switch */}
          <div className="bg-primary-900/80 p-1 rounded-full border border-primary-700 flex items-center text-xs font-display">
            <button
              onClick={() => setRole('citizen')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                role === 'citizen'
                  ? 'bg-white text-primary-900 font-semibold shadow-sm'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Citizen</span>
            </button>

            <button
              onClick={() => setRole('officer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                role === 'officer'
                  ? 'bg-white text-primary-900 font-semibold shadow-sm'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Officer</span>
            </button>
          </div>

          {/* Demo Button */}
          <button
            onClick={onTriggerDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-verified-glow/20 border border-verified-glow/40 text-verified-glow hover:bg-verified-glow/30 text-xs font-display font-semibold transition-all shadow-sm active:scale-95"
            title="Load ready-to-present hackathon demo flow"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">DEMO</span>
          </button>

        </div>
      </div>
    </header>
  );
}
