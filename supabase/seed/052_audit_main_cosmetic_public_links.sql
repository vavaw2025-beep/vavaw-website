-- 052_audit_main_cosmetic_public_links.sql
-- Extracts CTA and link candidates from content_blocks and business_entries
-- for the Main site and Cosmetic pages to assist in link auditing.

-- 1. Extract link candidates from content_blocks
SELECT 
    id,
    site_key,
    page_path,
    block_type,
    is_active,
    -- JSON extractions for common CTA keys
    content->>'primaryCtaHref' as primary_cta_href,
    content->>'secondaryCtaHref' as secondary_cta_href,
    content->>'ctaHref' as cta_href,
    content->>'buttonHref' as button_href,
    content->>'href' as plain_href,
    content->>'url' as plain_url,
    -- Sub-objects often containing links
    content->'premiumProgram'->>'ctaHref' as premium_program_cta,
    content->'premiumProgram'->>'secondaryCtaHref' as premium_program_sec_cta,
    content->'finalCta'->>'ctaHref' as final_cta_href,
    content->'finalCta'->>'secondaryCtaHref' as final_cta_sec_href,
    content->'spaBridge'->>'ctaHref' as spa_bridge_cta
FROM 
    content_blocks
WHERE 
    site_key = 'main' 
    AND (
        page_path = '/' 
        OR page_path LIKE '/cosmetic%'
    );

-- 2. Extract link candidates from business_entries (used in ecosystem cards)
SELECT 
    id,
    slug,
    status,
    redirect_path
FROM 
    business_entries
WHERE 
    status = 'active';

-- 3. Extract hero slides CTAs
SELECT
    id,
    site_key,
    page_path,
    title,
    is_active,
    cta_text,
    cta_link
FROM
    hero_slides
WHERE
    site_key = 'main'
    AND (
        page_path = '/' 
        OR page_path LIKE '/cosmetic%'
    );
