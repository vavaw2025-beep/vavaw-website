"use client";

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function CopyUrlButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1 text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors inline-flex items-center gap-1 text-xs"
      title="Copy URL"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-green-600" />
          <span className="text-green-600">Copied</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5 text-slate-500" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}
