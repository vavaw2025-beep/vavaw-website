import React from 'react';
import { Search } from 'lucide-react';

interface PreviewSeoPanelProps {
  seo: any;
}

export function PreviewSeoPanel({ seo }: PreviewSeoPanelProps) {
  if (!seo) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 flex items-center justify-center text-slate-500 text-sm">
        No SEO metadata found for this path.
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-4">
      <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-4 border-b border-slate-700 pb-2">
        <Search className="w-4 h-4 text-indigo-400" />
        SEO Metadata
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <span className="block text-slate-500 text-xs mb-1">Title</span>
          <span className="text-slate-200 font-medium">{seo.title || '—'}</span>
        </div>
        <div>
          <span className="block text-slate-500 text-xs mb-1">Description</span>
          <span className="text-slate-300">{seo.description || '—'}</span>
        </div>
        <div>
          <span className="block text-slate-500 text-xs mb-1">Keywords</span>
          <span className="text-slate-300">{seo.keywords || '—'}</span>
        </div>
        <div>
          <span className="block text-slate-500 text-xs mb-1">Robots</span>
          <div className="flex gap-2 mt-1">
            {seo.robots_index ? (
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Index</span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">No Index</span>
            )}
            {seo.robots_follow ? (
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Follow</span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">No Follow</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
