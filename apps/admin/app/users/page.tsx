import { MOCK_ADMIN_USER, ADMIN_ROLES, canManageAdminUsers } from '@vavaw/auth';
import { Users as UsersIcon, Shield, Info, Plus, Edit } from 'lucide-react';
import Link from 'next/link';
import { getAdminDataSourceMode } from '../../lib/data-source';
import { getAdminServerSupabaseClient } from '../../lib/supabase-server';
import { getCurrentAdminProfile } from '../../lib/admin-profile';
import { getAdminProfiles, AdminProfileRecord } from '@vavaw/db';
import { DisableUserButton } from './DisableUserButton';
import { redirect } from 'next/navigation';

export default async function UsersPage() {
  const mode = getAdminDataSourceMode();
  let users: any[] = [MOCK_ADMIN_USER];
  let isOwner = false;
  let hasAccess = false;

  if (mode === 'supabase') {
    const profile = await getCurrentAdminProfile();
    if (!profile || profile.status !== 'active') {
      redirect('/login?error=no-admin-profile');
    }

    if (profile.role === 'owner' || profile.role === 'admin') {
      hasAccess = true;
      if (profile.role === 'owner') {
        isOwner = true;
      }
      
      const supabase = await getAdminServerSupabaseClient();
      const { data, error } = await getAdminProfiles(supabase);
      
      if (error) {
        console.error('Failed to load admin profiles:', error);
      } else if (data) {
        users = data;
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <p className="mt-1 text-sm text-slate-500">Manage admin users and role assignments.</p>
        </div>

        {mode === 'supabase' && isOwner && (
          <Link
            href="/users/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add User
          </Link>
        )}
      </div>

      {/* Info banner */}
      {mode !== 'supabase' ? (
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Mock data only</p>
            <p className="text-sm text-blue-700 mt-0.5">
              User management will be connected to Supabase Auth in a future phase.
              The data below is placeholder only.
            </p>
          </div>
        </div>
      ) : !hasAccess ? (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <Info className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-900">Restricted Access</p>
            <p className="text-sm text-amber-700 mt-0.5">
              You do not have permission to view the users list. Owner or Admin role required.
            </p>
          </div>
        </div>
      ) : null}

      {/* Users table */}
      {(mode !== 'supabase' || hasAccess) && (
        <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-slate-200 flex items-center gap-3">
            <div className="bg-slate-100 p-2 rounded-lg">
              <UsersIcon className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-slate-900">Admin Users</h3>
              <p className="text-sm text-slate-500">{users.length} user(s) registered</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name / Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  {mode === 'supabase' && isOwner && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-white">
                            {user.full_name 
                              ? user.full_name.split(' ').map((n: string) => n[0]).join('')
                              : (user.name ? user.name.split(' ').map((n: string) => n[0]).join('') : user.email[0].toUpperCase())}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {user.full_name || user.name || 'Unnamed User'}
                          </p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <Shield className="h-3 w-3" />
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : user.status === 'invited'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    {mode === 'supabase' && isOwner && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-3">
                          <Link
                            href={`/users/${user.id}/edit`}
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-500 transition-colors"
                          >
                            <Edit className="h-3 w-3" />
                            Edit
                          </Link>
                          {user.status === 'active' && (
                            <DisableUserButton userId={user.id} />
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

      {/* Planned Roles */}
      <div className="bg-white shadow rounded-lg border border-slate-200">
        <div className="px-4 py-5 sm:px-6 border-b border-slate-200">
          <h3 className="text-lg font-medium text-slate-900">Role Permissions</h3>
          <p className="text-sm text-slate-500 mt-1">Current role hierarchy enforced by Row Level Security.</p>
        </div>
        <ul role="list" className="divide-y divide-slate-200">
          {ADMIN_ROLES.map((role) => (
            <li key={role} className="px-4 py-3 sm:px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-900 capitalize">{role}</span>
              </div>
              <span className="text-xs text-slate-500">
                {role === 'owner' && 'Full access — manage everything including users'}
                {role === 'admin' && 'Manage content, media, SEO, business entries, and view users'}
                {role === 'editor' && 'Manage content, media, SEO, hero slides'}
                {role === 'viewer' && 'Read-only dashboard access'}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
