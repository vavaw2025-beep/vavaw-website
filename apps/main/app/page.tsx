import type { Metadata } from 'next';
import { BrandHero } from '@/components/brand-hero';
import { BusinessEcosystem } from '@/components/business-ecosystem';
import { SiteFooter } from '@vavaw/ui';
import { loadPublicHomeCms } from '@/lib/load-public-cms';
import { loadPublicSeo } from '@/lib/load-public-seo';
import { loadPublicContentBlocks } from '@/lib/load-public-content-blocks';
import { resolveUnfinishedHref } from '@/lib/unfinished-links';
import Link from 'next/link';
import { draftMode } from 'next/headers';

export const revalidate = 60;

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
  const { blocks } = await loadPublicContentBlocks({ siteKey: 'main', pagePath: '/', isPreview });

  const finalCtaBlock = blocks?.find(b => b.blockType === 'main-final-cta' && b.isActive);
  const ctaContent = (finalCtaBlock?.content as any) || null;

  const showCmsDebug = process.env.NEXT_PUBLIC_SHOW_CMS_DEBUG === 'true';

  if (showCmsDebug) {
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

      {ctaContent && (
        <section className="py-24 px-6 bg-[#111111] text-white text-center border-t border-[#222222]">
          <div className="max-w-3xl mx-auto space-y-6">
            {ctaContent.eyebrow && (
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A3A3A3] block">
                {String(ctaContent.eyebrow)}
              </span>
            )}
            {ctaContent.title && (
              <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white">
                {String(ctaContent.title)}
              </h2>
            )}
            {ctaContent.description && (
              <p className="text-sm md:text-base text-[#A3A3A3] font-light max-w-xl mx-auto leading-relaxed">
                {String(ctaContent.description)}
              </p>
            )}

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              {ctaContent.primaryCtaLabel && (
                <Link
                  href={resolveUnfinishedHref(String(ctaContent.primaryCtaHref || '/cosmetic'), '/main-final-cta')}
                  className="px-8 py-3.5 bg-white text-black font-medium text-xs tracking-[0.15em] uppercase hover:bg-white/90 transition-colors rounded-sm"
                >
                  {String(ctaContent.primaryCtaLabel)}
                </Link>
              )}
              {ctaContent.secondaryCtaLabel && (
                <Link
                  href={resolveUnfinishedHref(String(ctaContent.secondaryCtaHref || '/contact'), '/main-final-cta-secondary')}
                  className="px-8 py-3.5 border border-[#333333] hover:border-white text-white font-medium text-xs tracking-[0.15em] uppercase transition-colors rounded-sm"
                >
                  {String(ctaContent.secondaryCtaLabel)}
                </Link>
              )}
            </div>

            {Array.isArray(ctaContent.trustPoints) && ctaContent.trustPoints.length > 0 && (
              <div className="pt-8 border-t border-[#222222] flex flex-wrap justify-center gap-6 text-xs text-[#737373] tracking-wider uppercase font-mono">
                {ctaContent.trustPoints.map((tp: string, idx: number) => (
                  <span key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {tp}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <SiteFooter variant="main" />
    </main>
  );
}
