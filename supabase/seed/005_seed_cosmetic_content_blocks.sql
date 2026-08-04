-- Seed Cosmetic Page Content Blocks
-- Uses WHERE NOT EXISTS to avoid overwriting existing data.

INSERT INTO content_blocks (site_key, page_path, block_type, sort_order, is_active, content)
SELECT 'main', '/cosmetic', 'cosmetic-brand-philosophy', 1, true, '{
  "title": "The Premium RAW Skincare System",
  "eyebrow": "The Premium RAW Skincare System",
  "description": "Scientific beauty, refined into a pure Korean skincare ritual.\n\nVAVAW is a clinical Korean cosmetic system designed to restore the skin from its origin — pure, balanced, and resilient.",
  "items": [
    {
      "num": "01",
      "title": "Scientific Beauty",
      "desc": "Clinical skincare system shaped by professional care standards — developed for visible, lasting results."
    },
    {
      "num": "02",
      "title": "Premium Program",
      "desc": "Personalized skincare experience for modern skin concerns — designed for spa, clinic, and home ritual."
    },
    {
      "num": "03",
      "title": "Functional Cosmetics",
      "desc": "Korean-developed formulas designed for visible skin recovery, balancing efficacy with elegance."
    }
  ]
}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM content_blocks WHERE page_path = '/cosmetic' AND block_type = 'cosmetic-brand-philosophy'
);

INSERT INTO content_blocks (site_key, page_path, block_type, sort_order, is_active, content)
SELECT 'main', '/cosmetic', 'cosmetic-signature-collection', 2, true, '{
  "title": "Signature Recovery Collection",
  "eyebrow": "Signature Recovery Collection",
  "description": "A complete Korean clinical skincare ritual for recovery, hydration, radiance, and skin barrier support.",
  "featuredProduct": {
    "name": "Luminous Revitalization Sheer Set",
    "description": "A complete recovery set designed to support the skin barrier and restore a luminous, balanced appearance.",
    "ingredients": ["Exosome", "Collagen", "Peptide Complex"]
  },
  "ctaLabel": "Explore the Ritual",
  "ctaHref": "/contact?type=cosmetic_interest",
  "items": [
    {
      "name": "Regenaglow Nourish Sheer Cream",
      "type": "Kem dưỡng ẩm",
      "key": "Collagen · Peptide"
    },
    {
      "name": "Calmiance Superior Sheer Gel",
      "type": "Gel phục hồi",
      "key": "Cica 7 Complex · Aloe"
    },
    {
      "name": "Gentle Activation Renew Ampoule",
      "type": "Tinh chất tái sinh",
      "key": "Exosome · Bakuchiol"
    },
    {
      "name": "P30 Boost Facial Moisturizer",
      "type": "Kem dưỡng ẩm",
      "key": "Hyaluronic Acid · Peptide"
    },
    {
      "name": "P30 Boost Facial Hydrating Toner",
      "type": "Toner cân bằng",
      "key": "Aloe · Oriental Botanical"
    }
  ]
}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM content_blocks WHERE page_path = '/cosmetic' AND block_type = 'cosmetic-signature-collection'
);

INSERT INTO content_blocks (site_key, page_path, block_type, sort_order, is_active, content)
SELECT 'main', '/cosmetic', 'cosmetic-hero-product', 3, true, '{
  "title": "Luminous Revitalization\nSheer Set",
  "eyebrow": "Featured Product",
  "description": "A complete recovery set designed to support the skin barrier and restore a luminous, balanced appearance through a synergistic blend of clinical actives.",
  "ingredients": ["Exosome", "Collagen", "Peptide Complex"],
  "benefits": [
    "Skin barrier recovery",
    "Moisture protection",
    "Luminous radiance glow"
  ],
  "ctaLabel": "Start an Inquiry",
  "ctaHref": "/contact?type=cosmetic_interest"
}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM content_blocks WHERE page_path = '/cosmetic' AND block_type = 'cosmetic-hero-product'
);

INSERT INTO content_blocks (site_key, page_path, block_type, sort_order, is_active, content)
SELECT 'main', '/cosmetic', 'cosmetic-product-cards', 4, true, '{
  "title": "Clinical Formulas",
  "eyebrow": "The Collection",
  "items": [
    {
      "name": "Regenaglow Nourish Sheer Cream",
      "type": "Kem dưỡng phục hồi",
      "ingredients": "Collagen · Peptide Complex · Niacinamide",
      "benefits": ["Deep nourishment", "Skin renewal", "Anti-ageing support"],
      "desc": "A rich yet lightweight cream that deeply nourishes while encouraging cellular renewal for visibly rejuvenated skin."
    },
    {
      "name": "Calmiance Superior Sheer Gel",
      "type": "Gel phục hồi & làm dịu",
      "ingredients": "Cica 7 Complex · Aloe Extract · Centella",
      "benefits": ["Calms sensitivity", "Barrier repair", "Hydration lock"],
      "desc": "A soothing gel formulated with a seven-extract Cica complex to calm reactive skin and restore the protective barrier."
    },
    {
      "name": "Gentle Activation Renew Ampoule",
      "type": "Tinh chất tái sinh chuyên sâu",
      "ingredients": "Exosome · Bakuchiol · Peptide",
      "benefits": ["Cell renewal", "Gentle exfoliation", "Luminosity boost"],
      "desc": "A next-generation ampoule harnessing Exosome technology and plant-derived Bakuchiol for visible skin renewal without irritation."
    },
    {
      "name": "P30 Boost Facial Moisturizer",
      "type": "Kem dưỡng ẩm tăng cường",
      "ingredients": "Hyaluronic Acid · Peptide · Ceramide",
      "benefits": ["Moisture surge", "Plumping effect", "Skin softness"],
      "desc": "A high-performance moisturizer delivering an immediate and sustained surge of hydration for plumper, smoother skin."
    },
    {
      "name": "P30 Boost Facial Hydrating Toner",
      "type": "Toner cân bằng & hydrate",
      "ingredients": "Aloe · Oriental Botanical Complex · HA",
      "benefits": ["pH balancing", "Prep skin layer", "Instant refresh"],
      "desc": "A lightweight preparatory toner that balances, hydrates, and primes the skin to maximize subsequent skincare absorption."
    }
  ]
}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM content_blocks WHERE page_path = '/cosmetic' AND block_type = 'cosmetic-product-cards'
);

INSERT INTO content_blocks (site_key, page_path, block_type, sort_order, is_active, content)
SELECT 'main', '/cosmetic', 'cosmetic-daily-ritual', 5, true, '{
  "title": "Daily Clinical Ritual",
  "eyebrow": "Daily Clinical Ritual",
  "items": [
    { "step": "01", "name": "Cleanse", "detail": "Begin with a gentle clinical cleanser to remove impurities without disrupting the skin microbiome." },
    { "step": "02", "name": "Hydrating Toner", "detail": "P30 Boost Facial Hydrating Toner — balance pH and prime for maximum absorption." },
    { "step": "03", "name": "Renew Ampoule", "detail": "Gentle Activation Renew Ampoule — activate cellular renewal and luminosity." },
    { "step": "04", "name": "Moisturizer / Cream", "detail": "P30 Boost Facial Moisturizer or Regenaglow Nourish Sheer Cream — seal in moisture." },
    { "step": "05", "name": "Sheer Gel / Recovery Care", "detail": "Calmiance Superior Sheer Gel — calm, protect, and fortify the skin barrier." }
  ]
}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM content_blocks WHERE page_path = '/cosmetic' AND block_type = 'cosmetic-daily-ritual'
);

INSERT INTO content_blocks (site_key, page_path, block_type, sort_order, is_active, content)
SELECT 'main', '/cosmetic', 'cosmetic-ingredients', 6, true, '{
  "title": "Clinical Ingredients",
  "eyebrow": "Active Ingredients",
  "items": [
    { "name": "Exosome", "role": "Cellular regeneration & recovery" },
    { "name": "Collagen", "role": "Skin firmness & elasticity support" },
    { "name": "Peptide Complex", "role": "Anti-ageing signal communication" },
    { "name": "Bakuchiol", "role": "Gentle plant-derived retinol alternative" },
    { "name": "Cica 7 Complex", "role": "Barrier repair & soothing complex" },
    { "name": "Hyaluronic Acid", "role": "Multi-depth moisture binding" },
    { "name": "Aloe Extract", "role": "Calming & instant hydration" },
    { "name": "Oriental Botanicals", "role": "Traditional Korean herbal balance" }
  ]
}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM content_blocks WHERE page_path = '/cosmetic' AND block_type = 'cosmetic-ingredients'
);

INSERT INTO content_blocks (site_key, page_path, block_type, sort_order, is_active, content)
SELECT 'main', '/cosmetic', 'cosmetic-premium-program', 7, true, '{
  "title": "Premium Program",
  "eyebrow": "Premium Program",
  "description": "A personalized skincare experience designed for spa, clinic, and professional treatment environments — where expertise meets Korean clinical precision.",
  "items": [
    { "icon": "◆", "text": "Skin recovery ritual tailored to individual skin concerns" },
    { "icon": "◆", "text": "Professional treatment compatibility for spa and clinic use" },
    { "icon": "◆", "text": "Personalized care guidance from certified skincare specialists" }
  ],
  "ctaLabel": "Start a Consultation",
  "ctaHref": "/contact?type=cosmetic_interest"
}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM content_blocks WHERE page_path = '/cosmetic' AND block_type = 'cosmetic-premium-program'
);

INSERT INTO content_blocks (site_key, page_path, block_type, sort_order, is_active, content)
SELECT 'main', '/cosmetic', 'cosmetic-editorial-gallery', 8, true, '{
  "title": "The Ritual Aesthetic",
  "eyebrow": "Visual Harmony"
}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM content_blocks WHERE page_path = '/cosmetic' AND block_type = 'cosmetic-editorial-gallery'
);

INSERT INTO content_blocks (site_key, page_path, block_type, sort_order, is_active, content)
SELECT 'main', '/cosmetic', 'cosmetic-final-cta', 9, true, '{
  "title": "Premium RAW Skincare System",
  "eyebrow": "VAVAW Cosmetic",
  "ctaLabel": "Start an Inquiry",
  "ctaHref": "/contact?type=cosmetic_interest"
}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM content_blocks WHERE page_path = '/cosmetic' AND block_type = 'cosmetic-final-cta'
);
