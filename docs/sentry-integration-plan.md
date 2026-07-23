# Phase 39: Sentry Integration

## Overview
Phase 39 introduces `@sentry/nextjs` into the VAVAW applications (`main`, `beauty`, `franchise`, `admin`), while strictly maintaining the privacy and sanitization rules defined in `@vavaw/monitoring`.

## Privacy-First Approach
The `@vavaw/monitoring` package acts as a safe bridge. It includes a `scrubber.ts` utility that intercepts all error/message metadata and redacts keys containing sensitive PII (emails, passwords, tokens, full names, phone numbers, lead messages). 

Sentry is **never** invoked directly by API routes or UI components; it is only invoked conditionally inside the `@vavaw/monitoring` wrapper.

## Conditional Sentry Initialization
To keep apps lightweight by default, Sentry is only enabled if all of the following are true:
1. `NEXT_PUBLIC_MONITORING_ENABLED=true`
2. `NEXT_PUBLIC_MONITORING_PROVIDER=sentry`
3. `SENTRY_DSN` is configured.

## Configuration Files
Each application utilizes the official App Router configuration:
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`
- `instrumentation.ts`

`next.config.mjs` is wrapped with `withSentryConfig`, but source map uploads are disabled by default to avoid breaking CI pipelines that don't have `SENTRY_AUTH_TOKEN` available.

## Environment Variables
```
# Required to enable Sentry
NEXT_PUBLIC_MONITORING_ENABLED=true
NEXT_PUBLIC_MONITORING_PROVIDER=sentry
SENTRY_DSN=your_dsn_here

# Optional: Required only if you want source map uploads during build
SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT=
```
