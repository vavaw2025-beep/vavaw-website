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

export default async function AuditLogsPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const profile = await getCurrentAdminProfile();

  if (!profile || !canViewAuditLogs(profile)) {
    redirect('/?error=forbidden');
  }

  const params = await props.searchParams;
  const actionFilter = typeof params.action === 'string' ? params.action : '';
  const entityTypeFilter = typeof params.entity_type === 'string' ? params.entity_type : '';
  const statusFilterRaw = typeof params.status === 'string' ? params.status : '';
  const dateFrom = typeof params.date_from === 'string' ? params.date_from : '';
  const dateTo = typeof params.date_to === 'string' ? params.date_to : '';

  const supabase = await getAdminServerSupabaseClient();
  
  const directResult = await supabase
    .from("audit_logs")
    .select("id, actor_id, actor_role, action, entity_type, entity_id, status, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  console.warn("[audit] direct query result", {
    count: directResult.data?.length ?? 0,
    error: directResult.error?.message ?? null
  });

  const validStatuses = ['success', 'failure', 'failed'];
  const finalStatus = validStatuses.includes(statusFilterRaw) ? statusFilterRaw : undefined;

  const validDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const finalDateFrom = validDateRegex.test(dateFrom) ? dateFrom : undefined;
  const finalDateTo = validDateRegex.test(dateTo) ? dateTo : undefined;

  const filters = {
    action: actionFilter || undefined,
    entity_type: entityTypeFilter || undefined,
    status: finalStatus as any,
    date_from: finalDateFrom,
    date_to: finalDateTo,
    limit: 100,
  };

  const { data: logs, count, error: auditError } = await getAuditLogs(supabase, filters);

  console.warn("[audit] getAuditLogs result", {
    count: logs?.length || 0,
    error: auditError?.message ?? null,
    filters
  });

  const isDebug = params.debug === '1' && ['owner', 'admin'].includes(profile.role);

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

      {isDebug && (
        <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 font-mono text-xs text-amber-900 dark:text-amber-200 space-y-2">
          <h3 className="font-bold border-b border-amber-200 dark:border-amber-800 pb-1 mb-2">Owner Diagnostics</h3>
          <div>currentUserId exists: {profile ? 'true' : 'false'}</div>
          <div>currentProfileRole: {profile?.role}</div>
          <div>currentProfileStatus: {profile?.status}</div>
          <div>directAuditCount: {directResult.data?.length ?? 0}</div>
          <div>directAuditError: {directResult.error?.message || 'null'}</div>
          <div>getAuditLogsCount: {logs?.length ?? 0}</div>
          <div>getAuditLogsError: {auditError?.message || 'null'}</div>
          <div>
            normalizedFilters: {JSON.stringify(filters)}
          </div>
        </div>
      )}

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
            defaultValue={statusFilterRaw}
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
                    {log.actor_id ? `${log.actor_id.slice(0, 8)}...` : 'System'}
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
