import React from 'react';
import { Presentation } from 'lucide-react';

interface PreviewHeroProps {
  slides: any[];
}

export function PreviewHero({ slides }: PreviewHeroProps) {
  if (!slides || slides.length === 0) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 flex flex-col items-center justify-center text-slate-500">
        <Presentation className="w-12 h-12 mb-4 opacity-50" />
        <p>No hero slides found for this view.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
          <Presentation className="w-5 h-5 text-indigo-400" />
          Hero Carousel ({slides.length} slides)
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slides.map((slide, index) => (
          <div key={slide.id} className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden flex flex-col">
            {/* Status Badge */}
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-700 flex justify-between items-center">
              <span className="text-xs font-mono text-slate-400">Slide {index + 1} • Seq {slide.sequence_order}</span>
              {slide.is_active ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Active</span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">Draft</span>
              )}
            </div>

            {/* Simulated Media Area */}
            <div className="aspect-video bg-slate-900 relative overflow-hidden flex items-center justify-center border-b border-slate-700">
              {slide.media_assets?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={slide.media_assets.url} 
                  alt={slide.media_assets.alt_text || 'Slide media'} 
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
              ) : (
                <div className="text-slate-600 text-sm">No Media Assigned</div>
              )}
              
              {/* Overlay Content */}
              <div className="relative z-10 text-center p-6 bg-slate-900/50 backdrop-blur-sm rounded border border-slate-700/50 w-3/4">
                <h3 className="text-xl font-bold text-white mb-2">{slide.headline}</h3>
                {slide.subheadline && <p className="text-sm text-slate-300 mb-4">{slide.subheadline}</p>}
                
                {slide.cta_text && (
                  <div className="inline-block px-4 py-1.5 bg-indigo-500 text-white text-xs font-medium rounded-sm">
                    {slide.cta_text}
                  </div>
                )}
              </div>
            </div>

            {/* Debug Info */}
            <div className="p-4 bg-slate-800/50 text-xs font-mono text-slate-400">
              <div><span className="text-slate-500">Link:</span> {slide.cta_link || 'None'}</div>
              <div><span className="text-slate-500">Duration:</span> {slide.duration_ms}ms</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
