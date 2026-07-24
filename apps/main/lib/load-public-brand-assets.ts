import { createClient } from '@supabase/supabase-js';

export interface PublicBrandAssets {
  logoMainWhite?: string;
  logoMainDark?: string;
  logoMainBlue?: string;
  logoCosmeticBlue?: string;
  logoAdminDark?: string;
}

export async function loadPublicBrandAssets(siteKey: string = 'main'): Promise<PublicBrandAssets> {
  const dataSource = process.env.CMS_DATA_SOURCE || 'static';
  
  if (dataSource !== 'supabase') {
    return {};
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return {};
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Fetch the latest 100 images for the site to filter in memory
    const { data: assets, error } = await supabase
      .from('media_assets')
      .select('url, metadata, created_at')
      .eq('site_key', siteKey)
      .eq('type', 'image')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error || !assets) {
      return {};
    }

    const brandAssets: PublicBrandAssets = {};

    // Since it's ordered by created_at DESC, the first one we find for a slot is the newest
    for (const asset of assets) {
      const purpose = asset.metadata?.purpose;
      const slot = asset.metadata?.slot;

      if (purpose === 'brand-logo' && slot) {
        if (slot === 'logo-main-white' && !brandAssets.logoMainWhite) {
          brandAssets.logoMainWhite = asset.url;
        }
        if (slot === 'logo-main-dark' && !brandAssets.logoMainDark) {
          brandAssets.logoMainDark = asset.url;
        }
        if (slot === 'logo-main-blue' && !brandAssets.logoMainBlue) {
          brandAssets.logoMainBlue = asset.url;
        }
        if (slot === 'logo-cosmetic-blue' && !brandAssets.logoCosmeticBlue) {
          brandAssets.logoCosmeticBlue = asset.url;
        }
        if (slot === 'logo-admin-dark' && !brandAssets.logoAdminDark) {
          brandAssets.logoAdminDark = asset.url;
        }
      }
    }

    return brandAssets;
  } catch (err) {
    return {}; // Never throw, never break public rendering
  }
}
