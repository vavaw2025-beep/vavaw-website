import { businessEntries } from '@vavaw/brand-config';
import { getMediaAssets } from '@vavaw/db';
import { canManageContent, canManageSettings } from '@vavaw/auth';
import { Info, Image as ImageIcon, ImagePlus, MonitorPlay, AlertCircle } from 'lucide-react';
import { getAdminDataSourceMode } from '../../lib/data-source';
import { getAdminServerSupabaseClient } from '../../lib/supabase-server';
import { getCurrentAdminProfile } from '../../lib/admin-profile';
import { MediaUploadForm } from './MediaUploadForm';
import { CopyUrlButton } from './CopyUrlButton';
import { DeleteMediaButton } from './DeleteMediaButton';

export default async function MediaPage() {
  const mode = getAdminDataSourceMode();
  const profile = await getCurrentAdminProfile();

  const isSupabaseMode = mode === 'supabase';
  const canUpload = profile ? canManageContent(profile.role) : false;
  const canDelete = profile ? canManageSettings(profile.role) : false;

  let assets: Array<{
    id: string;
    siteKey: string;
    type: string;
    url: string;
    altText?: string;
    storageProvider: string;
  }> = [];

  let queryError: string | null = null;

  if (isSupabaseMode) {
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
          <p className="mt-1 text-sm text-slate-500">View and upload visual assets across the ecosystem.</p>
        </div>
        <div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
            isSupabaseMode ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
          }`}>
            Data Source: {isSupabaseMode ? 'Supabase' : 'Static Config'}
          </span>
        </div>
      </div>

      {!isSupabaseMode ? (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-amber-600" />
          <span>Upload requires Supabase mode. Switch to Supabase mode to enable file uploads to Storage.</span>
        </div>
      ) : (
        canUpload && <MediaUploadForm />
      )}

      {queryError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <p className="font-semibold">Error Loading Supabase Data:</p>
          <p>{queryError}</p>
        </div>
      )}

      {!queryError && assets.length === 0 && (
        <div className="p-8 text-center bg-white border border-slate-200 rounded-lg text-slate-500 text-sm">
          No media assets registered in database.
        </div>
      )}

      {assets.length > 0 && (
        <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-slate-700">Registered Media Registry</h3>
            <span className="text-xs text-slate-500">{assets.length} items</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Site Key</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">URL / Path</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Alt Text</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Provider</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
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
                      <code className="bg-slate-100 text-slate-700 px-2 py-1 rounded max-w-xs truncate inline-block align-middle" title={asset.url}>
                        {asset.url}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {asset.altText || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        asset.storageProvider === 'supabase' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {asset.storageProvider}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <CopyUrlButton url={asset.url} />
                      {isSupabaseMode && canDelete && <DeleteMediaButton id={asset.id} url={asset.url} />}
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
