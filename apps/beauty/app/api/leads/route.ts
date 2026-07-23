import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createLead } from '@vavaw/db';
import { sendLeadNotification } from '@vavaw/notifications';
import { trackEvent } from '@vavaw/analytics';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { full_name, email, phone, company_name, message, source_path, website } = body;

    if (website) {
      return NextResponse.json({ success: true });
    }

    if (!full_name || (!email && !phone)) {
      return NextResponse.json({ error: 'Name and either email or phone are required' }, { status: 400 });
    }

    if (message && message.length > 2000) {
      return NextResponse.json({ error: 'Message is too long' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await createLead(supabase, {
      source_app: 'beauty',
      source_path: source_path || '/',
      lead_type: 'beauty_booking',
      full_name: full_name.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      company_name: company_name?.trim() || null,
      message: message?.trim() || null,
      metadata: {},
    });

    if (error) {
      console.error('Lead insert error:', error.message);
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
        leadId: data?.id || 'unknown',
        createdAt: data?.created_at || new Date().toISOString(),
      });

      if (emailResult.ok) {
        trackEvent('lead_notification_sent', {
          app: 'beauty',
          source_app: 'beauty',
          lead_type: 'beauty_booking',
          entityId: data?.id,
          provider: process.env.EMAIL_PROVIDER || 'noop',
          status: emailResult.skipped ? 'skipped' : 'sent'
        });
      } else {
        trackEvent('lead_notification_failed', {
          app: 'beauty',
          source_app: 'beauty',
          lead_type: 'beauty_booking',
          entityId: data?.id,
          provider: process.env.EMAIL_PROVIDER || 'noop',
          status: 'failed'
        });
      }
    } catch (e) {
      console.error('Lead notification error:', e);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Lead API error:', err.message);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
