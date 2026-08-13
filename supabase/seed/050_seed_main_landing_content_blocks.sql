-- 050_seed_main_landing_content_blocks.sql
-- Phase 81A: Seed default content blocks for Main Landing page (site_key = 'main', page_path = '/')
-- Non-destructive: Inserts missing blocks only without overwriting existing content.

DO $$
BEGIN
  -- 1. main-brand-story
  IF NOT EXISTS (
    SELECT 1 FROM content_blocks 
    WHERE site_key = 'main' AND page_path = '/' AND block_type = 'main-brand-story'
  ) THEN
    INSERT INTO content_blocks (site_key, page_path, block_type, content, sort_order, is_active)
    VALUES (
      'main',
      '/',
      'main-brand-story',
      jsonb_build_object(
        'eyebrow', 'VAVAW ECOSYSTEM',
        'title', 'Hệ sinh thái Chăm sóc Sắc đẹp & Mỹ phẩm Hàn Quốc',
        'headline', 'Đồng hành cùng vẻ đẹp rạng rỡ và giải pháp chăm sóc làn da chuẩn y khoa.',
        'description', 'VAVAW kết hợp giữa nghiên cứu công thức mỹ phẩm phục hồi chuyên sâu và mô hình không gian spa thẩm mỹ hiện đại.',
        'primaryCtaLabel', 'Khám phá VAVAW Cosmetic',
        'primaryCtaHref', '/cosmetic',
        'secondaryCtaLabel', 'VAVAW Beauty & Co',
        'secondaryCtaHref', 'https://beauty.vavaw.vn'
      ),
      10,
      true
    );
  END IF;

  -- 2. main-ecosystem-intro
  IF NOT EXISTS (
    SELECT 1 FROM content_blocks 
    WHERE site_key = 'main' AND page_path = '/' AND block_type = 'main-ecosystem-intro'
  ) THEN
    INSERT INTO content_blocks (site_key, page_path, block_type, content, sort_order, is_active)
    VALUES (
      'main',
      '/',
      'main-ecosystem-intro',
      jsonb_build_object(
        'eyebrow', 'OUR PLATFORM',
        'title', 'Ba trụ cột thương hiệu VAVAW',
        'headline', 'Mỹ phẩm phục hồi, không gian làm đẹp chuyên sâu và cơ hội hợp tác kinh doanh.',
        'description', 'Trải nghiệm đồng bộ từ sản phẩm chăm sóc tại nhà đến liệu trình chuyên nghiệp tại spa.',
        'primaryCtaLabel', 'Nhượng quyền VAVAW',
        'primaryCtaHref', 'https://franchise.vavaw.vn'
      ),
      20,
      true
    );
  END IF;

  -- 3. main-final-cta
  IF NOT EXISTS (
    SELECT 1 FROM content_blocks 
    WHERE site_key = 'main' AND page_path = '/' AND block_type = 'main-final-cta'
  ) THEN
    INSERT INTO content_blocks (site_key, page_path, block_type, content, sort_order, is_active)
    VALUES (
      'main',
      '/',
      'main-final-cta',
      jsonb_build_object(
        'eyebrow', 'VAVAW ECOSYSTEM',
        'title', 'Bắt đầu hành trình cùng VAVAW',
        'description', 'Khám phá hệ sinh thái chăm sóc sắc đẹp, mỹ phẩm và mô hình hợp tác thương hiệu của VAVAW.',
        'primaryCtaLabel', 'Khám phá VAVAW Cosmetic',
        'primaryCtaHref', '/cosmetic',
        'secondaryCtaLabel', 'Liên hệ tư vấn',
        'secondaryCtaHref', '/contact?type=general_inquiry&source=main_final_cta',
        'trustPoints', jsonb_build_array(
          'Clinical Korean cosmetic direction',
          'Premium beauty ecosystem',
          'Franchise-ready brand platform'
        )
      ),
      30,
      true
    );
  END IF;
END $$;

