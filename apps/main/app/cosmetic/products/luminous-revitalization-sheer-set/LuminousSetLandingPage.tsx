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
  items: [
    { text: "Da bị tác động sau treatment hoặc chăm sóc chuyên sâu", description: "Phù hợp khi da cần routine dịu nhẹ để ổn định lại cảm giác bề mặt." },
    { text: "Da cần bổ sung độ ẩm và cảm giác dễ chịu", description: "Hỗ trợ cảm giác da mềm, ẩm và ít khô căng hơn." },
    { text: "Da khô, thô ráp, cần chăm sóc phục hồi", description: "Giúp routine dưỡng da tại nhà trở nên gọn gàng và dễ duy trì." },
    { text: "Da cần hỗ trợ hàng rào bảo vệ", description: "Tập trung vào cảm giác cân bằng, mềm mại và ổn định hơn." },
    { text: "Người muốn routine phục hồi tại nhà sau spa", description: "Kết nối trải nghiệm chăm sóc chuyên sâu với home-care hằng ngày." }
  ]
};

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
                        <h4 className="cosmetic-heading-soft text-[15px] text-[#050A5C]">{item.name}</h4>
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
                      <h4 className="cosmetic-heading-soft text-[14px] text-[#050A5C]">{item.title}</h4>
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
