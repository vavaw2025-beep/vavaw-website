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

export default async function MediaPage(props: { searchParams?: Promise<{ filter?: string }> | { filter?: string } }) {
  // Handle both Next.js 14 and 15+ searchParams patterns
  const params = props.searchParams instanceof Promise ? await props.searchParams : (props.searchParams || {});
  const filter = params.filter || 'all';

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
    mimeType?: string;
    sizeBytes?: number;
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
          mimeType: item.mime_type,
          sizeBytes: item.size_bytes,
        }));
      }
    } catch (err: any) {
      queryError = err?.message || 'Error connecting to Supabase';
    }
  } else {
    businessEntries.forEach((e) => {
      assets.push(
        { id: `${e.id}-hero`, siteKey: e.slug, type: 'image', url: e.media.backgroundImage, storageProvider: 'static' },
        { id: `${e.id}-preview`, siteKey: e.slug, type: 'image', url: e.media.previewImage, storageProvider: 'static' },
        { id: `${e.id}-og`, siteKey: e.slug, type: 'image', url: e.media.ogImage, storageProvider: 'static' }
      );
      if (e.media.introVideo) {
        assets.push({ id: `${e.id}-video`, siteKey: e.slug, type: 'video', url: e.media.introVideo, storageProvider: 'static' });
      }
    });
  }

  const filteredAssets = assets.filter(asset => {
    if (filter === 'image') return asset.type !== 'video' && asset.mimeType?.startsWith('image') !== false;
    if (filter === 'video') return asset.type === 'video' || asset.mimeType?.startsWith('video') === true;
    return true;
  });

  const formatSize = (bytes?: number) => {
    if (!bytes) return '-';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const isVideoAsset = (asset: any) => asset.type === 'video' || asset.mimeType?.startsWith('video');

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
        canUpload && (
          <div className="space-y-4">
            <MediaUploadForm />
            
            <details className="bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 overflow-hidden">
              <summary className="px-4 py-3 font-medium cursor-pointer flex items-center gap-2 hover:bg-slate-100 transition-colors select-none">
                <ImageIcon className="w-4 h-4 text-slate-500" />
                Recommended launch image sizes & tips
              </summary>
              <div className="px-4 pb-4 pt-1 space-y-4 border-t border-slate-200 mt-1">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2 mt-2">Recommended Sizes</h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
                    <li><strong>Main Hero:</strong> 2400x1600 or 2560x1440, 16:9 or 3:2, cinematic horizontal image with space for text.</li>
                    <li><strong>Cosmetic Preview:</strong> 1600x2000 or 1500x2000, 4:5 or 3:4, portrait image for main preview/card.</li>
                    <li><strong>Beauty Preview:</strong> 1600x2000, 4:5 or 3:4, spa/interior/wellness mood.</li>
                    <li><strong>Franchise Preview:</strong> 1600x2000, 4:5 or 3:4, business/luxury/architecture mood.</li>
                    <li><strong>Cosmetic Product Editorial:</strong> 1800x2400 or 1600x2000, 4:5 or 3:4, bright clean product/editorial image.</li>
                    <li><strong>Cosmetic Texture Ritual:</strong> 1600x1200 or 1600x1600, 4:3 or 1:1, texture/formula/ritual close-up.</li>
                    <li><strong>Cosmetic Clean Promise:</strong> 1600x1200 or 1600x1600, 4:3 or 1:1, ingredient/natural/clean beauty image.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Preparation Tips</h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
                    <li>WEBP or JPG recommended.</li>
                    <li>Keep images under 1.5MB when possible.</li>
                    <li>System max image size is 5MB.</li>
                    <li>Do not place important text inside images.</li>
                    <li>Keep the subject near the center so cropping works on desktop and mobile.</li>
                    <li>Avoid watermark, unclear license, and cheap stock-looking images.</li>
                  </ul>
                </div>
              </div>
            </details>
          </div>
        )
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
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <h3 className="text-sm font-semibold text-slate-700">Registered Media</h3>
              <div className="flex bg-slate-200 p-1 rounded-md text-xs">
                <a href="/media" className={`px-3 py-1.5 rounded-sm transition-colors ${filter === 'all' ? 'bg-white shadow font-medium text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}>All</a>
                <a href="/media?filter=image" className={`px-3 py-1.5 rounded-sm transition-colors ${filter === 'image' ? 'bg-white shadow font-medium text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}>Images</a>
                <a href="/media?filter=video" className={`px-3 py-1.5 rounded-sm transition-colors ${filter === 'video' ? 'bg-white shadow font-medium text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}>Videos</a>
              </div>
            </div>
            <span className="text-xs text-slate-500">{filteredAssets.length} items</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Preview</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Site Key / Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Details</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">URL</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredAssets.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                      No assets found matching the selected filter.
                    </td>
                  </tr>
                )}
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-20 h-14 bg-slate-100 rounded border border-slate-200 overflow-hidden flex items-center justify-center relative group">
                        {isVideoAsset(asset) ? (
                          <video src={asset.url} preload="metadata" className="w-full h-full object-cover" />
                        ) : (
                          <img src={asset.url} alt={asset.altText || ''} className="w-full h-full object-cover" />
                        )}
                        {isVideoAsset(asset) && (
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <MonitorPlay className="w-6 h-6 text-white opacity-80" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{asset.siteKey}</div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${isVideoAsset(asset) ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                          {asset.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs text-slate-600 font-mono">{asset.mimeType || '-'}</div>
                      <div className="text-xs text-slate-500 mt-1">{formatSize(asset.sizeBytes)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="bg-slate-100 text-slate-700 px-2 py-1 rounded max-w-xs truncate inline-block align-middle text-xs" title={asset.url}>
                        {asset.url}
                      </code>
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
