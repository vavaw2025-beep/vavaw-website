# Phase 37: Lead Email Notifications

## Overview
Phase 37 introduced an internal email notification system using a new `packages/notifications` module to send alerts when public leads are submitted.

## Providers
The notification system is abstracted behind an `EMAIL_PROVIDER` environment variable:
- `noop` (default): Skips sending emails safely.
- `console`: Logs a safe, non-PII summary to the server console (ideal for local development).
- `resend`: Uses the Resend API to send internal notifications.

## Privacy & Security Rules
- No PII (Full Name, Email, Phone, Message) is logged to the server console.
- No PII is sent to the Analytics tracking system.
- API Keys and Emails are strictly server-side only (no `NEXT_PUBLIC_` prefixes).
- Internal emails contain PII but are strictly sent only to the internal `LEAD_NOTIFICATION_TO` address.

## Failure Tolerance
- Email notifications are wrapped in a 5-second timeout.
- They execute within a `try/catch` block.
- Any email failure is gracefully handled on the server and does not fail or delay the API response sent to the client.

## Environment Variables
Ensure the following variables are configured in the root `.env` and app-specific `.env` files for production:
```
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_...
LEAD_NOTIFICATION_TO=admin@example.com
LEAD_NOTIFICATION_FROM=onboarding@resend.dev
```
