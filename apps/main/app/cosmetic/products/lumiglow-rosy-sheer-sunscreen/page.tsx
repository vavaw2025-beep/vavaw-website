import { Metadata } from 'next';
import { loadPublicCosmeticMedia } from '@/lib/load-public-cosmetic-media';
import { loadPublicContentBlocks } from '@/lib/load-public-content-blocks';
import { ProductLandingPage } from '../_components/ProductLandingPage';
import { mergeProductLandingContent } from '../_lib/merge-product-landing-content';
import { ProductLandingContent } from '../_components/product-landing-types';

export const revalidate = 60; // 1 minute revalidation

export const metadata: Metadata = {
  title: 'LUMIGLOW ROSY SHEER SUNSCREEN | VAVAW Cosmetic',
  description: 'Kem chống nắng nâng tông hồng nhẹ trong routine VAVAW, hỗ trợ bảo vệ da ban ngày và hoàn thiện routine phục hồi với hiệu ứng da sáng khỏe tự nhiên.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://vavaw.vn'}/cosmetic/products/lumiglow-rosy-sheer-sunscreen`,
  },
  openGraph: {
    title: 'LUMIGLOW ROSY SHEER SUNSCREEN | VAVAW Cosmetic',
    description: 'Kem chống nắng nâng tông hồng nhẹ trong routine VAVAW, hỗ trợ bảo vệ da ban ngày và hoàn thiện routine phục hồi với hiệu ứng da sáng khỏe tự nhiên.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://vavaw.vn'}/cosmetic/products/lumiglow-rosy-sheer-sunscreen`,
    siteName: 'VAVAW Ecosystem',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LUMIGLOW ROSY SHEER SUNSCREEN | VAVAW Cosmetic',
    description: 'Kem chống nắng nâng tông hồng nhẹ trong routine VAVAW, hỗ trợ bảo vệ da ban ngày và hoàn thiện routine phục hồi với hiệu ứng da sáng khỏe tự nhiên.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const DEFAULT_CONTENT: ProductLandingContent = {
  eyebrow: "VAVAW COSMETIC SUNSCREEN",
  title: "LUMIGLOW ROSY SHEER SUNSCREEN",
  headline: "Kem chống nắng nâng tông hồng nhẹ giúp bảo vệ da ban ngày và hoàn thiện routine phục hồi.",
  description: "LUMIGLOW ROSY SHEER SUNSCREEN là bước bảo vệ ban ngày trong routine VAVAW, được thiết kế để hỗ trợ bảo vệ da trước tác động môi trường, tạo hiệu ứng da sáng khỏe tự nhiên và hoàn thiện routine phục hồi hằng ngày.",
  ctaLabel: "Nhận tư vấn LUMIGLOW Sunscreen",
  ctaHref: "/contact?type=cosmetic_interest&product=lumiglow_sunscreen&source=product_landing",
  secondaryCtaLabel: "Quay lại VAVAW Cosmetic",
  secondaryCtaHref: "/cosmetic",
  heroMediaSlot: "cosmetic-product-lumiglow-sunscreen",
  insideSet: [
    {
      name: "LUMIGLOW ROSY SHEER SUNSCREEN",
      size: "50ml",
      role: "Kem chống nắng nâng tông hồng nhẹ",
      description: "Hỗ trợ bảo vệ da ban ngày, giúp da trông sáng khỏe tự nhiên và phù hợp để hoàn thiện routine phục hồi buổi sáng.",
      mediaSlot: "cosmetic-product-lumiglow-sunscreen"
    }
  ],
  recoveryLogic: [
    { step: "01. Prepare", title: "Làm sạch và cân bằng da.", description: "" },
    { step: "02. Treat", title: "Dùng serum hoặc ampoule phù hợp nếu có.", description: "" },
    { step: "03. Recover", title: "Dưỡng ẩm bằng gel hoặc kem dưỡng.", description: "" },
    { step: "04. Seal", title: "Hoàn thiện lớp dưỡng trước chống nắng.", description: "" },
    { step: "05. Protect", title: "Thoa LUMIGLOW ROSY SHEER SUNSCREEN vào ban ngày.", description: "" }
  ],
  activeTech: [
    {
      name: "Hybrid UV Filter",
      role: "Daily protection shield",
      description: "Hỗ trợ bảo vệ da khỏi tác động của ánh nắng trong routine ban ngày.",
      product: "LUMIGLOW ROSY SHEER SUNSCREEN"
    },
    {
      name: "Rosy Tone-Up Finish",
      role: "Healthy glow appearance",
      description: "Giúp da trông sáng khỏe tự nhiên với hiệu ứng hồng nhẹ.",
      product: "LUMIGLOW ROSY SHEER SUNSCREEN"
    },
    {
      name: "Moisture Support",
      role: "Comfort layer",
      description: "Hỗ trợ cảm giác ẩm mượt và dễ chịu khi dùng hằng ngày.",
      product: "LUMIGLOW ROSY SHEER SUNSCREEN"
    },
    {
      name: "Sheer Sunscreen Texture",
      role: "Lightweight daytime finish",
      description: "Kết cấu mỏng nhẹ, phù hợp sử dụng sau routine dưỡng buổi sáng.",
      product: "LUMIGLOW ROSY SHEER SUNSCREEN"
    }
  ],
  whoItsFor: [
    "Da cần kem chống nắng dùng hằng ngày",
    "Da muốn hiệu ứng sáng khỏe hồng nhẹ",
    "Da đang trong routine phục hồi buổi sáng",
    "Người muốn lớp chống nắng mỏng nhẹ, dễ dùng",
    "Người cần hoàn thiện routine chăm sóc tại nhà"
  ],
  howToUse: [
    { step: "01", title: "Hoàn thiện các bước dưỡng da buổi sáng", description: "" },
    { step: "02", title: "Lấy lượng kem chống nắng vừa đủ", description: "" },
    { step: "03", title: "Thoa đều lên mặt và cổ", description: "" },
    { step: "04", title: "Dặm lại khi cần thiết trong ngày", description: "" },
    { step: "05", title: "Kết hợp che chắn khi tiếp xúc ánh nắng lâu", description: "" }
  ],
  spaBridge: {
    title: "Bước bảo vệ ban ngày trong routine tại VAVAW Beauty & Co",
    description: "LUMIGLOW ROSY SHEER SUNSCREEN có thể được tư vấn như bước bảo vệ ban ngày sau routine phục hồi, giúp duy trì làn da trông sáng khỏe và được chăm sóc đều đặn.",
    ctaLabel: "Trải nghiệm tại VAVAW Beauty & Co",
    ctaHref: "https://beauty.vavaw.vn"
  },
  productInfo: [
    { label: "Tên sản phẩm", "value": "LUMIGLOW ROSY SHEER SUNSCREEN" },
    { label: "Dung tích", "value": "50ml" },
    { label: "Loại sản phẩm", "value": "Kem chống nắng nâng tông" },
    { label: "Bước sử dụng", "value": "Bước cuối routine buổi sáng" },
    { label: "Gợi ý kết hợp", "value": "P30 Boost Facial Moisturizer hoặc REGENAGLOW NOURISH SHEER CREAM" },
    { label: "Lưu ý", "value": "Chỉ dùng ngoài da. Tránh tiếp xúc trực tiếp với mắt. Dùng lại khi cần thiết trong ngày." }
  ],
  finalCta: {
    title: "Bắt đầu tư vấn LUMIGLOW Sunscreen",
    description: "Nhận gợi ý cách kết hợp LUMIGLOW ROSY SHEER SUNSCREEN vào routine ban ngày phù hợp với tình trạng da của bạn.",
    ctaLabel: "Nhận tư vấn Sunscreen",
    ctaHref: "/contact?type=cosmetic_interest&product=lumiglow_sunscreen&source=product_landing_final"
  }
};

export default async function LumiglowSunscreenPage() {
  // 1. Load CMS blocks for product page path
  const { blocks } = await loadPublicContentBlocks({
    siteKey: 'main',
    pagePath: '/cosmetic/products/lumiglow-rosy-sheer-sunscreen',
    isPreview: false
  });

  const blockRecord = blocks?.find(b => b.blockType === 'cosmetic-product-landing-lumiglow-sunscreen');
  
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

