import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface PreviewMediaPanelProps {
  media: any[];
}

export function PreviewMediaPanel({ media }: PreviewMediaPanelProps) {
  if (!media || media.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-4 border-b border-slate-700 pb-2">
        <ImageIcon className="w-4 h-4 text-indigo-400" />
        Media Assets Included in this view ({media.length})
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {media.map((asset) => (
          <div key={asset.id} className="bg-slate-800 border border-slate-700 rounded-md overflow-hidden">
            <div className="aspect-square bg-slate-900 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={asset.url} 
                alt={asset.alt_text || 'Media preview'} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-2 text-xs truncate text-slate-400" title={asset.filename}>
              {asset.filename}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
