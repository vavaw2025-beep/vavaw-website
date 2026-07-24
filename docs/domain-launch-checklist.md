# VAVAW Custom Domain Launch Checklist

## Overview
This document outlines the steps required to transition the VAVAW ecosystem from Vercel preview URLs to custom production domains.

## 1. Vercel Project Mapping & Custom Domains

Map the following Vercel projects to their respective production domains:

| App | Vercel Project Name | Custom Domain | Environment |
| --- | --- | --- | --- |
| **Main Portal** | `vavaw-main` | `vavaw.vn`, `www.vavaw.vn` | Production |
| **Beauty & Spa** | `vavaw-beauty` | `beauty.vavaw.vn` | Production |
| **Franchise Hub** | `vavaw-franchise` | `franchise.vavaw.vn` | Production |
| **Admin Dashboard** | `vavaw-admin` | `admin.vavaw.vn` | Production |

## 2. DNS Verification Checklist

Before finalizing the transition, verify that DNS records in your domain registrar (e.g., Cloudflare, Namecheap, GoDaddy) are correctly configured:

- [ ] **`vavaw.vn`**: Add an `A` record pointing to Vercel's IP address (`76.76.21.21`).
- [ ] **`www.vavaw.vn`**: Add a `CNAME` record pointing to `cname.vercel-dns.com`.
- [ ] **`beauty.vavaw.vn`**: Add a `CNAME` record pointing to `cname.vercel-dns.com`.
- [ ] **`franchise.vavaw.vn`**: Add a `CNAME` record pointing to `cname.vercel-dns.com`.
- [ ] **`admin.vavaw.vn`**: Add a `CNAME` record pointing to `cname.vercel-dns.com`.

*Note: DNS propagation may take up to 24-48 hours, though it typically takes a few minutes if using Cloudflare/Vercel nameservers.*

## 3. Production Migration & Storage Expectations

Before finalizing the launch, ensure the production Supabase project has the correct schema:

- [ ] Ensure **`vavaw-media`** storage bucket is created and set to public.
- [ ] Ensure migration `002_storage_policies.sql` is applied.
- [ ] Ensure migration `005_video_media_support.sql` is applied.
- [ ] Verify `media_assets` table contains columns: `mime_type`, `size_bytes`, `metadata`.

## 4. SSL Verification Checklist

Vercel automatically provisions Let's Encrypt SSL certificates for custom domains. After adding domains in the Vercel dashboard:

- [ ] Verify that Vercel reports the certificate as **Issued** for all domains.
- [ ] Test access to all URLs over `https://` in an incognito window.
- [ ] Ensure that `www.vavaw.vn` correctly redirects to `vavaw.vn` (configured in Vercel domain settings).

## 5. Environment Variables Update

After domain launch, update environment variables across the platform in Vercel:

### For `vavaw-main`:
- [ ] `NEXT_PUBLIC_SITE_URL=https://vavaw.vn`
- [ ] `NEXT_PUBLIC_BEAUTY_URL=https://beauty.vavaw.vn`
- [ ] `NEXT_PUBLIC_FRANCHISE_URL=https://franchise.vavaw.vn`
- [ ] `NEXT_PUBLIC_ADMIN_URL=https://admin.vavaw.vn`
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `CMS_DATA_SOURCE`
- [ ] `REVALIDATION_SECRET` (if used)

### For `vavaw-beauty`:
- [ ] `NEXT_PUBLIC_SITE_URL=https://beauty.vavaw.vn`
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `CMS_DATA_SOURCE`
- [ ] `REVALIDATION_SECRET` (if used)

### For `vavaw-franchise`:
- [ ] `NEXT_PUBLIC_SITE_URL=https://franchise.vavaw.vn`
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `CMS_DATA_SOURCE`
- [ ] `REVALIDATION_SECRET` (if used)

### For `vavaw-admin`:
- [ ] `NEXT_PUBLIC_ADMIN_URL=https://admin.vavaw.vn`
- [ ] `ADMIN_AUTH_MODE=supabase`
- [ ] `NEXT_PUBLIC_ADMIN_AUTH_MODE=supabase`
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `REVALIDATION_SECRET` (if used)
- [ ] `MAIN_REVALIDATE_URL=https://vavaw.vn/api/revalidate`
- [ ] `BEAUTY_REVALIDATE_URL=https://beauty.vavaw.vn/api/revalidate`
- [ ] `FRANCHISE_REVALIDATE_URL=https://franchise.vavaw.vn/api/revalidate`

**Important rules:**
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` to public apps.
- Do not print `env` values in logs.

## 6. Supabase Auth Domain Configuration

Verify Supabase Authentication settings manually and configure the required URLs:

- [ ] **Site URL:** `https://admin.vavaw.vn`
- [ ] **Redirect URLs:** Add `https://admin.vavaw.vn/**`. (Keep `https://vavaw-admin.vercel.app/**` only if keeping preview login enabled).
- [ ] Do not remove working preview URLs until the production domain is fully verified.

## 7. Post-Domain Smoke Tests

Once DNS is propagated and SSL is active, perform the following checks on the live domains:

- [ ] **Main (`vavaw.vn`)**: Check Hero video/images load, click through to `/cosmetic`, submit a test lead.
- [ ] **Beauty (`beauty.vavaw.vn`)**: Verify elegant UI loads properly, submit a booking request.
- [ ] **Franchise (`franchise.vavaw.vn`)**: Verify professional UI loads properly, submit a franchise application.
- [ ] **Admin (`admin.vavaw.vn`)**: Log in with owner credentials via Supabase Auth, verify lead forms successfully created entries, check that the audit log recorded the actions. (See `docs/admin-operating-guide.md` for full operating procedures).

## 8. Rollback Steps

In the event of a critical failure during domain launch:

1. **Revert DNS**: Change the A/CNAME records back to their previous values (if migrating from an old host).
2. **Remove Domains in Vercel**: Navigate to Project > Settings > Domains and remove the custom domains.
3. **Revert Supabase URLs**: Change Supabase Site URL back to the Vercel `.vercel.app` domains to ensure Auth continues to work.
4. **Communicate**: Notify the team and rely on `.vercel.app` preview URLs until the issue is resolved.
