import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, RefreshCw } from 'lucide-react';

interface PreviewShellProps {
  title: string;
  targetUrl?: string;
  isRevalidationEnabled?: boolean;
  children: React.ReactNode;
}

export function PreviewShell({ title, targetUrl, isRevalidationEnabled, children }: PreviewShellProps) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Top Warning Banner */}
      <div className="bg-amber-500 text-amber-950 px-4 py-2 text-sm font-semibold flex items-center justify-center">
        ⚠️ Admin Preview — Not Public. May contain draft or inactive content.
      </div>

      {/* Preview Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/preview" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Hub
          </Link>
          <div className="h-6 w-px bg-slate-700"></div>
          <h1 className="text-lg font-bold text-white tracking-tight">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-slate-700/50 border border-slate-600 text-slate-300">
            <RefreshCw className={`w-3.5 h-3.5 ${isRevalidationEnabled ? 'text-emerald-400' : 'text-slate-500'}`} />
            {isRevalidationEnabled ? 'Revalidation Configured' : 'Revalidation Disabled'}
          </div>

          {targetUrl && (
            <a 
              href={targetUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open Live Page
            </a>
          )}
        </div>
      </header>

      {/* Preview Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
