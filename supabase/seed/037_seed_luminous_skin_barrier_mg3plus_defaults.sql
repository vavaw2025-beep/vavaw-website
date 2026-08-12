-- Non-destructively seed skinBarrierMg3Plus defaults for Luminous Set
UPDATE public.content_blocks
SET content = jsonb_set(
    content,
    '{skinBarrierMg3Plus}',
    '{
        "skinBarrier": {
            "eyebrow": "SKIN BARRIER",
            "title": "Cốt lõi của làn da khỏe là hàng rào bảo vệ vững chắc",
            "description": "Hàng rào bảo vệ da giúp duy trì độ ẩm cần thiết, giảm cảm giác khô căng và hỗ trợ làn da trước các tác động từ môi trường.",
            "caption": "Làn da khỏe bắt đầu từ nền tảng cân bằng và khả năng giữ ẩm ổn định.",
            "mediaSlot": "cosmetic-luminous-skin-barrier-image",
            "desktopMediaSlot": "cosmetic-luminous-skin-barrier-desktop",
            "mobileMediaSlot": "cosmetic-luminous-skin-barrier-mobile",
            "desktopImageMode": "contain-blur",
            "mobileImageMode": "contain-blur",
            "desktopObjectPosition": "center center",
            "mobileObjectPosition": "center top",
            "showDescription": true,
            "showCaption": true
        },
        "mg3Plus": {
            "eyebrow": "MG3-PLUS TECHNOLOGY",
            "title": "MG3-Plus hỗ trợ đưa hoạt chất vận hành hiệu quả hơn trên bề mặt da",
            "description": "Công nghệ MG3-Plus hỗ trợ phân phối hoạt chất hiệu quả, giúp routine phục hồi vận hành mượt mà hơn trên bề mặt da và hỗ trợ trải nghiệm chăm sóc chuyên sâu.",
            "caption": "Focused delivery support for recovery-oriented skincare.",
            "mediaSlot": "cosmetic-luminous-mg3-plus-image",
            "desktopMediaSlot": "cosmetic-luminous-mg3-plus-desktop",
            "mobileMediaSlot": "cosmetic-luminous-mg3-plus-mobile",
            "desktopImageMode": "contain-blur",
            "mobileImageMode": "contain-blur",
            "desktopObjectPosition": "center center",
            "mobileObjectPosition": "center top",
            "showDescription": true,
            "showCaption": true
        }
    }'::jsonb || COALESCE(content->'skinBarrierMg3Plus', '{}'::jsonb)
)
WHERE block_type = 'cosmetic-product-landing-luminous-set'
  AND site_key = 'main';
