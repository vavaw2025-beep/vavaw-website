import { Metadata } from 'next';
import { loadPublicCosmeticMedia } from '@/lib/load-public-cosmetic-media';
import { loadPublicContentBlocks } from '@/lib/load-public-content-blocks';
import { ProductLandingPage } from '../_components/ProductLandingPage';
import { mergeProductLandingContent } from '../_lib/merge-product-landing-content';
import { ProductLandingContent } from '../_components/product-landing-types';

export const revalidate = 60; // 1 minute revalidation

export const metadata: Metadata = {
  title: 'REGENAGLOW NOURISH SHEER CREAM | VAVAW Cosmetic',
  description: 'Kem dưỡng phục hồi trong routine VAVAW, giúp duy trì độ ẩm, làm mềm da và hỗ trợ hàng rào bảo vệ sau bước treatment.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/cosmetic/products/regenaglow-nourish-sheer-cream`,
  },
};

const DEFAULT_CONTENT: ProductLandingContent = {
  eyebrow: "VAVAW COSMETIC CREAM",
  title: "REGENAGLOW NOURISH SHEER CREAM",
  headline: "Kem dưỡng phục hồi giúp khóa ẩm, làm mềm da và hỗ trợ hàng rào bảo vệ sau bước treatment.",
  description: "REGENAGLOW NOURISH SHEER CREAM là bước kem dưỡng phục hồi trong routine VAVAW, được thiết kế để giúp duy trì độ ẩm, làm da có cảm giác mềm mại hơn và hỗ trợ làn da cần ổn định sau chăm sóc chuyên sâu.",
  ctaLabel: "Nhận tư vấn REGENAGLOW Cream",
  ctaHref: "/contact?type=cosmetic_interest&product=regenaglow_cream&source=product_landing",
  secondaryCtaLabel: "Xem Luminous Set",
  secondaryCtaHref: "/cosmetic/products/luminous-revitalization-sheer-set",
  heroMediaSlot: "cosmetic-set-regenaglow-sheer-cream",
  insideSet: [
    {
      name: "REGENAGLOW NOURISH SHEER CREAM",
      size: "30ml",
      role: "Kem dưỡng phục hồi",
      description: "Giúp khóa ẩm sau bước treatment, hỗ trợ cảm giác mềm mượt và duy trì hàng rào bảo vệ da ổn định hơn.",
      mediaSlot: "cosmetic-set-regenaglow-sheer-cream"
    }
  ],
  recoveryLogic: [
    { step: "01. Prepare", title: "Làm sạch và cân bằng da.", description: "" },
    { step: "02. Treat", title: "Dùng ampoule hoặc serum treatment phù hợp.", description: "" },
    { step: "03. Recover", title: "Hỗ trợ làn da cần phục hồi sau chăm sóc chuyên sâu.", description: "" },
    { step: "04. Seal", title: "Thoa REGENAGLOW NOURISH SHEER CREAM để khóa ẩm.", description: "" },
    { step: "05. Protect", title: "Ban ngày kết hợp kem chống nắng.", description: "" }
  ],
  activeTech: [
    {
      name: "Collagen Water",
      role: "Hydration support",
      description: "Giúp da có cảm giác ẩm mượt và trông mềm mại hơn.",
      product: "REGENAGLOW NOURISH SHEER CREAM"
    },
    {
      name: "Peptide Complex",
      role: "Barrier support",
      description: "Hỗ trợ hàng rào bảo vệ và giúp bề mặt da trông săn mịn hơn.",
      product: "REGENAGLOW NOURISH SHEER CREAM"
    },
    {
      name: "MG3-Plus",
      role: "Moisture-lock support",
      description: "Hỗ trợ duy trì độ ẩm và cảm giác dễ chịu cho da sau bước treatment.",
      product: "REGENAGLOW NOURISH SHEER CREAM"
    },
    {
      name: "Sheer Cream Texture",
      role: "Comfort finish",
      description: "Kết cấu kem mỏng nhẹ, phù hợp sử dụng trong routine phục hồi sáng và tối.",
      product: "REGENAGLOW NOURISH SHEER CREAM"
    }
  ],
  whoItsFor: [
    "Da cần khóa ẩm sau treatment/ampoule",
    "Da khô, thiếu độ mềm mại",
    "Da cần hỗ trợ hàng rào bảo vệ",
    "Da muốn cảm giác dưỡng ẩm nhưng không quá nặng mặt",
    "Người đang dùng Luminous Set tại nhà"
  ],
  howToUse: [
    { step: "01", title: "Làm sạch và cân bằng da", description: "" },
    { step: "02", title: "Dùng ampoule hoặc serum treatment phù hợp", description: "" },
    { step: "03", title: "Lấy lượng kem vừa đủ", description: "" },
    { step: "04", title: "Thoa đều lên mặt và cổ", description: "" },
    { step: "05", title: "Ban ngày dùng thêm kem chống nắng", description: "" }
  ],
  spaBridge: {
    title: "Hoàn thiện routine phục hồi tại VAVAW Beauty & Co",
    description: "REGENAGLOW NOURISH SHEER CREAM có thể được tư vấn như bước khóa ẩm sau treatment, giúp duy trì cảm giác mềm mại và hỗ trợ routine phục hồi tại nhà.",
    ctaLabel: "Trải nghiệm tại VAVAW Beauty & Co",
    ctaHref: "/go/beauty"
  },
  productInfo: [
    { label: "Tên sản phẩm", value: "REGENAGLOW NOURISH SHEER CREAM" },
    { label: "Dung tích", value: "30ml" },
    { label: "Loại sản phẩm", value: "Kem dưỡng phục hồi" },
    { label: "Bước sử dụng", value: "Sau ampoule/serum, trước kem chống nắng ban ngày" },
    { label: "Gợi ý kết hợp", value: "CELLUREVIVE Ampoule hoặc Luminous Revitalization Sheer Set" },
    { label: "Lưu ý", value: "Chỉ dùng ngoài da. Tránh tiếp xúc trực tiếp với mắt." }
  ],
  finalCta: {
    title: "Bắt đầu tư vấn REGENAGLOW Cream",
    description: "Nhận gợi ý cách kết hợp REGENAGLOW NOURISH SHEER CREAM vào routine phục hồi phù hợp với tình trạng da của bạn.",
    ctaLabel: "Nhận tư vấn Cream",
    ctaHref: "/contact?type=cosmetic_interest&product=regenaglow_cream&source=product_landing_final"
  }
};

export default async function RegenaglowCreamPage() {
  // 1. Load CMS blocks for product page path
  const { blocks } = await loadPublicContentBlocks({
    siteKey: 'main',
    pagePath: '/cosmetic/products/regenaglow-nourish-sheer-cream',
    isPreview: false
  });

  const blockRecord = blocks?.find(b => b.blockType === 'cosmetic-product-landing-regenaglow-cream');
  
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
