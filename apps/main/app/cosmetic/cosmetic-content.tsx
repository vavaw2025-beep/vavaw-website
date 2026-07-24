'use client';

import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import type { BusinessEntry } from '@vavaw/brand-config';
import { CosmeticCtaTracker } from './cosmetic-tracker';

interface CosmeticContentProps {
  entry: BusinessEntry;
}

export function CosmeticContent({ entry }: CosmeticContentProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (path: string) => {
    setImageErrors(prev => ({ ...prev, [path]: true }));
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const stagger: Variants = {
    visible: { transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#1a1a1a] font-sans selection:bg-[#e0d6cd] selection:text-black overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-16 px-6">
        {/* Background Image / Fallback */}
        <div className="absolute inset-0 z-0">
          {imageErrors[entry.media.backgroundImage] ? (
            <div className="w-full h-full bg-gradient-to-b from-[#f4f1eb] to-[#fcfbf9]" />
          ) : (
            <div className="relative w-full h-full opacity-30">
              <Image 
                src={entry.media.backgroundImage}
                alt="Cosmetic Background"
                fill
                priority
                className="object-cover"
                onError={() => handleImageError(entry.media.backgroundImage)}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#fcfbf9]/50 via-transparent to-[#fcfbf9]" />
            </div>
          )}
        </div>

        <motion.div 
          className="relative z-10 text-center max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="mb-6">
            <Link href="/" className="inline-flex items-center text-xs tracking-[0.2em] uppercase text-[#737373] hover:text-[#1a1a1a] transition-colors duration-300">
              <ArrowLeft className="w-3 h-3 mr-2" />
              Back to VAVAW Ecosystem
            </Link>
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-light tracking-tight text-[#1a1a1a] mb-6">
            {entry.title || 'VAVAW Cosmetic'}
          </motion.h1>
          
          <motion.p variants={fadeUp} className="text-xl md:text-2xl text-[#404040] font-light mb-8 max-w-2xl mx-auto leading-relaxed">
            {entry.subtitle}
          </motion.p>
          
          <motion.div variants={fadeUp} className="w-16 h-[1px] bg-[#d4d4d4] mx-auto mb-8" />
          
          <motion.p variants={fadeUp} className="text-base text-[#737373] max-w-xl mx-auto leading-loose">
            {entry.description}
          </motion.p>
        </motion.div>
      </section>

      {/* 2. Brand Story Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="text-3xl md:text-4xl font-light mb-8"
          >
            A New Ritual of Beauty
          </motion.h2>
          <motion.p 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="text-[#525252] leading-loose text-lg font-light"
          >
            VAVAW Cosmetic is born from the desire to elevate everyday routines into moments of luxurious self-care. 
            We believe in clean beauty that doesn't compromise on efficacy or elegance. Every formula is meticulously 
            crafted to nourish, protect, and enhance your natural radiance, providing a premium daily ritual that 
            harmonizes the skin and the senses.
          </motion.p>
        </div>
      </section>

      {/* 3. Product Highlights */}
      <section className="py-24 px-6 bg-[#f4f1eb]">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { title: "Skincare Essentials", desc: "Foundational formulas for a healthy, balanced complexion." },
              { title: "Daily Beauty Ritual", desc: "Elevated routines that transform care into indulgence." },
              { title: "Signature Cosmetic Line", desc: "Curated color and finish for effortless elegance." }
            ].map((item, i) => (
              <motion.div 
                key={i} variants={fadeUp}
                className="bg-white p-12 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow duration-500 group"
              >
                <div className="w-12 h-12 rounded-full bg-[#f4f1eb] mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-500" />
                <h3 className="text-xl font-light mb-4 text-[#1a1a1a]">{item.title}</h3>
                <p className="text-sm text-[#737373] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. Quality Promise Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-3xl font-light text-center mb-16"
          >
            Our Commitment
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-12 gap-x-16">
            {[
              "Carefully curated clean formulas",
              "A truly premium beauty experience",
              "Sustainable, elegant packaging direction",
              "Proudly built under the VAVAW ecosystem"
            ].map((promise, i) => (
              <motion.div 
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="flex items-start"
              >
                <span className="text-[#a3a3a3] text-sm font-mono mr-4 mt-1">0{i+1}</span>
                <p className="text-lg font-light text-[#404040]">{promise}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Gallery Placeholder */}
      <section className="py-12 px-6 bg-white max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((_, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="aspect-[4/5] rounded-xl overflow-hidden relative bg-gradient-to-br from-[#f4f1eb] to-[#e5e5e5]"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs tracking-widest text-[#a3a3a3] uppercase font-medium">Gallery {i+1}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. CTA Section */}
      <section className="py-32 px-6 bg-[#1a1a1a] text-white text-center">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="max-w-2xl mx-auto"
        >
          <motion.h2 variants={fadeUp} className="text-4xl font-light mb-8">
            Experience the full ecosystem
          </motion.h2>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <CosmeticCtaTracker
              label="Back to VAVAW"
              href="/"
              className="h-[48px] px-8 flex items-center justify-center bg-white text-black text-[13px] tracking-[0.15em] uppercase hover:bg-white/90 transition-colors"
            />
            <CosmeticCtaTracker
              label="Contact Us"
              href="/contact?type=cosmetic_interest"
              className="h-[48px] px-8 flex items-center justify-center bg-transparent border border-white text-white text-[13px] tracking-[0.15em] uppercase hover:bg-white/10 transition-colors"
            />
            <CosmeticCtaTracker
              label="Explore Beauty & Co"
              href="/go/beauty"
              className="group h-[48px] px-8 flex items-center justify-center text-[13px] tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors"
            >
              Explore Beauty &amp; Co
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </CosmeticCtaTracker>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
