# VAVAW Ecosystem: Backend & CMS Architecture Plan

## Overview
This document outlines the planned transition from a statically configured frontend ecosystem to a dynamic, database-backed Content Management System (CMS) powered by Supabase.

## Why Supabase?
Supabase will be utilized in later phases because it provides:
- **PostgreSQL Database**: Scalable and relational data storage.
- **Authentication**: Built-in JWT and session management for admin roles.
- **Row Level Security (RLS)**: Secure access control directly at the database layer.
- **Storage**: Asset hosting for media (images, videos).
- **Auto-generated APIs**: Fast data access for frontend apps without needing a heavy custom backend.
- **Realtime subscriptions**: Live updates for collaborative editing in the admin dashboard.

## Planned Database Tables
The database schema will mirror the existing `@vavaw/brand-config` static structure.

| Table Name | Description |
|---|---|
| `businesses` | Core brand entries (status, theme, navigation type). |
| `hero_slides` | Promotional slide configuration for the main homepage. |
| `media_assets` | Registry of all visual assets (backgrounds, previews, OG images, video). |
| `seo_settings` | Metadata configurations (titles, descriptions, keywords) per brand. |
| `redirects` | Routing map for internal and external navigation. |
| `content_blocks` | Future rich-text and component-driven marketing content. |

## Static Config → Database Table Mapping

This table shows which fields from the current `@vavaw/brand-config` `BusinessEntry` type map to each planned Supabase table.

| Static Config Field(s) | Database Table | Notes |
|---|---|---|
| `id`, `slug`, `name`, `category`, `status`, `navigationType`, `sortOrder`, `ctaLabel`, `title`, `subtitle`, `description`, `theme.*` | `businesses` | Core brand record, one row per business. |
| `title`, `subtitle`, `description`, `ctaLabel` (per slide) | `hero_slides` | Currently derived from `BusinessEntry` fields; will become independent slide records. |
| `media.backgroundImage`, `media.previewImage`, `media.ogImage`, `media.introVideo` | `media_assets` | Each asset becomes a row with `asset_type` discriminator. |
| `seo.title`, `seo.description`, `seo.keywords`, `seo.canonicalUrl` | `seo_settings` | One SEO row per business entry. |
| `href`, `redirectPath` | `redirects` | Navigation routes and redirect mappings. |
| *(future content)* | `content_blocks` | No current static equivalent; will hold CMS-managed marketing blocks. |

## Admin Routes & Management
The `apps/admin` dashboard will incrementally connect to these tables:
- `/business` -> manages `businesses`
- `/hero` -> manages `hero_slides`
- `/media` -> manages `media_assets` (and later Supabase Storage)
- `/seo` -> manages `seo_settings`
- `/redirects` -> manages `redirects`
- `/content` -> manages `content_blocks`
- `/settings` -> displays Backend/CMS connection status

## Migration Strategy
To ensure stability, the migration is phased:

### Phase 1: Static Config ✅ (Current)
- Single source of truth via `@vavaw/brand-config`.
- All apps read from static TypeScript config.
- No database connection required.

### Phase 2: Admin Read-Only ✅ (Current)
- Dashboard reads and displays static data.
- Backend/CMS status section shows connection states.
- `@vavaw/db` and `@vavaw/auth` packages define types only.

### Phase 3: Supabase Read (Future)
- Connect Supabase client in `@vavaw/db`.
- Next.js apps fetch data from Supabase instead of local config.
- Fallback to static config if Supabase is unreachable.
- Admin dashboard reads live data from database.

### Phase 4: Supabase Write/Edit (Future)
- Admin dashboard enables CRUD operations on Supabase.
- Authentication via `@vavaw/auth` using Supabase Auth.
- Role-based access control (owner, admin, editor, viewer).
- Optimistic UI updates with realtime sync.

### Phase 5: Storage Upload (Future)
- Admin dashboard enables media file uploads to Supabase Storage.
- Automatic image optimization and CDN integration.
- Media library management in `/media` admin route.

## Phase 15: Schema & RLS Implementation (Current)
The database schema has been defined in `supabase/migrations/001_initial_cms_schema.sql`.

### RLS Policy Summary
- **Public:** Can read active `business_entries`, active `redirects`, and `seo_settings` with `robots_index = true`.
- **Authenticated (Admin Profiles):** Can read all CMS tables if their profile has status = 'active'.
- **Editors:** Can update `content_blocks`, `hero_slides`, `seo_settings`, and `media_assets`.
- **Admins/Owners:** Can manage all CMS tables including `business_entries` and `redirects`. Only Owners can manage `admin_profiles`.

> **WARNING:** Always review RLS policies for security before deploying to a production Supabase instance.

### Applying Migrations Manually
To apply this schema manually to a remote Supabase project:
1. Log in to the Supabase Dashboard.
2. Go to the SQL Editor.
3. Copy the contents of `supabase/migrations/001_initial_cms_schema.sql` and run it.
4. (Optional) Run `supabase/seed/001_seed_static_business_entries.sql` to populate default data.

## Phase 18: Admin Read-Only Supabase Integration (Current)
In Phase 18, `apps/admin` was upgraded to dynamically fetch live data from Supabase when running in `supabase` mode, while maintaining full backwards compatibility with static config fallback.

### Key Highlights
- **Data Source Utility:** `apps/admin/lib/data-source.ts` determines whether pages query Supabase or use `@vavaw/brand-config`.
- **Typed Read Helpers:** `@vavaw/db` exports read functions for `business_entries`, `hero_slides`, `media_assets`, `seo_settings`, `redirects`, and `content_blocks`.
- **RLS Read Enforcement:** Queries rely on the caller's authenticated Supabase session. Database RLS policies govern which rows are returned.
- **Static Fallback:** In `mock` mode (`NEXT_PUBLIC_ADMIN_AUTH_MODE=mock`), zero database queries are executed; all admin routes read from static data.
- **Mutations Disabled:** Create, Update, and Delete actions remain disabled across all admin pages until Phase 19.
