import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { AdminProfileForm } from '../../AdminProfileForm';
import { getAdminDataSourceMode } from '../../../../lib/data-source';
import { getAdminServerSupabaseClient } from '../../../../lib/supabase-server';
import { getCurrentAdminProfile } from '../../../../lib/admin-profile';
import { getAdminProfileById } from '@vavaw/db';
import { canManageAdminUsers } from '@vavaw/auth';

export const metadata: Metadata = {
  title: 'Edit Admin User | VAVAW',
};

interface EditAdminUserPageProps {
  params: { id: string };
}

export default async function EditAdminUserPage({ params }: EditAdminUserPageProps) {
  const mode = getAdminDataSourceMode();
  if (mode !== 'supabase') {
    redirect('/users');
  }

  const profile = await getCurrentAdminProfile();
  if (!profile || profile.status !== 'active') {
    redirect('/login?error=no-admin-profile');
  }

  if (!canManageAdminUsers(profile.role)) {
    redirect('/users?error=unauthorized');
  }

  const supabase = await getAdminServerSupabaseClient();
  const { data: adminProfile } = await getAdminProfileById(supabase, params.id);

  if (!adminProfile) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/users"
          className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Edit Admin User</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage roles and status for {adminProfile.email}
          </p>
        </div>
      </div>

      <AdminProfileForm initialData={adminProfile} isEdit />
    </div>
  );
}
