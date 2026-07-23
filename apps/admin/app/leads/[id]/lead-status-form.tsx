'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trackEvent } from '@vavaw/analytics';
import { createBrowserClient } from '@supabase/ssr';
import { updateLeadStatus } from '@vavaw/db';

export function LeadStatusForm({ leadId, currentStatus }: { leadId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleUpdate = async () => {
    setIsUpdating(true);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { error } = await updateLeadStatus(supabase, leadId, status as any);
    setIsUpdating(false);

    if (error) {
      alert('Failed to update status');
    } else {
      trackEvent('lead_status_updated', {
        app: 'admin',
        source_app: 'admin',
        status: status,
      });
      router.refresh();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Update Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-md border-slate-300 bg-white dark:bg-slate-900 dark:border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="closed">Closed</option>
          <option value="spam">Spam</option>
        </select>
      </div>
      <button
        onClick={handleUpdate}
        disabled={isUpdating || status === currentStatus}
        className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {isUpdating ? 'Updating...' : 'Update Status'}
      </button>
    </div>
  );
}
