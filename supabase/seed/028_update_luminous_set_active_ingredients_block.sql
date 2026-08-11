-- 028_update_luminous_set_active_ingredients_block.sql
-- Add the Active Ingredients block to Luminous Set product landing page
-- Preserves existing data, only merges if 'activeIngredients' is missing.

UPDATE content_blocks
SET content = jsonb_set(
  content,
  '{activeIngredients}',
  '{
    "eyebrow": "ACTIVE INGREDIENTS",
    "title": "Các thành phần hỗ trợ làn da rạng rỡ hơn",
    "description": "Luminous Revitalization Sheer Set kết hợp các thành phần chăm sóc da được chọn lọc để hỗ trợ độ ẩm, hàng rào bảo vệ, vẻ mịn màng và cảm giác tươi sáng của làn da.",
    "mediaSlot": "cosmetic-luminous-active-ingredients-image",
    "ingredients": [
      {
        "name": "Exosome",
        "subtitle": "Renewal Appearance Support",
        "description": "Hỗ trợ vẻ ngoài mịn màng, rạng rỡ và làn da trông có sức sống hơn."
      },
      {
        "name": "Collagen Water",
        "subtitle": "Hydration & Elasticity Support",
        "description": "Giúp duy trì cảm giác ẩm mượt, mềm mại và hỗ trợ độ đàn hồi bề mặt da."
      },
      {
        "name": "Complex Berry Extracts",
        "subtitle": "Antioxidant Care",
        "description": "Hỗ trợ chăm sóc làn da trước tác động môi trường và giúp da trông tươi sáng hơn."
      },
      {
        "name": "Complex Peptides",
        "subtitle": "Barrier & Firmness Support",
        "description": "Hỗ trợ hàng rào bảo vệ và giúp bề mặt da trông săn mịn hơn."
      },
      {
        "name": "Hydrolyzed Hyaluronic Acid",
        "subtitle": "Moisture Retention",
        "description": "Giúp bổ sung cảm giác ẩm mượt, hỗ trợ duy trì độ ẩm và tạo cảm giác da mềm mại hơn."
      }
    ]
  }'::jsonb,
  true
)
WHERE block_type = 'cosmetic-product-landing-luminous-set'
  AND (content->>'activeIngredients') IS NULL;
