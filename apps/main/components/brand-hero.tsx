'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { businessEntries } from '@vavaw/brand-config';
import { useRouter } from 'next/navigation';

export function BrandHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const router = useRouter();

  // Autoplay carousel
  useEffect(() => {
    if (!autoplay || isHovering) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % businessEntries.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [autoplay, isHovering]);

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev - 1 + businessEntries.length) % businessEntries.length);
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 8000);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % businessEntries.length);
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 8000);
  };

  const currentSlide = businessEntries[activeIndex];

  // Calculate preview slides with modulo logic
  const previewCount = Math.min(3, businessEntries.length - 1);
  const previewSlides = Array.from({ length: previewCount }).map((_, offset) => {
    const index = (activeIndex + offset + 1) % businessEntries.length;
    return {
      ...businessEntries[index],
      realIndex: index,
    };
  });

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${activeIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image
            src={currentSlide.media.backgroundImage}
            alt={currentSlide.title}
            fill
            priority
            className="object-cover"
          />
          {/* Refined Dark Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30 lg:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent lg:hidden" />
        </motion.div>
      </AnimatePresence>

      {/* Content Container */}
      <div className="relative h-full flex flex-col justify-center px-6 md:px-8 lg:px-16 pb-20 lg:pb-0">
        <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch lg:items-center h-full pt-20 lg:pt-0">
          
          {/* Left Content */}
          <motion.div
            className="w-full lg:w-[45%] flex flex-col justify-center space-y-6 lg:space-y-8 z-10 flex-1 lg:flex-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Category */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`category-${activeIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-xs font-light tracking-widest text-white/60 uppercase"
              >
                {currentSlide.category} • {String(activeIndex + 1).padStart(2, '0')}/{String(businessEntries.length).padStart(2, '0')}
              </motion.div>
            </AnimatePresence>

            {/* Title */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${activeIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.7 }}
                className="text-5xl md:text-6xl lg:text-8xl font-light text-white leading-none tracking-tight"
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
                transition={{ duration: 0.7, delay: 0.05 }}
                className="text-lg md:text-xl text-white/90 font-light leading-relaxed"
              >
                {currentSlide.subtitle}
              </motion.p>
            </AnimatePresence>

            {/* Description */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${activeIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-base md:text-lg text-white/70 font-light leading-relaxed max-w-xl hidden md:block"
              >
                {currentSlide.description}
              </motion.p>
            </AnimatePresence>

            {/* CTA Button */}
            <motion.button
              onClick={() => router.push(currentSlide.redirectPath)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-fit px-8 md:px-10 py-3.5 bg-white text-black font-medium text-sm tracking-wide rounded-full hover:bg-white/90 transition-colors"
            >
              {currentSlide.ctaLabel}
            </motion.button>

            {/* Navigation Controls - Desktop Only */}
            <motion.div
              className="hidden lg:flex items-center gap-6 pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <motion.button
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                onClick={handlePrevious}
                className="w-11 h-11 rounded-full border border-white/40 hover:border-white/70 flex items-center justify-center text-white/70 hover:text-white transition-all"
                aria-label="Previous brand"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>

              {/* Progress Bar */}
              <div className="flex-1 h-0.5 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${((activeIndex + 1) / businessEntries.length) * 100}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleNext}
                className="w-11 h-11 rounded-full border border-white/40 hover:border-white/70 flex items-center justify-center text-white/70 hover:text-white transition-all"
                aria-label="Next brand"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Breathing Space */}
          <div className="hidden lg:block w-[10%]" />

          {/* Right Preview Cards */}
          <motion.div
            className="w-full lg:w-[45%] lg:h-full flex items-end lg:items-center justify-start overflow-x-auto lg:overflow-visible pb-8 lg:pb-0 z-10"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            <div className="relative flex gap-4 lg:gap-6 items-center justify-start min-w-max px-2 lg:px-0 lg:pl-8">
              <AnimatePresence mode="wait">
                {previewSlides.map((slide, index) => {
                  const sizes = [
                    { width: 140, height: 220, scale: 1, opacity: 1 },
                    { width: 120, height: 190, scale: 0.9, opacity: 0.8 },
                    { width: 100, height: 160, scale: 0.8, opacity: 0.6 },
                  ];
                  const size = sizes[index] || sizes[2];

                  return (
                    <motion.div
                      key={`preview-${index}-${slide.realIndex}`}
                      initial={{ opacity: 0, x: 20, scale: 0.8 }}
                      animate={{
                        opacity: size.opacity,
                        scale: size.scale,
                        x: 0,
                      }}
                      exit={{ opacity: 0, x: 20, scale: 0.8 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                        delay: index * 0.05,
                      }}
                      onClick={() => {
                        setActiveIndex(slide.realIndex);
                        setAutoplay(false);
                        setTimeout(() => setAutoplay(true), 8000);
                      }}
                      className="relative flex-shrink-0 cursor-pointer lg:origin-center origin-bottom snap-start"
                      style={{
                        width: `${size.width}px`,
                        height: `${size.height}px`,
                      }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="relative w-full h-full bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 shadow-xl group"
                      >
                        {/* Card Image */}
                        <Image
                          src={slide.media.previewImage}
                          alt={slide.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Card Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h3 className="text-sm font-medium text-white truncate drop-shadow-md">
                            {slide.name}
                          </h3>
                          <p className="text-xs text-white/80 line-clamp-1 font-light drop-shadow-md">
                            {slide.subtitle}
                          </p>
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

      {/* Pagination Dots - Mobile Only */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex lg:hidden gap-2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {businessEntries.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setActiveIndex(index);
              setAutoplay(false);
              setTimeout(() => setAutoplay(true), 8000);
            }}
            className={`transition-all rounded-full ${
              index === activeIndex ? 'bg-white w-6 h-1.5' : 'bg-white/40 w-2 h-1.5'
            }`}
            aria-label={`Go to brand ${index + 1}`}
          />
        ))}
      </motion.div>
    </div>
  );
}
