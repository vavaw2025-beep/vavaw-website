# Security & RLS Audit

## Overview
This document outlines the security architecture and Row Level Security (RLS) policies implemented in the VAVAW CMS database (Supabase). 

## RLS Policies Summary

### `admin_profiles`
- **SELECT**: Allowed for authenticated users with an `active` status and role of `owner` or `admin`. Viewers and editors cannot read this table.
- **INSERT**: Allowed only for authenticated, `active` users with the `owner` role.
- **UPDATE**: Allowed only for authenticated, `active` users with the `owner` role. (Note: Self-downgrade and self-disable are blocked in application logic via Server Actions).
- **DELETE**: Not implemented in Phase 29 to prevent orphaned records. Accounts are instead marked as `status = 'disabled'`.

### `business_entries`
- **SELECT (Public)**: Allowed for all users (anon) where `status = 'active'`.
- **SELECT (Admin)**: Allowed for any authenticated user with an `active` admin profile.
- **INSERT / UPDATE / DELETE**: Handled in application logic via Server Actions restricted to `owner` and `admin` roles. DB RLS allows standard admin access, but UI/Actions enforces stricter bounds.

### `hero_slides`
- **SELECT (Public)**: Allowed for all users (anon) where `status = 'active'`.
- **SELECT (Admin)**: Allowed for any authenticated user with an `active` admin profile.
- **INSERT / UPDATE**: Handled in application logic (allowed for `owner`, `admin`, `editor`).
- **DELETE**: Handled in application logic (allowed for `owner`, `admin`).

### `media_assets`
- **SELECT (Public)**: Allowed for all users (anon). (Assuming images are public).
- **SELECT (Admin)**: Allowed for any authenticated user with an `active` admin profile.
- **INSERT / UPDATE / DELETE**: Application logic enforces roles (`owner`, `admin`, `editor` for create/update; `owner`, `admin` for delete).

### `seo_settings`
- **SELECT (Public)**: Allowed for all users (anon) where `robots_index = true`.
- **SELECT (Admin)**: Allowed for any authenticated user with an `active` admin profile.

### `redirects`
- **SELECT (Public)**: Allowed for all users (anon) where `is_active = true`.
- **SELECT (Admin)**: Allowed for any authenticated user with an `active` admin profile.

### `content_blocks`
- **SELECT (Public)**: Allowed for all users (anon) where `is_active = true`.
- **SELECT (Admin)**: Allowed for any authenticated user with an `active` admin profile.

### `storage.objects` (vavaw-media bucket)
- **SELECT (Public)**: Allowed for all users (anon).
- **INSERT / UPDATE**: Allowed for authenticated users with an `active` admin profile and role in (`owner`, `admin`, `editor`).
- **DELETE**: Allowed for authenticated users with an `active` admin profile and role in (`owner`, `admin`).

## Application Security Constraints
1. **Service Role Key**: The `SUPABASE_SERVICE_ROLE_KEY` is completely excluded from client-side code and public applications. It is strictly used in secure Node.js server environments for admin bypass when necessary, though standard admin actions rely on RLS and active sessions.
2. **Mock Mode**: Admin mock mode is explicitly flagged as non-production and is strictly read-only.
3. **Public Apps**: All public apps (`apps/main`, `apps/beauty`, `apps/franchise`) only use the `NEXT_PUBLIC_SUPABASE_ANON_KEY` and depend on the `public` RLS policies for reading content.
4. **Analytics**: The `@vavaw/analytics` package tracks no PII, emails, or tokens.

### Admin Invites
- The \SUPABASE_SECRET_KEY\ bypasses RLS and is used exclusively on the server in \supabase-admin.ts\ for automated admin invites.
- Client components never receive this key.

