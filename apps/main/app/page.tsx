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

// Revalidate every 30 seconds so hide/show changes propagate quickly even
// if cross-app revalidation webhook from admin is delayed.
export const revalidate = 30;

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

/**
 * Checks whether a CMS-managed main landing block is active.
 *
 * For blocks controlled by Main Landing Manager (main-ecosystem-intro,
 * main-final-cta, main-brand-story), we deliberately do NOT fall back to
 * visible when the block is absent from the public query result.
 *
 * Why: The public Supabase query (anon key + RLS) only returns rows where
 * is_active = true. So:
 *  - block returned by query  → isActive=true  → render section
 *  - block absent from query  → is_active=false → hide section
 *  - block absent from query  → DB has no row   → hide section (first-time install edge case)
 *
 * If we fallback to visible when missing, an inactive block hidden from anon
 * would cause the legacy static section to still render — defeating the toggle.
 *
 * NOTE: If future installs need first-time-fallback, add a DB view or RPC
 * that exposes inactive blocks safely to public, and restore fallbackWhenMissing=true.
 */
function isMainBlockActive(
  blockMap: Map<string, { isActive?: boolean; is_active?: boolean }>,
  blockType: string
): boolean {
  const block = blockMap.get(blockType);
  if (!block) return false; // missing = hidden for managed blocks
  return block.isActive === true || block.is_active === true;
}

export default async function HomePage() {
  const isPreview = (await draftMode()).isEnabled;
  const cms = await loadPublicHomeCms(isPreview);
  const { blocks, source: blocksSource } = await loadPublicContentBlocks({
    siteKey: 'main',
    pagePath: '/',
    isPreview,
  });

  // Build blockMap keyed by block_type from all returned CMS blocks.
  // Public RLS only returns active rows → inactive blocks will be absent.
  const blockMap = new Map<string, any>();
  if (Array.isArray(blocks)) {
    blocks.forEach((b: any) => {
      const type = b.blockType || b.block_type;
      if (type) blockMap.set(type, b);
    });
  }

  // Managed section visibility — missing from public query means hidden.
  // DO NOT use fallbackWhenMissing=true here (see isMainBlockActive comment above).
  const showEcosystem = isMainBlockActive(blockMap, 'main-ecosystem-intro');
  const showFinalCta = isMainBlockActive(blockMap, 'main-final-cta');

  // CTA content only rendered when the block is active and has content.
  const finalCtaBlock = blockMap.get('main-final-cta');
  const ctaContent = showFinalCta && finalCtaBlock?.content
    ? (finalCtaBlock.content as any)
    : null;

  // Active block count for QA attribute
  const activeMainBlockCount = Array.from(blockMap.values()).filter(
    (b) => b.isActive === true || b.is_active === true
  ).length;

  return (
    <main
      data-main-landing-managed="true"
      data-main-landing-cms-source={blocksSource}
      data-main-landing-active-blocks={activeMainBlockCount}
      data-main-ecosystem-visible={showEcosystem ? 'true' : 'false'}
      data-main-final-cta-visible={showFinalCta ? 'true' : 'false'}
    >
      <BrandHero
        slides={cms.heroSlides}
        dataSource={cms.source}
        fallbackUsed={cms.fallbackUsed}
        fallbackReason={cms.fallbackReason}
        rawHeroRowsCount={cms.rawHeroRowsCount}
      />

      {/* Ecosystem portfolio section — gated by CMS main-ecosystem-intro block.
          Only renders when the block is active (public RLS returns it).
          When admin hides it, block is inactive → anon query omits it → hidden here. */}
      {showEcosystem && <BusinessEcosystem />}

      {/* Final CTA section — gated by CMS main-final-cta block. */}
      {showFinalCta && ctaContent && (
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
