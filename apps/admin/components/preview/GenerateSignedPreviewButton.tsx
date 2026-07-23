'use client';

import React, { useState } from 'react';
import { generateSignedPreviewLinkAction } from '../../app/preview/actions';
import { Link as LinkIcon, Copy, Check, AlertCircle, Loader2 } from 'lucide-react';

interface Props {
  app: 'main' | 'beauty' | 'franchise';
  target: 'home' | 'cosmetic' | 'beauty' | 'franchise';
  path: string;
}

export function GenerateSignedPreviewButton({ app, target, path }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [ttl, setTtl] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setPreviewUrl(null);
    setCopied(false);
    
    try {
      const result = await generateSignedPreviewLinkAction(app, target, path);
      if (result.success && result.previewUrl) {
        setPreviewUrl(result.previewUrl);
        setTtl(result.ttl ?? 900);
      } else {
        setError(result.error || 'Failed to generate link');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!previewUrl) return;
    try {
      await navigator.clipboard.writeText(previewUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LinkIcon className="w-4 h-4" />}
        Generate Signed Public Preview Link
      </button>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-100">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {previewUrl && (
        <div className="flex flex-col gap-2 p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              Signed Link (Expires in {Math.round(ttl / 60)} minutes)
            </div>
            <div className="text-xs text-amber-600 font-medium">
              Do not share externally
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              readOnly 
              value={previewUrl} 
              className="flex-1 text-sm font-mono p-2 bg-white border border-slate-300 rounded-md outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700" 
            />
            <button
              onClick={handleCopy}
              className="p-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md transition-colors shrink-0"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-md transition-colors shrink-0"
            >
              Open Link
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
