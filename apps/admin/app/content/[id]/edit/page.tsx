import { redirect, notFound } from 'next/navigation';
import { canManageContentBlocks } from '@vavaw/auth';
import { getAdminDataSourceMode } from '../../../../lib/data-source';
import { getAdminServerSupabaseClient } from '../../../../lib/supabase-server';
import { getCurrentAdminProfile } from '../../../../lib/admin-profile';
import { ContentBlockForm } from '../../ContentBlockForm';

export default async function EditContentBlockPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mode = getAdminDataSourceMode();
  if (mode !== 'supabase') {
    redirect('/content');
  }

  const profile = await getCurrentAdminProfile();
  if (!profile || !canManageContentBlocks(profile.role)) {
    redirect('/content');
  }

  const supabase = await getAdminServerSupabaseClient();

  const { data: block } = await supabase
    .from('content_blocks')
    .select('*')
    .eq('id', id)
    .single();

  if (!block) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Edit Content Block</h1>
        <p className="mt-1 text-sm text-slate-500">
          Updating <code className="bg-slate-100 px-1 rounded text-slate-800">{block.block_type}</code> for <code className="bg-slate-100 px-1 rounded text-slate-800">{block.site_key}{block.page_path}</code>
        </p>
      </div>

      <ContentBlockForm initialData={block} isEdit />
    </div>
  );
}
