import React from 'react';
import { LayoutList } from 'lucide-react';

interface PreviewContentBlocksProps {
  blocks: any[];
}

function getString(val: any, fallback = ''): string {
  if (typeof val === 'string') return val;
  return fallback;
}

export function PreviewContentBlocks({ blocks }: PreviewContentBlocksProps) {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 flex flex-col items-center justify-center text-slate-500">
        <LayoutList className="w-12 h-12 mb-4 opacity-50" />
        <p>No content blocks found for this view.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
          <LayoutList className="w-5 h-5 text-indigo-400" />
          Content Blocks ({blocks.length})
        </h2>
      </div>

      <div className="space-y-4">
        {blocks.map((block) => {
          let contentStr = '';
          try {
            contentStr = JSON.stringify(block.content, null, 2);
          } catch (e) {
            contentStr = 'Invalid JSON content';
          }

          return (
            <div key={block.id} className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden flex flex-col">
              {/* Header */}
              <div className="px-4 py-3 bg-slate-900 border-b border-slate-700 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded font-medium">
                    {block.block_type}
                  </span>
                  <span className="text-sm font-semibold text-slate-200">
                    {block.name}
                  </span>
                </div>
                {block.is_active ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Active</span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-slate-500/20 text-slate-400 border border-slate-500/30">Inactive</span>
                )}
              </div>

              {/* JSON preview */}
              <div className="p-4 bg-slate-950 overflow-x-auto text-xs font-mono text-slate-400">
                <pre>{contentStr}</pre>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
