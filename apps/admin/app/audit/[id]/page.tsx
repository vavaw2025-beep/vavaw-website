import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentAdminProfile } from '../../../lib/admin-profile';
import { getAdminServerSupabaseClient } from '../../../lib/supabase-server';
import { canViewAuditLogs } from '@vavaw/auth';
import { getAuditLogById } from '@vavaw/db';

export const metadata = {
  title: 'Audit Log Details | VAVAW Admin',
};

export default async function AuditLogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const profile = await getCurrentAdminProfile();

  if (!profile || !canViewAuditLogs(profile)) {
    redirect('/?error=forbidden');
  }

  const { id } = await params;
  const supabase = await getAdminServerSupabaseClient();
  const log = await getAuditLogById(supabase, id);

  if (!log) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold text-red-600">Audit log record not found</h1>
        <Link href="/audit" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
          &larr; Back to Audit Logs
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/audit" className="text-xs text-blue-600 hover:underline mb-1 block">
            &larr; Back to Audit Logs
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Audit Record Detail</h1>
        </div>
        <span
          className={`px-3 py-1 rounded text-xs font-semibold ${
            log.status === 'success'
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
          }`}
        >
          {log.status.toUpperCase()}
        </span>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block">Record ID</span>
            <span className="font-mono font-medium">{log.id}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Created At</span>
            <span className="font-medium">{new Date(log.created_at).toLocaleString('vi-VN')}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Actor</span>
            <span className="font-medium">{log.actor_email || log.actor_id || 'System'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Actor Role</span>
            <span className="font-mono capitalize font-medium">{log.actor_role || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Action</span>
            <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{log.action}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Entity</span>
            <span className="font-mono font-medium">{log.entity_type} {log.entity_id ? `(${log.entity_id})` : ''}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Sanitized Metadata (JSON)</h2>
          <pre className="p-4 bg-slate-950 text-slate-100 font-mono text-xs rounded-md overflow-x-auto border border-slate-800">
            {JSON.stringify(log.metadata, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
