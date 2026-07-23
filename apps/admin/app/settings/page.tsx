import { Settings as SettingsIcon, Server, Shield, Database, Cloud, HardDrive, Pencil, Lock, Table, Image as ImageIcon, Users, Key, Link as LinkIcon } from 'lucide-react';
import { getAdminDataSourceMode } from '../../lib/data-source';

export default function SettingsPage() {
  const mode = getAdminDataSourceMode();
  const authMode = process.env.NEXT_PUBLIC_ADMIN_AUTH_MODE || process.env.ADMIN_AUTH_MODE || "mock";
  const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasServiceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY || !!process.env.SUPABASE_SECRET_KEY;
  const hasAdminUrl = !!process.env.NEXT_PUBLIC_ADMIN_URL;
  
  const hasRevalidationSecret = !!process.env.REVALIDATION_SECRET;
  const isRevalidationEnabled = process.env.CMS_REVALIDATION_ENABLED === 'true';
  const hasMainRevalidateUrl = !!process.env.MAIN_REVALIDATE_URL;
  const hasBeautyRevalidateUrl = !!process.env.BEAUTY_REVALIDATE_URL;
  const hasFranchiseRevalidateUrl = !!process.env.FRANCHISE_REVALIDATE_URL;

  const emailProvider = process.env.EMAIL_PROVIDER || 'noop';
  const hasResendKey = !!process.env.RESEND_API_KEY;
  const hasLeadTo = !!process.env.LEAD_NOTIFICATION_TO;
  const hasLeadFrom = !!process.env.LEAD_NOTIFICATION_FROM;

  const isMonitoringEnabled = process.env.NEXT_PUBLIC_MONITORING_ENABLED === 'true';
  const monitoringProvider = process.env.NEXT_PUBLIC_MONITORING_PROVIDER || 'console';
  const hasSentryDsn = !!process.env.SENTRY_DSN;

  const hasPreviewSecret = !!process.env.CMS_PREVIEW_SECRET;
  const previewTtl = process.env.CMS_PREVIEW_TOKEN_TTL_SECONDS || '900';

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
    { name: 'Provider', value: 'Supabase Storage', icon: Server, status: 'Active' },
    { name: 'Bucket Name', value: 'vavaw-media', icon: Database, status: 'Configured' },
    { name: 'Public URL Access', value: 'Enabled', icon: LinkIcon, status: 'Active' },
    { name: 'CDN Integration', value: 'Default Supabase CDN', icon: Globe, status: 'Active' },
    { name: 'Max File Size (Images)', value: '5 MB', icon: Shield, status: 'Active' },
    { name: 'Max File Size (Videos)', value: '50 MB', icon: Shield, status: 'Active' },
    { name: 'Accepted Image Formats', value: 'JPG, PNG, WEBP, AVIF', icon: SettingsIcon, status: 'Configured' },
    { name: 'Accepted Video Formats', value: 'MP4, WEBM, MOV', icon: SettingsIcon, status: 'Configured' },
    { name: 'Video Upload', value: 'Enabled', icon: SettingsIcon, status: 'Active' },
    { name: 'Video Transcoding', value: 'Pending Phase', icon: SettingsIcon, status: 'Pending' },
    { name: 'External Video Hosting', value: 'Pending Phase', icon: SettingsIcon, status: 'Pending' },
  ];

  const authConfig = [
    { name: 'Provider Planned', value: 'Supabase Auth', icon: Lock, status: 'Active' },
    { name: 'Current Auth Mode', value: authMode, icon: Shield, status: authMode === 'supabase' ? 'Active' : 'Mock' },
    { name: 'Supabase URL Configured', value: hasSupabaseUrl ? 'Yes' : 'No', icon: Server, status: hasSupabaseUrl ? 'Configured' : 'Missing' },
    { name: 'Anon Key Configured', value: hasAnonKey ? 'Yes' : 'No', icon: Lock, status: hasAnonKey ? 'Configured' : 'Missing' },
    { name: 'Service Role Configured', value: hasServiceRole ? 'Yes (Hidden for Security)' : 'No', icon: Shield, status: hasServiceRole ? 'Configured' : 'Missing' },
    { name: 'Route Protection', value: authMode === 'supabase' ? 'Active (Next.js Middleware + RLS)' : 'Bypassed in Mock Mode', icon: Lock, status: authMode === 'supabase' ? 'Active' : 'Disabled' },
    { name: 'Automated Admin Invites', value: hasServiceRole && hasAdminUrl ? 'Enabled' : 'Disabled (Requires Service Key & Admin URL)', icon: Users, status: hasServiceRole && hasAdminUrl ? 'Active' : 'Disabled' },
    { name: 'Admin Invite Redirect URL', value: hasAdminUrl ? 'Configured' : 'Missing', icon: Globe, status: hasAdminUrl ? 'Configured' : 'Missing' },
    { name: 'Manual UID Fallback', value: 'Available', icon: Key, status: 'Active' },
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
    { name: 'Lead CSV Export', value: 'Enabled (owner/admin only)', icon: SettingsIcon, status: 'Active' },
    { name: 'Export Roles', value: 'Owner, Admin', icon: Shield, status: 'Configured' },
    { name: 'Max Rows Per Export', value: '5,000', icon: SettingsIcon, status: 'Configured' },
    { name: 'CRM Integration', value: 'Pending Phase', icon: SettingsIcon, status: 'Pending' },
  ];

  const monitoringConfig = [
    { name: 'Monitoring Enabled', value: isMonitoringEnabled ? 'Yes' : 'No', icon: Shield, status: isMonitoringEnabled ? 'Active' : 'Disabled' },
    { name: 'Monitoring Provider', value: monitoringProvider, icon: Server, status: monitoringProvider === 'console' ? 'Mock' : monitoringProvider === 'sentry' ? 'Active' : 'Disabled' },
    { name: 'Sentry DSN', value: hasSentryDsn ? 'Configured (Hidden)' : 'Missing', icon: Lock, status: hasSentryDsn ? 'Configured' : 'Missing' },
    { name: 'Health Endpoints', value: '/api/health across all apps', icon: Globe, status: 'Active' },
    { name: 'Deploy Version', value: process.env.VERCEL_GIT_COMMIT_SHA || 'local', icon: Server, status: 'Active' },
  ];

  const previewConfig = [
    { name: 'Signed Preview Mode', value: hasPreviewSecret ? 'Enabled' : 'Disabled (Requires Secret)', icon: Shield, status: hasPreviewSecret ? 'Active' : 'Disabled' },
    { name: 'Preview Secret', value: hasPreviewSecret ? 'Configured (Hidden)' : 'Missing', icon: Lock, status: hasPreviewSecret ? 'Configured' : 'Missing' },
    { name: 'Token TTL', value: `${previewTtl} seconds`, icon: Server, status: 'Configured' },
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

      {/* Monitoring Section */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Monitoring & Health Status</h2>
        <p className="mt-1 text-sm text-slate-500">Error reporting and health check configuration.</p>
      </div>

      <div className="bg-white shadow rounded-lg border border-slate-200">
        <ul role="list" className="divide-y divide-slate-200">
          {monitoringConfig.map((item, idx) => (
            <li key={idx} className="p-4 sm:px-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-rose-50 p-2 rounded-lg">
                  <item.icon className="h-5 w-5 text-rose-600" />
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

      {/* Preview Mode Section */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Signed Preview Settings</h2>
        <p className="mt-1 text-sm text-slate-500">Draft content preview configuration for public apps.</p>
      </div>

      <div className="bg-white shadow rounded-lg border border-slate-200">
        <ul role="list" className="divide-y divide-slate-200">
          {previewConfig.map((item, idx) => (
            <li key={idx} className="p-4 sm:px-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-fuchsia-50 p-2 rounded-lg">
                  <item.icon className="h-5 w-5 text-fuchsia-600" />
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

      {/* Audit Log Section */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Audit Logs Settings</h2>
        <p className="mt-1 text-sm text-slate-500">Administrative activity audit logging and access policies.</p>
      </div>

      <div className="bg-white shadow rounded-lg border border-slate-200">
        <ul role="list" className="divide-y divide-slate-200">
          {[
            { name: 'Audit Logging', value: 'Enabled', icon: Shield, status: 'Active' },
            { name: 'Audit Logs Access', value: 'Owner, Admin', icon: Lock, status: 'Configured' },
            { name: 'Append-Only Storage', value: 'Yes (No UI/RLS update/delete)', icon: Database, status: 'Active' },
            { name: 'Audit Retention Policy', value: 'Pending Phase', icon: Server, status: 'Pending' },
            { name: 'Audit Export', value: 'Pending Phase', icon: SettingsIcon, status: 'Pending' },
          ].map((item, idx) => (
            <li key={idx} className="p-4 sm:px-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-cyan-50 p-2 rounded-lg">
                  <item.icon className="h-5 w-5 text-cyan-600" />
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

      {/* Expected Tables Section */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Expected Database Tables</h2>
        <p className="mt-1 text-sm text-slate-500">Supabase public schema tables queried and managed in current CMS phases.</p>
      </div>

      <div className="bg-white shadow rounded-lg border border-slate-200 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            'business_entries',
            'hero_slides',
            'media_assets',
            'seo_settings',
            'redirects',
            'content_blocks',
            'leads',
            'audit_logs',
          ].map((tableName) => (
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
