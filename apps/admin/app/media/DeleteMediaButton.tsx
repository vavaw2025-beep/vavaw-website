"use client";

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteMediaAssetAction } from './actions';

export function DeleteMediaButton({ id, url }: { id: string; url: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this media asset record?')) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    const result = await deleteMediaAssetAction(id);
    if (!result.success) {
      setError(result.error || 'Failed to delete');
      setIsDeleting(false);
    }
  };

  return (
    <div className="inline-block">
      {error && <span className="text-xs text-red-600 mr-2">{error}</span>}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-1 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded transition-colors inline-flex items-center gap-1 text-xs disabled:opacity-50"
        title="Delete asset record"
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
      </button>
    </div>
  );
}
