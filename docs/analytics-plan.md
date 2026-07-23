# VAVAW Analytics Integration Plan

## Overview
A lightweight, privacy-conscious analytics foundation across the VAVAW ecosystem, encapsulating analytics logic in the `@vavaw/analytics` workspace package. The package ensures non-blocking telemetry collection without tracking Personal Identifiable Information (PII) or sensitive data.

## Configuration
Analytics is disabled by default to prevent unintentional tracking.

### Environment Variables
Configure the following in the root `.env` and all application `.env` files (`main`, `beauty`, `franchise`, `admin`):
```env
NEXT_PUBLIC_ANALYTICS_ENABLED=false
NEXT_PUBLIC_ANALYTICS_PROVIDER=console
```

### Providers
- `noop` (default if missing): Does nothing. Safe fallback.
- `console`: Logs events to the browser/server console (useful for local development).
- `vercel`: Placeholder for future Vercel Web Analytics integration.
- `custom`: Placeholder for self-hosted or other 3rd party providers.

## Privacy Rules
To maintain strict privacy compliance, the analytics client strictly enforces:
1. **No PII**: Passwords, emails, phone numbers, auth tokens, secrets, or full user objects are never collected.
2. **Safe Metadata**: Only non-identifiable identifiers like `entityId`, `entityType`, `status`, `source`, and generic `role` categories are allowed in the event payload.
3. **No Failure Cascades**: The `trackEvent` function internally catches all errors, ensuring analytics failures never block page rendering or server mutations.

## Event Dictionary
### Public Interactions (Client-Side)
Triggered across public-facing apps (`main`, `beauty`, `franchise`):
- `hero_cta_click`
- `business_card_click`
- `cosmetic_cta_click`
- `beauty_cta_click`
- `franchise_cta_click`

### Admin Actions (Server-Side)
Triggered within the `admin` app during administrative mutations:
- **Authentication**: `admin_login_success`, `admin_logout` (role-based metadata, no email).
- **Businesses**: `business_created`, `business_updated`, `business_deleted`
- **Hero**: `hero_created`, `hero_updated`, `hero_deleted`
- **Media**: `media_uploaded`, `media_deleted`
- **SEO**: `seo_created`, `seo_updated`, `seo_deleted`
- **Content Blocks**: `content_block_created`, `content_block_updated`, `content_block_deleted`

## Implementation Guidelines
- **Client-Side**: Implement tracking via standard Client Components (e.g., using `onClick` handlers wrapped in try/catch bounds automatically provided by the package).
- **Server-Side**: Fire events asynchronously (fire-and-forget) immediately after successful mutations, usually following `revalidatePath`.
