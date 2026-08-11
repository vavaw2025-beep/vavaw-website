-- 032_seed_luminous_anti_gravity_defaults.sql
-- Seed default antiGravity fields for Luminous Set if missing or empty

UPDATE public.content_blocks
SET content = jsonb_set(
  content,
  '{antiGravity}',
  '{
    "eyebrow": "ANTI-GRAVITY SOLUTION",
    "title": "Phục hồi cấu trúc da từ nền tảng hàng rào bảo vệ",
    "headline": "Tập trung cải thiện cảm giác săn chắc, ẩm mượt và độ rạng rỡ",
    "description": "Công thức tập trung vào phục hồi bề mặt da, hỗ trợ cấp ẩm và truyền tải các hoạt chất quan trọng cho làn da đang cần chăm sóc chuyên sâu.",
    "mediaSlot": "cosmetic-luminous-anti-gravity-image",
    "caption": "Focused recovery care for barrier, hydration and radiance.",
    "callouts": [
      { "label": "Collagen Water", "value": "Hỗ trợ cấp ẩm", "x": 18, "y": 42, "align": "left" },
      { "label": "Exosome", "value": "Hỗ trợ chăm sóc sau treatment", "x": 14, "y": 60, "align": "left" },
      { "label": "Peptide Complex", "value": "Hỗ trợ hàng rào bảo vệ", "x": 22, "y": 76, "align": "left" },
      { "label": "Complex Berry Extracts", "value": "Hỗ trợ vẻ rạng rỡ", "x": 58, "y": 76, "align": "center" }
    ]
  }'::jsonb
)
WHERE block_type = 'cosmetic-product-landing-luminous-set'
  AND site_key = 'main'
  AND (content->>'antiGravity' IS NULL OR content->>'antiGravity' = '{}');
