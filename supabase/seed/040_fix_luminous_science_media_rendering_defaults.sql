-- Non-destructively seed mediaRenderType and image mode defaults for Luminous Set science panels
UPDATE public.content_blocks
SET content = jsonb_set(
    content,
    '{skinBarrierMg3Plus}',
    COALESCE(content->'skinBarrierMg3Plus', '{}'::jsonb) || jsonb_build_object(
        'skinBarrier', (
            '{
                "mediaRenderType": "diagram",
                "desktopImageMode": "contain-blur",
                "mobileImageMode": "contain-blur"
            }'::jsonb || COALESCE(content->'skinBarrierMg3Plus'->'skinBarrier', '{}'::jsonb)
        ),
        'mg3Plus', (
            '{
                "mediaRenderType": "diagram",
                "desktopImageMode": "contain-blur",
                "mobileImageMode": "contain-blur"
            }'::jsonb || COALESCE(content->'skinBarrierMg3Plus'->'mg3Plus', '{}'::jsonb)
        )
    )
)
WHERE block_type = 'cosmetic-product-landing-luminous-set'
  AND site_key = 'main';
