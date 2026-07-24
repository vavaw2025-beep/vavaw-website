'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { PublicHeroSlide } from '@/lib/load-public-cms';

function isValidHeroImageUrl(value?: string | null): value is string {
  if (!value) return false;
  if (value.trim() === '') return false;
  if (value.includes('PASTE_')) return false;
  if (value === '-') return false;
  // Reject local file paths — only absolute http/https URLs are valid CMS images
  if (value.startsWith('/') && !value.startsWith('//')) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export interface BrandHeroProps {
  slides: PublicHeroSlide[];
  dataSource?: 'static' | 'supabase';
  fallbackUsed?: boolean;
  fallbackReason?: string;
  rawHeroRowsCount?: number;
}

export function BrandHero({ slides, dataSource, fallbackUsed, fallbackReason, rawHeroRowsCount }: BrandHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    if (!autoplay || isHovering || slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [autoplay, isHovering, slides.length]);

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 8000);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 8000);
  };

  if (slides.length === 0) {
    return (
      <div className="h-screen w-full bg-[#0a0a0a] flex items-center justify-center text-[#e5e5e5] tracking-widest text-sm uppercase">
        No ecosystem slides found
      </div>
    );
  }

  const currentSlide = slides[activeIndex];
  // Show max 2 preview cards — keep cards secondary, not dominant
  const previewCount = Math.min(2, slides.length - 1);
  const previewSlides = Array.from({ length: previewCount }, (_, index) => {
    const offset = index + 1;
    const realIndex = (activeIndex + offset) % slides.length;
    return { ...slides[realIndex], realIndex };
  });

  const handleImageError = (path: string) => {
    setImageError((prev) => ({ ...prev, [path]: true }));
  };

  const getBrandGradient = (slide: PublicHeroSlide, isBackground: boolean = false) => {
    const isCosmetic = slide.title.toLowerCase().includes('cosmetic') || slide.redirectPath?.includes('cosmetic');
    const isBeauty = slide.title.toLowerCase().includes('beauty') || slide.redirectPath?.includes('beauty');
    
    if (isCosmetic) {
      return isBackground 
        ? "from-[#050A5C] via-[#101A8C] to-[#D9DEE8]" 
        : "from-[#050A5C] to-[#101A8C]";
    }
    if (isBeauty) {
      return isBackground 
        ? "from-[#3d2b1f] via-[#b78c85] to-[#fffaf5]" 
        : "from-[#3d2b1f] to-[#b78c85]";
    }
    return isBackground 
      ? "from-black via-[#332f2b] to-[#c69c6d]" 
      : "from-black to-[#c69c6d]";
  };

  const showDebug = process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_SHOW_CMS_DEBUG === 'true';
  const resolvedImagesCount = slides.filter(s => isValidHeroImageUrl(s.backgroundImageUrl) || isValidHeroImageUrl(s.previewImageUrl)).length;
  const hasPlaceholder = slides.some(s => (s.backgroundImageUrl?.includes('PASTE_')) || (s.previewImageUrl?.includes('PASTE_')));

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#050505]">
      {showDebug && (
        <div className="absolute top-20 md:top-3 right-3 z-50 bg-black/80 backdrop-blur-md p-4 rounded-md text-[10px] font-mono border border-gray-700 text-gray-300 shadow-2xl max-w-[280px] md:max-w-xs w-full opacity-50 hover:opacity-100 transition-opacity">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-white uppercase tracking-wider">CMS Debug</span>
            <span className={`px-2 py-0.5 rounded-full font-bold ${
              dataSource === 'static'
                ? 'bg-yellow-900 text-yellow-300'
                : fallbackUsed
                  ? 'bg-orange-900 text-orange-300'
                  : 'bg-emerald-900 text-emerald-300'
            }`}>
              {dataSource ?? 'unknown'}{fallbackUsed ? ' ⚠' : ''}
            </span>
          </div>

          {dataSource === 'static' ? (
            <div className="text-yellow-400 text-[9px] leading-relaxed border border-yellow-800 bg-yellow-900/30 rounded p-2">
              ⚠ Static mode active — Admin-uploaded images will NOT render.<br />
              Set <code className="text-yellow-300">CMS_DATA_SOURCE=supabase</code> to enable CMS media.
            </div>
          ) : (
            <>
              {/* Fallback warning */}
              {fallbackUsed && (
                <div className="text-orange-400 text-[9px] leading-relaxed border border-orange-800 bg-orange-900/30 rounded p-2 mb-2">
                  ⚠ Fallback used — this is NOT real hero_slides data.<br />
                  <span className="text-orange-300">{fallbackReason}</span>
                </div>
              )}
              <div className="mb-2 space-y-1">
                <div className="flex justify-between">
                  <span>Raw hero rows (DB):</span>
                  <span className={`font-medium ${(rawHeroRowsCount ?? 0) > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {rawHeroRowsCount ?? 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Rendered slides:</span>
                  <span className="text-white font-medium">{slides.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Images resolved:</span>
                  <span className={`font-medium ${
                    resolvedImagesCount === slides.length && slides.length > 0 ? 'text-emerald-400' : 'text-orange-400'
                  }`}>{resolvedImagesCount}/{slides.length}</span>
                </div>
                {hasPlaceholder && (
                  <div className="text-yellow-400 text-[9px] border border-yellow-800 bg-yellow-900/30 rounded p-1">
                    ⚠ Placeholder URL detected in data
                  </div>
                )}
              </div>
              <div className="border-t border-gray-700 pt-2 mt-2 space-y-2">
                {slides.map((s, i) => (
                  <div key={i} className="flex flex-col gap-0.5 pb-2 border-b border-gray-800 last:border-0 last:pb-0">
                    <div className="flex items-center gap-1">
                      <span className="text-white font-medium truncate">{s.title}</span>
                      {s.id.startsWith('derived-') && (
                        <span className="text-orange-400 text-[8px] shrink-0">[derived]</span>
                      )}
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>bg: <span className={isValidHeroImageUrl(s.backgroundImageUrl) ? "text-emerald-400" : "text-red-400"}>{isValidHeroImageUrl(s.backgroundImageUrl) ? 'yes' : 'no'}</span></span>
                      <span>prev: <span className={isValidHeroImageUrl(s.previewImageUrl) ? "text-emerald-400" : "text-red-400"}>{isValidHeroImageUrl(s.previewImageUrl) ? 'yes' : 'no'}</span></span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${activeIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
          className="absolute inset-0"
          data-has-bg-url={isValidHeroImageUrl(currentSlide.backgroundImageUrl)}
        >
          {!isValidHeroImageUrl(currentSlide.backgroundImageUrl) || imageError[currentSlide.backgroundImageUrl] ? (
            <div className={`absolute inset-0 z-0 bg-gradient-to-br ${getBrandGradient(currentSlide, true)} opacity-20`} />
          ) : (
            <img
              src={currentSlide.backgroundImageUrl}
              alt={currentSlide.backgroundAlt || ""}
              className="absolute inset-0 z-10 h-full w-full object-cover scale-[1.04] brightness-[0.60] grayscale-[25%]"
              style={{ filter: 'blur(1.5px) brightness(0.60) grayscale(25%)' }}
              onError={() => handleImageError(currentSlide.backgroundImageUrl as string)}
            />
          )}
          {/* Strong left text safe zone — left 45% calm, right fades to transparent */}
          <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/85 via-black/55 to-black/10" />
          {/* Vertical vignette — top subtle, bottom anchoring */}
          <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/25 via-transparent to-black/45" />
          {/* Mobile additional base */}
          <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#050505]/80 via-[#050505]/30 to-transparent lg:hidden" />
        </motion.div>
      </AnimatePresence>

      {/* Content Container */}
      <div className="relative h-full min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-24 pb-32 lg:py-0">
        <div className="w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 items-start lg:items-center h-full">
          
          {/* Left Content */}
          <motion.div
            className="w-full lg:w-[55%] flex flex-col justify-center space-y-6 lg:space-y-8 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Slide counter */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`counter-${activeIndex}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="flex items-center gap-4 text-[10px] md:text-xs font-medium tracking-[0.3em] text-[#a3a3a3] uppercase"
              >
                <span>{String(activeIndex + 1).padStart(2, '0')} — {String(slides.length).padStart(2, '0')}</span>
              </motion.div>
            </AnimatePresence>

            {/* Title */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${activeIndex}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.65, ease: [0.25, 1, 0.5, 1] }}
                className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-[#F8F7F2] leading-[1.1] tracking-tight drop-shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
              >
                {currentSlide.title}
              </motion.h1>
            </AnimatePresence>

            {/* Subtitle */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`subtitle-${activeIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.65, delay: 0.08, ease: [0.25, 1, 0.5, 1] }}
                className="text-lg md:text-2xl text-white/80 font-light leading-relaxed max-w-xl drop-shadow-lg"
              >
                {currentSlide.subtitle}
              </motion.p>
            </AnimatePresence>

            {/* Description */}
            {currentSlide.description && (
              <AnimatePresence mode="wait">
                <motion.p
                  key={`desc-${activeIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.65, delay: 0.14, ease: [0.25, 1, 0.5, 1] }}
                  className="text-sm md:text-base text-white/60 font-light leading-relaxed max-w-[520px] drop-shadow-md hidden sm:block"
                >
                  {currentSlide.description}
                </motion.p>
              </AnimatePresence>
            )}

            {/* CTA Button */}
            <motion.button
              onClick={() => {
                if (currentSlide.redirectPath) {
                  router.push(currentSlide.redirectPath);
                }
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
              aria-label={currentSlide.ctaLabel}
              className="mt-6 md:mt-10 h-[52px] md:h-[54px] w-fit px-9 md:px-12 bg-[#F8F7F2] text-black font-medium text-[11px] md:text-[12px] tracking-[0.2em] uppercase hover:bg-white transition-all duration-300 shadow-[0_2px_16px_rgba(248,247,242,0.12)] flex items-center justify-center"
            >
              {currentSlide.ctaLabel}
            </motion.button>

            {/* Navigation Controls — Desktop Only */}
            <motion.div
              className="hidden lg:flex items-center gap-8 pt-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <motion.button
                whileHover={{ x: -4, color: '#ffffff' }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrevious}
                className="flex items-center gap-3 text-[#a1a1aa] transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-xs uppercase tracking-[0.15em] font-medium">Prev</span>
              </motion.button>

              <div className="flex-1 max-w-[240px] h-[1px] bg-[#3f3f46] relative overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${((activeIndex + 1) / slides.length) * 100}%` }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                />
              </div>

              <motion.button
                whileHover={{ x: 4, color: '#ffffff' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="flex items-center gap-3 text-[#a1a1aa] transition-colors"
                aria-label="Next slide"
              >
                <span className="text-xs uppercase tracking-[0.15em] font-medium">Next</span>
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Preview Cards — desktop only, max 2, secondary */}
          <motion.div
            className="hidden sm:flex lg:w-[45%] items-end justify-start lg:justify-end pb-4 lg:pb-0 z-10"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="relative flex gap-5 lg:gap-6 items-end justify-start pt-8 lg:pt-0">
              <AnimatePresence>
                {previewSlides.map((slide, index) => {
                  // 2 cards only: primary (larger) and secondary (smaller)
                  const desktopSizes = [
                    { width: 210, height: 320, opacity: 1 },
                    { width: 170, height: 272, opacity: 0.65 },
                  ];
                  const tabletSizes = [
                    { width: 160, height: 240, opacity: 1 },
                    { width: 130, height: 196, opacity: 0.65 },
                  ];
                  const isTablet = typeof window !== 'undefined' && window.innerWidth < 1280;
                  const sizes = isTablet ? tabletSizes : desktopSizes;
                  const size = sizes[index] ?? sizes[1];

                  return (
                    <motion.div
                      key={`preview-${index}-${slide.realIndex}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: size.opacity, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{
                        duration: 0.6,
                        ease: [0.25, 1, 0.5, 1],
                        delay: index * 0.08,
                      }}
                      onClick={() => {
                        setActiveIndex(slide.realIndex);
                        setAutoplay(false);
                        setTimeout(() => setAutoplay(true), 8000);
                      }}
                      className="relative flex-shrink-0 cursor-pointer origin-bottom group"
                      style={{ width: `${size.width}px`, height: `${size.height}px` }}
                      aria-label={`Preview ${slide.title}`}
                    >
                      <div
                        className="relative w-full h-full bg-[#18181b] overflow-hidden border border-white/20 shadow-2xl shadow-black/40 transition-all duration-500 hover:border-white/35 group-hover:-translate-y-2"
                        data-has-preview-url={isValidHeroImageUrl(slide.previewImageUrl)}
                      >
                        {!isValidHeroImageUrl(slide.previewImageUrl) || imageError[slide.previewImageUrl] ? (
                          <div className={`absolute inset-0 z-0 bg-gradient-to-br ${getBrandGradient(slide)} opacity-70`} />
                        ) : (
                          <img
                            src={slide.previewImageUrl}
                            alt={slide.previewAlt || slide.title}
                            className="absolute inset-0 z-10 h-full w-full object-cover opacity-75 group-hover:opacity-95 transition-opacity duration-500"
                            onError={() => handleImageError(slide.previewImageUrl as string)}
                          />
                        )}
                        {/* Card overlay — light at top, anchored at bottom */}
                        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 z-30">
                          <h3 className="text-[10px] font-medium text-white/85 tracking-[0.15em] uppercase">
                            {slide.title}
                          </h3>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Pagination Dots — Mobile Only */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex lg:hidden gap-3 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setActiveIndex(index);
              setAutoplay(false);
              setTimeout(() => setAutoplay(true), 8000);
            }}
            className={`transition-all duration-300 rounded-full ${
              index === activeIndex ? 'bg-white w-8 h-1.5' : 'bg-[#52525b] w-2 h-1.5'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </motion.div>
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
