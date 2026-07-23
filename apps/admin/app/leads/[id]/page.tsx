import React from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { getLeadById } from '@vavaw/db';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LeadStatusForm } from './lead-status-form';

export const revalidate = 0;

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );

  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    redirect('/login');
  }

  // Check admin role
  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('role')
    .eq('id', sessionData.session.user.id)
    .single();

  const canUpdate = profile && ['owner', 'admin', 'editor'].includes(profile.role);

  const { data: lead, error } = await getLeadById(supabase, params.id);

  if (error || !lead) {
    notFound();
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/leads" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Leads
        </Link>
      </div>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{lead.full_name}</h1>
          <div className="text-sm text-slate-500 flex items-center gap-2">
            Submitted on {new Date(lead.created_at).toLocaleString()}
          </div>
        </div>
        <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg text-sm border border-slate-200 dark:border-slate-700">
          <div className="font-medium capitalize mb-1">Source: {lead.source_app}</div>
          <div className="text-slate-500">Type: {lead.lead_type.replace('_', ' ')}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-medium mb-4">Contact Information</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Email</dt>
                <dd className="mt-1 text-sm">{lead.email || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Phone</dt>
                <dd className="mt-1 text-sm">{lead.phone || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Company</dt>
                <dd className="mt-1 text-sm">{lead.company_name || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Source Path</dt>
                <dd className="mt-1 text-sm">{lead.source_path}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-medium mb-4">Message</h3>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md text-sm whitespace-pre-wrap">
              {lead.message || <span className="italic text-slate-500">No message provided.</span>}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-medium mb-4">Status Management</h3>
            {canUpdate ? (
              <LeadStatusForm leadId={lead.id} currentStatus={lead.status} />
            ) : (
              <div>
                <p className="text-sm mb-2">Current Status:</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300 uppercase">
                  {lead.status}
                </span>
                <p className="text-xs text-slate-500 mt-4">You do not have permission to change this.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
