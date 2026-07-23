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

## Phase 19: Business Entries and Hero Slides CRUD (Current)
In Phase 19, full create, edit, update, and delete (CRUD) operations were enabled for `public.business_entries` and `public.hero_slides`.

### Key Highlights & Permissions
- **Business Entries Management:** Only `owner` and `admin` roles can create, edit, or delete records in `business_entries`.
- **Hero Slides Management:** `owner`, `admin`, and `editor` roles can create/edit records in `hero_slides`. Only `owner` and `admin` roles can delete hero slides. `viewer` role is restricted to read-only.
- **Server Actions & Security:** Server actions in `apps/admin/app/business/actions.ts` and `apps/admin/app/hero/actions.ts` validate user authentication, status (`active`), and role permissions server-side before executing mutations in `@vavaw/db`.
- **Mock Mode Safety:** In `mock` mode, CRUD operations remain completely disabled, UI buttons are hidden/notice displayed, and server actions reject mutation attempts.
- **Pending Integrations:** Media file uploads remain pending (Phase 20+). Public applications (`apps/main`, `apps/beauty`, `apps/franchise`) continue reading from static config as designed.

## Phase 20: Media Upload with Supabase Storage (Current)
Phase 20 integrates Supabase Storage for visual asset uploads within `apps/admin/app/media`.

### Key Highlights & Storage Policies
- **Bucket:** `vavaw-media` (Public read enabled).
- **Storage Policies (`supabase/migrations/002_storage_policies.sql`):** Public read access, upload/update access for active `owner`, `admin`, and `editor` profiles, delete access restricted to `owner` and `admin`.
- **Upload Action (`apps/admin/app/media/actions.ts`):** Validates file presence, mime types (JPG, PNG, WEBP, AVIF), file size (<= 5MB), uploads to target folder in `vavaw-media`, retrieves public URL, and inserts a row into `public.media_assets`.
- **UI Enhancements:** `/media` includes a Client upload form (`MediaUploadForm`), Copy URL button (`CopyUrlButton`), and Delete record button (`DeleteMediaButton`).
- **Limitations:** Image uploads only (video upload planned for future phases). Public applications continue reading static fallback assets until future frontend database integration.

## Phase 21: Hero Media Selection & Linking (Current)
Phase 21 connects uploaded `media_assets` to the Hero Slides CRUD workflow within `apps/admin`.

### Key Highlights
- **Media Asset Picker:** Create and Edit forms (`/hero/new`, `/hero/[id]/edit`) fetch registered `media_assets` and provide interactive `<select>` dropdowns with image thumbnail previews for `background_media_id` and `preview_media_id`.
- **Hero Card Rendering:** `/hero` resolves linked `background_media_id` and `preview_media_id` UUIDs against `media_assets` to render background images directly on hero slide management cards.
- **Empty State & UX:** If no media assets have been uploaded yet, a direct notice links administrators to `/media` to upload images first.
- **Public Apps Independence:** Public applications (`apps/main`, `apps/beauty`, `apps/franchise`) continue reading static configuration as designed until full frontend database integration.

## Phase 22: Public App CMS Read Integration (Current)
Phase 22 connects `apps/main` to Supabase for public read access, while keeping full static `@vavaw/brand-config` fallback.

### Architecture
- **Data Source Env:** `CMS_DATA_SOURCE` (default: `static`). Set to `supabase` to enable live CMS data.
- **Resolver:** `apps/main/lib/cms-source.ts` — reads the env var, returns `"static"` or `"supabase"`.
- **Public Supabase Client:** `apps/main/lib/supabase-public.ts` — uses `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`. No cookies, no service role key, no auth session.
- **CMS Loader:** `apps/main/lib/load-public-cms.ts` — exports `loadPublicHomeCms()`, returns normalized `businessEntries`, `heroSlides`, `mediaAssets`, and `source`.
- **Server Component:** `apps/main/app/page.tsx` is now `async` — fetches CMS data at request time and passes it to `BrandHero` as props.
- **Client Component:** `BrandHero` now accepts `slides: NormalizedHeroSlide[]` and `dataSource` props instead of calling brand-config directly.

### Fallback Strategy
In `supabase` mode, `loadPublicHomeCms()` automatically falls back to static if:
1. `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` is missing.
2. Any Supabase query returns an error.
3. `business_entries` result is empty (no active CMS records yet).

### Security
- Uses **anon key only** — never the service role key.
- RLS public read policies on `business_entries` (status=active), `hero_slides` (status=active), and `media_assets` must be enabled in Supabase.
- Never logs, exposes, or passes Supabase credentials to the client.

### Image Resolution (Hero)
For each `hero_slide`, background and preview images are resolved in order:
1. `background_media_id` → `media_assets.url`
2. Linked `business_entry` → `media.backgroundImage`
3. Empty string (gradient fallback rendered in UI)

### Development Badge
In `NODE_ENV=development`, a small badge (`Data: Static` / `Data: Supabase`) appears in the top-right corner of the hero so developers can confirm which data source is active. Hidden in production.

### Scope
- `apps/main` only. `apps/beauty` and `apps/franchise` remain static for now.
- Public apps are read-only — no CRUD, no auth on public routes.

## Phase 23: CMS-Driven Public Redirects + Runtime Safety (Current)
Phase 23 connects the `/go/[slug]` redirect route to Supabase CMS data and adds URL safety validation and ISR caching controls.

### Redirect Architecture
- **Redirect Loader:** `apps/main/lib/load-public-redirect.ts` — exports `loadPublicRedirectBySlug(slug)`. Returns a normalized `PublicRedirectResult` with `destinationUrl`, `source`, `status`, and optional `reason`.
- **Safety Validator:** `apps/main/lib/safe-redirect.ts` — exports `isSafeRedirectUrl(url)` and `resolveSafeRedirectUrl(url)`. Validates all destinations before any redirect is issued.
- **Route Handler:** `apps/main/app/go/[slug]/route.ts` — updated to use the new loader. Always `force-dynamic`. Falls back to "/" for unknown or unsafe slugs.

### Redirect Resolution Order (Supabase mode)
1. Query `public.business_entries` where `slug = input` and `status = active`.
2. Use `href` as destination (falling back to `redirect_path`).
3. Validate destination via `isSafeRedirectUrl()`.
4. On any failure (query error, no record, unsafe URL) → fall back to static config.
5. If no static entry either → redirect to `/`.

### Safe Redirect Rules
| URL type | Allowed? |
|---|---|
| Internal path starting with `/` (not `//`) | ✅ Yes |
| `https://vavaw.vn/*` | ✅ Yes |
| `https://beauty.vavaw.vn/*` | ✅ Yes |
| `https://franchise.vavaw.vn/*` | ✅ Yes |
| `https://admin.vavaw.vn/*` | ✅ Yes |
| `NEXT_PUBLIC_BEAUTY_URL` hostname | ✅ Yes |
| `NEXT_PUBLIC_FRANCHISE_URL` hostname | ✅ Yes |
| `javascript:`, `data:`, `vbscript:` | ❌ No |
| Protocol-relative `//evil.com` | ❌ No |
| Unknown external domain | ❌ No |
| Malformed URL | ❌ No |

### ISR Caching (Homepage)
- `CMS_PUBLIC_REVALIDATE_SECONDS` env var controls ISR interval (default: 60s).
- Set to `0` for fully dynamic (every request).
- In `static` mode, the page is pre-rendered at build time (no revalidation needed).
- Webhook-based on-demand revalidation is planned for a future phase.

### Development Diagnostics
- `console.warn` / `console.info` logged in `development` mode when fallback is triggered.
- Production: no diagnostic output, silent fallback.
- Dev badge in hero remains as implemented in Phase 22.

### Scope
- `apps/main` only. `apps/beauty` and `apps/franchise` remain static.
- Public apps are read-only — no CRUD, no admin auth on public routes.

## Phase 24: SEO CRUD + Public Metadata From CMS (Current)
Phase 24 enables admin management of `public.seo_settings` and connects `apps/main` page metadata to Supabase.

### Admin SEO CRUD

#### Permissions
| Action | Roles |
|---|---|
| Create / Update | owner, admin, editor |
| Delete | owner, admin |
| Read | all roles (including viewer) |

#### New Files
- `packages/db/src/mutations/seo-settings.ts` — `createSeoSetting`, `updateSeoSetting`, `deleteSeoSetting`
- `apps/admin/app/seo/actions.ts` — Server Actions with auth guards + `revalidatePath('/seo')`
- `apps/admin/app/seo/SeoForm.tsx` — Client form: site_key, path, title, description, keywords (comma-separated), canonical_url, og_media_id (media picker), robots_index/follow toggles
- `apps/admin/app/seo/DeleteSeoButton.tsx` — Client delete button with confirm dialog
- `apps/admin/app/seo/new/page.tsx` — Create SEO setting page
- `apps/admin/app/seo/[id]/edit/page.tsx` — Edit SEO setting page

#### Updated Files
- `apps/admin/app/seo/page.tsx` — Full CRUD table with Edit/Delete actions, mock-mode notice
- `packages/auth/src/types.ts` — Added `canManageSeo(role)` and `canDeleteSeo(role)`
- `apps/admin/app/settings/page.tsx` — Added SEO CRUD, metadata source, OG support, public integration status rows

### Public SEO Integration (apps/main)
- **Loader:** `apps/main/lib/load-public-seo.ts` — `loadPublicSeo(path)` returns normalized `PublicSeoData`
- **Source routing:** Uses `getCmsDataSource()` to decide between static and Supabase
- **Query:** `seo_settings` filtered by `site_key = "main"` and `path = input path`
- **OG resolution:** If `og_media_id` is set, fetches `media_assets.url` for OG image
- **Robots:** Reflects DB `robots_index` / `robots_follow` booleans in `Metadata.robots`

#### Updated Pages
- `apps/main/app/page.tsx` — Added `generateMetadata()` calling `loadPublicSeo('/')`
- `apps/main/app/cosmetic/page.tsx` — Replaced static `export const metadata` with `generateMetadata()` calling `loadPublicSeo('/cosmetic')`

### Fallback Rules
`loadPublicSeo()` falls back to static @vavaw/brand-config data if:
1. `CMS_DATA_SOURCE=static` (default)
2. Supabase env vars missing
3. Query error
4. No matching `seo_settings` row
5. `robots_index` or `robots_follow` are not valid booleans in the DB row

### Seed File
`supabase/seed/002_seed_seo_settings.sql` — Optional seed for homepage and `/cosmetic` pages.
> ⚠️ **WARNING:** This seed uses `ON CONFLICT DO UPDATE` — re-running it in production **will overwrite** manually edited SEO content. Only run this seed on empty or development databases.

### Scope
- Admin CRUD: `seo_settings` table only. `content_blocks` and `redirects` CRUD is a future phase.
- Public metadata: `apps/main` only. `apps/beauty` and `apps/franchise` remain static for now.
- Public apps are read-only — no admin auth on public routes.

## Phase 25: Content Blocks CRUD (Current)
Phase 25 enables admin management of `public.content_blocks` so the CMS can manage flexible page sections later.

### Admin Content Blocks CRUD

#### Permissions
| Action | Roles |
|---|---|
| Create / Update | owner, admin, editor |
| Delete | owner, admin |
| Read | all roles (including viewer) |

#### New Files
- `packages/db/src/mutations/content-blocks.ts` — `createContentBlock`, `updateContentBlock`, `deleteContentBlock`
- `apps/admin/app/content/actions.ts` — Server Actions with auth guards + `revalidatePath('/content')`
- `apps/admin/app/content/ContentBlockForm.tsx` — Client form: site_key, page_path, block_type, content (JSON with validation and example templates), sort_order, is_active
- `apps/admin/app/content/DeleteContentBlockButton.tsx` — Client delete button with confirm dialog
- `apps/admin/app/content/new/page.tsx` — Create Content Block page
- `apps/admin/app/content/[id]/edit/page.tsx` — Edit Content Block page

#### Updated Files
- `apps/admin/app/content/page.tsx` — Full CRUD table with Edit/Delete actions, mock-mode notice
- `packages/auth/src/types.ts` — Added `canManageContentBlocks(role)` and `canDeleteContentBlocks(role)`
- `apps/admin/app/settings/page.tsx` — Added Content Blocks CRUD and Rendering status rows

### Scope and Convention
- **Supported block types:** `hero`, `rich_text`, `feature_grid`, `product_highlights`, `quality_promise`, `gallery`, `faq`, `cta`, `custom_json`.
- **JSON Content Convention:** Block content is stored as unstructured JSON and requires UI forms to enforce schema at submission or on rendering.
- **Public Integration:** Public pages still use static frontend components and are NOT connected to `content_blocks` yet. This prevents breaking live apps while the CMS matures.
- **Visual Builder:** There is no visual drag-and-drop page builder. Configuration is done via JSON editor.

### Seed File
`supabase/seed/003_seed_content_blocks.sql` — Optional seed containing example blocks for `/cosmetic`.
> ℹ️ **INFO:** This seed does not use `ON CONFLICT DO UPDATE` because there is no strict unique constraint on `(site_key, page_path, block_type)` (multiple identical block types can exist on a page). Running it multiple times will duplicate the example blocks.

## Phase 26: Public Cosmetic Page Reads Content Blocks (Current)
Phase 26 integrates the `public.content_blocks` table with `apps/main/app/cosmetic/page.tsx` for dynamic rendering.

### Scope and Strategy
- **Public Cosmetic Read:** `apps/main` /cosmetic reads content blocks via `loadPublicContentBlocks` server utility using Supabase anon client (when `CMS_DATA_SOURCE=supabase`).
- **Dynamic Renderer:** A new `ContentBlockRenderer` component maps the blocks to UI sections. Supported types: `hero`, `rich_text`, `feature_grid`, `product_highlights`, `quality_promise`, `gallery`, `faq`, `cta`.
- **Safe Fallback:** If `CMS_DATA_SOURCE=static`, or if the database returns 0 blocks, or if an error occurs, the page safely falls back to the original static `CosmeticContent` component.
- **Design Parity:** The dynamic sections maintain the Framer Motion animations and styling aesthetics of the original static layout.
- **Development Feedback:** In development mode (`NODE_ENV=development`), a small corner badge indicates whether the content was loaded from 'supabase' or 'static' (fallback).
- **Other Pages:** `apps/beauty` and `apps/franchise` remain completely static for now.

### Files
- `apps/main/lib/public-cms-types.ts`
- `apps/main/lib/load-public-content-blocks.ts`
- `apps/main/components/content-block-renderer.tsx`
- `apps/main/app/cosmetic/page.tsx` (updated)

## Phase 29: Admin Users Management (Current)
Phase 29 implements the foundation for managing admin user profiles directly from the admin dashboard, restricted securely via RLS and Server Actions.

### Scope and Strategy
- **Permissions:** Only `owner` profiles can create, update, or disable `admin_profiles`. `admin` profiles can view the list of users.
- **Manual Flow:** In this phase, there is no email invite or automated Supabase Auth user creation. The Owner must manually create the user in the Supabase Dashboard, copy their Auth UID, and paste it into the admin form.
- **Deactivation vs Deletion:** Hard deletion (`DELETE`) is explicitly disabled and not implemented to prevent orphaned CMS records. Instead, `status = 'disabled'` is used to revoke access.
- **Safety Constraints:** 
  - Owners cannot disable their own accounts.
  - Owners cannot downgrade their own accounts.
  - The last active owner cannot be disabled or downgraded, preventing permanent lockout.
- **Service Role Exclusion:** The `SUPABASE_SERVICE_ROLE_KEY` remains strictly omitted from this flow to maintain security hygiene. All management is performed via the active authenticated `owner` session and RLS policies.
