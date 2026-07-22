import { redirect } from 'next/navigation';
import { canManageContentBlocks } from '@vavaw/auth';
import { getAdminDataSourceMode } from '../../../lib/data-source';
import { getCurrentAdminProfile } from '../../../lib/admin-profile';
import { ContentBlockForm } from '../ContentBlockForm';

export default async function NewContentBlockPage() {
  const mode = getAdminDataSourceMode();
  if (mode !== 'supabase') {
    redirect('/content');
  }

  const profile = await getCurrentAdminProfile();
  if (!profile || !canManageContentBlocks(profile.role)) {
    redirect('/content');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Create Content Block</h1>
        <p className="mt-1 text-sm text-slate-500">Add a new flexible content block to a specific page.</p>
      </div>

      <ContentBlockForm />
    </div>
  );
}
