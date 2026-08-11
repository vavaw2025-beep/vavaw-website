import { ShieldCheck, ChevronRight, ArrowRight, Check, ChevronDown, Droplets, Shield, Sparkles } from 'lucide-react';
import { CosmeticCtaTracker } from '../../cosmetic-tracker';
import { SiteFooter } from '@vavaw/ui';
import { ProductLandingContent } from '../_components/product-landing-types';
import { ProductDetailForm } from '../_components/ProductDetailForm';

import { ProductJsonLd } from '../_components/ProductJsonLd';

interface ProductLandingPageProps {
  content: ProductLandingContent;
  cosmeticMedia: any;
  canonicalPath: string;
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
                {/* Breadcrumb */}
                <nav className="flex items-center gap-1.5 text-[9px] md:text-[11px] text-white/50 font-medium uppercase tracking-[0.15em]">
                  <a href="/cosmetic" className="hover:text-white/80 transition-colors">Cosmetic</a>
                  <ChevronRight className="h-3 w-3 shrink-0" />
                  <span className="text-white/70 font-semibold truncate max-w-[180px] md:max-w-none">
                    <span className="md:hidden">Luminous Set</span>
                    <span className="hidden md:inline">{content.title}</span>
                  </span>
                </nav>

                {/* Eyebrow */}
                <span className="cosmetic-kicker text-white/60 block">
                  {content.eyebrow}
                </span>

                {/* H1 */}
                <h1 className="cosmetic-heading text-3xl md:text-5xl lg:text-[3.5rem] text-white leading-[0.98] md:leading-[1.02]">
                  {content.title}
                </h1>

                {/* Subheadline */}
                {content.headline && (
                  <p className="cosmetic-subheading text-base md:text-lg lg:text-xl text-white/80">
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
        const defaultCallouts = [
          { label: 'Collagen Water', value: 'Hỗ trợ cấp ẩm', x: 18, y: 42, align: 'left' },
          { label: 'Exosome', value: 'Hỗ trợ chăm sóc sau treatment', x: 14, y: 60, align: 'left' },
          { label: 'Peptide Complex', value: 'Hỗ trợ hàng rào bảo vệ', x: 22, y: 76, align: 'left' },
          { label: 'Complex Berry Extracts', value: 'Hỗ trợ vẻ rạng rỡ', x: 58, y: 76, align: 'center' },
        ];

        const antiGravity = {
          eyebrow: content.antiGravity?.eyebrow || 'ANTI-GRAVITY SOLUTION',
          title: content.antiGravity?.title || 'Phục hồi cấu trúc da từ nền tảng hàng rào bảo vệ',
          headline: content.antiGravity?.headline || 'Tập trung cải thiện cảm giác săn chắc, ẩm mượt và độ rạng rỡ',
          description: content.antiGravity?.description || 'Công thức tập trung vào phục hồi bề mặt da, hỗ trợ cấp ẩm và truyền tải các hoạt chất quan trọng cho làn da đang cần chăm sóc chuyên sâu.',
          mediaSlot: content.antiGravity?.mediaSlot || 'cosmetic-luminous-anti-gravity-image',
          caption: content.antiGravity?.caption || 'Focused recovery care for barrier, hydration and radiance.',
          callouts: Array.isArray(content.antiGravity?.callouts) && content.antiGravity.callouts.length > 0 
            ? content.antiGravity.callouts 
            : defaultCallouts
        };

        const agImageUrl =
          cosmeticMedia[antiGravity.mediaSlot] ||
          cosmeticMedia["cosmetic-luminous-anti-gravity-image"] ||
          (cosmeticMedia as any).antiGravity ||
          cosmeticMedia.luminousAntiGravityImage;

        const agImgSrc = (typeof agImageUrl === 'string' && agImageUrl.trim() && !agImageUrl.includes('/PASTE')) ? agImageUrl.trim() : null;

        return (
          <section className="bg-white px-5 py-20 md:px-8 md:py-28">
            <div className="mx-auto max-w-[1200px]">
              <div className="relative overflow-hidden border border-slate-200 bg-[#F5F7FB] shadow-sm" style={{ aspectRatio: '1200 / 760' }}>

                {/* Background Image */}
                {agImgSrc ? (
                  <img
                    src={agImgSrc}
                    alt={antiGravity.title}
                    className="absolute inset-0 z-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#E8ECF4] via-[#F0F2F8] to-[#DDE3EE]" />
                )}

                {/* Subtle image overlay for text readability */}
                <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#050A5C]/[0.06] via-transparent to-transparent" />

                {/* Top-left text band — navy translucent like Korean reference */}
                <div className="absolute left-0 top-0 z-20 w-full md:w-[54%] bg-[#050A5C]/[0.72] backdrop-blur-sm px-6 py-6 lg:px-12 lg:py-10">
                  <div className="space-y-3">
                    <span className="cosmetic-kicker text-white/60 block">
                      {antiGravity.eyebrow}
                    </span>
                    <h2 className="cosmetic-heading text-lg md:text-2xl lg:text-[1.7rem] text-white leading-[1.15]">
                      {antiGravity.title}
                    </h2>
                    <p className="cosmetic-subheading text-[11px] md:text-sm text-white/75">
                      {antiGravity.headline}
                    </p>
                    <p className="cosmetic-body text-[10px] md:text-xs text-white/55 max-w-[480px]">
                      {antiGravity.description}
                    </p>
                  </div>
                </div>

                {/* Desktop Callouts — positioned over image */}
                {antiGravity.callouts.map((callout: any, idx: number) => {
                  const cx = callout.x ?? [18, 14, 22, 58][idx % 4];
                  const cy = callout.y ?? [42, 60, 76, 76][idx % 4];
                  return (
                    <div
                      key={idx}
                      className="absolute z-30 hidden md:flex items-start gap-2"
                      style={{ left: `${cx}%`, top: `${cy}%` }}
                    >
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#F3A712] shadow-sm" />
                      <div className={`flex flex-col ${callout.align === 'right' ? 'items-end text-right' : callout.align === 'center' ? 'items-center text-center' : 'items-start text-left'}`}>
                        <span className="inline-block rounded-[3px] bg-[#F3A712] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">
                          {callout.label}
                        </span>
                        {callout.value && (
                          <span className="mt-1 text-[10px] md:text-[11px] font-semibold text-[#050A5C] drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
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

              {/* Mobile Callouts — stacked chips below image */}
              {antiGravity.callouts.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-3 md:hidden">
                  {antiGravity.callouts.map((callout: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#F3A712]" />
                      <div>
                        <span className="block text-[10px] font-bold text-[#050A5C] uppercase tracking-wider">{callout.label}</span>
                        {callout.value && (
                          <span className="block text-[10px] font-light text-slate-500 leading-snug mt-0.5">{callout.value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        );
      })()}

      {/* ─── WHO NEEDS SHEER SET ──────────────────────────────────────────────── */}
      {content.whoNeedsSet && (
        <section className="bg-white py-16 md:py-24 px-6 border-b border-slate-100">
          <div className="max-w-[1200px] mx-auto lg:px-8 grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-10 items-center">
            {/* Left Column: Text + Checklist */}
            <div className="space-y-10">
              <div className="space-y-4">
                {content.whoNeedsSet.eyebrow && (
                  <span className="cosmetic-kicker text-[#050A5C]/60 block">
                    {content.whoNeedsSet.eyebrow}
                  </span>
                )}
                {content.whoNeedsSet.title && (
                  <h2 className="cosmetic-heading text-2xl md:text-3.5xl text-[#050A5C] leading-tight">
                    {content.whoNeedsSet.title}
                  </h2>
                )}
                {content.whoNeedsSet.note && (
                  <p className="cosmetic-subheading text-xs md:text-sm text-[#050A5C]/80 bg-slate-50 border-l-2 border-[#050A5C]/20 p-3">
                    {content.whoNeedsSet.note}
                  </p>
                )}
                {content.whoNeedsSet.description && (
                  <p className="cosmetic-body text-slate-500 text-sm whitespace-pre-wrap pt-2">
                    {content.whoNeedsSet.description}
                  </p>
                )}
              </div>

              {content.whoNeedsSet.items && content.whoNeedsSet.items.length > 0 && (
                <div className="space-y-4 pt-2">
                  {content.whoNeedsSet.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <ShieldCheck className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                      <span className="cosmetic-body text-xs md:text-sm text-slate-600">{item.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Large Image Stage */}
            <div className="relative aspect-[4/3] md:aspect-[3/2] lg:aspect-auto lg:h-[550px] bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center p-4">
              {renderSlotImage(
                cosmeticMedia[content.whoNeedsSet.mediaSlot as keyof typeof cosmeticMedia] || cosmeticMedia.whoNeeds,
                content.whoNeedsSet.title || 'Who Needs Sheer Set',
                'from-[#EEF2F8] to-[#DDE3EE]'
              )}
              {content.whoNeedsSet.imageCaption && (
                <div className="absolute bottom-6 left-6 right-6 bg-[#050A5C]/90 backdrop-blur-sm p-4 text-center border border-white/10">
                  <span className="text-white text-xs tracking-widest font-semibold uppercase">{content.whoNeedsSet.imageCaption}</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─── SKIN BARRIER & MG3-PLUS TECHNOLOGY ───────────────────────────────── */}
      {content.barrierScience && (
        <section className="bg-slate-50/50 py-16 md:py-24 px-6 border-b border-slate-100">
          <div className="max-w-[1200px] mx-auto lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Left Card: Skin Barrier Science */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
              <div className="p-8 md:p-10 space-y-4 flex-1">
                {content.barrierScience.eyebrow && (
                  <span className="cosmetic-kicker text-[#050A5C]/60 block">
                    {content.barrierScience.eyebrow}
                  </span>
                )}
                {content.barrierScience.title && (
                  <h3 className="cosmetic-heading text-xl md:text-2xl text-[#050A5C] leading-tight">
                    {content.barrierScience.title}
                  </h3>
                )}
                {content.barrierScience.description && (
                  <p className="cosmetic-body text-slate-500 text-sm whitespace-pre-wrap pt-2">
                    {content.barrierScience.description}
                  </p>
                )}
              </div>
              <div className="relative aspect-[4/3] bg-slate-50 border-t border-slate-100 p-6 flex items-center justify-center">
                {renderSlotImage(
                  cosmeticMedia[content.barrierScience.mediaSlot as keyof typeof cosmeticMedia] || cosmeticMedia.barrierScience,
                  content.barrierScience.title || 'Skin Barrier Science',
                  'from-[#EEF2F8] to-[#DDE3EE]'
                )}
              </div>
            </div>

            {/* Right Card: MG3-Plus Method */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
              <div className="p-8 md:p-10 space-y-4 flex-1">
                {content.barrierScience.mg3Eyebrow && (
                  <div className="inline-flex items-center gap-2">
                    <span className="cosmetic-kicker text-[#050A5C] block">
                      {content.barrierScience.mg3Eyebrow}
                    </span>
                    <span className="bg-yellow-100 text-yellow-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Exclusive
                    </span>
                  </div>
                )}
                {content.barrierScience.mg3Title && (
                  <h3 className="cosmetic-heading text-xl md:text-2xl text-[#050A5C] leading-tight">
                    {content.barrierScience.mg3Title}
                  </h3>
                )}
                {content.barrierScience.mg3Description && (
                  <p className="cosmetic-body text-slate-500 text-sm whitespace-pre-wrap pt-2">
                    {content.barrierScience.mg3Description}
                  </p>
                )}
              </div>
              <div className="relative aspect-[4/3] bg-slate-50 border-t border-slate-100 p-6 flex items-center justify-center">
                {renderSlotImage(
                  cosmeticMedia[content.barrierScience.mg3MediaSlot as keyof typeof cosmeticMedia] || cosmeticMedia.mg3Plus,
                  content.barrierScience.mg3Title || 'MG3-Plus Method',
                  'from-[#EEF2F8] to-[#DDE3EE]'
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── ACTIVE INGREDIENTS ────────────────────────────────────────────────── */}
      {content.activeIngredients && (
        <section className="bg-white py-16 md:py-24 px-6 border-b border-slate-100">
          <div className="max-w-[1200px] mx-auto lg:px-8 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
            {/* Left Column: Text + Image */}
            <div className="space-y-8 flex flex-col h-full">
              <div className="space-y-4">
                {content.activeIngredients.eyebrow && (
                  <span className="cosmetic-kicker text-[#050A5C]/60 block">
                    {content.activeIngredients.eyebrow}
                  </span>
                )}
                {content.activeIngredients.title && (
                  <h2 className="cosmetic-heading text-2xl md:text-3.5xl text-[#050A5C] leading-tight">
                    {content.activeIngredients.title}
                  </h2>
                )}
                {content.activeIngredients.description && (
                  <p className="cosmetic-body text-slate-500 text-sm whitespace-pre-wrap pt-2">
                    {content.activeIngredients.description}
                  </p>
                )}
              </div>
              
              <div className="relative flex-1 min-h-[300px] md:min-h-[400px] w-full bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center p-4">
                {renderSlotImage(
                  cosmeticMedia[content.activeIngredients.mediaSlot as keyof typeof cosmeticMedia] || cosmeticMedia.activeIngredients,
                  content.activeIngredients.title || 'Active Ingredients',
                  'from-[#EEF2F8] to-[#DDE3EE]'
                )}
              </div>
            </div>

            {/* Right Column: Ingredient List with Accent Line */}
            <div className="relative">
              {/* Vertical Accent Line */}
              <div className="absolute left-[3px] top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-[#050A5C]/15 to-transparent hidden md:block"></div>
              
              <div className="space-y-6 md:pl-8">
                {content.activeIngredients.ingredients && content.activeIngredients.ingredients.map((item, idx) => (
                  <div key={idx} className="relative">
                    {/* Tick mark on accent line */}
                    <div className="absolute -left-[30px] top-2.5 w-1.5 h-1.5 rounded-full bg-[#050A5C]/30 hidden md:block"></div>
                    
                    <div className="bg-slate-50/50 border border-slate-100 p-5 rounded-lg space-y-2">
                      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-1 mb-1">
                        <h4 className="cosmetic-heading text-[15px] text-[#050A5C]">{item.name}</h4>
                        {item.subtitle && (
                          <span className="cosmetic-kicker text-yellow-600/80">{item.subtitle}</span>
                        )}
                      </div>
                      <p className="cosmetic-body text-xs text-slate-500">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── HOW TO USE SET ────────────────────────────────────────────────────── */}
      {content.usageGuide && (
        <section className="bg-slate-50/50 py-16 md:py-24 px-6 border-b border-slate-100">
          <div className="max-w-[1200px] mx-auto lg:px-8 grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-10 items-center">
            {/* Left Column: Text & Steps */}
            <div className="space-y-10">
              <div className="space-y-4">
                {content.usageGuide.eyebrow && (
                  <span className="cosmetic-kicker text-[#050A5C]/60 block">
                    {content.usageGuide.eyebrow}
                  </span>
                )}
                {content.usageGuide.title && (
                  <h2 className="cosmetic-heading text-2xl md:text-3.5xl text-[#050A5C] leading-tight">
                    {content.usageGuide.title}
                  </h2>
                )}
                {content.usageGuide.description && (
                  <p className="cosmetic-body text-slate-500 text-sm whitespace-pre-wrap pt-2">
                    {content.usageGuide.description}
                  </p>
                )}
              </div>

              <div className="space-y-6">
                {content.usageGuide.steps && content.usageGuide.steps.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    {item.step && (
                      <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full border border-[#050A5C]/20 bg-white text-[#050A5C] text-xs font-bold font-mono">
                        {item.step}
                      </div>
                    )}
                    <div className="space-y-1 pt-1">
                      <h4 className="cosmetic-heading text-[14px] text-[#050A5C]">{item.title}</h4>
                      <p className="cosmetic-body text-[13px] text-slate-500">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {content.usageGuide.note && (
                <div className="bg-white border border-slate-200 p-4 rounded-lg flex gap-3 items-start">
                  <div className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                  <p className="cosmetic-subheading text-xs text-slate-500">
                    {content.usageGuide.note}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Images */}
            <div className="space-y-6">
              <div className="relative aspect-[4/3] w-full bg-white border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center p-4 shadow-sm">
                {renderSlotImage(
                  cosmeticMedia[content.usageGuide.mediaSlot as keyof typeof cosmeticMedia] || cosmeticMedia.usageSet,
                  content.usageGuide.title || 'How to use set',
                  'from-[#EEF2F8] to-[#DDE3EE]'
                )}
              </div>
              <div className="relative aspect-video w-full max-w-[80%] mx-auto bg-white border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center p-4 shadow-sm">
                {renderSlotImage(
                  cosmeticMedia[content.usageGuide.instructionMediaSlot as keyof typeof cosmeticMedia] || cosmeticMedia.usageInstruction,
                  'Instruction diagram',
                  'from-[#EEF2F8] to-[#DDE3EE]'
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── PRODUCT DETAIL & COMPLIANCE FORM ─────────────────────────────────── */}
      {content.productDetailForm && (
        <ProductDetailForm productDetailForm={content.productDetailForm} cosmeticMedia={cosmeticMedia} />
      )}

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
