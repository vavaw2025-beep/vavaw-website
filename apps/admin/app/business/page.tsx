import Link from 'next/link';
import { Plus, Edit3, AlertCircle } from 'lucide-react';
import { canManageBusiness, canDeleteBusiness } from '@vavaw/auth';
import { businessEntries } from '@vavaw/brand-config';
import { getBusinessEntries } from '@vavaw/db';
import { getAdminDataSourceMode } from '../../lib/data-source';
import { getAdminServerSupabaseClient } from '../../lib/supabase-server';
import { getCurrentAdminProfile } from '../../lib/admin-profile';
import { DeleteBusinessButton } from './DeleteBusinessButton';

export default async function BusinessPage() {
  const mode = getAdminDataSourceMode();
  const profile = await getCurrentAdminProfile();

  const isSupabaseMode = mode === 'supabase';
  const canManage = profile ? canManageBusiness(profile.role) : false;
  const canDelete = profile ? canDeleteBusiness(profile.role) : false;

  let entries: Array<{
    id: string;
    slug: string;
    name: string;
    category: string;
    status: string;
    navigationType: string;
    sortOrder: number;
    ctaLabel?: string;
    redirectPath: string;
  }> = [];

  let queryError: string | null = null;

  if (isSupabaseMode) {
    try {
      const supabase = await getAdminServerSupabaseClient();
      const { data, error } = await getBusinessEntries(supabase);

      if (error) {
        queryError = error.message || 'Failed to fetch business entries from Supabase';
      } else if (data) {
        entries = data.map((item) => ({
          id: item.id,
          slug: item.slug,
          name: item.name,
          category: item.category,
          status: item.status,
          navigationType: item.navigation_type,
          sortOrder: item.sort_order,
          ctaLabel: item.cta_label,
          redirectPath: item.redirect_path,
        }));
      }
    } catch (err: any) {
      queryError = err?.message || 'Error connecting to Supabase';
    }
  } else {
    entries = businessEntries.map((entry) => ({
      id: entry.id,
      slug: entry.slug,
      name: entry.name,
      category: entry.category,
      status: entry.status,
      navigationType: entry.navigationType,
      sortOrder: entry.sortOrder,
      ctaLabel: entry.ctaLabel,
      redirectPath: entry.redirectPath,
    }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Business Entries</h1>
          <p className="mt-1 text-sm text-slate-500">View and manage configured business brands in the ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
            isSupabaseMode ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
          }`}>
            Data Source: {isSupabaseMode ? 'Supabase' : 'Static Config'}
          </span>
          {isSupabaseMode && canManage && (
            <Link
              href="/business/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md shadow transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Create Business</span>
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

      {!queryError && entries.length === 0 && (
        <div className="p-8 text-center bg-white border border-slate-200 rounded-lg text-slate-500 text-sm">
          No business entries found.
        </div>
      )}

      {entries.length > 0 && (
        <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Business</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Order</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">CTA & Redirect</th>
                  {isSupabaseMode && (canManage || canDelete) && (
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{entry.name}</div>
                      <div className="text-sm text-slate-500">/{entry.slug} &bull; {entry.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        entry.status === 'active' ? 'bg-green-100 text-green-800' :
                        entry.status === 'coming-soon' ? 'bg-yellow-100 text-yellow-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        entry.navigationType === 'internal' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {entry.navigationType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {entry.sortOrder}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <div>{entry.ctaLabel || '-'}</div>
                      <code className="text-xs text-slate-600 bg-slate-100 px-1 rounded block mt-1">→ {entry.redirectPath}</code>
                    </td>
                    {isSupabaseMode && (canManage || canDelete) && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        {canManage && (
                          <Link
                            href={`/business/${entry.id}/edit`}
                            className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                          >
                            <Edit3 className="h-4 w-4" />
                            <span>Edit</span>
                          </Link>
                        )}
                        {canDelete && <DeleteBusinessButton id={entry.id} name={entry.name} />}
                      </td>
                    )}
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
