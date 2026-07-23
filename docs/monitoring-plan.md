# Phase 38: Monitoring & Error Reporting

## Overview
Phase 38 introduced a foundational monitoring and error reporting module (`@vavaw/monitoring`) to capture frontend and backend errors silently and securely across the VAVAW ecosystem.

## Environment Variables
Ensure the following variables are configured in the root `.env` and app-specific `.env` files:
```
NEXT_PUBLIC_MONITORING_ENABLED=false
NEXT_PUBLIC_MONITORING_PROVIDER=console
SENTRY_DSN=
```

## Provider Behavior
- `console` (Default): Logs safely sanitized error objects to the server or browser console. Useful in development.
- `sentry` (Placeholder): Intended for a future phase to connect the `@sentry/nextjs` SDK once full observability is required.
- `noop`: Used as a fallback if `NEXT_PUBLIC_MONITORING_ENABLED` is false.

## Privacy & Security Rules
- **No exceptions thrown**: Monitoring operations will never throw or crash the app.
- **No PII**: Full user data, contact info, and lead messages are stripped before capture.
- **No Secrets**: API keys and tokens are never attached to metadata.
- **No Stack Traces**: Public users only see generic fallback UIs (handled via `app/error.tsx`).

## What Errors are Captured
- API Route failures (`/api/leads`).
- Admin Server Action failures (Supabase DB operations).
- Client-side rendering errors (caught by `error.tsx`).

## Health Endpoints
- Standard `/api/health` added to `apps/main`, `apps/beauty`, `apps/franchise`, and `apps/admin`.
- Returns `{ ok: true, app, timestamp, version }`.

## Future Improvements
- **Sentry Integration**: Add full Sentry SDK for distributed tracing.
- **Uptime Monitoring**: Configure Vercel/Datadog to hit `/api/health`.
- **Structured Logs**: Send logs to a centralized logging system.
- **Alert Routing**: Map critical severities to Slack or Opsgenie.
