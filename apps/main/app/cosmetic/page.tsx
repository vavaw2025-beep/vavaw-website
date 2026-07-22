import type { Metadata } from 'next';
import { getBusinessBySlug } from '@vavaw/brand-config';
import { CosmeticContent } from './cosmetic-content';
import { notFound } from 'next/navigation';
import { loadPublicSeo } from '@/lib/load-public-seo';

const cosmeticEntry = getBusinessBySlug('cosmetic');

/**
 * Dynamic metadata for the cosmetic page.
 * Reads from Supabase seo_settings (site_key=main, path=/cosmetic) when
 * CMS_DATA_SOURCE=supabase, falls back to @vavaw/brand-config SEO values.
 */
export async function generateMetadata(): Promise<Metadata> {
  const seo = await loadPublicSeo('/cosmetic');

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

export default function CosmeticPage() {
  if (!cosmeticEntry) {
    notFound();
  }

  return <CosmeticContent entry={cosmeticEntry} />;
}
