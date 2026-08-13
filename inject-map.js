import * as fs from 'fs';

const translationsToAdd = {
  "Scientific beauty, refined into a pure Korean skincare ritual.  VAVAW is a clinical Korean cosmetic system designed to restore the skin from its origin — pure, balanced, and resilient.": "Vẻ đẹp khoa học, được tinh chỉnh thành nghi thức chăm sóc da Hàn Quốc thuần khiết. VAVAW là hệ mỹ phẩm Hàn Quốc định hướng lâm sàng, được phát triển để hỗ trợ làn da phục hồi từ nền tảng — tinh khiết, cân bằng và bền vững.",
  "Clinical Korean cosmetic ritual": "Nghi thức mỹ phẩm lâm sàng Hàn Quốc",
  "Spa-use recovery guidance": "Hướng dẫn phục hồi chuẩn spa",
  "Clinical Formula Logic": "Logic công thức lâm sàng",
  "Cellular regeneration & recovery": "Phục hồi và tái tạo tế bào",
  "A rich yet lightweight cream that deeply nourishes while encouraging cellular renewal for visibly rejuvenated skin.": "Chất kem đậm đặc nhưng mỏng nhẹ, hỗ trợ nuôi dưỡng chuyên sâu và cải thiện vẻ tươi mới cho làn da rạng rỡ hơn.",
  "A soothing gel formulated with a seven-extract Cica complex to calm reactive skin and restore the protective barrier.": "Gel làm dịu da với phức hợp Cica 7 chiết xuất giúp xoa dịu làn da nhạy cảm và phục hồi hàng rào bảo vệ.",
  "A next-generation ampoule harnessing Exosome technology and plant-derived Bakuchiol for visible skin renewal without irritation.": "Tinh chất thế hệ mới ứng dụng công nghệ Exosome và Bakuchiol nguồn gốc thực vật, hỗ trợ cải thiện vẻ tươi mới của làn da theo hướng êm dịu hơn.",
  "A high-performance moisturizer delivering an immediate and sustained surge of hydration for plumper, smoother skin.": "Kem dưỡng ẩm hiệu suất cao mang lại nguồn độ ẩm tức thì và duy trì dài lâu cho làn da căng mọng, mịn màng hơn.",
  "A lightweight preparatory toner that balances, hydrates, and primes the skin to maximize subsequent skincare absorption.": "Toner chuẩn bị với kết cấu mỏng nhẹ giúp cân bằng, cấp ẩm và tạo bước đệm hoàn hảo để tối đa hóa sự hấp thụ dưỡng chất sau đó.",
  "Clinical Formulas": "Công thức lâm sàng",
  "The Collection": "Bộ sưu tập",
  "Begin with a gentle clinical cleanser to remove impurities without disrupting the skin microbiome.": "Bắt đầu với sữa rửa mặt lâm sàng dịu nhẹ để loại bỏ tạp chất mà không làm ảnh hưởng đến hệ vi sinh trên da.",
  "P30 Boost Facial Hydrating Toner — balance pH and prime for maximum absorption.": "P30 Boost Facial Hydrating Toner — cân bằng độ pH và tạo bước đệm tối đa hóa khả năng hấp thụ dưỡng chất.",
  "Gentle Activation Renew Ampoule — activate cellular renewal and luminosity.": "Gentle Activation Renew Ampoule — kích hoạt tái tạo tế bào và độ rạng rỡ.",
  "Sheer Gel / Recovery Care": "Sheer Gel / Chăm sóc phục hồi",
  "Calmiance Superior Sheer Gel — calm, protect, and fortify the skin barrier.": "Calmiance Superior Sheer Gel — làm dịu, bảo vệ và củng cố hàng rào bảo vệ da.",
  "Daily Clinical Ritual": "Nghi thức lâm sàng hàng ngày",
  "Barrier Recovery Ritual": "Nghi thức phục hồi hàng rào bảo vệ",
  "A calming recovery routine designed to restore skin comfort, hydration, and resilience.": "Quy trình phục hồi làm dịu được thiết kế để khôi phục sự thoải mái, độ ẩm và sức đề kháng cho làn da.",
  "A lightweight clinical hydration routine to plump, smooth and refresh dehydrated skin.": "Quy trình cấp ẩm lâm sàng mỏng nhẹ giúp làm căng mọng, mịn màng và tươi mới làn da thiếu nước.",
  "An advanced regenerative skincare regimen to improve cell turnover, firmness, and reduce fine lines.": "Phác đồ chăm sóc chuyên sâu, hỗ trợ quá trình làm mới bề mặt da, cải thiện cảm giác săn chắc và làm mềm vẻ xuất hiện của nếp nhăn nhỏ.",
  "FEATURED SET": "BỘ SẢN PHẨM NỔI BẬT",
  "Radiance Recovery": "Phục hồi độ rạng rỡ",
  "Korean Recovery Ritual": "Nghi thức phục hồi Hàn Quốc",
  "PRODUCT INFORMATION": "THÔNG TIN SẢN PHẨM",
  "Focused recovery care for barrier, hydration and radiance.": "Chăm sóc phục hồi chuyên sâu cho hàng rào bảo vệ, độ ẩm và sự rạng rỡ.",
  "Supports healthy skin hydration and balances pH levels after cleansing.": "Hỗ trợ độ ẩm khỏe mạnh và cân bằng độ pH sau khi rửa mặt.",
  "Helps improve appearance of skin tone and texture with active technology.": "Hỗ trợ cải thiện vẻ ngoài của tông da và kết cấu da nhờ công nghệ hoạt chất.",
  "Supports skin barrier recovery and helps maintain natural resilience.": "Hỗ trợ phục hồi hàng rào bảo vệ da và duy trì sức đề kháng tự nhiên.",
  "Helps skin feel smoother and retains moisture for long-lasting hydration.": "Giúp làn da có cảm giác mịn màng hơn và hỗ trợ duy trì độ ẩm dài lâu.",
  "ACTIVE INGREDIENTS": "THÀNH PHẦN HOẠT CHẤT",
  "Aqua, Glycerin, Collagen Water, Peptide Complex, Hyaluronic Acid, Berry Complex Extracts and other cosmetic ingredients. Please refer to the product packaging for the complete ingredient list.": "Aqua, Glycerin, Collagen Water, Peptide Complex, Hyaluronic Acid, Berry Complex Extracts và các thành phần mỹ phẩm khác. Vui lòng tham khảo bao bì sản phẩm để xem danh sách thành phần đầy đủ.",
  "Collagen Water, Exosome, Peptide Complex, Hyaluronic Acid, Glycerin and other cosmetic ingredients. Please refer to the product packaging for the complete ingredient list.": "Collagen Water, Exosome, Peptide Complex, Hyaluronic Acid, Glycerin và các thành phần mỹ phẩm khác. Vui lòng tham khảo bao bì sản phẩm để xem danh sách thành phần đầy đủ.",
  "Focused delivery support for recovery-oriented skincare.": "Hỗ trợ dẫn truyền chuyên sâu cho quy trình chăm sóc da định hướng phục hồi.",
  "Skin recovery ritual tailored to individual skin concerns": "Nghi thức phục hồi da được thiết kế riêng cho từng vấn đề da",
  "Professional treatment compatibility for spa and clinic use": "Phù hợp với quy trình chăm sóc chuyên nghiệp tại spa và clinic",
  "Personalized care guidance from certified skincare specialists": "Hướng dẫn chăm sóc cá nhân hóa từ các chuyên gia chăm sóc da",
  "A personalized skincare experience designed for spa, clinic, and professional treatment environments — where expertise meets Korean clinical precision.": "Trải nghiệm chăm sóc da cá nhân hóa dành cho spa, clinic và môi trường chăm sóc chuyên nghiệp — nơi chuyên môn kết hợp cùng sự chính xác theo định hướng Hàn Quốc.",
  "Signature Recovery Collection": "Bộ sản phẩm phục hồi đặc trưng",
  "Explore the Ritual": "Khám phá nghi thức",
  "A complete recovery set designed to support the skin barrier and restore a luminous, balanced appearance.": "Bộ sản phẩm phục hồi toàn diện được thiết kế để hỗ trợ hàng rào bảo vệ da và khôi phục vẻ ngoài cân bằng, rạng rỡ."
};

const mapFilePath = 'e:/Downloads/VAVAW-web/packages/brand-config/src/cosmetic-vietnamese-copy-map.ts';
let content = fs.readFileSync(mapFilePath, 'utf-8');

const injectionPoint = 'export const COSMETIC_VI_COPY_MAP: Record<string, string> = {';

if (content.includes(injectionPoint)) {
    let toInject = '';
    for (const [en, vi] of Object.entries(translationsToAdd)) {
        // Only inject if not already present
        if (!content.includes(JSON.stringify(en))) {
            toInject += `  ${JSON.stringify(en)}: ${JSON.stringify(vi)},\n`;
        }
    }
    
    content = content.replace(injectionPoint, injectionPoint + '\n' + toInject);
    fs.writeFileSync(mapFilePath, content);
    console.log('Successfully injected translations.');
} else {
    console.error('Could not find injection point');
}
