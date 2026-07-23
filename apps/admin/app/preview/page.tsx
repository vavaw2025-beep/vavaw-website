import Link from 'next/link';
import { Eye, Globe, Sparkles, Store } from 'lucide-react';
import { getAdminDataSourceMode } from '../../lib/data-source';

export default function PreviewIndexPage() {
  const mode = getAdminDataSourceMode();

  const previewTargets = [
    {
      id: 'main',
      name: 'Main Portal Preview',
      description: 'Preview business entries, hero slides, and SEO for the main portal homepage.',
      icon: Globe,
      color: 'bg-blue-50 text-blue-600',
      href: '/preview/main'
    },
    {
      id: 'cosmetic',
      name: 'Cosmetic Page Preview',
      description: 'Preview content blocks (Hero, Rich Text, Grid, etc.) for the /cosmetic page.',
      icon: Sparkles,
      color: 'bg-purple-50 text-purple-600',
      href: '/preview/cosmetic'
    },
    {
      id: 'beauty',
      name: 'Beauty Preview',
      description: 'Preview content blocks and SEO for the standalone beauty.vavaw.vn app.',
      icon: Eye,
      color: 'bg-pink-50 text-pink-600',
      href: '/preview/beauty'
    },
    {
      id: 'franchise',
      name: 'Franchise Preview',
      description: 'Preview content blocks and SEO for the standalone franchise.vavaw.vn app.',
      icon: Store,
      color: 'bg-emerald-50 text-emerald-600',
      href: '/preview/franchise'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">CMS Preview Center</h1>
        <p className="mt-1 text-sm text-slate-500">Preview CMS-managed pages before public rollout. Includes draft and inactive content.</p>
      </div>

      {mode !== 'supabase' && (
        <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">Preview requires Supabase Mode</h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>The system is currently running in mock mode. Preview data cannot be loaded from the database.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {previewTargets.map((target) => (
          <div key={target.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-6 flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-lg ${target.color}`}>
                  <target.icon className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">{target.name}</h2>
              </div>
              <p className="text-slate-600 text-sm mb-4">
                {target.description}
              </p>
              <div className="text-xs text-amber-600 bg-amber-50 rounded-md p-2 border border-amber-100">
                Warning: Preview is admin-only and may include draft/inactive content.
              </div>
            </div>
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
              <Link 
                href={target.href}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center justify-between w-full"
              >
                <span>Launch Preview</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
