# Supabase Auth Integration Plan

This document outlines the architecture and implementation plan for adding real Supabase Authentication to the VAVAW monorepo.

## Required Environment Variables

To fully connect Supabase Auth, the following environment variables are required at the root and within `apps/admin`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_AUTH_MODE=supabase
NEXT_PUBLIC_ADMIN_AUTH_MODE=supabase
```

## Admin Auth Flow Plan
1. Administrator navigates to `admin.vavaw.vn/login`.
2. Login uses `@supabase/ssr` to authenticate with email/password.
3. Upon success, Supabase sets session cookies.
4. Next.js middleware verifies the session cookie on every request to `admin.vavaw.vn/*`.
5. Unauthenticated requests are redirected back to `/login`.

## Role Model
The `@vavaw/auth` package defines the following static `AdminRole` hierarchy:
- **owner:** Full system access, settings, and destructive actions.
- **admin:** Can manage users and system configuration.
- **editor:** Can manage content entries (create, edit, delete).
- **viewer:** Read-only access to the dashboard and content.

## Middleware Plan
Next.js Middleware will be added in `apps/admin` (e.g. `apps/admin/middleware.ts`) to intercept all requests.
- It will refresh the Supabase session token.
- It will redirect to `/login` if no valid session is found.
- It will block access to protected settings pages based on user roles (enforced via database RLS or middleware server-side checks).

## Security Notes
- **Never expose the service role key in the client.** `SUPABASE_SERVICE_ROLE_KEY` must never be prefixed with `NEXT_PUBLIC_` and must only be used in secure Node.js server environments or Edge functions.
- **Admin app must remain noindex.** Due to its sensitive nature, the admin dashboard must block crawlers using `robots.txt` and metadata.
- **Route protection is mandatory.** The admin app cannot be deployed to a production domain until Next.js Middleware route protection is implemented.

## Phase Plan
- **Phase 14:** Env + helpers (Current Phase - sets up `@supabase/ssr` and placeholders)
- **Phase 15:** Database schema (Design and define tables/types in `@vavaw/db`)
- **Phase 16:** Real admin login (Replace mock UI with real Supabase sign in)
- **Phase 17:** Middleware protection (Secure all admin routes)
- **Phase 18:** Admin CRUD (Implement content management)
- **Phase 19:** Media upload (Integrate bucket storage)
