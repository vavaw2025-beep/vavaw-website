import { Metadata } from 'next';
import { loadPublicCosmeticMedia } from '@/lib/load-public-cosmetic-media';
import { loadPublicContentBlocks } from '@/lib/load-public-content-blocks';
import { ProductLandingPage } from '../_components/ProductLandingPage';
import { mergeProductLandingContent } from '../_lib/merge-product-landing-content';
import { ProductLandingContent } from '../_components/product-landing-types';

export const revalidate = 60; // 1 minute revalidation

export const metadata: Metadata = {
  title: 'Gentle Activation Renew Ampoule | VAVAW Cosmetic',
  description: 'Ampoule treatment dịu nhẹ trong routine VAVAW, hỗ trợ vẻ ngoài rạng rỡ, mịn màng và phục hồi sau chăm sóc chuyên sâu.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://vavaw.vn'}/cosmetic/products/gentle-activation-renew-ampoule`,
  },
  openGraph: {
    title: 'Gentle Activation Renew Ampoule | VAVAW Cosmetic',
    description: 'Ampoule treatment dịu nhẹ trong routine VAVAW, hỗ trợ vẻ ngoài rạng rỡ, mịn màng và phục hồi sau chăm sóc chuyên sâu.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://vavaw.vn'}/cosmetic/products/gentle-activation-renew-ampoule`,
    siteName: 'VAVAW Ecosystem',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gentle Activation Renew Ampoule | VAVAW Cosmetic',
    description: 'Ampoule treatment dịu nhẹ trong routine VAVAW, hỗ trợ vẻ ngoài rạng rỡ, mịn màng và phục hồi sau chăm sóc chuyên sâu.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const DEFAULT_CONTENT: ProductLandingContent = {
  eyebrow: "VAVAW COSMETIC AMPOULE",
  title: "Gentle Activation Renew Ampoule",
  headline: "Ampoule treatment dịu nhẹ hỗ trợ vẻ ngoài rạng rỡ, mịn màng và phục hồi sau chăm sóc chuyên sâu.",
  description: "Gentle Activation Renew Ampoule là bước treatment trong routine phục hồi VAVAW, được thiết kế để hỗ trợ làn da cần cải thiện vẻ xỉn màu, bề mặt kém mịn và cảm giác thiếu sức sống sau các tác động hằng ngày.",
  ctaLabel: "Nhận tư vấn Renew Ampoule",
  ctaHref: "/contact?type=cosmetic_interest&product=renew_ampoule&source=product_landing",
  secondaryCtaLabel: "Quay lại VAVAW Cosmetic",
  secondaryCtaHref: "/cosmetic",
  heroMediaSlot: "cosmetic-product-renew-ampoule",
  insideSet: [
    {
      name: "Gentle Activation Renew Ampoule",
      size: "30ml",
      role: "Ampoule treatment phục hồi rạng rỡ",
      description: "Hỗ trợ làn da trông mịn màng, rạng rỡ hơn và giúp routine phục hồi có bước treatment chuyên sâu nhưng vẫn nhẹ nhàng.",
      mediaSlot: "cosmetic-product-renew-ampoule"
    }
  ],
  recoveryLogic: [
    { step: "01. Prepare", title: "Làm sạch và cân bằng da bằng toner.", description: "" },
    { step: "02. Treat", title: "Thoa Gentle Activation Renew Ampoule như bước treatment chính.", description: "" },
    { step: "03. Recover", title: "Hỗ trợ làn da trông rạng rỡ và đều bề mặt hơn.", description: "" },
    { step: "04. Seal", title: "Khóa ẩm bằng gel hoặc kem dưỡng phù hợp.", description: "" },
    { step: "05. Protect", title: "Ban ngày kết hợp kem chống nắng.", description: "" }
  ],
  activeTech: [
    {
      name: "Exosome",
      role: "Renewal appearance support",
      description: "Hỗ trợ vẻ ngoài mịn màng, rạng rỡ và giúp làn da trông có sức sống hơn.",
      product: "Gentle Activation Renew Ampoule"
    },
    {
      name: "Bakuchiol",
      role: "Gentle renewal support",
      description: "Hỗ trợ routine làm mới làn da với cảm giác nhẹ nhàng hơn.",
      product: "Gentle Activation Renew Ampoule"
    },
    {
      name: "Peptide Complex",
      role: "Firmness support",
      description: "Hỗ trợ hàng rào bảo vệ và giúp bề mặt da trông săn mịn hơn.",
      product: "Gentle Activation Renew Ampoule"
    },
    {
      name: "Hydration Support",
      role: "Comfort layer",
      description: "Giúp làn da có cảm giác ẩm mượt và dễ chịu hơn sau bước treatment.",
      product: "Gentle Activation Renew Ampoule"
    }
  ],
  whoItsFor: [
    "Da xỉn màu, thiếu sức sống",
    "Da cần cải thiện vẻ mịn màng",
    "Da cần bước treatment dịu nhẹ trong routine phục hồi",
    "Da sau chăm sóc chuyên sâu cần routine tại nhà ổn định",
    "Người muốn hỗ trợ vẻ ngoài rạng rỡ mà không làm routine quá nặng"
  ],
  howToUse: [
    { step: "01", title: "Làm sạch và cân bằng da", description: "" },
    { step: "02", title: "Lấy lượng ampoule vừa đủ", description: "" },
    { step: "03", title: "Thoa đều lên mặt, tránh vùng mắt", description: "" },
    { step: "04", title: "Vỗ nhẹ đến khi thẩm thấu", description: "" },
    { step: "05", title: "Khóa ẩm bằng gel hoặc kem dưỡng phù hợp", description: "" }
  ],
  spaBridge: {
    title: "Bước treatment rạng rỡ trong routine tại VAVAW Beauty & Co",
    description: "Gentle Activation Renew Ampoule có thể được tư vấn như bước treatment hỗ trợ vẻ ngoài rạng rỡ và mịn màng hơn trong routine phục hồi tại nhà sau trải nghiệm chăm sóc chuyên sâu.",
    ctaLabel: "Trải nghiệm tại VAVAW Beauty & Co",
    ctaHref: "https://beauty.vavaw.vn"
  },
  productInfo: [
    { label: "Tên sản phẩm", "value": "Gentle Activation Renew Ampoule" },
    { label: "Dung tích", "value": "30ml" },
    { label: "Loại sản phẩm", "value": "Ampoule treatment" },
    { label: "Bước sử dụng", "value": "Sau toner, trước gel/kem dưỡng" },
    { label: "Gợi ý kết hợp", "value": "P30 Boost Facial Hydrating Toner hoặc REGENAGLOW NOURISH SHEER CREAM" },
    { label: "Lưu ý", "value": "Chỉ dùng ngoài da. Tránh tiếp xúc trực tiếp với mắt." }
  ],
  finalCta: {
    title: "Bắt đầu tư vấn Renew Ampoule",
    description: "Nhận gợi ý cách kết hợp Gentle Activation Renew Ampoule vào routine phục hồi phù hợp với tình trạng da của bạn.",
    ctaLabel: "Nhận tư vấn Renew Ampoule",
    ctaHref: "/contact?type=cosmetic_interest&product=renew_ampoule&source=product_landing_final"
  }
};

export default async function RenewAmpoulePage() {
  // 1. Load CMS blocks for product page path
  const { blocks } = await loadPublicContentBlocks({
    siteKey: 'main',
    pagePath: '/cosmetic/products/gentle-activation-renew-ampoule',
    isPreview: false
  });

  const blockRecord = blocks?.find(b => b.blockType === 'cosmetic-product-landing-renew-ampoule');
  
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

