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
            <div className="w-full h-full bg-gradient-to-b from-[#faf9f7] to-[#f4f1eb] flex items-center justify-center">
              <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#a3a3a3]">Cosmetic Hero Visual</span>
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
      <section className="py-32 px-6 bg-[#fcfbf9]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="text-3xl md:text-4xl font-serif text-[#1a1a1a] mb-8 tracking-wide"
          >
            A New Ritual of Beauty
          </motion.h2>
          <motion.p 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="text-[#737373] leading-loose text-lg font-light"
          >
            VAVAW Cosmetic is born from the desire to elevate everyday routines into moments of luxurious self-care. 
            We believe in clean beauty that never compromises on efficacy or elegance. Every formula is meticulously 
            crafted to nourish, protect, and enhance your natural radiance, providing a premium daily ritual that 
            harmonizes the skin and the senses.
          </motion.p>
        </div>
      </section>

      {/* 3. Product Highlights */}
      <section className="py-32 px-6 bg-[#f4f1eb]">
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
                className="bg-[#fcfbf9] p-12 lg:p-16 text-center border border-[#e5e5e5] hover:border-[#d4d4d4] transition-colors duration-500 group"
              >
                <div className="w-16 h-16 rounded-full bg-[#f4f1eb] mx-auto mb-8 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                  <span className="text-xs text-[#a3a3a3] font-serif italic">{`0${i+1}`}</span>
                </div>
                <h3 className="text-xl font-serif mb-4 text-[#1a1a1a] tracking-wide">{item.title}</h3>
                <p className="text-sm text-[#737373] leading-relaxed font-light">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. Quality Promise Section */}
      <section className="py-32 px-6 bg-[#fcfbf9]">
        <div className="max-w-6xl mx-auto border-t border-[#e5e5e5] py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.h2 
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="text-3xl font-serif mb-12 tracking-wide text-[#1a1a1a]"
              >
                The Clean Beauty Promise
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
                    <span className="text-[#a3a3a3] text-sm font-serif italic mr-6 mt-1">0{i+1}</span>
                    <p className="text-lg font-light text-[#525252] leading-relaxed">{promise}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/5] w-full bg-[#f4f1eb] overflow-hidden"
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
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#a3a3a3]">Promise Visual</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Editorial Gallery */}
      <section className="py-24 px-6 bg-[#fcfbf9] max-w-7xl mx-auto">
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
              className="aspect-[3/4] overflow-hidden relative bg-[#f4f1eb] border border-[#e5e5e5] group"
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
                  <span className="text-[10px] tracking-[0.2em] text-[#a3a3a3] uppercase font-medium group-hover:text-[#737373] transition-colors duration-500">
                    {item.label}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. CTA Section */}
      <section className="py-32 px-6 bg-[#1a1a1a] text-[#fcfbf9] text-center mt-12">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="max-w-2xl mx-auto"
        >
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-serif mb-12 tracking-wide">
            Experience the full ecosystem
          </motion.h2>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <CosmeticCtaTracker
              label="Contact Us"
              href="/contact?type=cosmetic_interest"
              className="h-[54px] px-10 flex items-center justify-center bg-[#fcfbf9] text-[#1a1a1a] text-[13px] tracking-[0.2em] uppercase hover:bg-white transition-colors"
            />
            <CosmeticCtaTracker
              label="Back to VAVAW"
              href="/"
              className="h-[54px] px-10 flex items-center justify-center bg-transparent border border-[#525252] text-[#fcfbf9] text-[13px] tracking-[0.2em] uppercase hover:border-[#a3a3a3] hover:text-white transition-colors"
            />
            <CosmeticCtaTracker
              label="Explore Beauty & Co"
              href="/go/beauty"
              className="group h-[54px] px-6 flex items-center justify-center text-[11px] tracking-[0.2em] uppercase text-[#a3a3a3] hover:text-[#fcfbf9] transition-colors"
            >
              Explore Beauty &amp; Co
              <ChevronRight className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </CosmeticCtaTracker>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
