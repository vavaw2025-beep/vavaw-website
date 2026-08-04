'use client';

import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import type { BusinessEntry } from '@vavaw/brand-config';
import { CosmeticCtaTracker } from './cosmetic-tracker';
import type { PublicHeroMedia } from '@/lib/load-public-hero-media';

function isValidHeroImageUrl(value?: string | null): value is string {
  if (!value) return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed === '-') return false;
  if (trimmed.includes('PASTE_')) return false;
  return trimmed.startsWith('http://') || trimmed.startsWith('https://');
}

interface CosmeticContentProps {
  entry: BusinessEntry;
  heroMedia?: PublicHeroMedia | null;
}

// ─── Animation variants ────────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: 'easeOut' } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.9, ease: 'easeOut' } },
};

const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const staggerSlow: Variants = {
  visible: { transition: { staggerChildren: 0.09 } },
};

// ─── Shared style tokens ───────────────────────────────────────────────────────
const NAVY = '#050A5C';
const SILVER_BORDER = 'border-[#D9DEE8]';
const SECTION_WHITE = 'bg-white';
const SECTION_COOL = 'bg-[#F4F7FB]';
const SECTION_NAVY = 'bg-[#050A5C]';

// ─── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-[10px] tracking-[0.3em] uppercase font-semibold text-[#050A5C] mb-5">
      {children}
    </span>
  );
}

function Divider() {
  return <div className={`w-10 h-px bg-[#050A5C]/30 my-8`} />;
}

// ─── Main component ────────────────────────────────────────────────────────────

export function CosmeticContent({ entry, heroMedia }: CosmeticContentProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (path: string) => {
    setImageErrors(prev => ({ ...prev, [path]: true }));
  };

  const searchParams = useSearchParams();
  const fromMain = searchParams.get('from') === 'main';

  const heroFadeUp: Variants = {
    hidden: { opacity: 0, y: fromMain ? 8 : 30 },
    visible: { opacity: 1, y: 0, transition: { duration: fromMain ? 0.45 : 0.8, ease: 'easeOut' } },
  };
  const heroStagger: Variants = {
    visible: { transition: { staggerChildren: fromMain ? 0.1 : 0.2 } },
  };

  const showDebug = process.env.NEXT_PUBLIC_SHOW_CMS_DEBUG === 'true';
  const hasValidHeroImage = heroMedia?.backgroundImageUrl && isValidHeroImageUrl(heroMedia.backgroundImageUrl);

  return (
    <div className="min-h-screen bg-white text-[#1F2933] font-sans selection:bg-[#D9DEE8] selection:text-[#050A5C] overflow-hidden">

      {/* ───────────────────────────────────────────────────────────────────────
          SECTION 1 — HERO (preserved exactly, do not modify)
      ─────────────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[78vh] md:min-h-[82vh] max-h-[760px] flex flex-col justify-center pt-28 pb-20 px-6 overflow-hidden">
        {showDebug && (
          <div className="absolute top-24 right-6 z-[60] bg-black/80 backdrop-blur-md p-4 rounded-md text-[10px] font-mono border border-gray-700 text-gray-300 shadow-2xl max-w-xs w-full opacity-50 hover:opacity-100 transition-opacity">
            <div className="font-bold text-white uppercase mb-2">Cosmetic CMS Debug</div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>cosmeticHeroUrl:</span>
                <span className={heroMedia?.backgroundImageUrl ? 'text-emerald-400' : 'text-red-400'}>
                  {heroMedia?.backgroundImageUrl ? 'yes' : 'no'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>imageRendered:</span>
                <span className={hasValidHeroImage && !imageErrors[heroMedia!.backgroundImageUrl!] ? 'text-emerald-400' : 'text-red-400'}>
                  {hasValidHeroImage && !imageErrors[heroMedia!.backgroundImageUrl!] ? 'yes' : 'no'}
                </span>
              </div>
              {heroMedia?.backgroundImageUrl && (
                <div className="text-[9px] text-gray-500 break-all mt-1 border-t border-gray-700 pt-1">
                  url: {heroMedia.backgroundImageUrl.substring(0, 80)}...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Background Image / Fallback */}
        <div className="absolute inset-0 z-0 bg-[#F7F9FC]">
          {heroMedia?.backgroundImageUrl && isValidHeroImageUrl(heroMedia.backgroundImageUrl) && !imageErrors[heroMedia.backgroundImageUrl] ? (
            <>
              <img
                src={heroMedia.backgroundImageUrl.trim()}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 z-0 w-full h-full object-cover object-center md:object-[center_right] opacity-[0.42] md:opacity-[0.68]"
                onError={() => handleImageError(heroMedia.backgroundImageUrl!)}
              />
              {/* Overlays */}
              <div className="absolute inset-0 z-[1] bg-white/10 md:bg-white/15" />
              <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,10,92,0.10)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 z-[1] bg-gradient-to-t from-[#F7F9FC] via-[#F7F9FC]/50 to-transparent opacity-90" />
            </>
          ) : (
            <div className="absolute inset-0 z-0 w-full h-full bg-gradient-to-br from-[#E1E6EF] via-[#F8F9FC] to-[#D9DEE8] opacity-80" />
          )}
        </div>

        <motion.div
          className="relative z-10 max-w-3xl md:ml-12 lg:ml-24 flex flex-col items-center md:items-start text-center md:text-left"
          initial="hidden"
          animate="visible"
          variants={heroStagger}
        >
          <motion.div variants={heroFadeUp} className="mb-6 md:mb-8">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#050A5C] font-semibold bg-white/40 px-3 py-1 rounded-full backdrop-blur-sm">
              Clinical Korean Cosmetic
            </span>
          </motion.div>

          <motion.h1 variants={heroFadeUp} className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight text-[#050A5C] mb-6 drop-shadow-sm">
            VAVAW Cosmetic
          </motion.h1>

          <motion.p variants={heroFadeUp} className="text-xl md:text-2xl text-[#1F2933] font-light mb-8 max-w-xl leading-relaxed">
            Clinical Korean cosmetic rituals, refined with precision.
          </motion.p>

          <motion.div variants={heroFadeUp} className="w-12 h-[1px] bg-[#050A5C]/40 mb-8" />

          <motion.p variants={heroFadeUp} className="text-sm md:text-base text-[#6B7280] max-w-md leading-relaxed mb-10 md:mb-12">
            A cool blue and silver skincare experience designed for luminous, balanced, modern skin.
          </motion.p>

          <motion.div variants={heroFadeUp} className="flex flex-col sm:flex-row items-center gap-4 w-full px-4 sm:px-0">
            <CosmeticCtaTracker
              label="START AN INQUIRY"
              href="/contact?type=cosmetic_interest"
              className="w-full sm:w-auto h-[54px] px-10 flex items-center justify-center bg-[#050A5C] text-white text-[12px] tracking-[0.2em] uppercase hover:bg-[#101A8C] transition-colors shadow-md"
            />
            <CosmeticCtaTracker
              label="BACK TO ECOSYSTEM"
              href="/"
              className="w-full sm:w-auto h-[54px] px-10 flex items-center justify-center bg-white/80 backdrop-blur border border-[#050A5C]/20 text-[#050A5C] text-[12px] tracking-[0.2em] uppercase hover:bg-white transition-colors shadow-sm"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          SECTION 2 — BRAND PHILOSOPHY / RAW SKINCARE SYSTEM
      ─────────────────────────────────────────────────────────────────────── */}
      <section className={`${SECTION_WHITE} border-t ${SILVER_BORDER} py-28 md:py-36 px-6`}>
        <div className="max-w-6xl mx-auto">
          {/* Heading block */}
          <motion.div
            className="max-w-2xl mx-auto text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.div variants={fadeUp}>
              <SectionLabel>The Premium RAW Skincare System</SectionLabel>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-[#050A5C] mb-6 leading-tight"
            >
              Scientific beauty, refined into a pure Korean skincare ritual.
            </motion.h2>
            <Divider />
            <motion.p variants={fadeUp} className="text-[#6B7280] text-base md:text-lg font-light leading-relaxed">
              VAVAW is a clinical Korean cosmetic system designed to restore the skin from its origin — pure, balanced, and resilient.
            </motion.p>
          </motion.div>

          {/* Three philosophy cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            {[
              {
                num: '01',
                title: 'Scientific Beauty',
                desc: 'Clinical skincare system shaped by professional care standards — developed for visible, lasting results.',
              },
              {
                num: '02',
                title: 'Premium Program',
                desc: 'Personalized skincare experience for modern skin concerns — designed for spa, clinic, and home ritual.',
              },
              {
                num: '03',
                title: 'Functional Cosmetics',
                desc: 'Korean-developed formulas designed for visible skin recovery, balancing efficacy with elegance.',
              },
            ].map((card) => (
              <motion.div
                key={card.num}
                variants={fadeUp}
                className={`group border ${SILVER_BORDER} bg-white p-10 lg:p-12 hover:border-[#050A5C]/30 hover:shadow-lg transition-all duration-500`}
              >
                <span className="block text-[11px] font-semibold tracking-[0.25em] text-[#050A5C]/40 mb-6 font-mono">
                  {card.num}
                </span>
                <h3 className="text-xl font-light text-[#050A5C] mb-4 tracking-wide">{card.title}</h3>
                <div className="w-8 h-px bg-[#050A5C]/25 mb-5" />
                <p className="text-sm text-[#6B7280] font-light leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          SECTION 3 — SIGNATURE COLLECTION OVERVIEW
      ─────────────────────────────────────────────────────────────────────── */}
      <section className={`${SECTION_COOL} py-28 md:py-36 px-6 border-t ${SILVER_BORDER}`}>
        <div className="max-w-6xl mx-auto">
          {/* Section heading */}
          <motion.div
            className="mb-16 md:mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.div variants={fadeUp}>
              <SectionLabel>Signature Recovery Collection</SectionLabel>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-4xl font-light text-[#050A5C] tracking-tight max-w-xl leading-snug"
            >
              Signature Recovery Collection
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#6B7280] font-light mt-4 max-w-lg text-base leading-relaxed">
              A complete Korean clinical skincare ritual for recovery, hydration, radiance, and skin barrier support.
            </motion.p>
          </motion.div>

          {/* Featured + Grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Featured card — Luminous Revitalization Sheer Set */}
            <motion.div
              className={`lg:col-span-5 border ${SILVER_BORDER} bg-white p-10 lg:p-12 flex flex-col justify-between min-h-[360px] hover:shadow-md transition-all duration-500`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div>
                <span className="block text-[10px] tracking-[0.25em] uppercase font-semibold text-[#050A5C]/50 mb-6">
                  Featured Set
                </span>
                <h3 className="text-2xl md:text-3xl font-light text-[#050A5C] leading-snug mb-4">
                  Luminous Revitalization Sheer Set
                </h3>
                <div className="w-8 h-px bg-[#050A5C]/25 my-5" />
                <p className="text-sm text-[#6B7280] font-light leading-relaxed mb-6">
                  A complete recovery set designed to support the skin barrier and restore a luminous, balanced appearance.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Exosome', 'Collagen', 'Peptide Complex'].map((ing) => (
                    <span key={ing} className={`text-[10px] tracking-[0.15em] uppercase border ${SILVER_BORDER} px-3 py-1 text-[#050A5C] font-medium`}>
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
              <CosmeticCtaTracker
                label="Explore the Ritual"
                href="/contact?type=cosmetic_interest"
                className="mt-8 w-fit h-[46px] px-8 flex items-center justify-center border border-[#050A5C] text-[#050A5C] text-[11px] tracking-[0.2em] uppercase hover:bg-[#050A5C] hover:text-white transition-colors duration-300"
              />
            </motion.div>

            {/* Supporting products grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { name: 'Regenaglow Nourish Sheer Cream', type: 'Kem dưỡng ẩm', key: 'Collagen · Peptide' },
                { name: 'Calmiance Superior Sheer Gel', type: 'Gel phục hồi', key: 'Cica 7 Complex · Aloe' },
                { name: 'Gentle Activation Renew Ampoule', type: 'Tinh chất tái sinh', key: 'Exosome · Bakuchiol' },
                { name: 'P30 Boost Facial Moisturizer', type: 'Kem dưỡng ẩm', key: 'Hyaluronic Acid · Peptide' },
                { name: 'P30 Boost Facial Hydrating Toner', type: 'Toner cân bằng', key: 'Aloe · Oriental Botanical' },
              ].map((product, i) => (
                <motion.div
                  key={i}
                  className={`border ${SILVER_BORDER} bg-white p-7 hover:border-[#050A5C]/30 hover:shadow-sm transition-all duration-400 group`}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  variants={fadeUp}
                  transition={{ delay: i * 0.06 }}
                >
                  <span className="block text-[9px] tracking-[0.22em] uppercase text-[#050A5C]/40 font-medium mb-3">
                    {product.type}
                  </span>
                  <h4 className="text-sm font-medium text-[#1F2933] leading-snug mb-3 group-hover:text-[#050A5C] transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-[10px] text-[#9CA3AF] tracking-wide">{product.key}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          SECTION 4 — HERO PRODUCT FEATURE
      ─────────────────────────────────────────────────────────────────────── */}
      <section className={`${SECTION_WHITE} py-28 md:py-36 px-6 border-t ${SILVER_BORDER}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            {/* Left: editorial image placeholder */}
            <motion.div
              className={`relative aspect-[3/4] w-full bg-gradient-to-b from-[#E8EDF6] to-[#D9DEE8] border ${SILVER_BORDER} overflow-hidden`}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85 }}
            >
              {/* Decorative inner frame */}
              <div className="absolute inset-4 border border-[#C5CEDF]/60 pointer-events-none" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-16 h-px bg-[#050A5C]/20 mb-8" />
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#050A5C]/40 font-medium">
                  Luminous Sheer Set
                </span>
                <div className="w-16 h-px bg-[#050A5C]/20 mt-8" />
              </div>
              {/* Corner accents */}
              <div className="absolute top-4 left-4 w-6 h-px bg-[#050A5C]/25" />
              <div className="absolute top-4 left-4 w-px h-6 bg-[#050A5C]/25" />
              <div className="absolute bottom-4 right-4 w-6 h-px bg-[#050A5C]/25" />
              <div className="absolute bottom-4 right-4 w-px h-6 bg-[#050A5C]/25" />
            </motion.div>

            {/* Right: product detail */}
            <motion.div
              className="flex flex-col"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
            >
              <motion.div variants={fadeUp}>
                <SectionLabel>Featured Product</SectionLabel>
              </motion.div>
              <motion.h2
                variants={fadeUp}
                className="text-3xl md:text-4xl font-light text-[#050A5C] tracking-tight leading-snug mb-4"
              >
                Luminous Revitalization<br />Sheer Set
              </motion.h2>
              <Divider />
              <motion.p variants={fadeUp} className="text-[#6B7280] font-light text-base leading-relaxed mb-8">
                A complete recovery set designed to support the skin barrier and restore a luminous, balanced appearance through a synergistic blend of clinical actives.
              </motion.p>

              {/* Key ingredients */}
              <motion.div variants={fadeUp} className="mb-8">
                <p className="text-[10px] tracking-[0.22em] uppercase text-[#050A5C]/50 font-semibold mb-4">Key Ingredients</p>
                <div className="flex flex-wrap gap-2">
                  {['Exosome', 'Collagen', 'Peptide Complex'].map((ing) => (
                    <span key={ing} className={`border ${SILVER_BORDER} px-4 py-2 text-[11px] tracking-[0.14em] uppercase text-[#050A5C] font-medium bg-[#F4F7FB]`}>
                      {ing}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Benefits */}
              <motion.div variants={fadeUp} className="mb-10">
                <p className="text-[10px] tracking-[0.22em] uppercase text-[#050A5C]/50 font-semibold mb-4">Benefits</p>
                <div className="space-y-3">
                  {['Skin barrier recovery', 'Moisture protection', 'Luminous radiance glow'].map((b, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-1 h-1 rounded-full bg-[#050A5C]/50 flex-shrink-0" />
                      <span className="text-sm text-[#1F2933] font-light">{b}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeUp}>
                <CosmeticCtaTracker
                  label="Start an Inquiry"
                  href="/contact?type=cosmetic_interest"
                  className="w-full sm:w-auto h-[52px] px-10 flex items-center justify-center bg-[#050A5C] text-white text-[11px] tracking-[0.2em] uppercase hover:bg-[#101A8C] transition-colors shadow-sm"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          SECTION 5 — PRODUCT EDITORIAL CARDS
      ─────────────────────────────────────────────────────────────────────── */}
      <section className={`${SECTION_COOL} py-28 md:py-36 px-6 border-t ${SILVER_BORDER}`}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            <motion.div variants={fadeUp}><SectionLabel>The Collection</SectionLabel></motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-light text-[#050A5C] tracking-tight">
              Clinical Formulas
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={staggerSlow}
          >
            {[
              {
                name: 'Regenaglow Nourish Sheer Cream',
                type: 'Kem dưỡng phục hồi',
                ingredients: 'Collagen · Peptide Complex · Niacinamide',
                benefits: ['Deep nourishment', 'Skin renewal', 'Anti-ageing support'],
                desc: 'A rich yet lightweight cream that deeply nourishes while encouraging cellular renewal for visibly rejuvenated skin.',
              },
              {
                name: 'Calmiance Superior Sheer Gel',
                type: 'Gel phục hồi & làm dịu',
                ingredients: 'Cica 7 Complex · Aloe Extract · Centella',
                benefits: ['Calms sensitivity', 'Barrier repair', 'Hydration lock'],
                desc: 'A soothing gel formulated with a seven-extract Cica complex to calm reactive skin and restore the protective barrier.',
              },
              {
                name: 'Gentle Activation Renew Ampoule',
                type: 'Tinh chất tái sinh chuyên sâu',
                ingredients: 'Exosome · Bakuchiol · Peptide',
                benefits: ['Cell renewal', 'Gentle exfoliation', 'Luminosity boost'],
                desc: 'A next-generation ampoule harnessing Exosome technology and plant-derived Bakuchiol for visible skin renewal without irritation.',
              },
              {
                name: 'P30 Boost Facial Moisturizer',
                type: 'Kem dưỡng ẩm tăng cường',
                ingredients: 'Hyaluronic Acid · Peptide · Ceramide',
                benefits: ['Moisture surge', 'Plumping effect', 'Skin softness'],
                desc: 'A high-performance moisturizer delivering an immediate and sustained surge of hydration for plumper, smoother skin.',
              },
              {
                name: 'P30 Boost Facial Hydrating Toner',
                type: 'Toner cân bằng & hydrate',
                ingredients: 'Aloe · Oriental Botanical Complex · HA',
                benefits: ['pH balancing', 'Prep skin layer', 'Instant refresh'],
                desc: 'A lightweight preparatory toner that balances, hydrates, and primes the skin to maximize subsequent skincare absorption.',
              },
            ].map((product, i) => (
              <motion.article
                key={i}
                variants={fadeUp}
                className={`border ${SILVER_BORDER} bg-white p-8 lg:p-10 flex flex-col hover:border-[#050A5C]/30 hover:shadow-md transition-all duration-500 group`}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.3 }}
              >
                {/* Product type */}
                <span className="block text-[9px] tracking-[0.25em] uppercase text-[#050A5C]/40 font-semibold mb-4">
                  {product.type}
                </span>

                {/* Product name */}
                <h3 className="text-lg font-light text-[#050A5C] leading-snug mb-4 group-hover:text-[#101A8C] transition-colors">
                  {product.name}
                </h3>

                <div className="w-6 h-px bg-[#050A5C]/20 mb-5" />

                {/* Ingredients */}
                <p className="text-[10px] text-[#9CA3AF] tracking-wide mb-5">{product.ingredients}</p>

                {/* Benefit tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {product.benefits.map((b) => (
                    <span key={b} className={`text-[9px] tracking-[0.12em] uppercase border ${SILVER_BORDER} px-2.5 py-1 text-[#050A5C] font-medium bg-[#F4F7FB]`}>
                      {b}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-xs text-[#6B7280] font-light leading-relaxed flex-1">{product.desc}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          SECTION 6 — DAILY CLINICAL RITUAL
      ─────────────────────────────────────────────────────────────────────── */}
      <section className={`${SECTION_WHITE} py-28 md:py-36 px-6 border-t ${SILVER_BORDER}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: Steps */}
            <div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={stagger}
              >
                <motion.div variants={fadeUp}><SectionLabel>Daily Clinical Ritual</SectionLabel></motion.div>
                <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-light text-[#050A5C] tracking-tight mb-12">
                  Daily Clinical Ritual
                </motion.h2>
              </motion.div>

              <div className="space-y-0">
                {[
                  { step: '01', name: 'Cleanse', detail: 'Begin with a gentle clinical cleanser to remove impurities without disrupting the skin microbiome.' },
                  { step: '02', name: 'Hydrating Toner', detail: 'P30 Boost Facial Hydrating Toner — balance pH and prime for maximum absorption.' },
                  { step: '03', name: 'Renew Ampoule', detail: 'Gentle Activation Renew Ampoule — activate cellular renewal and luminosity.' },
                  { step: '04', name: 'Moisturizer / Cream', detail: 'P30 Boost Facial Moisturizer or Regenaglow Nourish Sheer Cream — seal in moisture.' },
                  { step: '05', name: 'Sheer Gel / Recovery Care', detail: 'Calmiance Superior Sheer Gel — calm, protect, and fortify the skin barrier.' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className={`flex gap-6 py-7 border-b ${SILVER_BORDER} group`}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                  >
                    <span className="text-[12px] font-mono font-semibold text-[#050A5C]/30 tracking-widest mt-0.5 w-8 flex-shrink-0">
                      {item.step}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-[#050A5C] mb-1.5 group-hover:text-[#101A8C] transition-colors">
                        {item.name}
                      </p>
                      <p className="text-xs text-[#9CA3AF] font-light leading-relaxed">{item.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Editorial visual panel */}
            <motion.div
              className={`relative hidden lg:block aspect-square bg-gradient-to-br from-[#EBF0F8] via-[#F4F7FB] to-[#D9DEE8] border ${SILVER_BORDER} overflow-hidden`}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
            >
              {/* Decorative elements */}
              <div className="absolute inset-6 border border-[#C5CEDF]/40 pointer-events-none" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-12">
                <div className="w-20 h-px bg-[#050A5C]/15" />
                <div className="text-center space-y-2">
                  <p className="text-[9px] tracking-[0.35em] uppercase text-[#050A5C]/30 font-semibold">Daily Ritual</p>
                  <p className="text-[9px] tracking-[0.35em] uppercase text-[#050A5C]/20">5 Steps</p>
                </div>
                <div className="w-20 h-px bg-[#050A5C]/15" />
              </div>
              {/* Corner marks */}
              <div className="absolute top-6 left-6 w-8 h-px bg-[#050A5C]/20" />
              <div className="absolute top-6 left-6 w-px h-8 bg-[#050A5C]/20" />
              <div className="absolute bottom-6 right-6 w-8 h-px bg-[#050A5C]/20" />
              <div className="absolute bottom-6 right-6 w-px h-8 bg-[#050A5C]/20" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          SECTION 7 — CLINICAL INGREDIENTS
      ─────────────────────────────────────────────────────────────────────── */}
      <section className={`${SECTION_COOL} py-28 md:py-36 px-6 border-t ${SILVER_BORDER}`}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-16 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            <motion.div variants={fadeUp}><SectionLabel>Active Ingredients</SectionLabel></motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-light text-[#050A5C] tracking-tight">
              Clinical Ingredients
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={staggerSlow}
          >
            {[
              { name: 'Exosome', role: 'Cellular regeneration & recovery' },
              { name: 'Collagen', role: 'Skin firmness & elasticity support' },
              { name: 'Peptide Complex', role: 'Anti-ageing signal communication' },
              { name: 'Bakuchiol', role: 'Gentle plant-derived retinol alternative' },
              { name: 'Cica 7 Complex', role: 'Barrier repair & soothing complex' },
              { name: 'Hyaluronic Acid', role: 'Multi-depth moisture binding' },
              { name: 'Aloe Extract', role: 'Calming & instant hydration' },
              { name: 'Oriental Botanicals', role: 'Traditional Korean herbal balance' },
            ].map((ing) => (
              <motion.div
                key={ing.name}
                variants={fadeUp}
                className={`bg-white border ${SILVER_BORDER} p-6 text-center hover:border-[#050A5C]/30 hover:shadow-sm transition-all duration-400 group`}
                whileHover={{ y: -2, scale: 1.02 }}
                transition={{ duration: 0.25 }}
              >
                <div className="w-6 h-px bg-[#050A5C]/20 mx-auto mb-4" />
                <h4 className="text-sm font-medium text-[#050A5C] mb-2 group-hover:text-[#101A8C] transition-colors">
                  {ing.name}
                </h4>
                <p className="text-[10px] text-[#9CA3AF] font-light leading-relaxed">{ing.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          SECTION 8 — PREMIUM PROGRAM / SPA CLINIC
      ─────────────────────────────────────────────────────────────────────── */}
      <section className={`${SECTION_WHITE} py-28 md:py-36 px-6 border-t ${SILVER_BORDER}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Editorial visual */}
            <motion.div
              className={`relative aspect-[4/3] bg-gradient-to-br from-[#E8EDF6] to-[#D9DEE8] border ${SILVER_BORDER} overflow-hidden order-2 lg:order-1`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85 }}
            >
              <div className="absolute inset-5 border border-[#C5CEDF]/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="w-12 h-px bg-[#050A5C]/20 mx-auto" />
                  <p className="text-[9px] tracking-[0.3em] uppercase text-[#050A5C]/30 font-semibold">Spa · Clinic · Home</p>
                  <div className="w-12 h-px bg-[#050A5C]/20 mx-auto" />
                </div>
              </div>
            </motion.div>

            {/* Right: Content */}
            <motion.div
              className="order-1 lg:order-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
            >
              <motion.div variants={fadeUp}><SectionLabel>Premium Program</SectionLabel></motion.div>
              <motion.h2
                variants={fadeUp}
                className="text-3xl md:text-4xl font-light text-[#050A5C] tracking-tight leading-snug mb-4"
              >
                Premium Program
              </motion.h2>
              <Divider />
              <motion.p variants={fadeUp} className="text-[#6B7280] font-light text-base leading-relaxed mb-10">
                A personalized skincare experience designed for spa, clinic, and professional treatment environments — where expertise meets Korean clinical precision.
              </motion.p>

              <motion.div variants={fadeUp} className="space-y-5 mb-10">
                {[
                  { icon: '◆', text: 'Skin recovery ritual tailored to individual skin concerns' },
                  { icon: '◆', text: 'Professional treatment compatibility for spa and clinic use' },
                  { icon: '◆', text: 'Personalized care guidance from certified skincare specialists' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="text-[8px] text-[#050A5C]/30 mt-1.5 flex-shrink-0">{item.icon}</span>
                    <p className="text-sm text-[#1F2933] font-light leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp}>
                <CosmeticCtaTracker
                  label="Start a Consultation"
                  href="/contact?type=cosmetic_interest"
                  className="w-full sm:w-auto h-[52px] px-10 flex items-center justify-center bg-[#050A5C] text-white text-[11px] tracking-[0.2em] uppercase hover:bg-[#101A8C] transition-colors"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          SECTION 9 — EDITORIAL GALLERY (no broken images, no placeholder text)
      ─────────────────────────────────────────────────────────────────────── */}
      <section className={`${SECTION_COOL} py-24 md:py-32 px-6 border-t ${SILVER_BORDER}`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp}><SectionLabel>Visual Harmony</SectionLabel></motion.div>
            <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-light text-[#050A5C] tracking-tight">
              The Ritual Aesthetic
            </motion.h2>
          </motion.div>

          {/* Masonry-style: 2 tall + 4 shorter */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {/* Tall featured left */}
            <motion.div
              className={`col-span-2 md:col-span-1 md:row-span-2 aspect-square md:aspect-auto md:min-h-[480px] bg-gradient-to-b from-[#E1E8F4] to-[#C8D4E8] border ${SILVER_BORDER} overflow-hidden relative group`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(5,10,92,0.04)_0%,transparent_60%)]" />
            </motion.div>

            {[
              'from-[#D9E4F2] to-[#E8EDF6]',
              'from-[#EBF0F8] to-[#D4DCE8]',
              'from-[#E1E8F4] to-[#DDE4F0]',
              'from-[#D9DEE8] to-[#EBF0F8]',
              'from-[#E8EDF6] to-[#D9E4F2]',
            ].map((gradient, i) => (
              <motion.div
                key={i}
                className={`aspect-square bg-gradient-to-br ${gradient} border ${SILVER_BORDER} overflow-hidden relative group`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: (i + 1) * 0.07 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(5,10,92,0.03)_0%,transparent_60%)]" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          SECTION 10 — FINAL CTA
      ─────────────────────────────────────────────────────────────────────── */}
      <section className={`${SECTION_NAVY} py-28 md:py-36 px-6 text-center`}>
        <motion.div
          className="max-w-2xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <SectionLabel>
              <span className="text-white/40">The Premium RAW Skincare System</span>
            </SectionLabel>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-tight leading-tight mb-6"
          >
            Experience the Premium RAW Skincare System
          </motion.h2>
          <Divider />
          <motion.p variants={fadeUp} className="text-white/60 font-light text-base leading-relaxed mb-12">
            Discover a clinical Korean skincare ritual designed for luminous, balanced, resilient skin.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <CosmeticCtaTracker
              label="START AN INQUIRY"
              href="/contact?type=cosmetic_interest"
              className="w-full sm:w-auto h-[54px] px-10 flex items-center justify-center bg-white text-[#050A5C] text-[12px] tracking-[0.2em] uppercase hover:bg-[#F4F7FB] transition-colors shadow-sm"
            />
            <CosmeticCtaTracker
              label="BACK TO ECOSYSTEM"
              href="/"
              className="w-full sm:w-auto h-[54px] px-10 flex items-center justify-center border border-white/25 text-white text-[12px] tracking-[0.2em] uppercase hover:bg-white/10 transition-colors"
            />
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
