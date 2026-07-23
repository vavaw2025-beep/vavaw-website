"use client";

import { Ban, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { disableAdminProfileAction } from './actions';

interface DisableUserButtonProps {
  userId: string;
}

export function DisableUserButton({ userId }: DisableUserButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const handleDisable = async () => {
    if (!window.confirm('Are you sure you want to disable this user? They will lose access immediately.')) {
      return;
    }
    
    setIsPending(true);
    const result = await disableAdminProfileAction(userId);
    
    if (!result.success) {
      alert(result.error);
      setIsPending(false);
    }
    // On success, Next.js revalidatePath will refresh the page automatically
  };

  return (
    <button
      onClick={handleDisable}
      disabled={isPending}
      className="inline-flex items-center gap-1 text-xs font-medium text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
      title="Disable user"
    >
      {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Ban className="h-3 w-3" />}
      Disable
    </button>
  );
}
