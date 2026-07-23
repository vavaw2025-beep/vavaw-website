import type { Metadata } from 'next';
import { BrandHero } from '@/components/brand-hero';
import { loadPublicHomeCms } from '@/lib/load-public-cms';
import { loadPublicSeo } from '@/lib/load-public-seo';

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

/**
 * Dynamic metadata for the homepage — reads from Supabase seo_settings if available,
 * falls back to static brand-config values.
 */
import { draftMode } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
  const isPreview = (await draftMode()).isEnabled;
  const seo = await loadPublicSeo('/', 'main', isPreview);

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: seo.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.canonicalUrl || 'https://vavaw.vn',
      images: seo.ogImageUrl ? [seo.ogImageUrl] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
    },
    robots: {
      index: seo.robotsIndex,
      follow: seo.robotsFollow,
    },
  };
}

export default async function HomePage() {
  const isPreview = (await draftMode()).isEnabled;
  const cms = await loadPublicHomeCms(isPreview);

  return (
    <main>
      <BrandHero slides={cms.heroSlides} dataSource={cms.source} />
    </main>
  );
}
