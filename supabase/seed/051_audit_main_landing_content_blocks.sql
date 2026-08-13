-- 051_audit_main_landing_content_blocks.sql
-- Phase Main Landing: Audit query for Main Landing Manager content blocks & ecosystem status.

-- 1. Main Landing Content Blocks Summary
SELECT
  COUNT(*) AS total_main_blocks,
  COUNT(*) FILTER (WHERE is_active = true) AS active_main_blocks,
  COUNT(*) FILTER (WHERE is_active = false) AS hidden_main_blocks
FROM public.content_blocks
WHERE site_key = 'main'
  AND page_path = '/'
  AND block_type LIKE 'main-%';

-- 2. Detailed Main Landing Content Blocks List
SELECT
  id,
  site_key,
  page_path,
  block_type,
  is_active,
  sort_order,
  content->>'title' AS title,
  content->>'primaryCtaHref' AS primary_cta_href,
  content->>'secondaryCtaHref' AS secondary_cta_href,
  updated_at
FROM public.content_blocks
WHERE site_key = 'main'
  AND page_path = '/'
ORDER BY sort_order ASC;

-- 3. Hero Slides Overview Count
SELECT
  COUNT(*) FILTER (WHERE status = 'active') AS active_hero_count,
  COUNT(*) AS total_hero_count
FROM public.hero_slides;

-- 4. Business Entries Overview Count
SELECT
  COUNT(*) FILTER (WHERE status = 'active') AS active_business_count,
  COUNT(*) AS total_business_count
FROM public.business_entries;

-- 5. SEO Settings for Homepage
SELECT
  id,
  site_key,
  path,
  title,
  canonical_url,
  updated_at
FROM public.seo_settings
WHERE site_key = 'main'
  AND path = '/';
