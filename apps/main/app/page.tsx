import { BrandHero } from '@/components/brand-hero';
import { loadPublicHomeCms } from '@/lib/load-public-cms';

/**
 * Revalidation strategy for the public homepage (ISR):
 *
 * - CMS_DATA_SOURCE=static:  Page is effectively static (revalidation is a no-op since data
 *   doesn't change between rebuilds). The 60s interval adds negligible overhead.
 * - CMS_DATA_SOURCE=supabase: Page revalidates every 60 seconds so CMS changes appear
 *   without a full rebuild. Increase this value to reduce Supabase read load.
 *
 * Next.js requires `revalidate` to be a static number literal — it cannot be computed
 * from environment variables at module parse time. To change the interval:
 *   1. Update this constant.
 *   2. Redeploy.
 *
 * Webhook-based on-demand revalidation (revalidatePath / revalidateTag) is planned
 * for a future phase to enable instant cache invalidation.
 */
export const revalidate = 60;

export default async function HomePage() {
  const cms = await loadPublicHomeCms();

  return (
    <main>
      <BrandHero slides={cms.heroSlides} dataSource={cms.source} />
    </main>
  );
}
