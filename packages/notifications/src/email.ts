import { LeadNotificationInput, EmailSendResult } from './types';
import { Resend } from 'resend';

// Helper for timeout
const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Email provider timeout'));
    }, ms);
    promise.then(
      (value) => { clearTimeout(timer); resolve(value); },
      (error) => { clearTimeout(timer); reject(error); }
    );
  });
};

export const sendLeadNotification = async (input: LeadNotificationInput): Promise<EmailSendResult> => {
  const provider = process.env.EMAIL_PROVIDER || 'noop';

  if (provider === 'noop') {
    return { ok: true, skipped: true };
  }

  if (provider === 'console') {
    // Only in development typically, safe logging
    console.log('[Lead Notification]', {
      sourceApp: input.sourceApp,
      leadType: input.leadType,
      leadId: input.leadId,
      hasEmail: !!input.email,
      hasPhone: !!input.phone,
      hasMessage: !!input.message,
      createdAt: input.createdAt
    });
    return { ok: true, skipped: true };
  }

  if (provider === 'resend') {
    try {
      const apiKey = process.env.RESEND_API_KEY;
      const to = process.env.LEAD_NOTIFICATION_TO;
      const from = process.env.LEAD_NOTIFICATION_FROM;

      if (!apiKey || !to || !from) {
        console.error('[sendLeadNotification] Missing Resend configuration');
        return { ok: false, error: 'Missing configuration' };
      }

      const resend = new Resend(apiKey);
      
      const subjects: Record<string, string> = {
        'beauty_booking': '[VAVAW Lead] Beauty Booking',
        'franchise_application': '[VAVAW Lead] Franchise Application',
        'cosmetic_interest': '[VAVAW Lead] Cosmetic Interest',
        'general_contact': '[VAVAW Lead] General Contact',
      };
      
      const subject = subjects[input.leadType] || '[VAVAW Lead] New Submission';

      const emailPromise = resend.emails.send({
        from,
        to,
        subject,
        html: `
          <h2>New Lead Submitted</h2>
          <p><strong>App:</strong> ${input.sourceApp}</p>
          <p><strong>Type:</strong> ${input.leadType}</p>
          <p><strong>Path:</strong> ${input.sourcePath}</p>
          <p><strong>Lead ID:</strong> ${input.leadId}</p>
          <p><strong>Date:</strong> ${input.createdAt}</p>
          <hr />
          <h3>Contact Details</h3>
          <p><strong>Name:</strong> ${input.fullName}</p>
          <p><strong>Email:</strong> ${input.email || 'N/A'}</p>
          <p><strong>Phone:</strong> ${input.phone || 'N/A'}</p>
          <p><strong>Company:</strong> ${input.companyName || 'N/A'}</p>
          <h3>Message</h3>
          <p>${input.message ? input.message.replace(/\\n/g, '<br/>') : 'N/A'}</p>
        `
      });

      // Wrap in 5 seconds timeout
      const { data, error } = await withTimeout(emailPromise, 5000);

      if (error) {
        console.error('[sendLeadNotification] Resend API Error:', error.name, error.message);
        return { ok: false, error: error.message };
      }

      return { ok: true };
    } catch (err: any) {
      console.error('[sendLeadNotification] Exception:', err.message);
      return { ok: false, error: err.message };
    }
  }

  return { ok: false, error: 'Unknown provider' };
};
