-- 027_update_luminous_set_barrier_science_block.sql
-- Add the Skin Barrier & MG3-Plus block to Luminous Set product landing page
-- Preserves existing data, only merges if 'barrierScience' is missing.

UPDATE content_blocks
SET content = jsonb_set(
  content,
  '{barrierScience}',
  '{
    "eyebrow": "STRENGTHENING THE SKIN BARRIER",
    "title": "Nền tảng của làn da khỏe là hàng rào bảo vệ ổn định.",
    "description": "Hàng rào bảo vệ da nằm ở lớp ngoài cùng của da, giúp duy trì độ ẩm, hỗ trợ cảm giác mềm mại và bảo vệ da trước các tác động từ môi trường hằng ngày.",
    "mediaSlot": "cosmetic-luminous-skin-barrier-image",
    "mg3Eyebrow": "VAVAW MG3-PLUS METHOD",
    "mg3Title": "Công nghệ MG3-Plus độc quyền của VAVAW",
    "mg3Description": "MG3-Plus được phát triển để hỗ trợ tối ưu hóa cách các thành phần chăm sóc da hoạt động trong routine, giúp làn da có cảm giác ẩm mượt, ổn định và được nuôi dưỡng tốt hơn.",
    "mg3MediaSlot": "cosmetic-luminous-mg3-plus-image"
  }'::jsonb,
  true
)
WHERE block_type = 'cosmetic-product-landing-luminous-set'
  AND (content->>'barrierScience') IS NULL;
