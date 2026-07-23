import React from 'react';
import { loadPreviewData } from '../../../lib/load-preview-data';
import { PreviewShell } from '../../../components/preview/PreviewShell';
import { PreviewHero } from '../../../components/preview/PreviewHero';
import { PreviewBusinessEntries } from '../../../components/preview/PreviewBusinessEntries';
import { PreviewSeoPanel } from '../../../components/preview/PreviewSeoPanel';

export default async function MainPreviewPage() {
  const data = await loadPreviewData('main');
  const isRevalidationEnabled = process.env.CMS_REVALIDATION_ENABLED === 'true';

  if (data.errors && data.errors.length > 0) {
    return (
      <PreviewShell title="Main Portal Preview" isRevalidationEnabled={isRevalidationEnabled}>
        <div className="p-8">
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-lg max-w-2xl mx-auto">
            <h2 className="text-lg font-bold mb-4">Preview Loading Errors</h2>
            <ul className="list-disc pl-5 space-y-2">
              {data.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      </PreviewShell>
    );
  }

  // Filter SEO for main site /
  const seo = data.seoSettings.find(s => s.site_key === 'main' && s.page_path === '/');

  // Filter business entries (show all)
  const sortedEntries = [...data.businessEntries].sort((a, b) => a.display_order - b.display_order);

  // Filter hero slides (show all for main)
  const sortedHero = [...data.heroSlides].sort((a, b) => a.sequence_order - b.sequence_order);
  
  // Resolve media for hero slides
  const heroWithMedia = sortedHero.map(slide => {
    const media = data.mediaAssets.find(m => m.id === slide.media_id);
    return { ...slide, media_assets: media };
  });

  return (
    <PreviewShell 
      title="Main Portal Preview" 
      targetUrl={process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}
      isRevalidationEnabled={isRevalidationEnabled}
    >
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-12 pb-24">
        <section>
          <PreviewSeoPanel seo={seo} />
        </section>

        <section>
          <PreviewHero slides={heroWithMedia} />
        </section>

        <section>
          <PreviewBusinessEntries entries={sortedEntries} />
        </section>
      </div>
    </PreviewShell>
  );
}
