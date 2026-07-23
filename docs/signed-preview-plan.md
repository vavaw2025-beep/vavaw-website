# Signed Preview Mode Plan (Completed)

## Goal
Allow authorized admin users to generate short-lived signed preview links from the Admin Dashboard so they can preview draft CMS content on public apps before publishing.

## Implementation Details

### Security Constraints
- Does not expose draft content publicly without a valid signed URL.
- Uses HMAC-SHA256 tokens.
- Tokens expire in 15 minutes by default.
- Uses Next.js Draft Mode to avoid cache pollution.
- Requires `CMS_PREVIEW_SECRET` environment variable across all apps.
- Privileged `supabase-preview.ts` client uses `SUPABASE_SERVICE_ROLE_KEY` to bypass standard public read RLS, but is ONLY loaded and used when Draft Mode is enabled.

### Architecture
1. **Admin Panel**: Admin users click "Generate Signed Link" in the preview center.
2. **Server Action**: `apps/admin/app/preview/actions.ts` generates a cryptographically signed token containing app name, path, and expiry.
3. **Public API Route**: `/api/preview?token=...&path=...` verifies the token using the shared `CMS_PREVIEW_SECRET`. If valid, it enables Next.js Draft Mode (`draftMode().enable()`) and redirects to the requested path.
4. **Public Layouts/Pages**: 
   - `draftMode().isEnabled` is checked.
   - Bypasses cache by virtue of Draft Mode.
   - Shows a `PreviewBanner` with a button to exit.
   - Passes `isPreview=true` to `loadPublicHomeCms()`, `loadPublicContentBlocks()`, and `loadPublicSeo()`.
5. **Loaders**: When `isPreview` is true, loads `supabase-preview.ts` instead of `supabase-public.ts`, allowing it to query `status='draft'` and inactive blocks.
6. **Exit Preview**: `/api/preview/exit` disables Draft Mode (`draftMode().disable()`) and redirects to `/`.

### Progress
- Phase 43 is fully implemented.
