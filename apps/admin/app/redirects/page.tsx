import { businessEntries } from '@vavaw/brand-config';
import { getRedirects } from '@vavaw/db';
import { ArrowRight } from 'lucide-react';
import { getAdminDataSourceMode } from '../../lib/data-source';
import { getAdminServerSupabaseClient } from '../../lib/supabase-server';

export default async function RedirectsPage() {
  const mode = getAdminDataSourceMode();
  let redirectsList: Array<{
    id: string;
    sourcePath: string;
    destinationUrl: string;
    type: string;
    isActive: boolean;
  }> = [];

  let queryError: string | null = null;

  if (mode === 'supabase') {
    try {
      const supabase = await getAdminServerSupabaseClient();
      const { data, error } = await getRedirects(supabase);

      if (error) {
        queryError = error.message || 'Failed to fetch redirects from Supabase';
      } else if (data) {
        redirectsList = data.map((item) => ({
          id: item.id,
          sourcePath: item.source_path,
          destinationUrl: item.destination_url,
          type: item.type,
          isActive: item.is_active,
        }));
      }
    } catch (err: any) {
      queryError = err?.message || 'Error connecting to Supabase';
    }
  } else {
    redirectsList = businessEntries.map((e) => ({
      id: e.id,
      sourcePath: e.redirectPath,
      destinationUrl: e.href,
      type: e.navigationType === 'internal' ? 'temporary' : 'permanent',
      isActive: e.status === 'active' || e.status === 'coming-soon',
    }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Routing & Redirects</h1>
          <p className="mt-1 text-sm text-slate-500">Manage internal navigation and external app links.</p>
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

      {!queryError && redirectsList.length === 0 && (
        <div className="p-8 text-center bg-white border border-slate-200 rounded-lg text-slate-500 text-sm">
          No redirects found.
        </div>
      )}

      {redirectsList.length > 0 && (
        <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
          <div className="px-4 py-5 border-b border-slate-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-slate-900">Redirect Map</h3>
            <p className="mt-1 text-sm text-slate-500">Read-only mapping of internal paths to final destinations.</p>
          </div>
          
          <ul role="list" className="divide-y divide-slate-200">
            {redirectsList.map((item) => (
              <li key={item.id} className="p-4 sm:px-6 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.isActive ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {item.isActive ? 'Active' : 'Disabled'}
                      </span>
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        {item.type}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm mt-3 bg-slate-50 p-3 rounded border border-slate-200 overflow-x-auto">
                      <code className="text-slate-600 bg-white px-2 py-1 rounded border border-slate-200 whitespace-nowrap">
                        {item.sourcePath}
                      </code>
                      <ArrowRight className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <code className="text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 whitespace-nowrap">
                        {item.destinationUrl}
                      </code>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
