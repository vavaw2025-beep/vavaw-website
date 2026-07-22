'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { brands } from '@/lib/data';

export function BrandHero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [autoplay, setAutoplay] = useState(true);

  // Autoplay carousel
  useEffect(() => {
    if (!autoplay || isHovering) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % brands.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [autoplay, isHovering]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + brands.length) % brands.length);
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 8000);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % brands.length);
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 8000);
  };

  const currentBrand = brands[currentIndex];

  // Get the next 3 slides for preview cards with realIndex
  const previewSlides = [1, 2, 3].map((offset) => {
    const index = (currentIndex + offset) % brands.length;
    return {
      ...brands[index],
      realIndex: index,
    };
  });

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${currentIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image
            src={currentBrand.image}
            alt={currentBrand.title}
            fill
            priority
            className="object-cover"
          />
          {/* Refined Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content Container */}
      <div className="relative h-full flex items-center px-6 md:px-8 lg:px-16">
        <div className="w-full flex flex-col lg:flex-row gap-12 items-stretch lg:items-center">
          {/* Left Content - 45% width */}
          <motion.div
            className="w-full lg:w-[45%] flex flex-col justify-center space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Category */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`category-${currentIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-xs font-light tracking-widest text-white/40 uppercase"
              >
                {currentBrand.category} • {String(currentIndex + 1).padStart(2, '0')}/{String(brands.length).padStart(2, '0')}
              </motion.div>
            </AnimatePresence>

            {/* Title */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${currentIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.7 }}
                className="text-6xl md:text-7xl lg:text-8xl font-light text-white leading-none tracking-tight"
              >
                {currentBrand.title}
              </motion.h1>
            </AnimatePresence>

            {/* Subtitle */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`subtitle-${currentIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.7, delay: 0.05 }}
                className="text-lg md:text-xl text-white/80 font-light leading-relaxed"
              >
                {currentBrand.subtitle}
              </motion.p>
            </AnimatePresence>

            {/* Description */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${currentIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-base md:text-lg text-white/60 font-light leading-relaxed max-w-xl"
              >
                {currentBrand.description}
              </motion.p>
            </AnimatePresence>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-fit px-8 md:px-10 py-3.5 bg-white/95 text-black font-light text-sm tracking-wide rounded-full hover:bg-white transition-colors"
            >
              {currentBrand.ctaLabel}
            </motion.button>

            {/* Navigation Controls */}
            <motion.div
              className="flex items-center gap-6 pt-8"
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
              <div className="flex-1 h-0.5 bg-white/15 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white/70"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIndex + 1) / brands.length) * 100}%` }}
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

          {/* Right Preview Cards - 45% width */}
          <motion.div
            className="hidden lg:flex w-[45%] h-full items-center justify-start pl-8"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="relative flex gap-4 items-center justify-start">
              <AnimatePresence mode="wait">
                {previewSlides.map((slide, index) => {
                  const sizes = [
                    { width: 140, height: 220, scale: 1, opacity: 1 },
                    { width: 120, height: 190, scale: 0.9, opacity: 0.75 },
                    { width: 100, height: 160, scale: 0.8, opacity: 0.5 },
                  ];
                  const size = sizes[index];

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
                        setCurrentIndex(slide.realIndex);
                        setAutoplay(false);
                        setTimeout(() => setAutoplay(true), 8000);
                      }}
                      className="relative flex-shrink-0 cursor-pointer"
                      style={{
                        width: `${size.width}px`,
                        height: `${size.height}px`,
                      }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="relative w-full h-full bg-white/8 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/15 shadow-xl group"
                      >
                        {/* Card Image */}
                        <Image
                          src={slide.cardImage}
                          alt={slide.brandName}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                        {/* Card Content - Glassmorphism overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 backdrop-blur-sm bg-black/30">
                          <h3 className="text-xs md:text-sm font-light text-white/95 truncate">
                            {slide.brandName}
                          </h3>
                          <p className="text-xs text-white/60 line-clamp-1 font-light">
                            {slide.tagline}
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

      {/* Pagination Dots - Bottom Center */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {brands.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setAutoplay(false);
              setTimeout(() => setAutoplay(true), 8000);
            }}
            className={`transition-all rounded-full ${
              index === currentIndex ? 'bg-white/70 w-8 h-1.5' : 'bg-white/20 w-2 h-1.5 hover:bg-white/40'
            }`}
            whileHover={{ scale: 1.3 }}
            aria-label={`Go to brand ${index + 1}`}
          />
        ))}
      </motion.div>
    </div>
  );
}
