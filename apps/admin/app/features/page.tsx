import React from 'react';

export default function FeatureMapPage() {
  const features = [
    {
      module: 'Dashboard',
      route: '/',
      purpose: 'Overview of the VAVAW ecosystem, CMS status, auth status, and business entry summary.',
      data: 'business_entries, system env status',
      roles: 'owner/admin/editor/viewer',
      status: 'Active',
      next: '-'
    },
    {
      module: 'Business',
      route: '/business',
      purpose: 'Manage VAVAW business units such as Cosmetic, Beauty, and Franchise.',
      data: 'business_entries',
      roles: 'owner/admin/editor',
      status: 'Active',
      next: '-'
    },
    {
      module: 'Hero',
      route: '/hero',
      purpose: 'Manage hero slides and main portal presentation.',
      data: 'hero_slides, media_assets',
      roles: 'owner/admin/editor',
      status: 'Active',
      next: '-'
    },
    {
      module: 'Media',
      route: '/media',
      purpose: 'Upload and manage images/videos for hero, SEO, and content.',
      data: 'Supabase Storage, media_assets',
      roles: 'owner/admin/editor',
      status: 'Active',
      next: 'upload verification required'
    },
    {
      module: 'SEO',
      route: '/seo',
      purpose: 'Manage metadata, Open Graph images, and SEO settings.',
      data: 'seo_settings',
      roles: 'owner/admin/editor',
      status: 'Active',
      next: '-'
    },
    {
      module: 'Redirects',
      route: '/redirects',
      purpose: 'Manage /go/[slug] routing across VAVAW ecosystem.',
      data: 'redirects',
      roles: 'owner/admin/editor',
      status: 'Active',
      next: '-'
    },
    {
      module: 'Content',
      route: '/content',
      purpose: 'Manage CMS content blocks for public pages.',
      data: 'content_blocks',
      roles: 'owner/admin/editor',
      status: 'Active',
      next: '-'
    },
    {
      module: 'Preview',
      route: '/preview',
      purpose: 'Preview CMS content before public usage.',
      data: 'business_entries, hero_slides, content_blocks, seo_settings',
      roles: 'owner/admin/editor/viewer',
      status: 'Active',
      next: '-'
    },
    {
      module: 'Users',
      route: '/users',
      purpose: 'Manage internal admin users and role assignments.',
      data: 'admin_profiles',
      roles: 'owner',
      status: 'Active',
      next: '-'
    },
    {
      module: 'Leads',
      route: '/leads',
      purpose: 'View submitted public leads from contact, beauty, and franchise forms.',
      data: 'leads',
      roles: 'owner/admin/editor/viewer',
      status: 'Active',
      next: '-'
    },
    {
      module: 'Lead Detail',
      route: '/leads/[id]',
      purpose: 'View lead details and update lead status.',
      data: 'leads',
      roles: 'owner/admin/editor',
      status: 'Active',
      next: '-'
    },
    {
      module: 'Audit Logs',
      route: '/audit',
      purpose: 'Track important admin actions for accountability.',
      data: 'audit_logs',
      roles: 'owner/admin',
      status: 'Active',
      next: '-'
    },
    {
      module: 'Settings',
      route: '/settings',
      purpose: 'Show production configuration, CMS state, auth mode, storage, and revalidation status.',
      data: 'environment/config status',
      roles: 'owner/admin',
      status: 'Active',
      next: '-'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">Active</span>;
      case 'Pending Verification':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">Pending Verification</span>;
      case 'Planned':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">Planned</span>;
      case 'Internal Only':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">Internal Only</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Feature Map</h1>
        <p className="mt-1 text-sm text-slate-500">
          A clear overview of all Admin modules, their purpose, and the data they manage.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Module</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Route</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Purpose</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Data / Tables</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Primary Roles</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Next Improvement</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {features.map((feature, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {feature.module}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                    {feature.route}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate" title={feature.purpose}>
                    {feature.purpose}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate" title={feature.data}>
                    {feature.data}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {feature.roles}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {getStatusBadge(feature.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {feature.next}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
