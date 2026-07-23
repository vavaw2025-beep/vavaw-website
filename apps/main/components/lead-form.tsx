'use client';

import React, { useState } from 'react';
import { trackEvent } from '@vavaw/analytics';
import { useSearchParams } from 'next/navigation';

export function LeadForm() {
  const searchParams = useSearchParams();
  const defaultType = searchParams?.get('type') || 'general_contact';
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          source_path: window.location.pathname,
          lead_type: data.lead_type || defaultType,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to submit form');
      }

      setStatus('success');
      trackEvent('lead_submitted', { 
        app: 'main', 
        source_app: 'main', 
        lead_type: (data.lead_type as string) || defaultType 
      });
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto bg-card text-card-foreground p-8 rounded-xl shadow-sm border border-border">
      {status === 'success' && (
        <div className="bg-green-50 text-green-700 p-4 rounded-md">
          Thank you! We've received your message and will be in touch shortly.
        </div>
      )}
      
      {status === 'error' && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          {errorMsg}
        </div>
      )}

      {/* Honeypot field */}
      <div className="hidden">
        <label htmlFor="website">Website (Leave blank)</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="space-y-2">
        <label htmlFor="full_name" className="block text-sm font-medium">Full Name <span className="text-destructive">*</span></label>
        <input required type="text" id="full_name" name="full_name" className="w-full rounded-md border-input bg-background px-3 py-2 text-sm" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input type="email" id="email" name="email" className="w-full rounded-md border-input bg-background px-3 py-2 text-sm" />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium">Phone</label>
          <input type="tel" id="phone" name="phone" className="w-full rounded-md border-input bg-background px-3 py-2 text-sm" />
        </div>
      </div>
      <p className="text-xs text-muted-foreground -mt-2">Please provide at least an email or phone number.</p>

      <div className="space-y-2">
        <label htmlFor="lead_type" className="block text-sm font-medium">Inquiry Type</label>
        <select id="lead_type" name="lead_type" defaultValue={defaultType} className="w-full rounded-md border-input bg-background px-3 py-2 text-sm">
          <option value="general_contact">General Inquiry</option>
          <option value="cosmetic_interest">Cosmetics & Products</option>
          <option value="beauty_booking">Beauty Services</option>
          <option value="franchise_application">Franchise Opportunities</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-medium">Message</label>
        <textarea id="message" name="message" rows={4} maxLength={2000} className="w-full rounded-md border-input bg-background px-3 py-2 text-sm resize-none"></textarea>
      </div>

      <button 
        type="submit" 
        disabled={status === 'loading'}
        className="w-full bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
