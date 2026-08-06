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
  const { blocks, source, rawCount, activeCount, fallbackReason } = await loadPublicContentBlocks({
    siteKey: 'main',
    pagePath: '/cosmetic',
    isPreview
  });

  const heroMedia = await loadPublicHeroMedia('Cosmetic', isPreview);
  const cosmeticMedia = await loadPublicCosmeticMedia(isPreview);

  return (
    <>
      {process.env.NEXT_PUBLIC_SHOW_CMS_DEBUG === 'true' && (
        <div className="fixed bottom-4 right-4 bg-black/90 backdrop-blur-sm text-white text-xs p-3 rounded-lg z-50 shadow-lg border border-white/10 max-w-sm pointer-events-none">
          <div className="font-semibold mb-2 border-b border-white/20 pb-1">Cosmetic CMS Debug</div>
          <div className="space-y-1">
            <div><span className="opacity-50">CMS Source env:</span> {process.env.CMS_DATA_SOURCE || 'missing'}</div>
            <div><span className="opacity-50">Content Source:</span> {source}</div>
            <div><span className="opacity-50">Fallback Used:</span> {blocks.length === 0 ? 'true' : 'false'}</div>
            <div><span className="opacity-50">Raw/Active Blocks:</span> {rawCount ?? 0} / {activeCount ?? 0}</div>
            <div><span className="opacity-50">Mapped Sections:</span> {blocks.length}</div>
            {fallbackReason && (
              <div className="text-red-400"><span className="opacity-50 text-white">Reason:</span> {fallbackReason}</div>
            )}
            {blocks.length > 0 && (
              <>
                <div className="mt-2 pt-2 border-t border-white/20"><span className="opacity-50">First Block Type:</span> {String(blocks[0].blockType || 'unknown')}</div>
                <div className="truncate"><span className="opacity-50">First Block Title:</span> {String(blocks[0].content?.title || 'none')}</div>
              </>
            )}
            {(() => {
              const sigBlock = blocks.find(b => b.blockType === 'cosmetic-signature-collection');
              const items = sigBlock?.content?.items as any[] | undefined;
              return (
                <div className="mt-2 pt-2 border-t border-white/20 text-[10px] space-y-1">
                  <div className="font-semibold text-blue-300">Recovery Block Status:</div>
                  <div><span className="opacity-50">Block Found:</span> {sigBlock ? 'Yes' : 'No'}</div>
                  {sigBlock && (
                    <>
                      <div><span className="opacity-50">Item Count:</span> {items?.length ?? 0}</div>
                      {items && items.length > 0 && (
                        <>
                          <div><span className="opacity-50">First Item:</span> {items[0]?.name || 'unnamed'}</div>
                          <div><span className="opacity-50">First MediaSlot:</span> {items[0]?.mediaSlot || 'none'}</div>
                          <div className="mt-1 font-semibold text-blue-200">Raw DB Order:</div>
                          <ol className="list-decimal pl-4 opacity-90 max-h-24 overflow-y-auto">
                            {items.map((it, idx) => (
                              <li key={idx} className="truncate">{it.name || 'unnamed'}</li>
                            ))}
                          </ol>
                        </>
                      )}
                    </>
                  )}
                </div>
              );
            })()}
          </div>
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
