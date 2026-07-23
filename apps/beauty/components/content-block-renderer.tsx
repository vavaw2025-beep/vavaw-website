'use client';

import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Sparkles, Droplets, Heart } from 'lucide-react';
import type { NormalizedContentBlock } from '../lib/public-cms-types';
import { ReactNode } from 'react';

// Safety helpers
function getString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function getBlockItems(content: Record<string, unknown>): any[] {
  if (Array.isArray(content.items)) {
    return content.items;
  }
  return [];
}

export function ContentBlockRenderer({ blocks, fallbackContent }: { blocks: NormalizedContentBlock[], fallbackContent?: ReactNode }) {
  if (!blocks || blocks.length === 0) {
    return <>{fallbackContent}</>;
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2A29] font-sans selection:bg-[#EAE4D9] selection:text-[#2C2A29]">
      {/* Navigation - Note: We could render this outside or via a separate block, 
          but keeping it simple inside renderer to replace entire page body easily */}
      <nav className="absolute top-0 w-full z-50 p-6 md:px-12 flex justify-between items-center bg-transparent">
        <Link href="/" className="text-sm font-medium tracking-[0.2em] uppercase hover:opacity-70 transition-opacity">
          VAVAW Ecosystem
        </Link>
        <Link 
          href="https://vavaw.vn" 
          className="text-xs uppercase tracking-widest border border-current px-5 py-2 hover:bg-[#2C2A29] hover:text-[#FDFBF7] transition-colors"
        >
          Contact Us
        </Link>
      </nav>

      {blocks.map((block) => {
        const { id, blockType, content } = block;

        if (blockType === 'hero') {
          return (
            <section key={id} className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-[#EAE4D9]">
              <div 
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-multiply"
                style={content.backgroundImage ? { backgroundImage: `url(${getString(content.backgroundImage)})` } : {}}
              />
              <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
                {getString(content.category) && (
                  <span className="text-xs md:text-sm uppercase tracking-[0.3em] mb-6 block text-[#5C5855]">
                    {getString(content.category)}
                  </span>
                )}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light tracking-tight mb-6 text-[#2C2A29] leading-tight">
                  {getString(content.title, 'Beauty')}
                </h1>
                <p className="text-lg md:text-2xl font-light text-[#5C5855] max-w-2xl mx-auto leading-relaxed mb-12 whitespace-pre-wrap">
                  {getString(content.subtitle)}
                </p>
                <button className="group flex items-center gap-4 bg-[#2C2A29] text-[#FDFBF7] px-8 py-4 text-sm uppercase tracking-widest hover:bg-[#4A4744] transition-all duration-300">
                  {getString(content.ctaLabel, 'Explore')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </section>
          );
        }

        if (blockType === 'rich_text') {
          return (
            <section key={id} className="py-24 md:py-40 px-6 md:px-12 bg-[#FDFBF7]">
              <div className="max-w-3xl mx-auto text-center">
                <Sparkles className="w-6 h-6 mx-auto mb-8 text-[#A89F91]" strokeWidth={1} />
                <h2 className="text-3xl md:text-5xl font-serif font-light mb-8 leading-snug">
                  {getString(content.title)}
                </h2>
                <p className="text-base md:text-lg text-[#5C5855] font-light leading-relaxed whitespace-pre-wrap">
                  {getString(content.body)}
                </p>
              </div>
            </section>
          );
        }

        if (blockType === 'feature_grid' || blockType === 'product_highlights') {
          const items = getBlockItems(content);
          return (
            <section key={id} className="py-24 px-6 md:px-12 bg-[#F7F4EE]">
              <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-16">
                  <h2 className="text-2xl md:text-4xl font-serif font-light">{getString(content.title)}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {items.map((item, i) => (
                    <div key={i} className="group p-8 md:p-12 bg-[#FDFBF7] border border-[#EAE4D9] hover:border-[#D1C9B8] transition-colors cursor-pointer">
                      {i % 3 === 0 ? <Sparkles className="w-5 h-5 mb-6 opacity-60" strokeWidth={1.5} /> : 
                       i % 3 === 1 ? <Droplets className="w-5 h-5 mb-6 opacity-60" strokeWidth={1.5} /> :
                       <Heart className="w-5 h-5 mb-6 opacity-60" strokeWidth={1.5} />}
                      <h3 className="text-xl font-serif mb-4">{getString(item.title || item.name)}</h3>
                      <p className="text-sm text-[#5C5855] font-light leading-relaxed mb-8">
                        {getString(item.description)}
                      </p>
                      <div className="w-8 h-[1px] bg-[#2C2A29] group-hover:w-16 transition-all duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (blockType === 'gallery') {
          const images = Array.isArray(content.images) ? content.images : [];
          return (
            <section key={id} className="py-24 md:py-32 px-6 md:px-12 bg-[#FDFBF7]">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {images.length > 0 ? images.map((img: any, i) => (
                    <div 
                      key={i} 
                      className={`aspect-[4/5] bg-[#EAE4D9] flex items-center justify-center p-6 text-center ${i % 2 === 0 ? 'md:translate-y-8' : ''}`}
                      style={img.url ? { backgroundImage: `url(${img.url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                    >
                      {!img.url && (
                        <span className="text-[10px] tracking-widest uppercase text-[#A89F91]">
                          Atmosphere 0{i + 1}
                        </span>
                      )}
                    </div>
                  )) : (
                    [1, 2, 3, 4].map((i) => (
                      <div 
                        key={i} 
                        className={`aspect-[4/5] bg-[#EAE4D9] flex items-center justify-center p-6 text-center ${i % 2 === 0 ? 'md:translate-y-8' : ''}`}
                      >
                        <span className="text-[10px] tracking-widest uppercase text-[#A89F91]">
                          Atmosphere 0{i}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>
          );
        }

        if (blockType === 'cta') {
          return (
            <section key={id} className="py-32 md:py-48 px-6 text-center bg-[#F7F4EE]">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-serif font-light mb-8 text-[#2C2A29]">
                  {getString(content.title)}
                </h2>
                {getString(content.description) && (
                  <p className="text-lg text-[#5C5855] font-light mb-12">
                    {getString(content.description)}
                  </p>
                )}
                <Link 
                  href={getString(content.buttonHref, "https://vavaw.vn")}
                  className="inline-flex items-center gap-3 border-b border-[#2C2A29] pb-1 text-sm uppercase tracking-widest hover:text-[#5C5855] hover:border-[#5C5855] transition-colors"
                >
                  {getString(content.buttonLabel, "Return to VAVAW")}
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          );
        }

        // custom_json or unhandled
        return null;
      })}

      {/* Footer */}
      <footer className="py-8 px-6 md:px-12 bg-[#FDFBF7] border-t border-[#EAE4D9] flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-wider uppercase text-[#A89F91]">
        <div>&copy; {new Date().getFullYear()} VAVAW Beauty & Co.</div>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-[#2C2A29] transition-colors">Instagram</Link>
          <Link href="#" className="hover:text-[#2C2A29] transition-colors">Contact</Link>
        </div>
      </footer>
    </div>
  );
}
