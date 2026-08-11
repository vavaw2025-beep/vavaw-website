import { Metadata } from 'next';
import { loadPublicCosmeticMedia } from '@/lib/load-public-cosmetic-media';
import { loadPublicContentBlocks } from '@/lib/load-public-content-blocks';
import { ProductLandingPage } from '../_components/ProductLandingPage';
import { mergeProductLandingContent } from '../_lib/merge-product-landing-content';
import { ProductLandingContent } from '../_components/product-landing-types';

export const revalidate = 60; // 1 minute revalidation

export const metadata: Metadata = {
  title: 'P30 Boost Facial Hydrating Toner | VAVAW Cosmetic',
  description: 'Toner cấp ẩm trong routine VAVAW, hỗ trợ cân bằng làn da sau làm sạch và chuẩn bị da cho các bước phục hồi tiếp theo.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://vavaw.vn'}/cosmetic/products/p30-boost-facial-hydrating-toner`,
  },
  openGraph: {
    title: 'P30 Boost Facial Hydrating Toner | VAVAW Cosmetic',
    description: 'Toner cấp ẩm trong routine VAVAW, hỗ trợ cân bằng làn da sau làm sạch và chuẩn bị da cho các bước phục hồi tiếp theo.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://vavaw.vn'}/cosmetic/products/p30-boost-facial-hydrating-toner`,
    siteName: 'VAVAW Ecosystem',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'P30 Boost Facial Hydrating Toner | VAVAW Cosmetic',
    description: 'Toner cấp ẩm trong routine VAVAW, hỗ trợ cân bằng làn da sau làm sạch và chuẩn bị da cho các bước phục hồi tiếp theo.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const DEFAULT_CONTENT: ProductLandingContent = {
  eyebrow: "VAVAW COSMETIC TONER",
  title: "P30 Boost Facial Hydrating Toner",
  headline: "Toner cân bằng độ ẩm giúp chuẩn bị làn da cho các bước phục hồi và dưỡng chất tiếp theo.",
  description: "P30 Boost Facial Hydrating Toner là bước prepare trong routine VAVAW, hỗ trợ cân bằng cảm giác ẩm mượt sau làm sạch, giúp bề mặt da sẵn sàng hơn cho ampoule, serum và kem dưỡng.",
  ctaLabel: "Nhận tư vấn P30 Toner",
  ctaHref: "/contact?type=cosmetic_interest&product=p30_toner&source=product_landing",
  secondaryCtaLabel: "Quay lại VAVAW Cosmetic",
  secondaryCtaHref: "/cosmetic",
  heroMediaSlot: "cosmetic-product-p30-toner",
  insideSet: [
    {
      name: "P30 Boost Facial Hydrating Toner",
      size: "150ml",
      role: "Toner cân bằng độ ẩm",
      description: "Hỗ trợ làm mềm bề mặt da sau làm sạch, giúp da có cảm giác ẩm mượt và sẵn sàng cho các bước phục hồi tiếp theo.",
      mediaSlot: "cosmetic-product-p30-toner"
    }
  ],
  recoveryLogic: [
    { step: "01. Prepare", title: "Dùng toner sau làm sạch để cân bằng cảm giác ẩm mượt.", description: "" },
    { step: "02. Treat", title: "Tiếp tục với ampoule hoặc serum phù hợp.", description: "" },
    { step: "03. Recover", title: "Hỗ trợ routine phục hồi bằng bước cấp ẩm nền.", description: "" },
    { step: "04. Seal", title: "Khóa ẩm bằng gel hoặc kem dưỡng.", description: "" },
    { step: "05. Protect", title: "Ban ngày kết hợp kem chống nắng.", description: "" }
  ],
  activeTech: [
    {
      name: "Hyaluronic Acid",
      role: "Hydration layer",
      description: "Giúp làn da có cảm giác ẩm mượt và mềm mại hơn sau bước làm sạch.",
      product: "P30 Boost Facial Hydrating Toner"
    },
    {
      name: "P30 Moisture Complex",
      role: "Moisture preparation",
      description: "Hỗ trợ chuẩn bị bề mặt da để tiếp nhận các bước chăm sóc tiếp theo.",
      product: "P30 Boost Facial Hydrating Toner"
    },
    {
      name: "Panthenol Support",
      role: "Comfort support",
      description: "Hỗ trợ cảm giác dễ chịu và cân bằng cho da trong routine hằng ngày.",
      product: "P30 Boost Facial Hydrating Toner"
    },
    {
      name: "Lightweight Water Texture",
      role: "Fresh finish",
      description: "Kết cấu nước nhẹ, phù hợp dùng sáng và tối trước các bước phục hồi.",
      product: "P30 Boost Facial Hydrating Toner"
    }
  ],
  whoItsFor: [
    "Da cần cân bằng sau làm sạch",
    "Da khô nhẹ hoặc thiếu nước",
    "Da cần bước prepare trước ampoule/serum",
    "Da muốn routine cấp ẩm nhẹ nhàng",
    "Người đang xây dựng routine phục hồi tại nhà"
  ],
  howToUse: [
    { step: "01", title: "Làm sạch da", description: "" },
    { step: "02", title: "Lấy toner ra tay hoặc bông cotton", description: "" },
    { step: "03", title: "Thoa/vỗ nhẹ lên mặt và cổ", description: "" },
    { step: "04", title: "Tiếp tục với ampoule hoặc serum", description: "" },
    { step: "05", title: "Khóa ẩm bằng gel hoặc kem dưỡng phù hợp", description: "" }
  ],
  spaBridge: {
    title: "Bước chuẩn bị da trong routine tại VAVAW Beauty & Co",
    description: "P30 Boost Facial Hydrating Toner có thể được tư vấn như bước cân bằng và chuẩn bị làn da trước các bước phục hồi chuyên sâu trong routine tại nhà.",
    ctaLabel: "Trải nghiệm tại VAVAW Beauty & Co",
    ctaHref: "/go/beauty"
  },
  productInfo: [
    { label: "Tên sản phẩm", "value": "P30 Boost Facial Hydrating Toner" },
    { label: "Dung tích", "value": "150ml" },
    { label: "Loại sản phẩm", "value": "Toner cấp ẩm" },
    { label: "Bước sử dụng", "value": "Sau làm sạch, trước ampoule/serum" },
    { label: "Gợi ý kết hợp", "value": "Calmiance Superior Sheer Gel hoặc P30 Boost Facial Moisturizer" },
    { label: "Lưu ý", "value": "Chỉ dùng ngoài da. Tránh tiếp xúc trực tiếp với mắt." }
  ],
  finalCta: {
    title: "Bắt đầu tư vấn P30 Toner",
    description: "Nhận gợi ý cách kết hợp P30 Boost Facial Hydrating Toner vào routine phục hồi phù hợp với tình trạng da của bạn.",
    ctaLabel: "Nhận tư vấn P30 Toner",
    ctaHref: "/contact?type=cosmetic_interest&product=p30_toner&source=product_landing_final"
  }
};

export default async function P30TonerPage() {
  // 1. Load CMS blocks for product page path
  const { blocks } = await loadPublicContentBlocks({
    siteKey: 'main',
    pagePath: '/cosmetic/products/p30-boost-facial-hydrating-toner',
    isPreview: false
  });

  const blockRecord = blocks?.find(b => b.blockType === 'cosmetic-product-landing-p30-toner');
  
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
