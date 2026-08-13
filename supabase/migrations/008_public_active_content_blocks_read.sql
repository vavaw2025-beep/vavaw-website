-- Migration 008: Allow public read access to active content_blocks
-- 
-- Problem: content_blocks had no anon read policy. The public Next.js app
-- (apps/main) queries content_blocks using the Supabase anon key, which
-- returned 0 rows due to RLS. This caused the blockMap to be empty, and
-- isMainBlockVisible(blockMap, 'main-ecosystem-intro', fallbackWhenMissing=true)
-- always returned true — rendering the ecosystem section even when admin set it hidden.
--
-- Fix: Grant anon SELECT on rows where is_active = true.
-- - When a block is active   → public receives it → isActive=true → section renders.
-- - When a block is inactive → public gets nothing → treated as missing → section hidden.
-- - Admin app uses authenticated role and its own policy, unaffected.

DROP POLICY IF EXISTS "Public can read active content_blocks" ON public.content_blocks;

CREATE POLICY "Public can read active content_blocks"
ON public.content_blocks
FOR SELECT
TO anon
USING (is_active = true);
