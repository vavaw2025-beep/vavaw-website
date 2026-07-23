import React, { Suspense } from 'react';
import { LeadForm } from '../../components/lead-form';

export const metadata = {
  title: 'Contact Us | VAVAW',
  description: 'Get in touch with the VAVAW team for cosmetics, beauty, and franchise inquiries.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-background flex flex-col items-center">
      <div className="container mx-auto px-4 max-w-2xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-light mb-6 tracking-tight">Contact Us</h1>
        <p className="text-muted-foreground text-lg font-light leading-relaxed">
          We would love to hear from you. Please fill out the form below and our team will get back to you shortly.
        </p>
      </div>
      
      <div className="w-full px-4">
        <Suspense fallback={<div className="text-center p-8">Loading form...</div>}>
          <LeadForm />
        </Suspense>
      </div>
    </div>
  );
}
