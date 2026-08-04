import type { Metadata } from 'next';
import { getBusinessBySlug } from '@vavaw/brand-config';
import { CosmeticContent } from './cosmetic-content';
import { notFound } from 'next/navigation';
import { loadPublicSeo } from '@/lib/load-public-seo';
import { loadPublicHeroMedia, PublicHeroMedia } from '@/lib/load-public-hero-media';
import { loadPublicCosmeticMedia } from '@/lib/load-public-cosmetic-media';
import { Suspense } from 'react';

const cosmeticEntry = getBusinessBySlug('cosmetic');

/**
 * Dynamic metadata for the cosmetic page.
 * Reads from Supabase seo_settings (site_key=main, path=/cosmetic) when
 * CMS_DATA_SOURCE=supabase, falls back to @vavaw/brand-config SEO values.
 */
import { draftMode } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
  const isPreview = (await draftMode()).isEnabled;
  const seo = await loadPublicSeo('/cosmetic', 'main', isPreview);

  return {
    title: seo.title || cosmeticEntry?.seo.title || 'VAVAW Cosmetic',
    description: seo.description || cosmeticEntry?.seo.description || 'A dedicated cosmetic collection under the VAVAW ecosystem.',
    keywords: seo.keywords || cosmeticEntry?.seo.keywords,
    alternates: {
      canonical: seo.canonicalUrl || cosmeticEntry?.seo.canonicalUrl || 'https://vavaw.vn/cosmetic',
    },
    openGraph: {
      title: seo.title || cosmeticEntry?.seo.title || 'VAVAW Cosmetic',
      description: seo.description || cosmeticEntry?.seo.description || cosmeticEntry?.description,
      url: seo.canonicalUrl || cosmeticEntry?.seo.canonicalUrl || 'https://vavaw.vn/cosmetic',
      images: seo.ogImageUrl
        ? [seo.ogImageUrl]
        : cosmeticEntry?.media.ogImage
        ? [cosmeticEntry.media.ogImage]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title || cosmeticEntry?.seo.title || 'VAVAW Cosmetic',
      description: seo.description || cosmeticEntry?.seo.description || cosmeticEntry?.description,
    },
    robots: {
      index: seo.robotsIndex,
      follow: seo.robotsFollow,
    },
  };
}

import { loadPublicContentBlocks } from '@/lib/load-public-content-blocks';
import { SiteFooter } from '@vavaw/ui';

export default async function CosmeticPage() {
  if (!cosmeticEntry) {
    notFound();
  }

  const isPreview = (await draftMode()).isEnabled;
  
  // Load content blocks for cosmetic page (lower sections)
  const { blocks, source } = await loadPublicContentBlocks({
    siteKey: 'main',
    pagePath: '/cosmetic',
    isPreview
  });

  const heroMedia = await loadPublicHeroMedia('Cosmetic', isPreview);
  const cosmeticMedia = await loadPublicCosmeticMedia(isPreview);

  return (
    <>
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black text-white text-xs px-2 py-1 rounded z-50 shadow">
          Content: {blocks.length > 0 ? source : 'static (fallback)'}
        </div>
      )}
      <Suspense fallback={<div className="min-h-[82vh] bg-[#F7F9FC]" />}>
        <CosmeticContent 
          entry={cosmeticEntry} 
          heroMedia={heroMedia} 
          cosmeticMedia={cosmeticMedia} 
          blocks={blocks}
        />
      </Suspense>
      <SiteFooter variant="cosmetic" />
    </>
  );
}
