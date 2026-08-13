import type { Metadata } from 'next';
import { Suspense } from 'react';
import { draftMode } from 'next/headers';
import { loadPublicCosmeticMedia } from '@/lib/load-public-cosmetic-media';
import { loadPublicContentBlocks } from '@/lib/load-public-content-blocks';
import { LuminousSetLandingPage } from './LuminousSetLandingPage';
import { mergeProductLandingContent } from '../_lib/merge-product-landing-content';
import { ProductLandingContent } from '../_components/product-landing-types';

const DEFAULT_CONTENT: ProductLandingContent = {
  eyebrow: 'LUMINOUS REVITALIZATION SHEER SET',
  title: 'Củng cố hàng rào bảo vệ — phục hồi — đánh thức độ rạng rỡ',
  headline: 'Premium recovery skincare set for barrier care, hydration and radiance.',
  description: 'Bộ chăm sóc phục hồi chuyên sâu kết hợp ampoule cô đặc và sheer cream, hỗ trợ làn da cần phục hồi, cấp ẩm và cải thiện vẻ rạng rỡ.',
  ctaLabel: 'Nhận tư vấn Luminous Set',
  ctaHref: '/contact?type=cosmetic_interest&product=luminous_set&source=product_landing',
  secondaryCtaLabel: 'Trải nghiệm tại VAVAW Beauty & Co',
  secondaryCtaHref: 'https://beauty.vavaw.vn',
  heroMediaSlot: 'cosmetic-product-luminous-set',
  heroDesktopMediaSlot: 'cosmetic-luminous-hero-desktop',
  heroMobileMediaSlot: 'cosmetic-luminous-hero-mobile',
  antiGravity: {
    eyebrow: 'ANTI-GRAVITY SOLUTION',
    title: 'Tập trung chăm sóc hàng rào bảo vệ da',
    headline: 'Công nghệ phục hồi giúp hỗ trợ làn da ổn định, ẩm mượt và rạng rỡ hơn.',
    description: 'Luminous Revitalization Sheer Set kết hợp các hoạt chất chăm sóc chuyên sâu nhằm hỗ trợ hàng rào bảo vệ da, bổ sung độ ẩm và giúp làn da trông mềm mại, mịn màng hơn sau routine phục hồi.',
    mediaSlot: 'cosmetic-luminous-anti-gravity-image',
    callouts: [
      { label: 'Collagen Support', value: '830,000ppm', description: 'Hỗ trợ cảm giác săn mịn và giúp da trông mềm mại hơn.' },
      { label: 'Exosome', value: '10,000ppm', description: 'Hỗ trợ vẻ ngoài rạng rỡ và bề mặt da trông mịn màng hơn.' },
      { label: 'Peptide Complex', value: 'Barrier Support', description: 'Hỗ trợ hàng rào bảo vệ và độ đàn hồi bề mặt da.' },
      { label: 'Berry Complex Extract', value: 'Antioxidant Care', description: 'Hỗ trợ chăm sóc làn da trước các tác động môi trường hằng ngày.' }
    ]
  },
  whoNeedsSet: {
    eyebrow: 'WHO NEEDS SHEER SET',
    title: 'Sheer Set dành cho làn da cần phục hồi chuyên sâu',
    note: 'Hiệu quả cảm nhận có thể khác nhau tùy tình trạng da và cách sử dụng của từng người.',
    description: 'Luminous Revitalization Sheer Set phù hợp với làn da cần routine phục hồi tại nhà sau chăm sóc chuyên sâu, giúp hỗ trợ cảm giác ẩm mượt, mềm mại và rạng rỡ hơn.',
    mediaSlot: 'cosmetic-luminous-who-for-image',
    imageCaption: 'Chăm sóc tại nhà tiện lợi hơn',
    items: [
      { text: 'Da bị kích ứng sau peel hoặc các liệu trình thẩm mỹ.' },
      { text: 'Da cần được bổ sung dưỡng chất và độ ẩm chuyên sâu.' },
      { text: 'Da khô ráp, sần sùi hoặc thiếu sức sống.' },
      { text: 'Da cần routine chăm sóc tập trung cho dấu hiệu lão hóa.' },
      { text: 'Người muốn duy trì chăm sóc phục hồi tại nhà một cách tiện lợi.' }
    ]
  },
  barrierScience: {
    eyebrow: 'STRENGTHENING THE SKIN BARRIER',
    title: 'Nền tảng của làn da khỏe là hàng rào bảo vệ ổn định.',
    description: 'Hàng rào bảo vệ da nằm ở lớp ngoài cùng của da, giúp duy trì độ ẩm, hỗ trợ cảm giác mềm mại và bảo vệ da trước các tác động từ môi trường hằng ngày.',
    mediaSlot: 'cosmetic-luminous-skin-barrier-image',
    mg3Eyebrow: 'VAVAW MG3-PLUS METHOD',
    mg3Title: 'Công nghệ MG3-Plus độc quyền của VAVAW',
    mg3Description: 'MG3-Plus được phát triển để hỗ trợ tối ưu hóa cách các thành phần chăm sóc da hoạt động trong routine, giúp làn da có cảm giác ẩm mượt, ổn định và được nuôi dưỡng tốt hơn.',
    mg3MediaSlot: 'cosmetic-luminous-mg3-plus-image'
  },
  activeIngredients: {
    eyebrow: 'ACTIVE INGREDIENTS',
    title: 'Các thành phần hỗ trợ làn da rạng rỡ hơn',
    description: 'Luminous Revitalization Sheer Set kết hợp các thành phần chăm sóc da được chọn lọc để hỗ trợ độ ẩm, hàng rào bảo vệ, vẻ mịn màng và cảm giác tươi sáng của làn da.',
    mediaSlot: 'cosmetic-luminous-active-ingredients-image',
    ingredients: [
      { name: 'Exosome', subtitle: 'Renewal Appearance Support', description: 'Hỗ trợ vẻ ngoài mịn màng, rạng rỡ và làn da trông có sức sống hơn.' },
      { name: 'Collagen Water', subtitle: 'Hydration & Elasticity Support', description: 'Giúp duy trì cảm giác ẩm mượt, mềm mại và hỗ trợ độ đàn hồi bề mặt da.' },
      { name: 'Complex Berry Extracts', subtitle: 'Antioxidant Care', description: 'Hỗ trợ chăm sóc làn da trước tác động môi trường và giúp da trông tươi sáng hơn.' },
      { name: 'Complex Peptides', subtitle: 'Barrier & Firmness Support', description: 'Hỗ trợ hàng rào bảo vệ và giúp bề mặt da trông săn mịn hơn.' },
      { name: 'Hydrolyzed Hyaluronic Acid', subtitle: 'Moisture Retention', description: 'Giúp bổ sung cảm giác ẩm mượt, hỗ trợ duy trì độ ẩm và tạo cảm giác da mềm mại hơn.' }
    ]
  },
  usageGuide: {
    eyebrow: 'VAVAW SHEER SET RITUAL',
    title: 'Hướng dẫn sử dụng VAVAW Sheer Set',
    description: 'Sử dụng theo thứ tự ampoule trước, cream sau để hỗ trợ bổ sung dưỡng chất, khóa ẩm và hoàn thiện routine phục hồi tại nhà.',
    setMediaSlot: 'cosmetic-luminous-usage-set-image',
    instructionMediaSlot: 'cosmetic-luminous-ampoule-instruction-image',
    note: 'Ban ngày nên hoàn thiện routine bằng kem chống nắng phù hợp.',
    steps: [
      { step: '01', title: 'Làm sạch và cân bằng da', description: 'Sau bước làm sạch, cân bằng da bằng toner để chuẩn bị bề mặt da cho routine phục hồi.' },
      { step: '02', title: 'Thoa CELLUREVIVE Ampoule', description: 'Lấy 2–3 giọt ampoule, thoa lần lượt lên trán, hai má và cằm.' },
      { step: '03', title: 'Vỗ nhẹ đến khi thẩm thấu', description: 'Massage hoặc vỗ nhẹ để ampoule thấm đều, tránh vùng mắt.' },
      { step: '04', title: 'Khóa ẩm bằng REGENAGLOW NOURISH SHEER CREAM', description: 'Thoa một lớp kem mỏng để hỗ trợ duy trì độ ẩm và cảm giác mềm mại.' },
      { step: '05', title: 'Layer thêm nếu cần', description: 'Khi lớp đầu đã thẩm thấu, có thể thoa thêm một lớp mỏng ở vùng da khô hoặc cần chăm sóc nhiều hơn.' }
    ]
  },
  productDetailForm: {
    eyebrow: 'PRODUCT INFORMATION',
    title: 'LUMINOUS REVITALIZATION SHEER SET',
    description: 'Thông tin sản phẩm được trình bày để khách hàng tham khảo trước khi nhận tư vấn routine phù hợp.',
    offlineTitle: 'Bạn cũng có thể trải nghiệm VAVAW tại cửa hàng offline',
    offlineDescription: 'VAVAW Beauty & Co giúp khách hàng hiểu cách kết hợp sản phẩm trong trải nghiệm chăm sóc chuyên nghiệp và routine tại nhà.',
    offlineMediaSlot: 'cosmetic-luminous-offline-experience-image',
    info: [
      { label: 'Tên sản phẩm', value: 'Luminous Revitalization Sheer Set' },
      { label: 'Bộ sản phẩm gồm', value: 'CELLUREVIVE Ampoule 7ml × 4ea và REGENAGLOW NOURISH SHEER CREAM 30ml × 1ea' },
      { label: 'Đối tượng sử dụng', value: 'Mọi loại da, đặc biệt là da cần phục hồi, cấp ẩm và hỗ trợ hàng rào bảo vệ' },
      { label: 'Hạn sử dụng sau khi mở', value: 'Khuyến nghị sử dụng trong vòng 12 tháng sau khi mở nắp hoặc theo thông tin trên bao bì sản phẩm' },
      { label: 'Xuất xứ', value: 'Hàn Quốc' },
      { label: 'Bước sử dụng', value: 'Sau làm sạch và toner, dùng ampoule trước, sau đó khóa ẩm bằng cream' },
      { label: 'Kênh tư vấn', value: 'VAVAW Cosmetic / VAVAW Beauty & Co' }
    ],
    ingredientGroups: [
      {
        title: 'REGENAGLOW NOURISH SHEER CREAM',
        subtitle: '30ml',
        ingredients: 'Aqua, Glycerin, Collagen Water, Peptide Complex, Hyaluronic Acid, Berry Complex Extracts and other cosmetic ingredients. Please refer to the product packaging for the complete ingredient list.'
      },
      {
        title: 'CELLUREVIVE Ampoule',
        subtitle: '7ml × 4ea',
        ingredients: 'Collagen Water, Exosome, Peptide Complex, Hyaluronic Acid, Glycerin and other cosmetic ingredients. Please refer to the product packaging for the complete ingredient list.'
      }
    ],
    cautions: [
      'Chỉ dùng ngoài da.',
      'Tránh tiếp xúc trực tiếp với mắt.',
      'Ngưng sử dụng và tham khảo chuyên viên nếu da có dấu hiệu bất thường.',
      'Để xa tầm tay trẻ em.',
      'Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp.'
    ],
    storage: 'Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp.',
    qualityGuarantee: 'Nếu sản phẩm có vấn đề về chất lượng, khách hàng có thể liên hệ VAVAW để được hỗ trợ theo chính sách hiện hành.'
  },
  insideSet: [
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
    { name: 'Exosome', role: 'Hỗ trợ phục hồi & truyền tín hiệu tế bào', description: 'Công nghệ sinh học tiên tiến hỗ trợ vận chuyển dưỡng chất, giúp da trông khỏe mạnh hơn và mang lại cảm giác dễ chịu cho làn da nhạy cảm.', product: 'CELLUREVIVE Ampoule' },
    { name: 'Collagen Water', role: 'Cấp ẩm & giúp duy trì săn chắc', description: 'Cung cấp nền tảng ẩm mượt dồi dào, giúp da trông căng mịn và cải thiện vẻ rạng rỡ tự nhiên.', product: 'Cả hai sản phẩm' },
    { name: 'Peptide Complex', role: 'Hỗ trợ cấu trúc da', description: 'Chuỗi peptide chuyên biệt hỗ trợ hàng rào bảo vệ, giúp duy trì độ đàn hồi và bề mặt da trông săn mịn.', product: 'Cả hai sản phẩm' },
    { name: 'MG3-Plus', role: 'Làm dịu & hỗ trợ giữ ẩm', description: 'Hoạt chất phục hồi giúp da cảm thấy dễ chịu hơn khi khô yếu và hỗ trợ duy trì độ ẩm trong nhiều giờ.', product: 'REGENAGLOW NOURISH SHEER CREAM' }
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
    { step: '04', title: 'Giữ ẩm bằng REGENAGLOW NOURISH SHEER CREAM', description: 'Thoa một lớp kem mỏng để giúp duy trì các dưỡng chất từ ampoule.' },
    { step: '05', title: 'Bảo vệ ban ngày', description: 'Luôn kết hợp kem chống nắng có màng lọc bảo vệ phổ rộng khi đi ra ngoài.' }
  ],
  spaBridge: {
    title: 'Có thể trải nghiệm trong quy trình chăm sóc tại VAVAW Beauty & Co',
    description: 'VAVAW Beauty & Co giúp khách hàng hiểu cách kết hợp sản phẩm trong trải nghiệm chăm sóc chuyên nghiệp và routine tại nhà.',
    ctaLabel: 'Trải nghiệm tại VAVAW Beauty & Co',
    ctaHref: 'https://beauty.vavaw.vn',
  },
  productInfo: [
    { label: 'Tên sản phẩm', value: 'Luminous Revitalization Sheer Set' },
    { label: 'Quy cách đóng gói', value: 'CELLUREVIVE Ampoule (7ml × 4 lọ) & REGENAGLOW NOURISH SHEER CREAM (30ml × 1 tuýp)' },
    { label: 'Công dụng chính', value: 'Hỗ trợ phục hồi da sau trị liệu, củng cố hàng rào ẩm, cải thiện độ đàn hồi và làm sáng da tự nhiên.' },
    { label: 'Hướng dẫn bảo quản', value: 'Nơi khô ráo thoáng mát, tránh ánh nắng trực tiếp. Nên dùng lọ ampoule trong vòng 7 ngày sau khi mở nắp.' },
    { label: 'Lưu ý khi sử dụng', value: 'Chỉ dùng ngoài da. Tránh tiếp xúc trực tiếp với mắt. Ngưng sử dụng nếu có dấu hiệu kích ứng.' }
  ],
  finalCta: {
    title: 'Bắt đầu tư vấn Luminous Set',
    description: 'Nhận gợi ý routine phù hợp với tình trạng da và nhu cầu chăm sóc của bạn.',
    ctaLabel: 'Nhận tư vấn Luminous Set',
    ctaHref: '/contact?type=cosmetic_interest&product=luminous_set&source=product_landing_final'
  }
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

  const blockRecord = blocks?.find(b => b.blockType === 'cosmetic-product-landing-luminous-set');
  
  // Requirement 2: Only use CMS content when the block exists and is_active=true
  const useCms = blockRecord && (isPreview ? true : blockRecord.isActive);
  const cmsBlock = (useCms ? (blockRecord.content || {}) : {}) as any;

  // Load cosmetic media urls
  const cosmeticMedia = await loadPublicCosmeticMedia(isPreview);

  // Merge CMS and Default Fallback content safely
  const mergedContent = mergeProductLandingContent(DEFAULT_CONTENT, cmsBlock);

  return (
    <LuminousSetLandingPage content={mergedContent} cosmeticMedia={cosmeticMedia} canonicalPath="/cosmetic/products/luminous-revitalization-sheer-set" />
  );
}


