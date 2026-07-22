"use client";

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteHeroSlideAction } from './actions';

export function DeleteHeroButton({ id, title }: { id: string; title: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete slide "${title}"?`)) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    const result = await deleteHeroSlideAction(id);
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
        className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center gap-1 disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
        <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
      </button>
    </div>
  );
}
