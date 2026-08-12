-- 043_seed_luminous_usage_guide.sql
-- Non-destructive update to add usageGuide to Luminous Set content block

UPDATE content_blocks
SET content = jsonb_set(
  content,
  '{usageGuide}',
  '{
    "eyebrow": "VAVAW SHEER SET RITUAL",
    "title": "Hướng dẫn sử dụng Luminous Sheer Set",
    "description": "Sử dụng theo thứ tự ampoule trước, cream sau để hỗ trợ bổ sung dưỡng chất, khóa ẩm và hoàn thiện routine phục hồi tại nhà.",
    "note": "Ban ngày nên hoàn thiện routine bằng kem chống nắng phù hợp.",
    "caption": "Simple recovery ritual for daily home-care continuity.",
    "mediaRenderType": "full-bleed-artwork",
    "desktopImageMode": "cover",
    "mobileImageMode": "cover",
    "desktopObjectPosition": "center center",
    "mobileObjectPosition": "center top",
    "showDescription": true,
    "showNote": true,
    "showCaption": true,
    "steps": [
      {
        "step": "01",
        "title": "Làm sạch",
        "description": "Sử dụng tẩy trang và sữa rửa mặt phù hợp."
      },
      {
        "step": "02",
        "title": "Cân bằng",
        "description": "Lau toner để chuẩn bị bề mặt da."
      },
      {
        "step": "03",
        "title": "Kích hoạt",
        "description": "Thoa 1 ống Gentle Activation Renew Ampoule, vỗ nhẹ cho thấm."
      },
      {
        "step": "04",
        "title": "Khoá ẩm",
        "description": "Lấy một lượng vừa đủ Regenaglow Nourish Sheer Cream thoa đều toàn mặt."
      },
      {
        "step": "05",
        "title": "Bảo vệ",
        "description": "Thoa kem chống nắng vào ban ngày."
      }
    ]
  }'::jsonb
)
WHERE block_type = 'cosmetic-product-landing-luminous-set'
  AND site_key = 'main'
  AND (content->>'usageGuide') IS NULL;
