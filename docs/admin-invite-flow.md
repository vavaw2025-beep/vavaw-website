# Admin Invite Flow

## Overview
This document outlines the Automated Supabase Auth Invite Flow added in Phase 40. This feature allows active owner users to invite new admin users directly from the Admin Dashboard, securely generating a Supabase Auth invitation without exposing sensitive keys to the browser.

## Required Environment Variables
The automated invite flow requires a `SUPABASE_SECRET_KEY` (or `SUPABASE_SERVICE_ROLE_KEY` fallback) to bypass Row Level Security (RLS) when creating users in Supabase Auth.
These must **never** be prefixed with `NEXT_PUBLIC_` and must **never** be exposed in Client Components.

```env
SUPABASE_SECRET_KEY=your-secret-key-here
# or
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Security Rules
- **Owner-only**: Only users with an active `owner` profile in `admin_profiles` can send invites.
- **Confirmation**: Inviting another `owner` requires an explicit confirmation checkbox in the UI.
- **Server-only**: `supabaseAdmin.auth.admin.inviteUserByEmail` runs strictly inside a Next.js Server Action (`inviteAdminUserAction`), powered by a dedicated server-only Supabase client (`createAdminClient`).
- **PII Protection**: Analytics and error monitoring strictly sanitize payloads. E-mails, full names, and raw tokens are never logged or stored in external analytics/monitoring systems.

## The Invite Flow
1. **Initiation**: The owner navigates to `apps/admin/app/users/new` and uses the "Invite by Email" form.
2. **Server Action**: The form submits to `inviteAdminUserAction`.
3. **Verification**: The server validates the caller's session, profile status, and permissions.
4. **Supabase Auth**: The server-only admin client calls `inviteUserByEmail`.
5. **Profile Creation**: A row is inserted into `public.admin_profiles` using the generated `user.id`. The new user's status defaults to `active` (allowing login once they set a password).
6. **Delivery**: Supabase dispatches an email to the invitee containing a magic link.
7. **Acceptance**: The invitee clicks the link, lands on the specified `redirectTo` URL, sets a password, and is fully authenticated.

## Manual UID Fallback
If the automated flow fails (e.g., due to a missing Service Key or an already existing Auth user), the platform supports a Manual UID entry flow:
1. The owner creates the user manually in the Supabase Dashboard.
2. The owner copies the generated UID.
3. The owner uses the "Manual UID Entry" tab in the Admin Dashboard to bind the UID to a new `admin_profiles` record.

## Failure Recovery
- **Missing Service Key**: If `SUPABASE_SECRET_KEY` is undefined, the invite action returns a clear, safe error indicating that automated invites are unconfigured.
- **Partial Failure (Profile Creation Failed)**: If the Supabase Auth invite succeeds but the `admin_profiles` insert fails, a safe error is presented to the user, suggesting they use the Manual UID fallback to reconcile the account.

## Production Smoke Test
To verify the automated invite flow in a production environment:
1. Ensure the Vercel/hosting environment has `SUPABASE_SECRET_KEY` correctly configured.
2. Ensure `NEXT_PUBLIC_ADMIN_URL` is correct.
3. Log in as an Owner.
4. Navigate to `/users/new`.
5. Send an invite to a test email address for an `editor` role.
6. Verify the invite email is received.
7. Verify the new user appears in the `/users` table.
8. Follow the invite link and confirm successful password setup and login.
