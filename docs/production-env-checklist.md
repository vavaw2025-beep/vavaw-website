# Production Environment Checklist

This checklist defines the required environment variables for each Vercel project in the VAVAW monorepo.

> **CRITICAL RULE**: Do not share the `SUPABASE_SERVICE_ROLE_KEY` across projects. It must only be placed in the Admin app environment.

## 1. apps/main (vavaw.vn)
```env
NEXT_PUBLIC_SITE_URL=https://vavaw.vn
NEXT_PUBLIC_BEAUTY_URL=https://beauty.vavaw.vn
NEXT_PUBLIC_FRANCHISE_URL=https://franchise.vavaw.vn

# CMS & Supabase connection
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
CMS_DATA_SOURCE=supabase # Set to static to fallback to local JSON configuration

# Analytics Configuration
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_ANALYTICS_PROVIDER=vercel
```

## 2. apps/beauty (beauty.vavaw.vn)
```env
NEXT_PUBLIC_SITE_URL=https://beauty.vavaw.vn

# CMS & Supabase connection
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
CMS_DATA_SOURCE=supabase # Set to static to fallback to local JSON configuration

# Analytics Configuration
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_ANALYTICS_PROVIDER=vercel
```

## 3. apps/franchise (franchise.vavaw.vn)
```env
NEXT_PUBLIC_SITE_URL=https://franchise.vavaw.vn

# CMS & Supabase connection
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
CMS_DATA_SOURCE=supabase # Set to static to fallback to local JSON configuration

# Analytics Configuration
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_ANALYTICS_PROVIDER=vercel
```

## 4. apps/admin (admin.vavaw.vn)
```env
NEXT_PUBLIC_ADMIN_URL=https://admin.vavaw.vn

# Administrative Authentication Mode
NEXT_PUBLIC_ADMIN_AUTH_MODE=supabase
ADMIN_AUTH_MODE=supabase

# Supabase connection
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR_SERVICE_ROLE_KEY] # Server only, NO NEXT_PUBLIC PREFIX!

# Analytics Configuration
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_ANALYTICS_PROVIDER=vercel
```

### Phase 32 Updates: Revalidation
- Public apps (main, eauty, ranchise) require REVALIDATION_SECRET.
- Admin app requires REVALIDATION_SECRET, MAIN_REVALIDATE_URL, BEAUTY_REVALIDATE_URL, FRANCHISE_REVALIDATE_URL, and CMS_REVALIDATION_ENABLED=true.

### Lead Notifications
- [ ] EMAIL_PROVIDER (Set to 'resend' for production)
- [ ] RESEND_API_KEY
- [ ] LEAD_NOTIFICATION_TO
- [ ] LEAD_NOTIFICATION_FROM


### Monitoring
- [ ] NEXT_PUBLIC_MONITORING_ENABLED=true
- [ ] NEXT_PUBLIC_MONITORING_PROVIDER=console
- [ ] SENTRY_DSN

