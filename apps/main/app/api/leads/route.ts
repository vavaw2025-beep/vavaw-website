import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createLead } from '@vavaw/db';
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
    const lead_type = body.lead_type ?? body.leadType;
    const website = body.website;

    // Honeypot check
    if (website) {
      return NextResponse.json({ success: true }); // Silently drop spam
    }

    if (!full_name || full_name.trim() === '') {
      return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
    }

    if ((!email || email.trim() === '') && (!phone || phone.trim() === '')) {
      return NextResponse.json({ error: 'Email or phone is required' }, { status: 400 });
    }

    const validLeadTypes = ['general_contact', 'cosmetic_interest', 'beauty_booking', 'franchise_application'];
    if (lead_type && !validLeadTypes.includes(lead_type)) {
      return NextResponse.json({ error: 'Invalid lead type' }, { status: 400 });
    }

    if (message && message.length > 2000) {
      return NextResponse.json({ error: 'Message is too long' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await createLead(supabase, {
      source_app: 'main',
      source_path: source_path || '/',
      lead_type: lead_type || 'general_contact',
      full_name: full_name.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      company_name: company_name?.trim() || null,
      message: message?.trim() || null,
      metadata: {},
    });

    if (error) {
      captureError(error, {
        app: 'main',
        feature: 'api_leads_insert',
        severity: 'error',
      });
      console.error('Lead insert error:', error.message);
      return NextResponse.json({ error: 'Failed to submit lead' }, { status: 500 });
    }

    try {
      const emailResult = await sendLeadNotification({
        sourceApp: 'main',
        sourcePath: source_path || '/',
        leadType: lead_type || 'general_contact',
        fullName: full_name.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        companyName: company_name?.trim() || null,
        message: message?.trim() || null,
        leadId: data?.id || 'unknown',
        createdAt: data?.created_at || new Date().toISOString(),
      });

      if (emailResult.ok) {
        trackEvent('lead_notification_sent', {
          app: 'main',
          source_app: 'main',
          lead_type: lead_type || 'general_contact',
          entityId: data?.id,
          provider: process.env.EMAIL_PROVIDER || 'noop',
          status: emailResult.skipped ? 'skipped' : 'sent'
        });
      } else {
        trackEvent('lead_notification_failed', {
          app: 'main',
          source_app: 'main',
          lead_type: lead_type || 'general_contact',
          entityId: data?.id,
          provider: process.env.EMAIL_PROVIDER || 'noop',
          status: 'failed'
        });
      }
    } catch (e) {
      captureError(e, {
        app: 'main',
        feature: 'api_leads_notification',
        severity: 'warning',
      });
      console.error('Lead notification error:', e);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    captureError(err, {
      app: 'main',
      feature: 'api_leads_route',
      severity: 'error',
    });
    console.error('Lead API error:', err.message);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
