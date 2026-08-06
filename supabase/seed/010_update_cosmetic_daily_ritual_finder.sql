-- non-destructive seed script for Skin Ritual Finder
-- updates cosmetic-daily-ritual block content JSONB to add ageGroups, concerns, goals and recommendations if they do not exist.
-- preserves existing items and custom fields.

DO $$
DECLARE
    daily_ritual_record RECORD;
    existing_content JSONB;
    updated_content JSONB;
    default_age_groups JSONB;
    default_concerns JSONB;
    default_goals JSONB;
    default_recommendations JSONB;
BEGIN
    -- 1. Fetch current daily ritual record
    SELECT * INTO daily_ritual_record 
    FROM public.content_blocks
    WHERE site_key = 'main'
      AND page_path = '/cosmetic'
      AND block_type = 'cosmetic-daily-ritual'
    LIMIT 1;

    IF daily_ritual_record.id IS NOT NULL THEN
        existing_content := daily_ritual_record.content;

        -- 2. Define default finder data structures
        default_age_groups := '[
            {"id": "18-24", "label": "18–24", "description": "Da trẻ, cần cân bằng và bảo vệ sớm."},
            {"id": "25-34", "label": "25–34", "description": "Da bắt đầu cần phục hồi, cấp ẩm và bảo vệ hằng ngày."},
            {"id": "35-44", "label": "35–44", "description": "Da cần tái tạo, phục hồi độ đàn hồi và chống lão hóa sớm."},
            {"id": "45-plus", "label": "45+", "description": "Da cần nuôi dưỡng sâu, cải thiện hàng rào bảo vệ và độ săn chắc."}
        ]'::jsonb;

        default_concerns := '[
            {"id": "barrier", "label": "Da yếu / hàng rào da suy yếu"},
            {"id": "sensitive", "label": "Da nhạy cảm / dễ đỏ"},
            {"id": "dry", "label": "Da thiếu ẩm"},
            {"id": "dull", "label": "Da xỉn màu"},
            {"id": "aging", "label": "Dấu hiệu lão hóa"},
            {"id": "sun-protection", "label": "Cần chống nắng và bảo vệ ban ngày"}
        ]'::jsonb;

        default_goals := '[
            {"id": "recover", "label": "Phục hồi"},
            {"id": "hydrate", "label": "Cấp ẩm"},
            {"id": "calm", "label": "Làm dịu"},
            {"id": "renew", "label": "Tái tạo"},
            {"id": "protect", "label": "Bảo vệ"}
        ]'::jsonb;

        default_recommendations := '[
            {
                "id": "barrier-recovery",
                "match": {
                    "ageGroup": "25-34",
                    "concern": "barrier",
                    "goal": "recover"
                },
                "title": "Barrier Recovery Ritual",
                "description": "A calming recovery routine designed to restore skin comfort, hydration, and resilience.",
                "whyThisFits": "Phù hợp với làn da cần phục hồi hàng rào bảo vệ, cấp ẩm và làm dịu sau treatment hoặc khi da dễ nhạy cảm.",
                "morning": [
                    "P30 Boost Facial Hydrating Toner",
                    "Calmiance Superior Sheer Gel",
                    "LUMIGLOW ROSY SHEER SUNSCREEN SPF50+/PA+++"
                ],
                "evening": [
                    "P30 Boost Facial Hydrating Toner",
                    "Gentle Activation Renew Ampoule",
                    "Regenaglow Nourish Sheer Cream"
                ],
                "actives": [
                    "Cica 7 Complex",
                    "Aloe",
                    "Peptide",
                    "Niacinamide"
                ]
            },
            {
                "id": "general-hydration",
                "match": {
                    "concern": "dry",
                    "goal": "hydrate"
                },
                "title": "Deep Hydration Boost Ritual",
                "description": "A lightweight clinical hydration routine to plump, smooth and refresh dehydrated skin.",
                "whyThisFits": "Phù hợp cho tình trạng da khô ráp, thiếu nước, cần cấp ẩm đa tầng và phục hồi sinh khí lập tức.",
                "morning": [
                    "P30 Boost Facial Hydrating Toner",
                    "P30 Boost Facial Moisturizer",
                    "LUMIGLOW ROSY SHEER SUNSCREEN SPF50+/PA+++"
                ],
                "evening": [
                    "P30 Boost Facial Hydrating Toner",
                    "Gentle Activation Renew Ampoule",
                    "P30 Boost Facial Moisturizer"
                ],
                "actives": [
                    "Hyaluronic Acid",
                    "Aloe Extract",
                    "Peptide Complex"
                ]
            },
            {
                "id": "anti-aging-renewal",
                "match": {
                    "concern": "aging",
                    "goal": "renew"
                },
                "title": "Age Defying Renewal Ritual",
                "description": "An advanced regenerative skincare regimen to improve cell turnover, firmness, and reduce fine lines.",
                "whyThisFits": "Phù hợp cho làn da xuất hiện nếp nhăn, kém đàn hồi, cần kích thích chu trình tái tạo tế bào hằng đêm.",
                "morning": [
                    "P30 Boost Facial Hydrating Toner",
                    "P30 Boost Facial Moisturizer",
                    "LUMIGLOW ROSY SHEER SUNSCREEN SPF50+/PA+++"
                ],
                "evening": [
                    "P30 Boost Facial Hydrating Toner",
                    "Gentle Activation Renew Ampoule",
                    "Regenaglow Nourish Sheer Cream"
                ],
                "actives": [
                    "Exosome",
                    "Bakuchiol",
                    "Collagen",
                    "Peptides"
                ]
            }
        ]'::jsonb;

        -- 3. Merge default keys if they are missing
        updated_content := existing_content;

        IF NOT (existing_content ? 'eyebrow') THEN
            updated_content := jsonb_set(updated_content, '{eyebrow}', '"DAILY CLINICAL RITUAL"'::jsonb);
        END IF;

        IF NOT (existing_content ? 'title') THEN
            updated_content := jsonb_set(updated_content, '{title}', '"Find Your Clinical Ritual"'::jsonb);
        END IF;

        IF NOT (existing_content ? 'description') THEN
            updated_content := jsonb_set(updated_content, '{description}', '"Answer a few quick questions to discover a Korean clinical skincare ritual designed for your skin stage and concern."'::jsonb);
        END IF;

        IF NOT (existing_content ? 'ageGroups') THEN
            updated_content := jsonb_set(updated_content, '{ageGroups}', default_age_groups);
        END IF;

        IF NOT (existing_content ? 'concerns') THEN
            updated_content := jsonb_set(updated_content, '{concerns}', default_concerns);
        END IF;

        IF NOT (existing_content ? 'goals') THEN
            updated_content := jsonb_set(updated_content, '{goals}', default_goals);
        END IF;

        IF NOT (existing_content ? 'recommendations') THEN
            updated_content := jsonb_set(updated_content, '{recommendations}', default_recommendations);
        END IF;

        IF NOT (existing_content ? 'ctaLabel') THEN
            updated_content := jsonb_set(updated_content, '{ctaLabel}', '"Nhận tư vấn cá nhân hóa"'::jsonb);
        END IF;

        IF NOT (existing_content ? 'ctaHref') THEN
            updated_content := jsonb_set(updated_content, '{ctaHref}', '"/contact?type=cosmetic_interest"'::jsonb);
        END IF;

        -- 4. Update table row
        UPDATE public.content_blocks
        SET content = updated_content,
            updated_at = NOW()
        WHERE id = daily_ritual_record.id;
        
        RAISE NOTICE 'Daily ritual block content updated successfully for site_key=main page_path=/cosmetic';
    ELSE
        RAISE WARNING 'Daily ritual block not found for site_key=main page_path=/cosmetic. Skip update.';
    END IF;
END $$;
