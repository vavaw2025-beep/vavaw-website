import { Metadata } from 'next';
import { loadPublicCosmeticMedia } from '@/lib/load-public-cosmetic-media';
import { loadPublicContentBlocks } from '@/lib/load-public-content-blocks';
import { ProductLandingPage } from '../_components/ProductLandingPage';
import { mergeProductLandingContent } from '../_lib/merge-product-landing-content';
import { ProductLandingContent } from '../_components/product-landing-types';

export const revalidate = 60; // 1 minute revalidation

export const metadata: Metadata = {
  title: 'Calmiance Superior Sheer Gel | VAVAW Cosmetic',
  description: 'Gel phục hồi mỏng nhẹ trong routine VAVAW, giúp cấp ẩm nhẹ, hỗ trợ cảm giác dễ chịu và duy trì hàng rào bảo vệ da ổn định hơn.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://vavaw.vn'}/cosmetic/products/calmiance-superior-sheer-gel`,
  },
  openGraph: {
    title: 'Calmiance Superior Sheer Gel | VAVAW Cosmetic',
    description: 'Gel phục hồi mỏng nhẹ trong routine VAVAW, giúp cấp ẩm nhẹ, hỗ trợ cảm giác dễ chịu và duy trì hàng rào bảo vệ da ổn định hơn.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://vavaw.vn'}/cosmetic/products/calmiance-superior-sheer-gel`,
    siteName: 'VAVAW Ecosystem',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calmiance Superior Sheer Gel | VAVAW Cosmetic',
    description: 'Gel phục hồi mỏng nhẹ trong routine VAVAW, giúp cấp ẩm nhẹ, hỗ trợ cảm giác dễ chịu và duy trì hàng rào bảo vệ da ổn định hơn.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const DEFAULT_CONTENT: ProductLandingContent = {
  eyebrow: "VAVAW COSMETIC RECOVERY GEL",
  title: "Calmiance Superior Sheer Gel",
  headline: "Gel phục hồi mỏng nhẹ giúp làm dịu cảm giác khó chịu và hỗ trợ làn da cần cân bằng sau chăm sóc chuyên sâu.",
  description: "Calmiance Superior Sheer Gel là bước gel phục hồi trong routine VAVAW, được thiết kế cho làn da cần cảm giác nhẹ dịu, ẩm mát và hỗ trợ hàng rào bảo vệ trong quá trình phục hồi hằng ngày.",
  ctaLabel: "Nhận tư vấn Calmiance Gel",
  ctaHref: "/contact?type=cosmetic_interest&product=calmiance_gel&source=product_landing",
  secondaryCtaLabel: "Quay lại VAVAW Cosmetic",
  secondaryCtaHref: "/cosmetic",
  heroMediaSlot: "cosmetic-product-calmiance-gel",
  insideSet: [
    {
      name: "Calmiance Superior Sheer Gel",
      size: "120ml",
      role: "Gel phục hồi mỏng nhẹ",
      description: "Hỗ trợ cảm giác dễ chịu cho da, giúp cấp ẩm nhẹ và duy trì hàng rào bảo vệ da ổn định hơn.",
      mediaSlot: "cosmetic-product-calmiance-gel"
    }
  ],
  recoveryLogic: [
    { step: "01. Prepare", title: "Làm sạch và cân bằng da.", description: "" },
    { step: "02. Treat", title: "Dùng treatment phù hợp nếu có.", description: "" },
    { step: "03. Recover", title: "Thoa Calmiance Superior Sheer Gel để hỗ trợ cảm giác dịu mát.", description: "" },
    { step: "04. Seal", title: "Có thể khóa ẩm thêm bằng kem dưỡng nếu da khô.", description: "" },
    { step: "05. Protect", title: "Ban ngày kết hợp kem chống nắng.", description: "" }
  ],
  activeTech: [
    {
      name: "Cica 7 Complex",
      role: "Soothing barrier care",
      description: "Hỗ trợ cảm giác dễ chịu cho da và giúp làn da trông ổn định hơn.",
      product: "Calmiance Superior Sheer Gel"
    },
    {
      name: "Hyaluronic Acid",
      role: "Lightweight hydration",
      description: "Giúp bổ sung cảm giác ẩm mượt mà không làm da nặng mặt.",
      product: "Calmiance Superior Sheer Gel"
    },
    {
      name: "Peptide Support",
      role: "Barrier support",
      description: "Hỗ trợ hàng rào bảo vệ và giúp bề mặt da trông mềm mịn hơn.",
      product: "Calmiance Superior Sheer Gel"
    },
    {
      name: "Sheer Gel Texture",
      role: "Cooling comfort finish",
      description: "Kết cấu gel mỏng nhẹ, phù hợp dùng sáng và tối trong routine phục hồi.",
      product: "Calmiance Superior Sheer Gel"
    }
  ],
  whoItsFor: [
    "Da cần cảm giác dịu nhẹ sau chăm sóc chuyên sâu",
    "Da khô nhẹ, thiếu nước hoặc dễ căng",
    "Da cần routine phục hồi mỏng nhẹ",
    "Da muốn cấp ẩm nhưng không thích cảm giác bí nặng",
    "Người cần sản phẩm hỗ trợ hàng rào bảo vệ trong routine hằng ngày"
  ],
  howToUse: [
    { step: "01", title: "Làm sạch và cân bằng da", description: "" },
    { step: "02", title: "Lấy lượng gel vừa đủ", description: "" },
    { step: "03", title: "Thoa đều lên mặt và cổ", description: "" },
    { step: "04", title: "Vỗ nhẹ để gel thẩm thấu", description: "" },
    { step: "05", title: "Ban ngày dùng thêm kem chống nắng", description: "" }
  ],
  spaBridge: {
    title: "Bước phục hồi nhẹ dịu trong routine tại VAVAW Beauty & Co",
    description: "Calmiance Superior Sheer Gel có thể được tư vấn như bước hỗ trợ phục hồi nhẹ nhàng sau trải nghiệm chăm sóc chuyên sâu, giúp duy trì cảm giác ẩm mát và dễ chịu cho làn da.",
    ctaLabel: "Trải nghiệm tại VAVAW Beauty & Co",
    ctaHref: "https://beauty.vavaw.vn"
  },
  productInfo: [
    { label: "Tên sản phẩm", "value": "Calmiance Superior Sheer Gel" },
    { label: "Dung tích", "value": "120ml" },
    { label: "Loại sản phẩm", "value": "Gel phục hồi mỏng nhẹ" },
    { label: "Bước sử dụng", "value": "Sau toner hoặc treatment, trước kem dưỡng nếu cần" },
    { label: "Gợi ý kết hợp", "value": "P30 Boost Facial Hydrating Toner hoặc REGENAGLOW NOURISH SHEER CREAM" },
    { label: "Lưu ý", "value": "Chỉ dùng ngoài da. Tránh tiếp xúc trực tiếp với mắt." }
  ],
  finalCta: {
    title: "Bắt đầu tư vấn Calmiance Gel",
    description: "Nhận gợi ý cách kết hợp Calmiance Superior Sheer Gel vào routine phục hồi phù hợp với tình trạng da của bạn.",
    ctaLabel: "Nhận tư vấn Calmiance Gel",
    ctaHref: "/contact?type=cosmetic_interest&product=calmiance_gel&source=product_landing_final"
  }
};

export default async function CalmianceGelPage() {
  // 1. Load CMS blocks for product page path
  const { blocks } = await loadPublicContentBlocks({
    siteKey: 'main',
    pagePath: '/cosmetic/products/calmiance-superior-sheer-gel',
    isPreview: false
  });

  const blockRecord = blocks?.find(b => b.blockType === 'cosmetic-product-landing-calmiance-gel');
  
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

