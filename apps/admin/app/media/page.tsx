import { businessEntries } from '@vavaw/brand-config';
import { getMediaAssets } from '@vavaw/db';
import { Info, Image as ImageIcon, ImagePlus, MonitorPlay } from 'lucide-react';
import { getAdminDataSourceMode } from '../../lib/data-source';
import { getAdminServerSupabaseClient } from '../../lib/supabase-server';

export default async function MediaPage() {
  const mode = getAdminDataSourceMode();
  let assets: Array<{
    id: string;
    siteKey: string;
    type: string;
    url: string;
    altText?: string;
    storageProvider: string;
  }> = [];

  let queryError: string | null = null;

  if (mode === 'supabase') {
    try {
      const supabase = await getAdminServerSupabaseClient();
      const { data, error } = await getMediaAssets(supabase);

      if (error) {
        queryError = error.message || 'Failed to fetch media assets from Supabase';
      } else if (data) {
        assets = data.map((item) => ({
          id: item.id,
          siteKey: item.site_key,
          type: item.type,
          url: item.url,
          altText: item.alt_text,
          storageProvider: item.storage_provider,
        }));
      }
    } catch (err: any) {
      queryError = err?.message || 'Error connecting to Supabase';
    }
  } else {
    // Generate static list from brand-config
    businessEntries.forEach((e) => {
      assets.push(
        { id: `${e.id}-hero`, siteKey: e.slug, type: 'hero-image', url: e.media.backgroundImage, storageProvider: 'static' },
        { id: `${e.id}-preview`, siteKey: e.slug, type: 'preview-image', url: e.media.previewImage, storageProvider: 'static' },
        { id: `${e.id}-og`, siteKey: e.slug, type: 'og-image', url: e.media.ogImage, storageProvider: 'static' }
      );
      if (e.media.introVideo) {
        assets.push({ id: `${e.id}-video`, siteKey: e.slug, type: 'video', url: e.media.introVideo, storageProvider: 'static' });
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Media Assets</h1>
          <p className="mt-1 text-sm text-slate-500">View and manage visual assets across the ecosystem.</p>
        </div>
        <div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
            mode === 'supabase' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
          }`}>
            Data Source: {mode === 'supabase' ? 'Supabase' : 'Static Config'}
          </span>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-blue-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Read-only media registry.</strong> Media uploading will be enabled in Phase 19.
            </p>
          </div>
        </div>
      </div>

      {queryError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <p className="font-semibold">Error Loading Supabase Data:</p>
          <p>{queryError}</p>
        </div>
      )}

      {!queryError && assets.length === 0 && (
        <div className="p-8 text-center bg-white border border-slate-200 rounded-lg text-slate-500 text-sm">
          No media assets found.
        </div>
      )}

      {assets.length > 0 && (
        <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Site Key / Context</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">URL / Path</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Alt Text</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Storage Provider</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {assets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {asset.siteKey}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {asset.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <code className="bg-slate-100 text-slate-700 px-2 py-1 rounded">{asset.url}</code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {asset.altText || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {asset.storageProvider}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
