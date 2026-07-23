import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentAdminProfile } from '../../lib/admin-profile';
import { getAdminServerSupabaseClient } from '../../lib/supabase-server';
import { canViewAuditLogs } from '@vavaw/auth';
import { getAuditLogs } from '@vavaw/db';

export const metadata = {
  title: 'Audit Logs | VAVAW Admin',
  description: 'View administrative system audit logs.',
};

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<{
    action?: string;
    entity_type?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
  }>;
}) {
  const profile = await getCurrentAdminProfile();

  if (!profile || !canViewAuditLogs(profile)) {
    redirect('/?error=forbidden');
  }

  const params = await searchParams;
  const actionFilter = params.action || '';
  const entityTypeFilter = params.entity_type || '';
  const statusFilter = params.status || '';
  const dateFrom = params.date_from || '';
  const dateTo = params.date_to || '';

  const supabase = await getAdminServerSupabaseClient();
  const { data: logs, count } = await getAuditLogs(supabase, {
    action: actionFilter === 'all' || !actionFilter ? undefined : actionFilter,
    entity_type: entityTypeFilter === 'all' || !entityTypeFilter ? undefined : entityTypeFilter,
    status: statusFilter === 'all' || !statusFilter ? undefined : (statusFilter as any),
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    limit: 100,
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Append-only system activity log for administrative actions.
          </p>
        </div>
        <div className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          Total: {count} logs
        </div>
      </div>

      {/* Filters Form */}
      <form method="GET" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Action</label>
          <input
            type="text"
            name="action"
            defaultValue={actionFilter}
            placeholder="e.g. lead_exported"
            className="w-full text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Entity Type</label>
          <input
            type="text"
            name="entity_type"
            defaultValue={entityTypeFilter}
            placeholder="e.g. user, lead, media"
            className="w-full text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
          <select
            name="status"
            defaultValue={statusFilter}
            className="w-full text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="success">Success</option>
            <option value="failure">Failure</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Date From</label>
          <input
            type="date"
            name="date_from"
            defaultValue={dateFrom}
            className="w-full text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 focus:outline-none"
          />
        </div>
        <div className="flex items-end space-x-2">
          <button
            type="submit"
            className="w-full text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1.5 rounded transition-colors"
          >
            Filter
          </button>
          <Link
            href="/audit"
            className="text-xs bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 font-medium px-3 py-1.5 rounded transition-colors text-center"
          >
            Reset
          </Link>
        </div>
      </form>

      {/* Logs Table */}
      <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="py-2.5 px-4">Time</th>
              <th className="py-2.5 px-4">Actor</th>
              <th className="py-2.5 px-4">Role</th>
              <th className="py-2.5 px-4">Action</th>
              <th className="py-2.5 px-4">Entity</th>
              <th className="py-2.5 px-4">Status</th>
              <th className="py-2.5 px-4">Metadata</th>
              <th className="py-2.5 px-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500">
                  No audit log entries found.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-2.5 px-4 text-slate-500 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString('vi-VN')}
                  </td>
                  <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-slate-100">
                    {log.actor_email || log.actor_id || 'System'}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="capitalize px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px]">
                      {log.actor_role || 'n/a'}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-mono font-medium text-blue-600 dark:text-blue-400">
                    {log.action}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                    {log.entity_type}{log.entity_id ? `:${log.entity_id.slice(0, 8)}...` : ''}
                  </td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        log.status === 'success'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 max-w-xs truncate font-mono text-[11px] text-slate-500">
                    {JSON.stringify(log.metadata)}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <Link
                      href={`/audit/${log.id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
