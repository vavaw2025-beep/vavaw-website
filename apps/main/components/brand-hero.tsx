'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { NormalizedHeroSlide } from '@/lib/load-public-cms';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BrandHeroProps {
  slides: NormalizedHeroSlide[];
  /** Data source badge — shown in development only */
  dataSource?: 'static' | 'supabase';
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BrandHero({ slides, dataSource }: BrandHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const isDev = process.env.NODE_ENV === 'development';

  // Autoplay carousel
  useEffect(() => {
    if (!autoplay || isHovering || slides.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

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
      <div className="h-screen w-full bg-black flex items-center justify-center text-white">
        No slides found.
      </div>
    );
  }

  const currentSlide = slides[activeIndex];

  // Calculate preview slides (up to 3, excluding the active one)
  const previewCount = Math.min(3, slides.length - 1);
  const previewSlides = Array.from({ length: previewCount }, (_, index) => {
    const offset = index + 1;
    const realIndex = (activeIndex + offset) % slides.length;
    return { ...slides[realIndex], realIndex };
  });

  const handleImageError = (path: string) => {
    setImageError((prev) => ({ ...prev, [path]: true }));
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0a0a]">
      {/* Dev-only CMS data source badge */}
      {isDev && dataSource && (
        <div className="absolute top-3 right-3 z-50">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm border ${
              dataSource === 'supabase'
                ? 'bg-emerald-900/70 border-emerald-700 text-emerald-300'
                : 'bg-blue-900/70 border-blue-700 text-blue-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            Data: {dataSource === 'supabase' ? 'Supabase' : 'Static'}
          </span>
        </div>
      )}

      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${activeIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {!currentSlide.backgroundImage || imageError[currentSlide.backgroundImage] ? (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950" />
          ) : (
            <Image
              src={currentSlide.backgroundImage}
              alt={currentSlide.title}
              fill
              priority
              className="object-cover"
              onError={() => handleImageError(currentSlide.backgroundImage)}
            />
          )}
          {/* Cinematic Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/30 lg:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent lg:hidden" />
        </motion.div>
      </AnimatePresence>

      {/* Content Container */}
      <div className="relative h-full flex flex-col justify-center px-6 md:px-12 lg:px-24 pb-24 lg:pb-0">
        <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-16 items-stretch lg:items-center h-full pt-24 lg:pt-0">
          
          {/* Left Content */}
          <motion.div
            className="w-full lg:w-[50%] flex flex-col justify-center space-y-6 lg:space-y-8 z-10 flex-1 lg:flex-none"
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
                className="flex items-center gap-4 text-xs font-medium tracking-[0.2em] text-[#e5e5e5] uppercase"
              >
                <span>{String(activeIndex + 1).padStart(2, '0')}/{String(slides.length).padStart(2, '0')}</span>
              </motion.div>
            </AnimatePresence>

            {/* Title — exactly one H1 per page for SEO */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${activeIndex}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="text-5xl md:text-7xl lg:text-8xl font-light text-white leading-[1.1] tracking-tight"
                style={{ textShadow: '0 4px 24px rgba(0,0,0,0.3)' }}
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
                transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                className="text-xl md:text-2xl text-white/90 font-light leading-relaxed max-w-2xl"
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
                  transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
                  className="text-base md:text-lg text-[#a3a3a3] font-light leading-relaxed max-w-xl hidden md:block"
                >
                  {currentSlide.description}
                </motion.p>
              </AnimatePresence>
            )}

            {/* CTA Button — routes via redirectPath, never hardcoded external link */}
            <motion.button
              onClick={() => router.push(currentSlide.redirectPath)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              aria-label={`Go to ${currentSlide.title}`}
              className="mt-4 w-fit px-10 py-4 bg-white/90 backdrop-blur-sm text-black font-medium text-sm tracking-[0.1em] uppercase rounded-none hover:bg-white transition-colors"
            >
              {currentSlide.ctaLabel}
            </motion.button>

            {/* Navigation Controls — Desktop Only */}
            <motion.div
              className="hidden lg:flex items-center gap-8 pt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <motion.button
                whileHover={{ x: -4, color: '#ffffff' }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrevious}
                className="flex items-center gap-3 text-white/60 transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-xs uppercase tracking-[0.15em] font-medium">Prev</span>
              </motion.button>

              {/* Progress Indicator */}
              <div className="flex-1 max-w-[200px] h-[1px] bg-white/20 relative">
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
                className="flex items-center gap-3 text-white/60 transition-colors"
                aria-label="Next slide"
              >
                <span className="text-xs uppercase tracking-[0.15em] font-medium">Next</span>
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Preview Cards */}
          <motion.div
            className="w-full lg:w-[50%] lg:h-full flex items-end lg:items-center justify-start lg:justify-end overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 z-10"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            <div className="relative flex gap-4 lg:gap-8 items-center justify-start min-w-max px-2 lg:px-0">
              <AnimatePresence mode="wait">
                {previewSlides.map((slide, index) => {
                  const sizes = [
                    { width: 180, height: 280, scale: 1, opacity: 1 },
                    { width: 150, height: 240, scale: 0.95, opacity: 0.7 },
                    { width: 120, height: 200, scale: 0.9, opacity: 0.4 },
                  ];
                  const size = sizes[index] ?? sizes[2];

                  return (
                    <motion.div
                      key={`preview-${index}-${slide.realIndex}`}
                      initial={{ opacity: 0, x: 40, scale: 0.8 }}
                      animate={{
                        opacity: size.opacity,
                        scale: size.scale,
                        x: 0,
                      }}
                      exit={{ opacity: 0, x: 40, scale: 0.8 }}
                      transition={{
                        type: 'spring',
                        stiffness: 250,
                        damping: 25,
                        delay: index * 0.1,
                      }}
                      onClick={() => {
                        setActiveIndex(slide.realIndex);
                        setAutoplay(false);
                        setTimeout(() => setAutoplay(true), 8000);
                      }}
                      className="relative flex-shrink-0 cursor-pointer lg:origin-right origin-bottom snap-start group"
                      style={{
                        width: `${size.width}px`,
                        height: `${size.height}px`,
                      }}
                      aria-label={`Preview ${slide.title}`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        className="relative w-full h-full bg-white/5 backdrop-blur-xl rounded-xl overflow-hidden border border-white/10 shadow-2xl"
                      >
                        {/* Card Image */}
                        {!slide.previewImage || imageError[slide.previewImage] ? (
                          <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
                        ) : (
                          <Image
                            src={slide.previewImage}
                            alt={slide.title}
                            fill
                            className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                            onError={() => handleImageError(slide.previewImage)}
                          />
                        )}
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                        {/* Card Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <h3 className="text-sm font-medium text-white truncate drop-shadow-md">
                            {slide.title}
                          </h3>
                        </div>
                      </motion.div>
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
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex lg:hidden gap-3 z-20"
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
              index === activeIndex ? 'bg-white w-8 h-1' : 'bg-white/30 w-2 h-1'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </motion.div>
    </div>
  );
}
