-- Migration 004: Leads Schema

CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_app text NOT NULL CHECK (source_app IN ('main', 'cosmetic', 'beauty', 'franchise')),
  source_path text NOT NULL,
  lead_type text NOT NULL CHECK (lead_type IN ('general_contact', 'cosmetic_interest', 'beauty_booking', 'franchise_application')),
  full_name text NOT NULL,
  email text,
  phone text,
  company_name text,
  message text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed', 'spam')),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX leads_source_app_idx ON public.leads(source_app);
CREATE INDEX leads_lead_type_idx ON public.leads(lead_type);
CREATE INDEX leads_status_idx ON public.leads(status);
CREATE INDEX leads_created_at_idx ON public.leads(created_at);

-- Updated at trigger
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anon/Public can INSERT leads only
CREATE POLICY "Public can insert leads" ON public.leads
  FOR INSERT TO public, anon
  WITH CHECK (true);

-- Policy 2: Public cannot SELECT, UPDATE, DELETE leads (implicit since no policies allow it)

-- Policy 3: Authenticated active admin profiles can SELECT leads
CREATE POLICY "Admin profiles can read leads" ON public.leads
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_profiles
      WHERE id = auth.uid() AND status = 'active'
    )
  );

-- Policy 4: Owner/Admin/Editor can UPDATE lead status
CREATE POLICY "Owner/Admin/Editor can update leads" ON public.leads
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_profiles
      WHERE id = auth.uid() 
        AND status = 'active'
        AND role IN ('owner', 'admin', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_profiles
      WHERE id = auth.uid() 
        AND status = 'active'
        AND role IN ('owner', 'admin', 'editor')
    )
  );

-- Note: DELETE is not allowed for MVP.
