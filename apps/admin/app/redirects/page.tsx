import { businessEntries } from '@vavaw/brand-config';
import { ArrowRight } from 'lucide-react';

export default function RedirectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Routing & Redirects</h1>
        <p className="mt-1 text-sm text-slate-500">Manage internal navigation and external app links.</p>
      </div>

      <div className="bg-white shadow rounded-lg border border-slate-200">
        <div className="px-4 py-5 border-b border-slate-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-slate-900">Redirect Map</h3>
          <p className="mt-1 text-sm text-slate-500">Read-only mapping of internal paths to final destinations.</p>
        </div>
        
        <ul role="list" className="divide-y divide-slate-200">
          {businessEntries.map((entry) => (
            <li key={entry.id} className="p-4 sm:px-6 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-sm font-medium text-slate-900">{entry.name}</p>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      entry.navigationType === 'internal' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {entry.navigationType}
                    </span>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      entry.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {entry.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm mt-3 bg-slate-50 p-3 rounded border border-slate-200 overflow-x-auto">
                    <code className="text-slate-600 bg-white px-2 py-1 rounded border border-slate-200 whitespace-nowrap">
                      {entry.redirectPath}
                    </code>
                    <ArrowRight className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <code className="text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 whitespace-nowrap">
                      {entry.href}
                    </code>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
