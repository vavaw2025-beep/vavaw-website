-- 025_update_luminous_set_anti_gravity_block.sql
-- Add the Anti-Gravity block to Luminous Set product landing page
-- Preserves existing data, only merges if 'antiGravity' is missing.

UPDATE content_blocks
SET content = jsonb_set(
  content,
  '{antiGravity}',
  '{
    "eyebrow": "ANTI-GRAVITY SOLUTION",
    "title": "Tập trung chăm sóc hàng rào bảo vệ da",
    "headline": "Công nghệ phục hồi giúp hỗ trợ làn da ổn định, ẩm mượt và rạng rỡ hơn.",
    "description": "Luminous Revitalization Sheer Set kết hợp các hoạt chất chăm sóc chuyên sâu nhằm hỗ trợ hàng rào bảo vệ da, bổ sung độ ẩm và giúp làn da trông mềm mại, mịn màng hơn sau routine phục hồi.",
    "mediaSlot": "cosmetic-luminous-anti-gravity-image",
    "callouts": [
      {
        "label": "Collagen Support",
        "value": "830,000ppm",
        "description": "Hỗ trợ cảm giác săn mịn và giúp da trông mềm mại hơn."
      },
      {
        "label": "Exosome",
        "value": "10,000ppm",
        "description": "Hỗ trợ vẻ ngoài rạng rỡ và bề mặt da trông mịn màng hơn."
      },
      {
        "label": "Peptide Complex",
        "value": "Barrier Support",
        "description": "Hỗ trợ hàng rào bảo vệ và độ đàn hồi bề mặt da."
      },
      {
        "label": "Berry Complex Extract",
        "value": "Antioxidant Care",
        "description": "Hỗ trợ chăm sóc làn da trước các tác động môi trường hằng ngày."
      }
    ]
  }'::jsonb,
  true
)
WHERE block_type = 'cosmetic-product-landing-luminous-set'
  AND (content->>'antiGravity') IS NULL;
