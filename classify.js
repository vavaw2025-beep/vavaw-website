const fs = require('fs');

const data = [
  { path: '/cosmetic', type: 'cosmetic-brand-philosophy', text: 'Scientific beauty, refined into a pure Korean skincare ritual.  VAVAW is a clinical Korean cosmetic system designed to restore the skin from its origin — pure, balanced, and resilient.', class: 'translate-approved', trans: 'Vẻ đẹp khoa học, được tinh chỉnh thành nghi thức chăm sóc da Hàn Quốc thuần khiết. VAVAW là hệ thống mỹ phẩm lâm sàng Hàn Quốc được thiết kế nhằm phục hồi làn da từ gốc rễ — tinh khiết, cân bằng và đàn hồi.' },
  { path: '/cosmetic', type: 'cosmetic-final-cta', text: 'Clinical Korean cosmetic ritual', class: 'translate-approved', trans: 'Nghi thức mỹ phẩm lâm sàng Hàn Quốc' },
  { path: '/cosmetic', type: 'cosmetic-final-cta', text: 'Spa-use recovery guidance', class: 'translate-approved', trans: 'Hướng dẫn phục hồi chuẩn spa' },
  { path: '/cosmetic', type: 'cosmetic-ingredients', text: 'Clinical Formula Logic', class: 'translate-approved', trans: 'Logic công thức lâm sàng' },
  { path: '/cosmetic', type: 'cosmetic-ingredients', text: 'Cellular regeneration & recovery', class: 'translate-approved', trans: 'Phục hồi và tái tạo tế bào' },
  { path: '/cosmetic', type: 'cosmetic-product-cards', text: 'A rich yet lightweight cream that deeply nourishes while encouraging cellular renewal for visibly rejuvenated skin.', class: 'translate-approved', trans: 'Chất kem đậm đặc nhưng mỏng nhẹ giúp nuôi dưỡng chuyên sâu đồng thời kích thích tái tạo tế bào, mang lại làn da trẻ hóa rõ rệt.' },
  { path: '/cosmetic', type: 'cosmetic-product-cards', text: 'A soothing gel formulated with a seven-extract Cica complex to calm reactive skin and restore the protective barrier.', class: 'translate-approved', trans: 'Gel làm dịu da với phức hợp Cica 7 chiết xuất giúp xoa dịu làn da nhạy cảm và phục hồi hàng rào bảo vệ.' },
  { path: '/cosmetic', type: 'cosmetic-product-cards', text: 'A next-generation ampoule harnessing Exosome technology and plant-derived Bakuchiol for visible skin renewal without irritation.', class: 'translate-approved', trans: 'Tinh chất thế hệ mới ứng dụng công nghệ Exosome và Bakuchiol nguồn gốc thực vật giúp tái tạo da rõ rệt mà không gây kích ứng.' },
  { path: '/cosmetic', type: 'cosmetic-product-cards', text: 'A high-performance moisturizer delivering an immediate and sustained surge of hydration for plumper, smoother skin.', class: 'translate-approved', trans: 'Kem dưỡng ẩm hiệu suất cao mang lại nguồn độ ẩm tức thì và duy trì dài lâu cho làn da căng mọng, mịn màng hơn.' },
  { path: '/cosmetic', type: 'cosmetic-product-cards', text: 'A lightweight preparatory toner that balances, hydrates, and primes the skin to maximize subsequent skincare absorption.', class: 'translate-approved', trans: 'Toner chuẩn bị với kết cấu mỏng nhẹ giúp cân bằng, cấp ẩm và tạo bước đệm hoàn hảo để tối đa hóa sự hấp thụ dưỡng chất sau đó.' },
  { path: '/cosmetic', type: 'cosmetic-product-cards', text: 'Clinical Formulas', class: 'translate-approved', trans: 'Công thức lâm sàng' },
  { path: '/cosmetic', type: 'cosmetic-product-cards', text: 'The Collection', class: 'translate-approved', trans: 'Bộ sưu tập' },
  { path: '/cosmetic', type: 'cosmetic-daily-ritual', text: 'Begin with a gentle clinical cleanser to remove impurities without disrupting the skin microbiome.', class: 'translate-approved', trans: 'Bắt đầu với sữa rửa mặt lâm sàng dịu nhẹ để loại bỏ tạp chất mà không làm ảnh hưởng đến hệ vi sinh trên da.' },
  { path: '/cosmetic', type: 'cosmetic-daily-ritual', text: 'P30 Boost Facial Hydrating Toner — balance pH and prime for maximum absorption.', class: 'translate-approved', trans: 'P30 Boost Facial Hydrating Toner — cân bằng độ pH và tạo bước đệm tối đa hóa khả năng hấp thụ dưỡng chất.' },
  { path: '/cosmetic', type: 'cosmetic-daily-ritual', text: 'Gentle Activation Renew Ampoule — activate cellular renewal and luminosity.', class: 'translate-approved', trans: 'Gentle Activation Renew Ampoule — kích hoạt tái tạo tế bào và độ rạng rỡ.' },
  { path: '/cosmetic', type: 'cosmetic-daily-ritual', text: 'Sheer Gel / Recovery Care', class: 'translate-approved', trans: 'Sheer Gel / Chăm sóc phục hồi' },
  { path: '/cosmetic', type: 'cosmetic-daily-ritual', text: 'Calmiance Superior Sheer Gel — calm, protect, and fortify the skin barrier.', class: 'translate-approved', trans: 'Calmiance Superior Sheer Gel — làm dịu, bảo vệ và củng cố hàng rào bảo vệ da.' },
  { path: '/cosmetic', type: 'cosmetic-daily-ritual', text: 'Daily Clinical Ritual', class: 'translate-approved', trans: 'Nghi thức lâm sàng hàng ngày' },
  { path: '/cosmetic', type: 'cosmetic-daily-ritual', text: 'Barrier Recovery Ritual', class: 'translate-approved', trans: 'Nghi thức phục hồi hàng rào bảo vệ' },
  { path: '/cosmetic', type: 'cosmetic-daily-ritual', text: 'A calming recovery routine designed to restore skin comfort, hydration, and resilience.', class: 'translate-approved', trans: 'Quy trình phục hồi làm dịu được thiết kế để khôi phục sự thoải mái, độ ẩm và sức đề kháng cho làn da.' },
  { path: '/cosmetic', type: 'cosmetic-daily-ritual', text: 'A lightweight clinical hydration routine to plump, smooth and refresh dehydrated skin.', class: 'translate-approved', trans: 'Quy trình cấp ẩm lâm sàng mỏng nhẹ giúp làm căng mọng, mịn màng và tươi mới làn da thiếu nước.' },
  { path: '/cosmetic', type: 'cosmetic-daily-ritual', text: 'An advanced regenerative skincare regimen to improve cell turnover, firmness, and reduce fine lines.', class: 'translate-approved', trans: 'Phác đồ chăm sóc tái tạo chuyên sâu giúp cải thiện chu kỳ thay mới tế bào, tăng độ săn chắc và giảm thiểu nếp nhăn.' },
  { path: '/cosmetic', type: 'cosmetic-hero-product', text: 'FEATURED SET', class: 'translate-approved', trans: 'BỘ SẢN PHẨM NỔI BẬT' },
  { path: '/cosmetic', type: 'cosmetic-hero-product', text: 'Radiance Recovery', class: 'translate-approved', trans: 'Phục hồi độ rạng rỡ' },
  { path: '/cosmetic/products/cellurevive-ampoule', type: 'cosmetic-product-landing-cellurevive-ampoule', text: 'Korean Recovery Ritual', class: 'translate-approved', trans: 'Nghi thức phục hồi Hàn Quốc' },
  { path: '/cosmetic/products/cellurevive-ampoule', type: 'cosmetic-product-landing-cellurevive-ampoule', text: 'PRODUCT INFORMATION', class: 'translate-approved', trans: 'THÔNG TIN SẢN PHẨM' },
  { path: '/cosmetic/products/luminous-revitalization-sheer-set', type: 'cosmetic-product-landing-luminous-set', text: 'Focused recovery care for barrier, hydration and radiance.', class: 'translate-approved', trans: 'Chăm sóc phục hồi chuyên sâu cho hàng rào bảo vệ, độ ẩm và sự rạng rỡ.' },
  { path: '/cosmetic/products/luminous-revitalization-sheer-set', type: 'cosmetic-product-landing-luminous-set', text: 'Supports healthy skin hydration and balances pH levels after cleansing.', class: 'translate-approved', trans: 'Hỗ trợ độ ẩm khỏe mạnh và cân bằng độ pH sau khi rửa mặt.' },
  { path: '/cosmetic/products/luminous-revitalization-sheer-set', type: 'cosmetic-product-landing-luminous-set', text: 'Helps improve appearance of skin tone and texture with active technology.', class: 'translate-approved', trans: 'Giúp cải thiện tông màu và kết cấu da với công nghệ hoạt chất tiên tiến.' },
  { path: '/cosmetic/products/luminous-revitalization-sheer-set', type: 'cosmetic-product-landing-luminous-set', text: 'Supports skin barrier recovery and helps maintain natural resilience.', class: 'translate-approved', trans: 'Hỗ trợ phục hồi hàng rào bảo vệ da và duy trì sức đề kháng tự nhiên.' },
  { path: '/cosmetic/products/luminous-revitalization-sheer-set', type: 'cosmetic-product-landing-luminous-set', text: 'Helps skin feel smoother and retains moisture for long-lasting hydration.', class: 'translate-approved', trans: 'Giúp da cảm thấy mịn màng hơn và giữ độ ẩm dài lâu.' },
  { path: '/cosmetic/products/luminous-revitalization-sheer-set', type: 'cosmetic-product-landing-luminous-set', text: 'ACTIVE INGREDIENTS', class: 'translate-approved', trans: 'THÀNH PHẦN HOẠT CHẤT' },
  { path: '/cosmetic/products/luminous-revitalization-sheer-set', type: 'cosmetic-product-landing-luminous-set', text: 'VAVAW Cosmetic / VAVAW Beauty & Co', class: 'keep-brand-product', trans: '-' },
  { path: '/cosmetic/products/luminous-revitalization-sheer-set', type: 'cosmetic-product-landing-luminous-set', text: 'Aqua, Glycerin, Collagen Water, Peptide Complex, Hyaluronic Acid, Berry Complex Extracts and other cosmetic ingredients. Please refer to the product packaging for the complete ingredient list.', class: 'translate-approved', trans: 'Aqua, Glycerin, Nước Collagen, Phức hợp Peptide, Hyaluronic Acid, Chiết xuất phức hợp quả mọng và các thành phần mỹ phẩm khác. Vui lòng tham khảo bao bì sản phẩm để xem danh sách thành phần đầy đủ.' },
  { path: '/cosmetic/products/luminous-revitalization-sheer-set', type: 'cosmetic-product-landing-luminous-set', text: 'Collagen Water, Exosome, Peptide Complex, Hyaluronic Acid, Glycerin and other cosmetic ingredients. Please refer to the product packaging for the complete ingredient list.', class: 'translate-approved', trans: 'Nước Collagen, Exosome, Phức hợp Peptide, Hyaluronic Acid, Glycerin và các thành phần mỹ phẩm khác. Vui lòng tham khảo bao bì sản phẩm để xem danh sách thành phần đầy đủ.' },
  { path: '/cosmetic/products/luminous-revitalization-sheer-set', type: 'cosmetic-product-landing-luminous-set', text: 'Focused delivery support for recovery-oriented skincare.', class: 'translate-approved', trans: 'Hỗ trợ dẫn truyền chuyên sâu cho quy trình chăm sóc da định hướng phục hồi.' },
  { path: '/cosmetic/products/calmiance-superior-sheer-gel', type: 'cosmetic-product-landing-calmiance-gel', text: 'VAVAW COSMETIC RECOVERY GEL', class: 'keep-brand-product', trans: '-' },
  { path: '/cosmetic', type: 'cosmetic-premium-program', text: 'Skin recovery ritual tailored to individual skin concerns', class: 'translate-approved', trans: 'Nghi thức phục hồi da được thiết kế riêng cho từng vấn đề da' },
  { path: '/cosmetic', type: 'cosmetic-premium-program', text: 'Professional treatment compatibility for spa and clinic use', class: 'translate-approved', trans: 'Tương thích với các liệu trình chuyên nghiệp dùng tại spa và clinic' },
  { path: '/cosmetic', type: 'cosmetic-premium-program', text: 'Personalized care guidance from certified skincare specialists', class: 'translate-approved', trans: 'Hướng dẫn chăm sóc cá nhân hóa từ các chuyên gia chăm sóc da' },
  { path: '/cosmetic', type: 'cosmetic-premium-program', text: 'A personalized skincare experience designed for spa, clinic, and professional treatment environments — where expertise meets Korean clinical precision.', class: 'translate-approved', trans: 'Trải nghiệm chăm sóc da cá nhân hóa được thiết kế cho các môi trường spa, clinic và điều trị chuyên nghiệp — nơi sự chuyên môn kết hợp với độ chính xác lâm sàng Hàn Quốc.' },
  { path: '/cosmetic', type: 'cosmetic-signature-collection', text: 'Signature Recovery Collection', class: 'translate-approved', trans: 'Bộ sản phẩm phục hồi đặc trưng' },
  { path: '/cosmetic', type: 'cosmetic-signature-collection', text: 'Explore the Ritual', class: 'translate-approved', trans: 'Khám phá nghi thức' },
  { path: '/cosmetic', type: 'cosmetic-signature-collection', text: 'A complete recovery set designed to support the skin barrier and restore a luminous, balanced appearance.', class: 'translate-approved', trans: 'Bộ sản phẩm phục hồi toàn diện được thiết kế để hỗ trợ hàng rào bảo vệ da và khôi phục vẻ ngoài cân bằng, rạng rỡ.' }
];

let md = `# Remaining English Copy Candidates Report

| Page Path | Block Type | English Candidate | Classification | Proposed Vietnamese | Action |
|---|---|---|---|---|---|
`;

for (const d of data) {
    const act = d.class === 'translate-approved' ? 'Add to dictionary & apply' : 'Skip';
    md += `| ${d.path} | ${d.type} | ${d.text} | ${d.class} | ${d.trans} | ${act} |\n`;
}

fs.writeFileSync('docs/cosmetic-remaining-english-copy-candidates.md', md);
