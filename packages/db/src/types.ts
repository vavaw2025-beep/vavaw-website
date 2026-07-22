// Database record types reflecting the future Supabase schema

export interface BusinessEntryRecord {
  id: string; // uuid
  name: string;
  slug: string;
  category: string;
  status: 'active' | 'coming-soon' | 'draft';
  navigation_type: 'internal' | 'external-app';
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface HeroSlideRecord {
  id: string; // uuid
  business_id: string; // fk
  title: string;
  subtitle: string;
  description: string;
  cta_label: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MediaAssetRecord {
  id: string; // uuid
  business_id: string; // fk
  asset_type: 'background' | 'preview' | 'og' | 'video' | 'gallery';
  file_path: string;
  file_size?: number;
  mime_type?: string;
  created_at: string;
  updated_at: string;
}

export interface SeoSettingRecord {
  id: string; // uuid
  business_id: string; // fk
  title: string;
  description: string;
  canonical_url: string;
  keywords: string[];
  created_at: string;
  updated_at: string;
}

export interface RedirectRecord {
  id: string; // uuid
  business_id: string; // fk
  source_path: string;
  destination_url: string;
  is_permanent: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentBlockRecord {
  id: string; // uuid
  business_id: string; // fk
  block_id: string;
  content_json: string; // JSON string or object
  is_published: boolean;
  created_at: string;
  updated_at: string;
}
