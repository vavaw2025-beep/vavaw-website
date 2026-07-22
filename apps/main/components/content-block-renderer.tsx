'use client';

import { motion, Variants } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import type { NormalizedContentBlock } from '../lib/public-cms-types';
import { ReactNode } from 'react';

// Safety helpers
function getString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function getBlockItems(content: Record<string, unknown>): any[] {
  if (Array.isArray(content.items)) {
    return content.items;
  }
  return [];
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.2 } }
};

export function ContentBlockRenderer({ blocks, fallbackContent }: { blocks: NormalizedContentBlock[], fallbackContent?: ReactNode }) {
  if (!blocks || blocks.length === 0) {
    return <>{fallbackContent}</>;
  }

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#1a1a1a] font-sans selection:bg-[#e0d6cd] selection:text-black overflow-hidden">
      {blocks.map((block) => {
        const { id, blockType, content } = block;

        if (blockType === 'hero') {
          return (
            <section key={id} className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-16 px-6">
              <div className="absolute inset-0 z-0">
                <div className="w-full h-full bg-gradient-to-b from-[#f4f1eb] to-[#fcfbf9]" />
              </div>
              <motion.div 
                className="relative z-10 text-center max-w-4xl mx-auto"
                initial="hidden" animate="visible" variants={stagger}
              >
                <motion.div variants={fadeUp} className="mb-6">
                  <Link href="/" className="inline-flex items-center text-xs tracking-[0.2em] uppercase text-[#737373] hover:text-[#1a1a1a] transition-colors duration-300">
                    <ArrowLeft className="w-3 h-3 mr-2" />
                    {getString(content.backLabel, 'Back')}
                  </Link>
                </motion.div>
                <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-light tracking-tight text-[#1a1a1a] mb-6">
                  {getString(content.title, 'Hero Title')}
                </motion.h1>
                <motion.p variants={fadeUp} className="text-xl md:text-2xl text-[#404040] font-light mb-8 max-w-2xl mx-auto leading-relaxed">
                  {getString(content.subtitle)}
                </motion.p>
                <motion.div variants={fadeUp} className="w-16 h-[1px] bg-[#d4d4d4] mx-auto mb-8" />
                <motion.p variants={fadeUp} className="text-base text-[#737373] max-w-xl mx-auto leading-loose">
                  {getString(content.description)}
                </motion.p>
              </motion.div>
            </section>
          );
        }

        if (blockType === 'rich_text') {
          return (
            <section key={id} className="py-24 px-6 bg-white">
              <div className="max-w-3xl mx-auto text-center">
                <motion.h2 
                  initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
                  className="text-3xl md:text-4xl font-light mb-8"
                >
                  {getString(content.title)}
                </motion.h2>
                <motion.p 
                  initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
                  className="text-[#525252] leading-loose text-lg font-light whitespace-pre-wrap"
                >
                  {getString(content.body)}
                </motion.p>
              </div>
            </section>
          );
        }

        if (blockType === 'feature_grid' || blockType === 'product_highlights') {
          const items = getBlockItems(content);
          return (
            <section key={id} className="py-24 px-6 bg-[#f4f1eb]">
              <div className="max-w-6xl mx-auto">
                {getString(content.title) && (
                  <motion.h2 
                    initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                    className="text-3xl font-light text-center mb-16 text-[#1a1a1a]"
                  >
                    {getString(content.title)}
                  </motion.h2>
                )}
                <motion.div 
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                  {items.map((item, i) => (
                    <motion.div 
                      key={i} variants={fadeUp}
                      className="bg-white p-12 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow duration-500 group"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#f4f1eb] mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-500" />
                      <h3 className="text-xl font-light mb-4 text-[#1a1a1a]">{getString(item.title || item.name)}</h3>
                      <p className="text-sm text-[#737373] leading-relaxed">{getString(item.description)}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </section>
          );
        }

        if (blockType === 'quality_promise' || blockType === 'faq') {
          const items = getBlockItems(content);
          return (
            <section key={id} className="py-24 px-6 bg-white">
              <div className="max-w-5xl mx-auto">
                <motion.h2 
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  className="text-3xl font-light text-center mb-16"
                >
                  {getString(content.title)}
                </motion.h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-12 gap-x-16">
                  {items.map((item, i) => (
                    <motion.div 
                      key={i}
                      initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                      className="flex items-start"
                    >
                      <span className="text-[#a3a3a3] text-sm font-mono mr-4 mt-1">0{i+1}</span>
                      <div>
                        {getString(item.title) && <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">{getString(item.title)}</h3>}
                        {getString(item.question) && <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">{getString(item.question)}</h3>}
                        <p className="text-lg font-light text-[#404040]">{getString(item.description || item.answer || item)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (blockType === 'gallery') {
          const images = Array.isArray(content.images) ? content.images : [];
          return (
            <section key={id} className="py-12 px-6 bg-white max-w-7xl mx-auto">
              {getString(content.title) && (
                <motion.h2 
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  className="text-3xl font-light text-center mb-12"
                >
                  {getString(content.title)}
                </motion.h2>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {images.length > 0 ? images.map((img: any, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="aspect-[4/5] rounded-xl overflow-hidden relative bg-gradient-to-br from-[#f4f1eb] to-[#e5e5e5]"
                  >
                    {img.url ? (
                      <Image src={img.url} alt={getString(img.alt, `Gallery image ${i+1}`)} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs tracking-widest text-[#a3a3a3] uppercase font-medium">Gallery {i+1}</span>
                      </div>
                    )}
                  </motion.div>
                )) : (
                  [1, 2, 3, 4].map((_, i) => (
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
                  ))
                )}
              </div>
            </section>
          );
        }

        if (blockType === 'cta') {
          return (
            <section key={id} className="py-32 px-6 bg-[#1a1a1a] text-white text-center">
              <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
                className="max-w-2xl mx-auto"
              >
                <motion.h2 variants={fadeUp} className="text-4xl font-light mb-8">
                  {getString(content.title)}
                </motion.h2>
                {getString(content.description) && (
                  <motion.p variants={fadeUp} className="text-lg text-white/80 mb-8 font-light">
                    {getString(content.description)}
                  </motion.p>
                )}
                <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  {getString(content.buttonHref) ? (
                    <Link 
                      href={getString(content.buttonHref)}
                      className="px-8 py-4 bg-white text-black text-sm tracking-widest uppercase hover:bg-white/90 transition-colors"
                    >
                      {getString(content.buttonLabel, 'Learn More')}
                    </Link>
                  ) : (
                    <Link 
                      href="/"
                      className="px-8 py-4 bg-white text-black text-sm tracking-widest uppercase hover:bg-white/90 transition-colors"
                    >
                      Back to VAVAW
                    </Link>
                  )}
                  {getString(content.secondaryButtonHref) && (
                    <Link 
                      href={getString(content.secondaryButtonHref)}
                      className="group flex items-center text-sm tracking-widest uppercase text-white/70 hover:text-white transition-colors"
                    >
                      {getString(content.secondaryButtonLabel)}
                      <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </motion.div>
              </motion.div>
            </section>
          );
        }

        // custom_json or unhandled
        return null;
      })}
    </div>
  );
}
