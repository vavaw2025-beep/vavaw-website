import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { AdminProfileForm } from '../AdminProfileForm';
import { getCurrentAdminProfile } from '../../../lib/admin-profile';
import { canManageAdminUsers } from '@vavaw/auth';

export const metadata: Metadata = {
  title: 'Add New Admin User | VAVAW',
};

export default async function NewAdminUserPage() {
  const profile = await getCurrentAdminProfile();

  if (!profile || profile.status !== 'active') {
    redirect('/login?error=no-admin-profile');
  }

  if (!canManageAdminUsers(profile.role)) {
    redirect('/users?error=unauthorized');
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
          <h1 className="text-2xl font-bold text-white tracking-tight">Add New Admin User</h1>
          <p className="text-sm text-slate-400 mt-1">
            Register a new admin profile. Note: the user must first be created in Supabase Auth.
          </p>
        </div>
      </div>

      <AdminProfileForm />
    </div>
  );
}
