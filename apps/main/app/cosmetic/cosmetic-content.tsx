'use client';

import { useState } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import type { BusinessEntry } from '@vavaw/brand-config';
import { CosmeticCtaTracker } from './cosmetic-tracker';
import type { PublicHeroMedia } from '@/lib/load-public-hero-media';
import type { CosmeticPageMedia } from '@/lib/load-public-cosmetic-media';
import { ClinicalFormulaLab } from './components/ClinicalFormulaLab';
import { SkinRitualFinder } from './components/SkinRitualFinder';
import IngredientIntelligenceMap from './components/IngredientIntelligenceMap';
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
  WandSparkles,
  CheckCircle
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
// Map each canonical slot string → CosmeticPageMedia camelCase key.
// This mirrors the SLOT_MAP in load-public-cosmetic-media.ts.
const MEDIA_SLOT_TO_KEY: Record<string, keyof CosmeticPageMedia> = {
  'cosmetic-product-luminous-set':       'luminousSet',
  'cosmetic-product-regenaglow-cream':   'regenaglow',
  'cosmetic-product-calmiance-gel':      'calmiance',
  'cosmetic-product-renew-ampoule':      'renewAmpoule',
  'cosmetic-product-p30-moisturizer':    'p30Moisturizer',
  'cosmetic-product-p30-toner':          'p30Toner',
  'cosmetic-product-lumiglow-sunscreen': 'lumiglowSunscreen',
  'cosmetic-set-cellurevive-ampoule':    'setCellureviveAmpoule',
  'cosmetic-set-regenaglow-sheer-cream': 'setRegenaglowSheerCream',
};

// Legacy / short alias map — handles DB data not yet migrated to canonical keys.
const SLOT_ALIAS_TO_CANONICAL: Record<string, string> = {
  'luminous-set':        'cosmetic-product-luminous-set',
  'luminous':            'cosmetic-product-luminous-set',
  'featured-set':        'cosmetic-product-luminous-set',
  'regenaglow-cream':    'cosmetic-product-regenaglow-cream',
  'regenaglow':          'cosmetic-product-regenaglow-cream',
  'calmiance-gel':       'cosmetic-product-calmiance-gel',
  'calmiance':           'cosmetic-product-calmiance-gel',
  'renew-ampoule':       'cosmetic-product-renew-ampoule',
  'renew':               'cosmetic-product-renew-ampoule',
  'ampoule':             'cosmetic-product-renew-ampoule',
  'p30-moisturizer':     'cosmetic-product-p30-moisturizer',
  'moisturizer':         'cosmetic-product-p30-moisturizer',
  'p30-toner':           'cosmetic-product-p30-toner',
  'toner':               'cosmetic-product-p30-toner',
  'lumiglow-sunscreen':  'cosmetic-product-lumiglow-sunscreen',
  'lumiglow':            'cosmetic-product-lumiglow-sunscreen',
  'sunscreen':           'cosmetic-product-lumiglow-sunscreen',
  'cellurevive-ampoule': 'cosmetic-set-cellurevive-ampoule',
  'cellurevive':         'cosmetic-set-cellurevive-ampoule',
  'regenaglow-sheer-cream': 'cosmetic-set-regenaglow-sheer-cream',
};

/** Normalize a media slot value to canonical form before image resolution. */
function normalizePublicSlot(slot?: string): string | undefined {
  if (!slot) return undefined;
  const s = slot.trim().toLowerCase();
  if (MEDIA_SLOT_TO_KEY[s]) return s;                        // Already canonical
  return SLOT_ALIAS_TO_CANONICAL[s] ?? undefined;            // Alias → canonical
}

function getProductImage(
  productName: string,
  mediaSlot: string | undefined,
  cosmeticMedia: CosmeticPageMedia
): string | undefined {
  // Step 1: resolve by explicit slot (normalize legacy aliases first)
  const canonical = normalizePublicSlot(mediaSlot);
  if (canonical) {
    const key = MEDIA_SLOT_TO_KEY[canonical];
    if (key && cosmeticMedia[key] && isValidHeroImageUrl(cosmeticMedia[key])) {
      return cosmeticMedia[key];
    }
  }
  // Step 2: fallback by product name to camelCase key
  const name = (productName || '').toLowerCase();
  const nameSlot: keyof CosmeticPageMedia | null =
    name.includes('regenaglow') ? 'regenaglow' :
    name.includes('calmiance')  ? 'calmiance' :
    name.includes('renew')      ? 'renewAmpoule' :
    (name.includes('p30') && name.includes('moisturizer')) ? 'p30Moisturizer' :
    (name.includes('p30') && name.includes('toner'))       ? 'p30Toner' :
    (name.includes('lumiglow') || name.includes('sunscreen')) ? 'lumiglowSunscreen' :
    name.includes('luminous') ? 'luminousSet' :
    null;
  if (nameSlot) {
    const url = cosmeticMedia[nameSlot];
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

// ─── Ritual role / usage inference (module-level, used by component + IIFE) ────
function inferRitualRole(item: any): string {
  if (item.role) return item.role;
  const n = (item.name || item.title || '').toLowerCase();
  if (n.includes('toner')) return 'PREPARE';
  if (n.includes('ampoule')) return 'TREAT';
  if (n.includes('gel')) return 'RECOVER';
  if (n.includes('moisturizer')) return 'SEAL';
  if (n.includes('cream')) return 'NOURISH';
  if (n.includes('lumiglow') || n.includes('sunscreen')) return 'PROTECT';
  if (n.includes('cleanser')) return 'CLEANSE';
  return 'CARE';
}

function inferRitualUsage(item: any): string | null {
  if (item.usage) return item.usage;
  const n = (item.name || item.title || '').toLowerCase();
  if (n.includes('toner')) return 'AM · PM';
  if (n.includes('ampoule')) return 'AM · PM';
  if (n.includes('moisturizer') || n.includes('cream') || n.includes('gel')) return 'AM · PM';
  if (n.includes('lumiglow') || n.includes('sunscreen')) return 'AM';
  return null;
}

function inferRitualWhyStep(item: any): string {
  if (item.detail) return item.detail;
  const n = (item.name || '').toLowerCase();
  if (n.includes('toner')) return 'Toner prepares and balances the skin, maximising absorption of subsequent treatments.';
  if (n.includes('ampoule')) return 'A concentrated treatment step targeting cellular renewal, barrier support, and visible skin correction.';
  if (n.includes('gel')) return 'Calms reactive skin and reinforces the protective barrier with a multi-extract complex.';
  if (n.includes('moisturizer')) return 'Seals the treatment layers and provides sustained, deep hydration throughout the day.';
  if (n.includes('cream')) return 'Delivers lasting nourishment and actively supports skin recovery and renewal.';
  if (n.includes('lumiglow') || n.includes('sunscreen')) return 'Completes the ritual by shielding recovered skin from environmental stressors and UV exposure.';
  return 'Each step works in synergy to strengthen, restore, and protect the skin.';
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
  // ── Ritual system interactive state ─────────────────────────────────────────
  const [activeStationIdx, setActiveStationIdx] = useState<number>(-1); // -1 = not yet initialised
  const [openAccordionIdx, setOpenAccordionIdx] = useState<number | null>(null);
  const [selectedView, setSelectedView] = useState<'set' | 'cellurevive-ampoule' | 'regenaglow-sheer-cream'>('set');

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
    eyebrow: 'ACTIVE INGREDIENT INTELLIGENCE',
    title: 'Bản đồ hoạt chất phục hồi da',
    description: 'Khám phá cách các hoạt chất trong hệ sản phẩm VAVAW hỗ trợ phục hồi, cấp ẩm, làm dịu, tái tạo và bảo vệ làn da.',
    logicTitle: 'Clinical Formula Logic',
    logicDescription: 'Mỗi hoạt chất được đặt vào đúng vai trò trong routine: chuẩn bị da, hỗ trợ tái tạo, làm dịu, khóa ẩm và bảo vệ ban ngày.',
    items: [
      {
        id: 'exosome',
        name: 'Exosome',
        category: 'Renewal Signal',
        icon: 'atom',
        routineStage: 'TREAT',
        usage: 'PM',
        shortRole: 'Hỗ trợ vẻ ngoài mịn màng, rạng rỡ.',
        description: 'Hoạt chất được ứng dụng trong công thức chăm sóc chuyên sâu, hỗ trợ cải thiện vẻ ngoài của làn da xỉn màu, kém sức sống và cần phục hồi sau treatment.',
        supports: ['Radiance support', 'Texture refinement', 'Skin renewal appearance'],
        bestFor: ['Da xỉn màu', 'Da có dấu hiệu lão hóa', 'Da cần phục hồi sau treatment'],
        foundIn: ['Gentle Activation Renew Ampoule', 'CELLUREVIVE Ampoule']
      },
      {
        id: 'peptide',
        name: 'Peptide Complex',
        category: 'Firmness Support',
        icon: 'sparkles',
        routineStage: 'RECOVER',
        usage: 'AM · PM',
        shortRole: 'Hỗ trợ độ đàn hồi và săn chắc tự nhiên.',
        description: 'Hỗn hợp peptide chuỗi sinh học hỗ trợ cải thiện độ săn chắc của da, làm mờ các nếp nhăn mảnh và tăng cường vẻ căng mịn.',
        supports: ['Visible firmness', 'Wrinkle appearance improvement', 'Skin elasticity support'],
        bestFor: ['Da giảm độ đàn hồi', 'Da xuất hiện nếp nhăn', 'Da thiếu săn chắc'],
        foundIn: ['Regenaglow Nourish Sheer Cream', 'P30 Boost Facial Moisturizer']
      },
      {
        id: 'collagen',
        name: 'Collagen Support',
        category: 'Elasticity Support',
        icon: 'scan-heart',
        routineStage: 'RECOVER',
        usage: 'AM · PM',
        shortRole: 'Giúp cải thiện độ đàn hồi và độ dày biểu bì.',
        description: 'Phức hợp collagen hỗ trợ bổ sung cấu trúc nền cho da, mang lại làn da trông căng mọng, săn chắc và giảm thiểu tình trạng chảy xệ.',
        supports: ['Elasticity support', 'Plumping effect', 'Skin structure integrity'],
        bestFor: ['Da thiếu ẩm', 'Da có nếp nhăn sâu', 'Da kém căng bóng'],
        foundIn: ['Regenaglow Nourish Sheer Cream', 'CELLUREVIVE Ampoule']
      },
      {
        id: 'cica',
        name: 'Cica 7 Complex',
        category: 'Soothing Barrier Care',
        icon: 'leaf',
        routineStage: 'RECOVER',
        usage: 'AM · PM',
        shortRole: 'Làm dịu làn da nhạy cảm, kích ứng.',
        description: 'Chiết xuất rau má cô đặc kết hợp 7 hoạt chất sinh học hỗ trợ phục hồi hàng rào bảo vệ da, làm dịu nhanh các tình trạng đỏ rát và nhạy cảm.',
        supports: ['Redness appearance reduction', 'Skin barrier support', 'Soothing sensitive areas'],
        bestFor: ['Da nhạy cảm', 'Da dễ đỏ rát', 'Da sau các liệu trình công nghệ cao'],
        foundIn: ['Calmiance Superior Sheer Gel']
      },
      {
        id: 'ha',
        name: 'Hyaluronic Acid',
        category: 'Hydration Layer',
        icon: 'droplet',
        routineStage: 'PREPARE / SEAL',
        usage: 'AM · PM',
        shortRole: 'Cấp ẩm sâu đa tầng, khóa ẩm bảo vệ.',
        description: 'Các phân tử HA đa kích thước thẩm thấu sâu vào các tầng biểu bì, giữ nước tối ưu và duy trì độ ẩm mịn suốt cả ngày.',
        supports: ['Deep hydration', 'Moisture barrier seal', 'Instant plumpness appearance'],
        bestFor: ['Da khô ráp', 'Da mất nước', 'Da bong tróc'],
        foundIn: ['P30 Boost Facial Hydrating Toner', 'P30 Boost Facial Moisturizer']
      },
      {
        id: 'niacinamide',
        name: 'Niacinamide',
        category: 'Tone & Barrier Support',
        icon: 'badge-check',
        routineStage: 'PROTECT',
        usage: 'AM',
        shortRole: 'Dưỡng sáng da, củng cố hàng rào bảo vệ.',
        description: 'Hoạt chất đa năng hỗ trợ điều hòa bã nhờn, cải thiện tông da không đều màu và củng cố hàng rào bảo vệ da trước tác hại môi trường.',
        supports: ['Brightening support', 'Skin tone evening', 'Moisture retention control'],
        bestFor: ['Da không đều màu', 'Da có vết thâm sạm', 'Da xỉn màu'],
        foundIn: ['LUMIGLOW ROSY SHEER SUNSCREEN SPF50+/PA+++']
      },
      {
        id: 'bakuchiol',
        name: 'Bakuchiol',
        category: 'Gentle Renewal Support',
        icon: 'microscope',
        routineStage: 'TREAT',
        usage: 'PM',
        shortRole: 'Hỗ trợ chu kỳ sừng hóa tự nhiên của da.',
        description: 'Hoạt chất chống oxy hóa chiết xuất tự nhiên hoạt động tương tự retinol nhưng vô cùng dịu nhẹ, không gây kích ứng hay nhạy cảm ánh sáng.',
        supports: ['Gentle renewal support', 'Anti-ageing care', 'Skin texture refinement'],
        bestFor: ['Da lão hóa sớm', 'Da nhạy cảm với retinol', 'Da kém mịn màng'],
        foundIn: ['Gentle Activation Renew Ampoule', 'LUMIGLOW ROSY SHEER SUNSCREEN SPF50+/PA+++']
      },
      {
        id: 'uv-filter',
        name: 'Hybrid UV Filter',
        category: 'Daily Protection Shield',
        icon: 'shield-check',
        routineStage: 'PROTECT',
        usage: 'AM',
        shortRole: 'Màng lọc bảo vệ da trước tia UVA/UVB.',
        description: 'Sự kết hợp tối ưu giữa màng lọc vật lý và hóa học giúp phản xạ và hấp thụ các tia UV gây hại, bảo vệ làn da khỏi lão hóa sớm.',
        supports: ['UV shield support', 'Photo-ageing defense', 'Sun damage prevention'],
        bestFor: ['Mọi loại da', 'Da tiếp xúc với ánh nắng', 'Da sau liệu trình cần bảo vệ nghiêm ngặt'],
        foundIn: ['LUMIGLOW ROSY SHEER SUNSCREEN SPF50+/PA+++']
      }
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
  const editorialGalleryBlock = blocks?.find(b => b.blockType === 'cosmetic-editorial-gallery');
  const isGalleryActive = editorialGalleryBlock ? (editorialGalleryBlock.isActive === true || (editorialGalleryBlock as any).is_active === true) : false;

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

        // Use CMS metadata when available, fallback to dynamic inference otherwise
        const stationItems = rawItems.map((item, i) => {
          const defaults = {
            step: String(i + 1).padStart(2, '0'),
            role: inferRitualRole(item),
            usage: inferRitualUsage(item),
            highlight: (item.name || '').toLowerCase().includes('ampoule'),
          };

          return {
            ...item,
            _step: item.step || item.number || defaults.step,
            _role: item.role || defaults.role,
            _usage: item.usage || defaults.usage,
            _isCore: item.highlight !== undefined ? Boolean(item.highlight) : defaults.highlight,
            _img: getProductImage(item.name || item.title || '', item.mediaSlot, cosmeticMedia),
            _desc: item.description || item.desc || item.detail || '',
            _ingredients: Array.isArray(item.ingredients)
              ? item.ingredients
              : typeof item.key === 'string'
                ? item.key.split('·').map((s: string) => s.trim()).filter(Boolean)
                : [],
            _why: inferRitualWhyStep(item),
          };
        });

        // Resolve active station — prefer highlighted item, else index 0 (preserving CMS order)
        const defaultActiveIdx = stationItems.findIndex(s => s.highlight === true) >= 0
          ? stationItems.findIndex(s => s.highlight === true)
          : 0;
        const resolvedActive = activeStationIdx === -1 ? defaultActiveIdx : activeStationIdx;
        const activeStation = stationItems[resolvedActive] ?? null;

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

                  {/* Desktop: interactive ritual stations */}
                  <div
                    className="hidden md:grid gap-0 border border-[#D9DEE8]"
                    style={{ gridTemplateColumns: `repeat(${Math.min(stationItems.length, 6)}, 1fr)` }}
                  >
                    {stationItems.slice(0, 6).map((station, i) => {
                      const isActive = i === resolvedActive;
                      return (
                        <motion.button
                          key={i}
                          type="button"
                          aria-pressed={isActive}
                          aria-label={`Step ${station._step}: ${station._role} — ${station.name || ''}`}
                          className={`group relative flex flex-col text-left border-r last:border-r-0 border-[#D9DEE8]
                            transition-all duration-300 ease-out cursor-pointer outline-none
                            focus-visible:ring-2 focus-visible:ring-[#050A5C]/40 focus-visible:ring-inset
                            ${isActive
                              ? 'bg-[#EBF0FA]'
                              : station._isCore
                                ? 'bg-[#F4F7FB] hover:bg-[#EBF0FA]'
                                : 'bg-white/60 hover:bg-white'}
                            motion-reduce:transition-none`}
                          onClick={() => setActiveStationIdx(i)}
                          onMouseEnter={() => setActiveStationIdx(i)}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: '-30px' }}
                          transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
                        >
                          {/* Active / core top accent */}
                          <div
                            className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
                            style={{
                              background: '#050A5C',
                              opacity: isActive ? 0.5 : station._isCore ? 0.2 : 0,
                            }}
                          />

                          <div className="p-5 xl:p-6 flex flex-col flex-1 w-full">
                            {/* Step number */}
                            <div className="flex items-end justify-between mb-3">
                              <span
                                className="font-serif font-light leading-none select-none transition-opacity duration-300"
                                style={{
                                  fontSize: 'clamp(3rem, 5vw, 5rem)',
                                  lineHeight: 1,
                                  color: '#050A5C',
                                  opacity: isActive ? 0.18 : 0.08,
                                }}
                                aria-hidden="true"
                              >
                                {station._step}
                              </span>
                              {station._usage && (
                                <span className="text-[8px] tracking-[0.2em] uppercase text-[#050A5C]/35 font-medium">
                                  {station._usage}
                                </span>
                              )}
                            </div>

                            {/* Role label */}
                            <div className="flex items-center gap-2 mb-3">
                              <div
                                className="h-px transition-all duration-300"
                                style={{
                                  width: isActive ? '16px' : '10px',
                                  background: '#050A5C',
                                  opacity: isActive ? 0.6 : 0.22,
                                }}
                              />
                              <span
                                className="text-[9px] tracking-[0.32em] uppercase font-semibold transition-colors duration-300"
                                style={{ color: isActive ? 'rgba(5,10,92,0.85)' : 'rgba(5,10,92,0.38)' }}
                              >
                                {station._role}
                              </span>
                              {station._isCore && (
                                <span className="text-[7px] tracking-[0.2em] uppercase text-white bg-[#050A5C]/70 px-1.5 py-0.5">
                                  CORE
                                </span>
                              )}
                            </div>

                            {/* Product packshot */}
                            <div
                              className="relative mb-3 mx-auto w-full bg-[#F7F9FC] flex items-center justify-center overflow-hidden border border-[#E8EDF6] transition-all duration-300"
                              style={{
                                aspectRatio: '3/4',
                                maxHeight: '160px',
                                borderColor: isActive ? 'rgba(5,10,92,0.18)' : undefined,
                              }}
                            >
                              {station._img ? (
                                <img
                                  src={station._img}
                                  alt={station.name || ''}
                                  className="w-full h-full object-contain p-3 transition-opacity duration-300"
                                  style={{ opacity: isActive ? 1 : 0.8 }}
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
                            <h3
                              className="text-[11px] font-medium leading-snug mb-1 transition-colors duration-300 line-clamp-2"
                              style={{ color: isActive ? '#050A5C' : '#1F2933' }}
                            >
                              {station.name || station.title}
                            </h3>

                            {/* Key */}
                            {station.key && (
                              <p className="text-[9px] text-[#9CA3AF] tracking-[0.12em] uppercase">{station.key}</p>
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* ── Desktop Detail Panel ── */}
                  {activeStation && (
                    <motion.div
                      key={resolvedActive}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="hidden md:grid grid-cols-12 gap-8 border border-t-0 border-[#D9DEE8] bg-white/80 px-8 py-7"
                      aria-live="polite"
                    >
                      {/* Left — Step + Role */}
                      <div className="col-span-2 flex flex-col justify-center border-r border-[#E8EDF6] pr-8">
                        <span
                          className="font-serif font-light leading-none text-[#050A5C]/12 select-none block mb-2"
                          style={{ fontSize: 'clamp(3rem, 4vw, 4.5rem)', lineHeight: 1 }}
                          aria-hidden="true"
                        >
                          {activeStation._step}
                        </span>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-4 h-px bg-[#050A5C]/40" />
                          <span className="text-[9px] tracking-[0.32em] uppercase font-semibold text-[#050A5C]/60">
                            {activeStation._role}
                          </span>
                        </div>
                        {activeStation._isCore && (
                          <span className="text-[7px] tracking-[0.2em] uppercase text-white bg-[#050A5C]/70 px-1.5 py-0.5 w-fit mt-1">
                            CORE TREATMENT
                          </span>
                        )}
                        {activeStation._usage && (
                          <span className="text-[9px] tracking-[0.2em] uppercase text-[#050A5C]/35 font-medium mt-3">
                            {activeStation._usage}
                          </span>
                        )}
                      </div>

                      {/* Center — Product name + description + why */}
                      <div className="col-span-6 flex flex-col justify-center">
                        <h3 className="text-lg font-light text-[#050A5C] leading-snug mb-3">
                          {activeStation.name || activeStation.title}
                        </h3>
                        {activeStation._desc && (
                          <p className="text-sm text-[#5A6374] font-light leading-relaxed mb-4">
                            {activeStation._desc}
                          </p>
                        )}
                        {activeStation._why && (
                          <div className="border-t border-[#E8EDF6] pt-4">
                            <span className="block text-[9px] tracking-[0.28em] uppercase text-[#050A5C]/35 font-semibold mb-2">
                              Why this step matters
                            </span>
                            <p className="text-xs text-[#6B7280] font-light leading-relaxed">
                              {activeStation._why}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Right — Ingredients + image thumb */}
                      <div className="col-span-4 flex gap-6 items-center">
                        {/* Image */}
                        {activeStation._img && (
                          <div className="w-20 h-24 shrink-0 bg-[#F7F9FC] border border-[#E0E7F0] flex items-center justify-center overflow-hidden">
                            <img
                              src={activeStation._img}
                              alt={activeStation.name || ''}
                              className="w-full h-full object-contain p-2"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        {/* Ingredients */}
                        <div className="flex flex-col flex-1">
                          {activeStation._ingredients.length > 0 && (
                            <>
                              <span className="block text-[9px] tracking-[0.28em] uppercase text-[#050A5C]/35 font-semibold mb-2">
                                Key Actives
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {activeStation._ingredients.map((ing: string) => (
                                  <span
                                    key={ing}
                                    className="text-[9px] tracking-[0.12em] uppercase border border-[#D9DEE8] px-2 py-1 text-[#050A5C]/70 font-medium"
                                  >
                                    {ing}
                                  </span>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Mobile: vertical accordion ritual cards */}
                  <div className="md:hidden space-y-2">
                    {stationItems.map((station, i) => {
                      const isOpen = openAccordionIdx === i;
                      return (
                        <div key={i} className={`border border-[#D9DEE8] overflow-hidden ${
                          station._isCore ? 'bg-[#F4F7FB]' : 'bg-white/80'
                        }`}>
                          {/* Accordion header button */}
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            aria-controls={`accordion-panel-${i}`}
                            id={`accordion-btn-${i}`}
                            className={`w-full flex items-center gap-4 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#050A5C]/30 focus-visible:ring-inset transition-colors duration-200 ${
                              isOpen ? 'bg-[#EBF0FA]' : ''
                            }`}
                            onClick={() => setOpenAccordionIdx(isOpen ? null : i)}
                          >
                            {/* Core side accent */}
                            {station._isCore && (
                              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#050A5C]/40" />
                            )}

                            {/* Image thumb */}
                            <div className="w-14 h-16 shrink-0 bg-[#F7F9FC] border border-[#E8EDF6] flex items-center justify-center overflow-hidden">
                              {station._img ? (
                                <img
                                  src={station._img}
                                  alt={station.name || ''}
                                  className="w-full h-full object-contain p-1.5"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                                    (e.currentTarget.parentElement as HTMLElement).style.background = 'linear-gradient(135deg, #EEF2F8, #DDE3EE)';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-[#EEF2F8] to-[#DDE3EE]" />
                              )}
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-serif font-light text-[#050A5C]/15 text-xl leading-none">{station._step}</span>
                                <span className="text-[8px] tracking-[0.26em] uppercase text-[#050A5C]/45 font-semibold">{station._role}</span>
                                {station._isCore && (
                                  <span className="text-[6px] tracking-[0.2em] uppercase text-white bg-[#050A5C]/70 px-1 py-0.5">CORE</span>
                                )}
                              </div>
                              <p className="text-sm font-medium text-[#1F2933] leading-snug truncate">{station.name || station.title}</p>
                              {station.key && !isOpen && (
                                <p className="text-[9px] text-[#9CA3AF] tracking-wide uppercase mt-0.5">{station.key}</p>
                              )}
                            </div>

                            {/* Chevron */}
                            <svg
                              className={`w-4 h-4 text-[#050A5C]/30 shrink-0 transition-transform duration-300 ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          {/* Accordion detail panel */}
                          {isOpen && (
                            <motion.div
                              id={`accordion-panel-${i}`}
                              role="region"
                              aria-labelledby={`accordion-btn-${i}`}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: 'easeOut' }}
                              className="px-4 pb-5 pt-2 border-t border-[#D9DEE8]"
                            >
                              {/* Description */}
                              {station._desc && (
                                <p className="text-sm text-[#5A6374] font-light leading-relaxed mb-4">
                                  {station._desc}
                                </p>
                              )}
                              {/* Ingredients */}
                              {station._ingredients.length > 0 && (
                                <div className="mb-4">
                                  <span className="block text-[9px] tracking-[0.28em] uppercase text-[#050A5C]/35 font-semibold mb-2">Key Actives</span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {station._ingredients.map((ing: string) => (
                                      <span key={ing} className="text-[9px] tracking-[0.12em] uppercase border border-[#D9DEE8] px-2 py-1 text-[#050A5C]/70">
                                        {ing}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {/* Usage + Why */}
                              <div className="flex items-center gap-4">
                                {station._usage && (
                                  <span className="text-[9px] tracking-[0.2em] uppercase text-[#050A5C]/40 font-semibold border border-[#D9DEE8] px-2 py-1">
                                    {station._usage}
                                  </span>
                                )}
                              </div>
                              {station._why && (
                                <div className="mt-4 border-t border-[#E8EDF6] pt-3">
                                  <span className="block text-[9px] tracking-[0.28em] uppercase text-[#050A5C]/35 font-semibold mb-1">Why this step</span>
                                  <p className="text-xs text-[#6B7280] font-light leading-relaxed">{station._why}</p>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
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
      {heroProduct && (() => {
        const content = heroProduct.content || heroProduct;
        const eyebrow = content.eyebrow || 'FEATURED SET';
        const title = content.title || 'Luminous Revitalization Sheer Set';
        const headline = content.headline || 'Chăm sóc chuyên sâu — củng cố hàng rào bảo vệ và phục hồi làn da rạng rỡ.';
        const description = content.description || 'Bộ chăm sóc phục hiệu chuyên sâu kết hợp ampoule cô đặc và kem dưỡng phục hồi, giúp hỗ trợ hàng rào bảo vệ da, cải thiện độ ẩm và mang lại làn da rạng rỡ hơn.';
        const mediaSlot = content.mediaSlot || 'cosmetic-product-luminous-set';
        const benefits = content.benefits || [
          'Barrier Support',
          'Radiance Recovery',
          'Moisture Retention'
        ];

        // Derive setProducts with legacy insideBox compatibility
        let setProducts = content.setProducts;
        if (!setProducts || !Array.isArray(setProducts) || setProducts.length === 0) {
          const legacyInsideBox = content.insideBox || [];
          if (legacyInsideBox.length > 0) {
            const cellureviveLegacy = legacyInsideBox.find((p: any) => 
              p.name?.toLowerCase().includes('cellurevive') || p.name?.toLowerCase().includes('ampoule')
            );
            const regenaglowLegacy = legacyInsideBox.find((p: any) => 
              p.name?.toLowerCase().includes('regenaglow') || p.name?.toLowerCase().includes('cream')
            );
            
            setProducts = [];
            if (cellureviveLegacy) {
              setProducts.push({
                id: 'cellurevive-ampoule',
                name: cellureviveLegacy.name || 'CELLUREVIVE Ampoule',
                size: cellureviveLegacy.size || '7ml × 4ea',
                role: cellureviveLegacy.role || 'Ampoule cô đặc',
                description: cellureviveLegacy.description || cellureviveLegacy.desc || 'Hỗ trợ phục hồi làn da, cải thiện độ sáng và giúp bề mặt da trông mịn màng, tươi khỏe hơn.',
                detailTitle: "Tinh chất phục hồi chuyên sâu",
                detailDescription: "Ampoule cô đặc trong bộ Luminous Set, được thiết kế để hỗ trợ làn da cần phục hồi, cải thiện độ rạng rỡ và tăng cảm giác mịn màng sau các bước chăm sóc nền.",
                actives: ["Exosome", "Peptide Complex", "Collagen Support"],
                benefits: ["Hỗ trợ phục hồi", "Tăng độ rạng rỡ", "Làm mịn bề mặt da"],
                usage: "Dùng sau bước cân bằng da. Thoa lượng vừa đủ lên toàn mặt, massage nhẹ đến khi thẩm thấu.",
                mediaSlot: "cosmetic-set-cellurevive-ampoule"
              });
            } else {
              setProducts.push({
                id: 'cellurevive-ampoule',
                name: 'CELLUREVIVE Ampoule',
                size: '7ml × 4ea',
                role: 'Ampoule cô đặc',
                description: 'Hỗ trợ phục hồi làn da, cải thiện độ sáng và giúp bề mặt da trông mịn màng, tươi khỏe hơn.',
                detailTitle: "Tinh chất phục hồi chuyên sâu",
                detailDescription: "Ampoule cô đặc trong bộ Luminous Set, được thiết kế để hỗ trợ làn da cần phục hồi, cải thiện độ rạng rỡ và tăng cảm giác mịn màng sau các bước chăm sóc nền.",
                actives: ["Exosome", "Peptide Complex", "Collagen Support"],
                benefits: ["Hỗ trợ phục hồi", "Tăng độ rạng rỡ", "Làm mịn bề mặt da"],
                usage: "Dùng sau bước cân bằng da. Thoa lượng vừa đủ lên toàn mặt, massage nhẹ đến khi thẩm thấu.",
                mediaSlot: "cosmetic-set-cellurevive-ampoule"
              });
            }

            if (regenaglowLegacy) {
              setProducts.push({
                id: 'regenaglow-sheer-cream',
                name: regenaglowLegacy.name || 'REGENAGLOW NOURISH SHEER CREAM',
                size: regenaglowLegacy.size || '30ml × 1ea',
                role: regenaglowLegacy.role || 'Kem dưỡng phục hồi',
                description: regenaglowLegacy.description || regenaglowLegacy.desc || 'Giúp khóa ẩm, làm mềm da và củng cố hàng rào bảo vệ để duy trì làn da ổn định hơn.',
                detailTitle: "Kem dưỡng khóa ẩm và phục hồi hàng rào da",
                detailDescription: "Kem dưỡng trong bộ Luminous Set giúp hoàn thiện routine phục hồi bằng cách khóa ẩm, hỗ trợ hàng rào bảo vệ và duy trì làn da mềm mượt, ổn định hơn.",
                actives: ["Collagen", "Peptide Complex", "Moisture Barrier Support"],
                benefits: ["Khóa ẩm", "Củng cố hàng rào da", "Làm mềm da"],
                usage: "Dùng sau ampoule. Lấy lượng vừa đủ, thoa đều lên mặt và cổ, vỗ nhẹ để dưỡng chất thẩm thấu.",
                mediaSlot: "cosmetic-set-regenaglow-sheer-cream"
              });
            } else {
              setProducts.push({
                id: 'regenaglow-sheer-cream',
                name: 'REGENAGLOW NOURISH SHEER CREAM',
                size: '30ml × 1ea',
                role: 'Kem dưỡng phục hồi',
                description: 'Giúp khóa ẩm, làm mềm da và củng cố hàng rào bảo vệ để duy trì làn da ổn định hơn.',
                detailTitle: "Kem dưỡng khóa ẩm và phục hồi hàng rào da",
                detailDescription: "Kem dưỡng trong bộ Luminous Set giúp hoàn thiện routine phục hồi bằng cách khóa ẩm, hỗ trợ hàng rào bảo vệ và duy trì làn da mềm mượt, ổn định hơn.",
                actives: ["Collagen", "Peptide Complex", "Moisture Barrier Support"],
                benefits: ["Khóa ẩm", "Củng cố hàng rào da", "Làm mềm da"],
                usage: "Dùng sau ampoule. Lấy lượng vừa đủ, thoa đều lên mặt và cổ, vỗ nhẹ để dưỡng chất thẩm thấu.",
                mediaSlot: "cosmetic-set-regenaglow-sheer-cream"
              });
            }
          } else {
            setProducts = [
              {
                id: 'cellurevive-ampoule',
                name: "CELLUREVIVE Ampoule",
                size: "7ml × 4ea",
                role: "Ampoule cô đặc",
                description: "Hỗ trợ phục hồi làn da, cải thiện độ sáng và giúp bề mặt da trông mịn màng, tươi khỏe hơn.",
                detailTitle: "Tinh chất phục hồi chuyên sâu",
                detailDescription: "Ampoule cô đặc trong bộ Luminous Set, được thiết kế để hỗ trợ làn da cần phục hồi, cải thiện độ rạng rỡ và tăng cảm giác mịn màng sau các bước chăm sóc nền.",
                actives: ["Exosome", "Peptide Complex", "Collagen Support"],
                benefits: ["Hỗ trợ phục hồi", "Tăng độ rạng rỡ", "Làm mịn bề mặt da"],
                usage: "Dùng sau bước cân bằng da. Thoa lượng vừa đủ lên toàn mặt, massage nhẹ đến khi thẩm thấu.",
                mediaSlot: "cosmetic-set-cellurevive-ampoule"
              },
              {
                id: 'regenaglow-sheer-cream',
                name: "REGENAGLOW NOURISH SHEER CREAM",
                size: "30ml × 1ea",
                role: "Kem dưỡng phục hồi",
                description: "Giúp khóa ẩm, làm mềm da và củng cố hàng rào bảo vệ để duy trì làn da ổn định hơn.",
                detailTitle: "Kem dưỡng khóa ẩm và phục hồi hàng rào da",
                detailDescription: "Kem dưỡng trong bộ Luminous Set giúp hoàn thiện routine phục hồi bằng cách khóa ẩm, hỗ trợ hàng rào bảo vệ và duy trì làn da mềm mượt, ổn định hơn.",
                actives: ["Collagen", "Peptide Complex", "Moisture Barrier Support"],
                benefits: ["Khóa ẩm", "Củng cố hàng rào da", "Làm mềm da"],
                usage: "Dùng sau ampoule. Lấy lượng vừa đủ, thoa đều lên mặt và cổ, vỗ nhẹ để dưỡng chất thẩm thấu.",
                mediaSlot: "cosmetic-set-regenaglow-sheer-cream"
              }
            ];
          }
        }

        const ctaLabel = content.ctaLabel || 'Start Consultation';
        const ctaHref = content.ctaHref || '/contact?type=cosmetic_interest&product=luminous_set';
        
        // selectedView: 'set' | 'cellurevive-ampoule' | 'regenaglow-sheer-cream'
        const cellurevive = setProducts?.find((p: any) => p.id === 'cellurevive-ampoule' || p.mediaSlot?.includes('cellurevive')) || setProducts?.[0];
        const regenaglow = setProducts?.find((p: any) => p.id === 'regenaglow-sheer-cream' || p.mediaSlot?.includes('regenaglow')) || setProducts?.[1];

        // Resolve big image stage URL based on selectedView
        let displayImageUrl = '';
        let displayCaptionLeft = '';
        let displayCaptionRight = '';
        let isPlaceholder = false;

        if (selectedView === 'set') {
          displayImageUrl = getProductImage(title, mediaSlot, cosmeticMedia) || cosmeticMedia.luminousSet || '';
          displayCaptionLeft = 'LUMINOUS REVITALIZATION SHEER SET';
          displayCaptionRight = 'CLINICAL RECOVERY SET';
        } else {
          const activeP = selectedView === 'cellurevive-ampoule' ? cellurevive : regenaglow;
          if (activeP) {
            const canonical = activeP.mediaSlot ? normalizePublicSlot(activeP.mediaSlot) : undefined;
            const activePKey = canonical ? MEDIA_SLOT_TO_KEY[canonical] : undefined;
            displayImageUrl = activePKey && cosmeticMedia[activePKey] && isValidHeroImageUrl(cosmeticMedia[activePKey])
              ? cosmeticMedia[activePKey]
              : '';
            displayCaptionLeft = activeP.name?.toUpperCase() || '';
            displayCaptionRight = activeP.size || '';
            if (!displayImageUrl) {
              isPlaceholder = true;
            }
          }
        }

        const RenderSelectorTabs = () => (
          <div className="grid grid-cols-3 gap-2 w-full">
            {/* Set Overview Tab */}
            <button
              type="button"
              onClick={() => setSelectedView('set')}
              className={`text-left border p-3 flex flex-col justify-between transition-all duration-200 min-w-0 ${
                selectedView === 'set'
                  ? 'border-[#050A5C] bg-[#050A5C]/5 shadow-sm'
                  : 'border-[#D9DEE8]/60 bg-white hover:border-slate-300'
              }`}
              style={{ borderRadius: '1px' }}
            >
              <span className={`block text-[7px] font-mono font-bold tracking-wider mb-0.5 ${selectedView === 'set' ? 'text-[#050A5C]/60' : 'text-slate-400'}`}>OVERVIEW</span>
              <span className="block text-[10px] font-bold text-[#050A5C] truncate">Luminous Set</span>
            </button>

            {/* CELLUREVIVE Tab */}
            {cellurevive && (
              <button
                type="button"
                onClick={() => setSelectedView('cellurevive-ampoule')}
                className={`text-left border p-3 flex flex-col justify-between transition-all duration-200 min-w-0 ${
                  selectedView === 'cellurevive-ampoule'
                    ? 'border-[#050A5C] bg-[#050A5C]/5 shadow-sm'
                    : 'border-[#D9DEE8]/60 bg-white hover:border-slate-300'
                }`}
                style={{ borderRadius: '1px' }}
              >
                <span className={`block text-[7px] font-mono font-bold tracking-wider mb-0.5 ${selectedView === 'cellurevive-ampoule' ? 'text-[#050A5C]/60' : 'text-slate-400'}`}>01 · AMPOULE</span>
                <span className="block text-[10px] font-bold text-[#050A5C] truncate">CELLUREVIVE</span>
              </button>
            )}

            {/* REGENAGLOW Tab */}
            {regenaglow && (
              <button
                type="button"
                onClick={() => setSelectedView('regenaglow-sheer-cream')}
                className={`text-left border p-3 flex flex-col justify-between transition-all duration-200 min-w-0 ${
                  selectedView === 'regenaglow-sheer-cream'
                    ? 'border-[#050A5C] bg-[#050A5C]/5 shadow-sm'
                    : 'border-[#D9DEE8]/60 bg-white hover:border-slate-300'
                }`}
                style={{ borderRadius: '1px' }}
              >
                <span className={`block text-[7px] font-mono font-bold tracking-wider mb-0.5 ${selectedView === 'regenaglow-sheer-cream' ? 'text-[#050A5C]/60' : 'text-slate-400'}`}>02 · CREAM</span>
                <span className="block text-[10px] font-bold text-[#050A5C] truncate">REGENAGLOW</span>
              </button>
            )}
          </div>
        );

        return (
          <section className={`${SECTION_WHITE} py-24 md:py-32 px-6 border-t ${SILVER_BORDER}`}>
            <div className="max-w-7xl mx-auto">
              
              {/* Mobile Selector: Rendered above the visual image grid */}
              <div className="block lg:hidden mb-6">
                <span className="block text-[8px] tracking-[0.2em] uppercase text-[#050A5C]/35 font-bold mb-2">Select View</span>
                <RenderSelectorTabs />
              </div>

              {/* Main 2-Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-14 xl:gap-20 items-center">
                
                {/* Left Column: Large Dynamic Framed Image */}
                <motion.div
                  className="flex flex-col gap-4 w-full"
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.75 }}
                >
                  <div className="relative aspect-[4/5] lg:min-h-[620px] w-full border border-[#D9DEE8] bg-[#F7F9FC] flex items-center justify-center p-6 md:p-8 overflow-hidden" style={{ borderRadius: '1px' }}>
                    <AnimatePresence mode="wait">
                      {!isPlaceholder && displayImageUrl ? (
                        <motion.img
                          key={selectedView}
                          src={displayImageUrl}
                          alt={displayCaptionLeft}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="w-full h-full object-contain mix-blend-multiply bg-[#F7F9FC] transition-transform duration-700 hover:scale-103"
                        />
                      ) : (
                        <motion.div
                          key={`placeholder-${selectedView}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="flex flex-col items-center justify-center text-center p-6 space-y-3"
                        >
                          <FlaskConical className="h-10 w-10 text-[#050A5C]/20 stroke-[1.2]" />
                          <span className="text-sm font-bold text-slate-400">Chưa có ảnh sản phẩm</span>
                          <span className="text-xs text-slate-400 font-light leading-normal max-w-xs">Upload ảnh trong Admin &rarr; Cosmetic Page &rarr; Hình ảnh</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="flex justify-between items-center text-[9px] tracking-[0.2em] font-semibold text-[#050A5C]/45 uppercase px-1">
                    <span>{displayCaptionLeft}</span>
                    <span>{displayCaptionRight}</span>
                  </div>
                </motion.div>

                {/* Right Column: Clean premium details */}
                <div className="flex flex-col space-y-6 min-w-0 w-full">
                  {/* Desktop Selector: Rendered inside the right column */}
                  <div className="hidden lg:block">
                    <RenderSelectorTabs />
                  </div>

                  <AnimatePresence mode="wait">
                    {selectedView === 'set' ? (
                      <motion.div
                        key="set"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-6"
                      >
                        <div className="space-y-2">
                          <SectionLabel>{eyebrow || 'FEATURED SET'}</SectionLabel>
                          <h2 className="text-3xl md:text-4xl font-light text-[#050A5C] tracking-tight font-serif">
                            {title}
                          </h2>
                          {headline && (
                            <p className="text-sm md:text-base font-light text-[#050A5C]/80 leading-relaxed italic">
                              {headline}
                            </p>
                          )}
                        </div>
                        
                        <Divider />
                        
                        <p className="text-[#6B7280] font-light text-sm leading-relaxed max-w-xl">
                          {description}
                        </p>

                        {/* Benefits tags */}
                        {benefits && benefits.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {benefits.slice(0, 3).map((b: string) => (
                              <span key={b} className="border border-[#D9DEE8] px-3.5 py-1 text-[9px] tracking-[0.15em] uppercase text-[#050A5C] font-semibold bg-[#F4F7FB]/70" style={{ borderRadius: '1px' }}>
                                {b}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Inside the Set List */}
                        <div className="pt-4 border-t border-slate-100 space-y-2">
                          <span className="block text-[8px] tracking-[0.2em] uppercase text-[#050A5C]/40 font-bold">Bộ sản phẩm bao gồm (Set Includes)</span>
                          <div className="flex flex-col gap-1.5 text-xs text-slate-600 font-light">
                            {cellurevive && (
                              <div className="flex justify-between items-center border border-[#D9DEE8]/50 p-2.5 bg-white" style={{ borderRadius: '1px' }}>
                                <span className="font-bold text-[#050A5C]">01. {cellurevive.name}</span>
                                <span className="text-[10px] font-mono text-slate-400 font-semibold">{cellurevive.size}</span>
                              </div>
                            )}
                            {regenaglow && (
                              <div className="flex justify-between items-center border border-[#D9DEE8]/50 p-2.5 bg-white" style={{ borderRadius: '1px' }}>
                                <span className="font-bold text-[#050A5C]">02. {regenaglow.name}</span>
                                <span className="text-[10px] font-mono text-slate-400 font-semibold">{regenaglow.size}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      (() => {
                        const activeP = selectedView === 'cellurevive-ampoule' ? cellurevive : regenaglow;
                        if (!activeP) return null;
                        return (
                          <motion.div
                            key={activeP.id || selectedView}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25 }}
                            className="space-y-5"
                          >
                            <div className="space-y-2">
                              <SectionLabel>PRODUCT IN THE SET</SectionLabel>
                              <h2 className="text-3xl font-light text-[#050A5C] tracking-tight font-serif">
                                {activeP.name}
                              </h2>
                              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                                {activeP.size} &middot; {activeP.role}
                              </div>
                            </div>
                            
                            <Divider />

                            {activeP.detailDescription && (
                              <p className="text-sm text-slate-600 font-light leading-relaxed max-w-xl">
                                {activeP.detailDescription}
                              </p>
                            )}

                            {/* Actives chips */}
                            {activeP.actives && activeP.actives.length > 0 && (
                              <div className="space-y-1.5 min-w-0">
                                <span className="block text-[8px] tracking-[0.2em] uppercase text-[#050A5C]/35 font-bold">Key Actives</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {activeP.actives.slice(0, 3).map((act: string, i: number) => (
                                    <span key={i} className="text-[9px] font-mono text-[#050A5C] border border-[#050A5C]/10 px-2 py-0.5 bg-[#050A5C]/5" style={{ borderRadius: '1px' }}>{act}</span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Benefits compact bullets */}
                            {activeP.benefits && activeP.benefits.length > 0 && (
                              <div className="space-y-1.5 min-w-0">
                                <span className="block text-[8px] tracking-[0.2em] uppercase text-[#050A5C]/35 font-bold">Benefits</span>
                                <div className="space-y-1">
                                  {activeP.benefits.slice(0, 3).map((b: string, i: number) => (
                                    <div key={i} className="flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-[#050A5C]/30 flex-shrink-0" />
                                      <span className="text-[11px] text-slate-600 font-light truncate">{b}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Muted usage note */}
                            {activeP.usage && (
                              <p className="text-[10px] text-slate-400 font-light leading-relaxed italic border-l border-slate-200 pl-2">
                                HDSD: {activeP.usage}
                              </p>
                            )}
                          </motion.div>
                        );
                      })()
                    )}
                  </AnimatePresence>

                  {/* Primary CTA */}
                  <motion.div variants={fadeUp} className="pt-4">
                    <CosmeticCtaTracker
                      label={ctaLabel}
                      href={ctaHref}
                      className="w-full h-[48px] flex items-center justify-center bg-[#050A5C] text-white text-[10px] tracking-[0.25em] uppercase hover:bg-[#101A8C] transition-colors rounded-[1px] shadow-sm font-semibold"
                    />
                  </motion.div>
                </div>

              </div>

            </div>
          </section>
        );
      })()}

      {/* ───────────────────────────────────────────────────────────────────────
          SECTION 5 — PRODUCT EDITORIAL CARDS
      ─────────────────────────────────────────────────────────────────────── */}
      {productCards && (
        <ClinicalFormulaLab productCards={productCards} cosmeticMedia={cosmeticMedia} />
      )}

      {/* ───────────────────────────────────────────────────────────────────────
          SECTION 6 — ACTIVE INGREDIENT INTELLIGENCE
      ─────────────────────────────────────────────────────────────────────── */}
      {ingredientsBlock && (
        <IngredientIntelligenceMap ingredientsBlock={ingredientsBlock} />
      )}

      {/* ───────────────────────────────────────────────────────────────────────
          SECTION 7 — DAILY CLINICAL RITUAL
      ─────────────────────────────────────────────────────────────────────── */}
      {dailyRitual && (
        <SkinRitualFinder dailyRitual={dailyRitual} products={productCards} cosmeticMedia={cosmeticMedia} />
      )}


      {/* ───────────────────────────────────────────────────────────────────────
          SECTION 8 — PREMIUM PROGRAM / SPA CLINIC
      ─────────────────────────────────────────────────────────────────────── */}
      {premiumProgram && (
      <section className={`${SECTION_WHITE} py-28 md:py-36 px-6 border-t ${SILVER_BORDER}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Premium program video/image visual stage */}
            <motion.div
              className="relative aspect-[9/16] md:aspect-[4/5] border border-[#E2E8F0] overflow-hidden order-2 lg:order-1 bg-[#F8FAFC] rounded-2xl group shadow-sm"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85 }}
            >
              {cosmeticMedia.premiumProgramSpaVideo ? (
                <video
                  key={cosmeticMedia.premiumProgramSpaVideo}
                  src={cosmeticMedia.premiumProgramSpaVideo}
                  muted
                  playsInline
                  loop
                  autoPlay
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
              ) : cosmeticMedia.premiumProgramImage ? (
                <img
                  src={cosmeticMedia.premiumProgramImage}
                  alt="VAVAW professional spa program"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-tr from-[#050A5C]/5 to-transparent flex items-center justify-center p-8">
                  <span className="text-[10px] font-mono tracking-wider text-[#050A5C]/40 uppercase">VAVAW Spa Stage</span>
                </div>
              )}
              
              {/* Subtle bottom overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 pt-12 flex flex-col justify-end">
                <div className="flex items-center justify-between text-white">
                  <span className="text-[10px] font-mono tracking-widest uppercase opacity-90">Spa Recovery Ritual</span>
                  <span className="text-[10px] font-bold tracking-widest uppercase opacity-80 border-l border-white/20 pl-3">VAVAW Beauty & Co</span>
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
              <motion.div variants={fadeUp}><SectionLabel>{premiumProgram.eyebrow || 'PROFESSIONAL SPA PROGRAM'}</SectionLabel></motion.div>
              <motion.h2
                variants={fadeUp}
                className="text-3xl md:text-4xl font-light text-[#050A5C] tracking-tight leading-snug mb-4 whitespace-pre-wrap"
              >
                {premiumProgram.title}
              </motion.h2>
              <Divider />
              
              {premiumProgram.headline && (
                <motion.p variants={fadeUp} className="text-base md:text-lg font-light text-[#050A5C] italic leading-relaxed mb-6">
                  {premiumProgram.headline}
                </motion.p>
              )}

              <motion.p variants={fadeUp} className="text-[#6B7280] font-light text-sm leading-relaxed mb-8 whitespace-pre-wrap">
                {premiumProgram.description}
              </motion.p>

              {/* Program Pillars */}
              <motion.div variants={fadeUp} className="space-y-3.5 mb-8">
                {(Array.isArray(premiumProgram.pillars) && premiumProgram.pillars.length > 0
                  ? premiumProgram.pillars
                  : (premiumProgram.items || [])
                ).slice(0, 3).map((pillar: any, i: number) => {
                  const pTitle = pillar.title || `Trụ cột ${i + 1}`;
                  const pDesc = pillar.description || pillar.text || '';
                  return (
                    <div key={i} className="flex items-start gap-4 p-3.5 rounded-xl border border-[#E2E8F0]/60 bg-[#F8FAFC]/50 hover:bg-[#F8FAFC] transition-colors">
                      <div className="w-5.5 h-5.5 rounded-full bg-[#050A5C]/5 flex items-center justify-center text-[10px] text-[#050A5C] font-mono shrink-0">
                        0{i + 1}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-[#050A5C] uppercase tracking-wider">{pTitle}</h4>
                        {pDesc && <p className="text-xs text-slate-500 font-light leading-relaxed">{pDesc}</p>}
                      </div>
                    </div>
                  );
                })}
              </motion.div>

              {/* CTAs */}
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4">
                <CosmeticCtaTracker
                  label={premiumProgram.ctaLabel || "Trải nghiệm tại VAVAW Beauty & Co"}
                  href={premiumProgram.ctaHref || "/go/beauty"}
                  className="w-full sm:w-auto h-[52px] px-8 flex items-center justify-center bg-[#050A5C] text-white text-[11px] tracking-[0.2em] uppercase hover:bg-[#101A8C] transition-all rounded-lg font-medium shadow-sm hover:shadow active:scale-[0.98]"
                />
                <CosmeticCtaTracker
                  label={premiumProgram.secondaryCtaLabel || "Nhận tư vấn sản phẩm"}
                  href={premiumProgram.secondaryCtaHref || "/contact?type=cosmetic_interest&source=premium_program"}
                  className="w-full sm:w-auto h-[52px] px-8 flex items-center justify-center border border-[#050A5C]/20 text-[#050A5C] text-[11px] tracking-[0.2em] uppercase hover:bg-[#050A5C]/5 transition-all rounded-lg font-medium"
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
      {editorialGallery && isGalleryActive && (
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
