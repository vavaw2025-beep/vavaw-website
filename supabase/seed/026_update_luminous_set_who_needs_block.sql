-- 026_update_luminous_set_who_needs_block.sql
-- Add the Who Needs Sheer Set block to Luminous Set product landing page
-- Preserves existing data, only merges if 'whoNeedsSet' is missing.

UPDATE content_blocks
SET content = jsonb_set(
  content,
  '{whoNeedsSet}',
  '{
    "eyebrow": "WHO NEEDS SHEER SET",
    "title": "Sheer Set dành cho làn da cần phục hồi chuyên sâu",
    "note": "Hiệu quả cảm nhận có thể khác nhau tùy tình trạng da và cách sử dụng của từng người.",
    "description": "Luminous Revitalization Sheer Set phù hợp với làn da cần routine phục hồi tại nhà sau chăm sóc chuyên sâu, giúp hỗ trợ cảm giác ẩm mượt, mềm mại và rạng rỡ hơn.",
    "mediaSlot": "cosmetic-luminous-who-for-image",
    "imageCaption": "Chăm sóc tại nhà tiện lợi hơn",
    "items": [
      { "text": "Da bị kích ứng sau peel hoặc các liệu trình thẩm mỹ." },
      { "text": "Da cần được bổ sung dưỡng chất và độ ẩm chuyên sâu." },
      { "text": "Da khô ráp, sần sùi hoặc thiếu sức sống." },
      { "text": "Da cần routine chăm sóc tập trung cho dấu hiệu lão hóa." },
      { "text": "Người muốn duy trì chăm sóc phục hồi tại nhà một cách tiện lợi." }
    ]
  }'::jsonb,
  true
)
WHERE block_type = 'cosmetic-product-landing-luminous-set'
  AND (content->>'whoNeedsSet') IS NULL;
