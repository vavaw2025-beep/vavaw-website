-- 1. Create set_updated_at function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Create tables
CREATE TABLE admin_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  role text NOT NULL CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE business_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  title text NOT NULL,
  subtitle text,
  description text,
  navigation_type text NOT NULL CHECK (navigation_type IN ('internal', 'external-app')),
  href text NOT NULL,
  redirect_path text UNIQUE NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'coming-soon', 'draft')),
  sort_order integer NOT NULL DEFAULT 0,
  cta_label text,
  theme jsonb NOT NULL DEFAULT '{}'::jsonb,
  media jsonb NOT NULL DEFAULT '{}'::jsonb,
  seo jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_entry_id uuid REFERENCES business_entries(id) ON DELETE CASCADE,
  title text NOT NULL,
  subtitle text,
  description text,
  background_media_id uuid,
  preview_media_id uuid,
  cta_label text,
  redirect_path text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft')),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_key text NOT NULL,
  type text NOT NULL CHECK (type IN ('image', 'video', 'og-image', 'hero-image', 'preview-image')),
  url text NOT NULL,
  alt_text text,
  width integer,
  height integer,
  duration_seconds integer,
  storage_provider text NOT NULL DEFAULT 'static',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE seo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_key text NOT NULL,
  path text NOT NULL,
  title text NOT NULL,
  description text,
  keywords text[] DEFAULT array[]::text[],
  og_media_id uuid,
  canonical_url text,
  robots_index boolean NOT NULL DEFAULT true,
  robots_follow boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(site_key, path)
);

CREATE TABLE redirects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_path text UNIQUE NOT NULL,
  destination_url text NOT NULL,
  type text NOT NULL DEFAULT 'temporary' CHECK (type IN ('permanent', 'temporary')),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE content_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_key text NOT NULL,
  page_path text NOT NULL,
  block_type text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Add triggers for updated_at
CREATE TRIGGER set_updated_at_admin_profiles BEFORE UPDATE ON admin_profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_updated_at_business_entries BEFORE UPDATE ON business_entries FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_updated_at_hero_slides BEFORE UPDATE ON hero_slides FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_updated_at_media_assets BEFORE UPDATE ON media_assets FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_updated_at_seo_settings BEFORE UPDATE ON seo_settings FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_updated_at_redirects BEFORE UPDATE ON redirects FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_updated_at_content_blocks BEFORE UPDATE ON content_blocks FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 4. Add indexes
CREATE INDEX idx_business_entries_slug ON business_entries(slug);
CREATE INDEX idx_business_entries_status ON business_entries(status);
CREATE INDEX idx_business_entries_sort_order ON business_entries(sort_order);
CREATE INDEX idx_hero_slides_business_entry_id ON hero_slides(business_entry_id);
CREATE INDEX idx_hero_slides_sort_order ON hero_slides(sort_order);
CREATE INDEX idx_media_assets_site_key ON media_assets(site_key);
CREATE INDEX idx_media_assets_type ON media_assets(type);
CREATE INDEX idx_seo_settings_site_key_path ON seo_settings(site_key, path);
CREATE INDEX idx_redirects_source_path ON redirects(source_path);
CREATE INDEX idx_content_blocks_site_key_path ON content_blocks(site_key, page_path);

-- 5. Enable RLS
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;

-- 6. Add RLS Policies

-- Public Read Policies
CREATE POLICY "Public read active business_entries" ON business_entries FOR SELECT USING (status = 'active');
CREATE POLICY "Public read active redirects" ON redirects FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active seo_settings" ON seo_settings FOR SELECT USING (robots_index = true);

-- Admin read policy helper (exists and active)
-- We check if auth.uid() exists in admin_profiles with status 'active'
CREATE POLICY "Admin users can read admin_profiles" ON admin_profiles FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND status = 'active')
);

CREATE POLICY "Admin users can read business_entries" ON business_entries FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND status = 'active')
);

CREATE POLICY "Admin users can read hero_slides" ON hero_slides FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND status = 'active')
);

CREATE POLICY "Admin users can read media_assets" ON media_assets FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND status = 'active')
);

CREATE POLICY "Admin users can read seo_settings" ON seo_settings FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND status = 'active')
);

CREATE POLICY "Admin users can read redirects" ON redirects FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND status = 'active')
);

CREATE POLICY "Admin users can read content_blocks" ON content_blocks FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND status = 'active')
);

-- Write policies (Owner/Admin)
-- For simplicity, since RLS policies are OR'ed, we can define one policy for Owner/Admin on each table
CREATE POLICY "Owner and Admin can manage business_entries" ON business_entries FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND status = 'active' AND role IN ('owner', 'admin'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND status = 'active' AND role IN ('owner', 'admin'))
);

CREATE POLICY "Owner and Admin can manage redirects" ON redirects FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND status = 'active' AND role IN ('owner', 'admin'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND status = 'active' AND role IN ('owner', 'admin'))
);

-- Note: Only Owner can manage admin_profiles
CREATE POLICY "Owner can manage admin_profiles" ON admin_profiles FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND status = 'active' AND role = 'owner')
) WITH CHECK (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND status = 'active' AND role = 'owner')
);

-- Write policies (Owner/Admin/Editor)
CREATE POLICY "Owner Admin Editor can manage content_blocks" ON content_blocks FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND status = 'active' AND role IN ('owner', 'admin', 'editor'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND status = 'active' AND role IN ('owner', 'admin', 'editor'))
);

CREATE POLICY "Owner Admin Editor can manage hero_slides" ON hero_slides FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND status = 'active' AND role IN ('owner', 'admin', 'editor'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND status = 'active' AND role IN ('owner', 'admin', 'editor'))
);

CREATE POLICY "Owner Admin Editor can manage seo_settings" ON seo_settings FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND status = 'active' AND role IN ('owner', 'admin', 'editor'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND status = 'active' AND role IN ('owner', 'admin', 'editor'))
);

CREATE POLICY "Owner Admin Editor can manage media_assets" ON media_assets FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND status = 'active' AND role IN ('owner', 'admin', 'editor'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND status = 'active' AND role IN ('owner', 'admin', 'editor'))
);
