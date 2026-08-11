import { Metadata } from 'next';
import { loadPublicCosmeticMedia } from '@/lib/load-public-cosmetic-media';
import { loadPublicContentBlocks } from '@/lib/load-public-content-blocks';
import { ProductLandingPage } from '../_components/ProductLandingPage';
import { mergeProductLandingContent } from '../_lib/merge-product-landing-content';
import { ProductLandingContent } from '../_components/product-landing-types';

export const revalidate = 60; // 1 minute revalidation

export const metadata: Metadata = {
  title: 'CELLUREVIVE Ampoule | VAVAW Cosmetic',
  description: 'Ampoule cô đặc trong routine phục hồi VAVAW, hỗ trợ làn da cần cấp ẩm, làm dịu và cải thiện vẻ rạng rỡ sau chăm sóc chuyên sâu.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://vavaw.vn'}/cosmetic/products/cellurevive-ampoule`,
  },
  openGraph: {
    title: 'CELLUREVIVE Ampoule | VAVAW Cosmetic',
    description: 'Ampoule cô đặc trong routine phục hồi VAVAW, hỗ trợ làn da cần cấp ẩm, làm dịu và cải thiện vẻ rạng rỡ sau chăm sóc chuyên sâu.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://vavaw.vn'}/cosmetic/products/cellurevive-ampoule`,
    siteName: 'VAVAW Ecosystem',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CELLUREVIVE Ampoule | VAVAW Cosmetic',
    description: 'Ampoule cô đặc trong routine phục hồi VAVAW, hỗ trợ làn da cần cấp ẩm, làm dịu và cải thiện vẻ rạng rỡ sau chăm sóc chuyên sâu.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const DEFAULT_CONTENT: ProductLandingContent = {
  eyebrow: "VAVAW COSMETIC AMPOULE",
  title: "CELLUREVIVE Ampoule",
  headline: "Ampoule cô đặc hỗ trợ phục hồi làn da và cải thiện vẻ rạng rỡ sau chăm sóc chuyên sâu.",
  description: "CELLUREVIVE Ampoule là bước treatment chuyên sâu trong routine phục hồi VAVAW, được thiết kế để hỗ trợ làn da cần cấp ẩm, làm dịu và cải thiện bề mặt da trông mịn màng hơn.",
  ctaLabel: "Nhận tư vấn CELLUREVIVE Ampoule",
  ctaHref: "/contact?type=cosmetic_interest&product=cellurevive_ampoule&source=product_landing",
  secondaryCtaLabel: "Xem Luminous Set",
  secondaryCtaHref: "/cosmetic/products/luminous-revitalization-sheer-set",
  heroMediaSlot: "cosmetic-set-cellurevive-ampoule",
  insideSet: [
    {
      name: "CELLUREVIVE Ampoule",
      size: "7ml",
      role: "Ampoule treatment cô đặc",
      description: "Hỗ trợ làn da cần phục hồi sau chăm sóc chuyên sâu, giúp da trông ẩm mịn và rạng rỡ hơn.",
      mediaSlot: "cosmetic-set-cellurevive-ampoule"
    }
  ],
  recoveryLogic: [
    { step: "01. Prepare", title: "Làm sạch và cân bằng da trước treatment", description: "" },
    { step: "02. Treat", title: "Thoa CELLUREVIVE Ampoule như bước treatment chính", description: "" },
    { step: "03. Recover", title: "Hỗ trợ cảm giác dễ chịu cho làn da đang cần phục hồi", description: "" },
    { step: "04. Seal", title: "Khóa ẩm bằng kem dưỡng phù hợp", description: "" },
    { step: "05. Protect", title: "Ban ngày dùng thêm kem chống nắng", description: "" }
  ],
  activeTech: [
    {
      name: "Exosome",
      role: "Renewal signal support",
      description: "Hỗ trợ vẻ ngoài mịn màng và rạng rỡ của làn da.",
      product: "CELLUREVIVE Ampoule"
    },
    {
      name: "Collagen Water",
      role: "Hydration support",
      description: "Giúp làn da có cảm giác ẩm mượt và mềm mại hơn.",
      product: "CELLUREVIVE Ampoule"
    },
    {
      name: "Peptide Complex",
      role: "Barrier support",
      description: "Hỗ trợ hàng rào bảo vệ và giúp da trông săn mịn hơn.",
      product: "CELLUREVIVE Ampoule"
    },
    {
      name: "Korean Recovery Ritual",
      role: "Treatment step",
      description: "Được dùng như bước treatment trong routine phục hồi VAVAW.",
      product: "VAVAW Cosmetic routine"
    }
  ],
  whoItsFor: [
    "Da cần phục hồi sau spa/treatment",
    "Da khô, yếu, thiếu sức sống",
    "Da cần hỗ trợ hàng rào bảo vệ",
    "Da cần cải thiện vẻ mịn màng và rạng rỡ",
    "Người muốn bổ sung bước ampoule chuyên sâu trong routine tại nhà"
  ],
  howToUse: [
    { step: "01", title: "Làm sạch da và cân bằng bằng toner", description: "" },
    { step: "02", title: "Lấy lượng ampoule vừa đủ", description: "" },
    { step: "03", title: "Thoa đều lên mặt, tránh vùng mắt", description: "" },
    { step: "04", title: "Vỗ nhẹ đến khi thẩm thấu", description: "" },
    { step: "05", title: "Khóa ẩm bằng REGENAGLOW NOURISH SHEER CREAM hoặc kem dưỡng phù hợp", description: "" }
  ],
  spaBridge: {
    title: "Kết hợp trong routine phục hồi tại VAVAW Beauty & Co",
    description: "CELLUREVIVE Ampoule có thể được tư vấn như một bước treatment hỗ trợ routine phục hồi sau trải nghiệm chăm sóc chuyên sâu tại VAVAW Beauty & Co.",
    ctaLabel: "Trải nghiệm tại VAVAW Beauty & Co",
    ctaHref: "/go/beauty"
  },
  productInfo: [
    { label: "Tên sản phẩm", value: "CELLUREVIVE Ampoule" },
    { label: "Dung tích", value: "7ml" },
    { label: "Loại sản phẩm", value: "Ampoule treatment" },
    { label: "Bước sử dụng", value: "Sau toner, trước kem dưỡng" },
    { label: "Gợi ý kết hợp", value: "REGENAGLOW NOURISH SHEER CREAM" },
    { label: "Lưu ý", value: "Chỉ dùng ngoài da. Tránh tiếp xúc trực tiếp với mắt." }
  ],
  finalCta: {
    title: "Bắt đầu tư vấn CELLUREVIVE Ampoule",
    description: "Nhận gợi ý cách kết hợp CELLUREVIVE Ampoule vào routine phục hồi phù hợp với tình trạng da của bạn.",
    ctaLabel: "Nhận tư vấn Ampoule",
    ctaHref: "/contact?type=cosmetic_interest&product=cellurevive_ampoule&source=product_landing_final"
  }
};

export default async function CellureviveAmpoulePage() {
  // 1. Load CMS blocks for product page path
  const { blocks } = await loadPublicContentBlocks({
    siteKey: 'main',
    pagePath: '/cosmetic/products/cellurevive-ampoule',
    isPreview: false
  });

  const blockRecord = blocks?.find(b => b.blockType === 'cosmetic-product-landing-cellurevive-ampoule');
  
  // 2. Only use CMS content when the block exists and is_active=true
  const useCms = blockRecord && blockRecord.isActive;
  const cmsBlock = (useCms ? (blockRecord.content || {}) : {}) as any;

  // 3. Merge CMS content with defaults
  const mergedContent = mergeProductLandingContent(DEFAULT_CONTENT, cmsBlock);

  // 4. Load all cosmetic media assets needed for rendering
  const media = await loadPublicCosmeticMedia();

  // 5. Render using the shared template
  return <ProductLandingPage content={mergedContent} cosmeticMedia={media}  canonicalPath="/cosmetic/products/${product}" />;
}
