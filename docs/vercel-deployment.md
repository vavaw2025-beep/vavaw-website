# Vercel Deployment Guide

The VAVAW ecosystem is a monorepo managed by Turborepo. It contains four separate Next.js applications that should be deployed as independent Vercel projects.

## Project Architecture

You must create 4 separate projects in Vercel, all linked to the same GitHub repository.

### Project 1: Main Site
- **Name:** `vavaw-main`
- **Framework Preset:** `Next.js`
- **Root Directory:** `apps/main`
- **Build Command:** `pnpm --filter @vavaw/main build`
- **Install Command:** `pnpm install`
- **Output Directory:** Next.js default (`.next`)
- **Domain:** `vavaw.vn`

### Project 2: Beauty App
- **Name:** `vavaw-beauty`
- **Framework Preset:** `Next.js`
- **Root Directory:** `apps/beauty`
- **Build Command:** `pnpm --filter @vavaw/beauty build`
- **Install Command:** `pnpm install`
- **Output Directory:** Next.js default (`.next`)
- **Domain:** `beauty.vavaw.vn`

### Project 3: Franchise App
- **Name:** `vavaw-franchise`
- **Framework Preset:** `Next.js`
- **Root Directory:** `apps/franchise`
- **Build Command:** `pnpm --filter @vavaw/franchise build`
- **Install Command:** `pnpm install`
- **Output Directory:** Next.js default (`.next`)
- **Domain:** `franchise.vavaw.vn`

### Project 4: Admin Dashboard
- **Name:** `vavaw-admin`
- **Framework Preset:** `Next.js`
- **Root Directory:** `apps/admin`
- **Build Command:** `pnpm --filter @vavaw/admin build`
- **Install Command:** `pnpm install`
- **Output Directory:** Next.js default (`.next`)
- **Domain:** `admin.vavaw.vn`

## Monorepo Build Optimization

Vercel automatically detects Turborepo. Using the `--filter` flag ensures that Vercel only rebuilds an app if its code (or a shared package it depends on) has changed.

> **Note on Environment Variables:** Refer to `docs/production-env-checklist.md` for the exact variables required per project. Do NOT share the `SUPABASE_SERVICE_ROLE_KEY` across projects.
