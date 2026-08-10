import type { Metadata } from 'next';
import { Suspense } from 'react';
import { draftMode } from 'next/headers';
import { loadPublicCosmeticMedia } from '@/lib/load-public-cosmetic-media';
import { loadPublicContentBlocks } from '@/lib/load-public-content-blocks';
import { CosmeticCtaTracker } from '../../cosmetic-tracker';
import { SiteFooter } from '@vavaw/ui';
import { ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';

const DEFAULT_CONTENT = {
  eyebrow: 'VAVAW COSMETIC',
  title: 'Luminous Revitalization Sheer Set',
  headline: 'Chăm sóc chuyên sâu — củng cố hàng rào bảo vệ và phục hồi làn da rạng rỡ.',
  description: 'Bộ chăm sóc phục hồi chuyên sâu kết hợp ampoule cô đặc và kem dưỡng phục hồi, hỗ trợ làn da cần phục hồi, cấp ẩm và cải thiện vẻ rạng rỡ.',
  ctaLabel: 'Nhận tư vấn Luminous Set',
  ctaHref: '/contact?type=cosmetic_interest&product=luminous_set&source=product_landing',
  secondaryCtaLabel: 'Trải nghiệm tại VAVAW Beauty & Co',
  secondaryCtaHref: '/go/beauty',
  setProducts: [
    {
      name: 'CELLUREVIVE Ampoule',
      size: '7ml × 4ea',
      role: 'Ampoule cô đặc',
      description: 'Hỗ trợ phục hồi làn da, cải thiện vẻ rạng rỡ và giúp bề mặt da trông mịn màng hơn.',
      mediaSlot: 'cosmetic-set-cellurevive-ampoule'
    },
    {
      name: 'REGENAGLOW NOURISH SHEER CREAM',
      size: '30ml × 1ea',
      role: 'Kem dưỡng phục hồi',
      description: 'Giúp khóa ẩm, làm mềm da và củng cố hàng rào bảo vệ để duy trì làn da ổn định hơn.',
      mediaSlot: 'cosmetic-set-regenaglow-sheer-cream'
    }
  ],
  recoveryLogic: [
    { step: '01. Prepare', title: 'Chuẩn bị da', description: 'Supports healthy skin hydration and balances pH levels after cleansing.' },
    { step: '02. Treat', title: 'Đặc trị chuyên sâu', description: 'Helps improve appearance of skin tone and texture with active technology.' },
    { step: '03. Recover', title: 'Phục hồi', description: 'Supports skin barrier recovery and helps maintain natural resilience.' },
    { step: '04. Seal', title: 'Khóa ẩm', description: 'Helps skin feel smoother and retains moisture for long-lasting hydration.' },
    { step: '05. Protect', title: 'Bảo vệ', description: 'Helps defend against external environmental stressors during daytime.' }
  ],
  activeTech: [
    { name: 'Exosome', role: 'Phục hồi & truyền tín hiệu tế bào', description: 'Công nghệ sinh học tiên tiến giúp dẫn truyền dưỡng chất sâu, hỗ trợ tái tạo tự nhiên và làm dịu làn da nhạy cảm.', product: 'CELLUREVIVE Ampoule' },
    { name: 'Collagen Water', role: 'Cấp ẩm & duy trì săn chắc', description: 'Cung cấp nền tảng ẩm mượt dồi dào, giúp da trông căng mịn và cải thiện vẻ rạng rỡ tự nhiên.', product: 'Cả hai sản phẩm' },
    { name: 'Peptide Complex', role: 'Củng cố cấu trúc da', description: 'Chuỗi peptide chuyên biệt hỗ trợ hàng rào bảo vệ, tăng độ đàn hồi và duy trì bề mặt da săn mịn.', product: 'Cả hai sản phẩm' },
    { name: 'MG3-Plus', role: 'Làm dịu & khóa ẩm sâu', description: 'Hoạt chất phục hồi độc quyền giúp giảm cảm giác khô yếu, kích ứng và khóa chặt độ ẩm trong nhiều giờ.', product: 'REGENAGLOW NOURISH SHEER CREAM' }
  ],
  whoItsFor: [
    'Da sau spa/treatment cần routine phục hồi nhẹ nhàng',
    'Da khô, yếu, thiếu sức sống',
    'Da cần hỗ trợ hàng rào bảo vệ',
    'Da cần cải thiện vẻ mịn màng và rạng rỡ',
    'Người muốn routine chăm sóc tại nhà sau trải nghiệm spa'
  ],
  howToUse: [
    { step: '01', title: 'Làm sạch và cân bằng da', description: 'Rửa mặt sạch bằng sữa rửa mặt dịu nhẹ, sau đó cân bằng độ ẩm bằng toner.' },
    { step: '02', title: 'Thoa CELLUREVIVE Ampoule', description: 'Mở nắp lọ ampoule, thoa một lượng vừa đủ lên toàn mặt.' },
    { step: '03', title: 'Massage nhẹ đến khi thẩm thấu', description: 'Vỗ nhẹ và massage hướng lên để các exosome thẩm thấu sâu vào da.' },
    { step: '04', title: 'Khóa ẩm bằng REGENAGLOW NOURISH SHEER CREAM', description: 'Thoa một lớp kem mỏng để khóa chặt các dưỡng chất từ ampoule.' },
    { step: '05', title: 'Bảo vệ ban ngày', description: 'Luôn kết hợp kem chống nắng có màng lọc bảo vệ phổ rộng khi đi ra ngoài.' }
  ],
  spaBridgeTitle: 'Có thể trải nghiệm trong quy trình chăm sóc tại VAVAW Beauty & Co',
  spaBridgeDescription: 'VAVAW Beauty & Co giúp khách hàng hiểu cách kết hợp sản phẩm trong trải nghiệm chăm sóc chuyên nghiệp và routine tại nhà.',
  spaBridgeCtaLabel: 'Trải nghiệm tại VAVAW Beauty & Co',
  spaBridgeCtaHref: '/go/beauty',
  productInfo: [
    { label: 'Tên sản phẩm', value: 'Luminous Revitalization Sheer Set' },
    { label: 'Quy cách đóng gói', value: 'CELLUREVIVE Ampoule (7ml × 4 lọ) & REGENAGLOW NOURISH SHEER CREAM (30ml × 1 tuýp)' },
    { label: 'Công dụng chính', value: 'Hỗ trợ phục hồi da sau trị liệu, củng cố hàng rào ẩm, cải thiện độ đàn hồi và làm sáng da tự nhiên.' },
    { label: 'Hướng dẫn bảo quan', value: 'Nơi khô ráo thoáng mát, tránh ánh nắng trực tiếp. Nên dùng lọ ampoule trong vòng 7 ngày sau khi mở nắp.' },
    { label: 'Lưu ý khi sử dụng', value: 'Chỉ dùng ngoài da. Tránh tiếp xúc trực tiếp với mắt. Ngưng sử dụng nếu có dấu hiệu kích ứng.' }
  ],
  finalTitle: 'Bắt đầu tư vấn Luminous Set',
  finalDescription: 'Nhận gợi ý routine phù hợp với tình trạng da và nhu cầu chăm sóc của bạn.',
  finalCtaLabel: 'Nhận tư vấn Luminous Set',
  finalCtaHref: '/contact?type=cosmetic_interest&product=luminous_set&source=product_landing_final'
};

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vavaw.vn';
  return {
    title: 'Luminous Revitalization Sheer Set | VAVAW Cosmetic',
    description: 'Bộ chăm sóc phục hồi chuyên sâu với CELLUREVIVE Ampoule và REGENAGLOW NOURISH SHEER CREAM, hỗ trợ làn da rạng rỡ, ẩm mịn và ổn định hơn.',
    alternates: {
      canonical: `${siteUrl}/cosmetic/products/luminous-revitalization-sheer-set`,
    },
    openGraph: {
      title: 'Luminous Revitalization Sheer Set | VAVAW Cosmetic',
      description: 'Bộ chăm sóc phục hồi chuyên sâu với CELLUREVIVE Ampoule và REGENAGLOW NOURISH SHEER CREAM, hỗ trợ làn da rạng rỡ, ẩm mịn và ổn định hơn.',
      url: `${siteUrl}/cosmetic/products/luminous-revitalization-sheer-set`,
    }
  };
}

export default async function LuminousProductLandingPage() {
  const isPreview = (await draftMode()).isEnabled;

  // Load CMS blocks for product page path
  const { blocks } = await loadPublicContentBlocks({
    siteKey: 'main',
    pagePath: '/cosmetic/products/luminous-revitalization-sheer-set',
    isPreview
  });

  const cmsBlock = blocks?.find(b => b.blockType === 'cosmetic-product-landing-luminous-set')?.content || {};
  const content = { ...DEFAULT_CONTENT, ...cmsBlock };

  // Load cosmetic media urls
  const cosmeticMedia = await loadPublicCosmeticMedia(isPreview);

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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-[#E2E8F0] selection:text-[#050A5C]">
      
      {/* ─── BREADCRUMB ────────────────────────────────────────────────────────── */}
      <div className="pt-24 md:pt-28 pb-4 px-6 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto flex items-center gap-1.5 text-[10px] md:text-xs text-slate-400 font-medium uppercase tracking-wider">
          <a href="/cosmetic" className="hover:text-[#050A5C] transition-colors">Cosmetic</a>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-slate-600 font-bold truncate">Luminous Revitalization Sheer Set</span>
        </div>
      </div>

      {/* ─── PRODUCT HERO ──────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24 px-6 border-b border-slate-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visual Media packshot */}
          <div className="relative aspect-[4/5] bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center p-6 md:p-8">
            {renderSlotImage(
              cosmeticMedia.luminousSet,
              'Luminous Revitalization Sheer Set',
              'from-[#050A5C]/20 to-[#050A5C]/40'
            )}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between text-[9px] font-mono text-slate-400 uppercase tracking-widest pointer-events-none">
              <span>VAVAW COSMETIC</span>
              <span>CLINICAL RECOVERY SYSTEM</span>
            </div>
          </div>

          {/* Right Column: Hero Content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] md:text-[11px] font-bold text-[#050A5C]/60 tracking-[0.2em] uppercase block">
                {content.eyebrow}
              </span>
              <h1 className="text-3xl md:text-4.5xl font-light text-[#050A5C] tracking-tight font-serif leading-tight">
                {content.title}
              </h1>
              {content.headline && (
                <p className="text-sm md:text-base font-light text-[#050A5C]/80 italic leading-relaxed">
                  {content.headline}
                </p>
              )}
            </div>

            <hr className="border-slate-100" />

            <p className="text-slate-500 font-light text-sm leading-relaxed whitespace-pre-wrap">
              {content.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <CosmeticCtaTracker
                label={content.ctaLabel}
                href={content.ctaHref}
                className="w-full sm:w-auto h-[48px] px-8 flex items-center justify-center bg-[#050A5C] text-white text-[11px] font-bold tracking-[0.15em] uppercase hover:bg-[#101A8C] transition-colors rounded-[1px] shadow-sm"
              />
              <CosmeticCtaTracker
                label={content.secondaryCtaLabel}
                href={content.secondaryCtaHref}
                className="w-full sm:w-auto h-[48px] px-8 flex items-center justify-center border border-slate-200 text-slate-600 text-[11px] font-medium tracking-[0.15em] uppercase hover:bg-slate-50 transition-colors rounded-[1px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── INSIDE THE SET ────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 border-b border-slate-100">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold text-[#050A5C]/50 tracking-[0.2em] uppercase block">WHAT IS INSIDE</span>
            <h2 className="text-2xl md:text-3.5xl font-light text-[#050A5C] tracking-tight font-serif">Chi Tiết Bộ Sản Phẩm</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {content.setProducts.map((p, idx) => {
              const mediaUrl = idx === 0 ? cosmeticMedia.setCellureviveAmpoule : cosmeticMedia.setRegenaglowSheerCream;
              return (
                <div key={idx} className="bg-white border border-slate-200 hover:border-slate-300 transition-colors flex flex-col p-6 space-y-6">
                  {/* Thumbnail stage */}
                  <div className="aspect-[4/3] bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center p-4">
                    {renderSlotImage(mediaUrl, p.name, 'from-[#EEF2F8] to-[#DDE3EE]')}
                  </div>

                  <div className="space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-[#050A5C] text-sm md:text-base leading-tight">{p.name}</h3>
                        <span className="text-[10px] font-mono text-slate-400 font-semibold shrink-0 uppercase">{p.size}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block mt-1">{p.role}</span>
                      <p className="text-xs md:text-sm text-slate-500 font-light leading-relaxed mt-3">{p.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── RECOVERY LOGIC ────────────────────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-28 px-6 border-b border-slate-100">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold text-[#050A5C]/50 tracking-[0.2em] uppercase block">RECOVERY CYCLE</span>
            <h2 className="text-2xl md:text-3.5xl font-light text-[#050A5C] tracking-tight font-serif">Quy Trình Phục Hồi 5 Bước</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {content.recoveryLogic.map((logic, idx) => (
              <div key={idx} className="p-5 border border-slate-100 bg-slate-50/50 flex flex-col justify-between space-y-4">
                <div>
                  <span className="block text-[10px] font-mono text-[#050A5C]/50 font-bold uppercase tracking-wider mb-2">{logic.step}</span>
                  <h3 className="font-bold text-[#050A5C] text-xs uppercase tracking-wide mb-2">{logic.title}</h3>
                  <p className="text-[11px] text-slate-500 font-light leading-relaxed">{logic.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ACTIVE TECHNOLOGY ─────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 border-b border-slate-100">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold text-[#050A5C]/50 tracking-[0.2em] uppercase block">CLINICAL FORMULA</span>
            <h2 className="text-2xl md:text-3.5xl font-light text-[#050A5C] tracking-tight font-serif">Công Nghệ Hoạt Chất</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {content.activeTech.map((tech, idx) => (
              <div key={idx} className="bg-white p-6 border border-slate-200 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-[#050A5C]">{tech.name}</h3>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">{tech.role}</span>
                  <p className="text-xs text-slate-500 font-light leading-relaxed pt-2">{tech.description}</p>
                </div>
                {tech.product && (
                  <div className="text-[9px] font-semibold text-[#050A5C]/60 uppercase tracking-widest border-t border-slate-50 pt-2.5">
                    Ứng dụng: {tech.product}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHO IT'S FOR ──────────────────────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-28 px-6 border-b border-slate-100">
        <div className="max-w-4xl mx-auto space-y-10">
          
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold text-[#050A5C]/50 tracking-[0.2em] uppercase block">SKIN COMPATIBILITY</span>
            <h2 className="text-2xl md:text-3.5xl font-light text-[#050A5C] tracking-tight font-serif">Đối Tượng Sử Dụng</h2>
          </div>

          <div className="bg-slate-50/50 border border-slate-200 p-8 md:p-12 space-y-4 max-w-2xl mx-auto">
            {content.whoItsFor.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <ShieldCheck className="h-5 w-5 text-[#050A5C] shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm text-slate-600 font-light leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW TO USE ────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 border-b border-slate-100">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold text-[#050A5C]/50 tracking-[0.2em] uppercase block">APPLICATION RITUAL</span>
            <h2 className="text-2xl md:text-3.5xl font-light text-[#050A5C] tracking-tight font-serif">Hướng Dẫn Sử Dụng</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-4xl mx-auto">
            {content.howToUse.map((step, idx) => (
              <div key={idx} className="relative space-y-3 p-4">
                <div className="text-3xl font-extrabold text-[#050A5C]/10 font-mono leading-none">{step.step}</div>
                <h3 className="font-bold text-[#050A5C] text-xs uppercase tracking-wide leading-tight">{step.title}</h3>
                <p className="text-[11px] text-slate-500 font-light leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SPA BRIDGE ────────────────────────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-24 px-6 text-center border-b border-slate-100">
        <div className="max-w-2xl mx-auto space-y-6">
          <span className="text-[10px] font-bold text-[#050A5C]/50 tracking-[0.2em] uppercase block">PROFESSIONAL PARTNERSHIP</span>
          <h2 className="text-2xl md:text-3xl font-light text-[#050A5C] font-serif leading-tight">
            {content.spaBridgeTitle}
          </h2>
          <p className="text-slate-500 font-light text-xs md:text-sm leading-relaxed max-w-xl mx-auto">
            {content.spaBridgeDescription}
          </p>
          <div className="pt-4">
            <CosmeticCtaTracker
              label={content.spaBridgeCtaLabel}
              href={content.spaBridgeCtaHref}
              className="inline-flex h-[48px] px-8 items-center justify-center bg-[#050A5C] text-white text-[11px] font-bold tracking-[0.15em] uppercase hover:bg-[#101A8C] transition-colors rounded-[1px]"
            />
          </div>
        </div>
      </section>

      {/* ─── PRODUCT INFORMATION ───────────────────────────────────────────────── */}
      <section className="py-20 md:py-24 px-6 border-b border-slate-100">
        <div className="max-w-4xl mx-auto space-y-10">
          
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold text-[#050A5C]/50 tracking-[0.2em] uppercase block">SPECIFICATIONS</span>
            <h2 className="text-xl md:text-2xl font-light text-[#050A5C] tracking-tight font-serif">Thông Tin Chi Tiết</h2>
          </div>

          <div className="bg-white border border-slate-200 overflow-hidden max-w-2xl mx-auto divide-y divide-slate-100">
            {content.productInfo.map((info, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-[180px_1fr] p-4 gap-2 text-xs">
                <span className="font-bold text-[#050A5C] uppercase tracking-wider text-[10px] md:pt-0.5">{info.label}</span>
                <span className="text-slate-600 font-light leading-relaxed">{info.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─────────────────────────────────────────────────────────── */}
      <section className="bg-[#050A5C] py-20 md:py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,10,92,0.15)_100%)] pointer-events-none" />
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <span className="text-[10px] font-bold text-white/50 tracking-[0.25em] uppercase block">VAVAW COSMETIC CONSULTATION</span>
          <h2 className="text-2xl md:text-3.5xl font-light text-white tracking-tight leading-snug">
            {content.finalTitle}
          </h2>
          <p className="text-white/70 font-light text-xs md:text-sm leading-relaxed max-w-xl mx-auto">
            {content.finalDescription}
          </p>
          <div className="pt-4">
            <CosmeticCtaTracker
              label={content.finalCtaLabel}
              href={content.finalCtaHref}
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
