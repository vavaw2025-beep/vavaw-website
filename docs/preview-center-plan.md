# Admin CMS Preview Center (Phase 33)

## Purpose
The CMS Preview Center allows `owner`, `admin`, `editor`, and `viewer` roles to securely preview how CMS-managed data will look without affecting the public apps or requiring the apps to be rebuilt. It serves as a safe staging area to view both `active` and `draft`/`inactive` content.

## Why Preview is Admin-Only For Now
Currently, the public apps are statically generated (SSG/ISR). Allowing public dynamic draft previews would require changing the public apps to support Next.js `draftMode` or dynamic rendering, which could bypass edge caching and increase database load if not carefully protected. By keeping the preview within the authenticated admin dashboard, we ensure that:
1. Public apps remain 100% fast and cacheable.
2. Draft content is strictly protected by Admin authentication and Supabase RLS.
3. We avoid exposing any preview tokens or routes to unauthenticated users.

## What Data Appears
The preview renderer bypasses the `status = 'active'` filter. It loads:
- **Business Entries**: `active`, `coming_soon`, and `draft`
- **Hero Slides**: `active` and `draft` (inactive)
- **Content Blocks**: `active` and `inactive`
- **SEO Settings**: Regardless of robots indexing status

## Supported Preview Targets
- **Main Portal Preview**: Previews hero slides and business entries for `vavaw.vn`.
- **Cosmetic Page Preview**: Previews content blocks mapped to `/cosmetic`.
- **Beauty Preview**: Previews content blocks mapped to `beauty.vavaw.vn`.
- **Franchise Preview**: Previews content blocks mapped to `franchise.vavaw.vn`.

## Future Phase: Public Signed Preview Mode
In a future phase, we may implement Next.js `draftMode` on the public apps. This would involve the admin app generating a short-lived, signed JWT and passing it to a public route (e.g., `/api/draft?token=...`). The public app would verify the token, enable `draftMode`, and temporarily bypass the cache to render the page dynamically using draft data.
