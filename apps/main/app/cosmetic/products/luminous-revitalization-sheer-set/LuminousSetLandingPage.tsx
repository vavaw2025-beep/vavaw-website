'use client';
import React from 'react';
import { ShieldCheck, ArrowRight, Check, ChevronDown, Droplets, Shield, Sparkles } from 'lucide-react';
import { CosmeticCtaTracker } from '../../cosmetic-tracker';
import { SiteFooter } from '@vavaw/ui';
import { ProductLandingContent } from '../_components/product-landing-types';
import { ProductDetailForm } from '../_components/ProductDetailForm';

import { ProductJsonLd } from '../_components/ProductJsonLd';

interface ScienceMediaBoxProps {
  url?: string | null;
  alt: string;
  caption?: string;
  showCaption?: boolean;
  mediaRenderType?: 'diagram' | 'photo' | 'full-bleed-artwork';
  imageMode?: 'cover' | 'contain-blur';
  objectPosition?: string;
  placeholderLabel: string;
  captionPosition?: 'bottom-right' | 'bottom-left';
  className?: string;
}

function ScienceMediaBox({
  url,
  alt,
  caption,
  showCaption = true,
  mediaRenderType = 'diagram',
  imageMode = 'cover',
  objectPosition,
  placeholderLabel,
  captionPosition = 'bottom-right',
  className = ''
}: ScienceMediaBoxProps) {
  const captionPosClass = captionPosition === 'bottom-left' 
    ? 'bottom-4 left-4 md:bottom-6 md:left-6' 
    : 'bottom-4 right-4 md:bottom-6 md:right-6';

  return (
    <div className={`relative w-full h-full bg-[#F8FAFD] flex items-center justify-center overflow-hidden ${className}`}>
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(5,10,92,0.03)] z-10" />

      {!url ? (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#050A5C 1px, transparent 1px), linear-gradient(90deg, #050A5C 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="bg-white/80 backdrop-blur-sm border border-[#D9DEEA] px-4 py-2 rounded-full z-10 shadow-sm">
            <span className="text-[#050A5C]/60 text-[10px] tracking-widest font-medium uppercase">{placeholderLabel}</span>
          </div>
        </div>
      ) : mediaRenderType === 'diagram' ? (
        <>
          <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 70%)' }} />
          <img src={url} alt={alt} className="relative z-10 object-contain max-h-[78%] max-w-[82%]" style={objectPosition ? { objectPosition } : undefined} loading="lazy" />
        </>
      ) : mediaRenderType === 'full-bleed-artwork' ? (
        <img
          src={url}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          style={objectPosition ? { objectPosition } : undefined}
          loading="lazy"
        />
      ) : (
        <>
          {imageMode === 'contain-blur' ? (
            <>
              <div className="absolute inset-0 overflow-hidden z-0">
                <img src={url} alt="" className="w-full h-full object-cover blur-3xl opacity-60 scale-110" aria-hidden="true" />
              </div>
              <img src={url} alt={alt} className="absolute inset-0 z-10 w-full h-full object-contain" style={objectPosition ? { objectPosition } : undefined} loading="lazy" />
            </>
          ) : (
            <img src={url} alt={alt} className="absolute inset-0 z-10 w-full h-full object-cover" style={objectPosition ? { objectPosition } : undefined} loading="lazy" />
          )}
        </>
      )}

      {showCaption && caption && (
        <div className={`absolute ${captionPosClass} z-20 bg-white/90 backdrop-blur-md border border-[#D9DEEA] px-4 py-2 shadow-sm rounded-sm max-w-[80%]`}>
          <span className="text-[9px] md:text-[10px] text-[#050A5C] tracking-widest font-medium uppercase">{caption}</span>
        </div>
      )}
    </div>
  );
}

// ─── INGREDIENT ICON COMPONENTS ──────────────────────────────────────────────

function ExosomeIcon({ active, className = '' }: { active?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={`w-7 h-7 ${className}`} aria-hidden="true">
      {/* Outer pulse ring */}
      <circle cx="14" cy="14" r="12" fill="none" stroke="#D9DEEA" strokeWidth="1" />
      {/* Inner ring */}
      <circle cx="14" cy="14" r="7" fill="none" stroke={active ? '#C8AB6E' : '#050A5C'} strokeWidth="1.2"
        style={{ opacity: active ? 1 : 0.4, transition: 'all 0.4s ease' }} />
      {/* Center dot */}
      <circle cx="14" cy="14" r="2.5" fill={active ? '#C8AB6E' : '#050A5C'}
        style={{ opacity: active ? 1 : 0.5, transition: 'all 0.4s ease' }} />
      {/* Orbit dots */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x = 14 + 10 * Math.cos(rad);
        const y = 14 + 10 * Math.sin(rad);
        return <circle key={i} cx={x} cy={y} r="1" fill={active ? '#C8AB6E' : '#050A5C'} opacity={active ? 0.7 : 0.25} />;
      })}
    </svg>
  );
}

function CollagenIcon({ active, className = '' }: { active?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={`w-7 h-7 ${className}`} aria-hidden="true">
      {/* Wave lines */}
      <path d="M4 14 Q8 10 12 14 Q16 18 20 14 Q22 11 24 14" fill="none"
        stroke={active ? '#C8AB6E' : '#050A5C'} strokeWidth="1.5" strokeLinecap="round"
        style={{ opacity: active ? 1 : 0.5, transition: 'all 0.4s ease' }} />
      {/* Moisture dots */}
      {[7, 14, 21].map((x, i) => (
        <ellipse key={i} cx={x} cy="20" rx="1.5" ry="2"
          fill={active ? '#C8AB6E' : '#D9DEEA'}
          style={{ opacity: active ? 0.8 : 0.4, transition: 'all 0.4s ease' }} />
      ))}
    </svg>
  );
}

function BerryAntioxidantIcon({ active, className = '' }: { active?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={`w-7 h-7 ${className}`} aria-hidden="true">
      {/* Central berry */}
      <circle cx="14" cy="14" r="4" fill={active ? '#C8AB6E' : '#050A5C'}
        style={{ opacity: active ? 1 : 0.5, transition: 'all 0.4s ease' }} />
      {/* Orbit ring */}
      <circle cx="14" cy="14" r="9" fill="none" stroke="#D9DEEA" strokeWidth="0.8" strokeDasharray="2 3" />
      {/* Orbiting dots */}
      {[45, 135, 225, 315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x = 14 + 9 * Math.cos(rad);
        const y = 14 + 9 * Math.sin(rad);
        return <circle key={i} cx={x} cy={y} r="2" fill={active ? '#C8AB6E' : '#050A5C'}
          style={{ opacity: active ? 0.8 : 0.35, transition: 'all 0.4s ease' }} />;
      })}
    </svg>
  );
}

function PeptideChainIcon({ active, className = '' }: { active?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={`w-7 h-7 ${className}`} aria-hidden="true">
      {/* Chain links */}
      {[4, 10, 16, 22].map((x, i) => (
        <circle key={i} cx={x} cy="14" r="2.5" fill="none"
          stroke={active ? '#C8AB6E' : '#050A5C'} strokeWidth="1.2"
          style={{ opacity: active ? 1 : 0.5, transition: 'all 0.4s ease' }} />
      ))}
      {/* Chain connectors */}
      {[7, 13, 19].map((x, i) => (
        <line key={i} x1={x} y1="14" x2={x + 3} y2="14"
          stroke={active ? '#C8AB6E' : '#D9DEEA'} strokeWidth="1"
          style={{ opacity: active ? 0.8 : 0.5 }} />
      ))}
      {/* Signal dot moving along chain */}
      <circle cx="4" cy="14" r="1.5" fill={active ? '#C8AB6E' : '#050A5C'}
        style={{ opacity: active ? 1 : 0.6, transition: 'all 0.4s ease' }} />
    </svg>
  );
}

function HyaluronicHydrationIcon({ active, className = '' }: { active?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={`w-7 h-7 ${className}`} aria-hidden="true">
      {/* Large water drop */}
      <path d="M14 4 C14 4 7 13 7 17 a7 7 0 0 0 14 0 C21 13 14 4 14 4Z" fill="none"
        stroke={active ? '#C8AB6E' : '#050A5C'} strokeWidth="1.3"
        style={{ opacity: active ? 1 : 0.5, transition: 'all 0.4s ease' }} />
      {/* Inner glow dot */}
      <circle cx="14" cy="18" r="2.5" fill={active ? '#C8AB6E' : '#D9DEEA'}
        style={{ opacity: active ? 0.9 : 0.5, transition: 'all 0.4s ease' }} />
      {/* Small satellite drops */}
      <circle cx="8" cy="9" r="1.5" fill={active ? '#C8AB6E' : '#050A5C'}
        style={{ opacity: active ? 0.6 : 0.25 }} />
      <circle cx="20" cy="9" r="1" fill={active ? '#C8AB6E' : '#050A5C'}
        style={{ opacity: active ? 0.5 : 0.2 }} />
    </svg>
  );
}

// ─── INGREDIENT AMBIENT LAYER ─────────────────────────────────────────────────

function IngredientAmbientLayer({ motionStyle = 'elegant-science', reduced = false }: { motionStyle?: string; reduced?: boolean }) {
  if (reduced) return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10" aria-hidden="true">
      {/* Slow outer ring */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[90%] h-[90%] rounded-full border border-[#050A5C]/5"
          style={{ animation: 'luminous-orbit-slow 24s linear infinite' }} />
      </div>
      {/* Medium ring */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[60%] h-[60%] rounded-full border border-[#C8AB6E]/10"
          style={{ animation: 'luminous-orbit-slow 16s linear infinite reverse' }} />
      </div>
      {/* Radial halo */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 60% 40%, rgba(200,171,110,0.06) 0%, transparent 65%)' }} />
      {/* Floating dots */}
      {[...Array(7)].map((_, i) => (
        <div key={i} className="absolute rounded-full bg-[#C8AB6E]"
          style={{
            width: `${3 + (i % 3)}px`,
            height: `${3 + (i % 3)}px`,
            top: `${15 + i * 11}%`,
            left: `${10 + i * 12}%`,
            opacity: 0.15 + (i % 3) * 0.07,
            animation: `luminous-float-${(i % 3) + 1} ${8 + i * 1.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.8}s`
          }}
        />
      ))}
    </div>
  );
}

// ─── AUTO-DETECT ICON TYPE ────────────────────────────────────────────────────

function autoDetectIconType(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('exosome')) return 'exosome';
  if (n.includes('collagen')) return 'collagen';
  if (n.includes('berry')) return 'berry';
  if (n.includes('peptide')) return 'peptide';
  if (n.includes('hyaluron')) return 'hyaluronic';
  return 'exosome';
}

interface ProductLandingPageProps {
  content: ProductLandingContent;
  cosmeticMedia: any;
  canonicalPath: string;
}

const DEFAULT_WHO_NEEDS_SHEER_SET = {
  eyebrow: "WHO NEEDS SHEER SET",
  title: "Ai nên dùng Luminous Sheer Set?",
  note: "* Hiệu quả cảm nhận có thể khác nhau tùy theo tình trạng da và cách sử dụng.",
  description: "Routine phục hồi phù hợp cho làn da cần được chăm sóc dịu nhẹ, bổ sung độ ẩm và hỗ trợ hàng rào bảo vệ sau các bước chăm sóc chuyên sâu.",
  imageCaption: "Dễ dàng duy trì routine phục hồi tại nhà.",
  mediaSlot: "cosmetic-luminous-who-for-image",
  desktopMediaSlot: "cosmetic-luminous-who-for-desktop",
  mobileMediaSlot: "cosmetic-luminous-who-for-mobile",
  desktopImageMode: "cover",
  desktopObjectPosition: "center center",
  mobileObjectPosition: "center top",
  showDescription: true,
  showCaption: true,
  items: [
    { text: "Da bị tác động sau treatment hoặc chăm sóc chuyên sâu", description: "Phù hợp khi da cần routine dịu nhẹ để ổn định lại cảm giác bề mặt." },
    { text: "Da cần bổ sung độ ẩm và cảm giác dễ chịu", description: "Hỗ trợ cảm giác da mềm, ẩm và ít khô căng hơn." },
    { text: "Da khô, thô ráp, cần chăm sóc phục hồi", description: "Giúp routine dưỡng da tại nhà trở nên gọn gàng và dễ duy trì." },
    { text: "Da cần hỗ trợ hàng rào bảo vệ", description: "Tập trung vào cảm giác cân bằng, mềm mại và ổn định hơn." },
    { text: "Người muốn routine phục hồi tại nhà sau spa", description: "Kết nối trải nghiệm chăm sóc chuyên sâu với home-care hằng ngày." }
  ]
};

const DEFAULT_SKIN_BARRIER = {
  eyebrow: "SKIN BARRIER SCIENCE",
  title: "Khoa học hàng rào bảo vệ",
  description: "Hàng rào bảo vệ biểu bì đóng vai trò then chốt trong việc duy trì độ ẩm và ngăn chặn các tác nhân gây hại từ môi trường. Công thức Luminous Sheer Set được thiết kế để hỗ trợ cấu trúc nền tảng này, giúp làn da duy trì trạng thái ổn định và khỏe mạnh.",
  caption: "Skin barrier repair and protection.",
  mediaSlot: "cosmetic-luminous-skin-barrier-image",
  desktopMediaSlot: "cosmetic-luminous-skin-barrier-desktop",
  mobileMediaSlot: "cosmetic-luminous-skin-barrier-mobile",
  desktopImageMode: "cover",
  mediaRenderType: "full-bleed-artwork"
};

const DEFAULT_MG3_PLUS = {
  eyebrow: "EXCLUSIVE TECHNOLOGY",
  title: "Cơ chế MG3-Plus™ đa tầng",
  description: "Cơ chế thẩm thấu đa tầng MG3-Plus™ tạo môi trường thuận lợi để đưa các dưỡng chất phục hồi và độ ẩm xuống sâu bề mặt da. Công nghệ này giúp tối ưu hóa cảm giác dịu nhẹ, hạn chế sự bay hơi ẩm và duy trì độ mềm mại suốt cả ngày.",
  caption: "Advanced MG3-Plus™ delivery system.",
  mediaSlot: "cosmetic-luminous-mg3-plus-image",
  desktopMediaSlot: "cosmetic-luminous-mg3-plus-desktop",
  mobileMediaSlot: "cosmetic-luminous-mg3-plus-mobile",
  desktopImageMode: "contain-blur",
  mediaRenderType: "full-bleed-artwork"
};

const DEFAULT_ACTIVE_INGREDIENTS_MAP = {
  eyebrow: "ACTIVE INGREDIENTS",
  title: "Những thành phần nổi bật trong Luminous Set",
  description: "Luminous Revitalization Sheer Set kết hợp các thành phần chăm sóc da được chọn lọc để hỗ trợ độ ẩm, hàng rào bảo vệ, vẻ mịn màng và cảm giác tươi sáng của làn da.",
  caption: "Ingredient-focused recovery care for luminous, hydrated and resilient skin.",
  mediaSlot: "cosmetic-luminous-active-ingredients-image",
  desktopMediaSlot: "cosmetic-luminous-active-ingredients-desktop",
  mobileMediaSlot: "cosmetic-luminous-active-ingredients-mobile",
  mediaRenderType: "full-bleed-artwork" as const,
  desktopImageMode: "cover" as const,
  mobileImageMode: "cover" as const,
  desktopObjectPosition: "center center",
  mobileObjectPosition: "center top",
  showDescription: true,
  showCaption: true,
  items: [
    { name: "Exosome", englishName: "Exosome", role: "Renewal Appearance Support", description: "Hỗ trợ chăm sóc làn da sau treatment và giúp bề mặt da trông mịn màng hơn.", benefit: "Vẻ ngoài mịn màng, rạng rỡ" },
    { name: "Collagen Water", englishName: "Collagen Water", role: "Hydration & Elasticity Support", description: "Giúp duy trì cảm giác ẩm mượt, mềm mại và hỗ trợ độ đàn hồi bề mặt da.", benefit: "Cấp ẩm và cảm giác căng mịn" },
    { name: "Complex Berry Extracts", englishName: "Complex Berry Extracts", role: "Antioxidant Care", description: "Hỗ trợ chăm sóc làn da trước tác động môi trường và giúp da trông tươi sáng hơn.", benefit: "Hỗ trợ vẻ rạng rỡ" },
    { name: "Complex Peptides", englishName: "Complex Peptides", role: "Barrier & Firmness Support", description: "Hỗ trợ hàng rào bảo vệ và giúp bề mặt da trông săn mịn hơn.", benefit: "Hỗ trợ độ đàn hồi" },
    { name: "Hydrolyzed Hyaluronic Acid", englishName: "Hydrolyzed Hyaluronic Acid", role: "Moisture Retention", description: "Giúp bổ sung cảm giác ẩm mượt, hỗ trợ duy trì độ ẩm và tạo cảm giác da mềm mại hơn.", benefit: "Giữ ẩm và làm mềm da" }
  ]
};

const DEFAULT_USAGE_GUIDE = {
  eyebrow: "VAVAW SHEER SET RITUAL",
  title: "Hướng dẫn sử dụng Luminous Sheer Set",
  description: "Sử dụng theo thứ tự ampoule trước, cream sau để hỗ trợ bổ sung dưỡng chất, khóa ẩm và hoàn thiện routine phục hồi tại nhà.",
  note: "Ban ngày nên hoàn thiện routine bằng kem chống nắng phù hợp.",
  caption: "Simple recovery ritual for daily home-care continuity.",
  setMediaSlot: "cosmetic-luminous-usage-set-image",
  instructionMediaSlot: "cosmetic-luminous-ampoule-instruction-image",
  desktopMediaSlot: "cosmetic-luminous-usage-desktop",
  mobileMediaSlot: "cosmetic-luminous-usage-mobile",
  mediaRenderType: "full-bleed-artwork" as const,
  desktopImageMode: "cover" as const,
  mobileImageMode: "cover" as const,
  desktopObjectPosition: "center center",
  mobileObjectPosition: "center top",
  showDescription: true,
  showNote: true,
  showCaption: true,
  steps: [
    { step: "01", title: "Làm sạch và cân bằng da", description: "Sau bước làm sạch, cân bằng da bằng toner để chuẩn bị bề mặt da cho routine phục hồi.", product: "Prepare", timing: "AM · PM" },
    { step: "02", title: "Thoa CELLUREVIVE Ampoule", description: "Lấy 2–3 giọt ampoule, thoa lần lượt lên trán, hai má và cằm.", product: "CELLUREVIVE Ampoule", timing: "PM preferred", highlight: true },
    { step: "03", title: "Vỗ nhẹ đến khi thẩm thấu", description: "Massage hoặc vỗ nhẹ để ampoule thấm đều, tránh vùng mắt.", product: "Absorption", timing: "30–60s" },
    { step: "04", title: "Khóa ẩm bằng REGENAGLOW NOURISH SHEER CREAM", description: "Thoa một lớp kem mỏng để hỗ trợ duy trì độ ẩm và cảm giác mềm mại.", product: "REGENAGLOW Cream", timing: "AM · PM", highlight: true },
    { step: "05", title: "Layer thêm nếu cần", description: "Khi lớp đầu đã thấm, có thể thoa thêm một lớp mỏng ở vùng da khô hoặc cần chăm sóc nhiều hơn.", product: "Optional Layering", timing: "As needed" }
  ]
};

// ─── BLOCK 5: ACTIVE INGREDIENTS (COMPONENT WITH HOOKS) ──────────────────────

function LuminousActiveIngredientsBlock({
  content,
  cosmeticMedia
}: {
  content: ProductLandingContent;
  cosmeticMedia: any;
}) {
  const rawActiveIng = (content as any).activeIngredientsMap || {};
  const activeIngredients = {
    ...DEFAULT_ACTIVE_INGREDIENTS_MAP,
    ...rawActiveIng,
    showDescription: rawActiveIng.showDescription !== false,
    showCaption: rawActiveIng.showCaption !== false,
    items: Array.isArray(rawActiveIng.items) && rawActiveIng.items.length > 0
      ? rawActiveIng.items
      : DEFAULT_ACTIVE_INGREDIENTS_MAP.items
  };

  const aiDesktopRaw = cosmeticMedia['cosmetic-luminous-active-ingredients-desktop'] || cosmeticMedia[activeIngredients.desktopMediaSlot as string] || cosmeticMedia['cosmetic-luminous-active-ingredients-image'] || cosmeticMedia[activeIngredients.mediaSlot as string] || null;
  const aiDesktopUrl = (typeof aiDesktopRaw === 'string' && aiDesktopRaw.trim() && !aiDesktopRaw.includes('/PASTE')) ? aiDesktopRaw.trim() : null;

  const aiMobileRaw = cosmeticMedia['cosmetic-luminous-active-ingredients-mobile'] || cosmeticMedia[activeIngredients.mobileMediaSlot as string] || cosmeticMedia['cosmetic-luminous-active-ingredients-image'] || cosmeticMedia[activeIngredients.mediaSlot as string] || aiDesktopUrl || null;
  const aiMobileUrl = (typeof aiMobileRaw === 'string' && aiMobileRaw.trim() && !aiMobileRaw.includes('/PASTE')) ? aiMobileRaw.trim() : null;

  // Motion state
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);

  const enableMotion = (activeIngredients as any).enableMotion !== false;
  const autoRotate = (activeIngredients as any).autoRotateIngredients !== false;
  const showIcons = (activeIngredients as any).showIngredientIcons !== false;

  // Check prefers-reduced-motion on mount
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Auto-rotate
  React.useEffect(() => {
    if (!enableMotion || !autoRotate || isPaused || reducedMotion) return;
    const timer = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % activeIngredients.items.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [enableMotion, autoRotate, isPaused, reducedMotion, activeIngredients.items.length]);

  // Icon resolver
  const resolveIcon = (item: any, isActive: boolean) => {
    const iconType = (item as any).iconType || autoDetectIconType(item.name);
    const props = { active: isActive };
    switch (iconType) {
      case 'exosome': return <ExosomeIcon {...props} />;
      case 'collagen': return <CollagenIcon {...props} />;
      case 'berry': return <BerryAntioxidantIcon {...props} />;
      case 'peptide': return <PeptideChainIcon {...props} />;
      case 'hyaluronic': return <HyaluronicHydrationIcon {...props} />;
      default: return <ExosomeIcon {...props} />;
    }
  };

  return (
    <section
      className="bg-white py-20 md:py-28 px-5 md:px-8 border-b border-slate-100"
      data-active-ingredients-desktop-url={aiDesktopUrl || ""}
      data-active-ingredients-mobile-url={aiMobileUrl || ""}
    >
      <style>{`
        @keyframes luminous-orbit-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes luminous-float-1 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes luminous-float-2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes luminous-float-3 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes luminous-pulse-dot {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.3); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*='luminous-orbit-slow'],
          [style*='luminous-float'] {
            animation: none !important;
          }
        }
      `}</style>
      <div className="max-w-[1200px] mx-auto">
        {/* Outer card */}
        <div className="border border-[#D9DEEA] bg-[#F7F8FC] shadow-[0_24px_80px_rgba(5,10,92,0.08)] overflow-hidden rounded-2xl">

          {/* DESKTOP LAYOUT */}
          <div className="hidden md:grid md:grid-cols-[0.46fr_0.54fr]">
            {/* Left: header text + image */}
            <div className="flex flex-col border-r border-[#D9DEEA]">
              {/* Header text */}
              <div className="px-10 pt-12 pb-8">
                {activeIngredients.eyebrow && (
                  <p className="text-[9px] tracking-[0.22em] uppercase font-semibold text-[#050A5C]/50 mb-3">
                    {activeIngredients.eyebrow}
                  </p>
                )}
                {activeIngredients.title && (
                  <h2
                    className="text-[#050A5C] leading-snug mb-3"
                    style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif", fontSize: "clamp(1.35rem, 2vw, 1.875rem)", fontWeight: 600 }}
                  >
                    {activeIngredients.title}
                  </h2>
                )}
                {activeIngredients.showDescription && activeIngredients.description && (
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {activeIngredients.description}
                  </p>
                )}
              </div>
              {/* Image area fills remaining space */}
              <div className="flex-1 relative min-h-[280px]">
                <ScienceMediaBox
                  className="absolute inset-0 hidden md:block"
                  url={aiDesktopUrl}
                  alt={activeIngredients.title || 'Active Ingredients Visual'}
                  caption={activeIngredients.caption}
                  showCaption={false}
                  mediaRenderType={activeIngredients.mediaRenderType}
                  imageMode={activeIngredients.desktopImageMode}
                  objectPosition={activeIngredients.desktopObjectPosition}
                  placeholderLabel="Active Ingredients Visual"
                  captionPosition="bottom-left"
                />
                {/* Ambient overlay on top of image */}
                <IngredientAmbientLayer motionStyle={(activeIngredients as any).motionStyle} reduced={reducedMotion} />
              </div>
              {/* Caption at bottom */}
              {activeIngredients.showCaption && activeIngredients.caption && (
                <div className="px-10 py-4 border-t border-[#D9DEEA]">
                  <p className="text-[9px] tracking-widest uppercase text-[#050A5C]/40 italic">
                    {activeIngredients.caption}
                  </p>
                </div>
              )}
            </div>

            {/* Right: ingredient list */}
            <div className="px-10 py-12">
              {/* Lab ruler line */}
              <div className="flex items-center gap-3 mb-8">
                <div className="flex-1 h-px bg-[#050A5C]/10" />
                <span className="w-2 h-2 rounded-full bg-[#C8AB6E] shrink-0" />
                <div className="flex-1 h-px bg-[#050A5C]/10" />
              </div>
              {activeIngredients.items.map((item: any, i: number) => {
                const isActive = i === activeIdx;
                return (
                  <div
                    key={i}
                    className={`relative pl-6 mb-6 border-l-2 last:mb-0 cursor-pointer transition-all duration-300 ${
                      isActive ? 'border-[#C8AB6E]' : 'border-[#D9DEEA]'
                    }`}
                    onMouseEnter={() => { setActiveIdx(i); setIsPaused(true); }}
                    onMouseLeave={() => setIsPaused(false)}
                  >
                    {/* dot */}
                    <div className={`absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-[#C8AB6E] transition-all duration-300 ${isActive ? 'animate-pulse' : ''}`} />
                    {/* Icon + role label row */}
                    <div className="flex items-center gap-2 mb-1">
                      {showIcons && (
                        <span className="shrink-0">{resolveIcon(item, isActive)}</span>
                      )}
                      <p className={`text-[9px] tracking-[0.2em] uppercase font-medium transition-colors duration-300 ${
                        isActive ? 'text-[#C8AB6E]' : 'text-[#C8AB6E]'
                      }`}>{item.role}</p>
                    </div>
                    {/* name */}
                    <h4 className={`text-sm font-semibold mb-1 transition-colors duration-300 ${
                      isActive ? 'text-[#050A5C]' : 'text-[#050A5C]'
                    }`}>{item.name}</h4>
                    {/* description */}
                    <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                    {/* benefit tag */}
                    {item.benefit && (
                      <span className={`inline-block mt-2 text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm border transition-all duration-300 ${
                        isActive
                          ? 'bg-[#C8AB6E]/10 text-[#050A5C]/80 border-[#C8AB6E]/30'
                          : 'bg-[#050A5C]/5 text-[#050A5C]/60 border-[#050A5C]/10'
                      }`}>{item.benefit}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* MOBILE LAYOUT */}
          <div className="flex flex-col md:hidden">
            {/* Header */}
            <div className="px-5 pt-10 pb-6">
              {activeIngredients.eyebrow && (
                <p className="text-[9px] tracking-[0.22em] uppercase font-semibold text-[#050A5C]/50 mb-3">
                  {activeIngredients.eyebrow}
                </p>
              )}
              {activeIngredients.title && (
                <h2
                  className="text-[#050A5C] leading-snug mb-3"
                  style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif", fontSize: "1.5rem", fontWeight: 600 }}
                >
                  {activeIngredients.title}
                </h2>
              )}
              {activeIngredients.showDescription && activeIngredients.description && (
                <p className="text-sm text-slate-500 leading-relaxed">
                  {activeIngredients.description}
                </p>
              )}
            </div>
            {/* Mobile image full width */}
            <div className="relative w-full" style={{ aspectRatio: '4/5' }}>
              <ScienceMediaBox
                className="absolute inset-0 block md:hidden"
                url={aiMobileUrl}
                alt={activeIngredients.title || 'Active Ingredients Visual'}
                caption={undefined}
                showCaption={false}
                mediaRenderType={activeIngredients.mediaRenderType}
                imageMode={activeIngredients.mobileImageMode}
                objectPosition={activeIngredients.mobileObjectPosition}
                placeholderLabel="Active Ingredients Visual"
                captionPosition="bottom-right"
              />
            </div>
            {/* Ingredient list */}
            <div className="px-5 py-8 space-y-5">
              {activeIngredients.items.map((item: any, i: number) => {
                const isActive = i === activeIdx;
                return (
                  <div
                    key={i}
                    className={`relative pl-6 border-l-2 transition-all duration-300 ${
                      isActive ? 'border-[#C8AB6E]' : 'border-[#D9DEEA]'
                    }`}
                    onTouchStart={() => { setActiveIdx(i); setIsPaused(true); }}
                  >
                    <div className={`absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-[#C8AB6E] transition-all duration-300 ${isActive ? 'animate-pulse' : ''}`} />
                    {/* Icon + role row */}
                    <div className="flex items-center gap-2 mb-1">
                      {showIcons && (
                        <span className="shrink-0">{resolveIcon(item, isActive)}</span>
                      )}
                      <p className="text-[9px] tracking-[0.2em] uppercase text-[#C8AB6E] font-medium">{item.role}</p>
                    </div>
                    <h4 className="text-sm font-semibold text-[#050A5C] mb-1">{item.name}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                    {item.benefit && (
                      <span className={`inline-block mt-2 text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm border transition-all duration-300 ${
                        isActive
                          ? 'bg-[#C8AB6E]/10 text-[#050A5C]/80 border-[#C8AB6E]/30'
                          : 'bg-[#050A5C]/5 text-[#050A5C]/60 border-[#050A5C]/10'
                      }`}>{item.benefit}</span>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Caption */}
            {activeIngredients.showCaption && activeIngredients.caption && (
              <div className="px-5 pb-8">
                <p className="text-[9px] tracking-widest uppercase text-[#050A5C]/40 italic">
                  {activeIngredients.caption}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

function LuminousUsageGuideBlock({
  content,
  cosmeticMedia
}: {
  content: ProductLandingContent;
  cosmeticMedia: any;
}) {
  const rawGuide = (content as any).usageGuide || (content as any).howToUse || {};
  const usageGuide = {
    ...DEFAULT_USAGE_GUIDE,
    ...rawGuide,
    showDescription: rawGuide.showDescription !== false,
    showNote: rawGuide.showNote !== false,
    showCaption: rawGuide.showCaption !== false,
    steps: Array.isArray(rawGuide.steps) && rawGuide.steps.length > 0 ? rawGuide.steps : DEFAULT_USAGE_GUIDE.steps
  };

  const desktopRaw = cosmeticMedia['cosmetic-luminous-usage-desktop'] || cosmeticMedia[usageGuide.desktopMediaSlot as string] || cosmeticMedia['cosmetic-luminous-usage-set-image'] || cosmeticMedia[usageGuide.setMediaSlot as string] || null;
  const desktopUrl = (typeof desktopRaw === 'string' && desktopRaw.trim() && !desktopRaw.includes('/PASTE')) ? desktopRaw.trim() : null;

  const mobileRaw = cosmeticMedia['cosmetic-luminous-usage-mobile'] || cosmeticMedia[usageGuide.mobileMediaSlot as string] || cosmeticMedia['cosmetic-luminous-usage-set-image'] || cosmeticMedia[usageGuide.setMediaSlot as string] || desktopUrl || null;
  const mobileUrl = (typeof mobileRaw === 'string' && mobileRaw.trim() && !mobileRaw.includes('/PASTE')) ? mobileRaw.trim() : null;

  // Render the Block 6 section
  return (
    <section className="bg-[#F8FAFC] py-20 md:py-28 px-5 md:px-8 border-b border-slate-100">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid md:grid-cols-[0.48fr_0.52fr] gap-12 md:gap-20">
          {/* Left Column: Text and Steps */}
          <div className="flex flex-col">
            <div className="mb-12">
               {usageGuide.eyebrow && <p className="text-[9px] tracking-[0.22em] uppercase font-semibold text-[#050A5C]/50 mb-3">{usageGuide.eyebrow}</p>}
               {usageGuide.title && <h2 className="text-[#050A5C] leading-snug mb-4" style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif", fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)", fontWeight: 600 }}>{usageGuide.title}</h2>}
               {usageGuide.showDescription && usageGuide.description && <p className="text-sm text-slate-500 leading-relaxed">{usageGuide.description}</p>}
            </div>
            
            <div className="space-y-8">
              {usageGuide.steps.map((step: any, i: number) => (
                <div key={i} className="relative flex gap-6 group">
                  {/* Vertical Line */}
                  <div className="absolute left-[11px] top-8 bottom-[-24px] w-px bg-[#D9DEEA] last:hidden" />
                  
                  {/* Step Number Circle */}
                  <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border mt-1 transition-colors duration-300 ${step.highlight ? 'bg-[#C8AB6E] border-[#C8AB6E] text-white shadow-[0_0_10px_rgba(200,171,110,0.4)]' : 'bg-white border-[#D9DEEA] text-[#050A5C] group-hover:border-[#C8AB6E] group-hover:text-[#C8AB6E]'}`}>
                    <span className="text-[10px] font-bold tracking-wider">{step.step || `0${i+1}`}</span>
                  </div>
                  
                  {/* Step Content */}
                  <div className="flex-1 pb-2">
                    <h4 className="text-[15px] font-semibold text-[#050A5C] mb-2">{step.title}</h4>
                    {step.description && <p className="text-[13px] text-slate-500 leading-relaxed mb-3">{step.description}</p>}
                    
                    {/* Pills */}
                    {(step.product || step.timing) && (
                      <div className="flex flex-wrap gap-2">
                        {step.product && <span className="inline-flex items-center px-2 py-1 rounded-sm bg-[#050A5C]/5 text-[#050A5C]/70 text-[9px] uppercase tracking-wider font-medium border border-[#050A5C]/10">{step.product}</span>}
                        {step.timing && <span className="inline-flex items-center px-2 py-1 rounded-sm bg-white text-[#C8AB6E] text-[9px] uppercase tracking-wider font-medium border border-[#C8AB6E]/30">{step.timing}</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {usageGuide.showNote && usageGuide.note && (
              <div className="mt-12 bg-white border border-[#D9DEEA] p-5 rounded-lg shadow-sm">
                <p className="text-xs text-slate-500 italic"><span className="font-semibold not-italic text-[#050A5C] mr-2">Note:</span>{usageGuide.note}</p>
              </div>
            )}
          </div>

          {/* Right Column: Visual */}
          <div className="flex flex-col justify-center">
            <div className="relative rounded-2xl overflow-hidden shadow-[0_24px_80px_rgba(5,10,92,0.08)] bg-white border border-[#D9DEEA] aspect-[4/5] md:aspect-auto md:min-h-[600px] w-full">
               {/* Desktop Image */}
               <ScienceMediaBox
                  className="absolute inset-0 hidden md:block"
                  url={desktopUrl}
                  alt={usageGuide.title || 'Usage Guide Visual'}
                  caption={undefined}
                  showCaption={false}
                  mediaRenderType={usageGuide.mediaRenderType}
                  imageMode={usageGuide.desktopImageMode}
                  objectPosition={usageGuide.desktopObjectPosition}
                  placeholderLabel="Usage Guide Visual"
                  captionPosition="bottom-left"
                />
               {/* Mobile Image */}
               <ScienceMediaBox
                  className="absolute inset-0 block md:hidden"
                  url={mobileUrl}
                  alt={usageGuide.title || 'Usage Guide Visual'}
                  caption={undefined}
                  showCaption={false}
                  mediaRenderType={usageGuide.mediaRenderType}
                  imageMode={usageGuide.mobileImageMode}
                  objectPosition={usageGuide.mobileObjectPosition}
                  placeholderLabel="Usage Guide Visual"
                  captionPosition="bottom-right"
                />
            </div>
            {usageGuide.showCaption && usageGuide.caption && (
              <p className="mt-4 text-center text-[10px] tracking-widest uppercase text-[#050A5C]/40 italic">
                {usageGuide.caption}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}


const DEFAULT_LUMINOUS_PRODUCT_DETAIL_FORM_LEGAL = {
  eyebrow: "PRODUCT INFORMATION",
  title: "LUMINOUS REVITALIZATION SHEER SET",
  description: "Thông tin sản phẩm được trình bày để khách hàng tham khảo trước khi nhận tư vấn routine phù hợp.",
  legalInfo: [
    { label: "Tên sản phẩm", value: "LUMINOUS REVITALIZATION SHEER SET" },
    { label: "Đối tượng sử dụng", value: "Phù hợp với tất cả các loại da", highlight: true },
    { label: "Hạn sử dụng sau khi mở nắp", value: "12 tháng." },
    { label: "Hạn sử dụng trước khi mở nắp", value: "Xem ghi chú riêng trên bao bì sản phẩm." },
    { label: "Nhà sản xuất", value: "IRE Cosmetic Co., Ltd." },
    { label: "Đơn vị chịu trách nhiệm phân phối", value: "BRL Company Co., Ltd.", highlight: true },
    { label: "Trung tâm chăm sóc khách hàng", value: "070-7633-0987", highlight: true },
    { label: "Nước sản xuất", value: "Hàn Quốc" },
    {
      label: "Tình trạng phê duyệt mỹ phẩm chức năng của Bộ An toàn Thực phẩm và Dược phẩm Hàn Quốc (MFDS)",
      value: "Có (Mỹ phẩm chức năng kép: Hỗ trợ làm sáng da và hỗ trợ cải thiện nếp nhăn).",
      highlight: true
    },
    {
      label: "Hướng dẫn sử dụng",
      value: "Lấy một lượng sản phẩm vừa đủ, thoa đều lên da theo chiều kết cấu da.",
      highlight: true
    }
  ],
  productItems: [
    {
      name: "Kem dưỡng REGENAGLOW Nourish Sheer Cream",
      volume: "35 ml",
      functionClaim: "Mỹ phẩm chức năng kép: Hỗ trợ làm sáng da & hỗ trợ cải thiện nếp nhăn",
      ingredients: "Nước tinh khiết (Water), Dicaprylyl Carbonate, Caprylic/Capric Triglyceride, 2,3-Butanediol, Glycerin, Polyglyceryl-2 Dipolyhydroxystearate, Polyglyceryl-3 Diisostearate, Niacinamide, 1,2-Hexanediol, Propanediol, Sodium Chloride, Squalane, Dầu hạt nho (Grape Seed Oil), Chiết xuất việt quất Lowbush (Low Sweet Blueberry Extract), Chiết xuất dâu tây (Strawberry Extract), Chiết xuất quả Acai (Acai Berry Fruit Extract), Chiết xuất mâm xôi (Raspberry Extract), Chiết xuất quả Bilberry (Bilberry Fruit Extract), Chiết xuất Lingonberry (Lingonberry Extract), Chiết xuất nam việt quất (Cranberry Extract), Từ ngoại bào tử tế bào mô sẹo Rau Má (Centella Asiatica Callus Extracellular Vesicles), Hydrolyzed Hyaluronic Acid, Hyaluronic Acid, Hydroxypropyltrimonium Hyaluronate, Sodium Hyaluronate, Sodium Acetylated Hyaluronate, Sodium Hyaluronate Crosspolymer, Hydrolyzed Sodium Hyaluronate, Potassium Hyaluronate, Sodium Hyaluronate Dimethylsilanol, Dimethylsilanol Hyaluronate, Adenosine, Xanthan Gum, Disodium EDTA, SH-Oligopeptide-2, SH-Polypeptide-1, RH-Oligopeptide-1, Ethylhexylglycerin."
    },
    {
      name: "Tinh chất CelluRevive Intensive Sheer Ampoule",
      volume: "7 ml × 4 ống",
      functionClaim: "Mỹ phẩm chức năng: Hỗ trợ cải thiện nếp nhăn",
      ingredients: "Nước Collagen (830,000 ppm), Methylpropanediol, Glycerin, Glyceryl Acrylate/Acrylic Acid Copolymer, Sodium Hyaluronate, 1,2-Hexanediol, Túi ngoại bào từ tế bào mô sẹo Rau Má (Centella Asiatica Callus Extracellular Vesicles) (10,000 ppm), SH-Oligopeptide-2, Carbomer, Arginine, Polyglyceryl-10 Laurate, Ethylhexylglycerin, Adenosine, Trisodium EDTA, SH-Polypeptide-1, RH-Oligopeptide-1, Hydrolyzed Hyaluronic Acid, Hyaluronic Acid, Hydroxypropyltrimonium Hyaluronate, Sodium Acetylated Hyaluronate, Sodium Hyaluronate Crosspolymer, Hydrolyzed Sodium Hyaluronate, Potassium Hyaluronate, Sodium Hyaluronate Dimethylsilanol, Dimethylsilanol Hyaluronate, Butylene Glycol."
    }
  ],
  cautions: [
    "Nếu trong hoặc sau khi sử dụng sản phẩm, vùng da sử dụng xuất hiện các dấu hiệu bất thường hoặc tác dụng không mong muốn như nổi mẩn đỏ, sưng tấy, ngứa… do tiếp xúc với ánh nắng trực tiếp, hãy ngừng sử dụng và tham khảo ý kiến bác sĩ hoặc chuyên gia da liễu.",
    "Không sử dụng trên vùng da có vết thương hở.",
    "Bảo quản và lưu ý khi sử dụng: Để xa tầm tay trẻ em.",
    "Bảo quản nơi khô ráo, tránh ánh nắng trực tiếp."
  ],
  storage: "Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp.",
  qualityGuarantee: "Trong trường hợp sản phẩm có lỗi, việc bồi thường sẽ được thực hiện theo Tiêu chuẩn giải quyết tranh chấp người tiêu dùng do Ủy ban Thương mại Công bằng Hàn Quốc ban hành.",
  showDescription: true,
  showLegalInfo: true,
  showProductItems: true,
  showIngredients: true,
  showCautions: true,
  showStorage: true,
  showQualityGuarantee: true
};

function normalizeLuminousProductDetailForm(form: any) {
  if (!form) return DEFAULT_LUMINOUS_PRODUCT_DETAIL_FORM_LEGAL;
  const defaults = DEFAULT_LUMINOUS_PRODUCT_DETAIL_FORM_LEGAL;
  
  const merged = { ...form };
  if (!merged.title) merged.title = defaults.title;
  if (!merged.eyebrow) merged.eyebrow = defaults.eyebrow;
  if (!merged.description) merged.description = defaults.description;

  if (!merged.legalInfo || merged.legalInfo.length === 0) {
    merged.legalInfo = defaults.legalInfo;
  }
  if (!merged.productItems || merged.productItems.length === 0) {
    merged.productItems = defaults.productItems;
  }
  if (!merged.cautions || merged.cautions.length < 4) {
    merged.cautions = defaults.cautions;
  }
  if (!merged.storage) merged.storage = defaults.storage;
  if (!merged.qualityGuarantee) merged.qualityGuarantee = defaults.qualityGuarantee;
  
  if (merged.showDescription === undefined) merged.showDescription = defaults.showDescription;
  if (merged.showLegalInfo === undefined) merged.showLegalInfo = defaults.showLegalInfo;
  if (merged.showProductItems === undefined) merged.showProductItems = defaults.showProductItems;
  if (merged.showIngredients === undefined) merged.showIngredients = defaults.showIngredients;
  if (merged.showCautions === undefined) merged.showCautions = defaults.showCautions;
  if (merged.showStorage === undefined) merged.showStorage = defaults.showStorage;
  if (merged.showQualityGuarantee === undefined) merged.showQualityGuarantee = defaults.showQualityGuarantee;

  return merged;
}

export function LuminousSetLandingPage({ content, cosmeticMedia, canonicalPath }: ProductLandingPageProps) {
  // Helper for rendering slot images safely with a gradient card fallback
  const renderSlotImage = (srcUrl: string | undefined, altText: string, fallbackGrad: string) => {
    if (srcUrl && srcUrl.trim() && !srcUrl.includes('PASTE_')) {
      return (
        <img
          src={srcUrl.trim()}
          alt={altText}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      );
    }
    return (
      <div className={`w-full h-full bg-gradient-to-br ${fallbackGrad} flex items-center justify-center p-4 relative`}>
        <div className="absolute inset-4 border border-white/20" />
        <span className="text-[10px] text-white/50 tracking-widest font-mono uppercase">{altText}</span>
      </div>
    );
  };

  return (
    <div className="cosmetic-typography min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-[#E2E8F0] selection:text-[#050A5C]">
      <ProductJsonLd content={content} canonicalPath={canonicalPath} cosmeticMedia={cosmeticMedia} />
      
      {/* ─── FULL WIDTH PRODUCT HERO ───────────────────────────────────────────── */}
      {(() => {
        const getMediaUrl = (media: unknown): string | null => {
          if (!media) return null;
          if (typeof media === 'string') {
            if (!media.trim() || media.includes('/PASTE')) return null;
            return media.trim();
          }
          if (typeof media === 'object') {
            const candidate =
              (media as any).url ||
              (media as any).publicUrl ||
              (media as any).public_url ||
              (media as any).src ||
              (media as any).href ||
              null;
            if (!candidate || typeof candidate !== 'string') return null;
            if (!candidate.trim() || candidate.includes('/PASTE')) return null;
            return candidate.trim();
          }
          return null;
        };

        const desktopHeroUrl =
          getMediaUrl(cosmeticMedia["cosmetic-luminous-hero-desktop"]) ||
          getMediaUrl((cosmeticMedia as any).luminousHeroDesktop) ||
          getMediaUrl(cosmeticMedia[content.heroDesktopMediaSlot || ""]) ||
          getMediaUrl(cosmeticMedia[content.heroMediaDesktop || ""]) ||
          getMediaUrl(cosmeticMedia["cosmetic-product-luminous-set"]) ||
          getMediaUrl((cosmeticMedia as any).luminousSet);

        const mobileHeroUrl =
          getMediaUrl(cosmeticMedia["cosmetic-luminous-hero-mobile"]) ||
          getMediaUrl((cosmeticMedia as any).luminousHeroMobile) ||
          getMediaUrl(cosmeticMedia[content.heroMobileMediaSlot || ""]) ||
          getMediaUrl(cosmeticMedia[content.heroMediaMobile || ""]) ||
          desktopHeroUrl ||
          getMediaUrl(cosmeticMedia["cosmetic-product-luminous-set"]) ||
          getMediaUrl((cosmeticMedia as any).luminousSet);

        const heroUrl = desktopHeroUrl || mobileHeroUrl;

        return (
          <section
            className="relative w-full overflow-hidden bg-[#050A5C] text-white"
            data-hero-has-url={heroUrl ? "true" : "false"}
            data-hero-desktop-url={desktopHeroUrl || ""}
            data-hero-mobile-url={mobileHeroUrl || ""}
            data-hero-media-keys={Object.keys(cosmeticMedia || {}).join(",")}
          >
            {/* Background Image */}
            {heroUrl ? (
              <picture className="absolute inset-0 z-0 block h-full w-full">
                {mobileHeroUrl && (
                  <source media="(max-width: 767px)" srcSet={mobileHeroUrl} />
                )}
                <img
                  src={heroUrl}
                  alt={content.title || "Luminous Revitalization Sheer Set"}
                  className="h-full w-full object-cover object-center md:object-[center_right] opacity-100"
                  loading="eager"
                  fetchPriority="high"
                />
              </picture>
            ) : (
              <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#050A5C] via-[#0A1172] to-[#101A8C]" />
            )}

            {/* Overlay Layer 1: Left-to-right editorial gradient */}
            <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#050A5C]/[0.78] via-[#050A5C]/[0.42] to-transparent" />
            {/* Overlay Layer 2: Top-bottom vignette */}
            <div className="absolute inset-0 z-[2] bg-gradient-to-t from-[#050A5C]/[0.35] via-transparent to-black/[0.35]" />
            {/* Overlay Layer 3: Subtle cool silver wash */}
            <div className="absolute inset-0 z-[3] bg-white/5 mix-blend-soft-light" />

            {/* Content */}
            <div className="relative z-20 mx-auto flex min-h-[760px] max-w-[1440px] flex-col justify-end px-5 pb-14 pt-32 md:min-h-[840px] md:flex-row md:items-center md:justify-start md:px-12 md:py-28 lg:px-20">
              <div className="max-w-[620px] space-y-6">
              {/* H1 — hero starts cleanly with product title */}
              <h1 className="cosmetic-heading font-semibold text-5xl md:text-6xl lg:text-7xl text-white leading-[1.08] md:leading-[1.02]">
                {content.title}
              </h1>

                {/* Subheadline */}
                {content.headline && (
                  <p className="cosmetic-subheading text-lg md:text-xl text-white/80">
                    {content.headline}
                  </p>
                )}

                {/* Description */}
                <p className="cosmetic-body text-white/[0.68] text-sm md:text-[15px] whitespace-pre-wrap max-w-[560px]">
                  {content.description}
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
                  <CosmeticCtaTracker
                    label={content.ctaLabel}
                    href={content.ctaHref}
                    className="h-[52px] md:h-[56px] min-w-[220px] px-8 flex items-center justify-center bg-white text-[#050A5C] text-[11px] font-bold tracking-[0.15em] uppercase hover:bg-[#F0F4F8] transition-colors rounded-[2px] shadow-md"
                  />
                  <CosmeticCtaTracker
                    label={content.secondaryCtaLabel}
                    href={content.secondaryCtaHref}
                    className="h-[52px] md:h-[56px] min-w-[220px] px-8 flex items-center justify-center border border-white/30 text-white text-[11px] font-medium tracking-[0.12em] uppercase hover:bg-white/10 transition-colors rounded-[2px]"
                  />
                </div>
              </div>
            </div>
          </section>
        );
      })()}
      {/* ─── ANTI-GRAVITY SOLUTION ───────────────────────────────────────────── */}
      {(() => {
        const showHeadline = content.antiGravity?.showHeadline !== false;
        const showDescription = content.antiGravity?.showDescription !== false;
        const firstCalloutY = (showHeadline && showDescription) ? 48 : 42;

        const defaultCallouts = [
          { label: 'Collagen Water', value: 'Hỗ trợ cấp ẩm', x: 18, y: firstCalloutY, align: 'left' },
          { label: 'Exosome', value: 'Hỗ trợ chăm sóc sau treatment', x: 14, y: 60, align: 'left' },
          { label: 'Peptide Complex', value: 'Hỗ trợ hàng rào bảo vệ', x: 22, y: 76, align: 'left' },
          { label: 'Complex Berry Extracts', value: 'Hỗ trợ vẻ rạng rỡ', x: 58, y: 76, align: 'center' },
        ];

        const antiGravity = {
          eyebrow: content.antiGravity?.eyebrow || 'ANTI-GRAVITY SOLUTION',
          title: content.antiGravity?.title || 'Phục hồi cấu trúc da từ nền tảng hàng rào bảo vệ',
          headline: content.antiGravity?.headline || 'Tập trung cải thiện cảm giác săn chắc, ẩm mượt và độ rạng rỡ',
          description: content.antiGravity?.description || 'Công thức tập trung vào phục hồi bề mặt da, hỗ trợ cấp ẩm và truyền tải các hoạt chất quan trọng cho làn da đang cần chăm sóc chuyên sâu.',
          desktopImageMode: content.antiGravity?.desktopImageMode || 'contain-blur',
          mediaSlot: content.antiGravity?.mediaSlot || 'cosmetic-luminous-anti-gravity-image',
          desktopMediaSlot: 'cosmetic-luminous-anti-gravity-desktop',
          mobileMediaSlot: 'cosmetic-luminous-anti-gravity-mobile',
          caption: content.antiGravity?.caption || 'Focused recovery care for barrier, hydration and radiance.',
          callouts: Array.isArray(content.antiGravity?.callouts) && content.antiGravity.callouts.length > 0 
            ? content.antiGravity.callouts 
            : defaultCallouts,
          showHeadline,
          showDescription
        };

        const agImageUrl =
          cosmeticMedia[antiGravity.mediaSlot] ||
          cosmeticMedia["cosmetic-luminous-anti-gravity-image"] ||
          (cosmeticMedia as any).antiGravity ||
          cosmeticMedia.luminousAntiGravityImage;
        const agImgSrc = (typeof agImageUrl === 'string' && agImageUrl.trim() && !agImageUrl.includes('/PASTE')) ? agImageUrl.trim() : null;

        const desktopUrl =
          cosmeticMedia[antiGravity.desktopMediaSlot] ||
          (cosmeticMedia as any).antiGravityDesktop ||
          agImgSrc;
        const mobileUrl =
          cosmeticMedia[antiGravity.mobileMediaSlot] ||
          (cosmeticMedia as any).antiGravityMobile ||
          desktopUrl;

        const finalDesktopUrl = (typeof desktopUrl === 'string' && desktopUrl.trim() && !desktopUrl.includes('/PASTE')) ? desktopUrl.trim() : null;
        const finalMobileUrl = (typeof mobileUrl === 'string' && mobileUrl.trim() && !mobileUrl.includes('/PASTE')) ? mobileUrl.trim() : null;

        return (
          <section className="bg-[#F8FAFC] md:bg-white px-0 md:px-8 py-0 md:py-28">
            <div className="mx-auto max-w-[1200px]">
              <div className="relative overflow-hidden md:border md:border-slate-200 md:bg-[#F5F7FB] md:shadow-sm flex flex-col md:block md:aspect-[1200/760]">
                
                {/* Mobile Image (rendered as img instead of bg for flow) */}
                <div className="relative w-full h-[400px] sm:h-[500px] md:hidden block">
                   {finalMobileUrl ? (
                     <img src={finalMobileUrl} alt={antiGravity.title} className="w-full h-full object-cover" loading="lazy" />
                   ) : (
                     <div className="w-full h-full bg-gradient-to-br from-[#E8ECF4] via-[#F0F2F8] to-[#DDE3EE]" />
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Desktop Image with contain-blur */}
                <div className="absolute inset-0 z-0 hidden md:block">
                  {finalDesktopUrl ? (
                    <>
                      {antiGravity.desktopImageMode === 'contain-blur' ? (
                        <>
                          <div className="absolute inset-0 overflow-hidden">
                            <img src={finalDesktopUrl} alt="" className="w-full h-full object-cover blur-3xl opacity-60 scale-110" aria-hidden="true" />
                          </div>
                          <img src={finalDesktopUrl} alt={antiGravity.title} className="absolute inset-0 w-full h-full object-contain" loading="lazy" />
                        </>
                      ) : (
                        <img src={finalDesktopUrl} alt={antiGravity.title} className="w-full h-full object-cover" loading="lazy" />
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#E8ECF4] via-[#F0F2F8] to-[#DDE3EE]" />
                  )}
                  <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#050A5C]/[0.06] via-transparent to-transparent" />
                </div>

                {/* Top-left soft glass editorial panel */}
                <div className="relative md:absolute md:left-0 md:top-0 z-20 w-full md:w-[54%] bg-[#050A5C]/62 backdrop-blur-md md:border-r md:border-white/18 md:border-b md:border-white/12 bg-gradient-to-br from-[#050A5C]/72 via-[#18246F]/58 to-[#050A5C]/38 px-6 lg:px-12 -mt-10 md:mt-0 pt-10 md:pt-6 pb-8 md:pb-10 rounded-t-3xl md:rounded-none border-t border-white/20 md:border-t-0 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] md:shadow-none">
                  <div className="space-y-3">
                    <span className="cosmetic-kicker text-white/60 block">
                      {antiGravity.eyebrow}
                    </span>
                    <h2 className="cosmetic-heading font-semibold text-2xl md:text-4xl lg:text-5xl text-white leading-[1.08]">
                      {antiGravity.title}
                    </h2>
                    {antiGravity.showHeadline && (
                      <p className="cosmetic-subheading text-[11px] md:text-sm text-white/82">
                        {antiGravity.headline}
                      </p>
                    )}
                    {antiGravity.showDescription && (
                      <p className="cosmetic-body text-[10px] md:text-xs text-white/68 max-w-[480px]">
                        {antiGravity.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Desktop Callouts — positioned over image */}
                {antiGravity.callouts.map((callout: any, idx: number) => {
                  const cx = callout.x ?? [18, 14, 22, 58][idx % 4];
                  const cy = callout.y ?? [firstCalloutY, 60, 76, 76][idx % 4];
                  return (
                    <div
                      key={idx}
                      className="absolute z-30 hidden md:flex items-start gap-2"
                      style={{ left: `${cx}%`, top: `${cy}%` }}
                    >
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#D8A13A] shadow-[0_0_8px_rgba(216,161,58,0.6)]" />
                      <div className={`flex flex-col ${callout.align === 'right' ? 'items-end text-right' : callout.align === 'center' ? 'items-center text-center' : 'items-start text-left'}`}>
                        <span className="cosmetic-kicker inline-block rounded-[3px] bg-[#D8A13A] px-2 py-0.5 text-white shadow-sm">
                          {callout.label}
                        </span>
                        {callout.value && (
                          <span className="cosmetic-body font-medium mt-1 text-[10px] md:text-[11px] text-[#050A5C] bg-white/60 backdrop-blur-sm px-1.5 py-0.5 rounded shadow-sm">
                            {callout.value}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Small caption bottom-right */}
                <div className="absolute bottom-4 right-5 z-20 hidden md:block">
                  <span className="text-[9px] text-[#050A5C]/40 tracking-wider font-medium italic">
                    {antiGravity.caption}
                  </span>
                </div>
              </div>

              {/* Mobile Callouts — stacked chips below image/panel */}
              {antiGravity.callouts.length > 0 && (
                <div className="grid grid-cols-1 gap-3 p-4 bg-transparent md:hidden">
                  {antiGravity.callouts.map((callout: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5 rounded-xl border border-slate-200/60 bg-white p-3.5 shadow-sm">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#D8A13A]" />
                      <div>
                        <span className="cosmetic-kicker block text-[#050A5C]">{callout.label}</span>
                        {callout.value && (
                          <span className="cosmetic-body font-medium block text-[10px] text-slate-500 mt-0.5">{callout.value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Small caption bottom-right for mobile */}
                  <div className="mt-2 text-right">
                    <span className="text-[9px] text-[#050A5C]/40 tracking-wider font-medium italic">
                      {antiGravity.caption}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </section>
        );
      })()}

      {/* ─── WHO NEEDS SHEER SET ──────────────────────────────────────────────── */}
      {(() => {
        const rawWhoNeeds = content.whoNeedsSheerSet || {};
        const whoNeeds = { ...DEFAULT_WHO_NEEDS_SHEER_SET, ...rawWhoNeeds };
        whoNeeds.items = Array.isArray(rawWhoNeeds.items) && rawWhoNeeds.items.length > 0 ? rawWhoNeeds.items : DEFAULT_WHO_NEEDS_SHEER_SET.items;

        const showNote = rawWhoNeeds.showNote !== false;
        const showDescription = rawWhoNeeds.showDescription !== false;
        const showImageCaption = rawWhoNeeds.showImageCaption !== false;

        const desktopUrl =
          cosmeticMedia[whoNeeds.desktopMediaSlot] ||
          cosmeticMedia[whoNeeds.mediaSlot] ||
          cosmeticMedia['cosmetic-luminous-who-for-image'];
        const mobileUrl =
          cosmeticMedia[whoNeeds.mobileMediaSlot] ||
          desktopUrl;

        const finalDesktopUrl = (typeof desktopUrl === 'string' && desktopUrl.trim() && !desktopUrl.includes('/PASTE')) ? desktopUrl.trim() : null;
        const finalMobileUrl = (typeof mobileUrl === 'string' && mobileUrl.trim() && !mobileUrl.includes('/PASTE')) ? mobileUrl.trim() : null;

        return (
          <section className="bg-white px-4 py-14 md:px-8 md:py-28">
            <div className="mx-auto max-w-[1200px]">
              <div className="flex flex-col md:grid md:min-h-[760px] md:grid-cols-[0.48fr_0.52fr] overflow-hidden border border-[#D9DEEA] bg-[#F7F8FC] shadow-[0_24px_80px_rgba(5,10,92,0.08)]">
                {/* Left Panel: Text + Checklist */}
                <div className="flex flex-col justify-center px-6 py-12 md:px-14 lg:px-20 md:py-20">
                  <div className="space-y-10">
                    <div className="space-y-4">
                      {whoNeeds.eyebrow && (
                        <span className="cosmetic-kicker text-[#050A5C]/60 block">
                          {whoNeeds.eyebrow}
                        </span>
                      )}
                      {whoNeeds.title && (
                        <h2 className="cosmetic-heading text-3xl md:text-4xl text-[#050A5C] leading-[1.15]">
                          {whoNeeds.title}
                        </h2>
                      )}
                      {showNote && whoNeeds.note && (
                        <p className="cosmetic-subheading text-sm md:text-[15px] text-[#050A5C]/80 border-l-2 border-[#D8A13A] pl-4 py-1 mt-6">
                          {whoNeeds.note}
                        </p>
                      )}
                      {showDescription && whoNeeds.description && (
                        <p className="cosmetic-body text-slate-500 text-sm whitespace-pre-wrap pt-2">
                          {whoNeeds.description}
                        </p>
                      )}
                    </div>

                    {whoNeeds.items && whoNeeds.items.length > 0 && (
                      <div className="flex flex-col gap-4">
                        {whoNeeds.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-start gap-4 bg-white p-4 md:p-5 border border-slate-200/60 shadow-[0_4px_20px_rgba(5,10,92,0.04)]">
                            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center border border-[#D8A13A]/60 bg-white text-[#D8A13A] text-xs">✓</span>
                            <div>
                              <p className="cosmetic-body text-sm text-[#050A5C]">{item.text}</p>
                              {item.description && <p className="cosmetic-body text-xs text-slate-500 mt-1">{item.description}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Panel: Image */}
                <div className="relative w-full aspect-[3/4] md:aspect-auto md:h-full bg-[#E8ECF4]">
                  {/* Mobile Image */}
                  <div className="absolute inset-0 w-full h-full md:hidden">
                    {finalMobileUrl ? (
                      <img src={finalMobileUrl} alt={whoNeeds.title} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#E8ECF4] via-[#F0F2F8] to-[#DDE3EE]" />
                    )}
                  </div>

                  {/* Desktop Image */}
                  <div className="absolute inset-0 w-full h-full hidden md:block">
                    {finalDesktopUrl ? (
                      <>
                        {whoNeeds.desktopImageMode === 'contain-blur' ? (
                          <>
                            <div className="absolute inset-0 overflow-hidden">
                              <img src={finalDesktopUrl} alt="" className="w-full h-full object-cover blur-3xl opacity-60 scale-110" aria-hidden="true" />
                            </div>
                            <img src={finalDesktopUrl} alt={whoNeeds.title} className="absolute inset-0 w-full h-full object-contain" loading="lazy" />
                          </>
                        ) : (
                          <img src={finalDesktopUrl} alt={whoNeeds.title} className="w-full h-full object-cover" loading="lazy" />
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#E8ECF4] via-[#F0F2F8] to-[#DDE3EE]" />
                    )}
                  </div>

                  {/* Image Caption */}
                  {showImageCaption && whoNeeds.imageCaption && (
                    <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 z-10 max-w-[80%]">
                      <div className="bg-white/90 backdrop-blur-md border border-white/20 px-4 py-2.5 shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
                        <span className="text-[#050A5C] text-[9px] md:text-[10px] tracking-widest font-semibold uppercase">{whoNeeds.imageCaption}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* ─── SKIN BARRIER & MG3-PLUS TECHNOLOGY ───────────────────────────────── */}
      {(() => {
        const rawSkinBarrier = content.skinBarrier || {};
        const skinBarrier = { ...DEFAULT_SKIN_BARRIER, ...rawSkinBarrier };
        const showSbDesc = rawSkinBarrier.showDescription !== false;
        const showSbCaption = rawSkinBarrier.showCaption !== false;

        const sbDesktopRaw = cosmeticMedia[skinBarrier.desktopMediaSlot as string] || cosmeticMedia['cosmetic-luminous-skin-barrier-desktop'] || cosmeticMedia[skinBarrier.mediaSlot as string] || cosmeticMedia['cosmetic-luminous-skin-barrier-image'] || null;
        const sbFinalDesktopUrl = (typeof sbDesktopRaw === 'string' && sbDesktopRaw.trim() && !sbDesktopRaw.includes('/PASTE')) ? sbDesktopRaw.trim() : null;

        const sbMobileRaw = cosmeticMedia[skinBarrier.mobileMediaSlot as string] || cosmeticMedia['cosmetic-luminous-skin-barrier-mobile'] || cosmeticMedia[skinBarrier.mediaSlot as string] || cosmeticMedia['cosmetic-luminous-skin-barrier-image'] || sbFinalDesktopUrl || null;
        const sbFinalMobileUrl = (typeof sbMobileRaw === 'string' && sbMobileRaw.trim() && !sbMobileRaw.includes('/PASTE')) ? sbMobileRaw.trim() : null;

        const rawMg3 = content.mg3Plus || {};
        const mg3 = { ...DEFAULT_MG3_PLUS, ...rawMg3 };
        const showMg3Desc = rawMg3.showDescription !== false;
        const showMg3Caption = rawMg3.showCaption !== false;

        const mg3DesktopRaw = cosmeticMedia[mg3.desktopMediaSlot as string] || cosmeticMedia['cosmetic-luminous-mg3-plus-desktop'] || cosmeticMedia[mg3.mediaSlot as string] || cosmeticMedia['cosmetic-luminous-mg3-plus-image'] || null;
        const mg3FinalDesktopUrl = (typeof mg3DesktopRaw === 'string' && mg3DesktopRaw.trim() && !mg3DesktopRaw.includes('/PASTE')) ? mg3DesktopRaw.trim() : null;

        const mg3MobileRaw = cosmeticMedia[mg3.mobileMediaSlot as string] || cosmeticMedia['cosmetic-luminous-mg3-plus-mobile'] || cosmeticMedia[mg3.mediaSlot as string] || cosmeticMedia['cosmetic-luminous-mg3-plus-image'] || mg3FinalDesktopUrl || null;
        const mg3FinalMobileUrl = (typeof mg3MobileRaw === 'string' && mg3MobileRaw.trim() && !mg3MobileRaw.includes('/PASTE')) ? mg3MobileRaw.trim() : null;

        return (
          <section 
            className="bg-slate-50/50 py-16 md:py-24 px-6 border-b border-slate-100"
            data-skin-barrier-desktop-url={sbFinalDesktopUrl || ""}
            data-skin-barrier-mobile-url={sbFinalMobileUrl || ""}
            data-skin-barrier-render-type={skinBarrier.mediaRenderType || 'diagram'}
            data-mg3-plus-desktop-url={mg3FinalDesktopUrl || ""}
            data-mg3-plus-mobile-url={mg3FinalMobileUrl || ""}
            data-mg3-render-type={mg3.mediaRenderType || 'diagram'}
          >
            <div className="max-w-[1200px] mx-auto space-y-12 md:space-y-20">
              
              {/* Panel 1: Skin Barrier (Text Left, Image Right) md:grid-cols-[0.44fr_0.56fr] */}
              <div className="flex flex-col md:grid md:grid-cols-[0.44fr_0.56fr] overflow-hidden border border-[#D9DEEA] bg-[#F7F8FC] rounded-2xl shadow-[0_24px_80px_rgba(5,10,92,0.06)]">
                {/* Text Content */}
                <div className="flex flex-col justify-center px-6 py-10 md:px-14 md:py-20">
                  <div className="space-y-5">
                    {skinBarrier.eyebrow && (
                      <span className="cosmetic-kicker block">
                        <span className="text-[#050A5C]/30 mr-3">01</span>
                        <span className="text-[#050A5C]/60">{skinBarrier.eyebrow}</span>
                      </span>
                    )}
                    {skinBarrier.title && (
                      <h3 className="cosmetic-heading text-2xl md:text-3.5xl text-[#050A5C] leading-tight">
                        {skinBarrier.title}
                      </h3>
                    )}
                    {showSbDesc && skinBarrier.description && (
                      <p className="cosmetic-body text-slate-500 text-sm whitespace-pre-wrap pt-2">
                        {skinBarrier.description}
                      </p>
                    )}
                  </div>
                </div>
                {/* Image */}
                <div className="relative aspect-[4/5] md:aspect-auto md:h-full md:min-h-[420px] bg-slate-50 border-t md:border-t-0 md:border-l border-[#D9DEEA]/50">
                  {/* Mobile Image */}
                  <ScienceMediaBox
                    className="absolute inset-0 block md:hidden"
                    url={sbFinalMobileUrl}
                    alt={skinBarrier.title || 'Skin Barrier Visual'}
                    caption={skinBarrier.caption}
                    showCaption={showSbCaption}
                    mediaRenderType={(skinBarrier as any).mediaRenderType || 'diagram'}
                    imageMode={(skinBarrier as any).mobileImageMode || (skinBarrier as any).imageMode || 'cover'}
                    placeholderLabel="Skin Barrier Visual"
                    captionPosition="bottom-right"
                  />
                  {/* Desktop Image */}
                  <ScienceMediaBox
                    className="absolute inset-0 hidden md:block"
                    url={sbFinalDesktopUrl}
                    alt={skinBarrier.title || 'Skin Barrier Visual'}
                    caption={skinBarrier.caption}
                    showCaption={showSbCaption}
                    mediaRenderType={(skinBarrier as any).mediaRenderType || 'diagram'}
                    imageMode={(skinBarrier as any).desktopImageMode || (skinBarrier as any).imageMode || 'cover'}
                    placeholderLabel="Skin Barrier Visual"
                    captionPosition="bottom-right"
                  />
                </div>
              </div>

              {/* Panel 2: MG3-Plus (Image Left, Text Right) md:grid-cols-[0.56fr_0.44fr] */}
              <div className="flex flex-col-reverse md:grid md:grid-cols-[0.56fr_0.44fr] overflow-hidden border border-[#D9DEEA] bg-[#F7F8FC] rounded-2xl shadow-[0_24px_80px_rgba(5,10,92,0.06)]">
                {/* Image */}
                <div className="relative aspect-[4/5] md:aspect-auto md:h-full md:min-h-[420px] bg-slate-50 border-t md:border-t-0 md:border-r border-[#D9DEEA]/50">
                  {/* Mobile Image */}
                  <ScienceMediaBox
                    className="absolute inset-0 block md:hidden"
                    url={mg3FinalMobileUrl}
                    alt={mg3.title || 'MG3-Plus Visual'}
                    caption={mg3.caption}
                    showCaption={showMg3Caption}
                    mediaRenderType={(mg3 as any).mediaRenderType || 'diagram'}
                    imageMode={(mg3 as any).mobileImageMode || (mg3 as any).imageMode || 'cover'}
                    placeholderLabel="MG3-Plus Visual"
                    captionPosition="bottom-left"
                  />
                  {/* Desktop Image */}
                  <ScienceMediaBox
                    className="absolute inset-0 hidden md:block"
                    url={mg3FinalDesktopUrl}
                    alt={mg3.title || 'MG3-Plus Visual'}
                    caption={mg3.caption}
                    showCaption={showMg3Caption}
                    mediaRenderType={(mg3 as any).mediaRenderType || 'diagram'}
                    imageMode={(mg3 as any).desktopImageMode || (mg3 as any).imageMode || 'cover'}
                    placeholderLabel="MG3-Plus Visual"
                    captionPosition="bottom-left"
                  />
                </div>
                {/* Text Content */}
                <div className="flex flex-col justify-center px-6 py-10 md:px-14 md:py-20">
                  <div className="space-y-5">
                    {mg3.eyebrow && (
                      <div className="inline-flex items-center gap-2">
                        <span className="cosmetic-kicker block">
                          <span className="text-[#050A5C]/30 mr-3">02</span>
                          <span className="text-[#050A5C]/60">{mg3.eyebrow}</span>
                        </span>
                        <span className="bg-yellow-100 text-yellow-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Exclusive
                        </span>
                      </div>
                    )}
                    {mg3.title && (
                      <h3 className="cosmetic-heading text-2xl md:text-3.5xl text-[#050A5C] leading-tight">
                        {mg3.title}
                      </h3>
                    )}
                    {showMg3Desc && mg3.description && (
                      <p className="cosmetic-body text-slate-500 text-sm whitespace-pre-wrap pt-2">
                        {mg3.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </section>
        );
      })()}

      {/* ─── BLOCK 5: ACTIVE INGREDIENTS ───────────────────────────────────────── */}
      <LuminousActiveIngredientsBlock content={content} cosmeticMedia={cosmeticMedia} />

      {/* ─── BLOCK 6: HOW TO USE ───────────────────────────────────────────────── */}
      <LuminousUsageGuideBlock content={content} cosmeticMedia={cosmeticMedia} />

      {/* ─── PRODUCT DETAIL & COMPLIANCE FORM ─────────────────────────────────── */}
      {content.productDetailForm && (
        <ProductDetailForm productDetailForm={normalizeLuminousProductDetailForm(content.productDetailForm)} cosmeticMedia={cosmeticMedia} />
      )}

      {/* ─── OFFLINE BRIDGE BANNER ────────────────────────────────────────────── */}
      {(() => {
        const offlineSettings = {
          show: content.productDetailForm?.offlineShow !== false,
          desktopMediaSlot: content.productDetailForm?.offlineDesktopMediaSlot || "cosmetic-luminous-offline-experience-image",
          mobileMediaSlot: content.productDetailForm?.offlineMobileMediaSlot || "cosmetic-luminous-offline-experience-mobile",
          desktopImageMode: content.productDetailForm?.offlineDesktopImageMode || "cover",
          mobileImageMode: content.productDetailForm?.offlineMobileImageMode || "cover",
          desktopObjectPosition: content.productDetailForm?.offlineDesktopObjectPosition || "center center",
          mobileObjectPosition: content.productDetailForm?.offlineMobileObjectPosition || "center center",
          textAlign: content.productDetailForm?.offlineTextAlign || "left",
          overlayStrength: content.productDetailForm?.offlineOverlayStrength || "medium",
          title: content.productDetailForm?.offlineTitle,
          description: content.productDetailForm?.offlineDescription
        };

        const offlineDesktopRaw = cosmeticMedia["cosmetic-luminous-offline-experience-image"] || cosmeticMedia["cosmetic-luminous-offline-experience-desktop"] || cosmeticMedia[offlineSettings.desktopMediaSlot] || cosmeticMedia[content.productDetailForm?.offlineMediaSlot as string] || null;
        const offlineDesktopUrl = (typeof offlineDesktopRaw === 'string' && offlineDesktopRaw.trim() && !offlineDesktopRaw.includes('/PASTE')) ? offlineDesktopRaw.trim() : null;

        const offlineMobileRaw = cosmeticMedia["cosmetic-luminous-offline-experience-mobile"] || cosmeticMedia[offlineSettings.mobileMediaSlot] || cosmeticMedia["cosmetic-luminous-offline-experience-image"] || cosmeticMedia[content.productDetailForm?.offlineMediaSlot as string] || offlineDesktopUrl || null;
        const offlineMobileUrl = (typeof offlineMobileRaw === 'string' && offlineMobileRaw.trim() && !offlineMobileRaw.includes('/PASTE')) ? offlineMobileRaw.trim() : null;

        return offlineSettings.show && offlineSettings.title && (
          <section 
            className="px-5 py-16 md:px-8 md:py-24"
            data-offline-bridge-has-image={!!(offlineDesktopUrl || offlineMobileUrl)}
            data-offline-bridge-slot={offlineSettings.desktopMediaSlot}
          >
            {/* Desktop Banner */}
            <div
              className="relative mx-auto w-full max-w-[1200px] overflow-hidden rounded-[28px] border border-[#D9DEEA] shadow-[0_30px_90px_rgba(5,10,92,0.14)] hidden md:block"
              data-offline-bridge-desktop-url={offlineDesktopUrl || ""}
              style={{
                minHeight: "680px",
                backgroundImage: offlineDesktopUrl
                  ? `linear-gradient(180deg, rgba(5,10,92,0.58) 0%, rgba(5,10,92,0.32) 34%, rgba(5,10,92,0.08) 68%), url(${offlineDesktopUrl})`
                  : "linear-gradient(135deg, #050A5C 0%, #8E97B8 100%)",
                backgroundSize: "cover",
                backgroundPosition: offlineSettings.desktopObjectPosition || "center center",
                backgroundRepeat: "no-repeat"
              }}
            >
              <div className="relative z-10 flex min-h-[680px] items-start px-10 py-12 md:px-14 md:py-14">
                <div className={`max-w-[560px] ${offlineSettings.textAlign === 'center' ? 'mx-auto text-center' : 'text-left'}`}>
                  <h3 className="text-3xl md:text-4xl font-serif leading-tight text-white drop-shadow-sm mb-5" style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif", fontWeight: 600 }}>
                    {offlineSettings.title}
                  </h3>
                  {offlineSettings.description && (
                    <p className="mt-4 text-sm md:text-base leading-7 text-white/85 drop-shadow-sm">
                      {offlineSettings.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Banner */}
            <div
              className="relative mx-auto w-full overflow-hidden rounded-[24px] border border-[#D9DEEA] block md:hidden"
              data-offline-bridge-mobile-url={offlineMobileUrl || ""}
              style={{
                minHeight: "620px",
                backgroundImage: offlineMobileUrl
                  ? `linear-gradient(180deg, rgba(5,10,92,0.68) 0%, rgba(5,10,92,0.28) 42%, rgba(5,10,92,0.08) 100%), url(${offlineMobileUrl})`
                  : "linear-gradient(135deg, #050A5C 0%, #8E97B8 100%)",
                backgroundSize: "cover",
                backgroundPosition: offlineSettings.mobileObjectPosition || "center top",
                backgroundRepeat: "no-repeat"
              }}
            >
              <div className="relative z-10 px-6 py-8">
                <div className={`max-w-[100%] ${offlineSettings.textAlign === 'center' ? 'mx-auto text-center' : 'text-left'}`}>
                  <h3 className="text-3xl font-serif leading-tight text-white drop-shadow-sm mb-4" style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif", fontWeight: 600 }}>
                    {offlineSettings.title}
                  </h3>
                  {offlineSettings.description && (
                    <p className="text-sm leading-6 text-white/85 drop-shadow-sm">
                      {offlineSettings.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* ─── FINAL CTA ─────────────────────────────────────────────────────────── */}
      <section className="bg-[#050A5C] py-20 md:py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,10,92,0.15)_100%)] pointer-events-none" />
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <span className="cosmetic-kicker text-white/50 block">VAVAW COSMETIC CONSULTATION</span>
          <h2 className="cosmetic-heading text-2xl md:text-3.5xl text-white leading-snug">
            {content.finalCta.title}
          </h2>
          <p className="cosmetic-body text-white/70 text-xs md:text-sm max-w-xl mx-auto">
            {content.finalCta.description}
          </p>
          <div className="pt-4">
            <CosmeticCtaTracker
              label={content.finalCta.ctaLabel}
              href={content.finalCta.ctaHref}
              className="inline-flex h-[48px] px-8 items-center justify-center bg-white text-[#050A5C] text-[11px] font-bold tracking-[0.15em] uppercase hover:bg-[#F4F7FB] transition-colors shadow-sm rounded-[1px]"
            />
          </div>
        </div>
      </section>

      {/* ─── SHARED FOOTER ────────────────────────────────────────────────────── */}
      <SiteFooter variant="cosmetic" />
    </div>
  );
}
