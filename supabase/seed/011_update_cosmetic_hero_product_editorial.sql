-- non-destructive seed script for Luminous Set editorial story
-- updates cosmetic-hero-product block content JSONB to add eyebrow, title, headline, mediaSlot, insideBox, scienceTitle, scienceDescription, and usageSteps if they do not exist.
-- preserves existing content fields.

DO $$
DECLARE
    hero_product_record RECORD;
    existing_content JSONB;
    updated_content JSONB;
    default_inside_box JSONB;
    default_usage_steps JSONB;
BEGIN
    -- 1. Fetch current hero product record
    SELECT * INTO hero_product_record 
    FROM public.content_blocks
    WHERE site_key = 'main'
      AND page_path = '/cosmetic'
      AND block_type = 'cosmetic-hero-product'
    LIMIT 1;

    IF hero_product_record.id IS NOT NULL THEN
        existing_content := hero_product_record.content;

        -- 2. Define default nested structures
        default_inside_box := '[
            {
                "name": "Regenaglow Nourish Sheer Cream",
                "role": "Dưỡng phục hồi",
                "description": "Dưỡng phục hồi, khóa ẩm và hỗ trợ hàng rào bảo vệ da."
            },
            {
                "name": "Gentle Activation Renew Ampoule",
                "role": "Tinh chất tái tạo",
                "description": "Tinh chất hỗ trợ tái tạo, tăng độ rạng rỡ và làm mịn bề mặt da."
            },
            {
                "name": "Treatment Support Vials",
                "role": "Dưỡng chất cô đặc",
                "description": "Dưỡng chất cô đặc hỗ trợ phục hồi chuyên sâu theo từng giai đoạn chăm sóc."
            }
        ]'::jsonb;

        default_usage_steps := '[
            "Sau khi làm sạch và cân bằng da, thoa ampoule lên toàn mặt.",
            "Massage nhẹ đến khi dưỡng chất thẩm thấu.",
            "Tiếp tục với sheer cream để khóa ẩm và hỗ trợ phục hồi hàng rào bảo vệ da.",
            "Ban ngày dùng thêm kem chống nắng để bảo vệ da."
        ]'::jsonb;

        -- 3. Merge default keys if they are missing
        updated_content := existing_content;

        IF NOT (existing_content ? 'eyebrow') THEN
            updated_content := jsonb_set(updated_content, '{eyebrow}', '"FEATURED SET"'::jsonb);
        END IF;

        IF NOT (existing_content ? 'title') THEN
            updated_content := jsonb_set(updated_content, '{title}', '"Luminous Revitalization Sheer Set"'::jsonb);
        END IF;

        IF NOT (existing_content ? 'headline') THEN
            updated_content := jsonb_set(updated_content, '{headline}', '"Chăm sóc chuyên sâu — củng cố hàng rào bảo vệ và phục hồi làn da rạng rỡ."'::jsonb);
        END IF;

        IF NOT (existing_content ? 'description') THEN
            updated_content := jsonb_set(updated_content, '{description}', '"Bộ chăm sóc da cao cấp kết hợp tinh chất tái tạo, dưỡng phục hồi và hoạt chất hỗ trợ hàng rào bảo vệ da, giúp da ẩm mịn, sáng khỏe và đàn hồi hơn mỗi ngày."'::jsonb);
        END IF;

        IF NOT (existing_content ? 'mediaSlot') THEN
            updated_content := jsonb_set(updated_content, '{mediaSlot}', '"cosmetic-product-luminous-set"'::jsonb);
        END IF;

        IF NOT (existing_content ? 'ingredients') THEN
            updated_content := jsonb_set(updated_content, '{ingredients}', '["Exosome", "Collagen", "Peptide Complex"]'::jsonb);
        END IF;

        IF NOT (existing_content ? 'benefits') THEN
            updated_content := jsonb_set(updated_content, '{benefits}', '["Hỗ trợ phục hồi hàng rào bảo vệ da", "Cập ẩm và duy trì độ mềm mượt", "Cải thiện độ sáng và độ đàn hồi da"]'::jsonb);
        END IF;

        IF NOT (existing_content ? 'insideBox') THEN
            updated_content := jsonb_set(updated_content, '{insideBox}', default_inside_box);
        END IF;

        IF NOT (existing_content ? 'scienceTitle') THEN
            updated_content := jsonb_set(updated_content, '{scienceTitle}', '"Clinical Recovery Logic"'::jsonb);
        END IF;

        IF NOT (existing_content ? 'scienceDescription') THEN
            updated_content := jsonb_set(updated_content, '{scienceDescription}', '"Bộ sản phẩm được thiết kế như một routine phục hồi có hệ thống: chuẩn bị da, bổ sung hoạt chất, phục hồi hàng rào bảo vệ và khóa ẩm để duy trì làn da ổn định hơn."'::jsonb);
        END IF;

        IF NOT (existing_content ? 'usageSteps') THEN
            updated_content := jsonb_set(updated_content, '{usageSteps}', default_usage_steps);
        END IF;

        IF NOT (existing_content ? 'ctaLabel') THEN
            updated_content := jsonb_set(updated_content, '{ctaLabel}', '"Start an Inquiry"'::jsonb);
        END IF;

        IF NOT (existing_content ? 'ctaHref') THEN
            updated_content := jsonb_set(updated_content, '{ctaHref}', '"/contact?type=cosmetic_interest&product=luminous_set"'::jsonb);
        END IF;

        -- 4. Update table row
        UPDATE public.content_blocks
        SET content = updated_content,
            updated_at = NOW()
        WHERE id = hero_product_record.id;
        
        RAISE NOTICE 'Hero product block content updated successfully for site_key=main page_path=/cosmetic';
    ELSE
        RAISE WARNING 'Hero product block not found for site_key=main page_path=/cosmetic. Skip update.';
    END IF;
END $$;

-- Verification Query
select
  block_type,
  content->>'title' as title,
  content->>'headline' as headline,
  content->>'mediaSlot' as media_slot,
  jsonb_array_length(coalesce(content->'insideBox', '[]'::jsonb)) as inside_box_count,
  jsonb_array_length(coalesce(content->'usageSteps', '[]'::jsonb)) as usage_step_count
from public.content_blocks
where site_key = 'main'
  and page_path = '/cosmetic'
  and block_type = 'cosmetic-hero-product';
