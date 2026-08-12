-- ============================================================
-- 042_seed_luminous_active_ingredients_map.sql
--
-- NON-DESTRUCTIVE: adds 'activeIngredientsMap' to the content
-- of content_blocks of type 'cosmetic-product-landing-luminous-set'
-- on site 'main' ONLY when the key does not already exist.
--
-- Uses jsonb_set with COALESCE so existing data is preserved.
-- Does NOT touch any other fields, media slots, or media_assets.
-- ============================================================

UPDATE public.content_blocks
SET content = jsonb_set(
    content,
    '{activeIngredientsMap}',
    '{
        "eyebrow": "ACTIVE INGREDIENTS",
        "title": "Thành phần hoạt tính chuyên biệt cho hành trình phục hồi",
        "description": "Mỗi hoạt chất được lựa chọn có chủ đích — kết hợp cùng nhau để hỗ trợ quá trình phục hồi, tái tạo và bảo vệ làn da một cách toàn diện.",
        "caption": "Công thức phục hồi chuyên sâu với sự kết hợp của các hoạt chất nền tảng.",
        "showDescription": true,
        "showCaption": true,
        "mediaSlot": "cosmetic-luminous-active-ingredients-image",
        "desktopMediaSlot": "cosmetic-luminous-active-ingredients-desktop",
        "mobileMediaSlot": "cosmetic-luminous-active-ingredients-mobile",
        "mediaRenderType": "full-bleed-artwork",
        "desktopImageMode": "cover",
        "mobileImageMode": "cover",
        "desktopObjectPosition": "center center",
        "mobileObjectPosition": "center center",
        "items": [
            {
                "name": "Ceramide NP",
                "englishName": "Ceramide NP",
                "role": "BARRIER REPAIR",
                "description": "Phục hồi và củng cố hàng rào bảo vệ da, giúp da giữ ẩm hiệu quả hơn và giảm thoát ẩm qua biểu bì.",
                "benefit": "Phục hồi hàng rào da",
                "highlight": true
            },
            {
                "name": "Niacinamide",
                "englishName": "Niacinamide",
                "role": "BRIGHTENING & PORE",
                "description": "Làm đều màu da, thu nhỏ lỗ chân lông, điều tiết bã nhờn và hỗ trợ tái tạo tế bào da khỏe mạnh.",
                "benefit": "Làm sáng và đều màu da",
                "highlight": false
            },
            {
                "name": "Hyaluronic Acid",
                "englishName": "Hyaluronic Acid",
                "role": "DEEP HYDRATION",
                "description": "Cấp ẩm sâu tầng và giữ nước hiệu quả, hỗ trợ làn da luôn căng mọng và mềm mại suốt cả ngày.",
                "benefit": "Cấp ẩm chuyên sâu",
                "highlight": false
            },
            {
                "name": "Retinol",
                "englishName": "Retinol",
                "role": "RENEWAL",
                "description": "Kích thích tái tạo tế bào, hỗ trợ giảm nếp nhăn và cải thiện kết cấu da theo thời gian sử dụng.",
                "benefit": "Tái tạo và trẻ hóa da",
                "highlight": false
            },
            {
                "name": "Panthenol",
                "englishName": "Panthenol (Pro-Vitamin B5)",
                "role": "SOOTHING & REPAIR",
                "description": "Làm dịu kích ứng, hỗ trợ phục hồi da nhạy cảm và duy trì độ ẩm tối ưu trong suốt quá trình sử dụng.",
                "benefit": "Làm dịu và phục hồi",
                "highlight": false
            }
        ]
    }'::jsonb,
    true   -- create key if missing
)
WHERE block_type = 'cosmetic-product-landing-luminous-set'
  AND site_key   = 'main'
  AND (content -> 'activeIngredientsMap') IS NULL;
