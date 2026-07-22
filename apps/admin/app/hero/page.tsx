import Link from 'next/link';
import { Plus, Edit3, ImageIcon, AlertCircle } from 'lucide-react';
import { canManageHero, canDeleteHero } from '@vavaw/auth';
import { getSortedBusinessEntries } from '@vavaw/brand-config';
import { getHeroSlides, getBusinessEntries, getMediaAssets } from '@vavaw/db';
import { getAdminDataSourceMode } from '../../lib/data-source';
import { getAdminServerSupabaseClient } from '../../lib/supabase-server';
import { getCurrentAdminProfile } from '../../lib/admin-profile';
import { DeleteHeroButton } from './DeleteHeroButton';

export default async function HeroPage() {
  const mode = getAdminDataSourceMode();
  const profile = await getCurrentAdminProfile();

  const isSupabaseMode = mode === 'supabase';
  const canManage = profile ? canManageHero(profile.role) : false;
  const canDelete = profile ? canDeleteHero(profile.role) : false;

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
    backgroundMediaUrl?: string;
    previewMediaId?: string;
    previewMediaUrl?: string;
    businessName?: string;
  }> = [];

  let queryError: string | null = null;

  if (isSupabaseMode) {
    try {
      const supabase = await getAdminServerSupabaseClient();
      const { data: slidesData, error: slidesError } = await getHeroSlides(supabase);
      const { data: businessData } = await getBusinessEntries(supabase);
      const { data: mediaData } = await getMediaAssets(supabase);

      if (slidesError) {
        queryError = slidesError.message || 'Failed to fetch hero slides from Supabase';
      } else if (slidesData) {
        const businessMap = new Map(businessData?.map((b) => [b.id, b.name]));
        const mediaMap = new Map(mediaData?.map((m) => [m.id, m.url]));

        slides = slidesData.map((slide) => {
          const bgUrl = slide.background_media_id ? mediaMap.get(slide.background_media_id) || (slide.background_media_id.startsWith('http') || slide.background_media_id.startsWith('/') ? slide.background_media_id : undefined) : undefined;
          const prevUrl = slide.preview_media_id ? mediaMap.get(slide.preview_media_id) || (slide.preview_media_id.startsWith('http') || slide.preview_media_id.startsWith('/') ? slide.preview_media_id : undefined) : undefined;

          return {
            id: slide.id,
            title: slide.title,
            subtitle: slide.subtitle,
            description: slide.description,
            status: slide.status,
            sortOrder: slide.sort_order,
            ctaLabel: slide.cta_label,
            redirectPath: slide.redirect_path,
            backgroundMediaId: slide.background_media_id,
            backgroundMediaUrl: bgUrl,
            previewMediaId: slide.preview_media_id,
            previewMediaUrl: prevUrl,
            businessName: slide.business_entry_id ? businessMap.get(slide.business_entry_id) : undefined,
          };
        });
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
      previewMediaUrl: entry.media.previewImage,
      backgroundMediaId: entry.media.backgroundImage,
      backgroundMediaUrl: entry.media.backgroundImage,
    }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hero Slides</h1>
          <p className="mt-1 text-sm text-slate-500">Manage main homepage slider content.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
            isSupabaseMode ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
          }`}>
            Data Source: {isSupabaseMode ? 'Supabase' : 'Static Config'}
          </span>
          {isSupabaseMode && canManage && (
            <Link
              href="/hero/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md shadow transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Create Hero Slide</span>
            </Link>
          )}
        </div>
      </div>

      {!isSupabaseMode && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-amber-600" />
          <span>CRUD operations are disabled in mock mode. Switch to Supabase mode to enable management actions.</span>
        </div>
      )}

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
              <div className="md:w-1/3 bg-slate-900 border-r border-slate-200 relative min-h-[220px] flex items-center justify-center p-4 overflow-hidden">
                {slide.backgroundMediaUrl ? (
                  <img src={slide.backgroundMediaUrl} alt={slide.title} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                ) : null}

                <div className="relative z-10 flex flex-col items-center text-slate-200 text-center bg-slate-950/70 p-3 rounded-lg backdrop-blur-sm border border-slate-800 max-w-[90%]">
                  <ImageIcon className="h-8 w-8 mb-2 text-indigo-400" />
                  <span className="text-[11px] font-mono text-slate-300 truncate w-full">BG: {slide.backgroundMediaId || 'None'}</span>
                  <span className="text-[11px] font-mono text-slate-400 truncate w-full mt-0.5">Preview: {slide.previewMediaId || 'None'}</span>
                </div>
              </div>
              
              <div className="p-6 md:w-2/3 flex flex-col justify-between">
                <div>
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
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
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

                {isSupabaseMode && (canManage || canDelete) && (
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                    {canManage && (
                      <Link
                        href={`/hero/${slide.id}/edit`}
                        className="text-blue-600 hover:text-blue-900 font-medium text-sm inline-flex items-center gap-1"
                      >
                        <Edit3 className="h-4 w-4" />
                        <span>Edit</span>
                      </Link>
                    )}
                    {canDelete && <DeleteHeroButton id={slide.id} title={slide.title} />}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
