"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { deleteContentBlockAction } from './actions';

interface DeleteContentBlockButtonProps {
  id: string;
  title: string;
}

export function DeleteContentBlockButton({ id, title }: DeleteContentBlockButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Delete content block "${title}"? This action cannot be undone.`)) return;

    setIsDeleting(true);
    const result = await deleteContentBlockAction(id);

    if (!result.success) {
      alert(result.error || 'Failed to delete content block.');
      setIsDeleting(false);
    } else {
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-900 font-medium text-sm inline-flex items-center gap-1 disabled:opacity-50"
      aria-label={`Delete content block: ${title}`}
    >
      <Trash2 className="h-4 w-4" />
      <span>{isDeleting ? 'Deleting…' : 'Delete'}</span>
    </button>
  );
}
