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
    <div className="min-h-screen bg-white text-[#1F2933] font-sans selection:bg-[#D9DEE8] selection:text-[#050A5C] overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-16 px-6">
        {/* Background Image / Fallback */}
        <div className="absolute inset-0 z-0">
          {imageErrors[entry.media.backgroundImage] ? (
            <div className="w-full h-full bg-gradient-to-b from-[#F8F9FC] to-[#EEF1F6] flex items-center justify-center">
              <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#6B7280]">Cosmetic Hero Visual</span>
            </div>
          ) : (
            <div className="relative w-full h-full opacity-40">
              <Image 
                src={entry.media.backgroundImage}
                alt="Cosmetic Background"
                fill
                priority
                className="object-cover"
                onError={() => handleImageError(entry.media.backgroundImage)}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white" />
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
            <Link href="/" className="inline-flex items-center text-xs tracking-[0.2em] uppercase text-[#6B7280] hover:text-[#050A5C] transition-colors duration-300">
              <ArrowLeft className="w-3 h-3 mr-2" />
              Back to VAVAW Ecosystem
            </Link>
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-light tracking-tight text-[#050A5C] mb-6">
            {entry.title || 'VAVAW Cosmetic'}
          </motion.h1>
          
          <motion.p variants={fadeUp} className="text-xl md:text-2xl text-[#1F2933] font-light mb-8 max-w-2xl mx-auto leading-relaxed">
            Refined skincare formula for customized, luminous revitalization.
          </motion.p>
          
          <motion.div variants={fadeUp} className="w-16 h-[1px] bg-[#050A5C] mx-auto mb-8" />
          
          <motion.p variants={fadeUp} className="text-base text-[#6B7280] max-w-xl mx-auto leading-loose">
            A precise, clinical Korean cosmetic ritual designed for clean and precise care.
          </motion.p>
        </motion.div>
      </section>

      {/* 2. Brand Story Section */}
      <section className="py-32 px-6 bg-white border-t border-[#E1E6EF]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="text-3xl md:text-4xl font-serif text-[#050A5C] mb-8 tracking-wide"
          >
            Clinical Korean Cosmetic
          </motion.h2>
          <motion.p 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="text-[#6B7280] leading-loose text-lg font-light"
          >
            VAVAW Cosmetic is born from the desire to elevate everyday routines into moments of luxurious self-care. 
            We believe in clean beauty that never compromises on efficacy or elegance. Every formula is meticulously 
            crafted to nourish, protect, and enhance your natural radiance, providing a premium daily ritual that 
            harmonizes the skin and the senses.
          </motion.p>
        </div>
      </section>

      {/* 3. Product Highlights */}
      <section className="py-32 px-6 bg-[#EEF1F6]">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
          >
            {[
              { title: "Skincare Essentials", desc: "Foundational formulas for a healthy, balanced complexion, driven by advanced botanical science." },
              { title: "Modern Daily Ritual", desc: "Elevated textures that transform simple care into an indulgent sensory experience." },
              { title: "Signature Cosmetic Line", desc: "Curated palettes offering a refined, radiant finish for effortless, everyday elegance." }
            ].map((item, i) => (
              <motion.div 
                key={i} variants={fadeUp}
                className="bg-white p-12 lg:p-16 text-center shadow-sm border border-[#E1E6EF] hover:border-[#D9DEE8] hover:shadow-md transition-all duration-500 group"
              >
                <div className="w-16 h-16 rounded-full bg-[#F8F9FC] mx-auto mb-8 flex items-center justify-center group-hover:scale-105 border border-[#E1E6EF] transition-transform duration-700">
                  <span className="text-xs text-[#050A5C] font-serif italic">{`0${i+1}`}</span>
                </div>
                <h3 className="text-xl font-serif mb-4 text-[#1F2933] tracking-wide">{item.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed font-light">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. Quality Promise Section */}
      <section className="py-32 px-6 bg-[#F8F9FC]">
        <div className="max-w-6xl mx-auto border-t border-[#E1E6EF] py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.h2 
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="text-3xl font-serif mb-12 tracking-wide text-[#050A5C]"
              >
                The Clean Formula Promise
              </motion.h2>
              <div className="space-y-12 pr-0 md:pr-12">
                {[
                  "Carefully curated clean formulas prioritizing long-term skin health.",
                  "A truly premium beauty experience without compromise.",
                  "Sustainable, elegant packaging designed to minimize impact.",
                  "Developed under the rigorous standards of the VAVAW ecosystem."
                ].map((promise, i) => (
                  <motion.div 
                    key={i}
                    initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                    className="flex items-start"
                  >
                    <span className="text-[#050A5C] text-sm font-serif italic mr-6 mt-1">0{i+1}</span>
                    <p className="text-lg font-light text-[#1F2933] leading-relaxed">{promise}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/5] w-full bg-white border border-[#E1E6EF] overflow-hidden"
            >
              {entry.media.cosmeticCleanPromise && !imageErrors[entry.media.cosmeticCleanPromise] ? (
                <Image
                  src={entry.media.cosmeticCleanPromise}
                  alt="Clean Beauty Promise"
                  fill
                  className="object-cover"
                  onError={() => handleImageError(entry.media.cosmeticCleanPromise!)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#6B7280]">Promise Visual</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Editorial Gallery */}
      <section className="py-24 px-6 bg-white max-w-7xl mx-auto border-t border-[#E1E6EF]">
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.2em] uppercase text-[#050A5C] font-medium">Visual Harmony</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Texture & Formula", image: entry.media.cosmeticTextureRitual },
            { label: "Signature Ritual", image: undefined }, // Placeholder or another image
            { label: "Premium Packaging", image: entry.media.previewImage },
            { label: "Editorial Look", image: entry.media.cosmeticProductEditorial }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
              className="aspect-[3/4] overflow-hidden relative bg-[#F8F9FC] border border-[#E1E6EF] group"
            >
              {item.image && !imageErrors[item.image] ? (
                <Image
                  src={item.image}
                  alt={item.label}
                  fill
                  className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  onError={() => handleImageError(item.image!)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                  <span className="text-[10px] tracking-[0.2em] text-[#6B7280] uppercase font-medium group-hover:text-[#050A5C] transition-colors duration-500">
                    {item.label}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. CTA Section */}
      <section className="py-32 px-6 bg-[#EEF1F6] border-t border-[#E1E6EF] text-center">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="max-w-2xl mx-auto"
        >
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-serif text-[#050A5C] mb-12 tracking-wide">
            Experience the full ecosystem
          </motion.h2>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <CosmeticCtaTracker
              label="START AN INQUIRY"
              href="/contact?type=cosmetic_interest"
              className="h-[54px] px-10 flex items-center justify-center bg-[#050A5C] text-white text-[13px] tracking-[0.2em] uppercase hover:bg-[#101A8C] transition-colors shadow-sm"
            />
            <CosmeticCtaTracker
              label="BACK TO ECOSYSTEM"
              href="/"
              className="h-[54px] px-10 flex items-center justify-center bg-white border border-[#050A5C] text-[#050A5C] text-[13px] tracking-[0.2em] uppercase hover:bg-[#F8F9FC] transition-colors shadow-sm"
            />
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
