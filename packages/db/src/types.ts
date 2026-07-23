// Database record types reflecting the future Supabase schema

export interface AdminProfileRecord {
  id: string; // uuid
  email: string;
  full_name?: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  status: 'active' | 'disabled';
  created_at: string;
  updated_at: string;
}

export interface BusinessEntryRecord {
  id: string; // uuid
  slug: string;
  name: string;
  category: string;
  title: string;
  subtitle?: string;
  description?: string;
  navigation_type: 'internal' | 'external-app';
  href: string;
  redirect_path: string;
  status: 'active' | 'coming-soon' | 'draft';
  sort_order: number;
  cta_label?: string;
  theme: any; // jsonb
  media: any; // jsonb
  seo: any; // jsonb
  created_at: string;
  updated_at: string;
}

export interface HeroSlideRecord {
  id: string; // uuid
  business_entry_id?: string; // fk
  title: string;
  subtitle?: string;
  description?: string;
  background_media_id?: string;
  preview_media_id?: string;
  cta_label?: string;
  redirect_path?: string;
  status: 'active' | 'draft';
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface MediaAssetRecord {
  id: string; // uuid
  site_key: string;
  type: 'image' | 'video' | 'og-image' | 'hero-image' | 'preview-image';
  url: string;
  alt_text?: string;
  width?: number;
  height?: number;
  duration_seconds?: number;
  mime_type?: string;
  size_bytes?: number;
  metadata?: Record<string, any>;
  storage_provider: string;
  created_at: string;
  updated_at: string;
}

export interface SeoSettingRecord {
  id: string; // uuid
  site_key: string;
  path: string;
  title: string;
  description?: string;
  keywords: string[];
  og_media_id?: string;
  canonical_url?: string;
  robots_index: boolean;
  robots_follow: boolean;
  created_at: string;
  updated_at: string;
}

export interface RedirectRecord {
  id: string; // uuid
  source_path: string;
  destination_url: string;
  type: 'permanent' | 'temporary';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentBlockRecord {
  id: string; // uuid
  site_key: string;
  page_path: string;
  block_type: string;
  content: any; // jsonb
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
export interface LeadRecord {
  id: string; // uuid
  source_app: 'main' | 'cosmetic' | 'beauty' | 'franchise';
  source_path: string;
  lead_type: 'general_contact' | 'cosmetic_interest' | 'beauty_booking' | 'franchise_application';
  full_name: string;
  email?: string | null;
  phone?: string | null;
  company_name?: string | null;
  message?: string | null;
  status: 'new' | 'contacted' | 'qualified' | 'closed' | 'spam';
  metadata: any; // jsonb
  created_at: string;
  updated_at: string;
}
