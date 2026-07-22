import { getSortedBusinessEntries } from '@vavaw/brand-config';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

const entries = getSortedBusinessEntries();

export default function HeroPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Hero Slides</h1>
        <p className="mt-1 text-sm text-slate-500">Manage main homepage slider content.</p>
      </div>

      <div className="space-y-6">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/3 bg-slate-100 border-r border-slate-200 relative min-h-[200px] flex items-center justify-center p-4">
              <div className="absolute inset-0 z-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: `url(${entry.media.previewImage})` }} />
              <div className="relative z-10 flex flex-col items-center text-slate-400">
                <ImageIcon className="h-12 w-12 mb-2" />
                <span className="text-xs text-center font-mono break-all">{entry.media.backgroundImage}</span>
              </div>
            </div>
            
            <div className="p-6 md:w-2/3">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{entry.title}</h2>
                  <p className="text-sm font-medium text-blue-600 mt-1">{entry.subtitle}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  entry.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {entry.status}
                </span>
              </div>
              
              <p className="text-slate-600 text-sm mb-6">{entry.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">Order</span>
                  <span className="text-slate-900">{entry.sortOrder}</span>
                </div>
                <div>
                  <span className="block text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">CTA</span>
                  <span className="text-slate-900">{entry.ctaLabel}</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">Link</span>
                  <code className="text-slate-700 bg-slate-100 px-2 py-1 rounded">{entry.redirectPath}</code>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
