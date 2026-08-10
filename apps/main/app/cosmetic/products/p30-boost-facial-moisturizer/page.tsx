import { Metadata } from 'next';
import { loadPublicCosmeticMedia } from '@/lib/load-public-cosmetic-media';
import { loadPublicContentBlocks } from '@/lib/load-public-content-blocks';
import { ProductLandingPage } from '../_components/ProductLandingPage';
import { mergeProductLandingContent } from '../_lib/merge-product-landing-content';
import { ProductLandingContent } from '../_components/product-landing-types';

export const revalidate = 60; // 1 minute revalidation

export const metadata: Metadata = {
  title: 'P30 Boost Facial Moisturizer | VAVAW Cosmetic',
  description: 'Kem dưỡng cấp ẩm trong routine VAVAW, giúp duy trì độ ẩm, hỗ trợ hàng rào bảo vệ và hoàn thiện routine phục hồi hằng ngày.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/cosmetic/products/p30-boost-facial-moisturizer`,
  },
};

const DEFAULT_CONTENT: ProductLandingContent = {
  eyebrow: "VAVAW COSMETIC MOISTURIZER",
  title: "P30 Boost Facial Moisturizer",
  headline: "Kem dưỡng cấp ẩm giúp khóa lại độ ẩm và hỗ trợ làn da mềm mại, ổn định hơn sau các bước phục hồi.",
  description: "P30 Boost Facial Moisturizer là bước dưỡng ẩm trong routine VAVAW, được thiết kế để giúp duy trì cảm giác ẩm mượt, hỗ trợ hàng rào bảo vệ và hoàn thiện routine phục hồi hằng ngày.",
  ctaLabel: "Nhận tư vấn P30 Moisturizer",
  ctaHref: "/contact?type=cosmetic_interest&product=p30_moisturizer&source=product_landing",
  secondaryCtaLabel: "Quay lại VAVAW Cosmetic",
  secondaryCtaHref: "/cosmetic",
  heroMediaSlot: "cosmetic-product-p30-moisturizer",
  insideSet: [
    {
      name: "P30 Boost Facial Moisturizer",
      size: "50ml",
      role: "Kem dưỡng cấp ẩm",
      description: "Hỗ trợ duy trì độ ẩm, làm da có cảm giác mềm mại hơn và giúp routine phục hồi ổn định sau toner hoặc treatment.",
      mediaSlot: "cosmetic-product-p30-moisturizer"
    }
  ],
  recoveryLogic: [
    { step: "01. Prepare", title: "Làm sạch và cân bằng da bằng toner.", description: "" },
    { step: "02. Treat", title: "Dùng ampoule hoặc serum phù hợp nếu có.", description: "" },
    { step: "03. Recover", title: "Hỗ trợ làn da cần cấp ẩm và ổn định.", description: "" },
    { step: "04. Seal", title: "Thoa P30 Boost Facial Moisturizer để khóa ẩm.", description: "" },
    { step: "05. Protect", title: "Ban ngày kết hợp kem chống nắng.", description: "" }
  ],
  activeTech: [
    {
      name: "Hyaluronic Acid",
      role: "Hydration support",
      description: "Giúp da có cảm giác ẩm mượt và mềm mại hơn.",
      product: "P30 Boost Facial Moisturizer"
    },
    {
      name: "P30 Moisture Complex",
      role: "Moisture-lock support",
      description: "Hỗ trợ duy trì độ ẩm và cảm giác dễ chịu cho da trong routine hằng ngày.",
      product: "P30 Boost Facial Moisturizer"
    },
    {
      name: "Peptide Support",
      role: "Barrier support",
      description: "Hỗ trợ hàng rào bảo vệ và giúp bề mặt da trông mịn màng hơn.",
      product: "P30 Boost Facial Moisturizer"
    },
    {
      name: "Soft Cream Texture",
      role: "Daily comfort finish",
      description: "Kết cấu kem mềm nhẹ, phù hợp sử dụng sáng và tối sau toner hoặc treatment.",
      product: "P30 Boost Facial Moisturizer"
    }
  ],
  whoItsFor: [
    "Da cần dưỡng ẩm sau toner hoặc ampoule",
    "Da khô nhẹ, thiếu độ mềm mại",
    "Da cần hỗ trợ hàng rào bảo vệ",
    "Da muốn kem dưỡng dùng hằng ngày không quá nặng mặt",
    "Người đang xây dựng routine phục hồi tại nhà"
  ],
  howToUse: [
    { step: "01", title: "Làm sạch và cân bằng da", description: "" },
    { step: "02", title: "Dùng ampoule hoặc serum nếu có", description: "" },
    { step: "03", title: "Lấy lượng kem vừa đủ", description: "" },
    { step: "04", title: "Thoa đều lên mặt và cổ", description: "" },
    { step: "05", title: "Ban ngày dùng thêm kem chống nắng", description: "" }
  ],
  spaBridge: {
    title: "Bước khóa ẩm trong routine tại VAVAW Beauty & Co",
    description: "P30 Boost Facial Moisturizer có thể được tư vấn như bước dưỡng ẩm hằng ngày, giúp hoàn thiện routine phục hồi sau các bước cấp ẩm hoặc treatment chuyên sâu.",
    ctaLabel: "Trải nghiệm tại VAVAW Beauty & Co",
    ctaHref: "/go/beauty"
  },
  productInfo: [
    { label: "Tên sản phẩm", "value": "P30 Boost Facial Moisturizer" },
    { label: "Dung tích", "value": "50ml" },
    { label: "Loại sản phẩm", "value": "Kem dưỡng cấp ẩm" },
    { label: "Bước sử dụng", "value": "Sau toner/ampoule/serum, trước kem chống nắng ban ngày" },
    { label: "Gợi ý kết hợp", "value": "P30 Boost Facial Hydrating Toner hoặc Gentle Activation Renew Ampoule" },
    { label: "Lưu ý", "value": "Chỉ dùng ngoài da. Tránh tiếp xúc trực tiếp với mắt." }
  ],
  finalCta: {
    title: "Bắt đầu tư vấn P30 Moisturizer",
    description: "Nhận gợi ý cách kết hợp P30 Boost Facial Moisturizer vào routine phục hồi phù hợp với tình trạng da của bạn.",
    ctaLabel: "Nhận tư vấn P30 Moisturizer",
    ctaHref: "/contact?type=cosmetic_interest&product=p30_moisturizer&source=product_landing_final"
  }
};

export default async function P30MoisturizerPage() {
  // 1. Load CMS blocks for product page path
  const { blocks } = await loadPublicContentBlocks({
    siteKey: 'main',
    pagePath: '/cosmetic/products/p30-boost-facial-moisturizer',
    isPreview: false
  });

  const blockRecord = blocks?.find(b => b.blockType === 'cosmetic-product-landing-p30-moisturizer');
  
  // 2. Only use CMS content when the block exists and is_active=true
  const useCms = blockRecord && blockRecord.isActive;
  const cmsBlock = (useCms ? (blockRecord.content || {}) : {}) as any;

  // 3. Merge CMS content with defaults
  const mergedContent = mergeProductLandingContent(DEFAULT_CONTENT, cmsBlock);

  // 4. Load all cosmetic media assets needed for rendering
  const media = await loadPublicCosmeticMedia();

  // 5. Render using the shared template
  return <ProductLandingPage content={mergedContent} cosmeticMedia={media} />;
}
