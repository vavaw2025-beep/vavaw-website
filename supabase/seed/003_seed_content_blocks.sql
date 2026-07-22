-- Seed file: 003_seed_content_blocks.sql
--
-- Initial content blocks for apps/main pages.
--
-- USAGE:
--   Run this file in Supabase SQL editor or via the Supabase CLI:
--     supabase db push  (after adding to migration order)
--   Or run directly:
--     psql <connection_string> -f supabase/seed/003_seed_content_blocks.sql
--
-- IMPORTANT:
--   This seed is OPTIONAL.
--   It does NOT use ON CONFLICT because there is no strict unique constraint 
--   on (site_key, page_path, block_type) since multiple blocks of the same type 
--   can exist on a single page. 
--   Running this multiple times will duplicate these blocks.

INSERT INTO public.content_blocks (
  site_key, page_path, block_type, content, sort_order, is_active
)
VALUES
  (
    'main',
    '/cosmetic',
    'rich_text',
    '{
      "eyebrow": "Brand Story",
      "title": "Clean beauty inspired by Korean skincare",
      "body": "VAVAW Cosmetic is dedicated to bringing you the best of nature and science. Our products are formulated to nourish and protect your skin."
    }'::jsonb,
    10,
    true
  ),
  (
    'main',
    '/cosmetic',
    'product_highlights',
    '{
      "title": "Our Bestsellers",
      "items": [
        {
          "name": "Hydrating Serum",
          "description": "Deeply moisturizes and plumps the skin."
        },
        {
          "name": "Vitamin C Cream",
          "description": "Brightens and evens out skin tone."
        }
      ]
    }'::jsonb,
    20,
    true
  ),
  (
    'main',
    '/cosmetic',
    'quality_promise',
    '{
      "title": "The VAVAW Promise",
      "description": "Cruelty-free, vegan, and free of harmful chemicals. We believe in beauty without compromise."
    }'::jsonb,
    30,
    true
  ),
  (
    'main',
    '/cosmetic',
    'gallery',
    '{
      "title": "See the results",
      "images": [
        { "url": "/images/gallery1.jpg", "alt": "Model with glowing skin" },
        { "url": "/images/gallery2.jpg", "alt": "Product texture" }
      ]
    }'::jsonb,
    40,
    true
  ),
  (
    'main',
    '/cosmetic',
    'cta',
    '{
      "title": "Ready to glow?",
      "description": "Shop the collection now.",
      "buttonLabel": "Shop All",
      "buttonHref": "/shop"
    }'::jsonb,
    50,
    true
  );
