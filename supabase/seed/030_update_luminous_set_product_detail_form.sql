-- 030_update_luminous_set_product_detail_form.sql
-- Add the Product Detail Form block to Luminous Set product landing page
-- Preserves existing data, only merges if 'productDetailForm' is missing.

UPDATE content_blocks
SET content = jsonb_set(
  content,
  '{productDetailForm}',
  '{
    "eyebrow": "PRODUCT INFORMATION",
    "title": "LUMINOUS REVITALIZATION SHEER SET",
    "description": "Thông tin sản phẩm được trình bày để khách hàng tham khảo trước khi nhận tư vấn routine phù hợp.",
    "offlineTitle": "Bạn cũng có thể trải nghiệm VAVAW tại cửa hàng offline",
    "offlineDescription": "VAVAW Beauty & Co giúp khách hàng hiểu cách kết hợp sản phẩm trong trải nghiệm chăm sóc chuyên nghiệp và routine tại nhà.",
    "offlineMediaSlot": "cosmetic-luminous-offline-experience-image",
    "info": [
      { "label": "Tên sản phẩm", "value": "Luminous Revitalization Sheer Set" },
      { "label": "Bộ sản phẩm gồm", "value": "CELLUREVIVE Ampoule 7ml × 4ea và REGENAGLOW NOURISH SHEER CREAM 30ml × 1ea" },
      { "label": "Đối tượng sử dụng", "value": "Mọi loại da, đặc biệt là da cần phục hồi, cấp ẩm và hỗ trợ hàng rào bảo vệ" },
      { "label": "Hạn sử dụng sau khi mở", "value": "Khuyến nghị sử dụng trong vòng 12 tháng sau khi mở nắp hoặc theo thông tin trên bao bì sản phẩm" },
      { "label": "Xuất xứ", "value": "Hàn Quốc" },
      { "label": "Bước sử dụng", "value": "Sau làm sạch và toner, dùng ampoule trước, sau đó khóa ẩm bằng cream" },
      { "label": "Kênh tư vấn", "value": "VAVAW Cosmetic / VAVAW Beauty & Co" }
    ],
    "ingredientGroups": [
      {
        "title": "REGENAGLOW NOURISH SHEER CREAM",
        "subtitle": "30ml",
        "ingredients": "Aqua, Glycerin, Collagen Water, Peptide Complex, Hyaluronic Acid, Berry Complex Extracts and other cosmetic ingredients. Please refer to the product packaging for the complete ingredient list."
      },
      {
        "title": "CELLUREVIVE Ampoule",
        "subtitle": "7ml × 4ea",
        "ingredients": "Collagen Water, Exosome, Peptide Complex, Hyaluronic Acid, Glycerin and other cosmetic ingredients. Please refer to the product packaging for the complete ingredient list."
      }
    ],
    "cautions": [
      "Chỉ dùng ngoài da.",
      "Tránh tiếp xúc trực tiếp với mắt.",
      "Ngưng sử dụng và tham khảo chuyên viên nếu da có dấu hiệu bất thường.",
      "Để xa tầm tay trẻ em.",
      "Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp."
    ],
    "storage": "Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp.",
    "qualityGuarantee": "Nếu sản phẩm có vấn đề về chất lượng, khách hàng có thể liên hệ VAVAW để được hỗ trợ theo chính sách hiện hành."
  }'::jsonb,
  true
)
WHERE block_type = 'cosmetic-product-landing-luminous-set'
  AND (content->>'productDetailForm') IS NULL;
