'use client';

import Link from 'next/link';
import { ArrowRight, ArrowUpRight, CheckCircle2, Building, Briefcase, Map, Target, TrendingUp, FileSignature, ShieldCheck, Plus, HelpCircle } from 'lucide-react';
import type { NormalizedContentBlock } from '../lib/public-cms-types';
import { ReactNode, useState } from 'react';

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
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] font-sans selection:bg-[#D97706] selection:text-[#FFFFFF]">
      {/* Navigation */}
      <nav className="absolute top-0 w-full z-50 p-6 md:px-12 flex justify-between items-center bg-transparent text-white">
        <Link href="/" className="text-sm font-semibold tracking-[0.1em] uppercase hover:opacity-80 transition-opacity">
          VAVAW Ecosystem
        </Link>
        <Link 
          href="https://vavaw.vn" 
          className="text-xs uppercase tracking-wider font-semibold border border-white px-6 py-2.5 hover:bg-white hover:text-[#111] transition-colors"
        >
          Contact Us
        </Link>
      </nav>

      {blocks.map((block) => {
        const { id, blockType, content } = block;

        if (blockType === 'hero') {
          return (
            <section key={id} className="relative h-[90vh] min-h-[700px] flex items-center bg-[#111111] text-white">
              <div 
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-50 mix-blend-overlay"
                style={content.backgroundImage ? { backgroundImage: `url(${getString(content.backgroundImage)})` } : {}}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent z-10" />
              
              <div className="relative z-20 px-6 md:px-12 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-end pb-24 md:pb-32 gap-12 justify-between">
                <div className="max-w-2xl">
                  {getString(content.category) && (
                    <span className="text-sm uppercase tracking-[0.2em] mb-4 block text-[#D97706] font-semibold">
                      {getString(content.category)}
                    </span>
                  )}
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium tracking-tight mb-6 leading-tight">
                    {getString(content.title, 'Franchise')}
                  </h1>
                  <p className="text-lg md:text-xl font-light text-gray-300 max-w-xl leading-relaxed mb-10 whitespace-pre-wrap">
                    {getString(content.subtitle)} {getString(content.description)}
                  </p>
                  <button className="group flex items-center gap-3 bg-[#D97706] text-white px-8 py-4 text-sm uppercase tracking-wider font-semibold hover:bg-[#B45309] transition-all duration-300 shadow-lg shadow-[#D97706]/20">
                    {getString(content.ctaLabel, 'Explore')}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <div className="hidden md:flex flex-col gap-6 text-sm font-medium text-gray-400">
                  <div className="flex flex-col gap-1">
                    <span className="text-white text-3xl font-serif">Global</span>
                    <span>Network</span>
                  </div>
                  <div className="w-12 h-[1px] bg-gray-700" />
                  <div className="flex flex-col gap-1">
                    <span className="text-white text-3xl font-serif">Proven</span>
                    <span>Model</span>
                  </div>
                </div>
              </div>
            </section>
          );
        }

        if (blockType === 'feature_grid' || blockType === 'product_highlights') {
          const items = getBlockItems(content);
          return (
            <section key={id} className="py-24 md:py-32 px-6 md:px-12 bg-white">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 md:mb-24">
                  <h2 className="text-3xl md:text-5xl font-serif font-medium mb-6">{getString(content.title)}</h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light leading-relaxed whitespace-pre-wrap">
                    {getString(content.description)}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {items.map((item, i) => (
                    <div key={i} className="p-8 bg-[#FAFAFA] border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
                      {i % 4 === 0 ? <Target className="w-8 h-8 mb-6 text-[#D97706]" strokeWidth={1.5} /> :
                       i % 4 === 1 ? <TrendingUp className="w-8 h-8 mb-6 text-[#D97706]" strokeWidth={1.5} /> :
                       i % 4 === 2 ? <FileSignature className="w-8 h-8 mb-6 text-[#D97706]" strokeWidth={1.5} /> :
                       <ShieldCheck className="w-8 h-8 mb-6 text-[#D97706]" strokeWidth={1.5} />}
                      <h3 className="text-xl font-medium mb-3">{getString(item.title || item.name)}</h3>
                      <p className="text-sm text-gray-600 font-light leading-relaxed">
                        {getString(item.description)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (blockType === 'faq') {
          const items = getBlockItems(content);
          return (
            <section key={id} className="py-24 px-6 md:px-12 bg-[#F9FAFB] border-t border-gray-200">
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-16">
                  <HelpCircle className="w-10 h-10 mx-auto text-gray-400 mb-6" strokeWidth={1.5} />
                  <h2 className="text-3xl md:text-4xl font-serif font-medium">{getString(content.title, 'Common Questions')}</h2>
                </div>
                
                <div className="space-y-6">
                  {items.map((faq, i) => (
                    <div key={i} className="bg-white p-6 border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer group">
                      <div className="flex justify-between items-center">
                        <h4 className="text-lg font-medium text-gray-900 pr-8">{getString(faq.question || faq.q)}</h4>
                        <Plus className="w-5 h-5 text-gray-400 group-hover:text-[#D97706] transition-colors shrink-0" />
                      </div>
                      {/* Note: since this is a simple renderer, we could add state to toggle, but for now we mimic the original mock */}
                      {i === 0 && (
                        <p className="mt-4 text-sm text-gray-600 leading-relaxed font-light">
                          {getString(faq.answer || faq.a || faq.description)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (blockType === 'cta') {
          return (
            <section key={id} className="py-24 md:py-32 px-6 text-center bg-[#111111] text-white">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-serif font-medium mb-8">
                  {getString(content.title)}
                </h2>
                {getString(content.description) && (
                  <p className="text-lg text-gray-400 font-light mb-12 max-w-xl mx-auto whitespace-pre-wrap">
                    {getString(content.description)}
                  </p>
                )}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  {getString(content.buttonHref) ? (
                    <Link href={getString(content.buttonHref)}>
                      <button className="w-full sm:w-auto bg-[#D97706] text-white px-8 py-4 text-sm uppercase tracking-wider font-semibold hover:bg-[#B45309] transition-all">
                        {getString(content.buttonLabel, 'Apply Now')}
                      </button>
                    </Link>
                  ) : (
                    <button className="w-full sm:w-auto bg-[#D97706] text-white px-8 py-4 text-sm uppercase tracking-wider font-semibold hover:bg-[#B45309] transition-all">
                      {getString(content.buttonLabel, 'Apply Now')}
                    </button>
                  )}
                  <Link 
                    href={getString(content.secondaryButtonHref, "https://vavaw.vn")}
                    className="w-full sm:w-auto inline-flex justify-center items-center gap-2 border-b border-gray-600 pb-1 text-sm uppercase tracking-wider hover:text-gray-300 hover:border-gray-300 transition-colors"
                  >
                    {getString(content.secondaryButtonLabel, "Back to VAVAW")}
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </section>
          );
        }

        if (blockType === 'rich_text') {
           return (
            <section key={id} className="py-24 md:py-40 px-6 md:px-12 bg-white">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-5xl font-serif font-medium mb-8 leading-snug">
                  {getString(content.title)}
                </h2>
                <p className="text-base md:text-lg text-gray-600 font-light leading-relaxed whitespace-pre-wrap">
                  {getString(content.body)}
                </p>
              </div>
            </section>
           );
        }

        if (blockType === 'video') {
          return (
            <section key={id} className="py-24 px-6 bg-black">
              <div className="max-w-5xl mx-auto">
                <div className="text-center">
                  {getString(content.title) && (
                    <h2 className="text-3xl font-light text-white mb-6">
                      {getString(content.title)}
                    </h2>
                  )}
                  {getString(content.description) && (
                    <p className="text-[#a3a3a3] text-lg font-light mb-12 max-w-2xl mx-auto">
                      {getString(content.description)}
                    </p>
                  )}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/10 shadow-2xl">
                    {getString(content.videoUrl) ? (
                      <video 
                        src={getString(content.videoUrl)} 
                        poster={getString(content.posterUrl) || undefined}
                        controls 
                        playsInline 
                        preload="metadata"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-[#525252]">
                        <span className="text-sm tracking-widest uppercase font-medium">Video missing</span>
                      </div>
                    )}
                  </div>
                  {getString(content.caption) && (
                    <p className="text-sm text-[#737373] mt-4 font-light">
                      {getString(content.caption)}
                    </p>
                  )}
                </div>
              </div>
            </section>
          );
        }
        return null;
      })}

      {/* Footer */}
      <footer className="py-12 px-6 md:px-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs tracking-widest uppercase text-gray-500 font-semibold">
          <div>&copy; {new Date().getFullYear()} VAVAW Franchise.</div>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-gray-900 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-gray-900 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-gray-900 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
