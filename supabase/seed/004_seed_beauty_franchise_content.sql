-- 004_seed_beauty_franchise_content.sql

-- Insert default SEO settings for beauty and franchise
INSERT INTO public.seo_settings (id, site_key, path, title, description, keywords, robots_index, robots_follow)
VALUES 
  ('b0000000-0000-0000-0000-000000000001', 'beauty', '/', 'VAVAW Beauty (CMS)', 'CMS Driven Description for Beauty', 'beauty, cms', true, true),
  ('f0000000-0000-0000-0000-000000000001', 'franchise', '/', 'VAVAW Franchise (CMS)', 'CMS Driven Description for Franchise', 'franchise, cms', true, true)
ON CONFLICT (site_key, path) DO UPDATE 
SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- Insert content blocks for Beauty
INSERT INTO public.content_blocks (id, site_key, page_path, section_id, block_type, order_index, content, is_published)
VALUES
  (
    'b0000000-0000-0000-0000-000000000002',
    'beauty',
    '/',
    'hero',
    'hero',
    0,
    '{
      "category": "Beauty & Wellness",
      "title": "A Sanctuary of Care",
      "subtitle": "Discover the art of refined self-care through CMS.",
      "ctaLabel": "Explore Now",
      "backgroundImage": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070"
    }'::jsonb,
    true
  ),
  (
    'b0000000-0000-0000-0000-000000000003',
    'beauty',
    '/',
    'philosophy',
    'rich_text',
    1,
    '{
      "title": "Elevating your daily ritual.",
      "body": "This text is served from Supabase. We believe that true beauty stems from deliberate care and quiet moments of luxury."
    }'::jsonb,
    true
  ),
  (
    'b0000000-0000-0000-0000-000000000004',
    'beauty',
    '/',
    'features',
    'feature_grid',
    2,
    '{
      "title": "Curated Experiences (CMS)",
      "items": [
        {
          "title": "Beauty Care",
          "description": "Bespoke treatments tailored to your unique essence."
        },
        {
          "title": "Skincare Ritual",
          "description": "Premium formulations and gentle techniques."
        },
        {
          "title": "Lifestyle Experience",
          "description": "A holistic approach to well-being."
        }
      ]
    }'::jsonb,
    true
  )
ON CONFLICT (id) DO UPDATE
SET
  content = EXCLUDED.content,
  block_type = EXCLUDED.block_type;

-- Insert content blocks for Franchise
INSERT INTO public.content_blocks (id, site_key, page_path, section_id, block_type, order_index, content, is_published)
VALUES
  (
    'f0000000-0000-0000-0000-000000000002',
    'franchise',
    '/',
    'hero',
    'hero',
    0,
    '{
      "category": "Franchise Opportunities",
      "title": "Global Network (CMS)",
      "subtitle": "Build the future of beauty with VAVAW.",
      "description": "Our CMS powered franchise landing page.",
      "ctaLabel": "Apply Now",
      "backgroundImage": "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069"
    }'::jsonb,
    true
  ),
  (
    'f0000000-0000-0000-0000-000000000003',
    'franchise',
    '/',
    'why',
    'feature_grid',
    1,
    '{
      "title": "Why Partner with VAVAW? (CMS)",
      "description": "We provide a robust foundation for success.",
      "items": [
        {
          "title": "Brand Ecosystem",
          "description": "Leverage the established VAVAW ecosystem."
        },
        {
          "title": "Market Positioning",
          "description": "Capture the premium beauty and cosmetic market."
        },
        {
          "title": "Operational Playbook",
          "description": "Access our proven step-by-step operating procedures."
        },
        {
          "title": "Scalable Model",
          "description": "Built for growth."
        }
      ]
    }'::jsonb,
    true
  )
ON CONFLICT (id) DO UPDATE
SET
  content = EXCLUDED.content,
  block_type = EXCLUDED.block_type;
