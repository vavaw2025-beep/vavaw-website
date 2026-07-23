import React from 'react';

export function PreviewBanner() {
  return (
    <div className="bg-indigo-600 text-white px-4 py-2 text-sm font-medium flex items-center justify-between sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-2">
        <span className="animate-pulse">●</span>
        <span>Preview Mode Active — Draft content may be visible.</span>
      </div>
      <a 
        href="/api/preview/exit" 
        className="px-3 py-1 bg-white text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors text-xs font-semibold"
      >
        Exit Preview
      </a>
    </div>
  );
}
