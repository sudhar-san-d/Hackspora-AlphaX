import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg p-4 border border-neutral-200 shadow-sm space-y-3">
      <div className="flex justify-between items-center">
        <div className="h-4 w-24 skeleton"></div>
        <div className="h-5 w-16 skeleton rounded-full"></div>
      </div>
      <div className="h-5 w-3/4 skeleton"></div>
      <div className="h-3 w-1/2 skeleton"></div>
      <div className="pt-2 border-t border-neutral-100 flex justify-between">
        <div className="h-4 w-28 skeleton"></div>
        <div className="h-4 w-20 skeleton"></div>
      </div>
    </div>
  );
}
