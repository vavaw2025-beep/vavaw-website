# Cosmetic Vietnamese Copy Workflow

This document outlines the workflow for translating the public Cosmetic CMS copy from English to Vietnamese. The Cosmetic pages render content from two layers:

1. **Frontend Fallbacks:** Hardcoded static content in `apps/main/app/cosmetic/cosmetic-content.tsx`. This has already been updated to Vietnamese.
2. **CMS Data Source:** Live content loaded from the Supabase `content_blocks` table. Since production uses this live CMS data, we must run a migration to translate existing English blocks.

Future copy changes should be performed directly through the Admin CMS Editor.

## The Translation Architecture

We use a single centralized translation dictionary and helper utility located in the shared package `@vavaw/brand-config`.

- **Dictionary:** `packages/brand-config/src/cosmetic-vietnamese-copy-map.ts`
- **Helpers:** `packages/brand-config/src/translate-json-copy.ts`

These helpers recursively walk JSON data structures to find and translate English strings while explicitly skipping protected fields like URLs, media identifiers, and official product/brand names.

## Step-by-step Migration Workflow

Follow these steps exactly to ensure safe migration of the live CMS data.

### 1. Set Environment Variables
Before running the migration scripts, you must provide your Supabase connection parameters.

- set `SUPABASE_URL`
- set `SUPABASE_SERVICE_ROLE_KEY`

> [!WARNING]
> Apply mode requires `SUPABASE_SERVICE_ROLE_KEY`. If you use the anon key, Supabase RLS may block updates silently.

### 2. Run Dry-Run Mode
Always start by running the migration script in dry-run mode to safely preview what strings will change.

```bash
pnpm translate:cosmetic-copy --dry-run
```

Review the output in `docs/cosmetic-cms-copy-translation-report.md` to ensure only correct values are being translated.

### 3. Apply the Migration
After confirming the report is correct, execute the script with the `--apply` flag.

```bash
pnpm translate:cosmetic-copy --apply
```
The script will now verify that the rows were successfully updated and log the verified counts.

### 4. Run Audit
After applying the migration, run the audit mode to ensure no known dictionary English keys are leftover in the database for the cosmetic pages (excluding protected phrases).

```bash
pnpm translate:cosmetic-copy --audit
```

### 5. Revalidate or Redeploy
Since the cosmetic pages are statically rendered by Next.js on the server, you must clear the cache so the public site reflects the database changes.

```bash
pnpm revalidate:cosmetic
```

## QA Command Sequence

To quickly run the full translation QA workflow, execute the following commands in order:

```bash
pnpm translate:cosmetic-copy --dry-run
pnpm translate:cosmetic-copy --apply
pnpm translate:cosmetic-copy --audit
pnpm revalidate:cosmetic
```

### Check Admin Copy QA
We provide a dedicated QA tab in the Admin panel to check for any leftover English copy that may not have been caught by the dictionary.

- **URL:** `https://admin.vavaw.vn/cosmetic-page`
- **Tab:** "Nội dung còn tiếng Anh"

If you spot strings flagged as "Cần duyệt thủ công", you can either update the code dictionary and re-run the migration, or manually fix them via the CMS editor.
