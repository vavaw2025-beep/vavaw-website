# CMS Revalidation Plan (Phase 32)

## Why Revalidation Exists
The VAVAW ecosystem relies heavily on Static Site Generation (SSG) and Incremental Static Regeneration (ISR) to provide blazing fast load times and a highly resilient infrastructure. When data is mutated in the admin dashboard (e.g., updating a hero slide, changing a business entry), the changes need to be reflected in the public apps without requiring a full redeployment or forcing the apps to fetch data on every request. On-demand revalidation solves this by allowing the admin dashboard to securely trigger targeted cache purges on the public apps.

## Environment Variables
The following environment variables control the revalidation system:

**Server-only (DO NOT expose to client via NEXT_PUBLIC_ prefix):**
- `REVALIDATION_SECRET`: A secure, randomly generated string shared between the admin app and the public apps.

**Admin App Specific (Used to trigger revalidation):**
- `CMS_REVALIDATION_ENABLED`: Set to `true` to enable triggering revalidation (defaults to `false` for safety).
- `MAIN_REVALIDATE_URL`: Target URL for the main app (e.g., `https://vavaw.vn/api/revalidate`).
- `BEAUTY_REVALIDATE_URL`: Target URL for the beauty app (e.g., `https://beauty.vavaw.vn/api/revalidate`).
- `FRANCHISE_REVALIDATE_URL`: Target URL for the franchise app (e.g., `https://franchise.vavaw.vn/api/revalidate`).

## Secret Rules
- The `REVALIDATION_SECRET` must **never** be prefixed with `NEXT_PUBLIC_`.
- It is only read in server actions or API routes.
- The admin app uses it to authenticate POST requests to the public apps via the `Authorization: Bearer <secret>` header.
- The public apps validate the secret before accepting any revalidation commands.
- If the secret is missing or invalid, the public endpoint will reject the request with a `401 Unauthorized` or `501 Not Implemented`.

## Public App Endpoints
Each public app exposes an API route at `/api/revalidate`.
- It accepts POST requests with a JSON body: `{ "paths": ["/"], "source": "admin", "reason": "update" }`.
- It validates the secret provided in the `Authorization` or `x-revalidation-secret` header.

## Allowed Paths
To prevent arbitrary cache purging, only specific paths are permitted for revalidation:
- **apps/main**: `/`, `/cosmetic`
- **apps/beauty**: `/`
- **apps/franchise**: `/`

Requests for any other paths are safely ignored.

## Admin Mutation Triggers
Revalidation is triggered asynchronously (fire-and-forget) immediately *after* a successful database mutation in the admin app:
- **Business Actions**: Triggers revalidation on `apps/main` (`/`).
- **Hero Actions**: Triggers revalidation on `apps/main` (`/`).
- **Media Actions**: Triggers revalidation on the relevant app/path based on the `site_key`. If the `site_key` is omitted, it attempts to revalidate all known paths.
- **SEO Actions**: Triggers revalidation on the relevant app/path based on the `site_key`.
- **Content Actions**: Triggers revalidation on the relevant app/path based on the `site_key` and `page_path`.

## Failure Behavior
- Revalidation requests are made asynchronously (`.catch(console.error)`).
- A failure to revalidate will **not** block or rollback the successful database mutation.
- The admin user will still see a success message for their CRUD operation even if revalidation fails.
- Revalidation failures are logged to analytics as `cms_revalidation_failed` (if configured).

## Manual Test Commands
To manually test a revalidation endpoint locally (without exposing the real secret in logs), use:

```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Authorization: Bearer YOUR_LOCAL_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"paths":["/"], "source":"manual", "reason":"test"}'
```

## Future Options
- **Tag-based Revalidation**: Move from path-based (`revalidatePath`) to tag-based (`revalidateTag`) caching for finer-grained control.
- **Webhook-based Revalidation**: Trigger revalidation via Supabase Database Webhooks instead of directly from the Next.js server actions.
- **Queue/Retry System**: Implement a resilient queue (e.g., using Inngest or Upstash) to automatically retry failed revalidation requests.
