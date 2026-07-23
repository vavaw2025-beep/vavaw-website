# Phase 36: Public Contact / Lead Forms

## Overview
Added public lead capture forms across the VAVAW ecosystem (Main, Beauty, Franchise) and built an admin lead management UI, ensuring strict security and spam prevention.

## Database Schema (public.leads)
- \id\: UUID (Primary Key)
- \source_app\: text (main, cosmetic, beauty, franchise)
- \source_path\: text (page URL where the lead submitted)
- \lead_type\: text (general_contact, cosmetic_interest, beauty_booking, franchise_application)
- \ull_name\: text (Required)
- \email\: text (Optional if phone is provided)
- \phone\: text (Optional if email is provided)
- \company_name\: text (Optional, primarily for B2B/Franchise)
- \message\: text (Max 2000 chars)
- \status\: text (new, contacted, qualified, closed, spam) - Default: 'new'
- \metadata\: jsonb
- \created_at\, \updated_at\: timestamptz

## Security & Anti-Spam
- **RLS**:
  - \non/public\: Can only INSERT (no SELECT, UPDATE, DELETE).
  - \uthenticated\ (Active Admin): Can SELECT.
  - \uthenticated\ (Owner/Admin/Editor): Can UPDATE status.
  - Hard deletions are disabled for MVP to retain all lead history.
- **Honeypot**: 
  - A hidden input field \website\ is included in all forms. 
  - If filled (by spam bots), the API silently returns success but drops the submission without writing to the database.
- **Validation**: 
  - Server-side validation requires a name and at least one contact method (email or phone). Max message length enforced.

## API Integration
- \POST /api/leads\ route exists in each public app (\main\, \eauty\, \ranchise\).
- Uses the anonymous Supabase client to insert records (safe due to RLS).
- Client-side tracking triggers a \lead_submitted\ analytics event on success.

## Admin Features
- **Leads List**: \/leads\ shows all leads sorted by date.
- **Lead Detail**: \/leads/[id]\ displays full contact info and message.
- **Status Management**: Owners, Admins, and Editors can change the lead status (e.g., from 'new' to 'contacted').

## Future Enhancements
- Email notifications to admins upon new lead submission (requires Resend or similar).
- Auto-responder emails to the lead acknowledging receipt.
- Export to CSV for CRM integration.
- Advanced CAPTCHA if honeypot becomes insufficient.

## Phase 37: Lead Email Notifications
- Abstracted email notifications to a separate \@vavaw/notifications\ package.
- Setup Resend integration with \EMAIL_PROVIDER\ config.
- Non-blocking email dispatch after a successful lead submission.
