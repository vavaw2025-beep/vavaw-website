import { redirect, notFound } from 'next/navigation';
import { canManageBusiness } from '@vavaw/auth';
import { getAdminDataSourceMode } from '../../../../lib/data-source';
import { getAdminServerSupabaseClient } from '../../../../lib/supabase-server';
import { getCurrentAdminProfile } from '../../../../lib/admin-profile';
import { BusinessForm } from '../../BusinessForm';

export default async function EditBusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mode = getAdminDataSourceMode();
  if (mode !== 'supabase') {
    redirect('/business');
  }

  const profile = await getCurrentAdminProfile();
  if (!profile || !canManageBusiness(profile.role)) {
    redirect('/business');
  }

  const supabase = await getAdminServerSupabaseClient();
  const { data: entry } = await supabase
    .from('business_entries')
    .select('*')
    .eq('id', id)
    .single();

  if (!entry) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Edit Business Entry</h1>
        <p className="mt-1 text-sm text-slate-500">Update configuration for {entry.name}.</p>
      </div>

      <BusinessForm initialData={entry} isEdit />
    </div>
  );
}
