-- Migration 007: Allow public read access to media_assets
-- This is required so the public Next.js app (using anon key) can read hero slides' media_assets.url.

DROP POLICY IF EXISTS "Public can read media assets" ON public.media_assets;

CREATE POLICY "Public can read media assets"
ON public.media_assets
FOR SELECT
TO anon, authenticated
USING (
  storage_provider = 'supabase'
  AND type IN ('image', 'preview-image', 'hero-image', 'video')
);
