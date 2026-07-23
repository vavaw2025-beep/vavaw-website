import React from 'react';
import { loadPreviewData } from '../../../lib/load-preview-data';
import { PreviewShell } from '../../../components/preview/PreviewShell';
import { PreviewContentBlocks } from '../../../components/preview/PreviewContentBlocks';
import { PreviewSeoPanel } from '../../../components/preview/PreviewSeoPanel';

export default async function CosmeticPreviewPage() {
  const data = await loadPreviewData('cosmetic');
  const isRevalidationEnabled = process.env.CMS_REVALIDATION_ENABLED === 'true';

  if (data.errors && data.errors.length > 0) {
    return (
      <PreviewShell title="Cosmetic Page Preview" isRevalidationEnabled={isRevalidationEnabled}>
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

  // Filter SEO for main site /cosmetic
  const seo = data.seoSettings.find(s => s.site_key === 'main' && s.page_path === '/cosmetic');

  // Filter content blocks for cosmetic
  // Site key could be 'main' or 'cosmetic' (historically), page_path = '/cosmetic'
  const blocks = data.contentBlocks
    .filter(b => (b.site_key === 'main' || b.site_key === 'cosmetic') && b.page_path === '/cosmetic')
    .sort((a, b) => a.display_order - b.display_order);

  const mainUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const targetUrl = `${mainUrl}/cosmetic`.replace(/([^:]\/)\/+/g, '$1'); // ensure no double slash

  return (
    <PreviewShell 
      title="Cosmetic Page Preview" 
      targetUrl={targetUrl}
      isRevalidationEnabled={isRevalidationEnabled}
    >
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-12 pb-24">
        <section>
          <PreviewSeoPanel seo={seo} />
        </section>

        <section>
          <PreviewContentBlocks blocks={blocks} />
        </section>
      </div>
    </PreviewShell>
  );
}
