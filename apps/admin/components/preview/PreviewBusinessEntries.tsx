import React from 'react';
import { Building2 } from 'lucide-react';

interface PreviewBusinessEntriesProps {
  entries: any[];
}

export function PreviewBusinessEntries({ entries }: PreviewBusinessEntriesProps) {
  if (!entries || entries.length === 0) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 flex flex-col items-center justify-center text-slate-500">
        <Building2 className="w-12 h-12 mb-4 opacity-50" />
        <p>No business entries found for this view.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-indigo-400" />
          Business Portfolio ({entries.length} entries)
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden flex flex-col">
            {/* Status Badge */}
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-700 flex justify-between items-center">
              <span className="text-xs font-mono text-slate-400">Order: {entry.display_order}</span>
              {entry.status === 'active' && <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Active</span>}
              {entry.status === 'coming_soon' && <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">Coming Soon</span>}
              {entry.status === 'draft' && <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">Draft</span>}
              {entry.status === 'inactive' && <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-slate-500/20 text-slate-400 border border-slate-500/30">Inactive</span>}
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-semibold text-slate-200 mb-1">{entry.name}</h3>
              <p className="text-sm text-slate-400 mb-4 line-clamp-2">{entry.short_description || 'No description'}</p>
              
              <div className="mt-auto space-y-2">
                {entry.redirect_url ? (
                  <div className="text-xs font-mono text-indigo-400 truncate border border-indigo-500/30 bg-indigo-500/10 rounded px-2 py-1">
                    Redirects to: {entry.redirect_url}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500">No redirect configured</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
