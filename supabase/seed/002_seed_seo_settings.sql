-- Seed file: 002_seed_seo_settings.sql
--
-- Initial SEO settings for apps/main pages.
--
-- USAGE:
--   Run this file in Supabase SQL editor or via the Supabase CLI:
--     supabase db push  (after adding to migration order)
--   Or run directly:
--     psql <connection_string> -f supabase/seed/002_seed_seo_settings.sql
--
-- IMPORTANT:
--   This seed is OPTIONAL once production data exists.
--   It uses ON CONFLICT DO UPDATE — running it again will OVERWRITE
--   any manually edited values for the matched (site_key, path) pair.
--   Remove rows you do not want to reset before re-running in production.

INSERT INTO public.seo_settings (
  site_key, path, title, description, keywords,
  canonical_url, robots_index, robots_follow
)
VALUES
  (
    'main',
    '/',
    'VAVAW | Brand Ecosystem',
    'VAVAW is a premium multi-brand ecosystem spanning cosmetics, beauty & care, and franchise opportunities.',
    ARRAY['vavaw', 'brand ecosystem', 'cosmetic', 'beauty', 'franchise', 'vietnam'],
    'https://vavaw.vn',
    true,
    true
  ),
  (
    'main',
    '/cosmetic',
    'VAVAW Cosmetic | Premium Skincare & Beauty',
    'Explore VAVAW Cosmetic — a dedicated collection of premium skincare, makeup, and beauty products under the VAVAW ecosystem.',
    ARRAY['vavaw cosmetic', 'skincare', 'beauty', 'makeup', 'premium cosmetics', 'vietnam beauty'],
    'https://vavaw.vn/cosmetic',
    true,
    true
  )
ON CONFLICT (site_key, path)
DO UPDATE SET
  title        = EXCLUDED.title,
  description  = EXCLUDED.description,
  keywords     = EXCLUDED.keywords,
  canonical_url = EXCLUDED.canonical_url,
  robots_index = EXCLUDED.robots_index,
  robots_follow = EXCLUDED.robots_follow,
  updated_at   = NOW();
