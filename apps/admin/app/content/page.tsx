import { businessEntries } from '@vavaw/brand-config';
import { FileText, Lock } from 'lucide-react';

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Website Content</h1>
        <p className="mt-1 text-sm text-slate-500">Manage rich text, sections, and marketing content.</p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
        <Lock className="mx-auto h-12 w-12 text-slate-400 mb-4" />
        <h3 className="text-lg font-medium text-slate-900">CMS Integration Pending</h3>
        <p className="mt-2 text-sm text-slate-500 max-w-xl mx-auto">
          Content blocks will be connected to a headless CMS or backend database in a future phase. 
          Currently, the marketing content is statically defined in the frontend components.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white shadow rounded-lg border border-slate-200 p-6 opacity-75">
          <div className="flex items-center gap-3 mb-4 text-slate-400">
            <FileText className="h-5 w-5" />
            <h3 className="font-medium">Main Website Content</h3>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-100 rounded w-3/4"></div>
            <div className="h-4 bg-slate-100 rounded w-full"></div>
            <div className="h-4 bg-slate-100 rounded w-5/6"></div>
          </div>
        </div>

        {businessEntries.map((entry) => (
          <div key={entry.id} className="bg-white shadow rounded-lg border border-slate-200 p-6 opacity-75">
            <div className="flex items-center gap-3 mb-4 text-slate-400">
              <FileText className="h-5 w-5" />
              <h3 className="font-medium">{entry.name} Content</h3>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-slate-100 rounded w-3/4"></div>
              <div className="h-4 bg-slate-100 rounded w-full"></div>
              <div className="h-4 bg-slate-100 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
