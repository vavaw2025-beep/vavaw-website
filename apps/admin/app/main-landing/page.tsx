import { getAdminDataSourceMode } from '../../lib/data-source';
import { getAdminServerSupabaseClient } from '../../lib/supabase-server';
import { getCurrentAdminProfile } from '../../lib/admin-profile';
import { getContentBlocks, getHeroSlides, getBusinessEntries, getSeoSettings } from '@vavaw/db';
import { getSortedBusinessEntries } from '@vavaw/brand-config';
import { MainLandingManager } from './MainLandingManager';

export const dynamic = 'force-dynamic';

export default async function MainLandingPage() {
  const mode = getAdminDataSourceMode();
  const profile = await getCurrentAdminProfile();
  const isSupabaseMode = mode === 'supabase';

  let initialBlocks: any[] = [];
  let initialHeroSlides: any[] = [];
  let initialBusinessEntries: any[] = [];
  let initialSeo: any = null;
  let queryError: string | null = null;

  if (isSupabaseMode) {
    try {
      const supabase = await getAdminServerSupabaseClient();

      // 1. Load content blocks and filter for site_key = 'main', page_path = '/'
      const { data: blocksData, error: blocksErr } = await getContentBlocks(supabase);
      if (blocksData) {
        initialBlocks = blocksData.filter((b) => b.site_key === 'main' && b.page_path === '/');
      }
      if (blocksErr) queryError = blocksErr.message;

      // 2. Load hero slides
      const { data: heroData } = await getHeroSlides(supabase);
      if (heroData) initialHeroSlides = heroData;

      // 3. Load business entries
      const { data: businessData } = await getBusinessEntries(supabase);
      if (businessData) initialBusinessEntries = businessData;

      // 4. Load SEO settings and filter for path '/'
      const { data: seoData } = await getSeoSettings(supabase);
      if (seoData) {
        initialSeo = seoData.find((s) => s.site_key === 'main' && s.path === '/') || null;
      }
    } catch (err: any) {
      queryError = err?.message || 'Error connecting to Supabase';
    }
  } else {
    // Static fallback mode
    const staticEntries = getSortedBusinessEntries();
    initialBusinessEntries = staticEntries.map((e) => ({
      id: e.id,
      name: e.name,
      slug: e.slug,
      description: e.description,
      status: e.status,
      sort_order: e.sortOrder,
      redirect_path: e.redirectPath,
      media_slot: e.media?.previewImage,
    }));
  }

  return (
    <MainLandingManager
      initialBlocks={initialBlocks}
      initialHeroSlides={initialHeroSlides}
      initialBusinessEntries={initialBusinessEntries}
      initialSeo={initialSeo}
      isSupabaseMode={isSupabaseMode}
      role={profile?.role || 'viewer'}
      queryError={queryError}
    />
  );
}
