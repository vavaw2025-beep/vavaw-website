import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createPublicLead } from '@vavaw/db';
import { sendLeadNotification } from '@vavaw/notifications';
import { trackEvent } from '@vavaw/analytics';
import { captureError } from '@vavaw/monitoring';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const full_name = body.full_name ?? body.fullName;
    const email = body.email;
    const phone = body.phone;
    const company_name = body.company_name ?? body.companyName;
    const message = body.message;
    const source_path = body.source_path ?? body.sourcePath;
    const website = body.website;

    if (website) {
      return NextResponse.json({ success: true });
    }

    if (!full_name || full_name.trim() === '') {
      return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
    }

    if ((!email || email.trim() === '') && (!phone || phone.trim() === '')) {
      return NextResponse.json({ error: 'Email or phone is required' }, { status: 400 });
    }

    if (message && message.length > 2000) {
      return NextResponse.json({ error: 'Message is too long' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseUrl.startsWith('http') || !supabaseKey) {
      console.warn("[leads] Supabase env invalid", {
        hasUrl: Boolean(supabaseUrl),
        hasAnonKey: Boolean(supabaseKey)
      });
      return NextResponse.json({ error: 'Supabase environment is not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const insertPayload = {
      source_app: 'beauty' as const,
      source_path: source_path || '/',
      lead_type: 'beauty_booking' as const,
      full_name: full_name.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      company_name: company_name?.trim() || null,
      message: message?.trim() || null,
      metadata: {},
    };

    const { success, error } = await createPublicLead(supabase, insertPayload);

    if (!success) {
      captureError(error, {
        app: 'beauty',
        feature: 'api_leads_insert',
        severity: 'error',
      });
      console.warn("[leads] Supabase insert failed", {
        reason: error?.message || String(error),
        source_app: insertPayload.source_app,
        lead_type: insertPayload.lead_type
      });
      return NextResponse.json({ error: 'Failed to submit lead' }, { status: 500 });
    }

    try {
      const emailResult = await sendLeadNotification({
        sourceApp: 'beauty',
        sourcePath: source_path || '/',
        leadType: 'beauty_booking',
        fullName: full_name.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        companyName: company_name?.trim() || null,
        message: message?.trim() || null,
        leadId: 'unknown',
        createdAt: new Date().toISOString(),
      });

      if (emailResult.ok) {
        trackEvent('lead_notification_sent', {
          app: 'beauty',
          source_app: 'beauty',
          lead_type: 'beauty_booking',
          entityId: 'unknown',
          provider: process.env.EMAIL_PROVIDER || 'noop',
          status: emailResult.skipped ? 'skipped' : 'sent'
        });
      } else {
        trackEvent('lead_notification_failed', {
          app: 'beauty',
          source_app: 'beauty',
          lead_type: 'beauty_booking',
          entityId: 'unknown',
          provider: process.env.EMAIL_PROVIDER || 'noop',
          status: 'failed'
        });
      }
    } catch (e) {
      captureError(e, {
        app: 'beauty',
        feature: 'api_leads_notification',
        severity: 'warning',
      });
      console.error('Lead notification error:', e);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    captureError(err, {
      app: 'beauty',
      feature: 'api_leads_route',
      severity: 'error',
    });
    console.error('Lead API error:', err.message);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
