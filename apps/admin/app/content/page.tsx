import { businessEntries } from '@vavaw/brand-config';
import { getContentBlocks } from '@vavaw/db';
import { FileText, Lock, PlusCircle, Pencil } from 'lucide-react';
import Link from 'next/link';
import { getAdminDataSourceMode } from '../../lib/data-source';
import { getAdminServerSupabaseClient } from '../../lib/supabase-server';
import { getCurrentAdminProfile } from '../../lib/admin-profile';
import { canManageContentBlocks, canDeleteContentBlocks } from '@vavaw/auth';
import { DeleteContentBlockButton } from './DeleteContentBlockButton';

export default async function ContentPage() {
  const mode = getAdminDataSourceMode();

  let profile: { role: string; status: string } | null = null;
  if (mode === 'supabase') {
    profile = await getCurrentAdminProfile();
  }

  const isViewer = !profile || !canManageContentBlocks(profile.role as any);
  const canEdit = profile ? canManageContentBlocks(profile.role as any) : false;
  const canDelete = profile ? canDeleteContentBlocks(profile.role as any) : false;

  let blocks: Array<{
    id: string;
    siteKey: string;
    pagePath: string;
    blockType: string;
    sortOrder: number;
    isActive: boolean;
  }> = [];

  let queryError: string | null = null;

  if (mode === 'supabase') {
    try {
      const supabase = await getAdminServerSupabaseClient();
      const { data, error } = await getContentBlocks(supabase);

      if (error) {
        queryError = error.message || 'Failed to fetch content blocks from Supabase';
      } else if (data) {
        blocks = data.map((item) => ({
          id: item.id,
          siteKey: item.site_key,
          pagePath: item.page_path,
          blockType: item.block_type,
          sortOrder: item.sort_order,
          isActive: item.is_active,
        }));
      }
    } catch (err: any) {
      queryError = err?.message || 'Error connecting to Supabase';
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Website Content</h1>
          <p className="mt-1 text-sm text-slate-500">Manage rich text, sections, and marketing content blocks.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
            mode === 'supabase' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
          }`}>
            Data Source: {mode === 'supabase' ? 'Supabase' : 'Static Config'}
          </span>

          {mode === 'supabase' && canEdit && (
            <Link
              href="/content/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              Add Content Block
            </Link>
          )}
        </div>
      </div>

      {mode === 'static' && (
        <>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
            <Lock className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">Content block management requires Supabase mode.</h3>
            <p className="mt-2 text-sm text-slate-500 max-w-xl mx-auto">
              Set <code>NEXT_PUBLIC_ADMIN_AUTH_MODE=supabase</code> to enable full Content Block CRUD. Currently, the marketing content is statically defined in the frontend components.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white shadow rounded-lg border border-slate-200 p-6 opacity-75">
              <div className="flex items-center gap-3 mb-4 text-slate-400">
                <FileText className="h-5 w-5" />
                <h3 className="font-medium">Main Website Content</h3>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded w-full"></div>
                <div className="h-4 bg-slate-100 rounded w-5/6"></div>
              </div>
            </div>

            {businessEntries.map((entry) => (
              <div key={entry.id} className="bg-white shadow rounded-lg border border-slate-200 p-6 opacity-75">
                <div className="flex items-center gap-3 mb-4 text-slate-400">
                  <FileText className="h-5 w-5" />
                  <h3 className="font-medium">{entry.name} Content</h3>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-100 rounded w-full"></div>
                  <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {mode === 'supabase' && (
        <>
          {queryError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              <p className="font-semibold">Error Loading Supabase Data:</p>
              <p>{queryError}</p>
            </div>
          )}

          {!queryError && blocks.length === 0 && (
            <div className="p-8 text-center bg-white border border-slate-200 rounded-lg text-slate-500 text-sm">
              <div className="space-y-3">
                <p>No content blocks found in database.</p>
                {canEdit && (
                  <Link href="/content/new" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm">
                    <PlusCircle className="h-4 w-4" />
                    Create your first content block
                  </Link>
                )}
              </div>
            </div>
          )}

          {blocks.length > 0 && (
            <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Site Key</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Page Path</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Block Type</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Sort Order</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      {!isViewer && (
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {blocks.map((block) => (
                      <tr key={block.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                          {block.siteKey}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          <code className="bg-slate-100 text-slate-700 px-2 py-1 rounded">{block.pagePath}</code>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {block.blockType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {block.sortOrder}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            block.isActive ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {block.isActive ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        {!isViewer && (
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-3">
                              {canEdit && (
                                <Link
                                  href={`/content/${block.id}/edit`}
                                  className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                                >
                                  <Pencil className="h-4 w-4" />
                                  Edit
                                </Link>
                              )}
                              {canDelete && (
                                <DeleteContentBlockButton id={block.id} title={`${block.blockType} at ${block.pagePath}`} />
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
