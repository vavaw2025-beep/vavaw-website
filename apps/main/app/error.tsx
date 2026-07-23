'use client';

import { useEffect } from 'react';
import { captureError } from '@vavaw/monitoring';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureError(error, {
      app: 'main',
      feature: 'global_error_boundary',
      severity: 'error',
    });
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-4 text-center">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">Something went wrong!</h2>
      <p className="mb-8 text-sm text-slate-500">We've been notified and are looking into it.</p>
      <button
        onClick={() => reset()}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        Try again
      </button>
    </div>
  );
}
