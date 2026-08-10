'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CosmeticPageMedia } from '@/lib/load-public-cosmetic-media';
import { CosmeticCtaTracker } from '../cosmetic-tracker';
import { FlaskConical, Play, Video } from 'lucide-react';

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

function getProductVideoSlot(item: any): string {
  return item.videoSlot || '';
}

function isValidMediaUrl(value?: string | null): value is string {
  if (!value) return false;
  const v = value.trim().toLowerCase();
  if (v.startsWith('http://') || v.startsWith('https://') || v.startsWith('/') || v.startsWith('./') || v.startsWith('../')) {
    return !v.startsWith('javascript:') && !v.startsWith('data:');
  }
  return false;
}

// ─── Product Image Resolver ──────────────────────────────────────────────────

// Local SLOT_MAP for main app — no cross-app imports from admin
const IMAGE_SLOT_TO_KEY: Record<string, keyof CosmeticPageMedia> = {
  'cosmetic-product-luminous-set':     'luminousSet',
  'cosmetic-product-regenaglow-cream': 'regenaglow',
  'cosmetic-product-calmiance-gel':    'calmiance',
  'cosmetic-product-renew-ampoule':    'renewAmpoule',
  'cosmetic-product-p30-moisturizer':  'p30Moisturizer',
  'cosmetic-product-p30-toner':        'p30Toner',
  'cosmetic-product-lumiglow-sunscreen': 'lumiglowSunscreen',
};

const VIDEO_SLOT_TO_KEY: Record<string, keyof CosmeticPageMedia> = {
  'cosmetic-video-regenaglow-cream':  'videoRegenaglowCream',
  'cosmetic-video-calmiance-gel':     'videoCalmianceGel',
  'cosmetic-video-renew-ampoule':     'videoRenewAmpoule',
  'cosmetic-video-p30-moisturizer':   'videoP30Moisturizer',
  'cosmetic-video-p30-toner':         'videoP30Toner',
  'cosmetic-video-lumiglow-sunscreen': 'videoLumiglowSunscreen',
};

// Canonical video slot by product name
const NAME_TO_VIDEO_KEY: Array<{ match: (n: string) => boolean; key: keyof CosmeticPageMedia }> = [
  { match: n => n.includes('regenaglow') && (n.includes('cream') || n.includes('nourish')), key: 'videoRegenaglowCream' },
  { match: n => n.includes('calmiance'), key: 'videoCalmianceGel' },
  { match: n => n.includes('renew') || (n.includes('gentle') && n.includes('ampoule')), key: 'videoRenewAmpoule' },
  { match: n => n.includes('moisturizer') && n.includes('p30'), key: 'videoP30Moisturizer' },
  { match: n => n.includes('toner') && n.includes('p30'), key: 'videoP30Toner' },
  { match: n => n.includes('lumiglow') || n.includes('sunscreen'), key: 'videoLumiglowSunscreen' },
];

// CTA product ID by product name
const NAME_TO_PRODUCT_ID: Array<{ match: (n: string) => boolean; id: string }> = [
  { match: n => n.includes('regenaglow') && (n.includes('cream') || n.includes('nourish')), id: 'regenaglow-cream' },
  { match: n => n.includes('calmiance'), id: 'calmiance-gel' },
  { match: n => n.includes('renew') || (n.includes('gentle') && n.includes('ampoule')), id: 'renew-ampoule' },
  { match: n => n.includes('moisturizer'), id: 'p30-moisturizer' },
  { match: n => n.includes('toner'), id: 'p30-toner' },
  { match: n => n.includes('lumiglow') || n.includes('sunscreen'), id: 'lumiglow-sunscreen' },
];

function getProductLandingHref(productName: string): string {
  const name = productName.toLowerCase();
  if (name.includes('regenaglow') && (name.includes('cream') || name.includes('nourish'))) return '/cosmetic/products/regenaglow-nourish-sheer-cream';
  if (name.includes('calmiance')) return '/cosmetic/products/calmiance-superior-sheer-gel';
  if (name.includes('renew') || (name.includes('gentle') && name.includes('ampoule'))) return '/cosmetic/products/gentle-activation-renew-ampoule';
  if (name.includes('moisturizer') && name.includes('p30')) return '/cosmetic/products/p30-boost-facial-moisturizer';
  if (name.includes('toner') && name.includes('p30')) return '/cosmetic/products/p30-boost-facial-hydrating-toner';
  if (name.includes('lumiglow') || name.includes('sunscreen')) return '/cosmetic/products/lumiglow-rosy-sheer-sunscreen';
  if (name.includes('cellurevive')) return '/cosmetic/products/cellurevive-ampoule';
  if (name.includes('luminous') || name.includes('set')) return '/cosmetic/products/luminous-revitalization-sheer-set';
  return '/cosmetic';
}

function getProductImage(
  productName: string,
  mediaSlot: string | undefined,
  cosmeticMedia: CosmeticPageMedia
): string | undefined {
  if (mediaSlot) {
    const key = IMAGE_SLOT_TO_KEY[mediaSlot] || (mediaSlot as keyof CosmeticPageMedia);
    const url = cosmeticMedia[key];
    if (url && isValidMediaUrl(url)) return url;
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
    if (url && isValidMediaUrl(url)) return url;
  }

  return undefined;
}

function getProductVideo(
  productName: string,
  videoSlot: string | undefined,
  cosmeticMedia: CosmeticPageMedia
): string | undefined {
  // 1. Explicit videoSlot from CMS
  if (videoSlot) {
    const key = VIDEO_SLOT_TO_KEY[videoSlot];
    if (key) {
      const url = cosmeticMedia[key];
      if (url && isValidMediaUrl(url)) return url;
    }
  }

  // 2. Canonical fallback by product name
  const name = productName.toLowerCase();
  for (const entry of NAME_TO_VIDEO_KEY) {
    if (entry.match(name)) {
      const url = cosmeticMedia[entry.key];
      if (url && isValidMediaUrl(url)) return url;
      break;
    }
  }

  return undefined;
}

function getProductCtaHref(productName: string, baseHref: string): string {
  const name = productName.toLowerCase();
  for (const entry of NAME_TO_PRODUCT_ID) {
    if (entry.match(name)) {
      const separator = baseHref.includes('?') ? '&' : '?';
      return `${baseHref}${separator}product=${entry.id}`;
    }
  }
  return baseHref;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ClinicalFormulaLab({ productCards, cosmeticMedia }: ClinicalFormulaLabProps) {
  const rawItems = productCards.items || [];
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [mobileExpandedIndex, setMobileExpandedIndex] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Reset video when active index changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (!prefersReducedMotion.current) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [activeIndex]);

  if (rawItems.length === 0) return null;

  const sectionEyebrow = productCards.eyebrow || 'THE FORMULA LAB';
  const sectionTitle = productCards.title || 'Clinical Formula Lab';
  const sectionSubtitle = productCards.subtitle || 'Targeted Korean formulas for recovery, hydration, calming, renewal, and daily protection.';
  const ctaBaseHref = productCards.ctaHref || '/contact?type=cosmetic_interest';

  // Resolve active product media
  const activeItem = rawItems[activeIndex] || rawItems[0];
  const activeVideoUrl = getProductVideo(
    getProductName(activeItem),
    getProductVideoSlot(activeItem),
    cosmeticMedia
  );
  const activeImageUrl = getProductImage(
    getProductName(activeItem),
    getProductMediaSlot(activeItem),
    cosmeticMedia
  );
  const hasVideo = !!activeVideoUrl;
  const hasImage = !!activeImageUrl;

  // Animation variants
  const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3, ease: 'easeOut' as const } },
    exit: { opacity: 0, transition: { duration: 0.25 } }
  };

  const slideVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.25 } }
  };

  const toggleMobileExpand = (idx: number) => {
    setMobileExpandedIndex(prev => (prev === idx ? null : idx));
  };

  // ─── Desktop Video Stage ─────────────────────────────────────────────────
  function renderVideoStage() {
    const productName = getProductName(activeItem);
    const productType = getProductType(activeItem);
    const benefits = getProductBenefits(activeItem).slice(0, 3);
    const ctaHref = getProductCtaHref(productName, ctaBaseHref);

    return (
      <div className="relative bg-[#F7F9FC] border border-[#D9DEE8] overflow-hidden" style={{ borderRadius: '2px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative aspect-[9/16] max-h-[680px] w-full"
          >
            {hasVideo ? (
              <video
                ref={videoRef}
                key={activeVideoUrl}
                src={activeVideoUrl}
                muted
                playsInline
                loop
                autoPlay={!prefersReducedMotion.current}
                preload="metadata"
                poster={activeImageUrl || undefined}
                aria-label={`Product video: ${productName}`}
                className="w-full h-full object-cover"
              />
            ) : hasImage ? (
              <img
                src={activeImageUrl}
                alt={productName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#EEF2F8] to-[#DDE3EE] flex flex-col items-center justify-center gap-4 p-8">
                <div className="w-20 h-20 rounded-full bg-white/60 flex items-center justify-center">
                  <Video className="h-8 w-8 text-[#050A5C]/20 stroke-[1.2]" />
                </div>
                <p className="text-sm text-[#050A5C]/40 font-medium text-center">Chưa có video sản phẩm</p>
                <p className="text-[10px] text-slate-400 text-center">Upload video trong Admin → Cosmetic Page → Hình ảnh & Video</p>
              </div>
            )}

            {/* Gradient Overlay at Bottom */}
            {(hasVideo || hasImage) && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#050A5C]/90 via-[#050A5C]/50 to-transparent pt-32 pb-8 px-8">
                {/* Product Type */}
                <span className="text-[9px] tracking-[0.3em] uppercase text-white/60 font-semibold block mb-2">
                  {productType}
                </span>

                {/* Product Name */}
                <h3 className="text-xl md:text-2xl font-light text-white tracking-wide mb-4 leading-snug">
                  {productName}
                </h3>

                {/* Benefit Chips */}
                {benefits.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {benefits.map((b, idx) => (
                      <span key={idx} className="text-[8px] tracking-[0.15em] uppercase border border-white/25 px-2.5 py-1 text-white/80 font-medium bg-white/10 backdrop-blur-sm" style={{ borderRadius: '1px' }}>
                        {b}
                      </span>
                    ))}
                  </div>
                )}

                {/* Volume/Price */}
                {(activeItem.volume || activeItem.price) && (
                  <span className="text-[10px] tracking-wider text-white/50 font-mono uppercase block mb-5">
                    {activeItem.volume || ''}{activeItem.price && activeItem.volume ? ' · ' : ''}{activeItem.price || ''}
                  </span>
                )}

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <CosmeticCtaTracker
                    label="Xem chi tiết"
                    href={getProductLandingHref(productName)}
                    className="inline-flex items-center justify-center h-[42px] px-7 bg-white text-[#050A5C] text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-white/90 transition-colors rounded-[1px]"
                  />
                  <CosmeticCtaTracker
                    label={productCards.ctaLabel || 'Start Consultation'}
                    href={ctaHref}
                    className="inline-flex items-center justify-center h-[42px] px-7 border border-white/40 text-white text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-white/10 transition-colors rounded-[1px]"
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Video indicator badge */}
        {hasVideo && (
          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm text-white text-[9px] tracking-wider uppercase px-2.5 py-1 flex items-center gap-1.5 font-semibold" style={{ borderRadius: '1px' }}>
            <Play className="h-3 w-3 fill-current" />
            Video
          </div>
        )}
      </div>
    );
  }

  // ─── Desktop Key Actives Row ─────────────────────────────────────────────
  function renderKeyActives() {
    const ingredients = getProductIngredients(activeItem).slice(0, 3);
    if (ingredients.length === 0) return null;

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={`actives-${activeIndex}`}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="mt-4 flex items-center gap-3 flex-wrap"
        >
          <span className="text-[8px] tracking-[0.2em] uppercase text-[#050A5C]/35 font-bold shrink-0">
            Key Actives
          </span>
          {ingredients.map((ing, idx) => (
            <span key={idx} className="text-[9px] text-[#3D4A5C] font-mono tracking-wide bg-white border border-[#D9DEE8] px-2.5 py-1" style={{ borderRadius: '1px' }}>
              {ing}
            </span>
          ))}
        </motion.div>
      </AnimatePresence>
    );
  }

  // ─── Mobile Video Stage ──────────────────────────────────────────────────
  function renderMobileVideoStage(item: any, idx: number) {
    const name = getProductName(item);
    const type = getProductType(item);
    const videoUrl = getProductVideo(name, getProductVideoSlot(item), cosmeticMedia);
    const imageUrl = getProductImage(name, getProductMediaSlot(item), cosmeticMedia);
    const benefits = getProductBenefits(item).slice(0, 3);
    const ctaHref = getProductCtaHref(name, ctaBaseHref);
    const mHasVideo = !!videoUrl;
    const mHasImage = !!imageUrl;

    return (
      <div className="relative bg-[#F7F9FC] border border-[#D9DEE8] overflow-hidden" style={{ borderRadius: '2px' }}>
        <div className="relative aspect-[9/16] max-h-[480px] w-full">
          {mHasVideo ? (
            <video
              key={videoUrl}
              src={videoUrl}
              muted
              playsInline
              loop
              autoPlay={!prefersReducedMotion.current}
              preload="metadata"
              poster={imageUrl || undefined}
              aria-label={`Product video: ${name}`}
              className="w-full h-full object-cover"
            />
          ) : mHasImage ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#EEF2F8] to-[#DDE3EE] flex flex-col items-center justify-center gap-3 p-6">
              <Video className="h-6 w-6 text-[#050A5C]/20 stroke-[1.2]" />
              <p className="text-xs text-[#050A5C]/40 font-medium text-center">Chưa có video sản phẩm</p>
            </div>
          )}

          {/* Gradient Overlay */}
          {(mHasVideo || mHasImage) && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#050A5C]/90 via-[#050A5C]/50 to-transparent pt-24 pb-6 px-6">
              <span className="text-[8px] tracking-[0.3em] uppercase text-white/60 font-semibold block mb-1.5">
                {type}
              </span>
              <h4 className="text-lg font-light text-white tracking-wide mb-3 leading-snug">
                {name}
              </h4>
              {benefits.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {benefits.map((b, i) => (
                    <span key={i} className="text-[7px] tracking-[0.12em] uppercase border border-white/25 px-2 py-0.5 text-white/80 font-medium bg-white/10" style={{ borderRadius: '1px' }}>
                      {b}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex flex-col gap-2">
                <CosmeticCtaTracker
                  label="Xem chi tiết"
                  href={getProductLandingHref(name)}
                  className="w-full h-10 flex items-center justify-center bg-white text-[#050A5C] text-[9px] tracking-[0.2em] uppercase font-semibold hover:bg-white/90 transition-colors rounded-[1px]"
                />
                <CosmeticCtaTracker
                  label={productCards.ctaLabel || 'Start Consultation'}
                  href={ctaHref}
                  className="w-full h-10 flex items-center justify-center border border-white/40 text-white text-[9px] tracking-[0.2em] uppercase font-semibold hover:bg-white/10 transition-colors rounded-[1px]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Video badge */}
        {mHasVideo && (
          <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-[8px] tracking-wider uppercase px-2 py-0.5 flex items-center gap-1 font-semibold" style={{ borderRadius: '1px' }}>
            <Play className="h-2.5 w-2.5 fill-current" />
            Video
          </div>
        )}
      </div>
    );
  }

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
        <div className="hidden lg:grid lg:grid-cols-12 gap-10 items-start">
          {/* LEFT: Product Tab Index */}
          <div className="lg:col-span-4 space-y-3 border-r border-[#D9DEE8]/60 pr-8">
            {rawItems.map((item: any, idx: number) => {
              const isActive = activeIndex === idx;
              const name = getProductName(item);
              const type = getProductType(item);
              const stepNum = item.step || String(idx + 1).padStart(2, '0');
              const concerns = getProductConcerns(item);
              const primaryConcern = concerns[0] || getProductUsage(item) || null;
              const itemVideoUrl = getProductVideo(name, getProductVideoSlot(item), cosmeticMedia);
              const itemHasVideo = !!itemVideoUrl;

              return (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  aria-selected={isActive}
                  role="tab"
                  className={`w-full text-left p-5 transition-all duration-300 relative border group flex items-start justify-between ${
                    isActive
                      ? 'bg-white border-[#050A5C]/20 shadow-md translate-x-1'
                      : 'bg-transparent border-transparent hover:bg-white/40 hover:translate-x-0.5'
                  }`}
                  style={{ borderRadius: '1px' }}
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <span className={`text-[10px] font-bold font-mono tracking-wider mt-0.5 ${
                      isActive ? 'text-[#050A5C]' : 'text-slate-400'
                    }`}>
                      {stepNum}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-medium tracking-wide transition-colors truncate ${
                          isActive ? 'text-[#050A5C] font-semibold' : 'text-slate-700 group-hover:text-[#050A5C]'
                        }`}>
                          {name}
                        </h4>
                        {itemHasVideo && (
                          <span className="shrink-0 w-4 h-4 rounded-full bg-[#050A5C]/10 flex items-center justify-center" title="Video available">
                            <Play className="h-2 w-2 text-[#050A5C]/60 fill-current" />
                          </span>
                        )}
                      </div>
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

          {/* RIGHT: Video Stage */}
          <div className="lg:col-span-8">
            {renderVideoStage()}
            {renderKeyActives()}
          </div>
        </div>

        {/* MOBILE LAYOUT (ACCORDION STACK) */}
        <div className="lg:hidden space-y-4">
          {rawItems.map((item: any, idx: number) => {
            const isExpanded = mobileExpandedIndex === idx;
            const name = getProductName(item);
            const type = getProductType(item);
            const stepNum = item.step || String(idx + 1).padStart(2, '0');
            const itemVideoUrl = getProductVideo(name, getProductVideoSlot(item), cosmeticMedia);
            const itemHasVideo = !!itemVideoUrl;

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
                  aria-expanded={isExpanded}
                  className={`w-full p-5 flex items-center justify-between text-left transition-colors ${
                    isExpanded ? 'bg-[#F7F9FC]' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="text-[10px] font-bold font-mono text-slate-400 shrink-0">
                      {stepNum}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-semibold text-[#050A5C] tracking-wide truncate">
                          {name}
                        </h4>
                        {itemHasVideo && (
                          <span className="shrink-0 w-3.5 h-3.5 rounded-full bg-[#050A5C]/10 flex items-center justify-center">
                            <Play className="h-1.5 w-1.5 text-[#050A5C]/60 fill-current" />
                          </span>
                        )}
                      </div>
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

                {/* Collapsible panel — only mount video when expanded */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden border-t border-[#D9DEE8]/60"
                    >
                      <div className="p-5 space-y-4">
                        {renderMobileVideoStage(item, idx)}

                        {/* Key Actives below video on mobile */}
                        {getProductIngredients(item).slice(0, 3).length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[7px] tracking-[0.2em] uppercase text-[#050A5C]/35 font-bold shrink-0">
                              Key Actives
                            </span>
                            {getProductIngredients(item).slice(0, 3).map((ing, i) => (
                              <span key={i} className="text-[8px] text-[#3D4A5C] font-mono tracking-wide bg-white border border-[#D9DEE8] px-2 py-0.5" style={{ borderRadius: '1px' }}>
                                {ing}
                              </span>
                            ))}
                          </div>
                        )}
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
