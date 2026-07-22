# Supabase Storage Conventions

This directory documents the Supabase Storage structure and policies for the VAVAW platform.

## Storage Bucket
- **Bucket Name:** `vavaw-media`
- **Public Access:** Enabled (public read access for image and visual assets)

## Folder Conventions
Organize files under the following folder paths based on site brand and usage context:

- `main/hero` - Main homepage background hero images
- `main/preview` - Main homepage preview thumbnails
- `main/og` - OpenGraph preview images for vavaw.vn
- `main/cosmetic` - Cosmetic landing page visual assets
- `beauty/hero` - Beauty & Co landing page hero assets
- `beauty/gallery` - Beauty & Co gallery imagery
- `franchise/hero` - Franchise landing page hero assets
- `franchise/process` - Franchise workflow & business imagery
- `shared/video` - Shared video loops (planned for future phases)

## Asset Upload Guidelines
- **Primary Media:** Image uploads only in current phase. Video uploads will be added in later phases.
- **Maximum Image File Size:** 5 MB
- **Supported Image Formats:** `image/jpeg` (`.jpg`), `image/png` (`.png`), `image/webp` (`.webp`), `image/avif` (`.avif`)
- **Filename Convention:** Generated automatically as `YYYYMMDD-[uuid].[ext]` within the target folder.
