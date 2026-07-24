'use client';

import React, { useState } from 'react';
import { trackEvent } from '@vavaw/analytics';
import { useSearchParams } from 'next/navigation';

export function LeadForm() {
  const searchParams = useSearchParams();
  const typeParam = searchParams?.get('type');
  const validTypes = ['general_contact', 'cosmetic_interest', 'beauty_booking', 'franchise_application'];
  const defaultType = typeParam && validTypes.includes(typeParam) ? typeParam : 'general_contact';
  
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
          source_app: 'main',
          source_path: window.location.pathname,
          lead_type: data.lead_type || defaultType,
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          message: data.message,
          website: data.website
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
    <form onSubmit={handleSubmit} className="space-y-8 max-w-lg mx-auto bg-card/60 backdrop-blur-md text-card-foreground p-8 md:p-12 shadow-2xl border border-border/50">
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
        <label htmlFor="full_name" className="block text-xs uppercase tracking-widest text-muted-foreground font-medium">Full Name <span className="text-destructive">*</span></label>
        <input required type="text" id="full_name" name="full_name" className="w-full rounded-none border-b border-input bg-transparent px-0 py-3 text-sm focus:border-primary focus:ring-0 transition-colors" placeholder="Your full name" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-xs uppercase tracking-widest text-muted-foreground font-medium">Email</label>
          <input type="email" id="email" name="email" className="w-full rounded-none border-b border-input bg-transparent px-0 py-3 text-sm focus:border-primary focus:ring-0 transition-colors" placeholder="email@example.com" />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-xs uppercase tracking-widest text-muted-foreground font-medium">Phone</label>
          <input type="tel" id="phone" name="phone" className="w-full rounded-none border-b border-input bg-transparent px-0 py-3 text-sm focus:border-primary focus:ring-0 transition-colors" placeholder="+1 (555) 000-0000" />
        </div>
      </div>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground -mt-2">Please provide at least an email or phone number.</p>

      <div className="space-y-2">
        <label htmlFor="lead_type" className="block text-xs uppercase tracking-widest text-muted-foreground font-medium">Inquiry Type</label>
        <select id="lead_type" name="lead_type" defaultValue={defaultType} className="w-full rounded-none border-b border-input bg-transparent px-0 py-3 text-sm focus:border-primary focus:ring-0 transition-colors">
          <option value="general_contact">General Inquiry</option>
          <option value="cosmetic_interest">Cosmetics & Products</option>
          <option value="beauty_booking">Beauty Services</option>
          <option value="franchise_application">Franchise Opportunities</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="block text-xs uppercase tracking-widest text-muted-foreground font-medium">Message</label>
        <textarea id="message" name="message" rows={3} maxLength={2000} className="w-full rounded-none border-b border-input bg-transparent px-0 py-3 text-sm resize-none focus:border-primary focus:ring-0 transition-colors" placeholder="How can we help you?"></textarea>
      </div>

      <button 
        type="submit" 
        disabled={status === 'loading'}
        className="w-full bg-primary text-primary-foreground font-medium text-[13px] tracking-[0.15em] uppercase h-[48px] px-6 hover:bg-primary/90 disabled:opacity-50 transition-colors rounded-none mt-4 flex items-center justify-center"
      >
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
