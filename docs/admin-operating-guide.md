# VAVAW Admin Operating Guide

This guide is intended for the VAVAW business owner and administrative team. It outlines how to use the Admin Dashboard as the primary control center for all VAVAW digital properties (Main, Beauty, Franchise).

## Core Concepts

The Admin dashboard manages data across multiple "sites" using a `site_key`:
- `main` (VAVAW Ecosystem Home)
- `cosmetic` (VAVAW Cosmetic Collection)
- `beauty` (VAVAW Beauty & Co.)
- `franchise` (VAVAW Franchise Opportunities)

When making changes, always ensure you select the correct `site_key` to apply updates to the right public application.

## 1. Media Library

The Media Library (`/media`) is a central repository for all images and videos used across the ecosystem.

### Uploading Launch Media (Phase 56)
Before the final domain launch, you must upload the core aesthetic assets for the platform to look complete. 

**Recommended Launch Image Sizes:**
- **Main Hero**: 2400x1600 or 2560x1440 (16:9 or 3:2), cinematic horizontal image with space for text.
- **Cosmetic Preview**: 1600x2000 or 1500x2000 (4:5 or 3:4), portrait image for main preview/card.
- **Beauty Preview**: 1600x2000 (4:5 or 3:4), spa/interior/wellness mood.
- **Franchise Preview**: 1600x2000 (4:5 or 3:4), business/luxury/architecture mood.
- **Cosmetic Product Editorial**: 1800x2400 or 1600x2000 (4:5 or 3:4), bright clean product/editorial image.
- **Cosmetic Texture Ritual**: 1600x1200 or 1600x1600 (4:3 or 1:1), texture/formula/ritual close-up.
- **Cosmetic Clean Promise**: 1600x1200 or 1600x1600 (4:3 or 1:1), ingredient/natural/clean beauty image.

1. Go to **Admin Dashboard -> Media**.
2. Set **Site Key**: Select `main` for homepage media or `cosmetic` for cosmetic media.
3. Set **Type**: Select `image`.
4. **Upload File**: Choose a high-quality, compressed `.webp` or `.jpg` file. Ensure it is under the 1.5MB target and below the 5MB hard limit. Do not upload huge raw files, private customer images, or images with unclear licensing.
5. **Alt Text**: Add descriptive text (e.g., "VAVAW cinematic beauty atmosphere").
6. **Submit**: Once uploaded, you can copy the public URL to use in the CMS (Hero, SEO, or Content). Verify the public URL opens correctly.

### Routine Media Upload:
1. Navigate to **Media** in the sidebar.
2. Click **Upload New Asset**.
3. Select the target `site_key` (e.g., `main` or `beauty`).
4. Select the file type (`Image`, `Video`, or `preview-image`).
5. Choose a file from your computer. Note the size limits (5MB for images, 50MB for videos) and allowed formats.
6. Provide an optional `Alt Text` for SEO and accessibility.
7. Click **Upload Media**. 
8. The file will be securely uploaded to the Supabase `vavaw-media` bucket and recorded in the database.

### Hero Media Workflow (Phase 56D):
1. Go to Media.
2. Upload image with `site_key = main`.
3. Use asset type `preview-image`.
4. Return to Hero.
5. Select or paste the uploaded Media Asset ID / URL in the "Background Media Asset / URL" or "Preview Media Asset / URL" field.

### How to use media in content:
1. In the Media list, find your uploaded asset.
2. Click **Copy URL**.
3. Navigate to **Hero**, **SEO**, or **Content** and paste this URL into the respective image/video fields.

## 2. Lead Management (CRM)

All inquiries from the public contact forms (Main, Beauty, Franchise) arrive in the **Leads** module.

### How to review leads:
1. Navigate to **Leads** in the sidebar.
2. Filter by `Status`, `Source App`, or search by name/email.
3. Click on a row to open the **Lead Detail** page and view the full message.

### How to update lead status:
1. From the Lead Detail page, locate the **Status** dropdown.
2. Change the status from `new` to `contacted`, `qualified`, or `archived`.
3. The system will automatically log this status change.

### How to export leads to CSV:
1. Navigate to the main **Leads** list.
2. Click **Export CSV** in the top right.
3. Only authorized Owners and Admins (`canExportLeads`) are permitted to download this file.
4. Keep exported CSVs secure and do not share PII (Personally Identifiable Information) on unencrypted channels.

## 3. Audit Logs

The **Audit Logs** module records all critical administrative actions for accountability and security.

### How to read audit logs:
1. Navigate to **Audit Logs**.
2. Review the chronological list of actions (e.g., `lead_status_updated`, `media_uploaded`, `seo_updated`).
3. Click **View Details** to see the exact data payload and which admin user performed the action.

## 4. Production Safety Rules

**What NOT to do in production:**
1. **Do not use the Service Role Key on the client side.** The `NEXT_PUBLIC_SUPABASE_ANON_KEY` is strictly for public/anonymous operations, while the Service Role key must never leave the server environment.
2. **Do not modify RLS policies directly in the Supabase UI** without updating the source code migrations in `supabase/migrations/`. 
3. **Do not switch `CMS_DATA_SOURCE` to `static`** if you expect to manage content dynamically via the Admin dashboard. `supabase` must be the active mode.
4. **Do not upload raw, uncompressed images.** Even with a 5MB limit, aim to compress images to WebP format to ensure fast load times for end users.

## 5. Required Environment Variables

To operate the Admin dashboard fully, the following variables must be configured in your Vercel deployment (`apps/admin`):

```env
CMS_DATA_SOURCE=supabase
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR_SERVICE_ROLE_KEY]
```

To render Admin CMS hero slides in production on the Main homepage (`apps/main`), the following variables must be configured:

```env
CMS_DATA_SOURCE=supabase
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
```
