import { Settings as SettingsIcon, Server, Shield, Database, Cloud, HardDrive, Pencil, Lock, Table, Image as ImageIcon, Users } from 'lucide-react';
import { getAdminDataSourceMode } from '../../lib/data-source';

export default function SettingsPage() {
  const mode = getAdminDataSourceMode();
  const authMode = process.env.NEXT_PUBLIC_ADMIN_AUTH_MODE || process.env.ADMIN_AUTH_MODE || "mock";
  const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasServiceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  const hasRevalidationSecret = !!process.env.REVALIDATION_SECRET;
  const isRevalidationEnabled = process.env.CMS_REVALIDATION_ENABLED === 'true';
  const hasMainRevalidateUrl = !!process.env.MAIN_REVALIDATE_URL;
  const hasBeautyRevalidateUrl = !!process.env.BEAUTY_REVALIDATE_URL;
  const hasFranchiseRevalidateUrl = !!process.env.FRANCHISE_REVALIDATE_URL;

  const emailProvider = process.env.EMAIL_PROVIDER || 'noop';
  const hasResendKey = !!process.env.RESEND_API_KEY;
  const hasLeadTo = !!process.env.LEAD_NOTIFICATION_TO;
  const hasLeadFrom = !!process.env.LEAD_NOTIFICATION_FROM;

  const configs = [
    { name: 'Environment', value: 'Production', icon: Server, status: 'Active' },
    { name: 'Domains', value: '*.vavaw.vn', icon: Globe, status: 'Configured' },
    { name: 'Data Source Mode', value: mode === 'supabase' ? 'Supabase Database' : 'Static Config (@vavaw/brand-config)', icon: HardDrive, status: mode === 'supabase' ? 'Active' : 'Static' },
    { name: 'CMS Read Mode', value: mode === 'supabase' ? 'Enabled (Reading from Supabase RLS)' : 'Enabled (Reading from Static Config)', icon: Database, status: 'Enabled' },
    { name: 'CMS Write / Mutation', value: mode === 'supabase' ? 'Enabled (Business, Hero & SEO CRUD)' : 'Disabled in Mock Mode', icon: Pencil, status: mode === 'supabase' ? 'Active' : 'Disabled' },
    { name: 'SEO CRUD', value: mode === 'supabase' ? 'Enabled (owner/admin/editor can manage, owner/admin can delete)' : 'Requires Supabase Mode', icon: Pencil, status: mode === 'supabase' ? 'Active' : 'Disabled' },
    { name: 'SEO Metadata Source (apps/main)', value: 'Reads from Supabase seo_settings when CMS_DATA_SOURCE=supabase, static fallback always available', icon: Database, status: 'Enabled' },
    { name: 'OG Image Support', value: mode === 'supabase' ? 'Enabled — select og_media_id from uploaded Media Assets' : 'Disabled (static fallback only)', icon: ImageIcon, status: mode === 'supabase' ? 'Active' : 'Static' },
    { name: 'Public Metadata Integration', value: 'apps/main only (apps/beauty and apps/franchise remain static)', icon: Server, status: 'Partial' },
    { name: 'Content Blocks CRUD', value: mode === 'supabase' ? 'Enabled (owner/admin/editor can manage, owner/admin can delete)' : 'Requires Supabase Mode', icon: Pencil, status: mode === 'supabase' ? 'Active' : 'Disabled' },
    { name: 'Content Blocks Rendering', value: 'Not connected yet (apps still use static frontend components)', icon: Database, status: 'Static' },
    { name: 'Visual Page Builder', value: 'Not implemented (JSON based configuration for flexible blocks)', icon: SettingsIcon, status: 'Disabled' },
    { name: 'Admin Users Management', value: mode === 'supabase' ? 'Enabled (owner can manage users, manual Auth creation required)' : 'Requires Supabase Mode', icon: Users, status: mode === 'supabase' ? 'Active' : 'Disabled' },
  ];

  const storageConfig = [
    { name: 'Storage Provider', value: 'Supabase Storage', icon: Cloud, status: 'Active' },
    { name: 'Target Bucket', value: 'vavaw-media', icon: HardDrive, status: 'Configured' },
    { name: 'Image Upload Enabled', value: mode === 'supabase' ? 'Yes (JPG, PNG, WEBP, AVIF)' : 'No (Requires Supabase Mode)', icon: ImageIcon, status: mode === 'supabase' ? 'Active' : 'Disabled' },
    { name: 'Max Image File Size', value: '5 MB', icon: SettingsIcon, status: 'Configured' },
    { name: 'Video Upload Enabled', value: 'Not Enabled (Planned for Future Phase)', icon: Cloud, status: 'Disabled' },
  ];

  const authConfig = [
    { name: 'Provider Planned', value: 'Supabase Auth', icon: Lock, status: 'Active' },
    { name: 'Current Auth Mode', value: authMode, icon: Shield, status: authMode === 'supabase' ? 'Active' : 'Mock' },
    { name: 'Supabase URL Configured', value: hasSupabaseUrl ? 'Yes' : 'No', icon: Server, status: hasSupabaseUrl ? 'Configured' : 'Missing' },
    { name: 'Anon Key Configured', value: hasAnonKey ? 'Yes' : 'No', icon: Lock, status: hasAnonKey ? 'Configured' : 'Missing' },
    { name: 'Service Role Configured', value: hasServiceRole ? 'Yes (Hidden for Security)' : 'No', icon: Shield, status: hasServiceRole ? 'Configured' : 'Missing' },
    { name: 'Route Protection', value: authMode === 'supabase' ? 'Active (Next.js Middleware + RLS)' : 'Bypassed in Mock Mode', icon: Lock, status: authMode === 'supabase' ? 'Active' : 'Disabled' },
  ];

  const revalidationConfig = [
    { name: 'CMS Revalidation Trigger', value: isRevalidationEnabled ? 'Enabled' : 'Disabled', icon: Server, status: isRevalidationEnabled ? 'Active' : 'Disabled' },
    { name: 'Revalidation Secret', value: hasRevalidationSecret ? 'Configured (Hidden)' : 'Missing', icon: Lock, status: hasRevalidationSecret ? 'Configured' : 'Missing' },
    { name: 'Main Target URL', value: hasMainRevalidateUrl ? 'Configured' : 'Missing', icon: Globe, status: hasMainRevalidateUrl ? 'Configured' : 'Missing' },
    { name: 'Beauty Target URL', value: hasBeautyRevalidateUrl ? 'Configured' : 'Missing', icon: Globe, status: hasBeautyRevalidateUrl ? 'Configured' : 'Missing' },
    { name: 'Franchise Target URL', value: hasFranchiseRevalidateUrl ? 'Configured' : 'Missing', icon: Globe, status: hasFranchiseRevalidateUrl ? 'Configured' : 'Missing' },
  ];

  const leadCaptureConfig = [
    { name: 'Public Lead Capture', value: 'Enabled via Honeypot', icon: SettingsIcon, status: 'Active' },
    { name: 'Email Provider', value: emailProvider, icon: SettingsIcon, status: emailProvider === 'resend' ? 'Active' : emailProvider === 'console' ? 'Mock' : 'Disabled' },
    { name: 'Email Recipient (TO)', value: hasLeadTo ? 'Configured (Hidden)' : 'Missing', icon: Users, status: hasLeadTo ? 'Configured' : 'Missing' },
    { name: 'Email Sender (FROM)', value: hasLeadFrom ? 'Configured (Hidden)' : 'Missing', icon: Server, status: hasLeadFrom ? 'Configured' : 'Missing' },
    { name: 'Resend API Key', value: hasResendKey ? 'Configured (Hidden)' : 'Missing', icon: Lock, status: hasResendKey ? 'Configured' : 'Missing' },
    { name: 'CRM Integration', value: 'Pending Phase', icon: SettingsIcon, status: 'Pending' },
  ];

  const expectedTables = [
    'business_entries',
    'hero_slides',
    'media_assets',
    'seo_settings',
    'redirects',
    'content_blocks',
    'leads',
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
                  config.status === 'Active' || config.status === 'Configured' || config.status === 'Enabled'
                    ? 'bg-green-100 text-green-800'
                    : config.status === 'Static'
                    ? 'bg-blue-100 text-blue-800'
                    : config.status === 'Partial'
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

      {/* Storage Section */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Media & Storage Status</h2>
        <p className="mt-1 text-sm text-slate-500">Supabase Storage bucket configuration for media uploads.</p>
      </div>

      <div className="bg-white shadow rounded-lg border border-slate-200">
        <ul role="list" className="divide-y divide-slate-200">
          {storageConfig.map((item, idx) => (
            <li key={idx} className="p-4 sm:px-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <item.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.value}</p>
                </div>
              </div>
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  item.status === 'Active' || item.status === 'Configured'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-slate-100 text-slate-600'
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
        <h2 className="text-lg font-semibold text-slate-900">Authentication & Environment Status</h2>
        <p className="mt-1 text-sm text-slate-500">Auth provider configuration and key status.</p>
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
                  item.status === 'Active' || item.status === 'Configured'
                    ? 'bg-green-100 text-green-800'
                    : item.status === 'Mock'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {item.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Revalidation Section */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900">CMS Revalidation Status</h2>
        <p className="mt-1 text-sm text-slate-500">On-demand revalidation trigger configuration for public apps.</p>
      </div>

      <div className="bg-white shadow rounded-lg border border-slate-200">
        <ul role="list" className="divide-y divide-slate-200">
          {revalidationConfig.map((item, idx) => (
            <li key={idx} className="p-4 sm:px-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-50 p-2 rounded-lg">
                  <item.icon className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.value}</p>
                </div>
              </div>
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  item.status === 'Active' || item.status === 'Configured'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {item.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Lead Capture Section */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Lead Capture Settings</h2>
        <p className="mt-1 text-sm text-slate-500">Public form configuration and third-party integrations.</p>
      </div>

      <div className="bg-white shadow rounded-lg border border-slate-200">
        <ul role="list" className="divide-y divide-slate-200">
          {leadCaptureConfig.map((item, idx) => (
            <li key={idx} className="p-4 sm:px-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-orange-50 p-2 rounded-lg">
                  <item.icon className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.value}</p>
                </div>
              </div>
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  item.status === 'Active' || item.status === 'Configured'
                    ? 'bg-green-100 text-green-800'
                    : item.status === 'Pending'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {item.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Expected Tables Section */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Expected Database Tables</h2>
        <p className="mt-1 text-sm text-slate-500">Supabase public schema tables queried and managed in current CMS phases.</p>
      </div>

      <div className="bg-white shadow rounded-lg border border-slate-200 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {expectedTables.map((tableName) => (
            <div key={tableName} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 font-mono text-sm">
              <Table className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>{tableName}</span>
            </div>
          ))}
        </div>
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
  );
}
