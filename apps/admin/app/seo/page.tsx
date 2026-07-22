import { businessEntries } from '@vavaw/brand-config';
import { getSeoSettings } from '@vavaw/db';
import { AlertTriangle } from 'lucide-react';
import { getAdminDataSourceMode } from '../../lib/data-source';
import { getAdminServerSupabaseClient } from '../../lib/supabase-server';

export default async function SeoPage() {
  const mode = getAdminDataSourceMode();
  let seoItems: Array<{
    id: string;
    siteKey: string;
    path: string;
    title: string;
    description?: string;
    canonicalUrl?: string;
    keywords?: string[];
    robotsIndex: boolean;
    robotsFollow: boolean;
  }> = [];

  let queryError: string | null = null;

  if (mode === 'supabase') {
    try {
      const supabase = await getAdminServerSupabaseClient();
      const { data, error } = await getSeoSettings(supabase);

      if (error) {
        queryError = error.message || 'Failed to fetch SEO settings from Supabase';
      } else if (data) {
        seoItems = data.map((item) => ({
          id: item.id,
          siteKey: item.site_key,
          path: item.path,
          title: item.title,
          description: item.description,
          canonicalUrl: item.canonical_url,
          keywords: item.keywords,
          robotsIndex: item.robots_index,
          robotsFollow: item.robots_follow,
        }));
      }
    } catch (err: any) {
      queryError = err?.message || 'Error connecting to Supabase';
    }
  } else {
    seoItems = businessEntries.map((e) => ({
      id: e.id,
      siteKey: e.slug,
      path: e.href,
      title: e.seo.title,
      description: e.seo.description,
      canonicalUrl: e.seo.canonicalUrl,
      keywords: e.seo.keywords,
      robotsIndex: true,
      robotsFollow: true,
    }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">SEO Settings</h1>
          <p className="mt-1 text-sm text-slate-500">Manage global SEO metadata and OpenGraph tags.</p>
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

      {!queryError && seoItems.length === 0 && (
        <div className="p-8 text-center bg-white border border-slate-200 rounded-lg text-slate-500 text-sm">
          No SEO settings found.
        </div>
      )}

      {seoItems.length > 0 && (
        <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Site Key & Path</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title & Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Robots & Canonical</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Keywords</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {seoItems.map((item) => {
                  const missingFields = [];
                  if (!item.title) missingFields.push('Title');
                  if (!item.description) missingFields.push('Description');
                  if (!item.canonicalUrl) missingFields.push('Canonical');

                  return (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 align-top">
                        <div className="text-sm font-medium text-slate-900">{item.siteKey}</div>
                        <code className="text-xs text-slate-500 bg-slate-100 px-1 py-0.5 rounded block mt-1">{item.path}</code>
                        {missingFields.length > 0 && (
                          <div className="mt-2 flex items-start text-amber-600 text-xs bg-amber-50 p-2 rounded border border-amber-200">
                            <AlertTriangle className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span>Missing: {missingFields.join(', ')}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="mb-2">
                          <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">Title</span>
                          <div className="text-sm text-slate-900 font-medium">{item.title || <span className="text-slate-400 italic">None</span>}</div>
                        </div>
                        <div>
                          <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">Description</span>
                          <div className="text-xs text-slate-600 line-clamp-3" title={item.description}>{item.description || <span className="text-slate-400 italic">None</span>}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="mb-2">
                          <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">Robots</span>
                          <div className="flex gap-1.5 text-xs">
                            <span className={`px-2 py-0.5 rounded font-semibold ${item.robotsIndex ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {item.robotsIndex ? 'index' : 'noindex'}
                            </span>
                            <span className={`px-2 py-0.5 rounded font-semibold ${item.robotsFollow ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'}`}>
                              {item.robotsFollow ? 'follow' : 'nofollow'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">Canonical URL</span>
                          <code className="text-xs text-blue-600 bg-blue-50 px-1 py-0.5 rounded break-all">{item.canonicalUrl || 'None'}</code>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="flex flex-wrap gap-1">
                          {item.keywords && item.keywords.length > 0 ? (
                            item.keywords.map((kw) => (
                              <span key={kw} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                {kw}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400 italic">No keywords defined</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
