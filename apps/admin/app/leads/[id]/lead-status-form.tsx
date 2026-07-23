'use client';

import React from 'react';
import { updateLeadStatusAction } from '../status-actions';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
    >
      {pending ? 'Updating...' : 'Update Status'}
    </button>
  );
}

export function LeadStatusForm({ leadId, currentStatus }: { leadId: string, currentStatus: string }) {
  return (
    <form action={updateLeadStatusAction} className="space-y-4">
      <input type="hidden" name="leadId" value={leadId} />
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Update Status</label>
        <select
          id="status"
          name="status"
          defaultValue={currentStatus}
          className="w-full rounded-md border-slate-300 bg-white dark:bg-slate-900 dark:border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="closed">Closed</option>
          <option value="spam">Spam</option>
        </select>
      </div>
      <SubmitButton />
    </form>
  );
}
