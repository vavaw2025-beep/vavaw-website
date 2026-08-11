import { ShieldCheck, ChevronRight } from 'lucide-react';
import { CosmeticCtaTracker } from '../../cosmetic-tracker';
import { SiteFooter } from '@vavaw/ui';
import { ProductLandingContent } from '../_components/product-landing-types';

import { ProductJsonLd } from '../_components/ProductJsonLd';

interface ProductLandingPageProps {
  content: ProductLandingContent;
  cosmeticMedia: any;
  canonicalPath: string;
}

export function LuminousSetLandingPage({ content, cosmeticMedia, canonicalPath }: ProductLandingPageProps) {
  // Helper for rendering slot images safely with a gradient card fallback
  const renderSlotImage = (srcUrl: string | undefined, altText: string, fallbackGrad: string) => {
    if (srcUrl && srcUrl.trim() && !srcUrl.includes('PASTE_')) {
      return (
        <img
          src={srcUrl.trim()}
          alt={altText}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      );
    }
    return (
      <div className={`w-full h-full bg-gradient-to-br ${fallbackGrad} flex items-center justify-center p-4 relative`}>
        <div className="absolute inset-4 border border-white/20" />
        <span className="text-[10px] text-white/50 tracking-widest font-mono uppercase">{altText}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-[#E2E8F0] selection:text-[#050A5C]">
      <ProductJsonLd content={content} canonicalPath={canonicalPath} cosmeticMedia={cosmeticMedia} />
      
      {/* ─── BREADCRUMB ────────────────────────────────────────────────────────── */}
      <div className="pt-24 md:pt-28 pb-4 px-6 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto flex items-center gap-1.5 text-[10px] md:text-xs text-slate-400 font-medium uppercase tracking-wider">
          <a href="/cosmetic" className="hover:text-[#050A5C] transition-colors">Cosmetic</a>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-slate-600 font-bold truncate">{content.title}</span>
        </div>
      </div>

      {/* ─── PRODUCT HERO ──────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24 px-6 border-b border-slate-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visual Media packshot */}
          <div className="relative aspect-[4/5] bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center p-6 md:p-8">
            {renderSlotImage(
              cosmeticMedia[content.heroMediaSlot as keyof typeof cosmeticMedia] || cosmeticMedia.luminousSet,
              content.title,
              'from-[#050A5C]/20 to-[#050A5C]/40'
            )}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between text-[9px] font-mono text-slate-400 uppercase tracking-widest pointer-events-none">
              <span>VAVAW COSMETIC</span>
              <span>CLINICAL RECOVERY SYSTEM</span>
            </div>
          </div>

          {/* Right Column: Hero Content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] md:text-[11px] font-bold text-[#050A5C]/60 tracking-[0.2em] uppercase block">
                {content.eyebrow}
              </span>
              <h1 className="text-3xl md:text-4.5xl font-light text-[#050A5C] tracking-tight font-serif leading-tight">
                {content.title}
              </h1>
              {content.headline && (
                <p className="text-sm md:text-base font-light text-[#050A5C]/80 italic leading-relaxed">
                  {content.headline}
                </p>
              )}
            </div>

            <hr className="border-slate-100" />

            <p className="text-slate-500 font-light text-sm leading-relaxed whitespace-pre-wrap">
              {content.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <CosmeticCtaTracker
                label={content.ctaLabel}
                href={content.ctaHref}
                className="w-full sm:w-auto h-[48px] px-8 flex items-center justify-center bg-[#050A5C] text-white text-[11px] font-bold tracking-[0.15em] uppercase hover:bg-[#101A8C] transition-colors rounded-[1px] shadow-sm"
              />
              <CosmeticCtaTracker
                label={content.secondaryCtaLabel}
                href={content.secondaryCtaHref}
                className="w-full sm:w-auto h-[48px] px-8 flex items-center justify-center border border-slate-200 text-slate-600 text-[11px] font-medium tracking-[0.15em] uppercase hover:bg-slate-50 transition-colors rounded-[1px]"
              />
            </div>
          </div>
        </div>
      </section>
      {/* ─── ANTI-GRAVITY SOLUTION ───────────────────────────────────────────── */}
      {content.antiGravity && (
        <section className="bg-white py-16 md:py-24 px-6 border-b border-slate-100">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
            {/* Left Column: Text + Callouts */}
            <div className="space-y-10 order-2 lg:order-1">
              <div className="space-y-4">
                {content.antiGravity.eyebrow && (
                  <span className="text-[10px] md:text-[11px] font-bold text-[#050A5C]/60 tracking-[0.2em] uppercase block">
                    {content.antiGravity.eyebrow}
                  </span>
                )}
                {content.antiGravity.title && (
                  <h2 className="text-2xl md:text-3.5xl font-light text-[#050A5C] tracking-tight font-serif leading-tight">
                    {content.antiGravity.title}
                  </h2>
                )}
                {content.antiGravity.headline && (
                  <p className="text-sm md:text-base font-light text-[#050A5C]/80 italic leading-relaxed">
                    {content.antiGravity.headline}
                  </p>
                )}
                {content.antiGravity.description && (
                  <p className="text-slate-500 font-light text-sm leading-relaxed whitespace-pre-wrap">
                    {content.antiGravity.description}
                  </p>
                )}
              </div>

              {content.antiGravity.callouts && content.antiGravity.callouts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {content.antiGravity.callouts.map((callout, idx) => (
                    <div key={idx} className="p-4 border border-slate-200 bg-slate-50/30 flex flex-col space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{callout.label}</span>
                      {callout.value && <span className="font-bold text-[#050A5C] text-sm">{callout.value}</span>}
                      {callout.description && <p className="text-[11px] text-slate-500 font-light leading-relaxed pt-1">{callout.description}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Large Image Stage */}
            <div className="relative aspect-[3/4] md:aspect-square lg:aspect-auto lg:h-[600px] bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center p-4 order-1 lg:order-2">
              {renderSlotImage(
                cosmeticMedia[content.antiGravity.mediaSlot as keyof typeof cosmeticMedia] || cosmeticMedia.antiGravity,
                content.antiGravity.title || 'Anti Gravity Solution',
                'from-[#050A5C]/20 to-[#050A5C]/40'
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─── WHO NEEDS SHEER SET ──────────────────────────────────────────────── */}
      {content.whoNeedsSet && (
        <section className="bg-white py-16 md:py-24 px-6 border-b border-slate-100">
          <div className="max-w-[1200px] mx-auto lg:px-8 grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-10 items-center">
            {/* Left Column: Text + Checklist */}
            <div className="space-y-10">
              <div className="space-y-4">
                {content.whoNeedsSet.eyebrow && (
                  <span className="text-[10px] md:text-[11px] font-bold text-[#050A5C]/60 tracking-[0.2em] uppercase block">
                    {content.whoNeedsSet.eyebrow}
                  </span>
                )}
                {content.whoNeedsSet.title && (
                  <h2 className="text-2xl md:text-3.5xl font-light text-[#050A5C] tracking-tight font-serif leading-tight">
                    {content.whoNeedsSet.title}
                  </h2>
                )}
                {content.whoNeedsSet.note && (
                  <p className="text-xs md:text-sm font-light text-[#050A5C]/80 italic leading-relaxed bg-slate-50 border-l-2 border-[#050A5C]/20 p-3">
                    {content.whoNeedsSet.note}
                  </p>
                )}
                {content.whoNeedsSet.description && (
                  <p className="text-slate-500 font-light text-sm leading-relaxed whitespace-pre-wrap pt-2">
                    {content.whoNeedsSet.description}
                  </p>
                )}
              </div>

              {content.whoNeedsSet.items && content.whoNeedsSet.items.length > 0 && (
                <div className="space-y-4 pt-2">
                  {content.whoNeedsSet.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <ShieldCheck className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                      <span className="text-xs md:text-sm text-slate-600 font-light leading-relaxed">{item.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Large Image Stage */}
            <div className="relative aspect-[4/3] md:aspect-[3/2] lg:aspect-auto lg:h-[550px] bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center p-4">
              {renderSlotImage(
                cosmeticMedia[content.whoNeedsSet.mediaSlot as keyof typeof cosmeticMedia] || cosmeticMedia.whoNeeds,
                content.whoNeedsSet.title || 'Who Needs Sheer Set',
                'from-[#EEF2F8] to-[#DDE3EE]'
              )}
              {content.whoNeedsSet.imageCaption && (
                <div className="absolute bottom-6 left-6 right-6 bg-[#050A5C]/90 backdrop-blur-sm p-4 text-center border border-white/10">
                  <span className="text-white text-xs tracking-widest font-semibold uppercase">{content.whoNeedsSet.imageCaption}</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─── SKIN BARRIER & MG3-PLUS TECHNOLOGY ───────────────────────────────── */}
      {content.barrierScience && (
        <section className="bg-slate-50/50 py-16 md:py-24 px-6 border-b border-slate-100">
          <div className="max-w-[1200px] mx-auto lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Left Card: Skin Barrier Science */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
              <div className="p-8 md:p-10 space-y-4 flex-1">
                {content.barrierScience.eyebrow && (
                  <span className="text-[10px] md:text-[11px] font-bold text-[#050A5C]/60 tracking-[0.2em] uppercase block">
                    {content.barrierScience.eyebrow}
                  </span>
                )}
                {content.barrierScience.title && (
                  <h3 className="text-xl md:text-2xl font-light text-[#050A5C] tracking-tight font-serif leading-tight">
                    {content.barrierScience.title}
                  </h3>
                )}
                {content.barrierScience.description && (
                  <p className="text-slate-500 font-light text-sm leading-relaxed whitespace-pre-wrap pt-2">
                    {content.barrierScience.description}
                  </p>
                )}
              </div>
              <div className="relative aspect-[4/3] bg-slate-50 border-t border-slate-100 p-6 flex items-center justify-center">
                {renderSlotImage(
                  cosmeticMedia[content.barrierScience.mediaSlot as keyof typeof cosmeticMedia] || cosmeticMedia.barrierScience,
                  content.barrierScience.title || 'Skin Barrier Science',
                  'from-[#EEF2F8] to-[#DDE3EE]'
                )}
              </div>
            </div>

            {/* Right Card: MG3-Plus Method */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
              <div className="p-8 md:p-10 space-y-4 flex-1">
                {content.barrierScience.mg3Eyebrow && (
                  <div className="inline-flex items-center gap-2">
                    <span className="text-[10px] md:text-[11px] font-bold text-[#050A5C] tracking-[0.2em] uppercase block">
                      {content.barrierScience.mg3Eyebrow}
                    </span>
                    <span className="bg-yellow-100 text-yellow-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Exclusive
                    </span>
                  </div>
                )}
                {content.barrierScience.mg3Title && (
                  <h3 className="text-xl md:text-2xl font-light text-[#050A5C] tracking-tight font-serif leading-tight">
                    {content.barrierScience.mg3Title}
                  </h3>
                )}
                {content.barrierScience.mg3Description && (
                  <p className="text-slate-500 font-light text-sm leading-relaxed whitespace-pre-wrap pt-2">
                    {content.barrierScience.mg3Description}
                  </p>
                )}
              </div>
              <div className="relative aspect-[4/3] bg-slate-50 border-t border-slate-100 p-6 flex items-center justify-center">
                {renderSlotImage(
                  cosmeticMedia[content.barrierScience.mg3MediaSlot as keyof typeof cosmeticMedia] || cosmeticMedia.mg3Plus,
                  content.barrierScience.mg3Title || 'MG3-Plus Method',
                  'from-[#EEF2F8] to-[#DDE3EE]'
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── ACTIVE INGREDIENTS ────────────────────────────────────────────────── */}
      {content.activeIngredients && (
        <section className="bg-white py-16 md:py-24 px-6 border-b border-slate-100">
          <div className="max-w-[1200px] mx-auto lg:px-8 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
            {/* Left Column: Text + Image */}
            <div className="space-y-8 flex flex-col h-full">
              <div className="space-y-4">
                {content.activeIngredients.eyebrow && (
                  <span className="text-[10px] md:text-[11px] font-bold text-[#050A5C]/60 tracking-[0.2em] uppercase block">
                    {content.activeIngredients.eyebrow}
                  </span>
                )}
                {content.activeIngredients.title && (
                  <h2 className="text-2xl md:text-3.5xl font-light text-[#050A5C] tracking-tight font-serif leading-tight">
                    {content.activeIngredients.title}
                  </h2>
                )}
                {content.activeIngredients.description && (
                  <p className="text-slate-500 font-light text-sm leading-relaxed whitespace-pre-wrap pt-2">
                    {content.activeIngredients.description}
                  </p>
                )}
              </div>
              
              <div className="relative flex-1 min-h-[300px] md:min-h-[400px] w-full bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center p-4">
                {renderSlotImage(
                  cosmeticMedia[content.activeIngredients.mediaSlot as keyof typeof cosmeticMedia] || cosmeticMedia.activeIngredients,
                  content.activeIngredients.title || 'Active Ingredients',
                  'from-[#EEF2F8] to-[#DDE3EE]'
                )}
              </div>
            </div>

            {/* Right Column: Ingredient List with Accent Line */}
            <div className="relative">
              {/* Vertical Accent Line */}
              <div className="absolute left-[3px] top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-[#050A5C]/15 to-transparent hidden md:block"></div>
              
              <div className="space-y-6 md:pl-8">
                {content.activeIngredients.ingredients && content.activeIngredients.ingredients.map((item, idx) => (
                  <div key={idx} className="relative">
                    {/* Tick mark on accent line */}
                    <div className="absolute -left-[30px] top-2.5 w-1.5 h-1.5 rounded-full bg-[#050A5C]/30 hidden md:block"></div>
                    
                    <div className="bg-slate-50/50 border border-slate-100 p-5 rounded-lg space-y-2">
                      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-1 mb-1">
                        <h4 className="text-[15px] font-semibold text-[#050A5C] font-serif">{item.name}</h4>
                        {item.subtitle && (
                          <span className="text-[9px] font-bold text-yellow-600/80 uppercase tracking-widest">{item.subtitle}</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-light leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── INSIDE THE SET ────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 border-b border-slate-100">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold text-[#050A5C]/50 tracking-[0.2em] uppercase block">WHAT IS INSIDE</span>
            <h2 className="text-2xl md:text-3.5xl font-light text-[#050A5C] tracking-tight font-serif">Chi Tiết Bộ Sản Phẩm</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {content.insideSet.map((p, idx) => {
              const mediaUrl = idx === 0 ? cosmeticMedia.setCellureviveAmpoule : cosmeticMedia.setRegenaglowSheerCream;
              return (
                <div key={idx} className="bg-white border border-slate-200 hover:border-slate-300 transition-colors flex flex-col p-6 space-y-6">
                  {/* Thumbnail stage */}
                  <div className="aspect-[4/3] bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center p-4">
                    {renderSlotImage(mediaUrl, p.name, 'from-[#EEF2F8] to-[#DDE3EE]')}
                  </div>

                  <div className="space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-[#050A5C] text-sm md:text-base leading-tight">{p.name}</h3>
                        <span className="text-[10px] font-mono text-slate-400 font-semibold shrink-0 uppercase">{p.size}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block mt-1">{p.role}</span>
                      <p className="text-xs md:text-sm text-slate-500 font-light leading-relaxed mt-3">{p.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── RECOVERY LOGIC ────────────────────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-28 px-6 border-b border-slate-100">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold text-[#050A5C]/50 tracking-[0.2em] uppercase block">RECOVERY CYCLE</span>
            <h2 className="text-2xl md:text-3.5xl font-light text-[#050A5C] tracking-tight font-serif">Quy Trình Phục Hồi 5 Bước</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {content.recoveryLogic.map((logic, idx) => (
              <div key={idx} className="p-5 border border-slate-100 bg-slate-50/50 flex flex-col justify-between space-y-4">
                <div>
                  <span className="block text-[10px] font-mono text-[#050A5C]/50 font-bold uppercase tracking-wider mb-2">{logic.step}</span>
                  <h3 className="font-bold text-[#050A5C] text-xs uppercase tracking-wide mb-2">{logic.title}</h3>
                  <p className="text-[11px] text-slate-500 font-light leading-relaxed">{logic.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ACTIVE TECHNOLOGY ─────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 border-b border-slate-100">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold text-[#050A5C]/50 tracking-[0.2em] uppercase block">CLINICAL FORMULA</span>
            <h2 className="text-2xl md:text-3.5xl font-light text-[#050A5C] tracking-tight font-serif">Công Nghệ Hoạt Chất</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {content.activeTech.map((tech, idx) => (
              <div key={idx} className="bg-white p-6 border border-slate-200 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-[#050A5C]">{tech.name}</h3>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">{tech.role}</span>
                  <p className="text-xs text-slate-500 font-light leading-relaxed pt-2">{tech.description}</p>
                </div>
                {tech.product && (
                  <div className="text-[9px] font-semibold text-[#050A5C]/60 uppercase tracking-widest border-t border-slate-50 pt-2.5">
                    Ứng dụng: {tech.product}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHO IT'S FOR ──────────────────────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-28 px-6 border-b border-slate-100">
        <div className="max-w-4xl mx-auto space-y-10">
          
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold text-[#050A5C]/50 tracking-[0.2em] uppercase block">SKIN COMPATIBILITY</span>
            <h2 className="text-2xl md:text-3.5xl font-light text-[#050A5C] tracking-tight font-serif">Đối Tượng Sử Dụng</h2>
          </div>

          <div className="bg-slate-50/50 border border-slate-200 p-8 md:p-12 space-y-4 max-w-2xl mx-auto">
            {content.whoItsFor.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <ShieldCheck className="h-5 w-5 text-[#050A5C] shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm text-slate-600 font-light leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW TO USE ────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 border-b border-slate-100">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold text-[#050A5C]/50 tracking-[0.2em] uppercase block">APPLICATION RITUAL</span>
            <h2 className="text-2xl md:text-3.5xl font-light text-[#050A5C] tracking-tight font-serif">Hướng Dẫn Sử Dụng</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-4xl mx-auto">
            {content.howToUse.map((step, idx) => (
              <div key={idx} className="relative space-y-3 p-4">
                <div className="text-3xl font-extrabold text-[#050A5C]/10 font-mono leading-none">{step.step}</div>
                <h3 className="font-bold text-[#050A5C] text-xs uppercase tracking-wide leading-tight">{step.title}</h3>
                <p className="text-[11px] text-slate-500 font-light leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SPA BRIDGE ────────────────────────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-24 px-6 text-center border-b border-slate-100">
        <div className="max-w-2xl mx-auto space-y-6">
          <span className="text-[10px] font-bold text-[#050A5C]/50 tracking-[0.2em] uppercase block">PROFESSIONAL PARTNERSHIP</span>
          <h2 className="text-2xl md:text-3xl font-light text-[#050A5C] font-serif leading-tight">
            {content.spaBridge.title}
          </h2>
          <p className="text-slate-500 font-light text-xs md:text-sm leading-relaxed max-w-xl mx-auto">
            {content.spaBridge.description}
          </p>
          <div className="pt-4">
            <CosmeticCtaTracker
              label={content.spaBridge.ctaLabel}
              href={content.spaBridge.ctaHref}
              className="inline-flex h-[48px] px-8 items-center justify-center bg-[#050A5C] text-white text-[11px] font-bold tracking-[0.15em] uppercase hover:bg-[#101A8C] transition-colors rounded-[1px]"
            />
          </div>
        </div>
      </section>

      {/* ─── PRODUCT INFORMATION ───────────────────────────────────────────────── */}
      <section className="py-20 md:py-24 px-6 border-b border-slate-100">
        <div className="max-w-4xl mx-auto space-y-10">
          
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold text-[#050A5C]/50 tracking-[0.2em] uppercase block">SPECIFICATIONS</span>
            <h2 className="text-xl md:text-2xl font-light text-[#050A5C] tracking-tight font-serif">Thông Tin Chi Tiết</h2>
          </div>

          <div className="bg-white border border-slate-200 overflow-hidden max-w-2xl mx-auto divide-y divide-slate-100">
            {content.productInfo.map((info, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-[180px_1fr] p-4 gap-2 text-xs">
                <span className="font-bold text-[#050A5C] uppercase tracking-wider text-[10px] md:pt-0.5">{info.label}</span>
                <span className="text-slate-600 font-light leading-relaxed">{info.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─────────────────────────────────────────────────────────── */}
      <section className="bg-[#050A5C] py-20 md:py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,10,92,0.15)_100%)] pointer-events-none" />
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <span className="text-[10px] font-bold text-white/50 tracking-[0.25em] uppercase block">VAVAW COSMETIC CONSULTATION</span>
          <h2 className="text-2xl md:text-3.5xl font-light text-white tracking-tight leading-snug">
            {content.finalCta.title}
          </h2>
          <p className="text-white/70 font-light text-xs md:text-sm leading-relaxed max-w-xl mx-auto">
            {content.finalCta.description}
          </p>
          <div className="pt-4">
            <CosmeticCtaTracker
              label={content.finalCta.ctaLabel}
              href={content.finalCta.ctaHref}
              className="inline-flex h-[48px] px-8 items-center justify-center bg-white text-[#050A5C] text-[11px] font-bold tracking-[0.15em] uppercase hover:bg-[#F4F7FB] transition-colors shadow-sm rounded-[1px]"
            />
          </div>
        </div>
      </section>

      {/* ─── SHARED FOOTER ────────────────────────────────────────────────────── */}
      <SiteFooter variant="cosmetic" />
    </div>
  );
}
