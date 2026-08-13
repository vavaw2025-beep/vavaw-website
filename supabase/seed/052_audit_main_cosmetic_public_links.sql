-- 052_audit_main_cosmetic_public_links.sql
-- Extracts CTA and link candidates from content_blocks and business_entries
-- for the Main site and Cosmetic pages to assist in link auditing.
-- Note: Links pointing to beauty.vavaw.vn, franchise.vavaw.vn, /go/beauty, or /go/franchise
-- must be classified as 'fallback-required'. Do NOT run destructive updates on these rows.

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
    content->'spaBridge'->>'ctaHref' as spa_bridge_cta,
    -- Classify status based on value
    CASE 
        WHEN content::text LIKE '%beauty.vavaw.vn%' OR content::text LIKE '%/go/beauty%' THEN 'fallback-required'
        WHEN content::text LIKE '%franchise.vavaw.vn%' OR content::text LIKE '%/go/franchise%' THEN 'fallback-required'
        ELSE 'audit-needed'
    END as link_classification
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
    redirect_path,
    CASE 
        WHEN redirect_path LIKE '%beauty.vavaw.vn%' OR redirect_path LIKE '%/go/beauty%' THEN 'fallback-required'
        WHEN redirect_path LIKE '%franchise.vavaw.vn%' OR redirect_path LIKE '%/go/franchise%' THEN 'fallback-required'
        ELSE 'audit-needed'
    END as link_classification
FROM 
    business_entries
WHERE 
    status = 'active';

-- 3. Extract hero slides CTAs
SELECT
    id,
    business_entry_id,
    title,
    status,
    cta_label as cta_text,
    redirect_path as cta_link,
    CASE 
        WHEN redirect_path LIKE '%beauty.vavaw.vn%' OR redirect_path LIKE '%/go/beauty%' THEN 'fallback-required'
        WHEN redirect_path LIKE '%franchise.vavaw.vn%' OR redirect_path LIKE '%/go/franchise%' THEN 'fallback-required'
        ELSE 'audit-needed'
    END as link_classification
FROM
    hero_slides
WHERE
    status = 'active';
