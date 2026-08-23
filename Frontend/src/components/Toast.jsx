import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function Toast({ message, visible }) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-primary-900 text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-display font-medium border border-primary-700 animate-bounce">
      <CheckCircle className="w-4 h-4 text-success" />
      <span>{message}</span>
    </div>
  );
}
