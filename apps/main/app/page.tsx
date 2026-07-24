// build: phase-56H-v2
import type { Metadata } from 'next';
import { BrandHero } from '@/components/brand-hero';
import { SiteFooter } from '@vavaw/ui';
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

import { BusinessEcosystem } from '@/components/business-ecosystem';

export default async function HomePage() {
  const isPreview = (await draftMode()).isEnabled;
  const cms = await loadPublicHomeCms(isPreview);

  // Server-side CMS diagnostic — safe, never logs actual key values
  console.info('[main cms source]', {
    cmsSource: cms.source,
    hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    hasAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    rawHeroRowsCount: cms.rawHeroRowsCount ?? 'n/a',
    activeHeroRowsCount: cms.activeHeroRowsCount ?? 'n/a',
    normalizedSlidesCount: cms.heroSlides.length,
    fallbackUsed: cms.fallbackUsed ?? false,
    fallbackReason: cms.fallbackReason ?? null,
    error: cms.error ?? null,
  });
  if (process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_SHOW_CMS_DEBUG === 'true') {
    console.info('[main cms slides]', {
      slideCount: cms.heroSlides.length,
      slides: cms.heroSlides.map((slide) => ({
        title: slide.title,
        isDerived: slide.id.startsWith('derived-'),
        bgValid: Boolean(slide.backgroundImageUrl) && !slide.backgroundImageUrl!.includes('PASTE_'),
        previewValid: Boolean(slide.previewImageUrl) && !slide.previewImageUrl!.includes('PASTE_'),
      }))
    });
  }

  return (
    <main>
      <BrandHero
        slides={cms.heroSlides}
        dataSource={cms.source}
        fallbackUsed={cms.fallbackUsed}
        fallbackReason={cms.fallbackReason}
        rawHeroRowsCount={cms.rawHeroRowsCount}
      />
      <BusinessEcosystem />
      <SiteFooter variant="main" />
    </main>
  );
}
