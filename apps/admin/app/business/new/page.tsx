import { redirect } from 'next/navigation';
import { canManageBusiness } from '@vavaw/auth';
import { getAdminDataSourceMode } from '../../../lib/data-source';
import { getCurrentAdminProfile } from '../../../lib/admin-profile';
import { BusinessForm } from '../BusinessForm';

export default async function NewBusinessPage() {
  const mode = getAdminDataSourceMode();
  if (mode !== 'supabase') {
    redirect('/business');
  }

  const profile = await getCurrentAdminProfile();
  if (!profile || !canManageBusiness(profile.role)) {
    redirect('/business');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Create Business Entry</h1>
        <p className="mt-1 text-sm text-slate-500">Add a new brand entry to the ecosystem database.</p>
      </div>

      <BusinessForm />
    </div>
  );
}
