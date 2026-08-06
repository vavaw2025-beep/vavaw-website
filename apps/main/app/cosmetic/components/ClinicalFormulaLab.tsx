'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CosmeticPageMedia } from '@/lib/load-public-cosmetic-media';
import { CosmeticCtaTracker } from '../cosmetic-tracker';
import { FlaskConical } from 'lucide-react';

interface ClinicalFormulaLabProps {
  productCards: any;
  cosmeticMedia: CosmeticPageMedia;
}

// ─── Normalization Getters ───────────────────────────────────────────────────

function getProductName(item: any): string {
  return item.name || item.title || '';
}

function getProductType(item: any): string {
  return item.type || '';
}

function getProductShortDescription(item: any): string {
  return item.shortDescription || item.desc || '';
}

function getProductDescription(item: any): string {
  return item.description || item.shortDescription || item.desc || '';
}

function getProductIngredients(item: any): string[] {
  const raw = item.ingredients || '';
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    return raw.split(' · ').map((s: string) => s.trim()).filter(Boolean);
  }
  return [];
}

function getProductBenefits(item: any): string[] {
  return Array.isArray(item.benefits) ? item.benefits : [];
}

function getProductConcerns(item: any): string[] {
  const raw = item.skinConcerns || '';
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    return raw.split(',').map((s: string) => s.trim()).filter(Boolean);
  }
  return [];
}

function getProductBestFor(item: any): string {
  return item.bestFor || '';
}

function getProductUsage(item: any): string {
  return item.usage || '';
}

function getProductMediaSlot(item: any): string {
  return item.mediaSlot || '';
}

function isValidHeroImageUrl(value?: string | null): value is string {
  if (!value) return false;
  const v = value.trim().toLowerCase();
  if (v.startsWith('http://') || v.startsWith('https://') || v.startsWith('/') || v.startsWith('./') || v.startsWith('../')) {
    return !v.startsWith('javascript:') && !v.startsWith('data:');
  }
  return false;
}

// ─── Product Image Resolver ──────────────────────────────────────────────────

function getProductImage(
  productName: string,
  mediaSlot: string | undefined,
  cosmeticMedia: CosmeticPageMedia
): string | undefined {
  if (mediaSlot) {
    const slotKeyMap: Record<string, keyof CosmeticPageMedia> = {
      'cosmetic-product-luminous-set':     'luminousSet',
      'cosmetic-product-regenaglow-cream': 'regenaglow',
      'cosmetic-product-calmiance-gel':    'calmiance',
      'cosmetic-product-renew-ampoule':    'renewAmpoule',
      'cosmetic-product-p30-moisturizer':  'p30Moisturizer',
      'cosmetic-product-p30-toner':        'p30Toner',
      'cosmetic-product-lumiglow-sunscreen': 'lumiglowSunscreen',
    };
    const key = slotKeyMap[mediaSlot] || (mediaSlot as keyof CosmeticPageMedia);
    const url = cosmeticMedia[key];
    if (url && isValidHeroImageUrl(url)) return url;
  }

  // Fallback by product name
  const name = productName.toLowerCase();
  let fallbackKey: keyof CosmeticPageMedia | null = null;
  if (name.includes('regenaglow')) fallbackKey = 'regenaglow';
  else if (name.includes('calmiance')) fallbackKey = 'calmiance';
  else if (name.includes('renew') || name.includes('ampoule')) fallbackKey = 'renewAmpoule';
  else if (name.includes('moisturizer') && name.includes('p30')) fallbackKey = 'p30Moisturizer';
  else if (name.includes('toner') && name.includes('p30')) fallbackKey = 'p30Toner';
  else if (name.includes('lumiglow') || name.includes('sunscreen')) fallbackKey = 'lumiglowSunscreen';

  if (fallbackKey) {
    const url = cosmeticMedia[fallbackKey];
    if (url && isValidHeroImageUrl(url)) return url;
  }

  return undefined;
}

export function ClinicalFormulaLab({ productCards, cosmeticMedia }: ClinicalFormulaLabProps) {
  const rawItems = productCards.items || [];
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [mobileExpandedIndex, setMobileExpandedIndex] = useState<number | null>(null);

  if (rawItems.length === 0) return null;

  const sectionEyebrow = productCards.eyebrow || 'THE FORMULA LAB';
  const sectionTitle = productCards.title || 'Clinical Formula Lab';
  const sectionSubtitle = productCards.subtitle || 'Targeted Korean formulas for recovery, hydration, calming, renewal, and daily protection.';

  // Resolve active product
  const activeItem = rawItems[activeIndex] || rawItems[0];
  const activeImageUrl = getProductImage(
    getProductName(activeItem),
    getProductMediaSlot(activeItem),
    cosmeticMedia
  );
  const activeHasImage = activeImageUrl && isValidHeroImageUrl(activeImageUrl);

  // Animation variants
  const tabContentVariants = {
    initial: { opacity: 0, x: 15 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, x: -15, transition: { duration: 0.3 } }
  };

  const toggleMobileExpand = (idx: number) => {
    setMobileExpandedIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <section className="bg-[#F4F7FB] py-28 md:py-36 px-6 border-t border-[#D9DEE8] relative overflow-hidden">
      {/* Decorative background grid line pattern */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none select-none" style={{ backgroundImage: 'radial-gradient(#050A5C 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* SECTION HEADER */}
        <div className="mb-20 text-center lg:text-left">
          <span className="inline-block text-[10px] tracking-[0.3em] uppercase font-semibold text-[#050A5C] mb-4">
            {sectionEyebrow}
          </span>
          <h2 className="text-3xl md:text-5xl font-light text-[#050A5C] tracking-tight mb-4">
            {sectionTitle}
          </h2>
          <p className="text-sm md:text-base text-[#6B7280] font-light max-w-2xl leading-relaxed">
            {sectionSubtitle}
          </p>
        </div>

        {/* DESKTOP LAYOUT */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-12 items-start">
          {/* LEFT: Product Tab Index */}
          <div className="lg:col-span-5 space-y-3.5 border-r border-[#D9DEE8]/60 pr-10">
            {rawItems.map((item: any, idx: number) => {
              const isActive = activeIndex === idx;
              const name = getProductName(item);
              const type = getProductType(item);
              const stepNum = item.step || String(idx + 1).padStart(2, '0');
              const concerns = getProductConcerns(item);
              const primaryConcern = concerns[0] || getProductUsage(item) || null;

              return (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-full text-left p-6 transition-all duration-300 relative border group flex items-start justify-between ${
                    isActive
                      ? 'bg-white border-[#050A5C]/20 shadow-md translate-x-2'
                      : 'bg-transparent border-transparent hover:bg-white/40 hover:translate-x-1'
                  }`}
                  style={{ borderRadius: '1px' }}
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <span className={`text-[10px] font-bold font-mono tracking-wider mt-0.5 ${
                      isActive ? 'text-[#050A5C]' : 'text-slate-400'
                    }`}>
                      {stepNum}
                    </span>
                    <div className="min-w-0">
                      <h4 className={`text-sm font-medium tracking-wide transition-colors truncate ${
                        isActive ? 'text-[#050A5C] font-semibold' : 'text-slate-700 group-hover:text-[#050A5C]'
                      }`}>
                        {name}
                      </h4>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
                        {type}
                      </p>
                    </div>
                  </div>

                  {primaryConcern && (
                    <span className={`text-[8px] tracking-[0.15em] uppercase px-2.5 py-1 font-semibold select-none border shrink-0 ${
                      isActive
                        ? 'border-[#050A5C]/35 text-[#050A5C] bg-[#050A5C]/5'
                        : 'border-[#D9DEE8] text-slate-500 bg-slate-50'
                    }`} style={{ borderRadius: '1px' }}>
                      {primaryConcern}
                    </span>
                  )}

                  {/* Active Indicator Line */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabLine"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-[#050A5C]"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* RIGHT: Detail Sheet */}
          <div className="lg:col-span-7 bg-white border border-[#D9DEE8] p-12 min-h-[580px] flex flex-col justify-between shadow-lg relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                variants={tabContentVariants as any}
                initial="initial"
                animate="animate"
                exit="exit"
                className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start h-full"
              >
                {/* Product Image Frame */}
                <div className="md:col-span-5 flex justify-center">
                  <div className="relative aspect-[3/4] w-full max-w-[220px] bg-[#F7F9FC] border border-[#D9DEE8] p-6 flex items-center justify-center overflow-hidden">
                    {activeHasImage ? (
                      <img
                        src={activeImageUrl}
                        alt={getProductName(activeItem)}
                        className="w-full h-full object-contain mix-blend-multiply bg-[#F7F9FC] transition-transform duration-700 hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#EEF2F8] to-[#DDE3EE] flex items-center justify-center">
                        <div className="absolute inset-4 border border-[#C5CEDF]/35" />
                        <FlaskConical className="h-8 w-8 text-[#050A5C]/20 stroke-[1.2]" />
                      </div>
                    )}
                    {activeItem.highlight && (
                      <div className="absolute top-0 right-0 bg-[#050A5C] text-white text-[8px] tracking-[0.2em] uppercase py-1 px-3.5 select-none font-bold">
                        CORE
                      </div>
                    )}
                  </div>
                </div>

                {/* Info Column */}
                <div className="md:col-span-7 space-y-6">
                  {/* Category Type & Size */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <span className="text-[10px] tracking-[0.25em] uppercase text-[#050A5C]/40 font-bold block">
                      {getProductType(activeItem)}
                    </span>
                    {(activeItem.volume || activeItem.price) && (
                      <span className="text-[10px] tracking-wider text-slate-400 font-medium font-mono uppercase bg-slate-50 border border-slate-100 px-2 py-0.5">
                        {activeItem.volume || ''}{activeItem.price && activeItem.volume ? ` · ` : ''}{activeItem.price || ''}
                      </span>
                    )}
                  </div>

                  {/* Name */}
                  <h3 className="text-2xl font-light text-[#050A5C] leading-snug tracking-wide font-serif">
                    {getProductName(activeItem)}
                  </h3>

                  {/* Detailed Description */}
                  <p className="text-xs text-[#6B7280] font-light leading-relaxed whitespace-pre-line">
                    {getProductDescription(activeItem)}
                  </p>

                  {/* Active Ingredients */}
                  {getProductIngredients(activeItem).length > 0 && (
                    <div className="space-y-1.5">
                      <span className="block text-[9px] tracking-[0.2em] uppercase text-[#050A5C]/35 font-bold">
                        Active Ingredients
                      </span>
                      <p className="text-xs text-[#3D4A5C] font-mono tracking-wide leading-relaxed">
                        {getProductIngredients(activeItem).join('  ·  ')}
                      </p>
                    </div>
                  )}

                  {/* Skin Concerns & Best For */}
                  {(getProductConcerns(activeItem).length > 0 || getProductBestFor(activeItem)) && (
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      {getProductConcerns(activeItem).length > 0 && (
                        <div className="space-y-1">
                          <span className="block text-[8px] tracking-[0.2em] uppercase text-[#050A5C]/35 font-bold">Target Concerns</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {getProductConcerns(activeItem).map((c, i) => (
                              <span key={i} className="text-[9px] text-[#050A5C]/80 font-light border border-[#050A5C]/15 px-2 py-0.5 bg-[#050A5C]/5" style={{ borderRadius: '1px' }}>{c}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {getProductBestFor(activeItem) && (
                        <div className="space-y-1">
                          <span className="block text-[8px] tracking-[0.2em] uppercase text-[#050A5C]/35 font-bold">Best For</span>
                          <span className="block text-[9px] text-slate-600 font-light mt-1 whitespace-pre-wrap">{getProductBestFor(activeItem)}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Benefit Chips */}
                  {getProductBenefits(activeItem).length > 0 && (
                    <div className="space-y-2 pt-2">
                      <div className="flex flex-wrap gap-1.5">
                        {getProductBenefits(activeItem).map((b, idx) => (
                          <span key={idx} className="text-[9px] tracking-[0.15em] uppercase border border-[#D9DEE8] px-2.5 py-1 text-[#050A5C]/75 font-medium bg-[#F4F7FB]" style={{ borderRadius: '1px' }}>
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Start Inquiry CTA */}
            <div className="border-t border-slate-100 pt-8 mt-8 flex justify-end">
              <CosmeticCtaTracker
                label={productCards.ctaLabel || 'Start Consultation'}
                href={productCards.ctaHref || '/contact?type=cosmetic_interest'}
                className="h-[46px] px-8 flex items-center justify-center bg-[#050A5C] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#101A8C] transition-colors rounded-[1px]"
              />
            </div>
          </div>
        </div>

        {/* MOBILE LAYOUT (ACCORDION STACK) */}
        <div className="lg:hidden space-y-4">
          {rawItems.map((item: any, idx: number) => {
            const isExpanded = mobileExpandedIndex === idx;
            const name = getProductName(item);
            const type = getProductType(item);
            const stepNum = item.step || String(idx + 1).padStart(2, '0');
            const imageUrl = getProductImage(name, getProductMediaSlot(item), cosmeticMedia);
            const hasImage = imageUrl && isValidHeroImageUrl(imageUrl);

            return (
              <div
                key={idx}
                className="bg-white border border-[#D9DEE8] overflow-hidden shadow-sm"
                style={{ borderRadius: '1px' }}
              >
                {/* Header accordion row */}
                <button
                  type="button"
                  onClick={() => toggleMobileExpand(idx)}
                  className={`w-full p-5 flex items-center justify-between text-left transition-colors ${
                    isExpanded ? 'bg-[#F7F9FC]' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="text-[10px] font-bold font-mono text-slate-400 shrink-0">
                      {stepNum}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-[#050A5C] tracking-wide truncate">
                        {name}
                      </h4>
                      <p className="text-[8px] text-slate-400 uppercase tracking-widest mt-0.5">
                        {type}
                      </p>
                    </div>
                  </div>

                  <span className={`text-slate-400 text-base font-light transition-transform duration-300 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}>
                    ↓
                  </span>
                </button>

                {/* Collapsible panel */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden border-t border-[#D9DEE8]/60"
                    >
                      <div className="p-6 space-y-6">
                        {/* Packshot */}
                        <div className="flex justify-center bg-[#F7F9FC] border border-[#D9DEE8] p-6 aspect-[4/3] max-w-[260px] mx-auto overflow-hidden relative">
                          {hasImage ? (
                            <img
                              src={imageUrl}
                              alt={name}
                              className="w-full h-full object-contain mix-blend-multiply bg-[#F7F9FC]"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#EEF2F8] to-[#DDE3EE] flex items-center justify-center">
                              <FlaskConical className="h-6 w-6 text-[#050A5C]/20 stroke-[1.2]" />
                            </div>
                          )}
                          {item.highlight && (
                            <div className="absolute top-0 right-0 bg-[#050A5C] text-white text-[8px] tracking-[0.2em] uppercase py-1 px-3 select-none font-bold">
                              CORE
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="space-y-4">
                          {/* Price & Vol */}
                          {(item.volume || item.price) && (
                            <span className="inline-block text-[9px] tracking-wider text-[#050A5C] font-semibold font-mono uppercase bg-[#050A5C]/5 border border-[#050A5C]/10 px-2 py-0.5">
                              {item.volume || ''}{item.price && item.volume ? ` · ` : ''}{item.price || ''}
                            </span>
                          )}

                          {/* Description */}
                          <p className="text-xs text-[#6B7280] font-light leading-relaxed whitespace-pre-wrap">
                            {getProductDescription(item)}
                          </p>

                          {/* Active Ingredients */}
                          {getProductIngredients(item).length > 0 && (
                            <div className="space-y-1">
                              <span className="block text-[8px] tracking-[0.2em] uppercase text-[#050A5C]/35 font-bold">Active Ingredients</span>
                              <p className="text-xs text-[#3D4A5C] font-mono leading-relaxed">{getProductIngredients(item).join('  ·  ')}</p>
                            </div>
                          )}

                          {/* Target Concerns */}
                          {getProductConcerns(item).length > 0 && (
                            <div className="space-y-1">
                              <span className="block text-[8px] tracking-[0.2em] uppercase text-[#050A5C]/35 font-bold">Target Concerns</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {getProductConcerns(item).map((c, i) => (
                                  <span key={i} className="text-[9px] text-[#050A5C] border border-[#050A5C]/15 px-2 py-0.5 bg-[#050A5C]/5" style={{ borderRadius: '1px' }}>{c}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Best For */}
                          {getProductBestFor(item) && (
                            <div className="space-y-1">
                              <span className="block text-[8px] tracking-[0.2em] uppercase text-[#050A5C]/35 font-bold">Best For</span>
                              <span className="block text-xs text-slate-600 font-light mt-1">{getProductBestFor(item)}</span>
                            </div>
                          )}

                          {/* Benefit tags */}
                          {getProductBenefits(item).length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {getProductBenefits(item).map((b, idx) => (
                                <span key={idx} className="text-[9px] tracking-[0.12em] uppercase border border-[#D9DEE8] px-2 py-0.5 text-[#050A5C]/80 font-medium bg-[#F4F7FB]" style={{ borderRadius: '1px' }}>
                                  {b}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* CTA */}
                          <div className="pt-4 border-t border-slate-100 flex justify-end">
                            <CosmeticCtaTracker
                              label={productCards.ctaLabel || 'Start Consultation'}
                              href={productCards.ctaHref || '/contact?type=cosmetic_interest'}
                              className="w-full h-11 flex items-center justify-center bg-[#050A5C] text-white text-[9px] tracking-[0.2em] uppercase hover:bg-[#101A8C] transition-colors rounded-[1px]"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
