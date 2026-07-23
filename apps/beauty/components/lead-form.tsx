'use client';

import React, { useState } from 'react';
import { trackEvent } from '@vavaw/analytics';

export function LeadForm() {
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
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to submit form');
      }

      setStatus('success');
      trackEvent('lead_submitted', { 
        app: 'beauty', 
        source_app: 'beauty', 
        lead_type: 'beauty_booking'
      });
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto bg-white p-8 rounded-xl shadow-sm border border-[#f4f1eb]">
      <h3 className="text-2xl font-serif text-center mb-6">Book an Appointment</h3>
      
      {status === 'success' && (
        <div className="bg-green-50 text-green-700 p-4 rounded-md text-sm">
          Thank you! We've received your booking request and will contact you shortly to confirm.
        </div>
      )}
      
      {status === 'error' && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md text-sm">
          {errorMsg}
        </div>
      )}

      {/* Honeypot field */}
      <div className="hidden">
        <label htmlFor="website">Website (Leave blank)</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="space-y-1">
        <label htmlFor="full_name" className="block text-sm text-[#525252]">Full Name <span className="text-red-500">*</span></label>
        <input required type="text" id="full_name" name="full_name" className="w-full rounded border border-[#e5e5e5] px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm text-[#525252]">Email</label>
          <input type="email" id="email" name="email" className="w-full rounded border border-[#e5e5e5] px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
        </div>
        <div className="space-y-1">
          <label htmlFor="phone" className="block text-sm text-[#525252]">Phone</label>
          <input type="tel" id="phone" name="phone" className="w-full rounded border border-[#e5e5e5] px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
        </div>
      </div>
      <p className="text-xs text-[#a3a3a3] -mt-1">Please provide at least an email or phone number.</p>

      <div className="space-y-1">
        <label htmlFor="message" className="block text-sm text-[#525252]">Service requested / Notes</label>
        <textarea id="message" name="message" rows={3} maxLength={2000} className="w-full rounded border border-[#e5e5e5] px-3 py-2 text-sm resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"></textarea>
      </div>

      <button 
        type="submit" 
        disabled={status === 'loading'}
        className="w-full bg-primary text-primary-foreground font-serif py-3 px-4 rounded hover:bg-primary/90 disabled:opacity-50 transition-colors mt-4"
      >
        {status === 'loading' ? 'Sending...' : 'Request Booking'}
      </button>
    </form>
  );
}
