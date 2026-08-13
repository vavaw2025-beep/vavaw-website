-- 051_audit_main_landing_content_blocks.sql
-- Phase 81A: Audit query for Main Landing Manager content blocks & ecosystem status.

-- 1. Main Landing Content Blocks
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
FROM content_blocks
WHERE site_key = 'main' AND page_path = '/'
ORDER BY sort_order ASC;

-- 2. Hero Slides Overview Count
SELECT 
  COUNT(*) FILTER (WHERE status = 'active') AS active_hero_count,
  COUNT(*) AS total_hero_count
FROM hero_slides;

-- 3. Business Entries Overview Count
SELECT 
  COUNT(*) FILTER (WHERE status = 'active') AS active_business_count,
  COUNT(*) AS total_business_count
FROM business_entries;

-- 4. SEO Settings for Homepage
SELECT 
  id,
  site_key,
  path,
  title,
  canonical_url,
  updated_at
FROM seo_settings
WHERE site_key = 'main' AND path = '/';
