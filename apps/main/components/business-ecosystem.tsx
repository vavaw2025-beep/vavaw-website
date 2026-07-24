'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { getSortedBusinessEntries } from '@vavaw/brand-config';
import { useState } from 'react';

export function BusinessEcosystem() {
  const entries = getSortedBusinessEntries();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (path: string) => {
    setImageErrors((prev) => ({ ...prev, [path]: true }));
  };

  return (
    <section className="bg-white py-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-24 text-center max-w-2xl mx-auto"
        >
          <h2 className="text-sm font-medium tracking-[0.2em] uppercase text-slate-400 mb-6">
            The VAVAW Ecosystem
          </h2>
          <p className="text-3xl md:text-4xl font-light text-slate-900 leading-tight">
            A curated portfolio of premium beauty, care, and business partnership brands.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {entries.map((entry, index) => {
            const hasError = imageErrors[entry.media.previewImage];
            
            return (
              <motion.div
                key={entry.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
                className="group flex flex-col h-full"
              >
                {/* Media Placeholder / Image */}
                <Link href={entry.redirectPath} prefetch={false} className="block relative w-full aspect-[4/5] overflow-hidden bg-slate-50 mb-8">
                  {!entry.media.previewImage || entry.media.previewImage.trim() === '' || hasError ? (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#f4f1eb] to-[#e5e5e5] flex items-center justify-center">
                      <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#a3a3a3] group-hover:text-[#737373] transition-colors">
                        {entry.category} Visual
                      </span>
                    </div>
                  ) : (
                    <Image
                      src={entry.media.previewImage}
                      alt={entry.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      onError={() => handleImageError(entry.media.previewImage)}
                    />
                  )}
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                </Link>

                {/* Content */}
                <div className="flex flex-col flex-1">
                  <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-slate-400 mb-3 block">
                    {entry.category}
                  </span>
                  <h3 className="text-2xl font-light text-slate-900 mb-4 tracking-tight">
                    {entry.title}
                  </h3>
                  <p className="text-slate-500 font-light leading-relaxed mb-8 flex-1">
                    {entry.description}
                  </p>
                  
                  <Link
                    href={entry.redirectPath}
                    prefetch={false}
                    className="inline-flex items-center text-xs font-medium tracking-[0.15em] uppercase text-slate-900 hover:text-slate-600 transition-colors w-fit"
                  >
                    {entry.ctaLabel}
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
