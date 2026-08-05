'use client';

import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import type { BusinessEntry } from '@vavaw/brand-config';
import { CosmeticCtaTracker } from './cosmetic-tracker';
import type { PublicHeroMedia } from '@/lib/load-public-hero-media';
import type { CosmeticPageMedia } from '@/lib/load-public-cosmetic-media';
import { 
  FlaskConical, 
  Microscope, 
  Sparkles, 
  Gem, 
  ShieldCheck, 
  BadgeCheck, 
  Leaf, 
  HeartHandshake, 
  Users, 
  BarChart3, 
  Globe, 
  Lightbulb, 
  Droplet, 
  ScanHeart, 
  Atom, 
  WandSparkles 
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  'flask-conical': FlaskConical,
  'microscope': Microscope,
  'sparkles': Sparkles,
  'gem': Gem,
  'shield-check': ShieldCheck,
  'badge-check': BadgeCheck,
  'leaf': Leaf,
  'heart-handshake': HeartHandshake,
  'users': Users,
  'bar-chart-3': BarChart3,
  'globe': Globe,
  'lightbulb': Lightbulb,
  'droplet': Droplet,
  'scan-heart': ScanHeart,
  'atom': Atom,
  'wand-sparkles': WandSparkles
};

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
  cosmeticMedia?: CosmeticPageMedia;
  blocks?: any[];
}

function getBlockContent(blocks: any[] | undefined, type: string, fallback: any = {}): any {
  const hasCmsBlocks = blocks && Array.isArray(blocks) && blocks.length > 0;
  
  if (!hasCmsBlocks) {
    // Total fallback mode: return the full fallback
    return fallback;
  }
  
  const block = blocks.find(b => b.blockType === type || b.content?.sectionKey === type);
  if (!block || !block.content) {
    // Missing block in CMS mode: it's deactivated or deleted. Do not resurrect.
    return null;
  }
  
  // Merge fallback so we always have the expected structure
  return { ...fallback, ...block.content };
}

// ─── Reusable editorial image block ───────────────────────────────────────────
interface EditorialImageProps {
  src?: string;
  alt: string;
  className?: string;
  /** Gradient fallback classes if no image */
  fallbackGradient?: string;
  /** Optional decorative inner frame */
  frame?: boolean;
}

function EditorialImage({
  src,
  alt,
  className = '',
  fallbackGradient = 'from-[#E8EDF6] to-[#D9DEE8]',
  frame = true,
}: EditorialImageProps) {
  const [error, setError] = useState(false);
  const hasImage = src && isValidHeroImageUrl(src) && !error;

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${fallbackGradient} ${className}`}>
      {hasImage ? (
        <img
          src={src!.trim()}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover object-center"
          onError={() => setError(true)}
        />
      ) : frame ? (
        // Elegant framed gradient — no text placeholder
        <>
          <div className="absolute inset-5 border border-[#C5CEDF]/40 pointer-events-none" />
          <div className="absolute top-5 left-5 w-8 h-px bg-[#050A5C]/15" />
          <div className="absolute top-5 left-5 w-px h-8 bg-[#050A5C]/15" />
          <div className="absolute bottom-5 right-5 w-8 h-px bg-[#050A5C]/15" />
          <div className="absolute bottom-5 right-5 w-px h-8 bg-[#050A5C]/15" />
        </>
      ) : null}
    </div>
  );
}

// ─── Product image resolution ──────────────────────────────────────────────────
// Map each slot string to the CosmeticPageMedia camelCase key.
// This mirrors the SLOT_MAP in load-public-cosmetic-media.ts.
const MEDIA_SLOT_TO_KEY: Record<string, keyof CosmeticPageMedia> = {
  'cosmetic-product-luminous-set':       'luminousSet',
  'cosmetic-product-regenaglow-cream':   'regenaglow',
  'cosmetic-product-calmiance-gel':      'calmiance',
  'cosmetic-product-renew-ampoule':      'renewAmpoule',
  'cosmetic-product-p30-moisturizer':    'p30Moisturizer',
  'cosmetic-product-p30-toner':          'p30Toner',
  'cosmetic-product-lumiglow-sunscreen': 'lumiglowSunscreen',
};

function getProductImage(
  productName: string,
  mediaSlot: string | undefined,
  cosmeticMedia: CosmeticPageMedia
): string | undefined {
  // Step 1: resolve by explicit slot → camelCase key
  if (mediaSlot) {
    const key = MEDIA_SLOT_TO_KEY[mediaSlot];
    if (key && cosmeticMedia[key] && isValidHeroImageUrl(cosmeticMedia[key])) {
      return cosmeticMedia[key];
    }
  }
  // Step 2: fallback by product name to camelCase key
  const name = (productName || '').toLowerCase();
  const nameSlot =
    name.includes('regenaglow') ? 'regenaglow' :
    name.includes('calmiance')  ? 'calmiance' :
    name.includes('renew')      ? 'renewAmpoule' :
    (name.includes('p30') && name.includes('moisturizer')) ? 'p30Moisturizer' :
    (name.includes('p30') && name.includes('toner'))       ? 'p30Toner' :
    (name.includes('lumiglow') || name.includes('sunscreen')) ? 'lumiglowSunscreen' :
    name.includes('luminous') ? 'luminousSet' :
    null;
  if (nameSlot) {
    const url = cosmeticMedia[nameSlot as keyof CosmeticPageMedia];
    if (url && isValidHeroImageUrl(url)) return url;
  }
  return undefined;
}

// CTA href safety: only allow internal paths (/) — block js: data: external
function safeCosmeticHref(href: string | undefined): string {
  const fallback = '/contact?type=cosmetic_interest';
  if (!href) return fallback;
  const h = href.trim();
  if (!h.startsWith('/')) return fallback;
  return h;
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

export function CosmeticContent({ entry, heroMedia, cosmeticMedia = {}, blocks = [] }: CosmeticContentProps) {
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

  const brandPhilosophy = getBlockContent(blocks, 'cosmetic-brand-philosophy', {
    title: 'Scientific beauty, refined into a pure Korean skincare ritual.',
    eyebrow: 'The Premium RAW Skincare System',
    description: 'VAVAW is a clinical Korean cosmetic system designed to restore the skin from its origin — pure, balanced, and resilient.',
    items: [
      { num: '01', title: 'Scientific Beauty', desc: 'Clinical skincare system shaped by professional care standards — developed for visible, lasting results.' },
      { num: '02', title: 'Premium Program', desc: 'Personalized skincare experience for modern skin concerns — designed for spa, clinic, and home ritual.' },
      { num: '03', title: 'Functional Cosmetics', desc: 'Korean-developed formulas designed for visible skin recovery, balancing efficacy with elegance.' }
    ]
  });

  const signatureCollection = getBlockContent(blocks, 'cosmetic-signature-collection', {
    eyebrow: 'SIGNATURE RECOVERY COLLECTION',
    title: 'A Complete Recovery System for Modern Skin',
    description: 'A curated Korean clinical skincare ritual designed to hydrate, calm, renew, protect, and restore visible skin balance.',
    featured: {
      name: 'Luminous Revitalization Sheer Set',
      type: 'FEATURED SET',
      description: 'A complete recovery set designed to support the skin barrier and restore a luminous, balanced appearance.',
      ingredients: ['Exosome', 'Collagen', 'Peptide Complex'],
      mediaSlot: 'cosmetic-product-luminous-set',
      ctaLabel: 'Explore the Ritual',
      ctaHref: '/contact?type=cosmetic_interest',
    },
    items: [
      { name: 'Regenaglow Nourish Sheer Cream', type: 'KEM DƯỠNG PHỤC HỒI', key: 'Collagen · Peptide', description: 'Kem dưỡng siêu phục hồi, khóa ẩm sâu và tái tạo cấu trúc hàng rào bảo vệ da.', mediaSlot: 'cosmetic-product-regenaglow-cream' },
      { name: 'Calmiance Superior Sheer Gel', type: 'GEL PHỤC HỒI & LÀM DỊU', key: 'Cica 7 Complex · Aloe', description: 'Gel phục hồi chuyên sâu, làm dịu vùng da nhạy cảm và củng cố hàng rào bảo vệ da.', mediaSlot: 'cosmetic-product-calmiance-gel' },
      { name: 'Gentle Activation Renew Ampoule', type: 'TINH CHẤT TÁI SINH', key: 'Exosome · Bakuchiol', description: 'Tinh chất tái sinh chuyên sâu, kích hoạt quá trình làm mới tế bào da nhẹ nhàng.', mediaSlot: 'cosmetic-product-renew-ampoule' },
      { name: 'P30 Boost Facial Moisturizer', type: 'KEM DƯỠNG ẨM', key: 'Hyaluronic Acid · Peptide', description: 'Kem dưỡng ẩm hiệu suất cao, cấp nước tức thì và duy trì độ ẩm suốt cả ngày.', mediaSlot: 'cosmetic-product-p30-moisturizer' },
      { name: 'P30 Boost Facial Hydrating Toner', type: 'TONER CÂN BẰNG', key: 'Aloe · Oriental Botanical', description: 'Toner cân bằng da nhẹ nhàng, chuẩn bị da tối ưu cho các bước chăm sóc tiếp theo.', mediaSlot: 'cosmetic-product-p30-toner' },
    ]
  });


  const heroProduct = getBlockContent(blocks, 'cosmetic-hero-product', {
    title: 'Luminous Revitalization\nSheer Set',
    eyebrow: 'Featured Product',
    description: 'A complete recovery set designed to support the skin barrier and restore a luminous, balanced appearance through a synergistic blend of clinical actives.',
    ingredients: ['Exosome', 'Collagen', 'Peptide Complex'],
    benefits: ['Skin barrier recovery', 'Moisture protection', 'Luminous radiance glow'],
    ctaLabel: 'Start an Inquiry',
    ctaHref: '/contact?type=cosmetic_interest'
  });

  const productCards = getBlockContent(blocks, 'cosmetic-product-cards', {
    title: 'Clinical Formulas',
    eyebrow: 'The Collection',
    items: [
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
        benefits: ['Moisture surge', "Plumping effect", 'Skin softness'],
        desc: 'A high-performance moisturizer delivering an immediate and sustained surge of hydration for plumper, smoother skin.',
      },
      {
        name: 'P30 Boost Facial Hydrating Toner',
        type: 'Toner cân bằng & hydrate',
        ingredients: 'Aloe · Oriental Botanical Complex · HA',
        benefits: ['pH balancing', 'Prep skin layer', 'Instant refresh'],
        desc: 'A lightweight preparatory toner that balances, hydrates, and primes the skin to maximize subsequent skincare absorption.',
      },
    ]
  });

  const dailyRitual = getBlockContent(blocks, 'cosmetic-daily-ritual', {
    title: 'Daily Clinical Ritual',
    eyebrow: 'Daily Clinical Ritual',
    items: [
      { step: '01', name: 'Cleanse', detail: 'Begin with a gentle clinical cleanser to remove impurities without disrupting the skin microbiome.' },
      { step: '02', name: 'Hydrating Toner', detail: 'P30 Boost Facial Hydrating Toner — balance pH and prime for maximum absorption.' },
      { step: '03', name: 'Renew Ampoule', detail: 'Gentle Activation Renew Ampoule — activate cellular renewal and luminosity.' },
      { step: '04', name: 'Moisturizer / Cream', detail: 'P30 Boost Facial Moisturizer or Regenaglow Nourish Sheer Cream — seal in moisture.' },
      { step: '05', name: 'Sheer Gel / Recovery Care', detail: 'Calmiance Superior Sheer Gel — calm, protect, and fortify the skin barrier.' },
    ]
  });

  const ingredientsBlock = getBlockContent(blocks, 'cosmetic-ingredients', {
    title: 'Clinical Ingredients',
    eyebrow: 'Active Ingredients',
    items: [
      { name: 'Exosome', role: 'Cellular regeneration & recovery' },
      { name: 'Collagen', role: 'Skin firmness & elasticity support' },
      { name: 'Peptide Complex', role: 'Anti-ageing signal communication' },
      { name: 'Bakuchiol', role: 'Gentle plant-derived retinol alternative' },
      { name: 'Cica 7 Complex', role: 'Barrier repair & soothing complex' },
      { name: 'Hyaluronic Acid', role: 'Multi-depth moisture binding' },
      { name: 'Aloe Extract', role: 'Calming & instant hydration' },
      { name: 'Oriental Botanicals', role: 'Traditional Korean herbal balance' },
    ]
  });

  const premiumProgram = getBlockContent(blocks, 'cosmetic-premium-program', {
    title: 'Premium Program',
    eyebrow: 'Premium Program',
    description: 'A personalized skincare experience designed for spa, clinic, and professional treatment environments — where expertise meets Korean clinical precision.',
    items: [
      { icon: '◆', text: 'Skin recovery ritual tailored to individual skin concerns' },
      { icon: '◆', text: 'Professional treatment compatibility for spa and clinic use' },
      { icon: '◆', text: 'Personalized care guidance from certified skincare specialists' },
    ],
    ctaLabel: 'Start a Consultation',
    ctaHref: '/contact?type=cosmetic_interest'
  });

  const editorialGallery = getBlockContent(blocks, 'cosmetic-editorial-gallery', {
    title: 'The Ritual Aesthetic',
    eyebrow: 'Visual Harmony'
  });

  const finalCta = getBlockContent(blocks, 'cosmetic-final-cta', {
    title: 'Premium RAW Skincare System',
    eyebrow: 'VAVAW Cosmetic',
    ctaLabel: 'Start an Inquiry',
    ctaHref: '/contact?type=cosmetic_interest'
  });

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
      {brandPhilosophy && (
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
              <SectionLabel>{brandPhilosophy.eyebrow}</SectionLabel>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-[#050A5C] mb-4 leading-tight"
            >
              {brandPhilosophy.title}
            </motion.h2>
            {brandPhilosophy.subtitle && (
              <motion.p
                variants={fadeUp}
                className="text-slate-400 text-sm md:text-base font-normal tracking-wide mb-6 max-w-xl mx-auto"
              >
                {brandPhilosophy.subtitle}
              </motion.p>
            )}
            <Divider />
            <motion.p variants={fadeUp} className="text-[#6B7280] text-base md:text-lg font-light leading-relaxed whitespace-pre-wrap">
              {brandPhilosophy.description}
            </motion.p>
          </motion.div>

          {/* Philosophy cards grid */}
          <motion.div
            className={`grid grid-cols-1 gap-6 lg:gap-8 ${
              (brandPhilosophy.items || []).length === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'
            }`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            {(brandPhilosophy.items || []).map((card: any, idx: number) => {
              const cardNum = card.number || card.num || `0${idx + 1}`;
              const cardTitle = card.title || '';
              const cardDesc = card.description || card.desc || '';
              const cardIcon = card.icon || 'sparkles';
              const IconComponent = ICON_MAP[cardIcon] || Sparkles;

              return (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  className="group border border-[#D9DEE8] bg-white p-10 lg:p-12 transition-all duration-500 shadow-sm hover:shadow-lg hover:border-[#050A5C]/30 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-[#F4F7FB] text-[#050A5C] rounded-xl flex items-center justify-center transition-colors duration-300 group-hover:bg-[#050A5C] group-hover:text-white">
                        <IconComponent className="h-6 w-6 stroke-[1.2]" />
                      </div>
                      <span className="text-[11px] font-semibold tracking-[0.25em] text-[#050A5C]/30 font-mono">
                        {cardNum}
                      </span>
                    </div>
                    <h3 className="text-xl font-light text-[#050A5C] mb-4 tracking-wide group-hover:text-[#101A8C] transition-colors duration-300">{cardTitle}</h3>
                    <div className="w-8 h-px bg-[#050A5C]/25 mb-5" />
                    <p className="text-sm text-[#6B7280] font-light leading-relaxed">{cardDesc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
      )}

      {/* ───────────────────────────────────────────────────────────────────────
          SECTION 3 — SIGNATURE RECOVERY SYSTEM (PREMIUM EDITORIAL)
      ─────────────────────────────────────────────────────────────────────── */}
      {signatureCollection && (() => {
        // ── Data resolution ────────────────────────────────────────────────
        const feat = signatureCollection.featured || signatureCollection.featuredProduct || {};
        const featName = feat.name || 'Luminous Revitalization Sheer Set';
        const featType = feat.type || 'FEATURED SET';
        const featDesc = feat.description || '';
        const featIngredients: string[] = Array.isArray(feat.ingredients) ? feat.ingredients : [];
        const featImg = getProductImage(featName, feat.mediaSlot, cosmeticMedia);
        const featCta = safeCosmeticHref(feat.ctaHref || signatureCollection.ctaHref);
        const featCtaLabel = feat.ctaLabel || signatureCollection.ctaLabel || 'Explore the Ritual';

        const sectionEyebrow = signatureCollection.eyebrow || 'SIGNATURE RECOVERY SYSTEM';
        const sectionTitle = signatureCollection.title || 'The complete skin\nrecovery ritual.';
        const sectionDesc = signatureCollection.description || 'A complete Korean clinical skincare ritual designed to cleanse, prepare, treat, seal, and protect the skin.';

        const clinicalInsight = 'Skin recovery is not a single step, but a systematic process. Each formula works in harmony with the skin\'s natural cycle — strengthening the barrier, restoring balance, and supporting long-term resilience.';

        const rawItems: any[] = signatureCollection.items || [];

        // Infer ritual role from product name if item.role or item.step missing
        function inferRole(item: any): string {
          if (item.role) return item.role;
          const n = (item.name || '').toLowerCase();
          if (n.includes('toner')) return 'PREPARE';
          if (n.includes('ampoule')) return 'TREAT';
          if (n.includes('gel')) return 'RECOVER';
          if (n.includes('moisturizer')) return 'SEAL';
          if (n.includes('cream')) return 'NOURISH';
          if (n.includes('lumiglow') || n.includes('sunscreen')) return 'PROTECT';
          if (n.includes('cleanser')) return 'CLEANSE';
          return 'CARE';
        }

        function inferUsage(item: any): string | null {
          if (item.usage) return item.usage;
          const n = (item.name || '').toLowerCase();
          if (n.includes('toner')) return 'AM · PM';
          if (n.includes('ampoule')) return 'PM';
          if (n.includes('moisturizer') || n.includes('cream') || n.includes('gel')) return 'AM · PM';
          if (n.includes('lumiglow') || n.includes('sunscreen')) return 'AM';
          return null;
        }

        const stationItems = rawItems.map((item, i) => ({
          ...item,
          _step: item.step || String(i + 1).padStart(2, '0'),
          _role: inferRole(item),
          _usage: inferUsage(item),
          _isCore: !!(item.highlight) || (item.name || '').toLowerCase().includes('ampoule'),
          _img: getProductImage(item.name || '', item.mediaSlot, cosmeticMedia),
          _desc: item.description || item.desc || '',
        }));

        // System trust badges (static — premium branding row)
        const trustBadges = [
          { icon: FlaskConical, title: 'Clinically Developed', text: 'Formulas engineered for visible skin recovery and resilience.' },
          { icon: ShieldCheck, title: 'Skin Barrier Expert', text: 'Every product supports and strengthens the skin\'s natural defence.' },
          { icon: Atom, title: 'High Performance Actives', text: 'Exosome, peptide, and botanical clinicals at effective concentrations.' },
          { icon: Droplet, title: 'Balanced Formulation', text: 'Layerable and compatible — designed to work as a complete system.' },
        ];

        return (
          <section
            aria-label="Signature Recovery Ritual System"
            className="relative py-24 md:py-36 px-6 overflow-hidden border-t border-[#D9DEE8]"
            style={{ background: 'linear-gradient(160deg, #FFFFFF 0%, #F2F5FA 55%, #ECF0F8 100%)' }}
          >
            {/* Radial icy-blue glow top-right */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 right-0 w-[600px] h-[500px] opacity-[0.07]"
              style={{ background: 'radial-gradient(ellipse at top right, #A8C0E8 0%, transparent 70%)' }}
            />

            <div className="max-w-7xl mx-auto relative">

              {/* ── EDITORIAL HEADER ── */}
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-20 md:mb-28"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={stagger}
              >
                {/* Left — large serif headline */}
                <div className="lg:col-span-7">
                  <motion.span
                    variants={fadeUp}
                    className="inline-block text-[10px] tracking-[0.38em] uppercase font-semibold text-[#050A5C]/60 mb-6"
                  >
                    {sectionEyebrow}
                  </motion.span>

                  <motion.h2
                    variants={fadeUp}
                    className="font-serif font-light leading-[0.92] text-[#050A5C] mb-8"
                    style={{
                      fontSize: 'clamp(3rem, 8vw, 6rem)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {sectionTitle.split('\n').map((line: string, i: number) => (
                      <span key={i} className="block">{line}</span>
                    ))}
                  </motion.h2>

                  <motion.div variants={fadeUp} className="w-12 h-px bg-[#050A5C]/25 mb-6" />

                  <motion.p
                    variants={fadeUp}
                    className="text-[#5A6374] font-light text-base md:text-lg leading-relaxed max-w-lg"
                  >
                    {sectionDesc}
                  </motion.p>

                  {/* Featured set CTA */}
                  <motion.div variants={fadeUp} className="mt-10">
                    <CosmeticCtaTracker
                      label={featCtaLabel}
                      href={featCta}
                      className="inline-flex h-[46px] px-9 items-center justify-center border border-[#050A5C] text-[#050A5C] text-[11px] tracking-[0.22em] uppercase hover:bg-[#050A5C] hover:text-white transition-colors duration-300"
                    />
                  </motion.div>
                </div>

                {/* Right — Clinical Insight panel */}
                <motion.div
                  variants={fadeUp}
                  className="lg:col-span-5 flex items-start"
                >
                  <div className="w-px self-stretch bg-[#C5CEDF]/60 mr-8 hidden lg:block shrink-0" aria-hidden="true" />
                  <div className="pt-2 lg:pt-12">
                    <span className="block text-[9px] tracking-[0.35em] uppercase text-[#050A5C]/40 font-semibold mb-4">
                      Clinical Insight
                    </span>
                    <p className="text-[#3D4A5C] text-sm leading-[1.9] font-light">
                      {clinicalInsight}
                    </p>

                    {/* Featured set image */}
                    {(featImg || true) && (
                      <div className="mt-8 relative aspect-[3/4] max-w-[200px] bg-[#F3F6FC] border border-[#D9DEE8] overflow-hidden flex items-center justify-center p-4">
                        {featImg ? (
                          <img
                            src={featImg}
                            alt={featName}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = 'none';
                              (e.currentTarget.parentElement as HTMLElement).style.background = 'linear-gradient(135deg, #EEF2F8, #DDE3EE)';
                            }}
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-[#EEF2F8] to-[#DDE3EE]">
                            <div className="absolute inset-4 border border-[#C5CEDF]/30" />
                          </div>
                        )}
                        {/* Featured label */}
                        <div className="absolute bottom-0 left-0 right-0 bg-[#050A5C]/90 px-3 py-2">
                          <span className="text-[8px] tracking-[0.3em] uppercase text-white/80 block">{featType}</span>
                          <span className="text-[10px] text-white font-light leading-tight block mt-0.5">{featName}</span>
                        </div>
                      </div>
                    )}
                    {featIngredients.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {featIngredients.map((ing: string) => (
                          <span key={ing} className="text-[9px] tracking-[0.15em] uppercase border border-[#D9DEE8] px-2.5 py-1 text-[#050A5C]/70 font-medium">
                            {ing}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>

              {/* ── PRODUCT RITUAL SYSTEM MAP ── */}
              {stationItems.length > 0 && (
                <>
                  {/* Section divider with title */}
                  <motion.div
                    className="flex items-center gap-4 mb-12 md:mb-16"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                  >
                    <div className="h-px flex-1 bg-[#D9DEE8]" />
                    <span className="text-[9px] tracking-[0.35em] uppercase text-[#050A5C]/40 font-semibold whitespace-nowrap px-2">
                      Recovery Ritual · {stationItems.length} Steps
                    </span>
                    <div className="h-px flex-1 bg-[#D9DEE8]" />
                  </motion.div>

                  {/* Desktop: horizontal ritual stations */}
                  <div className="hidden md:grid gap-0" style={{ gridTemplateColumns: `repeat(${Math.min(stationItems.length, 6)}, 1fr)` }}>
                    {stationItems.slice(0, 6).map((station, i) => (
                      <motion.div
                        key={i}
                        className={`group relative flex flex-col border-r last:border-r-0 border-[#D9DEE8]
                          transition-all duration-500 ease-out
                          ${station._isCore ? 'bg-[#F0F4FB]' : 'bg-white/60 hover:bg-white/90'}
                          motion-reduce:hover:transform-none`}
                        style={{ backdropFilter: 'blur(4px)' }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-30px' }}
                        transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
                        whileHover={{ y: -2 }}
                      >
                        {/* Core treatment highlight accent */}
                        {station._isCore && (
                          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#050A5C]/40" />
                        )}

                        <div className="p-5 xl:p-6 flex flex-col flex-1">
                          {/* Step number */}
                          <div className="flex items-end justify-between mb-4">
                            <span
                              className="font-serif font-light text-[#050A5C]/10 leading-none select-none"
                              style={{ fontSize: 'clamp(3.5rem, 6vw, 5.5rem)', lineHeight: 1 }}
                              aria-hidden="true"
                            >
                              {station._step}
                            </span>
                            {station._usage && (
                              <span className="text-[8px] tracking-[0.2em] uppercase text-[#050A5C]/35 font-medium mb-1">
                                {station._usage}
                              </span>
                            )}
                          </div>

                          {/* Role label */}
                          <div className="flex items-center gap-2 mb-4">
                            <div className={`w-3 h-px ${station._isCore ? 'bg-[#050A5C]/60' : 'bg-[#050A5C]/25'}`} />
                            <span className={`text-[9px] tracking-[0.32em] uppercase font-semibold ${station._isCore ? 'text-[#050A5C]/70' : 'text-[#050A5C]/40'}`}>
                              {station._role}
                            </span>
                            {station._isCore && (
                              <span className="text-[7px] tracking-[0.2em] uppercase text-white bg-[#050A5C]/70 px-1.5 py-0.5 ml-1">
                                CORE
                              </span>
                            )}
                          </div>

                          {/* Product packshot */}
                          <div
                            className={`relative mb-4 mx-auto w-full bg-[#F7F9FC] flex items-center justify-center overflow-hidden
                              ${station._isCore ? 'border border-[#050A5C]/15 ring-1 ring-[#050A5C]/8' : 'border border-[#E8EDF6]'}`}
                            style={{ aspectRatio: '3/4', maxHeight: '180px' }}
                          >
                            {station._img ? (
                              <img
                                src={station._img}
                                alt={station.name || ''}
                                className="w-full h-full object-contain p-3"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                                  (e.currentTarget.parentElement as HTMLElement).style.background = 'linear-gradient(135deg, #EEF2F8, #DDE3EE)';
                                }}
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-[#EEF2F8] to-[#DDE3EE]">
                                <div className="absolute inset-3 border border-[#C5CEDF]/25" />
                              </div>
                            )}
                          </div>

                          {/* Product name */}
                          <h3 className="text-[11px] font-medium text-[#1F2933] leading-snug mb-2 group-hover:text-[#050A5C] transition-colors duration-300 line-clamp-2">
                            {station.name}
                          </h3>

                          {/* Key ingredient */}
                          {station.key && (
                            <p className="text-[9px] text-[#9CA3AF] tracking-[0.12em] uppercase mb-2">{station.key}</p>
                          )}

                          {/* Description */}
                          {station._desc && (
                            <p className="text-[10px] text-[#6B7280] font-light leading-relaxed line-clamp-3 mt-auto pt-2">
                              {station._desc}
                            </p>
                          )}
                        </div>

                        {/* Bottom connector line — ritual sequence */}
                        {i < stationItems.length - 1 && (
                          <div aria-hidden="true" className="absolute -right-px top-1/4 h-px w-3 bg-[#C5CEDF]/60 hidden" />
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Mobile: vertical ritual cards */}
                  <div className="md:hidden space-y-4">
                    {stationItems.map((station, i) => (
                      <motion.div
                        key={i}
                        className={`relative flex gap-5 border border-[#D9DEE8] p-5
                          ${station._isCore ? 'bg-[#F0F4FB]' : 'bg-white/80'}`}
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-20px' }}
                        transition={{ duration: 0.5, delay: i * 0.06 }}
                      >
                        {station._isCore && (
                          <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-[#050A5C]/40" />
                        )}

                        {/* Image */}
                        <div className="w-20 h-24 bg-[#F7F9FC] border border-[#E8EDF6] flex items-center justify-center shrink-0 overflow-hidden">
                          {station._img ? (
                            <img
                              src={station._img}
                              alt={station.name || ''}
                              className="w-full h-full object-contain p-2"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                                (e.currentTarget.parentElement as HTMLElement).style.background = 'linear-gradient(135deg, #EEF2F8, #DDE3EE)';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#EEF2F8] to-[#DDE3EE]" />
                          )}
                        </div>

                        <div className="flex flex-col flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-serif font-light text-[#050A5C]/15 text-2xl leading-none">{station._step}</span>
                            <span className="text-[8px] tracking-[0.28em] uppercase text-[#050A5C]/45 font-semibold">{station._role}</span>
                            {station._isCore && (
                              <span className="text-[6px] tracking-[0.2em] uppercase text-white bg-[#050A5C]/70 px-1 py-0.5">CORE</span>
                            )}
                          </div>
                          <h3 className="text-sm font-medium text-[#1F2933] leading-snug mb-1">{station.name}</h3>
                          {station.key && <p className="text-[9px] text-[#9CA3AF] tracking-wide uppercase mb-1">{station.key}</p>}
                          {station._usage && <p className="text-[9px] text-[#050A5C]/35 tracking-[0.15em] uppercase">{station._usage}</p>}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}

              {/* ── SYSTEM TRUST BADGES ── */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-0 mt-16 md:mt-24 border-t border-[#D9DEE8]"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
              >
                {trustBadges.map((badge, i) => {
                  const Icon = badge.icon;
                  return (
                    <motion.div
                      key={i}
                      variants={fadeUp}
                      className="border-r last:border-r-0 border-b md:border-b-0 border-[#D9DEE8] p-6 xl:p-8 flex flex-col gap-3"
                    >
                      <div className="w-7 h-7 flex items-center justify-center">
                        <Icon className="w-[18px] h-[18px] text-[#050A5C]/50" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-[#1F2933] tracking-wide mb-1">{badge.title}</p>
                        <p className="text-[10px] text-[#6B7280] font-light leading-relaxed">{badge.text}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

            </div>
          </section>
        );
      })()}



      {/* ───────────────────────────────────────────────────────────────────────
          SECTION 4 — HERO PRODUCT FEATURE
      ─────────────────────────────────────────────────────────────────────── */}
      {heroProduct && (
      <section className={`${SECTION_WHITE} py-28 md:py-36 px-6 border-t ${SILVER_BORDER}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            {/* Left: Luminous Set image / framed gradient */}
            <motion.div
              className={`relative aspect-[3/4] w-full border ${SILVER_BORDER} overflow-hidden`}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85 }}
            >
              <EditorialImage
                src={cosmeticMedia.luminousSet}
                alt="VAVAW Luminous Revitalization Sheer Set"
                className="absolute inset-0 w-full h-full"
                fallbackGradient="from-[#E8EDF6] to-[#D9DEE8]"
                frame
              />
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
                <SectionLabel>{heroProduct.eyebrow}</SectionLabel>
              </motion.div>
              <motion.h2
                variants={fadeUp}
                className="text-3xl md:text-4xl font-light text-[#050A5C] tracking-tight leading-snug mb-4 whitespace-pre-line"
              >
                {heroProduct.title}
              </motion.h2>
              <Divider />
              <motion.p variants={fadeUp} className="text-[#6B7280] font-light text-base leading-relaxed mb-8">
                {heroProduct.description}
              </motion.p>

              {/* Key ingredients */}
              <motion.div variants={fadeUp} className="mb-8">
                <p className="text-[10px] tracking-[0.22em] uppercase text-[#050A5C]/50 font-semibold mb-4">Key Ingredients</p>
                <div className="flex flex-wrap gap-2">
                  {(heroProduct.ingredients || []).map((ing: string) => (
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
                  {(heroProduct.benefits || []).map((b: string, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-1 h-1 rounded-full bg-[#050A5C]/50 flex-shrink-0" />
                      <span className="text-sm text-[#1F2933] font-light">{b}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeUp}>
                <CosmeticCtaTracker
                  label={heroProduct.ctaLabel || "Start an Inquiry"}
                  href={heroProduct.ctaHref || "/contact"}
                  className="w-full sm:w-auto h-[52px] px-10 flex items-center justify-center bg-[#050A5C] text-white text-[11px] tracking-[0.2em] uppercase hover:bg-[#101A8C] transition-colors shadow-sm"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      )}

      {/* ───────────────────────────────────────────────────────────────────────
          SECTION 5 — PRODUCT EDITORIAL CARDS
      ─────────────────────────────────────────────────────────────────────── */}
      {productCards && (
      <section className={`${SECTION_COOL} py-28 md:py-36 px-6 border-t ${SILVER_BORDER}`}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            <motion.div variants={fadeUp}><SectionLabel>{productCards.eyebrow}</SectionLabel></motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-light text-[#050A5C] tracking-tight">
              {productCards.title}
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={staggerSlow}
          >
            {(productCards.items || []).map((product: any, i: number) => {
              // Get product image URL
              let imageUrl: string | undefined = undefined;
              if (product.mediaSlot) {
                const slotKeyMap: Record<string, keyof CosmeticPageMedia> = {
                  'cosmetic-product-luminous-set':     'luminousSet',
                  'cosmetic-product-regenaglow-cream': 'regenaglow',
                  'cosmetic-product-calmiance-gel':    'calmiance',
                  'cosmetic-product-renew-ampoule':    'renewAmpoule',
                  'cosmetic-product-p30-moisturizer':  'p30Moisturizer',
                  'cosmetic-product-p30-toner':        'p30Toner',
                  'cosmetic-product-lumiglow-sunscreen': 'lumiglowSunscreen',
                };
                const key = slotKeyMap[product.mediaSlot] || product.mediaSlot as keyof CosmeticPageMedia;
                imageUrl = cosmeticMedia[key];
              }

              // Fallback if missing
              if (!imageUrl && product.name) {
                const name = product.name;
                if (name.includes('Regenaglow')) imageUrl = cosmeticMedia.regenaglow;
                else if (name.includes('Calmiance')) imageUrl = cosmeticMedia.calmiance;
                else if (name.includes('Renew Ampoule')) imageUrl = cosmeticMedia.renewAmpoule;
                else if (name.includes('Moisturizer')) imageUrl = cosmeticMedia.p30Moisturizer;
                else if (name.includes('Toner')) imageUrl = cosmeticMedia.p30Toner;
                else if (name.includes('Sunscreen')) imageUrl = cosmeticMedia.lumiglowSunscreen;
              }

              const hasImage = imageUrl && isValidHeroImageUrl(imageUrl);

              return (
                <motion.article
                  key={i}
                  variants={fadeUp}
                  className={`border ${SILVER_BORDER} bg-white flex flex-col hover:border-[#050A5C]/30 hover:shadow-md transition-all duration-500 group overflow-hidden`}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Top Image / Gradient Fallback */}
                  <div className="relative w-full h-56 border-b border-[#D9DEE8] bg-[#F7F9FC] overflow-hidden flex items-center justify-center">
                    {hasImage ? (
                      <img
                        src={imageUrl!.trim()}
                        alt={product.name}
                        className="h-full w-full object-contain bg-[#F7F9FC]"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#E8EDF6] to-[#D9DEE8] flex items-center justify-center">
                        <div className="absolute inset-4 border border-[#C5CEDF]/30 pointer-events-none" />
                      </div>
                    )}
                  </div>

                  {/* Text content */}
                  <div className="p-8 flex-1 flex flex-col">
                    {/* Product type */}
                    <span className="block text-[9px] tracking-[0.25em] uppercase text-[#050A5C]/40 font-semibold mb-4">
                      {product.type}
                    </span>

                    {/* Product name */}
                    <h3 className="text-lg font-light text-[#050A5C] leading-snug mb-2 group-hover:text-[#101A8C] transition-colors">
                      {product.name}
                    </h3>

                    {/* Price and Volume if present */}
                    {(product.price || product.volume) && (
                      <p className="text-[10px] text-slate-400 font-semibold tracking-wider mb-2">
                        {product.price}{product.volume ? ` | ${product.volume}` : ''}
                      </p>
                    )}

                    <div className="w-6 h-px bg-[#050A5C]/20 mb-4" />

                    {/* Ingredients */}
                    <p className="text-[10px] text-[#9CA3AF] tracking-wide mb-5">{product.ingredients}</p>

                    {/* Benefit tags */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {(product.benefits || []).map((b: string) => (
                        <span key={b} className={`text-[9px] tracking-[0.12em] uppercase border ${SILVER_BORDER} px-2.5 py-1 text-[#050A5C] font-medium bg-[#F4F7FB]`}>
                          {b}
                        </span>
                      ))}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[#6B7280] font-light leading-relaxed flex-1">{product.desc}</p>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>
      )}

      {/* ───────────────────────────────────────────────────────────────────────
          SECTION 6 — DAILY CLINICAL RITUAL
      ─────────────────────────────────────────────────────────────────────── */}
      {dailyRitual && (
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
                <motion.div variants={fadeUp}><SectionLabel>{dailyRitual.eyebrow}</SectionLabel></motion.div>
                <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-light text-[#050A5C] tracking-tight mb-12">
                  {dailyRitual.title}
                </motion.h2>
              </motion.div>

              <div className="space-y-0">
                {(dailyRitual.items || []).map((item: any, i: number) => (
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

            {/* Right: Ritual panel image / framed gradient */}
            <motion.div
              className={`relative hidden lg:block aspect-square border ${SILVER_BORDER} overflow-hidden`}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
            >
              <EditorialImage
                src={cosmeticMedia.ritualPanel}
                alt="VAVAW clinical skincare ritual"
                className="absolute inset-0 w-full h-full"
                fallbackGradient="from-[#EBF0F8] via-[#F4F7FB] to-[#D9DEE8]"
                frame
              />
            </motion.div>
          </div>
        </div>
      </section>
      )}

      {/* ───────────────────────────────────────────────────────────────────────
          SECTION 7 — CLINICAL INGREDIENTS
      ─────────────────────────────────────────────────────────────────────── */}
      {ingredientsBlock && (
      <section className={`${SECTION_COOL} py-28 md:py-36 px-6 border-t ${SILVER_BORDER}`}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-16 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            <motion.div variants={fadeUp}><SectionLabel>{ingredientsBlock.eyebrow}</SectionLabel></motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-light text-[#050A5C] tracking-tight">
              {ingredientsBlock.title}
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={staggerSlow}
          >
            {(ingredientsBlock.items || []).map((ing: any) => (
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
      )}

      {/* ───────────────────────────────────────────────────────────────────────
          SECTION 8 — PREMIUM PROGRAM / SPA CLINIC
      ─────────────────────────────────────────────────────────────────────── */}
      {premiumProgram && (
      <section className={`${SECTION_WHITE} py-28 md:py-36 px-6 border-t ${SILVER_BORDER}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Premium program image / framed gradient */}
            <motion.div
              className={`relative aspect-[4/3] border ${SILVER_BORDER} overflow-hidden order-2 lg:order-1`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85 }}
            >
              <EditorialImage
                src={cosmeticMedia.premiumProgram}
                alt="VAVAW premium skincare program — spa and clinic"
                className="absolute inset-0 w-full h-full"
                fallbackGradient="from-[#E8EDF6] to-[#D9DEE8]"
                frame
              />
            </motion.div>

            {/* Right: Content */}
            <motion.div
              className="order-1 lg:order-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
            >
              <motion.div variants={fadeUp}><SectionLabel>{premiumProgram.eyebrow}</SectionLabel></motion.div>
              <motion.h2
                variants={fadeUp}
                className="text-3xl md:text-4xl font-light text-[#050A5C] tracking-tight leading-snug mb-4 whitespace-pre-wrap"
              >
                {premiumProgram.title}
              </motion.h2>
              <Divider />
              <motion.p variants={fadeUp} className="text-[#6B7280] font-light text-base leading-relaxed mb-10 whitespace-pre-wrap">
                {premiumProgram.description}
              </motion.p>

              <motion.div variants={fadeUp} className="space-y-5 mb-10">
                {(premiumProgram.items || []).map((item: any, i: number) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="text-[8px] text-[#050A5C]/30 mt-1.5 flex-shrink-0">{item.icon}</span>
                    <p className="text-sm text-[#1F2933] font-light leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp}>
                <CosmeticCtaTracker
                  label={premiumProgram.ctaLabel || "Start a Consultation"}
                  href={premiumProgram.ctaHref || "/contact?type=cosmetic_interest"}
                  className="w-full sm:w-auto h-[52px] px-10 flex items-center justify-center bg-[#050A5C] text-white text-[11px] tracking-[0.2em] uppercase hover:bg-[#101A8C] transition-colors"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      )}

      {/* ───────────────────────────────────────────────────────────────────────
          SECTION 9 — EDITORIAL GALLERY (no broken images, no placeholder text)
      ─────────────────────────────────────────────────────────────────────── */}
      {editorialGallery && (
      <section className={`${SECTION_COOL} py-24 md:py-32 px-6 border-t ${SILVER_BORDER}`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp}><SectionLabel>{editorialGallery.eyebrow}</SectionLabel></motion.div>
            <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-light text-[#050A5C] tracking-tight">
              {editorialGallery.title}
            </motion.h2>
          </motion.div>

          {/* Gallery: tall featured + 5 supporting — real images or gradients */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {/* Tall featured — galleryProductSet */}
            <motion.div
              className={`col-span-2 md:col-span-1 md:row-span-2 aspect-square md:aspect-auto md:min-h-[480px] border ${SILVER_BORDER} overflow-hidden relative group`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75 }}
              whileHover={{ scale: 1.02 }}
            >
              <EditorialImage
                src={cosmeticMedia.galleryProductSet}
                alt="VAVAW Cosmetic product set"
                className="absolute inset-0 w-full h-full"
                fallbackGradient="from-[#E1E8F4] to-[#C8D4E8]"
                frame={false}
              />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(5,10,92,0.04)_0%,transparent_60%)] pointer-events-none" />
            </motion.div>

            {([
              { key: 'galleryTexture',   alt: 'VAVAW cosmetic texture and formula', gradient: 'from-[#D9E4F2] to-[#E8EDF6]' },
              { key: 'galleryClinic',    alt: 'VAVAW clinical skincare treatment',   gradient: 'from-[#EBF0F8] to-[#D4DCE8]' },
              { key: 'galleryPackaging', alt: 'VAVAW product packaging editorial',   gradient: 'from-[#E1E8F4] to-[#DDE4F0]' },
              { key: 'gallerySkin',      alt: 'VAVAW luminous skin result',          gradient: 'from-[#D9DEE8] to-[#EBF0F8]' },
              { key: 'gallerySerum',     alt: 'VAVAW renew ampoule serum',           gradient: 'from-[#E8EDF6] to-[#D9E4F2]' },
            ] as { key: keyof CosmeticPageMedia; alt: string; gradient: string }[]).map((item, i) => (
              <motion.div
                key={i}
                className={`aspect-square border ${SILVER_BORDER} overflow-hidden relative group`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: (i + 1) * 0.07 }}
                whileHover={{ scale: 1.02 }}
              >
                <EditorialImage
                  src={cosmeticMedia[item.key]}
                  alt={item.alt}
                  className="absolute inset-0 w-full h-full"
                  fallbackGradient={item.gradient}
                  frame={false}
                />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(5,10,92,0.03)_0%,transparent_60%)] pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ───────────────────────────────────────────────────────────────────────
          SECTION 10 — FINAL CTA
      ─────────────────────────────────────────────────────────────────────── */}
      {finalCta && (
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
              <span className="text-white/40">{finalCta.eyebrow}</span>
            </SectionLabel>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-tight leading-tight mb-6 whitespace-pre-wrap"
          >
            {finalCta.title}
          </motion.h2>
          <Divider />
          <motion.p variants={fadeUp} className="text-white/60 font-light text-base leading-relaxed mb-12 whitespace-pre-wrap">
            {finalCta.description || 'Discover a clinical Korean skincare ritual designed for luminous, balanced, resilient skin.'}
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <CosmeticCtaTracker
              label={finalCta.ctaLabel || "START AN INQUIRY"}
              href={finalCta.ctaHref || "/contact?type=cosmetic_interest"}
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
      )}
    </div>
  );
}
