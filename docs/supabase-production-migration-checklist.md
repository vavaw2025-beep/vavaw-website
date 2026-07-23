# Supabase Production Migration Checklist

This document details the exact sequence and steps required to apply database migrations, establish storage buckets, setup RLS policies, and configure the initial Owner account for the VAVAW Platform in production.

---

## 1. Migration Execution Order

Execute the SQL scripts in the `supabase/migrations/` directory strictly in numerical order against your production Supabase database instance using the Supabase CLI (`supabase db push`) or the Supabase SQL Editor:

1. **`001_initial_cms_schema.sql`**
   - Creates core tables: `business_entries`, `hero_slides`, `media_assets`, `seo_settings`, `redirects`, `content_blocks`.
   - Establishes RLS policies for active public reading and authenticated admin mutations.
2. **`002_storage_policies.sql`**
   - Configures RLS policies for storage objects in `storage.objects`.
3. **`003_admin_profiles_management_policies.sql`**
   - Creates `admin_profiles` table for Role-Based Access Control (`owner`, `admin`, `editor`, `viewer`).
   - Restricts profile mutations strictly to active `owner` users.
4. **`004_leads_schema.sql`**
   - Creates `leads` table and honeypot/anti-spam constraints.
   - Grants public `INSERT` permission only (no public `SELECT`/`UPDATE`/`DELETE`).
5. **`005_video_media_support.sql`**
   - Adds additive columns `mime_type`, `size_bytes`, and `metadata` to `media_assets` to support video uploads up to 50MB.
6. **`006_audit_logs.sql`**
   - Creates `audit_logs` append-only table.
   - Enforces RLS: `SELECT` for active `owner`/`admin`, `INSERT` for `owner`/`admin`/`editor`, no `UPDATE` or `DELETE` policies.

---

## 2. Supabase Storage Setup

1. Go to **Supabase Dashboard > Storage**.
2. Create a new storage bucket named **`vavaw-media`**.
3. Set the bucket to **Public** (`Public: true`).
4. Ensure storage policies from `002_storage_policies.sql` are active (Public `SELECT`, Authenticated Admin `INSERT`/`DELETE`).

---

## 3. Initial Owner Account Creation

To set up the first system Owner without exposing service role keys:

1. Register/Create the first user account in **Supabase Dashboard > Authentication > Users** (e.g., `owner@vavaw.vn`).
2. Copy the generated Auth **UID** (`uuid`).
3. Run the following SQL query in the **Supabase SQL Editor**:

```sql
insert into public.admin_profiles (id, email, full_name, role, status)
values ('<PASTE-SUPABASE-AUTH-UID-HERE>', 'owner@vavaw.vn', 'System Owner', 'owner', 'active')
on conflict (id) do update set role = 'owner', status = 'active';
```

---

## 4. Automated Admin Invite Setup

1. Copy the **Service Role Key** or **Secret Key** from **Supabase Dashboard > Project Settings > API**.
2. Add `SUPABASE_SECRET_KEY` (or `SUPABASE_SERVICE_ROLE_KEY`) and `NEXT_PUBLIC_ADMIN_URL` to your Vercel Environment Variables for `vavaw-admin`.
3. In Supabase Dashboard under **Auth Settings > Email Templates > Invite User**, ensure the redirect URL whitelist includes `https://admin.vavaw.vn/login?invited=true`.

---

## 5. RLS Verification Steps

Run the following checks to verify RLS integrity before switching public apps to `CMS_DATA_SOURCE=supabase`:

- [ ] Anonymous HTTP request to `/rest/v1/leads` returns **401 Unauthorized** or **empty array**.
- [ ] Anonymous HTTP request to `/rest/v1/audit_logs` returns **401 Unauthorized**.
- [ ] Anonymous HTTP request to `/rest/v1/admin_profiles` returns **401 Unauthorized**.
- [ ] Anonymous HTTP request to `/rest/v1/business_entries?status=eq.active` returns active items.
- [ ] Anonymous HTTP request to `/rest/v1/business_entries?status=eq.draft` returns **empty array**.

---

## 6. Rollback Notes

If issues occur during initial database deployment:
- Table schemas use `CREATE TABLE IF NOT EXISTS` and additive migration columns.
- Rollback of app features can be achieved instantly by setting `CMS_DATA_SOURCE=static` in public app environment variables without dropping database tables.
