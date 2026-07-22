import { MOCK_ADMIN_USER, ADMIN_ROLES } from '@vavaw/auth';
import { Users as UsersIcon, Shield, Info } from 'lucide-react';

export default function UsersPage() {
  const mockUsers = [MOCK_ADMIN_USER];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Users</h1>
        <p className="mt-1 text-sm text-slate-500">Manage admin users and role assignments.</p>
      </div>

      {/* Info banner */}
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

      {/* Users table */}
      <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-slate-200 flex items-center gap-3">
          <div className="bg-slate-100 p-2 rounded-lg">
            <UsersIcon className="h-5 w-5 text-slate-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-slate-900">Admin Users</h3>
            <p className="text-sm text-slate-500">{mockUsers.length} user(s) registered</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {mockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-slate-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.email}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Planned Roles */}
      <div className="bg-white shadow rounded-lg border border-slate-200">
        <div className="px-4 py-5 sm:px-6 border-b border-slate-200">
          <h3 className="text-lg font-medium text-slate-900">Planned Roles</h3>
          <p className="text-sm text-slate-500 mt-1">Role hierarchy that will be enforced when Supabase Auth is connected.</p>
        </div>
        <ul role="list" className="divide-y divide-slate-200">
          {ADMIN_ROLES.map((role) => (
            <li key={role} className="px-4 py-3 sm:px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-900 capitalize">{role}</span>
              </div>
              <span className="text-xs text-slate-500">
                {role === 'owner' && 'Full access — manage everything'}
                {role === 'admin' && 'Manage content, users, and settings'}
                {role === 'editor' && 'Create and edit content only'}
                {role === 'viewer' && 'Read-only dashboard access'}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
