import { Settings as SettingsIcon, Server, Shield, Database, Cloud, HardDrive, Pencil, Lock, Users, ArrowRight } from 'lucide-react';
import { ADMIN_ROLES } from '@vavaw/auth';

export default function SettingsPage() {
  const configs = [
    { name: 'Environment', value: 'Production', icon: Server, status: 'Active' },
    { name: 'Domains', value: '*.vavaw.vn', icon: Globe, status: 'Configured' },
    { name: 'Authentication', value: 'Mock UI — Supabase Auth planned', icon: Shield, status: 'Mock' },
    { name: 'Database', value: 'Pending Implementation', icon: Database, status: 'Disabled' },
    { name: 'Media Provider', value: 'Local Public Directory', icon: Cloud, status: 'Active' },
    { name: 'CMS Provider', value: 'Static @vavaw/brand-config', icon: SettingsIcon, status: 'Active' },
  ];

  const cmsStatus = [
    { name: 'Data Source', value: 'Static config (@vavaw/brand-config)', icon: HardDrive, status: 'Static' },
    { name: 'Auth', value: 'Not connected', icon: Shield, status: 'Not Connected' },
    { name: 'Database', value: 'Not connected', icon: Database, status: 'Not Connected' },
    { name: 'Storage', value: 'Not connected', icon: Cloud, status: 'Not Connected' },
    { name: 'CMS Write Actions', value: 'Disabled — read-only mode', icon: Pencil, status: 'Disabled' },
  ];

  const authMode = process.env.NEXT_PUBLIC_ADMIN_AUTH_MODE || "mock";
  const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasServiceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  const authConfig = [
    { name: 'Provider Planned', value: 'Supabase', icon: Lock, status: 'Planned' },
    { name: 'Current Mode', value: authMode, icon: Shield, status: authMode === 'supabase' ? 'Active' : 'Mock' },
    { name: 'Supabase URL Configured', value: hasSupabaseUrl ? 'Yes' : 'No', icon: Server, status: hasSupabaseUrl ? 'Configured' : 'Missing' },
    { name: 'Anon Key Configured', value: hasAnonKey ? 'Yes' : 'No', icon: Lock, status: hasAnonKey ? 'Configured' : 'Missing' },
    { name: 'Service Role Configured', value: hasServiceRole ? 'Yes' : 'No', icon: Shield, status: hasServiceRole ? 'Configured' : 'Missing' },
    { name: 'Route Protection', value: 'Not enabled — middleware will be added in real auth phase', icon: Lock, status: 'Disabled' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Platform configuration and infrastructure status.</p>
      </div>

      <div className="bg-white shadow rounded-lg border border-slate-200">
        <ul role="list" className="divide-y divide-slate-200">
          {configs.map((config, idx) => (
            <li key={idx} className="p-4 sm:px-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-slate-100 p-2 rounded-lg">
                  <config.icon className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{config.name}</p>
                  <p className="text-sm text-slate-500">{config.value}</p>
                </div>
              </div>
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  config.status === 'Active' || config.status === 'Configured'
                    ? 'bg-green-100 text-green-800'
                    : config.status === 'Mock'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {config.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Backend / CMS Status */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Backend / CMS Status</h2>
        <p className="mt-1 text-sm text-slate-500">Current connection status for the backend CMS architecture.</p>
      </div>

      <div className="bg-white shadow rounded-lg border border-slate-200">
        <ul role="list" className="divide-y divide-slate-200">
          {cmsStatus.map((item, idx) => (
            <li key={idx} className="p-4 sm:px-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-amber-50 p-2 rounded-lg">
                  <item.icon className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.value}</p>
                </div>
              </div>
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  item.status === 'Static'
                    ? 'bg-blue-100 text-blue-800'
                    : item.status === 'Disabled'
                    ? 'bg-slate-100 text-slate-600'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {item.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Authentication Section */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Authentication</h2>
        <p className="mt-1 text-sm text-slate-500">Auth provider configuration and route protection status.</p>
      </div>

      <div className="bg-white shadow rounded-lg border border-slate-200">
        <ul role="list" className="divide-y divide-slate-200">
          {authConfig.map((item, idx) => (
            <li key={idx} className="p-4 sm:px-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-50 p-2 rounded-lg">
                  <item.icon className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.value}</p>
                </div>
              </div>
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  item.status === 'Mock'
                    ? 'bg-amber-100 text-amber-800'
                    : item.status === 'Planned'
                    ? 'bg-indigo-100 text-indigo-800'
                    : item.status === 'Pending'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {item.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Globe(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  )
}
