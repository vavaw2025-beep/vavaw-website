-- 1. Create storage bucket vavaw-media if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('vavaw-media', 'vavaw-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Public read policy for vavaw-media
CREATE POLICY "Public read vavaw-media"
ON storage.objects FOR SELECT
USING (bucket_id = 'vavaw-media');

-- 3. Authenticated Admin/Owner/Editor upload policy
CREATE POLICY "Admin upload vavaw-media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'vavaw-media' AND
  EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid()
      AND status = 'active'
      AND role IN ('owner', 'admin', 'editor')
  )
);

-- 4. Authenticated Admin/Owner/Editor update policy
CREATE POLICY "Admin update vavaw-media"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'vavaw-media' AND
  EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid()
      AND status = 'active'
      AND role IN ('owner', 'admin', 'editor')
  )
)
WITH CHECK (
  bucket_id = 'vavaw-media' AND
  EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid()
      AND status = 'active'
      AND role IN ('owner', 'admin', 'editor')
  )
);

-- 5. Authenticated Owner/Admin delete policy
CREATE POLICY "Admin delete vavaw-media"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'vavaw-media' AND
  EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid()
      AND status = 'active'
      AND role IN ('owner', 'admin')
  )
);
