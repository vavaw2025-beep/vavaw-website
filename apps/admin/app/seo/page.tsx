import { businessEntries } from '@vavaw/brand-config';
import { AlertTriangle } from 'lucide-react';

export default function SeoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">SEO Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage global SEO metadata and OpenGraph tags.</p>
      </div>

      <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-1/5">Business</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-1/4">Title & Desc</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-1/4">URLs & OG</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-1/5">Keywords</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {businessEntries.map((entry) => {
                const missingFields = [];
                if (!entry.seo.title) missingFields.push('Title');
                if (!entry.seo.description) missingFields.push('Description');
                if (!entry.seo.canonicalUrl) missingFields.push('Canonical');
                if (!entry.media.ogImage) missingFields.push('OG Image');

                return (
                  <tr key={entry.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 align-top">
                      <div className="text-sm font-medium text-slate-900">{entry.name}</div>
                      {missingFields.length > 0 && (
                        <div className="mt-2 flex items-start text-amber-600 text-xs bg-amber-50 p-2 rounded border border-amber-200">
                          <AlertTriangle className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span>Missing: {missingFields.join(', ')}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="mb-2">
                        <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">Title</span>
                        <div className="text-sm text-slate-900 font-medium">{entry.seo.title || <span className="text-slate-400 italic">None</span>}</div>
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">Description</span>
                        <div className="text-xs text-slate-600 line-clamp-3" title={entry.seo.description}>{entry.seo.description || <span className="text-slate-400 italic">None</span>}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="mb-2">
                        <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">Canonical URL</span>
                        <code className="text-xs text-blue-600 bg-blue-50 px-1 py-0.5 rounded break-all">{entry.seo.canonicalUrl || 'None'}</code>
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">OG Image</span>
                        <code className="text-xs text-slate-600 bg-slate-100 px-1 py-0.5 rounded break-all">{entry.media.ogImage || 'None'}</code>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-wrap gap-1">
                        {entry.seo.keywords && entry.seo.keywords.length > 0 ? (
                          entry.seo.keywords.map(kw => (
                            <span key={kw} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                              {kw}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">No keywords defined</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
