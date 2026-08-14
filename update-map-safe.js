const fs = require('fs');

// These are the requested *final* values for the keys provided by the user.
// (Some were already exactly this, some changed).
const replacements = {
  "Scientific beauty, refined into a pure Korean skincare ritual.\n\nVAVAW is a clinical Korean cosmetic system designed to restore the skin from its origin — pure, balanced, and resilient.": "Vẻ đẹp khoa học, được tinh chỉnh thành nghi thức chăm sóc da Hàn Quốc thuần khiết. VAVAW là hệ mỹ phẩm Hàn Quốc định hướng lâm sàng, được phát triển để hỗ trợ làn da phục hồi từ nền tảng — tinh khiết, cân bằng và bền vững.",
  "Cellular regeneration & recovery": "Phục hồi & hỗ trợ làm mới làn da",
  "A rich yet lightweight cream that deeply nourishes while encouraging cellular renewal for visibly rejuvenated skin.": "Chất kem đậm đặc nhưng mỏng nhẹ, hỗ trợ nuôi dưỡng chuyên sâu và cải thiện vẻ tươi mới cho làn da rạng rỡ hơn.",
  "A soothing gel formulated with a seven-extract Cica complex to calm reactive skin and restore the protective barrier.": "Gel làm dịu da với phức hợp Cica 7 chiết xuất, hỗ trợ làm dịu làn da nhạy cảm và củng cố hàng rào bảo vệ da.",
  "A next-generation ampoule harnessing Exosome technology and plant-derived Bakuchiol for visible skin renewal without irritation.": "Tinh chất thế hệ mới ứng dụng công nghệ Exosome và Bakuchiol nguồn gốc thực vật, hỗ trợ cải thiện vẻ tươi mới của làn da theo hướng êm dịu hơn.",
  "Begin with a gentle clinical cleanser to remove impurities without disrupting the skin microbiome.": "Bắt đầu với bước làm sạch dịu nhẹ để loại bỏ tạp chất mà vẫn hỗ trợ duy trì cảm giác cân bằng tự nhiên của da.",
  "Gentle Activation Renew Ampoule — activate cellular renewal and luminosity.": "Gentle Activation Renew Ampoule — hỗ trợ quá trình làm mới làn da và cải thiện vẻ rạng rỡ.",
  "An advanced regenerative skincare regimen to improve cell turnover, firmness, and reduce fine lines.": "Phác đồ chăm sóc chuyên sâu, hỗ trợ quá trình làm mới bề mặt da, cải thiện cảm giác săn chắc và làm mềm vẻ xuất hiện của nếp nhăn nhỏ.",
  "A calming recovery routine designed to restore skin comfort, hydration, and resilience.": "Quy trình phục hồi làm dịu, hỗ trợ khôi phục cảm giác dễ chịu, độ ẩm và khả năng tự bảo vệ của làn da.",
  "Helps improve appearance of skin tone and texture with active technology.": "Hỗ trợ cải thiện vẻ ngoài của tông da và kết cấu da nhờ công nghệ hoạt chất.",
  "Helps skin feel smoother and retains moisture for long-lasting hydration.": "Giúp làn da có cảm giác mịn màng hơn và hỗ trợ duy trì độ ẩm dài lâu.",
  "Professional treatment compatibility for spa and clinic use": "Phù hợp với quy trình chăm sóc chuyên nghiệp tại spa và clinic",
  "A personalized skincare experience designed for spa, clinic, and professional treatment environments — where expertise meets Korean clinical precision.": "Trải nghiệm chăm sóc da cá nhân hóa dành cho spa, clinic và môi trường chăm sóc chuyên nghiệp — nơi chuyên môn kết hợp cùng sự chính xác theo định hướng Hàn Quốc.",
  "Aqua, Glycerin, Collagen Water, Peptide Complex, Hyaluronic Acid, Berry Complex Extracts and other cosmetic ingredients. Please refer to the product packaging for the complete ingredient list.": "Aqua, Glycerin, Collagen Water, Peptide Complex, Hyaluronic Acid, Berry Complex Extracts và các thành phần mỹ phẩm khác. Vui lòng tham khảo bao bì sản phẩm để xem danh sách thành phần đầy đủ.",
  "Collagen Water, Exosome, Peptide Complex, Hyaluronic Acid, Glycerin and other cosmetic ingredients. Please refer to the product packaging for the complete ingredient list.": "Collagen Water, Exosome, Peptide Complex, Hyaluronic Acid, Glycerin và các thành phần mỹ phẩm khác. Vui lòng tham khảo bao bì sản phẩm để xem danh sách thành phần đầy đủ."
};

const mapFilePath = 'e:/Downloads/VAVAW-web/packages/brand-config/src/cosmetic-vietnamese-copy-map.ts';
let content = fs.readFileSync(mapFilePath, 'utf-8');

// The original map from the file
// I will parse the exact map out, modify it, and write it back.
// Since it's a JS object, I'll regex it out or just do a simple replacement for each line.

for (const [enKey, newViVal] of Object.entries(replacements)) {
    // Escape string for regex
    const escapedKey = enKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\n/g, '\\n');
    
    // We need to match `"Key": "Old Value"`
    // And replace with `"Key": "New Value"`
    const regex = new RegExp(`("${escapedKey}")\\s*:\\s*"([^"]+)"`);
    const match = content.match(regex);
    
    if (match) {
        const oldViVal = match[2];
        content = content.replace(regex, `"$1": "${newViVal}"`);
        
        // Also add the transition mapping (Old VI -> New VI) if they differ
        // so that the CMS migration script works!
        if (oldViVal !== newViVal) {
            const transitionStr = `  "${oldViVal}": "${newViVal}",\n`;
            // Insert it after the export const COSMETIC_VI_COPY_MAP = {
            content = content.replace('export const COSMETIC_VI_COPY_MAP = {', 'export const COSMETIC_VI_COPY_MAP = {\n' + transitionStr);
        }
    } else {
        console.log("Could not find key: ", enKey);
    }
}

fs.writeFileSync(mapFilePath, content);
console.log('Successfully updated translations and added transition mappings.');
