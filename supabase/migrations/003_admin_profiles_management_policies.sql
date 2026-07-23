-- 003_admin_profiles_management_policies.sql
-- Policies for owner to manage admin_profiles

-- 1. We drop the existing general SELECT policy if we want to replace it, 
-- but wait, the existing SELECT policy in 001 allows ALL active admins to read.
-- The prompt says: "SELECT admin_profiles: allowed for active owner/admin. Do not allow editor/viewer to select or mutate admin_profiles."
-- Let's drop the old SELECT policy and create a new stricter one.
DROP POLICY IF EXISTS "Admin users can read admin_profiles" ON admin_profiles;

CREATE POLICY "Admin users can read admin_profiles" ON admin_profiles FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND status = 'active' AND role IN ('owner', 'admin'))
);

-- 2. INSERT policy: allowed for active owner only
CREATE POLICY "Owner can insert admin_profiles" ON admin_profiles FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND status = 'active' AND role = 'owner')
);

-- 3. UPDATE policy: allowed for active owner only
CREATE POLICY "Owner can update admin_profiles" ON admin_profiles FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND status = 'active' AND role = 'owner')
) WITH CHECK (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND status = 'active' AND role = 'owner')
);

-- Note: DELETE is explicitly not allowed/implemented in Phase 29.
