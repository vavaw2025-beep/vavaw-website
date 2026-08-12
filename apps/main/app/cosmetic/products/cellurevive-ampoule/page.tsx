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
  secondaryCtaLabel: "Khám phá Luminous Set",
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
  productDetailForm: {
    eyebrow: "PRODUCT INFORMATION",
    title: "CELLUREVIVE INTENSIVE SHEER AMPOULE",
    description: "Thông tin chi tiết về sản phẩm Tinh chất CelluRevive Intensive Sheer Ampoule theo hồ sơ mỹ phẩm chính thức.",
    showDescription: true,
    showLegalInfo: true,
    showProductItems: true,
    showIngredients: true,
    showCautions: true,
    showStorage: true,
    showQualityGuarantee: true,
    legalInfo: [
      { label: "Tên sản phẩm", value: "Tinh chất CelluRevive Intensive Sheer Ampoule" },
      { label: "Dung tích", value: "7 ml × 4 ống" },
      { label: "Đối tượng sử dụng", value: "Phù hợp cho mọi loại da, đặc biệt là da mỏng yếu và da cần phục hồi", highlight: true },
      { label: "Hạn sử dụng sau khi mở nắp", value: "12 tháng" },
      { label: "Hạn sử dụng trước khi mở nắp", value: "Xem trên bao bì sản phẩm" },
      { label: "Nhà sản xuất", value: "IRE Cosmetic Co., Ltd." },
      { label: "Đơn vị phân phối", value: "BRL Company Co., Ltd.", highlight: true },
      { label: "Trung tâm chăm sóc khách hàng", value: "070-7633-0987", highlight: true },
      { label: "Nước sản xuất", value: "Hàn Quốc" },
      { label: "Tình trạng phê duyệt MFDS", value: "Có (Mỹ phẩm chức năng: Hỗ trợ cải thiện nếp nhăn)", highlight: true },
      { label: "Hướng dẫn sử dụng", value: "Lấy một lượng vừa đủ thoa đều lên da mặt sau bước toner, vỗ nhẹ để tinh chất thẩm thấu.", highlight: true }
    ],
    productItems: [
      {
        name: "Tinh chất CelluRevive Intensive Sheer Ampoule",
        volume: "7 ml × 4 ống",
        functionClaim: "Mỹ phẩm chức năng: Hỗ trợ cải thiện nếp nhăn",
        ingredients: "Nước Collagen (830,000 ppm), Methylpropanediol, Glycerin, Glyceryl Acrylate/Acrylic Acid Copolymer, Sodium Hyaluronate, 1,2-Hexanediol, Túi ngoại bào từ tế bào mô sẹo Rau Má (Centella Asiatica Callus Extracellular Vesicles) (10,000 ppm), SH-Oligopeptide-2, Carbomer, Arginine, Polyglyceryl-10 Laurate, Ethylhexylglycerin, Adenosine, Trisodium EDTA, SH-Polypeptide-1, RH-Oligopeptide-1, Hydrolyzed Hyaluronic Acid, Hyaluronic Acid, Hydroxypropyltrimonium Hyaluronate, Sodium Acetylated Hyaluronate, Sodium Hyaluronate Crosspolymer, Hydrolyzed Sodium Hyaluronate, Potassium Hyaluronate, Sodium Hyaluronate Dimethylsilanol, Dimethylsilanol Hyaluronate, Butylene Glycol."
      }
    ],
    cautions: [
      "Nếu xuất hiện triệu chứng bất thường như nổi mẩn đỏ, sưng tấy hoặc ngứa do tiếp xúc trực tiếp với ánh nắng khi sử dụng, hãy ngưng sử dụng và tham khảo ý kiến bác sĩ chuyên khoa da liễu.",
      "Không dùng trên vùng da có vết thương hở.",
      "Bảo quản xa tầm tay trẻ em.",
      "Tránh ánh nắng trực tiếp."
    ],
    storage: "Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp.",
    qualityGuarantee: "Trong trường hợp sản phẩm có lỗi, việc bồi thường sẽ được thực hiện theo Tiêu chuẩn giải quyết tranh chấp người tiêu dùng do Ủy ban Thương mại Công bằng Hàn Quốc ban hành."
  },
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
  return (
    <ProductLandingPage
      content={mergedContent}
      cosmeticMedia={media}
      canonicalPath="/cosmetic/products/cellurevive-ampoule"
    />
  );
}
