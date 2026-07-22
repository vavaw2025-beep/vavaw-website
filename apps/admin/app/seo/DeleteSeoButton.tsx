"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { deleteSeoSettingAction } from './actions';

interface DeleteSeoButtonProps {
  id: string;
  title: string;
}

export function DeleteSeoButton({ id, title }: DeleteSeoButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Delete SEO setting for "${title}"? This action cannot be undone.`)) return;

    setIsDeleting(true);
    const result = await deleteSeoSettingAction(id);

    if (!result.success) {
      alert(result.error || 'Failed to delete SEO setting.');
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
      aria-label={`Delete SEO setting: ${title}`}
    >
      <Trash2 className="h-4 w-4" />
      <span>{isDeleting ? 'Deleting…' : 'Delete'}</span>
    </button>
  );
}
