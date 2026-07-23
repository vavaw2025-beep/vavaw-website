import { getAdminServerSupabaseClient } from './supabase-server';
import { getAdminDataSourceMode } from './data-source';
import { getCurrentAdminProfile } from './admin-profile';
import { canPreview } from '@vavaw/auth';
import {
  getBusinessEntries,
  getHeroSlides,
  getMediaAssets,
  getSeoSettings,
  getContentBlocks
} from '@vavaw/db';

export type PreviewTarget = 'main' | 'cosmetic' | 'beauty' | 'franchise';

export interface PreviewData {
  target: PreviewTarget;
  businessEntries: any[];
  heroSlides: any[];
  mediaAssets: any[];
  seoSettings: any[];
  contentBlocks: any[];
  source: 'supabase' | 'static';
  errors?: string[];
}

export async function loadPreviewData(target: PreviewTarget): Promise<PreviewData> {
  const mode = getAdminDataSourceMode();
  const data: PreviewData = {
    target,
    businessEntries: [],
    heroSlides: [],
    mediaAssets: [],
    seoSettings: [],
    contentBlocks: [],
    source: mode,
    errors: []
  };

  if (mode !== 'supabase') {
    data.errors?.push('Preview requires Supabase CMS mode.');
    return data;
  }

  const profile = await getCurrentAdminProfile();
  if (!profile || profile.status !== 'active') {
    data.errors?.push('Unauthorized or disabled profile.');
    return data;
  }

  if (!canPreview(profile.role)) {
    data.errors?.push('Insufficient permissions for preview.');
    return data;
  }

  try {
    const supabase = await getAdminServerSupabaseClient();
    
    // We fetch everything. The RLS policies for admin roles should allow reading all records (active and draft).
    // In a real scenario, we might want to filter by site_key if the dataset is huge, but for this preview, loading all is fine,
    // or we can filter in memory/UI. Let's just load them.
    
    const [businessRes, heroRes, mediaRes, seoRes, contentRes] = await Promise.all([
      getBusinessEntries(supabase),
      getHeroSlides(supabase),
      getMediaAssets(supabase),
      getSeoSettings(supabase),
      getContentBlocks(supabase)
    ]);

    if (businessRes.error) data.errors?.push(`Business Error: ${businessRes.error.message}`);
    else data.businessEntries = businessRes.data || [];

    if (heroRes.error) data.errors?.push(`Hero Error: ${heroRes.error.message}`);
    else data.heroSlides = heroRes.data || [];

    if (mediaRes.error) data.errors?.push(`Media Error: ${mediaRes.error.message}`);
    else data.mediaAssets = mediaRes.data || [];

    if (seoRes.error) data.errors?.push(`SEO Error: ${seoRes.error.message}`);
    else data.seoSettings = seoRes.data || [];

    if (contentRes.error) data.errors?.push(`Content Blocks Error: ${contentRes.error.message}`);
    else data.contentBlocks = contentRes.data || [];

  } catch (err: any) {
    data.errors?.push(`Unexpected error loading preview data: ${err.message}`);
  }

  return data;
}
