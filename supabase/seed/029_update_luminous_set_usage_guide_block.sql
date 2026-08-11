-- 029_update_luminous_set_usage_guide_block.sql
-- Add the How To Use block to Luminous Set product landing page
-- Preserves existing data, only merges if 'usageGuide' is missing.

UPDATE content_blocks
SET content = jsonb_set(
  content,
  '{usageGuide}',
  '{
    "eyebrow": "VAVAW SHEER SET RITUAL",
    "title": "Hướng dẫn sử dụng VAVAW Sheer Set",
    "description": "Sử dụng theo thứ tự ampoule trước, cream sau để hỗ trợ bổ sung dưỡng chất, khóa ẩm và hoàn thiện routine phục hồi tại nhà.",
    "mediaSlot": "cosmetic-luminous-usage-set-image",
    "instructionMediaSlot": "cosmetic-luminous-ampoule-instruction-image",
    "note": "Ban ngày nên hoàn thiện routine bằng kem chống nắng phù hợp.",
    "steps": [
      {
        "step": "01",
        "title": "Làm sạch và cân bằng da",
        "description": "Sau bước làm sạch, cân bằng da bằng toner để chuẩn bị bề mặt da cho routine phục hồi."
      },
      {
        "step": "02",
        "title": "Thoa CELLUREVIVE Ampoule",
        "description": "Lấy 2–3 giọt ampoule, thoa lần lượt lên trán, hai má và cằm."
      },
      {
        "step": "03",
        "title": "Vỗ nhẹ đến khi thẩm thấu",
        "description": "Massage hoặc vỗ nhẹ để ampoule thấm đều, tránh vùng mắt."
      },
      {
        "step": "04",
        "title": "Khóa ẩm bằng REGENAGLOW NOURISH SHEER CREAM",
        "description": "Thoa một lớp kem mỏng để hỗ trợ duy trì độ ẩm và cảm giác mềm mại."
      },
      {
        "step": "05",
        "title": "Layer thêm nếu cần",
        "description": "Khi lớp đầu đã thẩm thấu, có thể thoa thêm một lớp mỏng ở vùng da khô hoặc cần chăm sóc nhiều hơn."
      }
    ]
  }'::jsonb,
  true
)
WHERE block_type = 'cosmetic-product-landing-luminous-set'
  AND (content->>'usageGuide') IS NULL;
