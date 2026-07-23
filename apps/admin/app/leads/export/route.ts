import { NextRequest, NextResponse } from 'next/server';
import { getAdminServerSupabaseClient } from '../../../lib/supabase-server';
import { getCurrentAdminProfile } from '../../../lib/admin-profile';
import { canExportLeads } from '@vavaw/auth';
import { getLeads } from '@vavaw/db';
import { rowsToCsv } from '../../../lib/csv';
import { captureError, captureMessage } from '@vavaw/monitoring';
import { trackEvent } from '@vavaw/analytics';

const EXPORT_HARD_LIMIT = 5000;

export async function GET(request: NextRequest) {
  // 1. Authenticate
  const profile = await getCurrentAdminProfile();
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Authorize — only active owner/admin can export
  if (!canExportLeads(profile.role, profile.status)) {
    captureMessage('Forbidden lead export attempt', {
      app: 'admin',
      feature: 'lead_export',
      severity: 'warning',
      metadata: { role: profile.role, status: profile.status },
    });
    return NextResponse.json({ error: 'Forbidden. Owner or Admin role required.' }, { status: 403 });
  }

  // 3. Parse optional query filters
  const { searchParams } = request.nextUrl;
  const status = searchParams.get('status') as any | undefined;
  const source_app = searchParams.get('source_app') as any | undefined;
  const lead_type = searchParams.get('lead_type') as any | undefined;
  const date_from = searchParams.get('date_from') ?? undefined;
  const date_to = searchParams.get('date_to') ?? undefined;

  // 4. Fetch leads with normal authenticated RLS-respecting client
  try {
    const supabase = await getAdminServerSupabaseClient();
    const { data: leads, error } = await getLeads(supabase, {
      status: status || undefined,
      source_app: source_app || undefined,
      lead_type: lead_type || undefined,
      date_from,
      date_to,
      limit: EXPORT_HARD_LIMIT,
    });

    if (error) {
      captureError(error, {
        app: 'admin',
        feature: 'lead_export',
        severity: 'error',
        metadata: { status: status || 'all', source_app: source_app || 'all', lead_type: lead_type || 'all' },
      });
      trackEvent('leads_export_failed', {
        app: 'admin',
        metadata: { status: status || 'all', source_app: source_app || 'all', lead_type: lead_type || 'all' },
      });
      return NextResponse.json({ error: 'Failed to fetch leads.' }, { status: 500 });
    }

    if (!leads || leads.length === 0) {
      // Return empty CSV with just headers
      const emptyCsv = rowsToCsv(
        ['id', 'created_at', 'source_app', 'source_path', 'lead_type', 'status', 'full_name', 'email', 'phone', 'company_name', 'message'],
        []
      );
      return new NextResponse(emptyCsv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="leads-export-${new Date().toISOString().split('T')[0]}.csv"`,
          'Cache-Control': 'no-store',
        },
      });
    }

    // 5. Build CSV
    const headers = [
      'id', 'created_at', 'source_app', 'source_path', 'lead_type',
      'status', 'full_name', 'email', 'phone', 'company_name', 'message',
    ];

    const rows = leads.map((lead) => [
      lead.id,
      lead.created_at,
      lead.source_app,
      lead.source_path,
      lead.lead_type,
      lead.status,
      lead.full_name,
      lead.email ?? '',
      lead.phone ?? '',
      lead.company_name ?? '',
      lead.message ?? '',
    ]);

    const csv = rowsToCsv(headers, rows);

    // 6. Track analytics (no PII in payload)
    trackEvent('leads_exported', {
      app: 'admin',
      metadata: {
        rowCount: leads.length,
        status: status || 'all',
        source_app: source_app || 'all',
        lead_type: lead_type || 'all',
      },
    });

    const filename = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
        'X-Export-Rows': String(leads.length),
        'X-Export-Limit': String(EXPORT_HARD_LIMIT),
      },
    });
  } catch (err: any) {
    captureError(err, {
      app: 'admin',
      feature: 'lead_export',
      severity: 'error',
      metadata: { status: status || 'all', source_app: source_app || 'all' },
    });
    trackEvent('leads_export_failed', {
      app: 'admin',
      metadata: { status: status || 'all', source_app: source_app || 'all' },
    });
    return NextResponse.json({ error: 'Unexpected error during export.' }, { status: 500 });
  }
}
