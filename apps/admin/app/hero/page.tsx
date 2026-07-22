import { getSortedBusinessEntries } from '@vavaw/brand-config';
import { getHeroSlides, getBusinessEntries } from '@vavaw/db';
import { ImageIcon } from 'lucide-react';
import { getAdminDataSourceMode } from '../../lib/data-source';
import { getAdminServerSupabaseClient } from '../../lib/supabase-server';

export default async function HeroPage() {
  const mode = getAdminDataSourceMode();
  let slides: Array<{
    id: string;
    title: string;
    subtitle?: string;
    description?: string;
    status: string;
    sortOrder: number;
    ctaLabel?: string;
    redirectPath?: string;
    backgroundMediaId?: string;
    previewMediaId?: string;
    businessName?: string;
  }> = [];

  let queryError: string | null = null;

  if (mode === 'supabase') {
    try {
      const supabase = await getAdminServerSupabaseClient();
      const { data: slidesData, error: slidesError } = await getHeroSlides(supabase);
      const { data: businessData } = await getBusinessEntries(supabase);

      if (slidesError) {
        queryError = slidesError.message || 'Failed to fetch hero slides from Supabase';
      } else if (slidesData) {
        const businessMap = new Map(businessData?.map((b) => [b.id, b.name]));

        slides = slidesData.map((slide) => ({
          id: slide.id,
          title: slide.title,
          subtitle: slide.subtitle,
          description: slide.description,
          status: slide.status,
          sortOrder: slide.sort_order,
          ctaLabel: slide.cta_label,
          redirectPath: slide.redirect_path,
          backgroundMediaId: slide.background_media_id,
          previewMediaId: slide.preview_media_id,
          businessName: slide.business_entry_id ? businessMap.get(slide.business_entry_id) : undefined,
        }));
      }
    } catch (err: any) {
      queryError = err?.message || 'Error connecting to Supabase';
    }
  } else {
    const staticEntries = getSortedBusinessEntries();
    slides = staticEntries.map((entry) => ({
      id: entry.id,
      title: entry.title,
      subtitle: entry.subtitle,
      description: entry.description,
      status: entry.status,
      sortOrder: entry.sortOrder,
      ctaLabel: entry.ctaLabel,
      redirectPath: entry.redirectPath,
      businessName: entry.name,
      previewMediaId: entry.media.previewImage,
      backgroundMediaId: entry.media.backgroundImage,
    }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hero Slides</h1>
          <p className="mt-1 text-sm text-slate-500">Manage main homepage slider content.</p>
        </div>
        <div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
            mode === 'supabase' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
          }`}>
            Data Source: {mode === 'supabase' ? 'Supabase' : 'Static Config'}
          </span>
        </div>
      </div>

      {queryError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <p className="font-semibold">Error Loading Supabase Data:</p>
          <p>{queryError}</p>
        </div>
      )}

      {!queryError && slides.length === 0 && (
        <div className="p-8 text-center bg-white border border-slate-200 rounded-lg text-slate-500 text-sm">
          No hero slides found.
        </div>
      )}

      {slides.length > 0 && (
        <div className="space-y-6">
          {slides.map((slide) => (
            <div key={slide.id} className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden flex flex-col md:flex-row">
              <div className="md:w-1/3 bg-slate-100 border-r border-slate-200 relative min-h-[200px] flex items-center justify-center p-4">
                <div className="relative z-10 flex flex-col items-center text-slate-500 text-center">
                  <ImageIcon className="h-10 w-10 mb-2 text-slate-400" />
                  <span className="text-xs font-mono text-slate-600">BG: {slide.backgroundMediaId || 'None'}</span>
                  <span className="text-xs font-mono text-slate-600 mt-1">Preview: {slide.previewMediaId || 'None'}</span>
                </div>
              </div>
              
              <div className="p-6 md:w-2/3">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    {slide.businessName && (
                      <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 block mb-1">
                        {slide.businessName}
                      </span>
                    )}
                    <h2 className="text-xl font-bold text-slate-900">{slide.title}</h2>
                    {slide.subtitle && <p className="text-sm font-medium text-blue-600 mt-1">{slide.subtitle}</p>}
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    slide.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {slide.status}
                  </span>
                </div>
                
                {slide.description && <p className="text-slate-600 text-sm mb-6">{slide.description}</p>}
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">Order</span>
                    <span className="text-slate-900">{slide.sortOrder}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">CTA Label</span>
                    <span className="text-slate-900">{slide.ctaLabel || '-'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">Redirect Path</span>
                    <code className="text-slate-700 bg-slate-100 px-2 py-1 rounded">{slide.redirectPath || '-'}</code>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
