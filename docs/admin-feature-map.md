# Admin Feature Map

This document provides a clear overview of all Admin modules, explaining why they exist, what data they manage, and their current status in production.

## Why the Admin Dashboard Exists

The VAVAW Admin Dashboard serves as the central command center for the entire VAVAW ecosystem (Main, Beauty, Franchise). It unifies:
1. **CMS (Content Management System)**: Allowing owners to update marketing copy, heroes, and images without writing code.
2. **CRM/Sales Foundation**: Allowing operators to view inbound leads and update their sales pipeline status.
3. **Security & Operations**: Enforcing role-based access control (RBAC), auditing critical actions, and managing environment configurations.

## Feature Overview

| Module | Route | Purpose | Data / Tables | Primary Roles | Status | Next Improvement |
|---|---|---|---|---|---|---|
| **Dashboard** | `/` | Overview of the VAVAW ecosystem, CMS status, auth status, and business entry summary. | `business_entries`, system env status | owner/admin/editor/viewer | Active | - |
| **Business** | `/business` | Manage VAVAW business units such as Cosmetic, Beauty, and Franchise. | `business_entries` | owner/admin/editor | Active | - |
| **Hero** | `/hero` | Manage hero slides and main portal presentation. | `hero_slides`, `media_assets` | owner/admin/editor | Active | - |
| **Media** | `/media` | Upload and manage images/videos for hero, SEO, and content. | Supabase Storage, `media_assets` | owner/admin/editor | Active | upload verification required |
| **SEO** | `/seo` | Manage metadata, Open Graph images, and SEO settings. | `seo_settings` | owner/admin/editor | Active | - |
| **Redirects** | `/redirects` | Manage `/go/[slug]` routing across VAVAW ecosystem. | `redirects` | owner/admin/editor | Active | - |
| **Content** | `/content` | Manage CMS content blocks for public pages. | `content_blocks` | owner/admin/editor | Active | - |
| **Preview** | `/preview` | Preview CMS content before public usage. | `business_entries`, `hero_slides`, `content_blocks`, `seo_settings` | owner/admin/editor/viewer | Active | - |
| **Users** | `/users` | Manage internal admin users and role assignments. | `admin_profiles` | owner | Active | - |
| **Leads** | `/leads` | View submitted public leads from contact, beauty, and franchise forms. | `leads` | owner/admin/editor/viewer | Active | - |
| **Lead Detail**| `/leads/[id]` | View lead details and update lead status. | `leads` | owner/admin/editor | Active | - |
| **Audit Logs** | `/audit` | Track important admin actions for accountability. | `audit_logs` | owner/admin | Active | - |
| **Settings** | `/settings` | Show production configuration, CMS state, auth mode, storage, and revalidation status. | environment/config status | owner/admin | Active | - |

## Categorization

- **CMS Modules**: Business, Hero, Media, SEO, Content, Preview. These manage what visitors see on the public sites.
- **Sales/CRM Foundation**: Leads, Lead Detail. These manage customer inquiries and sales funnels.
- **Security/Operations**: Dashboard, Users, Audit Logs, Settings. These manage the platform's integrity and access control.
- **Pre-Launch Verification Requirements**: The **Media** module requires final production verification of file uploads to Supabase Storage before custom domain launch.
