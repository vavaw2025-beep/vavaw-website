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

## Middleware Implementation (Phase 17)

`apps/admin/middleware.ts` intercepts incoming requests to enforce authentication boundaries.

### Auth Modes: Mock vs Supabase
- **Mock Mode (`NEXT_PUBLIC_ADMIN_AUTH_MODE=mock`):** Middleware bypasses session checks completely to allow local UI development without backend connectivity.
- **Supabase Mode (`NEXT_PUBLIC_ADMIN_AUTH_MODE=supabase`):** Middleware invokes Supabase Auth via `@supabase/ssr` to validate user sessions and profile status.

### Protected Route List
- All administrative routes are protected by default: `/`, `/business`, `/hero`, `/media`, `/seo`, `/redirects`, `/content`, `/users`, `/settings`.
- Only unauthenticated public access paths are bypassed: `/login`, `/_next/*`, `/favicon.ico`, `/robots.txt`.

### Public `/login` Exemption
- `/login` is exempted from protection to avoid redirect loops for unauthenticated users.
- Query parameters on `/login` display error feedback:
  - `?error=session-expired`: Session token is invalid or missing.
  - `?error=no-admin-profile`: Authenticated user lacks an active record in `public.admin_profiles`.
  - `?error=disabled`: Admin user profile status is `disabled`.

### Admin Profile Guard
Even when authenticated with Supabase Auth, middleware queries `public.admin_profiles` to verify:
1. `status === 'active'`
2. `role` belongs to `['owner', 'admin', 'editor', 'viewer']`

## Security Notes
- **Never expose the service role key in the client.** `SUPABASE_SERVICE_ROLE_KEY` must never be prefixed with `NEXT_PUBLIC_` and must only be used in secure Node.js server environments or Edge functions.
- **Admin app must remain noindex.** Due to its sensitive nature, the admin dashboard must block crawlers using `robots.txt` and metadata.
- **Route protection is mandatory.** The admin app cannot be deployed to a production domain until Next.js Middleware route protection is enabled.

## Phase Plan
- **Phase 14:** Env + helpers ✅
- **Phase 15:** Database schema ✅
- **Phase 16:** Real admin login ✅
- **Phase 17:** Middleware protection ✅ (Current Phase)
- **Phase 18:** Admin CRUD (Implement content management) ✅
- **Phase 19:** Media upload (Integrate bucket storage) ✅
- **Phase 29:** Admin Users Management ✅
  - Owner can manage `admin_profiles` (create, edit, disable).
  - Manual Supabase Auth user creation required first.
  - Delete is explicitly not implemented (relying on `disabled` status).
  - Safety rules: Cannot disable self, cannot remove last active owner.
